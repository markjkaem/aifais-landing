/**
 * OpenKVK Client
 *
 * Primary data source for Dutch company information.
 * Uses the free overheid.io API which provides access to 5+ million companies.
 *
 * API Documentation: https://overheid.io/documentatie/openkvk
 *
 * Features:
 * - Search by company name, KVK number, postcode, SBI code
 * - Daily updated data
 * - Free tier with optional API key for higher limits
 */

import {
  KvkSourceError,
  type CompanySearchResult,
  type KvkCoreData,
  type OpenKvkApiResponse,
  type OpenKvkApiResult,
  type RateLimitConfig,
  type SbiCode,
  type Address,
  type EmployeeRange,
} from "../types";
import { CacheKeys, CacheTTL } from "../cache/cache-keys";
import { getCachedOrFetch, checkRateLimit, cacheNotFound, isNotFoundCached } from "../cache/redis-cache";

// =============================================================================
// CONFIGURATION
// =============================================================================

const OPENKVK_BASE_URL = "https://api.overheid.io/openkvk";
const OPENKVK_SUGGEST_URL = "https://api.overheid.io/suggest/openkvk";
const OPENKVK_API_KEY = process.env.OPENKVK_API_KEY;

const RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 100 requests per minute
};

const USER_AGENT = "AIFAIS Business Intelligence/2.0 (https://aifais.com)";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Build headers for OpenKVK API requests
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    "User-Agent": USER_AGENT,
  };

  if (OPENKVK_API_KEY) {
    headers["ovio-api-key"] = OPENKVK_API_KEY;
  }

  return headers;
}

/**
 * Parse rechtsvorm from type string
 */
function parseRechtsvorm(type: string | undefined): string | null {
  if (!type) return null;

  const mappings: Record<string, string> = {
    bv: "Besloten Vennootschap",
    nv: "Naamloze Vennootschap",
    vof: "Vennootschap Onder Firma",
    cv: "Commanditaire Vennootschap",
    eenmanszaak: "Eenmanszaak",
    stichting: "Stichting",
    vereniging: "Vereniging",
    cooperatie: "Coöperatie",
    maatschap: "Maatschap",
    rechtspersoon: "Rechtspersoon",
  };

  const normalized = type.toLowerCase().replace(/[^a-z]/g, "");
  return mappings[normalized] || type;
}

/**
 * Determine company type from rechtsvorm
 */
function determineCompanyType(
  rechtsvorm: string | null
): "rechtspersoon" | "eenmanszaak" | "vof" | "cv" | "maatschap" | "overig" {
  if (!rechtsvorm) return "overig";

  const lower = rechtsvorm.toLowerCase();
  if (lower.includes("eenmanszaak")) return "eenmanszaak";
  if (lower.includes("vof") || lower.includes("vennootschap onder firma")) return "vof";
  if (lower.includes("cv") || lower.includes("commanditaire")) return "cv";
  if (lower.includes("maatschap")) return "maatschap";
  if (
    lower.includes("bv") ||
    lower.includes("nv") ||
    lower.includes("stichting") ||
    lower.includes("vereniging")
  ) {
    return "rechtspersoon";
  }
  return "overig";
}

/**
 * Parse SBI codes from API response
 */
function parseSbiCodes(
  sbiActiviteiten: string[] | undefined,
  hoofdactiviteit: string | undefined
): SbiCode[] {
  if (!sbiActiviteiten || sbiActiviteiten.length === 0) {
    return [];
  }

  return sbiActiviteiten.map((code, index) => ({
    code: code.replace(/\D/g, ""), // Extract numeric part
    omschrijving: "", // Will be enriched by SBI lookup
    isHoofdactiviteit: index === 0 || code === hoofdactiviteit,
    sectie: getSbiSection(code),
  }));
}

/**
 * Get CBS section letter from SBI code
 */
function getSbiSection(code: string): string {
  const numericCode = parseInt(code.replace(/\D/g, ""), 10);

  // CBS SBI 2008 section mapping
  if (numericCode >= 1 && numericCode <= 3) return "A"; // Landbouw
  if (numericCode >= 5 && numericCode <= 9) return "B"; // Winning delfstoffen
  if (numericCode >= 10 && numericCode <= 33) return "C"; // Industrie
  if (numericCode >= 35 && numericCode <= 35) return "D"; // Energie
  if (numericCode >= 36 && numericCode <= 39) return "E"; // Water/afval
  if (numericCode >= 41 && numericCode <= 43) return "F"; // Bouw
  if (numericCode >= 45 && numericCode <= 47) return "G"; // Handel
  if (numericCode >= 49 && numericCode <= 53) return "H"; // Vervoer
  if (numericCode >= 55 && numericCode <= 56) return "I"; // Horeca
  if (numericCode >= 58 && numericCode <= 63) return "J"; // Informatie/communicatie
  if (numericCode >= 64 && numericCode <= 66) return "K"; // Financieel
  if (numericCode >= 68 && numericCode <= 68) return "L"; // Vastgoed
  if (numericCode >= 69 && numericCode <= 75) return "M"; // Specialistische diensten
  if (numericCode >= 77 && numericCode <= 82) return "N"; // Administratieve diensten
  if (numericCode >= 84 && numericCode <= 84) return "O"; // Overheid
  if (numericCode >= 85 && numericCode <= 85) return "P"; // Onderwijs
  if (numericCode >= 86 && numericCode <= 88) return "Q"; // Gezondheid/welzijn
  if (numericCode >= 90 && numericCode <= 93) return "R"; // Cultuur/recreatie
  if (numericCode >= 94 && numericCode <= 96) return "S"; // Overige diensten
  if (numericCode >= 97 && numericCode <= 98) return "T"; // Huishoudens
  if (numericCode >= 99 && numericCode <= 99) return "U"; // Extraterritoriale organisaties

  return "?";
}

/**
 * Build full address string
 */
function buildFullAddress(result: OpenKvkApiResult): string {
  const parts: string[] = [];

  if (result.straat) {
    let streetPart = result.straat;
    if (result.huisnummer) {
      streetPart += ` ${result.huisnummer}`;
      if (result.huisnummertoevoeging) {
        streetPart += result.huisnummertoevoeging;
      }
    }
    parts.push(streetPart);
  }

  if (result.postcode && result.plaats) {
    parts.push(`${result.postcode} ${result.plaats}`);
  } else if (result.plaats) {
    parts.push(result.plaats);
  }

  return parts.join(", ") || "Adres onbekend";
}

/**
 * Determine province from plaats (simplified mapping)
 */
function determineProvince(plaats: string | undefined): string | null {
  if (!plaats) return null;

  // Major cities mapping (simplified)
  const cityProvinceMap: Record<string, string> = {
    amsterdam: "Noord-Holland",
    rotterdam: "Zuid-Holland",
    "den haag": "Zuid-Holland",
    "'s-gravenhage": "Zuid-Holland",
    utrecht: "Utrecht",
    eindhoven: "Noord-Brabant",
    tilburg: "Noord-Brabant",
    groningen: "Groningen",
    almere: "Flevoland",
    breda: "Noord-Brabant",
    nijmegen: "Gelderland",
    arnhem: "Gelderland",
    haarlem: "Noord-Holland",
    enschede: "Overijssel",
    maastricht: "Limburg",
    leeuwarden: "Friesland",
    zwolle: "Overijssel",
    middelburg: "Zeeland",
    lelystad: "Flevoland",
    assen: "Drenthe",
  };

  const normalized = plaats.toLowerCase().trim();
  return cityProvinceMap[normalized] || null;
}

/**
 * Transform OpenKVK API result to our search result format
 */
function transformToSearchResult(result: OpenKvkApiResult): CompanySearchResult {
  const rechtsvorm = parseRechtsvorm(result.type || result.rechtsvorm);

  // API returns dossiernummer, not kvk
  const kvkNummer = result.dossiernummer || result.kvk || "";

  return {
    kvkNummer,
    naam: result.handelsnaam || result.statutaireNaam || "Onbekend",
    handelsnamen: result.handelsnamen || [result.handelsnaam].filter(Boolean) as string[],
    adres: {
      postcode: result.postcode || null,
      plaats: result.plaats || null,
      volledig: buildFullAddress(result),
    },
    sbiCodes: result.sbiActiviteiten || [],
    hoofdactiviteit: result.hoofdactiviteit || null,
    actief: result.actief !== false && !result.einddatum,
    type: determineCompanyType(rechtsvorm),
  };
}

/**
 * Transform OpenKVK API result to core data format
 */
function transformToCoreData(result: OpenKvkApiResult): KvkCoreData {
  const rechtsvorm = parseRechtsvorm(result.type || result.rechtsvorm);

  // API returns dossiernummer, not kvk
  const kvkNummer = result.dossiernummer || result.kvk || "";

  return {
    kvkNummer,
    naam: result.handelsnaam || result.statutaireNaam || "Onbekend",
    handelsnamen: result.handelsnamen || [result.handelsnaam].filter(Boolean) as string[],
    rechtsvorm,
    oprichtingsdatum: result.startdatum || null,
    actief: result.actief !== false && !result.einddatum,
    sbiCodes: parseSbiCodes(result.sbiActiviteiten, result.hoofdactiviteit),
    aantalMedewerkers: null, // Not available in OpenKVK basic data
    hoofdactiviteit: result.hoofdactiviteit || null,
    rsin: result.rsin || null,
    vestigingsnummer: result.vestigingsnummer || null,
  };
}

/**
 * Transform OpenKVK API result to address format
 */
function transformToAddress(result: OpenKvkApiResult): Address {
  return {
    straat: result.straat || null,
    huisnummer: result.huisnummer || null,
    huisnummerToevoeging: result.huisnummertoevoeging || null,
    postcode: result.postcode || null,
    plaats: result.plaats || null,
    provincie: determineProvince(result.plaats),
    land: "Nederland",
    volledig: buildFullAddress(result),
    geoLocatie: null, // Could be enriched with geo service
  };
}

// =============================================================================
// SUGGEST API TYPES
// =============================================================================

interface SuggestResult {
  text: string;
  dossiernummer: string;
  link: string;
  id: string;
  handelsnaam: string;
  plaats?: string;
}

interface SuggestResponse {
  handelsnaam?: SuggestResult[];
}

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

/**
 * Fetch full company details by ID (link from suggest results)
 */
async function fetchCompanyDetails(companyId: string): Promise<OpenKvkApiResult | null> {
  const url = `${OPENKVK_BASE_URL}/${companyId}`;

  const response = await fetch(url, {
    headers: getHeaders(),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new KvkSourceError(
      `OpenKVK API error: ${response.status}`,
      "openkvk",
      "UNAVAILABLE",
      true
    );
  }

  return response.json();
}

/**
 * Search companies by name using the /suggest endpoint
 * This is the correct way to search for companies by name in OpenKVK
 */
export async function searchByName(
  query: string,
  plaats?: string,
  inclusiefInactief: boolean = false
): Promise<CompanySearchResult[]> {
  // Check rate limit
  const rateStatus = await checkRateLimit("openkvk", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      `Rate limited. Try again in ${Math.ceil((rateStatus.resetAt - Date.now()) / 1000)} seconds`,
      "openkvk",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  // Build cache key
  const filters = { plaats: plaats || "", actief: inclusiefInactief ? "all" : "true" };
  const cacheKey = CacheKeys.search(query, "naam", filters);

  // Try cache
  const result = await getCachedOrFetch<CompanySearchResult[]>(
    cacheKey,
    async () => {
      // Use the /suggest endpoint for name search
      const url = `${OPENKVK_SUGGEST_URL}/${encodeURIComponent(query.toLowerCase())}`;

      const response = await fetch(url, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        if (response.status === 429) {
          throw new KvkSourceError(
            "OpenKVK rate limit exceeded",
            "openkvk",
            "RATE_LIMITED",
            true
          );
        }
        throw new KvkSourceError(
          `OpenKVK API error: ${response.status} ${response.statusText}`,
          "openkvk",
          "UNAVAILABLE",
          true
        );
      }

      const suggestData: SuggestResponse = await response.json();
      const suggestions = suggestData.handelsnaam || [];

      // Filter empty results
      if (suggestions.length === 0) {
        return [];
      }

      // Filter by plaats if specified
      let filtered = suggestions;
      if (plaats) {
        const plaatsLower = plaats.toLowerCase();
        filtered = suggestions.filter((s) =>
          s.plaats?.toLowerCase().includes(plaatsLower)
        );
      }

      // Fetch full details for each unique company (by dossiernummer)
      // Dedupe by dossiernummer to avoid fetching same company multiple times
      const uniqueByKvk = new Map<string, SuggestResult>();
      for (const suggestion of filtered) {
        if (!uniqueByKvk.has(suggestion.dossiernummer)) {
          uniqueByKvk.set(suggestion.dossiernummer, suggestion);
        }
      }

      // Limit to first 25 unique companies to avoid too many requests
      const uniqueSuggestions = Array.from(uniqueByKvk.values()).slice(0, 25);

      // Fetch details in parallel (max 5 concurrent)
      const results: CompanySearchResult[] = [];
      const batchSize = 5;

      for (let i = 0; i < uniqueSuggestions.length; i += batchSize) {
        const batch = uniqueSuggestions.slice(i, i + batchSize);
        const detailsPromises = batch.map(async (suggestion) => {
          try {
            const details = await fetchCompanyDetails(suggestion.id);
            if (details) {
              return transformToSearchResult(details);
            }
            // Fallback to basic data from suggestion
            return {
              kvkNummer: suggestion.dossiernummer,
              naam: suggestion.handelsnaam,
              handelsnamen: [suggestion.handelsnaam],
              adres: {
                postcode: null,
                plaats: suggestion.plaats || null,
                volledig: suggestion.plaats || "Adres onbekend",
              },
              sbiCodes: [],
              hoofdactiviteit: null,
              actief: true, // Assume active if in suggest results
              type: "overig" as const,
            };
          } catch {
            // On error, use basic suggestion data
            return {
              kvkNummer: suggestion.dossiernummer,
              naam: suggestion.handelsnaam,
              handelsnamen: [suggestion.handelsnaam],
              adres: {
                postcode: null,
                plaats: suggestion.plaats || null,
                volledig: suggestion.plaats || "Adres onbekend",
              },
              sbiCodes: [],
              hoofdactiviteit: null,
              actief: true,
              type: "overig" as const,
            };
          }
        });

        const batchResults = await Promise.all(detailsPromises);
        results.push(...batchResults);
      }

      // Filter inactive if needed
      if (!inclusiefInactief) {
        return results.filter((r) => r.actief);
      }

      return results;
    },
    CacheTTL.SEARCH_RESULTS,
    "openkvk"
  );

  return result.data;
}

/**
 * Search by KVK number
 */
export async function searchByKvkNummer(kvkNummer: string): Promise<CompanySearchResult | null> {
  // Validate KVK number format
  const cleanKvk = kvkNummer.replace(/\D/g, "");
  if (cleanKvk.length !== 8) {
    throw new KvkSourceError(
      "KVK nummer moet 8 cijfers bevatten",
      "openkvk",
      "INVALID_INPUT",
      false
    );
  }

  // Check if we already know this doesn't exist
  const notFoundKey = CacheKeys.company(cleanKvk);
  if (await isNotFoundCached(notFoundKey)) {
    return null;
  }

  // Check rate limit
  const rateStatus = await checkRateLimit("openkvk", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      `Rate limited. Try again in ${Math.ceil((rateStatus.resetAt - Date.now()) / 1000)} seconds`,
      "openkvk",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  const cacheKey = CacheKeys.search(cleanKvk, "kvkNummer");

  const result = await getCachedOrFetch<CompanySearchResult | null>(
    cacheKey,
    async () => {
      // OpenKVK uses 'filters[dossiernummer]' or direct query for KVK lookup
      const params = new URLSearchParams();
      params.append("filters[dossiernummer]", cleanKvk);
      params.append("fields[]", "dossiernummer");
      params.append("fields[]", "handelsnaam");
      params.append("fields[]", "postcode");
      params.append("fields[]", "plaats");
      params.append("fields[]", "straat");
      params.append("fields[]", "huisnummer");
      params.append("fields[]", "type");
      params.append("fields[]", "actief");

      const url = `${OPENKVK_BASE_URL}?${params.toString()}`;

      const response = await fetch(url, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        if (response.status === 404) {
          await cacheNotFound(notFoundKey, "openkvk");
          return null;
        }
        throw new KvkSourceError(
          `OpenKVK API error: ${response.status}`,
          "openkvk",
          "UNAVAILABLE",
          true
        );
      }

      const data: OpenKvkApiResponse = await response.json();
      const results = data._embedded?.bedrijf || [];

      if (results.length === 0) {
        await cacheNotFound(notFoundKey, "openkvk");
        return null;
      }

      return transformToSearchResult(results[0]);
    },
    CacheTTL.SEARCH_RESULTS,
    "openkvk"
  );

  return result.data;
}

/**
 * Search by postcode (optionally filtered by SBI code)
 */
export async function searchByPostcode(
  postcode: string,
  sbiCode?: string,
  inclusiefInactief: boolean = false
): Promise<CompanySearchResult[]> {
  // Validate postcode format
  const cleanPostcode = postcode.toUpperCase().replace(/\s/g, "");
  if (!/^\d{4}[A-Z]{2}$/.test(cleanPostcode)) {
    throw new KvkSourceError(
      "Postcode moet formaat 1234AB hebben",
      "openkvk",
      "INVALID_INPUT",
      false
    );
  }

  // Check rate limit
  const rateStatus = await checkRateLimit("openkvk", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      `Rate limited. Try again in ${Math.ceil((rateStatus.resetAt - Date.now()) / 1000)} seconds`,
      "openkvk",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  const filters = { sbi: sbiCode || "", actief: inclusiefInactief ? "all" : "true" };
  const cacheKey = CacheKeys.search(cleanPostcode, "postcode", filters);

  const result = await getCachedOrFetch<CompanySearchResult[]>(
    cacheKey,
    async () => {
      const params = new URLSearchParams();
      params.append("filters[postcode]", cleanPostcode);
      params.append("fields[]", "dossiernummer");
      params.append("fields[]", "handelsnaam");
      params.append("fields[]", "postcode");
      params.append("fields[]", "plaats");
      params.append("fields[]", "straat");
      params.append("fields[]", "huisnummer");
      params.append("fields[]", "type");
      params.append("fields[]", "actief");

      const url = `${OPENKVK_BASE_URL}?${params.toString()}`;

      const response = await fetch(url, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new KvkSourceError(
          `OpenKVK API error: ${response.status}`,
          "openkvk",
          "UNAVAILABLE",
          true
        );
      }

      const data: OpenKvkApiResponse = await response.json();
      let results = (data._embedded?.bedrijf || []).map(transformToSearchResult);

      // Filter by SBI code if provided
      if (sbiCode) {
        results = results.filter((r) =>
          r.sbiCodes.some((code) => code.startsWith(sbiCode))
        );
      }

      // Filter inactive if needed
      if (!inclusiefInactief) {
        results = results.filter((r) => r.actief);
      }

      return results;
    },
    CacheTTL.SEARCH_RESULTS,
    "openkvk"
  );

  return result.data;
}

/**
 * Search by SBI code (optionally filtered by location)
 */
export async function searchBySbiCode(
  sbiCode: string,
  plaats?: string,
  inclusiefInactief: boolean = false
): Promise<CompanySearchResult[]> {
  // Validate SBI code format (2-5 digits)
  const cleanSbi = sbiCode.replace(/\D/g, "");
  if (cleanSbi.length < 2 || cleanSbi.length > 5) {
    throw new KvkSourceError(
      "SBI code moet 2-5 cijfers bevatten",
      "openkvk",
      "INVALID_INPUT",
      false
    );
  }

  // Check rate limit
  const rateStatus = await checkRateLimit("openkvk", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      `Rate limited. Try again in ${Math.ceil((rateStatus.resetAt - Date.now()) / 1000)} seconds`,
      "openkvk",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  const filters = { plaats: plaats || "", actief: inclusiefInactief ? "all" : "true" };
  const cacheKey = CacheKeys.search(cleanSbi, "sbiCode", filters);

  const result = await getCachedOrFetch<CompanySearchResult[]>(
    cacheKey,
    async () => {
      // OpenKVK uses query with sbi filter
      const params = new URLSearchParams();
      params.append("query", `${cleanSbi}*`);
      params.append("queryfields[]", "sbi");
      params.append("fields[]", "dossiernummer");
      params.append("fields[]", "handelsnaam");
      params.append("fields[]", "postcode");
      params.append("fields[]", "plaats");
      params.append("fields[]", "straat");
      params.append("fields[]", "huisnummer");
      params.append("fields[]", "type");
      params.append("fields[]", "actief");

      if (plaats) {
        params.append("filters[plaats]", plaats);
      }

      const url = `${OPENKVK_BASE_URL}?${params.toString()}`;

      const response = await fetch(url, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new KvkSourceError(
          `OpenKVK API error: ${response.status}`,
          "openkvk",
          "UNAVAILABLE",
          true
        );
      }

      const data: OpenKvkApiResponse = await response.json();
      let results = (data._embedded?.bedrijf || []).map(transformToSearchResult);

      if (!inclusiefInactief) {
        results = results.filter((r) => r.actief);
      }

      return results;
    },
    CacheTTL.SEARCH_RESULTS,
    "openkvk"
  );

  return result.data;
}

/**
 * Get full company data by KVK number
 */
export async function getCompanyByKvk(kvkNummer: string): Promise<{
  core: KvkCoreData;
  adres: Address;
} | null> {
  // Validate KVK number format
  const cleanKvk = kvkNummer.replace(/\D/g, "");
  if (cleanKvk.length !== 8) {
    throw new KvkSourceError(
      "KVK nummer moet 8 cijfers bevatten",
      "openkvk",
      "INVALID_INPUT",
      false
    );
  }

  // Check if we already know this doesn't exist
  const notFoundKey = CacheKeys.company(cleanKvk);
  if (await isNotFoundCached(notFoundKey)) {
    return null;
  }

  // Check rate limit
  const rateStatus = await checkRateLimit("openkvk", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      `Rate limited. Try again in ${Math.ceil((rateStatus.resetAt - Date.now()) / 1000)} seconds`,
      "openkvk",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  const cacheKey = CacheKeys.company(cleanKvk);

  const result = await getCachedOrFetch<{ core: KvkCoreData; adres: Address } | null>(
    cacheKey,
    async () => {
      // Use filters[dossiernummer] for exact KVK lookup
      const params = new URLSearchParams();
      params.append("filters[dossiernummer]", cleanKvk);
      // Request all available fields for full profile
      params.append("fields[]", "dossiernummer");
      params.append("fields[]", "handelsnaam");
      params.append("fields[]", "handelsnamen");
      params.append("fields[]", "postcode");
      params.append("fields[]", "plaats");
      params.append("fields[]", "straat");
      params.append("fields[]", "huisnummer");
      params.append("fields[]", "huisnummertoevoeging");
      params.append("fields[]", "type");
      params.append("fields[]", "rechtsvorm");
      params.append("fields[]", "actief");
      params.append("fields[]", "startdatum");
      params.append("fields[]", "rsin");
      params.append("fields[]", "vestigingsnummer");

      const url = `${OPENKVK_BASE_URL}?${params.toString()}`;

      const response = await fetch(url, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        if (response.status === 404) {
          await cacheNotFound(notFoundKey, "openkvk");
          return null;
        }
        throw new KvkSourceError(
          `OpenKVK API error: ${response.status}`,
          "openkvk",
          "UNAVAILABLE",
          true
        );
      }

      const data: OpenKvkApiResponse = await response.json();
      const results = data._embedded?.bedrijf || [];

      if (results.length === 0) {
        await cacheNotFound(notFoundKey, "openkvk");
        return null;
      }

      const apiResult = results[0];
      return {
        core: transformToCoreData(apiResult),
        adres: transformToAddress(apiResult),
      };
    },
    CacheTTL.COMPANY_BASIC,
    "openkvk"
  );

  return result.data;
}

/**
 * Check if OpenKVK service is healthy
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  responseTime: number;
  error?: string;
}> {
  const start = Date.now();

  try {
    // Use a known company (Coolblue B.V.) for health check
    const response = await fetch(`${OPENKVK_BASE_URL}?filters[dossiernummer]=30181992`, {
      headers: getHeaders(),
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

/**
 * Get source attribution for OpenKVK
 */
export function getSourceAttribution() {
  return {
    name: "OpenKVK (overheid.io)",
    url: "https://openkvk.nl",
    lastUpdated: null, // Updated daily
    license: "Open Data",
  };
}
