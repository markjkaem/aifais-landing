import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const btwCalculatorSchema = z.object({
    amount: z.number().min(0.01, "Bedrag moet minimaal €0.01 zijn"),
    vatRate: z.enum(["9", "21"]).default("21"),
    calculationType: z.enum(["addVat", "removeVat"]).default("addVat"),
    // Optional: batch calculation
    amounts: z.array(z.number().min(0.01)).optional(),
    // Free tool - no payment required
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

type BTWResult = {
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    vatRate: number;
};

function calculateBTW(amount: number, vatRate: number, addVat: boolean): BTWResult {
    const rate = vatRate / 100;

    if (addVat) {
        // Amount is net, add VAT
        const netAmount = amount;
        const vatAmount = netAmount * rate;
        const grossAmount = netAmount + vatAmount;
        return {
            netAmount: Math.round(netAmount * 100) / 100,
            vatAmount: Math.round(vatAmount * 100) / 100,
            grossAmount: Math.round(grossAmount * 100) / 100,
            vatRate,
        };
    } else {
        // Amount is gross, remove VAT
        const grossAmount = amount;
        const netAmount = grossAmount / (1 + rate);
        const vatAmount = grossAmount - netAmount;
        return {
            netAmount: Math.round(netAmount * 100) / 100,
            vatAmount: Math.round(vatAmount * 100) / 100,
            grossAmount: Math.round(grossAmount * 100) / 100,
            vatRate,
        };
    }
}

export const POST = createToolHandler({
    schema: btwCalculatorSchema,
    // Free tool - no pricing
    rateLimit: { maxRequests: 60, windowMs: 60000 },
    handler: async (body) => {
        const vatRate = parseInt(body.vatRate);
        const addVat = body.calculationType === "addVat";

        // Single calculation
        const mainResult = calculateBTW(body.amount, vatRate, addVat);

        // Batch calculation if amounts provided
        let batchResults: BTWResult[] | null = null;
        let batchTotals: BTWResult | null = null;

        if (body.amounts && body.amounts.length > 0) {
            batchResults = body.amounts.map(amt => calculateBTW(amt, vatRate, addVat));

            // Calculate totals
            const totalNet = batchResults.reduce((sum, r) => sum + r.netAmount, 0);
            const totalVat = batchResults.reduce((sum, r) => sum + r.vatAmount, 0);
            const totalGross = batchResults.reduce((sum, r) => sum + r.grossAmount, 0);

            batchTotals = {
                netAmount: Math.round(totalNet * 100) / 100,
                vatAmount: Math.round(totalVat * 100) / 100,
                grossAmount: Math.round(totalGross * 100) / 100,
                vatRate,
            };
        }

        // Also calculate with alternative rate for comparison
        const altVatRate = vatRate === 21 ? 9 : 21;
        const alternativeResult = calculateBTW(body.amount, altVatRate, addVat);

        return {
            input: {
                amount: body.amount,
                vatRate,
                calculationType: body.calculationType,
                description: addVat
                    ? `BTW ${vatRate}% toevoegen aan netto bedrag`
                    : `BTW ${vatRate}% verwijderen uit bruto bedrag`,
            },
            result: mainResult,
            alternative: {
                ...alternativeResult,
                description: `Ter vergelijking: met ${altVatRate}% BTW`,
            },
            batch: batchResults ? {
                results: batchResults,
                totals: batchTotals,
            } : null,
            formulas: {
                addVat: "Bruto = Netto × (1 + BTW%)",
                removeVat: "Netto = Bruto ÷ (1 + BTW%)",
                vatAmount: addVat
                    ? "BTW = Netto × BTW%"
                    : "BTW = Bruto - Netto",
            },
            generatedAt: new Date().toISOString(),
        };
    }
});
