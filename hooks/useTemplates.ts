"use client";

import { useState, useEffect, useCallback } from "react";

export interface Template {
    id: string;
    name: string;
    data: any;
    createdAt: string;
    updatedAt: string;
}

interface UseTemplatesReturn {
    templates: Template[];
    saveTemplate: (name: string, data: any) => void;
    updateTemplate: (id: string, name: string, data: any) => void;
    deleteTemplate: (id: string) => void;
    loadTemplate: (id: string) => Template | undefined;
    clearTemplates: () => void;
    exportTemplates: () => string;
    importTemplates: (json: string) => boolean;
}

const STORAGE_PREFIX = "templates_";
const MAX_TEMPLATES = 20;

export function useTemplates(toolKey: string): UseTemplatesReturn {
    const [templates, setTemplates] = useState<Template[]>([]);
    const storageKey = `${STORAGE_PREFIX}${toolKey}`;

    // Load templates from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setTemplates(parsed);
                }
            }
        } catch (e) {
            console.error("Failed to load templates:", e);
        }
    }, [storageKey]);

    // Save templates to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(templates));
        } catch (e) {
            console.error("Failed to save templates:", e);
        }
    }, [templates, storageKey]);

    const saveTemplate = useCallback((name: string, data: any) => {
        const newTemplate: Template = {
            id: Date.now().toString(),
            name: name.trim() || `Template ${templates.length + 1}`,
            data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setTemplates((prev) => {
            const updated = [newTemplate, ...prev].slice(0, MAX_TEMPLATES);
            return updated;
        });
    }, [templates.length]);

    const updateTemplate = useCallback((id: string, name: string, data: any) => {
        setTemplates((prev) =>
            prev.map((t) =>
                t.id === id
                    ? {
                        ...t,
                        name: name.trim() || t.name,
                        data,
                        updatedAt: new Date().toISOString(),
                    }
                    : t
            )
        );
    }, []);

    const deleteTemplate = useCallback((id: string) => {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const loadTemplate = useCallback(
        (id: string) => {
            return templates.find((t) => t.id === id);
        },
        [templates]
    );

    const clearTemplates = useCallback(() => {
        setTemplates([]);
    }, []);

    const exportTemplates = useCallback(() => {
        return JSON.stringify(templates, null, 2);
    }, [templates]);

    const importTemplates = useCallback((json: string): boolean => {
        try {
            const parsed = JSON.parse(json);
            if (!Array.isArray(parsed)) return false;

            const validTemplates = parsed
                .filter(
                    (t: any) =>
                        typeof t.id === "string" &&
                        typeof t.name === "string" &&
                        t.data !== undefined
                )
                .map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    data: t.data,
                    createdAt: t.createdAt || new Date().toISOString(),
                    updatedAt: t.updatedAt || new Date().toISOString(),
                }));

            setTemplates((prev) => {
                // Merge imported templates, avoiding duplicates by id
                const existingIds = new Set(prev.map((t) => t.id));
                const newTemplates = validTemplates.filter(
                    (t: Template) => !existingIds.has(t.id)
                );
                return [...newTemplates, ...prev].slice(0, MAX_TEMPLATES);
            });

            return true;
        } catch (e) {
            console.error("Failed to import templates:", e);
            return false;
        }
    }, []);

    return {
        templates,
        saveTemplate,
        updateTemplate,
        deleteTemplate,
        loadTemplate,
        clearTemplates,
        exportTemplates,
        importTemplates,
    };
}
