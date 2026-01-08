/**
 * Company Relations Module
 *
 * Discovers relationships between companies:
 * - Parent/subsidiary structures
 * - Related companies via shared directors
 * - Companies at the same address
 */

import { KvkSourceError, type CompanyRelation, type CompanyRelations, type RateLimitConfig } from "../types";
import { CacheKeys, CacheTTL } from "../cache/cache-keys";
import { getCachedOrFetch, checkRateLimit } from "../cache/redis-cache";
import { searchByName, searchByPostcode } from "../sources/openkvk-client";

// =============================================================================
// CONFIGURATION
// =============================================================================

const RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60 * 1000,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Find companies at the same address
 */
async function findCompaniesAtSameAddress(
  postcode: string,
  huisnummer: string,
  excludeKvk?: string
): Promise<CompanyRelation[]> {
  if (!postcode) return [];

  try {
    const companies = await searchByPostcode(postcode);

    // Filter to same house number and exclude self
    const sameAddress = companies.filter((c) => {
      if (excludeKvk && c.kvkNummer === excludeKvk) return false;

      // Check if address contains the same house number
      const addrLower = c.adres.volledig.toLowerCase();
      return addrLower.includes(huisnummer.toLowerCase());
    });

    return sameAddress.map((c) => ({
      kvkNummer: c.kvkNummer,
      naam: c.naam,
      relatietype: "gelieerd" as const,
      percentage: null,
      viaDirecteur: null,
      vertrouwensscore: 60, // Medium confidence - same address doesn't guarantee relation
    }));
  } catch {
    return [];
  }
}

/**
 * Find companies with similar names (potential group structure)
 */
async function findSimilarNamedCompanies(
  companyName: string,
  excludeKvk?: string
): Promise<CompanyRelation[]> {
  // Extract base name (remove common suffixes)
  const baseName = companyName
    .replace(/\s*(B\.?V\.?|N\.?V\.?|V\.?O\.?F\.?|C\.?V\.?|Holding|Group|Nederland)\s*/gi, "")
    .trim();

  if (baseName.length < 3) return [];

  try {
    const companies = await searchByName(baseName);

    // Filter out self and find potential related companies
    const related = companies.filter((c) => {
      if (excludeKvk && c.kvkNummer === excludeKvk) return false;
      if (c.naam.toLowerCase() === companyName.toLowerCase()) return false;

      // Check for naming patterns suggesting relationship
      const cNameLower = c.naam.toLowerCase();
      const baseNameLower = baseName.toLowerCase();

      // Likely holding/subsidiary if contains base name + Holding/Group/etc
      if (
        cNameLower.includes(baseNameLower) &&
        (cNameLower.includes("holding") ||
          cNameLower.includes("group") ||
          cNameLower.includes("beheer") ||
          cNameLower.includes("management"))
      ) {
        return true;
      }

      // Same base name
      return cNameLower.startsWith(baseNameLower);
    });

    return related.slice(0, 5).map((c) => {
      // Determine relationship type based on name
      const cNameLower = c.naam.toLowerCase();
      let relatietype: CompanyRelation["relatietype"] = "gelieerd";
      let vertrouwensscore = 50;

      if (cNameLower.includes("holding") || cNameLower.includes("beheer")) {
        relatietype = "moeder";
        vertrouwensscore = 70;
      } else if (
        companyName.toLowerCase().includes("holding") ||
        companyName.toLowerCase().includes("beheer")
      ) {
        relatietype = "dochter";
        vertrouwensscore = 70;
      } else {
        relatietype = "zuster";
        vertrouwensscore = 60;
      }

      return {
        kvkNummer: c.kvkNummer,
        naam: c.naam,
        relatietype,
        percentage: null,
        viaDirecteur: null,
        vertrouwensscore,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Identify potential parent company from name
 */
function identifyPotentialParent(
  relations: CompanyRelation[]
): CompanyRelation | null {
  // Look for holding/beheer companies
  const holdings = relations.filter(
    (r) =>
      r.relatietype === "moeder" ||
      r.naam.toLowerCase().includes("holding") ||
      r.naam.toLowerCase().includes("beheer")
  );

  if (holdings.length === 0) return null;

  // Return the one with highest confidence
  return holdings.sort((a, b) => b.vertrouwensscore - a.vertrouwensscore)[0];
}

/**
 * Identify potential subsidiaries
 */
function identifySubsidiaries(
  relations: CompanyRelation[],
  companyName: string
): CompanyRelation[] {
  // If current company is a holding, others might be subsidiaries
  const isHolding =
    companyName.toLowerCase().includes("holding") ||
    companyName.toLowerCase().includes("beheer");

  if (!isHolding) {
    return relations.filter((r) => r.relatietype === "dochter");
  }

  // Mark related companies as potential subsidiaries
  return relations
    .filter(
      (r) =>
        r.relatietype !== "moeder" &&
        !r.naam.toLowerCase().includes("holding") &&
        !r.naam.toLowerCase().includes("beheer")
    )
    .map((r) => ({
      ...r,
      relatietype: "dochter" as const,
      vertrouwensscore: Math.min(r.vertrouwensscore + 10, 80),
    }));
}

// =============================================================================
// PUBLIC FUNCTIONS
// =============================================================================

/**
 * Discover company relationships
 *
 * @param companyName - Company name
 * @param kvkNummer - KVK number (for exclusion)
 * @param postcode - Company postcode (for address-based discovery)
 * @param huisnummer - House number
 */
export async function discoverRelations(
  companyName: string,
  kvkNummer?: string,
  postcode?: string,
  huisnummer?: string
): Promise<CompanyRelations> {
  if (!companyName) {
    throw new KvkSourceError(
      "Bedrijfsnaam is vereist",
      "relations",
      "INVALID_INPUT",
      false
    );
  }

  const cacheKey = CacheKeys.relations(kvkNummer || companyName);

  // Check rate limit
  const rateStatus = await checkRateLimit("relations", RATE_LIMIT_CONFIG);
  if (!rateStatus.allowed) {
    throw new KvkSourceError(
      "Rate limited",
      "relations",
      "RATE_LIMITED",
      true,
      rateStatus.resetAt
    );
  }

  const result = await getCachedOrFetch<CompanyRelations>(
    cacheKey,
    async () => {
      const allRelations: CompanyRelation[] = [];

      // 1. Find companies with similar names
      const similarNamed = await findSimilarNamedCompanies(companyName, kvkNummer);
      allRelations.push(...similarNamed);

      // 2. Find companies at same address
      if (postcode && huisnummer) {
        const sameAddress = await findCompaniesAtSameAddress(postcode, huisnummer, kvkNummer);

        // Add only if not already in list
        for (const addr of sameAddress) {
          if (!allRelations.some((r) => r.kvkNummer === addr.kvkNummer)) {
            allRelations.push(addr);
          }
        }
      }

      // 3. Identify parent
      const moedermaatschappij = identifyPotentialParent(allRelations);

      // 4. Identify subsidiaries
      const dochtermaatschappijen = identifySubsidiaries(allRelations, companyName);

      // 5. Remaining are related companies
      const verwanteOndernemingen = allRelations.filter(
        (r) =>
          (!moedermaatschappij || r.kvkNummer !== moedermaatschappij.kvkNummer) &&
          !dochtermaatschappijen.some((d) => d.kvkNummer === r.kvkNummer)
      );

      return {
        moedermaatschappij,
        dochtermaatschappijen,
        verwanteOndernemingen,
        totaalRelaties:
          (moedermaatschappij ? 1 : 0) +
          dochtermaatschappijen.length +
          verwanteOndernemingen.length,
      };
    },
    CacheTTL.RELATIONS,
    "openkvk"
  );

  return result.data;
}

/**
 * Quick check if company has any known relations
 */
export async function hasRelations(
  companyName: string,
  kvkNummer?: string
): Promise<boolean> {
  const relations = await discoverRelations(companyName, kvkNummer);
  return relations.totaalRelaties > 0;
}

/**
 * Check if company is part of a group (has parent or subsidiaries)
 */
export async function isPartOfGroup(
  companyName: string,
  kvkNummer?: string
): Promise<{
  isGroup: boolean;
  groupType: "holding" | "subsidiary" | "independent";
  confidence: number;
}> {
  const relations = await discoverRelations(companyName, kvkNummer);

  if (relations.moedermaatschappij) {
    return {
      isGroup: true,
      groupType: "subsidiary",
      confidence: relations.moedermaatschappij.vertrouwensscore,
    };
  }

  if (relations.dochtermaatschappijen.length > 0) {
    return {
      isGroup: true,
      groupType: "holding",
      confidence: Math.max(...relations.dochtermaatschappijen.map((d) => d.vertrouwensscore)),
    };
  }

  return {
    isGroup: false,
    groupType: "independent",
    confidence: 50, // Can't be certain without full data
  };
}

/**
 * Get source attribution
 */
export function getSourceAttribution() {
  return {
    name: "OpenKVK (Relatie-analyse)",
    url: "https://openkvk.nl",
    lastUpdated: null,
    license: "Open Data",
  };
}

/**
 * Note about data limitations
 */
export function getDataLimitationsNote(): string {
  return `
    Company relationship discovery is based on:
    - Name similarity analysis (holding/group patterns)
    - Address matching (companies at same location)

    For complete ownership and subsidiary information,
    official documents (holding declarations, annual reports)
    would need to be consulted.

    Confidence scores indicate reliability:
    - 70-100: High confidence (strong naming patterns)
    - 50-69: Medium confidence (address/partial match)
    - <50: Low confidence (speculation)
  `.trim();
}
