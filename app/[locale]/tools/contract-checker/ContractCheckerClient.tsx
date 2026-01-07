"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Download,
    X,
    Upload,
    Shield,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    FileSpreadsheet,
    Lightbulb,
    Scale,
    Building2,
    Clock,
    Target,
    History,
    RotateCcw,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion
} from "lucide-react";
import CryptoModal from "@/app/Components/CryptoModal";
import { useResultHistory, type HistoryEntry } from "@/hooks/useResultHistory";
import { ResultHistory } from "@/app/Components/tools/ResultHistory";
import { ToolActionBar } from "@/app/Components/tools/ToolActionBar";
import { exportData, downloadExport, ExportColumn } from "@/lib/export";

const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_LINK_CONTRACT || "#";

const CONFIG = {
    priceSol: 0.001,
    priceEur: 0.50,
    name: "Contract Checker",
};

// Risk severity config
const SEVERITY_CONFIG: Record<string, { icon: typeof AlertTriangle; color: string; bg: string; label: string }> = {
    critical: { icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/20", label: "Kritiek" },
    high: { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/20", label: "Hoog" },
    medium: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/20", label: "Medium" },
    low: { icon: ShieldQuestion, color: "text-blue-400", bg: "bg-blue-500/20", label: "Laag" }
};

// Clause risk level config
const RISK_LEVEL_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
    safe: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    caution: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    risky: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" }
};

// Export columns
const RISK_EXPORT_COLUMNS: ExportColumn[] = [
    { key: 'severity', label: 'Ernst' },
    { key: 'description', label: 'Beschrijving' },
    { key: 'clause', label: 'Clausule' },
    { key: 'recommendation', label: 'Aanbeveling' }
];

interface Risk {
    severity: string;
    description: string;
    clause?: string;
    recommendation?: string;
}

interface UnclearClause {
    clause: string;
    issue: string;
    suggestion?: string;
}

interface ContractClause {
    id: string;
    title: string;
    content: string;
    category: string;
    riskLevel: string;
}

interface AnalysisResult {
    summary: string;
    contractType?: string;
    parties?: string[];
    risks: Risk[];
    unclear_clauses?: UnclearClause[];
    missing_protections?: string[];
    suggestions: string[];
    clauses?: ContractClause[];
    overall_score: number;
    confidence?: number;
    jurisdiction?: string;
    pdfBase64?: string;
    analyzedAt?: string;
    processingTime?: number;
}

export default function ContractCheckerClient() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showCryptoQR, setShowCryptoQR] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [paymentProof, setPaymentProof] = useState<{ type: "crypto" | "stripe"; id: string } | null>(null);

    // UI State
    const [activeTab, setActiveTab] = useState<"overview" | "risks" | "clauses">("overview");
    const [expandedSections, setExpandedSections] = useState<string[]>(["summary", "risks"]);
    const [copied, setCopied] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    // History
    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<AnalysisResult>('contract-checker');

    // Stripe return handler
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        if (sessionId) {
            setPaymentProof({ type: "stripe", id: sessionId });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Drag & Drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf") {
                setSelectedFile(file);
                setResult(null);
                setError(null);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setResult(null);
            setError(null);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleCryptoSuccess = async (signature: string) => {
        setShowCryptoQR(false);
        setShowPaymentModal(false);
        setPaymentProof({ type: "crypto", id: signature });
        await performAnalysis({ type: "crypto", id: signature });
    };

    const performAnalysis = async (proof: { type: "crypto" | "stripe"; id: string }) => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const base64 = await convertToBase64(selectedFile);

            const response = await fetch("/api/v1/legal/check-contract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contractBase64: base64,
                    mimeType: selectedFile.type,
                    signature: proof.type === "crypto" ? proof.id : undefined,
                    stripeSessionId: proof.type === "stripe" ? proof.id : undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    setPaymentProof(null);
                    throw new Error("Deze betaling is al gebruikt. Betaal opnieuw.");
                }
                throw new Error(data.error || "Analyse mislukt");
            }

            setResult(data.data);

            // Save to history
            saveToHistory(
                { fileName: selectedFile.name },
                data.data as AnalysisResult,
                ['contract', data.data.contractType || 'Legal']
            );
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Er is iets misgegaan.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const downloadPDF = () => {
        if (!result?.pdfBase64) return;
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${result.pdfBase64}`;
        link.download = `contract_analyse_${Date.now()}.pdf`;
        link.click();
    };

    const handleExportRisks = async () => {
        if (!result?.risks) return;
        try {
            const exportResult = await exportData('xlsx', result.risks, {
                columns: RISK_EXPORT_COLUMNS,
                filename: 'contract_risicos'
            });
            downloadExport(exportResult);
        } catch (e) {
            console.error('Export failed:', e);
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const handleLoadHistory = (entry: HistoryEntry<AnalysisResult>) => {
        setResult(entry.result);
        setShowHistory(false);
    };

    const reset = () => {
        setSelectedFile(null);
        setResult(null);
        setPaymentProof(null);
        setError(null);
        setActiveTab("overview");
    };

    // Score color helper
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-emerald-400';
        if (score >= 6) return 'text-yellow-400';
        if (score >= 4) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 8) return 'bg-emerald-500';
        if (score >= 6) return 'bg-yellow-500';
        if (score >= 4) return 'bg-orange-500';
        return 'bg-red-500';
    };

    // Risk counts
    const riskCounts = result?.risks?.reduce((acc, r) => {
        acc[r.severity] = (acc[r.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) || {};

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* PAYMENT MODAL */}
                {showPaymentModal && !showCryptoQR && (
                    <div className="absolute inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-6">
                        <div className="bg-zinc-900 rounded-2xl w-full max-w-sm shadow-2xl border border-zinc-800 overflow-hidden">
                            <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Betaalmethode</h3>
                                    <p className="text-sm text-zinc-400">Contract analyse</p>
                                </div>
                                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-3">
                                <button
                                    onClick={() => (window.location.href = STRIPE_LINK)}
                                    className="group w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all"
                                >
                                    <span>iDEAL / Card</span>
                                    <span className="text-lg">€{CONFIG.priceEur.toFixed(2)}</span>
                                </button>

                                <button
                                    onClick={() => setShowCryptoQR(true)}
                                    className="group w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all"
                                >
                                    <span>Solana Pay</span>
                                    <span className="text-lg">{CONFIG.priceSol} SOL</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CRYPTO MODAL */}
                {showCryptoQR && (
                    <CryptoModal
                        priceInSol={CONFIG.priceSol}
                        scansAmount={1}
                        label={CONFIG.name}
                        onClose={() => {
                            setShowCryptoQR(false);
                            setShowPaymentModal(false);
                        }}
                        onSuccess={handleCryptoSuccess}
                        priceInEur={0}
                    />
                )}

                <div className="p-6 sm:p-8 lg:p-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-25" />
                                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                    <Scale className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Contract Checker</h2>
                                <p className="text-sm text-zinc-400">Powered by Claude AI</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
                                title="Geschiedenis"
                            >
                                <History className="w-5 h-5" />
                            </button>
                            {result && (
                                <button onClick={reset} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
                                    <RotateCcw className="w-4 h-4" />
                                    <span className="hidden sm:inline">Nieuw</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* History Panel */}
                    <AnimatePresence>
                        {showHistory && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <ResultHistory
                                    history={history}
                                    onLoadEntry={handleLoadHistory}
                                    onDeleteEntry={deleteEntry}
                                    onClearHistory={clearHistory}
                                    onToggleStar={toggleStar}
                                    onExportHistory={exportHistory}
                                    onImportHistory={importHistory}
                                    renderPreview={(entry) => (
                                        <div className="text-sm">
                                            <span className="text-white font-medium">{entry.input.fileName || 'Contract'}</span>
                                            <span className="mx-2 text-zinc-600">•</span>
                                            <span className={getScoreColor(entry.result.overall_score)}>Score: {entry.result.overall_score}/10</span>
                                        </div>
                                    )}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* UPLOAD STATE */}
                    {!selectedFile && !result && (
                        <div className="space-y-6">
                            {paymentProof && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-emerald-400 font-semibold">Betaling succesvol!</h3>
                                        <p className="text-emerald-400/70 text-sm">Upload je contract om te starten.</p>
                                    </div>
                                </div>
                            )}

                            <div
                                className="relative"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <div className={`
                                    relative h-64 sm:h-72 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                                    ${isDragging ? "border-blue-500 bg-blue-500/5 scale-[1.01]" : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800"}
                                `}>
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragging ? "bg-blue-500 text-white" : "bg-zinc-700 text-zinc-400"}`}>
                                        <Upload className="w-7 h-7" />
                                    </div>

                                    <p className="text-base sm:text-lg font-semibold text-white mb-1">
                                        {isDragging ? "Laat los om te uploaden" : "Sleep je contract hierheen"}
                                    </p>
                                    <p className="text-sm text-zinc-400">
                                        of <span className="text-blue-400 font-medium">klik om te bladeren</span>
                                    </p>

                                    <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> PDF</span>
                                        <span>Max 10 MB</span>
                                    </div>
                                </div>
                            </div>

                            {!paymentProof && (
                                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full">
                                        <Shield className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm text-zinc-300 font-medium">{CONFIG.priceSol} SOL / €{CONFIG.priceEur.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PREVIEW & ACTION */}
                    {selectedFile && !result && (
                        <div className="space-y-6">
                            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{selectedFile.name}</p>
                                    <p className="text-zinc-500 text-sm">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                                </div>
                                <button onClick={() => setSelectedFile(null)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-red-400 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-red-400 font-medium text-sm">Er ging iets mis</p>
                                        <p className="text-red-400/70 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {!paymentProof ? (
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    disabled={isAnalyzing}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                                >
                                    <Scale className="w-5 h-5" />
                                    Analyseer Contract
                                </button>
                            ) : (
                                <button
                                    onClick={() => performAnalysis(paymentProof!)}
                                    disabled={isAnalyzing}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 disabled:opacity-70"
                                >
                                    {isAnalyzing ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /><span>Analyseren...</span></>
                                    ) : (
                                        <><Scale className="w-5 h-5" /><span>Start Analyse</span></>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {/* RESULTS */}
                    {result && (
                        <div className="space-y-6">
                            {/* Score Banner */}
                            <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    {/* Score Gauge */}
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-24 h-24">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-700" />
                                                <circle
                                                    cx="50" cy="50" r="40" fill="none" strokeWidth="8"
                                                    strokeDasharray={`${(result.overall_score / 10) * 251.2} 251.2`}
                                                    strokeLinecap="round"
                                                    className={getScoreBg(result.overall_score)}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className={`text-2xl font-bold ${getScoreColor(result.overall_score)}`}>
                                                    {result.overall_score}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Contract Score</h3>
                                            <p className="text-sm text-zinc-400">{result.contractType || 'Contract'}</p>
                                            {result.confidence && (
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Target className="w-3.5 h-3.5 text-zinc-500" />
                                                    <span className="text-xs text-zinc-500">{result.confidence}% betrouwbaarheid</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Risk Counts */}
                                    <div className="flex flex-wrap gap-3">
                                        {Object.entries(riskCounts).map(([severity, count]) => {
                                            const config = SEVERITY_CONFIG[severity];
                                            if (!config) return null;
                                            const Icon = config.icon;
                                            return (
                                                <div key={severity} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bg}`}>
                                                    <Icon className={`w-4 h-4 ${config.color}`} />
                                                    <span className={`text-sm font-medium ${config.color}`}>{count} {config.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Parties */}
                                {result.parties && result.parties.length > 0 && (
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-700">
                                        <Building2 className="w-4 h-4 text-zinc-500" />
                                        <span className="text-sm text-zinc-400">Partijen:</span>
                                        <span className="text-sm text-white">{result.parties.join(" & ")}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Bar */}
                            <ToolActionBar
                                exportFormats={['pdf', 'xlsx']}
                                onExport={async (format) => {
                                    if (format === 'pdf') downloadPDF();
                                    else if (format === 'xlsx') await handleExportRisks();
                                }}
                                copyText={result.summary}
                                copyJson={result}
                                onSaveToHistory={() => saveToHistory({ fileName: selectedFile?.name || 'Manual' }, result)}
                                onReset={reset}
                            />

                            {/* Tabs */}
                            <div className="flex gap-1 p-1 bg-zinc-800 rounded-xl">
                                {[
                                    { id: "overview" as const, label: "Overzicht" },
                                    { id: "risks" as const, label: `Risico's (${result.risks?.length || 0})` },
                                    { id: "clauses" as const, label: `Clausules (${result.clauses?.length || 0})` }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="space-y-4">
                                {activeTab === "overview" && (
                                    <>
                                        {/* Summary */}
                                        <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
                                            <button
                                                onClick={() => toggleSection("summary")}
                                                className="w-full flex items-center justify-between p-4 hover:bg-zinc-700/50 transition-colors"
                                            >
                                                <h4 className="font-semibold text-white flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-blue-400" />
                                                    Samenvatting
                                                </h4>
                                                {expandedSections.includes("summary") ? (
                                                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                                                )}
                                            </button>
                                            {expandedSections.includes("summary") && (
                                                <div className="px-4 pb-4">
                                                    <p className="text-zinc-300 text-sm leading-relaxed">{result.summary}</p>
                                                    <button
                                                        onClick={() => handleCopy(result.summary, "summary")}
                                                        className="flex items-center gap-1.5 mt-3 text-xs text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        {copied === "summary" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                        {copied === "summary" ? "Gekopieerd!" : "Kopieer"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Missing Protections */}
                                        {result.missing_protections && result.missing_protections.length > 0 && (
                                            <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
                                                <button
                                                    onClick={() => toggleSection("missing")}
                                                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-700/50 transition-colors"
                                                >
                                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                                        <ShieldAlert className="w-4 h-4 text-orange-400" />
                                                        Ontbrekende Beschermingen ({result.missing_protections.length})
                                                    </h4>
                                                    {expandedSections.includes("missing") ? (
                                                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                                                    )}
                                                </button>
                                                {expandedSections.includes("missing") && (
                                                    <div className="px-4 pb-4 space-y-2">
                                                        {result.missing_protections.map((item, idx) => (
                                                            <div key={idx} className="flex items-start gap-2 text-sm">
                                                                <ShieldQuestion className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                                                                <span className="text-zinc-300">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Suggestions */}
                                        {result.suggestions && result.suggestions.length > 0 && (
                                            <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
                                                <button
                                                    onClick={() => toggleSection("suggestions")}
                                                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-700/50 transition-colors"
                                                >
                                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                                                        Suggesties ({result.suggestions.length})
                                                    </h4>
                                                    {expandedSections.includes("suggestions") ? (
                                                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                                                    )}
                                                </button>
                                                {expandedSections.includes("suggestions") && (
                                                    <div className="px-4 pb-4 space-y-2">
                                                        {result.suggestions.map((suggestion, idx) => (
                                                            <div key={idx} className="flex items-start gap-2 text-sm">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                                <span className="text-zinc-300">{suggestion}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTab === "risks" && (
                                    <div className="space-y-3">
                                        {result.risks.map((risk, idx) => {
                                            const config = SEVERITY_CONFIG[risk.severity] || SEVERITY_CONFIG.medium;
                                            const Icon = config.icon;
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`p-4 rounded-xl border ${config.bg} ${config.bg.replace('bg-', 'border-').replace('/20', '/30')}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-lg ${config.bg}`}>
                                                            <Icon className={`w-5 h-5 ${config.color}`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                                                                    {config.label}
                                                                </span>
                                                                {risk.clause && (
                                                                    <span className="text-xs text-zinc-500">{risk.clause}</span>
                                                                )}
                                                            </div>
                                                            <p className="text-white font-medium text-sm">{risk.description}</p>
                                                            {risk.recommendation && (
                                                                <p className="text-zinc-400 text-xs mt-2">
                                                                    <span className="text-zinc-500">Aanbeveling:</span> {risk.recommendation}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeTab === "clauses" && result.clauses && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {result.clauses.map((clause, idx) => {
                                            const config = RISK_LEVEL_CONFIG[clause.riskLevel] || RISK_LEVEL_CONFIG.safe;
                                            return (
                                                <motion.div
                                                    key={clause.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                    className={`p-4 rounded-xl border ${config.bg} ${config.border}`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="text-white font-medium text-sm">{clause.title}</h5>
                                                        <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                                                            {clause.riskLevel === 'safe' ? 'Veilig' : clause.riskLevel === 'caution' ? 'Let op' : 'Risico'}
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-400 text-xs">{clause.content}</p>
                                                    <span className="inline-block mt-2 text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                                                        {clause.category}
                                                    </span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* New Analysis Button */}
                            <button onClick={reset} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Nieuw Contract Analyseren
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
