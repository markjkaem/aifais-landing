"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Loader2,
    Download,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Coins,
    CreditCard,
    X,
    Shield,
    Edit3,
    Save,
    Copy,
    FileDown,
    Clock,
    Building2,
    Package,
    Truck,
    RotateCcw,
    CreditCard as PaymentIcon,
    Scale,
    Lock,
    Check,
    AlertCircle,
    FileCode,
    History
} from "lucide-react";
import CryptoModal from "@/app/Components/CryptoModal";
import TemplateSelector from "@/app/Components/tools/TemplateSelector";
import ToolActionBar from "@/app/Components/tools/ToolActionBar";
import { useResultHistory } from "@/hooks/useResultHistory";
import { exportData, downloadExport } from "@/lib/export";

const TERMS_CONFIG = {
    priceSol: 0.001,
    priceEur: 0.50,
    name: "Algemene Voorwaarden Generator",
};

interface TermsSection {
    id: string;
    title: string;
    content: string;
    isEditable?: boolean;
    isGDPR?: boolean;
    hidden?: boolean;
}

interface TermsResult {
    sections: TermsSection[];
    version: string;
    generatedAt: string;
    jurisdiction: string;
    summary?: string;
    legalNotes?: string[];
    pdfBase64: string;
    processingTime?: number;
    promptVersion?: string;
}

interface FormData {
    companyName: string;
    companyType: string;
    industry: string;
    hasPhysicalProducts: boolean;
    hasDigitalProducts: boolean;
    hasServices: boolean;
    acceptsReturns: boolean;
    returnDays: number;
    paymentTerms: number;
    jurisdiction: string;
    includeGDPR: boolean;
}

const COMPANY_TYPES = [
    { value: "bv", label: "B.V." },
    { value: "eenmanszaak", label: "Eenmanszaak" },
    { value: "vof", label: "V.O.F." },
    { value: "stichting", label: "Stichting" },
    { value: "vereniging", label: "Vereniging" },
    { value: "nv", label: "N.V." },
];

const JURISDICTIONS = [
    { value: "Nederland", label: "Nederland" },
    { value: "Belgie", label: "België" },
];

export default function TermsGeneratorClient() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        companyName: "",
        companyType: "bv",
        industry: "",
        hasPhysicalProducts: false,
        hasDigitalProducts: false,
        hasServices: true,
        acceptsReturns: false,
        returnDays: 14,
        paymentTerms: 14,
        jurisdiction: "Nederland",
        includeGDPR: true,
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<TermsResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState<string>("");
    const [showHistory, setShowHistory] = useState(false);

    // Payment State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showCryptoQR, setShowCryptoQR] = useState(false);
    const [paymentProof, setPaymentProof] = useState<{
        type: "crypto" | "stripe";
        id: string;
    } | null>(null);

    // Result history
    const { 
        history: historyResults, 
        saveToHistory, 
        clearHistory,
        deleteEntry,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<TermsResult>("terms-generator");

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectTemplate = useCallback((templateData: any) => {
        if (templateData) {
            setFormData(prev => ({ ...prev, ...templateData }));
        }
    }, []);

    const handleGenClick = () => {
        if (paymentProof) {
            handleGenerate();
        } else {
            setShowPaymentModal(true);
        }
    };

    const handleCryptoSuccess = async (signature: string) => {
        setShowCryptoQR(false);
        setShowPaymentModal(false);
        setPaymentProof({ type: "crypto", id: signature });
        setTimeout(() => handleGenerate(signature), 100);
    };

    const handleGenerate = async (signature?: string) => {
        setIsGenerating(true);
        setError(null);

        const sigToUse = signature || (paymentProof?.type === 'crypto' ? paymentProof.id : undefined);

        try {
            const response = await fetch("/api/v1/legal/generate-terms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    signature: sigToUse,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Generatie mislukt");
            }

            const resultData: TermsResult = data.data;
            setResult(resultData);
            saveToHistory(
                { companyName: formData.companyName },
                resultData,
                ["terms-generator", formData.companyName]
            );
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Er is iets misgegaan.");
            if (err.message && (err.message.includes("payment") || err.message.includes("signature"))) {
                setPaymentProof(null);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEditSection = (sectionId: string) => {
        const section = result?.sections.find(s => s.id === sectionId);
        if (section) {
            setEditingSection(sectionId);
            setEditedContent(section.content);
        }
    };

    const handleSaveEdit = () => {
        if (!result || !editingSection) return;

        const updatedSections = result.sections.map(section =>
            section.id === editingSection
                ? { ...section, content: editedContent }
                : section
        );

        setResult({ ...result, sections: updatedSections });
        setEditingSection(null);
        setEditedContent("");
    };

    const handleCancelEdit = () => {
        setEditingSection(null);
        setEditedContent("");
    };

    const toggleGDPRSections = () => {
        if (!result) return;

        const updatedSections = result.sections.map(section => ({
            ...section,
            hidden: section.isGDPR ? !section.hidden : section.hidden
        }));

        setResult({ ...result, sections: updatedSections as TermsSection[] });
    };

    const downloadPDF = () => {
        if (!result?.pdfBase64) return;
        const pdfBlob = new Blob(
            [Uint8Array.from(atob(result.pdfBase64), c => c.charCodeAt(0))],
            { type: "application/pdf" }
        );
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `algemene_voorwaarden_${formData.companyName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportAsDOCX = async () => {
        if (!result) return;

        const sections = result.sections.map(s => ({
            title: s.title,
            content: s.content
        }));

        const documentContent = {
            title: `Algemene Voorwaarden - ${formData.companyName}`,
            sections: [
                { title: "Samenvatting", content: result.summary || "" },
                ...sections.map(s => ({ title: s.title, content: s.content })),
                ...(result.legalNotes ? [{ title: "Juridische Opmerkingen", content: result.legalNotes.join("\n\n") }] : [])
            ],
            metadata: {
                author: "AIFAIS",
                createdAt: result.generatedAt
            }
        };

        const docxResult = await exportData("docx", documentContent, {
            filename: `algemene_voorwaarden_${formData.companyName.replace(/\s+/g, '_')}`
        });
        downloadExport(docxResult);
    };

    const copyAsMarkdown = () => {
        if (!result) return;

        let markdown = `# Algemene Voorwaarden\n## ${formData.companyName}\n\n`;
        markdown += `*Versie: ${result.version} | ${new Date(result.generatedAt).toLocaleDateString("nl-NL")}*\n\n`;

        if (result.summary) {
            markdown += `---\n\n${result.summary}\n\n---\n\n`;
        }

        for (const section of result.sections) {
            markdown += `### ${section.title}\n\n${section.content}\n\n`;
        }

        if (result.legalNotes) {
            markdown += `---\n\n**Juridische Opmerkingen:**\n\n`;
            for (const note of result.legalNotes) {
                markdown += `- ${note}\n`;
            }
        }

        navigator.clipboard.writeText(markdown);
    };

    const loadFromHistory = (historyItem: TermsResult) => {
        setResult(historyItem);
        setShowHistory(false);
    };

    const reset = () => {
        setResult(null);
        setError(null);
        setStep(1);
        setPaymentProof(null);
        setEditingSection(null);
    };

    // Result View
    if (result) {
        const visibleSections = result.sections.filter(s => !(s as any).hidden);
        const gdprSections = result.sections.filter(s => s.isGDPR);

        return (
            <div className="w-full max-w-5xl mx-auto">
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6"
                >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Voorwaarden Gegenereerd</h2>
                                <p className="text-zinc-400 text-sm">
                                    {formData.companyName} • Versie {result.version} • {result.sections.length} artikelen
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition text-zinc-400 hover:text-white"
                                title="Geschiedenis"
                            >
                                <History className="w-5 h-5" />
                            </button>
                            <button
                                onClick={reset}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Nieuw
                            </button>
                        </div>
                    </div>

                    {/* Processing info */}
                    {result.processingTime && (
                        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {(result.processingTime / 1000).toFixed(1)}s
                            </span>
                            <span>Jurisdictie: {result.jurisdiction}</span>
                            {result.promptVersion && <span>v{result.promptVersion}</span>}
                        </div>
                    )}
                </motion.div>

                {/* History Panel */}
                <AnimatePresence>
                    {showHistory && historyResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white font-semibold">Recente Voorwaarden</h3>
                                <button
                                    onClick={clearHistory}
                                    className="text-xs text-zinc-500 hover:text-zinc-300"
                                >
                                    Wis geschiedenis
                                </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {historyResults.slice(0, 5).map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => loadFromHistory(item.result)}
                                        className="w-full text-left p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition"
                                    >
                                        <div className="text-white text-sm font-medium">
                                            {item.result.sections[0]?.title || "Voorwaarden"}
                                        </div>
                                        <div className="text-zinc-500 text-xs">
                                            {new Date(item.timestamp).toLocaleString("nl-NL")}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Bar */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={downloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                        <button
                            onClick={exportAsDOCX}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
                        >
                            <FileDown className="w-4 h-4" />
                            Export DOCX
                        </button>
                        <button
                            onClick={copyAsMarkdown}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
                        >
                            <FileCode className="w-4 h-4" />
                            Copy Markdown
                        </button>

                        {gdprSections.length > 0 && (
                            <button
                                onClick={toggleGDPRSections}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition ml-auto"
                            >
                                <Lock className="w-4 h-4" />
                                Toggle AVG Secties
                            </button>
                        )}
                    </div>
                </div>

                {/* Summary */}
                {result.summary && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6"
                    >
                        <h3 className="text-white font-semibold mb-3">Samenvatting</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">{result.summary}</p>
                    </motion.div>
                )}

                {/* Sections */}
                <div className="space-y-4">
                    {visibleSections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-zinc-900 border rounded-2xl overflow-hidden ${
                                section.isGDPR ? "border-purple-500/30" : "border-zinc-800"
                            }`}
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-white font-semibold">{section.title}</h4>
                                        {section.isGDPR && (
                                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                                AVG
                                            </span>
                                        )}
                                    </div>

                                    {section.isEditable !== false && editingSection !== section.id && (
                                        <button
                                            onClick={() => handleEditSection(section.id)}
                                            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {editingSection === section.id ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Opslaan
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
                                            >
                                                Annuleren
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-zinc-400 text-sm whitespace-pre-line leading-relaxed">
                                        {section.content}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Legal Notes */}
                {result.legalNotes && result.legalNotes.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-amber-400" />
                            <h3 className="text-amber-400 font-semibold">Juridische Opmerkingen</h3>
                        </div>
                        <ul className="space-y-2">
                            {result.legalNotes.map((note, index) => (
                                <li key={index} className="text-amber-200/80 text-sm flex items-start gap-2">
                                    <span className="text-amber-400 mt-1">•</span>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>
        );
    }

    // Form View
    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative">
                {/* Payment Modal */}
                <AnimatePresence>
                    {showPaymentModal && !showCryptoQR && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-zinc-900/95 backdrop-blur-sm flex items-center justify-center p-6 rounded-2xl"
                        >
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                                className="bg-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl border border-zinc-700 overflow-hidden"
                            >
                                <div className="px-6 py-5 border-b border-zinc-700 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Naar de Kassa</h3>
                                        <p className="text-sm text-zinc-400">Professionele juridische documenten</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="p-2 hover:bg-zinc-700 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-zinc-400" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-3">
                                    <button
                                        onClick={() => (window.location.href = process.env.NEXT_PUBLIC_STRIPE_LINK_TERMS || "#")}
                                        className="group w-full bg-white hover:bg-zinc-100 text-zinc-900 font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-100 rounded-lg">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <span>iDEAL / Card</span>
                                        </div>
                                        <span className="text-lg font-bold">€{TERMS_CONFIG.priceEur.toFixed(2)}</span>
                                    </button>

                                    <button
                                        onClick={() => setShowCryptoQR(true)}
                                        className="group w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                <Coins className="w-5 h-5" />
                                            </div>
                                            <span>Solana Pay</span>
                                        </div>
                                        <span className="text-lg font-bold">{TERMS_CONFIG.priceSol} SOL</span>
                                    </button>
                                </div>

                                <div className="bg-zinc-900 px-6 py-3 text-center text-xs text-zinc-500 border-t border-zinc-700">
                                    Veilig betalen via X402 Protocol
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Crypto QR Modal */}
                {showCryptoQR && (
                    <div className="absolute inset-0 z-50 bg-zinc-900/95 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                        <CryptoModal
                            priceInSol={TERMS_CONFIG.priceSol}
                            scansAmount={1}
                            label={TERMS_CONFIG.name}
                            onClose={() => { setShowCryptoQR(false); setShowPaymentModal(false); }}
                            onSuccess={handleCryptoSuccess}
                            priceInEur={TERMS_CONFIG.priceEur}
                        />
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <FileText className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Algemene Voorwaarden</h2>
                            <p className="text-zinc-400 text-sm">Genereer professionele juridische documenten</p>
                        </div>
                    </div>

                    <TemplateSelector
                        toolId="terms-generator"
                        currentData={formData}
                        onSelectTemplate={handleSelectTemplate}
                    />
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                                    step >= s
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-800 text-zinc-500"
                                }`}
                            >
                                {step > s ? <Check className="w-5 h-5" /> : s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`flex-1 h-1 mx-2 rounded transition-colors ${
                                        step > s ? "bg-blue-600" : "bg-zinc-800"
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {/* Step 1: Bedrijfsgegevens */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-bold text-white">Bedrijfsgegevens</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Bedrijfsnaam *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Bijv. AIFAIS B.V."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Rechtsvorm
                                        </label>
                                        <select
                                            value={formData.companyType}
                                            onChange={(e) => handleInputChange("companyType", e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {COMPANY_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Jurisdictie
                                        </label>
                                        <select
                                            value={formData.jurisdiction}
                                            onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {JURISDICTIONS.map(j => (
                                                <option key={j.value} value={j.value}>
                                                    {j.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Branche
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={(e) => handleInputChange("industry", e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Bijv. Software, E-commerce, Consultancy"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.companyName}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                            >
                                Volgende
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Producten & Diensten */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-bold text-white">Wat bied je aan?</h3>
                            </div>

                            <div className="space-y-3">
                                {[
                                    {
                                        key: "hasPhysicalProducts",
                                        icon: Truck,
                                        label: "Fysieke producten",
                                        desc: "Producten die je verzendt"
                                    },
                                    {
                                        key: "hasDigitalProducts",
                                        icon: FileDown,
                                        label: "Digitale producten",
                                        desc: "Software, downloads, e-books"
                                    },
                                    {
                                        key: "hasServices",
                                        icon: Building2,
                                        label: "Diensten",
                                        desc: "Consultancy, advies, onderhoud"
                                    }
                                ].map(item => {
                                    const Icon = item.icon;
                                    const isChecked = formData[item.key as keyof FormData];
                                    return (
                                        <label
                                            key={item.key}
                                            className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${
                                                isChecked
                                                    ? "bg-blue-500/10 border-blue-500/50"
                                                    : "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked as boolean}
                                                onChange={(e) => handleInputChange(item.key as keyof FormData, e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                isChecked ? "bg-blue-500/20" : "bg-zinc-700"
                                            }`}>
                                                <Icon className={`w-5 h-5 ${isChecked ? "text-blue-400" : "text-zinc-400"}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-medium">{item.label}</div>
                                                <div className="text-zinc-500 text-sm">{item.desc}</div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                                                isChecked ? "bg-blue-600 border-blue-600" : "border-zinc-600"
                                            }`}>
                                                {isChecked && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Vorige
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    Volgende
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Voorwaarden & Beleid */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Scale className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-bold text-white">Voorwaarden & Beleid</h3>
                            </div>

                            <div className="space-y-5">
                                {/* Returns */}
                                <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.acceptsReturns}
                                            onChange={(e) => handleInputChange("acceptsReturns", e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                                            formData.acceptsReturns ? "bg-blue-600 border-blue-600" : "border-zinc-600"
                                        }`}>
                                            {formData.acceptsReturns && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className="text-white font-medium">Retourrecht toestaan</span>
                                    </label>

                                    {formData.acceptsReturns && (
                                        <div className="mt-4 ml-9">
                                            <label className="block text-sm text-zinc-400 mb-2">
                                                Retourperiode (dagen)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.returnDays}
                                                onChange={(e) => handleInputChange("returnDays", parseInt(e.target.value))}
                                                className="w-24 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Payment Terms */}
                                <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <PaymentIcon className="w-5 h-5 text-zinc-400" />
                                        <span className="text-white font-medium">Betaaltermijn</span>
                                    </div>
                                    <div className="flex items-center gap-3 ml-8">
                                        <input
                                            type="number"
                                            value={formData.paymentTerms}
                                            onChange={(e) => handleInputChange("paymentTerms", parseInt(e.target.value))}
                                            className="w-24 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-zinc-400">dagen</span>
                                    </div>
                                </div>

                                {/* GDPR Toggle */}
                                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.includeGDPR}
                                            onChange={(e) => handleInputChange("includeGDPR", e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                                            formData.includeGDPR ? "bg-purple-600 border-purple-600" : "border-purple-400"
                                        }`}>
                                            {formData.includeGDPR && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-purple-400" />
                                                AVG/GDPR Sectie
                                            </div>
                                            <div className="text-purple-300/70 text-sm">
                                                Privacy en gegevensbescherming artikelen toevoegen
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {paymentProof && (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-emerald-400 font-semibold">Betaling ontvangen</h3>
                                        <p className="text-emerald-300/70 text-sm">Je kunt nu je document genereren.</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Vorige
                                </button>
                                <button
                                    onClick={handleGenClick}
                                    disabled={isGenerating}
                                    className={`flex-1 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-white ${
                                        paymentProof
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                                    }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Genereren...
                                        </>
                                    ) : (
                                        <>
                                            {paymentProof ? <FileText className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                            {paymentProof ? "Genereer Document" : `Betalen & Genereren`}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-xs text-zinc-600 text-center mt-8">
                    Geverifieerd door AIFAIS • Direct downloaden
                </p>
            </div>
        </div>
    );
}
