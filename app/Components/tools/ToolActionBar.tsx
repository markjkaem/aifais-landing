"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Download,
    Copy,
    Save,
    RotateCcw,
    Share2,
    ChevronDown,
    FileJson,
    FileSpreadsheet,
    FileText,
    File,
    History,
    BookTemplate
} from "lucide-react";
import { ExportFormat } from "@/lib/tools/types";
import { exportData, downloadExport, ExportOptions, ExportColumn, DocumentContent } from "@/lib/export";
import { CopyDropdown } from "./CopyActions";
import { MarkdownContent } from "./CopyActions";

interface ToolActionBarProps {
    // Export options
    exportFormats?: ExportFormat[];
    onExport?: (format: ExportFormat) => void | Promise<void>;
    exportData?: any;
    exportColumns?: ExportColumn[];
    exportDocumentContent?: DocumentContent;
    exportOptions?: ExportOptions;

    // Copy options
    copyText?: string;
    copyJson?: any;
    copyMarkdown?: MarkdownContent;
    copyTable?: { headers: string[]; rows: (string | number | null)[][] };

    // Save to history
    onSaveToHistory?: () => void;
    isSaved?: boolean;

    // Reset/new
    onReset?: () => void;

    // Share (future)
    onShare?: () => void;

    // Custom actions
    customActions?: React.ReactNode;

    // History/Templates toggles
    showHistory?: boolean;
    setShowHistory?: (show: boolean) => void;
    showTemplates?: boolean;
    setShowTemplates?: (show: boolean) => void;

    className?: string;
}

const FORMAT_ICONS: Record<ExportFormat, typeof FileJson> = {
    json: FileJson,
    csv: FileSpreadsheet,
    xlsx: FileSpreadsheet,
    pdf: FileText,
    docx: File
};

const FORMAT_LABELS: Record<ExportFormat, string> = {
    json: "JSON",
    csv: "CSV",
    xlsx: "Excel",
    pdf: "PDF",
    docx: "Word"
};

export function ToolActionBar({
    exportFormats = [],
    onExport,
    exportData: exportDataProp,
    exportColumns,
    exportDocumentContent,
    exportOptions = {},
    copyText,
    copyJson,
    copyMarkdown,
    copyTable,
    onSaveToHistory,
    isSaved,
    onReset,
    onShare,
    customActions,
    showHistory,
    setShowHistory,
    showTemplates,
    setShowTemplates,
    className = ""
}: ToolActionBarProps) {
    const [exportOpen, setExportOpen] = useState(false);
    const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

    const handleExport = async (format: ExportFormat) => {
        if (onExport) {
            await onExport(format);
            setExportOpen(false);
            return;
        }

        // Use built-in export if data provided
        if (!exportDataProp && !exportDocumentContent) return;

        setIsExporting(format);
        try {
            let result;

            if (format === "pdf" || format === "docx") {
                if (!exportDocumentContent) {
                    console.error("Document content required for PDF/DOCX export");
                    return;
                }
                result = await exportData(format, exportDocumentContent, exportOptions);
            } else {
                if (!exportColumns) {
                    console.error("Columns required for CSV/XLSX/JSON export");
                    return;
                }
                result = await exportData(format, exportDataProp, { ...exportOptions, columns: exportColumns });
            }

            downloadExport(result);
        } catch (e) {
            console.error("Export failed:", e);
        } finally {
            setIsExporting(null);
            setExportOpen(false);
        }
    };

    const hasCopyOptions = copyText || copyJson || copyMarkdown || copyTable;
    const hasExportOptions = exportFormats.length > 0;
    const hasActions = hasCopyOptions || hasExportOptions || onSaveToHistory || onReset || onShare || customActions || setShowHistory || setShowTemplates;

    if (!hasActions) return null;

    return (
        <div className={`flex items-center gap-2 flex-wrap ${className}`}>
            {/* Export dropdown */}
            {hasExportOptions && (
                <div className="relative">
                    <button
                        onClick={() => setExportOpen(!exportOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Exporteren</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${exportOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {exportOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                    className="absolute top-full left-0 mt-1 min-w-36 bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl z-50 overflow-hidden"
                                >
                                    {exportFormats.map((format) => {
                                        const Icon = FORMAT_ICONS[format];
                                        return (
                                            <button
                                                key={format}
                                                onClick={() => handleExport(format)}
                                                disabled={isExporting === format}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                            >
                                                <Icon className="w-3.5 h-3.5" />
                                                <span>
                                                    {isExporting === format ? "Bezig..." : FORMAT_LABELS[format]}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Copy dropdown */}
            {hasCopyOptions && (
                <CopyDropdown
                    text={copyText}
                    json={copyJson}
                    markdown={copyMarkdown}
                    table={copyTable}
                />
            )}

            {/* Save to history */}
            {onSaveToHistory && (
                <button
                    onClick={onSaveToHistory}
                    disabled={isSaved}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        isSaved
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaved ? "Opgeslagen" : "Opslaan"}</span>
                </button>
            )}

            {/* Reset */}
            {onReset && (
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Nieuw</span>
                </button>
            )}
            
            {/* History Toggle */}
            {setShowHistory && (
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        showHistory
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                    title="Geschiedenis"
                >
                    <History className="w-3.5 h-3.5" />
                    <span>Geschiedenis</span>
                </button>
            )}

            {/* Templates Toggle */}
            {setShowTemplates && (
                <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        showTemplates
                            ? "bg-violet-500/20 text-violet-400"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                    title="Templates"
                >
                    <BookTemplate className="w-3.5 h-3.5" />
                    <span>Templates</span>
                </button>
            )}

            {/* Share (future) */}
            {onShare && (
                <button
                    onClick={onShare}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
                >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Delen</span>
                </button>
            )}

            {/* Custom actions */}
            {customActions}
        </div>
    );
}

// Default export for backwards compatibility
export default ToolActionBar;
