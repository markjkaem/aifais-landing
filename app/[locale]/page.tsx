import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { useTranslations } from "next-intl"; // Keep for consistency

// --- 1. DEFINITIONS AND CONSTANTS ---
const BASE_URL = "https://aifais.com";
const OG_IMAGE_URL = `${BASE_URL}/og-image.jpg`;

// --- 2. SEO METADATA (Optimized for MKB/ROI) ---
export const metadata: Metadata = {
  // ✅ IMPROVEMENT: Increased MKB keyword density in Title
  title: "AI & Procesautomatisering voor MKB | Bespaar 40+ Uur/Week | AIFAIS",
  description:
    "Automatiseer repetitieve taken en bedrijfsprocessen voor MKB. Bespaar direct 40+ uur per week. Geen programmeerkennis nodig. Vanaf €2.500, live binnen 2 weken.",

  // Keywords are fine for legacy tracking
  keywords: [
    "bedrijfsautomatisering",
    "procesautomatisering mkb", // Added highly relevant variation
    "tijd besparen automatisering",
    "automatisering mkb",
    "handmatige taken automatiseren",
    "repetitieve taken automatisch",
    "administratie automatiseren",
    "bedrijfsprocessen digitaliseren",
    "automatisering kleine bedrijven",
    "automatisering zonder programmeren",
  ],

  // OpenGraph (Social Media Previews) - Fine, uses new title
  openGraph: {
    title: "AI & Procesautomatisering voor MKB | Bespaar 40+ Uur/Week",
    description:
      "Automatiseer handmatig werk voor MKB bedrijven. Bespaar tijd, voorkom fouten, schaal zonder extra personeel. Live binnen 2 weken.",
    url: BASE_URL,
    siteName: "AIFAIS",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "AIFAIS Procesautomatisering MKB - Bespaar 40+ uur per week",
      },
    ],
  },

  // Twitter Cards - Fine
  twitter: {
    card: "summary_large_image",
    title: "AI & Procesautomatisering voor MKB | Bespaar 40+ Uur/Week",
    description:
      "Automatiseer handmatig werk voor MKB. Stop met repetitieve taken. Live binnen 2 weken, vanaf €2.500.",
    images: [OG_IMAGE_URL],
    creator: "@aifais", // ✅ Improvement: Added creator handle (if applicable)
  },

  alternates: {
    canonical: BASE_URL,
  },
};

// --- 3. SCHEMA COMPONENTS (Optimized for Rich Snippets & E-E-A-T) ---

// Component for FAQ Schema (Slightly reduced redundancy and optimized answer for speed promise)
const FAQSchema = () => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        // ✅ Refined question to focus on end-to-end speed
        name: "Wat is de doorlooptijd van intake tot livegang van de automatisering?",
        acceptedAnswer: {
          "@type": "Answer",
          // ✅ Refined answer to emphasize speed (matching title promise) and clarity
          text: "Gemiddeld 2 weken van intake tot livegang. Simpele automatiseringen zijn vaak al binnen 1 week live. Het proces omvat intake, bouwen, testen, en training.",
        },
      },
      {
        "@type": "Question",
        name: "Moet ik technische kennis hebben?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nee. Wij bouwen en implementeren alles. Jij krijgt een eenvoudig dashboard waar je in gewone taal aanpassingen kunt maken.",
        },
      },
      {
        "@type": "Question",
        name: "Wat kost automatisering gemiddeld?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vanaf €2.500 voor standaard automatisering (facturen, offertes, data-invoer). Complexe processen vanaf €5.000. Altijd transparante offerte vooraf.",
        },
      },
      {
        "@type": "Question",
        name: "Werkt dit met mijn huidige systemen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. We koppelen met 400+ tools zoals Google Workspace, Excel, HubSpot, Exact Online, Salesforce, Slack, en meer.",
        },
      },
      {
        "@type": "Question",
        name: "Wat als het niet werkt zoals verwacht?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We bieden 30 dagen gratis support na livegang. Daarna optionele onderhoudscontracten vanaf €200/maand.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
};

// Component for Service Schema (Anchors the pricing and service type)
const ServiceSchema = () => {
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Bedrijfsautomatisering voor MKB",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "Nederland",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Automatisering Diensten",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Standaard Bedrijfsautomatisering",
            description:
              "Automatiseer repetitieve taken zoals offertes, administratie, facturatie en rapportages. Bespaar direct 40+ uur per week.",
          },
          price: "2500",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Complexe Proces Automatisering",
            description:
              "Geavanceerde automatisering met meerdere systemen, complexe beslissingslogica en AI-integraties.",
          },
          price: "5000",
          priceCurrency: "EUR",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
    />
  );
};

// Component for Organization Schema (Crucial for E-E-A-T/Local SEO)
const OrganizationSchema = () => {
  const orgData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#organization`,
    name: "AIFAIS Bedrijfsautomatisering",
    url: BASE_URL,
    logo: `${BASE_URL}/logo_official.png`, // ✅ IMPROVEMENT: Assume a specific logo path
    description:
      "Specialist in bedrijfsautomatisering en AI-integraties voor het MKB in Nederland.",
    areaServed: {
      "@type": "Country",
      name: "Nederland",
    },
    priceRange: "€2500 - €5000+",
    // ✅ IMPROVEMENT: Added Address and corrected ContactPoint
    address: {
      "@type": "PostalAddress",
      streetAddress: "Groningenweg 8",
      addressLocality: "Gouda",
      addressRegion: "ZH",
      postalCode: "2802 PV",
      addressCountry: "NL",
    },
    contactPoint: {
      "@type": "ContactPoint",

      contactType: "Sales",
      areaServed: "NL",
      availableLanguage: "Dutch",
    },
    sameAs: [
      "https://www.linkedin.com/company/aifais-automatisering",
      // Add other social profiles like Twitter/X or Facebook here
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
    />
  );
};

// --- 4. SERVER COMPONENT ---
export default function HomePage() {
  const t = useTranslations("hero");

  return (
    <>
      <FAQSchema />
      <ServiceSchema />
      <OrganizationSchema />

      {/* Client Component */}
      <HomeClient />
    </>
  );
}
