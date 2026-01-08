/**
 * SBI Code Lookup Module
 *
 * Provides descriptions and classifications for Dutch SBI (Standaard Bedrijfsindeling) codes.
 * Based on CBS SBI 2008 classification system.
 *
 * Data source: CBS (Centraal Bureau voor de Statistiek)
 */

import { CacheKeys, CacheTTL } from "../cache/cache-keys";
import { getCachedOrFetch, setCache } from "../cache/redis-cache";
import type { SbiCode } from "../types";

// =============================================================================
// SBI SECTION DESCRIPTIONS
// =============================================================================

export const SBI_SECTIONS: Record<string, { letter: string; name: string; nameEn: string }> = {
  A: { letter: "A", name: "Landbouw, bosbouw en visserij", nameEn: "Agriculture, forestry and fishing" },
  B: { letter: "B", name: "Winning van delfstoffen", nameEn: "Mining and quarrying" },
  C: { letter: "C", name: "Industrie", nameEn: "Manufacturing" },
  D: { letter: "D", name: "Energievoorziening", nameEn: "Electricity, gas, steam and air conditioning supply" },
  E: { letter: "E", name: "Waterbedrijven en afvalbeheer", nameEn: "Water supply; sewerage, waste management" },
  F: { letter: "F", name: "Bouwnijverheid", nameEn: "Construction" },
  G: { letter: "G", name: "Groot- en detailhandel", nameEn: "Wholesale and retail trade" },
  H: { letter: "H", name: "Vervoer en opslag", nameEn: "Transportation and storage" },
  I: { letter: "I", name: "Horeca", nameEn: "Accommodation and food service activities" },
  J: { letter: "J", name: "Informatie en communicatie", nameEn: "Information and communication" },
  K: { letter: "K", name: "Financiële dienstverlening", nameEn: "Financial and insurance activities" },
  L: { letter: "L", name: "Verhuur en handel van onroerend goed", nameEn: "Real estate activities" },
  M: { letter: "M", name: "Specialistische zakelijke diensten", nameEn: "Professional, scientific and technical activities" },
  N: { letter: "N", name: "Verhuur en overige zakelijke diensten", nameEn: "Administrative and support service activities" },
  O: { letter: "O", name: "Openbaar bestuur en overheidsdiensten", nameEn: "Public administration and defence" },
  P: { letter: "P", name: "Onderwijs", nameEn: "Education" },
  Q: { letter: "Q", name: "Gezondheids- en welzijnszorg", nameEn: "Human health and social work activities" },
  R: { letter: "R", name: "Cultuur, sport en recreatie", nameEn: "Arts, entertainment and recreation" },
  S: { letter: "S", name: "Overige dienstverlening", nameEn: "Other service activities" },
  T: { letter: "T", name: "Huishoudens als werkgever", nameEn: "Activities of households as employers" },
  U: { letter: "U", name: "Extraterritoriale organisaties", nameEn: "Activities of extraterritorial organisations" },
};

// =============================================================================
// COMMON SBI CODES WITH DESCRIPTIONS
// =============================================================================

/**
 * Most common SBI codes with Dutch descriptions
 * This is a static lookup table for fast access
 */
const SBI_DESCRIPTIONS: Record<string, string> = {
  // IT & Software (62xxx)
  "62": "IT-dienstverlening",
  "620": "IT-dienstverlening",
  "6201": "Ontwikkelen, produceren en uitgeven van software",
  "62010": "Ontwikkelen, produceren en uitgeven van software",
  "6202": "Advisering op het gebied van informatietechnologie",
  "62020": "Advisering op het gebied van informatietechnologie",
  "6203": "Beheer van computerfaciliteiten",
  "62030": "Beheer van computerfaciliteiten",
  "6209": "Overige IT-dienstverlening",
  "62090": "Overige IT-dienstverlening",

  // Consulting & Business Services (69-74)
  "69": "Rechtskundige en administratieve dienstverlening",
  "6910": "Rechtskundige dienstverlening",
  "6920": "Accountancy, belastingadvisering en administratie",
  "70": "Holdings en managementadviesbureaus",
  "7010": "Holdings",
  "7021": "Public relations en communicatie",
  "7022": "Overig organisatieadvies",
  "71": "Architecten, ingenieurs en technisch onderzoek",
  "7111": "Architecten",
  "7112": "Ingenieurs en overig technisch ontwerp en advies",
  "72": "Speur- en ontwikkelingswerk",
  "7211": "Biotechnologisch speur- en ontwikkelingswerk",
  "7219": "Overig natuurwetenschappelijk speur- en ontwikkelingswerk",
  "73": "Reclame en marktonderzoek",
  "7311": "Reclamebureaus",
  "7312": "Handel in advertentieruimte en -tijd",
  "7320": "Markt- en opinieonderzoeksbureaus",
  "74": "Industrieel ontwerp en vormgeving, fotografie, vertaling",
  "7410": "Industrieel ontwerp en vormgeving",
  "7420": "Fotografie",
  "7430": "Vertalers en tolken",

  // Retail & Wholesale (45-47)
  "45": "Handel in en reparatie van auto's",
  "4511": "Handel in auto's en lichte bedrijfsauto's (geen import)",
  "4519": "Handel in en reparatie van overige motorvoertuigen",
  "46": "Groothandel en handelsbemiddeling",
  "461": "Handelsbemiddeling",
  "462": "Groothandel in landbouwproducten en levende dieren",
  "463": "Groothandel in voedings- en genotmiddelen",
  "464": "Groothandel in consumentenartikelen",
  "465": "Groothandel in ICT-apparatuur",
  "466": "Groothandel in overige machines en apparatuur",
  "469": "Niet-gespecialiseerde groothandel",
  "47": "Detailhandel",
  "471": "Supermarkten, warenhuizen en dergelijke winkels",
  "4711": "Supermarkten en dergelijke winkels",
  "472": "Winkels in voedings- en genotmiddelen",
  "473": "Tankstations",
  "474": "Winkels in ICT-apparatuur",
  "4741": "Winkels in computers, randapparatuur en software",
  "475": "Winkels in overige huishoudelijke artikelen",
  "476": "Winkels in culturele en recreatieve artikelen",
  "477": "Winkels in overige artikelen",
  "4791": "Detailhandel via internet",

  // Hospitality (55-56)
  "55": "Logiesverstrekking",
  "551": "Hotels en dergelijke",
  "5510": "Hotels en dergelijke",
  "552": "Kampeerterreinen en vakantiewoningen",
  "56": "Eet- en drinkgelegenheden",
  "561": "Restaurants, cafetaria's en dergelijke",
  "5610": "Restaurants, cafetaria's, snackbars, ijssalons",
  "562": "Catering en kantines",
  "563": "Cafés",

  // Construction (41-43)
  "41": "Algemene burgerlijke en utiliteitsbouw",
  "4110": "Projectontwikkeling",
  "4120": "Algemene bouw",
  "42": "Grond-, water- en wegenbouw",
  "421": "Bouw van wegen, spoorwegen en kunstwerken",
  "422": "Bouw van civieltechnische werken",
  "43": "Gespecialiseerde bouw",
  "431": "Slopen en bouwrijp maken van terreinen",
  "432": "Elektrotechnische en overige bouwinstallatie",
  "433": "Afwerken van gebouwen",
  "439": "Overige gespecialiseerde bouw",

  // Healthcare (86-88)
  "86": "Gezondheidszorg",
  "861": "Ziekenhuizen en geestelijke gezondheids- en verslavingszorg",
  "862": "Medische en tandheelkundige praktijken",
  "8621": "Praktijken van huisartsen",
  "8622": "Praktijken van medisch specialisten",
  "8623": "Praktijken van tandartsen",
  "869": "Overige gezondheidszorg",
  "87": "Verpleging, verzorging en begeleiding met overnachting",
  "88": "Maatschappelijke dienstverlening zonder overnachting",

  // Finance & Insurance (64-66)
  "64": "Financiële instellingen",
  "6419": "Overige geldscheppende financiële instellingen",
  "6420": "Financiële holdings",
  "643": "Beleggingsinstellingen",
  "649": "Overige financiële dienstverlening",
  "65": "Verzekeringen en pensioenfondsen",
  "66": "Overige financiële dienstverlening",
  "6611": "Beheer van financiële markten",
  "6612": "Commissiehandel en makelaardij in effecten",
  "6619": "Overige financiële bemiddeling",
  "6622": "Assurantietussenpersonen",

  // Transport & Logistics (49-53)
  "49": "Vervoer over land",
  "491": "Personenvervoer per spoor",
  "492": "Goederenvervoer per spoor",
  "493": "Personenvervoer over de weg",
  "494": "Goederenvervoer over de weg",
  "50": "Vervoer over water",
  "51": "Luchtvaart",
  "52": "Opslag en dienstverlening voor vervoer",
  "521": "Opslag",
  "522": "Dienstverlening voor vervoer",
  "53": "Post en koeriers",

  // Education (85)
  "85": "Onderwijs",
  "851": "Primair onderwijs",
  "852": "Voortgezet onderwijs",
  "853": "Hoger onderwijs",
  "854": "Overig onderwijs",
  "855": "Onderwijsondersteunende diensten",

  // Real Estate (68)
  "68": "Verhuur van en handel in onroerend goed",
  "681": "Handel in onroerend goed",
  "682": "Verhuur van onroerend goed",
  "683": "Bemiddeling bij handel in en verhuur van onroerend goed",

  // Manufacturing (10-33)
  "10": "Voedingsmiddelenindustrie",
  "11": "Drankenindustrie",
  "13": "Textielindustrie",
  "14": "Kledingindustrie",
  "15": "Leer- en schoenenindustrie",
  "16": "Houtindustrie",
  "17": "Papierindustrie",
  "18": "Grafische industrie",
  "19": "Aardolie-industrie",
  "20": "Chemische industrie",
  "21": "Farmaceutische industrie",
  "22": "Rubber- en kunststofproductenindustrie",
  "23": "Bouwmaterialenindustrie",
  "24": "Basismetaalindustrie",
  "25": "Metaalproductenindustrie",
  "26": "Elektrotechnische industrie",
  "27": "Elektrische apparatenindustrie",
  "28": "Machine-industrie",
  "29": "Auto-industrie",
  "30": "Overige transportmiddelenindustrie",
  "31": "Meubelindustrie",
  "32": "Overige industrie",
  "33": "Reparatie en installatie van machines",

  // Media & Publishing (58-60)
  "58": "Uitgeverijen",
  "581": "Uitgeverijen van boeken, kranten en dergelijke",
  "582": "Uitgeverijen van software",
  "59": "Film- en tv-productie; geluidsopname",
  "60": "Radio- en televisieomroepen",

  // Telecommunications (61)
  "61": "Telecommunicatie",
  "6110": "Draadgebonden telecommunicatie",
  "6120": "Draadloze telecommunicatie",
  "6130": "Telecommunicatie via satelliet",
  "6190": "Overige telecommunicatie",

  // Data processing (63)
  "63": "Diensten op het gebied van informatie",
  "6311": "Gegevensverwerking, webhosting en aanverwante activiteiten",
  "6312": "Webportals",
  "6391": "Persagentschappen",
  "6399": "Overige diensten op het gebied van informatie",
};

// =============================================================================
// PUBLIC FUNCTIONS
// =============================================================================

/**
 * Get description for an SBI code
 */
export function getSbiDescription(code: string): string {
  const cleanCode = code.replace(/\D/g, "");

  // Try exact match first
  if (SBI_DESCRIPTIONS[cleanCode]) {
    return SBI_DESCRIPTIONS[cleanCode];
  }

  // Try progressively shorter codes (5 -> 4 -> 3 -> 2 digits)
  for (let len = cleanCode.length - 1; len >= 2; len--) {
    const shortCode = cleanCode.slice(0, len);
    if (SBI_DESCRIPTIONS[shortCode]) {
      return SBI_DESCRIPTIONS[shortCode];
    }
  }

  // Get section description as fallback
  const section = getSbiSection(cleanCode);
  if (section && SBI_SECTIONS[section]) {
    return SBI_SECTIONS[section].name;
  }

  return "Onbekende activiteit";
}

/**
 * Get the section letter for an SBI code
 */
export function getSbiSection(code: string): string {
  const numericCode = parseInt(code.replace(/\D/g, ""), 10);

  if (numericCode >= 1 && numericCode <= 3) return "A";
  if (numericCode >= 5 && numericCode <= 9) return "B";
  if (numericCode >= 10 && numericCode <= 33) return "C";
  if (numericCode >= 35 && numericCode <= 35) return "D";
  if (numericCode >= 36 && numericCode <= 39) return "E";
  if (numericCode >= 41 && numericCode <= 43) return "F";
  if (numericCode >= 45 && numericCode <= 47) return "G";
  if (numericCode >= 49 && numericCode <= 53) return "H";
  if (numericCode >= 55 && numericCode <= 56) return "I";
  if (numericCode >= 58 && numericCode <= 63) return "J";
  if (numericCode >= 64 && numericCode <= 66) return "K";
  if (numericCode >= 68 && numericCode <= 68) return "L";
  if (numericCode >= 69 && numericCode <= 75) return "M";
  if (numericCode >= 77 && numericCode <= 82) return "N";
  if (numericCode >= 84 && numericCode <= 84) return "O";
  if (numericCode >= 85 && numericCode <= 85) return "P";
  if (numericCode >= 86 && numericCode <= 88) return "Q";
  if (numericCode >= 90 && numericCode <= 93) return "R";
  if (numericCode >= 94 && numericCode <= 96) return "S";
  if (numericCode >= 97 && numericCode <= 98) return "T";
  if (numericCode >= 99 && numericCode <= 99) return "U";

  return "?";
}

/**
 * Get section info for a section letter
 */
export function getSbiSectionInfo(letter: string): { letter: string; name: string; nameEn: string } | null {
  return SBI_SECTIONS[letter.toUpperCase()] || null;
}

/**
 * Enrich SBI codes with descriptions
 */
export async function enrichSbiCodes(codes: SbiCode[]): Promise<SbiCode[]> {
  return codes.map((code) => ({
    ...code,
    omschrijving: code.omschrijving || getSbiDescription(code.code),
    sectie: code.sectie || getSbiSection(code.code),
  }));
}

/**
 * Get full SBI code info with caching
 */
export async function getSbiCodeInfo(code: string): Promise<{
  code: string;
  omschrijving: string;
  sectie: string;
  sectieNaam: string;
} | null> {
  const cleanCode = code.replace(/\D/g, "");
  if (!cleanCode || cleanCode.length < 2) {
    return null;
  }

  const cacheKey = CacheKeys.sbi(cleanCode);

  const result = await getCachedOrFetch(
    cacheKey,
    async () => {
      const section = getSbiSection(cleanCode);
      const sectionInfo = getSbiSectionInfo(section);

      return {
        code: cleanCode,
        omschrijving: getSbiDescription(cleanCode),
        sectie: section,
        sectieNaam: sectionInfo?.name || "Onbekend",
      };
    },
    CacheTTL.SBI_CODE,
    "cbs"
  );

  return result.data;
}

/**
 * Search SBI codes by keyword
 */
export function searchSbiCodes(keyword: string): Array<{ code: string; description: string }> {
  const normalizedKeyword = keyword.toLowerCase().trim();
  const results: Array<{ code: string; description: string }> = [];

  for (const [code, description] of Object.entries(SBI_DESCRIPTIONS)) {
    if (description.toLowerCase().includes(normalizedKeyword)) {
      results.push({ code, description });
    }
  }

  // Sort by code length (more specific codes first)
  return results.sort((a, b) => b.code.length - a.code.length).slice(0, 20);
}

/**
 * Get risk profile for an SBI sector
 * Based on general industry risk assessments
 */
export function getSbiRiskProfile(code: string): "laag" | "gemiddeld" | "hoog" {
  const section = getSbiSection(code);

  // Higher risk sectors (volatile, seasonal, high competition)
  const highRiskSections = ["I", "R"]; // Horeca, Cultuur/recreatie

  // Medium risk sectors
  const mediumRiskSections = ["F", "G", "H", "N"]; // Bouw, Handel, Vervoer, Zakelijke diensten

  // Lower risk sectors (stable demand)
  const lowRiskSections = ["D", "E", "K", "O", "P", "Q"]; // Utilities, Finance, Overheid, Onderwijs, Zorg

  if (highRiskSections.includes(section)) return "hoog";
  if (lowRiskSections.includes(section)) return "laag";
  if (mediumRiskSections.includes(section)) return "gemiddeld";

  return "gemiddeld"; // Default
}

/**
 * Get source attribution for SBI data
 */
export function getSourceAttribution() {
  return {
    name: "CBS (Centraal Bureau voor de Statistiek)",
    url: "https://www.cbs.nl/sbi",
    lastUpdated: "2024", // SBI 2008 with updates
    license: "Open Data (CC-0)",
  };
}
