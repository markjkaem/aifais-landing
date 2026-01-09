"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

interface BTWResult {
    input: {
        amount: number;
        vatRate: number;
        calculationType: string;
        description: string;
    };
    result: {
        netAmount: number;
        vatAmount: number;
        grossAmount: number;
        vatRate: number;
    };
    alternative: {
        vatRate: number;
        netAmount: number;
        vatAmount: number;
        grossAmount: number;
        description: string;
    };
    formulas: {
        addVat: string;
        removeVat: string;
        vatAmount: string;
    };
    generatedAt: string;
}

export default function BTWCalculatorClient() {
    const [amount, setAmount] = useState<number | "">("");
    const [vatRate, setVatRate] = useState<"9" | "21">("21");
    const [calculationType, setCalculationType] = useState<"addVat" | "removeVat">("addVat");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<BTWResult | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (amount === "" || amount <= 0) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/v1/finance/btw-calculator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Number(amount),
                    vatRate,
                    calculationType,
                }),
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

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                        <Percent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">BTW Calculator</h1>
                        <p className="text-zinc-400 text-sm">Bereken snel BTW bedragen voor je facturen</p>
                    </div>
                </div>

                {/* Calculator Form */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        {/* Amount Input */}
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

                        {/* VAT Rate */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-3">
                                <Percent className="w-4 h-4 inline mr-2" />
                                BTW Tarief
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setVatRate("21")}
                                    className={`p-4 rounded-xl border transition-all ${
                                        vatRate === "21"
                                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                    }`}
                                >
                                    <span className="text-2xl font-bold">21%</span>
                                    <span className="block text-xs opacity-70">Standaard tarief</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVatRate("9")}
                                    className={`p-4 rounded-xl border transition-all ${
                                        vatRate === "9"
                                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                    }`}
                                >
                                    <span className="text-2xl font-bold">9%</span>
                                    <span className="block text-xs opacity-70">Laag tarief</span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || amount === "" || Number(amount) <= 0}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                "Berekenen..."
                            ) : (
                                <>
                                    <Calculator className="w-5 h-5" />
                                    Bereken BTW
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400"
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
                        className="space-y-4"
                    >
                        {/* Main Result Card */}
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

                            {/* Result Display */}
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
                                    <div className="flex items-center justify-center gap-2">
                                        <ArrowRight className="w-5 h-5 text-zinc-600" />
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(result.result.vatAmount.toFixed(2), "vat")}
                                        className="group relative inline-block"
                                    >
                                        <p className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                                            +{formatCurrency(result.result.vatAmount)}
                                        </p>
                                        <p className="text-xs text-zinc-500">BTW {result.result.vatRate}%</p>
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

                        {/* Alternative Calculation */}
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                            <p className="text-sm text-zinc-500 mb-2">{result.alternative.description}</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-zinc-400">Netto: </span>
                                    <span className="text-white font-medium">{formatCurrency(result.alternative.netAmount)}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-400">BTW: </span>
                                    <span className="text-white font-medium">{formatCurrency(result.alternative.vatAmount)}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-400">Bruto: </span>
                                    <span className="text-white font-medium">{formatCurrency(result.alternative.grossAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Formulas */}
                        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-4">
                            <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                Gebruikte formule
                            </p>
                            <code className="text-sm text-blue-400 font-mono">
                                {calculationType === "addVat" ? result.formulas.addVat : result.formulas.removeVat}
                            </code>
                        </div>
                    </motion.div>
                )}

                {/* Info Box */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-white">BTW Tarieven Nederland</h3>
                    </div>
                    <div className="space-y-2 text-sm text-zinc-400">
                        <p>
                            <span className="text-white font-medium">21% (standaard)</span> - De meeste producten en diensten
                        </p>
                        <p>
                            <span className="text-white font-medium">9% (laag tarief)</span> - Voedsel, boeken, medicijnen, hotels, culturele evenementen
                        </p>
                        <p>
                            <span className="text-white font-medium">0% (vrijgesteld)</span> - Export, medische diensten, onderwijs
                        </p>
                    </div>
                </div>

                {/* Free Tool Badge */}
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm text-emerald-400">
                        <Check className="w-4 h-4" />
                        100% gratis - geen account nodig
                    </span>
                </div>
            </div>
        </div>
    );
}
