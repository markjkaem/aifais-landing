"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    CheckCircle2,
    Loader2,
    AlertTriangle,
    Zap,
    X,
    Coins,
    ArrowRight,
    CreditCard,
    Download,
    Copy,
    FileJson,
    Check,
    Upload,
    Sparkles,
    FileSpreadsheet,
    RotateCcw,
    Plus,
    File,
    Image as ImageIcon,
    ScanLine,
    Shield,
    Edit3,
    Save,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    History,
    Trash2,
    AlertCircle,
    Target,
    Clock
} from "lucide-react";
import CryptoModal from "@/app/Components/CryptoModal";
import { convertToCSV } from "@/utils/csv-formatter";
import { useResultHistory } from "@/hooks/useResultHistory";
import { ResultHistory } from "@/app/Components/tools/ResultHistory";
import { ToolActionBar } from "@/app/Components/tools/ToolActionBar";
import { exportData, downloadExport, ExportColumn } from "@/lib/export";

// --- CONFIG ---
const STRIPE_LINK_SINGLE =
    process.env.NEXT_PUBLIC_STRIPE_LINK_SINGLE ||
    "https://buy.stripe.com/test_4gM5kF3JOb2faig72R8EM00";

const SCAN_CONFIG = {
    priceSol: 0.001,
    priceEur: 0.50,
    name: "AI Factuur Scan",
};

// --- FEATURE DATA ---
const FEATURES = [
    {
        icon: ScanLine,
        title: "KvK & BTW Herkenning",
        description: "Automatische extractie van alle bedrijfsgegevens"
    },
    {
        icon: FileSpreadsheet,
        title: "Bulk Verwerking",
        description: "Tot 10 facturen tegelijk scannen"
    },
    {
        icon: Download,
        title: "Excel & CSV Export",
        description: "Direct klaar voor je boekhouding"
    },
    {
        icon: Shield,
        title: "99% Nauwkeurigheid",
        description: "Powered by Claude AI"
    },
];

const USE_CASES = [
    "Administratie automatiseren",
    "Boekhouding versnellen",
    "Facturen digitaliseren",
    "Gegevens extraheren",
];

// Export columns configuration
const EXPORT_COLUMNS: ExportColumn[] = [
    { key: 'result.companyName', label: 'Bedrijfsnaam' },
    { key: 'result.invoiceNumber', label: 'Factuurnummer' },
    { key: 'result.invoiceDate', label: 'Factuurdatum' },
    { key: 'result.dueDate', label: 'Vervaldatum' },
    { key: 'result.totalAmount', label: 'Totaalbedrag' },
    { key: 'result.vatAmount', label: 'BTW Bedrag' },
    { key: 'result.subtotal', label: 'Subtotaal' },
    { key: 'result.kvkNumber', label: 'KvK Nummer' },
    { key: 'result.vatNumber', label: 'BTW Nummer' },
    { key: 'result.iban', label: 'IBAN' },
    { key: 'result.confidence.overall', label: 'Betrouwbaarheid %' },
];

export default function InvoiceScannerPage() {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* SCANNER SECTION */}
            <section className="relative py-12 sm:py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScannerClient />
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-16 sm:py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section header */}
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                            Belangrijkste Features
                        </h2>
                        <p className="text-zinc-400 max-w-xl mx-auto">
                            Alles wat je nodig hebt om facturen snel en nauwkeurig te verwerken
                        </p>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {FEATURES.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                            <Icon className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                                            <p className="text-sm text-zinc-400">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* USE CASES SECTION */}
            <section className="py-16 sm:py-24 bg-zinc-900/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8">
                            Wanneer gebruik je deze tool?
                        </h2>

                        <div className="flex flex-wrap justify-center gap-3">
                            {USE_CASES.map((useCase, idx) => (
                                <span
                                    key={idx}
                                    className="px-5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-full text-sm font-medium text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default"
                                >
                                    {useCase}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-16 sm:py-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-sm font-medium text-emerald-400 mb-6">
                        <Zap className="w-4 h-4" />
                        Geen account nodig
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                        Klaar om te beginnen?
                    </h2>
                    <p className="text-zinc-400 mb-8">
                        Upload je eerste factuur en ervaar hoe eenvoudig het is.
                    </p>

                    <a
                        href="#scanner"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                        Start nu
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </section>
        </div>
    );
}


// ============================================
// SCANNER CLIENT COMPONENT
// ============================================

interface ScanResult {
    success: boolean;
    result?: {
        companyName?: string;
        invoiceNumber?: string;
        invoiceDate?: string;
        dueDate?: string;
        totalAmount?: string;
        vatAmount?: string;
        subtotal?: string;
        kvkNumber?: string;
        vatNumber?: string;
        iban?: string;
        confidence?: {
            overall: number;
            fields: Record<string, number>;
        };
        warnings?: string[];
        extractedAt?: string;
    };
    error?: string;
    index?: number;
    retryable?: boolean;
    processingTime?: number;
}

function ScannerClient() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});
    const [isDragging, setIsDragging] = useState(false);

    const [isScanning, setIsScanning] = useState(false);
    const [scanningIndices, setScanningIndices] = useState<number[]>([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showCryptoQR, setShowCryptoQR] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const [scanResults, setScanResults] = useState<ScanResult[] | null>(null);
    const [batchStats, setBatchStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [paymentProof, setPaymentProof] = useState<{
        type: "crypto" | "stripe";
        id: string;
    } | null>(null);

    // Editing state
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<any>(null);

    // History
    const [showHistory, setShowHistory] = useState(false);
    const { 
        history: historyItems, 
        saveToHistory: addToHistory, 
        deleteEntry: deleteFromHistory, 
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<{ results: ScanResult[], batchStats: any, files: string[] }>('invoice-scanner');

    // Expanded results
    const [expandedResults, setExpandedResults] = useState<number[]>([]);

    // --- INIT PDF WORKER ---
    useEffect(() => {
        const initPdfWorker = async () => {
            if (typeof window !== "undefined") {
                try {
                    const pdfjs = await import("pdfjs-dist");
                    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
                } catch (e) {
                    console.error(e);
                }
            }
        };
        initPdfWorker();
    }, []);

    // --- STRIPE RETURN HANDLER ---
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        if (sessionId) {
            setPaymentProof({ type: "stripe", id: sessionId });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // --- DRAG & DROP ---
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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processNewFiles(Array.from(e.dataTransfer.files));
        }
    };

    const processNewFiles = (newFiles: File[]) => {
        const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 10);
        setSelectedFiles(combinedFiles);
        setScanResults(null);
        setError(null);
        if (scanResults) setPaymentProof(null);

        newFiles.forEach(file => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviews(prev => ({ ...prev, [file.name]: e.target?.result as string }));
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processNewFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index: number) => {
        const fileToRemove = selectedFiles[index];
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
        if (fileToRemove) {
            const newPreviews = { ...previews };
            delete newPreviews[fileToRemove.name];
            setPreviews(newPreviews);
        }
    };

    const convertFileToBase64 = async (file: File): Promise<{ base64: string; mimeType: string }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
                base64: (reader.result as string).split(",")[1],
                mimeType: file.type === "application/pdf" ? "application/pdf" : file.type,
            });
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleCopyJSON = () => {
        if (!scanResults) return;
        navigator.clipboard.writeText(JSON.stringify(scanResults, null, 2));
        setCopied("json");
        setTimeout(() => setCopied(null), 2000);
    };

    const handleDownloadCSV = () => {
        if (!scanResults) return;
        const csv = convertToCSV(scanResults.filter(r => r.success).map(r => r.result));
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `facturen_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadJSON = () => {
        if (!scanResults) return;
        const json = JSON.stringify(scanResults.filter(r => r.success).map(r => r.result), null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `facturen_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadXLSX = async () => {
        if (!scanResults) return;
        try {
            const successfulResults = scanResults.filter(r => r.success);
            const result = await exportData('xlsx', successfulResults, { columns: EXPORT_COLUMNS, filename: 'facturen' });
            downloadExport(result);
        } catch (e) {
            console.error('XLSX export failed:', e);
        }
    };

    const handleCryptoSuccess = async (signature: string) => {
        setShowCryptoQR(false);
        setShowPaymentModal(false);
        setPaymentProof({ type: "crypto", id: signature });
        await performScan({ type: "crypto", id: signature });
    };

    const performScan = async (proof: { type: "crypto" | "stripe"; id: string }, retryIndices?: number[]) => {
        if (selectedFiles.length === 0) return;
        setIsScanning(true);
        setError(null);

        const indicesToScan = retryIndices || selectedFiles.map((_, i) => i);
        setScanningIndices(indicesToScan);

        try {
            const filesToScan = retryIndices
                ? retryIndices.map(i => selectedFiles[i])
                : selectedFiles;

            const invoices = await Promise.all(filesToScan.map(file => convertFileToBase64(file)));
            const response = await fetch("/api/v1/finance/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    signature: proof.type === "crypto" ? proof.id : undefined,
                    stripeSessionId: proof.type === "stripe" ? proof.id : undefined,
                    invoices: invoices
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                const isDoubleSpend = response.status === 409 ||
                    data.error?.toLowerCase().includes('double spend') ||
                    data.error?.toLowerCase().includes('already used');
                if (isDoubleSpend) {
                    setPaymentProof(null);
                    throw new Error("Deze betaling is al gebruikt. Betaal opnieuw om door te gaan.");
                }
                throw new Error(data.error || "Scan failed");
            }

            const results = Array.isArray(data.data?.results) ? data.data.results : [data.data?.results || data.data];
            setBatchStats(data.data?.batchStats);

            if (retryIndices) {
                // Merge retry results with existing results
                setScanResults(prev => {
                    if (!prev) return results;
                    const newResults = [...prev];
                    retryIndices.forEach((origIndex, resultIndex) => {
                        if (results[resultIndex]) {
                            newResults[origIndex] = results[resultIndex];
                        }
                    });
                    return newResults;
                });
            } else {
                setScanResults(results);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Er is iets misgegaan bij het scannen.");
        } finally {
            setIsScanning(false);
            setScanningIndices([]);
        }
    };

    // Individual retry
    const retrySingleFile = async (index: number) => {
        if (!paymentProof) return;
        await performScan(paymentProof, [index]);
    };

    // Edit mode
    const startEditing = (index: number) => {
        if (scanResults && scanResults[index]?.result) {
            setEditingIndex(index);
            setEditedData({ ...scanResults[index].result });
        }
    };

    const saveEdit = () => {
        if (editingIndex !== null && editedData && scanResults) {
            const newResults = [...scanResults];
            newResults[editingIndex] = {
                ...newResults[editingIndex],
                result: editedData
            };
            setScanResults(newResults);
            setEditingIndex(null);
            setEditedData(null);
        }
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditedData(null);
    };

    // Save to history
    const handleSaveToHistory = () => {
        if (scanResults && batchStats) {
            addToHistory(
                { files: selectedFiles.map(f => f.name) },
                {
                    results: scanResults,
                    batchStats,
                    files: selectedFiles.map(f => f.name)
                },
                ['invoice-scanner', `${successCount} success`]
            );
        }
    };

    // Load from history
    const handleLoadFromHistory = (entry: any) => {
        const item = entry.result;
        setScanResults(item.results);
        setBatchStats(item.batchStats);
        setShowHistory(false);
    };

    const reset = () => {
        setSelectedFiles([]);
        setPreviews({});
        setScanResults(null);
        setBatchStats(null);
        setPaymentProof(null);
        setError(null);
        setEditingIndex(null);
        setEditedData(null);
        setExpandedResults([]);
    };

    const toggleExpand = (index: number) => {
        setExpandedResults(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const successCount = scanResults?.filter(r => r.success).length || 0;
    const failCount = scanResults?.filter(r => !r.success).length || 0;

    // Confidence color helper
    const getConfidenceColor = (score: number) => {
        if (score >= 85) return 'text-emerald-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getConfidenceBg = (score: number) => {
        if (score >= 85) return 'bg-emerald-500/20';
        if (score >= 70) return 'bg-yellow-500/20';
        return 'bg-red-500/20';
    };

    return (
        <div id="scanner" className="scroll-mt-8">
            {/* Main Card */}
            <div className="relative bg-zinc-900 rounded-3xl shadow-2xl shadow-black/50 border border-zinc-800 overflow-hidden">

                {/* PAYMENT MODAL */}
                {showPaymentModal && !showCryptoQR && (
                    <div className="absolute inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-6">
                        <div className="bg-zinc-900 rounded-2xl w-full max-w-sm shadow-2xl border border-zinc-800 overflow-hidden">
                            <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Betaalmethode</h3>
                                    <p className="text-sm text-zinc-400">{selectedFiles.length} facturen scannen</p>
                                </div>
                                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-3">
                                <button
                                    onClick={() => (window.location.href = STRIPE_LINK_SINGLE)}
                                    className="group w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-zinc-700 rounded-lg">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <span>iDEAL / Card</span>
                                    </div>
                                    <span className="text-lg">€{SCAN_CONFIG.priceEur.toFixed(2)}</span>
                                </button>

                                <button
                                    onClick={() => setShowCryptoQR(true)}
                                    className="group w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Coins className="w-5 h-5" />
                                        </div>
                                        <span>Solana Pay</span>
                                    </div>
                                    <span className="text-lg">{SCAN_CONFIG.priceSol} SOL</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CRYPTO MODAL */}
                {showCryptoQR && (
                    <CryptoModal
                        priceInSol={SCAN_CONFIG.priceSol}
                        scansAmount={selectedFiles.length}
                        label={SCAN_CONFIG.name}
                        onClose={() => { setShowCryptoQR(false); setShowPaymentModal(false); }}
                        onSuccess={handleCryptoSuccess}
                        priceInEur={0}
                    />
                )}

                {/* Content */}
                <div className="p-6 sm:p-8 lg:p-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-25" />
                                <div className="relative w-14 h-14 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                    <Zap className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">AI Factuur Scanner</h2>
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
                            {selectedFiles.length > 0 && !scanResults && (
                                <span className="hidden sm:flex px-4 py-2 bg-zinc-800 text-zinc-400 rounded-full text-sm font-medium">
                                    {selectedFiles.length}/10
                                </span>
                            )}
                            {scanResults && (
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
                                    history={historyItems}
                                    onLoadEntry={handleLoadFromHistory}
                                    onDeleteEntry={deleteFromHistory}
                                    onClearHistory={clearHistory}
                                    onToggleStar={toggleStar}
                                    onExportHistory={exportHistory}
                                    onImportHistory={importHistory}
                                    renderPreview={({ result }) => (
                                        <div className="text-sm">
                                            <span className="text-zinc-400">{result.files?.length || 0} bestanden</span>
                                            <span className="mx-2 text-zinc-600">•</span>
                                            <span className="text-emerald-400">{result.batchStats?.successful || 0} geslaagd</span>
                                        </div>
                                    )}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* STATE 1: UPLOAD */}
                    {selectedFiles.length === 0 && !scanResults && (
                        <div className="space-y-6">
                            {paymentProof && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-emerald-400 font-semibold">Betaling succesvol!</h3>
                                        <p className="text-emerald-400/70 text-sm">Selecteer je facturen om te starten.</p>
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
                                    accept="image/*, application/pdf"
                                    multiple
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <div className={`
                                    relative h-64 sm:h-72 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                                    ${isDragging ? "border-emerald-500 bg-emerald-500/5 scale-[1.01]" : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800"}
                                `}>
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragging ? "bg-emerald-500 text-white" : "bg-zinc-700 text-zinc-400"}`}>
                                        <Upload className="w-7 h-7" />
                                    </div>

                                    <p className="text-base sm:text-lg font-semibold text-white mb-1">
                                        {isDragging ? "Laat los om te uploaden" : "Sleep facturen hierheen"}
                                    </p>
                                    <p className="text-sm text-zinc-400">
                                        of <span className="text-emerald-400 font-medium">klik om te bladeren</span>
                                    </p>

                                    <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1.5"><File className="w-3.5 h-3.5" /> PDF</span>
                                        <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> JPG, PNG</span>
                                        <span>Max 10 bestanden</span>
                                    </div>
                                </div>
                            </div>

                            {!paymentProof && (
                                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full">
                                        <Coins className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm text-zinc-300 font-medium">0.001 SOL / batch</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full">
                                        <Sparkles className="w-4 h-4 text-violet-400" />
                                        <span className="text-sm text-zinc-300 font-medium">Claude AI</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STATE 2: PREVIEW & ACTION */}
                    {selectedFiles.length > 0 && !scanResults && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                                {selectedFiles.map((file, idx) => (
                                    <div key={idx} className="group bg-zinc-800 hover:bg-zinc-700/50 rounded-xl p-3 border border-zinc-700 flex items-center gap-3 transition-colors">
                                        <div className="w-11 h-11 bg-zinc-700 border border-zinc-600 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                            {previews[file.name] ? (
                                                <img src={previews[file.name]} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <FileText className="text-zinc-400 w-5 h-5" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate text-sm">{file.name}</p>
                                            <p className="text-zinc-500 text-xs">{(file.size / 1024).toFixed(0)} KB</p>
                                        </div>
                                        {scanningIndices.includes(idx) ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                                        ) : (
                                            <button onClick={() => removeFile(idx)} disabled={isScanning} className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-all">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {selectedFiles.length < 10 && (
                                    <div className="relative group">
                                        <input type="file" onChange={handleFileChange} accept="image/*, application/pdf" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        <div className="h-full min-h-[68px] border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer">
                                            <Plus className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                                            <span className="text-xs text-zinc-500 group-hover:text-emerald-400 mt-1">Toevoegen</span>
                                        </div>
                                    </div>
                                )}
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
                                    disabled={isScanning}
                                    className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
                                >
                                    <span>Scan {selectedFiles.length} {selectedFiles.length === 1 ? 'factuur' : 'facturen'}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => performScan(paymentProof!)}
                                    disabled={isScanning}
                                    className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 disabled:opacity-70"
                                >
                                    {isScanning ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /><span>Scannen...</span></>
                                    ) : (
                                        <><Zap className="w-5 h-5" /><span>Start scan</span></>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {/* STATE 3: RESULTS */}
                    {scanResults && (
                        <div className="space-y-6">
                            {/* Success Banner with Stats */}
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-emerald-400">Scan voltooid!</h3>
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="text-emerald-400/70">{successCount} geslaagd</span>
                                                {failCount > 0 && <span className="text-red-400/70">{failCount} gefaald</span>}
                                                {batchStats?.averageConfidence && (
                                                    <span className={`flex items-center gap-1 ${getConfidenceColor(batchStats.averageConfidence)}`}>
                                                        <Target className="w-3.5 h-3.5" />
                                                        {batchStats.averageConfidence}% gemiddeld
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <ToolActionBar
                                exportFormats={['json', 'csv', 'xlsx']}
                                onExport={async (format) => {
                                    if (format === 'json') handleDownloadJSON();
                                    else if (format === 'csv') handleDownloadCSV();
                                    else if (format === 'xlsx') await handleDownloadXLSX();
                                }}
                                copyJson={scanResults.filter(r => r.success).map(r => r.result)}
                                onSaveToHistory={handleSaveToHistory}
                                onReset={reset}
                            />

                            {/* Results List */}
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {scanResults.map((result, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden"
                                    >
                                        {/* Result Header */}
                                        <div
                                            className="bg-zinc-800/50 px-4 py-3 border-b border-zinc-700 flex justify-between items-center cursor-pointer hover:bg-zinc-700/50 transition-colors"
                                            onClick={() => toggleExpand(idx)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.success ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                                    {result.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-sm text-white truncate max-w-[200px] block">
                                                        {result.result?.companyName || selectedFiles[idx]?.name || `Resultaat #${idx + 1}`}
                                                    </span>
                                                    {result.result?.invoiceNumber && (
                                                        <span className="text-xs text-zinc-400">#{result.result.invoiceNumber}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {result.success && result.result?.confidence?.overall && (
                                                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getConfidenceBg(result.result.confidence.overall)} ${getConfidenceColor(result.result.confidence.overall)}`}>
                                                        {result.result.confidence.overall}%
                                                    </div>
                                                )}
                                                {!result.success && result.retryable && paymentProof && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); retrySingleFile(idx); }}
                                                        disabled={scanningIndices.includes(idx)}
                                                        className="p-1.5 hover:bg-zinc-600 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        {scanningIndices.includes(idx) ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <RefreshCw className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                                {expandedResults.includes(idx) ? (
                                                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        <AnimatePresence>
                                            {expandedResults.includes(idx) && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4">
                                                        {result.success && result.result ? (
                                                            editingIndex === idx ? (
                                                                // Edit Mode
                                                                <div className="space-y-4">
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        {[
                                                                            { key: 'companyName', label: 'Bedrijfsnaam' },
                                                                            { key: 'invoiceNumber', label: 'Factuurnummer' },
                                                                            { key: 'invoiceDate', label: 'Factuurdatum' },
                                                                            { key: 'dueDate', label: 'Vervaldatum' },
                                                                            { key: 'totalAmount', label: 'Totaalbedrag' },
                                                                            { key: 'vatAmount', label: 'BTW Bedrag' },
                                                                            { key: 'kvkNumber', label: 'KvK Nummer' },
                                                                            { key: 'vatNumber', label: 'BTW Nummer' },
                                                                            { key: 'iban', label: 'IBAN' },
                                                                        ].map(field => (
                                                                            <div key={field.key}>
                                                                                <label className="text-xs text-zinc-400 mb-1 block">{field.label}</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={editedData[field.key] || ''}
                                                                                    onChange={(e) => setEditedData({ ...editedData, [field.key]: e.target.value })}
                                                                                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="flex justify-end gap-2">
                                                                        <button onClick={cancelEdit} className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
                                                                            Annuleren
                                                                        </button>
                                                                        <button onClick={saveEdit} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5">
                                                                            <Save className="w-3.5 h-3.5" />
                                                                            Opslaan
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                // View Mode
                                                                <div className="space-y-4">
                                                                    {/* Warnings */}
                                                                    {result.result.warnings && result.result.warnings.length > 0 && (
                                                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                                                                <span className="text-sm font-medium text-yellow-400">Let op</span>
                                                                            </div>
                                                                            <ul className="text-xs text-yellow-400/70 space-y-1">
                                                                                {result.result.warnings.map((w, i) => (
                                                                                    <li key={i}>• {w}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {/* Data Grid */}
                                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                                                        {[
                                                                            { key: 'companyName', label: 'Bedrijfsnaam' },
                                                                            { key: 'invoiceNumber', label: 'Factuurnummer' },
                                                                            { key: 'invoiceDate', label: 'Factuurdatum' },
                                                                            { key: 'dueDate', label: 'Vervaldatum' },
                                                                            { key: 'totalAmount', label: 'Totaalbedrag' },
                                                                            { key: 'vatAmount', label: 'BTW Bedrag' },
                                                                            { key: 'subtotal', label: 'Subtotaal' },
                                                                            { key: 'kvkNumber', label: 'KvK Nummer' },
                                                                            { key: 'vatNumber', label: 'BTW Nummer' },
                                                                            { key: 'iban', label: 'IBAN' },
                                                                        ].map(field => {
                                                                            const value = result.result![field.key as keyof typeof result.result];
                                                                            const confidence = result.result!.confidence?.fields?.[field.key];
                                                                            if (!value) return null;

                                                                            return (
                                                                                <div key={field.key} className="flex items-start justify-between">
                                                                                    <div>
                                                                                        <span className="text-xs text-zinc-500 block">{field.label}</span>
                                                                                        <span className="text-sm text-white">{String(value)}</span>
                                                                                    </div>
                                                                                    {confidence !== undefined && (
                                                                                        <span className={`text-xs ${getConfidenceColor(confidence)}`}>
                                                                                            {confidence}%
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>

                                                                    {/* Edit Button */}
                                                                    <div className="flex justify-end pt-2 border-t border-zinc-700">
                                                                        <button
                                                                            onClick={() => startEditing(idx)}
                                                                            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
                                                                        >
                                                                            <Edit3 className="w-3.5 h-3.5" />
                                                                            Bewerken
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ) : (
                                                            // Error State
                                                            <div className="flex items-center gap-3">
                                                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                                                <p className="text-sm text-red-400">{result.error}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>

                            {/* New Scan Button */}
                            <button onClick={reset} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Nieuwe batch scannen
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
