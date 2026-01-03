import { NextRequest, NextResponse } from "next/server";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import Stripe from "stripe";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Zorg dat deze paden kloppen met jouw bestandsstructuur!
import { gatekeepPayment } from "@/lib/payment-gatekeeper";
import { sanitizeObject } from "@/lib/sanitize";
// Of als je ze in utils hebt staan: import { checkPayment, markPaymentUsed } from "@/utils/x402-guard";

// Helper voor valuta
const formatCurrency = (amount: number) => `EUR ${amount.toFixed(2)}`;

export async function POST(req: NextRequest) {
  console.log("--- API START: /api/agent/create-invoice ---");

  try {
    const rawBody = await req.json();
    const body = sanitizeObject(rawBody);
    const {
        signature,
        stripeSessionId,
        ownName,
        clientName,
        invoiceNumber,
        items,
        notes
    } = body;

    let paymentMethod = "";

    console.log(`Incoming Data: Signature=${!!signature}, SessionID=${!!stripeSessionId}`);

    // =========================================================================
    // 1. PAYMENT CHECK (Eén regel code!)
    const payment = await gatekeepPayment(body);
    
    // Als betaling mislukt is, stuur direct de error terug die uit de gatekeeper komt
    if (!payment.success) {
      // @ts-ignore (details kan undefined zijn, maar dat mag in json)
      return NextResponse.json(
          { error: payment.error, ...payment.details }, 
          { status: payment.status }
      );
    }

    // =========================================================================
    // 2. UITVOEREN: PDF GENERATIE (Server Side)
    // =========================================================================

    // Validatie van input voor PDF
    if (!items || !Array.isArray(items)) {
        return NextResponse.json({ error: "Missing required invoice items." }, { status: 400 });
    }

    const doc = new jsPDF();
    const primaryColor = [48, 102, 190] as [number, number, number]; // #3066be casten voor TS

    // --- Header ---
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("FACTUUR", 140, 25);

    // --- Meta Info ---
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Factuurnr: ${invoiceNumber || 'CONCEPT'}`, 140, 35);
    doc.text(`Datum: ${new Date().toISOString().split('T')[0]}`, 140, 40);

    // --- Adressen ---
    doc.setFontSize(11);
    doc.setTextColor(0);
    
    // Links: Eigen bedrijf
    doc.setFont("helvetica", "bold");
    doc.text(ownName || "Mijn Bedrijf", 14, 50);
    doc.setFont("helvetica", "normal");
    
    // Rechts: Klant
    doc.setFont("helvetica", "bold");
    doc.text("Factureren aan:", 140, 50);
    doc.setFont("helvetica", "normal");
    doc.text(clientName || "Klant", 140, 56);

    // --- Berekeningen ---
    let subtotal = 0;
    
    // Data voor autotable voorbereiden
    const tableRows = items.map((item: any) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice || item.price) || 0; // Support beide veldnamen
      const total = qty * price;
      subtotal += total;
      
      return [
        item.description || "Dienst/Product",
        qty.toString(),
        formatCurrency(price),
        "21%", // Hardcoded BTW voor nu, kan dynamisch
        formatCurrency(total),
      ];
    });

    const vatAmount = subtotal * 0.21; 
    const totalAmount = subtotal + vatAmount;

    // --- Tabel ---
    autoTable(doc, {
      startY: 70,
      head: [["Omschrijving", "Aantal", "Prijs", "BTW", "Totaal"]],
      body: tableRows,
      headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
    });

    // --- Totalen ---
    // @ts-ignore: lastAutoTable bestaat wel op doc object na plugin load
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const labelX = 130;
    const valueX = 190;

    doc.text(`Subtotaal:`, labelX, finalY);
    doc.text(formatCurrency(subtotal), valueX, finalY, { align: "right" });

    doc.text(`BTW (21%):`, labelX, finalY + 6);
    doc.text(formatCurrency(vatAmount), valueX, finalY + 6, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.text(`TOTAAL:`, labelX, finalY + 12);
    doc.text(formatCurrency(totalAmount), valueX, finalY + 12, { align: "right" });

    // --- Notes / Footer ---
    if (notes) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(notes, 14, 280);
    } else {
        // Standaard footer als er geen notes zijn
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Gegenereerd via AI Agent - Betaald met ${paymentMethod}`, 14, 290);
    }

    // --- Output Converteren naar Base64 ---
    const pdfArrayBuffer = doc.output("arraybuffer");
    const base64Pdf = Buffer.from(pdfArrayBuffer).toString("base64");

    // =========================================================================
    // 3. RESPONSE
    // =========================================================================
    console.log(`--- API END: Success (200) via ${paymentMethod} ---`);
    
    return NextResponse.json({
      success: true,
      message: "Factuur succesvol gegenereerd.",
      fileName: `factuur_${invoiceNumber || 'concept'}.pdf`,
      mimeType: "application/pdf",
      base64: base64Pdf, 
      meta: { method: paymentMethod, total: totalAmount }
    });

  } catch (error: any) {
    // Specifieke error handling voor Replay Attacks
    if (error.message && error.message.includes("Transaction signature already used")) {
          console.warn(`Double Spend detected (409): ${error.message}`);
          return NextResponse.json({ error: error.message }, { status: 409 });
    }
    
    console.error(`--- API END: CRITICAL ERROR (500) --- \nError: ${error.message}`);
    return NextResponse.json({ error: "Internal Server Error during invoice generation." }, { status: 500 });
  }
}