import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

const schema = z.object({
    url: z.string().url(),
    focusKeywords: z.array(z.string()).optional(),
    competitorUrls: z.array(z.string().url()).optional(),
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

const tool = getToolBySlug("seo-audit");

export const POST = createToolHandler({
    schema,
    pricing: tool?.pricing.type === "paid" ? {
        price: tool.pricing.price!,
        currency: tool.pricing.currency!
    } : undefined,
    rateLimit: { maxRequests: 10, windowMs: 60000 },
    handler: async (body, context) => {
        if (context.payment.method === 'dev_bypass') {
            return {
                overallScore: 72,
                url: body.url,
                categories: {
                    technical: { score: 80, issues: ["Ontbrekende alt-teksten", "Trage laadtijd"] },
                    content: { score: 65, issues: ["Meta description te kort", "Dunne content op homepage"] },
                    onPage: { score: 75, issues: ["H1 tag niet optimaal", "Interne linking kan beter"] },
                    offPage: { score: 68, issues: ["Weinig backlinks", "Geen social signals"] }
                },
                recommendations: [
                    { priority: "high", action: "Voeg unieke meta descriptions toe aan alle paginas", impact: "Meer clicks vanuit Google" },
                    { priority: "medium", action: "Optimaliseer afbeeldingen voor snellere laadtijd", impact: "Betere Core Web Vitals" },
                ],
                analyzedAt: new Date().toISOString()
            };
        }

        const { url, focusKeywords } = body;

        const message = await anthropic.messages.create({
            model: "claude-4-sonnet-20250514",
            max_tokens: 3000,
            messages: [{
                role: "user",
                content: `Voer een SEO audit uit voor: ${url}
${focusKeywords ? `Focus keywords: ${focusKeywords.join(", ")}` : ""}

Analyseer en geef JSON output:
{
  "overallScore": 0-100,
  "categories": {
    "technical": { "score": 0-100, "issues": [...] },
    "content": { "score": 0-100, "issues": [...] },
    "onPage": { "score": 0-100, "issues": [...] },
    "offPage": { "score": 0-100, "issues": [...] }
  },
  "recommendations": [
    { "priority": "high|medium|low", "action": "...", "impact": "..." }
  ]
}`
            }]
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "";

        try {
            const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            return { ...parsed, url, analyzedAt: new Date().toISOString() };
        } catch {
            return { overallScore: 0, url, error: "Kon audit niet uitvoeren" };
        }
    }
});
