"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Percent,
    Euro,
    ArrowRight,
    ArrowLeftRight,
    Calculator,
    Info,
    AlertCircle,
    Copy,
    Check,
    Plus,
    Trash2,
    Download,
    FileSpreadsheet,
    ChevronDown,
    ChevronUp,
    Globe,
    Building2,
    HelpCircle,
} from "lucide-react";

// Types
interface BTWResult {
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    vatRate: number;
    vatRateName: string;
    reverseCharge: boolean;
    reverseChargeReason?: string;
    description?: string;
}

interface APIResponse {
    input: {
        amount: number;
        vatRate: number;
        vatRateInfo: {
            rate: number;
            name: string;
            description: string;
            examples: string[];
        };
        calculationType: string;
        reverseCharge: boolean;
        description: string;
    };
    result: BTWResult;
    alternatives: Array<BTWResult & { description: string; examples: string[] }>;
    reverseChargeInfo: {
        active: boolean;
        reason: string;
        reasonDescription: string;
        note: string;
        invoiceText: string;
    } | null;
    batch: {
        results: BTWResult[];
        totals: {
            netAmount: number;
            vatAmount: number;
            grossAmount: number;
            vatRate: number;
            itemCount: number;
        };
    } | null;
    vatRatesReference: Record<string, { rate: number; name: string; description: string; examples: string[] }>;
    formulas: {
        addVat: string;
        removeVat: string;
        vatAmount: string;
    };
    generatedAt: string;
}

interface BatchItem {
    id: string;
    amount: number | "";
    description: string;
}

const REVERSE_CHARGE_REASONS = [
    { value: "intra-eu-goods", label: "Intracommunautaire levering goederen", icon: Globe },
    { value: "intra-eu-services", label: "B2B diensten binnen EU", icon: Globe },
    { value: "export-outside-eu", label: "Export buiten EU", icon: Globe },
    { value: "construction", label: "Bouwsector verleggingsregeling", icon: Building2 },
    { value: "scrap-metal", label: "Oud materiaal / schroot", icon: Building2 },
    { value: "other", label: "Overige verleggingsregeling", icon: HelpCircle },
];

export default function BTWCalculatorClient() {
    // Form state
    const [amount, setAmount] = useState<number | "">("");
    const [vatRate, setVatRate] = useState<"0" | "9" | "21">("21");
    const [calculationType, setCalculationType] = useState<"addVat" | "removeVat">("addVat");
    const [reverseCharge, setReverseCharge] = useState(false);
    const [reverseChargeReason, setReverseChargeReason] = useState<string>("");

    // Batch mode
    const [batchMode, setBatchMode] = useState(false);
    const [batchItems, setBatchItems] = useState<BatchItem[]>([
        { id: "1", amount: "", description: "" },
    ]);

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<APIResponse | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [activeTab, setActiveTab] = useState<"result" | "alternatives" | "info">("result");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!batchMode && (amount === "" || Number(amount) <= 0)) return;
        if (batchMode && !batchItems.some(item => item.amount !== "" && Number(item.amount) > 0)) return;

        setLoading(true);
        setError(null);

        try {
            const payload: Record<string, unknown> = {
                amount: batchMode ? 1 : Number(amount), // Dummy amount for batch mode
                vatRate,
                calculationType,
                reverseCharge,
            };

            if (reverseCharge && reverseChargeReason) {
                payload.reverseChargeReason = reverseChargeReason;
            }

            if (batchMode) {
                const validItems = batchItems.filter(item => item.amount !== "" && Number(item.amount) > 0);
                payload.amounts = validItems.map(item => Number(item.amount));
                payload.itemDescriptions = validItems.map(item => item.description);
            }

            const response = await fetch("/api/v1/finance/btw-calculator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Er ging iets mis. Probeer het opnieuw.");
            }

            const data = await response.json();
            if (data.success && data.data?.result) {
                setResult(data.data);
            } else {
                throw new Error(data.error || "Ongeldig antwoord van server");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Er ging iets mis.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (value: string, key: string) => {
        await navigator.clipboard.writeText(value);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    // Batch functions
    const addBatchItem = () => {
        setBatchItems([...batchItems, { id: Date.now().toString(), amount: "", description: "" }]);
    };

    const removeBatchItem = (id: string) => {
        if (batchItems.length > 1) {
            setBatchItems(batchItems.filter(item => item.id !== id));
        }
    };

    const updateBatchItem = (id: string, field: "amount" | "description", value: string | number) => {
        setBatchItems(batchItems.map(item =>
            item.id === id ? { ...item, [field]: field === "amount" ? (value === "" ? "" : Number(value)) : value } : item
        ));
    };

    // Export functions
    const exportToCSV = () => {
        if (!result) return;

        let csvContent = "data:text/csv;charset=utf-8,";

        if (result.batch) {
            csvContent += "Omschrijving,Netto,BTW,Bruto,BTW Tarief\n";
            result.batch.results.forEach((item, idx) => {
                const desc = item.description || `Item ${idx + 1}`;
                csvContent += `"${desc}",${item.netAmount},${item.vatAmount},${item.grossAmount},${item.vatRate}%\n`;
            });
            csvContent += `\nTotaal,${result.batch.totals.netAmount},${result.batch.totals.vatAmount},${result.batch.totals.grossAmount},\n`;
        } else {
            csvContent += "Netto,BTW,Bruto,BTW Tarief\n";
            csvContent += `${result.result.netAmount},${result.result.vatAmount},${result.result.grossAmount},${result.result.vatRate}%\n`;
        }

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `btw-berekening-${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyAsTable = () => {
        if (!result) return;

        let tableContent = "";

        if (result.batch) {
            tableContent = "Omschrijving\tNetto\tBTW\tBruto\tBTW Tarief\n";
            result.batch.results.forEach((item, idx) => {
                const desc = item.description || `Item ${idx + 1}`;
                tableContent += `${desc}\t${formatCurrency(item.netAmount)}\t${formatCurrency(item.vatAmount)}\t${formatCurrency(item.grossAmount)}\t${item.vatRate}%\n`;
            });
            tableContent += `\nTotaal\t${formatCurrency(result.batch.totals.netAmount)}\t${formatCurrency(result.batch.totals.vatAmount)}\t${formatCurrency(result.batch.totals.grossAmount)}\t\n`;
        } else {
            tableContent = `Netto\tBTW\tBruto\tBTW Tarief\n`;
            tableContent += `${formatCurrency(result.result.netAmount)}\t${formatCurrency(result.result.vatAmount)}\t${formatCurrency(result.result.grossAmount)}\t${result.result.vatRate}%\n`;
        }

        copyToClipboard(tableContent, "table");
    };

    return (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                        <Percent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">BTW Calculator Pro</h1>
                        <p className="text-zinc-400 text-sm">Bereken BTW met alle tarieven, batch modus & export</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mode Toggle: Single vs Batch */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-zinc-400">
                            <Calculator className="w-4 h-4" />
                            Berekenings modus
                        </label>
                        <div className="flex rounded-lg bg-zinc-800 p-1">
                            <button
                                type="button"
                                onClick={() => setBatchMode(false)}
                                className={`px-4 py-2 text-sm rounded-md transition-all ${
                                    !batchMode ? "bg-blue-500 text-white" : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                Enkel
                            </button>
                            <button
                                type="button"
                                onClick={() => setBatchMode(true)}
                                className={`px-4 py-2 text-sm rounded-md transition-all ${
                                    batchMode ? "bg-blue-500 text-white" : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                Batch
                            </button>
                        </div>
                    </div>

                    {/* Calculation Type Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-3">
                            <ArrowLeftRight className="w-4 h-4 inline mr-2" />
                            Wat wil je berekenen?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setCalculationType("addVat")}
                                className={`p-4 rounded-xl border text-left transition-all ${
                                    calculationType === "addVat"
                                        ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                }`}
                            >
                                <span className="block font-medium">Netto → Bruto</span>
                                <span className="text-xs opacity-70">BTW toevoegen</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCalculationType("removeVat")}
                                className={`p-4 rounded-xl border text-left transition-all ${
                                    calculationType === "removeVat"
                                        ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                }`}
                            >
                                <span className="block font-medium">Bruto → Netto</span>
                                <span className="text-xs opacity-70">BTW eruit halen</span>
                            </button>
                        </div>
                    </div>

                    {/* Single Amount or Batch Items */}
                    {!batchMode ? (
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                <Euro className="w-4 h-4 inline mr-1" />
                                {calculationType === "addVat" ? "Netto bedrag" : "Bruto bedrag"}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                                    className="w-full p-4 pl-8 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xl placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-zinc-300">
                                <FileSpreadsheet className="w-4 h-4 inline mr-2" />
                                Batch berekening ({batchItems.length} items)
                            </label>

                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                {batchItems.map((item, idx) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <span className="text-xs text-zinc-500 w-6">{idx + 1}.</span>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateBatchItem(item.id, "description", e.target.value)}
                                            className="flex-1 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500"
                                            placeholder="Omschrijving (optioneel)"
                                        />
                                        <div className="relative w-32">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">€</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={item.amount}
                                                onChange={(e) => updateBatchItem(item.id, "amount", e.target.value)}
                                                className="w-full p-2 pl-6 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeBatchItem(item.id)}
                                            className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                                            disabled={batchItems.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addBatchItem}
                                className="w-full py-2 border border-dashed border-zinc-700 rounded-lg text-zinc-400 hover:border-blue-500 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Item toevoegen
                            </button>
                        </div>
                    )}

                    {/* VAT Rate */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-3">
                            <Percent className="w-4 h-4 inline mr-2" />
                            BTW Tarief
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => { setVatRate("21"); setReverseCharge(false); }}
                                className={`p-4 rounded-xl border transition-all ${
                                    vatRate === "21" && !reverseCharge
                                        ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                }`}
                            >
                                <span className="text-2xl font-bold">21%</span>
                                <span className="block text-xs opacity-70">Standaard</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setVatRate("9"); setReverseCharge(false); }}
                                className={`p-4 rounded-xl border transition-all ${
                                    vatRate === "9" && !reverseCharge
                                        ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                }`}
                            >
                                <span className="text-2xl font-bold">9%</span>
                                <span className="block text-xs opacity-70">Laag tarief</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setVatRate("0"); setReverseCharge(false); }}
                                className={`p-4 rounded-xl border transition-all ${
                                    vatRate === "0" && !reverseCharge
                                        ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                }`}
                            >
                                <span className="text-2xl font-bold">0%</span>
                                <span className="block text-xs opacity-70">Vrijgesteld</span>
                            </button>
                        </div>
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full py-3 flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span className="text-sm">Geavanceerde opties</span>
                    </button>

                    {/* Advanced Options */}
                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                {/* Reverse Charge */}
                                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                            <Globe className="w-4 h-4" />
                                            BTW Verlegd (Reverse Charge)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setReverseCharge(!reverseCharge)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${
                                                reverseCharge ? "bg-blue-500" : "bg-zinc-600"
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                                    reverseCharge ? "translate-x-7" : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {reverseCharge && (
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500">Reden verlegging</label>
                                            <select
                                                value={reverseChargeReason}
                                                onChange={(e) => setReverseChargeReason(e.target.value)}
                                                className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white text-sm"
                                            >
                                                <option value="">Selecteer reden...</option>
                                                {REVERSE_CHARGE_REASONS.map((reason) => (
                                                    <option key={reason.value} value={reason.value}>
                                                        {reason.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-zinc-500">
                                                Bij BTW verlegging wordt de BTW niet in rekening gebracht. De afnemer is
                                                verantwoordelijk voor de BTW-afdracht.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || (!batchMode && (amount === "" || Number(amount) <= 0)) || (batchMode && !batchItems.some(item => item.amount !== "" && Number(item.amount) > 0))}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Berekenen...
                            </span>
                        ) : (
                            <>
                                <Calculator className="w-5 h-5" />
                                {batchMode ? `Bereken ${batchItems.filter(i => i.amount !== "").length} items` : "Bereken BTW"}
                            </>
                        )}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </motion.div>
                )}

                {/* Results */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-4"
                    >
                        {/* Result Tabs */}
                        <div className="flex gap-2 border-b border-zinc-800 pb-2">
                            <button
                                onClick={() => setActiveTab("result")}
                                className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                                    activeTab === "result" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                Resultaat
                            </button>
                            <button
                                onClick={() => setActiveTab("alternatives")}
                                className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                                    activeTab === "alternatives" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                Vergelijking
                            </button>
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                                    activeTab === "info" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                Info
                            </button>

                            <div className="ml-auto flex gap-2">
                                <button
                                    onClick={exportToCSV}
                                    className="px-3 py-1 text-xs bg-zinc-800 text-zinc-400 hover:text-white rounded-lg flex items-center gap-1 transition-colors"
                                >
                                    <Download className="w-3 h-3" />
                                    CSV
                                </button>
                                <button
                                    onClick={copyAsTable}
                                    className="px-3 py-1 text-xs bg-zinc-800 text-zinc-400 hover:text-white rounded-lg flex items-center gap-1 transition-colors"
                                >
                                    {copied === "table" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    Kopieer
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "result" && (
                            <div className="space-y-4">
                                {/* Reverse Charge Notice */}
                                {result.reverseChargeInfo && (
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                        <div className="flex items-center gap-2 text-amber-400 mb-2">
                                            <Globe className="w-5 h-5" />
                                            <span className="font-medium">BTW Verlegd</span>
                                        </div>
                                        <p className="text-sm text-amber-200/80">{result.reverseChargeInfo.reasonDescription}</p>
                                        <p className="text-xs text-zinc-400 mt-2">
                                            Factuurtekst: <span className="text-white">{result.reverseChargeInfo.invoiceText}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Batch Results Table */}
                                {result.batch ? (
                                    <div className="bg-zinc-800 rounded-xl overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-zinc-700/50">
                                                <tr>
                                                    <th className="text-left p-3 text-zinc-400 font-medium">Omschrijving</th>
                                                    <th className="text-right p-3 text-zinc-400 font-medium">Netto</th>
                                                    <th className="text-right p-3 text-zinc-400 font-medium">BTW</th>
                                                    <th className="text-right p-3 text-zinc-400 font-medium">Bruto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.batch.results.map((item, idx) => (
                                                    <tr key={idx} className="border-t border-zinc-700">
                                                        <td className="p-3 text-white">{item.description || `Item ${idx + 1}`}</td>
                                                        <td className="p-3 text-right text-zinc-300">{formatCurrency(item.netAmount)}</td>
                                                        <td className="p-3 text-right text-blue-400">{formatCurrency(item.vatAmount)}</td>
                                                        <td className="p-3 text-right text-emerald-400 font-medium">{formatCurrency(item.grossAmount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-zinc-700/30">
                                                <tr className="border-t-2 border-zinc-600">
                                                    <td className="p-3 text-white font-bold">Totaal ({result.batch.totals.itemCount} items)</td>
                                                    <td className="p-3 text-right text-white font-bold">{formatCurrency(result.batch.totals.netAmount)}</td>
                                                    <td className="p-3 text-right text-blue-400 font-bold">{formatCurrency(result.batch.totals.vatAmount)}</td>
                                                    <td className="p-3 text-right text-emerald-400 font-bold">{formatCurrency(result.batch.totals.grossAmount)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ) : (
                                    /* Single Result Card */
                                    <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-500/30 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm text-zinc-400">{result.input.description}</span>
                                            <button
                                                onClick={handleReset}
                                                className="text-sm text-zinc-400 hover:text-white transition-colors"
                                            >
                                                Nieuwe berekening
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 items-center">
                                            {/* Net Amount */}
                                            <div className="text-center">
                                                <p className="text-xs text-zinc-500 mb-1">Netto</p>
                                                <button
                                                    onClick={() => copyToClipboard(result.result.netAmount.toFixed(2), "net")}
                                                    className="group relative"
                                                >
                                                    <p className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                                        {formatCurrency(result.result.netAmount)}
                                                    </p>
                                                    {copied === "net" ? (
                                                        <Check className="w-4 h-4 text-emerald-400 absolute -right-5 top-1/2 -translate-y-1/2" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-zinc-600 absolute -right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Arrow + VAT */}
                                            <div className="text-center">
                                                <ArrowRight className="w-5 h-5 text-zinc-600 mx-auto mb-1" />
                                                <button
                                                    onClick={() => copyToClipboard(result.result.vatAmount.toFixed(2), "vat")}
                                                    className="group relative inline-block"
                                                >
                                                    <p className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                                                        {result.result.reverseCharge ? "€ 0,00" : `+${formatCurrency(result.result.vatAmount)}`}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">
                                                        {result.result.reverseCharge ? "BTW verlegd" : `BTW ${result.result.vatRate}%`}
                                                    </p>
                                                    {copied === "vat" && (
                                                        <Check className="w-3 h-3 text-emerald-400 absolute -right-4 top-0" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Gross Amount */}
                                            <div className="text-center">
                                                <p className="text-xs text-zinc-500 mb-1">Bruto</p>
                                                <button
                                                    onClick={() => copyToClipboard(result.result.grossAmount.toFixed(2), "gross")}
                                                    className="group relative"
                                                >
                                                    <p className="text-2xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                                        {formatCurrency(result.result.grossAmount)}
                                                    </p>
                                                    {copied === "gross" ? (
                                                        <Check className="w-4 h-4 text-emerald-400 absolute -right-5 top-1/2 -translate-y-1/2" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-zinc-600 absolute -right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Formula */}
                                <div className="p-4 bg-zinc-800/50 rounded-xl">
                                    <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        Gebruikte formule
                                    </p>
                                    <code className="text-sm text-blue-400 font-mono">
                                        {calculationType === "addVat" ? result.formulas.addVat : result.formulas.removeVat}
                                    </code>
                                </div>
                            </div>
                        )}

                        {activeTab === "alternatives" && (
                            <div className="space-y-3">
                                <p className="text-sm text-zinc-400 mb-4">Vergelijk met andere BTW tarieven:</p>
                                {result.alternatives.map((alt, idx) => (
                                    <div key={idx} className="p-4 bg-zinc-800 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium">{alt.vatRateName}</span>
                                            <span className="text-xs text-zinc-500">{alt.description}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-zinc-500">Netto: </span>
                                                <span className="text-white">{formatCurrency(alt.netAmount)}</span>
                                            </div>
                                            <div>
                                                <span className="text-zinc-500">BTW: </span>
                                                <span className="text-blue-400">{formatCurrency(alt.vatAmount)}</span>
                                            </div>
                                            <div>
                                                <span className="text-zinc-500">Bruto: </span>
                                                <span className="text-emerald-400">{formatCurrency(alt.grossAmount)}</span>
                                            </div>
                                        </div>
                                        {alt.examples && (
                                            <p className="text-xs text-zinc-500 mt-2">
                                                Voorbeelden: {alt.examples.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "info" && (
                            <div className="space-y-4">
                                <div className="p-4 bg-zinc-800 rounded-xl">
                                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-blue-400" />
                                        BTW Tarieven Nederland
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        {Object.entries(result.vatRatesReference).map(([key, info]) => (
                                            <div key={key} className="p-3 bg-zinc-700/50 rounded-lg">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-white font-medium">{info.name}</span>
                                                    <span className="text-blue-400">{info.rate}%</span>
                                                </div>
                                                <p className="text-zinc-400 text-xs mb-1">{info.description}</p>
                                                <p className="text-zinc-500 text-xs">
                                                    Voorbeelden: {info.examples.join(", ")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-zinc-800 rounded-xl">
                                    <h3 className="font-semibold text-white mb-2">BTW Verlegd (Reverse Charge)</h3>
                                    <p className="text-sm text-zinc-400">
                                        Bij BTW verlegging draagt de afnemer de BTW af in plaats van de leverancier.
                                        Dit geldt bijvoorbeeld bij intracommunautaire leveringen binnen de EU,
                                        bouwwerkzaamheden (verleggingsregeling bouw), en export buiten de EU.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 text-center">
                <span className="inline-flex items-center gap-2 text-sm text-emerald-400">
                    <Check className="w-4 h-4" />
                    100% gratis - geen account nodig
                </span>
            </div>
        </div>
    );
}
