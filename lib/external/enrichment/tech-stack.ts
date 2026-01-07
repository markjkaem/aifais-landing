/**
 * Tech Stack Detection Service
 *
 * Analyzes a website to detect technologies used:
 * - CMS (WordPress, Shopify, etc.)
 * - Frameworks (React, Vue, Angular)
 * - Analytics (Google Analytics, Hotjar)
 * - Payment providers (Stripe, Mollie, Adyen)
 * - Marketing tools (HubSpot, Mailchimp)
 */

const REQUEST_TIMEOUT = 10000; // 10 seconds for content fetch

export interface TechStackResult {
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

interface TechSignature {
    name: string;
    category: keyof Omit<TechStackResult, "totalDetected">;
    patterns: (RegExp | string)[];
}

// Technology detection signatures
const TECH_SIGNATURES: TechSignature[] = [
    // CMS
    { name: "WordPress", category: "cms", patterns: [/wp-content/i, /wp-includes/i, /"WordPress"/] },
    { name: "Shopify", category: "cms", patterns: [/cdn\.shopify\.com/i, /Shopify\.theme/] },
    { name: "Wix", category: "cms", patterns: [/wix\.com/i, /wixstatic\.com/] },
    { name: "Squarespace", category: "cms", patterns: [/squarespace\.com/i, /sqsp\.net/] },
    { name: "Webflow", category: "cms", patterns: [/webflow\.com/i, /assets\.website-files\.com/] },
    { name: "Drupal", category: "cms", patterns: [/drupal/i, /sites\/default\/files/] },
    { name: "Joomla", category: "cms", patterns: [/joomla/i, /\/media\/system\/js/] },
    { name: "Ghost", category: "cms", patterns: [/ghost\.io/i, /ghost\.org/] },
    { name: "Contentful", category: "cms", patterns: [/contentful\.com/i, /ctfassets\.net/] },
    { name: "Sanity", category: "cms", patterns: [/sanity\.io/i, /cdn\.sanity\.io/] },
    { name: "Strapi", category: "cms", patterns: [/strapi/i] },
    { name: "Prismic", category: "cms", patterns: [/prismic\.io/i] },

    // Frameworks
    { name: "React", category: "frameworks", patterns: [/__REACT/i, /react-dom/i, /_reactRootContainer/] },
    { name: "Next.js", category: "frameworks", patterns: [/__NEXT_DATA__/i, /_next\/static/] },
    { name: "Vue.js", category: "frameworks", patterns: [/__vue__/i, /vue\.js/i, /vue\.runtime/] },
    { name: "Nuxt.js", category: "frameworks", patterns: [/__NUXT__/i, /_nuxt\//] },
    { name: "Angular", category: "frameworks", patterns: [/ng-version/i, /angular\.js/i, /zone\.js/] },
    { name: "Svelte", category: "frameworks", patterns: [/svelte/i, /__svelte/] },
    { name: "SvelteKit", category: "frameworks", patterns: [/sveltekit/i] },
    { name: "Gatsby", category: "frameworks", patterns: [/gatsby/i, /___gatsby/] },
    { name: "Remix", category: "frameworks", patterns: [/remix/i, /__remixContext/] },
    { name: "Astro", category: "frameworks", patterns: [/astro/i] },
    { name: "jQuery", category: "frameworks", patterns: [/jquery/i] },
    { name: "Bootstrap", category: "frameworks", patterns: [/bootstrap/i] },
    { name: "Tailwind CSS", category: "frameworks", patterns: [/tailwind/i] },

    // Analytics
    { name: "Google Analytics", category: "analytics", patterns: [/google-analytics\.com/i, /gtag\/js/i, /ga\.js/] },
    { name: "Google Tag Manager", category: "analytics", patterns: [/googletagmanager\.com/i, /gtm\.js/] },
    { name: "Hotjar", category: "analytics", patterns: [/hotjar\.com/i, /hj\.js/] },
    { name: "Mixpanel", category: "analytics", patterns: [/mixpanel\.com/i] },
    { name: "Amplitude", category: "analytics", patterns: [/amplitude\.com/i] },
    { name: "Segment", category: "analytics", patterns: [/segment\.com/i, /cdn\.segment\.io/] },
    { name: "Plausible", category: "analytics", patterns: [/plausible\.io/i] },
    { name: "Fathom", category: "analytics", patterns: [/usefathom\.com/i] },
    { name: "Matomo", category: "analytics", patterns: [/matomo/i, /piwik/i] },
    { name: "Heap", category: "analytics", patterns: [/heap\.io/i, /heapanalytics/] },
    { name: "PostHog", category: "analytics", patterns: [/posthog\.com/i] },
    { name: "Microsoft Clarity", category: "analytics", patterns: [/clarity\.ms/i] },

    // Payments
    { name: "Stripe", category: "payments", patterns: [/stripe\.com/i, /js\.stripe\.com/] },
    { name: "Mollie", category: "payments", patterns: [/mollie\.com/i, /mollie\.nl/] },
    { name: "Adyen", category: "payments", patterns: [/adyen\.com/i] },
    { name: "PayPal", category: "payments", patterns: [/paypal\.com/i, /paypalobjects\.com/] },
    { name: "Klarna", category: "payments", patterns: [/klarna\.com/i] },
    { name: "iDEAL", category: "payments", patterns: [/ideal/i] },
    { name: "Buckaroo", category: "payments", patterns: [/buckaroo/i] },
    { name: "MultiSafepay", category: "payments", patterns: [/multisafepay/i] },

    // Marketing
    { name: "HubSpot", category: "marketing", patterns: [/hubspot\.com/i, /hs-scripts\.com/i, /hubspot\.net/] },
    { name: "Mailchimp", category: "marketing", patterns: [/mailchimp\.com/i, /list-manage\.com/] },
    { name: "Intercom", category: "marketing", patterns: [/intercom\.io/i, /intercomcdn\.com/] },
    { name: "Drift", category: "marketing", patterns: [/drift\.com/i] },
    { name: "Crisp", category: "marketing", patterns: [/crisp\.chat/i] },
    { name: "Zendesk", category: "marketing", patterns: [/zendesk\.com/i, /zdassets\.com/] },
    { name: "Freshdesk", category: "marketing", patterns: [/freshdesk\.com/i] },
    { name: "ActiveCampaign", category: "marketing", patterns: [/activecampaign\.com/i] },
    { name: "Klaviyo", category: "marketing", patterns: [/klaviyo\.com/i] },
    { name: "Brevo", category: "marketing", patterns: [/brevo\.com/i, /sendinblue\.com/i] },
    { name: "Tawk.to", category: "marketing", patterns: [/tawk\.to/i] },

    // E-commerce
    { name: "WooCommerce", category: "ecommerce", patterns: [/woocommerce/i, /wc-/] },
    { name: "Magento", category: "ecommerce", patterns: [/magento/i, /mage\//] },
    { name: "BigCommerce", category: "ecommerce", patterns: [/bigcommerce\.com/i] },
    { name: "PrestaShop", category: "ecommerce", patterns: [/prestashop/i] },
    { name: "OpenCart", category: "ecommerce", patterns: [/opencart/i] },
    { name: "Lightspeed", category: "ecommerce", patterns: [/lightspeed/i, /shoplightspeed/] },

    // Hosting
    { name: "Vercel", category: "hosting", patterns: [/vercel\.app/i, /vercel\.com/i, /\.vercel\.sh/] },
    { name: "Netlify", category: "hosting", patterns: [/netlify\.com/i, /netlify\.app/] },
    { name: "Cloudflare", category: "hosting", patterns: [/cloudflare/i, /cdnjs\.cloudflare\.com/] },
    { name: "AWS", category: "hosting", patterns: [/amazonaws\.com/i, /aws\.amazon\.com/] },
    { name: "Google Cloud", category: "hosting", patterns: [/googleapis\.com/i, /gstatic\.com/] },
    { name: "Azure", category: "hosting", patterns: [/azure/i, /azureedge\.net/] },
    { name: "Heroku", category: "hosting", patterns: [/herokuapp\.com/i] },
    { name: "DigitalOcean", category: "hosting", patterns: [/digitalocean/i] },
    { name: "Render", category: "hosting", patterns: [/onrender\.com/i] },

    // Other
    { name: "Sentry", category: "other", patterns: [/sentry\.io/i, /browser\.sentry-cdn\.com/] },
    { name: "reCAPTCHA", category: "other", patterns: [/recaptcha/i, /google\.com\/recaptcha/] },
    { name: "hCaptcha", category: "other", patterns: [/hcaptcha\.com/i] },
    { name: "Cookie Consent", category: "other", patterns: [/cookieconsent/i, /cookie-consent/i] },
    { name: "Cookiebot", category: "other", patterns: [/cookiebot\.com/i] },
    { name: "OneTrust", category: "other", patterns: [/onetrust\.com/i] },
    { name: "Font Awesome", category: "other", patterns: [/fontawesome/i] },
    { name: "Google Fonts", category: "other", patterns: [/fonts\.googleapis\.com/i] },
];

/**
 * Detect technologies in HTML content
 */
function detectTechnologies(html: string, headers: Headers): TechStackResult {
    const result: TechStackResult = {
        cms: [],
        frameworks: [],
        analytics: [],
        payments: [],
        marketing: [],
        ecommerce: [],
        hosting: [],
        other: [],
        totalDetected: 0,
    };

    // Check HTML content
    for (const signature of TECH_SIGNATURES) {
        const isDetected = signature.patterns.some(pattern => {
            if (typeof pattern === "string") {
                return html.includes(pattern);
            }
            return pattern.test(html);
        });

        if (isDetected && !result[signature.category].includes(signature.name)) {
            result[signature.category].push(signature.name);
        }
    }

    // Check response headers for additional signals
    const serverHeader = headers.get("server") || "";
    const poweredBy = headers.get("x-powered-by") || "";

    if (serverHeader.toLowerCase().includes("cloudflare")) {
        if (!result.hosting.includes("Cloudflare")) {
            result.hosting.push("Cloudflare");
        }
    }
    if (serverHeader.toLowerCase().includes("vercel")) {
        if (!result.hosting.includes("Vercel")) {
            result.hosting.push("Vercel");
        }
    }
    if (poweredBy.toLowerCase().includes("next.js")) {
        if (!result.frameworks.includes("Next.js")) {
            result.frameworks.push("Next.js");
        }
    }
    if (poweredBy.toLowerCase().includes("express")) {
        if (!result.frameworks.includes("Express.js")) {
            result.frameworks.push("Express.js");
        }
    }

    // Calculate total
    result.totalDetected = Object.values(result)
        .filter(Array.isArray)
        .reduce((sum, arr) => sum + arr.length, 0);

    return result;
}

/**
 * Analyze a website's tech stack
 */
export async function analyzeTechStack(websiteUrl: string): Promise<TechStackResult> {
    const emptyResult: TechStackResult = {
        cms: [],
        frameworks: [],
        analytics: [],
        payments: [],
        marketing: [],
        ecommerce: [],
        hosting: [],
        other: [],
        totalDetected: 0,
    };

    if (!websiteUrl) return emptyResult;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const response = await fetch(websiteUrl, {
            signal: controller.signal,
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; AIFAIS TechStack Analyzer/1.0)",
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) return emptyResult;

        const html = await response.text();
        return detectTechnologies(html, response.headers);

    } catch {
        return emptyResult;
    }
}

/**
 * Get a summary of the tech stack
 */
export function getTechStackSummary(result: TechStackResult): string {
    const parts: string[] = [];

    if (result.cms.length) parts.push(`CMS: ${result.cms.join(", ")}`);
    if (result.frameworks.length) parts.push(`Frameworks: ${result.frameworks.join(", ")}`);
    if (result.ecommerce.length) parts.push(`E-commerce: ${result.ecommerce.join(", ")}`);
    if (result.payments.length) parts.push(`Payments: ${result.payments.join(", ")}`);

    return parts.join(" | ") || "Geen technologieën gedetecteerd";
}
