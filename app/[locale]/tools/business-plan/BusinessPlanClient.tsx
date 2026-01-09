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
    FileSpreadsheet,
    AlertCircle,
    CheckCircle2,
    Lightbulb,
    Building2,
    Target,
    TrendingUp,
    Users,
    DollarSign,
    BarChart3,
    Rocket,
    ChevronDown,
    ChevronUp
} from "lucide-react";

interface BusinessPlanResult {
    executiveSummary: string;
    companyDescription: string;
    marketAnalysis: {
        targetMarket: string;
        marketSize: string;
        trends: string[];
        competitors: string[];
    };
    productsServices: string;
    marketingStrategy: {
        positioning: string;
        channels: string[];
        tactics: string[];
    };
    operationalPlan: string;
    financialProjections: {
        revenue: string;
        costs: string;
        profitability: string;
        fundingRequirements?: string;
    };
    milestones: Array<{
        milestone: string;
        timeline: string;
    }>;
    riskAnalysis: Array<{
        risk: string;
        mitigation: string;
    }>;
    companyName: string;
    planType: string;
    stage: string;
    generatedAt: string;
    processingTime?: number;
}

const PLAN_TYPES = [
    { value: "startup", label: "Startup Plan", description: "Voor nieuwe ondernemingen" },
    { value: "bank_loan", label: "Bankfinanciering", description: "Voor kredietaanvragen" },
    { value: "investor", label: "Investeerders", description: "Voor funding rondes" },
    { value: "internal", label: "Intern Plan", description: "Voor strategische planning" }
];

const STAGES = [
    { value: "idea", label: "Idee fase" },
    { value: "mvp", label: "MVP / Prototype" },
    { value: "early_revenue", label: "Eerste omzet" },
    { value: "growth", label: "Groei fase" },
    { value: "scaling", label: "Opschaling" }
];

const TEAM_SIZES = [
    { value: "solo", label: "Solo ondernemer" },
    { value: "2-5", label: "2-5 medewerkers" },
    { value: "6-10", label: "6-10 medewerkers" },
    { value: "11-50", label: "11-50 medewerkers" },
    { value: "50+", label: "50+ medewerkers" }
];

export default function BusinessPlanClient() {
    const toolMetadata = getToolBySlug("business-plan");

    // Form state
    const [companyName, setCompanyName] = useState("");
    const [businessIdea, setBusinessIdea] = useState("");
    const [targetMarket, setTargetMarket] = useState("");
    const [productService, setProductService] = useState("");
    const [revenueModel, setRevenueModel] = useState("");
    const [fundingNeeded, setFundingNeeded] = useState("");
    const [industry, setIndustry] = useState("");
    const [teamSize, setTeamSize] = useState<string>("solo");
    const [stage, setStage] = useState<string>("idea");
    const [planType, setPlanType] = useState<string>("investor");

    // UI state
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["executive"]));

    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<BusinessPlanResult>("business-plan");

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess, reset } = usePaywallTool({
        apiEndpoint: "/api/v1/consulting/business-plan",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim().length < 1 || businessIdea.trim().length < 50) return;
        execute({
            companyName,
            businessIdea,
            targetMarket,
            productService,
            revenueModel,
            fundingNeeded: fundingNeeded || undefined,
            industry: industry || undefined,
            teamSize,
            stage,
            planType
        });
    };

    const data = state.data as BusinessPlanResult | undefined;

    const handleSaveToHistory = useCallback(() => {
        if (data) {
            saveToHistory(
                {
                    companyName: data.companyName,
                    planType: data.planType,
                    stage: data.stage
                },
                data,
                ["business-plan", data.planType, data.stage]
            );
        }
    }, [data, saveToHistory]);

    const handleLoadHistory = useCallback((entry: { result: BusinessPlanResult }) => {
        const historyData = entry.result;
        setCompanyName(historyData.companyName);
        setPlanType(historyData.planType);
        setStage(historyData.stage);
    }, []);

    const handleApplyTemplate = (templateData: Record<string, unknown>) => {
        if (templateData.companyName) setCompanyName(templateData.companyName as string);
        if (templateData.businessIdea) setBusinessIdea(templateData.businessIdea as string);
        if (templateData.targetMarket) setTargetMarket(templateData.targetMarket as string);
        if (templateData.productService) setProductService(templateData.productService as string);
        if (templateData.revenueModel) setRevenueModel(templateData.revenueModel as string);
        if (templateData.planType) setPlanType(templateData.planType as string);
        if (templateData.stage) setStage(templateData.stage as string);
        if (templateData.teamSize) setTeamSize(templateData.teamSize as string);
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(section)) {
                newSet.delete(section);
            } else {
                newSet.add(section);
            }
            return newSet;
        });
    };

    const handleExportPDF = async () => {
        if (!data) return;
        const sections = [
            {
                title: "Executive Summary",
                content: data.executiveSummary
            },
            {
                title: "Bedrijfsomschrijving",
                content: data.companyDescription
            },
            {
                title: "Marktanalyse",
                content: `Doelmarkt: ${data.marketAnalysis.targetMarket}\n\nMarktgrootte: ${data.marketAnalysis.marketSize}\n\nTrends:\n${data.marketAnalysis.trends.map(t => `• ${t}`).join("\n")}\n\nConcurrenten:\n${data.marketAnalysis.competitors.map(c => `• ${c}`).join("\n")}`
            },
            {
                title: "Producten & Diensten",
                content: data.productsServices
            },
            {
                title: "Marketing Strategie",
                content: `Positionering: ${data.marketingStrategy.positioning}\n\nKanalen:\n${data.marketingStrategy.channels.map(c => `• ${c}`).join("\n")}\n\nTactieken:\n${data.marketingStrategy.tactics.map(t => `• ${t}`).join("\n")}`
            },
            {
                title: "Operationeel Plan",
                content: data.operationalPlan
            },
            {
                title: "Financiële Projecties",
                content: `Omzet: ${data.financialProjections.revenue}\n\nKosten: ${data.financialProjections.costs}\n\nWinstgevendheid: ${data.financialProjections.profitability}${data.financialProjections.fundingRequirements ? `\n\nFinancieringsbehoefte: ${data.financialProjections.fundingRequirements}` : ""}`
            },
            {
                title: "Mijlpalen",
                content: data.milestones.map(m => `${m.milestone} - ${m.timeline}`).join("\n")
            },
            {
                title: "Risico Analyse",
                content: data.riskAnalysis.map(r => `Risico: ${r.risk}\nMitigatie: ${r.mitigation}`).join("\n\n")
            }
        ];

        const result = await exportToPDFReport(
            { sections },
            {
                title: `Business Plan: ${data.companyName}`,
                subtitle: `${PLAN_TYPES.find(t => t.value === data.planType)?.label || data.planType} - ${STAGES.find(s => s.value === data.stage)?.label || data.stage}`,
                filename: `business-plan-${data.companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
            }
        );
        downloadExport(result);
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    const SectionCard = ({
        id,
        title,
        icon: Icon,
        children
    }: {
        id: string;
        title: string;
        icon: React.ElementType;
        children: React.ReactNode
    }) => {
        const isExpanded = expandedSections.has(id);
        return (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <button
                    onClick={() => toggleSection(id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Icon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="font-semibold text-white">{title}</h3>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-zinc-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-400" />
                    )}
                </button>
                {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-zinc-800">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                            <FileSpreadsheet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                            <p className="text-zinc-400 text-sm">Genereer een professioneel businessplan met AI</p>
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
                                <p className="text-zinc-500">{result.planType} • {result.stage}</p>
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
                                    toolId="business-plan"
                                    onSelectTemplate={handleApplyTemplate}
                                    currentData={{
                                        companyName,
                                        businessIdea,
                                        targetMarket,
                                        productService,
                                        revenueModel,
                                        planType,
                                        stage,
                                        teamSize
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
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="Bijv. TechStart B.V."
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
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="Bijv. SaaS / E-commerce / Consultancy"
                                        />
                                    </div>
                                </div>

                                {/* Business Idea */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        <Rocket className="w-4 h-4 inline mr-1" />
                                        Business Idee
                                    </label>
                                    <textarea
                                        value={businessIdea}
                                        onChange={(e) => setBusinessIdea(e.target.value)}
                                        rows={4}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                        placeholder="Beschrijf je bedrijfsidee in detail. Wat is het probleem dat je oplost? Wat maakt jouw aanpak uniek?"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {businessIdea.length}/5000 tekens (min. 50)
                                    </p>
                                </div>

                                {/* Target Market */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        <Target className="w-4 h-4 inline mr-1" />
                                        Doelmarkt
                                    </label>
                                    <textarea
                                        value={targetMarket}
                                        onChange={(e) => setTargetMarket(e.target.value)}
                                        rows={2}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                        placeholder="Wie zijn je ideale klanten? Beschrijf demografie, behoeften en pijnpunten."
                                    />
                                </div>

                                {/* Product/Service */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Product / Dienst
                                    </label>
                                    <textarea
                                        value={productService}
                                        onChange={(e) => setProductService(e.target.value)}
                                        rows={3}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                        placeholder="Beschrijf je product of dienst in detail. Wat zijn de belangrijkste features en voordelen?"
                                    />
                                </div>

                                {/* Revenue Model */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-1" />
                                        Verdienmodel
                                    </label>
                                    <textarea
                                        value={revenueModel}
                                        onChange={(e) => setRevenueModel(e.target.value)}
                                        rows={2}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                        placeholder="Hoe verdien je geld? Subscripties, eenmalige verkoop, commissies, etc."
                                    />
                                </div>

                                {/* Plan Type, Stage, Team Size */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Plan Type
                                        </label>
                                        <select
                                            value={planType}
                                            onChange={(e) => setPlanType(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        >
                                            {PLAN_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Fase
                                        </label>
                                        <select
                                            value={stage}
                                            onChange={(e) => setStage(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        >
                                            {STAGES.map(s => (
                                                <option key={s.value} value={s.value}>
                                                    {s.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            <Users className="w-4 h-4 inline mr-1" />
                                            Team grootte
                                        </label>
                                        <select
                                            value={teamSize}
                                            onChange={(e) => setTeamSize(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        >
                                            {TEAM_SIZES.map(size => (
                                                <option key={size.value} value={size.value}>
                                                    {size.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Funding */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Financieringsbehoefte (optioneel)
                                    </label>
                                    <input
                                        type="text"
                                        value={fundingNeeded}
                                        onChange={(e) => setFundingNeeded(e.target.value)}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Bijv. €250.000 voor 18 maanden runway"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={state.status === "loading" || companyName.trim().length < 1 || businessIdea.trim().length < 50}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <FileSpreadsheet className="w-5 h-5" />
                                    {state.status === "loading" ? "Bezig met genereren..." :
                                     companyName.trim().length < 1 ? "Vul bedrijfsnaam in" :
                                     businessIdea.trim().length < 50 ? "Business idee te kort (min. 50 tekens)" :
                                     "Genereer Business Plan"}
                                </button>
                            </form>
                        </div>

                        {/* Loading State */}
                        {state.status === "loading" && (
                            <ToolLoadingState
                                message="Business plan wordt gegenereerd..."
                                subMessage={`${PLAN_TYPES.find(t => t.value === planType)?.label} voor ${companyName}`}
                                estimatedTime={20}
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
                                            <p className="font-semibold text-white">Business Plan gegenereerd voor {data.companyName}</p>
                                            <p className="text-sm text-zinc-400">
                                                {PLAN_TYPES.find(t => t.value === data.planType)?.label} • {STAGES.find(s => s.value === data.stage)?.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sections */}
                                <div className="space-y-3">
                                    <SectionCard id="executive" title="Executive Summary" icon={FileSpreadsheet}>
                                        <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{data.executiveSummary}</p>
                                    </SectionCard>

                                    <SectionCard id="company" title="Bedrijfsomschrijving" icon={Building2}>
                                        <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{data.companyDescription}</p>
                                    </SectionCard>

                                    <SectionCard id="market" title="Marktanalyse" icon={BarChart3}>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-400 mb-1">Doelmarkt</h4>
                                                <p className="text-zinc-300">{data.marketAnalysis.targetMarket}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-400 mb-1">Marktgrootte</h4>
                                                <p className="text-zinc-300">{data.marketAnalysis.marketSize}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-400 mb-2">Trends</h4>
                                                <ul className="space-y-1">
                                                    {data.marketAnalysis.trends.map((trend, i) => (
                                                        <li key={i} className="text-zinc-300 flex items-start gap-2">
                                                            <span className="text-emerald-400">•</span>
                                                            {trend}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </SectionCard>

                                    <SectionCard id="product" title="Producten & Diensten" icon={Rocket}>
                                        <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{data.productsServices}</p>
                                    </SectionCard>

                                    <SectionCard id="marketing" title="Marketing Strategie" icon={TrendingUp}>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-400 mb-1">Positionering</h4>
                                                <p className="text-zinc-300">{data.marketingStrategy.positioning}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-400 mb-2">Kanalen</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.marketingStrategy.channels.map((channel, i) => (
                                                        <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm">
                                                            {channel}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </SectionCard>

                                    <SectionCard id="financial" title="Financiële Projecties" icon={DollarSign}>
                                        <div className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                                    <h4 className="text-sm font-medium text-zinc-400 mb-1">Omzet</h4>
                                                    <p className="text-zinc-300">{data.financialProjections.revenue}</p>
                                                </div>
                                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                                    <h4 className="text-sm font-medium text-zinc-400 mb-1">Kosten</h4>
                                                    <p className="text-zinc-300">{data.financialProjections.costs}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-400 mb-1">Winstgevendheid</h4>
                                                <p className="text-zinc-300">{data.financialProjections.profitability}</p>
                                            </div>
                                            {data.financialProjections.fundingRequirements && (
                                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                                    <h4 className="text-sm font-medium text-emerald-400 mb-1">Financieringsbehoefte</h4>
                                                    <p className="text-zinc-300">{data.financialProjections.fundingRequirements}</p>
                                                </div>
                                            )}
                                        </div>
                                    </SectionCard>

                                    <SectionCard id="milestones" title="Mijlpalen" icon={Target}>
                                        <div className="space-y-3">
                                            {data.milestones.map((milestone, i) => (
                                                <div key={i} className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg">
                                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-sm">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium">{milestone.milestone}</p>
                                                        <p className="text-sm text-zinc-400">{milestone.timeline}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </SectionCard>

                                    <SectionCard id="risks" title="Risico Analyse" icon={AlertCircle}>
                                        <div className="space-y-3">
                                            {data.riskAnalysis.map((risk, i) => (
                                                <div key={i} className="p-3 bg-zinc-800/50 rounded-lg">
                                                    <p className="text-white font-medium mb-1">{risk.risk}</p>
                                                    <p className="text-sm text-zinc-400">
                                                        <span className="text-emerald-400">Mitigatie:</span> {risk.mitigation}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </SectionCard>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Tips Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                                <h3 className="font-semibold text-white">Business Plan Tips</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">1.</span>
                                    Wees specifiek over je doelmarkt
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">2.</span>
                                    Onderbouw financiële projecties
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">3.</span>
                                    Ken je concurrentie
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">4.</span>
                                    Definieer duidelijke mijlpalen
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">5.</span>
                                    Wees eerlijk over risico&apos;s
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30 p-5">
                            <h3 className="font-semibold text-white mb-3">Plan Types</h3>
                            <div className="space-y-3 text-sm">
                                {PLAN_TYPES.map(type => (
                                    <div key={type.value}>
                                        <p className="text-white font-medium">{type.label}</p>
                                        <p className="text-zinc-400 text-xs">{type.description}</p>
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
