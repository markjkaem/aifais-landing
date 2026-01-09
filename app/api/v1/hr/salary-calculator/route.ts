import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";
import {
    calculateNetSalary,
    grossToNetMonthly,
    netToGrossMonthly,
    getTaxBracketInfo,
    TAX_BRACKETS_2024,
    TAX_BRACKETS_2025,
    ARBEIDSKORTING_2024,
    ARBEIDSKORTING_2025,
    ALGEMENE_HEFFINGSKORTING_2024,
    ALGEMENE_HEFFINGSKORTING_2025,
    ZVW_2024,
    ZVW_2025,
    RULING_30_PERCENT,
    type SalaryInput,
} from "@/lib/calculations/dutchTax2025";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const salaryCalculatorSchema = z.object({
    // Main salary input
    grossSalary: z.number().min(1, "Salaris moet minimaal €1 zijn"),
    period: z.enum(["monthly", "yearly"]).default("monthly"),
    taxYear: z.enum(["2024", "2025"]).default("2025"),

    // Employment details
    partTimePercentage: z.number().min(1).max(100).optional().default(100),
    holidayAllowanceIncluded: z.boolean().optional().default(false),
    thirteenthMonth: z.boolean().optional().default(false),

    // Pension
    pensionContributionEmployee: z.number().min(0).max(30).optional(),
    pensionContributionEmployer: z.number().min(0).max(30).optional(),

    // Special rules
    ruling30Percent: z.boolean().optional().default(false),
    under30WithMasters: z.boolean().optional().default(false),

    // Company car
    companyCar: z.object({
        catalogValue: z.number().min(0),
        isElectric: z.boolean(),
        isHydrogen: z.boolean().optional(),
    }).optional(),

    // Commute
    commuteDistance: z.number().min(0).optional(),

    // Calculation mode
    calculationMode: z.enum(["gross-to-net", "net-to-gross"]).default("gross-to-net"),

    // Free tool - no payment required
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

export const POST = createToolHandler({
    schema: salaryCalculatorSchema,
    rateLimit: { maxRequests: 60, windowMs: 60000 },
    handler: async (body) => {
        const taxYear = parseInt(body.taxYear) as 2024 | 2025;

        // Handle net-to-gross calculation
        if (body.calculationMode === "net-to-gross") {
            const targetNet = body.period === "monthly"
                ? body.grossSalary
                : body.grossSalary / 12;

            const grossMonthly = netToGrossMonthly(targetNet, taxYear);

            // Now calculate full breakdown with the gross amount
            const fullCalc = calculateNetSalary({
                grossSalary: grossMonthly,
                period: "monthly",
                taxYear,
                partTimePercentage: body.partTimePercentage,
                holidayAllowanceIncluded: body.holidayAllowanceIncluded,
                thirteenthMonth: body.thirteenthMonth,
                pensionContributionEmployee: body.pensionContributionEmployee,
                pensionContributionEmployer: body.pensionContributionEmployer,
                ruling30Percent: body.ruling30Percent,
                under30WithMasters: body.under30WithMasters,
                companyCar: body.companyCar,
                commuteDistance: body.commuteDistance,
            });

            return {
                mode: "net-to-gross",
                targetNet: body.grossSalary,
                calculatedGross: {
                    monthly: grossMonthly,
                    yearly: grossMonthly * 12,
                },
                breakdown: fullCalc,
                taxInfo: getTaxBracketInfo(fullCalc.input.grossYearly, taxYear),
                generatedAt: new Date().toISOString(),
            };
        }

        // Standard gross-to-net calculation
        const input: SalaryInput = {
            grossSalary: body.grossSalary,
            period: body.period,
            taxYear,
            partTimePercentage: body.partTimePercentage,
            holidayAllowanceIncluded: body.holidayAllowanceIncluded,
            thirteenthMonth: body.thirteenthMonth,
            pensionContributionEmployee: body.pensionContributionEmployee,
            pensionContributionEmployer: body.pensionContributionEmployer,
            ruling30Percent: body.ruling30Percent,
            under30WithMasters: body.under30WithMasters,
            companyCar: body.companyCar,
            commuteDistance: body.commuteDistance,
        };

        const result = calculateNetSalary(input);
        const taxInfo = getTaxBracketInfo(result.input.grossYearly, taxYear);

        // Build salary comparison table for different scenarios
        const scenarios = [
            { name: "Basis (zonder extras)", result },
        ];

        // Calculate with holiday allowance if not included
        if (!body.holidayAllowanceIncluded) {
            const withHoliday = calculateNetSalary({
                ...input,
                holidayAllowanceIncluded: true,
            });
            scenarios.push({
                name: "Met vakantiegeld (8%)",
                result: withHoliday,
            });
        }

        // Calculate with 13th month if not included
        if (!body.thirteenthMonth) {
            const with13th = calculateNetSalary({
                ...input,
                thirteenthMonth: true,
            });
            scenarios.push({
                name: "Met 13e maand",
                result: with13th,
            });
        }

        // Calculate 30% ruling comparison if applicable and not already active
        if (!body.ruling30Percent && result.input.grossYearly >= RULING_30_PERCENT.minSalaryRequirement2025) {
            const with30Percent = calculateNetSalary({
                ...input,
                ruling30Percent: true,
            });
            scenarios.push({
                name: "Met 30%-regeling",
                result: with30Percent,
            });
        }

        // Quick reference: different salary levels
        const salaryLadder = [2500, 3000, 3500, 4000, 5000, 6000, 7500, 10000].map(gross => ({
            grossMonthly: gross,
            netMonthly: Math.round(grossToNetMonthly(gross, taxYear) * 100) / 100,
        }));

        return {
            mode: "gross-to-net",
            input: {
                grossSalary: body.grossSalary,
                period: body.period,
                taxYear,
                partTimePercentage: body.partTimePercentage,
                holidayAllowanceIncluded: body.holidayAllowanceIncluded,
                thirteenthMonth: body.thirteenthMonth,
                pensionContributionEmployee: body.pensionContributionEmployee,
                ruling30Percent: body.ruling30Percent,
            },
            breakdown: result,
            taxInfo,
            scenarios: scenarios.map(s => ({
                name: s.name,
                netMonthly: s.result.net.monthlyNet,
                netYearly: s.result.net.yearlyNet,
                effectiveTaxRate: s.result.net.effectiveTaxRate,
            })),
            salaryLadder,
            taxRates: {
                year: taxYear,
                brackets: taxYear === 2025 ? TAX_BRACKETS_2025 : TAX_BRACKETS_2024,
                arbeidskorting: taxYear === 2025 ? ARBEIDSKORTING_2025.maxAmount : ARBEIDSKORTING_2024.maxAmount,
                algemeneHeffingskorting: taxYear === 2025 ? ALGEMENE_HEFFINGSKORTING_2025.maxAmount : ALGEMENE_HEFFINGSKORTING_2024.maxAmount,
                zvwRate: taxYear === 2025 ? ZVW_2025.rate : ZVW_2024.rate,
            },
            generatedAt: new Date().toISOString(),
        };
    },
});
