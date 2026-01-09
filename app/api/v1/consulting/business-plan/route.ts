import { createToolHandler } from "@/lib/tools/createToolHandler";
import { businessPlanSchema } from "@/lib/security/schemas";
import { buildBusinessPlanPrompt, BUSINESS_PLAN_PROMPT } from "@/lib/ai/prompts";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export const POST = createToolHandler({
    schema: businessPlanSchema,
    pricing: {
        price: 0.001,
        currency: "SOL",
    },
    handler: async (data) => {
        const startTime = Date.now();

        const prompt = buildBusinessPlanPrompt({
            companyName: data.companyName,
            businessIdea: data.businessIdea,
            targetMarket: data.targetMarket,
            productService: data.productService,
            revenueModel: data.revenueModel,
            fundingNeeded: data.fundingNeeded,
            industry: data.industry,
            teamSize: data.teamSize,
            stage: data.stage,
            planType: data.planType,
        });

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: BUSINESS_PLAN_PROMPT.maxTokens,
            temperature: BUSINESS_PLAN_PROMPT.temperature,
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
            planType: data.planType,
            stage: data.stage,
            generatedAt: new Date().toISOString(),
            processingTime,
        };
    },
});
