import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getTranslations } from "next-intl/server";
import { getProjects } from "./portfolio/data";

interface Props {
  params: Promise<{ locale: string }>;
}

const BASE_URL = "https://aifais.com";
const OG_IMAGE_URL = "/og-image.jpg";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homePage.metadata" });

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: t("title"),
      template: "%s | AIFAIS",
    },
    description: t("description"),
    keywords: t("keywords").split(","),
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
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}`,
      siteName: "AIFAIS",
      locale: locale === "nl" ? "nl_NL" : "en_US",
      type: "website",
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: "AIFAIS",
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'en': '/en',
        'nl': '/',
      },
    },
  };
}

async function FAQSchema({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "homePage.faq" });
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("q1"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("a1"),
        },
      },
      {
        "@type": "Question",
        name: t("q2"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("a2"),
        },
      },
      {
        "@type": "Question",
        name: t("q3"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("a3"),
        },
      },
      {
        "@type": "Question",
        name: t("q4"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("a4"),
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
}

async function ServiceSchema({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "homePage.schemas" });
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: t("serviceType"),
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
            name: t("standardService"),
            description: t("standardDesc"),
          },
          price: "2500.00",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: t("complexService"),
            description: t("complexDesc"),
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
}

async function OrganizationSchema({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "homePage.schemas" });
  const orgData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#organization`,
    name: "AIFAIS Bedrijfsautomatisering",
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/logo-official.png`,
    image: `${BASE_URL}/og-image.jpg`,
    description: t("orgDescription"),
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
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+31 6 1842 4470",
      email: "contact@aifais.com",
      contactType: "customer service",
      areaServed: "NL",
      availableLanguage: ["Dutch", "English"],
    },
    sameAs: [
      "https://www.linkedin.com/company/aifais",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
    />
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const projects = getProjects(locale);

  return (
    <>
      <FAQSchema locale={locale} />
      <ServiceSchema locale={locale} />
      <OrganizationSchema locale={locale} />

      <HomeClient projects={projects} />
    </>
  );
}
