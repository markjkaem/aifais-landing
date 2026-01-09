import { createToolHandler } from "@/lib/tools/createToolHandler";
import { competitorAnalyzerSchema } from "@/lib/security/schemas";
import { buildCompetitorAnalyzerPrompt, COMPETITOR_ANALYZER_PROMPT } from "@/lib/ai/prompts";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export const POST = createToolHandler({
    schema: competitorAnalyzerSchema,
    pricing: {
        price: 0.001,
        currency: "SOL",
    },
    handler: async (data) => {
        const startTime = Date.now();

        const prompt = buildCompetitorAnalyzerPrompt({
            yourCompany: data.yourCompany,
            yourDescription: data.yourDescription,
            competitors: data.competitors,
            industry: data.industry,
            focusAreas: data.focusAreas,
        });

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: COMPETITOR_ANALYZER_PROMPT.maxTokens,
            temperature: COMPETITOR_ANALYZER_PROMPT.temperature,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const textContent = response.content.find((c) => c.type === "text");
        if (!textContent || textContent.type !== "text") {
            throw new Error("No text response from AI");
        }

        let result;
        try {
            const cleanedText = textContent.text
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            result = JSON.parse(cleanedText);
        } catch {
            throw new Error("Failed to parse AI response as JSON");
        }

        const processingTime = Date.now() - startTime;

        return {
            ...result,
            yourCompany: data.yourCompany,
            competitorCount: data.competitors.length,
            industry: data.industry,
            generatedAt: new Date().toISOString(),
            processingTime,
        };
    },
});
