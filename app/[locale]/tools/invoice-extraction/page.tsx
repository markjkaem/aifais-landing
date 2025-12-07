import { Metadata } from "next";
import ScannerClient from "./ScannerClient";

// --- 1. DEFINITIONS ---
const BASE_URL = "https://aifais.com";
const OG_IMAGE_URL = `${BASE_URL}/og-scanner.jpg`;

// --- 2. SEO METADATA ---
export const metadata: Metadata = {
  title: "AI Factuur Scanner | PDF naar Excel in seconden | AIFAIS",
  description:
    "Scan facturen en bonnetjes direct naar Excel/CSV met AI. Herkent KvK, BTW en totalen automatisch. Geen abonnement, betaal per scan.",
  keywords: [
    "factuur scannen",
    "pdf naar excel",
    "ocr software",
    "boekhouding automatiseren",
    "bonnetjes scannen",
    "aifais scanner",
  ],
  openGraph: {
    title: "AI Factuur Scanner | Direct van PDF naar Excel",
    description:
      "Stop met overtypen. Sleep je factuur hierheen en krijg direct de data in Excel formaat.",
    url: `${BASE_URL}/tools/invoice-extraction`,
    siteName: "AIFAIS Tools",
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/tools/invoice-extraction`,
  },
};

// --- 3. SCHEMA (SoftwareApplication) ---
const ToolSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AIFAIS Factuur Scanner",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0.50",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    description:
      "AI-gedreven tool om PDF facturen en afbeeldingen te converteren naar gestructureerde data (CSV/Excel).",
    featureList: "KvK herkenning, BTW uitsplitsing, PDF conversie",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

// --- 4. SERVER COMPONENT RENDER ---
export default function FactuurScannerPage() {
  return (
    <div className="min-h-screen bg-[#fbfff1] font-sans relative flex flex-col items-center justify-center p-6 overflow-hidden text-gray-900">
      <ToolSchema />

      {/* 1. Grid Background Effect (Light Mode) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3066be10_1px,transparent_1px),linear-gradient(to_bottom,#3066be10_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* 2. Radial Gradient for Focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3066be15,transparent)]"></div>

      {/* 3. Header Content */}
      <div className="relative z-10 max-w-2xl w-full text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3066be]/10 border border-[#3066be]/20 text-xs text-[#3066be] font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Aifais Intelligence Engine v1.0
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Factuur{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-purple-600">
            Scanner
          </span>
        </h1>
        <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
          Sleep je PDF of bonnetje hierheen. Wij extraheren de data en
          controleren het KvK nummer.
        </p>
      </div>

      {/* 4. The Interactive Tool */}
      <div className="relative z-10 w-full flex justify-center">
        <ScannerClient />
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-12 text-center">
        <p className="text-xs text-gray-500">
          Beveiligd met 256-bit encryptie • Geen data opslag • Powered by
          Anthropic & Stripe
        </p>
      </div>
    </div>
  );
}
