"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { useResultHistory } from "@/hooks/useResultHistory";
import { getToolBySlug } from "@/config/tools";
import { ResultHistory } from "@/app/Components/tools/ResultHistory";
import TemplateSelector from "@/app/Components/tools/TemplateSelector";
import { ToolLoadingState } from "@/app/Components/tools/ToolLoadingState";
import { ToolActionBar } from "@/app/Components/tools/ToolActionBar";
import { exportToCSV, exportToPDFReport, downloadExport } from "@/lib/export";
import {
    Mail,
    AlertCircle,
    CheckCircle2,
    Copy,
    Check,
    Lightbulb,
    Send,
    User,
    Building2,
    MessageSquare,
    Globe
} from "lucide-react";

interface EmailResult {
    subject: string;
    body: string;
    callToAction?: string;
    tips?: string[];
    alternativeSubjects?: string[];
    emailType: string;
    recipientType: string;
    tone: string;
    language: string;
    generatedAt: string;
    processingTime?: number;
}

const EMAIL_TYPES = [
    { value: "proposal", label: "Offerte/Voorstel" },
    { value: "follow_up", label: "Follow-up" },
    { value: "introduction", label: "Introductie" },
    { value: "thank_you", label: "Bedankje" },
    { value: "complaint", label: "Klacht" },
    { value: "apology", label: "Excuses" },
    { value: "meeting_request", label: "Vergaderverzoek" },
    { value: "project_update", label: "Project update" },
    { value: "cold_outreach", label: "Koude acquisitie" },
    { value: "partnership", label: "Partnerschap" }
];

const RECIPIENT_TYPES = [
    { value: "client", label: "Klant" },
    { value: "prospect", label: "Prospect" },
    { value: "supplier", label: "Leverancier" },
    { value: "colleague", label: "Collega" },
    { value: "manager", label: "Manager" },
    { value: "partner", label: "Partner" }
];

const TONE_OPTIONS = [
    { value: "formal", label: "Formeel", description: "Zakelijk en professioneel" },
    { value: "friendly", label: "Vriendelijk", description: "Warm en toegankelijk" },
    { value: "urgent", label: "Urgent", description: "Directe actie vereist" },
    { value: "persuasive", label: "Overtuigend", description: "Gericht op conversie" }
];

export default function EmailGeneratorClient() {
    const toolMetadata = getToolBySlug("email-generator");

    // Form state
    const [emailType, setEmailType] = useState<string>("proposal");
    const [context, setContext] = useState("");
    const [recipientType, setRecipientType] = useState<string>("client");
    const [tone, setTone] = useState<string>("formal");
    const [includeCallToAction, setIncludeCallToAction] = useState(true);
    const [senderName, setSenderName] = useState("");
    const [companyName, setCompanyName] = useState("");
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
    } = useResultHistory<EmailResult>("email-generator");

    const { state, execute, reset } = usePaywallTool({
        apiEndpoint: "/api/v1/marketing/email-generator",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (context.trim().length < 10) return;
        execute({
            emailType,
            context,
            recipientType,
            tone,
            includeCallToAction,
            senderName: senderName || undefined,
            companyName: companyName || undefined,
            language
        });
    };

    const data = state.data as EmailResult | undefined;

    const handleSaveToHistory = useCallback(() => {
        if (data) {
            saveToHistory(
                {
                    emailType: data.emailType,
                    recipientType: data.recipientType,
                    subject: data.subject.substring(0, 50)
                },
                data,
                ["email", data.emailType, data.tone]
            );
        }
    }, [data, saveToHistory]);

    const handleLoadHistory = useCallback((entry: { result: EmailResult }) => {
        const historyData = entry.result;
        setEmailType(historyData.emailType);
        setRecipientType(historyData.recipientType);
        setTone(historyData.tone);
        setLanguage(historyData.language as "nl" | "en");
    }, []);

    const handleApplyTemplate = (templateData: Record<string, unknown>) => {
        if (templateData.emailType) setEmailType(templateData.emailType as string);
        if (templateData.context) setContext(templateData.context as string);
        if (templateData.recipientType) setRecipientType(templateData.recipientType as string);
        if (templateData.tone) setTone(templateData.tone as string);
        if (templateData.includeCallToAction !== undefined) setIncludeCallToAction(templateData.includeCallToAction as boolean);
        if (templateData.language) setLanguage(templateData.language as "nl" | "en");
    };

    const copyToClipboard = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const copyFullEmail = async () => {
        if (!data) return;
        const fullEmail = `Onderwerp: ${data.subject}\n\n${data.body}`;
        await copyToClipboard(fullEmail, "full");
    };

    const handleExportCSV = async () => {
        if (!data) return;
        const exportData = [{
            onderwerp: data.subject,
            body: data.body,
            callToAction: data.callToAction || "",
            type: data.emailType,
            ontvanger: data.recipientType,
            toon: data.tone,
            taal: data.language
        }];
        const columns = [
            { key: "onderwerp", label: "Onderwerp" },
            { key: "body", label: "Inhoud" },
            { key: "callToAction", label: "Call to Action" },
            { key: "type", label: "Type" },
            { key: "ontvanger", label: "Ontvanger" },
            { key: "toon", label: "Toon" }
        ];
        const result = exportToCSV(exportData, columns, { filename: `email-${Date.now()}` });
        downloadExport(result);
    };

    const handleExportPDF = async () => {
        if (!data) return;
        const sections = [
            {
                title: "E-mail Onderwerp",
                content: data.subject
            },
            {
                title: "E-mail Inhoud",
                content: data.body
            }
        ];

        if (data.callToAction) {
            sections.push({
                title: "Call to Action",
                content: data.callToAction
            });
        }

        if (data.tips && data.tips.length > 0) {
            sections.push({
                title: "Tips",
                content: data.tips.map((tip, i) => `${i + 1}. ${tip}`).join("\n")
            });
        }

        if (data.alternativeSubjects && data.alternativeSubjects.length > 0) {
            sections.push({
                title: "Alternatieve Onderwerpregels",
                content: data.alternativeSubjects.join("\n")
            });
        }

        const result = await exportToPDFReport(
            { sections },
            {
                title: "Gegenereerde E-mail",
                subtitle: `${EMAIL_TYPES.find(t => t.value === data.emailType)?.label || data.emailType}`,
                filename: `email-${Date.now()}`
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
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                            <p className="text-zinc-400 text-sm">Genereer professionele e-mails met AI</p>
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
                                <p className="text-white line-clamp-1">{result.subject}</p>
                                <p className="text-zinc-500">{result.emailType} • {result.tone}</p>
                            </div>
                        )}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">E-mail Details</h2>
                                <TemplateSelector
                                    toolId="email-generator"
                                    onSelectTemplate={handleApplyTemplate}
                                    currentData={{
                                        emailType,
                                        context,
                                        recipientType,
                                        tone,
                                        includeCallToAction,
                                        language
                                    }}
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Type & Recipient */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Type e-mail
                                        </label>
                                        <select
                                            value={emailType}
                                            onChange={(e) => setEmailType(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {EMAIL_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Ontvanger
                                        </label>
                                        <select
                                            value={recipientType}
                                            onChange={(e) => setRecipientType(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {RECIPIENT_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Context */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Context / Situatie
                                    </label>
                                    <textarea
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        rows={4}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Beschrijf de situatie en wat je wilt bereiken met deze e-mail. Bijv: 'Ik wil een follow-up sturen na een goed salesgesprek over onze software oplossing...'"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {context.length}/5000 tekens (min. 10)
                                    </p>
                                </div>

                                {/* Tone & Language */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Toon
                                        </label>
                                        <select
                                            value={tone}
                                            onChange={(e) => setTone(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {TONE_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label} - {option.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Taal
                                        </label>
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value as "nl" | "en")}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="nl">Nederlands</option>
                                            <option value="en">Engels</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Sender & Company */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            <User className="w-4 h-4 inline mr-1" />
                                            Afzender naam (optioneel)
                                        </label>
                                        <input
                                            type="text"
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Bijv. Jan Jansen"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            <Building2 className="w-4 h-4 inline mr-1" />
                                            Bedrijfsnaam (optioneel)
                                        </label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Bijv. ACME B.V."
                                        />
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeCallToAction}
                                            onChange={(e) => setIncludeCallToAction(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-zinc-300">Call-to-action toevoegen</span>
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={state.status === "loading" || context.trim().length < 10}
                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    {state.status === "loading" ? "Bezig met genereren..." :
                                     context.trim().length < 10 ? "Context te kort (min. 10 tekens)" :
                                     "Genereer E-mail"}
                                </button>
                            </form>
                        </div>

                        {/* Loading State */}
                        {state.status === "loading" && (
                            <ToolLoadingState
                                message="E-mail wordt gegenereerd..."
                                subMessage={`${EMAIL_TYPES.find(t => t.value === emailType)?.label} voor ${RECIPIENT_TYPES.find(t => t.value === recipientType)?.label}`}
                                estimatedTime={8}
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
                                    exportFormats={["pdf", "csv"]}
                                    onExport={(format) => format === "pdf" ? handleExportPDF() : handleExportCSV()}
                                    copyText={`Onderwerp: ${data.subject}\n\n${data.body}`}
                                    onSaveToHistory={handleSaveToHistory}
                                    onReset={reset}
                                />

                                {/* Success Summary */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        <div>
                                            <p className="font-semibold text-white">E-mail gegenereerd</p>
                                            <p className="text-sm text-zinc-400">
                                                {EMAIL_TYPES.find(t => t.value === data.emailType)?.label} • {TONE_OPTIONS.find(t => t.value === data.tone)?.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subject Line */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-white flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-blue-400" />
                                            Onderwerp
                                        </h3>
                                        <button
                                            onClick={() => copyToClipboard(data.subject, "subject")}
                                            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                        >
                                            {copiedField === "subject" ? (
                                                <Check className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-zinc-400" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-lg text-white font-medium">{data.subject}</p>
                                </div>

                                {/* Email Body */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-white flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-blue-400" />
                                            E-mail Inhoud
                                        </h3>
                                        <button
                                            onClick={() => copyToClipboard(data.body, "body")}
                                            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                        >
                                            {copiedField === "body" ? (
                                                <Check className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-zinc-400" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="bg-zinc-800/50 rounded-lg p-4">
                                        <p className="text-white whitespace-pre-wrap leading-relaxed">{data.body}</p>
                                    </div>
                                </div>

                                {/* Call to Action */}
                                {data.callToAction && (
                                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30 p-5">
                                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                            <Send className="w-4 h-4 text-blue-400" />
                                            Call to Action
                                        </h3>
                                        <p className="text-zinc-300">{data.callToAction}</p>
                                    </div>
                                )}

                                {/* Alternative Subjects */}
                                {data.alternativeSubjects && data.alternativeSubjects.length > 0 && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                                        <h3 className="font-semibold text-white mb-3">Alternatieve Onderwerpregels</h3>
                                        <div className="space-y-2">
                                            {data.alternativeSubjects.map((subject, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                                                    <p className="text-zinc-300">{subject}</p>
                                                    <button
                                                        onClick={() => copyToClipboard(subject, `alt-${i}`)}
                                                        className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
                                                    >
                                                        {copiedField === `alt-${i}` ? (
                                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                        ) : (
                                                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Copy Full Email Button */}
                                <button
                                    onClick={copyFullEmail}
                                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {copiedField === "full" ? (
                                        <>
                                            <Check className="w-4 h-4 text-emerald-400" />
                                            Gekopieerd!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Kopieer volledige e-mail
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Tips Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                                <h3 className="font-semibold text-white">E-mail Tips</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">1.</span>
                                    Gebruik een pakkende onderwerpregel
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">2.</span>
                                    Houd de e-mail kort en bondig
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">3.</span>
                                    Eindig met een duidelijke call-to-action
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">4.</span>
                                    Personaliseer waar mogelijk
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">5.</span>
                                    Controleer spelling en grammatica
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Globe className="w-5 h-5 text-blue-400" />
                                <h3 className="font-semibold text-white">Beste Verzendtijden</h3>
                            </div>
                            <div className="space-y-2 text-sm text-zinc-400">
                                <p><strong className="text-zinc-300">B2B:</strong> Di-Do, 9:00-11:00</p>
                                <p><strong className="text-zinc-300">B2C:</strong> Za-Zo, 10:00-12:00</p>
                                <p><strong className="text-zinc-300">Follow-up:</strong> 2-3 dagen na eerste contact</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <h3 className="font-semibold text-white mb-3">Gratis Tool</h3>
                            <p className="text-sm text-zinc-400">
                                Deze tool is volledig gratis te gebruiken. Geen account nodig, geen limieten.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
