import { Metadata } from "next";
import HomeClient from "./HomeClient";

// ✅ SEO METADATA (Dit was al in layout.tsx, maar homepage kan specifiekere metadata hebben)
export const metadata: Metadata = {
  title:
    "n8n Workflow Automatisering Nederland | Bespaar 40+ Uur/Week | Aifais",
  description:
    "n8n workflow automatisering specialist voor Nederlandse MKB-bedrijven. Bespaar 40+ uur per week door repetitieve taken te automatiseren. Vanaf €2.500, live binnen 2 weken.",

  keywords: [
    "n8n automatisering",
    "workflow automatisering Nederland",
    "n8n specialist",
    "bedrijfsprocessen automatiseren",
    "n8n consultant Nederland",
    "automatisering MKB",
    "handmatig werk automatiseren",
    "n8n workflows bouwen",
  ],

  openGraph: {
    title: "n8n Workflow Automatisering Nederland | Bespaar 40+ Uur/Week",
    description:
      "Specialist in n8n workflow automatisering voor Nederlandse MKB-bedrijven. Bespaar tijd, voorkom fouten, schaal zonder extra personeel.",
    url: "https://aifais.com",
    type: "website",
    images: [
      {
        url: "https://aifais.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aifais n8n Workflow Automatisering - Bespaar 40+ uur per week",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "n8n Workflow Automatisering Nederland | Bespaar 40+ Uur/Week",
    description:
      "Specialist in n8n workflow automatisering voor Nederlandse MKB-bedrijven. Live binnen 2 weken, vanaf €2.500.",
    images: ["https://aifais.com/og-image.jpg"],
  },

  alternates: {
    canonical: "https://aifais.com",
  },

  robots: {
    index: true,
    follow: true,
  },
};

// Server Component (voor metadata + schema)
export default function HomePage() {
  return (
    <>
      {/* ✅ SCHEMA.ORG - FAQ PAGE (voor je FAQ sectie) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Hoelang duurt het voordat een workflow live is?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Gemiddeld 2 weken van intake tot go-live. Simpele workflows (zoals data-sync) vaak binnen 1 week.",
                },
              },
              {
                "@type": "Question",
                name: "Hoe lang duurt de implementatie van een n8n workflow?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Van eerste gesprek tot go-live: gemiddeld 2-3 weken. Dit omvat intake, development, testing, en training van jouw team.",
                },
              },
              {
                "@type": "Question",
                name: "Moet ik technische kennis hebben?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Nee. Wij bouwen en implementeren alles. Jij krijgt een dashboard waar je in gewone taal aanpassingen kunt maken.",
                },
              },
              {
                "@type": "Question",
                name: "Wat kost een workflow gemiddeld?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Vanaf €2.500 voor een standaard workflow. Complexe multi-step automatiseringen vanaf €5.000. Altijd transparante offerte vooraf.",
                },
              },
              {
                "@type": "Question",
                name: "Werken jullie ook met ons bestaande software?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Ja. n8n integreert met 400+ tools zoals Google Workspace, HubSpot, Exact Online, Salesforce, Slack, en meer.",
                },
              },
              {
                "@type": "Question",
                name: "Wat als de workflow niet werkt zoals verwacht?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We bieden 30 dagen gratis support na go-live. Daarna optionele onderhoudscontracten vanaf €200/maand.",
                },
              },
            ],
          }),
        }}
      />

      {/* ✅ SCHEMA.ORG - SERVICE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "n8n Workflow Automatisering",
            provider: {
              "@type": "LocalBusiness",
              "@id": "https://aifais.com/#organization",
            },
            areaServed: {
              "@type": "Country",
              name: "Nederland",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Automatisering Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Standaard Workflow Automatisering",
                    description:
                      "Automatiseer repetitieve taken zoals offertes, data-invoer en rapportages",
                  },
                  price: "2500",
                  priceCurrency: "EUR",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Complexe Multi-Step Automatisering",
                    description:
                      "Geavanceerde workflows met meerdere systemen en complexe logica",
                  },
                  price: "5000",
                  priceCurrency: "EUR",
                },
              ],
            },
          }),
        }}
      />

      {/* Client Component */}
      <HomeClient />
    </>
  );
}
