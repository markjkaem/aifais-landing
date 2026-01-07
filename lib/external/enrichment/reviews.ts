/**
 * Reviews & Reputation Service
 *
 * Fetches company reviews from:
 * 1. Google Business (via Places API if configured)
 * 2. Trustpilot (public scraping)
 */

export interface ReviewData {
    rating: number;
    count: number;
    url?: string;
}

export interface ReviewsResult {
    google: ReviewData | null;
    trustpilot: ReviewData | null;
    averageRating: number | null;
    totalReviews: number;
    sources: string[];
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const REQUEST_TIMEOUT = 5000;

/**
 * Fetch Google Business reviews via Places API
 */
async function fetchGoogleReviews(
    companyName: string,
    city?: string
): Promise<ReviewData | null> {
    if (!GOOGLE_PLACES_API_KEY) return null;

    try {
        // First, find the place ID
        const query = city ? `${companyName} ${city}` : companyName;
        const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
            query
        )}&inputtype=textquery&fields=place_id,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`;

        const searchResponse = await fetch(searchUrl);
        if (!searchResponse.ok) return null;

        const searchData = await searchResponse.json();
        const candidate = searchData.candidates?.[0];

        if (!candidate) return null;

        return {
            rating: candidate.rating || 0,
            count: candidate.user_ratings_total || 0,
            url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
        };
    } catch {
        return null;
    }
}

/**
 * Fetch Trustpilot reviews (public data)
 */
async function fetchTrustpilotReviews(companyName: string): Promise<ReviewData | null> {
    try {
        // Clean company name for Trustpilot URL
        const slug = companyName
            .toLowerCase()
            .replace(/b\.?v\.?$|n\.?v\.?$/gi, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        // Try direct Trustpilot URL
        const trustpilotUrl = `https://www.trustpilot.com/review/${slug}.nl`;
        const response = await fetch(trustpilotUrl, {
            signal: controller.signal,
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; AIFAIS/1.0)",
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            // Try without .nl suffix
            const altUrl = `https://www.trustpilot.com/review/${slug}`;
            const altResponse = await fetch(altUrl, {
                signal: controller.signal,
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; AIFAIS/1.0)",
                },
            });

            if (!altResponse.ok) return null;

            const html = await altResponse.text();
            return parseTrustpilotPage(html, altUrl);
        }

        const html = await response.text();
        return parseTrustpilotPage(html, trustpilotUrl);
    } catch {
        return null;
    }
}

/**
 * Parse Trustpilot page for rating data
 */
function parseTrustpilotPage(html: string, url: string): ReviewData | null {
    try {
        // Look for rating in JSON-LD schema
        const schemaMatch = html.match(/"ratingValue"\s*:\s*"?([\d.]+)"?/);
        const countMatch = html.match(/"reviewCount"\s*:\s*"?(\d+)"?/);

        if (schemaMatch) {
            return {
                rating: parseFloat(schemaMatch[1]),
                count: countMatch ? parseInt(countMatch[1], 10) : 0,
                url,
            };
        }

        // Fallback: look for TrustScore
        const trustScoreMatch = html.match(/TrustScore\s+([\d.]+)/i);
        const reviewsMatch = html.match(/([\d,]+)\s+reviews?/i);

        if (trustScoreMatch) {
            return {
                rating: parseFloat(trustScoreMatch[1]),
                count: reviewsMatch ? parseInt(reviewsMatch[1].replace(/,/g, ""), 10) : 0,
                url,
            };
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Calculate weighted average rating
 */
function calculateAverageRating(reviews: ReviewsResult): number | null {
    const ratings: Array<{ rating: number; count: number }> = [];

    if (reviews.google && reviews.google.count > 0) {
        ratings.push({ rating: reviews.google.rating, count: reviews.google.count });
    }
    if (reviews.trustpilot && reviews.trustpilot.count > 0) {
        ratings.push({ rating: reviews.trustpilot.rating, count: reviews.trustpilot.count });
    }

    if (ratings.length === 0) return null;

    const totalCount = ratings.reduce((sum, r) => sum + r.count, 0);
    const weightedSum = ratings.reduce((sum, r) => sum + r.rating * r.count, 0);

    return Math.round((weightedSum / totalCount) * 10) / 10;
}

/**
 * Fetch all available reviews for a company
 */
export async function getReviews(
    companyName: string,
    city?: string
): Promise<ReviewsResult> {
    // Fetch reviews in parallel
    const [googleReviews, trustpilotReviews] = await Promise.all([
        fetchGoogleReviews(companyName, city),
        fetchTrustpilotReviews(companyName),
    ]);

    const result: ReviewsResult = {
        google: googleReviews,
        trustpilot: trustpilotReviews,
        averageRating: null,
        totalReviews: 0,
        sources: [],
    };

    // Count total reviews and sources
    if (googleReviews) {
        result.totalReviews += googleReviews.count;
        result.sources.push("Google");
    }
    if (trustpilotReviews) {
        result.totalReviews += trustpilotReviews.count;
        result.sources.push("Trustpilot");
    }

    // Calculate average
    result.averageRating = calculateAverageRating(result);

    return result;
}

/**
 * Get mock reviews for development
 */
export function getMockReviews(companyName: string): ReviewsResult {
    // Generate somewhat random but consistent ratings based on company name
    const hash = companyName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseRating = 3.5 + (hash % 15) / 10; // 3.5 - 5.0

    return {
        google: {
            rating: Math.round(baseRating * 10) / 10,
            count: 50 + (hash % 500),
            url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyName)}`,
        },
        trustpilot: {
            rating: Math.round((baseRating - 0.2) * 10) / 10,
            count: 20 + (hash % 200),
            url: `https://www.trustpilot.com/review/${companyName.toLowerCase().replace(/\s+/g, "-")}`,
        },
        averageRating: Math.round((baseRating - 0.1) * 10) / 10,
        totalReviews: 70 + (hash % 700),
        sources: ["Google", "Trustpilot"],
    };
}

/**
 * Check if reviews APIs are configured
 */
export function isReviewsConfigured(): boolean {
    return !!GOOGLE_PLACES_API_KEY;
}
