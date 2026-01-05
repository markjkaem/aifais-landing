import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

const schema = z.object({
    topic: z.string().min(1),
    platforms: z.array(z.enum(["linkedin", "instagram", "facebook", "twitter", "tiktok"])),
    postCount: z.number().min(1).max(10).default(5),
    tone: z.enum(["professional", "casual", "inspirational", "educational"]).default("professional"),
    includeHashtags: z.boolean().default(true),
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

const tool = getToolBySlug("social-planner");

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
                posts: [
                    { platform: "linkedin", content: "🚀 AI transformeert de manier waarop we werken...", hashtags: ["#AI", "#Innovation"], bestTime: "Dinsdag 10:00" },
                    { platform: "instagram", content: "De toekomst is nu! ✨", hashtags: ["#tech", "#future"], bestTime: "Woensdag 19:00" },
                ],
                topic: body.topic,
                generatedAt: new Date().toISOString()
            };
        }

        const { topic, platforms, postCount, tone, includeHashtags } = body;

        const message = await anthropic.messages.create({
            model: "claude-4-sonnet-20250514",
            max_tokens: 3000,
            messages: [{
                role: "user",
                content: `Maak ${postCount} social media posts over: "${topic}"

PLATFORMS: ${platforms.join(", ")}
TONE: ${tone}
HASHTAGS: ${includeHashtags ? "Ja, voeg relevante hashtags toe" : "Nee"}

Geef JSON output:
{
  "posts": [
    { "platform": "...", "content": "...", "hashtags": [...], "bestTime": "dag en tijd" }
  ]
}`
            }]
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "";

        try {
            const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            return { ...parsed, topic, generatedAt: new Date().toISOString() };
        } catch {
            return { posts: [], topic, error: "Kon posts niet genereren" };
        }
    }
});
