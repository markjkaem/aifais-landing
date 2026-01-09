"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calculator,
    Euro,
    TrendingUp,
    Target,
    Package,
    Truck,
    Megaphone,
    Building2,
    AlertCircle,
    CheckCircle2,
    Info,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    BarChart3,
    Plus,
    X,
} from "lucide-react";

interface PriceResult {
    productName: string;
    calculation: {
        costPrice: number;
        additionalCosts: {
            shipping: number;
            packaging: number;
            marketing: number;
            overhead: number;
            total: number;
        };
        totalCostPerUnit: number;
    };
    pricing: {
        recommendedPriceExVAT: number;
        vatRate: number;
        vatAmount: number;
        recommendedPriceInclVAT: number;
        targetMargin: number;
        actualMargin: number;
    };
    profit: {
        perUnit: number;
        total: number;
        quantity: number;
    };
    marketAnalysis: {
        position: string;
        priceRanges: {
            budget: { min: number; max: number; margin: string };
            "mid-range": { min: number; max: number; margin: string };
            premium: { min: number; max: number; margin: string };
        };
        competitorAnalysis: {
            average: number;
            min: number;
            max: number;
            yourPosition: string;
            priceDifferencePercent: number;
        } | null;
    };
    breakEven: {
        unitsNeeded: number;
        revenueNeeded: number;
    };
    aiInsights: {
        insights: string[];
        riskLevel: "low" | "medium" | "high";
        recommendation: string;
    } | null;
    generatedAt: string;
}

export default function PriceCalculatorClient() {
    // Form state
    const [productName, setProductName] = useState("");
    const [costPrice, setCostPrice] = useState<number | "">("");
    const [targetMargin, setTargetMargin] = useState(30);
    const [marketPosition, setMarketPosition] = useState<"budget" | "mid-range" | "premium">("mid-range");
    const [includeVAT, setIncludeVAT] = useState(true);
    const [vatRate, setVatRate] = useState(21);
    const [quantity, setQuantity] = useState(1);

    // Additional costs
    const [showAdditionalCosts, setShowAdditionalCosts] = useState(false);
    const [shipping, setShipping] = useState<number | "">("");
    const [packaging, setPackaging] = useState<number | "">("");
    const [marketing, setMarketing] = useState<number | "">("");
    const [overhead, setOverhead] = useState<number | "">("");

    // Competitor prices
    const [showCompetitors, setShowCompetitors] = useState(false);
    const [competitorPrices, setCompetitorPrices] = useState<number[]>([]);
    const [newCompetitorPrice, setNewCompetitorPrice] = useState<number | "">("");

    // API state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PriceResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName.trim() || costPrice === "" || costPrice <= 0) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/v1/finance/price-calculator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName,
                    costPrice: Number(costPrice),
                    targetMargin,
                    marketPosition,
                    includeVAT,
                    vatRate,
                    quantity,
                    additionalCosts: {
                        shipping: Number(shipping) || 0,
                        packaging: Number(packaging) || 0,
                        marketing: Number(marketing) || 0,
                        overhead: Number(overhead) || 0,
                    },
                    competitorPrices: competitorPrices.length > 0 ? competitorPrices : undefined,
                }),
            });

            if (!response.ok) {
                throw new Error("Er ging iets mis. Probeer het opnieuw.");
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Er ging iets mis.");
        } finally {
            setLoading(false);
        }
    };

    const addCompetitorPrice = () => {
        if (newCompetitorPrice !== "" && newCompetitorPrice > 0) {
            setCompetitorPrices([...competitorPrices, Number(newCompetitorPrice)]);
            setNewCompetitorPrice("");
        }
    };

    const removeCompetitorPrice = (index: number) => {
        setCompetitorPrices(competitorPrices.filter((_, i) => i !== index));
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "low": return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30";
            case "medium": return "text-amber-400 bg-amber-500/20 border-amber-500/30";
            case "high": return "text-red-400 bg-red-500/20 border-red-500/30";
            default: return "text-zinc-400 bg-zinc-500/20 border-zinc-500/30";
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                        <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Prijs Calculator</h1>
                        <p className="text-zinc-400 text-sm">Bereken de optimale verkoopprijs voor je producten</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Product Name & Cost Price */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Productnaam
                                        </label>
                                        <input
                                            type="text"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="bijv. Premium Widget"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            <Euro className="w-4 h-4 inline mr-1" />
                                            Kostprijs (per stuk)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={costPrice}
                                            onChange={(e) => setCostPrice(e.target.value ? Number(e.target.value) : "")}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Target Margin */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        <TrendingUp className="w-4 h-4 inline mr-1" />
                                        Doelmarge: <span className="text-emerald-400">{targetMargin}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="80"
                                        value={targetMargin}
                                        onChange={(e) => setTargetMargin(Number(e.target.value))}
                                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between text-xs text-zinc-500 mt-1">
                                        <span>5% (laag)</span>
                                        <span>30% (standaard)</span>
                                        <span>80% (hoog)</span>
                                    </div>
                                </div>

                                {/* Market Position */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        <Target className="w-4 h-4 inline mr-1" />
                                        Marktpositie
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(["budget", "mid-range", "premium"] as const).map((position) => (
                                            <button
                                                key={position}
                                                type="button"
                                                onClick={() => setMarketPosition(position)}
                                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                                                    marketPosition === position
                                                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                                }`}
                                            >
                                                {position === "budget" && "Budget"}
                                                {position === "mid-range" && "Mid-range"}
                                                {position === "premium" && "Premium"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* VAT Settings */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={includeVAT}
                                                onChange={(e) => setIncludeVAT(e.target.checked)}
                                                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-zinc-300">BTW berekenen</span>
                                        </label>
                                    </div>
                                    {includeVAT && (
                                        <div>
                                            <select
                                                value={vatRate}
                                                onChange={(e) => setVatRate(Number(e.target.value))}
                                                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                <option value={21}>21% BTW (standaard)</option>
                                                <option value={9}>9% BTW (laag tarief)</option>
                                                <option value={0}>0% BTW (vrijgesteld)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        <Package className="w-4 h-4 inline mr-1" />
                                        Aantal (voor totale winst berekening)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Additional Costs Collapsible */}
                                <div className="border border-zinc-800 rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdditionalCosts(!showAdditionalCosts)}
                                        className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <span className="font-medium text-zinc-300">Aanvullende kosten</span>
                                        {showAdditionalCosts ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {showAdditionalCosts && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 pt-0 grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs text-zinc-400 mb-1">
                                                            <Truck className="w-3 h-3 inline mr-1" />
                                                            Verzendkosten
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={shipping}
                                                            onChange={(e) => setShipping(e.target.value ? Number(e.target.value) : "")}
                                                            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-zinc-400 mb-1">
                                                            <Package className="w-3 h-3 inline mr-1" />
                                                            Verpakking
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={packaging}
                                                            onChange={(e) => setPackaging(e.target.value ? Number(e.target.value) : "")}
                                                            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-zinc-400 mb-1">
                                                            <Megaphone className="w-3 h-3 inline mr-1" />
                                                            Marketing
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={marketing}
                                                            onChange={(e) => setMarketing(e.target.value ? Number(e.target.value) : "")}
                                                            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-zinc-400 mb-1">
                                                            <Building2 className="w-3 h-3 inline mr-1" />
                                                            Overhead
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={overhead}
                                                            onChange={(e) => setOverhead(e.target.value ? Number(e.target.value) : "")}
                                                            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Competitor Prices Collapsible */}
                                <div className="border border-zinc-800 rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setShowCompetitors(!showCompetitors)}
                                        className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <span className="font-medium text-zinc-300">Concurrentieprijzen (optioneel)</span>
                                        {showCompetitors ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {showCompetitors && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 pt-0 space-y-3">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={newCompetitorPrice}
                                                            onChange={(e) => setNewCompetitorPrice(e.target.value ? Number(e.target.value) : "")}
                                                            className="flex-1 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
                                                            placeholder="Concurrent prijs toevoegen..."
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={addCompetitorPrice}
                                                            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {competitorPrices.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {competitorPrices.map((price, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300"
                                                                >
                                                                    €{price.toFixed(2)}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeCompetitorPrice(index)}
                                                                        className="text-zinc-500 hover:text-red-400"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !productName.trim() || costPrice === "" || costPrice <= 0}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-teal-700 transition-all"
                                >
                                    {loading ? "Berekenen..." : "Bereken Optimale Prijs"}
                                </button>
                            </form>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 mt-6"
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
                                {/* Main Result */}
                                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/30 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">{result.productName}</h3>
                                        <button
                                            onClick={handleReset}
                                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                                        >
                                            Nieuwe berekening
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-zinc-400 mb-1">Aanbevolen prijs (ex BTW)</p>
                                            <p className="text-4xl font-bold text-emerald-400">€{result.pricing.recommendedPriceExVAT.toFixed(2)}</p>
                                        </div>
                                        {result.pricing.vatAmount > 0 && (
                                            <div>
                                                <p className="text-sm text-zinc-400 mb-1">Inclusief {result.pricing.vatRate}% BTW</p>
                                                <p className="text-4xl font-bold text-white">€{result.pricing.recommendedPriceInclVAT.toFixed(2)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Profit & Costs */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Kostenopbouw</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-400">Kostprijs</span>
                                                <span className="text-white">€{result.calculation.costPrice.toFixed(2)}</span>
                                            </div>
                                            {result.calculation.additionalCosts.total > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-400">Extra kosten</span>
                                                    <span className="text-white">€{result.calculation.additionalCosts.total.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
                                                <span className="text-zinc-300 font-medium">Totale kosten</span>
                                                <span className="text-white font-medium">€{result.calculation.totalCostPerUnit.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Winst</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-400">Per stuk</span>
                                                <span className="text-emerald-400 font-medium">€{result.profit.perUnit.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-400">Marge</span>
                                                <span className="text-white">{result.pricing.actualMargin.toFixed(1)}%</span>
                                            </div>
                                            {result.profit.quantity > 1 && (
                                                <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
                                                    <span className="text-zinc-300 font-medium">Totaal ({result.profit.quantity}x)</span>
                                                    <span className="text-emerald-400 font-bold">€{result.profit.total.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Market Position */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                    <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        Marktpositie Prijsranges
                                    </h4>
                                    <div className="grid md:grid-cols-3 gap-3">
                                        {Object.entries(result.marketAnalysis.priceRanges).map(([position, range]) => (
                                            <div
                                                key={position}
                                                className={`p-3 rounded-lg border ${
                                                    position === result.marketAnalysis.position
                                                        ? "bg-emerald-500/20 border-emerald-500/50"
                                                        : "bg-zinc-800 border-zinc-700"
                                                }`}
                                            >
                                                <p className="text-xs text-zinc-400 capitalize mb-1">{position}</p>
                                                <p className="text-sm font-medium text-white">
                                                    €{range.min} - €{range.max}
                                                </p>
                                                <p className="text-xs text-zinc-500">{range.margin} marge</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Competitor Analysis */}
                                {result.marketAnalysis.competitorAnalysis && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Concurrentie-analyse</h4>
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-zinc-500">Gemiddeld</p>
                                                <p className="text-lg font-medium text-white">€{result.marketAnalysis.competitorAnalysis.average.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Laagste</p>
                                                <p className="text-lg font-medium text-white">€{result.marketAnalysis.competitorAnalysis.min.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Hoogste</p>
                                                <p className="text-lg font-medium text-white">€{result.marketAnalysis.competitorAnalysis.max.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Jouw positie</p>
                                                <p className={`text-lg font-medium ${
                                                    result.marketAnalysis.competitorAnalysis.priceDifferencePercent < 0 ? "text-emerald-400" : "text-amber-400"
                                                }`}>
                                                    {result.marketAnalysis.competitorAnalysis.priceDifferencePercent > 0 ? "+" : ""}
                                                    {result.marketAnalysis.competitorAnalysis.priceDifferencePercent}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* AI Insights */}
                                {result.aiInsights && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4 text-amber-400" />
                                                AI Prijsadvies
                                            </h4>
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(result.aiInsights.riskLevel)}`}>
                                                {result.aiInsights.riskLevel === "low" && "Laag risico"}
                                                {result.aiInsights.riskLevel === "medium" && "Gemiddeld risico"}
                                                {result.aiInsights.riskLevel === "high" && "Hoog risico"}
                                            </span>
                                        </div>
                                        <ul className="space-y-2 mb-3">
                                            {result.aiInsights.insights.map((insight, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                    {insight}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-sm text-zinc-400 italic">
                                            {result.aiInsights.recommendation}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar Tips */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-blue-400" />
                                <h3 className="font-semibold text-white">Prijsstrategie Tips</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-400">1.</span>
                                    Reken alle verborgen kosten mee in je kostprijs
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-400">2.</span>
                                    Vergelijk met minimaal 3 concurrenten
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-400">3.</span>
                                    Premium positionering vereist premium kwaliteit
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-400">4.</span>
                                    Test prijzen met A/B testing
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30 p-5">
                            <h3 className="font-semibold text-white mb-2">Gratis Tool</h3>
                            <p className="text-sm text-zinc-300">
                                Deze prijscalculator is 100% gratis. Geen account nodig, geen limiet op berekeningen.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
