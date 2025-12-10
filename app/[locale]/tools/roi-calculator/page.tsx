// ========================================
// FILE: app/tools/roi-calculator/page.tsx
// ========================================

import { AdvancedROICalculator } from "@/app/Components/ROICalculator";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ROI Calculator Automatisering | AIFAIS",
  description:
    "Bereken direct hoeveel tijd en geld uw organisatie bespaart met workflow automatisering en AI-agents. Geavanceerde analyse inclusief opportunity costs.",
};

export default function CalculatorPage() {
  // ✅ SCHEMA: SoftwareApplication (Google houdt van tools)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AIFAIS ROI Calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description:
      "Bereken de financiële impact van AI-automatisering op uw bedrijfsprocessen.",
  };

  return (
    <main className="bg-white min-h-screen font-sans text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-gray-50 to-white -z-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3066be]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* LEFT COLUMN: Copy & Trust */}
            <div className="lg:col-span-5 pt-4">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-semibold text-[#3066be] mb-6 hover:underline"
              >
                ← Terug naar Home
              </Link>

              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                Stop met gissen.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-purple-600">
                  Bereken je Winst.
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Handmatig werk kost meer dan alleen uren. Het kost je groei,
                focus en werkplezier. Gebruik onze geavanceerde modelleer-tool
                om exact te zien wat AI-automatisering jouw organisatie
                oplevert.
              </p>

              {/* Trust Badges */}
              <div className="mb-10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Wij automatiseren processen in
                </p>
                <div className="flex flex-wrap gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Simpele tekst placeholders, vervang met SVG logos voor max effect */}
                  {[
                    "HubSpot",
                    "Exact Online",
                    "Salesforce",
                    "Afas",
                    "Shopify",
                  ].map((brand) => (
                    <span
                      key={brand}
                      className="px-3 py-1.5 bg-gray-100 rounded text-xs font-bold text-gray-500"
                    >
                      {brand}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 bg-gray-100 rounded text-xs font-bold text-gray-500">
                    +400 Meer
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-[#3066be] p-5 rounded-r-lg">
                <p className="text-sm text-[#3066be] font-medium italic">
                  "De meeste MKB-bedrijven onderschatten hun verborgen kosten
                  met factor 3. Deze tool maakt dat eindelijk inzichtelijk."
                </p>
                <p className="text-xs text-gray-500 mt-2 font-bold">
                  — Mark Teekens, Founder AIFAIS
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: The Calculator Tool */}
            <div className="lg:col-span-7 w-full relative z-10">
              <div className="relative">
                {/* Shadow glow behind calculator */}
                {/* 👇 FIX: 'pointer-events-none' toegevoegd zodat je er doorheen klikt */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3066be] to-purple-600 rounded-2xl blur opacity-20 pointer-events-none"></div>
                <AdvancedROICalculator />
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                * Berekening gebaseerd op gemiddelde markttarieven en
                productiviteitsdata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPLAINER SECTION --- */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hoe werkt deze berekening?
            </h2>
            <p className="text-gray-600">
              We kijken verder dan alleen het uurtarief.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Directe Loonkosten",
                desc: "Het bruto salaris dat je betaalt voor de uren die nu opgaan aan repeterend 'copy-paste' werk.",
                icon: "💰",
              },
              {
                title: "Opportunity Cost",
                desc: "De omzet die je misloopt. Als een accountmanager administratie doet, kan hij niet verkopen. Dat kost geld.",
                icon: "📉",
              },
              {
                title: "FTE Capaciteit",
                desc: "Door uren vrij te spelen, creëer je 'virtuele medewerkers'. Je kunt groeien zonder nieuwe mensen aan te nemen.",
                icon: "🚀",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-[#0f172a] text-white text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Schrik je van de cijfers?
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Dat is normaal. De meeste bedrijven realiseren zich pas hoeveel geld
            er weglekt als ze het zwart op wit zien. Laten we dat lek dichten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-white hover:text-[#3066be] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Start Met Besparen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
