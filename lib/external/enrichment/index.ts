/**
 * Company Enrichment Services
 *
 * Central export for all enrichment modules.
 * Use these services to enhance KVK company data with:
 * - Website & contact discovery
 * - Social media profiles
 * - Technology stack analysis
 * - News & press coverage
 * - Reviews & reputation
 */

export * from "./website-discovery";
export * from "./social-finder";
export * from "./tech-stack";
export * from "./news-search";
export * from "./reviews";

import { discoverWebsite, WebsiteDiscoveryResult } from "./website-discovery";
import { findSocialProfiles, SocialFinderResult } from "./social-finder";
import { analyzeTechStack, TechStackResult } from "./tech-stack";
import { searchNews, NewsSearchResult } from "./news-search";
import { getReviews, ReviewsResult } from "./reviews";

export interface CompanyEnrichment {
    website: WebsiteDiscoveryResult;
    socials: SocialFinderResult;
    techStack: TechStackResult;
    news: NewsSearchResult;
    reviews: ReviewsResult;
    enrichmentTime: number;
    errors: string[];
}

/**
 * Run all enrichment services for a company
 *
 * NO MOCK DATA - Returns real data or null/empty values with proper error handling.
 *
 * @param companyName Company name for lookups
 * @param knownWebsite Known website URL (from KVK data)
 * @param city City for local business lookups
 * @returns Combined enrichment data
 */
export async function enrichCompanyData(
    companyName: string,
    knownWebsite?: string,
    city?: string
): Promise<CompanyEnrichment> {
    const startTime = Date.now();
    const errors: string[] = [];

    // Step 1: Discover website (or use known)
    let website: WebsiteDiscoveryResult;
    try {
        website = await discoverWebsite(companyName, knownWebsite);
    } catch (error) {
        errors.push(`Website discovery failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        website = {
            website: knownWebsite || null,
            email: null,
            telefoon: null,
            discoveryMethod: "none",
            confidence: 0,
        };
    }

    // Step 2: Run remaining enrichments in parallel
    // NO MOCK DATA - Each service returns real data or empty/null values
    const [socials, techStack, news, reviews] = await Promise.all([
        // Social profiles
        findSocialProfiles(companyName, website.website).catch(error => {
            errors.push(`Social finder failed: ${error instanceof Error ? error.message : "Unknown error"}`);
            return {
                profiles: { linkedin: null, twitter: null, facebook: null, instagram: null, youtube: null },
                foundCount: 0,
                sources: [],
            } as SocialFinderResult;
        }),

        // Tech stack (only if we have a website)
        website.website
            ? analyzeTechStack(website.website).catch(error => {
                errors.push(`Tech stack analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                return {
                    cms: [], frameworks: [], analytics: [], payments: [],
                    marketing: [], ecommerce: [], hosting: [], other: [],
                    totalDetected: 0,
                } as TechStackResult;
            })
            : Promise.resolve({
                cms: [], frameworks: [], analytics: [], payments: [],
                marketing: [], ecommerce: [], hosting: [], other: [],
                totalDetected: 0,
            } as TechStackResult),

        // News search - NO MOCK FALLBACK
        searchNews(companyName).catch(error => {
            errors.push(`News search failed: ${error instanceof Error ? error.message : "Unknown error"}`);
            return { articles: [], source: "none" as const, totalFound: 0, error: "News search failed" };
        }),

        // Reviews - NO MOCK FALLBACK
        getReviews(companyName, city).catch(error => {
            errors.push(`Reviews fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`);
            return {
                google: null,
                trustpilot: null,
                averageRating: null,
                totalReviews: 0,
                sources: [],
                error: "Reviews fetch failed",
            } as ReviewsResult;
        }),
    ]);

    return {
        website,
        socials,
        techStack,
        news,
        reviews,
        enrichmentTime: Date.now() - startTime,
        errors,
    };
}

/**
 * Quick enrichment - only essential data (faster)
 */
export async function quickEnrichment(
    companyName: string,
    knownWebsite?: string
): Promise<Pick<CompanyEnrichment, "website" | "socials" | "enrichmentTime">> {
    const startTime = Date.now();

    const website = await discoverWebsite(companyName, knownWebsite);
    const socials = await findSocialProfiles(companyName, website.website);

    return {
        website,
        socials,
        enrichmentTime: Date.now() - startTime,
    };
}
