/**
 * Official Announcements Client
 *
 * Fetches company announcements from Officiële Bekendmakingen (Staatscourant)
 * including formations, dissolutions, mergers, and other corporate events.
 *
 * Source: officielebekendmakingen.nl
 */

import { KvkSourceError, type Announcement, type RateLimitConfig } from "../types";
import { CacheKeys, CacheTTL } from "../cache/cache-keys";
import { getCachedOrFetch, checkRateLimit } from "../cache/redis-cache";
import type { AnnouncementRecord, AnnouncementType } from "./types";

// =============================================================================
// CONFIGURATION
// =============================================================================

const BEKENDMAKINGEN_BASE = "https://www.officielebekendmakingen.nl";
const STAATSCOURANT_SEARCH = `${BEKENDMAKINGEN_BASE}/zoeken/resultaat`;

const RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 20,
  windowMs: 60 * 1000, // 20 requests per minute
};

const USER_AGENT = "AIFAIS Business Intelligence/2.0 (https://aifais.com; announcements)";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parse announcement type from title/content
 */
function parseAnnouncementType(title: string, content: string = ""): AnnouncementType {
  const text = `${title} ${content}`.toLowerCase();

  if (text.includes("opricht") || text.includes("inschrijving")) return "oprichting";
  if (text.includes("ontbind") || text.includes("opheff")) return "ontbinding";
  if (text.includes("liquidat")) return "liquidatie";
  if (text.includes("fusie") || text.includes("samenvoeging")) return "fusie";
  if (text.includes("splits")) return "splitsing";
  if (text.includes("naamswijzig") || text.includes("handelsnaam")) return "naamswijziging";
  if (text.includes("adres") || text.includes("verhuiz") || text.includes("zetel")) return "adreswijziging";
  if (text.includes("statut")) return "statutenwijziging";
  if (text.includes("bestuur") || text.includes("directie")) return "bestuurswijziging";
  if (text.includes("faillissement")) return "faillissement";
  if (text.includes("surseance") || text.includes("surséance")) return "surseance";
  if (text.includes("schuldsanering")) return "schuldsanering";

  return "overig";
}

/**
 * Search for company announcements in Staatscourant
 */
async function searchStaatscourant(
  companyName: string,
  kvkNummer?: string
): Promise<AnnouncementRecord[]> {
  try {
    // Build search query
    const searchTerm = kvkNummer ? `${companyName} ${kvkNummer}` : companyName;

    const params = new URLSearchParams({
      q: searchTerm,
      rubriek: "staatscourant",
      sort: "date:desc",
    });

    const url = `${STAATSCOURANT_SEARCH}?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn(`[Announcements] officielebekendmakingen.nl returned ${response.status}`);
      return [];
    }

    const html = await response.text();

    // Parse the HTML for announcement entries
    const announcements: AnnouncementRecord[] = [];

    // Look for search result items
    // The site uses specific HTML structure for results
    const resultPattern = /<article[^>]*class="[^"]*result[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
    const matches = html.matchAll(resultPattern);

    for (const match of matches) {
      const articleHtml = match[1];

      // Extract title
      const titleMatch = articleHtml.match(/<h[123][^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);

      // Extract date
      const dateMatch = articleHtml.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/);

      // Extract snippet/description
      const snippetMatch = articleHtml.match(/<p[^>]*class="[^"]*snippet[^"]*"[^>]*>([^<]+)<\/p>/i);

      if (titleMatch) {
        const [, href, title] = titleMatch;
        const fullUrl = href.startsWith("http") ? href : `${BEKENDMAKINGEN_BASE}${href}`;

        // Parse date
        let dateStr = new Date().toISOString().split("T")[0];
        if (dateMatch) {
          const dateParts = dateMatch[1].split(/[-\/]/);
          if (dateParts[0].length === 4) {
            dateStr = `${dateParts[0]}-${dateParts[1].padStart(2, "0")}-${dateParts[2].padStart(2, "0")}`;
          } else {
            dateStr = `${dateParts[2]}-${dateParts[1].padStart(2, "0")}-${dateParts[0].padStart(2, "0")}`;
          }
        }

        const content = snippetMatch?.[1] || "";

        announcements.push({
          id: `stcrt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: parseAnnouncementType(title, content),
          titel: title.trim(),
          inhoud: content.trim(),
          datum: dateStr,
          bron: "staatscourant",
          url: fullUrl,
          gerelateerdeKvk: kvkNummer,
        });
      }
    }

    // Limit to most recent 10 announcements
    return announcements.slice(0, 10);
  } catch (error) {
    console.error("[Announcements] Search failed:", error);
    return [];
  }
}

/**
 * Alternative: Search via RSS feed if available
 */
async function searchViaRss(companyName: string): Promise<AnnouncementRecord[]> {
  try {
    // Staatscourant has RSS feeds for certain categories
    const rssUrl = `${BEKENDMAKINGEN_BASE}/rss/staatscourant?q=${encodeURIComponent(companyName)}`;

    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return [];
    }

    const xml = await response.text();
    const announcements: AnnouncementRecord[] = [];

    // Parse RSS items
    const itemPattern = /<item>([\s\S]*?)<\/item>/gi;
    const items = xml.matchAll(itemPattern);

    for (const item of items) {
      const itemXml = item[1];

      const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([^\]<]+)(?:\]\]>)?<\/title>/i);
      const linkMatch = itemXml.match(/<link>([^<]+)<\/link>/i);
      const dateMatch = itemXml.match(/<pubDate>([^<]+)<\/pubDate>/i);
      const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);

      if (titleMatch && linkMatch) {
        let dateStr = new Date().toISOString().split("T")[0];
        if (dateMatch) {
          try {
            dateStr = new Date(dateMatch[1]).toISOString().split("T")[0];
          } catch {
            // Keep default date
          }
        }

        announcements.push({
          id: `rss-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: parseAnnouncementType(titleMatch[1], descMatch?.[1] || ""),
          titel: titleMatch[1].trim(),
          inhoud: descMatch?.[1]?.trim().slice(0, 500) || "",
          datum: dateStr,
          bron: "staatscourant",
          url: linkMatch[1].trim(),
        });
      }
    }

    return announcements;
  } catch (error) {
    console.error("[Announcements] RSS search failed:", error);
    return [];
  }
}

// =============================================================================
// PUBLIC FUNCTIONS
// =============================================================================

/**
 * Get official announcements for a company
 */
export async function getCompanyAnnouncements(
  companyName: string,
  kvkNummer?: string
): Promise<Announcement[]> {
  if (!companyName) {
    throw new KvkSourceError(
      "Bedrijfsnaam is vereist voor bekendmakingen zoekopdracht",
      "bekendmakingen",
      "INVALID_INPUT",
      false
    );
  }

  const cacheKey = CacheKeys.announcements(kvkNummer || companyName);

  // Check rate limit
  const rateStatus = await checkRateLimit("bekendmakingen", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      `Rate limited. Try again in ${Math.ceil((rateStatus.resetAt - Date.now()) / 1000)} seconds`,
      "bekendmakingen",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  const result = await getCachedOrFetch<Announcement[]>(
    cacheKey,
    async () => {
      // Try RSS first (lighter)
      let records = await searchViaRss(companyName);

      // Fall back to HTML scraping if RSS yields nothing
      if (records.length === 0) {
        records = await searchStaatscourant(companyName, kvkNummer);
      }

      // Transform to Announcement format
      return records.map((record) => ({
        type: mapAnnouncementType(record.type),
        titel: record.titel,
        datum: record.datum,
        url: record.url,
        bron: "Staatscourant",
      }));
    },
    CacheTTL.ANNOUNCEMENTS,
    "bekendmakingen"
  );

  return result.data;
}

/**
 * Map internal announcement type to API type
 */
function mapAnnouncementType(
  type: AnnouncementType
): "oprichting" | "ontbinding" | "fusie" | "naamswijziging" | "adreswijziging" | "overig" {
  switch (type) {
    case "oprichting":
      return "oprichting";
    case "ontbinding":
    case "liquidatie":
      return "ontbinding";
    case "fusie":
    case "splitsing":
      return "fusie";
    case "naamswijziging":
      return "naamswijziging";
    case "adreswijziging":
      return "adreswijziging";
    default:
      return "overig";
  }
}

/**
 * Get recent corporate events for timeline building
 */
export async function getRecentEvents(
  companyName: string,
  kvkNummer?: string,
  limit: number = 5
): Promise<Announcement[]> {
  const announcements = await getCompanyAnnouncements(companyName, kvkNummer);
  return announcements.slice(0, limit);
}

/**
 * Check if company has any concerning announcements (dissolution, bankruptcy notices)
 */
export async function hasWarningAnnouncements(
  companyName: string,
  kvkNummer?: string
): Promise<{
  hasWarnings: boolean;
  warnings: Announcement[];
}> {
  const announcements = await getCompanyAnnouncements(companyName, kvkNummer);

  const warningTypes = ["ontbinding", "fusie"]; // Types that might indicate concern
  const warnings = announcements.filter((a) => warningTypes.includes(a.type));

  return {
    hasWarnings: warnings.length > 0,
    warnings,
  };
}

/**
 * Get source attribution
 */
export function getSourceAttribution() {
  return {
    name: "Officiële Bekendmakingen (Staatscourant)",
    url: "https://www.officielebekendmakingen.nl",
    lastUpdated: null, // Real-time
    license: "Public Government Data",
  };
}

/**
 * Health check for the announcements service
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  responseTime: number;
  error?: string;
}> {
  const start = Date.now();

  try {
    const response = await fetch(BEKENDMAKINGEN_BASE, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(5000),
    });

    return {
      healthy: response.ok,
      responseTime: Date.now() - start,
      error: response.ok ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      healthy: false,
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
