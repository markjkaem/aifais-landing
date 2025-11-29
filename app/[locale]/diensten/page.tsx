// ========================================
// FILE: app/diensten/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Onze Diensten | AI & Workflow Automatisering MKB | AIFAIS",
  description:
    "Ontdek onze automatiseringsdiensten: Workflow optimalisatie (n8n), AI-integraties (ChatGPT) en administratieve automatisering. Bespaar direct tijd en kosten.",
  keywords: [
    "automatisering diensten",
    "workflow automatisering mkb",
    "n8n specialist nederland",
    "ai integratie bedrijf",
    "administratieve processen automatiseren",
    "chatgpt voor bedrijven",
  ],
  openGraph: {
    title: "Onze Diensten | AI & Workflow Automatisering",
    description:
      "Van slimme AI-chatbots tot volledig geautomatiseerde administratie.",
    url: "https://aifais.com/diensten",
    type: "website",
    images: [
      {
        url: "https://aifais.com/og-services.jpg", // Make sure to create this OG image
        width: 1200,
        height: 630,
        alt: "AIFAIS Diensten Overzicht",
      },
    ],
  },
  alternates: {
    canonical: "https://aifais.com/diensten",
  },
};

export default function ServicesPage() {
  // ✅ SCHEMA.ORG - SERVICE LIST
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Bedrijfsautomatisering",
    provider: {
      "@type": "Organization",
      name: "AIFAIS",
      "@id": "https://aifais.com/#organization",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Automatiseringsdiensten",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Workflow Automatisering (n8n)",
            description:
              "Koppelen van software en automatiseren van datastromen.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Integraties",
            description:
              "Implementatie van LLM's en slimme assistenten in bedrijfsprocessen.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Administratieve Automatisering",
            description:
              "Volledig automatiseren van facturatie, onboarding en rapportages.",
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />

      {/* ✅ HERO SECTION */}
      <section className="relative py-20 md:py-28 bg-black overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 border border-purple-500/30 bg-purple-500/10 text-purple-300 rounded-full text-sm font-semibold tracking-wide uppercase">
            Onze Expertise
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Van Handmatig Werk Naar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Slimme Processen
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Wij bouwen de technische motor van jouw bedrijf. Of het nu gaat om
            het koppelen van software of het inzetten van AI: wij zorgen dat het
            werkt.
          </p>
        </div>
      </section>

      {/* ✅ SERVICES GRID (The Core Content) */}
      <section className="py-16 md:py-24 bg-gray-950">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1: Workflows */}
            <article className="group relative bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600/20 transition-colors">
                <svg
                  className="w-7 h-7 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Workflow Automatisering
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Wij koppelen jouw systemen (CRM, Mail, Boekhouding) aan elkaar
                via n8n of Make. Geen handmatige data-overdracht meer.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span> CRM Synchronisatie
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Lead Opvolging
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Order Verwerking
                </li>
              </ul>
              {/* Internal Link to specific service page (Future Proofing) */}
              // NEW (Good for SEO)
              <Link href="/diensten/workflow-automatisering" className="...">
                Lees meer over Workflows →
              </Link>
            </article>

            {/* Service 2: AI */}
            <article className="group relative bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors">
                <svg
                  className="w-7 h-7 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                AI Integraties
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Zet ChatGPT of Claude in voor jouw bedrijf. Van slimme e-mail
                beantwoording tot het analyseren van documenten.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> Slimme Chatbots
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> Document Analyse
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> Content Generatie
                </li>
              </ul>
              <Link
                href="/diensten/ai-integraties"
                className="text-white font-semibold border-b border-blue-500 pb-1 hover:text-blue-400 transition"
              >
                Ontdek AI Kansen →
              </Link>
            </article>

            {/* Service 3: Admin */}
            <article className="group relative bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600/20 transition-colors">
                <svg
                  className="w-7 h-7 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Administratie
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Verminder administratieve druk. Wij automatiseren facturatie,
                urenregistratie en HR-processen.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Factuurverwerking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Offerte
                  Automatisering
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Rapportages
                </li>
              </ul>
              <Link
                href="/diensten/administratieve-automatisering"
                className="text-white font-semibold border-b border-green-500 pb-1 hover:text-green-400 transition"
              >
                Bespaar Tijd →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ✅ HOW WE WORK (Builds Trust) */}
      <section className="py-24 bg-black border-t border-gray-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Zo Werken Wij
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Geen ingewikkelde trajecten. Wij houden het simpel, transparant en
              snel.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -translate-y-1/2 z-0" />

            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Analyse",
                  desc: "We identificeren jouw tijdvreters in een gratis sessie.",
                },
                {
                  step: "02",
                  title: "Voorstel",
                  desc: "Je ontvangt een helder plan met vaste prijs en ROI.",
                },
                {
                  step: "03",
                  title: "Bouwen",
                  desc: "Wij bouwen en testen de automatisering (vaak < 2 weken).",
                },
                {
                  step: "04",
                  title: "Live & Support",
                  desc: "We gaan live en zorgen dat alles blijft draaien.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-black border border-gray-800 p-6 rounded-xl text-center hover:border-purple-500/50 transition duration-300"
                >
                  <div className="w-12 h-12 bg-purple-900/30 text-purple-400 font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ CTA SECTION */}
      <section className="py-24 bg-gradient-to-b from-black to-purple-950/20 text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Klaar Om Je Bedrijf Te <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Versnellen?
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Begin vandaag nog. Plan een gratis haalbaarheidscheck en ontdek
            binnen 30 minuten waar jouw kansen liggen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quickscan"
              className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              Start Gratis Quickscan →
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-700 bg-gray-900/50 text-white font-semibold rounded-xl hover:bg-gray-800 transition"
            >
              Plan een Gesprek
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
