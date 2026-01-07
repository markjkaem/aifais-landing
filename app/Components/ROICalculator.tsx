// ========================================
// FILE: components/ROICalculator.tsx
// Enhanced Multi-Step ROI Calculator with PDF Export
// ========================================

"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Calculator,
    Users,
    Clock,
    DollarSign,
    TrendingUp,
    Download,
    FileSpreadsheet,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    Mail,
    Loader2,
    Check,
    History,
    Copy,
    PiggyBank,
    Calendar,
    BarChart3,
    Percent
} from "lucide-react";
import { useResultHistory } from "@/hooks/useResultHistory";
import { exportData, downloadExport } from "@/lib/export";

interface ROIResult {
    inputs: {
        teamSize: number;
        hoursLost: number;
        hourlyRate: number;
        implementationCost?: number;
    };
    potentialSavings: number;
    hoursReclaimed: number;
    fteEquivalent: number;
    monthlyValue: number;
    weeklyHours: number;
    paybackMonths: number;
    threeYearROI: number;
    npv: number;
    irr: number;
    calculatedAt: string;
}

export function AdvancedROICalculator() {
    const [step, setStep] = useState(0);
    const [teamSize, setTeamSize] = useState(5);
    const [hoursLost, setHoursLost] = useState(8);
    const [hourlyRate, setHourlyRate] = useState(45);
    const [implementationCost, setImplementationCost] = useState(25000);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showComparison, setShowComparison] = useState(false);

    // Comparison scenario
    const [scenario2, setScenario2] = useState({
        teamSize: 10,
        hoursLost: 10,
        hourlyRate: 50
    });

    // Result history
    const { history, saveToHistory, clearHistory } = useResultHistory<ROIResult>("roi-calculator");

    const results = useMemo(() => {
        const weeklyHours = teamSize * hoursLost;
        const yearlyHours = weeklyHours * 52;
        const efficiencyGain = 0.8; // Standard 80% improvement
        const potentialSavings = yearlyHours * hourlyRate * efficiencyGain;
        const hoursReclaimed = yearlyHours * efficiencyGain;
        const fteEquivalent = hoursReclaimed / 1700;
        const monthlyValue = potentialSavings / 12;

        // Advanced metrics
        const paybackMonths = implementationCost > 0 ? Math.ceil(implementationCost / monthlyValue) : 0;
        const threeYearSavings = potentialSavings * 3;
        const threeYearROI = implementationCost > 0
            ? ((threeYearSavings - implementationCost) / implementationCost) * 100
            : 0;

        // NPV calculation (10% discount rate over 3 years)
        const discountRate = 0.10;
        const npv = implementationCost > 0
            ? -implementationCost +
            (potentialSavings / (1 + discountRate)) +
            (potentialSavings / Math.pow(1 + discountRate, 2)) +
            (potentialSavings / Math.pow(1 + discountRate, 3))
            : potentialSavings * 2.49; // Approximate 3-year NPV

        // IRR approximation (simplified)
        const irr = implementationCost > 0
            ? ((potentialSavings / implementationCost) - 1) * 100
            : 999;

        return {
            inputs: { teamSize, hoursLost, hourlyRate, implementationCost },
            potentialSavings,
            hoursReclaimed,
            fteEquivalent,
            monthlyValue,
            weeklyHours,
            paybackMonths,
            threeYearROI,
            npv,
            irr: Math.min(irr, 999),
            calculatedAt: new Date().toISOString()
        };
    }, [teamSize, hoursLost, hourlyRate, implementationCost]);

    const scenario2Results = useMemo(() => {
        const weeklyHours = scenario2.teamSize * scenario2.hoursLost;
        const yearlyHours = weeklyHours * 52;
        const efficiencyGain = 0.8;
        const potentialSavings = yearlyHours * scenario2.hourlyRate * efficiencyGain;
        const monthlyValue = potentialSavings / 12;

        return { potentialSavings, monthlyValue };
    }, [scenario2]);

    const formatEuro = (amount: number) =>
        new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        }).format(amount);

    const formatNumber = (num: number) =>
        new Intl.NumberFormat("nl-NL").format(Math.round(num));

    const downloadPDF = useCallback(async () => {
        const documentContent = {
            title: "ROI Analyse & Business Case",
            sections: [
                {
                    title: "Kerncijfers",
                    statCards: [
                        { label: "Besparing", value: formatEuro(results.potentialSavings), subvalue: "Per jaar" },
                        { label: "Terugverdientijd", value: `${results.paybackMonths} mnd`, subvalue: "Break-even" },
                        { label: "ROI (3jr)", value: `${results.threeYearROI.toFixed(0)}%`, subvalue: "Rendement" }
                    ]
                },
                {
                    title: "Gedetailleerde Resultaten",
                    bullets: [
                        `Maandelijkse waardecreatie: ${formatEuro(results.monthlyValue)}`,
                        `Uren teruggewonnen per jaar: ${formatNumber(results.hoursReclaimed)} uur`,
                        `Capaciteitsuitbreiding fte-equivalent: ${results.fteEquivalent.toFixed(1)} FTE`,
                        `Netto Contante Waarde (NPV): ${formatEuro(results.npv)}`
                    ]
                },
                {
                    title: "Invoergegevens",
                    bullets: [
                        `Teamgrootte: ${teamSize} medewerkers`,
                        `Uren verloren per week (p.p.): ${hoursLost} uur`,
                        `Gemiddeld uurtarief: ${formatEuro(hourlyRate)}`,
                        `Implementatiekosten (CAPEX): ${formatEuro(implementationCost)}`
                    ]
                },
                {
                    title: "Toelichting Methode",
                    content: "Deze ROI-analyse is gebaseerd op een conservatieve efficiëntieverbetering door AI-automatisering. In de berekening wordt rekening gehouden met een adoptiepercentage en de initiële investeringskosten. De werkelijke resultaten kunnen variëren afhankelijk van de specifieke implementatie-strategie."
                }
            ],
            metadata: {
                Organisatie: "AIFAIS ROI Analyse",
                Datum: new Date().toLocaleDateString("nl-NL")
            }
        };

        const result = await exportData("pdf", documentContent, {
            title: "AI Business Case Analyse",
            subtitle: `Gegenereerd voor een team van ${teamSize} FTE`,
            filename: `roi_analyse_${teamSize}_fte_${Date.now()}`
        });
        downloadExport(result);
    }, [results, teamSize, hoursLost, hourlyRate, implementationCost]);

    const exportToExcel = useCallback(async () => {
        const data = [
            { Metriek: "Teamgrootte", Waarde: teamSize, Eenheid: "medewerkers" },
            { Metriek: "Uren verloren per week (p.p.)", Waarde: hoursLost, Eenheid: "uur" },
            { Metriek: "Uurtarief", Waarde: hourlyRate, Eenheid: "EUR" },
            { Metriek: "Implementatiekosten", Waarde: implementationCost, Eenheid: "EUR" },
            { Metriek: "", Waarde: "", Eenheid: "" },
            { Metriek: "Jaarlijkse besparing", Waarde: Math.round(results.potentialSavings), Eenheid: "EUR" },
            { Metriek: "Maandelijkse besparing", Waarde: Math.round(results.monthlyValue), Eenheid: "EUR" },
            { Metriek: "Uren teruggewonnen per jaar", Waarde: Math.round(results.hoursReclaimed), Eenheid: "uur" },
            { Metriek: "FTE equivalent", Waarde: parseFloat(results.fteEquivalent.toFixed(1)), Eenheid: "FTE" },
            { Metriek: "", Waarde: "", Eenheid: "" },
            { Metriek: "Terugverdientijd", Waarde: results.paybackMonths, Eenheid: "maanden" },
            { Metriek: "3-jaar ROI", Waarde: parseFloat(results.threeYearROI.toFixed(0)), Eenheid: "%" },
            { Metriek: "NPV", Waarde: Math.round(results.npv), Eenheid: "EUR" }
        ];

        const result = await exportData("xlsx", data, {
            filename: `roi_analyse_${teamSize}_fte_${Date.now()}`,
            columns: [
                { key: "Metriek", label: "Metriek", width: 30 },
                { key: "Waarde", label: "Waarde", width: 20 },
                { key: "Eenheid", label: "Eenheid", width: 15 }
            ]
        });
        downloadExport(result);
    }, [results, teamSize, hoursLost, hourlyRate, implementationCost]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Save to history
            saveToHistory(
                { teamSize, hoursLost, hourlyRate, implementationCost },
                results,
                ["roi", `${teamSize} fte`]
            );

            await fetch("/api/internal/quickscan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    results: {
                        totalSavings: formatEuro(results.potentialSavings),
                        hoursReclaimed: Math.round(results.hoursReclaimed).toString(),
                        fteRecovered: results.fteEquivalent.toFixed(1),
                    },
                    formData: { name, teamSize, hoursLost, hourlyRate },
                }),
            });
            setStep(5);
        } catch (error) {
            console.error("Submission error:", error);
            setStep(5);
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadFromHistory = (historyItem: ROIResult) => {
        setTeamSize(historyItem.inputs.teamSize);
        setHoursLost(historyItem.inputs.hoursLost);
        setHourlyRate(historyItem.inputs.hourlyRate);
        if (historyItem.inputs.implementationCost) {
            setImplementationCost(historyItem.inputs.implementationCost);
        }
        setShowHistory(false);
        setStep(5);
    };

    const copyResults = () => {
        const text = `ROI Analyse Resultaten:
- Teamgrootte: ${teamSize} medewerkers
- Jaarlijkse besparing: ${formatEuro(results.potentialSavings)}
- Maandelijkse besparing: ${formatEuro(results.monthlyValue)}
- Uren teruggewonnen: ${formatNumber(results.hoursReclaimed)} per jaar
- FTE equivalent: ${results.fteEquivalent.toFixed(1)}
- Terugverdientijd: ${results.paybackMonths} maanden
- 3-jaar ROI: ${results.threeYearROI.toFixed(0)}%`;

        navigator.clipboard.writeText(text);
    };

    const steps = [
        {
            title: "Ontdek uw AI Potentieel",
            subtitle: "In 4 simpele stappen berekenen we wat automatisering voor uw team betekent.",
            content: (
                <div className="text-center space-y-6">
                    <div className="flex justify-center gap-4">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                            <Calculator className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <button
                        onClick={() => setStep(1)}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
                    >
                        Start Gratis Analyse
                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                    {history.length > 0 && (
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-2 mx-auto text-zinc-400 hover:text-white transition"
                        >
                            <History className="w-4 h-4" />
                            Bekijk eerdere analyses ({history.length})
                        </button>
                    )}
                </div>
            ),
        },
        {
            title: "Om hoeveel mensen gaat het?",
            subtitle: "Voor hoeveel FTE / medewerkers voeren we de berekening uit?",
            content: (
                <div className="space-y-8">
                    <div className="flex justify-center flex-wrap gap-3">
                        {[1, 3, 5, 10, 25, 50].map((val) => (
                            <button
                                key={val}
                                onClick={() => setTeamSize(val)}
                                className={`w-14 h-14 rounded-xl font-bold transition-all border-2 ${teamSize === val
                                        ? "bg-blue-600 text-white border-blue-600 scale-110"
                                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-blue-500"
                                    }`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700">
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-3 text-xs font-bold text-zinc-500">
                            <span>1 PERSOON</span>
                            <span className="text-blue-400">{teamSize} PERSONEN</span>
                            <span>100 PERSONEN</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setStep(2)}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
                    >
                        Volgende Stap
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
        {
            title: "Hoeveel uur wordt er 'verspild'?",
            subtitle: "Denk aan administratie, overtypen, e-mail management en repetitieve data-entry per persoon per week.",
            content: (
                <div className="space-y-8">
                    <div className="text-center">
                        <div className="text-6xl font-black text-blue-400 mb-2">{hoursLost}</div>
                        <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Uur per week</div>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700">
                        <input
                            type="range"
                            min="1"
                            max="40"
                            value={hoursLost}
                            onChange={(e) => setHoursLost(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-3 text-xs font-bold text-zinc-500">
                            <span>BIJNA NIETS</span>
                            <span>40 UUR (FULLTIME)</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setStep(1)}
                            className="py-4 border-2 border-zinc-700 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-800 flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Terug
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            className="py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
                        >
                            Volgende
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ),
        },
        {
            title: "Uurtarief & Investering",
            subtitle: "Geef het gemiddelde bruto uurtarief en geschatte implementatiekosten op.",
            content: (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            Gemiddeld uurtarief (incl. werkgeverslasten)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-zinc-500">€</span>
                            <input
                                type="number"
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-2xl font-bold text-white focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            Geschatte implementatiekosten (optioneel)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-zinc-500">€</span>
                            <input
                                type="number"
                                value={implementationCost}
                                onChange={(e) => setImplementationCost(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-2xl font-bold text-white focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                            Voor ROI en terugverdientijd berekening
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <button
                            onClick={() => setStep(2)}
                            className="py-4 border-2 border-zinc-700 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-800 flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Terug
                        </button>
                        <button
                            onClick={() => setStep(4)}
                            className="py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
                        >
                            Bekijk Analyse
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ),
        },
        {
            title: "Analyse Klaar!",
            subtitle: "De berekening voor uw team is voltooid. Waar mogen we het uitgebreide rapport naartoe sturen?",
            content: (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        required
                        placeholder="Uw Naam"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 outline-none font-medium"
                    />
                    <input
                        type="email"
                        required
                        placeholder="uw-naam@bedrijf.nl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 outline-none font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Bezig met genereren...
                            </>
                        ) : (
                            <>
                                <Mail className="w-5 h-5" />
                                Ontvang ROI Rapport
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            saveToHistory(
                                { teamSize, hoursLost, hourlyRate, implementationCost },
                                results,
                                ["roi", `${teamSize} fte`]
                            );
                            setStep(5);
                        }}
                        className="w-full py-3 text-zinc-400 hover:text-white transition"
                    >
                        Bekijk resultaten eerst
                    </button>
                </form>
            ),
        },
        {
            title: "Uw Resultaten",
            subtitle: "Op basis van uw input hebben we dit potentieel berekend:",
            content: (
                <div className="space-y-6">
                    {/* Main Savings Card */}
                    <div className="bg-linear-to-br from-blue-600 to-blue-800 p-8 rounded-3xl text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <div className="text-xs font-bold tracking-[0.2em] opacity-60 mb-2">JAARLIJKSE BESPARING</div>
                            <div className="text-4xl md:text-5xl font-black mb-3">{formatEuro(results.potentialSavings)}</div>
                            <div className="text-blue-200 font-medium">Dat is {formatEuro(results.monthlyValue)} / maand</div>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 text-center">
                            <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                            <div className="text-xl font-bold text-white">{formatNumber(results.hoursReclaimed)}</div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase">Uren/jaar</div>
                        </div>
                        <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 text-center">
                            <Users className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                            <div className="text-xl font-bold text-white">{results.fteEquivalent.toFixed(1)}</div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase">FTE Potentieel</div>
                        </div>
                        <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 text-center">
                            <Calendar className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                            <div className="text-xl font-bold text-white">{results.paybackMonths}</div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase">Maanden Terugverdien</div>
                        </div>
                        <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 text-center">
                            <Percent className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                            <div className="text-xl font-bold text-white">{results.threeYearROI.toFixed(0)}%</div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase">3-Jaar ROI</div>
                        </div>
                    </div>

                    {/* Advanced Metrics */}
                    <div className="bg-zinc-800/30 p-5 rounded-xl border border-zinc-700">
                        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                            Financiele Analyse
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Netto Contante Waarde (NPV)</span>
                                <span className="text-white font-semibold">{formatEuro(results.npv)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Wekelijkse uren bespaard</span>
                                <span className="text-white font-semibold">{results.weeklyHours * 0.8} uur</span>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Toggle */}
                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="w-full py-3 text-blue-400 hover:text-blue-300 transition flex items-center justify-center gap-2"
                    >
                        <BarChart3 className="w-4 h-4" />
                        {showComparison ? "Verberg vergelijking" : "Vergelijk met ander scenario"}
                    </button>

                    {/* Comparison Panel */}
                    <AnimatePresence>
                        {showComparison && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-zinc-800/30 p-5 rounded-xl border border-zinc-700 overflow-hidden"
                            >
                                <h4 className="text-white font-semibold mb-4">Scenario 2</h4>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs text-zinc-500">Teamgrootte</label>
                                        <input
                                            type="number"
                                            value={scenario2.teamSize}
                                            onChange={(e) => setScenario2({ ...scenario2, teamSize: Number(e.target.value) })}
                                            className="w-full mt-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500">Uren/week</label>
                                        <input
                                            type="number"
                                            value={scenario2.hoursLost}
                                            onChange={(e) => setScenario2({ ...scenario2, hoursLost: Number(e.target.value) })}
                                            className="w-full mt-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500">Uurtarief</label>
                                        <input
                                            type="number"
                                            value={scenario2.hourlyRate}
                                            onChange={(e) => setScenario2({ ...scenario2, hourlyRate: Number(e.target.value) })}
                                            className="w-full mt-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-700/50 rounded-lg">
                                    <div>
                                        <div className="text-zinc-400 text-sm">Scenario 2 Besparing</div>
                                        <div className="text-2xl font-bold text-emerald-400">{formatEuro(scenario2Results.potentialSavings)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-zinc-400 text-sm">Verschil</div>
                                        <div className={`text-xl font-bold ${scenario2Results.potentialSavings > results.potentialSavings ? "text-emerald-400" : "text-red-400"}`}>
                                            {scenario2Results.potentialSavings > results.potentialSavings ? "+" : ""}
                                            {formatEuro(scenario2Results.potentialSavings - results.potentialSavings)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={downloadPDF}
                            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            <Download className="w-4 h-4" />
                            PDF
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Excel
                        </button>
                        <button
                            onClick={copyResults}
                            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            <Copy className="w-4 h-4" />
                            Kopieer
                        </button>
                    </div>

                    <div className="text-center pt-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition"
                        >
                            Plan een gratis strategiegesprek
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <button
                        onClick={() => { setStep(0); setShowComparison(false); }}
                        className="w-full py-3 text-zinc-500 hover:text-zinc-300 transition flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Nieuwe berekening
                    </button>
                </div>
            ),
        }
    ];

    const currentStep = steps[step];

    return (
        <div className="relative bg-zinc-900 rounded-2xl pt-10 pb-12 px-8">
            {/* Step Indicator */}
            {step > 0 && step < 5 && (
                <div className="absolute top-6 left-8 right-8 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            )}

            {/* History Panel */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute inset-x-8 top-20 bg-zinc-800 border border-zinc-700 rounded-xl p-4 z-20 max-h-64 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-semibold">Eerdere Analyses</h4>
                            <button onClick={() => setShowHistory(false)} className="text-zinc-500 hover:text-white">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {history.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => loadFromHistory(item.result)}
                                    className="w-full text-left p-3 bg-zinc-700/50 hover:bg-zinc-700 rounded-lg transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-white font-medium">
                                                {item.result.inputs.teamSize} FTE • {formatEuro(item.result.potentialSavings)}/jaar
                                            </div>
                                            <div className="text-zinc-500 text-xs">
                                                {new Date(item.timestamp).toLocaleString("nl-NL")}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                                    </div>
                                </button>
                            ))}
                        </div>
                        {history.length > 0 && (
                            <button
                                onClick={clearHistory}
                                className="w-full mt-3 text-xs text-zinc-500 hover:text-zinc-300"
                            >
                                Wis geschiedenis
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md mx-auto"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                            {currentStep.title}
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {currentStep.subtitle}
                        </p>
                    </div>

                    <div className="min-h-[200px] flex flex-col justify-center">
                        {currentStep.content}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
