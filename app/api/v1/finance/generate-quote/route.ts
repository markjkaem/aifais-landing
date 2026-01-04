import { NextRequest, NextResponse } from "next/server";
import { withApiGuard } from "@/lib/security/api-guard";
import { z } from "zod";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const quoteSchema = z.object({
    companyName: z.string().min(1),
    companyAddress: z.string().optional(),
    companyKvk: z.string().optional(),
    companyVat: z.string().optional(),
    clientName: z.string().min(1),
    clientAddress: z.string().optional(),
    projectTitle: z.string().min(1),
    projectDescription: z.string().optional(),
    items: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        price: z.number(),
    })),
    validUntil: z.number().optional().default(30),
});

export const POST = withApiGuard(async (req, body: any) => {
    console.log("--- API START: /api/v1/finance/generate-quote ---");

    try {
        const pdfBytes = await generateQuotePDF(body);

        return NextResponse.json({
            success: true,
            data: {
                pdfBase64: Buffer.from(pdfBytes).toString("base64"),
            },
        });
    } catch (error: any) {
        console.error("Quote generation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}, {
    schema: quoteSchema,
    rateLimit: { maxRequests: 20, windowMs: 60000 },
});

async function generateQuotePDF(data: any): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const quoteNumber = `OFF-${Date.now()}`;
    const quoteDate = new Date().toLocaleDateString("nl-NL");
    const validUntilDate = new Date(Date.now() + data.validUntil * 24 * 60 * 60 * 1000).toLocaleDateString("nl-NL");

    let y = height - 80;

    // Header - OFFERTE
    page.drawText("OFFERTE", {
        x: width - 200,
        y,
        size: 28,
        font: fontBold,
        color: rgb(0.12, 0.25, 0.69), // #1e40af
    });
    y -= 20;

    page.drawText(`Offertenummer: ${quoteNumber}`, {
        x: width - 200,
        y,
        size: 10,
        font,
        color: rgb(0.39, 0.44, 0.55), // #64748b
    });
    y -= 15;

    page.drawText(`Datum: ${quoteDate}`, {
        x: width - 200,
        y,
        size: 10,
        font,
        color: rgb(0.39, 0.44, 0.55),
    });

    // Company Info (Left)
    y = height - 150;
    page.drawText(data.companyName, {
        x: 50,
        y,
        size: 12,
        font: fontBold,
        color: rgb(0.06, 0.09, 0.16), // #0f172a
    });
    y -= 15;

    if (data.companyAddress) {
        page.drawText(data.companyAddress, {
            x: 50,
            y,
            size: 10,
            font,
            color: rgb(0.39, 0.44, 0.55),
        });
        y -= 15;
    }

    if (data.companyKvk) {
        page.drawText(`KvK: ${data.companyKvk}`, {
            x: 50,
            y,
            size: 10,
            font,
            color: rgb(0.39, 0.44, 0.55),
        });
        y -= 15;
    }

    if (data.companyVat) {
        page.drawText(`BTW: ${data.companyVat}`, {
            x: 50,
            y,
            size: 10,
            font,
            color: rgb(0.39, 0.44, 0.55),
        });
    }

    // Client Info (Right)
    y = height - 150;
    page.drawText("Offerte voor:", {
        x: 350,
        y,
        size: 10,
        font,
        color: rgb(0.39, 0.44, 0.55),
    });
    y -= 15;

    page.drawText(data.clientName, {
        x: 350,
        y,
        size: 12,
        font: fontBold,
        color: rgb(0.06, 0.09, 0.16),
    });
    y -= 15;

    if (data.clientAddress) {
        page.drawText(data.clientAddress, {
            x: 350,
            y,
            size: 10,
            font,
            color: rgb(0.39, 0.44, 0.55),
        });
    }

    // Project Title
    y = height - 280;
    page.drawText(data.projectTitle, {
        x: 50,
        y,
        size: 16,
        font: fontBold,
        color: rgb(0.12, 0.25, 0.69),
    });
    y -= 25;

    if (data.projectDescription) {
        const maxWidth = 500;
        const words = data.projectDescription.split(' ');
        let line = '';

        for (const word of words) {
            const testLine = line + word + ' ';
            const testWidth = font.widthOfTextAtSize(testLine, 10);

            if (testWidth > maxWidth && line.length > 0) {
                page.drawText(line, {
                    x: 50,
                    y,
                    size: 10,
                    font,
                    color: rgb(0.39, 0.44, 0.55),
                });
                line = word + ' ';
                y -= 15;
            } else {
                line = testLine;
            }
        }

        if (line.length > 0) {
            page.drawText(line, {
                x: 50,
                y,
                size: 10,
                font,
                color: rgb(0.39, 0.44, 0.55),
            });
            y -= 25;
        }
    }

    // Table Header
    y -= 10;
    page.drawText("Omschrijving", {
        x: 50,
        y,
        size: 10,
        font: fontBold,
    });
    page.drawText("Aantal", {
        x: 350,
        y,
        size: 10,
        font: fontBold,
    });
    page.drawText("Prijs", {
        x: 420,
        y,
        size: 10,
        font: fontBold,
    });
    page.drawText("Totaal", {
        x: 490,
        y,
        size: 10,
        font: fontBold,
    });
    y -= 5;

    // Line under header
    page.drawLine({
        start: { x: 50, y },
        end: { x: 550, y },
        thickness: 1,
        color: rgb(0.89, 0.91, 0.94), // #e2e8f0
    });
    y -= 20;

    // Items
    let subtotal = 0;
    for (const item of data.items) {
        const itemTotal = item.quantity * item.price;
        subtotal += itemTotal;

        page.drawText(item.description.substring(0, 40), {
            x: 50,
            y,
            size: 10,
            font,
        });
        page.drawText(item.quantity.toString(), {
            x: 370,
            y,
            size: 10,
            font,
        });
        page.drawText(`€ ${item.price.toFixed(2)}`, {
            x: 420,
            y,
            size: 10,
            font,
        });
        page.drawText(`€ ${itemTotal.toFixed(2)}`, {
            x: 490,
            y,
            size: 10,
            font,
        });
        y -= 20;
    }

    // Totals
    y -= 10;
    page.drawLine({
        start: { x: 50, y },
        end: { x: 550, y },
        thickness: 1,
        color: rgb(0.89, 0.91, 0.94),
    });
    y -= 20;

    page.drawText("Subtotaal:", {
        x: 400,
        y,
        size: 10,
        font,
    });
    page.drawText(`€ ${subtotal.toFixed(2)}`, {
        x: 490,
        y,
        size: 10,
        font,
    });
    y -= 20;

    const vat = subtotal * 0.21;
    page.drawText("BTW (21%):", {
        x: 400,
        y,
        size: 10,
        font,
    });
    page.drawText(`€ ${vat.toFixed(2)}`, {
        x: 490,
        y,
        size: 10,
        font,
    });
    y -= 20;

    page.drawText("Totaal:", {
        x: 400,
        y,
        size: 12,
        font: fontBold,
    });
    page.drawText(`€ ${(subtotal + vat).toFixed(2)}`, {
        x: 490,
        y,
        size: 12,
        font: fontBold,
    });

    // Footer
    const footerText = `Deze offerte is geldig tot ${validUntilDate}. Prijzen zijn exclusief BTW tenzij anders vermeld.`;
    const footerWidth = font.widthOfTextAtSize(footerText, 9);
    page.drawText(footerText, {
        x: (width - footerWidth) / 2,
        y: 50,
        size: 9,
        font,
        color: rgb(0.39, 0.44, 0.55),
    });

    return await pdfDoc.save();
}
