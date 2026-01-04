import { NextRequest, NextResponse } from "next/server";
import { withApiGuard } from "@/lib/security/api-guard";
import { z } from "zod";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import OpenAI from "openai";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const termsSchema = z.object({
    companyName: z.string().min(1),
    companyType: z.string(),
    industry: z.string().optional(),
    hasPhysicalProducts: z.boolean(),
    hasDigitalProducts: z.boolean(),
    hasServices: z.boolean(),
    acceptsReturns: z.boolean(),
    returnDays: z.number().optional(),
    paymentTerms: z.number(),
    jurisdiction: z.string(),
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export const POST = withApiGuard(async (req, body: any) => {
    console.log("--- API START: /api/v1/legal/generate-terms ---");

    try {
        // Generate terms content with GPT
        const termsContent = await generateTermsContent(body);

        // Create PDF
        const pdfBytes = await generateTermsPDF(body, termsContent);

        return NextResponse.json({
            success: true,
            data: {
                pdfBase64: Buffer.from(pdfBytes).toString("base64"),
            },
        });
    } catch (error: any) {
        console.error("Terms generation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}, {
    schema: termsSchema,
    rateLimit: { maxRequests: 10, windowMs: 60000 },
});

async function generateTermsContent(data: any): Promise<string[]> {
    const productTypes = [];
    if (data.hasPhysicalProducts) productTypes.push("fysieke producten");
    if (data.hasDigitalProducts) productTypes.push("digitale producten");
    if (data.hasServices) productTypes.push("diensten");

    const prompt = `Genereer professionele algemene voorwaarden voor een ${data.companyType} genaamd "${data.companyName}" ${data.industry ? `in de ${data.industry} sector` : ''}.

Het bedrijf biedt aan: ${productTypes.join(", ")}.
${data.acceptsReturns ? `Retourrecht: ${data.returnDays} dagen.` : 'Geen retourrecht.'}
Betaaltermijn: ${data.paymentTerms} dagen.
Rechtsbevoegdheid: ${data.jurisdiction}.

Maak een complete set algemene voorwaarden met de volgende artikelen:
1. Definities
2. Toepasselijkheid
3. Aanbiedingen en offertes
4. Totstandkoming van de overeenkomst
5. Prijzen en betaling
6. Levering en uitvoering
${data.acceptsReturns ? '7. Herroepingsrecht en retourneren\n8. Garantie en aansprakelijkheid' : '7. Garantie en aansprakelijkheid'}
${data.acceptsReturns ? '9. Intellectueel eigendom\n10. Toepasselijk recht' : '8. Intellectueel eigendom\n9. Toepasselijk recht'}

Geef elk artikel als een aparte sectie. Gebruik duidelijke, juridische maar begrijpelijke taal. Zorg dat het compleet en professioneel is.

Formaat: Geef alleen de artikelen terug, elk artikel op een nieuwe regel gescheiden door "---". Begin elk artikel met "Artikel X: [Titel]" gevolgd door de inhoud.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Je bent een juridisch expert gespecialiseerd in Nederlandse algemene voorwaarden. Je schrijft duidelijke, professionele voorwaarden die juridisch correct zijn."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 3000,
    });

    const content = completion.choices[0].message.content || "";
    return content.split("---").map(s => s.trim()).filter(s => s.length > 0);
}

async function generateTermsPDF(data: any, articles: string[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 60;
    const margin = 50;
    const maxWidth = width - (margin * 2);

    // Header
    page.drawText("ALGEMENE VOORWAARDEN", {
        x: (width - fontBold.widthOfTextAtSize("ALGEMENE VOORWAARDEN", 20)) / 2,
        y,
        size: 20,
        font: fontBold,
        color: rgb(0.06, 0.09, 0.16),
    });
    y -= 30;

    page.drawText(data.companyName, {
        x: (width - fontBold.widthOfTextAtSize(data.companyName, 14)) / 2,
        y,
        size: 14,
        font: fontBold,
        color: rgb(0.12, 0.25, 0.69),
    });
    y -= 20;

    const dateText = `Versie: ${new Date().toLocaleDateString("nl-NL")}`;
    page.drawText(dateText, {
        x: (width - font.widthOfTextAtSize(dateText, 10)) / 2,
        y,
        size: 10,
        font,
        color: rgb(0.39, 0.44, 0.55),
    });
    y -= 40;

    // Articles
    for (const article of articles) {
        const lines = article.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Check if we need a new page
            if (y < 80) {
                page = pdfDoc.addPage([595, 842]);
                y = height - 60;
            }

            const isTitle = line.startsWith('Artikel');
            const currentFont = isTitle ? fontBold : font;
            const fontSize = isTitle ? 12 : 10;

            const wrappedLines = wrapText(line, maxWidth, currentFont, fontSize);

            for (const wrappedLine of wrappedLines) {
                if (y < 80) {
                    page = pdfDoc.addPage([595, 842]);
                    y = height - 60;
                }

                page.drawText(wrappedLine, {
                    x: margin,
                    y,
                    size: fontSize,
                    font: currentFont,
                    color: rgb(0.06, 0.09, 0.16),
                });
                y -= fontSize + 5;
            }

            if (isTitle) y -= 5; // Extra space after title
        }

        y -= 15; // Space between articles
    }

    // Footer on last page
    const footerText = `Deze algemene voorwaarden zijn gegenereerd door AIFAIS. Laat ze controleren door een jurist voor specifieke situaties.`;
    const footerLines = wrapText(footerText, maxWidth, font, 8);
    let footerY = 50;

    for (const line of footerLines) {
        const lineWidth = font.widthOfTextAtSize(line, 8);
        page.drawText(line, {
            x: (width - lineWidth) / 2,
            y: footerY,
            size: 8,
            font,
            color: rgb(0.5, 0.5, 0.5),
        });
        footerY -= 12;
    }

    return await pdfDoc.save();
}

function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}
