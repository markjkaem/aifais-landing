import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { withApiGuard } from "@/lib/security/api-guard";
import { checkContractSchema } from "@/lib/security/schemas";
import { gatekeepPayment } from "@/lib/payment-gatekeeper";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

if (!apiKey) {
    console.warn("⚠️ API Key warning: ANTHROPIC_API_KEY and CLAUDE_API_KEY are missing.");
}

const anthropic = new Anthropic({
    apiKey: apiKey || "dummy-key",
});

export const POST = withApiGuard(async (req, body: any) => {
    console.log("--- API START: /api/v1/legal/check-contract ---");

    try {
        // Payment verification
        const payment = await gatekeepPayment(body, 0.001);

        if (!payment.success) {
            return NextResponse.json(
                { error: payment.error, ...payment.details },
                // @ts-ignore
                { status: payment.status }
            );
        }

        console.log(`Payment authorized via ${payment.method}. Starting contract analysis...`);

        // DEV_BYPASS: Return mock analysis without calling Claude
        if (payment.method === 'dev_bypass') {
            console.log("⚠️ DEV_BYPASS detected: Returning mock contract analysis");
            const mockAnalysis = {
                summary: "Dit is een gesimuleerde analyse voor testdoeleinden.",
                risks: ["Dit is een testrisico", "Automatische verlenging zonder notificatie"],
                unclear_clauses: ["Artikel 3.2 is vaag gedefinieerd"],
                suggestions: ["Voeg een opzegtermijn toe", "Specificeer de aansprakelijkheid"],
                overall_score: 8
            };
            const pdfBuffer = await generatePDFReport(mockAnalysis);
            return NextResponse.json({
                success: true,
                data: {
                    summary: mockAnalysis.summary,
                    risks: mockAnalysis.risks,
                    score: mockAnalysis.overall_score,
                    pdfBase64: pdfBuffer.toString("base64"),
                },
            });
        }

        const { contractBase64, mimeType } = body;

        // Analyze contract with Claude
        const message = await anthropic.messages.create({
            model: "claude-4-sonnet-20250514",
            max_tokens: 4096,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "document",
                            source: {
                                type: "base64",
                                media_type: mimeType as any,
                                data: contractBase64,
                            },
                            cache_control: { type: "ephemeral" },
                        },
                        {
                            type: "text",
                            text: `Je bent een ervaren juridisch adviseur. Analyseer dit contract grondig en identificeer:

1. **Belangrijkste risico's** (onbeperkte aansprakelijkheid, automatische verlenging, concurrentiebeding, etc.)
2. **Onduidelijke clausules** die tot geschillen kunnen leiden
3. **Ontbrekende bescherming** voor de ondertekenaar
4. **Suggesties** voor betere formuleringen

Geef je antwoord in JSON formaat:
{
  "summary": "Korte samenvatting (2-3 zinnen)",
  "risks": ["risico 1", "risico 2", ...],
  "unclear_clauses": ["clausule 1", ...],
  "suggestions": ["suggestie 1", ...],
  "overall_score": 1-10 (10 = zeer gunstig contract)
}`,
                        },
                    ],
                },
            ],
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "";
        let analysis;

        try {
            // Clean up markdown code blocks if present
            const cleanJson = responseText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            analysis = JSON.parse(cleanJson);
        } catch {
            // Fallback if Claude doesn't return valid JSON
            analysis = {
                summary: responseText.substring(0, 500),
                risks: ["Kon analyse niet parseren"],
                unclear_clauses: [],
                suggestions: [],
                overall_score: 5,
            };
        }

        // Generate PDF report
        const pdfBuffer = await generatePDFReport(analysis);

        return NextResponse.json({
            success: true,
            data: {
                summary: analysis.summary,
                risks: analysis.risks,
                score: analysis.overall_score,
                pdfBase64: pdfBuffer.toString("base64"),
            },
        });
    } catch (error: any) {
        console.error("Contract check error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}, {
    schema: checkContractSchema,
    rateLimit: { maxRequests: 5, windowMs: 60000 },
});

async function generatePDFReport(analysis: any): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Helper to clean text for WinAnsi encoding (Helvetica)
    const cleanText = (text: string) => {
        return text
            .replace(/[^\x00-\x7F\xA0-\xFF]/g, "") // Remove non-Latin-1 chars
            .replace(/\n/g, " ") // Remove newlines within lines
            .trim();
    };

    let y = height - 80;

    // Header
    page.drawText("Contract Analyse Rapport", {
        x: (width - fontBold.widthOfTextAtSize("Contract Analyse Rapport", 24)) / 2,
        y,
        size: 24,
        font: fontBold,
        color: rgb(0.06, 0.09, 0.16),
    });
    y -= 30;

    const dateText = `Gegenereerd: ${new Date().toLocaleDateString("nl-NL")}`;
    page.drawText(dateText, {
        x: (width - font.widthOfTextAtSize(dateText, 10)) / 2,
        y,
        size: 10,
        font,
        color: rgb(0.39, 0.44, 0.55),
    });
    y -= 40;

    // Overall Score
    const scoreText = `Overall Score: ${analysis.overall_score}/10`;
    page.drawText(scoreText, {
        x: 50,
        y,
        size: 14,
        font: fontBold,
    });
    y -= 25;

    // Summary
    page.drawText("Samenvatting", {
        x: 50,
        y,
        size: 12,
        font: fontBold,
    });
    y -= 20;

    const summaryText = cleanText(analysis.summary || "Geen samenvatting beschikbaar.");
    const summaryLines = wrapText(summaryText, 495, font, 10);
    for (const line of summaryLines) {
        page.drawText(line, {
            x: 50,
            y,
            size: 10,
            font,
        });
        y -= 15;
    }
    y -= 10;

    // Risks
    if (analysis.risks && analysis.risks.length > 0) {
        page.drawText("Geïdentificeerde Risico's", {
            x: 50,
            y,
            size: 12,
            font: fontBold,
        });
        y -= 20;

        for (let i = 0; i < analysis.risks.length; i++) {
            const riskLines = wrapText(cleanText(`${i + 1}. ${analysis.risks[i]}`), 475, font, 10);
            for (const line of riskLines) {
                page.drawText(line, {
                    x: 70,
                    y,
                    size: 10,
                    font,
                });
                y -= 15;
            }
        }
        y -= 10;
    }

    // Unclear Clauses
    if (analysis.unclear_clauses && analysis.unclear_clauses.length > 0) {
        page.drawText("Onduidelijke Clausules", {
            x: 50,
            y,
            size: 12,
            font: fontBold,
        });
        y -= 20;

        for (let i = 0; i < analysis.unclear_clauses.length; i++) {
            const clauseLines = wrapText(cleanText(`${i + 1}. ${analysis.unclear_clauses[i]}`), 475, font, 10);
            for (const line of clauseLines) {
                page.drawText(line, {
                    x: 70,
                    y,
                    size: 10,
                    font,
                });
                y -= 15;
            }
        }
        y -= 10;
    }

    // Suggestions
    if (analysis.suggestions && analysis.suggestions.length > 0) {
        page.drawText("Aanbevelingen", {
            x: 50,
            y,
            size: 12,
            font: fontBold,
        });
        y -= 20;

        for (let i = 0; i < analysis.suggestions.length; i++) {
            const suggestionLines = wrapText(cleanText(`${i + 1}. ${analysis.suggestions[i]}`), 475, font, 10);
            for (const line of suggestionLines) {
                page.drawText(line, {
                    x: 70,
                    y,
                    size: 10,
                    font,
                });
                y -= 15;
            }
        }
    }

    // Footer
    const disclaimerText = "Disclaimer: Dit rapport is gegenereerd door AI en dient alleen als eerste indicatie. Raadpleeg altijd een juridisch adviseur voor definitief advies.";
    const disclaimerLines = wrapText(cleanText(disclaimerText), 495, font, 8);
    let footerY = 60;
    for (const line of disclaimerLines) {
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

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
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

