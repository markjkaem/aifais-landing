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
    Compass,
    AlertCircle,
    CheckCircle2,
    Lightbulb,
    Building2,
    TrendingUp,
    TrendingDown,
    Target,
    AlertTriangle,
    Zap,
    Users,
    ChevronRight
} from "lucide-react";

interface SwotItem {
    item: string;
    description: string;
    priority: "high" | "medium" | "low";
}

interface Recommendation {
    title: string;
    description: string;
    action: string;
    timeframe: "short" | "medium" | "long";
}

interface SwotGeneratorResult {
    strengths: SwotItem[];
    weaknesses: SwotItem[];
    opportunities: SwotItem[];
    threats: SwotItem[];
    recommendations?: Recommendation[];
    summary: string;
    companyName: string;
    industry: string;
    generatedAt: string;
    processingTime?: number;
    totalStrengths: number;
    totalWeaknesses: number;
    totalOpportunities: number;
    totalThreats: number;
}

const COMPANY_SIZES = [
    { value: "solo", label: "Solo ondernemer" },
    { value: "2-10", label: "2-10 medewerkers" },
    { value: "11-50", label: "11-50 medewerkers" },
    { value: "51-200", label: "51-200 medewerkers" },
    { value: "200+", label: "200+ medewerkers" }
];

const PRIORITY_CONFIG = {
    high: { label: "Hoog", color: "text-red-400", bg: "bg-red-500/10" },
    medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10" },
    low: { label: "Laag", color: "text-emerald-400", bg: "bg-emerald-500/10" }
};

const TIMEFRAME_CONFIG = {
    short: { label: "Korte termijn", sublabel: "0-3 maanden" },
    medium: { label: "Middellange termijn", sublabel: "3-12 maanden" },
    long: { label: "Lange termijn", sublabel: "1+ jaar" }
};

const SWOT_QUADRANTS = {
    strengths: {
        title: "Sterke Punten",
        icon: TrendingUp,
        color: "emerald",
        bgGradient: "from-emerald-500/20 to-green-500/20",
        borderColor: "border-emerald-500/30",
        iconColor: "text-emerald-400"
    },
    weaknesses: {
        title: "Zwakke Punten",
        icon: TrendingDown,
        color: "red",
        bgGradient: "from-red-500/20 to-rose-500/20",
        borderColor: "border-red-500/30",
        iconColor: "text-red-400"
    },
    opportunities: {
        title: "Kansen",
        icon: Target,
        color: "blue",
        bgGradient: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-500/30",
        iconColor: "text-blue-400"
    },
    threats: {
        title: "Bedreigingen",
        icon: AlertTriangle,
        color: "amber",
        bgGradient: "from-amber-500/20 to-orange-500/20",
        borderColor: "border-amber-500/30",
        iconColor: "text-amber-400"
    }
};

export default function SwotGeneratorClient() {
    const toolMetadata = getToolBySlug("swot-generator");

    // Form state
    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState<string>("2-10");
    const [currentChallenges, setCurrentChallenges] = useState("");
    const [goals, setGoals] = useState("");
    const [marketContext, setMarketContext] = useState("");
    const [includeRecommendations, setIncludeRecommendations] = useState(true);

    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<SwotGeneratorResult>("swot-generator");

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess, reset } = usePaywallTool({
        apiEndpoint: "/api/v1/consulting/swot-generator",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim().length < 1 || description.trim().length < 30 || industry.trim().length < 1) return;

        execute({
            companyName,
            description,
            industry,
            companySize,
            currentChallenges: currentChallenges || undefined,
            goals: goals || undefined,
            marketContext: marketContext || undefined,
            includeRecommendations
        });
    };

    const data = state.data as SwotGeneratorResult | undefined;

    const handleSaveToHistory = useCallback(() => {
        if (data) {
            saveToHistory(
                {
                    companyName: data.companyName,
                    industry: data.industry,
                    totalItems: data.totalStrengths + data.totalWeaknesses + data.totalOpportunities + data.totalThreats
                },
                data,
                ["swot", data.industry]
            );
        }
    }, [data, saveToHistory]);

    const handleLoadHistory = useCallback((entry: { result: SwotGeneratorResult }) => {
        const historyData = entry.result;
        setCompanyName(historyData.companyName);
        setIndustry(historyData.industry);
    }, []);

    const handleApplyTemplate = (templateData: Record<string, unknown>) => {
        if (templateData.companyName) setCompanyName(templateData.companyName as string);
        if (templateData.description) setDescription(templateData.description as string);
        if (templateData.industry) setIndustry(templateData.industry as string);
        if (templateData.companySize) setCompanySize(templateData.companySize as string);
        if (templateData.currentChallenges) setCurrentChallenges(templateData.currentChallenges as string);
        if (templateData.goals) setGoals(templateData.goals as string);
        if (templateData.includeRecommendations !== undefined) setIncludeRecommendations(templateData.includeRecommendations as boolean);
    };

    const handleExportPDF = async () => {
        if (!data) return;

        const sections = [
            {
                title: "Samenvatting",
                content: data.summary
            },
            {
                title: "Sterke Punten",
                content: data.strengths.map(s => `• ${s.item}\n  ${s.description} [${PRIORITY_CONFIG[s.priority].label}]`).join("\n\n")
            },
            {
                title: "Zwakke Punten",
                content: data.weaknesses.map(w => `• ${w.item}\n  ${w.description} [${PRIORITY_CONFIG[w.priority].label}]`).join("\n\n")
            },
            {
                title: "Kansen",
                content: data.opportunities.map(o => `• ${o.item}\n  ${o.description} [${PRIORITY_CONFIG[o.priority].label}]`).join("\n\n")
            },
            {
                title: "Bedreigingen",
                content: data.threats.map(t => `• ${t.item}\n  ${t.description} [${PRIORITY_CONFIG[t.priority].label}]`).join("\n\n")
            }
        ];

        if (data.recommendations && data.recommendations.length > 0) {
            sections.push({
                title: "Aanbevelingen",
                content: data.recommendations.map((r, i) =>
                    `${i + 1}. ${r.title}\n   ${r.description}\n   Actie: ${r.action}\n   Termijn: ${TIMEFRAME_CONFIG[r.timeframe].label}`
                ).join("\n\n")
            });
        }

        const result = await exportToPDFReport(
            { sections },
            {
                title: `SWOT Analyse: ${data.companyName}`,
                subtitle: `${data.industry} • ${data.totalStrengths + data.totalWeaknesses + data.totalOpportunities + data.totalThreats} punten`,
                filename: `swot-${data.companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
            }
        );
        downloadExport(result);
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    const SwotQuadrant = ({
        type,
        items
    }: {
        type: keyof typeof SWOT_QUADRANTS;
        items: SwotItem[]
    }) => {
        const config = SWOT_QUADRANTS[type];
        const Icon = config.icon;

        return (
            <div className={`bg-gradient-to-br ${config.bgGradient} rounded-xl border ${config.borderColor} p-5`}>
                <div className="flex items-center gap-2 mb-4">
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                    <h3 className="font-semibold text-white">{config.title}</h3>
                    <span className="ml-auto px-2 py-0.5 bg-zinc-900/50 rounded text-xs text-zinc-400">
                        {items.length}
                    </span>
                </div>
                <div className="space-y-3">
                    {items.map((item, i) => {
                        const priority = PRIORITY_CONFIG[item.priority];
                        return (
                            <div key={i} className="bg-zinc-900/50 rounded-lg p-3">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="text-white font-medium text-sm">{item.item}</p>
                                    <span className={`px-1.5 py-0.5 rounded text-xs ${priority.bg} ${priority.color}`}>
                                        {priority.label}
                                    </span>
                                </div>
                                <p className="text-zinc-400 text-xs">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                            <Compass className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                            <p className="text-zinc-400 text-sm">Genereer een strategische SWOT analyse</p>
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
                                <p className="text-white line-clamp-1">{result.companyName}</p>
                                <p className="text-zinc-500">{result.industry}</p>
                            </div>
                        )}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">Bedrijfsgegevens</h2>
                                <TemplateSelector
                                    toolId="swot-generator"
                                    onSelectTemplate={handleApplyTemplate}
                                    currentData={{
                                        companyName,
                                        description,
                                        industry,
                                        companySize,
                                        currentChallenges,
                                        goals,
                                        includeRecommendations
                                    }}
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Company Name & Industry */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            <Building2 className="w-4 h-4 inline mr-1" />
                                            Bedrijfsnaam
                                        </label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Jouw bedrijfsnaam"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Industrie
                                        </label>
                                        <input
                                            type="text"
                                            value={industry}
                                            onChange={(e) => setIndustry(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Bijv. SaaS, Retail, Consultancy"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Bedrijfsbeschrijving
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Beschrijf je bedrijf: wat doe je, wie zijn je klanten, wat zijn je producten/diensten, wat maakt je uniek?"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {description.length}/5000 tekens (min. 30)
                                    </p>
                                </div>

                                {/* Company Size */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        <Users className="w-4 h-4 inline mr-1" />
                                        Bedrijfsgrootte
                                    </label>
                                    <select
                                        value={companySize}
                                        onChange={(e) => setCompanySize(e.target.value)}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        {COMPANY_SIZES.map(size => (
                                            <option key={size.value} value={size.value}>
                                                {size.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Current Challenges */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Huidige uitdagingen (optioneel)
                                    </label>
                                    <textarea
                                        value={currentChallenges}
                                        onChange={(e) => setCurrentChallenges(e.target.value)}
                                        rows={2}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Welke uitdagingen ervaar je momenteel? Bijv. concurrentie, groei, cashflow..."
                                    />
                                </div>

                                {/* Goals */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Doelen (optioneel)
                                    </label>
                                    <textarea
                                        value={goals}
                                        onChange={(e) => setGoals(e.target.value)}
                                        rows={2}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Wat zijn je bedrijfsdoelen voor de komende periode?"
                                    />
                                </div>

                                {/* Market Context */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Marktcontext (optioneel)
                                    </label>
                                    <textarea
                                        value={marketContext}
                                        onChange={(e) => setMarketContext(e.target.value)}
                                        rows={2}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Extra context over de markt, concurrenten, trends..."
                                    />
                                </div>

                                {/* Options */}
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeRecommendations}
                                            onChange={(e) => setIncludeRecommendations(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-500 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-zinc-300">Strategische aanbevelingen toevoegen</span>
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={
                                        state.status === "loading" ||
                                        companyName.trim().length < 1 ||
                                        description.trim().length < 30 ||
                                        industry.trim().length < 1
                                    }
                                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Compass className="w-5 h-5" />
                                    {state.status === "loading" ? "Bezig met genereren..." :
                                     "Genereer SWOT Analyse"}
                                </button>
                            </form>
                        </div>

                        {/* Loading State */}
                        {state.status === "loading" && (
                            <ToolLoadingState
                                message="SWOT analyse wordt gegenereerd..."
                                subMessage={`${companyName} in ${industry}`}
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
                                            <p className="font-semibold text-white">SWOT Analyse voltooid voor {data.companyName}</p>
                                            <p className="text-sm text-zinc-400">
                                                {data.totalStrengths + data.totalWeaknesses + data.totalOpportunities + data.totalThreats} punten geïdentificeerd
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4 text-amber-400" />
                                        Samenvatting
                                    </h3>
                                    <p className="text-zinc-300 leading-relaxed">{data.summary}</p>
                                </div>

                                {/* SWOT Grid */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <SwotQuadrant type="strengths" items={data.strengths} />
                                    <SwotQuadrant type="weaknesses" items={data.weaknesses} />
                                    <SwotQuadrant type="opportunities" items={data.opportunities} />
                                    <SwotQuadrant type="threats" items={data.threats} />
                                </div>

                                {/* Recommendations */}
                                {data.recommendations && data.recommendations.length > 0 && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-indigo-400" />
                                            Strategische Aanbevelingen
                                        </h3>
                                        <div className="space-y-4">
                                            {data.recommendations.map((rec, i) => {
                                                const timeframe = TIMEFRAME_CONFIG[rec.timeframe];
                                                return (
                                                    <div key={i} className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <h4 className="font-semibold text-white flex items-center gap-2">
                                                                <span className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 text-xs font-bold">
                                                                    {i + 1}
                                                                </span>
                                                                {rec.title}
                                                            </h4>
                                                            <span className="px-2 py-1 bg-zinc-900/50 rounded text-xs text-zinc-400 whitespace-nowrap">
                                                                {timeframe.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-zinc-300 text-sm mb-2">{rec.description}</p>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <ChevronRight className="w-4 h-4 text-indigo-400" />
                                                            <span className="text-indigo-300">{rec.action}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-emerald-400">{data.totalStrengths}</p>
                                        <p className="text-xs text-zinc-400">Sterke punten</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-red-400">{data.totalWeaknesses}</p>
                                        <p className="text-xs text-zinc-400">Zwakke punten</p>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-blue-400">{data.totalOpportunities}</p>
                                        <p className="text-xs text-zinc-400">Kansen</p>
                                    </div>
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-amber-400">{data.totalThreats}</p>
                                        <p className="text-xs text-zinc-400">Bedreigingen</p>
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
                                <h3 className="font-semibold text-white">SWOT Tips</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">1.</span>
                                    Wees eerlijk over zwakke punten
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">2.</span>
                                    Focus op concrete, specifieke punten
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">3.</span>
                                    Update je SWOT regelmatig
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">4.</span>
                                    Koppel sterke punten aan kansen
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">5.</span>
                                    Maak actieplannen voor zwaktes
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30 p-5">
                            <h3 className="font-semibold text-white mb-3">Wat is SWOT?</h3>
                            <div className="space-y-3 text-sm text-zinc-400">
                                <p><strong className="text-emerald-400">S</strong>trengths - Interne sterke punten</p>
                                <p><strong className="text-red-400">W</strong>eaknesses - Interne zwakke punten</p>
                                <p><strong className="text-blue-400">O</strong>pportunities - Externe kansen</p>
                                <p><strong className="text-amber-400">T</strong>hreats - Externe bedreigingen</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <h3 className="font-semibold text-white mb-3">Prioriteit Niveaus</h3>
                            <div className="space-y-2 text-sm">
                                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
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
