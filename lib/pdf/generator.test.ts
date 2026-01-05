/** @vitest-environment node */
import { describe, it, expect, vi } from "vitest";
import { PDFGenerator } from "./generator";
import { rgb } from "pdf-lib";

describe("PDFGenerator", () => {
    it("should create a PDF document with default config", async () => {
        const gen = await PDFGenerator.create();
        expect(gen.doc).toBeDefined();
        expect(gen.page).toBeDefined();
        expect(gen.y).toBeGreaterThan(0);
    });

    it("should handle page breaks correctly", async () => {
        const gen = await PDFGenerator.create({ margin: 50 });
        const initialPageCount = gen.doc.getPageCount();

        // Force a page break by setting Y very low
        gen.y = 10;
        gen.checkPageBreak(50);

        expect(gen.doc.getPageCount()).toBe(initialPageCount + 1);
        expect(gen.y).toBe(gen.config.pageSize[1] - gen.config.margin);
    });

    it("should wrap text correctly", async () => {
        const gen = await PDFGenerator.create();
        const longText = "This is a very long text that should definitely be wrapped into multiple lines because it exceeds the maximum width of the page content area.";
        const lines = gen.wrapText(longText, 100, gen.font, 10);

        expect(lines.length).toBeGreaterThan(1);
    });

    it("should draw tables and update Y position", async () => {
        const gen = await PDFGenerator.create();
        const initialY = gen.y;

        const headers = ["A", "B"];
        const data = [["1", "2"], ["3", "4"]];
        const widths = [100, 100];

        gen.drawTable(headers, data, widths);

        expect(gen.y).toBeLessThan(initialY);
    });

    it("should draw metadata and update Y position", async () => {
        const gen = await PDFGenerator.create();
        const initialY = gen.y;

        gen.drawMetadata([
            { label: "Date:", value: "2024-01-01" },
            { label: "Status:", value: "Paid" }
        ]);

        expect(gen.y).toBeLessThan(initialY);
    });
});
