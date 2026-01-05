import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";
import { PDFGenerator } from "@/lib/pdf/generator";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

const schema = z.object({
    companyName: z.string().min(1),
    productService: z.string().min(10),
    targetAudience: z.string().min(5),
    problemSolution: z.string().min(10),
    uniqueValue: z.string().min(10),
    askAmount: z.string().optional(),
    slideCount: z.number().min(5).max(15).default(10),
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

const tool = getToolBySlug("pitch-deck");

export const POST = createToolHandler({
    schema,
    pricing: tool?.pricing.type === "paid" ? {
        price: tool.pricing.price!,
        currency: tool.pricing.currency!
    } : undefined,
    rateLimit: { maxRequests: 5, windowMs: 60000 },
    handler: async (body, context) => {
        if (context.payment.method === 'dev_bypass') {
            return {
                slides: [
                    { title: "Introductie", content: "Welkom bij onze pitch" },
                    { title: "Het Probleem", content: "Klanten ervaren..." },
                    { title: "Onze Oplossing", content: "Wij bieden..." },
                    { title: "Contact", content: "Neem contact op" },
                ],
                companyName: body.companyName,
                generatedAt: new Date().toISOString()
            };
        }

        const { companyName, productService, targetAudience, problemSolution, uniqueValue, askAmount, slideCount } = body;

        const message = await anthropic.messages.create({
            model: "claude-4-sonnet-20250514",
            max_tokens: 4000,
            messages: [{
                role: "user",
                content: `Maak een ${slideCount}-slide pitch deck:

BEDRIJF: ${companyName}
PRODUCT/SERVICE: ${productService}
DOELGROEP: ${targetAudience}
PROBLEEM & OPLOSSING: ${problemSolution}
UNIEKE WAARDE: ${uniqueValue}
${askAmount ? `VRAAG: ${askAmount}` : ""}

Geef JSON met slides:
{
  "slides": [
    { "title": "...", "content": "...", "speakerNotes": "..." }
  ]
}`
            }]
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "";

        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Geen geldige JSON gevonden in AI respons");

            const parsed = JSON.parse(jsonMatch[0]);
            return { ...parsed, companyName, generatedAt: new Date().toISOString() };
        } catch (e) {
            console.error("Pitch Deck Parsing Error:", e, responseText);
            throw new Error("Kon het pitch deck niet genereren. Probeer het opnieuw.");
        }
    }
});
