"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { benchmarkData, questions, BenchmarkSector } from "./benchmarkData";
import Link from "next/link";
import {
    Building2,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Download,
    FileSpreadsheet,
    Copy,
    Share2,
    RotateCcw,
    Check,
    Mail,
    History,
    Target,
    Lightbulb,
    AlertCircle,
    BarChart3,
    CheckCircle2,
    Clock
} from "lucide-react";
import { useResultHistory } from "@/hooks/useResultHistory";
import { exportData, downloadExport } from "@/lib/export";

const sectorIcons: Record<string, string> = {
    accountants: "📊",
    advocaten: "⚖️",
    "e-commerce": "🛒",
    overig: "📁",
};

interface BenchmarkResult {
    sector: BenchmarkSector;
    score: number;
    benchmark: number;
    answers: number[];
    calculatedAt: string;
}

interface ActionItem {
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    category: string;
}

export default function BenchmarkTool({ locale }: { locale: string }) {
    const [step, setStep] = useState(0);
    const [selectedSector, setSelectedSector] = useState<BenchmarkSector | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [copied, setCopied] = useState(false);

    const calculateFinalScore = useCallback(() => {
        if (answers.length === 0) return 0;
        return Math.round(answers.reduce((a, b) => a + b, 0) / answers.length);
    }, [answers]);

    const finalScore = calculateFinalScore();
    const benchmark = selectedSector?.avgDigitalScore || 50;
    const isAboveBenchmark = finalScore > benchmark;

    const generateActionItems = useCallback((): ActionItem[] => {
        const items: ActionItem[] = [];
        const score = finalScore;

        // Based on answers, generate specific action items
        if (answers[0] < 50) {
            items.push({
                title: "Automatiseer documentverwerking",
                description: "Implementeer AI-gestuurde document scanning en data extractie om handmatige invoer te elimineren.",
                priority: "high",
                category: "Automatisering"
            });
        }

        if (answers[1] < 50) {
            items.push({
                title: "Digitaliseer klantcommunicatie",
                description: "Zet een self-service portaal op voor klanten om documenten in te dienen en status te controleren.",
                priority: "high",
                category: "Klantervaring"
            });
        }

        if (score < 40) {
            items.push({
                title: "Start met quick wins",
                description: "Focus eerst op de meest tijdrovende repetitieve taken zoals e-mail verwerking en data-entry.",
                priority: "high",
                category: "Strategie"
            });
        }

        if (score >= 40 && score < 70) {
            items.push({
                title: "Integreer bestaande systemen",
                description: "Koppel uw huidige software met API's om data automatisch te synchroniseren.",
                priority: "medium",
                category: "Integratie"
            });
        }

        if (score >= 70) {
            items.push({
                title: "Geavanceerde AI-implementatie",
                description: "Overweeg predictive analytics en machine learning voor proactieve besluitvorming.",
                priority: "low",
                category: "Innovatie"
            });
        }

        // Always add these
        items.push({
            title: "Train uw team",
            description: "Investeer in digitale vaardigheden training voor optimaal gebruik van nieuwe tools.",
            priority: "medium",
            category: "People"
        });

        items.push({
            title: "Meet en verbeter continu",
            description: "Stel KPI's in en monitor voortgang maandelijks om impact te meten.",
            priority: "low",
            category: "Monitoring"
        });

        return items;
    }, [answers, finalScore]);

    // Result history
    const { 
        history: historyResults, 
        saveToHistory: addResult, 
        clearHistory,
        loadEntry: loadFromHistoryEntry,
        deleteEntry,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<BenchmarkResult>("benchmark");

    const handleSectorSelect = (slug: string) => {
        setSelectedSector(benchmarkData[slug]);
        setStep(1);
    };

    const handleAnswer = (score: number) => {
        const newAnswers = [...answers, score];
        setAnswers(newAnswers);
        setStep(step + 1);
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !selectedSector) return;

        // Save to history
        addResult(
            { sector: selectedSector.name },
            {
                sector: selectedSector,
                score: finalScore,
                benchmark,
                answers,
                calculatedAt: new Date().toISOString()
            },
            ["benchmark", selectedSector.name]
        );

        try {
            const response = await fetch("/api/internal/benchmark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    sector: selectedSector?.name,
                    score: finalScore,
                    benchmark: benchmark
                }),
            });

            if (!response.ok) throw new Error("API response not ok");

            setSubmitted(true);
        } catch (err) {
            console.error("Failed to submit benchmark lead:", err);
            setSubmitted(true);
        }
    };

    const downloadPDF = useCallback(async () => {
        if (!selectedSector) return;

        const actionItems = generateActionItems();
        const diff = finalScore - benchmark;

        const documentContent = {
            title: "Digitale Benchmark Rapport",
            sections: [
                {
                    title: "Uw Resultaten",
                    statCards: [
                        { label: "Uw Score", value: `${finalScore}%`, subvalue: selectedSector.name },
                        { label: "Sectorgemiddelde", value: `${benchmark}%`, subvalue: "Branche norm" },
                        { label: "Verschil", value: `${diff > 0 ? "+" : ""}${diff}%`, subvalue: diff >= 0 ? "Bovengemiddeld" : "Benedengemiddeld" }
                    ]
                },
                {
                    title: "Sector Informatie",
                    bullets: [
                        `Gemiddelde admin overhead: ${selectedSector.avgFTEAdmin}`,
                        `Top uitdaging in uw sector: ${selectedSector.topChallenge}`,
                        `Geschat besparingspotentieel: ${selectedSector.potentialSaving}`
                    ]
                },
                {
                    title: "Aanbevolen Acties",
                    bullets: actionItems.map(item =>
                        `[${item.priority.toUpperCase()}] ${item.title}: ${item.description}`
                    )
                },
                {
                    title: "Conclusie",
                    content: diff > 0
                        ? `Uitstekend! U scoort ${diff}% boven het sectorgemiddelde. U loopt hiermee voorop in de markt. Focus nu op innovatie en het behouden van uw strategische voorsprong.`
                        : diff < 0
                        ? `Er is een helder verbeterpotentieel van ${Math.abs(diff)}% ten opzichte van uw branchegenoten. Met gerichte investeringen in procesautomatisering kunt u de efficiëntie verhogen en het sectorgemiddelde overtreffen.`
                        : `U presteert momenteel exact op het niveau van uw branchegenoten (${finalScore}%). Er zijn volop kansen om een competitief voordeel op te bouwen door als een van de eersten in uw sector verder te digitaliseren.`
                }
            ],
            metadata: {
                Organisatie: "AIFAIS Benchmark",
                Datum: new Date().toLocaleDateString("nl-NL")
            }
        };

        const result = await exportData("pdf", documentContent, {
            title: "Digitale Transformatie Benchmark",
            subtitle: `Analyse rapport voor de sector: ${selectedSector.name}`,
            filename: `benchmark_${selectedSector.slug}_${Date.now()}`
        });
        downloadExport(result);
    }, [selectedSector, finalScore, benchmark, generateActionItems]);

    const exportToExcel = useCallback(async () => {
        if (!selectedSector) return;

        const actionItems = generateActionItems();

        const data = [
            { Categorie: "Score", Item: "Uw Score", Waarde: `${finalScore}%` },
            { Categorie: "Score", Item: "Sectorgemiddelde", Waarde: `${benchmark}%` },
            { Categorie: "Score", Item: "Verschil", Waarde: `${finalScore > benchmark ? "+" : ""}${finalScore - benchmark}%` },
            { Categorie: "", Item: "", Waarde: "" },
            { Categorie: "Sector", Item: "Naam", Waarde: selectedSector.name },
            { Categorie: "Sector", Item: "Admin Overhead", Waarde: selectedSector.avgFTEAdmin },
            { Categorie: "Sector", Item: "Top Uitdaging", Waarde: selectedSector.topChallenge },
            { Categorie: "Sector", Item: "Besparingspotentieel", Waarde: selectedSector.potentialSaving },
            { Categorie: "", Item: "", Waarde: "" },
            ...actionItems.map((item, i) => ({
                Categorie: "Actie " + (i + 1),
                Item: item.title,
                Waarde: `[${item.priority}] ${item.description}`
            }))
        ];

        const result = await exportData("xlsx", data, {
            filename: `benchmark_${selectedSector.slug}_${Date.now()}`,
            columns: [
                { key: 'Categorie', label: 'Categorie' },
                { key: 'Item', label: 'Item' },
                { key: 'Waarde', label: 'Waarde' }
            ]
        });
        downloadExport(result);
    }, [selectedSector, finalScore, benchmark]);

    const copyResults = () => {
        if (!selectedSector) return;

        const text = `Digitale Benchmark Resultaten:
- Sector: ${selectedSector.name}
- Uw Score: ${finalScore}%
- Sectorgemiddelde: ${benchmark}%
- Status: ${isAboveBenchmark ? "Boven benchmark" : "Onder benchmark"}
- Potentiele besparing: ${selectedSector.potentialSaving}

Bekijk het volledige rapport op aifais.com`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareResults = () => {
        if (!selectedSector) return;

        const url = `${window.location.origin}${window.location.pathname}`;
        const text = `Mijn digitale score is ${finalScore}% voor de ${selectedSector.name} sector. Doe de gratis benchmark test:`;

        if (navigator.share) {
            navigator.share({
                title: "Digitale Benchmark Resultaat",
                text: text,
                url: url
            });
        } else {
            navigator.clipboard.writeText(`${text} ${url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const loadFromHistory = (item: BenchmarkResult) => {
        setSelectedSector(item.sector);
        setAnswers(item.answers);
        setStep(questions.length + 1);
        setShowHistory(false);
    };

    const reset = () => {
        setStep(0);
        setAnswers([]);
        setSubmitted(false);
        setEmail("");
        setSelectedSector(null);
    };


    // Sector Selection
    if (step === 0) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-violet-500 mb-6">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">In welke sector bent u actief?</h2>
                        <p className="text-zinc-400">Selecteer uw sector voor een nauwkeurige benchmark vergelijking</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {Object.values(benchmarkData).map((s) => (
                            <button
                                key={s.slug}
                                onClick={() => handleSectorSelect(s.slug)}
                                className="group relative p-6 text-left bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-blue-500/50 rounded-2xl transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">{sectorIcons[s.slug] || "📁"}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                                            {s.name}
                                        </div>
                                        <div className="text-sm text-zinc-500">
                                            Gem. score: <span className="text-zinc-300 font-medium">{s.avgDigitalScore}%</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))}
                    </div>

                    {historyResults.length > 0 && (
                        <div className="text-center">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition"
                            >
                                <History className="w-4 h-4" />
                                Bekijk eerdere resultaten ({historyResults.length})
                            </button>

                            <AnimatePresence>
                                {showHistory && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 overflow-hidden"
                                    >
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {historyResults.map((item, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => loadFromHistory(item.result)}
                                                    className="w-full text-left p-3 bg-zinc-700/50 hover:bg-zinc-700 rounded-lg transition"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-white font-medium">
                                                                {item.result.sector.name} • {item.result.score}%
                                                            </div>
                                                            <div className="text-zinc-500 text-xs">
                                                                {new Date(item.timestamp).toLocaleString("nl-NL")}
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={clearHistory}
                                            className="w-full mt-3 text-xs text-zinc-500 hover:text-zinc-300"
                                        >
                                            Wis geschiedenis
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Questions
    if (step >= 1 && step <= questions.length) {
        const q = questions[step - 1];
        const progress = (step / questions.length) * 100;

        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12">
                    {/* Progress header */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Terug
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-zinc-400">
                                {step} / {questions.length}
                            </span>
                            <div className="flex gap-1.5">
                                {questions.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-all ${i < step ? 'bg-blue-500' : 'bg-zinc-700'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 bg-zinc-800 rounded-full mb-10 overflow-hidden">
                        <motion.div
                            className="h-full bg-linear-to-r from-blue-500 to-violet-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Question */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold mb-4">
                            <span>Vraag {step}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                            {q.question}
                        </h2>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt.score)}
                                className="group w-full p-5 text-left bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-blue-500/50 rounded-2xl transition-all duration-200 flex items-center justify-between gap-4"
                            >
                                <span className="text-zinc-300 group-hover:text-white font-medium transition-colors">
                                    {opt.label}
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-zinc-700 group-hover:bg-blue-500 flex items-center justify-center transition-all shrink-0">
                                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Results
    const actionItems = generateActionItems();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                {/* Score Header */}
                <div className="relative bg-linear-to-br from-zinc-800 via-zinc-900 to-zinc-900 p-10 md:p-14 text-center overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />

                    <div className="relative z-10">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ${isAboveBenchmark
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                            {isAboveBenchmark ? (
                                <>
                                    <TrendingUp className="w-4 h-4" />
                                    Boven sectorgemiddelde
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="w-4 h-4" />
                                    Groeipotentieel
                                </>
                            )}
                        </div>

                        {/* Score display */}
                        <div className="flex items-center justify-center gap-6 mb-6">
                            <div className="text-center">
                                <div className="text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-violet-400 to-cyan-400">
                                    {finalScore}
                                </div>
                                <div className="text-zinc-500 font-medium">Uw Score</div>
                            </div>
                            <div className="text-5xl text-zinc-700 font-light">/</div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-zinc-600">
                                    {benchmark}
                                </div>
                                <div className="text-zinc-500 font-medium">Benchmark</div>
                            </div>
                        </div>

                        <p className="text-zinc-400 max-w-md mx-auto">
                            {isAboveBenchmark
                                ? `Uitstekend! U scoort ${finalScore - benchmark}% boven het gemiddelde van de ${selectedSector?.name} sector.`
                                : `Er is potentieel voor ${benchmark - finalScore}% verbetering ten opzichte van uw branchegenoten.`}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Sector Stats */}
                        <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center">
                                    <span className="text-2xl">{sectorIcons[selectedSector?.slug || ""] || "📁"}</span>
                                </div>
                                <div>
                                    <div className="font-bold text-white">{selectedSector?.name}</div>
                                    <div className="text-sm text-zinc-500">Sectorgemiddelde</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">Digitale score</span>
                                    <span className="font-bold text-white">{selectedSector?.avgDigitalScore}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">Admin overhead</span>
                                    <span className="font-bold text-white">{selectedSector?.avgFTEAdmin}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">Top uitdaging</span>
                                    <span className="font-bold text-white text-right text-sm max-w-[150px]">{selectedSector?.topChallenge}</span>
                                </div>
                            </div>
                        </div>

                        {/* Potential Savings */}
                        <div className="bg-linear-to-br from-blue-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold">Besparingspotentieel</div>
                                        <div className="text-sm text-blue-200">Jaarlijks met AI automatisering</div>
                                    </div>
                                </div>
                                <div className="text-4xl md:text-5xl font-extrabold mb-3">{selectedSector?.potentialSaving}</div>
                                <p className="text-blue-100 text-sm leading-relaxed">
                                    Dit is een schatting op basis van vergelijkbare bedrijven die hun processen hebben geautomatiseerd.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Items */}
                    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Aanbevolen Acties</h3>
                                <p className="text-sm text-zinc-500">Gepersonaliseerd op basis van uw antwoorden</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {actionItems.slice(0, 4).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700"
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.priority === "high"
                                            ? "bg-red-500/20"
                                            : item.priority === "medium"
                                                ? "bg-amber-500/20"
                                                : "bg-blue-500/20"
                                        }`}>
                                        <Target className={`w-4 h-4 ${item.priority === "high"
                                                ? "text-red-400"
                                                : item.priority === "medium"
                                                    ? "text-amber-400"
                                                    : "text-blue-400"
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-white">{item.title}</h4>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${item.priority === "high"
                                                    ? "bg-red-500/20 text-red-400"
                                                    : item.priority === "medium"
                                                        ? "bg-amber-500/20 text-amber-400"
                                                        : "bg-blue-500/20 text-blue-400"
                                                }`}>
                                                {item.priority}
                                            </span>
                                        </div>
                                        <p className="text-zinc-400 text-sm">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Export Actions */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={downloadPDF}
                            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            <Download className="w-4 h-4" />
                            PDF Rapport
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Excel
                        </button>
                        <button
                            onClick={copyResults}
                            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Gekopieerd!" : "Kopieer"}
                        </button>
                        <button
                            onClick={shareResults}
                            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            <Share2 className="w-4 h-4" />
                            Delen
                        </button>
                    </div>

                    {/* CTA Section */}
                    {!submitted ? (
                        <div className="bg-zinc-800 rounded-2xl p-8 md:p-10">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-3">Ontvang het Volledige Rapport</h3>
                                <p className="text-zinc-400 max-w-lg mx-auto">
                                    We sturen u een gedetailleerde analyse met alle verbeterpunten voor uw organisatie.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                <input
                                    type="email"
                                    placeholder="uw-naam@bedrijf.nl"
                                    required
                                    className="flex-1 bg-zinc-700 border border-zinc-600 rounded-xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button className="bg-linear-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-bold px-8 py-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    Verstuur
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
                            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Rapport Onderweg!</h3>
                            <p className="text-emerald-300/80 mb-6">
                                We hebben de volledige benchmark analyse naar <strong>{email}</strong> gestuurd.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 bg-zinc-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-zinc-700 transition-all"
                            >
                                Plan een gratis adviesgesprek
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Reset button */}
            <div className="text-center mt-8">
                <button
                    onClick={reset}
                    className="text-zinc-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
                >
                    <RotateCcw className="w-4 h-4" />
                    Opnieuw beginnen
                </button>
            </div>
        </div>
    );
}
