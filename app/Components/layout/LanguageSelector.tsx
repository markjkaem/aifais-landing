"use client";

interface LanguageSelectorProps {
  locale: string;
  openDropdown: string | null;
  handleDropdownToggle: (dropdown: "services" | "news" | "languages") => void;
  switchLanguage: (lang: string) => void;
}

export default function LanguageSelector({
  locale,
  openDropdown,
  handleDropdownToggle,
  switchLanguage,
}: LanguageSelectorProps) {
  return (
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
  );
}
