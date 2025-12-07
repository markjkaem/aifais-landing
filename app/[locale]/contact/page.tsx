// ========================================
// FILE: app/contact/page.tsx - LIGHT THEME
// ========================================

import { Metadata } from "next";
import ContactClient from "./ContactClient";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Contact AIFAIS | Plan Je Gratis Analyse Gesprek",
  description:
    "Klaar om tijd te besparen? Neem contact op voor een gratis haalbaarheidscheck. Specialist in n8n & AI automatisering. Gevestigd in Gouda, actief in heel Nederland.",

  keywords: [
    "contact aifais",
    "automatisering specialist inhuren",
    "n8n consultant contact",
    "bedrijfsautomatisering offerte aanvragen",
    "automatisering nederland",
    "gratis analyse gesprek automatisering",
  ],

  openGraph: {
    title: "Contact AIFAIS | Start Met Automatiseren",
    description:
      "Plan direct een gratis consult of analyse gesprek. Wij reageren binnen 24 uur.",
    url: "https://aifais.com/contact",
    type: "website",
    locale: "nl_NL",
    siteName: "AIFAIS",
    images: [
      {
        url: "https://aifais.com/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Neem contact op met AIFAIS",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact AIFAIS | Gratis Automatisering Consult",
    description: "Plan direct een gratis consult of analyse gesprek.",
    images: ["https://aifais.com/og-contact.jpg"],
  },

  alternates: {
    canonical: "https://aifais.com/contact",
  },
};

export default function ContactPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://aifais.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: "https://aifais.com/contact",
      },
    ],
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact AIFAIS",
    description:
      "Neem contact op met AIFAIS voor bedrijfsautomatisering en procesoptimalisatie",
    url: "https://aifais.com/contact",
    mainEntity: {
      "@type": "LocalBusiness",
      "@id": "https://aifais.com/#organization",
      name: "AIFAIS",
      telephone: "+31-6 18424470",
      email: "contact@aifais.com",
      areaServed: {
        "@type": "Country",
        name: "Nederland",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Groningenweg 8",
        postalCode: "2803 PV",
        addressLocality: "Gouda",
        addressRegion: "Zuid-Holland",
        addressCountry: "NL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "52.0115",
        longitude: "4.7104",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <ContactClient />
    </>
  );
}
