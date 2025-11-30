// ========================================
// FILE: app/Components/Footer.tsx
// ========================================

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="text-gray-300 bg-black mt-12 border-t border-gray-900"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12 text-sm">
        {/* COL 1: Company Info & Address */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="inline-block" itemProp="url">
            <span
              className="font-bold text-2xl text-white tracking-tight"
              itemProp="name"
            >
              AIFAIS
            </span>
          </Link>
          <p className="text-gray-400 leading-relaxed">
            Specialist in bedrijfsautomatisering en AI-integraties voor het
            Nederlandse MKB.
          </p>

          <address
            className="not-italic mt-2 flex flex-col gap-1"
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <p itemProp="streetAddress">Groningenweg 8</p>
            <p>
              <span itemProp="postalCode">2803 PV</span>{" "}
              <span itemProp="addressLocality">Gouda</span>
            </p>
            <span itemProp="addressCountry" className="hidden">
              NL
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Gevestigd in Zuid-Holland
            </p>
          </address>

          {/* ✅ CRITICAL E-E-A-T: Contact Details */}
          <div className="flex flex-col gap-2 mt-2">
            <a
              href="mailto:info@aifais.com"
              className="hover:text-purple-400 transition flex items-center gap-2"
              itemProp="email"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              info@aifais.com
            </a>
            <a
              href="tel:+31618424470"
              className="hover:text-purple-400 transition flex items-center gap-2"
              itemProp="telephone"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +31 6 1842 4470
            </a>
          </div>
        </div>

        {/* COL 2: Services */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-base">Onze Diensten</h3>
          <nav className="flex flex-col gap-3">
            <Link
              href="/diensten/workflow-automatisering"
              className="hover:text-purple-400 transition"
            >
              Workflow Automatisering
            </Link>
            <Link
              href="/diensten/ai-integratie"
              className="hover:text-purple-400 transition"
            >
              AI & ChatGPT Integraties
            </Link>
            <Link
              href="/diensten/administratieve-automatisering"
              className="hover:text-purple-400 transition"
            >
              Administratie Automatiseren
            </Link>
            <Link
              href="/diensten"
              className="text-purple-400 hover:text-purple-300 transition font-medium mt-2 text-xs uppercase tracking-wider"
            >
              Bekijk alle diensten →
            </Link>
          </nav>
        </div>

        {/* COL 3: Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-base">Navigatie</h3>
          <nav className="flex flex-col gap-3">
            <Link
              href="/portfolio"
              className="hover:text-purple-400 transition"
            >
              Portfolio & Cases
            </Link>
            <Link href="/news" className="hover:text-purple-400 transition">
              Kennisbank & Nieuws
            </Link>
            <Link href="/#about" className="hover:text-purple-400 transition">
              Over Ons
            </Link>
            <Link href="/contact" className="hover:text-purple-400 transition">
              Contact & Advies
            </Link>
          </nav>
        </div>

        {/* COL 4: Legal & Trust */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-base">Bedrijfsgegevens</h3>
          <div className="flex flex-col gap-2 text-gray-400">
            {/* <p>
              KvK: <span className="text-gray-300">27199999</span>
            </p>
            <p>
              BTW: <span className="text-gray-300">NL000099998B57</span>
            </p> */}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col gap-2">
            <Link href="/agv" className="hover:text-white transition text-xs">
              Algemene Voorwaarden
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition text-xs"
            >
              Privacy & Cookie Policy
            </Link>
          </div>

          {/* LinkedIn Icon */}
          <div className="flex gap-4 mt-2">
            <a
              href="https://linkedin.com/company/aifais"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="Volg ons op LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900 bg-black py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AIFAIS. Alle rechten voorbehouden.</p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Alle systemen operationeel
            </p>
            <span className="hidden md:inline">|</span>
            <p>Specialist in Nederland</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
