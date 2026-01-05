import { NextResponse } from "next/server";
import { z } from "zod";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { PDFGenerator } from "@/lib/pdf/generator";
import { rgb } from "pdf-lib";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const invoiceItemSchema = z.object({
    id: z.string().optional(),
    description: z.string(),
    quantity: z.number(),
    price: z.number(),
    vatRate: z.number(),
});

const invoiceSchema = z.object({
    ownName: z.string(),
    ownAddress: z.string(),
    ownKvk: z.string().optional(),
    ownIban: z.string().optional(),
    ownLogo: z.string().nullable().optional(),
    clientName: z.string(),
    clientAddress: z.string(),
    invoiceNumber: z.string(),
    invoiceDate: z.string(),
    expiryDate: z.string(),
    discountPercentage: z.number().default(0),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema),
});

export const POST = createToolHandler({
    schema: invoiceSchema,
    pricing: { price: 0, currency: "SOL" },
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    handler: async (body) => {
        const gen = await PDFGenerator.create({ primaryColor: rgb(0.06, 0.73, 0.50) });
        const { width, height } = gen.page.getSize();

        if (body.ownLogo) await gen.drawLogo(body.ownLogo);

        // Header
        gen.y = height - 70;
        gen.drawText("FACTUUR", { x: width - 200, size: 28, bold: true, color: gen.config.primaryColor });
        gen.drawMetadata([
            { label: "Factuurnr:", value: body.invoiceNumber },
            { label: "Datum:", value: body.invoiceDate },
            { label: "Vervaldatum:", value: body.expiryDate }
        ], width - 200);

        // Addresses
        gen.y = height - 180;
        const addressY = gen.y;
        gen.drawText(body.ownName, { bold: true, size: 12 });
        gen.drawText(body.ownAddress, { size: 10 });
        if (body.ownKvk) gen.drawText(`KvK: ${body.ownKvk}`, { color: gen.config.mutedColor });
        if (body.ownIban) gen.drawText(`IBAN: ${body.ownIban}`, { color: gen.config.mutedColor });

        gen.y = addressY;
        gen.drawText("Factureren aan:", { x: 350, size: 10, bold: true, color: gen.config.mutedColor });
        gen.drawText(body.clientName, { x: 350, size: 12, bold: true });
        gen.drawText(body.clientAddress, { x: 350, size: 10 });

        // Table
        gen.y -= 50;
        const tableData = body.items.map((item: any) => [
            item.description,
            item.quantity.toString(),
            `€ ${item.price.toFixed(2)}`,
            `${item.vatRate}%`,
            `€ ${(item.quantity * item.price).toFixed(2)}`
        ]);
        gen.drawTable(["Omschrijving", "Aantal", "Prijs", "BTW", "Totaal"], tableData, [250, 50, 70, 50, 70]);

        // Totals calculation
        let subtotal = 0;
        let totalVat = 0;
        body.items.forEach((item: any) => {
            const lineTotal = item.quantity * item.price;
            subtotal += lineTotal;
            const discountFactor = 1 - (body.discountPercentage / 100);
            totalVat += (lineTotal * discountFactor) * (item.vatRate / 100);
        });
        const discountAmount = subtotal * (body.discountPercentage / 100);

        gen.y -= 10;
        const totalItems = [
            { label: "Subtotaal:", value: `€ ${subtotal.toFixed(2)}` }
        ];
        if (body.discountPercentage > 0) {
            totalItems.push({ label: `Korting (${body.discountPercentage}%):`, value: `- € ${discountAmount.toFixed(2)}` });
        }
        totalItems.push({ label: "BTW:", value: `€ ${totalVat.toFixed(2)}` });
        totalItems.push({ label: "TOTAAL:", value: `€ ${(subtotal - discountAmount + totalVat).toFixed(2)}` });

        gen.drawMetadata(totalItems);

        if (body.notes) {
            gen.y = 80;
            gen.drawText(body.notes, { size: 9, color: gen.config.mutedColor });
        }

        const pdfBytes = await gen.save();
        return {
            pdfBase64: Buffer.from(pdfBytes).toString("base64"),
        };
    }
});
