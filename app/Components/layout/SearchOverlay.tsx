"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

interface SearchResult {
  type: string;
  title: string;
  slug: string;
}

interface SearchOverlayProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  getLocalizedPath: (path: string) => string;
  closeAll: () => void;
}

// Type configurations with icons, colors and labels
const typeConfig: Record<string, { icon: string; color: string; labelNl: string; labelEn: string }> = {
  page: { icon: "📄", color: "bg-gray-100 text-gray-600", labelNl: "Pagina", labelEn: "Page" },
  service: { icon: "⚡", color: "bg-[#3066be]/10 text-[#3066be]", labelNl: "Dienst", labelEn: "Service" },
  tool: { icon: "🛠️", color: "bg-amber-100 text-amber-700", labelNl: "Tool", labelEn: "Tool" },
  developer: { icon: "💻", color: "bg-emerald-100 text-emerald-700", labelNl: "Developer", labelEn: "Developer" },
  mkb: { icon: "🏢", color: "bg-indigo-100 text-indigo-700", labelNl: "MKB", labelEn: "SME" },
  case: { icon: "📁", color: "bg-purple-100 text-purple-600", labelNl: "Case", labelEn: "Case" },
  news: { icon: "📰", color: "bg-rose-100 text-rose-600", labelNl: "Nieuws", labelEn: "News" },
  legal: { icon: "📋", color: "bg-stone-100 text-stone-600", labelNl: "Juridisch", labelEn: "Legal" },
};

export default function SearchOverlay({
  searchQuery,
  setSearchQuery,
  searchResults,
  getLocalizedPath,
  closeAll,
}: SearchOverlayProps) {
  const t = useTranslations("searchOverlay");
  const locale = useLocale();

  const getTypeConfig = (type: string) => {
    return typeConfig[type] || typeConfig.page;
  };

  return (
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
            placeholder={t("placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#3066be] focus:outline-none text-lg shadow-inner"
            autoFocus
          />
        </div>
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((result, i) => {
              const config = getTypeConfig(result.type);
              return (
                <Link
                  key={i}
                  href={getLocalizedPath(result.slug)}
                  onClick={closeAll}
                  className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition group border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{config.icon}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide ${config.color}`}
                    >
                      {locale === "nl" ? config.labelNl : config.labelEn}
                    </span>
                    <span className="text-gray-700 group-hover:text-[#3066be] transition font-medium">
                      {result.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {searchQuery.length > 0 && searchResults.length === 0 && (
          <div className="mt-4 text-center py-8 text-gray-500">
            <span className="text-3xl mb-2 block">🔍</span>
            <p>{locale === "nl" ? "Geen resultaten gevonden" : "No results found"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
