// ========================================
// FILE: app/tools/roi-calculator/page.tsx
// Premium Fintech/Consultancy Aesthetic
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import { DM_Sans, Fraunces } from "next/font/google";
import ROICalculatorPageClient from "./ROICalculatorPageClient";

// Font loaders MUST be in module scope (outside component)
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ROI Calculator | Bereken uw automatiseringspotentieel | AIFAIS",
  description:
    "Ontdek exact hoeveel tijd en kapitaal uw organisatie kan vrijspelen met AI-gedreven procesautomatisering. Wetenschappelijk onderbouwde berekening.",
};

export default function CalculatorPage() {
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
      "Professionele ROI-analyse voor AI-procesautomatisering in het MKB.",
  };

  const integrations = [
    { name: "Exact Online", category: "Boekhouding" },
    { name: "AFAS", category: "ERP" },
    { name: "Salesforce", category: "CRM" },
    { name: "HubSpot", category: "Marketing" },
    { name: "Shopify", category: "E-commerce" },
    { name: "Microsoft 365", category: "Productiviteit" },
  ];

  const methodology = [
    {
      number: "01",
      title: "Directe arbeidskosten",
      description:
        "Bruto loonkosten inclusief werkgeverslasten voor uren besteed aan repetitieve, regelgebonden taken die geautomatiseerd kunnen worden.",
      metric: "€/uur × uren/week",
    },
    {
      number: "02",
      title: "Opportuniteitskosten",
      description:
        "Gederfde omzet doordat kenniswerkers tijd besteden aan administratie in plaats van waardecreërende activiteiten zoals acquisitie of klantcontact.",
      metric: "Potentiële omzet/uur",
    },
    {
      number: "03",
      title: "Schaalbaarheid",
      description:
        "Vrijgespeelde capaciteit uitgedrukt in FTE-equivalenten. Groei realiseren zonder uitbreiding van de personeelsbasis.",
      metric: "FTE-besparing/jaar",
    },
  ];

  return (
    <main
      className={`${dmSans.variable} ${fraunces.variable} bg-[#fafafa] min-h-screen antialiased`}
    >
      <style>{`
        .font-display { font-family: var(--font-display), Georgia, serif; }
        .font-body { font-family: var(--font-body), system-ui, sans-serif; }
        .grain::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .number-accent { font-feature-settings: 'tnum' on, 'lnum' on; }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- CALCULATOR SECTION --- */}
      <section className="relative py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Calculator */}
            <div className="lg:col-span-7 xl:col-span-8 opacity-0 animate-fade-up delay-400">
              <ROICalculatorPageClient />

              <p className="font-body text-xs text-gray-400 mt-6 text-center">
                Berekeningen gebaseerd op CBS-loondata 2024 en sectorgemiddelden
                voor productiviteit.
              </p>
            </div>

            {/* Right: Methodology */}
            <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
                  Onze methodologie
                </h2>

                <div className="space-y-8">
                  {methodology.map((item, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start gap-4">
                        <span className="font-display text-3xl font-bold text-gray-200 group-hover:text-[#3066be]/20 transition-colors number-accent">
                          {item.number}
                        </span>
                        <div className="flex-1 pt-1">
                          <h3 className="font-body font-semibold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="font-body text-sm text-gray-600 leading-relaxed mb-2">
                            {item.description}
                          </p>
                          <span className="inline-block font-mono text-xs text-[#3066be] bg-[#3066be]/5 px-2 py-1 rounded">
                            {item.metric}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="mt-6 p-6 bg-[#3066be] rounded-2xl text-white">
                <svg
                  className="w-8 h-8 text-white/20 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-body text-sm leading-relaxed text-white/90 mb-4">
                  "De meeste MKB-bedrijven onderschatten hun operationele
                  inefficiëntie met een factor drie. Pas wanneer je het
                  kwantificeert, wordt de urgentie duidelijk."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-display font-bold text-sm">
                    MT
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-white">
                      Mark Teekens
                    </p>
                    <p className="font-body text-xs text-white/60">
                      Founder, AIFAIS
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* --- INTEGRATIONS SECTION --- */}
      <section className="py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-4 block">
              Ecosysteem
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
              Naadloze integratie met uw bestaande stack
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-[#3066be]/30 hover:shadow-lg hover:shadow-[#3066be]/5 transition-all duration-300"
              >
                <div className="font-body font-semibold text-gray-900 mb-1">
                  {integration.name}
                </div>
                <div className="font-body text-xs text-gray-400">
                  {integration.category}
                </div>
              </div>
            ))}
          </div>

          <p className="font-body text-sm text-gray-500 text-center mt-8">
            + meer dan 400 aanvullende integraties via API en
            webhook-koppelingen
          </p>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative py-24 bg-[#3066be] overflow-hidden grain">
        {/* Geometric accents */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-amber-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-6 block">
            Volgende stap
          </span>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Van inzicht naar{" "}
            <span className="relative inline-block">
              <span className="relative z-10">implementatie</span>
              <span className="absolute bottom-1 left-0 right-0 h-2 bg-amber-400/30 -z-0" />
            </span>
          </h2>

          <p className="font-body text-lg text-white/70 leading-relaxed mb-10 max-w-xl mx-auto">
            De cijfers zijn duidelijk. Laten we bespreken hoe we deze
            besparingen voor uw organisatie kunnen realiseren — binnen 30 dagen
            operationeel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 font-body font-semibold px-8 py-4 bg-white text-[#3066be] rounded-full hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              Plan een strategiegesprek
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>

            <span className="font-body text-sm text-white/40">
              Vrijblijvend • 30 minuten • Online
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
