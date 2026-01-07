"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    ChevronDown,
    Plus,
    Star,
    StarOff,
    Trash2,
    Copy,
    Download,
    Upload,
    X,
    Check,
    Edit3,
    Save
} from "lucide-react";
import { Template } from "@/lib/tools/types";
import {
    getTemplates,
    saveTemplate,
    deleteTemplate,
    setDefaultTemplate,
    duplicateTemplate,
    exportTemplates,
    importTemplates,
    getBuiltInTemplates,
    BuiltInTemplate
} from "@/lib/templates";

interface TemplateSelectorProps<T> {
    toolId: string;
    currentData: T;
    onSelectTemplate: (data: T) => void;
    className?: string;
}

export default function TemplateSelector<T>({
    toolId,
    currentData,
    onSelectTemplate,
    className = ""
}: TemplateSelectorProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [templates, setTemplates] = useState<Template<T>[]>([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [newTemplateDesc, setNewTemplateDesc] = useState("");
    const [activeTab, setActiveTab] = useState<"saved" | "builtin">("saved");

    const builtInTemplates = getBuiltInTemplates(toolId);

    useEffect(() => {
        setTemplates(getTemplates<T>(toolId));
    }, [toolId]);

    const refreshTemplates = () => {
        setTemplates(getTemplates<T>(toolId));
    };

    const handleSaveTemplate = () => {
        if (!newTemplateName.trim()) return;

        saveTemplate(toolId, newTemplateName, currentData, newTemplateDesc || undefined);
        refreshTemplates();
        setShowSaveModal(false);
        setNewTemplateName("");
        setNewTemplateDesc("");
    };

    const handleDeleteTemplate = (id: string) => {
        if (confirm("Weet je zeker dat je deze template wilt verwijderen?")) {
            deleteTemplate(toolId, id);
            refreshTemplates();
        }
    };

    const handleSetDefault = (id: string) => {
        setDefaultTemplate(toolId, id);
        refreshTemplates();
    };

    const handleDuplicate = (id: string) => {
        duplicateTemplate<T>(toolId, id);
        refreshTemplates();
    };

    const handleExport = () => {
        const json = exportTemplates(toolId);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `templates-${toolId}-${Date.now()}.json`;
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
                    const count = importTemplates<T>(toolId, json);
                    if (count > 0) {
                        refreshTemplates();
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleSelectBuiltIn = (template: BuiltInTemplate<T>) => {
        onSelectTemplate(template.data);
        setIsOpen(false);
    };

    const handleSelectSaved = (template: Template<T>) => {
        onSelectTemplate(template.data);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:text-white transition-colors"
            >
                <FileText className="w-4 h-4" />
                <span>Templates</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-2 w-80 bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl z-50 overflow-hidden"
                        >
                            {/* Tabs */}
                            <div className="flex border-b border-zinc-800">
                                <button
                                    onClick={() => setActiveTab("saved")}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                                        activeTab === "saved"
                                            ? "text-white border-b-2 border-blue-500"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    Opgeslagen ({templates.length})
                                </button>
                                {builtInTemplates.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab("builtin")}
                                        className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                                            activeTab === "builtin"
                                                ? "text-white border-b-2 border-blue-500"
                                                : "text-zinc-400 hover:text-white"
                                        }`}
                                    >
                                        Standaard ({builtInTemplates.length})
                                    </button>
                                )}
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {activeTab === "saved" ? (
                                    <div className="p-2 space-y-1">
                                        {/* Save current button */}
                                        <button
                                            onClick={() => setShowSaveModal(true)}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Huidige opslaan als template
                                        </button>

                                        {templates.length === 0 ? (
                                            <p className="text-sm text-zinc-500 text-center py-4">
                                                Nog geen templates opgeslagen
                                            </p>
                                        ) : (
                                            templates.map((template) => (
                                                <div
                                                    key={template.id}
                                                    className="group flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                                >
                                                    <button
                                                        onClick={() => handleSelectSaved(template)}
                                                        className="flex-1 text-left"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-white">
                                                                {template.name}
                                                            </span>
                                                            {template.isDefault && (
                                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            )}
                                                        </div>
                                                        {template.description && (
                                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                                {template.description}
                                                            </p>
                                                        )}
                                                    </button>

                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleSetDefault(template.id)}
                                                            className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-amber-400"
                                                            title="Standaard maken"
                                                        >
                                                            {template.isDefault ? (
                                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                            ) : (
                                                                <StarOff className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDuplicate(template.id)}
                                                            className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
                                                            title="Dupliceren"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTemplate(template.id)}
                                                            className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400"
                                                            title="Verwijderen"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-2 space-y-1">
                                        {builtInTemplates.map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => handleSelectBuiltIn(template)}
                                                className="w-full flex items-start gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg transition-colors text-left"
                                            >
                                                <FileText className="w-4 h-4 text-zinc-400 mt-0.5" />
                                                <div>
                                                    <span className="text-sm text-white">
                                                        {template.name}
                                                    </span>
                                                    <p className="text-xs text-zinc-500 mt-0.5">
                                                        {template.description}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer actions */}
                            <div className="flex items-center gap-2 p-2 border-t border-zinc-800">
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Exporteren
                                </button>
                                <button
                                    onClick={handleImport}
                                    className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Importeren
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Save Modal */}
            <AnimatePresence>
                {showSaveModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setShowSaveModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-zinc-900 rounded-xl border border-zinc-800 p-6 shadow-xl"
                        >
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-lg font-semibold text-white mb-4">
                                Template Opslaan
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                                        Naam *
                                    </label>
                                    <input
                                        type="text"
                                        value={newTemplateName}
                                        onChange={(e) => setNewTemplateName(e.target.value)}
                                        placeholder="Mijn template"
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                                        Beschrijving (optioneel)
                                    </label>
                                    <input
                                        type="text"
                                        value={newTemplateDesc}
                                        onChange={(e) => setNewTemplateDesc(e.target.value)}
                                        placeholder="Korte beschrijving..."
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setShowSaveModal(false)}
                                        className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Annuleren
                                    </button>
                                    <button
                                        onClick={handleSaveTemplate}
                                        disabled={!newTemplateName.trim()}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg text-sm text-white font-medium transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Opslaan
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
