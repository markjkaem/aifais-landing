/**
 * Website Discovery Service
 *
 * Discovers company website URL from company name using various methods:
 * 1. Check common domain patterns (company.nl, company.com)
 * 2. Use search engine results (if configured)
 * 3. Parse social media profiles for website links
 */

const COMMON_TLDS = [".nl", ".com", ".eu", ".net", ".be"];
const REQUEST_TIMEOUT = 5000; // 5 seconds

export interface WebsiteDiscoveryResult {
    website: string | null;
    email: string | null;
    telefoon: string | null;
    discoveryMethod: "domain_check" | "search" | "social" | "none";
    confidence: number; // 0-100
}

/**
 * Clean company name for domain guessing
 */
function cleanNameForDomain(name: string): string {
    return name
        .toLowerCase()
        .replace(/b\.?v\.?$|n\.?v\.?$|vof$|cv$|bv$|nv$/gi, "") // Remove legal suffixes
        .replace(/[^a-z0-9]/g, "") // Keep only alphanumeric
        .trim();
}

/**
 * Check if a domain is reachable
 */
async function isDomainReachable(domain: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const response = await fetch(`https://${domain}`, {
            method: "HEAD",
            signal: controller.signal,
            redirect: "follow",
        });

        clearTimeout(timeoutId);
        return response.ok || response.status === 403 || response.status === 401;
    } catch {
        return false;
    }
}

/**
 * Try common domain patterns for a company name
 */
async function tryCommonDomains(companyName: string): Promise<string | null> {
    const cleanName = cleanNameForDomain(companyName);

    if (!cleanName) return null;

    // Try each TLD
    for (const tld of COMMON_TLDS) {
        const domain = `${cleanName}${tld}`;
        if (await isDomainReachable(domain)) {
            return `https://${domain}`;
        }
    }

    // Try with "the" prefix removed
    if (cleanName.startsWith("the")) {
        const withoutThe = cleanName.slice(3);
        for (const tld of COMMON_TLDS) {
            const domain = `${withoutThe}${tld}`;
            if (await isDomainReachable(domain)) {
                return `https://${domain}`;
            }
        }
    }

    return null;
}

/**
 * Extract email pattern from website HTML
 */
async function extractContactFromWebsite(websiteUrl: string): Promise<{
    email: string | null;
    telefoon: string | null;
}> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const response = await fetch(websiteUrl, {
            signal: controller.signal,
            headers: {
                "User-Agent": "AIFAIS Company Intelligence Bot/1.0",
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return { email: null, telefoon: null };
        }

        const html = await response.text();

        // Extract email (look for mailto: links or common patterns)
        const emailRegex = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/g;
        const emails = html.match(emailRegex);
        const email = emails
            ? emails.find(e =>
                !e.includes("example") &&
                !e.includes("test") &&
                !e.includes("@sentry") &&
                !e.includes("@wix")
            ) || null
            : null;

        // Extract Dutch phone number
        const phoneRegex = /(?:\+31|0031|0)[\s.-]?(?:\d[\s.-]?){9}/g;
        const phones = html.match(phoneRegex);
        const telefoon = phones ? phones[0].replace(/[\s.-]/g, "") : null;

        return { email, telefoon };
    } catch {
        return { email: null, telefoon: null };
    }
}

/**
 * Discover company website and contact info
 */
export async function discoverWebsite(
    companyName: string,
    knownWebsite?: string
): Promise<WebsiteDiscoveryResult> {
    // If we already have a website from KVK, verify and extract contact
    if (knownWebsite) {
        const url = knownWebsite.startsWith("http") ? knownWebsite : `https://${knownWebsite}`;
        const contact = await extractContactFromWebsite(url);
        return {
            website: url,
            email: contact.email,
            telefoon: contact.telefoon,
            discoveryMethod: "domain_check",
            confidence: 100,
        };
    }

    // Try to discover website
    const website = await tryCommonDomains(companyName);

    if (website) {
        const contact = await extractContactFromWebsite(website);
        return {
            website,
            email: contact.email,
            telefoon: contact.telefoon,
            discoveryMethod: "domain_check",
            confidence: 80,
        };
    }

    return {
        website: null,
        email: null,
        telefoon: null,
        discoveryMethod: "none",
        confidence: 0,
    };
}

/**
 * Quick domain availability check (doesn't verify content)
 */
export async function checkDomain(domain: string): Promise<boolean> {
    return isDomainReachable(domain);
}
