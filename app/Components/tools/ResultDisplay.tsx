"use client";

import { motion } from "framer-motion";
import {
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Info,
    TrendingUp,
    Clock,
    Sparkles
} from "lucide-react";
import ToolActionBar from "./ToolActionBar";
import { ExportFormat } from "@/lib/tools/types";
import { ExportColumn, DocumentContent } from "@/lib/export";
import { MarkdownContent } from "./CopyActions";

type ResultStatus = "success" | "warning" | "error" | "info";

interface ResultDisplayProps {
    status: ResultStatus;
    title?: string;
    message?: string;

    // Score display (0-100)
    score?: number;
    scoreLabel?: string;

    // Confidence indicator
    confidence?: number;

    // Processing time
    processingTime?: number;

    // Warnings
    warnings?: string[];

    // Action bar props
    exportFormats?: ExportFormat[];
    onExport?: (format: ExportFormat) => void | Promise<void>;
    exportData?: any;
    exportColumns?: ExportColumn[];
    exportDocumentContent?: DocumentContent;
    copyText?: string;
    copyJson?: any;
    copyMarkdown?: MarkdownContent;
    copyTable?: { headers: string[]; rows: (string | number | null)[][] };
    onSaveToHistory?: () => void;
    isSaved?: boolean;
    onReset?: () => void;

    // Custom content
    children?: React.ReactNode;

    className?: string;
}

const STATUS_CONFIG = {
    success: {
        icon: CheckCircle,
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
        iconColor: "text-emerald-400",
        titleColor: "text-emerald-400"
    },
    warning: {
        icon: AlertTriangle,
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        iconColor: "text-amber-400",
        titleColor: "text-amber-400"
    },
    error: {
        icon: AlertCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        iconColor: "text-red-400",
        titleColor: "text-red-400"
    },
    info: {
        icon: Info,
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        iconColor: "text-blue-400",
        titleColor: "text-blue-400"
    }
};

function getScoreColor(score: number): string {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
}

function getScoreBgColor(score: number): string {
    if (score >= 80) return "bg-emerald-500/20";
    if (score >= 60) return "bg-amber-500/20";
    if (score >= 40) return "bg-orange-500/20";
    return "bg-red-500/20";
}

export default function ResultDisplay({
    status,
    title,
    message,
    score,
    scoreLabel,
    confidence,
    processingTime,
    warnings,
    exportFormats,
    onExport,
    exportData,
    exportColumns,
    exportDocumentContent,
    copyText,
    copyJson,
    copyMarkdown,
    copyTable,
    onSaveToHistory,
    isSaved,
    onReset,
    children,
    className = ""
}: ResultDisplayProps) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border ${config.borderColor} ${config.bgColor} overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-800/50">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                            <Icon className={`w-5 h-5 ${config.iconColor}`} />
                        </div>
                        <div>
                            {title && (
                                <h3 className={`font-semibold ${config.titleColor}`}>
                                    {title}
                                </h3>
                            )}
                            {message && (
                                <p className="text-sm text-zinc-400 mt-0.5">{message}</p>
                            )}
                        </div>
                    </div>

                    {/* Score */}
                    {typeof score === "number" && (
                        <div className={`text-center px-4 py-2 rounded-lg ${getScoreBgColor(score)}`}>
                            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                                {score}
                            </div>
                            {scoreLabel && (
                                <div className="text-xs text-zinc-400">{scoreLabel}</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Meta info (confidence, processing time) */}
                {(typeof confidence === "number" || typeof processingTime === "number") && (
                    <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                        {typeof confidence === "number" && (
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Zekerheid: {confidence}%</span>
                            </div>
                        )}
                        {typeof processingTime === "number" && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{(processingTime / 1000).toFixed(1)}s</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Warnings */}
                {warnings && warnings.length > 0 && (
                    <div className="mt-3 space-y-1">
                        {warnings.map((warning, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-amber-400">
                                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>{warning}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            {children && (
                <div className="p-4">
                    {children}
                </div>
            )}

            {/* Action bar */}
            {(exportFormats?.length || copyText || copyJson || copyMarkdown || copyTable || onSaveToHistory || onReset) && (
                <div className="px-4 py-3 border-t border-zinc-800/50 bg-zinc-900/50">
                    <ToolActionBar
                        exportFormats={exportFormats}
                        onExport={onExport}
                        exportData={exportData}
                        exportColumns={exportColumns}
                        exportDocumentContent={exportDocumentContent}
                        copyText={copyText}
                        copyJson={copyJson}
                        copyMarkdown={copyMarkdown}
                        copyTable={copyTable}
                        onSaveToHistory={onSaveToHistory}
                        isSaved={isSaved}
                        onReset={onReset}
                    />
                </div>
            )}
        </motion.div>
    );
}

// Compact score display component
interface ScoreDisplayProps {
    score: number;
    label?: string;
    size?: "sm" | "md" | "lg";
    showTrend?: boolean;
    trendDirection?: "up" | "down" | "neutral";
    className?: string;
}

export function ScoreDisplay({
    score,
    label,
    size = "md",
    showTrend,
    trendDirection,
    className = ""
}: ScoreDisplayProps) {
    const sizeClasses = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-4xl"
    };

    return (
        <div className={`text-center ${className}`}>
            <div className={`flex items-center justify-center gap-2 ${getScoreColor(score)}`}>
                <span className={`font-bold ${sizeClasses[size]}`}>{score}</span>
                {showTrend && trendDirection && (
                    <TrendingUp
                        className={`w-4 h-4 ${trendDirection === "up" ? "" : "rotate-180"} ${
                            trendDirection === "up" ? "text-emerald-400" : "text-red-400"
                        }`}
                    />
                )}
            </div>
            {label && (
                <div className="text-xs text-zinc-500 mt-1">{label}</div>
            )}
        </div>
    );
}

// Tier/status badge
interface TierBadgeProps {
    tier: "cold" | "warm" | "hot" | "low" | "medium" | "high";
    className?: string;
}

export function TierBadge({ tier, className = "" }: TierBadgeProps) {
    const config: Record<string, { bg: string; text: string; label: string }> = {
        cold: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Koud" },
        warm: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Warm" },
        hot: { bg: "bg-red-500/20", text: "text-red-400", label: "Hot" },
        low: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Laag" },
        medium: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Gemiddeld" },
        high: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Hoog" }
    };

    const c = config[tier] || config.medium;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} ${className}`}>
            {c.label}
        </span>
    );
}

// Priority badge for SEO/recommendations
interface PriorityBadgeProps {
    priority: "high" | "medium" | "low";
    className?: string;
}

export function PriorityBadge({ priority, className = "" }: PriorityBadgeProps) {
    const config: Record<string, { bg: string; text: string; label: string }> = {
        high: { bg: "bg-red-500/20", text: "text-red-400", label: "Hoog" },
        medium: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Gemiddeld" },
        low: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Laag" }
    };

    const c = config[priority];

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text} ${className}`}>
            {c.label}
        </span>
    );
}
