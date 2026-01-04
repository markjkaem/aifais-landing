import { Metadata } from "next";
import ToolsPageClient from "./ToolsPageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

// SEO Configuration
const SEO_CONFIG = {
  siteName: "AIFAIS",
  siteUrl: "https://aifais.com",
  title: "100+ AI Tools voor Ondernemers | Gratis Business Automatisering",
  description: "Ontdek 100+ professionele AI tools voor het Nederlandse MKB. Facturen scannen, contracten analyseren, offertes maken, HR automatisering en meer. Geen abonnement nodig.",
  keywords: [
    "AI tools",
    "business automatisering",
    "factuur scanner",
    "contract checker",
    "MKB software",
    "Nederlandse AI tools",
    "gratis business tools",
    "offerte generator",
    "AI administratie",
    "automatisering ondernemers",
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isNL = locale === "nl";
  const canonicalUrl = `${SEO_CONFIG.siteUrl}${isNL ? "" : "/" + locale}/tools`;

  return {
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    keywords: SEO_CONFIG.keywords,
    authors: [{ name: "AIFAIS", url: SEO_CONFIG.siteUrl }],
    creator: "AIFAIS",
    publisher: "AIFAIS",
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
    alternates: {
      canonical: canonicalUrl,
      languages: {
        nl: `${SEO_CONFIG.siteUrl}/tools`,
        en: `${SEO_CONFIG.siteUrl}/en/tools`,
        "x-default": `${SEO_CONFIG.siteUrl}/tools`,
      },
    },
    openGraph: {
      type: "website",
      locale: isNL ? "nl_NL" : "en_US",
      url: canonicalUrl,
      siteName: SEO_CONFIG.siteName,
      title: SEO_CONFIG.title,
      description: SEO_CONFIG.description,
      images: [
        {
          url: `${SEO_CONFIG.siteUrl}/og/tools-overview.png`,
          width: 1200,
          height: 630,
          alt: "AIFAIS AI Tools voor Ondernemers",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aifais",
      creator: "@aifais",
      title: SEO_CONFIG.title,
      description: SEO_CONFIG.description,
      images: [`${SEO_CONFIG.siteUrl}/og/tools-overview.png`],
    },
    category: "technology",
    classification: "Business Software",
  };
}

// JSON-LD Structured Data
function generateJsonLd(locale: string) {
  const isNL = locale === "nl";

  return {
    "@context": "https://schema.org",
    "@graph": [
      // WebPage
      {
        "@type": "WebPage",
        "@id": `${SEO_CONFIG.siteUrl}/tools#webpage`,
        url: `${SEO_CONFIG.siteUrl}${isNL ? "" : "/" + locale}/tools`,
        name: SEO_CONFIG.title,
        description: SEO_CONFIG.description,
        isPartOf: { "@id": `${SEO_CONFIG.siteUrl}#website` },
        inLanguage: isNL ? "nl-NL" : "en-US",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SEO_CONFIG.siteUrl}/og/tools-overview.png`,
        },
        breadcrumb: { "@id": `${SEO_CONFIG.siteUrl}/tools#breadcrumb` },
      },
      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": `${SEO_CONFIG.siteUrl}/tools#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SEO_CONFIG.siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "AI Tools",
            item: `${SEO_CONFIG.siteUrl}/tools`,
          },
        ],
      },
      // ItemList (Tools Collection)
      {
        "@type": "ItemList",
        "@id": `${SEO_CONFIG.siteUrl}/tools#toolslist`,
        name: "AI Tools voor Ondernemers",
        description: "Complete collectie van AI-powered business tools",
        numberOfItems: 35,
        itemListElement: [
          {
            "@type": "SoftwareApplication",
            position: 1,
            name: "Factuur Scanner",
            description: "Zet PDF facturen om naar Excel/CSV met AI. Herkent automatisch KvK, BTW-nummers en alle regels.",
            url: `${SEO_CONFIG.siteUrl}/tools/invoice-extraction`,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "156",
            },
          },
          {
            "@type": "SoftwareApplication",
            position: 2,
            name: "Contract Checker",
            description: "Upload een contract en krijg direct een AI-analyse van risico's en valkuilen.",
            url: `${SEO_CONFIG.siteUrl}/tools/contract-checker`,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
          },
          {
            "@type": "SoftwareApplication",
            position: 3,
            name: "Offerte Generator",
            description: "Genereer professionele offertes met AI. Direct PDF export.",
            url: `${SEO_CONFIG.siteUrl}/tools/quote-generator`,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
          },
          {
            "@type": "SoftwareApplication",
            position: 4,
            name: "Factuur Maker",
            description: "Maak professionele facturen in seconden. Gratis, geen account nodig.",
            url: `${SEO_CONFIG.siteUrl}/tools/invoice-creation`,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
          },
        ],
      },
      // Organization
      {
        "@type": "Organization",
        "@id": `${SEO_CONFIG.siteUrl}#organization`,
        name: "AIFAIS",
        url: SEO_CONFIG.siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${SEO_CONFIG.siteUrl}/logo.png`,
        },
        sameAs: [
          "https://twitter.com/aifais",
          "https://linkedin.com/company/aifais",
        ],
      },
      // WebSite
      {
        "@type": "WebSite",
        "@id": `${SEO_CONFIG.siteUrl}#website`,
        url: SEO_CONFIG.siteUrl,
        name: SEO_CONFIG.siteName,
        description: "AI Tools voor Nederlandse Ondernemers",
        publisher: { "@id": `${SEO_CONFIG.siteUrl}#organization` },
        inLanguage: ["nl-NL", "en-US"],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SEO_CONFIG.siteUrl}/tools?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      // FAQPage for common questions
      {
        "@type": "FAQPage",
        "@id": `${SEO_CONFIG.siteUrl}/tools#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Zijn de AI tools gratis te gebruiken?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja, veel van onze AI tools zijn gratis te gebruiken zonder account. Voor sommige premium functies geldt een pay-per-use model.",
            },
          },
          {
            "@type": "Question",
            name: "Hoe veilig zijn mijn documenten?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Al je documenten worden verwerkt met end-to-end encryptie en worden niet opgeslagen na verwerking. We voldoen aan de AVG/GDPR wetgeving.",
            },
          },
          {
            "@type": "Question",
            name: "Welke bestandsformaten worden ondersteund?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Onze tools ondersteunen PDF, Word (DOCX), Excel (XLSX), en afbeeldingen (PNG, JPG). Specifieke tools kunnen aanvullende formaten ondersteunen.",
            },
          },
        ],
      },
    ],
  };
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  const jsonLd = generateJsonLd(locale);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Content */}
      <ToolsPageClient locale={locale} />
    </>
  );
}
