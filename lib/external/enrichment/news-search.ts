/**
 * News Search Service
 *
 * Searches for recent news articles about a company using:
 * 1. NewsAPI (if configured)
 * 2. Google News RSS feed
 * 3. Dutch news sources
 */

export interface NewsArticle {
    titel: string;
    bron: string;
    datum: string;
    url: string;
    beschrijving?: string;
}

export interface NewsSearchResult {
    articles: NewsArticle[];
    source: "newsapi" | "rss" | "mock";
    totalFound: number;
}

const NEWS_API_KEY = process.env.NEWS_API_KEY;

/**
 * Fetch news from NewsAPI (if configured)
 */
async function fetchFromNewsApi(companyName: string): Promise<NewsArticle[]> {
    if (!NEWS_API_KEY) return [];

    try {
        const query = encodeURIComponent(companyName);
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${query}&language=nl&sortBy=publishedAt&pageSize=5`,
            {
                headers: {
                    "X-Api-Key": NEWS_API_KEY,
                },
            }
        );

        if (!response.ok) return [];

        const data = await response.json();

        return (data.articles || []).map((article: {
            title: string;
            source: { name: string };
            publishedAt: string;
            url: string;
            description?: string;
        }) => ({
            titel: article.title,
            bron: article.source?.name || "Unknown",
            datum: formatDate(article.publishedAt),
            url: article.url,
            beschrijving: article.description,
        }));
    } catch {
        return [];
    }
}

/**
 * Fetch news from Google News RSS (fallback)
 */
async function fetchFromGoogleNews(companyName: string): Promise<NewsArticle[]> {
    try {
        const query = encodeURIComponent(`"${companyName}" site:nl OR site:netherlands`);
        const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=nl&gl=NL&ceid=NL:nl`;

        const response = await fetch(rssUrl);
        if (!response.ok) return [];

        const xml = await response.text();

        // Simple XML parsing for RSS items
        const items: NewsArticle[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
            const itemXml = match[1];

            const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
            const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
            const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
            const sourceMatch = itemXml.match(/<source.*?>([\s\S]*?)<\/source>/);

            if (titleMatch && linkMatch) {
                items.push({
                    titel: decodeHtmlEntities(titleMatch[1]),
                    bron: sourceMatch ? decodeHtmlEntities(sourceMatch[1]) : "Google News",
                    datum: pubDateMatch ? formatDate(pubDateMatch[1]) : "Onbekend",
                    url: linkMatch[1],
                });
            }
        }

        return items;
    } catch {
        return [];
    }
}

/**
 * Format date to Dutch locale
 */
function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Vandaag";
        if (diffDays === 1) return "Gisteren";
        if (diffDays < 7) return `${diffDays} dagen geleden`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weken geleden`;

        return date.toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateString;
    }
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
        "&apos;": "'",
    };

    return text.replace(/&[^;]+;/g, entity => entities[entity] || entity);
}

/**
 * Generate mock news for development
 */
function getMockNews(companyName: string): NewsArticle[] {
    return [
        {
            titel: `${companyName} kondigt uitbreiding aan`,
            bron: "FD",
            datum: "2 dagen geleden",
            url: "#",
            beschrijving: `${companyName} heeft plannen aangekondigd om uit te breiden naar nieuwe markten.`,
        },
        {
            titel: `Nieuw partnership voor ${companyName}`,
            bron: "RTL Z",
            datum: "1 week geleden",
            url: "#",
            beschrijving: `${companyName} gaat samenwerking aan met internationale partner.`,
        },
        {
            titel: `${companyName} in top 100 snelst groeiende bedrijven`,
            bron: "MT/Sprout",
            datum: "2 weken geleden",
            url: "#",
            beschrijving: `Het bedrijf ${companyName} is opgenomen in de lijst van snelst groeiende ondernemingen.`,
        },
    ];
}

/**
 * Search for news about a company
 */
export async function searchNews(companyName: string): Promise<NewsSearchResult> {
    // Try NewsAPI first if configured
    if (NEWS_API_KEY) {
        const articles = await fetchFromNewsApi(companyName);
        if (articles.length > 0) {
            return {
                articles,
                source: "newsapi",
                totalFound: articles.length,
            };
        }
    }

    // Try Google News RSS as fallback
    const rssArticles = await fetchFromGoogleNews(companyName);
    if (rssArticles.length > 0) {
        return {
            articles: rssArticles,
            source: "rss",
            totalFound: rssArticles.length,
        };
    }

    // Return mock data for development
    const mockArticles = getMockNews(companyName);
    return {
        articles: mockArticles,
        source: "mock",
        totalFound: mockArticles.length,
    };
}

/**
 * Check if news search is properly configured
 */
export function isNewsConfigured(): boolean {
    return !!NEWS_API_KEY;
}
