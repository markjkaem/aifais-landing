"use client";

import { useState, useCallback } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { useResultHistory } from "@/hooks/useResultHistory";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import {ResultHistory} from "@/app/Components/tools/ResultHistory";
import ResultDisplay, { ScoreDisplay, TierBadge } from "@/app/Components/tools/ResultDisplay";
import { ToolActionBar } from "@/app/Components/tools/ToolActionBar";
import { ToolLoadingState, BatchProgress } from "@/app/Components/tools/ToolLoadingState";
import { CopyAsText } from "@/app/Components/tools/CopyActions";
import { getToolBySlug } from "@/config/tools";
import { exportToXLSX, exportToPDFReport, downloadExport, CV_COLUMNS, DocumentContent } from "@/lib/export";
import { CVScreenerResult, HistoryEntry } from "@/lib/tools/types";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Upload,
    X,
    FileText,
    Plus,
    Trash2,
    ArrowRight,
    Sparkles,
    Target,
    TrendingUp,
    TrendingDown,
    MessageSquare,
    ChevronDown,
    ChevronUp
} from "lucide-react";

interface CVFile {
    id: string;
    file: File;
    base64?: string;
    status: "pending" | "processing" | "success" | "error";
    result?: CVScreenerResult;
    error?: string;
}

export default function CvScreenerClient() {
    const toolMetadata = getToolBySlug("cv-screener");
    const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
    const [jobDescription, setJobDescription] = useState("");
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
    const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());
    const [showComparison, setShowComparison] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess } = usePaywallTool({
        apiEndpoint: "/api/v1/hr/cv-screener",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<CVScreenerResult>("cv-screener");

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newFiles: CVFile[] = files.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            status: "pending"
        }));

        if (isBulkMode) {
            setCvFiles(prev => [...prev, ...newFiles].slice(0, 10));
        } else {
            setCvFiles(newFiles.slice(0, 1));
        }
    }, [isBulkMode]);

    const removeFile = useCallback((id: string) => {
        setCvFiles(prev => prev.filter(f => f.id !== id));
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter(f =>
            f.type === "application/pdf" ||
            f.type.startsWith("image/")
        );

        const newFiles: CVFile[] = validFiles.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            status: "pending"
        }));

        if (isBulkMode) {
            setCvFiles(prev => [...prev, ...newFiles].slice(0, 10));
        } else {
            setCvFiles(newFiles.slice(0, 1));
        }
    }, [isBulkMode]);

    const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = (reader.result as string).split(",")[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cvFiles.length === 0 || jobDescription.trim().length < 20) return;

        // Process single file
        const file = cvFiles[0];
        const base64 = await readFileAsBase64(file.file);

        setCvFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, status: "processing" } : f
        ));

        execute({
            cvBase64: base64,
            mimeType: file.file.type || "application/pdf",
            jobDescription: jobDescription.trim(),
            filename: file.file.name
        });
    };

    const handleBulkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cvFiles.length === 0 || jobDescription.trim().length < 20) return;

        // Process files one by one
        for (let i = 0; i < cvFiles.length; i++) {
            const file = cvFiles[i];

            setCvFiles(prev => prev.map(f =>
                f.id === file.id ? { ...f, status: "processing" } : f
            ));

            try {
                const base64 = await readFileAsBase64(file.file);

                const response = await fetch("/api/v1/hr/cv-screener", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cvBase64: base64,
                        mimeType: file.file.type || "application/pdf",
                        jobDescription: jobDescription.trim(),
                        filename: file.file.name
                    })
                });

                const result = await response.json();

                if (result.success) {
                    setCvFiles(prev => prev.map(f =>
                        f.id === file.id ? { ...f, status: "success", result: result.data } : f
                    ));
                } else {
                    setCvFiles(prev => prev.map(f =>
                        f.id === file.id ? { ...f, status: "error", error: result.error } : f
                    ));
                }
            } catch (err) {
                setCvFiles(prev => prev.map(f =>
                    f.id === file.id ? { ...f, status: "error", error: "Verwerking mislukt" } : f
                ));
            }
        }
    };

    const handleSaveToHistory = useCallback(() => {
        if (state.status === "success" && state.data) {
            saveToHistory(
                { jobDescription, filename: cvFiles[0]?.file.name },
                state.data as CVScreenerResult,
                [cvFiles[0]?.file.name || "CV"]
            );
        }
    }, [state, jobDescription, cvFiles, saveToHistory]);

    const handleLoadHistory = useCallback((entry: HistoryEntry<CVScreenerResult>) => {
        setJobDescription(entry.input.jobDescription || "");
        // Can't restore file, but can show result
    }, []);

    const handleExport = async (format: "xlsx" | "pdf" | "csv" | "json") => {
        const results = cvFiles.filter(f => f.status === "success" && f.result);
        if (results.length === 0 && state.status !== "success") return;

        const data = results.length > 0
            ? results.map(f => ({
                filename: f.file.name,
                ...f.result
            }))
            : [{
                filename: cvFiles[0]?.file.name || "CV",
                ...(state.data as CVScreenerResult)
            }];

        if (format === "xlsx") {
            const result = await exportToXLSX(data, CV_COLUMNS, {
                filename: `cv-screening-${Date.now()}`,
                title: "CV Screening Resultaten",
                metadata: {
                    "Vacature": jobDescription.slice(0, 100) + "...",
                    "Aantal CVs": String(data.length)
                }
            });
            downloadExport(result);
        } else if (format === "pdf") {
            const content: DocumentContent = {
                sections: data.map(d => ({
                    heading: d.filename,
                    paragraphs: [d.summary || ""],
                    bullets: [
                        `Score: ${d.score}/100`,
                        `Aanbeveling: ${d.recommendation}`,
                        ...(d.strengths || []).map(s => `+ ${s}`),
                        ...(d.weaknesses || []).map(w => `- ${w}`)
                    ]
                }))
            };
            const result = await exportToPDFReport(content, {
                filename: `cv-screening-${Date.now()}`,
                title: "CV Screening Rapport",
                subtitle: `Vacature: ${jobDescription.slice(0, 100)}...`
            });
            downloadExport(result);
        }
    };

    const handleReset = useCallback(() => {
        setCvFiles([]);
        setJobDescription("");
        setIsSaved(false);
    }, []);

    const toggleExpanded = (id: string) => {
        setExpandedResults(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleComparison = (id: string) => {
        setSelectedForComparison(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else if (next.size < 3) {
                next.add(id);
            }
            return next;
        });
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    const data = state.data as CVScreenerResult | undefined;
    const completedCount = cvFiles.filter(f => f.status === "success" || f.status === "error").length;
    const successCount = cvFiles.filter(f => f.status === "success").length;
    const errorCount = cvFiles.filter(f => f.status === "error").length;
    const isProcessing = cvFiles.some(f => f.status === "processing");

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                        <p className="text-sm text-zinc-400">{toolMetadata.shortDescription}</p>
                    </div>
                </div>

                {/* Mode toggle */}
                <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-1">
                    <button
                        onClick={() => setIsBulkMode(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            !isBulkMode ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        Enkel CV
                    </button>
                    <button
                        onClick={() => setIsBulkMode(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isBulkMode ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        Bulk (max 10)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                        <form onSubmit={isBulkMode ? handleBulkSubmit : handleSubmit} className="space-y-6">
                            {/* File upload */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    {isBulkMode ? "Upload CVs (max 10)" : "Upload CV"} (PDF of afbeelding)
                                </label>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="border-2 border-dashed border-zinc-700 hover:border-blue-500/50 rounded-xl p-8 text-center transition-colors"
                                >
                                    <input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="cv-upload"
                                        multiple={isBulkMode}
                                    />
                                    <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-3">
                                        <div className="p-4 bg-zinc-800 rounded-full">
                                            <Upload className="w-6 h-6 text-zinc-400" />
                                        </div>
                                        <div>
                                            <span className="text-white font-medium">Klik om te uploaden</span>
                                            <span className="text-zinc-400"> of sleep bestanden</span>
                                        </div>
                                        <span className="text-xs text-zinc-500">PDF, JPG, PNG (max 10MB)</span>
                                    </label>
                                </div>

                                {/* File list */}
                                {cvFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {cvFiles.map((cvFile) => (
                                            <div
                                                key={cvFile.id}
                                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                                    cvFile.status === "success"
                                                        ? "bg-emerald-500/10 border-emerald-500/30"
                                                        : cvFile.status === "error"
                                                        ? "bg-red-500/10 border-red-500/30"
                                                        : cvFile.status === "processing"
                                                        ? "bg-blue-500/10 border-blue-500/30"
                                                        : "bg-zinc-800/50 border-zinc-700"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-4 h-4 text-zinc-400" />
                                                    <span className="text-sm text-white truncate max-w-[200px]">
                                                        {cvFile.file.name}
                                                    </span>
                                                    {cvFile.status === "success" && cvFile.result && (
                                                        <span className={`text-sm font-medium ${
                                                            cvFile.result.score >= 70 ? "text-emerald-400" :
                                                            cvFile.result.score >= 50 ? "text-amber-400" : "text-red-400"
                                                        }`}>
                                                            {cvFile.result.score}/100
                                                        </span>
                                                    )}
                                                    {cvFile.status === "processing" && (
                                                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                                    )}
                                                    {cvFile.status === "error" && (
                                                        <span className="text-xs text-red-400">{cvFile.error}</span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(cvFile.id)}
                                                    className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Job description */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Vacature Omschrijving
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="w-full p-4 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Beschrijf de functie, vereisten, verantwoordelijkheden en gewenste ervaring..."
                                />
                                <div className="flex justify-between mt-2 text-xs text-zinc-500">
                                    <span>{jobDescription.length} tekens</span>
                                    <span>{jobDescription.length < 20 ? "Min. 20 tekens" : "OK"}</span>
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={state.status === "loading" || isProcessing || cvFiles.length === 0 || jobDescription.trim().length < 20}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                            >
                                {state.status === "loading" || isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyseren...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        {isBulkMode ? `${cvFiles.length} CVs Analyseren` : "CV Analyseren"}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Bulk progress */}
                        {isBulkMode && cvFiles.length > 0 && (completedCount > 0 || isProcessing) && (
                            <div className="mt-6">
                                <BatchProgress
                                    total={cvFiles.length}
                                    completed={completedCount}
                                    success={successCount}
                                    errors={errorCount}
                                    currentItem={cvFiles.find(f => f.status === "processing")?.file.name}
                                />
                            </div>
                        )}
                    </div>

                    {/* Error state */}
                    {state.status === "error" && (
                        <ResultDisplay
                            status="error"
                            title="Analyse mislukt"
                            message={state.error}
                        />
                    )}

                    {/* Single result */}
                    {state.status === "success" && data && !isBulkMode && (
                        <ResultDisplay
                            status="success"
                            title="CV Analyse Voltooid"
                            message={data.summary}
                            score={data.score}
                            scoreLabel="Match Score"
                            confidence={data.confidence}
                            exportFormats={["xlsx", "pdf"]}
                            onExport={(format) => handleExport(format as "xlsx" | "pdf")}
                            copyJson={data}
                            onSaveToHistory={handleSaveToHistory}
                            onReset={handleReset}
                        >
                            <div className="space-y-6">
                                {/* Key skills match */}
                                {data.keySkillsMatch && data.keySkillsMatch.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                                            <Target className="w-4 h-4" />
                                            Gematchte Vaardigheden
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {data.keySkillsMatch.map((skill, i) => (
                                                <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Strengths */}
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        Sterke Punten
                                    </h4>
                                    <ul className="space-y-1">
                                        {data.strengths?.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Weaknesses */}
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                                        <TrendingDown className="w-4 h-4 text-amber-400" />
                                        Verbeterpunten
                                    </h4>
                                    <ul className="space-y-1">
                                        {data.weaknesses?.map((w, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Recommendation */}
                                <div className="p-4 bg-zinc-800 rounded-lg">
                                    <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Aanbeveling
                                    </h4>
                                    <p className="text-zinc-400">{data.recommendation}</p>
                                </div>

                                {/* Quick action */}
                                <a
                                    href={`/tools/interview-questions?jobDescription=${encodeURIComponent(jobDescription)}`}
                                    className="flex items-center justify-center gap-2 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 hover:text-white transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    Genereer Interviewvragen voor deze functie
                                </a>
                            </div>
                        </ResultDisplay>
                    )}

                    {/* Bulk results */}
                    {isBulkMode && cvFiles.some(f => f.status === "success") && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Resultaten</h3>
                                <ToolActionBar
                                    exportFormats={["xlsx", "pdf"]}
                                    onExport={(format) => handleExport(format as "xlsx" | "pdf")}
                                />
                            </div>

                            {/* Results list */}
                            <div className="space-y-3">
                                {cvFiles
                                    .filter(f => f.status === "success" && f.result)
                                    .sort((a, b) => (b.result?.score || 0) - (a.result?.score || 0))
                                    .map((cvFile) => (
                                        <div
                                            key={cvFile.id}
                                            className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleExpanded(cvFile.id)}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <ScoreDisplay
                                                        score={cvFile.result!.score}
                                                        size="sm"
                                                    />
                                                    <div className="text-left">
                                                        <div className="font-medium text-white">
                                                            {cvFile.file.name}
                                                        </div>
                                                        <div className="text-sm text-zinc-400 truncate max-w-md">
                                                            {cvFile.result!.summary}
                                                        </div>
                                                    </div>
                                                </div>
                                                {expandedResults.has(cvFile.id) ? (
                                                    <ChevronUp className="w-5 h-5 text-zinc-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                                                )}
                                            </button>

                                            <AnimatePresence>
                                                {expandedResults.has(cvFile.id) && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="border-t border-zinc-800"
                                                    >
                                                        <div className="p-4 space-y-4">
                                                            {/* Strengths */}
                                                            <div>
                                                                <h4 className="text-sm font-medium text-emerald-400 mb-2">Sterke punten</h4>
                                                                <ul className="space-y-1">
                                                                    {cvFile.result!.strengths?.map((s, i) => (
                                                                        <li key={i} className="text-sm text-zinc-300">• {s}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            {/* Weaknesses */}
                                                            <div>
                                                                <h4 className="text-sm font-medium text-amber-400 mb-2">Verbeterpunten</h4>
                                                                <ul className="space-y-1">
                                                                    {cvFile.result!.weaknesses?.map((w, i) => (
                                                                        <li key={i} className="text-sm text-zinc-300">• {w}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            {/* Recommendation */}
                                                            <div className="p-3 bg-zinc-800 rounded-lg">
                                                                <p className="text-sm text-zinc-300">{cvFile.result!.recommendation}</p>
                                                            </div>

                                                            <div className="flex justify-end">
                                                                <CopyAsText
                                                                    text={JSON.stringify(cvFile.result, null, 2)}
                                                                    label="Kopieer JSON"
                                                                    variant="minimal"
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* History */}
                    <ResultHistory
                        history={history}
                        onLoadEntry={handleLoadHistory}
                        onDeleteEntry={deleteEntry}
                        onClearHistory={clearHistory}
                        onToggleStar={toggleStar}
                        onExportHistory={exportHistory}
                        onImportHistory={importHistory}
                        renderPreview={({ result }) => (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`font-medium ${
                                        result.score >= 70 ? "text-emerald-400" :
                                        result.score >= 50 ? "text-amber-400" : "text-red-400"
                                    }`}>
                                        Score: {result.score}/100
                                    </span>
                                </div>
                                <p className="text-zinc-400 text-xs line-clamp-2">{result.summary}</p>
                            </div>
                        )}
                    />

                    {/* Tips */}
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                        <h3 className="font-medium text-white mb-3">Tips voor betere resultaten</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                Geef een gedetailleerde vacature omschrijving
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                Specificeer vereiste vaardigheden en ervaring
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                Upload leesbare PDF bestanden
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                Gebruik bulk mode om meerdere kandidaten te vergelijken
                            </li>
                        </ul>
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
