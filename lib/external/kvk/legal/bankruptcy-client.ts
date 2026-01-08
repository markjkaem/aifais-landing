/**
 * Bankruptcy Register Client
 *
 * Checks Dutch Central Insolvency Register (Centraal Insolventieregister)
 * for bankruptcy, suspension of payments, and debt restructuring records.
 *
 * Source: rechtspraak.nl
 * Data available from: June 1, 2005
 */

import { KvkSourceError, type BankruptcyInfo, type RateLimitConfig } from "../types";
import { CacheKeys, CacheTTL } from "../cache/cache-keys";
import { getCachedOrFetch, checkRateLimit, cacheNotFound, isNotFoundCached } from "../cache/redis-cache";
import type { InsolvencyRecord } from "./types";

// =============================================================================
// CONFIGURATION
// =============================================================================

const RECHTSPRAAK_SEARCH_URL = "https://www.rechtspraak.nl/Registers/Paginas/Insolventies.aspx";
const RECHTSPRAAK_API_BASE = "https://insolventies.rechtspraak.nl/Services/BekendmakingService";

const RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60 * 1000, // 30 requests per minute (conservative for gov site)
};

const USER_AGENT = "AIFAIS Business Intelligence/2.0 (https://aifais.com; legal-check)";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parse insolvency type from Dutch text
 */
function parseInsolvencyType(text: string): "faillissement" | "surseance" | "schuldsanering" {
  const lower = text.toLowerCase();
  if (lower.includes("faillissement")) return "faillissement";
  if (lower.includes("surseance") || lower.includes("surséance")) return "surseance";
  if (lower.includes("schuldsanering") || lower.includes("wsnp")) return "schuldsanering";
  return "faillissement"; // default
}

/**
 * Parse status from Dutch text
 */
function parseStatus(text: string): "actief" | "beeindigd" {
  const lower = text.toLowerCase();
  if (
    lower.includes("beeindigd") ||
    lower.includes("beëindigd") ||
    lower.includes("opgeheven") ||
    lower.includes("vernietigd") ||
    lower.includes("ingetrokken")
  ) {
    return "beeindigd";
  }
  return "actief";
}

/**
 * Try to search via the rechtspraak.nl web interface
 * Note: This is a fallback method using HTML scraping
 */
async function searchViaWebInterface(
  kvkNummer: string,
  companyName: string
): Promise<InsolvencyRecord[]> {
  try {
    // Build search URL
    const searchParams = new URLSearchParams();
    if (kvkNummer) {
      searchParams.append("kvknummer", kvkNummer);
    } else if (companyName) {
      searchParams.append("naam", companyName);
    }

    const url = `${RECHTSPRAAK_SEARCH_URL}?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(`[Bankruptcy] rechtspraak.nl returned ${response.status}`);
      return [];
    }

    const html = await response.text();

    // Parse the HTML response for insolvency records
    // The rechtspraak.nl page uses specific HTML patterns
    const records: InsolvencyRecord[] = [];

    // Look for insolvency entries in the HTML
    // Pattern: table rows with insolvency data
    const entryPattern =
      /<tr[^>]*class="[^"]*resultaat[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
    const matches = html.matchAll(entryPattern);

    for (const match of matches) {
      const rowHtml = match[1];

      // Extract data from row
      const naamMatch = rowHtml.match(/<td[^>]*class="[^"]*naam[^"]*"[^>]*>([^<]+)<\/td>/i);
      const typeMatch = rowHtml.match(/<td[^>]*class="[^"]*type[^"]*"[^>]*>([^<]+)<\/td>/i);
      const datumMatch = rowHtml.match(/<td[^>]*class="[^"]*datum[^"]*"[^>]*>([^<]+)<\/td>/i);
      const rechtbankMatch = rowHtml.match(/<td[^>]*class="[^"]*rechtbank[^"]*"[^>]*>([^<]+)<\/td>/i);
      const nummerMatch = rowHtml.match(/<td[^>]*class="[^"]*nummer[^"]*"[^>]*>([^<]+)<\/td>/i);
      const linkMatch = rowHtml.match(/href="([^"]+)"/i);

      if (naamMatch || typeMatch) {
        const record: InsolvencyRecord = {
          publicatieNummer: nummerMatch?.[1]?.trim() || `REC-${Date.now()}`,
          type: typeMatch ? parseInsolvencyType(typeMatch[1]) : "faillissement",
          status: "uitgesproken",
          datumUitspraak: datumMatch?.[1]?.trim() || new Date().toISOString().split("T")[0],
          rechtbank: rechtbankMatch?.[1]?.trim() || "Onbekend",
          insolventienummer: nummerMatch?.[1]?.trim() || "",
          schuldenaar: {
            naam: naamMatch?.[1]?.trim() || companyName,
            kvkNummer: kvkNummer || undefined,
          },
          publicatieUrl: linkMatch?.[1]
            ? new URL(linkMatch[1], "https://www.rechtspraak.nl").href
            : `${RECHTSPRAAK_SEARCH_URL}?${searchParams.toString()}`,
        };
        records.push(record);
      }
    }

    return records;
  } catch (error) {
    console.error("[Bankruptcy] Web interface search failed:", error);
    return [];
  }
}

/**
 * Alternative: Search using Google for rechtspraak.nl results
 */
async function searchViaGoogle(companyName: string): Promise<InsolvencyRecord[]> {
  // This is a fallback that searches for bankruptcy announcements
  // via search engines as the API may not always be available
  try {
    const query = `site:rechtspraak.nl "${companyName}" faillissement OR surseance`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Note: This would require a proper search API or be rate-limited
    // For now, we'll return empty and rely on the web interface
    return [];
  } catch {
    return [];
  }
}

// =============================================================================
// PUBLIC FUNCTIONS
// =============================================================================

/**
 * Check bankruptcy status for a company
 *
 * @param kvkNummer - KVK number (optional)
 * @param companyName - Company name (required if no KVK)
 * @returns Bankruptcy info or null if no bankruptcy found
 */
export async function checkBankruptcyStatus(
  kvkNummer?: string,
  companyName?: string
): Promise<BankruptcyInfo | null> {
  if (!kvkNummer && !companyName) {
    throw new KvkSourceError(
      "KVK nummer of bedrijfsnaam is vereist",
      "rechtspraak",
      "INVALID_INPUT",
      false
    );
  }

  const cacheKey = CacheKeys.bankruptcy(kvkNummer || companyName!);

  // Check if already cached as not found
  if (await isNotFoundCached(cacheKey)) {
    return null;
  }

  // Check rate limit
  const rateStatus = await checkRateLimit("rechtspraak", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      `Rate limited. Try again in ${Math.ceil((rateStatus.resetAt - Date.now()) / 1000)} seconds`,
      "rechtspraak",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  const result = await getCachedOrFetch<BankruptcyInfo | null>(
    cacheKey,
    async () => {
      // Try web interface search
      const records = await searchViaWebInterface(kvkNummer || "", companyName || "");

      if (records.length === 0) {
        // No bankruptcy found - cache negative result
        await cacheNotFound(cacheKey, "rechtspraak");
        return null;
      }

      // Return the most recent/relevant record
      const mostRecent = records[0];

      const bankruptcyInfo: BankruptcyInfo = {
        status: parseStatus(mostRecent.status),
        type: mostRecent.type,
        datum: mostRecent.datumUitspraak,
        curator: mostRecent.curator?.naam || null,
        bewindvoerder: mostRecent.bewindvoerder?.naam || null,
        rechtbank: mostRecent.rechtbank,
        publicatieNummer: mostRecent.publicatieNummer,
        publicatieUrl: mostRecent.publicatieUrl,
      };

      return bankruptcyInfo;
    },
    CacheTTL.BANKRUPTCY,
    "rechtspraak"
  );

  return result.data;
}

/**
 * Get all insolvency records for a company (not just the most recent)
 */
export async function getAllInsolvencyRecords(
  kvkNummer?: string,
  companyName?: string
): Promise<InsolvencyRecord[]> {
  if (!kvkNummer && !companyName) {
    return [];
  }

  // Check rate limit
  const rateStatus = await checkRateLimit("rechtspraak", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      "Rate limited",
      "rechtspraak",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  return searchViaWebInterface(kvkNummer || "", companyName || "");
}

/**
 * Quick bankruptcy check - returns boolean
 */
export async function hasBankruptcy(
  kvkNummer?: string,
  companyName?: string
): Promise<boolean> {
  const status = await checkBankruptcyStatus(kvkNummer, companyName);
  return status !== null && status.status === "actief";
}

/**
 * Get risk indicator based on bankruptcy status
 */
export function getBankruptcyRiskIndicator(
  bankruptcyInfo: BankruptcyInfo | null
): "laag" | "gemiddeld" | "hoog" | "kritiek" | null {
  if (!bankruptcyInfo) {
    return null; // No data, can't assess
  }

  if (bankruptcyInfo.status === "actief") {
    if (bankruptcyInfo.type === "faillissement") {
      return "kritiek";
    }
    if (bankruptcyInfo.type === "surseance") {
      return "hoog";
    }
    if (bankruptcyInfo.type === "schuldsanering") {
      return "hoog";
    }
  }

  // Past bankruptcy that has ended
  if (bankruptcyInfo.status === "beeindigd") {
    // Check how recent
    const endDate = new Date(bankruptcyInfo.datum);
    const yearsAgo = (Date.now() - endDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    if (yearsAgo < 2) return "gemiddeld";
    if (yearsAgo < 5) return "laag";
    return null; // Old enough to not matter
  }

  return null;
}

/**
 * Get source attribution
 */
export function getSourceAttribution() {
  return {
    name: "Centraal Insolventieregister (rechtspraak.nl)",
    url: "https://www.rechtspraak.nl/Registers/Paginas/Insolventies.aspx",
    lastUpdated: null, // Real-time
    license: "Public Government Data",
  };
}

/**
 * Health check for the bankruptcy service
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  responseTime: number;
  error?: string;
}> {
  const start = Date.now();

  try {
    const response = await fetch(RECHTSPRAAK_SEARCH_URL, {
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
