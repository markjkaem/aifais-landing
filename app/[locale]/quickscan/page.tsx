import { Metadata } from "next";
import QuickScanClient from "./QuickScanClient";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Gratis Automatisering Quickscan | Bereken Jouw Besparing | Aifais",
  description:
    "Ontdek in 2 minuten hoeveel tijd en geld jouw bedrijf kan besparen met n8n workflow automatisering. Gratis quickscan, direct resultaat, geen verplichtingen.",

  keywords: [
    "workflow automatisering berekenen",
    "besparing calculator",
    "n8n quickscan",
    "automatisering ROI calculator",
    "bedrijfsproces besparing",
    "gratis automatisering scan",
  ],

  openGraph: {
    title: "Gratis Automatisering Quickscan | Bereken Jouw Besparing",
    description:
      "Ontdek in 2 minuten hoeveel tijd jouw team kan besparen met workflow automatisering. Gratis, direct resultaat.",
    url: "https://aifais.com/quickscan",
    type: "website",
    images: [
      {
        url: "https://aifais.com/og-quickscan.jpg", // ✅ MAAK DEZE IMAGE
        width: 1200,
        height: 630,
        alt: "Gratis Automatisering Quickscan - Bereken jouw besparing",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gratis Automatisering Quickscan | Bereken Jouw Besparing",
    description:
      "Ontdek in 2 minuten hoeveel tijd jouw team kan besparen met workflow automatisering.",
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
            name: "Automatisering Quickscan Calculator",
            description:
              "Bereken hoeveel tijd en geld jouw bedrijf kan besparen met n8n workflow automatisering",
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
              name: "Aifais",
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
