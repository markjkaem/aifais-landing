import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { checkContractSchema } from "@/lib/security/schemas";
import { PDFGenerator } from "@/lib/pdf/generator";
import { rgb } from "pdf-lib";
import { CONTRACT_CHECKER_PROMPT, buildContractCheckerPrompt } from "@/lib/ai/prompts";
import { withRetryAndTimeout, extractJSON } from "@/lib/ai/retry";
import fs from "fs";
import path from "path";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({
    apiKey: apiKey || "dummy-key",
});

export const POST = createToolHandler({
    schema: checkContractSchema,
    pricing: { price: 0.001, currency: "SOL" },
    rateLimit: { maxRequests: 5, windowMs: 60000 },
    handler: async (body, context) => {
        const startTime = Date.now();
        console.log(`Payment authorized via ${context.payment.method}. Starting contract analysis...`);

        // DEV_BYPASS logic
        if (context.payment.method === 'dev_bypass') {
            const mockAnalysis = {
                summary: "Dit contract betreft een standaard dienstverleningsovereenkomst tussen twee partijen. De algemene structuur is degelijk, maar er zijn enkele punten die aandacht vereisen.",
                contractType: "Dienstverleningsovereenkomst",
                parties: ["Opdrachtgever BV", "Dienstverlener VOF"],
                risks: [
                    {
                        severity: "high",
                        description: "Automatische verlenging zonder notificatie",
                        clause: "Artikel 7.1",
                        recommendation: "Voeg een notificatietermijn van minimaal 30 dagen toe"
                    },
                    {
                        severity: "medium",
                        description: "Onduidelijke aansprakelijkheidsbeperking",
                        clause: "Artikel 12.3",
                        recommendation: "Specificeer maximale aansprakelijkheid in concrete bedragen"
                    },
                    {
                        severity: "low",
                        description: "Geen forum-keuze clausule",
                        recommendation: "Voeg bevoegde rechtbank toe voor geschillenbeslechting"
                    }
                ],
                unclear_clauses: [
                    {
                        clause: "Artikel 3.2 - Scope of Work",
                        issue: "De omschrijving van diensten is te algemeen",
                        suggestion: "Voeg een gedetailleerde bijlage toe met specifieke deliverables"
                    },
                    {
                        clause: "Artikel 9.1 - Intellectueel Eigendom",
                        issue: "Onduidelijk wie eigenaar wordt van ontwikkelde materialen",
                        suggestion: "Specificeer eigendom per type deliverable"
                    }
                ],
                missing_protections: [
                    "Geheimhoudingsclausule (NDA)",
                    "Overmacht bepaling",
                    "Verzekeringsvereisten",
                    "Audit rechten"
                ],
                suggestions: [
                    "Voeg een escalatieprocedure toe voor geschillen",
                    "Specificeer betalingstermijnen en late payment penalties",
                    "Neem GDPR/AVG bepalingen op indien persoonsgegevens worden verwerkt",
                    "Overweeg een proefperiode met verkorte opzegtermijn"
                ],
                clauses: [
                    { id: "art-1", title: "Artikel 1 - Definities", content: "Standaard definities", category: "algemeen", riskLevel: "safe" },
                    { id: "art-2", title: "Artikel 2 - Toepasselijkheid", content: "Toepassingsgebied overeenkomst", category: "algemeen", riskLevel: "safe" },
                    { id: "art-3", title: "Artikel 3 - Scope", content: "Beschrijving diensten", category: "diensten", riskLevel: "caution" },
                    { id: "art-7", title: "Artikel 7 - Duur & Beëindiging", content: "Looptijd en opzegging", category: "beeindiging", riskLevel: "risky" },
                    { id: "art-9", title: "Artikel 9 - IE Rechten", content: "Intellectueel eigendom", category: "ip", riskLevel: "caution" },
                    { id: "art-12", title: "Artikel 12 - Aansprakelijkheid", content: "Beperking aansprakelijkheid", category: "aansprakelijkheid", riskLevel: "risky" }
                ],
                overall_score: 6.5,
                confidence: 87,
                jurisdiction: "Nederland"
            };

            const pdfBuffer = await generatePDFReport(mockAnalysis);

            return {
                ...mockAnalysis,
                pdfBase64: pdfBuffer.toString("base64"),
                analyzedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                version: CONTRACT_CHECKER_PROMPT.version
            };
        }

        const { contractBase64, mimeType, contractType } = body;

        // Call AI with retry logic
        const response = await withRetryAndTimeout(
            async () => {
                const message = await anthropic.messages.create({
                    model: "claude-4-sonnet-20250514",
                    max_tokens: 5000,
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
                                    text: buildContractCheckerPrompt({ contractType }),
                                },
                            ],
                        },
                    ],
                });

                const responseText = message.content[0].type === "text" ? message.content[0].text : "";
                return responseText;
            },
            {
                maxRetries: 2,
                timeoutMs: 90000,
                onRetry: (error, attempt) => {
                    console.log(`Contract Checker retry ${attempt}:`, error.message);
                }
            }
        );

        try {
            const analysis = extractJSON<{
                summary: string;
                contractType?: string;
                parties?: string[];
                risks: Array<{ severity: string; description: string; clause?: string; recommendation?: string }>;
                unclear_clauses?: Array<{ clause: string; issue: string; suggestion?: string }>;
                missing_protections?: string[];
                suggestions: string[];
                clauses?: Array<{ id: string; title: string; content: string; category: string; riskLevel: string }>;
                overall_score: number;
                confidence?: number;
                jurisdiction?: string;
            }>(response);

            const pdfBuffer = await generatePDFReport(analysis);

            return {
                ...analysis,
                pdfBase64: pdfBuffer.toString("base64"),
                analyzedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                version: CONTRACT_CHECKER_PROMPT.version
            };
        } catch (e) {
            console.error("Contract Checker Parsing Error:", e, response);
            throw new Error("Kon de contractanalyse niet verwerken. Probeer het opnieuw.");
        }
    }
});

// PDF Generation Utilities
async function generatePDFReport(analysis: any): Promise<Buffer> {
    const gen = await PDFGenerator.create();
    const { width, height } = gen.page.getSize();

    // AIFAIS Logo
    try {
        const logoPath = path.join(process.cwd(), "public", "og-image.jpg");
        if (fs.existsSync(logoPath)) {
            const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
            await gen.drawLogo(logoBase64, 120);
        }
    } catch (e) {
        console.error("Failed to load logo in API", e);
    }

    // Title
    gen.drawText("Contract Analyse Rapport", { size: 24, bold: true, align: 'center' });
    gen.y -= 20;
    gen.drawHorizontalLine();
    gen.y -= 20;

    // Summary Section
    gen.drawSectionHeader(`Score: ${analysis.overall_score}/10`);
    gen.drawText(analysis.summary, { size: 10 });
    gen.y -= 10;

    // Risks Section
    if (analysis.risks && analysis.risks.length > 0) {
        gen.drawSectionHeader("Risico-analyse");
        analysis.risks.forEach((risk: any) => {
            const riskText = typeof risk === 'string' ? risk : `${risk.severity.toUpperCase()}: ${risk.description}`;
            gen.drawText(`• ${riskText}`, { size: 10, x: 60 });
            if (risk.recommendation) {
                gen.drawText(`  Advies: ${risk.recommendation}`, { size: 9, color: gen.config.mutedColor, x: 60 });
            }
        });
        gen.y -= 10;
    }

    // Unclear Clauses
    if (analysis.unclear_clauses && analysis.unclear_clauses.length > 0) {
        gen.drawSectionHeader("Onduidelijke bepalingen");
        analysis.unclear_clauses.forEach((item: any) => {
            gen.drawText(`• ${item.clause}: ${item.issue}`, { size: 10, x: 60 });
        });
        gen.y -= 10;
    }

    // Suggestions
    if (analysis.suggestions && analysis.suggestions.length > 0) {
        gen.drawSectionHeader("Verbetersuggesties");
        analysis.suggestions.forEach((suggestion: string) => {
            gen.drawText(`• ${suggestion}`, { size: 10, x: 60 });
        });
    }

    const pdfBytes = await gen.save();
    return Buffer.from(pdfBytes);
}
