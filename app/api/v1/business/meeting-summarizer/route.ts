import { createToolHandler } from "@/lib/tools/createToolHandler";
import { meetingSummarizerSchema } from "@/lib/security/schemas";
import { buildMeetingSummarizerPrompt, MEETING_SUMMARIZER_PROMPT } from "@/lib/ai/prompts";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export const POST = createToolHandler({
    schema: meetingSummarizerSchema,
    pricing: {
        price: 0.001,
        currency: "SOL",
    },
    handler: async (data) => {
        const startTime = Date.now();

        const prompt = buildMeetingSummarizerPrompt({
            meetingNotes: data.meetingNotes,
            meetingType: data.meetingType,
            participants: data.participants,
            extractActionItems: data.extractActionItems,
            extractDecisions: data.extractDecisions,
            generateFollowUpEmail: data.generateFollowUpEmail,
            language: data.language,
        });

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: MEETING_SUMMARIZER_PROMPT.maxTokens,
            temperature: MEETING_SUMMARIZER_PROMPT.temperature,
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
            meetingType: data.meetingType,
            language: data.language,
            generatedAt: new Date().toISOString(),
            processingTime,
            totalActionItems: result.actionItems?.length || 0,
            totalDecisions: result.decisions?.length || 0,
        };
    },
});
