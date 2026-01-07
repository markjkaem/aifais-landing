/**
 * KVK Bedrijfszoeker API
 *
 * Company Intelligence Tool that combines KVK data with enrichments:
 * - Official KVK Handelsregister data
 * - Website & contact discovery
 * - Social media profiles
 * - Technology stack analysis
 * - News & press coverage
 * - Reviews & reputation
 * - AI-powered business analysis
 *
 * Cost: €0.04-0.06 per full lookup (KVK API costs)
 * Price: 0.001 SOL / €0.50
 */

import { createToolHandler } from "@/lib/tools/createToolHandler";
import { kvkSearchSchema } from "@/lib/security/schemas";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";
import {
    searchKvk,
    getFullCompanyProfile,
    isKvkConfigured,
    getMockSearchResults,
    getMockBasisprofiel,
    formatAddress,
    formatEmployeeCount,
    getMainActivity,
    isValidKvkNummer,
    KvkSearchResult,
    KvkBasisprofiel,
} from "@/lib/external/kvk-client";
import { enrichCompanyData, CompanyEnrichment } from "@/lib/external/enrichment";
import { buildCompanyIntelPrompt, COMPANY_INTEL_PROMPT } from "@/lib/ai/prompts";

const toolMetadata = getToolBySlug("kvk-search");

// Types for response
interface CompanySearchResult {
    kvkNummer: string;
    naam: string;
    adres: string;
    plaats: string;
    type: string;
    actief: boolean;
}

interface CompanyProfile {
    // KVK Data
    kvk: {
        kvkNummer: string;
        rsin: string | null;
        naam: string;
        handelsnamen: string[];
        rechtsvorm: string | null;
        oprichtingsdatum: string | null;
        actief: boolean;
        sbiCodes: Array<{ code: string; omschrijving: string }>;
        aantalMedewerkers: string;
        hoofdactiviteit: string;
    };

    // Address
    adres: {
        straat: string | null;
        huisnummer: string | null;
        postcode: string | null;
        plaats: string | null;
        volledig: string;
        geoLocatie: { lat: number; lng: number } | null;
    };

    // Online Presence
    online: {
        website: string | null;
        email: string | null;
        telefoon: string | null;
        socials: {
            linkedin: string | null;
            twitter: string | null;
            facebook: string | null;
            instagram: string | null;
            youtube: string | null;
        };
    };

    // Tech Stack
    techStack: {
        cms: string[];
        frameworks: string[];
        analytics: string[];
        payments: string[];
        marketing: string[];
        ecommerce: string[];
        hosting: string[];
        other: string[];
        totalDetected: number;
    };

    // Reviews
    reviews: {
        google: { rating: number; count: number; url?: string } | null;
        trustpilot: { rating: number; count: number; url?: string } | null;
        averageRating: number | null;
        totalReviews: number;
    };

    // News
    nieuws: Array<{
        titel: string;
        bron: string;
        datum: string;
        url: string;
    }>;

    // AI Analysis
    aiAnalyse: {
        samenvatting: string;
        branche: string;
        sterkePunten: string[];
        aandachtspunten: string[];
        groeiScore: number;
        digitalScore: number;
        reputatieScore: number;
        overallScore: number;
        aanbevelingen: string[];
        confidence: number;
    } | null;

    // Meta
    meta: {
        timestamp: string;
        bronnen: string[];
        verwerkingstijd: number;
        kvkConfigured: boolean;
        errors: string[];
    };
}

export const POST = createToolHandler({
    schema: kvkSearchSchema,
    pricing: toolMetadata?.pricing.type === "paid" ? {
        price: toolMetadata.pricing.price!,
        currency: "SOL"
    } : undefined,
    rateLimit: { maxRequests: 10, windowMs: 60000 },
    handler: async (input, context) => {
        const startTime = Date.now();
        const errors: string[] = [];
        const bronnen: string[] = [];

        const { query, type, plaats, inclusiefInactief, getFullProfile, enrichments } = input;
        const kvkConfigured = isKvkConfigured();

        // Determine if we should use mock data
        const useMocks = context.payment.method === "dev_bypass" || !kvkConfigured;

        // ========== STEP 1: Search KVK ==========
        let searchResults: KvkSearchResult[] = [];

        try {
            if (useMocks) {
                const mockResponse = getMockSearchResults(query);
                searchResults = mockResponse.resultaten;
                bronnen.push("KVK (mock)");
            } else {
                // Build search params based on type
                const searchParams = type === "kvkNummer" && isValidKvkNummer(query)
                    ? { kvkNummer: query, inclusiefInactieveRegistraties: inclusiefInactief }
                    : type === "vestigingsnummer"
                        ? { vestigingsnummer: query, inclusiefInactieveRegistraties: inclusiefInactief }
                        : { naam: query, plaats, inclusiefInactieveRegistraties: inclusiefInactief };

                const response = await searchKvk(searchParams);
                searchResults = response.resultaten;
                bronnen.push("KVK Handelsregister");
            }
        } catch (error) {
            errors.push(`KVK search failed: ${error instanceof Error ? error.message : "Unknown error"}`);
            // Fall back to mock data
            const mockResponse = getMockSearchResults(query);
            searchResults = mockResponse.resultaten;
            bronnen.push("KVK (fallback mock)");
        }

        // If no results, return early
        if (searchResults.length === 0) {
            return {
                type: "search",
                results: [],
                total: 0,
                meta: {
                    timestamp: new Date().toISOString(),
                    bronnen,
                    verwerkingstijd: Date.now() - startTime,
                    kvkConfigured,
                    errors,
                },
            };
        }

        // If just searching (not getting full profile), return search results
        if (!getFullProfile) {
            const formattedResults: CompanySearchResult[] = searchResults.map(r => ({
                kvkNummer: r.kvkNummer,
                naam: r.naam,
                adres: formatAddress(r.adres),
                plaats: r.adres?.binnenlandsAdres?.plaats || "",
                type: r.type,
                actief: r.actief === "Ja",
            }));

            return {
                type: "search",
                results: formattedResults,
                total: formattedResults.length,
                meta: {
                    timestamp: new Date().toISOString(),
                    bronnen,
                    verwerkingstijd: Date.now() - startTime,
                    kvkConfigured,
                    errors,
                },
            };
        }

        // ========== STEP 2: Get Full Company Profile ==========
        const primaryResult = searchResults[0];
        let basisprofiel: KvkBasisprofiel | null = null;

        try {
            if (useMocks) {
                basisprofiel = getMockBasisprofiel(primaryResult.kvkNummer);
            } else {
                const fullProfile = await getFullCompanyProfile(primaryResult.kvkNummer);
                basisprofiel = fullProfile.basisprofiel;
                if (fullProfile.errors.length) {
                    errors.push(...fullProfile.errors);
                }
            }
        } catch (error) {
            errors.push(`Profile fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`);
            basisprofiel = getMockBasisprofiel(primaryResult.kvkNummer);
        }

        // ========== STEP 3: Run Enrichments ==========
        const enrichmentOptions = enrichments || {
            website: true,
            socials: true,
            techStack: true,
            news: true,
            reviews: true,
            aiAnalysis: true,
        };

        let enrichment: CompanyEnrichment | null = null;

        if (Object.values(enrichmentOptions).some(v => v)) {
            try {
                const websiteFromKvk = basisprofiel?.embedded?.hoofdvestiging?.websites?.[0];
                const city = primaryResult.adres?.binnenlandsAdres?.plaats;

                enrichment = await enrichCompanyData(
                    primaryResult.naam,
                    websiteFromKvk,
                    city,
                    useMocks
                );

                if (enrichment.errors.length) {
                    errors.push(...enrichment.errors);
                }

                if (enrichment.website.website) bronnen.push("Website");
                if (enrichment.socials.foundCount > 0) bronnen.push("Social Media");
                if (enrichment.techStack.totalDetected > 0) bronnen.push("Tech Stack Analysis");
                if (enrichment.news.articles.length > 0) bronnen.push(`News (${enrichment.news.source})`);
                if (enrichment.reviews.totalReviews > 0) bronnen.push("Reviews");

            } catch (error) {
                errors.push(`Enrichment failed: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        }

        // ========== STEP 4: AI Analysis ==========
        let aiAnalysis: CompanyProfile["aiAnalyse"] = null;

        if (enrichmentOptions.aiAnalysis) {
            try {
                const anthropic = new Anthropic();

                const prompt = buildCompanyIntelPrompt({
                    companyName: primaryResult.naam,
                    kvkData: {
                        kvkNummer: primaryResult.kvkNummer,
                        rechtsvorm: basisprofiel?.embedded?.eigenaar?.rechtsvorm,
                        sbiCodes: basisprofiel?.sbiActiviteiten,
                        aantalMedewerkers: basisprofiel?.totaalWerkzamePersonen,
                        oprichtingsdatum: basisprofiel?.formeleRegistratiedatum,
                    },
                    websiteUrl: enrichment?.website.website,
                    techStack: enrichment?.techStack,
                    socialProfiles: enrichment?.socials.profiles,
                    newsArticles: enrichment?.news.articles,
                    reviews: enrichment?.reviews,
                });

                const response = await anthropic.messages.create({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: COMPANY_INTEL_PROMPT.maxTokens,
                    temperature: COMPANY_INTEL_PROMPT.temperature,
                    messages: [{ role: "user", content: prompt }],
                });

                const textContent = response.content.find(c => c.type === "text");
                if (textContent && textContent.type === "text") {
                    const parsed = JSON.parse(textContent.text);
                    aiAnalysis = {
                        samenvatting: parsed.samenvatting || "",
                        branche: parsed.branche || "",
                        sterkePunten: parsed.sterkePunten || [],
                        aandachtspunten: parsed.aandachtspunten || [],
                        groeiScore: parsed.groeiScore || 0,
                        digitalScore: parsed.digitalScore || 0,
                        reputatieScore: parsed.reputatieScore || 0,
                        overallScore: parsed.overallScore || 0,
                        aanbevelingen: parsed.aanbevelingen || [],
                        confidence: parsed.confidence || 0,
                    };
                    bronnen.push("AI Analysis (Claude)");
                }
            } catch (error) {
                errors.push(`AI analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        }

        // ========== STEP 5: Build Response ==========
        const profile: CompanyProfile = {
            kvk: {
                kvkNummer: primaryResult.kvkNummer,
                rsin: primaryResult.rsin || null,
                naam: primaryResult.naam,
                handelsnamen: basisprofiel?.handelsnamen?.map(h => h.naam) || [primaryResult.naam],
                rechtsvorm: basisprofiel?.embedded?.eigenaar?.rechtsvorm || null,
                oprichtingsdatum: basisprofiel?.formeleRegistratiedatum || null,
                actief: primaryResult.actief === "Ja",
                sbiCodes: basisprofiel?.sbiActiviteiten?.map(s => ({
                    code: s.sbiCode,
                    omschrijving: s.sbiOmschrijving,
                })) || [],
                aantalMedewerkers: formatEmployeeCount(basisprofiel?.totaalWerkzamePersonen),
                hoofdactiviteit: getMainActivity(basisprofiel?.sbiActiviteiten),
            },
            adres: {
                straat: primaryResult.adres?.binnenlandsAdres?.straatnaam || null,
                huisnummer: primaryResult.adres?.binnenlandsAdres?.huisnummer?.toString() || null,
                postcode: primaryResult.adres?.binnenlandsAdres?.postcode || null,
                plaats: primaryResult.adres?.binnenlandsAdres?.plaats || null,
                volledig: formatAddress(primaryResult.adres),
                geoLocatie: null, // Would come from vestigingsprofiel with geoData
            },
            online: {
                website: enrichment?.website.website || null,
                email: enrichment?.website.email || null,
                telefoon: enrichment?.website.telefoon || null,
                socials: enrichment?.socials.profiles || {
                    linkedin: null,
                    twitter: null,
                    facebook: null,
                    instagram: null,
                    youtube: null,
                },
            },
            techStack: enrichment?.techStack || {
                cms: [],
                frameworks: [],
                analytics: [],
                payments: [],
                marketing: [],
                ecommerce: [],
                hosting: [],
                other: [],
                totalDetected: 0,
            },
            reviews: {
                google: enrichment?.reviews.google || null,
                trustpilot: enrichment?.reviews.trustpilot || null,
                averageRating: enrichment?.reviews.averageRating || null,
                totalReviews: enrichment?.reviews.totalReviews || 0,
            },
            nieuws: enrichment?.news.articles || [],
            aiAnalyse: aiAnalysis,
            meta: {
                timestamp: new Date().toISOString(),
                bronnen: [...new Set(bronnen)],
                verwerkingstijd: Date.now() - startTime,
                kvkConfigured,
                errors,
            },
        };

        return {
            type: "profile",
            profile,
        };
    },
});
