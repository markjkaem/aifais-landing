/**
 * Director Search Module
 *
 * Extracts and discovers director (bestuurder) information from available sources.
 * Note: Full director data typically requires paid KVK extracts.
 * This module works with what's publicly available.
 */

import { KvkSourceError, type Director, type RateLimitConfig } from "../types";
import { CacheKeys, CacheTTL } from "../cache/cache-keys";
import { getCachedOrFetch, checkRateLimit } from "../cache/redis-cache";

// =============================================================================
// CONFIGURATION
// =============================================================================

const RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 50,
  windowMs: 60 * 1000,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parse function title from Dutch text
 */
function parseFunctie(
  text: string
): "bestuurder" | "aandeelhouder" | "commissaris" | "gevolmachtigde" | "overig" {
  const lower = text.toLowerCase();

  if (lower.includes("directeur") || lower.includes("bestuurder") || lower.includes("ceo") || lower.includes("managing")) {
    return "bestuurder";
  }
  if (lower.includes("aandeelhouder") || lower.includes("shareholder") || lower.includes("eigenaar")) {
    return "aandeelhouder";
  }
  if (lower.includes("commissaris") || lower.includes("raad van commissarissen") || lower.includes("rvc")) {
    return "commissaris";
  }
  if (lower.includes("gevolmachtig") || lower.includes("procuratiehouder") || lower.includes("proxy")) {
    return "gevolmachtigde";
  }

  return "overig";
}

/**
 * Parse authority/bevoegdheid from text
 */
function parseBevoegdheid(text: string): "alleen" | "gezamenlijk" | "beperkt" | null {
  const lower = text.toLowerCase();

  if (lower.includes("alleen") || lower.includes("zelfstandig") || lower.includes("onbeperkt")) {
    return "alleen";
  }
  if (lower.includes("gezamenlijk") || lower.includes("samen") || lower.includes("jointly")) {
    return "gezamenlijk";
  }
  if (lower.includes("beperkt") || lower.includes("limited")) {
    return "beperkt";
  }

  return null;
}

/**
 * Extract directors from LinkedIn company page (if publicly available)
 */
async function extractFromLinkedIn(
  companyName: string,
  linkedinUrl?: string
): Promise<Director[]> {
  // Note: LinkedIn scraping requires careful handling and may violate ToS
  // This is a placeholder for potential future implementation with proper authorization
  // For now, we return empty and rely on other sources
  return [];
}

/**
 * Extract directors from company website
 */
async function extractFromWebsite(websiteUrl: string): Promise<Director[]> {
  try {
    // Common pages where director info might be found
    const pages = [
      "/over-ons",
      "/about",
      "/about-us",
      "/team",
      "/ons-team",
      "/management",
      "/contact",
    ];

    for (const page of pages) {
      try {
        const url = new URL(page, websiteUrl).href;
        const response = await fetch(url, {
          headers: {
            "User-Agent": "AIFAIS Business Intelligence/2.0",
            Accept: "text/html",
          },
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) continue;

        const html = await response.text();
        const directors = parseDirectorsFromHtml(html);

        if (directors.length > 0) {
          return directors;
        }
      } catch {
        // Continue to next page
      }
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * Parse director information from HTML content
 */
function parseDirectorsFromHtml(html: string): Director[] {
  const directors: Director[] = [];

  // Look for common patterns in team/about pages
  // Pattern 1: Name with title in structured format
  const teamPattern = /<(?:div|article|section)[^>]*class="[^"]*(?:team|member|director|management)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|article|section)>/gi;

  const matches = html.matchAll(teamPattern);

  for (const match of matches) {
    const memberHtml = match[1];

    // Extract name
    const nameMatch = memberHtml.match(/<h[234][^>]*>([^<]+)<\/h[234]>/i) ||
                      memberHtml.match(/<(?:strong|b)[^>]*>([^<]+)<\/(?:strong|b)>/i);

    // Extract title/function
    const titleMatch = memberHtml.match(/<(?:p|span)[^>]*class="[^"]*(?:title|function|role|position)[^"]*"[^>]*>([^<]+)<\/(?:p|span)>/i) ||
                       memberHtml.match(/<(?:p|span)[^>]*>([^<]*(?:directeur|ceo|cfo|cto|manager|eigenaar)[^<]*)<\/(?:p|span)>/i);

    if (nameMatch) {
      const name = nameMatch[1].trim();
      const title = titleMatch?.[1]?.trim() || "";

      // Filter out obvious non-names
      if (name.length > 2 && name.length < 100 && !name.includes("@") && !/^\d+$/.test(name)) {
        directors.push({
          naam: name,
          functie: parseFunctie(title),
          functieOmschrijving: title || null,
          startDatum: null,
          eindDatum: null,
          bevoegdheid: parseBevoegdheid(title),
          isNatuurlijkPersoon: true,
        });
      }
    }
  }

  // Deduplicate by name
  const seen = new Set<string>();
  return directors.filter((d) => {
    const key = d.naam.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// =============================================================================
// PUBLIC FUNCTIONS
// =============================================================================

/**
 * Search for directors of a company
 *
 * @param companyName - Company name
 * @param websiteUrl - Company website URL (optional, improves results)
 * @returns List of discovered directors
 */
export async function searchDirectors(
  companyName: string,
  websiteUrl?: string
): Promise<Director[]> {
  if (!companyName) {
    throw new KvkSourceError(
      "Bedrijfsnaam is vereist",
      "directors",
      "INVALID_INPUT",
      false
    );
  }

  const cacheKey = CacheKeys.directors(companyName);

  // Check rate limit
  const rateStatus = await checkRateLimit("directors", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      `Rate limited`,
      "directors",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  const result = await getCachedOrFetch<Director[]>(
    cacheKey,
    async () => {
      const directors: Director[] = [];

      // Try website extraction if URL provided
      if (websiteUrl) {
        const websiteDirectors = await extractFromWebsite(websiteUrl);
        directors.push(...websiteDirectors);
      }

      // Note: In a full implementation, you could also:
      // 1. Use the paid KVK API for official director data
      // 2. Scrape CompanyInfo.nl for publicly available info
      // 3. Use LinkedIn API (with proper authorization)

      return directors;
    },
    CacheTTL.DIRECTORS,
    "website"
  );

  return result.data;
}

/**
 * Get the primary director (likely CEO/owner)
 */
export async function getPrimaryDirector(
  companyName: string,
  websiteUrl?: string
): Promise<Director | null> {
  const directors = await searchDirectors(companyName, websiteUrl);

  // Prioritize: bestuurder > eigenaar > others
  const sorted = directors.sort((a, b) => {
    const priority: Record<string, number> = {
      bestuurder: 0,
      aandeelhouder: 1,
      commissaris: 2,
      gevolmachtigde: 3,
      overig: 4,
    };
    return (priority[a.functie] || 4) - (priority[b.functie] || 4);
  });

  return sorted[0] || null;
}

/**
 * Check if directors data is available
 */
export async function hasDirectorData(
  companyName: string,
  websiteUrl?: string
): Promise<boolean> {
  const directors = await searchDirectors(companyName, websiteUrl);
  return directors.length > 0;
}

/**
 * Get source attribution
 */
export function getSourceAttribution() {
  return {
    name: "Company Websites (Public Data)",
    url: null,
    lastUpdated: null,
    license: "Public Web Data",
  };
}

/**
 * Note about data limitations
 */
export function getDataLimitationsNote(): string {
  return `
    Director information is limited to publicly available data.
    For complete, official director information, a paid KVK extract
    (Uittreksel Handelsregister) is required at €2.85 per lookup.

    Sources used:
    - Company websites (team/about pages)
    - Public announcements (where available)

    Not available without paid access:
    - Full director names with birthdates
    - Complete function descriptions
    - Historical director changes
    - Signing authority details
  `.trim();
}
