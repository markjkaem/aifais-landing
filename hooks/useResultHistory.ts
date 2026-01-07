"use client";

import { useState, useCallback, useEffect } from "react";
import { HistoryEntry } from "@/lib/tools/types";

const STORAGE_PREFIX = "aifais_history_";
const MAX_ENTRIES = 50;

interface UseResultHistoryOptions {
    maxEntries?: number;
}

interface UseResultHistoryReturn<T> {
    history: HistoryEntry<T>[];
    saveToHistory: (input: Record<string, any>, result: T, tags?: string[]) => string;
    loadEntry: (id: string) => HistoryEntry<T> | null;
    deleteEntry: (id: string) => void;
    clearHistory: () => void;
    searchHistory: (query: string) => HistoryEntry<T>[];
    toggleStar: (id: string) => void;
    getStarred: () => HistoryEntry<T>[];
    exportHistory: () => string;
    importHistory: (json: string) => boolean;
    isLoading: boolean;
}

export function useResultHistory<T = any>(
    toolId: string,
    options: UseResultHistoryOptions = {}
): UseResultHistoryReturn<T> {
    const { maxEntries = MAX_ENTRIES } = options;
    const [history, setHistory] = useState<HistoryEntry<T>[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const storageKey = `${STORAGE_PREFIX}${toolId}`;

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                setHistory(parsed);
            }
        } catch (e) {
            console.error("Failed to load history:", e);
        }
        setIsLoading(false);
    }, [storageKey]);

    // Persist history to localStorage
    const persistHistory = useCallback((entries: HistoryEntry<T>[]) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(entries));
        } catch (e) {
            console.error("Failed to persist history:", e);
        }
    }, [storageKey]);

    // Generate unique ID
    const generateId = () => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    // Save result to history
    const saveToHistory = useCallback((
        input: Record<string, any>,
        result: T,
        tags?: string[]
    ): string => {
        const id = generateId();
        const entry: HistoryEntry<T> = {
            id,
            toolId,
            timestamp: Date.now(),
            input,
            result,
            tags,
            starred: false
        };

        setHistory(prev => {
            const updated = [entry, ...prev].slice(0, maxEntries);
            persistHistory(updated);
            return updated;
        });

        return id;
    }, [toolId, maxEntries, persistHistory]);

    // Load specific entry
    const loadEntry = useCallback((id: string): HistoryEntry<T> | null => {
        return history.find(entry => entry.id === id) || null;
    }, [history]);

    // Delete entry
    const deleteEntry = useCallback((id: string) => {
        setHistory(prev => {
            const updated = prev.filter(entry => entry.id !== id);
            persistHistory(updated);
            return updated;
        });
    }, [persistHistory]);

    // Clear all history
    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(storageKey);
    }, [storageKey]);

    // Search history
    const searchHistory = useCallback((query: string): HistoryEntry<T>[] => {
        const lowerQuery = query.toLowerCase();
        return history.filter(entry => {
            // Search in tags
            if (entry.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
                return true;
            }
            // Search in input (stringify and search)
            if (JSON.stringify(entry.input).toLowerCase().includes(lowerQuery)) {
                return true;
            }
            // Search in result (stringify and search)
            if (JSON.stringify(entry.result).toLowerCase().includes(lowerQuery)) {
                return true;
            }
            return false;
        });
    }, [history]);

    // Toggle starred status
    const toggleStar = useCallback((id: string) => {
        setHistory(prev => {
            const updated = prev.map(entry =>
                entry.id === id ? { ...entry, starred: !entry.starred } : entry
            );
            persistHistory(updated);
            return updated;
        });
    }, [persistHistory]);

    // Get starred entries
    const getStarred = useCallback((): HistoryEntry<T>[] => {
        return history.filter(entry => entry.starred);
    }, [history]);

    // Export history as JSON
    const exportHistory = useCallback((): string => {
        return JSON.stringify({
            toolId,
            exportedAt: new Date().toISOString(),
            entries: history
        }, null, 2);
    }, [toolId, history]);

    // Import history from JSON
    const importHistory = useCallback((json: string): boolean => {
        try {
            const imported = JSON.parse(json);
            if (imported.toolId !== toolId) {
                console.warn("History import: toolId mismatch");
            }
            if (Array.isArray(imported.entries)) {
                setHistory(prev => {
                    // Merge, avoiding duplicates by ID
                    const existingIds = new Set(prev.map(e => e.id));
                    const newEntries = imported.entries.filter(
                        (e: HistoryEntry<T>) => !existingIds.has(e.id)
                    );
                    const updated = [...newEntries, ...prev].slice(0, maxEntries);
                    persistHistory(updated);
                    return updated;
                });
                return true;
            }
            return false;
        } catch (e) {
            console.error("Failed to import history:", e);
            return false;
        }
    }, [toolId, maxEntries, persistHistory]);

    return {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        searchHistory,
        toggleStar,
        getStarred,
        exportHistory,
        importHistory,
        isLoading
    };
}

// Hook for accessing history entries count (for UI badges)
export function useHistoryCount(toolId: string): number {
    const [count, setCount] = useState(0);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(`${STORAGE_PREFIX}${toolId}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                setCount(Array.isArray(parsed) ? parsed.length : 0);
            }
        } catch {
            setCount(0);
        }
    }, [toolId]);

    return count;
}
