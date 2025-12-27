// ========================================
// FILE: app/Components/Footer.tsx - LIGHT THEME
// ========================================

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tLoc = useTranslations("locations");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer
      className="text-gray-600 bg-white  border-t border-gray-200"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 lg:grid-cols-5 gap-12 text-sm">
        {/* COL 1: Company Info & Address */}
        <div className="flex flex-col gap-4">
          <Link href={`/${locale}`} className="inline-block" itemProp="url">
            <span
              className="font-bold text-2xl text-gray-900 tracking-tight"
              itemProp="name"
            >
              AIFAIS
            </span>
          </Link>
          <p className="text-gray-500 leading-relaxed">
            {t("description")}
          </p>

          <address
            className="not-italic mt-2 flex flex-col gap-1 text-gray-700"
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
            <p className="text-xs text-gray-400 mt-1">
              {t("description")}
            </p>
          </address>

          {/* ✅ CRITICAL E-E-A-T: Contact Details */}
          <div className="flex flex-col gap-2 mt-2">
            <a
              href="mailto:info@aifais.com"
              className="hover:text-[#3066be] transition flex items-center gap-2 text-gray-700"
              itemProp="email"
            >
              <svg
                className="w-4 h-4 text-[#3066be]"
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
              className="hover:text-[#3066be] transition flex items-center gap-2 text-gray-700"
              itemProp="telephone"
            >
              <svg
                className="w-4 h-4 text-[#3066be]"
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

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-900 text-base">{t("servicesTitle")}</h3>
          <nav className="flex flex-col gap-3">
            <Link
              href={`/${locale}/diensten/email-reply-ai-agent`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {t("services.email")}
            </Link>
            <Link
              href={`/${locale}/diensten/sales-lead-automation`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {t("services.sales")}
            </Link>
            <Link
              href={`/${locale}/diensten/support-ticket-samenvatting-systeem`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {t("services.support")}
            </Link>
            <Link
              href={`/${locale}/diensten`}
              className="text-[#3066be] hover:text-[#234a8c] transition font-medium mt-2 text-xs uppercase tracking-wider"
            >
              {tNav("services")} →
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-900 text-base">{t("navTitle")}</h3>
          <nav className="flex flex-col gap-3">
            <Link
              href={`/${locale}/portfolio`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {tNav("cases")}
            </Link>
            <Link
              href={`/${locale}/news`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {tNav("news")}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {tNav("about")}
            </Link>
            <Link
              href={`/${locale}/tools`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {tNav("tools")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {tNav("contact")}
            </Link>
          </nav>
        </div>

        {/* COL 4: Locations (SEO) */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-900 text-base">{t("locationsTitle")}</h3>
          <nav className="flex flex-col gap-3">
            <Link
              href={`/${locale}/locatie/gouda`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {tLoc("gouda")}
            </Link>
            <Link
              href={`/${locale}/locatie/rotterdam`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {tLoc("rotterdam")}
            </Link>
            <Link
              href={`/${locale}/locatie/den-haag`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {tLoc("denHaag")}
            </Link>
            <Link
              href={`/${locale}/locatie/utrecht`}
              className="hover:text-[#3066be] transition text-gray-600"
            >
              {tLoc("utrecht")}
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-900 text-base">
            {t("businessTitle")}
          </h3>
          <div className="flex flex-col gap-2 text-gray-500">
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            <Link
              href={`/${locale}/agv`}
              className="hover:text-[#3066be] transition text-xs text-gray-600"
            >
              {t("legal.terms")}
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-[#3066be] transition text-xs text-gray-600"
            >
              {t("legal.privacy")}
            </Link>
          </div>

          {/* LinkedIn Icon */}
          <div className="flex gap-4 mt-2">
            <a
              href="https://www.linkedin.com/company/aifais-automatisering"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#3066be] transition"
              aria-label={t("followLinkedIn")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AIFAIS. {t("rights")}</p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t("operational")}
            </p>
            <span className="hidden md:inline">|</span>
            <p className="font-medium text-gray-700">{t("activeIn")} Rotterdam • Den Haag • Utrecht • Gouda • Zuid-Holland</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
