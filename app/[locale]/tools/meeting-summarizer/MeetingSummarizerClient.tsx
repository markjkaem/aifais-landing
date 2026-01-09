"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
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
    ClipboardList,
    AlertCircle,
    CheckCircle2,
    Copy,
    Check,
    Lightbulb,
    Users,
    Calendar,
    ListTodo,
    MessageSquare,
    Mail,
    Clock,
    ChevronRight
} from "lucide-react";

interface ActionItem {
    task: string;
    assignee?: string;
    deadline?: string;
    priority: "high" | "medium" | "low";
}

interface Decision {
    decision: string;
    rationale?: string;
    owner?: string;
}

interface MeetingSummarizerResult {
    summary: string;
    keyPoints: string[];
    actionItems?: ActionItem[];
    decisions?: Decision[];
    followUpEmail?: string;
    nextSteps?: string[];
    meetingType: string;
    language: string;
    generatedAt: string;
    processingTime?: number;
    totalActionItems: number;
    totalDecisions: number;
}

const MEETING_TYPES = [
    { value: "team", label: "Team Meeting" },
    { value: "client", label: "Klantgesprek" },
    { value: "sales", label: "Sales Meeting" },
    { value: "brainstorm", label: "Brainstorm" },
    { value: "standup", label: "Standup" },
    { value: "review", label: "Review" },
    { value: "interview", label: "Interview" },
    { value: "general", label: "Algemeen" }
];

const PRIORITY_CONFIG = {
    high: { label: "Hoog", color: "text-red-400", bg: "bg-red-500/20 border-red-500/30" },
    medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30" },
    low: { label: "Laag", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30" }
};

export default function MeetingSummarizerClient() {
    const toolMetadata = getToolBySlug("meeting-summarizer");

    // Form state
    const [meetingNotes, setMeetingNotes] = useState("");
    const [meetingType, setMeetingType] = useState<string>("general");
    const [participants, setParticipants] = useState("");
    const [extractActionItems, setExtractActionItems] = useState(true);
    const [extractDecisions, setExtractDecisions] = useState(true);
    const [generateFollowUpEmail, setGenerateFollowUpEmail] = useState(false);
    const [language, setLanguage] = useState<"nl" | "en">("nl");

    // UI state
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<MeetingSummarizerResult>("meeting-summarizer");

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess, reset } = usePaywallTool({
        apiEndpoint: "/api/v1/business/meeting-summarizer",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (meetingNotes.trim().length < 50) return;
        execute({
            meetingNotes,
            meetingType,
            participants: participants || undefined,
            extractActionItems,
            extractDecisions,
            generateFollowUpEmail,
            language
        });
    };

    const data = state.data as MeetingSummarizerResult | undefined;

    const handleSaveToHistory = useCallback(() => {
        if (data) {
            saveToHistory(
                {
                    meetingType: data.meetingType,
                    actionItems: data.totalActionItems,
                    decisions: data.totalDecisions
                },
                data,
                ["meeting", data.meetingType]
            );
        }
    }, [data, saveToHistory]);

    const handleLoadHistory = useCallback((entry: { result: MeetingSummarizerResult }) => {
        const historyData = entry.result;
        setMeetingType(historyData.meetingType);
        setLanguage(historyData.language as "nl" | "en");
    }, []);

    const handleApplyTemplate = (templateData: Record<string, unknown>) => {
        if (templateData.meetingNotes) setMeetingNotes(templateData.meetingNotes as string);
        if (templateData.meetingType) setMeetingType(templateData.meetingType as string);
        if (templateData.participants) setParticipants(templateData.participants as string);
        if (templateData.extractActionItems !== undefined) setExtractActionItems(templateData.extractActionItems as boolean);
        if (templateData.extractDecisions !== undefined) setExtractDecisions(templateData.extractDecisions as boolean);
        if (templateData.generateFollowUpEmail !== undefined) setGenerateFollowUpEmail(templateData.generateFollowUpEmail as boolean);
        if (templateData.language) setLanguage(templateData.language as "nl" | "en");
    };

    const copyToClipboard = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleExportPDF = async () => {
        if (!data) return;
        const sections = [
            {
                title: "Samenvatting",
                content: data.summary
            },
            {
                title: "Belangrijkste Punten",
                content: data.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")
            }
        ];

        if (data.actionItems && data.actionItems.length > 0) {
            sections.push({
                title: "Actiepunten",
                content: data.actionItems.map(item =>
                    `• ${item.task}${item.assignee ? ` (@${item.assignee})` : ""}${item.deadline ? ` - Deadline: ${item.deadline}` : ""} [${PRIORITY_CONFIG[item.priority].label}]`
                ).join("\n")
            });
        }

        if (data.decisions && data.decisions.length > 0) {
            sections.push({
                title: "Beslissingen",
                content: data.decisions.map(d =>
                    `• ${d.decision}${d.rationale ? `\n  Reden: ${d.rationale}` : ""}${d.owner ? `\n  Eigenaar: ${d.owner}` : ""}`
                ).join("\n\n")
            });
        }

        if (data.nextSteps && data.nextSteps.length > 0) {
            sections.push({
                title: "Volgende Stappen",
                content: data.nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")
            });
        }

        if (data.followUpEmail) {
            sections.push({
                title: "Follow-up E-mail",
                content: data.followUpEmail
            });
        }

        const result = await exportToPDFReport(
            { sections },
            {
                title: "Meeting Samenvatting",
                subtitle: `${MEETING_TYPES.find(t => t.value === data.meetingType)?.label || data.meetingType}`,
                filename: `meeting-summary-${Date.now()}`
            }
        );
        downloadExport(result);
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl">
                            <ClipboardList className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                            <p className="text-zinc-400 text-sm">Zet meeting notities om in actiepunten</p>
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
                                <p className="text-white line-clamp-1">{result.meetingType}</p>
                                <p className="text-zinc-500">{result.totalActionItems} actiepunten • {result.totalDecisions} beslissingen</p>
                            </div>
                        )}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">Meeting Notities</h2>
                                <TemplateSelector
                                    toolId="meeting-summarizer"
                                    onSelectTemplate={handleApplyTemplate}
                                    currentData={{
                                        meetingNotes,
                                        meetingType,
                                        participants,
                                        extractActionItems,
                                        extractDecisions,
                                        generateFollowUpEmail,
                                        language
                                    }}
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Meeting Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        <MessageSquare className="w-4 h-4 inline mr-1" />
                                        Meeting Notities / Transcript
                                    </label>
                                    <textarea
                                        value={meetingNotes}
                                        onChange={(e) => setMeetingNotes(e.target.value)}
                                        rows={10}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none font-mono text-sm"
                                        placeholder="Plak hier je meeting notities, transcript of ruwe aantekeningen...

Bijvoorbeeld:
- Jan opent de meeting
- Discussie over nieuwe feature release
- Deadline: eind deze maand
- Marketing team moet content voorbereiden
- Budget goedgekeurd: €5000
- Volgende meeting: dinsdag 14:00"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {meetingNotes.length}/10000 tekens (min. 50)
                                    </p>
                                </div>

                                {/* Meeting Type & Participants */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Type Meeting
                                        </label>
                                        <select
                                            value={meetingType}
                                            onChange={(e) => setMeetingType(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        >
                                            {MEETING_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            <Users className="w-4 h-4 inline mr-1" />
                                            Deelnemers (optioneel)
                                        </label>
                                        <input
                                            type="text"
                                            value={participants}
                                            onChange={(e) => setParticipants(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                            placeholder="Jan, Piet, Marie, ..."
                                        />
                                    </div>
                                </div>

                                {/* Language */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Output Taal
                                    </label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value as "nl" | "en")}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    >
                                        <option value="nl">Nederlands</option>
                                        <option value="en">Engels</option>
                                    </select>
                                </div>

                                {/* Options */}
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={extractActionItems}
                                            onChange={(e) => setExtractActionItems(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-violet-500 focus:ring-violet-500"
                                        />
                                        <span className="text-sm text-zinc-300">Actiepunten extraheren</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={extractDecisions}
                                            onChange={(e) => setExtractDecisions(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-violet-500 focus:ring-violet-500"
                                        />
                                        <span className="text-sm text-zinc-300">Beslissingen extraheren</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={generateFollowUpEmail}
                                            onChange={(e) => setGenerateFollowUpEmail(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-violet-500 focus:ring-violet-500"
                                        />
                                        <span className="text-sm text-zinc-300">Follow-up e-mail genereren</span>
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={state.status === "loading" || meetingNotes.trim().length < 50}
                                    className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <ClipboardList className="w-5 h-5" />
                                    {state.status === "loading" ? "Bezig met analyseren..." :
                                     meetingNotes.trim().length < 50 ? "Notities te kort (min. 50 tekens)" :
                                     "Analyseer Meeting"}
                                </button>
                            </form>
                        </div>

                        {/* Loading State */}
                        {state.status === "loading" && (
                            <ToolLoadingState
                                message="Meeting wordt geanalyseerd..."
                                subMessage={`${MEETING_TYPES.find(t => t.value === meetingType)?.label}`}
                                estimatedTime={12}
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
                        {state.status === "success" && data && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Action Bar */}
                                <ToolActionBar
                                    exportFormats={["pdf"]}
                                    onExport={handleExportPDF}
                                    copyText={data.summary}
                                    onSaveToHistory={handleSaveToHistory}
                                    onReset={reset}
                                />

                                {/* Success Summary */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="font-semibold text-white">Meeting geanalyseerd</p>
                                                <p className="text-sm text-zinc-400">
                                                    {data.totalActionItems} actiepunten • {data.totalDecisions} beslissingen
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-white flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-violet-400" />
                                            Samenvatting
                                        </h3>
                                        <button
                                            onClick={() => copyToClipboard(data.summary, "summary")}
                                            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                        >
                                            {copiedField === "summary" ? (
                                                <Check className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-zinc-400" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{data.summary}</p>
                                </div>

                                {/* Key Points */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4 text-amber-400" />
                                        Belangrijkste Punten
                                    </h3>
                                    <ul className="space-y-2">
                                        {data.keyPoints.map((point, i) => (
                                            <li key={i} className="flex items-start gap-3 text-zinc-300">
                                                <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Items */}
                                {data.actionItems && data.actionItems.length > 0 && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                            <ListTodo className="w-4 h-4 text-blue-400" />
                                            Actiepunten ({data.actionItems.length})
                                        </h3>
                                        <div className="space-y-3">
                                            {data.actionItems.map((item, i) => {
                                                const priority = PRIORITY_CONFIG[item.priority];
                                                return (
                                                    <div key={i} className={`p-4 rounded-lg border ${priority.bg}`}>
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <p className="text-white font-medium">{item.task}</p>
                                                                <div className="flex flex-wrap gap-3 mt-2 text-sm">
                                                                    {item.assignee && (
                                                                        <span className="flex items-center gap-1 text-zinc-400">
                                                                            <Users className="w-3.5 h-3.5" />
                                                                            {item.assignee}
                                                                        </span>
                                                                    )}
                                                                    {item.deadline && (
                                                                        <span className="flex items-center gap-1 text-zinc-400">
                                                                            <Clock className="w-3.5 h-3.5" />
                                                                            {item.deadline}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${priority.color}`}>
                                                                {priority.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Decisions */}
                                {data.decisions && data.decisions.length > 0 && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            Beslissingen ({data.decisions.length})
                                        </h3>
                                        <div className="space-y-3">
                                            {data.decisions.map((decision, i) => (
                                                <div key={i} className="p-4 bg-zinc-800/50 rounded-lg">
                                                    <p className="text-white font-medium">{decision.decision}</p>
                                                    {decision.rationale && (
                                                        <p className="text-sm text-zinc-400 mt-1">
                                                            <span className="text-zinc-500">Reden:</span> {decision.rationale}
                                                        </p>
                                                    )}
                                                    {decision.owner && (
                                                        <p className="text-sm text-zinc-400 mt-1">
                                                            <span className="text-zinc-500">Eigenaar:</span> {decision.owner}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Next Steps */}
                                {data.nextSteps && data.nextSteps.length > 0 && (
                                    <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/30 p-5">
                                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <ChevronRight className="w-4 h-4 text-violet-400" />
                                            Volgende Stappen
                                        </h3>
                                        <ol className="space-y-2">
                                            {data.nextSteps.map((step, i) => (
                                                <li key={i} className="flex items-start gap-3 text-zinc-300">
                                                    <span className="w-6 h-6 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    {step}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {/* Follow-up Email */}
                                {data.followUpEmail && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-white flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-blue-400" />
                                                Follow-up E-mail
                                            </h3>
                                            <button
                                                onClick={() => copyToClipboard(data.followUpEmail!, "email")}
                                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                            >
                                                {copiedField === "email" ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-zinc-400" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="bg-zinc-800/50 rounded-lg p-4">
                                            <p className="text-zinc-300 whitespace-pre-wrap text-sm font-mono">{data.followUpEmail}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Tips Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                                <h3 className="font-semibold text-white">Meeting Tips</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">1.</span>
                                    Maak gedetailleerde aantekeningen tijdens meetings
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">2.</span>
                                    Noteer wie wat heeft gezegd
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">3.</span>
                                    Leg beslissingen expliciet vast
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">4.</span>
                                    Noteer deadlines en verantwoordelijken
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">5.</span>
                                    Verstuur follow-up binnen 24 uur
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl border border-violet-500/30 p-5">
                            <h3 className="font-semibold text-white mb-3">Meeting Types</h3>
                            <div className="space-y-2 text-sm">
                                {MEETING_TYPES.slice(0, 5).map(type => (
                                    <div key={type.value} className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-violet-400" />
                                        <span className="text-zinc-300">{type.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <h3 className="font-semibold text-white mb-3">Prioriteit Niveaus</h3>
                            <div className="space-y-2 text-sm">
                                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                                        <span className="text-zinc-300">{config.label}</span>
                                    </div>
                                ))}
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
