import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// VAT rate information for Dutch market
export const VAT_RATES = {
    "0": {
        rate: 0,
        name: "0% BTW",
        description: "Vrijgesteld of nultarief",
        examples: ["Export buiten EU", "Medische diensten", "Onderwijs", "Financiële diensten"],
    },
    "9": {
        rate: 9,
        name: "9% BTW (laag)",
        description: "Verlaagd tarief",
        examples: ["Voedingsmiddelen", "Boeken & tijdschriften", "Medicijnen", "Hotels & accommodatie", "Culturele evenementen"],
    },
    "21": {
        rate: 21,
        name: "21% BTW (standaard)",
        description: "Standaard tarief",
        examples: ["Elektronica", "Kleding", "Dienstverlening", "Software", "Meeste goederen"],
    },
};

const btwCalculatorSchema = z.object({
    amount: z.number().min(0.01, "Bedrag moet minimaal €0.01 zijn"),
    vatRate: z.enum(["0", "9", "21"]).default("21"),
    calculationType: z.enum(["addVat", "removeVat"]).default("addVat"),

    // Reverse charge (BTW verlegd)
    reverseCharge: z.boolean().optional().default(false),
    reverseChargeReason: z.enum([
        "intra-eu-goods",      // Intracommunautaire levering goederen
        "intra-eu-services",   // Intracommunautaire diensten
        "export-outside-eu",   // Export buiten EU
        "construction",        // Bouw - verleggingsregeling
        "scrap-metal",         // Oude materialen/schroot
        "other"
    ]).optional(),

    // Optional: batch calculation
    amounts: z.array(z.number().min(0.01)).max(100).optional(),

    // Optional: item descriptions for batch
    itemDescriptions: z.array(z.string()).optional(),

    // Free tool - no payment required
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

type BTWResult = {
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    vatRate: number;
    vatRateName: string;
    reverseCharge: boolean;
    reverseChargeReason?: string;
    description?: string;
};

function calculateBTW(
    amount: number,
    vatRate: number,
    addVat: boolean,
    reverseCharge: boolean = false,
    reverseChargeReason?: string,
    description?: string
): BTWResult {
    const rate = vatRate / 100;
    const rateInfo = VAT_RATES[vatRate.toString() as keyof typeof VAT_RATES];

    // If reverse charge, VAT is 0 but we track it differently
    if (reverseCharge) {
        return {
            netAmount: Math.round(amount * 100) / 100,
            vatAmount: 0,
            grossAmount: Math.round(amount * 100) / 100,
            vatRate,
            vatRateName: "BTW verlegd",
            reverseCharge: true,
            reverseChargeReason,
            description,
        };
    }

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
            vatRateName: rateInfo?.name || `${vatRate}% BTW`,
            reverseCharge: false,
            description,
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
            vatRateName: rateInfo?.name || `${vatRate}% BTW`,
            reverseCharge: false,
            description,
        };
    }
}

const REVERSE_CHARGE_DESCRIPTIONS: Record<string, string> = {
    "intra-eu-goods": "Intracommunautaire levering van goederen (art. 138 BTW-richtlijn)",
    "intra-eu-services": "B2B diensten binnen EU (art. 44 BTW-richtlijn)",
    "export-outside-eu": "Export buiten de EU (0% BTW)",
    "construction": "Bouwsector verleggingsregeling (art. 12, lid 5 Wet OB)",
    "scrap-metal": "Levering van oud materiaal en afval (art. 199 BTW-richtlijn)",
    "other": "Overige verleggingsregeling",
};

export const POST = createToolHandler({
    schema: btwCalculatorSchema,
    // Free tool - no pricing
    rateLimit: { maxRequests: 60, windowMs: 60000 },
    handler: async (body) => {
        const vatRate = parseInt(body.vatRate);
        const addVat = body.calculationType === "addVat";
        const reverseCharge = body.reverseCharge || false;

        // Single calculation
        const mainResult = calculateBTW(
            body.amount,
            vatRate,
            addVat,
            reverseCharge,
            body.reverseChargeReason
        );

        // Batch calculation if amounts provided
        let batchResults: BTWResult[] | null = null;
        let batchTotals: {
            netAmount: number;
            vatAmount: number;
            grossAmount: number;
            vatRate: number;
            itemCount: number;
        } | null = null;

        if (body.amounts && body.amounts.length > 0) {
            batchResults = body.amounts.map((amt, idx) =>
                calculateBTW(
                    amt,
                    vatRate,
                    addVat,
                    reverseCharge,
                    body.reverseChargeReason,
                    body.itemDescriptions?.[idx]
                )
            );

            // Calculate totals
            const totalNet = batchResults.reduce((sum, r) => sum + r.netAmount, 0);
            const totalVat = batchResults.reduce((sum, r) => sum + r.vatAmount, 0);
            const totalGross = batchResults.reduce((sum, r) => sum + r.grossAmount, 0);

            batchTotals = {
                netAmount: Math.round(totalNet * 100) / 100,
                vatAmount: Math.round(totalVat * 100) / 100,
                grossAmount: Math.round(totalGross * 100) / 100,
                vatRate,
                itemCount: batchResults.length,
            };
        }

        // Calculate all rate alternatives for comparison
        const alternatives = Object.entries(VAT_RATES)
            .filter(([key]) => key !== body.vatRate)
            .map(([key, info]) => ({
                ...calculateBTW(body.amount, info.rate, addVat, false),
                description: info.description,
                examples: info.examples,
            }));

        // Reverse charge info if applicable
        const reverseChargeInfo = reverseCharge ? {
            active: true,
            reason: body.reverseChargeReason || "other",
            reasonDescription: body.reverseChargeReason
                ? REVERSE_CHARGE_DESCRIPTIONS[body.reverseChargeReason]
                : REVERSE_CHARGE_DESCRIPTIONS["other"],
            note: "BTW wordt niet in rekening gebracht. De afnemer is verantwoordelijk voor de BTW-afdracht.",
            invoiceText: getInvoiceText(body.reverseChargeReason),
        } : null;

        return {
            input: {
                amount: body.amount,
                vatRate,
                vatRateInfo: VAT_RATES[body.vatRate as keyof typeof VAT_RATES],
                calculationType: body.calculationType,
                reverseCharge,
                description: reverseCharge
                    ? "BTW verlegd - geen BTW in rekening gebracht"
                    : addVat
                        ? `BTW ${vatRate}% toevoegen aan netto bedrag`
                        : `BTW ${vatRate}% verwijderen uit bruto bedrag`,
            },
            result: mainResult,
            alternatives,
            reverseChargeInfo,
            batch: batchResults ? {
                results: batchResults,
                totals: batchTotals,
            } : null,
            vatRatesReference: VAT_RATES,
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

function getInvoiceText(reason?: string): string {
    switch (reason) {
        case "intra-eu-goods":
            return "BTW verlegd - Intracommunautaire levering (0% BTW)";
        case "intra-eu-services":
            return "BTW verlegd - Art. 44 BTW-richtlijn";
        case "export-outside-eu":
            return "Export buiten de EU - 0% BTW";
        case "construction":
            return "BTW verlegd - Verleggingsregeling bouw";
        case "scrap-metal":
            return "BTW verlegd - Art. 199 BTW-richtlijn";
        default:
            return "BTW verlegd naar afnemer";
    }
}
