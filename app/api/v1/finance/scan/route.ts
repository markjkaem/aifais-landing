import { NextResponse } from "next/server";
import { scanInvoiceWithClaude } from "@/utils/ai-scanner";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { scanSchema } from "@/lib/security/schemas";
import { convertToCSV } from "@/utils/csv-formatter";
import { withRetryAndTimeout } from "@/lib/ai/retry";

// Field-level confidence calculation
function calculateFieldConfidence(value: any, fieldType: string): number {
    if (value === null || value === undefined || value === '') return 0;

    switch (fieldType) {
        case 'amount':
            // Check if it's a valid number format
            const numStr = String(value).replace(/[€$,.\s]/g, '');
            if (/^\d+$/.test(numStr)) return 95;
            return 70;
        case 'date':
            // Check common date patterns
            const datePatterns = [
                /^\d{2}[-/]\d{2}[-/]\d{4}$/,
                /^\d{4}[-/]\d{2}[-/]\d{2}$/,
                /^\d{1,2}\s+\w+\s+\d{4}$/
            ];
            if (datePatterns.some(p => p.test(String(value)))) return 90;
            return 65;
        case 'kvk':
            if (/^\d{8}$/.test(String(value))) return 98;
            return 60;
        case 'btw':
            if (/^NL\d{9}B\d{2}$/i.test(String(value))) return 98;
            return 55;
        case 'iban':
            if (/^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/i.test(String(value))) return 95;
            return 50;
        default:
            return value ? 85 : 0;
    }
}

// Calculate overall confidence and add field-level scores
function enrichWithConfidence(result: any): any {
    const fieldScores: Record<string, number> = {};
    const warnings: string[] = [];

    // Score each field
    if (result.companyName) fieldScores.companyName = calculateFieldConfidence(result.companyName, 'text');
    if (result.invoiceNumber) fieldScores.invoiceNumber = calculateFieldConfidence(result.invoiceNumber, 'text');
    if (result.invoiceDate) fieldScores.invoiceDate = calculateFieldConfidence(result.invoiceDate, 'date');
    if (result.dueDate) fieldScores.dueDate = calculateFieldConfidence(result.dueDate, 'date');
    if (result.totalAmount) fieldScores.totalAmount = calculateFieldConfidence(result.totalAmount, 'amount');
    if (result.vatAmount) fieldScores.vatAmount = calculateFieldConfidence(result.vatAmount, 'amount');
    if (result.subtotal) fieldScores.subtotal = calculateFieldConfidence(result.subtotal, 'amount');
    if (result.kvkNumber) fieldScores.kvkNumber = calculateFieldConfidence(result.kvkNumber, 'kvk');
    if (result.vatNumber) fieldScores.vatNumber = calculateFieldConfidence(result.vatNumber, 'btw');
    if (result.iban) fieldScores.iban = calculateFieldConfidence(result.iban, 'iban');

    // Generate warnings for low-confidence fields
    Object.entries(fieldScores).forEach(([field, score]) => {
        if (score < 70) {
            warnings.push(`Het veld '${field}' heeft een lage betrouwbaarheid (${score}%) - controleer handmatig`);
        }
    });

    // Check for missing critical fields
    if (!result.invoiceNumber) warnings.push('Factuurnummer niet gevonden');
    if (!result.totalAmount) warnings.push('Totaalbedrag niet gevonden');
    if (!result.invoiceDate) warnings.push('Factuurdatum niet gevonden');

    // Calculate overall confidence
    const scores = Object.values(fieldScores);
    const overallConfidence = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    return {
        ...result,
        confidence: {
            overall: overallConfidence,
            fields: fieldScores
        },
        warnings,
        extractedAt: new Date().toISOString()
    };
}

export const POST = createToolHandler({
    schema: scanSchema,
    pricing: { price: 0.001, currency: "SOL" },
    rateLimit: { windowMs: 60000, maxRequests: 10 },
    handler: async (body, context) => {
        const startTime = Date.now();
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

        // Voer alle scans parallel uit met retry logic
        const results = await Promise.all(
            scanJobs.map(async (job, idx) => {
                try {
                    const result = await withRetryAndTimeout(
                        async () => scanInvoiceWithClaude(job.base64, job.mimeType),
                        {
                            maxRetries: 2,
                            timeoutMs: 60000,
                            onRetry: (error, attempt) => {
                                console.log(`Invoice scan retry ${attempt} for file ${idx}:`, error.message);
                            }
                        }
                    );

                    // Enrich with confidence scores
                    const enrichedResult = enrichWithConfidence(result);

                    return {
                        success: true,
                        result: enrichedResult,
                        index: job.originalIndex,
                        processingTime: Date.now() - startTime
                    };
                } catch (err: any) {
                    return {
                        success: false,
                        error: err.message,
                        index: job.originalIndex,
                        retryable: !err.message.includes('invalid') && !err.message.includes('corrupt')
                    };
                }
            })
        );

        // Calculate batch statistics
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;
        const avgConfidence = results
            .filter(r => r.success && r.result?.confidence?.overall)
            .reduce((sum, r) => sum + r.result.confidence.overall, 0) / (successCount || 1);

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

        // Enhanced response with batch statistics
        const response = {
            results: Array.isArray(invoices) ? results : results[0],
            batchStats: {
                total: scanJobs.length,
                successful: successCount,
                failed: failCount,
                averageConfidence: Math.round(avgConfidence),
                processingTime: Date.now() - startTime
            },
            scannedAt: new Date().toISOString()
        };

        return response;
    },
});
