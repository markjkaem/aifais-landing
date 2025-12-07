// ========================================
// FILE: app/quickscan/page.tsx
// ========================================

import { Metadata } from "next";
import QuickScanClient from "./QuickScanClient";

// ✅ SEO METADATA (High CTR Focus)
export const metadata: Metadata = {
  title: "Gratis Automatisering QuickScan | Bereken Jouw ROI | AIFAIS",
  description:
    "Hoeveel uur kan jouw team besparen? Vul 5 vragen in en krijg direct een schatting van jouw tijd- en kostenbesparing met AI-automatisering.",

  keywords: [
    "automatisering berekenen",
    "besparing calculator mkb",
    "tijd besparen berekenen",
    "automatisering ROI calculator",
    "gratis process scan",
    "kosten besparen automatisering",
  ],

  openGraph: {
    title: "Gratis Automatisering QuickScan | Bereken Jouw Besparing",
    description:
      "Ontdek in 2 minuten hoeveel tijd jouw team kan besparen met bedrijfsautomatisering. Krijg direct een persoonlijk rapport.",
    url: "https://aifais.com/quickscan",
    type: "website",
    locale: "nl_NL",
    siteName: "AIFAIS",
    images: [
      {
        url: "https://aifais.com/og-quickscan.jpg",
        width: 1200,
        height: 630,
        alt: "AIFAIS Automatisering Calculator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gratis Automatisering QuickScan | Bereken Jouw Besparing",
    description: "Ontdek in 2 minuten hoeveel tijd jouw team kan besparen.",
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

export default function QuickScanPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Automatisering ROI Calculator",
    description:
      "Bereken hoeveel tijd en geld jouw bedrijf kan besparen met slimme bedrijfsautomatisering.",
    url: "https://aifais.com/quickscan",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Gratis automatisering quickscan",
    },
    provider: {
      "@type": "Organization",
      name: "AIFAIS",
      "@id": "https://aifais.com/#organization",
    },
  };

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
        name: "QuickScan",
        item: "https://aifais.com/quickscan",
      },
    ],
  };

  return (
    <main className="bg-white min-h-screen text-gray-900">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ✅ SERVER-SIDE HERO SECTION (Light Theme) */}
      <section className="relative pt-24 pb-12 px-6 overflow-hidden text-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#3066be]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="text-[#3066be] text-sm font-semibold tracking-wide uppercase">
              ⏱️ Duurt slechts 2 minuten
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Bereken Jouw <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-purple-600">
              Automatisering Potentieel
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Vul 5 vragen in over jouw bedrijfsprocessen en zie direct hoeveel
            uur (en euro's) je wekelijks laat liggen.
          </p>
        </div>
      </section>

      {/* ✅ CLIENT COMPONENT (The Interactive Calculator) */}
      <QuickScanClient />
    </main>
  );
}
