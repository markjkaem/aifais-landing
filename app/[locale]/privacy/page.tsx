// ========================================
// FILE: app/privacy/page.tsx - LIGHT THEME
// ========================================

import { Metadata } from "next";
import Link from "next/link";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Privacybeleid | GDPR-Compliant | Aifais",
  description:
    "Privacyverklaring van Aifais. Lees hoe wij omgaan met jouw persoonsgegevens conform AVG/GDPR wetgeving.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://aifais.com/privacy",
  },
};

export default function PrivacyPage() {
  const lastUpdated = "22 november 2024";

  return (
    <div className="bg-white min-h-screen py-14 px-6 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Privacyverklaring
          </h1>
          <p className="text-gray-500 text-sm">Laatste update: {lastUpdated}</p>
        </header>

        {/* Intro */}
        <section className="mb-12 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 leading-relaxed mb-4">
            Aifais, gevestigd aan Groningenweg 8, 2803 PV Gouda, is
            verantwoordelijk voor de verwerking van persoonsgegevens zoals
            weergegeven in deze privacyverklaring.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong className="text-gray-900">Contactgegevens:</strong>
            </p>
            <p>Groningenweg 8, 2803 PV Gouda</p>
            <p>
              Email:{" "}
              <a
                href="mailto:contact@aifais.com"
                className="text-[#3066be] hover:underline"
              >
                contact@aifais.com
              </a>
            </p>
          </div>
        </section>

        {/* Table of Contents */}
        <nav className="mb-12 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Inhoudsopgave
          </h2>
          <ol className="space-y-2 text-[#3066be]">
            <li>
              <a href="#welke-gegevens" className="hover:underline">
                1. Welke persoonsgegevens verzamelen wij?
              </a>
            </li>
            {/* ... other links ... */}
            <li>
              <a href="#rechten" className="hover:underline">
                7. Jouw rechten (AVG)
              </a>
            </li>
          </ol>
        </nav>

        <div className="space-y-12 text-gray-700">
          <section id="welke-gegevens">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              1. Welke Persoonsgegevens Verzamelen Wij?
            </h2>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Contactformulieren & Analyse Gesprekken
                </h3>
                <p className="text-gray-600 mb-3">
                  Wanneer je een formulier invult op onze website, verzamelen
                  wij:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Voor- en achternaam</li>
                  <li>E-mailadres</li>
                  {/* ... */}
                </ul>
              </div>
            </div>
          </section>

          {/* ... Add other sections similarly ... */}
        </div>
      </div>
    </div>
  );
}
