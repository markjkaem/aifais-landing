"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    History,
    Search,
    Trash2,
    Star,
    StarOff,
    Download,
    Upload,
    ChevronDown,
    ChevronUp,
    Clock,
    X,
    RotateCcw,
    FileJson
} from "lucide-react";
import { HistoryEntry } from "@/lib/tools/types";

interface ResultHistoryProps<T> {
    history: HistoryEntry<T>[];
    onLoadEntry: (entry: HistoryEntry<T>) => void;
    onDeleteEntry: (id: string) => void;
    onClearHistory: () => void;
    onToggleStar: (id: string) => void;
    onExportHistory: () => string;
    onImportHistory: (json: string) => boolean;
    renderPreview?: (entry: HistoryEntry<T>) => React.ReactNode;
    className?: string;
}

export function ResultHistory<T>({
    history,
    onLoadEntry,
    onDeleteEntry,
    onClearHistory,
    onToggleStar,
    onExportHistory,
    onImportHistory,
    renderPreview,
    className = ""
}: ResultHistoryProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredHistory = useMemo(() => {
        let filtered = history;

        if (showStarredOnly) {
            filtered = filtered.filter(entry => entry.starred);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(entry => {
                const inputStr = JSON.stringify(entry.input).toLowerCase();
                const resultStr = JSON.stringify(entry.result).toLowerCase();
                const tagsStr = entry.tags?.join(" ").toLowerCase() || "";
                return inputStr.includes(query) || resultStr.includes(query) || tagsStr.includes(query);
            });
        }

        return filtered;
    }, [history, searchQuery, showStarredOnly]);

    const handleExport = () => {
        const json = onExportHistory();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `history-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const json = event.target?.result as string;
                    onImportHistory(json);
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Zojuist";
        if (minutes < 60) return `${minutes}m geleden`;
        if (hours < 24) return `${hours}u geleden`;
        if (days < 7) return `${days}d geleden`;
        return date.toLocaleDateString("nl-NL");
    };

    if (history.length === 0) {
        return null;
    }

    return (
        <div className={`bg-zinc-900 rounded-xl border border-zinc-800 ${className}`}>
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 rounded-xl transition-colors"
            >
                <div className="flex items-center gap-3">
                    <History className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium text-white">Geschiedenis</span>
                    <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs text-zinc-400">
                        {history.length}
                    </span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
            </button>

            {/* Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3">
                            {/* Search and filters */}
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Zoeken..."
                                        className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowStarredOnly(!showStarredOnly)}
                                    className={`px-3 py-2 rounded-lg border transition-colors ${
                                        showStarredOnly
                                            ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
                                    }`}
                                    title="Toon alleen favorieten"
                                >
                                    <Star className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 text-xs">
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-1.5 px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Exporteren
                                </button>
                                <button
                                    onClick={handleImport}
                                    className="flex items-center gap-1.5 px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Importeren
                                </button>
                                <button
                                    onClick={onClearHistory}
                                    className="flex items-center gap-1.5 px-2 py-1.5 bg-zinc-800 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition-colors ml-auto"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Wissen
                                </button>
                            </div>

                            {/* History list */}
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {filteredHistory.length === 0 ? (
                                    <p className="text-sm text-zinc-500 text-center py-4">
                                        {searchQuery || showStarredOnly
                                            ? "Geen resultaten gevonden"
                                            : "Nog geen geschiedenis"}
                                    </p>
                                ) : (
                                    filteredHistory.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden"
                                        >
                                            <div className="px-3 py-2 flex items-center gap-3">
                                                <button
                                                    onClick={() => onToggleStar(entry.id)}
                                                    className="text-zinc-500 hover:text-amber-400 transition-colors"
                                                >
                                                    {entry.starred ? (
                                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    ) : (
                                                        <StarOff className="w-4 h-4" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                                                    className="flex-1 text-left"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                                        <span className="text-xs text-zinc-400">
                                                            {formatDate(entry.timestamp)}
                                                        </span>
                                                        {entry.tags && entry.tags.length > 0 && (
                                                            <div className="flex gap-1">
                                                                {entry.tags.slice(0, 2).map((tag, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => onLoadEntry(entry)}
                                                        className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400 transition-colors"
                                                        title="Laden"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteEntry(entry.id)}
                                                        className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                                                        title="Verwijderen"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded preview */}
                                            <AnimatePresence>
                                                {expandedId === entry.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="border-t border-zinc-700/50"
                                                    >
                                                        <div className="px-3 py-2 text-xs">
                                                            {renderPreview ? (
                                                                renderPreview(entry)
                                                            ) : (
                                                                <pre className="text-zinc-400 overflow-x-auto max-h-32">
                                                                    {JSON.stringify(entry.result, null, 2).slice(0, 500)}
                                                                    {JSON.stringify(entry.result).length > 500 && "..."}
                                                                </pre>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
