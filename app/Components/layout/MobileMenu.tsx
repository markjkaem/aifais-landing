"use client";

import Link from "next/link";

interface ServiceLink {
  title: string;
  slug: string;
}

interface MobileMenuProps {
  locale: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openDropdown: string | null;
  handleDropdownToggle: (dropdown: "services" | "news" | "languages") => void;
  serviceLinks: ServiceLink[];
  getLocalizedPath: (path: string) => string;
  closeAll: () => void;
  switchLanguage: (lang: string) => void;
  t: (key: string) => string;
  router: any;
}

export default function MobileMenu({
  locale,
  searchQuery,
  setSearchQuery,
  openDropdown,
  handleDropdownToggle,
  serviceLinks,
  getLocalizedPath,
  closeAll,
  switchLanguage,
  t,
  router,
}: MobileMenuProps) {
  return (
    <div className="lg:hidden bg-white border-t border-gray-200 px-6 py-6 space-y-4 text-gray-800 text-base max-h-[85vh] overflow-y-auto animate-slideDown shadow-2xl pb-20">
      <div className="pb-4 border-b border-gray-200">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#3066be] focus:outline-none"
        />
      </div>

      <div>
        <button
          onClick={() => handleDropdownToggle("services")}
          className="w-full flex justify-between items-center py-3 font-semibold hover:text-[#3066be]"
        >
          {t("services")}
          <svg
            className={`w-4 h-4 transition-transform ${
              openDropdown === "services" ? "rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {openDropdown === "services" && (
          <div className="pl-4 mt-2 space-y-3 animate-slideDown border-l-2 border-[#3066be]/20 ml-2">
            {serviceLinks.map((service) => (
              <Link
                key={service.slug}
                href={getLocalizedPath(service.slug)}
                className="block py-2 text-gray-600 hover:text-[#3066be] transition"
                onClick={closeAll}
              >
                {service.title}
              </Link>
            ))}
            <Link
              href={getLocalizedPath("/diensten")}
              className="block py-2 text-[#3066be] font-semibold"
              onClick={closeAll}
            >
              {t("viewAllServices")}
            </Link>
          </div>
        )}
      </div>

      <Link
        href={getLocalizedPath("/portfolio")}
        className="block py-3 hover:text-[#3066be] transition font-semibold"
        onClick={closeAll}
      >
        {t("cases")}
      </Link>
      <Link
        href={getLocalizedPath("/news")}
        className="block py-3 hover:text-[#3066be] transition font-semibold"
        onClick={closeAll}
      >
        {t("news")}
      </Link>
      <Link
        href={getLocalizedPath("/#about")}
        className="block py-3 hover:text-[#3066be] transition font-semibold"
        onClick={(e) => {
          e.preventDefault();
          router.push(getLocalizedPath("/#about"));
          closeAll();
        }}
      >
        {t("about")}
      </Link>
      <Link
        href={getLocalizedPath("/tools")}
        className="block py-3 hover:text-[#3066be] transition font-semibold"
        onClick={closeAll}
      >
        {t("tools")}
      </Link>
      <Link
        href={getLocalizedPath("/contact")}
        className="block py-3 hover:text-[#3066be] transition font-semibold"
        onClick={closeAll}
      >
        {t("contact")}
      </Link>

      <Link
        href={getLocalizedPath("/contact")}
        className="block mt-4 px-6 py-3 bg-[#3066be] text-white font-bold rounded-lg text-center active:bg-[#234a8c]"
        onClick={closeAll}
      >
        {t("ctaText")}
      </Link>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">
          {t("language")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => switchLanguage("nl")}
            disabled={locale === "nl"}
            className={`flex-1 px-4 py-3 rounded-lg border transition flex items-center justify-center gap-2 ${
              locale === "nl"
                ? "bg-[#3066be]/10 border-[#3066be] text-[#3066be]"
                : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            <span className="text-xl">🇳🇱</span> NL
          </button>
          <button
            onClick={() => switchLanguage("en")}
            disabled={locale === "en"}
            className={`flex-1 px-4 py-3 rounded-lg border transition flex items-center justify-center gap-2 ${
              locale === "en"
                ? "bg-[#3066be]/10 border-[#3066be] text-[#3066be]"
                : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            <span className="text-xl">🇬🇧</span> EN
          </button>
        </div>
      </div>
    </div>
  );
}
