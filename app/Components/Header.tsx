"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { projects } from "../[locale]/portfolio/data";
import { news } from "../[locale]/news/data";

// ✅ NEW: Define Service Links for Navigation & Search
const serviceLinks = [
  {
    title: "Workflow Automatisering",
    slug: "/diensten/workflow-automatisering",
    description: "Koppel systemen en elimineer handwerk (n8n/Make).",
    icon: (
      <svg
        className="w-5 h-5"
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
  {
    title: "AI Integraties",
    slug: "/diensten/ai-integratie",
    description: "Slimme chatbots en processen met ChatGPT/Claude.",
    icon: (
      <svg
        className="w-5 h-5"
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
    title: "Administratie",
    slug: "/diensten/administratieve-automatisering",
    description: "Facturatie, HR en rapportages op automatische piloot.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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

  // ✅ Search functionality: Added Services to Index
  const allSearchableContent = [
    // 1. New Services (High Priority)
    ...serviceLinks.map((s) => ({
      type: "service",
      title: s.title,
      slug: s.slug,
    })),
    // 2. Projects
    ...projects.map((p) => ({
      type: "case",
      title: p.title,
      slug: `/portfolio/${p.slug}`,
    })),
    // 3. News
    ...news.map((n) => ({
      type: "news",
      title: n.title,
      slug: `/news/${n.slug}`,
    })),
    // 4. Core Pages
    {
      type: "page",
      title: locale === "nl" ? "Alle Diensten" : "All Services",
      slug: "/diensten",
    },
    {
      type: "page",
      title: locale === "nl" ? "Contact" : "Contact",
      slug: "/contact",
    },
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

    let newPath: string;
    if (newLocale === "nl") {
      newPath = pathWithoutLocale || "/";
    } else {
      newPath = pathWithoutLocale === "/" ? "/en" : `/en${pathWithoutLocale}`;
    }

    window.location.href = newPath;
  };

  const getLocalizedPath = (path: string) => {
    if (locale === "nl") {
      return path;
    }
    return `/en${path}`;
  };

  return (
    <header
      className={`w-full bg-black/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href={getLocalizedPath("/")}
          onClick={closeAll}
          className="flex-shrink-0"
        >
          <Image
            className="invert w-24 hover:scale-105 transition-transform"
            src="/logo_official.png"
            alt="Aifais Logo"
            width={200}
            height={200}
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <button
            onClick={() => handleDropdownToggle("services")}
            className="hover:text-purple-400 transition flex items-center gap-2 group"
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

          <button
            onClick={() => handleDropdownToggle("news")}
            className="hover:text-purple-400 transition flex items-center gap-2"
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
            className="hover:text-purple-400 transition"
            onClick={closeAll}
          >
            {t("cases")}
          </Link>

          <Link
            href={getLocalizedPath("/#about")}
            className="hover:text-purple-400 transition"
            onClick={(e) => {
              e.preventDefault();
              router.push(getLocalizedPath("/#about"));
              closeAll();
            }}
          >
            {t("about")}
          </Link>

          <Link
            href={getLocalizedPath("/contact")}
            className="hover:text-purple-400 transition"
            onClick={closeAll}
          >
            {t("contact")}
          </Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Search button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchOpen(!searchOpen);
              setOpenDropdown(null);
            }}
            className="text-gray-300 hover:text-purple-400 transition p-2 rounded-lg hover:bg-white/5"
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

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDropdownToggle("languages");
              }}
              className="text-gray-300 hover:text-purple-400 transition text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5"
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
              <svg
                className={`w-3 h-3 transition-transform ${
                  openDropdown === "languages" ? "rotate-180" : ""
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

            {openDropdown === "languages" && (
              <div
                className="absolute right-0 mt-2 bg-zinc-900/98 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden min-w-[180px] z-50 animate-slideDown"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => switchLanguage("nl")}
                  disabled={locale === "nl"}
                  className={`w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center gap-3 ${
                    locale === "nl"
                      ? "text-purple-400 bg-purple-500/10 cursor-default"
                      : "text-gray-300 cursor-pointer"
                  }`}
                >
                  <span className="text-xl">🇳🇱</span>
                  <span className="font-medium">Nederlands</span>
                </button>
                <button
                  onClick={() => switchLanguage("en")}
                  disabled={locale === "en"}
                  className={`w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center gap-3 ${
                    locale === "en"
                      ? "text-purple-400 bg-purple-500/10 cursor-default"
                      : "text-gray-300 cursor-pointer"
                  }`}
                >
                  <span className="text-xl">🇬🇧</span>
                  <span className="font-medium">English</span>
                </button>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href={getLocalizedPath("/quickscan")}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
            onClick={closeAll}
          >
            Quickscan
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-gray-200 text-3xl hover:text-purple-400 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900/98 backdrop-blur-xl border-b border-white/20 shadow-2xl animate-slideDown">
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
                className="w-full pl-12 pr-4 py-4 bg-black border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((result, i) => (
                  <Link
                    key={i}
                    href={getLocalizedPath(result.slug)}
                    onClick={closeAll}
                    className="block px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded uppercase font-semibold ${
                          result.type === "service"
                            ? "bg-purple-500/20 text-purple-400"
                            : result.type === "case"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {result.type}
                      </span>
                      <span className="text-gray-300 group-hover:text-white transition">
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

      {/* Desktop Mega Menu - Services (OPTIMIZED) */}
      {openDropdown === "services" && (
        <div className="hidden lg:block w-full bg-zinc-900/98 backdrop-blur-xl border-b border-white/20 shadow-2xl py-8 animate-slideDown">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8">
            {/* ✅ UPDATED: Now shows SERVICES, not projects */}
            <div className="col-span-2">
              <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-4">
                Onze Diensten
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {serviceLinks.map((service) => (
                  <Link
                    key={service.slug}
                    href={getLocalizedPath(service.slug)}
                    className="group p-4 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/10 flex items-start gap-4"
                    onClick={closeAll}
                  >
                    <div className="mt-1 text-purple-400 group-hover:text-purple-300 transition">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1 group-hover:text-purple-400 transition">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 px-4">
                <Link
                  href={getLocalizedPath("/diensten")}
                  className="text-purple-400 text-sm font-semibold hover:text-white transition flex items-center gap-1"
                  onClick={closeAll}
                >
                  Bekijk Alle Diensten →
                </Link>
              </div>
            </div>

            {/* Featured Event / CTA */}
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-700/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition cursor-pointer w-full">
                <p className="font-semibold text-lg text-white mb-2">
                  Gratis Quickscan
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Ontdek binnen 2 minuten waar jouw grootste automatisering
                  kansen liggen.
                </p>
                <Link
                  href={getLocalizedPath("/quickscan")}
                  onClick={closeAll}
                  className="block w-full py-2 bg-purple-600 text-white text-center rounded-lg font-medium hover:bg-purple-500 transition"
                >
                  Start Nu
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Mega Menu - News (UPDATED) */}
      {openDropdown === "news" && (
        <div className="hidden lg:block w-full bg-zinc-900/98 backdrop-blur-xl border-b border-white/20 shadow-2xl py-8 animate-slideDown">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8">
            <div className="col-span-2">
              {/* Header for list */}
              <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-4">
                Nieuwste Artikelen
              </h4>

              <div className="grid grid-cols-2 gap-4">
                {news
                  .filter((item) => item.id < 5)
                  .map((blog) => (
                    <Link
                      key={blog.slug}
                      href={getLocalizedPath(`/news/${blog.slug}`)}
                      className="group p-4 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/10"
                      onClick={closeAll}
                    >
                      <h3 className="text-white font-semibold mb-1 group-hover:text-purple-400 transition line-clamp-1">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </Link>
                  ))}
              </div>

              {/* ✅ NEW: Link to Overview Page */}
              <div className="mt-4 px-4">
                <Link
                  href={getLocalizedPath("/news")}
                  className="text-purple-400 text-sm font-semibold hover:text-white transition flex items-center gap-1"
                  onClick={closeAll}
                >
                  Bekijk Kennisbank →
                </Link>
              </div>
            </div>

            {/* Featured Box (Right Side) */}
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-700/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition cursor-pointer w-full">
                <Image
                  src="/lesson.jpg"
                  alt="Event Preview"
                  width={300}
                  height={180}
                  className="rounded-lg object-cover mb-4 w-full h-40"
                />
                <p className="font-semibold text-lg text-white mb-2">
                  {tEvent("title")}
                </p>
                <Link
                  href={getLocalizedPath("/contact")}
                  onClick={closeAll}
                  className="text-sm text-purple-400 hover:text-white transition"
                >
                  Inschrijven →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden bg-zinc-900/98 backdrop-blur-xl border-t border-white/10 px-6 py-6 space-y-4 text-gray-200 text-base max-h-[80vh] overflow-y-auto animate-slideDown">
          {/* Mobile Search */}
          <div className="pb-4 border-b border-white/10">
            <input
              type="text"
              placeholder={locale === "nl" ? "Zoeken..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Mobile: Services (UPDATED) */}
          <div>
            <button
              onClick={() => handleDropdownToggle("services")}
              className="w-full flex justify-between items-center py-3 font-semibold"
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
              <div className="pl-4 mt-2 space-y-3 animate-slideDown border-l border-white/10 ml-2">
                {serviceLinks.map((service) => (
                  <Link
                    key={service.slug}
                    href={getLocalizedPath(service.slug)}
                    className="block py-2 text-gray-300 hover:text-purple-400 transition"
                    onClick={closeAll}
                  >
                    {service.title}
                  </Link>
                ))}
                <Link
                  href={getLocalizedPath("/diensten")}
                  className="block py-2 text-purple-400 font-semibold"
                  onClick={closeAll}
                >
                  Alle Diensten Bekijken
                </Link>
              </div>
            )}
          </div>

          {/* Rest of mobile links (News, Portfolio, etc.) */}
          <Link
            href={getLocalizedPath("/portfolio")}
            className="block py-3 hover:text-purple-400 transition font-semibold"
            onClick={closeAll}
          >
            {t("cases")}
          </Link>

          <Link
            href={getLocalizedPath("/news")}
            className="block py-3 hover:text-purple-400 transition font-semibold"
            onClick={closeAll}
          >
            {t("news")}
          </Link>

          <Link
            href={getLocalizedPath("/#about")}
            className="block py-3 hover:text-purple-400 transition font-semibold"
            onClick={(e) => {
              e.preventDefault();
              router.push(getLocalizedPath("/#about"));
              closeAll();
            }}
          >
            {t("about")}
          </Link>

          <Link
            href={getLocalizedPath("/contact")}
            className="block py-3 hover:text-purple-400 transition font-semibold"
            onClick={closeAll}
          >
            {t("contact")}
          </Link>

          <Link
            href={getLocalizedPath("/quickscan")}
            className="block mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg text-center"
            onClick={closeAll}
          >
            Start Quickscan
          </Link>

          {/* Mobile languages */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">
              {t("language")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => switchLanguage("nl")}
                disabled={locale === "nl"}
                className={`flex-1 px-4 py-3 rounded-lg border transition flex items-center justify-center gap-2 ${
                  locale === "nl"
                    ? "bg-purple-500/20 border-purple-500 text-purple-400"
                    : "bg-white/5 border-white/10 text-gray-300"
                }`}
              >
                <span className="text-xl">🇳🇱</span> NL
              </button>
              <button
                onClick={() => switchLanguage("en")}
                disabled={locale === "en"}
                className={`flex-1 px-4 py-3 rounded-lg border transition flex items-center justify-center gap-2 ${
                  locale === "en"
                    ? "bg-purple-500/20 border-purple-500 text-purple-400"
                    : "bg-white/5 border-white/10 text-gray-300"
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
