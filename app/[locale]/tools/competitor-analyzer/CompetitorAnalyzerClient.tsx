"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { useResultHistory } from "@/hooks/useResultHistory";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import { ResultHistory } from "@/app/Components/tools/ResultHistory";
import TemplateSelector from "@/app/Components/tools/TemplateSelector";
import { ToolLoadingState } from "@/app/Components/tools/ToolLoadingState";
import { ToolActionBar } from "@/app/Components/tools/ToolActionBar";
import { exportToPDFReport, downloadExport } from "@/lib/export";
import {
    Swords,
    AlertCircle,
    CheckCircle2,
    Lightbulb,
    Plus,
    Trash2,
    Building2,
    Globe,
    Target,
    TrendingUp,
    TrendingDown,
    Award,
    BarChart3,
    ChevronRight
} from "lucide-react";

interface Competitor {
    name: string;
    description?: string;
    website?: string;
}

interface CompetitorAnalysis {
    name: string;
    strengths: string[];
    weaknesses: string[];
    marketPosition: string;
    pricingStrategy?: string;
    uniqueSellingPoints: string[];
    threatLevel: "high" | "medium" | "low";
}

interface CompetitorAnalyzerResult {
    yourCompany: string;
    competitorAnalyses: CompetitorAnalysis[];
    marketOverview: string;
    competitiveAdvantages: string[];
    areasForImprovement: string[];
    strategicRecommendations: string[];
    differentiationOpportunities: string[];
    competitorCount: number;
    industry: string;
    generatedAt: string;
    processingTime?: number;
}

const FOCUS_AREAS = [
    { value: "pricing", label: "Prijsstrategie" },
    { value: "features", label: "Features/Functies" },
    { value: "market_position", label: "Marktpositie" },
    { value: "strengths", label: "Sterke punten" },
    { value: "weaknesses", label: "Zwakke punten" },
    { value: "opportunities", label: "Kansen" }
];

const THREAT_CONFIG = {
    high: { label: "Hoog", color: "text-red-400", bg: "bg-red-500/20 border-red-500/30" },
    medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30" },
    low: { label: "Laag", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30" }
};

export default function CompetitorAnalyzerClient() {
    const toolMetadata = getToolBySlug("competitor-analyzer");

    // Form state
    const [yourCompany, setYourCompany] = useState("");
    const [yourDescription, setYourDescription] = useState("");
    const [competitors, setCompetitors] = useState<Competitor[]>([{ name: "", description: "", website: "" }]);
    const [industry, setIndustry] = useState("");
    const [focusAreas, setFocusAreas] = useState<string[]>(["pricing", "features", "market_position"]);

    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<CompetitorAnalyzerResult>("competitor-analyzer");

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess, reset } = usePaywallTool({
        apiEndpoint: "/api/v1/sales/competitor-analyzer",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const addCompetitor = () => {
        if (competitors.length < 5) {
            setCompetitors([...competitors, { name: "", description: "", website: "" }]);
        }
    };

    const removeCompetitor = (index: number) => {
        if (competitors.length > 1) {
            setCompetitors(competitors.filter((_, i) => i !== index));
        }
    };

    const updateCompetitor = (index: number, field: keyof Competitor, value: string) => {
        const updated = [...competitors];
        updated[index] = { ...updated[index], [field]: value };
        setCompetitors(updated);
    };

    const toggleFocusArea = (area: string) => {
        setFocusAreas(prev =>
            prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validCompetitors = competitors.filter(c => c.name.trim().length > 0);
        if (yourCompany.trim().length < 1 || yourDescription.trim().length < 20 || validCompetitors.length === 0) return;

        execute({
            yourCompany,
            yourDescription,
            competitors: validCompetitors,
            industry: industry || undefined,
            focusAreas: focusAreas.length > 0 ? focusAreas : undefined
        });
    };

    const data = state.data as CompetitorAnalyzerResult | undefined;

    const handleSaveToHistory = useCallback(() => {
        if (data) {
            saveToHistory(
                {
                    yourCompany: data.yourCompany,
                    competitorCount: data.competitorCount,
                    industry: data.industry
                },
                data,
                ["competitor-analysis", data.industry]
            );
        }
    }, [data, saveToHistory]);

    const handleLoadHistory = useCallback((entry: { result: CompetitorAnalyzerResult }) => {
        const historyData = entry.result;
        setYourCompany(historyData.yourCompany);
        setIndustry(historyData.industry);
    }, []);

    const handleApplyTemplate = (templateData: Record<string, unknown>) => {
        if (templateData.yourCompany) setYourCompany(templateData.yourCompany as string);
        if (templateData.yourDescription) setYourDescription(templateData.yourDescription as string);
        if (templateData.industry) setIndustry(templateData.industry as string);
        if (templateData.focusAreas) setFocusAreas(templateData.focusAreas as string[]);
    };

    const handleExportPDF = async () => {
        if (!data) return;
        const sections = [
            {
                title: "Markt Overzicht",
                content: data.marketOverview
            },
            ...data.competitorAnalyses.map(comp => ({
                title: `Analyse: ${comp.name}`,
                content: `Marktpositie: ${comp.marketPosition}\nDreiging niveau: ${THREAT_CONFIG[comp.threatLevel].label}\n\nSterke punten:\n${comp.strengths.map(s => `• ${s}`).join("\n")}\n\nZwakke punten:\n${comp.weaknesses.map(w => `• ${w}`).join("\n")}\n\nUnieke kenmerken:\n${comp.uniqueSellingPoints.map(u => `• ${u}`).join("\n")}${comp.pricingStrategy ? `\n\nPrijsstrategie: ${comp.pricingStrategy}` : ""}`
            })),
            {
                title: "Jouw Concurrentievoordelen",
                content: data.competitiveAdvantages.map(a => `• ${a}`).join("\n")
            },
            {
                title: "Verbeterpunten",
                content: data.areasForImprovement.map(a => `• ${a}`).join("\n")
            },
            {
                title: "Strategische Aanbevelingen",
                content: data.strategicRecommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")
            },
            {
                title: "Differentiatie Kansen",
                content: data.differentiationOpportunities.map(d => `• ${d}`).join("\n")
            }
        ];

        const result = await exportToPDFReport(
            { sections },
            {
                title: `Concurrentie Analyse: ${data.yourCompany}`,
                subtitle: `${data.competitorCount} concurrenten geanalyseerd${data.industry ? ` • ${data.industry}` : ""}`,
                filename: `competitor-analysis-${data.yourCompany.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
            }
        );
        downloadExport(result);
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                            <Swords className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                            <p className="text-zinc-400 text-sm">Analyseer je concurrentie strategisch</p>
                        </div>
                    </div>
                    <ResultHistory
                        history={history}
                        onLoadEntry={handleLoadHistory}
                        onDeleteEntry={deleteEntry}
                        onClearHistory={clearHistory}
                        onToggleStar={toggleStar}
                        onExportHistory={exportHistory}
                        onImportHistory={importHistory}
                        renderPreview={({ result }) => (
                            <div className="space-y-1 text-xs">
                                <p className="text-white line-clamp-1">{result.yourCompany}</p>
                                <p className="text-zinc-500">{result.competitorCount} concurrenten</p>
                            </div>
                        )}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">Analyse Details</h2>
                                <TemplateSelector
                                    toolId="competitor-analyzer"
                                    onSelectTemplate={handleApplyTemplate}
                                    currentData={{
                                        yourCompany,
                                        yourDescription,
                                        industry,
                                        focusAreas
                                    }}
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Your Company */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            <Building2 className="w-4 h-4 inline mr-1" />
                                            Jouw Bedrijf
                                        </label>
                                        <input
                                            type="text"
                                            value={yourCompany}
                                            onChange={(e) => setYourCompany(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Jouw bedrijfsnaam"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Industrie (optioneel)
                                        </label>
                                        <input
                                            type="text"
                                            value={industry}
                                            onChange={(e) => setIndustry(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Bijv. SaaS, E-commerce, ..."
                                        />
                                    </div>
                                </div>

                                {/* Your Description */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Beschrijving van jouw bedrijf
                                    </label>
                                    <textarea
                                        value={yourDescription}
                                        onChange={(e) => setYourDescription(e.target.value)}
                                        rows={3}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                        placeholder="Wat doet jouw bedrijf? Wat zijn jullie producten/diensten en unieke kenmerken?"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {yourDescription.length}/2000 tekens (min. 20)
                                    </p>
                                </div>

                                {/* Competitors */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-medium text-zinc-300">
                                            <Swords className="w-4 h-4 inline mr-1" />
                                            Concurrenten ({competitors.length}/5)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addCompetitor}
                                            disabled={competitors.length >= 5}
                                            className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-sm flex items-center gap-1 hover:bg-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Toevoegen
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {competitors.map((comp, index) => (
                                            <div key={index} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-medium text-zinc-400">Concurrent {index + 1}</span>
                                                    {competitors.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCompetitor(index)}
                                                            className="p-1.5 hover:bg-zinc-700 rounded text-zinc-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid md:grid-cols-3 gap-3">
                                                    <input
                                                        type="text"
                                                        value={comp.name}
                                                        onChange={(e) => updateCompetitor(index, "name", e.target.value)}
                                                        className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                        placeholder="Naam *"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={comp.description || ""}
                                                        onChange={(e) => updateCompetitor(index, "description", e.target.value)}
                                                        className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                        placeholder="Korte beschrijving"
                                                    />
                                                    <input
                                                        type="url"
                                                        value={comp.website || ""}
                                                        onChange={(e) => updateCompetitor(index, "website", e.target.value)}
                                                        className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Focus Areas */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                                        <Target className="w-4 h-4 inline mr-1" />
                                        Focus Gebieden
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {FOCUS_AREAS.map(area => {
                                            const isSelected = focusAreas.includes(area.value);
                                            return (
                                                <button
                                                    key={area.value}
                                                    type="button"
                                                    onClick={() => toggleFocusArea(area.value)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                                                        isSelected
                                                            ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600"
                                                    }`}
                                                >
                                                    {area.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={
                                        state.status === "loading" ||
                                        yourCompany.trim().length < 1 ||
                                        yourDescription.trim().length < 20 ||
                                        competitors.filter(c => c.name.trim()).length === 0
                                    }
                                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Swords className="w-5 h-5" />
                                    {state.status === "loading" ? "Bezig met analyseren..." :
                                     "Analyseer Concurrentie"}
                                </button>
                            </form>
                        </div>

                        {/* Loading State */}
                        {state.status === "loading" && (
                            <ToolLoadingState
                                message="Concurrentie wordt geanalyseerd..."
                                subMessage={`${competitors.filter(c => c.name.trim()).length} concurrent(en)`}
                                estimatedTime={15}
                            />
                        )}

                        {/* Error State */}
                        {state.status === "error" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p>{state.error}</p>
                            </motion.div>
                        )}

                        {/* Results */}
                        {state.status === "success" && data && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Action Bar */}
                                <ToolActionBar
                                    exportFormats={["pdf"]}
                                    onExport={handleExportPDF}
                                    onSaveToHistory={handleSaveToHistory}
                                    onReset={reset}
                                />

                                {/* Success Summary */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        <div>
                                            <p className="font-semibold text-white">Analyse voltooid voor {data.yourCompany}</p>
                                            <p className="text-sm text-zinc-400">
                                                {data.competitorCount} concurrenten geanalyseerd
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Market Overview */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-orange-400" />
                                        Markt Overzicht
                                    </h3>
                                    <p className="text-zinc-300 leading-relaxed">{data.marketOverview}</p>
                                </div>

                                {/* Competitor Analyses */}
                                <div className="space-y-4">
                                    {data.competitorAnalyses.map((comp, i) => {
                                        const threat = THREAT_CONFIG[comp.threatLevel];
                                        return (
                                            <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                                <div className="p-5">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                                                            <Building2 className="w-5 h-5 text-zinc-400" />
                                                            {comp.name}
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${threat.bg} ${threat.color}`}>
                                                            Dreiging: {threat.label}
                                                        </span>
                                                    </div>

                                                    <p className="text-zinc-400 text-sm mb-4">{comp.marketPosition}</p>

                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        {/* Strengths */}
                                                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                                            <h4 className="font-medium text-emerald-400 mb-2 flex items-center gap-1">
                                                                <TrendingUp className="w-4 h-4" />
                                                                Sterke punten
                                                            </h4>
                                                            <ul className="space-y-1">
                                                                {comp.strengths.map((s, j) => (
                                                                    <li key={j} className="text-sm text-zinc-300 flex items-start gap-2">
                                                                        <ChevronRight className="w-3 h-3 mt-1 text-emerald-400 flex-shrink-0" />
                                                                        {s}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Weaknesses */}
                                                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                            <h4 className="font-medium text-red-400 mb-2 flex items-center gap-1">
                                                                <TrendingDown className="w-4 h-4" />
                                                                Zwakke punten
                                                            </h4>
                                                            <ul className="space-y-1">
                                                                {comp.weaknesses.map((w, j) => (
                                                                    <li key={j} className="text-sm text-zinc-300 flex items-start gap-2">
                                                                        <ChevronRight className="w-3 h-3 mt-1 text-red-400 flex-shrink-0" />
                                                                        {w}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* USPs */}
                                                    <div className="mt-4">
                                                        <h4 className="text-sm font-medium text-zinc-400 mb-2">Unieke kenmerken</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {comp.uniqueSellingPoints.map((usp, j) => (
                                                                <span key={j} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm">
                                                                    {usp}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Your Competitive Advantages */}
                                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/30 p-5">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-emerald-400" />
                                        Jouw Concurrentievoordelen
                                    </h3>
                                    <ul className="space-y-2">
                                        {data.competitiveAdvantages.map((adv, i) => (
                                            <li key={i} className="flex items-start gap-3 text-zinc-300">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                {adv}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Areas for Improvement */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-amber-400" />
                                        Verbeterpunten
                                    </h3>
                                    <ul className="space-y-2">
                                        {data.areasForImprovement.map((area, i) => (
                                            <li key={i} className="flex items-start gap-3 text-zinc-300">
                                                <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                                {area}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Strategic Recommendations */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-amber-400" />
                                        Strategische Aanbevelingen
                                    </h3>
                                    <div className="space-y-3">
                                        {data.strategicRecommendations.map((rec, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg">
                                                <span className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0">
                                                    {i + 1}
                                                </span>
                                                <p className="text-zinc-300">{rec}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Differentiation Opportunities */}
                                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/30 p-5">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-orange-400" />
                                        Differentiatie Kansen
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.differentiationOpportunities.map((opp, i) => (
                                            <span key={i} className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-lg text-sm">
                                                {opp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Tips Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                                <h3 className="font-semibold text-white">Analyse Tips</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">1.</span>
                                    Analyseer 3-5 belangrijkste concurrenten
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">2.</span>
                                    Voeg websites toe voor betere analyse
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">3.</span>
                                    Wees specifiek in je beschrijvingen
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">4.</span>
                                    Selecteer relevante focus gebieden
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">5.</span>
                                    Update analyse regelmatig
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30 p-5">
                            <h3 className="font-semibold text-white mb-3">Dreiging Niveaus</h3>
                            <div className="space-y-2 text-sm">
                                {Object.entries(THREAT_CONFIG).map(([key, config]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                                        <span className="text-zinc-300">{config.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PaywallToolWrapper
                toolMetadata={toolMetadata}
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
}
