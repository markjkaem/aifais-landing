import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { useTranslations } from "next-intl";

// ✅ SEO METADATA - Aangepast voor normale bedrijfseigenaren
export const metadata: Metadata = {
  title: "Bedrijfsautomatisering Nederland | Bespaar 40+ Uur/Week | AIFAIS",
  description:
    "Automatiseer repetitieve taken en bedrijfsprocessen voor MKB. Bespaar 40+ uur per week. Geen programmeerkennis nodig. Vanaf €2.500, live binnen 2 weken.",

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

  openGraph: {
    title: "Bedrijfsautomatisering Nederland | Bespaar 40+ Uur/Week",
    description:
      "Automatiseer handmatig werk voor MKB bedrijven. Bespaar tijd, voorkom fouten, schaal zonder extra personeel. Live binnen 2 weken.",
    url: "https://aifais.com",
    type: "website",
    images: [
      {
        url: "https://aifais.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AIFAIS Bedrijfsautomatisering - Bespaar 40+ uur per week",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bedrijfsautomatisering Nederland | Bespaar 40+ Uur/Week",
    description:
      "Automatiseer handmatig werk voor MKB. Stop met repetitieve taken. Live binnen 2 weken, vanaf €2.500.",
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
  const t = useTranslations("hero");
  return (
    <>
      {/* ✅ SCHEMA.ORG - FAQ PAGE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
            serviceType: "Bedrijfsautomatisering voor MKB",
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
          }),
        }}
      />

      {/* Client Component */}
      <HomeClient />
    </>
  );
}
