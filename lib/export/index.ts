/**
 * Universal Export System
 * Supports: PDF, CSV, JSON, DOCX, XLSX
 */

import { PDFGenerator, PDFConfig } from "@/lib/pdf/generator";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, BorderStyle, WidthType, AlignmentType } from "docx";
import ExcelJS from "exceljs";

// ==================== Types ====================

export type ExportFormat = "pdf" | "csv" | "json" | "docx" | "xlsx";

export interface ExportColumn {
    key: string;
    label: string;
    width?: number;
    format?: (value: any) => string;
}

export interface ExportStyling {
    logo?: string;
    primaryColor?: string;
    companyName?: string;
    fontFamily?: string;
}

export interface ExportOptions {
    filename?: string;
    title?: string;
    subtitle?: string;
    styling?: ExportStyling;
    metadata?: Record<string, string>;
    columns?: ExportColumn[];
    includeTimestamp?: boolean;
}

export interface ExportResult {
    blob: Blob;
    filename: string;
    mimeType: string;
}

// ==================== CSV Export ====================

export function exportToCSV(
    data: Record<string, any>[],
    columns: ExportColumn[],
    options: ExportOptions = {}
): ExportResult {
    const header = columns.map(c => c.label).join(";");

    const rows = data.map(item => {
        return columns.map(col => {
            const value = getNestedValue(item, col.key);
            const formatted = col.format ? col.format(value) : value;
            return escapeCsvValue(formatted);
        }).join(";");
    });

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" }); // BOM for Excel

    return {
        blob,
        filename: `${options.filename || "export"}.csv`,
        mimeType: "text/csv"
    };
}

// ==================== JSON Export ====================

export function exportToJSON(
    data: any,
    options: ExportOptions = {}
): ExportResult {
    const exportData = {
        exportedAt: new Date().toISOString(),
        ...(options.metadata && { metadata: options.metadata }),
        data
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });

    return {
        blob,
        filename: `${options.filename || "export"}.json`,
        mimeType: "application/json"
    };
}

// ==================== XLSX Export ====================

export async function exportToXLSX(
    data: Record<string, any>[],
    columns: ExportColumn[],
    options: ExportOptions = {}
): Promise<ExportResult> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = options.styling?.companyName || "AIFAIS";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(options.title || "Data");

    // Add title if provided
    if (options.title) {
        const titleRow = sheet.addRow([options.title]);
        titleRow.font = { bold: true, size: 16 };
        titleRow.height = 24;
        sheet.mergeCells(1, 1, 1, columns.length);
        sheet.addRow([]);
    }

    // Add subtitle/metadata
    if (options.subtitle) {
        const subtitleRow = sheet.addRow([options.subtitle]);
        subtitleRow.font = { italic: true, size: 11, color: { argb: "666666" } };
        sheet.mergeCells(sheet.rowCount, 1, sheet.rowCount, columns.length);
    }

    if (options.metadata) {
        Object.entries(options.metadata).forEach(([key, value]) => {
            const row = sheet.addRow([key, value]);
            row.font = { size: 10 };
        });
        sheet.addRow([]);
    }

    // Headers
    const headerRow = sheet.addRow(columns.map(c => c.label));
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1e40af" }
    };
    headerRow.height = 20;

    // Set column widths
    columns.forEach((col, index) => {
        const column = sheet.getColumn(index + 1);
        column.width = col.width || 15;
    });

    // Data rows
    data.forEach((item, rowIndex) => {
        const rowData = columns.map(col => {
            const value = getNestedValue(item, col.key);
            return col.format ? col.format(value) : value;
        });
        const row = sheet.addRow(rowData);

        // Alternate row colors
        if (rowIndex % 2 === 0) {
            row.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "f8fafc" }
            };
        }
    });

    // Add borders to all data cells
    const startRow = options.title ? 4 : 1;
    for (let i = startRow; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin", color: { argb: "e2e8f0" } },
                left: { style: "thin", color: { argb: "e2e8f0" } },
                bottom: { style: "thin", color: { argb: "e2e8f0" } },
                right: { style: "thin", color: { argb: "e2e8f0" } }
            };
        });
    }

    // Add timestamp footer
    if (options.includeTimestamp !== false) {
        sheet.addRow([]);
        const timestampRow = sheet.addRow([`Geexporteerd: ${new Date().toLocaleString("nl-NL")}`]);
        timestampRow.font = { size: 9, italic: true, color: { argb: "999999" } };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    return {
        blob,
        filename: `${options.filename || "export"}.xlsx`,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };
}

// ==================== DOCX Export ====================

export async function exportToDOCX(
    content: DocumentContent,
    options: ExportOptions = {}
): Promise<ExportResult> {
    const children: any[] = [];

    // Title
    if (options.title) {
        children.push(
            new Paragraph({
                text: options.title,
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 200 }
            })
        );
    }

    // Subtitle
    if (options.subtitle) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: options.subtitle,
                        italics: true,
                        color: "666666"
                    })
                ],
                spacing: { after: 400 }
            })
        );
    }

    // Metadata
    if (options.metadata) {
        Object.entries(options.metadata).forEach(([key, value]) => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `${key}: `, bold: true }),
                        new TextRun({ text: value })
                    ],
                    spacing: { after: 100 }
                })
            );
        });
        children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
    }

    // Content sections
    content.sections.forEach(section => {
        if (section.heading) {
            children.push(
                new Paragraph({
                    text: section.heading,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                })
            );
        }

        if (section.paragraphs) {
            section.paragraphs.forEach(p => {
                children.push(
                    new Paragraph({
                        text: p,
                        spacing: { after: 150 }
                    })
                );
            });
        }

        if (section.bullets) {
            section.bullets.forEach(bullet => {
                children.push(
                    new Paragraph({
                        text: bullet,
                        bullet: { level: 0 },
                        spacing: { after: 80 }
                    })
                );
            });
        }

        if (section.table) {
            const tableRows = [
                // Header row
                new TableRow({
                    tableHeader: true,
                    children: section.table.headers.map(header =>
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({ text: header, bold: true, color: "FFFFFF" })],
                                alignment: AlignmentType.CENTER
                            })],
                            shading: { fill: "1e40af" }
                        })
                    )
                }),
                // Data rows
                ...section.table.rows.map(row =>
                    new TableRow({
                        children: row.map(cell =>
                            new TableCell({
                                children: [new Paragraph({ text: String(cell || "") })]
                            })
                        )
                    })
                )
            ];

            children.push(
                new Table({
                    rows: tableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE }
                })
            );
            children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        }
    });

    // Timestamp footer
    if (options.includeTimestamp !== false) {
        children.push(new Paragraph({ text: "", spacing: { before: 400 } }));
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Gegenereerd: ${new Date().toLocaleString("nl-NL")}`,
                        size: 18,
                        italics: true,
                        color: "999999"
                    })
                ]
            })
        );
    }

    const doc = new Document({
        creator: options.styling?.companyName || "AIFAIS",
        title: options.title,
        sections: [{
            children
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

    return {
        blob,
        filename: `${options.filename || "export"}.docx`,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };
}

// ==================== PDF Report Export ====================

export async function exportToPDFReport(
    content: DocumentContent,
    options: ExportOptions = {}
): Promise<ExportResult> {
    const pdf = await PDFGenerator.create();

    // Logo
    if (options.styling?.logo) {
        await pdf.drawLogo(options.styling.logo);
        pdf.y -= 20;
    }

    // Title
    if (options.title) {
        pdf.drawText(options.title, { size: 18, bold: true });
        pdf.y -= 5;
    }

    // Subtitle
    if (options.subtitle) {
        pdf.drawText(options.subtitle, { size: 11, color: pdf.config.mutedColor });
        pdf.y -= 10;
    }

    // Metadata
    if (options.metadata) {
        Object.entries(options.metadata).forEach(([key, value]) => {
            pdf.drawText(`${key}: ${value}`, { size: 10 });
        });
        pdf.y -= 15;
    }

    pdf.drawHorizontalLine();

    // Content sections
    for (const section of content.sections) {
        if (section.heading) {
            pdf.y -= 10;
            pdf.drawText(section.heading, { size: 14, bold: true });
            pdf.y -= 5;
        }

        if (section.paragraphs) {
            section.paragraphs.forEach(p => {
                pdf.drawText(p, { size: 10 });
            });
        }

        if (section.bullets) {
            section.bullets.forEach(bullet => {
                pdf.drawText(`• ${bullet}`, { size: 10, x: pdf.config.margin + 10 });
            });
        }

        if (section.table) {
            const colWidths = section.table.columnWidths ||
                section.table.headers.map(() => Math.floor(495 / section.table!.headers.length));
            pdf.drawTable(
                section.table.headers,
                section.table.rows.map(row => row.map(cell => String(cell || ""))),
                colWidths
            );
        }

        pdf.y -= 10;
    }

    // Timestamp footer
    if (options.includeTimestamp !== false) {
        pdf.y -= 20;
        pdf.drawText(`Gegenereerd: ${new Date().toLocaleString("nl-NL")}`, {
            size: 9,
            color: pdf.config.mutedColor
        });
    }

    const pdfBytes = await pdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    return {
        blob,
        filename: `${options.filename || "export"}.pdf`,
        mimeType: "application/pdf"
    };
}

// ==================== Document Content Types ====================

export interface DocumentContent {
    sections: DocumentSection[];
}

export interface DocumentSection {
    heading?: string;
    paragraphs?: string[];
    bullets?: string[];
    table?: {
        headers: string[];
        rows: (string | number | null)[][];
        columnWidths?: number[];
    };
}

// ==================== Unified Export Function ====================

export async function exportData(
    format: ExportFormat,
    data: any,
    options: ExportOptions = {}
): Promise<ExportResult> {
    switch (format) {
        case "csv":
            if (!options.columns) throw new Error("Columns required for CSV export");
            return exportToCSV(data as Record<string, any>[], options.columns, options);

        case "json":
            return exportToJSON(data, options);

        case "xlsx":
            if (!options.columns) throw new Error("Columns required for XLSX export");
            return exportToXLSX(data as Record<string, any>[], options.columns, options);

        case "docx":
            return exportToDOCX(data as DocumentContent, options);

        case "pdf":
            return exportToPDFReport(data as DocumentContent, options);

        default:
            throw new Error(`Unsupported export format: ${format}`);
    }
}

// ==================== Download Helper ====================

export function downloadExport(result: ExportResult): void {
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ==================== Utility Functions ====================

function escapeCsvValue(value: any): string {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(";") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
}

// ==================== Pre-built Column Definitions ====================

export const INVOICE_COLUMNS: ExportColumn[] = [
    { key: "supplier.name", label: "Leverancier", width: 25 },
    { key: "supplier.kvk_number", label: "KvK", width: 15 },
    { key: "supplier.vat_id", label: "BTW Nummer", width: 18 },
    { key: "supplier.iban", label: "IBAN", width: 25 },
    { key: "invoice.number", label: "Factuurnummer", width: 15 },
    { key: "invoice.date", label: "Factuurdatum", width: 12 },
    { key: "invoice.due_date", label: "Vervaldatum", width: 12 },
    { key: "totals.subtotal", label: "Bedrag Excl", width: 12, format: (v) => v?.toFixed?.(2) || "" },
    { key: "totals.vat_percentage", label: "BTW %", width: 8, format: (v) => v ? `${v}%` : "" },
    { key: "totals.vat_amount", label: "BTW Bedrag", width: 12, format: (v) => v?.toFixed?.(2) || "" },
    { key: "totals.total_amount", label: "Totaal", width: 12, format: (v) => v?.toFixed?.(2) || "" },
    { key: "totals.currency", label: "Valuta", width: 8 }
];

export const CV_COLUMNS: ExportColumn[] = [
    { key: "filename", label: "Bestand", width: 25 },
    { key: "score", label: "Score", width: 10 },
    { key: "summary", label: "Samenvatting", width: 40 },
    { key: "recommendation", label: "Aanbeveling", width: 30 },
    { key: "experienceYears", label: "Ervaring (jaren)", width: 15 }
];

export const LEAD_COLUMNS: ExportColumn[] = [
    { key: "companyName", label: "Bedrijf", width: 25 },
    { key: "industry", label: "Industrie", width: 20 },
    { key: "score", label: "Score", width: 10 },
    { key: "tier", label: "Tier", width: 10 },
    { key: "factors.companyFit", label: "Company Fit", width: 12 },
    { key: "factors.engagement", label: "Engagement", width: 12 },
    { key: "factors.timing", label: "Timing", width: 10 },
    { key: "factors.budget", label: "Budget", width: 10 },
    { key: "nextAction", label: "Volgende Actie", width: 30 }
];

export const INTERVIEW_COLUMNS: ExportColumn[] = [
    { key: "category", label: "Categorie", width: 15 },
    { key: "question", label: "Vraag", width: 50 },
    { key: "difficulty", label: "Niveau", width: 12 },
    { key: "rubric", label: "Beoordelingscriteria", width: 40 }
];
