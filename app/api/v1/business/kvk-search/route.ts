/**
 * KVK Bedrijfszoeker API v2.0
 *
 * Company Intelligence Tool that combines FREE data sources with enrichments:
 * - OpenKVK (overheid.io) - FREE company data
 * - Bankruptcy Register (rechtspraak.nl) - Legal status
 * - Official Announcements (Staatscourant) - Corporate events
 * - Website & contact discovery
 * - Social media profiles
 * - Technology stack analysis
 * - News & press coverage
 * - Reviews & reputation
 * - AI-powered business analysis
 *
 * NO MOCK DATA - Real data or proper error responses.
 *
 * Price: 0.001 SOL / €0.50
 */

import { createToolHandler } from "@/lib/tools/createToolHandler";
import { kvkSearchSchema } from "@/lib/security/schemas";
import { getToolBySlug } from "@/config/tools";
import Anthropic from "@anthropic-ai/sdk";

// New KVK v2.0 module
import {
    searchCompanies,
    getCompanyProfile,
    KvkSourceError,
    type SearchResponse,
    type ProfileResponse,
    type CompanyProfile,
} from "@/lib/external/kvk";

// Enrichment services
import { enrichCompanyData, CompanyEnrichment } from "@/lib/external/enrichment";

// AI Prompts
import { buildCompanyIntelPrompt, COMPANY_INTEL_PROMPT } from "@/lib/ai/prompts";

const toolMetadata = getToolBySlug("kvk-search");

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

        const {
            query,
            type = "naam",
            plaats,
            postcode,
            provincie,
            sbiCode,
            inclusiefInactief = false,
            getFullProfile = false,
            include,
            enrichments,
        } = input;

        // Determine the search query based on type
        let searchQuery = query || "";
        if (type === "postcode" && postcode && !query) {
            searchQuery = postcode;
        } else if (type === "sbiCode" && sbiCode && !query) {
            searchQuery = sbiCode;
        }

        // ========== STEP 1: Search Companies ==========
        try {
            const searchResponse = await searchCompanies({
                query: searchQuery,
                type: type as "naam" | "kvkNummer" | "postcode" | "sbiCode",
                plaats,
                postcode,
                provincie,
                sbiCode,
                inclusiefInactief,
            });

            // Add sources
            for (const source of searchResponse.meta.sources) {
                bronnen.push(source.name);
            }

            // Collect errors
            for (const error of searchResponse.meta.errors) {
                errors.push(`${error.source}: ${error.message}`);
            }

            // If no full profile requested, return search results
            if (!getFullProfile) {
                return {
                    type: "search",
                    results: searchResponse.results.map(r => ({
                        kvkNummer: r.kvkNummer,
                        naam: r.naam,
                        adres: r.adres.volledig,
                        plaats: r.adres.plaats || "",
                        type: r.type,
                        actief: r.actief,
                        sbiCodes: r.sbiCodes,
                        hoofdactiviteit: r.hoofdactiviteit,
                    })),
                    total: searchResponse.total,
                    meta: {
                        timestamp: new Date().toISOString(),
                        bronnen: [...new Set(bronnen)],
                        verwerkingstijd: Date.now() - startTime,
                        errors,
                    },
                };
            }

            // If no results, return empty
            if (searchResponse.results.length === 0) {
                return {
                    type: "search",
                    results: [],
                    total: 0,
                    meta: {
                        timestamp: new Date().toISOString(),
                        bronnen: [...new Set(bronnen)],
                        verwerkingstijd: Date.now() - startTime,
                        errors: [...errors, "Geen bedrijven gevonden"],
                    },
                };
            }

            // ========== STEP 2: Get Full Company Profile ==========
            const primaryResult = searchResponse.results[0];

            // Use include options from request, with sensible defaults
            const includeOptions = include || {
                directors: true,
                relations: false,  // Off by default (expensive)
                legalStatus: true,
                financial: true,
            };

            const profileResponse = await getCompanyProfile(
                primaryResult.kvkNummer,
                primaryResult.naam,
                {
                    directors: includeOptions.directors ?? true,
                    relations: includeOptions.relations ?? false,
                    legalStatus: includeOptions.legalStatus ?? true,
                    financial: includeOptions.financial ?? true,
                }
            );

            const profile = profileResponse.profile;

            // Add profile sources
            for (const source of profile.meta.sources) {
                if (!bronnen.includes(source.name)) {
                    bronnen.push(source.name);
                }
            }

            // Collect profile errors
            for (const error of profile.meta.errors) {
                errors.push(`${error.source}: ${error.message}`);
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
                    const city = profile.adres.plaats || undefined;

                    // NO MOCK DATA - enrichCompanyData now returns real data only
                    enrichment = await enrichCompanyData(
                        profile.kvk.naam,
                        undefined, // Let it discover the website
                        city
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

                    // Build prompt with all available data
                    const prompt = buildCompanyIntelPrompt({
                        companyName: profile.kvk.naam,
                        kvkData: {
                            kvkNummer: profile.kvk.kvkNummer,
                            rechtsvorm: profile.kvk.rechtsvorm,
                            sbiCodes: profile.kvk.sbiCodes.map(s => ({
                                sbiCode: s.code,
                                sbiOmschrijving: s.omschrijving,
                            })),
                            aantalMedewerkers: profile.kvk.aantalMedewerkers,
                            oprichtingsdatum: profile.kvk.oprichtingsdatum,
                        },
                        websiteUrl: enrichment?.website.website,
                        techStack: enrichment?.techStack,
                        socialProfiles: enrichment?.socials.profiles,
                        newsArticles: enrichment?.news.articles,
                        reviews: enrichment?.reviews,
                        // New data from v2.0
                        legalStatus: profile.juridischeStatus.data ? {
                            hasBankruptcy: !!profile.juridischeStatus.data.faillissement,
                            riskIndicator: profile.juridischeStatus.data.risicoIndicator,
                            recentAnnouncements: profile.juridischeStatus.data.bekendmakingen.length,
                        } : undefined,
                        directors: profile.bestuurders.data?.length || 0,
                        companyAge: profile.financieel.data?.companyAge,
                    });

                    const response = await anthropic.messages.create({
                        model: "claude-sonnet-4-20250514",
                        max_tokens: COMPANY_INTEL_PROMPT.maxTokens,
                        temperature: COMPANY_INTEL_PROMPT.temperature,
                        messages: [{ role: "user", content: prompt }],
                    });

                    const textContent = response.content.find(c => c.type === "text");
                    if (textContent && textContent.type === "text") {
                        try {
                            const parsed = JSON.parse(textContent.text);
                            aiAnalysis = {
                                samenvatting: parsed.samenvatting || "",
                                branche: parsed.branche || "",
                                branchePositie: parsed.branchePositie || null,
                                sterkePunten: parsed.sterkePunten || [],
                                aandachtspunten: parsed.aandachtspunten || [],
                                technologieAnalyse: parsed.technologieAnalyse || null,
                                marketingAnalyse: parsed.marketingAnalyse || null,
                                groeipotentieel: parsed.groeipotentieel || null,
                                groeiScore: parsed.groeiScore || 0,
                                digitalScore: parsed.digitalScore || 0,
                                reputatieScore: parsed.reputatieScore || 0,
                                overallScore: parsed.overallScore || 0,
                                aanbevelingen: parsed.aanbevelingen || [],
                                competitieAnalyse: parsed.competitieAnalyse || null,
                                targetKlant: parsed.targetKlant || null,
                                confidence: parsed.confidence || 0,
                            };
                            bronnen.push("AI Analysis (Claude)");
                        } catch (parseError) {
                            errors.push("AI analysis response parsing failed");
                        }
                    }
                } catch (error) {
                    errors.push(`AI analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                }
            }

            // ========== STEP 5: Build Response ==========
            const finalProfile = {
                // KVK Core Data
                kvk: {
                    kvkNummer: profile.kvk.kvkNummer,
                    rsin: profile.kvk.rsin,
                    naam: profile.kvk.naam,
                    handelsnamen: profile.kvk.handelsnamen,
                    rechtsvorm: profile.kvk.rechtsvorm,
                    oprichtingsdatum: profile.kvk.oprichtingsdatum,
                    actief: profile.kvk.actief,
                    sbiCodes: profile.kvk.sbiCodes,
                    aantalMedewerkers: profile.kvk.aantalMedewerkers,
                    hoofdactiviteit: profile.kvk.hoofdactiviteit,
                },

                // Address
                adres: {
                    straat: profile.adres.straat,
                    huisnummer: profile.adres.huisnummer,
                    postcode: profile.adres.postcode,
                    plaats: profile.adres.plaats,
                    provincie: profile.adres.provincie,
                    volledig: profile.adres.volledig,
                    geoLocatie: profile.adres.geoLocatie,
                },

                // NEW: Directors
                bestuurders: profile.bestuurders.success
                    ? profile.bestuurders.data
                    : null,

                // NEW: Company Relations (if requested)
                relaties: profile.relaties.success
                    ? {
                        moedermaatschappij: profile.relaties.data?.moedermaatschappij || null,
                        dochtermaatschappijen: profile.relaties.data?.dochtermaatschappijen || [],
                        verwanteOndernemingen: profile.relaties.data?.verwanteOndernemingen || [],
                        totaalRelaties: profile.relaties.data?.totaalRelaties || 0,
                    }
                    : null,

                // NEW: Legal Status
                juridischeStatus: profile.juridischeStatus.success
                    ? {
                        faillissement: profile.juridischeStatus.data?.faillissement || null,
                        surseance: profile.juridischeStatus.data?.surseance || null,
                        ontbinding: profile.juridischeStatus.data?.ontbinding || null,
                        bekendmakingen: profile.juridischeStatus.data?.bekendmakingen || [],
                        risicoIndicator: profile.juridischeStatus.data?.risicoIndicator || null,
                    }
                    : null,

                // NEW: Financial Indicators
                financieel: profile.financieel.success
                    ? profile.financieel.data
                    : null,

                // Online Presence (from enrichment)
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

                // Tech Stack
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

                // Reviews (NO MOCK DATA)
                reviews: {
                    google: enrichment?.reviews.google || null,
                    trustpilot: enrichment?.reviews.trustpilot || null,
                    averageRating: enrichment?.reviews.averageRating || null,
                    totalReviews: enrichment?.reviews.totalReviews || 0,
                },

                // News (NO MOCK DATA)
                nieuws: enrichment?.news.articles || [],

                // AI Analysis
                aiAnalyse: aiAnalysis,

                // NEW: Timeline
                tijdlijn: profile.tijdlijn || [],

                // Meta
                meta: {
                    timestamp: new Date().toISOString(),
                    bronnen: [...new Set(bronnen)],
                    verwerkingstijd: Date.now() - startTime,
                    errors,
                    dataVersheid: {
                        kvk: profile.meta.timestamp,
                        enrichment: enrichment ? new Date().toISOString() : null,
                    },
                },
            };

            return {
                type: "profile",
                profile: finalProfile,
            };

        } catch (error) {
            // Handle KVK-specific errors
            if (error instanceof KvkSourceError) {
                if (error.code === "NOT_FOUND") {
                    return {
                        type: "search",
                        results: [],
                        total: 0,
                        meta: {
                            timestamp: new Date().toISOString(),
                            bronnen,
                            verwerkingstijd: Date.now() - startTime,
                            errors: [error.message],
                        },
                    };
                }

                if (error.code === "RATE_LIMITED") {
                    return {
                        type: "error",
                        error: {
                            code: "RATE_LIMITED",
                            message: error.message,
                            retryAfter: error.retryAfter,
                        },
                        meta: {
                            timestamp: new Date().toISOString(),
                            bronnen,
                            verwerkingstijd: Date.now() - startTime,
                            errors: [error.message],
                        },
                    };
                }
            }

            // Generic error
            throw error;
        }
    },
});
