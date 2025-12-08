"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { projects } from "../[locale]/portfolio/data"; // Pas pad aan indien nodig
import { news } from "../[locale]/news/data"; // Pas pad aan indien nodig

// --- CONFIGURATION ---
// Hier definiëren we de diensten die in het menu komen.
// Dit maakt het makkelijk om later items toe te voegen of te wijzigen.
const serviceLinks = [
  {
    title: "Telefonische Assistenten",
    slug: "/diensten/human-parity-voice",
    description: "Vervang keuzemenu's door vloeiende, menselijke conversaties.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    title: "Bedrijfsbrein & Geheugen",
    slug: "/diensten/bedrijfsbrein",
    description: "Al uw bedrijfsdata doorzoekbaar en gekoppeld via GraphRAG.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    title: "AI Medewerkers (Agents)",
    slug: "/diensten/ai-integratie",
    description: "Autonome digitale collega's die processen voor u uitvoeren.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    title: "Agent API (x402)",
    slug: "/diensten/agent-api",
    description: "Waar Agents zaken doen met elkaar",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

export default function HeaderMockup() {
  const t = useTranslations("nav");
  const tEvent = useTranslations("event");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [openDropdown, setOpenDropdown] = useState<
    "services" | "news" | "languages" | null
  >(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ✅ Hide/Show header on scroll
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (openDropdown || searchOpen || mobileOpen) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY, openDropdown, searchOpen, mobileOpen]);

  const handleDropdownToggle = (
    dropdown: "services" | "news" | "languages"
  ) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    setSearchOpen(false);
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("header")) {
        closeAll();
      }
    };

    if (openDropdown || mobileOpen || searchOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown, mobileOpen, searchOpen]);

  // ✅ Search functionality populated with new services
  const allSearchableContent = [
    { type: "page", title: "Home", slug: "/" },
    // 1. New Services
    ...serviceLinks.map((s) => ({
      type: "service",
      title: s.title,
      slug: s.slug,
    })),
    // 2. Projects (Fallback to empty array if projects not loaded)
    ...(projects || []).map((p) => ({
      type: "case",
      title: p.title,
      slug: `/portfolio/${p.slug}`,
    })),
    // 3. News (Fallback)
    ...(news || []).map((n) => ({
      type: "news",
      title: n.title,
      slug: `/news/${n.slug}`,
    })),
    // 4. Core Pages
    { type: "page", title: "Tools", slug: "/tools" },
    { type: "page", title: "Contact", slug: "/contact" },
  ];

  const searchResults =
    searchQuery.length > 0
      ? allSearchableContent
          .filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const switchLanguage = (newLocale: string) => {
    if (locale === newLocale) {
      closeAll();
      return;
    }
    let pathWithoutLocale = pathname;
    if (pathWithoutLocale.startsWith("/en/")) {
      pathWithoutLocale = pathWithoutLocale.substring(3);
    } else if (pathWithoutLocale === "/en") {
      pathWithoutLocale = "/";
    }
    let newPath =
      newLocale === "nl"
        ? pathWithoutLocale || "/"
        : pathWithoutLocale === "/"
        ? "/en"
        : `/en${pathWithoutLocale}`;
    window.location.href = newPath;
  };

  const getLocalizedPath = (path: string) => {
    return locale === "nl" ? path : `/en${path}`;
  };

  return (
    <header
      className={`w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* --- DESKTOP NAV --- */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <Link
            href={getLocalizedPath("/")}
            className="hover:text-[#3066be] transition"
            onClick={closeAll}
          >
            Home
          </Link>

          {/* SERVICES DROPDOWN TRIGGER */}
          <button
            onClick={() => handleDropdownToggle("services")}
            className={`hover:text-[#3066be] transition flex items-center gap-2 group ${
              openDropdown === "services" ? "text-[#3066be]" : ""
            }`}
          >
            {t("services")}
            <svg
              className={`w-3 h-3 transition-transform ${
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

          {/* NEWS DROPDOWN TRIGGER */}
          <button
            onClick={() => handleDropdownToggle("news")}
            className={`hover:text-[#3066be] transition flex items-center gap-2 ${
              openDropdown === "news" ? "text-[#3066be]" : ""
            }`}
          >
            {t("news")}
            <svg
              className={`w-3 h-3 transition-transform ${
                openDropdown === "news" ? "rotate-180" : ""
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

          <Link
            href={getLocalizedPath("/portfolio")}
            className="hover:text-[#3066be] transition"
            onClick={closeAll}
          >
            {t("cases")}
          </Link>
          <Link
            href={getLocalizedPath("/#about")}
            className="hover:text-[#3066be] transition"
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
            className="hover:text-[#3066be] transition"
            onClick={closeAll}
          >
            {t("tools")}
          </Link>
          <Link
            href={getLocalizedPath("/contact")}
            className="hover:text-[#3066be] transition"
            onClick={closeAll}
          >
            {t("contact")}
          </Link>
        </nav>

        {/* --- DESKTOP ACTIONS --- */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchOpen(!searchOpen);
              setOpenDropdown(null);
            }}
            className="text-gray-600 hover:text-[#3066be] transition p-2 rounded-lg hover:bg-[#3066be]/5"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* LANGUAGE SELECTOR */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDropdownToggle("languages");
              }}
              className="text-gray-600 hover:text-[#3066be] transition text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3066be]/5"
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
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              {locale.toUpperCase()}
            </button>
            {openDropdown === "languages" && (
              <div
                className="absolute right-0 mt-2 bg-white/98 backdrop-blur-xl border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[180px] z-50 animate-slideDown"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => switchLanguage("nl")}
                  disabled={locale === "nl"}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3 ${
                    locale === "nl"
                      ? "text-[#3066be] bg-[#3066be]/10 cursor-default"
                      : "text-gray-700 cursor-pointer"
                  }`}
                >
                  <span className="text-xl">🇳🇱</span>{" "}
                  <span className="font-medium">Nederlands</span>
                </button>
                <button
                  onClick={() => switchLanguage("en")}
                  disabled={locale === "en"}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3 ${
                    locale === "en"
                      ? "text-[#3066be] bg-[#3066be]/10 cursor-default"
                      : "text-gray-700 cursor-pointer"
                  }`}
                >
                  <span className="text-xl">🇬🇧</span>{" "}
                  <span className="font-medium">English</span>
                </button>
              </div>
            )}
          </div>

          <Link
            href={getLocalizedPath("/contact")}
            className="px-5 py-2.5 bg-[#3066be] hover:bg-[#234a8c] text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-md shadow-[#3066be]/20"
            onClick={closeAll}
          >
            Analyse Gesprek
          </Link>
        </div>

        {/* --- MOBILE HAMBURGER --- */}
        <button
          className="lg:hidden text-gray-800 text-3xl hover:text-[#3066be] transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* --- SEARCH OVERLAY --- */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-xl animate-slideDown">
          <div className="max-w-3xl mx-auto px-6 py-6">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder={
                  locale === "nl"
                    ? "Zoek diensten, cases of nieuws..."
                    : "Search services, cases or news..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#3066be] focus:outline-none text-lg shadow-inner"
                autoFocus
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((result, i) => (
                  <Link
                    key={i}
                    href={getLocalizedPath(result.slug)}
                    onClick={closeAll}
                    className="block px-4 py-3 bg-white hover:bg-gray-100 rounded-lg transition group border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded uppercase font-semibold ${
                          result.type === "service"
                            ? "bg-[#3066be]/10 text-[#3066be]"
                            : result.type === "case"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {result.type}
                      </span>
                      <span className="text-gray-700 group-hover:text-[#3066be] transition">
                        {result.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MEGA MENU: SERVICES (IMPROVED GRID) --- */}
      {openDropdown === "services" && (
        <div className="hidden lg:block w-full bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-2xl py-8 animate-slideDown">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 px-4">
                Onze Oplossingen
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {serviceLinks.map((service) => (
                  <Link
                    key={service.slug}
                    href={getLocalizedPath(service.slug)}
                    className="group p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200 flex items-start gap-4"
                    onClick={closeAll}
                  >
                    <div className="mt-1 text-[#3066be] group-hover:scale-110 transition bg-blue-50 p-2 rounded-lg">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-1 group-hover:text-[#3066be] transition">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 px-4 pt-4 border-t border-gray-100">
                <Link
                  href={getLocalizedPath("/diensten")}
                  className="text-gray-500 text-sm font-semibold hover:text-[#3066be] transition flex items-center gap-1"
                  onClick={closeAll}
                >
                  Bekijk alle overige diensten{" "}
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Featured / CTA Box */}
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-[#3066be]/5 to-blue-50 border border-[#3066be]/20 rounded-2xl p-6 hover:border-[#3066be]/40 transition cursor-pointer w-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3066be]/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-[#3066be]/20"></div>
                <p className="font-semibold text-lg text-gray-900 mb-2 relative z-10">
                  Gratis analyse van jouw automatiseringskansen
                </p>
                <p className="text-sm text-gray-600 mb-6 relative z-10">
                  Ontdek binnen 2 minuten waar jouw grootste winst ligt.
                </p>
                <Link
                  href={getLocalizedPath("/contact")}
                  onClick={closeAll}
                  className="block w-full py-3 bg-[#3066be] text-white text-center rounded-lg font-medium hover:bg-[#234a8c] transition relative z-10 shadow-lg shadow-blue-900/10"
                >
                  Start Nu
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MEGA MENU: NEWS (UNCHANGED LOGIC) --- */}
      {openDropdown === "news" && (
        <div className="hidden lg:block w-full bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-2xl py-8 animate-slideDown">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 px-4">
                Nieuwste Artikelen
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {(news || [])
                  .filter((item) => item.id < 5)
                  .map((blog) => (
                    <Link
                      key={blog.slug}
                      href={getLocalizedPath(`/news/${blog.slug}`)}
                      className="group p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                      onClick={closeAll}
                    >
                      <h3 className="text-gray-900 font-semibold mb-1 group-hover:text-[#3066be] transition line-clamp-1">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </Link>
                  ))}
              </div>
              <div className="mt-4 px-4">
                <Link
                  href={getLocalizedPath("/news")}
                  className="text-gray-500 text-sm font-semibold hover:text-[#3066be] transition flex items-center gap-1"
                  onClick={closeAll}
                >
                  Bekijk Kennisbank →
                </Link>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#3066be]/30 hover:shadow-lg transition cursor-pointer w-full">
                <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/lesson.jpg"
                    alt="Event"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="font-semibold text-lg text-gray-900 mb-2">
                  {tEvent("title")}
                </p>
                <Link
                  href={getLocalizedPath("/contact")}
                  onClick={closeAll}
                  className="text-sm text-gray-500 hover:text-[#3066be] transition"
                >
                  Inschrijven →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE MENU (UPDATED) --- */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-6 py-6 space-y-4 text-gray-800 text-base max-h-[85vh] overflow-y-auto animate-slideDown shadow-2xl pb-20">
          <div className="pb-4 border-b border-gray-200">
            <input
              type="text"
              placeholder={locale === "nl" ? "Zoeken..." : "Search..."}
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
                  Alle Diensten Bekijken
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
            Start Analyse Gesprek
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
      )}

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}

// Simple Arrow Icon Component
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}
