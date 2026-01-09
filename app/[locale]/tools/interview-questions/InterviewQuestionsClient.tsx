"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { useResultHistory } from "@/hooks/useResultHistory";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import {ResultHistory} from "@/app/Components/tools/ResultHistory";
import TemplateSelector from "@/app/Components/tools/TemplateSelector";
import {ToolLoadingState} from "@/app/Components/tools/ToolLoadingState";
import { ToolActionBar } from "@/app/Components/tools/ToolActionBar";
import { CopyDropdown } from "@/app/Components/tools/CopyActions";
import { exportToXLSX, exportToPDFReport, downloadExport, INTERVIEW_COLUMNS } from "@/lib/export";
import {
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    Clock,
    Target,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Lightbulb,
    BookOpen,
    Users,
    Briefcase,
    Star,
    Filter,
    FileText
} from "lucide-react";

interface InterviewQuestion {
    category: "Technisch" | "Gedrag" | "Situatie" | "Motivatie" | "Cultuur";
    question: string;
    difficulty: string;
    rubric?: {
        poor: string;
        average: string;
        excellent: string;
    };
    followUps?: string[];
    timeAllocation?: number;
    purpose?: string;
}

interface InterviewResult {
    questions: InterviewQuestion[];
    interviewGuide?: {
        introduction: string;
        duration: number;
        tips: string[];
    };
    jobTitle: string;
    experienceLevel: string;
    totalQuestions: number;
    estimatedDuration: number;
    generatedAt: string;
    processingTime?: number;
    confidence?: number;
}

const CATEGORIES = ["Technisch", "Gedrag", "Situatie", "Motivatie", "Cultuur"] as const;

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Technisch": <Target className="w-4 h-4" />,
    "Gedrag": <Users className="w-4 h-4" />,
    "Situatie": <Briefcase className="w-4 h-4" />,
    "Motivatie": <Star className="w-4 h-4" />,
    "Cultuur": <BookOpen className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
    "Technisch": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Gedrag": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Situatie": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Motivatie": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Cultuur": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export default function InterviewQuestionsClient() {
    const toolMetadata = getToolBySlug("interview-questions");

    // Form state
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [experienceLevel, setExperienceLevel] = useState<"junior" | "medior" | "senior">("medior");
    const [questionCount, setQuestionCount] = useState(8);
    const [includeCategories, setIncludeCategories] = useState<string[]>([...CATEGORIES]);
    const [includeRubrics, setIncludeRubrics] = useState(true);
    const [includeFollowUps, setIncludeFollowUps] = useState(true);

    // UI state
    const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const [showGuide, setShowGuide] = useState(false);

    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<InterviewResult>("interview-questions");

    // Paywall
    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess, reset } = usePaywallTool({
        apiEndpoint: "/api/v1/hr/interview-questions",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (jobTitle.trim().length < 3 || jobDescription.trim().length < 20) return;
        execute({
            jobTitle,
            jobDescription,
            experienceLevel,
            questionCount,
            includeCategories,
            includeRubrics,
            includeFollowUps
        });
    };

    // Save to history when successful
    const data = state.data as InterviewResult | undefined;

    const handleSaveToHistory = useCallback(() => {
        if (data) {
            saveToHistory(
                {
                    jobTitle: data.jobTitle,
                    experienceLevel: data.experienceLevel,
                    questionCount: data.totalQuestions
                },
                data,
                ["interview", data.experienceLevel]
            );
        }
    }, [data, saveToHistory]);

    const handleLoadHistory = useCallback((entry: any) => {
        const historyData = entry.result as InterviewResult;
        setJobTitle(historyData.jobTitle);
        setExperienceLevel(historyData.experienceLevel as any);
    }, []);

    const handleApplyTemplate = (templateData: any) => {
        if (templateData.jobTitle) setJobTitle(templateData.jobTitle);
        if (templateData.jobDescription) setJobDescription(templateData.jobDescription);
        if (templateData.experienceLevel) setExperienceLevel(templateData.experienceLevel);
        if (templateData.questionCount) setQuestionCount(templateData.questionCount);
        if (templateData.includeCategories) setIncludeCategories(templateData.includeCategories);
        if (templateData.includeRubrics !== undefined) setIncludeRubrics(templateData.includeRubrics);
        if (templateData.includeFollowUps !== undefined) setIncludeFollowUps(templateData.includeFollowUps);
    };

    const toggleCategory = (category: string) => {
        setIncludeCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleQuestion = (index: number) => {
        setExpandedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const copyQuestion = async (question: InterviewQuestion, index: number) => {
        let text = `${question.question}`;
        if (question.followUps?.length) {
            text += `\n\nVervolg vragen:\n${question.followUps.map(f => `- ${f}`).join('\n')}`;
        }
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const copyAllQuestions = async () => {
        if (!data?.questions) return;
        const text = data.questions.map((q, i) =>
            `${i + 1}. [${q.category}] ${q.question}${q.followUps?.length ? `\n   Vervolgvragen: ${q.followUps.join(', ')}` : ''}`
        ).join('\n\n');
        await navigator.clipboard.writeText(text);
    };

    const handleExportXLSX = async () => {
        if (!data?.questions) return;
        const exportData = data.questions.map((q, i) => ({
            nummer: i + 1,
            categorie: q.category,
            vraag: q.question,
            niveau: q.difficulty,
            tijdInMinuten: q.timeAllocation,
            doel: q.purpose,
            vervolgvragen: q.followUps?.join('; '),
            rubricSlecht: q.rubric?.poor,
            rubricGemiddeld: q.rubric?.average,
            rubricUitstekend: q.rubric?.excellent
        }));
        const result = await exportToXLSX(exportData, INTERVIEW_COLUMNS, {
            filename: `interview-vragen-${data.jobTitle.toLowerCase().replace(/\s+/g, '-')}`
        });
        downloadExport(result);
    };

    const handleExportPDF = async () => {
        if (!data?.questions) return;
        const sections = [
            {
                title: "Interview Details",
                content: `Functie: ${data.jobTitle}\nNiveau: ${data.experienceLevel}\nGeschatte duur: ${data.estimatedDuration} minuten\nAantal vragen: ${data.totalQuestions}`
            },
            ...data.questions.map((q, i) => ({
                title: `Vraag ${i + 1}: ${q.category}`,
                content: `${q.question}\n\nDoel: ${q.purpose || 'N/A'}\nTijd: ${q.timeAllocation || 5} minuten${q.followUps?.length ? `\n\nVervolgvragen:\n${q.followUps.map(f => `• ${f}`).join('\n')}` : ''}${q.rubric ? `\n\nBeoordelingsrubric:\n• Onvoldoende: ${q.rubric.poor}\n• Voldoende: ${q.rubric.average}\n• Uitstekend: ${q.rubric.excellent}` : ''}`
            }))
        ];

        if (data.interviewGuide) {
            sections.push({
                title: "Interview Tips",
                content: data.interviewGuide.tips.map(t => `• ${t}`).join('\n')
            });
        }

        const result = await exportToPDFReport(
            { sections },
            {
                title: `Interview Gids: ${data.jobTitle}`,
                subtitle: `${data.experienceLevel} niveau - ${data.totalQuestions} vragen`,
                filename: `interview-gids-${data.jobTitle.toLowerCase().replace(/\s+/g, '-')}`
            }
        );
        downloadExport(result);
    };

    const handleReset = () => {
        reset();
        setExpandedQuestions(new Set());
        setFilterCategory(null);
    };

    const filteredQuestions = data?.questions.filter(q =>
        !filterCategory || q.category === filterCategory
    ) || [];

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4" suppressHydrationWarning>
            <div className="max-w-6xl mx-auto space-y-6" suppressHydrationWarning>
                {/* Header */}
                <div className="flex items-center justify-between" suppressHydrationWarning>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                            <p className="text-zinc-400 text-sm">Genereer professionele sollicitatievragen met AI</p>
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
                                <p className="text-white line-clamp-1">{result.jobTitle}</p>
                                <p className="text-zinc-500">{result.totalQuestions} vragen • {result.experienceLevel}</p>
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
                                <h2 className="text-lg font-semibold text-white">Vacature Details</h2>
                                <TemplateSelector
                                    toolId="interview-questions"
                                    onSelectTemplate={handleApplyTemplate}
                                    currentData={{
                                        jobTitle,
                                        jobDescription,
                                        experienceLevel,
                                        questionCount,
                                        includeCategories,
                                        includeRubrics,
                                        includeFollowUps
                                    }}
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Functietitel
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="bijv. Frontend Developer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Ervaringsniveau
                                        </label>
                                        <select
                                            value={experienceLevel}
                                            onChange={(e) => setExperienceLevel(e.target.value as any)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="junior">Junior (0-2 jaar)</option>
                                            <option value="medior">Medior (2-5 jaar)</option>
                                            <option value="senior">Senior (5+ jaar)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Functiebeschrijving
                                    </label>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none"
                                        placeholder="Beschrijf de belangrijkste verantwoordelijkheden, vereiste vaardigheden en wat de ideale kandidaat zou moeten kunnen..."
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {jobDescription.length}/5000 tekens (min. 20)
                                    </p>
                                </div>

                                {/* Question Count */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Aantal vragen: <span className="text-blue-400">{questionCount}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="3"
                                        max="15"
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <div className="flex justify-between text-xs text-zinc-500 mt-1">
                                        <span>3 (kort)</span>
                                        <span>8 (standaard)</span>
                                        <span>15 (uitgebreid)</span>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                                        Vraagcategorieen
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(category => (
                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() => toggleCategory(category)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                                                    includeCategories.includes(category)
                                                        ? CATEGORY_COLORS[category]
                                                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                                                }`}
                                            >
                                                {CATEGORY_ICONS[category]}
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeRubrics}
                                            onChange={(e) => setIncludeRubrics(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-zinc-300">Beoordelingsrubrics</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeFollowUps}
                                            onChange={(e) => setIncludeFollowUps(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-zinc-300">Vervolgvragen</span>
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={state.status === "loading" || jobTitle.trim().length < 3 || jobDescription.trim().length < 20 || includeCategories.length === 0}
                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all"
                                >
                                    {state.status === "loading" ? "Bezig met genereren..." :
                                     jobTitle.trim().length < 3 ? "Functietitel te kort" :
                                     jobDescription.trim().length < 20 ? "Beschrijving te kort (min. 20 tekens)" :
                                     includeCategories.length === 0 ? "Selecteer minimaal 1 categorie" :
                                     "Genereer Interview Vragen"}
                                </button>
                            </form>
                        </div>

                        {/* Loading State */}
                        {state.status === "loading" && (
                            <ToolLoadingState
                                message="Vragen worden gegenereerd..."
                                subMessage={`${questionCount} vragen in ${includeCategories.length} categorieen`}
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
                        {state.status === "success" && data?.questions && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Action Bar */}
                                 <ToolActionBar
                                     exportFormats={["pdf", "xlsx"]}
                                     onExport={(format) => format === "pdf" ? handleExportPDF() : handleExportXLSX()}
                                     copyText={data.questions.map(q => q.question).join("\n\n")}
                                     onSaveToHistory={handleSaveToHistory}
                                     onReset={handleReset}
                                 />

                                {/* Summary */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {data.totalQuestions} vragen gegenereerd
                                                </p>
                                                <p className="text-sm text-zinc-400">
                                                    {data.jobTitle} - {data.experienceLevel}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>~{data.estimatedDuration} min</span>
                                            </div>
                                            {data.confidence && (
                                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                                                    {data.confidence}% betrouwbaar
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Interview Guide Toggle */}
                                {data.interviewGuide && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                        <button
                                            onClick={() => setShowGuide(!showGuide)}
                                            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-blue-400" />
                                                <span className="font-medium text-white">Interview Gids</span>
                                            </div>
                                            {showGuide ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                                        </button>
                                        <AnimatePresence>
                                            {showGuide && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: "auto" }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 space-y-4">
                                                        <p className="text-zinc-300">{data.interviewGuide.introduction}</p>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-zinc-400 mb-2">Tips voor de interviewer:</h4>
                                                            <ul className="space-y-2">
                                                                {data.interviewGuide.tips.map((tip, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                                                        <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                                        {tip}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Category Filter */}
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-zinc-500" />
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setFilterCategory(null)}
                                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                                !filterCategory
                                                    ? 'bg-zinc-700 text-white'
                                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                            }`}
                                        >
                                            Alle ({data.questions.length})
                                        </button>
                                        {CATEGORIES.filter(cat => data.questions.some(q => q.category === cat)).map(category => {
                                            const count = data.questions.filter(q => q.category === category).length;
                                            return (
                                                <button
                                                    key={category}
                                                    onClick={() => setFilterCategory(category)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                                                        filterCategory === category
                                                            ? CATEGORY_COLORS[category]
                                                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                                    }`}
                                                >
                                                    {CATEGORY_ICONS[category]}
                                                    {category} ({count})
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Questions List */}
                                <div className="space-y-3">
                                    {filteredQuestions.map((question, index) => {
                                        const originalIndex = data.questions.indexOf(question);
                                        const isExpanded = expandedQuestions.has(originalIndex);

                                        return (
                                            <motion.div
                                                key={originalIndex}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
                                            >
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 border ${CATEGORY_COLORS[question.category]}`}>
                                                                    {CATEGORY_ICONS[question.category]}
                                                                    {question.category}
                                                                </span>
                                                                {question.timeAllocation && (
                                                                    <span className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-400">
                                                                        {question.timeAllocation} min
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-white font-medium">{question.question}</p>
                                                            {question.purpose && (
                                                                <p className="text-sm text-zinc-500 mt-1">{question.purpose}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => copyQuestion(question, originalIndex)}
                                                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                                                title="Kopieer vraag"
                                                            >
                                                                {copiedIndex === originalIndex ? (
                                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4 text-zinc-400" />
                                                                )}
                                                            </button>
                                                            {(question.rubric || question.followUps?.length) && (
                                                                <button
                                                                    onClick={() => toggleQuestion(originalIndex)}
                                                                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                                                >
                                                                    {isExpanded ? (
                                                                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                                                                    ) : (
                                                                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: "auto" }}
                                                            exit={{ height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-4 pb-4 space-y-4 border-t border-zinc-800 pt-4">
                                                                {/* Follow-up Questions */}
                                                                {question.followUps && question.followUps.length > 0 && (
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-zinc-400 mb-2">Vervolgvragen:</h4>
                                                                        <ul className="space-y-1">
                                                                            {question.followUps.map((followUp, i) => (
                                                                                <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                                                                    <span className="text-blue-400">→</span>
                                                                                    {followUp}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {/* Rubric */}
                                                                {question.rubric && (
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-zinc-400 mb-2">Beoordelingsrubric:</h4>
                                                                        <div className="grid gap-2">
                                                                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                                                <span className="text-xs font-medium text-red-400 block mb-1">Onvoldoende</span>
                                                                                <p className="text-sm text-zinc-300">{question.rubric.poor}</p>
                                                                            </div>
                                                                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                                                <span className="text-xs font-medium text-amber-400 block mb-1">Voldoende</span>
                                                                                <p className="text-sm text-zinc-300">{question.rubric.average}</p>
                                                                            </div>
                                                                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                                                <span className="text-xs font-medium text-emerald-400 block mb-1">Uitstekend</span>
                                                                                <p className="text-sm text-zinc-300">{question.rubric.excellent}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Tips Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                                <h3 className="font-semibold text-white">Interview Tips</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">1.</span>
                                    Gebruik de STAR-methode om gedragsvragen te beoordelen
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">2.</span>
                                    Geef kandidaten genoeg tijd om na te denken
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">3.</span>
                                    Noteer antwoorden voor objectieve vergelijking
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">4.</span>
                                    Gebruik vervolgvragen om dieper te graven
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">5.</span>
                                    Beoordeel op basis van rubrics, niet onderbuikgevoel
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 p-5">
                            <h3 className="font-semibold text-white mb-2">Pro Tip</h3>
                            <p className="text-sm text-zinc-300">
                                Combineer technische vragen met gedragsvragen voor een volledig beeld.
                                Een goede mix is 40% technisch, 30% gedrag, 20% situatie en 10% motivatie.
                            </p>
                        </div>

                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <h3 className="font-semibold text-white mb-3">Categorieën Uitleg</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <div className={`p-1.5 rounded ${CATEGORY_COLORS["Technisch"]}`}>
                                        {CATEGORY_ICONS["Technisch"]}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white">Technisch</span>
                                        <p className="text-zinc-400">Kennis en vaardigheden testen</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className={`p-1.5 rounded ${CATEGORY_COLORS["Gedrag"]}`}>
                                        {CATEGORY_ICONS["Gedrag"]}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white">Gedrag</span>
                                        <p className="text-zinc-400">Eerdere ervaringen en reacties</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className={`p-1.5 rounded ${CATEGORY_COLORS["Situatie"]}`}>
                                        {CATEGORY_ICONS["Situatie"]}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white">Situatie</span>
                                        <p className="text-zinc-400">Hypothetische scenario's</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className={`p-1.5 rounded ${CATEGORY_COLORS["Motivatie"]}`}>
                                        {CATEGORY_ICONS["Motivatie"]}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white">Motivatie</span>
                                        <p className="text-zinc-400">Drijfveren en ambities</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className={`p-1.5 rounded ${CATEGORY_COLORS["Cultuur"]}`}>
                                        {CATEGORY_ICONS["Cultuur"]}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white">Cultuur</span>
                                        <p className="text-zinc-400">Team fit en waarden</p>
                                    </div>
                                </div>
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
