import { NextResponse } from "next/server";
import { scanInvoiceWithClaude } from "@/utils/ai-scanner";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { scanSchema } from "@/lib/security/schemas";
import { convertToCSV } from "@/utils/csv-formatter";

export const POST = createToolHandler({
  schema: scanSchema,
  pricing: { price: 0.001, currency: "SOL" },
  rateLimit: { windowMs: 60000, maxRequests: 10 },
  handler: async (body, context) => {
    console.log(`Payment authorized via ${context.payment.method}. Starting AI scan...`);

    const { invoiceBase64, mimeType, invoices, format } = body;

    let scanJobs: { base64: string; mimeType: string; originalIndex: number }[] = [];

    if (Array.isArray(invoices) && invoices.length > 0) {
      scanJobs = invoices.map((inv: any, idx: number) => ({
        base64: inv.base64,
        mimeType: inv.mimeType,
        originalIndex: idx
      }));
    } else if (invoiceBase64 && mimeType) {
      scanJobs = [{ base64: invoiceBase64, mimeType, originalIndex: 0 }];
    } else {
      throw new Error("Geen factuur data gevonden in request.");
    }

    // Voer alle scans parallel uit
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

    // Default return (will be wrapped in JSON by createToolHandler)
    return Array.isArray(invoices) ? results : results[0].result;
  },
});
