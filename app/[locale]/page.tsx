import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { useTranslations } from "next-intl";

// --- 1. DEFINITIONS AND CONSTANTS ---
const BASE_URL = "https://aifais.com";
// Ensure this image exists in your public folder
const OG_IMAGE_URL = "/og-image.jpg";

// --- 2. SEO METADATA (Optimized for MKB/ROI) ---
export const metadata: Metadata = {
  // ✅ FIX: Define metadataBase to resolve relative URLs for OG images
  metadataBase: new URL(BASE_URL),

  title: {
    default:
      "AI & Procesautomatisering voor MKB | Bespaar 40+ Uur/Week | AIFAIS",
    template: "%s | AIFAIS",
  },
  description:
    "Automatiseer repetitieve taken en bedrijfsprocessen voor MKB. Bespaar direct 40+ uur per week. Geen programmeerkennis nodig. Vanaf €2.500, live binnen 2 weken.",

  keywords: [
    "bedrijfsautomatisering",
    "procesautomatisering mkb",
    "tijd besparen automatisering",
    "automatisering mkb",
    "workflow management software", // Added high volume keyword
    "administratie automatiseren",
    "bedrijfsprocessen digitaliseren",
    "automatisering kleine bedrijven",
    "zapier specialist nederland", // Specific intent
    "make.com expert", // Specific intent
  ],

  // ✅ FIX: Explicit robots tag
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

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

  twitter: {
    card: "summary_large_image",
    title: "AI & Procesautomatisering voor MKB | Bespaar 40+ Uur/Week",
    description:
      "Automatiseer handmatig werk voor MKB. Stop met repetitieve taken. Live binnen 2 weken, vanaf €2.500.",
    images: [OG_IMAGE_URL],
    // creator: "@aifais", // Uncomment if you have a Twitter handle
  },

  alternates: {
    canonical: BASE_URL,
    // ✅ TIP: If you have English pages, enable this:
    // languages: {
    //   'en-US': '/en',
    //   'nl-NL': '/nl',
    // },
  },

  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  // },
};

// --- 3. SCHEMA COMPONENTS (Optimized for Rich Snippets & E-E-A-T) ---

const FAQSchema = () => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wat is de doorlooptijd van intake tot livegang van de automatisering?",
        acceptedAnswer: {
          "@type": "Answer",
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
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
};

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
          price: "2500.00",
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
          price: "5000.00",
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

const OrganizationSchema = () => {
  const orgData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#organization`,
    name: "AIFAIS Bedrijfsautomatisering",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-official.png`,
    image: `${BASE_URL}/og-image.jpg`, // Added Image property
    description:
      "Specialist in bedrijfsautomatisering en AI-integraties voor het MKB in Nederland.",
    areaServed: {
      "@type": "Country",
      name: "Nederland",
    },
    priceRange: "€2500 - €5000+",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Groningenweg 8",
      addressLocality: "Gouda",
      addressRegion: "Zuid-Holland",
      postalCode: "2803 PV",
      addressCountry: "NL",
    },
    // ✅ FIX: Contact info is crucial for Local SEO trust
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+31 6 1842 4470",
      email: "contact@aifais.com",
      contactType: "customer service",
      areaServed: "NL",
      availableLanguage: ["Dutch", "English"],
    },
    sameAs: [
      "https://www.linkedin.com/company/aifais", // Verify this URL
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
