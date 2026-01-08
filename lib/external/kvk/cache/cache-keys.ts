/**
 * Cache Key Generators for KVK Data
 *
 * Centralized cache key management with consistent naming conventions.
 */

import crypto from "crypto";

/**
 * Generate a short hash of a string for cache keys
 */
function hash(input: string): string {
  return crypto.createHash("md5").update(input.toLowerCase().trim()).digest("hex").slice(0, 12);
}

/**
 * Cache key generators for different data types
 */
export const CacheKeys = {
  // Core company data - cached longest (stable data)
  company: (kvkNummer: string) => `kvk:company:${kvkNummer}`,

  // Search results - shorter cache
  search: (query: string, type: string, filters?: Record<string, string>) => {
    const filterHash = filters ? `:${hash(JSON.stringify(filters))}` : "";
    return `kvk:search:${type}:${hash(query)}${filterHash}`;
  },

  // Legal status - medium cache (can change)
  bankruptcy: (kvkNummer: string) => `kvk:bankruptcy:${kvkNummer}`,
  announcements: (kvkNummer: string) => `kvk:announcements:${kvkNummer}`,
  legalStatus: (kvkNummer: string) => `kvk:legal:${kvkNummer}`,

  // Director data - medium cache
  directors: (kvkNummer: string) => `kvk:directors:${kvkNummer}`,
  relations: (kvkNummer: string) => `kvk:relations:${kvkNummer}`,

  // Financial indicators
  financial: (kvkNummer: string) => `kvk:financial:${kvkNummer}`,

  // Enrichments - shorter cache (external data can change)
  website: (kvkOrDomain: string) => `kvk:website:${hash(kvkOrDomain)}`,
  techStack: (domain: string) => `kvk:tech:${hash(domain)}`,
  socials: (companyName: string) => `kvk:social:${hash(companyName)}`,
  reviews: (companyName: string) => `kvk:reviews:${hash(companyName)}`,
  news: (companyName: string) => `kvk:news:${hash(companyName)}`,

  // SBI codes - cached very long (rarely change)
  sbi: (code: string) => `kvk:sbi:${code}`,
  sbiAll: () => `kvk:sbi:all`,

  // Rate limiting
  rateLimit: (source: string) => `kvk:ratelimit:${source}`,

  // Geo data
  postcode: (postcode: string) => `kvk:geo:${postcode.toUpperCase().replace(/\s/g, "")}`,

  // Full profile (aggregated)
  fullProfile: (kvkNummer: string) => `kvk:profile:${kvkNummer}`,
};

/**
 * Cache TTL (Time To Live) in seconds for different data types
 */
export const CacheTTL = {
  // Static data - very long TTL
  SBI_CODE: 86400 * 30, // 30 days - SBI codes rarely change
  SBI_ALL: 86400 * 30, // 30 days
  COMPANY_BASIC: 86400 * 7, // 7 days - KVK basic data is stable
  POSTCODE: 86400 * 30, // 30 days - geo data is stable

  // Semi-static data - medium TTL
  SEARCH_RESULTS: 3600 * 6, // 6 hours - search index updates daily
  DIRECTORS: 86400 * 3, // 3 days - director changes are infrequent
  RELATIONS: 86400 * 3, // 3 days
  FINANCIAL: 86400 * 1, // 1 day - financial data can change

  // Dynamic data - short TTL
  BANKRUPTCY: 3600 * 12, // 12 hours - legal status can change
  ANNOUNCEMENTS: 3600 * 24, // 24 hours
  LEGAL_STATUS: 3600 * 12, // 12 hours

  // Enrichments - shortest TTL
  WEBSITE: 3600 * 24, // 24 hours
  TECH_STACK: 3600 * 24, // 24 hours
  SOCIALS: 3600 * 12, // 12 hours
  REVIEWS: 3600 * 6, // 6 hours - reviews can update frequently
  NEWS: 3600 * 2, // 2 hours - news is time-sensitive

  // Full profile (aggregated)
  FULL_PROFILE: 3600 * 4, // 4 hours

  // Negative cache (not found)
  NOT_FOUND: 3600, // 1 hour - avoid hammering for non-existent
  ERROR: 300, // 5 minutes - temporary errors
};

/**
 * Get TTL based on cache key prefix
 */
export function getTTLForKey(key: string): number {
  if (key.startsWith("kvk:sbi:")) return CacheTTL.SBI_CODE;
  if (key.startsWith("kvk:company:")) return CacheTTL.COMPANY_BASIC;
  if (key.startsWith("kvk:search:")) return CacheTTL.SEARCH_RESULTS;
  if (key.startsWith("kvk:bankruptcy:")) return CacheTTL.BANKRUPTCY;
  if (key.startsWith("kvk:announcements:")) return CacheTTL.ANNOUNCEMENTS;
  if (key.startsWith("kvk:legal:")) return CacheTTL.LEGAL_STATUS;
  if (key.startsWith("kvk:directors:")) return CacheTTL.DIRECTORS;
  if (key.startsWith("kvk:relations:")) return CacheTTL.RELATIONS;
  if (key.startsWith("kvk:financial:")) return CacheTTL.FINANCIAL;
  if (key.startsWith("kvk:website:")) return CacheTTL.WEBSITE;
  if (key.startsWith("kvk:tech:")) return CacheTTL.TECH_STACK;
  if (key.startsWith("kvk:social:")) return CacheTTL.SOCIALS;
  if (key.startsWith("kvk:reviews:")) return CacheTTL.REVIEWS;
  if (key.startsWith("kvk:news:")) return CacheTTL.NEWS;
  if (key.startsWith("kvk:geo:")) return CacheTTL.POSTCODE;
  if (key.startsWith("kvk:profile:")) return CacheTTL.FULL_PROFILE;

  // Default TTL
  return 3600; // 1 hour
}
