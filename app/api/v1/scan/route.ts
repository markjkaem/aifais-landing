import { NextRequest, NextResponse } from "next/server";
import { gatekeepPayment } from "@/lib/payment-gatekeeper";
import { scanInvoiceWithClaude } from "@/utils/ai-scanner";

export async function POST(req: NextRequest) {
  console.log("--- API START: /api/v1/scan ---");

  try {
    const body = await req.json();

    // =========================================================================
    // 1. PAYMENT GUARD (Checkt Solana, Stripe & Redis Replays)
    // =========================================================================
    const payment = await gatekeepPayment(body);

    if (!payment.success) {
      // Als de betaling niet geldig is (of ontbreekt), stuur direct de error terug.
      // Dit kan een 402 (Payment Required) of 409 (Double Spend) zijn.
      // @ts-ignore
      return NextResponse.json(
        { error: payment.error, ...payment.details },
        { status: payment.status }
      );
    }

    // =========================================================================
    // 2. BUSINESS LOGIC: SCAN FACTUUR
    // =========================================================================
    console.log(`Payment authorized via ${payment.method}. Starting AI scan...`);

    const { invoiceBase64, mimeType } = body;

    // Validatie input
    if (!invoiceBase64 || !mimeType) {
      return NextResponse.json({ error: "Missing invoice data" }, { status: 400 });
    }

    // Voer de AI scan uit
    const result = await scanInvoiceWithClaude(invoiceBase64, mimeType);

    // Vang specifieke AI fouten af (bijv. als het plaatje onleesbaar is)
    if (result && result.error === "UNREADABLE_DOCUMENT") {
      console.warn(`SCAN FAILED (400): ${result.message}`);
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // =========================================================================
    // 3. SUCCESS RESPONSE
    // =========================================================================
    console.log(`--- API END: Success (200) ---`);

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        method: payment.method, // "solana_x402" of "stripe_fiat"
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("--- API CRITICAL ERROR ---", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}