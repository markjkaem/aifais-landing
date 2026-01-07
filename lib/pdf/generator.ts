import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont, RGB } from "pdf-lib";

export interface PDFConfig {
    margin?: number;
    pageSize?: [number, number];
    primaryColor?: RGB;
    secondaryColor?: RGB;
    textColor?: RGB;
    mutedColor?: RGB;
}

const DEFAULT_CONFIG: Required<PDFConfig> = {
    margin: 50,
    pageSize: [595, 842], // A4
    primaryColor: rgb(0.12, 0.25, 0.69), // #1e40af
    secondaryColor: rgb(0.31, 0.4, 0.75), // #4f66bf - slightly lighter blue
    textColor: rgb(0.06, 0.09, 0.16), // #0f172a
    mutedColor: rgb(0.39, 0.44, 0.55), // #64748b
};

export class PDFGenerator {
    doc: PDFDocument;
    page!: PDFPage;
    font!: PDFFont;
    fontBold!: PDFFont;
    config: Required<PDFConfig>;
    y: number;

    private constructor(doc: PDFDocument, config: PDFConfig = {}) {
        this.doc = doc;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.y = this.config.pageSize[1] - this.config.margin;
    }

    static async create(config: PDFConfig = {}) {
        const doc = await PDFDocument.create();
        const instance = new PDFGenerator(doc, config);
        instance.font = await doc.embedFont(StandardFonts.Helvetica);
        instance.fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
        instance.addNewPage();
        return instance;
    }

    addNewPage() {
        this.page = this.doc.addPage(this.config.pageSize);
        this.y = this.config.pageSize[1] - this.config.margin;
        return this.page;
    }

    checkPageBreak(heightNeeded: number) {
        if (this.y - heightNeeded < this.config.margin) {
            this.addNewPage();
        }
    }

    drawSectionHeader(text: string) {
        this.checkPageBreak(40);
        this.y -= 10;

        // Background for header
        this.page.drawRectangle({
            x: this.config.margin - 10,
            y: this.y - 5,
            width: 4,
            height: 20,
            color: this.config.primaryColor,
        });

        this.drawText(text, { size: 14, bold: true, x: this.config.margin });
        this.y -= 5;
    }

    drawStatBox(label: string, value: string, subvalue?: string, x?: number, width = 150) {
        const drawX = x || this.config.margin;
        const height = 70;

        this.page.drawRectangle({
            x: drawX,
            y: this.y - height,
            width,
            height,
            color: rgb(0.97, 0.98, 1),
            borderColor: rgb(0.9, 0.92, 0.96),
            borderWidth: 1,
        });

        const centerX = drawX + (width / 2);

        // Label
        const labelSize = 8;
        this.page.drawText(label.toUpperCase(), {
            x: centerX - (this.font.widthOfTextAtSize(label.toUpperCase(), labelSize) / 2),
            y: this.y - 20,
            size: labelSize,
            font: this.font,
            color: this.config.mutedColor,
        });

        // Value
        const valueSize = 22;
        this.page.drawText(value, {
            x: centerX - (this.fontBold.widthOfTextAtSize(value, valueSize) / 2),
            y: this.y - 48,
            size: valueSize,
            font: this.fontBold,
            color: this.config.primaryColor,
        });

        // Subvalue
        if (subvalue) {
            const subSize = 8;
            this.page.drawText(subvalue, {
                x: centerX - (this.font.widthOfTextAtSize(subvalue, subSize) / 2),
                y: this.y - 62,
                size: subSize,
                font: this.font,
                color: this.config.mutedColor,
            });
        }
    }

    drawText(text: string, options: {
        size?: number;
        bold?: boolean;
        color?: RGB;
        align?: 'left' | 'center' | 'right';
        x?: number;
        maxWidth?: number;
        skipPageBreak?: boolean;
    } = {}) {
        const { size = 10, bold = false, color = this.config.textColor, align = 'left', maxWidth, skipPageBreak = false } = options;
        const font = bold ? this.fontBold : this.font;
        const actualMaxWidth = maxWidth || (this.config.pageSize[0] - (this.config.margin * 2));

        const lines = this.wrapText(text, actualMaxWidth, font, size);

        for (const line of lines) {
            if (!skipPageBreak) {
                this.checkPageBreak(size + 5);
            }

            let x = options.x || this.config.margin;
            if (align === 'center') {
                x = (this.config.pageSize[0] - font.widthOfTextAtSize(line, size)) / 2;
            } else if (align === 'right') {
                x = this.config.pageSize[0] - this.config.margin - font.widthOfTextAtSize(line, size);
            }

            this.page.drawText(line, {
                x,
                y: this.y,
                size,
                font,
                color,
            });
            this.y -= size + 5;
        }
    }

    async drawLogo(base64: string, maxWidth = 100) {
        try {
            const isPng = base64.startsWith("data:image/png") || base64.length > 50 && base64.includes("iVBORw0KGgo");
            // Remove data:image/... base64, if present
            const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");

            let logoImage;
            if (isPng) {
                logoImage = await this.doc.embedPng(cleanBase64);
            } else {
                try {
                    logoImage = await this.doc.embedJpg(cleanBase64);
                } catch (jpgError) {
                    // Fallback to PNG if JPG embedding fails (common when files are mislabeled)
                    logoImage = await this.doc.embedPng(cleanBase64);
                }
            }

            const scaleFactor = Math.min(0.3, maxWidth / logoImage.width);
            const logoWidth = logoImage.width * scaleFactor;
            const logoHeight = logoImage.height * scaleFactor;

            this.page.drawImage(logoImage, {
                x: this.config.margin,
                y: this.y - logoHeight,
                width: logoWidth,
                height: logoHeight,
            });

            this.y -= (logoHeight + 10);
            return logoHeight;
        } catch (e) {
            console.error("PDF Logo embedding failed", e);
            return 0;
        }
    }

    drawMetadata(items: { label: string; value: string }[], xOffset = 350) {
        for (const item of items) {
            this.checkPageBreak(15);
            this.page.drawText(item.label, { x: xOffset, y: this.y, size: 10, font: this.font, color: this.config.mutedColor });
            this.page.drawText(item.value, { x: xOffset + 80, y: this.y, size: 10, font: this.fontBold });
            this.y -= 15;
        }
    }

    drawTable(headers: string[], data: string[][], colWidths: number[]) {
        const headerY = this.y;
        this.page.drawRectangle({
            x: this.config.margin,
            y: this.y - 5,
            width: this.config.pageSize[0] - (this.config.margin * 2),
            height: 25,
            color: this.config.primaryColor,
        });

        let currentX = this.config.margin + 10;
        headers.forEach((header, i) => {
            this.page.drawText(header, {
                x: currentX,
                y: headerY + 5,
                size: 10,
                font: this.fontBold,
                color: rgb(1, 1, 1),
            });
            currentX += colWidths[i];
        });

        this.y -= 25;

        for (const row of data) {
            this.checkPageBreak(25);
            currentX = this.config.margin + 10;
            row.forEach((cell, i) => {
                this.page.drawText(cell, {
                    x: currentX,
                    y: this.y,
                    size: 10,
                    font: this.font,
                });
                currentX += colWidths[i];
            });

            this.page.drawLine({
                start: { x: this.config.margin, y: this.y - 5 },
                end: { x: this.config.pageSize[0] - this.config.margin, y: this.y - 5 },
                thickness: 0.5,
                color: rgb(0.9, 0.9, 0.9),
            });
            this.y -= 25;
        }
    }

    drawHorizontalLine(thickness = 1, color = rgb(0.89, 0.91, 0.94)) {
        this.page.drawLine({
            start: { x: this.config.margin, y: this.y },
            end: { x: this.config.pageSize[0] - this.config.margin, y: this.y },
            thickness,
            color,
        });
        this.y -= 10;
    }

    wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
        // Handle newlines explicitly
        const lines = text.split('\n');
        const wrappedLines: string[] = [];

        for (const line of lines) {
            const cleanLine = line.replace(/[^\x00-\x7F\xA0-\xFF]/g, "").trim();
            if (cleanLine === '') {
                wrappedLines.push('');
                continue;
            }

            const words = cleanLine.split(' ');
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth && currentLine) {
                    wrappedLines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) wrappedLines.push(currentLine);
        }

        return wrappedLines;
    }

    async save() {
        return await this.doc.save();
    }
}
