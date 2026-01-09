import { createToolHandler } from "@/lib/tools/createToolHandler";
import { swotGeneratorSchema } from "@/lib/security/schemas";
import { buildSwotGeneratorPrompt, SWOT_GENERATOR_PROMPT } from "@/lib/ai/prompts";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export const POST = createToolHandler({
    schema: swotGeneratorSchema,
    pricing: {
        price: 0.001,
        currency: "SOL",
    },
    handler: async (data) => {
        const startTime = Date.now();

        const prompt = buildSwotGeneratorPrompt({
            companyName: data.companyName,
            description: data.description,
            industry: data.industry,
            companySize: data.companySize,
            currentChallenges: data.currentChallenges,
            goals: data.goals,
            marketContext: data.marketContext,
            includeRecommendations: data.includeRecommendations,
        });

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: SWOT_GENERATOR_PROMPT.maxTokens,
            temperature: SWOT_GENERATOR_PROMPT.temperature,
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
            companyName: data.companyName,
            industry: data.industry,
            generatedAt: new Date().toISOString(),
            processingTime,
            totalStrengths: result.strengths?.length || 0,
            totalWeaknesses: result.weaknesses?.length || 0,
            totalOpportunities: result.opportunities?.length || 0,
            totalThreats: result.threats?.length || 0,
        };
    },
});
