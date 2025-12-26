"use client";

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
  locale: string;
}

export default function SearchOverlay({
  searchQuery,
  setSearchQuery,
  searchResults,
  getLocalizedPath,
  closeAll,
  locale,
}: SearchOverlayProps) {
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
  );
}
