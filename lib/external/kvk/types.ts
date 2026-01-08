/**
 * KVK Bedrijfszoeker v2.0 - Type Definitions
 *
 * Comprehensive types for the Dutch company intelligence platform.
 * All data sourced from free, public sources.
 */

// =============================================================================
// ERROR HANDLING
// =============================================================================

export type KvkErrorCode =
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "UNAVAILABLE"
  | "INVALID_INPUT"
  | "TIMEOUT"
  | "PARSE_ERROR";

export class KvkSourceError extends Error {
  constructor(
    message: string,
    public source: string,
    public code: KvkErrorCode,
    public retryable: boolean = false,
    public retryAfter?: number
  ) {
    super(message);
    this.name = "KvkSourceError";
  }
}

export interface DataSourceResult<T> {
  success: boolean;
  data: T | null;
  error: {
    source: string;
    code: KvkErrorCode;
    message: string;
    retryAfter?: number;
  } | null;
  fromCache: boolean;
  fetchedAt: string;
}

// =============================================================================
// CORE COMPANY DATA (from OpenKVK)
// =============================================================================

export interface SbiCode {
  code: string;
  omschrijving: string;
  isHoofdactiviteit: boolean;
  sectie: string; // 'A'..'U' CBS section letter
}

export type EmployeeRange =
  | "0"
  | "1"
  | "2-5"
  | "6-10"
  | "11-50"
  | "51-100"
  | "101-500"
  | "501-1000"
  | "1000+";

export interface KvkCoreData {
  kvkNummer: string;
  naam: string;
  handelsnamen: string[];
  rechtsvorm: string | null;
  oprichtingsdatum: string | null; // ISO date
  actief: boolean;
  sbiCodes: SbiCode[];
  aantalMedewerkers: EmployeeRange | null;
  hoofdactiviteit: string | null;
  rsin: string | null;
  vestigingsnummer: string | null;
}

export interface Address {
  straat: string | null;
  huisnummer: string | null;
  huisnummerToevoeging: string | null;
  postcode: string | null;
  plaats: string | null;
  provincie: string | null;
  land: string;
  volledig: string;
  geoLocatie: { lat: number; lng: number } | null;
}

// =============================================================================
// SEARCH RESULTS
// =============================================================================

export interface CompanySearchResult {
  kvkNummer: string;
  naam: string;
  handelsnamen: string[];
  adres: {
    postcode: string | null;
    plaats: string | null;
    volledig: string;
  };
  sbiCodes: string[];
  hoofdactiviteit: string | null;
  actief: boolean;
  type: "rechtspersoon" | "eenmanszaak" | "vof" | "cv" | "maatschap" | "overig";
}

export interface SearchResponse {
  type: "search";
  results: CompanySearchResult[];
  total: number;
  query: {
    original: string;
    type: SearchType;
    filters: Record<string, string>;
  };
  meta: ResponseMeta;
}

export type SearchType = "naam" | "kvkNummer" | "postcode" | "sbiCode";

// =============================================================================
// LEGAL STATUS
// =============================================================================

export interface BankruptcyInfo {
  status: "actief" | "beeindigd";
  type: "faillissement" | "surseance" | "schuldsanering" | "onbekend";
  datum: string; // ISO date
  curator: string | null;
  bewindvoerder: string | null;
  rechtbank: string | null;
  publicatieNummer: string | null;
  publicatieUrl: string | null;
}

export interface DissolutionInfo {
  status: "in_liquidatie" | "ontbonden" | "opgeheven";
  datum: string | null;
  reden: string | null;
}

export interface Announcement {
  type: "oprichting" | "ontbinding" | "fusie" | "naamswijziging" | "adreswijziging" | "overig";
  titel: string;
  datum: string; // ISO date
  url: string;
  bron: string;
}

export interface LegalStatus {
  faillissement: BankruptcyInfo | null;
  surseance: BankruptcyInfo | null;
  ontbinding: DissolutionInfo | null;
  bekendmakingen: Announcement[];
  risicoIndicator: "laag" | "gemiddeld" | "hoog" | "kritiek" | null;
}

// =============================================================================
// DIRECTORS & RELATIONS
// =============================================================================

export interface Director {
  naam: string;
  functie: "bestuurder" | "aandeelhouder" | "commissaris" | "gevolmachtigde" | "overig";
  functieOmschrijving: string | null;
  startDatum: string | null;
  eindDatum: string | null;
  bevoegdheid: "alleen" | "gezamenlijk" | "beperkt" | null;
  isNatuurlijkPersoon: boolean;
}

export interface CompanyRelation {
  kvkNummer: string;
  naam: string;
  relatietype: "moeder" | "dochter" | "zuster" | "deelneming" | "gelieerd";
  percentage: number | null; // Ownership percentage if known
  viaDirecteur: string | null; // Director name if relation is via shared director
  vertrouwensscore: number; // 0-100, how confident we are in this relation
}

export interface CompanyRelations {
  moedermaatschappij: CompanyRelation | null;
  dochtermaatschappijen: CompanyRelation[];
  verwanteOndernemingen: CompanyRelation[]; // Related via shared directors
  totaalRelaties: number;
}

// =============================================================================
// FINANCIAL INDICATORS
// =============================================================================

export interface FinancialIndicators {
  creditScore: number | null; // 0-100
  paymentBehavior: "uitstekend" | "goed" | "gemiddeld" | "matig" | "slecht" | null;
  riskIndicator: "laag" | "gemiddeld" | "hoog" | null;
  companyAge: number | null; // Years since founding
  employeeTrend: "groeiend" | "stabiel" | "krimpend" | null;
  lastAnnualReport: string | null; // Year
  sectorRisk: "laag" | "gemiddeld" | "hoog" | null;
  estimatedRevenue: string | null; // Range like "1M-5M EUR"
}

// =============================================================================
// ONLINE PRESENCE (from enrichment)
// =============================================================================

export interface SocialProfiles {
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
}

export interface OnlinePresence {
  website: string | null;
  email: string | null;
  telefoon: string | null;
  socials: SocialProfiles;
  discoveryMethod: string | null;
  confidence: number; // 0-100
}

// =============================================================================
// TECH STACK
// =============================================================================

export interface TechStack {
  cms: string[];
  frameworks: string[];
  analytics: string[];
  payments: string[];
  marketing: string[];
  ecommerce: string[];
  hosting: string[];
  other: string[];
  totalDetected: number;
}

// =============================================================================
// REVIEWS
// =============================================================================

export interface ReviewData {
  rating: number; // 0-5
  reviewCount: number;
  url: string | null;
}

export interface Reviews {
  google: ReviewData | null;
  trustpilot: ReviewData | null;
  averageRating: number | null;
  totalReviews: number;
}

// =============================================================================
// NEWS
// =============================================================================

export interface NewsArticle {
  title: string;
  description: string | null;
  source: string;
  url: string;
  publishedAt: string; // ISO date
  sentiment: "positief" | "neutraal" | "negatief" | null;
}

export interface NewsResult {
  articles: NewsArticle[];
  totalFound: number;
  source: "newsapi" | "google_rss" | "bing_rss";
}

// =============================================================================
// AI ANALYSIS
// =============================================================================

export interface AiAnalysis {
  samenvatting: string;
  branche: string;
  branchePositie: string | null;
  sterkePunten: string[];
  aandachtspunten: string[];
  technologieAnalyse: string | null;
  marketingAnalyse: string | null;
  groeipotentieel: string | null;
  groeiScore: number; // 0-100
  digitalScore: number; // 0-100
  reputatieScore: number; // 0-100
  overallScore: number; // 0-100
  aanbevelingen: string[];
  competitieAnalyse: string | null;
  targetKlant: string | null;
  confidence: number; // 0-100
}

// =============================================================================
// TIMELINE
// =============================================================================

export interface TimelineEvent {
  datum: string; // ISO date
  type: "oprichting" | "adreswijziging" | "bestuurswisseling" | "naamswijziging" |
        "activiteitwijziging" | "faillissement" | "ontbinding" | "overig";
  titel: string;
  beschrijving: string | null;
  bron: string;
  url: string | null;
}

// =============================================================================
// COMPLETE PROFILE RESPONSE
// =============================================================================

export interface SourceAttribution {
  name: string;
  url: string | null;
  lastUpdated: string | null;
  license: string;
}

export interface ErrorSummary {
  source: string;
  code: KvkErrorCode;
  message: string;
  recoverable: boolean;
}

export interface ResponseMeta {
  timestamp: string;
  processingTime: number; // ms
  sources: SourceAttribution[];
  dataFreshness: Record<string, string>; // Section -> ISO timestamp
  errors: ErrorSummary[];
  cacheHits: string[]; // Which sections came from cache
}

export interface CompanyProfile {
  // Core data
  kvk: KvkCoreData;
  adres: Address;

  // Directors & relationships
  bestuurders: DataSourceResult<Director[]>;
  relaties: DataSourceResult<CompanyRelations>;

  // Legal status
  juridischeStatus: DataSourceResult<LegalStatus>;

  // Financial
  financieel: DataSourceResult<FinancialIndicators>;

  // Online presence
  online: DataSourceResult<OnlinePresence>;

  // Tech
  techStack: DataSourceResult<TechStack>;

  // Reputation
  reviews: DataSourceResult<Reviews>;
  nieuws: DataSourceResult<NewsResult>;

  // AI Analysis
  aiAnalyse: AiAnalysis | null;

  // History
  tijdlijn: TimelineEvent[];

  // Meta
  meta: ResponseMeta;
}

export interface ProfileResponse {
  type: "profile";
  profile: CompanyProfile;
}

// =============================================================================
// SEARCH PARAMETERS
// =============================================================================

export interface KvkSearchParams {
  query: string;
  type: SearchType;
  plaats?: string;
  postcode?: string;
  sbiCode?: string;
  provincie?: string;
  inclusiefInactief?: boolean;
  getFullProfile?: boolean;
  include?: {
    directors?: boolean;
    relations?: boolean;
    legalStatus?: boolean;
    financial?: boolean;
    website?: boolean;
    socials?: boolean;
    techStack?: boolean;
    news?: boolean;
    reviews?: boolean;
    aiAnalysis?: boolean;
    timeline?: boolean;
  };
}

// =============================================================================
// OPENKVK API RESPONSE TYPES
// =============================================================================

export interface OpenKvkApiResult {
  kvk: string;
  vestigingsnummer?: string;
  rsin?: string;
  handelsnaam: string;
  handelsnamen?: string[];
  straat?: string;
  huisnummer?: string;
  huisnummertoevoeging?: string;
  postcode?: string;
  plaats?: string;
  type?: string;
  hoofdactiviteit?: string;
  sbiActiviteiten?: string[];
  rechtsvorm?: string;
  statutaireNaam?: string;
  startdatum?: string;
  einddatum?: string;
  actief?: boolean;
  _links?: {
    self: { href: string };
  };
}

export interface OpenKvkApiResponse {
  _embedded?: {
    bedrijf: OpenKvkApiResult[];
  };
  _links?: {
    self: { href: string };
    next?: { href: string };
    prev?: { href: string };
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

// =============================================================================
// CACHE TYPES
// =============================================================================

export interface CachedData<T> {
  data: T;
  cachedAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp
  source: string;
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp
  windowMs: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}
