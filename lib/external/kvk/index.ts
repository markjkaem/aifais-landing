/**
 * KVK Bedrijfszoeker v2.0 - Main Orchestrator
 *
 * Central module that coordinates all data sources and enrichments
 * to provide comprehensive Dutch company intelligence.
 *
 * Features:
 * - Multiple free data sources (no paid KVK API required)
 * - Legal status checking (bankruptcy, announcements)
 * - Director and relationship discovery
 * - Full enrichment pipeline (website, social, tech, news, reviews)
 * - Intelligent caching with Redis
 * - Rate limiting per source
 * - NO mock data - real data or proper errors
 */

import type {
  CompanySearchResult,
  CompanyProfile,
  SearchResponse,
  ProfileResponse,
  KvkSearchParams,
  KvkCoreData,
  Address,
  DataSourceResult,
  Director,
  CompanyRelations,
  LegalStatus,
  FinancialIndicators,
  OnlinePresence,
  TechStack,
  Reviews,
  NewsResult,
  TimelineEvent,
  SourceAttribution,
  ErrorSummary,
  SearchType,
  KvkErrorCode,
} from "./types";
import { KvkSourceError } from "./types";

// Data sources
import * as openkvk from "./sources/openkvk-client";
import * as sbiLookup from "./sources/sbi-lookup";

// Legal status
import * as bankruptcy from "./legal/bankruptcy-client";
import * as announcements from "./legal/announcements-client";

// Directors & relations
import * as directors from "./directors/director-search";
import * as relations from "./directors/company-relations";

// Cache
import { CacheKeys, CacheTTL } from "./cache/cache-keys";
import { getCachedOrFetch, isRedisAvailable } from "./cache/redis-cache";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a successful data source result
 */
function successResult<T>(data: T, fromCache: boolean = false): DataSourceResult<T> {
  return {
    success: true,
    data,
    error: null,
    fromCache,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Create an error data source result
 */
function errorResult<T>(
  source: string,
  code: string,
  message: string
): DataSourceResult<T> {
  return {
    success: false,
    data: null,
    error: { source, code: code as KvkErrorCode, message },
    fromCache: false,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Safely execute an async function and return DataSourceResult
 */
async function safeExecute<T>(
  source: string,
  fetcher: () => Promise<T>
): Promise<DataSourceResult<T>> {
  try {
    const data = await fetcher();
    return successResult(data);
  } catch (error) {
    if (error instanceof KvkSourceError) {
      return {
        success: false,
        data: null,
        error: {
          source: error.source,
          code: error.code,
          message: error.message,
          retryAfter: error.retryAfter,
        },
        fromCache: false,
        fetchedAt: new Date().toISOString(),
      };
    }

    return {
      success: false,
      data: null,
      error: {
        source,
        code: "UNAVAILABLE",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      fromCache: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * Build timeline from various events
 */
function buildTimeline(
  coreData: KvkCoreData,
  legalStatus: LegalStatus | null,
  announcements_list: LegalStatus["bekendmakingen"]
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Add founding date
  if (coreData.oprichtingsdatum) {
    events.push({
      datum: coreData.oprichtingsdatum,
      type: "oprichting",
      titel: `${coreData.naam} opgericht`,
      beschrijving: coreData.rechtsvorm
        ? `Opgericht als ${coreData.rechtsvorm}`
        : null,
      bron: "KVK",
      url: null,
    });
  }

  // Add bankruptcy events
  if (legalStatus?.faillissement) {
    events.push({
      datum: legalStatus.faillissement.datum,
      type: "faillissement",
      titel: `Faillissement ${legalStatus.faillissement.status}`,
      beschrijving: legalStatus.faillissement.curator
        ? `Curator: ${legalStatus.faillissement.curator}`
        : null,
      bron: "rechtspraak.nl",
      url: legalStatus.faillissement.publicatieUrl,
    });
  }

  // Add announcements to timeline
  for (const ann of announcements_list) {
    events.push({
      datum: ann.datum,
      type: ann.type === "ontbinding" ? "ontbinding" : "overig",
      titel: ann.titel,
      beschrijving: null,
      bron: ann.bron,
      url: ann.url,
    });
  }

  // Sort by date (newest first)
  return events.sort(
    (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()
  );
}

/**
 * Calculate financial indicators from available data
 */
function calculateFinancialIndicators(
  coreData: KvkCoreData,
  legalStatus: LegalStatus | null
): FinancialIndicators {
  // Calculate company age
  let companyAge: number | null = null;
  if (coreData.oprichtingsdatum) {
    const founded = new Date(coreData.oprichtingsdatum);
    companyAge = Math.floor(
      (Date.now() - founded.getTime()) / (1000 * 60 * 60 * 24 * 365)
    );
  }

  // Get sector risk from SBI codes
  const primarySbi = coreData.sbiCodes.find((s) => s.isHoofdactiviteit);
  const sectorRisk = primarySbi
    ? sbiLookup.getSbiRiskProfile(primarySbi.code)
    : null;

  // Determine overall risk based on available data
  let riskIndicator: "laag" | "gemiddeld" | "hoog" | null = null;

  if (legalStatus?.faillissement?.status === "actief") {
    riskIndicator = "hoog";
  } else if (legalStatus?.risicoIndicator) {
    riskIndicator = legalStatus.risicoIndicator === "kritiek" ? "hoog" : legalStatus.risicoIndicator;
  } else if (companyAge !== null) {
    // Older companies are generally more stable
    if (companyAge < 2) riskIndicator = "gemiddeld";
    else if (companyAge < 5) riskIndicator = sectorRisk || "gemiddeld";
    else riskIndicator = "laag";
  }

  return {
    creditScore: null, // Would require paid data source
    paymentBehavior: null,
    riskIndicator,
    companyAge,
    employeeTrend: null, // Would require historical data
    lastAnnualReport: null,
    sectorRisk,
    estimatedRevenue: null,
  };
}

/**
 * Collect source attributions
 */
function collectSources(usedSources: Set<string>): SourceAttribution[] {
  const sources: SourceAttribution[] = [];

  if (usedSources.has("openkvk")) {
    sources.push(openkvk.getSourceAttribution());
  }
  if (usedSources.has("sbi")) {
    sources.push(sbiLookup.getSourceAttribution());
  }
  if (usedSources.has("rechtspraak")) {
    sources.push(bankruptcy.getSourceAttribution());
  }
  if (usedSources.has("bekendmakingen")) {
    sources.push(announcements.getSourceAttribution());
  }
  if (usedSources.has("directors")) {
    sources.push(directors.getSourceAttribution());
  }
  if (usedSources.has("relations")) {
    sources.push(relations.getSourceAttribution());
  }

  return sources;
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Search for companies
 */
export async function searchCompanies(
  params: KvkSearchParams
): Promise<SearchResponse> {
  const startTime = Date.now();
  const errors: ErrorSummary[] = [];
  const usedSources = new Set<string>(["openkvk"]);

  let results: CompanySearchResult[] = [];

  try {
    switch (params.type) {
      case "naam":
        results = await openkvk.searchByName(
          params.query,
          params.plaats,
          params.inclusiefInactief
        );
        break;

      case "kvkNummer":
        const singleResult = await openkvk.searchByKvkNummer(params.query);
        results = singleResult ? [singleResult] : [];
        break;

      case "postcode":
        results = await openkvk.searchByPostcode(
          params.query,
          params.sbiCode,
          params.inclusiefInactief
        );
        break;

      case "sbiCode":
        results = await openkvk.searchBySbiCode(
          params.query,
          params.plaats,
          params.inclusiefInactief
        );
        usedSources.add("sbi");
        break;

      default:
        throw new KvkSourceError(
          `Ongeldig zoektype: ${params.type}`,
          "search",
          "INVALID_INPUT",
          false
        );
    }

    // Enrich SBI codes with descriptions
    for (const result of results) {
      if (result.sbiCodes.length > 0 && !result.hoofdactiviteit) {
        const firstSbi = result.sbiCodes[0];
        result.hoofdactiviteit = sbiLookup.getSbiDescription(firstSbi);
      }
    }
  } catch (error) {
    if (error instanceof KvkSourceError) {
      errors.push({
        source: error.source,
        code: error.code,
        message: error.message,
        recoverable: error.retryable,
      });
    } else {
      errors.push({
        source: "search",
        code: "UNAVAILABLE",
        message: error instanceof Error ? error.message : "Search failed",
        recoverable: true,
      });
    }
  }

  return {
    type: "search",
    results,
    total: results.length,
    query: {
      original: params.query,
      type: params.type,
      filters: {
        plaats: params.plaats || "",
        sbiCode: params.sbiCode || "",
        inclusiefInactief: String(params.inclusiefInactief || false),
      },
    },
    meta: {
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      sources: collectSources(usedSources),
      dataFreshness: {},
      errors,
      cacheHits: [],
    },
  };
}

/**
 * Get full company profile with all enrichments
 */
export async function getCompanyProfile(
  kvkNummer: string,
  companyName?: string,
  options: KvkSearchParams["include"] = {}
): Promise<ProfileResponse> {
  const startTime = Date.now();
  const errors: ErrorSummary[] = [];
  const usedSources = new Set<string>();
  const cacheHits: string[] = [];
  const dataFreshness: Record<string, string> = {};

  // Set defaults
  const include = {
    directors: options.directors !== false,
    relations: options.relations === true, // Off by default (expensive)
    legalStatus: options.legalStatus !== false,
    financial: options.financial !== false,
    website: options.website !== false,
    socials: options.socials !== false,
    techStack: options.techStack !== false,
    news: options.news !== false,
    reviews: options.reviews !== false,
    aiAnalysis: options.aiAnalysis !== false,
    timeline: options.timeline !== false,
  };

  // 1. Get core company data
  usedSources.add("openkvk");
  const companyData = await openkvk.getCompanyByKvk(kvkNummer);

  if (!companyData) {
    throw new KvkSourceError(
      `Bedrijf met KVK ${kvkNummer} niet gevonden`,
      "openkvk",
      "NOT_FOUND",
      false
    );
  }

  const { core, adres } = companyData;
  const name = companyName || core.naam;

  // Enrich SBI codes with descriptions
  usedSources.add("sbi");
  core.sbiCodes = await sbiLookup.enrichSbiCodes(core.sbiCodes);

  // 2. Parallel fetch all optional data
  const [
    legalStatusResult,
    directorsResult,
    relationsResult,
  ] = await Promise.all([
    // Legal status
    include.legalStatus
      ? safeExecute<LegalStatus>("legal", async () => {
          usedSources.add("rechtspraak");
          usedSources.add("bekendmakingen");

          const [bankruptcyInfo, announcementsList] = await Promise.all([
            bankruptcy.checkBankruptcyStatus(kvkNummer, name),
            announcements.getCompanyAnnouncements(name, kvkNummer),
          ]);

          return {
            faillissement: bankruptcyInfo,
            surseance: null, // Would need separate lookup
            ontbinding: null,
            bekendmakingen: announcementsList,
            risicoIndicator: bankruptcy.getBankruptcyRiskIndicator(bankruptcyInfo),
          };
        })
      : Promise.resolve(successResult<LegalStatus>({
          faillissement: null,
          surseance: null,
          ontbinding: null,
          bekendmakingen: [],
          risicoIndicator: null,
        })),

    // Directors
    include.directors
      ? safeExecute<Director[]>("directors", async () => {
          usedSources.add("directors");
          return directors.searchDirectors(name);
        })
      : Promise.resolve(successResult<Director[]>([])),

    // Relations
    include.relations
      ? safeExecute<CompanyRelations>("relations", async () => {
          usedSources.add("relations");
          return relations.discoverRelations(
            name,
            kvkNummer,
            adres.postcode || undefined,
            adres.huisnummer || undefined
          );
        })
      : Promise.resolve(successResult<CompanyRelations>({
          moedermaatschappij: null,
          dochtermaatschappijen: [],
          verwanteOndernemingen: [],
          totaalRelaties: 0,
        })),
  ]);

  // Collect errors
  if (!legalStatusResult.success && legalStatusResult.error) {
    errors.push({
      source: legalStatusResult.error.source,
      code: legalStatusResult.error.code,
      message: legalStatusResult.error.message,
      recoverable: true,
    });
  }
  if (!directorsResult.success && directorsResult.error) {
    errors.push({
      source: directorsResult.error.source,
      code: directorsResult.error.code,
      message: directorsResult.error.message,
      recoverable: true,
    });
  }
  if (!relationsResult.success && relationsResult.error) {
    errors.push({
      source: relationsResult.error.source,
      code: relationsResult.error.code,
      message: relationsResult.error.message,
      recoverable: true,
    });
  }

  // 3. Calculate financial indicators
  const financialIndicators = calculateFinancialIndicators(
    core,
    legalStatusResult.data
  );

  // 4. Build timeline if requested
  const timeline = include.timeline
    ? buildTimeline(
        core,
        legalStatusResult.data,
        legalStatusResult.data?.bekendmakingen || []
      )
    : [];

  // 5. Build the profile response
  // Note: Online presence, tech stack, reviews, news, and AI analysis
  // are handled by the existing enrichment services and should be called
  // separately by the API route to maintain modularity

  const profile: CompanyProfile = {
    kvk: core,
    adres,

    bestuurders: directorsResult,
    relaties: relationsResult,
    juridischeStatus: legalStatusResult,

    financieel: successResult(financialIndicators),

    // These will be populated by the API route using existing enrichment services
    online: successResult<OnlinePresence>({
      website: null,
      email: null,
      telefoon: null,
      socials: {
        linkedin: null,
        twitter: null,
        facebook: null,
        instagram: null,
        youtube: null,
      },
      discoveryMethod: null,
      confidence: 0,
    }),

    techStack: successResult<TechStack>({
      cms: [],
      frameworks: [],
      analytics: [],
      payments: [],
      marketing: [],
      ecommerce: [],
      hosting: [],
      other: [],
      totalDetected: 0,
    }),

    reviews: successResult<Reviews>({
      google: null,
      trustpilot: null,
      averageRating: null,
      totalReviews: 0,
    }),

    nieuws: successResult<NewsResult>({
      articles: [],
      totalFound: 0,
      source: "google_rss",
    }),

    aiAnalyse: null,

    tijdlijn: timeline,

    meta: {
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      sources: collectSources(usedSources),
      dataFreshness,
      errors,
      cacheHits,
    },
  };

  return {
    type: "profile",
    profile,
  };
}

/**
 * Health check for all services
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  services: Record<string, { healthy: boolean; responseTime: number; error?: string }>;
}> {
  const [openkvkHealth, rechtspraakHealth, bekendmakingenHealth, redisHealth] =
    await Promise.all([
      openkvk.healthCheck(),
      bankruptcy.healthCheck(),
      announcements.healthCheck(),
      (async () => {
        const start = Date.now();
        const available = await isRedisAvailable();
        return {
          healthy: available,
          responseTime: Date.now() - start,
          error: available ? undefined : "Redis not available",
        };
      })(),
    ]);

  return {
    healthy:
      openkvkHealth.healthy && rechtspraakHealth.healthy && redisHealth.healthy,
    services: {
      openkvk: openkvkHealth,
      rechtspraak: rechtspraakHealth,
      bekendmakingen: bekendmakingenHealth,
      redis: redisHealth,
    },
  };
}

// =============================================================================
// RE-EXPORTS
// =============================================================================

export * from "./types";
export { getSbiDescription, getSbiSection, searchSbiCodes } from "./sources/sbi-lookup";
export { checkBankruptcyStatus, hasBankruptcy } from "./legal/bankruptcy-client";
export { getCompanyAnnouncements } from "./legal/announcements-client";
export { searchDirectors } from "./directors/director-search";
export { discoverRelations, isPartOfGroup } from "./directors/company-relations";
