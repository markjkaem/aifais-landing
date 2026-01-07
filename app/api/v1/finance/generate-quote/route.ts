import { NextResponse } from "next/server";
import { z } from "zod";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { PDFGenerator } from "@/lib/pdf/generator";
import { rgb } from "pdf-lib";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const quoteSchema = z.object({
    companyName: z.string().min(1),
    companyAddress: z.string().nullable().optional(),
    companyKvk: z.string().nullable().optional(),
    companyVat: z.string().nullable().optional(),
    companyLogo: z.string().nullable().optional(), // Base64 string
    clientName: z.string().min(1),
    clientAddress: z.string().nullable().optional(),
    projectTitle: z.string().min(1),
    projectDescription: z.string().nullable().optional(),
    items: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        price: z.number(),
    })),
    validUntil: z.number().optional().default(30),
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

export const POST = createToolHandler({
    schema: quoteSchema,
    // pricing: { price: 0, currency: "SOL" }, // Adjust pricing if needed
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    handler: async (body) => {
        const gen = await PDFGenerator.create();
        const { width, height } = gen.page.getSize();

        const quoteNumber = `OFF-${Date.now()}`;
        const quoteDate = new Date().toLocaleDateString("nl-NL");
        const validUntilDate = new Date(Date.now() + body.validUntil * 24 * 60 * 60 * 1000).toLocaleDateString("nl-NL");

        // Logo
        if (body.companyLogo) {
            await gen.drawLogo(body.companyLogo);
        }

        // Header
        gen.y = height - 80;
        gen.drawText("OFFERTE", { x: width - 200, size: 28, bold: true, color: gen.config.primaryColor });
        gen.drawText(`Offertenummer: ${quoteNumber}`, { x: width - 200, size: 10, color: gen.config.mutedColor });
        gen.drawText(`Datum: ${quoteDate}`, { x: width - 200, size: 10, color: gen.config.mutedColor });

        // Info
        gen.y = height - 150;
        gen.drawText(body.companyName, { bold: true, size: 12 });
        if (body.companyAddress) gen.drawText(body.companyAddress, { color: gen.config.mutedColor });
        if (body.companyKvk) gen.drawText(`KvK: ${body.companyKvk}`, { color: gen.config.mutedColor });

        gen.y = height - 150;
        gen.drawText("Offerte voor:", { x: 350, size: 10, color: gen.config.mutedColor });
        gen.drawText(body.clientName, { x: 350, size: 12, bold: true });
        if (body.clientAddress) gen.drawText(body.clientAddress, { x: 350, color: gen.config.mutedColor });

        // Project
        gen.y = height - 280;
        gen.drawText(body.projectTitle, { size: 16, bold: true, color: gen.config.primaryColor });
        if (body.projectDescription) gen.drawText(body.projectDescription, { color: gen.config.mutedColor });

        // Table
        gen.y -= 20;
        const tableData = body.items.map((item: any) => [
            item.description,
            item.quantity.toString(),
            `€ ${item.price.toFixed(2)}`,
            `€ ${(item.quantity * item.price).toFixed(2)}`
        ]);
        gen.drawTable(["Omschrijving", "Aantal", "Prijs", "Totaal"], tableData, [300, 70, 70, 70]);

        // Totals
        const subtotal = body.items.reduce((acc: number, item: any) => acc + (item.quantity * item.price), 0);
        const vat = subtotal * 0.21;
        gen.y -= 10;
        gen.drawMetadata([
            { label: "Subtotaal:", value: `€ ${subtotal.toFixed(2)}` },
            { label: "BTW (21%):", value: `€ ${vat.toFixed(2)}` },
            { label: "Totaal:", value: `€ ${(subtotal + vat).toFixed(2)}` }
        ]);

        // Footer
        gen.y = 50;
        gen.drawText(`Deze offerte is geldig tot ${validUntilDate}. Prijzen zijn exclusief BTW.`, {
            size: 9,
            align: 'center',
            color: gen.config.mutedColor,
            skipPageBreak: true
        });

        const pdfBytes = await gen.save();
        return {
            pdfBase64: Buffer.from(pdfBytes).toString("base64"),
        };
    }
});
