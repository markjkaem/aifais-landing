/**
 * Social Media Finder Service
 *
 * Discovers company social media profiles by:
 * 1. Checking common URL patterns
 * 2. Extracting from company website
 * 3. Using standard naming conventions
 */

const REQUEST_TIMEOUT = 5000;

export interface SocialProfiles {
    linkedin: string | null;
    twitter: string | null;
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
}

export interface SocialFinderResult {
    profiles: SocialProfiles;
    foundCount: number;
    sources: string[];
}

/**
 * Clean company name for social media handle guessing
 */
function cleanNameForHandle(name: string): string {
    return name
        .toLowerCase()
        .replace(/b\.?v\.?$|n\.?v\.?$|vof$|cv$|bv$|nv$/gi, "") // Remove legal suffixes
        .replace(/[^a-z0-9]/g, "") // Keep only alphanumeric
        .trim();
}

/**
 * Check if a social media profile URL is valid (returns 200)
 */
async function isProfileValid(url: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const response = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
            redirect: "follow",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; AIFAIS/1.0)",
            },
        });

        clearTimeout(timeoutId);

        // Most platforms return 200 for existing profiles
        // Some might redirect to login but still indicate existence
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Try to find LinkedIn company page
 */
async function findLinkedIn(companyName: string): Promise<string | null> {
    const handle = cleanNameForHandle(companyName);
    const variations = [
        `https://www.linkedin.com/company/${handle}`,
        `https://www.linkedin.com/company/${handle}-bv`,
        `https://www.linkedin.com/company/${handle}nl`,
    ];

    for (const url of variations) {
        if (await isProfileValid(url)) {
            return url;
        }
    }

    return null;
}

/**
 * Try to find Twitter/X profile
 */
async function findTwitter(companyName: string): Promise<string | null> {
    const handle = cleanNameForHandle(companyName);
    const variations = [
        `https://twitter.com/${handle}`,
        `https://twitter.com/${handle}nl`,
        `https://x.com/${handle}`,
    ];

    for (const url of variations) {
        if (await isProfileValid(url)) {
            return url;
        }
    }

    return null;
}

/**
 * Try to find Facebook page
 */
async function findFacebook(companyName: string): Promise<string | null> {
    const handle = cleanNameForHandle(companyName);
    const variations = [
        `https://www.facebook.com/${handle}`,
        `https://www.facebook.com/${handle}nl`,
        `https://www.facebook.com/${handle}nederland`,
    ];

    for (const url of variations) {
        if (await isProfileValid(url)) {
            return url;
        }
    }

    return null;
}

/**
 * Try to find Instagram profile
 */
async function findInstagram(companyName: string): Promise<string | null> {
    const handle = cleanNameForHandle(companyName);
    const variations = [
        `https://www.instagram.com/${handle}`,
        `https://www.instagram.com/${handle}nl`,
        `https://www.instagram.com/${handle}_nl`,
    ];

    for (const url of variations) {
        if (await isProfileValid(url)) {
            return url;
        }
    }

    return null;
}

/**
 * Extract social links from website HTML
 */
async function extractSocialsFromWebsite(websiteUrl: string): Promise<Partial<SocialProfiles>> {
    const profiles: Partial<SocialProfiles> = {};

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

        if (!response.ok) return profiles;

        const html = await response.text();

        // LinkedIn
        const linkedinMatch = html.match(/https?:\/\/(?:www\.)?linkedin\.com\/company\/[a-zA-Z0-9_-]+/);
        if (linkedinMatch) profiles.linkedin = linkedinMatch[0];

        // Twitter/X
        const twitterMatch = html.match(/https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[a-zA-Z0-9_]+/);
        if (twitterMatch) profiles.twitter = twitterMatch[0];

        // Facebook
        const facebookMatch = html.match(/https?:\/\/(?:www\.)?facebook\.com\/[a-zA-Z0-9._-]+/);
        if (facebookMatch) profiles.facebook = facebookMatch[0];

        // Instagram
        const instagramMatch = html.match(/https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9._]+/);
        if (instagramMatch) profiles.instagram = instagramMatch[0];

        // YouTube
        const youtubeMatch = html.match(/https?:\/\/(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/|@)[a-zA-Z0-9_-]+/);
        if (youtubeMatch) profiles.youtube = youtubeMatch[0];

    } catch {
        // Ignore errors, return what we found
    }

    return profiles;
}

/**
 * Find all social media profiles for a company
 */
export async function findSocialProfiles(
    companyName: string,
    websiteUrl?: string | null
): Promise<SocialFinderResult> {
    const profiles: SocialProfiles = {
        linkedin: null,
        twitter: null,
        facebook: null,
        instagram: null,
        youtube: null,
    };
    const sources: string[] = [];

    // First, try to extract from website if available
    if (websiteUrl) {
        const websiteProfiles = await extractSocialsFromWebsite(websiteUrl);

        if (websiteProfiles.linkedin) {
            profiles.linkedin = websiteProfiles.linkedin;
            sources.push("website");
        }
        if (websiteProfiles.twitter) {
            profiles.twitter = websiteProfiles.twitter;
            sources.push("website");
        }
        if (websiteProfiles.facebook) {
            profiles.facebook = websiteProfiles.facebook;
            sources.push("website");
        }
        if (websiteProfiles.instagram) {
            profiles.instagram = websiteProfiles.instagram;
            sources.push("website");
        }
        if (websiteProfiles.youtube) {
            profiles.youtube = websiteProfiles.youtube;
            sources.push("website");
        }
    }

    // Then, try handle-based discovery for missing profiles
    const discoveryPromises: Promise<void>[] = [];

    if (!profiles.linkedin) {
        discoveryPromises.push(
            findLinkedIn(companyName).then(url => {
                if (url) {
                    profiles.linkedin = url;
                    sources.push("handle_discovery");
                }
            })
        );
    }

    if (!profiles.twitter) {
        discoveryPromises.push(
            findTwitter(companyName).then(url => {
                if (url) {
                    profiles.twitter = url;
                    sources.push("handle_discovery");
                }
            })
        );
    }

    if (!profiles.facebook) {
        discoveryPromises.push(
            findFacebook(companyName).then(url => {
                if (url) {
                    profiles.facebook = url;
                    sources.push("handle_discovery");
                }
            })
        );
    }

    if (!profiles.instagram) {
        discoveryPromises.push(
            findInstagram(companyName).then(url => {
                if (url) {
                    profiles.instagram = url;
                    sources.push("handle_discovery");
                }
            })
        );
    }

    // Wait for all discovery attempts (with timeout)
    await Promise.allSettled(discoveryPromises);

    const foundCount = Object.values(profiles).filter(Boolean).length;

    return {
        profiles,
        foundCount,
        sources: [...new Set(sources)],
    };
}
