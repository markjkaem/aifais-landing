"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { useResultHistory } from "@/hooks/useResultHistory";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import {ResultHistory} from "@/app/Components/tools/ResultHistory";
import TemplateSelector from "@/app/Components/tools/TemplateSelector";
import { ToolLoadingState } from "@/app/Components/tools/ToolLoadingState";
import { ToolActionBar } from "@/app/Components/tools/ToolActionBar";
import { exportToPDFReport, downloadExport, exportToCSV } from "@/lib/export";
import {
    Target,
    AlertCircle,
    CheckCircle2,
    Flame,
    Thermometer,
    Snowflake,
    Copy,
    Check,
    Lightbulb,
    Mail,
    Clock,
    TrendingUp,
    Building2,
    Users,
    DollarSign,
    MousePointer,
    ChevronDown,
    ChevronUp,
    Calendar,
    ArrowRight,
    AlertTriangle
} from "lucide-react";

interface Factor {
    score: number;
    reason: string;
}

interface EmailTemplate {
    subject: string;
    body: string;
}

interface LeadScorerResult {
    score: number;
    tier: "cold" | "warm" | "hot";
    companyName: string;
    factors: Record<string, Factor>;
    recommendations: string[];
    nextAction: {
        action: string;
        priority: string;
        deadline?: string;
    };
    emailTemplates?: {
        initial?: EmailTemplate;
        followUp?: EmailTemplate;
    };
    competitorInsights?: string[];
    idealTiming?: {
        bestDays: string[];
        bestTimes: string[];
        avoidTimes?: string[];
    };
    analyzedAt: string;
    processingTime?: number;
    confidence?: number;
}

const TIER_CONFIG = {
    hot: {
        label: "Hot Lead",
        icon: <Flame className="w-5 h-5" />,
        color: "text-red-400",
        bgColor: "bg-red-500/20 border-red-500/30",
        gradient: "from-red-500 to-orange-500"
    },
    warm: {
        label: "Warm Lead",
        icon: <Thermometer className="w-5 h-5" />,
        color: "text-orange-400",
        bgColor: "bg-orange-500/20 border-orange-500/30",
        gradient: "from-orange-500 to-amber-500"
    },
    cold: {
        label: "Cold Lead",
        icon: <Snowflake className="w-5 h-5" />,
        color: "text-blue-400",
        bgColor: "bg-blue-500/20 border-blue-500/30",
        gradient: "from-blue-500 to-cyan-500"
    }
};

const FACTOR_ICONS: Record<string, React.ReactNode> = {
    companyFit: <Building2 className="w-4 h-4" />,
    engagement: <MousePointer className="w-4 h-4" />,
    timing: <Clock className="w-4 h-4" />,
    budget: <DollarSign className="w-4 h-4" />,
    decisionPower: <Users className="w-4 h-4" />
};

export default function LeadScorerClient() {
    const toolMetadata = getToolBySlug("lead-scorer");

    // Form state
    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState<"1-10" | "11-50" | "51-200" | "201-500" | "500+">("11-50");
    const [budget, setBudget] = useState<"unknown" | "low" | "medium" | "high">("unknown");
    const [websiteVisits, setWebsiteVisits] = useState(0);
    const [emailOpens, setEmailOpens] = useState(0);
    const [demoRequested, setDemoRequested] = useState(false);
    const [downloadedContent, setDownloadedContent] = useState(false);
    const [notes, setNotes] = useState("");
    const [generateEmail, setGenerateEmail] = useState(true);

    // UI state
    const [expandedSection, setExpandedSection] = useState<string | null>("factors");
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<LeadScorerResult>("lead-scorer");

    // Paywall
    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess, reset } = usePaywallTool({
        apiEndpoint: "/api/v1/sales/lead-scorer",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim().length < 2) return;
        execute({
            companyName,
            industry,
            companySize,
            budget,
            engagement: {
                websiteVisits,
                emailOpens,
                demoRequested,
                downloadedContent
            },
            notes,
            generateEmail
        });
    };

    const data = state.data as LeadScorerResult | undefined;

    const handleSaveToHistory = useCallback(() => {
        if (data) {
            saveToHistory(
                {
                    companyName: data.companyName,
                    industry: industry,
                    tier: data.tier
                },
                data,
                ["lead-scorer", data.tier]
            );
        }
    }, [data, saveToHistory]);

    const handleLoadHistory = useCallback((entry: any) => {
        const historyData = entry.result as LeadScorerResult;
        setCompanyName(historyData.companyName);
    }, []);

    const handleApplyTemplate = (templateData: any) => {
        if (templateData.companyName) setCompanyName(templateData.companyName);
        if (templateData.industry) setIndustry(templateData.industry);
        if (templateData.companySize) setCompanySize(templateData.companySize);
        if (templateData.budget) setBudget(templateData.budget);
        if (templateData.notes) setNotes(templateData.notes);
    };

    const copyEmailTemplate = async (template: EmailTemplate, type: string) => {
        const text = `Subject: ${template.subject}\n\n${template.body}`;
        await navigator.clipboard.writeText(text);
        setCopiedEmail(type);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    const handleExportPDF = async () => {
        if (!data) return;
        const tierConfig = TIER_CONFIG[data.tier];

        const sections = [
            {
                title: "Lead Overzicht",
                content: `Bedrijf: ${data.companyName}\nScore: ${data.score}/100\nTier: ${tierConfig.label}\nGeanalyseerd: ${new Date(data.analyzedAt).toLocaleString('nl-NL')}`
            },
            {
                title: "Score Factoren",
                content: Object.entries(data.factors).map(([key, factor]) =>
                    `${key}: ${factor.score}/100\n   ${factor.reason}`
                ).join('\n\n')
            },
            {
                title: "Aanbevelingen",
                content: data.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')
            },
            {
                title: "Volgende Stap",
                content: `Actie: ${data.nextAction.action}\nPrioriteit: ${data.nextAction.priority}${data.nextAction.deadline ? `\nDeadline: ${data.nextAction.deadline}` : ''}`
            }
        ];

        if (data.emailTemplates?.initial) {
            sections.push({
                title: "Email Template - Eerste Contact",
                content: `Onderwerp: ${data.emailTemplates.initial.subject}\n\n${data.emailTemplates.initial.body}`
            });
        }

        const result = await exportToPDFReport(
            { sections },
            {
                title: `Lead Score Report: ${data.companyName}`,
                subtitle: `${tierConfig.label} - Score: ${data.score}/100`,
                filename: `lead-score-${data.companyName.toLowerCase().replace(/\s+/g, '-')}`
            }
        );
        downloadExport(result);
    };

    const handleExportCSV = async () => {
        if (!data) return;
        const exportData = [{
            bedrijf: data.companyName,
            score: data.score,
            tier: data.tier,
            ...Object.fromEntries(
                Object.entries(data.factors).map(([key, factor]) => [`${key}Score`, factor.score])
            ),
            aanbevelingen: data.recommendations.join('; '),
            volgendeActie: data.nextAction.action,
            prioriteit: data.nextAction.priority,
            geanalyseerd: data.analyzedAt
        }];
        const columns = [
            { key: "bedrijf", label: "Bedrijf" },
            { key: "score", label: "Score" },
            { key: "tier", label: "Tier" },
            { key: "volgendeActie", label: "Volgende Actie" }
        ];
        const result = exportToCSV(exportData, columns, { filename: `lead-score-${data.companyName.toLowerCase().replace(/\s+/g, '-')}` });
        downloadExport(result);
    };

    const toggleSection = (section: string) => {
        setExpandedSection(prev => prev === section ? null : section);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 60) return "text-amber-400";
        return "text-red-400";
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                            <p className="text-zinc-400 text-sm">Analyseer en score leads met AI</p>
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
                                <p className="text-zinc-500">Score: {result.score} • {result.tier}</p>
                            </div>
                        )}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            {/* Template selector */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">Lead Informatie</h2>
                                <TemplateSelector
                                    toolId="lead-scorer"
                                    onSelectTemplate={handleApplyTemplate}
                                    currentData={{
                                        companyName,
                                        industry,
                                        companySize,
                                        budget,
                                        notes
                                    }}
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Company Info */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Bedrijfsnaam
                                        </label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="bijv. Innovatie Partners BV"
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
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="bijv. Consultancy, Tech, Retail"
                                        />
                                    </div>
                                </div>

                                {/* Company Details */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Bedrijfsgrootte
                                        </label>
                                        <select
                                            value={companySize}
                                            onChange={(e) => setCompanySize(e.target.value as any)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        >
                                            <option value="1-10">1-10 medewerkers</option>
                                            <option value="11-50">11-50 medewerkers</option>
                                            <option value="51-200">51-200 medewerkers</option>
                                            <option value="201-500">201-500 medewerkers</option>
                                            <option value="500+">500+ medewerkers</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Budget Indicatie
                                        </label>
                                        <select
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value as any)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        >
                                            <option value="unknown">Onbekend</option>
                                            <option value="low">Laag (&lt;10k)</option>
                                            <option value="medium">Gemiddeld (10k-50k)</option>
                                            <option value="high">Hoog (&gt;50k)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Engagement Metrics */}
                                <div className="p-4 bg-zinc-800/50 rounded-xl space-y-4">
                                    <h3 className="text-sm font-medium text-zinc-300">Engagement Indicatoren</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-zinc-400 mb-2">
                                                Website bezoeken: <span className="text-emerald-400">{websiteVisits}</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={websiteVisits}
                                                onChange={(e) => setWebsiteVisits(Number(e.target.value))}
                                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-400 mb-2">
                                                Email opens: <span className="text-emerald-400">{emailOpens}</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="50"
                                                value={emailOpens}
                                                onChange={(e) => setEmailOpens(Number(e.target.value))}
                                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={demoRequested}
                                                onChange={(e) => setDemoRequested(e.target.checked)}
                                                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-zinc-300">Demo aangevraagd</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={downloadedContent}
                                                onChange={(e) => setDownloadedContent(e.target.checked)}
                                                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-zinc-300">Content gedownload</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Notities (optioneel)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[80px] resize-none"
                                        placeholder="Extra context over de lead, eerdere gesprekken, etc..."
                                    />
                                </div>

                                {/* Options */}
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={generateEmail}
                                            onChange={(e) => setGenerateEmail(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-zinc-300">Email templates genereren</span>
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={state.status === "loading" || companyName.trim().length < 2 || !industry.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-teal-700 transition-all"
                                >
                                    {state.status === "loading" ? "Bezig met analyseren..." :
                                     companyName.trim().length < 2 ? "Bedrijfsnaam te kort" :
                                     !industry.trim() ? "Industrie is verplicht" :
                                     "Score Lead"}
                                </button>
                            </form>
                        </div>

                        {/* Loading State */}
                        {state.status === "loading" && (
                            <ToolLoadingState
                                message="Lead wordt geanalyseerd..."
                                subMessage={companyName}
                                estimatedTime={8}
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
                                    exportFormats={["pdf", "csv"]}
                                    onExport={(format) => format === "pdf" ? handleExportPDF() : handleExportCSV()}
                                    onSaveToHistory={handleSaveToHistory}
                                    onReset={reset}
                                />

                                {/* Score Card */}
                                <div className={`bg-gradient-to-br ${TIER_CONFIG[data.tier].gradient} p-1 rounded-2xl`}>
                                    <div className="bg-zinc-900 rounded-xl p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <svg className="w-24 h-24 transform -rotate-90">
                                                        <circle
                                                            cx="48"
                                                            cy="48"
                                                            r="40"
                                                            stroke="currentColor"
                                                            strokeWidth="8"
                                                            fill="none"
                                                            className="text-zinc-800"
                                                        />
                                                        <circle
                                                            cx="48"
                                                            cy="48"
                                                            r="40"
                                                            stroke="url(#scoreGradient)"
                                                            strokeWidth="8"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${data.score * 2.51} 251`}
                                                        />
                                                        <defs>
                                                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor={data.tier === "hot" ? "#ef4444" : data.tier === "warm" ? "#f97316" : "#3b82f6"} />
                                                                <stop offset="100%" stopColor={data.tier === "hot" ? "#f97316" : data.tier === "warm" ? "#fbbf24" : "#06b6d4"} />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-3xl font-bold text-white">{data.score}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{data.companyName}</h3>
                                                    <div className={`flex items-center gap-2 mt-1 ${TIER_CONFIG[data.tier].color}`}>
                                                        {TIER_CONFIG[data.tier].icon}
                                                        <span className="font-semibold">{TIER_CONFIG[data.tier].label}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {data.confidence && (
                                                <div className="text-right">
                                                    <span className="text-xs text-zinc-500">Betrouwbaarheid</span>
                                                    <p className="text-lg font-semibold text-white">{data.confidence}%</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Score Factors */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                    <button
                                        onClick={() => toggleSection("factors")}
                                        className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                                            <span className="font-semibold text-white">Score Factoren</span>
                                        </div>
                                        {expandedSection === "factors" ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {expandedSection === "factors" && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 pt-0 space-y-3">
                                                    {Object.entries(data.factors).map(([key, factor]) => (
                                                        <div key={key} className="p-3 bg-zinc-800/50 rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-zinc-400">{FACTOR_ICONS[key] || <Target className="w-4 h-4" />}</span>
                                                                    <span className="text-sm font-medium text-zinc-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                                </div>
                                                                <span className={`font-bold ${getScoreColor(factor.score)}`}>{factor.score}/100</span>
                                                            </div>
                                                            <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${factor.score}%` }}
                                                                    className={`h-full rounded-full ${
                                                                        factor.score >= 80 ? 'bg-emerald-500' :
                                                                        factor.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                                                    }`}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-zinc-500 mt-2">{factor.reason}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Next Action */}
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <ArrowRight className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-white">Volgende Stap</h4>
                                            <p className="text-zinc-300 mt-1">{data.nextAction.action}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    data.nextAction.priority === "high" ? "bg-red-500/20 text-red-400" :
                                                    data.nextAction.priority === "medium" ? "bg-amber-500/20 text-amber-400" :
                                                    "bg-blue-500/20 text-blue-400"
                                                }`}>
                                                    {data.nextAction.priority} prioriteit
                                                </span>
                                                {data.nextAction.deadline && (
                                                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {data.nextAction.deadline}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb className="w-5 h-5 text-amber-400" />
                                        <h4 className="font-semibold text-white">Aanbevelingen</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {data.recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Email Templates */}
                                {data.emailTemplates && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                        <button
                                            onClick={() => toggleSection("emails")}
                                            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-5 h-5 text-blue-400" />
                                                <span className="font-semibold text-white">Email Templates</span>
                                            </div>
                                            {expandedSection === "emails" ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                                        </button>
                                        <AnimatePresence>
                                            {expandedSection === "emails" && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: "auto" }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 space-y-4">
                                                        {data.emailTemplates.initial && (
                                                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-medium text-zinc-300">Eerste Contact</span>
                                                                    <button
                                                                        onClick={() => copyEmailTemplate(data.emailTemplates!.initial!, "initial")}
                                                                        className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
                                                                    >
                                                                        {copiedEmail === "initial" ? (
                                                                            <Check className="w-4 h-4 text-emerald-400" />
                                                                        ) : (
                                                                            <Copy className="w-4 h-4 text-zinc-400" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs text-zinc-500 mb-1">Onderwerp: {data.emailTemplates.initial.subject}</p>
                                                                <p className="text-sm text-zinc-400 whitespace-pre-wrap">{data.emailTemplates.initial.body}</p>
                                                            </div>
                                                        )}
                                                        {data.emailTemplates.followUp && (
                                                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-medium text-zinc-300">Follow-up</span>
                                                                    <button
                                                                        onClick={() => copyEmailTemplate(data.emailTemplates!.followUp!, "followUp")}
                                                                        className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
                                                                    >
                                                                        {copiedEmail === "followUp" ? (
                                                                            <Check className="w-4 h-4 text-emerald-400" />
                                                                        ) : (
                                                                            <Copy className="w-4 h-4 text-zinc-400" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs text-zinc-500 mb-1">Onderwerp: {data.emailTemplates.followUp.subject}</p>
                                                                <p className="text-sm text-zinc-400 whitespace-pre-wrap">{data.emailTemplates.followUp.body}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Timing & Competitor Insights */}
                                {(data.idealTiming || data.competitorInsights) && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {data.idealTiming && (
                                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Clock className="w-5 h-5 text-cyan-400" />
                                                    <h4 className="font-semibold text-white">Beste Contact Momenten</h4>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <p className="text-zinc-400">
                                                        <span className="text-zinc-300">Dagen:</span> {data.idealTiming.bestDays.join(", ")}
                                                    </p>
                                                    <p className="text-zinc-400">
                                                        <span className="text-zinc-300">Tijden:</span> {data.idealTiming.bestTimes.join(", ")}
                                                    </p>
                                                    {data.idealTiming.avoidTimes && (
                                                        <p className="text-zinc-500">
                                                            <span className="text-red-400">Vermijd:</span> {data.idealTiming.avoidTimes.join(", ")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {data.competitorInsights && (
                                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                                                    <h4 className="font-semibold text-white">Concurrentie Inzichten</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {data.competitorInsights.map((insight, i) => (
                                                        <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                                                            <span className="text-amber-400">•</span>
                                                            {insight}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Tips Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                                <h3 className="font-semibold text-white">Lead Scoring Tips</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">1.</span>
                                    Vul zoveel mogelijk velden in voor een nauwkeuriger score
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">2.</span>
                                    Hot leads hebben prioriteit - reageer binnen 24 uur
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">3.</span>
                                    Gebruik de email templates als startpunt
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">4.</span>
                                    Check de aanbevelingen voor je benadering
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30 p-5">
                            <h3 className="font-semibold text-white mb-3">Score Betekenis</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <Flame className="w-4 h-4" />
                                        <span className="text-sm font-medium">Hot (80-100)</span>
                                    </div>
                                    <span className="text-xs text-zinc-500">Direct benaderen</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-orange-400">
                                        <Thermometer className="w-4 h-4" />
                                        <span className="text-sm font-medium">Warm (50-79)</span>
                                    </div>
                                    <span className="text-xs text-zinc-500">Binnen een week</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Snowflake className="w-4 h-4" />
                                        <span className="text-sm font-medium">Cold (0-49)</span>
                                    </div>
                                    <span className="text-xs text-zinc-500">Nurturing nodig</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <h3 className="font-semibold text-white mb-3">Engagement Indicatoren</h3>
                            <div className="space-y-2 text-sm text-zinc-400">
                                <p><span className="text-emerald-400">+20</span> Demo aangevraagd</p>
                                <p><span className="text-emerald-400">+15</span> Content gedownload</p>
                                <p><span className="text-emerald-400">+10</span> Hoog budget</p>
                                <p><span className="text-emerald-400">+5</span> Per 10 website bezoeken</p>
                                <p><span className="text-emerald-400">+3</span> Per email open</p>
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
