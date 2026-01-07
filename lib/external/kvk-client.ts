/**
 * KVK (Kamer van Koophandel) API Client
 *
 * Integrates with the official Dutch Chamber of Commerce API
 * Documentation: https://developers.kvk.nl/documentation
 *
 * APIs used:
 * - Zoeken API (free): Search by name, KVK number, address
 * - Basisprofiel API (€0.02/query): Detailed company profile
 * - Vestigingsprofiel API (€0.02/query): Branch location details
 */

const KVK_API_BASE = process.env.KVK_API_BASE_URL || "https://api.kvk.nl/api/v2";
const KVK_API_KEY = process.env.KVK_API_KEY;

// ============ Types ============

export interface KvkSearchParams {
    kvkNummer?: string;
    rsin?: string;
    vestigingsnummer?: string;
    naam?: string;
    straatnaam?: string;
    huisnummer?: number;
    postcode?: string;
    plaats?: string;
    type?: "hoofdvestiging" | "nevenvestiging" | "rechtspersoon";
    inclusiefInactieveRegistraties?: boolean;
    pagina?: number;
    resultatenPerPagina?: number;
}

export interface KvkSearchResult {
    kvkNummer: string;
    rsin?: string;
    vestigingsnummer?: string;
    naam: string;
    adres?: {
        binnenlandsAdres?: {
            straatnaam?: string;
            huisnummer?: number;
            huisletter?: string;
            postcode?: string;
            plaats?: string;
        };
        buitenlandsAdres?: {
            straatHuisnummer?: string;
            postcodeWoonplaats?: string;
            land?: string;
        };
    };
    type: string;
    actief: string;
    vervallenNaam?: string[];
    links?: Array<{
        rel: string;
        href: string;
    }>;
}

export interface KvkSearchResponse {
    pagina: number;
    resultatenPerPagina: number;
    totaal: number;
    vorige?: string;
    volgende?: string;
    resultaten: KvkSearchResult[];
}

export interface KvkBasisprofiel {
    kvkNummer: string;
    indNonMailing: string;
    naam: string;
    formeleRegistratiedatum: string;
    materieleRegistratie?: {
        datumAanvang?: string;
        datumEinde?: string;
    };
    totaalWerkzamePersonen?: number;
    statutaireNaam?: string;
    handelsnamen?: Array<{
        naam: string;
        volgorde: number;
    }>;
    sbiActiviteiten?: Array<{
        sbiCode: string;
        sbiOmschrijving: string;
        indHoofdactiviteit: string;
    }>;
    links?: Array<{
        rel: string;
        href: string;
    }>;
    embedded?: {
        hoofdvestiging?: KvkVestigingsprofiel;
        eigenaar?: {
            rechtsvorm?: string;
            uitgebreideRechtsvorm?: string;
            rsin?: string;
        };
    };
}

export interface KvkVestigingsprofiel {
    vestigingsnummer: string;
    kvkNummer: string;
    rsin?: string;
    indHoofdvestiging: string;
    indCommercieleVestiging: string;
    voltijdWerkzamePersonen?: number;
    deeltijdWerkzamePersonen?: number;
    totaalWerkzamePersonen?: number;
    eersteHandelsnaam?: string;
    indNonMailing?: string;
    formeleRegistratiedatum?: string;
    materieleRegistratie?: {
        datumAanvang?: string;
        datumEinde?: string;
    };
    statutaireNaam?: string;
    handelsnamen?: Array<{
        naam: string;
        volgorde: number;
    }>;
    activiteiten?: Array<{
        sbiCode: string;
        sbiOmschrijving: string;
        indHoofdactiviteit: string;
    }>;
    adressen?: Array<{
        type: string;
        indAfgeschermd?: string;
        volledigAdres?: string;
        straatnaam?: string;
        huisnummer?: number;
        huisletter?: string;
        huisnummertoevoeging?: string;
        postcode?: string;
        plaats?: string;
        land?: string;
        geoData?: {
            addresseerbaarObjectId?: string;
            nummeraanduidingId?: string;
            gpsLatitude?: number;
            gpsLongitude?: number;
            rijksdriehoekX?: number;
            rijksdriehoekY?: number;
            rijksdriehoekZ?: number;
        };
    }>;
    websites?: string[];
    links?: Array<{
        rel: string;
        href: string;
    }>;
}

// ============ Error Classes ============

export class KvkApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public details?: unknown
    ) {
        super(message);
        this.name = "KvkApiError";
    }
}

export class KvkNotConfiguredError extends Error {
    constructor() {
        super("KVK API key is not configured. Please set KVK_API_KEY environment variable.");
        this.name = "KvkNotConfiguredError";
    }
}

// ============ Client Functions ============

/**
 * Check if KVK API is configured
 */
export function isKvkConfigured(): boolean {
    return !!KVK_API_KEY;
}

/**
 * Make authenticated request to KVK API
 */
async function kvkRequest<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    if (!KVK_API_KEY) {
        throw new KvkNotConfiguredError();
    }

    const url = new URL(`${KVK_API_BASE}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const response = await fetch(url.toString(), {
        headers: {
            "apikey": KVK_API_KEY,
            "Accept": "application/hal+json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new KvkApiError(
            `KVK API error: ${response.status} ${response.statusText}`,
            response.status,
            errorText
        );
    }

    return response.json() as Promise<T>;
}

/**
 * Search for companies in the KVK registry
 * This API is FREE (no per-query cost)
 *
 * @param params Search parameters
 * @returns Search results with basic company info
 */
export async function searchKvk(params: KvkSearchParams): Promise<KvkSearchResponse> {
    return kvkRequest<KvkSearchResponse>("/zoeken", {
        kvkNummer: params.kvkNummer,
        rsin: params.rsin,
        vestigingsnummer: params.vestigingsnummer,
        naam: params.naam,
        straatnaam: params.straatnaam,
        huisnummer: params.huisnummer,
        postcode: params.postcode,
        plaats: params.plaats,
        type: params.type,
        InclusiefInactieveRegistraties: params.inclusiefInactieveRegistraties,
        pagina: params.pagina || 1,
        resultatenPerPagina: params.resultatenPerPagina || 10,
    });
}

/**
 * Get detailed company profile by KVK number
 * Cost: €0.02 per query
 *
 * @param kvkNummer 8-digit KVK number
 * @returns Detailed company profile including SBI codes, employee count, etc.
 */
export async function getBasisprofiel(kvkNummer: string): Promise<KvkBasisprofiel> {
    return kvkRequest<KvkBasisprofiel>(`/basisprofielen/${kvkNummer}`, {
        geoData: true, // Include geo coordinates
    });
}

/**
 * Get branch/location details by vestigingsnummer
 * Cost: €0.02 per query
 *
 * @param vestigingsnummer 12-digit branch number
 * @returns Branch profile including address, activities, etc.
 */
export async function getVestigingsprofiel(vestigingsnummer: string): Promise<KvkVestigingsprofiel> {
    return kvkRequest<KvkVestigingsprofiel>(`/vestigingsprofielen/${vestigingsnummer}`, {
        geoData: true,
    });
}

// ============ Helper Functions ============

/**
 * Format KVK number to 8 digits with leading zeros
 */
export function formatKvkNummer(kvkNummer: string): string {
    return kvkNummer.replace(/\D/g, "").padStart(8, "0");
}

/**
 * Check if a string is a valid KVK number format
 */
export function isValidKvkNummer(value: string): boolean {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.length === 8 && /^\d+$/.test(cleaned);
}

/**
 * Get full address string from KVK address object
 */
export function formatAddress(adres?: KvkSearchResult["adres"]): string {
    if (!adres) return "";

    if (adres.binnenlandsAdres) {
        const a = adres.binnenlandsAdres;
        const street = [a.straatnaam, a.huisnummer, a.huisletter].filter(Boolean).join(" ");
        const city = [a.postcode, a.plaats].filter(Boolean).join(" ");
        return [street, city].filter(Boolean).join(", ");
    }

    if (adres.buitenlandsAdres) {
        const a = adres.buitenlandsAdres;
        return [a.straatHuisnummer, a.postcodeWoonplaats, a.land].filter(Boolean).join(", ");
    }

    return "";
}

/**
 * Get SBI code description (main activity)
 */
export function getMainActivity(sbiActiviteiten?: KvkBasisprofiel["sbiActiviteiten"]): string {
    if (!sbiActiviteiten?.length) return "";
    const main = sbiActiviteiten.find(a => a.indHoofdactiviteit === "Ja") || sbiActiviteiten[0];
    return main.sbiOmschrijving;
}

/**
 * Map employee count to readable range
 */
export function formatEmployeeCount(count?: number): string {
    if (!count) return "Onbekend";
    if (count === 1) return "1 persoon";
    if (count <= 5) return "2-5 personen";
    if (count <= 10) return "6-10 personen";
    if (count <= 50) return "11-50 personen";
    if (count <= 100) return "51-100 personen";
    if (count <= 500) return "101-500 personen";
    if (count <= 1000) return "501-1000 personen";
    return "1000+ personen";
}

// ============ Combined Lookup ============

export interface CompanyLookupResult {
    search: KvkSearchResult;
    basisprofiel: KvkBasisprofiel | null;
    vestigingsprofiel: KvkVestigingsprofiel | null;
    errors: string[];
}

/**
 * Complete company lookup: search + basisprofiel + vestigingsprofiel
 * Total cost: €0.04 if both profile APIs succeed
 *
 * @param kvkNummer KVK number to look up
 * @returns Combined company data
 */
export async function getFullCompanyProfile(kvkNummer: string): Promise<CompanyLookupResult> {
    const formattedKvk = formatKvkNummer(kvkNummer);
    const errors: string[] = [];

    // First search to get basic info and vestigingsnummer
    const searchResult = await searchKvk({ kvkNummer: formattedKvk });

    if (!searchResult.resultaten.length) {
        throw new KvkApiError(`No company found with KVK number ${formattedKvk}`, 404);
    }

    const searchEntry = searchResult.resultaten[0];

    // Get basisprofiel (€0.02)
    let basisprofiel: KvkBasisprofiel | null = null;
    try {
        basisprofiel = await getBasisprofiel(formattedKvk);
    } catch (error) {
        errors.push(`Could not fetch basisprofiel: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    // Get vestigingsprofiel if we have a vestigingsnummer (€0.02)
    let vestigingsprofiel: KvkVestigingsprofiel | null = null;
    const vestigingsnummer = searchEntry.vestigingsnummer;
    if (vestigingsnummer) {
        try {
            vestigingsprofiel = await getVestigingsprofiel(vestigingsnummer);
        } catch (error) {
            errors.push(`Could not fetch vestigingsprofiel: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    return {
        search: searchEntry,
        basisprofiel,
        vestigingsprofiel,
        errors,
    };
}

// ============ Mock Data for Development ============

/**
 * Mock search results for development/testing without API key
 */
export function getMockSearchResults(query: string): KvkSearchResponse {
    const mockCompanies: KvkSearchResult[] = [
        {
            kvkNummer: "35012085",
            rsin: "810862052",
            vestigingsnummer: "000019583052",
            naam: "Albert Heijn B.V.",
            adres: {
                binnenlandsAdres: {
                    straatnaam: "Provincialeweg",
                    huisnummer: 11,
                    postcode: "1506 MA",
                    plaats: "Zaandam",
                }
            },
            type: "hoofdvestiging",
            actief: "Ja",
        },
        {
            kvkNummer: "30181992",
            vestigingsnummer: "000012345678",
            naam: "Coolblue B.V.",
            adres: {
                binnenlandsAdres: {
                    straatnaam: "Weena",
                    huisnummer: 664,
                    postcode: "3012 CN",
                    plaats: "Rotterdam",
                }
            },
            type: "hoofdvestiging",
            actief: "Ja",
        },
        {
            kvkNummer: "33216371",
            vestigingsnummer: "000098765432",
            naam: "Bol.com B.V.",
            adres: {
                binnenlandsAdres: {
                    straatnaam: "Papendorpseweg",
                    huisnummer: 100,
                    postcode: "3528 BJ",
                    plaats: "Utrecht",
                }
            },
            type: "hoofdvestiging",
            actief: "Ja",
        },
        {
            kvkNummer: "90123456",
            vestigingsnummer: "000011112222",
            naam: "AIFAIS B.V.",
            adres: {
                binnenlandsAdres: {
                    straatnaam: "Herengracht",
                    huisnummer: 420,
                    postcode: "1017 BZ",
                    plaats: "Amsterdam",
                }
            },
            type: "hoofdvestiging",
            actief: "Ja",
        },
    ];

    // Filter by query if it looks like a KVK number
    const filtered = query.match(/^\d{8}$/)
        ? mockCompanies.filter(c => c.kvkNummer === query)
        : mockCompanies.filter(c =>
            c.naam.toLowerCase().includes(query.toLowerCase())
        );

    return {
        pagina: 1,
        resultatenPerPagina: 10,
        totaal: filtered.length,
        resultaten: filtered,
    };
}

/**
 * Mock basisprofiel for development
 */
export function getMockBasisprofiel(kvkNummer: string): KvkBasisprofiel {
    // AIFAIS specific mock data
    if (kvkNummer === "90123456") {
        return {
            kvkNummer,
            indNonMailing: "Nee",
            naam: "AIFAIS B.V.",
            formeleRegistratiedatum: "2024-01-01",
            materieleRegistratie: {
                datumAanvang: "2024-01-01",
            },
            totaalWerkzamePersonen: 5,
            statutaireNaam: "AIFAIS B.V.",
            handelsnamen: [
                { naam: "AIFAIS", volgorde: 1 },
                { naam: "AI For All In Seconds", volgorde: 2 },
            ],
            sbiActiviteiten: [
                {
                    sbiCode: "6201",
                    sbiOmschrijving: "Ontwikkelen, produceren en uitgeven van software",
                    indHoofdactiviteit: "Ja",
                },
                {
                    sbiCode: "6311",
                    sbiOmschrijving: "Gegevensverwerking, webhosting en aanverwante activiteiten",
                    indHoofdactiviteit: "Nee",
                },
            ],
            embedded: {
                eigenaar: {
                    rechtsvorm: "Besloten Vennootschap",
                    uitgebreideRechtsvorm: "Besloten Vennootschap met beperkte aansprakelijkheid",
                    rsin: "901234567",
                },
                hoofdvestiging: {
                    vestigingsnummer: "000011112222",
                    websites: ["https://aifais.com"],
                },
            },
        };
    }

    // Default mock data
    return {
        kvkNummer,
        indNonMailing: "Nee",
        naam: "Demo Bedrijf B.V.",
        formeleRegistratiedatum: "2010-01-15",
        materieleRegistratie: {
            datumAanvang: "2010-01-15",
        },
        totaalWerkzamePersonen: 150,
        statutaireNaam: "Demo Bedrijf B.V.",
        handelsnamen: [
            { naam: "Demo Bedrijf", volgorde: 1 },
            { naam: "Demo Solutions", volgorde: 2 },
        ],
        sbiActiviteiten: [
            {
                sbiCode: "6201",
                sbiOmschrijving: "Ontwikkelen, produceren en uitgeven van software",
                indHoofdactiviteit: "Ja",
            },
            {
                sbiCode: "6202",
                sbiOmschrijving: "Advisering op het gebied van informatietechnologie",
                indHoofdactiviteit: "Nee",
            },
        ],
        embedded: {
            eigenaar: {
                rechtsvorm: "Besloten Vennootschap",
                uitgebreideRechtsvorm: "Besloten Vennootschap met beperkte aansprakelijkheid",
                rsin: "123456789",
            },
        },
    };
}
