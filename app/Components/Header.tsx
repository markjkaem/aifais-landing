"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getProjects, projects } from "../[locale]/portfolio/data";
import { news } from "../[locale]/news/data";
import { serviceLinks } from "./layout/headerData";
import SearchOverlay from "./layout/SearchOverlay";
import MobileMenu from "./layout/MobileMenu";
import { MegaMenuServices, MegaMenuNews } from "./layout/MegaMenus";
import LanguageSelector from "./layout/LanguageSelector";

export default function Header() {
  const t = useTranslations("nav");
  const tEvent = useTranslations("event");
  const tMega = useTranslations("megaMenu");
  const tHeaderData = useTranslations("headerData");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const translatedServiceLinks = serviceLinks.map((service) => ({
    ...service,
    title: tHeaderData(service.title),
    description: tHeaderData(service.description),
  }));

  const [openDropdown, setOpenDropdown] = useState<
    "services" | "news" | "languages" | null
  >(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const handleDropdownToggle = (dropdown: "services" | "news" | "languages") => {
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
      if (!target.closest("header")) closeAll();
    };
    if (openDropdown || mobileOpen || searchOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown, mobileOpen, searchOpen]);

  const getLocalizedPath = (path: string) => (locale === "nl" ? path : `/en${path}`);

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
    let newPath = newLocale === "nl"
      ? pathWithoutLocale || "/"
      : pathWithoutLocale === "/" ? "/en" : `/en${pathWithoutLocale}`;
    window.location.href = newPath;
  };

  const localizedProjects = getProjects(locale);
  // Assuming news is an array for now as it was before, or if it has getNews, use that.
  // For now I'll just use news as it is imported.

  const allSearchableContent = [
    { type: "page", title: "Home", slug: "/" },
    ...translatedServiceLinks.map((s) => ({ type: "service", title: s.title, slug: s.slug })),
    ...(localizedProjects || []).map((p) => ({ type: "case", title: p.title, slug: `/portfolio/${p.slug}` })),
    ...(news || []).map((n) => ({ type: "news", title: n.title, slug: `/news/${n.slug}` })),
    { type: "page", title: "Tools", slug: "/tools" },
    { type: "page", title: "Contact", slug: "/contact" },
  ];

  const searchResults = searchQuery.length > 0
    ? allSearchableContent.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className={`w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <Link href={getLocalizedPath("/")} className="hover:text-[#3066be] transition" onClick={closeAll}>{t("home")}</Link>
          <button onClick={() => handleDropdownToggle("services")} className={`hover:text-[#3066be] transition flex items-center gap-2 group ${openDropdown === "services" ? "text-[#3066be]" : ""}`}>
            {t("services")}
            <ChevronDownIcon className={`w-3 h-3 transition-transform ${openDropdown === "services" ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => handleDropdownToggle("news")} className={`hover:text-[#3066be] transition flex items-center gap-2 ${openDropdown === "news" ? "text-[#3066be]" : ""}`}>
            {t("news")}
            <ChevronDownIcon className={`w-3 h-3 transition-transform ${openDropdown === "news" ? "rotate-180" : ""}`} />
          </button>
          <Link href={getLocalizedPath("/portfolio")} className="hover:text-[#3066be] transition" onClick={closeAll}>{t("cases")}</Link>
          <Link href={getLocalizedPath("/about")} className="hover:text-[#3066be] transition" onClick={closeAll}>{t("about")}</Link>
          <Link href={getLocalizedPath("/tools")} className="hover:text-[#3066be] transition" onClick={closeAll}>{t("tools")}</Link>
          <Link href={getLocalizedPath("/contact")} className="hover:text-[#3066be] transition" onClick={closeAll}>{t("contact")}</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button onClick={(e) => { e.stopPropagation(); setSearchOpen(!searchOpen); setOpenDropdown(null); }} className="text-gray-600 hover:text-[#3066be] transition p-2 rounded-lg hover:bg-[#3066be]/5" aria-label="Search">
            <SearchIcon className="w-5 h-5" />
          </button>
          <LanguageSelector locale={locale} openDropdown={openDropdown} handleDropdownToggle={handleDropdownToggle} switchLanguage={switchLanguage} />
          <Link href={getLocalizedPath("/contact")} className="px-5 py-2.5 bg-[#3066be] hover:bg-[#234a8c] text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-md shadow-[#3066be]/20" onClick={closeAll}>{t("analyseCTA")}</Link>
        </div>

        <button className="lg:hidden text-gray-800 text-3xl hover:text-[#3066be] transition" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen ? "✕" : "☰"}</button>
      </div>

      {searchOpen && <SearchOverlay searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchResults={searchResults} getLocalizedPath={getLocalizedPath} closeAll={closeAll} />}
      {openDropdown === "services" && <MegaMenuServices serviceLinks={translatedServiceLinks} getLocalizedPath={getLocalizedPath} closeAll={closeAll} t={tMega} />}
      {openDropdown === "news" && <MegaMenuNews news={news} getLocalizedPath={getLocalizedPath} closeAll={closeAll} tEvent={tEvent} tMega={tMega} />}
      {mobileOpen && <MobileMenu locale={locale} searchQuery={searchQuery} setSearchQuery={setSearchQuery} openDropdown={openDropdown} handleDropdownToggle={handleDropdownToggle} serviceLinks={translatedServiceLinks} getLocalizedPath={getLocalizedPath} closeAll={closeAll} switchLanguage={switchLanguage} t={t} router={router} />}

      <style jsx global>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>
    </header>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
