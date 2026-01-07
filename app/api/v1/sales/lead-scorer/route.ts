import { createToolHandler } from "@/lib/tools/createToolHandler";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";
import { leadScorerSchema } from "@/lib/security/schemas";
import { LEAD_SCORER_PROMPT, buildLeadScorerPrompt } from "@/lib/ai/prompts";
import { withRetryAndTimeout, extractJSON } from "@/lib/ai/retry";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

const tool = getToolBySlug("lead-scorer");

export const POST = createToolHandler({
    schema: leadScorerSchema,
    pricing: tool?.pricing.type === "paid" ? {
        price: tool.pricing.price!,
        currency: tool.pricing.currency!
    } : undefined,
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    handler: async (body, context) => {
        const startTime = Date.now();

        if (context.payment.method === 'dev_bypass') {
            return {
                score: 78,
                tier: "warm",
                companyName: body.companyName,
                factors: {
                    companyFit: { score: 85, reason: "Goed passend bij doelmarkt (MKB, tech-savvy)" },
                    engagement: { score: 70, reason: "Actieve website bezoeker, geen demo nog" },
                    timing: { score: 80, reason: "Actief zoekend naar oplossingen in dit kwartaal" },
                    budget: { score: 75, reason: "Gemiddeld budget, ruimte voor groei" },
                    decisionPower: { score: 72, reason: "Waarschijnlijk beslisser of beïnvloeder" }
                },
                recommendations: [
                    "Stuur een gepersonaliseerde case study relevant voor hun industrie",
                    "Plan een korte discovery call binnen 5 werkdagen",
                    "Focus op ROI en tijdsbesparing in je pitch",
                    "Bereid referenties voor uit vergelijkbare bedrijven"
                ],
                nextAction: {
                    action: "Demo scheduling call",
                    priority: "high",
                    deadline: "Binnen 5 werkdagen",
                    template: "warm_lead"
                },
                emailTemplates: {
                    initial: {
                        subject: `${body.companyName} x [Jouw Bedrijf] - Even voorstellen`,
                        body: `Beste [Naam],\n\nIk zag dat jullie bij ${body.companyName} actief bezig zijn met [onderwerp]. Wij helpen vergelijkbare bedrijven in de ${body.industry || "sector"} met [oplossing].\n\nZou je volgende week 20 minuten hebben voor een kort gesprek?\n\nMet vriendelijke groet,\n[Jouw Naam]`
                    },
                    followUp: {
                        subject: `Re: Even opvolgen - ${body.companyName}`,
                        body: `Beste [Naam],\n\nIk wilde even opvolgen op mijn vorige bericht. Ik begrijp dat het druk kan zijn.\n\nKort samengevat: we hebben [Bedrijf X] geholpen om [resultaat]. Zou dit interessant kunnen zijn voor ${body.companyName}?\n\nLaat me weten of je tijd hebt voor een korte call.\n\nGroeten,\n[Jouw Naam]`
                    }
                },
                competitorInsights: [
                    "Mogelijk al in gesprek met concurrenten",
                    "Focus op unique selling points",
                    "Benadruk snelle implementatie"
                ],
                idealTiming: {
                    bestDays: ["Dinsdag", "Woensdag", "Donderdag"],
                    bestTimes: ["10:00-11:30", "14:00-16:00"],
                    avoidTimes: ["Maandagochtend", "Vrijdagmiddag"]
                },
                analyzedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                confidence: 85,
                version: LEAD_SCORER_PROMPT.version
            };
        }

        const { companyName, industry, companySize, budget, engagement, notes, generateEmail } = body;

        // Build the prompt
        const prompt = buildLeadScorerPrompt({
            companyName,
            industry,
            companySize,
            budget,
            engagement,
            notes,
            generateEmail: generateEmail ?? true
        });

        // Call AI with retry logic
        const response = await withRetryAndTimeout(
            async () => {
                const message = await anthropic.messages.create({
                    model: "claude-4-sonnet-20250514",
                    max_tokens: 3000,
                    messages: [{
                        role: "user",
                        content: prompt
                    }]
                });

                const responseText = message.content[0].type === "text" ? message.content[0].text : "";
                return responseText;
            },
            {
                maxRetries: 2,
                timeoutMs: 60000,
                onRetry: (error, attempt) => {
                    console.log(`Lead Scorer retry ${attempt}:`, error.message);
                }
            }
        );

        try {
            const parsed = extractJSON<{
                score: number;
                tier: string;
                factors: Record<string, { score: number; reason: string }>;
                recommendations: string[];
                nextAction: {
                    action: string;
                    priority: string;
                    deadline?: string;
                };
                emailTemplates?: {
                    initial?: { subject: string; body: string };
                    followUp?: { subject: string; body: string };
                };
                competitorInsights?: string[];
                idealTiming?: {
                    bestDays: string[];
                    bestTimes: string[];
                };
            }>(response);

            return {
                ...parsed,
                companyName,
                analyzedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                confidence: 82,
                version: LEAD_SCORER_PROMPT.version
            };
        } catch (e) {
            console.error("Lead Scorer Parsing Error:", e, response);
            throw new Error("Kon de lead score niet berekenen. Probeer het opnieuw.");
        }
    }
});
