"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calculator,
    Euro,
    Calendar,
    Users,
    Car,
    Plane,
    GraduationCap,
    ChevronDown,
    ChevronUp,
    Download,
    Copy,
    Check,
    AlertCircle,
    Info,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Briefcase,
    ArrowLeftRight,
    Percent,
    Building2,
    MapPin,
    FileSpreadsheet,
    FileText,
} from "lucide-react";

interface SalaryBreakdown {
    input: {
        grossYearly: number;
        grossMonthly: number;
        period: string;
        taxYear: number;
    };
    gross: {
        baseSalary: number;
        holidayAllowance: number;
        thirteenthMonth: number;
        bijtelling: number;
        totalGross: number;
    };
    deductions: {
        loonheffing: number;
        pensionEmployee: number;
        zvwPremie: number;
        totalDeductions: number;
    };
    taxCredits: {
        arbeidskorting: number;
        algemeneHeffingskorting: number;
        totalCredits: number;
    };
    net: {
        yearlyNet: number;
        monthlyNet: number;
        effectiveTaxRate: number;
    };
    extras: {
        reiskostenvergoeding?: number;
        ruling30Benefit?: number;
        pensionEmployer?: number;
    };
    comparison?: {
        withRuling: { netMonthly: number; netYearly: number };
        withoutRuling: { netMonthly: number; netYearly: number };
        benefit: number;
    };
}

interface SalaryResult {
    mode: string;
    breakdown: SalaryBreakdown;
    taxInfo: {
        currentRate: number;
        currentRatePercent: number;
        brackets: Array<{ min: number; max: string | number; rate: string }>;
    };
    scenarios: Array<{
        name: string;
        netMonthly: number;
        netYearly: number;
        effectiveTaxRate: number;
    }>;
    salaryLadder: Array<{
        grossMonthly: number;
        netMonthly: number;
    }>;
    taxRates: {
        year: number;
        arbeidskorting: number;
        algemeneHeffingskorting: number;
        zvwRate: number;
    };
}

export default function SalaryCalculatorClient() {
    // Form state
    const [grossSalary, setGrossSalary] = useState<number | "">("");
    const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
    const [taxYear, setTaxYear] = useState<"2024" | "2025">("2025");
    const [calculationMode, setCalculationMode] = useState<"gross-to-net" | "net-to-gross">("gross-to-net");

    // Optional inputs
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [partTimePercentage, setPartTimePercentage] = useState(100);
    const [holidayAllowanceIncluded, setHolidayAllowanceIncluded] = useState(false);
    const [thirteenthMonth, setThirteenthMonth] = useState(false);
    const [pensionEmployee, setPensionEmployee] = useState<number | "">("");
    const [ruling30Percent, setRuling30Percent] = useState(false);
    const [under30WithMasters, setUnder30WithMasters] = useState(false);

    // Company car
    const [hasCompanyCar, setHasCompanyCar] = useState(false);
    const [carCatalogValue, setCarCatalogValue] = useState<number | "">("");
    const [carIsElectric, setCarIsElectric] = useState(false);

    // Commute
    const [commuteDistance, setCommuteDistance] = useState<number | "">("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SalaryResult | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"breakdown" | "scenarios" | "info">("breakdown");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (grossSalary === "" || grossSalary <= 0) return;

        setLoading(true);
        setError(null);

        try {
            const payload: Record<string, unknown> = {
                grossSalary: Number(grossSalary),
                period,
                taxYear,
                calculationMode,
                partTimePercentage,
                holidayAllowanceIncluded,
                thirteenthMonth,
                ruling30Percent,
                under30WithMasters,
            };

            if (pensionEmployee !== "") {
                payload.pensionContributionEmployee = Number(pensionEmployee);
            }

            if (hasCompanyCar && carCatalogValue !== "") {
                payload.companyCar = {
                    catalogValue: Number(carCatalogValue),
                    isElectric: carIsElectric,
                };
            }

            if (commuteDistance !== "") {
                payload.commuteDistance = Number(commuteDistance);
            }

            const response = await fetch("/api/v1/hr/salary-calculator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Er ging iets mis. Probeer het opnieuw.");
            }

            const data = await response.json();
            if (data.success && data.data?.breakdown) {
                setResult(data.data);
            } else {
                throw new Error(data.error || "Ongeldig antwoord van server");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Er ging iets mis.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (value: string, key: string) => {
        await navigator.clipboard.writeText(value);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const formatPercent = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    // Calculate visual breakdown percentages
    const breakdownPercentages = useMemo(() => {
        if (!result) return null;
        const total = result.breakdown.gross.totalGross;
        return {
            net: (result.breakdown.net.yearlyNet / total) * 100,
            loonheffing: (result.breakdown.deductions.loonheffing / total) * 100,
            pension: (result.breakdown.deductions.pensionEmployee / total) * 100,
            zvw: (result.breakdown.deductions.zvwPremie / total) * 100,
        };
    }, [result]);

    const exportToCSV = () => {
        if (!result) return;
        const b = result.breakdown;
        const rows = [
            ["Categorie", "Bedrag (Jaar)", "Bedrag (Maand)"],
            ["Bruto salaris", b.gross.baseSalary, b.gross.baseSalary / 12],
            ["Vakantiegeld", b.gross.holidayAllowance, b.gross.holidayAllowance / 12],
            ["13e maand", b.gross.thirteenthMonth, b.gross.thirteenthMonth / 12],
            ["Bijtelling auto", b.gross.bijtelling, b.gross.bijtelling / 12],
            ["Totaal bruto", b.gross.totalGross, b.gross.totalGross / 12],
            ["", "", ""],
            ["Loonheffing", -b.deductions.loonheffing, -b.deductions.loonheffing / 12],
            ["Pensioen werknemer", -b.deductions.pensionEmployee, -b.deductions.pensionEmployee / 12],
            ["ZVW premie", -b.deductions.zvwPremie, -b.deductions.zvwPremie / 12],
            ["Totaal inhoudingen", -b.deductions.totalDeductions, -b.deductions.totalDeductions / 12],
            ["", "", ""],
            ["Netto salaris", b.net.yearlyNet, b.net.monthlyNet],
            ["Effectief belastingtarief", `${b.net.effectiveTaxRate}%`, ""],
        ];

        const csvContent = rows.map(row =>
            row.map(cell =>
                typeof cell === "number" ? cell.toFixed(2) : cell
            ).join(",")
        ).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `salaris-berekening-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl">
                        <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Salaris Calculator</h1>
                        <p className="text-zinc-400">Bereken je netto salaris met de nieuwste belastingtarieven</p>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium text-zinc-300">Berekeningsrichting</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setCalculationMode("gross-to-net")}
                            className={`p-4 rounded-xl border text-left transition-all ${
                                calculationMode === "gross-to-net"
                                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                            }`}
                        >
                            <span className="block font-semibold">Bruto → Netto</span>
                            <span className="text-xs opacity-70">Wat houd ik over?</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCalculationMode("net-to-gross")}
                            className={`p-4 rounded-xl border text-left transition-all ${
                                calculationMode === "net-to-gross"
                                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                            }`}
                        >
                            <span className="block font-semibold">Netto → Bruto</span>
                            <span className="text-xs opacity-70">Wat moet ik verdienen?</span>
                        </button>
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Euro className="w-5 h-5 text-emerald-400" />
                            {calculationMode === "gross-to-net" ? "Bruto Salaris" : "Gewenst Netto Salaris"}
                        </h2>

                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Salary Input */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Bedrag
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xl">€</span>
                                    <input
                                        type="number"
                                        step="1"
                                        min="1"
                                        value={grossSalary}
                                        onChange={(e) => setGrossSalary(e.target.value ? Number(e.target.value) : "")}
                                        className="w-full p-4 pl-10 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-2xl placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="3500"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Period */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Periode
                                </label>
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value as "monthly" | "yearly")}
                                    className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                >
                                    <option value="monthly">Per maand</option>
                                    <option value="yearly">Per jaar</option>
                                </select>
                            </div>
                        </div>

                        {/* Tax Year & Part-time */}
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Belastingjaar
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(["2024", "2025"] as const).map(year => (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() => setTaxYear(year)}
                                            className={`p-3 rounded-xl border transition-all ${
                                                taxYear === year
                                                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                            }`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Dienstverband
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={partTimePercentage}
                                        onChange={(e) => setPartTimePercentage(Number(e.target.value))}
                                        className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <span className="text-white font-medium w-16 text-right">{partTimePercentage}%</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    {partTimePercentage === 100 ? "Fulltime" : `${(partTimePercentage / 100 * 40).toFixed(1)} uur/week`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-between"
                    >
                        <span className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Geavanceerde opties
                        </span>
                        {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {/* Advanced Options */}
                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                {/* Salary Components */}
                                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                    <h3 className="text-md font-semibold text-white mb-4">Salaris Componenten</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-750 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={holidayAllowanceIncluded}
                                                onChange={(e) => setHolidayAllowanceIncluded(e.target.checked)}
                                                className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <div>
                                                <span className="text-white">Vakantiegeld inbegrepen</span>
                                                <p className="text-xs text-zinc-500">8% vakantietoeslag zit al in het salaris</p>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-750 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={thirteenthMonth}
                                                onChange={(e) => setThirteenthMonth(e.target.checked)}
                                                className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <div>
                                                <span className="text-white">13e maand</span>
                                                <p className="text-xs text-zinc-500">Ontvang je een dertiende maand?</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* 30% Ruling */}
                                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                    <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                                        <Plane className="w-5 h-5 text-emerald-400" />
                                        30%-Regeling (Expats)
                                    </h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-750 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={ruling30Percent}
                                                onChange={(e) => setRuling30Percent(e.target.checked)}
                                                className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <div>
                                                <span className="text-white">30%-regeling actief</span>
                                                <p className="text-xs text-zinc-500">30% van je salaris is belastingvrij</p>
                                            </div>
                                        </label>

                                        {ruling30Percent && (
                                            <label className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl cursor-pointer ml-6">
                                                <input
                                                    type="checkbox"
                                                    checked={under30WithMasters}
                                                    onChange={(e) => setUnder30WithMasters(e.target.checked)}
                                                    className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500"
                                                />
                                                <div>
                                                    <span className="text-white flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4" />
                                                        Onder 30 met Master
                                                    </span>
                                                    <p className="text-xs text-zinc-500">Lagere salariseis van toepassing</p>
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Pension */}
                                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                    <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                                        <PiggyBank className="w-5 h-5 text-emerald-400" />
                                        Pensioen
                                    </h3>
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-2">
                                            Werknemersbijdrage (%)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="30"
                                            value={pensionEmployee}
                                            onChange={(e) => setPensionEmployee(e.target.value ? Number(e.target.value) : "")}
                                            placeholder="0"
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-zinc-500 mt-1">Percentage van bruto salaris dat je zelf inlegt</p>
                                    </div>
                                </div>

                                {/* Company Car */}
                                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                    <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                                        <Car className="w-5 h-5 text-emerald-400" />
                                        Auto van de Zaak
                                    </h3>
                                    <label className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-750 transition-colors mb-3">
                                        <input
                                            type="checkbox"
                                            checked={hasCompanyCar}
                                            onChange={(e) => setHasCompanyCar(e.target.checked)}
                                            className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className="text-white">Ik heb een auto van de zaak</span>
                                    </label>

                                    {hasCompanyCar && (
                                        <div className="space-y-3 mt-3">
                                            <div>
                                                <label className="block text-sm text-zinc-400 mb-2">
                                                    Cataloguswaarde (€)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={carCatalogValue}
                                                    onChange={(e) => setCarCatalogValue(e.target.value ? Number(e.target.value) : "")}
                                                    placeholder="40000"
                                                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                            </div>
                                            <label className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={carIsElectric}
                                                    onChange={(e) => setCarIsElectric(e.target.checked)}
                                                    className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500"
                                                />
                                                <span className="text-white">Elektrische auto (lager bijtellingspercentage)</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Commute */}
                                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                    <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                        Woon-werkverkeer
                                    </h3>
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-2">
                                            Enkele reis afstand (km)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={commuteDistance}
                                            onChange={(e) => setCommuteDistance(e.target.value ? Number(e.target.value) : "")}
                                            placeholder="25"
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-zinc-500 mt-1">€0,23 per km onbelaste vergoeding (2025)</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || grossSalary === "" || Number(grossSalary) <= 0}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Berekenen...
                            </span>
                        ) : (
                            <>
                                <Calculator className="w-5 h-5" />
                                Bereken {calculationMode === "gross-to-net" ? "Netto Salaris" : "Bruto Salaris"}
                            </>
                        )}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </motion.div>
                )}

                {/* Results */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Main Result Card */}
                        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/30 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        {calculationMode === "gross-to-net" ? "Je netto salaris" : "Benodigd bruto salaris"}
                                    </p>
                                    <p className="text-4xl font-bold text-white mt-1">
                                        {formatCurrency(result.breakdown.net.monthlyNet)}
                                        <span className="text-lg text-zinc-400 font-normal"> /maand</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-zinc-400">Per jaar</p>
                                    <button
                                        onClick={() => copyToClipboard(result.breakdown.net.yearlyNet.toFixed(2), "yearly")}
                                        className="text-2xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2"
                                    >
                                        {formatCurrency(result.breakdown.net.yearlyNet)}
                                        {copied === "yearly" ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <Copy className="w-4 h-4 opacity-50" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-zinc-500">Effectief tarief</p>
                                    <p className="text-lg font-bold text-white">{formatPercent(result.breakdown.net.effectiveTaxRate)}</p>
                                </div>
                                <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-zinc-500">Belastingschijf</p>
                                    <p className="text-lg font-bold text-white">{result.taxInfo.currentRatePercent}%</p>
                                </div>
                                <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-zinc-500">Heffingskortingen</p>
                                    <p className="text-lg font-bold text-emerald-400">+{formatCurrency(result.breakdown.taxCredits.totalCredits)}</p>
                                </div>
                            </div>

                            {/* 30% Ruling Comparison */}
                            {result.breakdown.comparison && (
                                <div className="mt-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Plane className="w-5 h-5 text-emerald-400" />
                                        <span className="font-medium text-emerald-400">30%-regeling voordeel</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        +{formatCurrency(result.breakdown.comparison.benefit)}
                                        <span className="text-sm text-zinc-400 font-normal"> per jaar</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Visual Breakdown Bar */}
                        {breakdownPercentages && (
                            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Verdeling Bruto Salaris</h3>
                                <div className="h-8 rounded-xl overflow-hidden flex">
                                    <div
                                        className="bg-emerald-500 transition-all"
                                        style={{ width: `${breakdownPercentages.net}%` }}
                                        title={`Netto: ${breakdownPercentages.net.toFixed(1)}%`}
                                    />
                                    <div
                                        className="bg-red-500 transition-all"
                                        style={{ width: `${breakdownPercentages.loonheffing}%` }}
                                        title={`Loonheffing: ${breakdownPercentages.loonheffing.toFixed(1)}%`}
                                    />
                                    <div
                                        className="bg-amber-500 transition-all"
                                        style={{ width: `${breakdownPercentages.zvw}%` }}
                                        title={`ZVW: ${breakdownPercentages.zvw.toFixed(1)}%`}
                                    />
                                    {breakdownPercentages.pension > 0 && (
                                        <div
                                            className="bg-blue-500 transition-all"
                                            style={{ width: `${breakdownPercentages.pension}%` }}
                                            title={`Pensioen: ${breakdownPercentages.pension.toFixed(1)}%`}
                                        />
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                        <span className="text-zinc-400">Netto ({breakdownPercentages.net.toFixed(1)}%)</span>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-red-500" />
                                        <span className="text-zinc-400">Loonheffing ({breakdownPercentages.loonheffing.toFixed(1)}%)</span>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                                        <span className="text-zinc-400">ZVW ({breakdownPercentages.zvw.toFixed(1)}%)</span>
                                    </span>
                                    {breakdownPercentages.pension > 0 && (
                                        <span className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-blue-500" />
                                            <span className="text-zinc-400">Pensioen ({breakdownPercentages.pension.toFixed(1)}%)</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-zinc-800">
                            {[
                                { id: "breakdown", label: "Breakdown", icon: FileSpreadsheet },
                                { id: "scenarios", label: "Scenario's", icon: TrendingUp },
                                { id: "info", label: "Tarieven", icon: Info },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                                        activeTab === tab.id
                                            ? "border-emerald-500 text-emerald-400"
                                            : "border-transparent text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            {activeTab === "breakdown" && (
                                <motion.div
                                    key="breakdown"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
                                >
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-zinc-800">
                                                <th className="text-left p-4 text-zinc-400 font-medium">Component</th>
                                                <th className="text-right p-4 text-zinc-400 font-medium">Per jaar</th>
                                                <th className="text-right p-4 text-zinc-400 font-medium">Per maand</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Gross section */}
                                            <tr className="border-b border-zinc-800/50">
                                                <td className="p-4 text-white font-medium">Bruto salaris</td>
                                                <td className="p-4 text-right text-white">{formatCurrency(result.breakdown.gross.baseSalary)}</td>
                                                <td className="p-4 text-right text-zinc-400">{formatCurrency(result.breakdown.gross.baseSalary / 12)}</td>
                                            </tr>
                                            {result.breakdown.gross.holidayAllowance > 0 && (
                                                <tr className="border-b border-zinc-800/50">
                                                    <td className="p-4 text-zinc-300">+ Vakantiegeld (8%)</td>
                                                    <td className="p-4 text-right text-emerald-400">+{formatCurrency(result.breakdown.gross.holidayAllowance)}</td>
                                                    <td className="p-4 text-right text-zinc-500">+{formatCurrency(result.breakdown.gross.holidayAllowance / 12)}</td>
                                                </tr>
                                            )}
                                            {result.breakdown.gross.thirteenthMonth > 0 && (
                                                <tr className="border-b border-zinc-800/50">
                                                    <td className="p-4 text-zinc-300">+ 13e maand</td>
                                                    <td className="p-4 text-right text-emerald-400">+{formatCurrency(result.breakdown.gross.thirteenthMonth)}</td>
                                                    <td className="p-4 text-right text-zinc-500">+{formatCurrency(result.breakdown.gross.thirteenthMonth / 12)}</td>
                                                </tr>
                                            )}
                                            {result.breakdown.gross.bijtelling > 0 && (
                                                <tr className="border-b border-zinc-800/50">
                                                    <td className="p-4 text-zinc-300">+ Bijtelling auto</td>
                                                    <td className="p-4 text-right text-amber-400">+{formatCurrency(result.breakdown.gross.bijtelling)}</td>
                                                    <td className="p-4 text-right text-zinc-500">+{formatCurrency(result.breakdown.gross.bijtelling / 12)}</td>
                                                </tr>
                                            )}
                                            <tr className="border-b border-zinc-800 bg-zinc-800/30">
                                                <td className="p-4 text-white font-semibold">Totaal bruto</td>
                                                <td className="p-4 text-right text-white font-semibold">{formatCurrency(result.breakdown.gross.totalGross)}</td>
                                                <td className="p-4 text-right text-zinc-400">{formatCurrency(result.breakdown.gross.totalGross / 12)}</td>
                                            </tr>

                                            {/* Deductions */}
                                            <tr className="border-b border-zinc-800/50">
                                                <td className="p-4 text-zinc-300">- Loonheffing</td>
                                                <td className="p-4 text-right text-red-400">-{formatCurrency(result.breakdown.deductions.loonheffing)}</td>
                                                <td className="p-4 text-right text-zinc-500">-{formatCurrency(result.breakdown.deductions.loonheffing / 12)}</td>
                                            </tr>
                                            <tr className="border-b border-zinc-800/50">
                                                <td className="p-4 text-zinc-300">- ZVW premie</td>
                                                <td className="p-4 text-right text-red-400">-{formatCurrency(result.breakdown.deductions.zvwPremie)}</td>
                                                <td className="p-4 text-right text-zinc-500">-{formatCurrency(result.breakdown.deductions.zvwPremie / 12)}</td>
                                            </tr>
                                            {result.breakdown.deductions.pensionEmployee > 0 && (
                                                <tr className="border-b border-zinc-800/50">
                                                    <td className="p-4 text-zinc-300">- Pensioen werknemer</td>
                                                    <td className="p-4 text-right text-red-400">-{formatCurrency(result.breakdown.deductions.pensionEmployee)}</td>
                                                    <td className="p-4 text-right text-zinc-500">-{formatCurrency(result.breakdown.deductions.pensionEmployee / 12)}</td>
                                                </tr>
                                            )}

                                            {/* Tax Credits */}
                                            <tr className="border-b border-zinc-800/50 bg-emerald-500/5">
                                                <td className="p-4 text-zinc-300">+ Arbeidskorting</td>
                                                <td className="p-4 text-right text-emerald-400">+{formatCurrency(result.breakdown.taxCredits.arbeidskorting)}</td>
                                                <td className="p-4 text-right text-zinc-500">+{formatCurrency(result.breakdown.taxCredits.arbeidskorting / 12)}</td>
                                            </tr>
                                            <tr className="border-b border-zinc-800/50 bg-emerald-500/5">
                                                <td className="p-4 text-zinc-300">+ Algemene heffingskorting</td>
                                                <td className="p-4 text-right text-emerald-400">+{formatCurrency(result.breakdown.taxCredits.algemeneHeffingskorting)}</td>
                                                <td className="p-4 text-right text-zinc-500">+{formatCurrency(result.breakdown.taxCredits.algemeneHeffingskorting / 12)}</td>
                                            </tr>

                                            {/* Net result */}
                                            <tr className="bg-emerald-500/10">
                                                <td className="p-4 text-white font-bold text-lg">Netto salaris</td>
                                                <td className="p-4 text-right text-emerald-400 font-bold text-lg">{formatCurrency(result.breakdown.net.yearlyNet)}</td>
                                                <td className="p-4 text-right text-emerald-400 font-bold">{formatCurrency(result.breakdown.net.monthlyNet)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}

                            {activeTab === "scenarios" && (
                                <motion.div
                                    key="scenarios"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Vergelijk Scenario&apos;s</h3>
                                        <div className="space-y-3">
                                            {result.scenarios.map((scenario, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-4 rounded-xl border ${
                                                        i === 0
                                                            ? "bg-emerald-500/10 border-emerald-500/30"
                                                            : "bg-zinc-800 border-zinc-700"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={i === 0 ? "text-emerald-400 font-medium" : "text-zinc-300"}>
                                                            {scenario.name}
                                                        </span>
                                                        <div className="text-right">
                                                            <span className="text-white font-bold">{formatCurrency(scenario.netMonthly)}</span>
                                                            <span className="text-zinc-500 text-sm"> /maand</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1 text-sm">
                                                        <span className="text-zinc-500">Effectief tarief: {formatPercent(scenario.effectiveTaxRate)}</span>
                                                        <span className="text-zinc-500">{formatCurrency(scenario.netYearly)} /jaar</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Salary Ladder */}
                                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Salarisvergelijking</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {result.salaryLadder.map((level, i) => (
                                                <div key={i} className="bg-zinc-800 rounded-xl p-3 text-center">
                                                    <p className="text-zinc-400 text-sm">€{level.grossMonthly} bruto</p>
                                                    <p className="text-white font-bold">{formatCurrency(level.netMonthly)}</p>
                                                    <p className="text-xs text-zinc-500">netto</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "info" && (
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    {/* Tax Brackets */}
                                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <Percent className="w-5 h-5 text-emerald-400" />
                                            Belastingschijven {result.taxRates.year}
                                        </h3>
                                        <div className="space-y-2">
                                            {result.taxInfo.brackets.map((bracket, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-3 rounded-xl flex items-center justify-between ${
                                                        result.breakdown.input.grossYearly >= bracket.min &&
                                                        (bracket.max === "∞" || result.breakdown.input.grossYearly < Number(bracket.max))
                                                            ? "bg-emerald-500/20 border border-emerald-500/30"
                                                            : "bg-zinc-800"
                                                    }`}
                                                >
                                                    <span className="text-zinc-300">
                                                        €{bracket.min.toLocaleString("nl-NL")} - {bracket.max === "∞" ? "∞" : `€${Number(bracket.max).toLocaleString("nl-NL")}`}
                                                    </span>
                                                    <span className="font-bold text-white">{bracket.rate}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tax Credits Info */}
                                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Heffingskortingen {result.taxRates.year}</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-zinc-800 rounded-xl p-4">
                                                <p className="text-sm text-zinc-400">Max. Arbeidskorting</p>
                                                <p className="text-xl font-bold text-emerald-400">{formatCurrency(result.taxRates.arbeidskorting)}</p>
                                            </div>
                                            <div className="bg-zinc-800 rounded-xl p-4">
                                                <p className="text-sm text-zinc-400">Max. Algemene Heffingskorting</p>
                                                <p className="text-xl font-bold text-emerald-400">{formatCurrency(result.taxRates.algemeneHeffingskorting)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Export Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={exportToCSV}
                                className="flex-1 py-3 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white hover:bg-zinc-750 transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Export CSV
                            </button>
                            <button
                                onClick={() => copyToClipboard(
                                    `Bruto: ${formatCurrency(result.breakdown.input.grossMonthly)}/maand\nNetto: ${formatCurrency(result.breakdown.net.monthlyNet)}/maand\nEffectief tarief: ${formatPercent(result.breakdown.net.effectiveTaxRate)}`,
                                    "summary"
                                )}
                                className="flex-1 py-3 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white hover:bg-zinc-750 transition-all flex items-center justify-center gap-2"
                            >
                                {copied === "summary" ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                Kopieer samenvatting
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Info Section */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-semibold text-white">Over deze calculator</h3>
                    </div>
                    <div className="space-y-2 text-sm text-zinc-400">
                        <p>Deze calculator berekent je netto salaris op basis van de officiële Nederlandse belastingtarieven voor 2024 en 2025.</p>
                        <p>Inclusief: loonheffing, arbeidskorting, algemene heffingskorting, ZVW-premie, 30%-regeling, bijtelling auto van de zaak.</p>
                        <p className="text-zinc-500 text-xs mt-3">
                            <strong>Disclaimer:</strong> Deze berekening is indicatief. Voor exacte bedragen raadpleeg je loonstrook of een belastingadviseur.
                        </p>
                    </div>
                </div>

                {/* Free Tool Badge */}
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm text-emerald-400">
                        <Check className="w-4 h-4" />
                        100% gratis - geen account nodig
                    </span>
                </div>
            </div>
        </div>
    );
}
