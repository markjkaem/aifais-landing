import { createToolHandler } from "@/lib/tools/createToolHandler";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";
import { pitchDeckSchema } from "@/lib/security/schemas";
import { PITCH_DECK_PROMPT, buildPitchDeckPrompt } from "@/lib/ai/prompts";
import { withRetryAndTimeout, extractJSON } from "@/lib/ai/retry";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

const tool = getToolBySlug("pitch-deck");

export const POST = createToolHandler({
    schema: pitchDeckSchema,
    pricing: tool?.pricing.type === "paid" ? {
        price: tool.pricing.price!,
        currency: tool.pricing.currency!
    } : undefined,
    rateLimit: { maxRequests: 5, windowMs: 60000 },
    handler: async (body, context) => {
        const startTime = Date.now();

        if (context.payment.method === 'dev_bypass') {
            return {
                slides: [
                    {
                        slideNumber: 1,
                        title: "Introductie",
                        type: "title",
                        content: `${body.companyName}\n\nDe toekomst van ${body.productService.substring(0, 50)}`,
                        bulletPoints: [],
                        speakerNotes: "Stel jezelf en het bedrijf kort voor. Maak oogcontact en zorg voor een krachtige opening.",
                        imageSuggestion: "Logo van het bedrijf op een cleane achtergrond"
                    },
                    {
                        slideNumber: 2,
                        title: "Het Probleem",
                        type: "problem",
                        content: "Bedrijven verliezen dagelijks waardevolle tijd aan repetitieve taken die geautomatiseerd kunnen worden.",
                        bulletPoints: [
                            "40% van de werkweek gaat naar administratie",
                            "Menselijke fouten kosten gemiddeld 10.000 per jaar",
                            "Groei wordt belemmerd door capaciteitsproblemen"
                        ],
                        speakerNotes: "Maak het probleem voelbaar. Deel een concreet voorbeeld of statistiek.",
                        imageSuggestion: "Gefrustreerde professional achter bureau met papierwerk"
                    },
                    {
                        slideNumber: 3,
                        title: "Onze Oplossing",
                        type: "solution",
                        content: "Een AI-gedreven platform dat automatisch repetitieve taken overneemt.",
                        bulletPoints: [
                            "Automatische documentverwerking",
                            "Slimme workflow optimalisatie",
                            "Real-time rapportages"
                        ],
                        speakerNotes: "Demonstreer de oplossing visueel als mogelijk. Houd het simpel.",
                        imageSuggestion: "Product screenshot of demo visual"
                    },
                    {
                        slideNumber: 4,
                        title: "Unieke Waarde",
                        type: "value_proposition",
                        content: "Waarom klanten voor ons kiezen",
                        bulletPoints: [
                            "3x snellere implementatie dan concurrenten",
                            "Nederlandse support en GDPR-compliant",
                            "ROI binnen 3 maanden gegarandeerd"
                        ],
                        speakerNotes: "Focus op wat jullie onderscheidt. Noem 1-2 concrete voorbeelden.",
                        imageSuggestion: "Vergelijkingstabel met concurrenten"
                    },
                    {
                        slideNumber: 5,
                        title: "Markt & Potentieel",
                        type: "market",
                        content: "De Nederlandse automatiseringsmarkt groeit met 25% per jaar",
                        bulletPoints: [
                            "TAM: 2.1 miljard",
                            "SAM: 340 miljoen",
                            "SOM: 85 miljoen (eerste 3 jaar)"
                        ],
                        speakerNotes: "Leg uit hoe jullie marktaandeel gaan veroveren.",
                        imageSuggestion: "Marktgroei grafiek"
                    },
                    {
                        slideNumber: 6,
                        title: "Business Model",
                        type: "business_model",
                        content: "SaaS met maandelijkse subscripties",
                        bulletPoints: [
                            "Starter: 99/maand - tot 10 gebruikers",
                            "Professional: 299/maand - tot 50 gebruikers",
                            "Enterprise: custom - onbeperkt"
                        ],
                        speakerNotes: "Leg de pricing logica uit. Waarom deze prijspunten?",
                        imageSuggestion: "Pricing tiers visual"
                    },
                    {
                        slideNumber: 7,
                        title: "Traction & Resultaten",
                        type: "traction",
                        content: "Bewezen resultaten bij early adopters",
                        bulletPoints: [
                            "15 betalende klanten in 6 maanden",
                            "MRR: 12.500",
                            "NPS Score: 72"
                        ],
                        speakerNotes: "Deel specifieke klantresultaten als je ze hebt.",
                        imageSuggestion: "Growth chart met MRR ontwikkeling"
                    },
                    {
                        slideNumber: 8,
                        title: "Het Team",
                        type: "team",
                        content: "Ervaren team met bewezen trackrecord",
                        bulletPoints: [
                            "CEO: 10 jaar ervaring in SaaS",
                            "CTO: Ex-Google engineer",
                            "Sales: 50M+ in vorige rollen"
                        ],
                        speakerNotes: "Benoem relevante ervaring en waarom dit team kan winnen.",
                        imageSuggestion: "Team fotos met namen en rollen"
                    },
                    {
                        slideNumber: 9,
                        title: "Roadmap",
                        type: "roadmap",
                        content: "Waar we naartoe gaan",
                        bulletPoints: [
                            "Q1 2026: API launch voor integraties",
                            "Q2 2026: Duitse markt entry",
                            "Q4 2026: 100 klanten bereiken"
                        ],
                        speakerNotes: "Wees realistisch maar ambitieus. Toon dat je een plan hebt.",
                        imageSuggestion: "Timeline visual met milestones"
                    },
                    {
                        slideNumber: 10,
                        title: "De Ask",
                        type: "ask",
                        content: body.askAmount || "We zoeken een investering om te versnellen",
                        bulletPoints: [
                            "Investering wordt gebruikt voor:",
                            "- 60% Product development",
                            "- 30% Sales & Marketing",
                            "- 10% Operations"
                        ],
                        speakerNotes: "Wees specifiek over wat je vraagt en waarom.",
                        imageSuggestion: "Pie chart met budget allocatie"
                    }
                ],
                companyName: body.companyName,
                totalSlides: 10,
                audienceType: body.audienceType || "investors",
                generatedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                confidence: 88,
                version: PITCH_DECK_PROMPT.version
            };
        }

        const { companyName, productService, targetAudience, problemSolution, uniqueValue, askAmount, slideCount, audienceType, includeFinancials } = body;

        // Build the prompt
        const prompt = buildPitchDeckPrompt({
            companyName,
            productService,
            targetAudience,
            problemSolution,
            uniqueValue,
            askAmount,
            slideCount,
            audienceType: audienceType || "investors",
            includeFinancials: includeFinancials ?? false
        });

        // Call AI with retry logic
        const response = await withRetryAndTimeout(
            async () => {
                const message = await anthropic.messages.create({
                    model: "claude-4-sonnet-20250514",
                    max_tokens: 6000,
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
                timeoutMs: 90000,
                onRetry: (error, attempt) => {
                    console.log(`Pitch Deck retry ${attempt}:`, error.message);
                }
            }
        );

        try {
            const parsed = extractJSON<{
                slides: Array<{
                    slideNumber: number;
                    title: string;
                    type: string;
                    content: string;
                    bulletPoints?: string[];
                    speakerNotes?: string;
                    imageSuggestion?: string;
                }>;
            }>(response);

            return {
                ...parsed,
                companyName,
                totalSlides: parsed.slides.length,
                audienceType: audienceType || "investors",
                generatedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                confidence: 85,
                version: PITCH_DECK_PROMPT.version
            };
        } catch (e) {
            console.error("Pitch Deck Parsing Error:", e, response);
            throw new Error("Kon het pitch deck niet genereren. Probeer het opnieuw.");
        }
    }
});
