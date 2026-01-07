"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
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
    Presentation,
    AlertCircle,
    CheckCircle2,
    Copy,
    Check,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    Image,
    MessageSquare,
    GripVertical,
    Users,
    Briefcase,
    Target,
    TrendingUp,
    DollarSign,
    Rocket,
    UserCheck,
    Map,
    HandCoins,
    LayoutGrid,
    Play,
    FileDown
} from "lucide-react";

interface PitchSlide {
    slideNumber: number;
    title: string;
    type: string;
    content: string;
    bulletPoints?: string[];
    speakerNotes?: string;
    imageSuggestion?: string;
}

interface PitchDeckResult {
    slides: PitchSlide[];
    companyName: string;
    totalSlides: number;
    audienceType: string;
    generatedAt: string;
    processingTime?: number;
    confidence?: number;
}

const SLIDE_TYPE_ICONS: Record<string, React.ReactNode> = {
    title: <Presentation className="w-4 h-4" />,
    problem: <AlertCircle className="w-4 h-4" />,
    solution: <Lightbulb className="w-4 h-4" />,
    value_proposition: <Target className="w-4 h-4" />,
    market: <TrendingUp className="w-4 h-4" />,
    business_model: <DollarSign className="w-4 h-4" />,
    traction: <Rocket className="w-4 h-4" />,
    team: <Users className="w-4 h-4" />,
    roadmap: <Map className="w-4 h-4" />,
    ask: <HandCoins className="w-4 h-4" />,
    competition: <UserCheck className="w-4 h-4" />,
};

const SLIDE_TYPE_COLORS: Record<string, string> = {
    title: "from-violet-500 to-purple-600",
    problem: "from-red-500 to-rose-600",
    solution: "from-emerald-500 to-teal-600",
    value_proposition: "from-blue-500 to-cyan-600",
    market: "from-amber-500 to-orange-600",
    business_model: "from-green-500 to-emerald-600",
    traction: "from-pink-500 to-rose-600",
    team: "from-indigo-500 to-violet-600",
    roadmap: "from-cyan-500 to-blue-600",
    ask: "from-orange-500 to-red-600",
};

const AUDIENCE_OPTIONS = [
    { value: "investors", label: "Investeerders", icon: <HandCoins className="w-4 h-4" /> },
    { value: "customers", label: "Klanten", icon: <Users className="w-4 h-4" /> },
    { value: "partners", label: "Partners", icon: <Briefcase className="w-4 h-4" /> },
];

export default function PitchDeckClient() {
    const toolMetadata = getToolBySlug("pitch-deck");

    // Form state
    const [companyName, setCompanyName] = useState("");
    const [productService, setProductService] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [problemSolution, setProblemSolution] = useState("");
    const [uniqueValue, setUniqueValue] = useState("");
    const [askAmount, setAskAmount] = useState("");
    const [slideCount, setSlideCount] = useState(10);
    const [audienceType, setAudienceType] = useState<"investors" | "customers" | "partners">("investors");
    const [includeFinancials, setIncludeFinancials] = useState(false);

    // UI state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [viewMode, setViewMode] = useState<"grid" | "presentation">("grid");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [slides, setSlides] = useState<PitchSlide[]>([]);

    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<PitchDeckResult>("pitch-deck");

    // Paywall
    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess, reset } = usePaywallTool({
        apiEndpoint: "/api/v1/sales/pitch-deck",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim().length < 2 || productService.trim().length < 20) return;
        execute({
            companyName,
            productService,
            targetAudience,
            problemSolution,
            uniqueValue,
            askAmount: askAmount || undefined,
            slideCount,
            audienceType,
            includeFinancials
        });
    };

    const data = state.data as PitchDeckResult | undefined;

    // Sync slides when data changes
    if (data?.slides && slides.length === 0) {
        setSlides(data.slides);
    }

    const handleSaveToHistory = useCallback(() => {
        if (data) {
            saveToHistory(
                {
                    companyName: data.companyName,
                    audienceType: data.audienceType,
                    slideCount: slides.length
                },
                { ...data, slides },
                ["pitch-deck", data.audienceType]
            );
        }
    }, [data, slides, saveToHistory]);

    const handleLoadHistory = useCallback((entry: any) => {
        const historyData = entry.result as PitchDeckResult;
        setCompanyName(historyData.companyName);
        setSlides(historyData.slides);
    }, []);

    const handleApplyTemplate = (templateData: any) => {
        if (templateData.companyName) setCompanyName(templateData.companyName);
        if (templateData.productService) setProductService(templateData.productService);
        if (templateData.targetAudience) setTargetAudience(templateData.targetAudience);
        if (templateData.problemSolution) setProblemSolution(templateData.problemSolution);
        if (templateData.uniqueValue) setUniqueValue(templateData.uniqueValue);
        if (templateData.askAmount) setAskAmount(templateData.askAmount);
        if (templateData.slideCount) setSlideCount(templateData.slideCount);
        if (templateData.audienceType) setAudienceType(templateData.audienceType);
    };

    const copySlide = async (slide: PitchSlide, index: number) => {
        let text = `Slide ${slide.slideNumber}: ${slide.title}\n\n${slide.content}`;
        if (slide.bulletPoints?.length) {
            text += `\n\n${slide.bulletPoints.map(b => `• ${b}`).join('\n')}`;
        }
        if (slide.speakerNotes) {
            text += `\n\nSpeaker Notes:\n${slide.speakerNotes}`;
        }
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const copyAllSlides = async () => {
        if (!slides.length) return;
        const text = slides.map((slide, i) =>
            `=== Slide ${i + 1}: ${slide.title} ===\n\n${slide.content}\n${slide.bulletPoints?.length ? `\n${slide.bulletPoints.map(b => `• ${b}`).join('\n')}` : ''}${slide.speakerNotes ? `\n\nSpeaker Notes: ${slide.speakerNotes}` : ''}`
        ).join('\n\n---\n\n');
        await navigator.clipboard.writeText(text);
    };

    const handleExportPDF = async () => {
        if (!slides.length) return;
        const sections = slides.map((slide, i) => ({
            title: `Slide ${i + 1}: ${slide.title}`,
            content: `${slide.content}\n${slide.bulletPoints?.length ? `\n${slide.bulletPoints.map(b => `• ${b}`).join('\n')}` : ''}${slide.speakerNotes ? `\n\nSpeaker Notes:\n${slide.speakerNotes}` : ''}${slide.imageSuggestion ? `\n\nAfbeelding suggestie: ${slide.imageSuggestion}` : ''}`
        }));

        const result = await exportToPDFReport(
            { sections },
            {
                title: `Pitch Deck: ${data?.companyName || companyName}`,
                subtitle: `${slides.length} slides - ${audienceType}`,
                filename: `pitch-deck-${companyName.toLowerCase().replace(/\s+/g, '-')}`
            }
        );
        downloadExport(result);
    };

    const handleReset = () => {
        reset();
        setSlides([]);
        setCurrentSlide(0);
    };

    const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
    const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                            <Presentation className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                            <p className="text-zinc-400 text-sm">Genereer professionele pitch decks met AI</p>
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
                                <p className="text-zinc-500">{result.totalSlides} slides</p>
                            </div>
                        )}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form Panel */}
                    <div className={`${slides.length > 0 ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-6`}>
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            {/* Template selector */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">Pitch Details</h2>
                                <TemplateSelector
                                    toolId="pitch-deck"
                                    onSelectTemplate={handleApplyTemplate}
                                    currentData={{
                                        companyName,
                                        productService,
                                        targetAudience,
                                        problemSolution,
                                        uniqueValue,
                                        askAmount,
                                        slideCount,
                                        audienceType
                                    }}
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Company & Slide Count */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Bedrijfsnaam
                                        </label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                            placeholder="TechStartup BV"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Slides: <span className="text-violet-400">{slideCount}</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="15"
                                            value={slideCount}
                                            onChange={(e) => setSlideCount(Number(e.target.value))}
                                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500 mt-3"
                                        />
                                    </div>
                                </div>

                                {/* Audience Type */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Doelgroep presentatie
                                    </label>
                                    <div className="flex gap-2">
                                        {AUDIENCE_OPTIONS.map(option => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setAudienceType(option.value as any)}
                                                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 border ${
                                                    audienceType === option.value
                                                        ? 'bg-violet-500/20 text-violet-400 border-violet-500/50'
                                                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                                                }`}
                                            >
                                                {option.icon}
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Product/Service */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Product/Service
                                    </label>
                                    <textarea
                                        value={productService}
                                        onChange={(e) => setProductService(e.target.value)}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[80px] resize-none"
                                        placeholder="Wat bied je aan? Beschrijf je product of dienst..."
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">{productService.length}/5000 (min. 20)</p>
                                </div>

                                {/* Target Audience */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Doelgroep klanten
                                    </label>
                                    <input
                                        type="text"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        placeholder="MKB bedrijven met 10-100 medewerkers"
                                    />
                                </div>

                                {/* Problem & Solution */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Probleem & Oplossing
                                    </label>
                                    <textarea
                                        value={problemSolution}
                                        onChange={(e) => setProblemSolution(e.target.value)}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[80px] resize-none"
                                        placeholder="Welk probleem los je op en hoe?"
                                    />
                                </div>

                                {/* Unique Value */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Unieke Waarde
                                    </label>
                                    <textarea
                                        value={uniqueValue}
                                        onChange={(e) => setUniqueValue(e.target.value)}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[60px] resize-none"
                                        placeholder="Wat maakt jullie uniek ten opzichte van concurrenten?"
                                    />
                                </div>

                                {/* Ask Amount */}
                                {audienceType === "investors" && (
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Investeringsvraag (optioneel)
                                        </label>
                                        <input
                                            type="text"
                                            value={askAmount}
                                            onChange={(e) => setAskAmount(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                            placeholder="bijv. 500.000 voor 15% equity"
                                        />
                                    </div>
                                )}

                                {/* Options */}
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeFinancials}
                                            onChange={(e) => setIncludeFinancials(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-violet-500 focus:ring-violet-500"
                                        />
                                        <span className="text-sm text-zinc-300">Financiele projecties toevoegen</span>
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={state.status === "loading" || companyName.trim().length < 2 || productService.trim().length < 20}
                                    className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-600 hover:to-purple-700 transition-all"
                                >
                                    {state.status === "loading" ? "Bezig met genereren..." :
                                     companyName.trim().length < 2 ? "Bedrijfsnaam te kort" :
                                     productService.trim().length < 20 ? "Product beschrijving te kort (min. 20 tekens)" :
                                     "Genereer Pitch Deck"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className={`${slides.length > 0 ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-4`}>
                        {/* Loading State */}
                        {state.status === "loading" && (
                            <ToolLoadingState
                                message="Pitch deck wordt gegenereerd..."
                                subMessage={`${slideCount} slides voor ${companyName}`}
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
                        {slides.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Action Bar */}
                                <div className="flex items-center justify-between">
                                    <ToolActionBar
                                        exportFormats={["pdf"]}
                                        onExport={(format) => handleExportPDF()}
                                        copyText={slides.map(s => s.content).join("\n\n")}
                                        onSaveToHistory={handleSaveToHistory}
                                        onReset={handleReset}
                                    />
                                    <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded ${viewMode === "grid" ? "bg-zinc-700 text-white" : "text-zinc-400"}`}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("presentation")}
                                            className={`p-2 rounded ${viewMode === "presentation" ? "bg-zinc-700 text-white" : "text-zinc-400"}`}
                                        >
                                            <Play className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {slides.length} slides gegenereerd
                                                </p>
                                                <p className="text-sm text-zinc-400">
                                                    {data?.companyName} - {data?.audienceType}
                                                </p>
                                            </div>
                                        </div>
                                        {data?.confidence && (
                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                                                {data.confidence}% kwaliteit
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Presentation View */}
                                {viewMode === "presentation" && (
                                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                                        <div className={`aspect-video bg-gradient-to-br ${SLIDE_TYPE_COLORS[slides[currentSlide]?.type] || "from-violet-500 to-purple-600"} p-8 relative`}>
                                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-sm">
                                                    {currentSlide + 1} / {slides.length}
                                                </span>
                                            </div>
                                            <div className="h-full flex flex-col justify-center text-white">
                                                <div className="flex items-center gap-2 mb-4">
                                                    {SLIDE_TYPE_ICONS[slides[currentSlide]?.type] || <Presentation className="w-6 h-6" />}
                                                    <span className="text-sm opacity-80 uppercase tracking-wider">{slides[currentSlide]?.type?.replace('_', ' ')}</span>
                                                </div>
                                                <h2 className="text-4xl font-bold mb-6">{slides[currentSlide]?.title}</h2>
                                                <p className="text-xl opacity-90 mb-6">{slides[currentSlide]?.content}</p>
                                                {slides[currentSlide]?.bulletPoints && slides[currentSlide].bulletPoints!.length > 0 && (
                                                    <ul className="space-y-2">
                                                        {slides[currentSlide].bulletPoints!.map((point, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-lg">
                                                                <span className="mt-1">•</span>
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>

                                        {/* Navigation & Notes */}
                                        <div className="p-4 border-t border-zinc-800">
                                            <div className="flex items-center justify-between mb-4">
                                                <button
                                                    onClick={prevSlide}
                                                    disabled={currentSlide === 0}
                                                    className="p-2 hover:bg-zinc-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronLeft className="w-5 h-5 text-zinc-400" />
                                                </button>
                                                <div className="flex gap-1">
                                                    {slides.map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentSlide(i)}
                                                            className={`w-2 h-2 rounded-full transition-all ${
                                                                currentSlide === i ? 'bg-violet-500 w-4' : 'bg-zinc-700'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={nextSlide}
                                                    disabled={currentSlide === slides.length - 1}
                                                    className="p-2 hover:bg-zinc-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                                                </button>
                                            </div>

                                            {slides[currentSlide]?.speakerNotes && (
                                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MessageSquare className="w-4 h-4 text-amber-400" />
                                                        <span className="text-sm font-medium text-zinc-300">Speaker Notes</span>
                                                    </div>
                                                    <p className="text-sm text-zinc-400">{slides[currentSlide].speakerNotes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Grid View */}
                                {viewMode === "grid" && (
                                    <Reorder.Group
                                        axis="y"
                                        values={slides}
                                        onReorder={setSlides}
                                        className="space-y-3"
                                    >
                                        {slides.map((slide, index) => (
                                            <Reorder.Item
                                                key={slide.slideNumber}
                                                value={slide}
                                                className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden cursor-grab active:cursor-grabbing"
                                            >
                                                <div className="flex">
                                                    {/* Drag Handle & Number */}
                                                    <div className={`w-16 flex flex-col items-center justify-center bg-gradient-to-br ${SLIDE_TYPE_COLORS[slide.type] || "from-violet-500 to-purple-600"}`}>
                                                        <GripVertical className="w-4 h-4 text-white/50 mb-1" />
                                                        <span className="text-2xl font-bold text-white">{index + 1}</span>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-zinc-500">{SLIDE_TYPE_ICONS[slide.type] || <Presentation className="w-4 h-4" />}</span>
                                                                <h3 className="font-semibold text-white">{slide.title}</h3>
                                                            </div>
                                                            <button
                                                                onClick={() => copySlide(slide, index)}
                                                                className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                                                            >
                                                                {copiedIndex === index ? (
                                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4 text-zinc-500" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <p className="text-sm text-zinc-400 line-clamp-2">{slide.content}</p>

                                                        {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {slide.bulletPoints.slice(0, 3).map((point, i) => (
                                                                    <span key={i} className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">
                                                                        {point.substring(0, 30)}...
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
                                                            {slide.speakerNotes && (
                                                                <span className="flex items-center gap-1">
                                                                    <MessageSquare className="w-3 h-3" />
                                                                    Notes
                                                                </span>
                                                            )}
                                                            {slide.imageSuggestion && (
                                                                <span className="flex items-center gap-1">
                                                                    <Image className="w-3 h-3" />
                                                                    Image
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                )}
                            </motion.div>
                        )}

                        {/* Tips Sidebar (when no results) */}
                        {slides.length === 0 && (
                            <div className="space-y-4">
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Lightbulb className="w-5 h-5 text-amber-400" />
                                        <h3 className="font-semibold text-white">Pitch Tips</h3>
                                    </div>
                                    <ul className="space-y-3 text-sm text-zinc-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400">1.</span>
                                            Begin met een sterke hook in je opening
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400">2.</span>
                                            Houd slides simpel - max 3 bullet points
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400">3.</span>
                                            Vertel een verhaal, geen opsomming
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400">4.</span>
                                            Gebruik de speaker notes om je verhaal te oefenen
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl border border-violet-500/30 p-5">
                                    <h3 className="font-semibold text-white mb-2">Slide Structuur</h3>
                                    <p className="text-sm text-zinc-300">
                                        Een goede pitch deck volgt de structuur: Probleem → Oplossing → Markt → Business Model → Traction → Team → Ask
                                    </p>
                                </div>
                            </div>
                        )}
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
