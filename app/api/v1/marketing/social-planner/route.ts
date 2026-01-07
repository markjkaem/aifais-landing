import { createToolHandler } from "@/lib/tools/createToolHandler";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";
import { socialPlannerSchema } from "@/lib/security/schemas";
import { SOCIAL_PLANNER_PROMPT, buildSocialPlannerPrompt } from "@/lib/ai/prompts";
import { withRetryAndTimeout, extractJSON } from "@/lib/ai/retry";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({ apiKey: apiKey || "dummy-key" });

// Platform-specific character limits
const PLATFORM_LIMITS: Record<string, number> = {
    linkedin: 3000,
    instagram: 2200,
    facebook: 63206,
    twitter: 280,
    tiktok: 2200
};

const tool = getToolBySlug("social-planner");

export const POST = createToolHandler({
    schema: socialPlannerSchema,
    pricing: tool?.pricing.type === "paid" ? {
        price: tool.pricing.price!,
        currency: tool.pricing.currency!
    } : undefined,
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    handler: async (body, context) => {
        const startTime = Date.now();

        if (context.payment.method === 'dev_bypass') {
            return {
                posts: [
                    {
                        platform: "linkedin",
                        content: "De toekomst van werk is nu. AI-automatisering helpt MKB-bedrijven om slimmer te werken, niet harder. In onze laatste casestudy laten we zien hoe een bedrijf van 50 medewerkers 20 uur per week bespaart door processen te automatiseren.\n\nWat zou jij doen met 20 extra uren?",
                        hashtags: ["#AI", "#Automatisering", "#MKB", "#DigitaleTransformatie", "#Innovatie"],
                        bestTime: "Dinsdag 10:00",
                        characterCount: 298,
                        characterLimit: 3000,
                        imageSuggestion: "Infographic met statistieken over tijdsbesparing door AI",
                        variant: null
                    },
                    {
                        platform: "linkedin",
                        content: "\"We dachten dat AI iets was voor grote bedrijven. Dat bleek een misvatting.\"\n\nOnze klant bespaart nu wekelijks uren op administratieve taken. De investering was terugverdiend in 3 maanden.\n\nBenieuwd wat AI voor jouw bedrijf kan betekenen?",
                        hashtags: ["#AIvoorMKB", "#Efficiency", "#BusinessGrowth", "#TechForGood"],
                        bestTime: "Donderdag 14:00",
                        characterCount: 287,
                        characterLimit: 3000,
                        imageSuggestion: "Testimonial quote card met foto van klant",
                        variant: "A/B"
                    },
                    {
                        platform: "instagram",
                        content: "Swipe om te zien hoe AI jouw bedrijf kan transformeren\n\n1. Identificeer repetitieve taken\n2. Kies de juiste AI-tools\n3. Train je team\n4. Automatiseer en optimaliseer\n5. Geniet van de resultaten\n\nWil je meer weten? Link in bio!",
                        hashtags: ["#aiautomation", "#smallbusiness", "#entrepreneur", "#techsavvy", "#worksmarter", "#businesstips"],
                        bestTime: "Woensdag 19:00",
                        characterCount: 283,
                        characterLimit: 2200,
                        imageSuggestion: "Carousel met 5 slides: stap-voor-stap proces visualisatie",
                        variant: null
                    },
                    {
                        platform: "twitter",
                        content: "AI-automatisering is geen luxe meer, het is noodzaak.\n\n20 uur/week besparen? Check onze nieuwste case study.",
                        hashtags: ["#AI", "#Automation", "#MKB"],
                        bestTime: "Maandag 12:00",
                        characterCount: 128,
                        characterLimit: 280,
                        imageSuggestion: "Korte animatie of GIF met key statistiek",
                        variant: null
                    },
                    {
                        platform: "facebook",
                        content: "Wist je dat veel MKB-bedrijven nog steeds uren kwijt zijn aan taken die in minuten geautomatiseerd kunnen worden?\n\nWij hebben een klant geholpen om van 40 naar 20 uur per week aan administratie te gaan. Het resultaat? Meer tijd voor klanten, minder stress, en een gezondere werk-prive balans.\n\nLees het hele verhaal en ontdek hoe AI jouw bedrijf kan helpen groeien.",
                        hashtags: ["#AIoplossingen", "#MKBgroei", "#Slimmerwerken"],
                        bestTime: "Vrijdag 11:00",
                        characterCount: 421,
                        characterLimit: 63206,
                        imageSuggestion: "Before/after vergelijking: handmatig vs geautomatiseerd proces",
                        variant: null
                    }
                ],
                contentCalendar: [
                    { day: "Maandag", time: "12:00", platform: "twitter", postIndex: 3 },
                    { day: "Dinsdag", time: "10:00", platform: "linkedin", postIndex: 0 },
                    { day: "Woensdag", time: "19:00", platform: "instagram", postIndex: 2 },
                    { day: "Donderdag", time: "14:00", platform: "linkedin", postIndex: 1 },
                    { day: "Vrijdag", time: "11:00", platform: "facebook", postIndex: 4 }
                ],
                topic: body.topic,
                tone: body.tone,
                totalPosts: 5,
                generatedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                confidence: 92,
                version: SOCIAL_PLANNER_PROMPT.version
            };
        }

        const { topic, platforms, postCount, tone, includeHashtags, targetAudience, generateVariants } = body;

        // Build the prompt
        const prompt = buildSocialPlannerPrompt({
            topic,
            platforms,
            postCount,
            tone,
            includeHashtags,
            targetAudience,
            generateVariants: generateVariants ?? false
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
                    console.log(`Social Planner retry ${attempt}:`, error.message);
                }
            }
        );

        try {
            const parsed = extractJSON<{
                posts: Array<{
                    platform: string;
                    content: string;
                    hashtags?: string[];
                    bestTime?: string;
                    imageSuggestion?: string;
                    variant?: string | null;
                }>;
                contentCalendar?: Array<{
                    day: string;
                    time: string;
                    platform: string;
                    postIndex: number;
                }>;
            }>(response);

            // Add character counts to each post
            const postsWithCounts = parsed.posts.map(post => ({
                ...post,
                characterCount: post.content.length,
                characterLimit: PLATFORM_LIMITS[post.platform] || 2000
            }));

            return {
                posts: postsWithCounts,
                contentCalendar: parsed.contentCalendar || [],
                topic,
                tone,
                totalPosts: postsWithCounts.length,
                generatedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                confidence: 88,
                version: SOCIAL_PLANNER_PROMPT.version
            };
        } catch (e) {
            console.error("Social Planner Parsing Error:", e, response);
            throw new Error("Kon de social media planning niet genereren. Probeer het opnieuw.");
        }
    }
});
