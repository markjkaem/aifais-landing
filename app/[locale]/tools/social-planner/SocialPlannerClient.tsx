"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { useResultHistory } from "@/hooks/useResultHistory";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import ResultHistory from "@/app/Components/tools/ResultHistory";
import TemplateSelector from "@/app/Components/tools/TemplateSelector";
import ToolLoadingState from "@/app/Components/tools/ToolLoadingState";
import { ToolActionBar } from "@/app/Components/tools/ToolActionBar";
import { exportToCSV, exportToPDFReport, downloadExport } from "@/lib/export";
import {
    Megaphone,
    AlertCircle,
    CheckCircle2,
    Copy,
    Check,
    Lightbulb,
    Image,
    Calendar,
    Clock,
    Hash,
    Twitter,
    Linkedin,
    Facebook,
    Instagram,
    Music2,
    Filter,
    Users,
    LayoutGrid,
    List
} from "lucide-react";

interface SocialPost {
    platform: string;
    content: string;
    hashtags?: string[];
    bestTime?: string;
    characterCount?: number;
    characterLimit?: number;
    imageSuggestion?: string;
    variant?: string | null;
}

interface CalendarEntry {
    day: string;
    time: string;
    platform: string;
    postIndex: number;
}

interface SocialPlannerResult {
    posts: SocialPost[];
    contentCalendar?: CalendarEntry[];
    topic: string;
    tone: string;
    totalPosts: number;
    generatedAt: string;
    processingTime?: number;
    confidence?: number;
}

const PLATFORMS = ["linkedin", "instagram", "facebook", "twitter", "tiktok"] as const;

const PLATFORM_CONFIG: Record<string, {
    name: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    limit: number;
}> = {
    linkedin: {
        name: "LinkedIn",
        icon: <Linkedin className="w-4 h-4" />,
        color: "text-blue-400",
        bgColor: "bg-blue-500/20 border-blue-500/30",
        limit: 3000
    },
    instagram: {
        name: "Instagram",
        icon: <Instagram className="w-4 h-4" />,
        color: "text-pink-400",
        bgColor: "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-pink-500/30",
        limit: 2200
    },
    facebook: {
        name: "Facebook",
        icon: <Facebook className="w-4 h-4" />,
        color: "text-blue-500",
        bgColor: "bg-blue-600/20 border-blue-600/30",
        limit: 63206
    },
    twitter: {
        name: "X (Twitter)",
        icon: <Twitter className="w-4 h-4" />,
        color: "text-zinc-300",
        bgColor: "bg-zinc-700/50 border-zinc-600/50",
        limit: 280
    },
    tiktok: {
        name: "TikTok",
        icon: <Music2 className="w-4 h-4" />,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/20 border-cyan-500/30",
        limit: 2200
    }
};

const TONE_OPTIONS = [
    { value: "professional", label: "Professioneel", description: "Zakelijk en betrouwbaar" },
    { value: "casual", label: "Casual", description: "Ontspannen en toegankelijk" },
    { value: "inspirational", label: "Inspirerend", description: "Motiverend en positief" },
    { value: "educational", label: "Educatief", description: "Informatief en leerzaam" }
];

const DAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

export default function SocialPlannerClient() {
    const toolMetadata = getToolBySlug("social-planner");

    // Form state
    const [topic, setTopic] = useState("");
    const [platforms, setPlatforms] = useState<string[]>(["linkedin"]);
    const [postCount, setPostCount] = useState(5);
    const [tone, setTone] = useState<"professional" | "casual" | "inspirational" | "educational">("professional");
    const [includeHashtags, setIncludeHashtags] = useState(true);
    const [targetAudience, setTargetAudience] = useState("");
    const [generateVariants, setGenerateVariants] = useState(false);

    // UI state
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

    // History
    const { saveToHistory } = useResultHistory("social-planner");

    // Paywall
    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess, reset } = usePaywallTool({
        apiEndpoint: "/api/v1/marketing/social-planner",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const togglePlatform = (p: string) => {
        setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim().length < 5 || platforms.length === 0) return;
        execute({
            topic,
            platforms,
            postCount,
            tone,
            includeHashtags,
            targetAudience: targetAudience || undefined,
            generateVariants
        });
    };

    const data = state.data as SocialPlannerResult | undefined;

    const handleSaveToHistory = useCallback(() => {
        if (data) {
            saveToHistory({
                title: data.topic.substring(0, 50),
                data,
                metadata: {
                    postCount: data.totalPosts,
                    platforms: platforms.join(", ")
                }
            });
        }
    }, [data, saveToHistory, platforms]);

    const handleLoadFromHistory = (entry: any) => {
        const historyData = entry.data as SocialPlannerResult;
        setTopic(historyData.topic);
        setTone(historyData.tone as any);
    };

    const handleApplyTemplate = (templateData: any) => {
        if (templateData.topic) setTopic(templateData.topic);
        if (templateData.platforms) setPlatforms(templateData.platforms);
        if (templateData.postCount) setPostCount(templateData.postCount);
        if (templateData.tone) setTone(templateData.tone);
        if (templateData.targetAudience) setTargetAudience(templateData.targetAudience);
        if (templateData.includeHashtags !== undefined) setIncludeHashtags(templateData.includeHashtags);
        if (templateData.generateVariants !== undefined) setGenerateVariants(templateData.generateVariants);
    };

    const copyPost = async (post: SocialPost, index: number) => {
        let text = post.content;
        if (post.hashtags?.length) {
            text += `\n\n${post.hashtags.join(" ")}`;
        }
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const copyAllPosts = async () => {
        if (!data?.posts) return;
        const text = data.posts.map((post, i) =>
            `=== ${PLATFORM_CONFIG[post.platform]?.name || post.platform} ===\n${post.content}\n${post.hashtags?.join(" ") || ""}\nBeste tijd: ${post.bestTime || "N/A"}\n`
        ).join("\n---\n\n");
        await navigator.clipboard.writeText(text);
    };

    const handleExportCSV = async () => {
        if (!data?.posts) return;
        const exportData = data.posts.map((post, i) => ({
            nummer: i + 1,
            platform: PLATFORM_CONFIG[post.platform]?.name || post.platform,
            content: post.content,
            hashtags: post.hashtags?.join(", "),
            besteTijd: post.bestTime,
            karakters: post.characterCount,
            limiet: post.characterLimit,
            afbeeldingSuggestie: post.imageSuggestion,
            variant: post.variant || ""
        }));
        const csv = exportToCSV(exportData);
        downloadExport(new Blob([csv], { type: "text/csv" }), `social-posts-${Date.now()}.csv`);
    };

    const handleExportPDF = async () => {
        if (!data?.posts) return;
        const sections = [
            {
                title: "Content Overzicht",
                content: `Onderwerp: ${data.topic}\nToon: ${data.tone}\nTotaal aantal posts: ${data.totalPosts}`
            },
            ...data.posts.map((post, i) => ({
                title: `Post ${i + 1}: ${PLATFORM_CONFIG[post.platform]?.name || post.platform}`,
                content: `${post.content}\n\n${post.hashtags?.length ? `Hashtags: ${post.hashtags.join(" ")}\n` : ""}Beste tijd om te posten: ${post.bestTime || "N/A"}\nKarakters: ${post.characterCount}/${post.characterLimit}${post.imageSuggestion ? `\n\nAfbeelding suggestie: ${post.imageSuggestion}` : ""}`
            }))
        ];

        const blob = await exportToPDFReport({
            title: `Social Media Content Plan`,
            subtitle: data.topic,
            sections,
            generatedAt: data.generatedAt
        });
        downloadExport(blob, `social-media-plan-${Date.now()}.pdf`);
    };

    const handleReset = () => {
        reset();
        setFilterPlatform(null);
    };

    const filteredPosts = data?.posts.filter(post =>
        !filterPlatform || post.platform === filterPlatform
    ) || [];

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl">
                            <Megaphone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{toolMetadata.title}</h1>
                            <p className="text-zinc-400 text-sm">Genereer social media content met AI</p>
                        </div>
                    </div>
                    <ResultHistory
                        toolId="social-planner"
                        onLoadEntry={handleLoadFromHistory}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            {/* Template selector */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">Content Details</h2>
                                <TemplateSelector
                                    toolId="social-planner"
                                    onApplyTemplate={handleApplyTemplate}
                                    currentFormData={{
                                        topic,
                                        platforms,
                                        postCount,
                                        tone,
                                        targetAudience,
                                        includeHashtags,
                                        generateVariants
                                    }}
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Topic */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Onderwerp
                                    </label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="bijv. AI automatisering voor MKB bedrijven"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {topic.length}/500 tekens (min. 5)
                                    </p>
                                </div>

                                {/* Target Audience */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Doelgroep (optioneel)
                                    </label>
                                    <input
                                        type="text"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="bijv. MKB-ondernemers, 35-55 jaar, tech-savvy"
                                    />
                                </div>

                                {/* Platforms */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                                        Platforms
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {PLATFORMS.map(platform => {
                                            const config = PLATFORM_CONFIG[platform];
                                            const isSelected = platforms.includes(platform);
                                            return (
                                                <button
                                                    key={platform}
                                                    type="button"
                                                    onClick={() => togglePlatform(platform)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
                                                        isSelected
                                                            ? `${config.bgColor} ${config.color}`
                                                            : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-600'
                                                    }`}
                                                >
                                                    {config.icon}
                                                    {config.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tone and Count */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Toon
                                        </label>
                                        <select
                                            value={tone}
                                            onChange={(e) => setTone(e.target.value as any)}
                                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                                            Aantal posts: <span className="text-pink-400">{postCount}</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={postCount}
                                            onChange={(e) => setPostCount(Number(e.target.value))}
                                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-3"
                                        />
                                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                                            <span>1</span>
                                            <span>5</span>
                                            <span>10</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeHashtags}
                                            onChange={(e) => setIncludeHashtags(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-pink-500 focus:ring-pink-500"
                                        />
                                        <span className="text-sm text-zinc-300">Hashtags toevoegen</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={generateVariants}
                                            onChange={(e) => setGenerateVariants(e.target.checked)}
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-pink-500 focus:ring-pink-500"
                                        />
                                        <span className="text-sm text-zinc-300">A/B varianten genereren</span>
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={state.status === "loading" || topic.trim().length < 5 || platforms.length === 0}
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-600 hover:to-orange-600 transition-all"
                                >
                                    {state.status === "loading" ? "Bezig met genereren..." :
                                     topic.trim().length < 5 ? "Onderwerp te kort (min. 5 tekens)" :
                                     platforms.length === 0 ? "Selecteer minimaal 1 platform" :
                                     "Genereer Social Media Posts"}
                                </button>
                            </form>
                        </div>

                        {/* Loading State */}
                        {state.status === "loading" && (
                            <ToolLoadingState
                                message="Posts worden gegenereerd..."
                                subMessage={`${postCount} posts voor ${platforms.length} platform(s)`}
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
                        {state.status === "success" && data?.posts && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Action Bar */}
                                <ToolActionBar
                                    onExportPDF={handleExportPDF}
                                    onExportCSV={handleExportCSV}
                                    onCopy={copyAllPosts}
                                    onSave={handleSaveToHistory}
                                    onReset={handleReset}
                                />

                                {/* Summary */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {data.totalPosts} posts gegenereerd
                                                </p>
                                                <p className="text-sm text-zinc-400">
                                                    {data.topic.substring(0, 50)}...
                                                </p>
                                            </div>
                                        </div>
                                        {data.confidence && (
                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                                                {data.confidence}% kwaliteit
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* View Toggle & Filter */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-zinc-500" />
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setFilterPlatform(null)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                                    !filterPlatform
                                                        ? 'bg-zinc-700 text-white'
                                                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                                }`}
                                            >
                                                Alle ({data.posts.length})
                                            </button>
                                            {PLATFORMS.filter(p => data.posts.some(post => post.platform === p)).map(platform => {
                                                const config = PLATFORM_CONFIG[platform];
                                                const count = data.posts.filter(post => post.platform === platform).length;
                                                return (
                                                    <button
                                                        key={platform}
                                                        onClick={() => setFilterPlatform(platform)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                                                            filterPlatform === platform
                                                                ? `${config.bgColor} ${config.color}`
                                                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                                        }`}
                                                    >
                                                        {config.icon}
                                                        {count}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 rounded ${viewMode === "list" ? "bg-zinc-700 text-white" : "text-zinc-400"}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("calendar")}
                                            className={`p-2 rounded ${viewMode === "calendar" ? "bg-zinc-700 text-white" : "text-zinc-400"}`}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Calendar View */}
                                {viewMode === "calendar" && data.contentCalendar && data.contentCalendar.length > 0 && (
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-pink-400" />
                                            Content Kalender
                                        </h3>
                                        <div className="grid grid-cols-7 gap-2">
                                            {DAYS.map(day => (
                                                <div key={day} className="text-center">
                                                    <p className="text-xs text-zinc-500 mb-2">{day.substring(0, 2)}</p>
                                                    <div className="space-y-1">
                                                        {data.contentCalendar?.filter(c => c.day === day).map((entry, i) => {
                                                            const config = PLATFORM_CONFIG[entry.platform];
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className={`p-2 rounded-lg text-xs ${config?.bgColor || 'bg-zinc-800'}`}
                                                                >
                                                                    <div className={config?.color || 'text-zinc-400'}>
                                                                        {config?.icon}
                                                                    </div>
                                                                    <p className="text-zinc-400 mt-1">{entry.time}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Posts List */}
                                <div className="space-y-4">
                                    {filteredPosts.map((post, index) => {
                                        const config = PLATFORM_CONFIG[post.platform];
                                        const originalIndex = data.posts.indexOf(post);
                                        const charPercentage = post.characterCount && post.characterLimit
                                            ? (post.characterCount / post.characterLimit) * 100
                                            : 0;

                                        return (
                                            <motion.div
                                                key={originalIndex}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
                                            >
                                                <div className="p-4">
                                                    {/* Header */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border ${config?.bgColor || 'bg-zinc-800'} ${config?.color || 'text-zinc-400'}`}>
                                                                {config?.icon}
                                                                {config?.name || post.platform}
                                                            </span>
                                                            {post.variant && (
                                                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs border border-amber-500/30">
                                                                    {post.variant}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {post.bestTime && (
                                                                <span className="flex items-center gap-1 text-xs text-zinc-500">
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    {post.bestTime}
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={() => copyPost(post, originalIndex)}
                                                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                                                title="Kopieer post"
                                                            >
                                                                {copiedIndex === originalIndex ? (
                                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4 text-zinc-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <p className="text-white whitespace-pre-wrap leading-relaxed">
                                                        {post.content}
                                                    </p>

                                                    {/* Hashtags */}
                                                    {post.hashtags && post.hashtags.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-1">
                                                            {post.hashtags.map((tag, i) => (
                                                                <span key={i} className="text-sm text-pink-400">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Character Count & Image Suggestion */}
                                                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            {post.characterCount && post.characterLimit && (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full ${
                                                                                charPercentage > 90 ? 'bg-red-500' :
                                                                                charPercentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                                                            }`}
                                                                            style={{ width: `${Math.min(charPercentage, 100)}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs text-zinc-500">
                                                                        {post.characterCount}/{post.characterLimit}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {post.imageSuggestion && (
                                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                                <Image className="w-3.5 h-3.5" />
                                                                <span className="max-w-[200px] truncate" title={post.imageSuggestion}>
                                                                    {post.imageSuggestion}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Tips Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                                <h3 className="font-semibold text-white">Social Media Tips</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">1.</span>
                                    Post op de voorgestelde tijden voor maximaal bereik
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">2.</span>
                                    Pas de content aan je eigen stem aan
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">3.</span>
                                    Gebruik de afbeeldingsuggesties als inspiratie
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">4.</span>
                                    Test A/B varianten om te zien wat werkt
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">5.</span>
                                    Houd de karakterlimiet in de gaten
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-xl border border-pink-500/30 p-5">
                            <h3 className="font-semibold text-white mb-2">Platform Limieten</h3>
                            <div className="space-y-2 text-sm">
                                {PLATFORMS.map(platform => {
                                    const config = PLATFORM_CONFIG[platform];
                                    return (
                                        <div key={platform} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={config.color}>{config.icon}</span>
                                                <span className="text-zinc-300">{config.name}</span>
                                            </div>
                                            <span className="text-zinc-500">{config.limit.toLocaleString()} tekens</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-5 h-5 text-blue-400" />
                                <h3 className="font-semibold text-white">Beste Post Tijden</h3>
                            </div>
                            <div className="space-y-2 text-sm text-zinc-400">
                                <p><strong className="text-zinc-300">LinkedIn:</strong> Di-Do, 10:00-12:00</p>
                                <p><strong className="text-zinc-300">Instagram:</strong> Ma-Vr, 18:00-20:00</p>
                                <p><strong className="text-zinc-300">Facebook:</strong> Wo-Vr, 11:00-14:00</p>
                                <p><strong className="text-zinc-300">X/Twitter:</strong> Ma-Vr, 12:00-15:00</p>
                                <p><strong className="text-zinc-300">TikTok:</strong> Di-Do, 19:00-21:00</p>
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
