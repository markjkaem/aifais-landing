import { createToolHandler } from "@/lib/tools/createToolHandler";
import { emailGeneratorSchema } from "@/lib/security/schemas";
import { buildEmailGeneratorPrompt, EMAIL_GENERATOR_PROMPT } from "@/lib/ai/prompts";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export const POST = createToolHandler({
    schema: emailGeneratorSchema,
    handler: async (data) => {
        const startTime = Date.now();

        const prompt = buildEmailGeneratorPrompt({
            emailType: data.emailType,
            context: data.context,
            recipientType: data.recipientType,
            tone: data.tone,
            includeCallToAction: data.includeCallToAction,
            senderName: data.senderName,
            companyName: data.companyName,
            language: data.language,
        });

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: EMAIL_GENERATOR_PROMPT.maxTokens,
            temperature: EMAIL_GENERATOR_PROMPT.temperature,
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
            emailType: data.emailType,
            recipientType: data.recipientType,
            tone: data.tone,
            language: data.language,
            generatedAt: new Date().toISOString(),
            processingTime,
        };
    },
});
