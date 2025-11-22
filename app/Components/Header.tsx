"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { projects } from "../[locale]/portfolio/data";
import { news } from "../[locale]/news/[slug]/data";

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

  const handleDropdownToggle = (
    dropdown: "services" | "news" | "languages"
  ) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("header")) {
        closeAll();
      }
    };

    if (openDropdown || mobileOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown, mobileOpen]);

  // ✅ DEFINITIEVE WERKENDE OPLOSSING - Hard redirect
  const switchLanguage = (newLocale: string) => {
    // Don't do anything if already on that locale
    if (locale === newLocale) {
      console.log("⚠️ Already on", newLocale);
      closeAll();
      return;
    }

    console.log("🔄 Switching from", locale, "to", newLocale);
    console.log("📍 Current pathname:", pathname);

    let pathWithoutLocale = pathname;

    // Remove /en prefix if it exists
    if (pathWithoutLocale.startsWith("/en/")) {
      pathWithoutLocale = pathWithoutLocale.substring(3);
    } else if (pathWithoutLocale === "/en") {
      pathWithoutLocale = "/";
    }

    // Build new path
    let newPath: string;
    if (newLocale === "nl") {
      newPath = pathWithoutLocale || "/";
    } else {
      newPath = pathWithoutLocale === "/" ? "/en" : `/en${pathWithoutLocale}`;
    }

    console.log("✅ Hard redirecting to:", newPath);

    // ✅ Use window.location for guaranteed redirect
    window.location.href = newPath;
  };

  // ✅ Helper to get localized path
  const getLocalizedPath = (path: string) => {
    if (locale === "nl") {
      return path;
    }
    return `/en${path}`;
  };

  return (
    <header className="w-full bg-black/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href={getLocalizedPath("/")} onClick={closeAll}>
          <Image
            className="invert w-20"
            src="/logo_official.png"
            alt="Aifais Logo"
            width={200}
            height={200}
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-10 text-sm text-gray-300">
          <button
            onClick={() => handleDropdownToggle("services")}
            className="hover:text-purple-400 transition flex items-center gap-1"
          >
            {t("services")} <span className="text-xs">▼</span>
          </button>

          <button
            onClick={() => handleDropdownToggle("news")}
            className="hover:text-purple-400 transition flex items-center gap-1"
          >
            {t("news")} <span className="text-xs">▼</span>
          </button>

          <Link
            href={`${getLocalizedPath("/")}#cases`}
            className="hover:text-purple-400 transition"
            onClick={(e) => {
              e.preventDefault();
              router.push(`${getLocalizedPath("/")}#cases`);
              closeAll();
            }}
          >
            {t("cases")}
          </Link>

          <Link
            href={`${getLocalizedPath("/")}#about`}
            className="hover:text-purple-400 transition"
            onClick={(e) => {
              e.preventDefault();
              router.push(`${getLocalizedPath("/")}#about`);
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

        {/* Desktop language selector */}
        <div className="hidden md:block relative">
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
            <span className="text-xs">▼</span>
          </button>

          {openDropdown === "languages" && (
            <div
              className="absolute right-0 mt-3 bg-black/95 border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[160px] z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => switchLanguage("nl")}
                disabled={locale === "nl"}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center gap-3 ${
                  locale === "nl"
                    ? "text-purple-400 bg-white/5 cursor-default"
                    : "text-gray-300 cursor-pointer"
                }`}
              >
                <span className="text-xl">🇳🇱</span>
                <span>Nederlands</span>
                {locale === "nl" && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => switchLanguage("en")}
                disabled={locale === "en"}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center gap-3 ${
                  locale === "en"
                    ? "text-purple-400 bg-white/5 cursor-default"
                    : "text-gray-300 cursor-pointer"
                }`}
              >
                <span className="text-xl">🇬🇧</span>
                <span>English</span>
                {locale === "en" && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-200 text-3xl"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {/* Desktop Mega Menu - Services */}
      {openDropdown === "services" && (
        <div className="hidden md:block w-full bg-black/95 border-b border-white/10 shadow-2xl py-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="grid grid-cols-2 gap-x-10 text-gray-200 text-sm">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={getLocalizedPath(`/portfolio/${project.slug}`)}
                  className="hover:text-purple-400 p-2 transition"
                  onClick={closeAll}
                >
                  {project.title}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-center bg-black border border-white/10 rounded-2xl p-4 shadow-lg hover:border-purple-500 transition cursor-pointer">
              <div className="flex items-center space-x-5">
                <Image
                  src="/event.jpg"
                  alt="Event Preview"
                  width={180}
                  height={120}
                  className="rounded-lg object-cover"
                />
                <div className="text-sm text-gray-200 leading-tight">
                  <p className="font-semibold text-lg">{tEvent("title")}</p>
                  <p className="text-gray-400 mt-1">{tEvent("subtitle")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Mega Menu - News */}
      {openDropdown === "news" && (
        <div className="hidden md:block w-full bg-black/95 border-b border-white/10 shadow-2xl py-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="grid grid-cols-2 gap-x-10 text-gray-200 text-sm">
              {news
                .filter((item) => item.id < 6)
                .map((blog) => (
                  <Link
                    key={blog.slug}
                    href={getLocalizedPath(`/news/${blog.slug}`)}
                    className="block p-2 hover:text-purple-400 transition"
                    onClick={closeAll}
                  >
                    {blog.title}
                  </Link>
                ))}
              <Link
                href={`${getLocalizedPath("/")}#introduction`}
                className="block p-2 hover:text-purple-400"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`${getLocalizedPath("/")}#introduction`);
                  closeAll();
                }}
              >
                {locale === "nl"
                  ? "Bekijk hoe automatisering jouw werk vereenvoudigt"
                  : "See how automation simplifies your work"}
              </Link>
            </div>
            <div className="flex items-center justify-center bg-black border border-white/10 rounded-2xl p-4 shadow-lg hover:border-purple-500 transition cursor-pointer">
              <div className="flex items-center space-x-5">
                <Image
                  src="/event.jpg"
                  alt="Event Preview"
                  width={180}
                  height={120}
                  className="rounded-lg object-cover"
                />
                <div className="text-sm text-gray-200 leading-tight">
                  <p className="font-semibold text-lg">{tEvent("title")}</p>
                  <p className="text-gray-400 mt-1">{tEvent("subtitle")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-6 py-4 space-y-4 text-gray-200 text-base">
          {/* Mobile: Services */}
          <div>
            <button
              onClick={() => handleDropdownToggle("services")}
              className="w-full flex justify-between items-center py-2"
            >
              {t("services")} <span>▼</span>
            </button>
            {openDropdown === "services" && (
              <div className="pl-4 mt-2 space-y-2">
                {projects.map((project) => (
                  <Link
                    key={project.slug}
                    href={getLocalizedPath(`/portfolio/${project.slug}`)}
                    className="block hover:text-purple-400"
                    onClick={closeAll}
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={() => handleDropdownToggle("news")}
              className="w-full flex justify-between items-center pt-6 pb-2"
            >
              {t("news")} <span>▼</span>
            </button>
            {openDropdown === "news" && (
              <div className="pl-4 mt-2 space-y-2">
                <Link
                  href={`${getLocalizedPath("/")}#introduction`}
                  className="block p-2 hover:text-purple-400"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`${getLocalizedPath("/")}#introduction`);
                    closeAll();
                  }}
                >
                  {locale === "nl"
                    ? "Bekijk hoe automatisering jouw werk vereenvoudigt"
                    : "See how automation simplifies your work"}
                </Link>
                {news
                  .filter((item) => item.id < 4)
                  .map((blog) => (
                    <Link
                      key={blog.slug}
                      href={getLocalizedPath(`/news/${blog.slug}`)}
                      className="block p-2 hover:text-purple-400 transition"
                      onClick={closeAll}
                    >
                      {blog.title}
                    </Link>
                  ))}
              </div>
            )}
          </div>

          <Link
            href={`${getLocalizedPath("/")}#cases`}
            className="block py-2 hover:text-purple-400"
            onClick={(e) => {
              e.preventDefault();
              router.push(`${getLocalizedPath("/")}#cases`);
              closeAll();
            }}
          >
            {t("cases")}
          </Link>

          <Link
            href={`${getLocalizedPath("/")}#about`}
            className="block py-2 hover:text-purple-400"
            onClick={(e) => {
              e.preventDefault();
              router.push(`${getLocalizedPath("/")}#about`);
              closeAll();
            }}
          >
            {t("about")}
          </Link>

          <Link
            href={getLocalizedPath("/contact")}
            className="block py-2 hover:text-purple-400"
            onClick={closeAll}
          >
            {t("contact")}
          </Link>

          {/* Mobile languages */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
              {t("language")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => switchLanguage("nl")}
                disabled={locale === "nl"}
                className={`flex-1 px-4 py-3 rounded-lg border transition flex items-center justify-center gap-2 ${
                  locale === "nl"
                    ? "bg-purple-500/20 border-purple-500 text-purple-400 cursor-default"
                    : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20 cursor-pointer"
                }`}
              >
                <span className="text-xl">🇳🇱</span>
                <span className="font-medium">NL</span>
              </button>
              <button
                onClick={() => switchLanguage("en")}
                disabled={locale === "en"}
                className={`flex-1 px-4 py-3 rounded-lg border transition flex items-center justify-center gap-2 ${
                  locale === "en"
                    ? "bg-purple-500/20 border-purple-500 text-purple-400 cursor-default"
                    : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20 cursor-pointer"
                }`}
              >
                <span className="text-xl">🇬🇧</span>
                <span className="font-medium">EN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
