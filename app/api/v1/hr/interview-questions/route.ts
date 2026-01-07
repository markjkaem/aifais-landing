import { createToolHandler } from "@/lib/tools/createToolHandler";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";
import { interviewQuestionsSchema } from "@/lib/security/schemas";
import { INTERVIEW_QUESTIONS_PROMPT, buildInterviewQuestionsPrompt } from "@/lib/ai/prompts";
import { withRetryAndTimeout, extractJSON } from "@/lib/ai/retry";
import { z } from "zod";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

// Response schema for validation
const questionSchema = z.object({
    category: z.enum(["Technisch", "Gedrag", "Situatie", "Motivatie", "Cultuur"]),
    question: z.string(),
    difficulty: z.enum(["junior", "medior", "senior"]),
    rubric: z.object({
        poor: z.string(),
        average: z.string(),
        excellent: z.string(),
    }).optional(),
    followUps: z.array(z.string()).optional(),
    timeAllocation: z.number().optional(),
    purpose: z.string().optional(),
});

const responseSchema = z.object({
    questions: z.array(questionSchema),
    interviewGuide: z.object({
        introduction: z.string(),
        duration: z.number(),
        tips: z.array(z.string()),
    }).optional(),
});

const tool = getToolBySlug("interview-questions");

export const POST = createToolHandler({
    schema: interviewQuestionsSchema,
    pricing: tool?.pricing.type === "paid" ? {
        price: tool.pricing.price!,
        currency: tool.pricing.currency!
    } : undefined,
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    handler: async (body, context) => {
        const startTime = Date.now();

        // DEV_BYPASS logic with enhanced response
        if (context.payment.method === 'dev_bypass') {
            return {
                questions: [
                    {
                        category: "Technisch",
                        question: "Kun je uitleggen hoe je een REST API zou ontwerpen voor een e-commerce platform?",
                        difficulty: "medior",
                        rubric: {
                            poor: "Kandidaat kan geen duidelijke uitleg geven over API design principes",
                            average: "Kandidaat begrijpt basis REST concepten maar mist diepgang",
                            excellent: "Kandidaat legt gedetailleerd endpoints, authentication, versioning en error handling uit"
                        },
                        followUps: [
                            "Hoe zou je omgaan met API versioning?",
                            "Welke authenticatiemethode zou je kiezen en waarom?"
                        ],
                        timeAllocation: 8,
                        purpose: "Beoordeelt technische kennis en architectuurvaardigheden"
                    },
                    {
                        category: "Gedrag",
                        question: "Vertel over een moment dat je een deadline moest halen onder hoge druk.",
                        difficulty: "algemeen",
                        rubric: {
                            poor: "Geeft geen concreet voorbeeld of toont slechte stressmanagement",
                            average: "Beschrijft situatie maar weinig inzicht in eigen aanpak",
                            excellent: "STAR-methode, toont probleemoplossend vermogen en positieve uitkomst"
                        },
                        followUps: [
                            "Wat zou je achteraf anders doen?",
                            "Hoe communiceerde je met stakeholders tijdens dit proces?"
                        ],
                        timeAllocation: 6,
                        purpose: "Beoordeelt stressbestendigheid en timemanagement"
                    },
                    {
                        category: "Situatie",
                        question: "Hoe zou je omgaan met een collega die herhaaldelijk deadlines mist en jouw werk beïnvloedt?",
                        difficulty: "medior",
                        rubric: {
                            poor: "Vermijdt conflict of geeft passieve respons",
                            average: "Zou manager inschakelen zonder eerst zelf te proberen",
                            excellent: "Empathisch gesprek, zoekt oorzaak, stelt constructieve oplossing voor"
                        },
                        followUps: [
                            "Wanneer zou je dit escaleren naar management?",
                            "Hoe zou je dit documenteren?"
                        ],
                        timeAllocation: 5,
                        purpose: "Beoordeelt interpersoonlijke vaardigheden en conflictresolutie"
                    },
                    {
                        category: "Motivatie",
                        question: "Wat trekt je aan in deze specifieke functie en ons bedrijf?",
                        difficulty: "algemeen",
                        rubric: {
                            poor: "Generieke antwoorden zonder specifieke kennis van bedrijf",
                            average: "Enige research gedaan maar oppervlakkig",
                            excellent: "Diepgaande kennis van bedrijf, linkt eigen carrièredoelen aan functie"
                        },
                        followUps: [
                            "Waar zie je jezelf over 3 jaar binnen ons bedrijf?",
                            "Welk aspect van de functie lijkt je het meest uitdagend?"
                        ],
                        timeAllocation: 4,
                        purpose: "Beoordeelt motivatie en cultural fit"
                    },
                    {
                        category: "Cultuur",
                        question: "Hoe definieer jij een goede werkcultuur en wat draag je daaraan bij?",
                        difficulty: "algemeen",
                        rubric: {
                            poor: "Focust alleen op wat bedrijf moet bieden, niet eigen bijdrage",
                            average: "Beschrijft voorkeuren maar weinig concrete voorbeelden",
                            excellent: "Concrete voorbeelden van positieve cultuurimpact, toont zelfkennis"
                        },
                        followUps: [
                            "Hoe ga je om met een cultuur die anders is dan je gewend bent?",
                            "Welke waarden zijn voor jou niet onderhandelbaar?"
                        ],
                        timeAllocation: 5,
                        purpose: "Beoordeelt cultural fit en teamdynamiek"
                    }
                ],
                interviewGuide: {
                    introduction: `Dit is een interviewgids voor de functie ${body.jobTitle} op ${body.experienceLevel} niveau.`,
                    duration: 45,
                    tips: [
                        "Begin met een korte introductie van jezelf en het bedrijf",
                        "Geef de kandidaat ruimte om vragen te stellen",
                        "Noteer antwoorden voor objectieve beoordeling",
                        "Gebruik de rubrics om consistent te scoren"
                    ]
                },
                jobTitle: body.jobTitle,
                experienceLevel: body.experienceLevel,
                totalQuestions: 5,
                estimatedDuration: 45,
                generatedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                confidence: 95,
                version: INTERVIEW_QUESTIONS_PROMPT.version
            };
        }

        const {
            jobTitle,
            jobDescription,
            experienceLevel,
            questionCount,
            includeCategories,
            includeRubrics,
            includeFollowUps
        } = body;

        // Build the prompt
        const prompt = buildInterviewQuestionsPrompt({
            jobTitle,
            jobDescription,
            experienceLevel,
            questionCount,
            includeCategories: includeCategories || ["Technisch", "Gedrag", "Situatie", "Motivatie", "Cultuur"],
            includeRubrics: includeRubrics ?? true,
            includeFollowUps: includeFollowUps ?? true
        });

        // Call AI with retry logic
        const response = await withRetryAndTimeout(
            async () => {
                const message = await anthropic.messages.create({
                    model: "claude-4-sonnet-20250514",
                    max_tokens: 4096,
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
                    console.log(`Interview Questions retry ${attempt}:`, error.message);
                }
            }
        );

        try {
            const parsed = extractJSON<z.infer<typeof responseSchema>>(response);

            // Calculate estimated duration based on time allocations
            const estimatedDuration = parsed.questions.reduce(
                (sum, q) => sum + (q.timeAllocation || 5),
                10 // Base time for intro/outro
            );

            return {
                ...parsed,
                jobTitle,
                experienceLevel,
                totalQuestions: parsed.questions.length,
                estimatedDuration,
                generatedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                confidence: 90,
                version: INTERVIEW_QUESTIONS_PROMPT.version
            };
        } catch (e) {
            console.error("Interview Questions Parsing Error:", e, response);
            throw new Error("Kon de sollicitatievragen niet genereren. Probeer het opnieuw.");
        }
    }
});
