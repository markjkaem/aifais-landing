import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { useTranslations } from "next-intl"; // Assuming next-intl is used in client or server logic

// --- 1. DEFINITIONS AND CONSTANTS ---
const BASE_URL = "https://aifais.com";
const OG_IMAGE_URL = `${BASE_URL}/og-image.jpg`;

// --- 2. SEO METADATA ---
export const metadata: Metadata = {
  // Title and Description remain the same
  title: "Bedrijfsautomatisering Nederland | Bespaar 40+ Uur/Week | AIFAIS",
  description:
    "Automatiseer repetitieve taken en bedrijfsprocessen voor MKB. Bespaar 40+ uur per week. Geen programmeerkennis nodig. Vanaf €2.500, live binnen 2 weken.",

  // Keywords are kept, but primarily for internal tracking/legacy
  keywords: [
    "bedrijfsautomatisering",
    "processen automatiseren",
    "tijd besparen automatisering",
    "automatisering mkb",
    "handmatige taken automatiseren",
    "repetitieve taken automatisch",
    "administratie automatiseren",
    "bedrijfsprocessen digitaliseren",
    "automatisering kleine bedrijven",
    "automatisering zonder programmeren",
  ],

  // OpenGraph (Social Media Previews)
  openGraph: {
    title: "Bedrijfsautomatisering Nederland | Bespaar 40+ Uur/Week",
    description:
      "Automatiseer handmatig werk voor MKB bedrijven. Bespaar tijd, voorkom fouten, schaal zonder extra personeel. Live binnen 2 weken.",
    url: BASE_URL,
    siteName: "AIFAIS", // ✅ Improvement: Added siteName
    locale: "nl_NL", // ✅ Improvement: Added locale for better regional targeting
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL, // Used constant
        width: 1200,
        height: 630,
        alt: "AIFAIS Bedrijfsautomatisering - Bespaar 40+ uur per week",
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "Bedrijfsautomatisering Nederland | Bespaar 40+ Uur/Week",
    description:
      "Automatiseer handmatig werk voor MKB. Stop met repetitieve taken. Live binnen 2 weken, vanaf €2.500.",
    images: [OG_IMAGE_URL], // Used constant
  },

  // Canonical URL
  alternates: {
    canonical: BASE_URL, // Used constant
  },

  // robots is redundant as index:true, follow:true is the default
};

// --- 3. SCHEMA COMPONENTS (FOR READABILITY) ---

// Component for FAQ Schema
const FAQSchema = () => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Hoelang duurt het voordat mijn processen geautomatiseerd zijn?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gemiddeld 2 weken van intake tot live. Simpele automatiseringen (zoals automatische emails of data-invoer) vaak binnen 1 week.",
        },
      },
      {
        "@type": "Question",
        name: "Hoe lang duurt de implementatie?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Van eerste gesprek tot live: gemiddeld 2-3 weken. Dit omvat intake, bouwen van de automatisering, testen, en training van jouw team.",
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

// Component for Service Schema
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

const OrganizationSchema = () => {
  const orgData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness", // Use LocalBusiness for geographically targeted services
    "@id": "https://aifais.com/#organization", // Match the ID you used in the Service Schema
    name: "AIFAIS Bedrijfsautomatisering",
    url: "https://aifais.com",
    logo: "https://aifais.com/logo.svg", // Replace with your actual logo path
    description:
      "Specialist in bedrijfsautomatisering en AI-integraties voor het MKB in Nederland.",
    areaServed: {
      "@type": "Country",
      name: "Nederland",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+31-XX-XXXX-XXXX", // Your official phone number
      contactType: "Sales",
      areaServed: "NL",
      availableLanguage: "Dutch",
    },
    // Crucial for E-E-A-T: Links to your social profiles
    sameAs: [
      "https://linkedin.com/company/aifais", // Vervang met jouw LinkedIn
      // "https://twitter.com/aifais", // Add other social profiles
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
    />
  );
};
// --- 4. SERVER COMPONENT (Cleaned up) ---
export default function HomePage() {
  const t = useTranslations("hero"); // Keep import, assume it's used elsewhere

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
