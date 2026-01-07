"use client";

import { useState, useCallback } from "react";
import { Check, Copy, Code, FileText, Table } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CopyButtonBaseProps {
    onCopy: () => void;
    label?: string;
    variant?: "default" | "minimal" | "icon";
    className?: string;
}

function CopyButtonBase({ onCopy, label = "Kopieer", variant = "default", className = "" }: CopyButtonBaseProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (variant === "icon") {
        return (
            <button
                onClick={handleCopy}
                className={`p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors ${className}`}
                title={label}
            >
                {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </button>
        );
    }

    if (variant === "minimal") {
        return (
            <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors ${className}`}
            >
                {copied ? (
                    <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Gekopieerd!</span>
                    </>
                ) : (
                    <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{label}</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors ${className}`}
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Gekopieerd!</span>
                </>
            ) : (
                <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}

// Copy as plain text
interface CopyAsTextProps {
    text: string;
    label?: string;
    variant?: "default" | "minimal" | "icon";
    className?: string;
}

export function CopyAsText({ text, label = "Kopieer", variant = "default", className }: CopyAsTextProps) {
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(text);
    }, [text]);

    return <CopyButtonBase onCopy={handleCopy} label={label} variant={variant} className={className} />;
}

// Copy as JSON
interface CopyAsJSONProps {
    data: any;
    label?: string;
    variant?: "default" | "minimal" | "icon";
    className?: string;
    formatted?: boolean;
}

export function CopyAsJSON({ data, label = "Kopieer JSON", variant = "default", className, formatted = true }: CopyAsJSONProps) {
    const handleCopy = useCallback(() => {
        const json = formatted ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        navigator.clipboard.writeText(json);
    }, [data, formatted]);

    return <CopyButtonBase onCopy={handleCopy} label={label} variant={variant} className={className} />;
}

// Copy as Markdown
interface CopyAsMarkdownProps {
    content: MarkdownContent;
    label?: string;
    variant?: "default" | "minimal" | "icon";
    className?: string;
}

export interface MarkdownContent {
    title?: string;
    sections?: {
        heading?: string;
        paragraphs?: string[];
        bullets?: string[];
        table?: {
            headers: string[];
            rows: string[][];
        };
    }[];
}

export function CopyAsMarkdown({ content, label = "Kopieer Markdown", variant = "default", className }: CopyAsMarkdownProps) {
    const handleCopy = useCallback(() => {
        let markdown = "";

        if (content.title) {
            markdown += `# ${content.title}\n\n`;
        }

        content.sections?.forEach(section => {
            if (section.heading) {
                markdown += `## ${section.heading}\n\n`;
            }

            section.paragraphs?.forEach(p => {
                markdown += `${p}\n\n`;
            });

            section.bullets?.forEach(bullet => {
                markdown += `- ${bullet}\n`;
            });
            if (section.bullets?.length) markdown += "\n";

            if (section.table) {
                // Header row
                markdown += `| ${section.table.headers.join(" | ")} |\n`;
                // Separator
                markdown += `| ${section.table.headers.map(() => "---").join(" | ")} |\n`;
                // Data rows
                section.table.rows.forEach(row => {
                    markdown += `| ${row.join(" | ")} |\n`;
                });
                markdown += "\n";
            }
        });

        navigator.clipboard.writeText(markdown.trim());
    }, [content]);

    return <CopyButtonBase onCopy={handleCopy} label={label} variant={variant} className={className} />;
}

// Copy as CSV/TSV
interface CopyAsTableProps {
    headers: string[];
    rows: (string | number | null)[][];
    label?: string;
    variant?: "default" | "minimal" | "icon";
    className?: string;
    separator?: ";" | "\t" | ",";
}

export function CopyAsTable({ headers, rows, label = "Kopieer Tabel", variant = "default", className, separator = ";" }: CopyAsTableProps) {
    const handleCopy = useCallback(() => {
        const headerRow = headers.join(separator);
        const dataRows = rows.map(row =>
            row.map(cell => {
                const str = String(cell ?? "");
                // Quote if contains separator or quotes
                if (str.includes(separator) || str.includes('"') || str.includes("\n")) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            }).join(separator)
        );
        const csv = [headerRow, ...dataRows].join("\n");
        navigator.clipboard.writeText(csv);
    }, [headers, rows, separator]);

    return <CopyButtonBase onCopy={handleCopy} label={label} variant={variant} className={className} />;
}

// Multi-format copy dropdown
interface CopyDropdownProps {
    text?: string;
    json?: any;
    markdown?: MarkdownContent;
    table?: { headers: string[]; rows: (string | number | null)[][] };
    className?: string;
}

export function CopyDropdown({ text, json, markdown, table, className = "" }: CopyDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = async (type: string, content: string) => {
        await navigator.clipboard.writeText(content);
        setCopied(type);
        setTimeout(() => {
            setCopied(null);
            setIsOpen(false);
        }, 1500);
    };

    const options = [
        text && { key: "text", label: "Als Tekst", icon: FileText, content: text },
        json && { key: "json", label: "Als JSON", icon: Code, content: JSON.stringify(json, null, 2) },
        markdown && { key: "markdown", label: "Als Markdown", icon: FileText, content: formatMarkdown(markdown) },
        table && { key: "table", label: "Als Tabel (CSV)", icon: Table, content: formatTable(table.headers, table.rows) }
    ].filter(Boolean) as { key: string; label: string; icon: any; content: string }[];

    if (options.length <= 1) {
        // Just show single copy button
        const option = options[0];
        if (!option) return null;
        return <CopyAsText text={option.content} label="Kopieer" className={className} />;
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
            >
                <Copy className="w-3.5 h-3.5" />
                <span>Kopieer</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.95 }}
                            className="absolute top-full right-0 mt-1 min-w-40 bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl z-50 overflow-hidden"
                        >
                            {options.map((option) => (
                                <button
                                    key={option.key}
                                    onClick={() => handleCopy(option.key, option.content)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                >
                                    {copied === option.key ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                        <option.icon className="w-3.5 h-3.5" />
                                    )}
                                    <span className={copied === option.key ? "text-emerald-400" : ""}>
                                        {copied === option.key ? "Gekopieerd!" : option.label}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper functions
function formatMarkdown(content: MarkdownContent): string {
    let markdown = "";

    if (content.title) {
        markdown += `# ${content.title}\n\n`;
    }

    content.sections?.forEach(section => {
        if (section.heading) {
            markdown += `## ${section.heading}\n\n`;
        }
        section.paragraphs?.forEach(p => {
            markdown += `${p}\n\n`;
        });
        section.bullets?.forEach(bullet => {
            markdown += `- ${bullet}\n`;
        });
        if (section.bullets?.length) markdown += "\n";
        if (section.table) {
            markdown += `| ${section.table.headers.join(" | ")} |\n`;
            markdown += `| ${section.table.headers.map(() => "---").join(" | ")} |\n`;
            section.table.rows.forEach(row => {
                markdown += `| ${row.join(" | ")} |\n`;
            });
            markdown += "\n";
        }
    });

    return markdown.trim();
}

function formatTable(headers: string[], rows: (string | number | null)[][]): string {
    const headerRow = headers.join(";");
    const dataRows = rows.map(row =>
        row.map(cell => {
            const str = String(cell ?? "");
            if (str.includes(";") || str.includes('"') || str.includes("\n")) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }).join(";")
    );
    return [headerRow, ...dataRows].join("\n");
}

// Default export for backward compatibility
export default CopyAsText;
