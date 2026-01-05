import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

const schema = z.object({
    cvBase64: z.string().min(1),
    mimeType: z.string(), // Be more flexible with mime types
    jobDescription: z.string().min(20), // Enforce meaningful description
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

export const POST = createToolHandler({
    schema,
    pricing: getToolBySlug("cv-screener")?.pricing.type === "paid" ? {
        price: getToolBySlug("cv-screener")!.pricing.price!,
        currency: getToolBySlug("cv-screener")!.pricing.currency!
    } : undefined,
    rateLimit: { maxRequests: 10, windowMs: 60000 },
    handler: async (body, context) => {
        // DEV_BYPASS logic
        if (context.payment.method === 'dev_bypass') {
            return {
                score: 85,
                summary: "Sterke kandidaat met relevante ervaring in de gevraagde sector.",
                strengths: ["5+ jaar ervaring", "Relevante technische skills", "Goede opleiding"],
                weaknesses: ["Geen management ervaring", "Beperkte internationale ervaring"],
                recommendation: "Uitnodigen voor gesprek",
                keySkillsMatch: ["Python", "React", "AWS"],
                experienceYears: 5
            };
        }

        const { cvBase64, mimeType, jobDescription } = body;

        const message = await anthropic.messages.create({
            model: "claude-4-sonnet-20250514",
            max_tokens: 2048,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "document",
                        source: { type: "base64", media_type: mimeType as any, data: cvBase64 },
                    },
                    {
                        type: "text",
                        text: `Analyseer dit CV tegen deze vacature en geef JSON output:

VACATURE:
${jobDescription}

Geef je analyse in dit format:
{
  "score": 0-100,
  "summary": "korte samenvatting",
  "strengths": ["sterke punten"],
  "weaknesses": ["verbeterpunten"],
  "recommendation": "advies",
  "keySkillsMatch": ["gematchte skills"],
  "experienceYears": number
}`
                    }
                ]
            }]
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "";

        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Geen geldige JSON gevonden in AI respons");
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.error("CV Screener Parsing Error:", e, responseText);
            throw new Error("Kon de CV analyse niet verwerken. Probeer het opnieuw.");
        }
    }
});
