import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

const schema = z.object({
    jobTitle: z.string().min(1),
    jobDescription: z.string().min(10),
    experienceLevel: z.enum(["junior", "medior", "senior"]),
    questionCount: z.number().min(3).max(15).default(8),
    includeCategories: z.array(z.string()).optional(),
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

const tool = getToolBySlug("interview-questions");

export const POST = createToolHandler({
    schema,
    pricing: tool?.pricing.type === "paid" ? {
        price: tool.pricing.price!,
        currency: tool.pricing.currency!
    } : undefined,
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    handler: async (body, context) => {
        // DEV_BYPASS logic
        if (context.payment.method === 'dev_bypass') {
            return {
                questions: [
                    { category: "Technisch", question: "Kun je uitleggen hoe je een REST API zou ontwerpen?", difficulty: "medior" },
                    { category: "Gedrag", question: "Vertel over een moment dat je een deadline moest halen onder druk.", difficulty: "algemeen" },
                    { category: "Situatie", question: "Hoe zou je omgaan met een conflicterende collega?", difficulty: "algemeen" },
                ],
                jobTitle: body.jobTitle,
                generatedAt: new Date().toISOString()
            };
        }

        const { jobTitle, jobDescription, experienceLevel, questionCount } = body;

        const message = await anthropic.messages.create({
            model: "claude-4-sonnet-20250514",
            max_tokens: 2048,
            messages: [{
                role: "user",
                content: `Genereer ${questionCount} sollicitatievragen voor deze functie:

FUNCTIE: ${jobTitle}
NIVEAU: ${experienceLevel}
BESCHRIJVING: ${jobDescription}

Geef output als JSON array:
{
  "questions": [
    { "category": "Technisch|Gedrag|Situatie|Motivatie", "question": "...", "difficulty": "junior|medior|senior" }
  ]
}`
            }]
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "";

        try {
            const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            return {
                ...parsed,
                jobTitle,
                generatedAt: new Date().toISOString()
            };
        } catch {
            return {
                questions: [{ category: "Algemeen", question: responseText.substring(0, 500), difficulty: experienceLevel }],
                jobTitle,
                generatedAt: new Date().toISOString()
            };
        }
    }
});
