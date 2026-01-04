import { NextRequest, NextResponse } from "next/server";
import { withApiGuard } from "@/lib/security/api-guard";
import { z } from "zod";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { gatekeepPayment } from "@/lib/payment-gatekeeper";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const invoiceItemSchema = z.object({
    id: z.string().optional(),
    description: z.string(),
    quantity: z.number(),
    price: z.number(),
    vatRate: z.number(),
});

const invoiceSchema = z.object({
    ownName: z.string(),
    ownAddress: z.string(),
    ownKvk: z.string().optional(),
    ownIban: z.string().optional(),
    ownLogo: z.string().nullable().optional(),
    clientName: z.string(),
    clientAddress: z.string(),
    invoiceNumber: z.string(),
    invoiceDate: z.string(),
    expiryDate: z.string(),
    discountPercentage: z.number().default(0),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema),
});

export const POST = withApiGuard(async (req, body: any) => {
    console.log("--- API START: /api/v1/finance/create-invoice ---");

    try {
        // Technically this tool is free, but we can rate limit or prevent abuse
        // We'll call gatekeepPayment if we want to enforce payments later, 
        // but for now strictly rate-limiting via withApiGuard is mostly what we need.
        // However, if we want to be consistent:
        // const payment = await gatekeepPayment(body, 0); // 0 cost

        const pdfBytes = await generateInvoicePDF(body);

        return NextResponse.json({
            success: true,
            data: {
                pdfBase64: Buffer.from(pdfBytes).toString("base64"),
            },
        });
    } catch (error: any) {
        console.error("Invoice generation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}, {
    schema: invoiceSchema,
    rateLimit: { maxRequests: 20, windowMs: 60000 },
});

async function generateInvoicePDF(data: any): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const primaryColor = rgb(0.06, 0.73, 0.50); // emerald-500 (#10b981 approx)

    let y = height - 50;

    // 1. LOGO & HEADER
    if (data.ownLogo) {
        try {
            const logoImage = await pdfDoc.embedJpg(data.ownLogo);
            const logoDims = logoImage.scale(0.3);

            let logoWidth = logoDims.width;
            let logoHeight = logoDims.height;
            const maxLogoWidth = 100;
            if (logoWidth > maxLogoWidth) {
                const scaleFactor = maxLogoWidth / logoWidth;
                logoWidth *= scaleFactor;
                logoHeight *= scaleFactor;
            }

            page.drawImage(logoImage, {
                x: 50,
                y: y - logoHeight,
                width: logoWidth,
                height: logoHeight,
            });
        } catch (e) {
            console.error("Logo embed failed:", e);
        }
    }

    // FACTUUR Title
    page.drawText("FACTUUR", {
        x: width - 200,
        y: y - 20,
        size: 28,
        font: fontBold,
        color: primaryColor,
    });

    // Metadata (Top Right)
    let metaY = y - 50;
    const metaX = width - 200;

    // Helper to draw metadata lines
    const drawMeta = (label: string, value: string, currentY: number) => {
        page.drawText(label, { x: metaX, y: currentY, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        page.drawText(value, { x: metaX + 80, y: currentY, size: 10, font: fontBold });
    };

    drawMeta("Factuurnr:", data.invoiceNumber, metaY);
    drawMeta("Datum:", data.invoiceDate, metaY - 15);
    drawMeta("Vervaldatum:", data.expiryDate, metaY - 30);

    // 2. ADDRESSES (Lower sections)
    // Start addresses well below the header/metadata area
    y = height - 180;
    const startY = y;

    // Own Address (Left)
    page.drawText(data.ownName || "Jouw Bedrijf", { x: 50, y, size: 12, font: fontBold });
    y -= 15;
    page.drawText(data.ownAddress || "", { x: 50, y, size: 10, font });
    y -= 15;
    if (data.ownKvk) {
        page.drawText(`KvK: ${data.ownKvk}`, { x: 50, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        y -= 12;
    }
    if (data.ownIban) {
        page.drawText(`IBAN: ${data.ownIban}`, { x: 50, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    }

    // Client Address (Right)
    // Align with the "Own Address" vertical start
    const clientX = 350;
    let clientY = startY;

    page.drawText("Factureren aan:", { x: clientX, y: clientY, size: 10, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
    clientY -= 20;
    page.drawText(data.clientName || "Klant Naam", { x: clientX, y: clientY, size: 12, font: fontBold });
    clientY -= 15;
    const clientAddressLines = data.clientAddress ? data.clientAddress.split('\n') : [""];
    for (const line of clientAddressLines) {
        page.drawText(line, { x: clientX, y: clientY, size: 10, font });
        clientY -= 12;
    }

    // 3. TABLE
    // Reset Y to below the lowest address block
    y = Math.min(y, clientY) - 50;

    // Header bg
    page.drawRectangle({
        x: 50,
        y: y - 5,
        width: width - 100,
        height: 25,
        color: primaryColor,
    });

    // Headers & Columns
    // Define alignment points
    const col1X = 50;   // Description (Left)
    const col2X = 350;  // Quantity (Right aligned to this point)
    const col3X = 420;  // Price (Right aligned to this point)
    const col4X = 470;  // VAT (Right aligned to this point)
    const col5X = 545;  // Total (Right aligned to this point)

    const headerY = y + 2; // Text position inside rect

    // Helper for right alignment
    const drawTextRight = (text: string, x: number, y: number, size: number, font: any, color: any = rgb(0, 0, 0)) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        page.drawText(text, { x: x - textWidth, y, size, font, color });
    };

    // Helper for center alignment
    const drawTextCenter = (text: string, centerX: number, y: number, size: number, font: any, color: any = rgb(0, 0, 0)) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        page.drawText(text, { x: centerX - (textWidth / 2), y, size, font, color });
    };

    page.drawText("Omschrijving", { x: col1X + 10, y: headerY + 5, size: 10, font: fontBold, color: rgb(1, 1, 1) });
    drawTextRight("Aantal", col2X, headerY + 5, 10, fontBold, rgb(1, 1, 1));
    drawTextRight("Prijs", col3X, headerY + 5, 10, fontBold, rgb(1, 1, 1));
    drawTextRight("BTW", col4X, headerY + 5, 10, fontBold, rgb(1, 1, 1));
    drawTextRight("Totaal", col5X, headerY + 5, 10, fontBold, rgb(1, 1, 1));

    y -= 25;

    let subtotal = 0;
    const vatBreakdown: Record<number, number> = {};

    for (const item of data.items) {
        const lineTotal = item.quantity * item.price;
        subtotal += lineTotal;

        // Calc VAT
        const discountFactor = 1 - (data.discountPercentage / 100);
        const taxableAmount = lineTotal * discountFactor;
        const vatAmount = taxableAmount * (item.vatRate / 100);

        vatBreakdown[item.vatRate] = (vatBreakdown[item.vatRate] || 0) + vatAmount;

        // Truncate description if too long
        const descText = item.description.length > 45 ? item.description.substring(0, 42) + "..." : item.description;

        page.drawText(descText, { x: col1X + 10, y, size: 10, font });
        drawTextRight(item.quantity.toString(), col2X, y, 10, font);
        drawTextRight(`EUR ${item.price.toFixed(2)}`, col3X, y, 10, font);
        drawTextRight(`${item.vatRate}%`, col4X, y, 10, font);
        drawTextRight(`EUR ${lineTotal.toFixed(2)}`, col5X, y, 10, font);

        // Underline
        page.drawLine({
            start: { x: 50, y: y - 5 },
            end: { x: width - 50, y: y - 5 },
            thickness: 0.5,
            color: rgb(0.9, 0.9, 0.9),
        });

        y -= 25;
        if (y < 100) {
            page = pdfDoc.addPage([595, 842]);
            y = height - 50;
        }
    }

    // 4. TOTALS
    const discountAmount = subtotal * (data.discountPercentage / 100);
    const totalVat = Object.values(vatBreakdown).reduce((acc, v) => acc + v, 0);
    const grandTotal = (subtotal - discountAmount) + totalVat;

    y -= 10;
    const labelX = 350;
    const valueRightX = 545; // Align with Total column

    const drawTotalLine = (label: string, value: string, bold = false) => {
        page.drawText(label, { x: labelX, y, size: 10, font: bold ? fontBold : font });
        // Right align value
        const valFont = bold ? fontBold : font;
        const valWidth = valFont.widthOfTextAtSize(value, 10);
        page.drawText(value, { x: valueRightX - valWidth, y, size: 10, font: valFont, color: bold ? primaryColor : rgb(0, 0, 0) });
        y -= 15;
    };

    drawTotalLine("Subtotaal:", `EUR ${subtotal.toFixed(2)}`);
    if (data.discountPercentage > 0) {
        drawTotalLine(`Korting (${data.discountPercentage}%):`, `- EUR ${discountAmount.toFixed(2)}`);
    }

    for (const [rate, amount] of Object.entries(vatBreakdown)) {
        if (amount > 0) {
            drawTotalLine(`BTW (${rate}%):`, `EUR ${amount.toFixed(2)}`);
        }
    }

    y -= 5;
    page.drawLine({ start: { x: labelX, y: y + 10 }, end: { x: width - 50, y: y + 10 }, thickness: 1, color: rgb(0, 0, 0) });

    // TOTAAL line
    // Use drawTotalLine logic but manual for color/size
    const totalLabel = "TOTAAL:";
    const totalValue = `EUR ${grandTotal.toFixed(2)}`;

    page.drawText(totalLabel, { x: labelX, y, size: 12, font: fontBold, color: primaryColor });
    const totalValWidth = fontBold.widthOfTextAtSize(totalValue, 12);
    page.drawText(totalValue, { x: valueRightX - totalValWidth, y, size: 12, font: fontBold, color: primaryColor });

    // 5. FOOTER / NOTES
    if (data.notes) {
        page.drawText(data.notes, {
            x: 50,
            y: 50,
            size: 9,
            font,
            color: rgb(0.4, 0.4, 0.4),
            maxWidth: width - 100,
        });
    }

    return await pdfDoc.save();
}
