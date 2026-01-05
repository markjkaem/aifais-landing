import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

const schema = z.object({
    companyName: z.string().min(1),
    industry: z.string().min(1),
    companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
    budget: z.enum(["unknown", "low", "medium", "high"]).default("unknown"),
    engagement: z.object({
        websiteVisits: z.number().optional(),
        emailOpens: z.number().optional(),
        demoRequested: z.boolean().optional(),
        downloadedContent: z.boolean().optional(),
    }).optional(),
    notes: z.string().optional(),
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

const tool = getToolBySlug("lead-scorer");

export const POST = createToolHandler({
    schema,
    pricing: tool?.pricing.type === "paid" ? {
        price: tool.pricing.price!,
        currency: tool.pricing.currency!
    } : undefined,
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    handler: async (body, context) => {
        if (context.payment.method === 'dev_bypass') {
            return {
                score: 78,
                tier: "warm",
                companyName: body.companyName,
                factors: {
                    companyFit: 85,
                    engagement: 70,
                    timing: 80,
                    budget: 75
                },
                recommendations: [
                    "Stuur een gepersonaliseerde case study",
                    "Plan een demo binnen 5 dagen",
                    "Focus op ROI in je pitch"
                ],
                nextAction: "Demo scheduling call",
                analyzedAt: new Date().toISOString()
            };
        }

        const { companyName, industry, companySize, budget, engagement, notes } = body;

        const message = await anthropic.messages.create({
            model: "claude-4-sonnet-20250514",
            max_tokens: 2000,
            messages: [{
                role: "user",
                content: `Score deze lead:

BEDRIJF: ${companyName}
INDUSTRIE: ${industry}
GROOTTE: ${companySize} medewerkers
BUDGET: ${budget}
ENGAGEMENT: ${JSON.stringify(engagement || {})}
NOTITIES: ${notes || "Geen"}

Geef JSON score:
{
  "score": 0-100,
  "tier": "cold|warm|hot",
  "factors": {
    "companyFit": 0-100,
    "engagement": 0-100,
    "timing": 0-100,
    "budget": 0-100
  },
  "recommendations": ["..."],
  "nextAction": "..."
}`
            }]
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "";

        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Geen geldige JSON gevonden in AI respons");

            const parsed = JSON.parse(jsonMatch[0]);
            return { ...parsed, companyName, analyzedAt: new Date().toISOString() };
        } catch (e) {
            console.error("Lead Scorer Parsing Error:", e, responseText);
            throw new Error("Kon de lead score niet berekenen. Probeer het opnieuw.");
        }
    }
});
