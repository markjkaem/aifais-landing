import { NextRequest, NextResponse } from "next/server";
import { gatekeepPayment } from "@/lib/payment-gatekeeper";
import { scanInvoiceWithClaude } from "@/utils/ai-scanner";
import { withApiGuard } from "@/lib/security/api-guard";
import { scanSchema } from "@/lib/security/schemas";
import { convertToCSV } from "@/utils/csv-formatter";

export const POST = withApiGuard(async (req, body: any) => {
  console.log("--- API START: /api/v1/scan ---");

  try {
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
    // 2. BUSINESS LOGIC: SCAN FACTUUR (Single of Bulk)
    // =========================================================================
    console.log(`Payment authorized via ${payment.method}. Starting AI scan...`);

    const { invoiceBase64, mimeType, invoices, format } = body;

    let scanJobs: { base64: string; mimeType: string; originalIndex: number }[] = [];

    if (Array.isArray(invoices) && invoices.length > 0) {
      scanJobs = invoices.map((inv: any, idx: number) => ({ base64: inv.base64, mimeType: inv.mimeType, originalIndex: idx }));
    } else if (invoiceBase64 && mimeType) {
      scanJobs = [{ base64: invoiceBase64, mimeType, originalIndex: 0 }];
    } else {
      return NextResponse.json({ error: "Geen factuur data gevonden in request." }, { status: 400 });
    }

    // Voer alle scans parallel uit (Claude kan dit aan, en het is sneller voor de user)
    const results = await Promise.all(
      scanJobs.map(async (job) => {
        try {
          const result = await scanInvoiceWithClaude(job.base64, job.mimeType);
          return { success: true, result };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      })
    );

    // =========================================================================
    // 3. SUCCESS RESPONSE
    // =========================================================================
    console.log(`--- API END: Success (Processed ${results.length} scans) ---`);

    // CSV Export Logic
    if (format === 'csv') {
      const csvData = convertToCSV(results);
      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="invoices-${Date.now()}.csv"`
        }
      });
    }

    // Default JSON Response
    return NextResponse.json({
      success: true,
      data: Array.isArray(invoices) ? results : results[0].result, // Return array for bulk, single object for legacy
      meta: {
        method: payment.method,
        count: results.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("--- API CRITICAL ERROR ---", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}, {
  schema: scanSchema,
  rateLimit: { windowMs: 60000, maxRequests: 10 } // 10 per minuut per IP
});
