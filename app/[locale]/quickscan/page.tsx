import { Metadata } from "next";
import QuickScanClient from "./QuickScanClient";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Gratis Automatisering QuickScan | Bereken Jouw Besparing | AIFAIS",
  description:
    "Ontdek in 2 minuten hoeveel tijd en geld jouw bedrijf kan besparen met slimme automatisering. Gratis quickscan, direct resultaat, geen verplichtingen.",

  keywords: [
    "automatisering berekenen",
    "besparing calculator",
    "tijd besparen berekenen",
    "automatisering ROI calculator",
    "bedrijfsproces besparing",
    "gratis automatisering scan",
    "hoeveel tijd besparen",
    "automatisering kosten baten",
  ],

  openGraph: {
    title: "Gratis Automatisering QuickScan | Bereken Jouw Besparing",
    description:
      "Ontdek in 2 minuten hoeveel tijd jouw team kan besparen met bedrijfsautomatisering. Gratis, direct resultaat.",
    url: "https://aifais.com/quickscan",
    type: "website",
    images: [
      {
        url: "https://aifais.com/og-quickscan.jpg",
        width: 1200,
        height: 630,
        alt: "Gratis Automatisering QuickScan - Bereken jouw besparing",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gratis Automatisering QuickScan | Bereken Jouw Besparing",
    description:
      "Ontdek in 2 minuten hoeveel tijd jouw team kan besparen met automatisering.",
    images: ["https://aifais.com/og-quickscan.jpg"],
  },

  alternates: {
    canonical: "https://aifais.com/quickscan",
  },

  robots: {
    index: true,
    follow: true,
  },
};

// Server Component (voor metadata)
export default function QuickScanPage() {
  return (
    <>
      {/* ✅ SCHEMA.ORG - WEB APPLICATION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Automatisering QuickScan Calculator",
            description:
              "Bereken hoeveel tijd en geld jouw bedrijf kan besparen met slimme bedrijfsautomatisering. Geen programmeerkennis nodig.",
            url: "https://aifais.com/quickscan",
            applicationCategory: "BusinessApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
              description: "Gratis automatisering quickscan",
            },
            provider: {
              "@type": "Organization",
              name: "AIFAIS",
              url: "https://aifais.com",
            },
          }),
        }}
      />

      {/* Client Component */}
      <QuickScanClient />
    </>
  );
}
