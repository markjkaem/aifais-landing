/**
 * Dutch Tax Calculation Library 2024/2025
 * Comprehensive salary calculations for the Netherlands
 *
 * Sources:
 * - Belastingdienst (https://www.belastingdienst.nl)
 * - Rijksoverheid (https://www.rijksoverheid.nl)
 */

// =============================================================================
// TAX BRACKETS (Belastingschijven)
// =============================================================================

export const TAX_BRACKETS_2024 = [
    { min: 0, max: 75518, rate: 0.3693 },
    { min: 75518, max: Infinity, rate: 0.495 },
];

export const TAX_BRACKETS_2025 = [
    { min: 0, max: 38441, rate: 0.3593 },
    { min: 38441, max: 76817, rate: 0.3748 },
    { min: 76817, max: Infinity, rate: 0.495 },
];

// =============================================================================
// ARBEIDSKORTING (Employment Tax Credit) - Progressive calculation
// =============================================================================

export const ARBEIDSKORTING_2024 = {
    maxAmount: 5532,
    phases: [
        { min: 0, max: 11491, rate: 0.08425, base: 0 },
        { min: 11491, max: 24821, rate: 0.31433, base: 968 },
        { min: 24821, max: 39958, rate: 0.02471, base: 5158 },
        { min: 39958, max: 124935, rate: -0.06510, base: 5532 },
        { min: 124935, max: Infinity, rate: 0, base: 0 },
    ],
};

export const ARBEIDSKORTING_2025 = {
    maxAmount: 5599,
    phases: [
        { min: 0, max: 11613, rate: 0.08231, base: 0 },
        { min: 11613, max: 25050, rate: 0.30810, base: 956 },
        { min: 25050, max: 40454, rate: 0.02490, base: 5095 },
        { min: 40454, max: 128810, rate: -0.06337, base: 5599 },
        { min: 128810, max: Infinity, rate: 0, base: 0 },
    ],
};

// =============================================================================
// ALGEMENE HEFFINGSKORTING (General Tax Credit)
// =============================================================================

export const ALGEMENE_HEFFINGSKORTING_2024 = {
    maxAmount: 3362,
    phaseOutStart: 24813,
    phaseOutEnd: 75518,
    phaseOutRate: 0.06510,
};

export const ALGEMENE_HEFFINGSKORTING_2025 = {
    maxAmount: 3068,
    phaseOutStart: 25070,
    phaseOutEnd: 76817,
    phaseOutRate: 0.05926,
};

// =============================================================================
// ZVW PREMIE (Healthcare Insurance Contribution)
// =============================================================================

export const ZVW_2024 = {
    rate: 0.0657, // 6.57%
    maxIncome: 68641, // Maximum income for ZVW calculation
};

export const ZVW_2025 = {
    rate: 0.0657, // 6.57%
    maxIncome: 71628, // Maximum income for ZVW calculation
};

// =============================================================================
// 30% RULING (30%-regeling)
// =============================================================================

export const RULING_30_PERCENT = {
    taxFreePercentage: 0.30, // 30% of gross is tax-free
    minSalaryRequirement2024: 46107, // Minimum taxable salary
    minSalaryRequirement2025: 46660, // Minimum taxable salary
    minSalaryUnder30_2024: 35048, // For employees under 30 with master's degree
    minSalaryUnder30_2025: 35468,
};

// =============================================================================
// AUTO VAN DE ZAAK (Company Car - Bijtelling)
// =============================================================================

export const BIJTELLING_2024 = {
    standardRate: 0.22, // 22% of catalog value
    electricRate: 0.16, // 16% for electric vehicles
    electricThreshold: 30000, // 16% up to €30k, then 22%
    hydrogenRate: 0.16, // 16% for hydrogen vehicles
    solarRate: 0.16, // 16% for solar vehicles
};

export const BIJTELLING_2025 = {
    standardRate: 0.22,
    electricRate: 0.17, // Increased to 17% in 2025
    electricThreshold: 30000,
    hydrogenRate: 0.17,
    solarRate: 0.17,
};

// =============================================================================
// REISKOSTENVERGOEDING (Commuting Allowance)
// =============================================================================

export const REISKOSTEN_2024 = {
    taxFreePerKm: 0.23, // €0.23 per km tax-free
    maxDays: 214, // Standard working days per year
};

export const REISKOSTEN_2025 = {
    taxFreePerKm: 0.23,
    maxDays: 214,
};

// =============================================================================
// TYPES
// =============================================================================

export interface SalaryInput {
    grossSalary: number;          // Gross salary amount
    period: "monthly" | "yearly"; // Payment period
    partTimePercentage?: number;  // Part-time percentage (1-100)
    holidayAllowanceIncluded?: boolean; // Vakantiegeld inbegrepen?
    thirteenthMonth?: boolean;    // 13e maand?
    pensionContributionEmployee?: number; // Pension % by employee
    pensionContributionEmployer?: number; // Pension % by employer
    ruling30Percent?: boolean;    // 30% ruling active?
    under30WithMasters?: boolean; // Under 30 with master's degree?
    companyCar?: {
        catalogValue: number;
        isElectric: boolean;
        isHydrogen?: boolean;
    };
    commuteDistance?: number;     // One-way commute in km
    taxYear: 2024 | 2025;
}

export interface SalaryBreakdown {
    // Input echo
    input: {
        grossYearly: number;
        grossMonthly: number;
        period: "monthly" | "yearly";
        taxYear: number;
    };

    // Gross components
    gross: {
        baseSalary: number;
        holidayAllowance: number;
        thirteenthMonth: number;
        bijtelling: number;
        totalGross: number;
    };

    // Deductions
    deductions: {
        loonheffing: number;
        pensionEmployee: number;
        zvwPremie: number;
        totalDeductions: number;
    };

    // Tax credits
    taxCredits: {
        arbeidskorting: number;
        algemeneHeffingskorting: number;
        totalCredits: number;
    };

    // Net result
    net: {
        yearlyNet: number;
        monthlyNet: number;
        effectiveTaxRate: number;
    };

    // Extra info
    extras: {
        reiskostenvergoeding?: number;
        ruling30Benefit?: number;
        pensionEmployer?: number;
    };

    // Comparison (if 30% ruling)
    comparison?: {
        withRuling: { netMonthly: number; netYearly: number };
        withoutRuling: { netMonthly: number; netYearly: number };
        benefit: number;
    };
}

// =============================================================================
// CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculate arbeidskorting (employment tax credit)
 */
export function calculateArbeidskorting(income: number, year: 2024 | 2025): number {
    const config = year === 2025 ? ARBEIDSKORTING_2025 : ARBEIDSKORTING_2024;

    for (const phase of config.phases) {
        if (income >= phase.min && income < phase.max) {
            if (phase.rate > 0) {
                return Math.min(
                    phase.base + (income - phase.min) * phase.rate,
                    config.maxAmount
                );
            } else if (phase.rate < 0) {
                // Phase-out
                return Math.max(
                    phase.base + (income - phase.min) * phase.rate,
                    0
                );
            }
            return phase.base;
        }
    }
    return 0;
}

/**
 * Calculate algemene heffingskorting (general tax credit)
 */
export function calculateAlgemeneHeffingskorting(income: number, year: 2024 | 2025): number {
    const config = year === 2025 ? ALGEMENE_HEFFINGSKORTING_2025 : ALGEMENE_HEFFINGSKORTING_2024;

    if (income <= config.phaseOutStart) {
        return config.maxAmount;
    }

    if (income >= config.phaseOutEnd) {
        return 0;
    }

    const phaseOutAmount = (income - config.phaseOutStart) * config.phaseOutRate;
    return Math.max(config.maxAmount - phaseOutAmount, 0);
}

/**
 * Calculate loonheffing (income tax) before credits
 */
export function calculateLoonheffing(taxableIncome: number, year: 2024 | 2025): number {
    const brackets = year === 2025 ? TAX_BRACKETS_2025 : TAX_BRACKETS_2024;
    let tax = 0;

    for (const bracket of brackets) {
        if (taxableIncome <= bracket.min) break;

        const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
        tax += taxableInBracket * bracket.rate;
    }

    return tax;
}

/**
 * Calculate ZVW premie
 */
export function calculateZVW(income: number, year: 2024 | 2025): number {
    const config = year === 2025 ? ZVW_2025 : ZVW_2024;
    const cappedIncome = Math.min(income, config.maxIncome);
    return cappedIncome * config.rate;
}

/**
 * Calculate bijtelling for company car
 */
export function calculateBijtelling(
    catalogValue: number,
    isElectric: boolean,
    year: 2024 | 2025,
    isHydrogen: boolean = false
): number {
    const config = year === 2025 ? BIJTELLING_2025 : BIJTELLING_2024;

    if (isElectric || isHydrogen) {
        if (catalogValue <= config.electricThreshold) {
            return catalogValue * config.electricRate;
        }
        // Above threshold: lower rate on first €30k, standard rate on rest
        return (
            config.electricThreshold * config.electricRate +
            (catalogValue - config.electricThreshold) * config.standardRate
        );
    }

    return catalogValue * config.standardRate;
}

/**
 * Calculate tax-free commuting allowance
 */
export function calculateReiskosten(
    distanceKm: number,
    year: 2024 | 2025,
    workDaysPerYear: number = 214
): number {
    const config = year === 2025 ? REISKOSTEN_2025 : REISKOSTEN_2024;
    // Round trip * work days * rate per km
    return distanceKm * 2 * workDaysPerYear * config.taxFreePerKm;
}

/**
 * Main salary calculation function
 */
export function calculateNetSalary(input: SalaryInput): SalaryBreakdown {
    const year = input.taxYear;
    const partTimeFactor = (input.partTimePercentage ?? 100) / 100;

    // Convert to yearly amounts
    let grossYearly = input.period === "monthly"
        ? input.grossSalary * 12
        : input.grossSalary;

    // Apply part-time factor
    grossYearly *= partTimeFactor;

    // Holiday allowance (vakantiegeld) - 8% if not included
    const holidayAllowance = input.holidayAllowanceIncluded
        ? 0
        : grossYearly * 0.08;

    // 13th month if applicable
    const thirteenthMonth = input.thirteenthMonth
        ? grossYearly / 12
        : 0;

    // Company car bijtelling
    let bijtelling = 0;
    if (input.companyCar) {
        bijtelling = calculateBijtelling(
            input.companyCar.catalogValue,
            input.companyCar.isElectric,
            year,
            input.companyCar.isHydrogen
        );
    }

    // Total gross income for tax purposes
    let totalGrossForTax = grossYearly + holidayAllowance + thirteenthMonth + bijtelling;

    // 30% ruling reduces taxable income
    let ruling30Benefit = 0;
    let taxableIncome = totalGrossForTax;

    if (input.ruling30Percent) {
        const minSalary = input.under30WithMasters
            ? (year === 2025 ? RULING_30_PERCENT.minSalaryUnder30_2025 : RULING_30_PERCENT.minSalaryUnder30_2024)
            : (year === 2025 ? RULING_30_PERCENT.minSalaryRequirement2025 : RULING_30_PERCENT.minSalaryRequirement2024);

        if (grossYearly >= minSalary) {
            ruling30Benefit = totalGrossForTax * RULING_30_PERCENT.taxFreePercentage;
            taxableIncome = totalGrossForTax * 0.70; // Only 70% is taxable
        }
    }

    // Pension contribution (employee portion reduces taxable income)
    const pensionEmployee = input.pensionContributionEmployee
        ? grossYearly * (input.pensionContributionEmployee / 100)
        : 0;

    taxableIncome -= pensionEmployee;

    // Calculate taxes
    const loonheffingBeforeCredits = calculateLoonheffing(taxableIncome, year);
    const zvwPremie = calculateZVW(taxableIncome, year);

    // Calculate tax credits
    const arbeidskorting = calculateArbeidskorting(taxableIncome, year);
    const algemeneHeffingskorting = calculateAlgemeneHeffingskorting(taxableIncome, year);
    const totalCredits = arbeidskorting + algemeneHeffingskorting;

    // Final loonheffing after credits
    const loonheffing = Math.max(loonheffingBeforeCredits - totalCredits, 0);

    // Total deductions
    const totalDeductions = loonheffing + pensionEmployee + zvwPremie;

    // Net calculations (exclude bijtelling from actual pay - it's a notional benefit)
    const totalGrossActualPay = grossYearly + holidayAllowance + thirteenthMonth;
    const yearlyNet = totalGrossActualPay - totalDeductions;
    const monthlyNet = yearlyNet / 12;

    // Effective tax rate
    const effectiveTaxRate = totalDeductions / totalGrossForTax;

    // Commuting allowance (tax-free addition)
    const reiskostenvergoeding = input.commuteDistance
        ? calculateReiskosten(input.commuteDistance, year)
        : undefined;

    // Employer pension contribution (for display)
    const pensionEmployer = input.pensionContributionEmployer
        ? grossYearly * (input.pensionContributionEmployer / 100)
        : undefined;

    // Build result
    const result: SalaryBreakdown = {
        input: {
            grossYearly,
            grossMonthly: grossYearly / 12,
            period: input.period,
            taxYear: year,
        },
        gross: {
            baseSalary: grossYearly,
            holidayAllowance,
            thirteenthMonth,
            bijtelling,
            totalGross: totalGrossForTax,
        },
        deductions: {
            loonheffing,
            pensionEmployee,
            zvwPremie,
            totalDeductions,
        },
        taxCredits: {
            arbeidskorting,
            algemeneHeffingskorting,
            totalCredits,
        },
        net: {
            yearlyNet,
            monthlyNet,
            effectiveTaxRate: Math.round(effectiveTaxRate * 10000) / 100, // as percentage
        },
        extras: {
            reiskostenvergoeding,
            ruling30Benefit: input.ruling30Percent ? ruling30Benefit : undefined,
            pensionEmployer,
        },
    };

    // Calculate comparison with/without 30% ruling if applicable
    if (input.ruling30Percent) {
        const withoutRuling = calculateNetSalary({
            ...input,
            ruling30Percent: false,
        });

        result.comparison = {
            withRuling: {
                netMonthly: monthlyNet,
                netYearly: yearlyNet,
            },
            withoutRuling: {
                netMonthly: withoutRuling.net.monthlyNet,
                netYearly: withoutRuling.net.yearlyNet,
            },
            benefit: yearlyNet - withoutRuling.net.yearlyNet,
        };
    }

    return result;
}

/**
 * Quick calculation: Gross to Net (monthly)
 */
export function grossToNetMonthly(
    grossMonthly: number,
    year: 2024 | 2025 = 2025
): number {
    const result = calculateNetSalary({
        grossSalary: grossMonthly,
        period: "monthly",
        taxYear: year,
    });
    return result.net.monthlyNet;
}

/**
 * Reverse calculation: Net to Gross (approximate)
 */
export function netToGrossMonthly(
    targetNetMonthly: number,
    year: 2024 | 2025 = 2025,
    maxIterations: number = 50
): number {
    let low = targetNetMonthly;
    let high = targetNetMonthly * 3; // Start with 3x as upper bound

    for (let i = 0; i < maxIterations; i++) {
        const mid = (low + high) / 2;
        const netResult = grossToNetMonthly(mid, year);

        if (Math.abs(netResult - targetNetMonthly) < 0.01) {
            return Math.round(mid * 100) / 100;
        }

        if (netResult < targetNetMonthly) {
            low = mid;
        } else {
            high = mid;
        }
    }

    return Math.round(((low + high) / 2) * 100) / 100;
}

/**
 * Get tax bracket info for a given income
 */
export function getTaxBracketInfo(income: number, year: 2024 | 2025) {
    const brackets = year === 2025 ? TAX_BRACKETS_2025 : TAX_BRACKETS_2024;
    const currentBracket = brackets.find(b => income <= b.max) || brackets[brackets.length - 1];

    return {
        currentRate: currentBracket.rate,
        currentRatePercent: Math.round(currentBracket.rate * 100),
        brackets: brackets.map(b => ({
            min: b.min,
            max: b.max === Infinity ? "∞" : b.max,
            rate: Math.round(b.rate * 100) + "%",
        })),
    };
}

/**
 * Format currency for Dutch locale
 */
export function formatCurrencyNL(amount: number): string {
    return new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}

/**
 * Format percentage for Dutch locale
 */
export function formatPercentageNL(rate: number): string {
    return new Intl.NumberFormat("nl-NL", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    }).format(rate / 100);
}
