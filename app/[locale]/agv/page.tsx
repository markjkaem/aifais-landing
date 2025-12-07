// ========================================
// FILE: app/agv/page.tsx - LIGHT THEME
// ========================================

import { Metadata } from "next";
import Link from "next/link";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Algemene Voorwaarden | n8n Workflow Automatisering | Aifais",
  description:
    "Algemene voorwaarden van Aifais voor n8n workflow automatisering diensten. Transparante afspraken over dienstverlening, betaling, en aansprakelijkheid.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://aifais.com/agv",
  },
};

export default function AGVPage() {
  const lastUpdated = "22 november 2024";
  const version = "1.0";

  return (
    <div className="bg-[#fbfff1] min-h-screen py-14 px-6 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Algemene Voorwaarden
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <p>Laatste update: {lastUpdated}</p>
            <span>•</span>
            <p>Versie: {version}</p>
          </div>
        </header>

        {/* Intro */}
        <section className="mb-12 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 leading-relaxed mb-4">
            Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten
            tussen <strong className="text-gray-900">Aifais</strong> (hierna:
            "wij" of "Aifais"), gevestigd aan Groningenweg 8, 2803 PV Gouda, en
            de opdrachtgever (hierna: "u" of "klant") betreffende n8n workflow
            automatisering diensten.
          </p>
          <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4 mt-4">
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
              <a href="#toepasselijkheid" className="hover:underline">
                1. Toepasselijkheid
              </a>
            </li>
            <li>
              <a href="#diensten" className="hover:underline">
                2. Diensten
              </a>
            </li>
            <li>
              <a href="#offertes" className="hover:underline">
                3. Offertes en Overeenkomsten
              </a>
            </li>
            <li>
              <a href="#uitvoering" className="hover:underline">
                4. Uitvoering Opdracht
              </a>
            </li>
            <li>
              <a href="#prijzen" className="hover:underline">
                5. Prijzen en Betaling
              </a>
            </li>
            <li>
              <a href="#intellectueel" className="hover:underline">
                6. Intellectueel Eigendom
              </a>
            </li>
            <li>
              <a href="#garantie" className="hover:underline">
                7. Garantie en Support
              </a>
            </li>
            <li>
              <a href="#aansprakelijkheid" className="hover:underline">
                8. Aansprakelijkheid
              </a>
            </li>
            <li>
              <a href="#geheimhouding" className="hover:underline">
                9. Geheimhouding
              </a>
            </li>
            <li>
              <a href="#opzegging" className="hover:underline">
                10. Opzegging en Ontbinding
              </a>
            </li>
            <li>
              <a href="#klachten" className="hover:underline">
                11. Klachten
              </a>
            </li>
            <li>
              <a href="#toepasselijk-recht" className="hover:underline">
                12. Toepasselijk Recht
              </a>
            </li>
          </ol>
        </nav>

        {/* Articles (Rest of the content remains structured, just style updates) */}
        {/* ... (Copy the rest of the text content from your original code, it fits perfectly in this container) */}
        <div className="space-y-12 text-gray-700">
          <article id="toepasselijkheid" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 1 - Toepasselijkheid
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="mb-4">
                <strong className="text-gray-900">1.1</strong> Deze algemene
                voorwaarden zijn van toepassing op alle aanbiedingen, offertes
                en overeenkomsten tussen Aifais en de klant.
              </p>
              {/* ... (rest of article 1) */}
            </div>
          </article>
          {/* ... Add other articles similarly with bg-white classes ... */}
        </div>

        {/* Contact Section */}
        <section className="mt-16 bg-[#3066be]/5 border border-[#3066be]/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">
            Vragen Over Deze Voorwaarden?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Neem gerust contact op voor toelichting of vragen over onze algemene
            voorwaarden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@aifais.com"
              className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-[#234a8c] transition-transform text-center shadow-lg"
            >
              📧 Email Ons
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-300 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition text-center"
            >
              Contactformulier
            </Link>
          </div>
        </section>

        {/* Footer Navigation */}
        <nav className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 mb-4">Bekijk ook:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/privacy" className="text-[#3066be] hover:underline">
              Privacyverklaring
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/contact" className="text-[#3066be] hover:underline">
              Contact
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/" className="text-[#3066be] hover:underline">
              Terug naar Home
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
