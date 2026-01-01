"use client";

import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { useTranslations, useLocale } from "next-intl";

const h1_font = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden font-sans">
      {/* Background Video / Overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Base Background Color (Fallback) */}
        <div className="absolute inset-0 bg-[#000000]"></div>

        {/* Gradient Overlay - Darkened for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-black/20 to-[#3066be]/30" />

        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex flex-col h-full justify-center">
        {/* Top Bar: Badge Left, Logo Right */}
        <div className="flex w-full items-center justify-between mb-16 md:mb-8">
          {/* Left Side: Tech Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-lg shadow-lg shadow-black/5 cursor-default hover:bg-white/10 transition-colors">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3066be] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#90eb91] shadow-[0_0_8px_#0cff10]"></span>
            </span>
            <span className="text-xs font-mono tracking-widest uppercase text-blue-100/80">
              {t("badge")}
            </span>
          </div>

          {/* Right Side: Logo */}
          <div className="relative group">
            <Link
              href="/"
              className="block transition-transform duration-500 hover:scale-105"
            >
              <Image
                src="/logo-official.png"
                alt="Aifais Logo"
                width={400}
                height={100}
                className="hidden md:flex md:w-44 h-auto object-contain drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity"
                priority
              />
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl">
          {/* Main Headline */}
          <h1
            className={`${h1_font.className} text-5xl sm:text-6xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[1.05] mb-8 text-white`}
          >
            <span className="block text-blue-100/90">{t("h1_1")}</span>

            {/* Professional Gradient Text */}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white drop-shadow-sm pb-2">
              {t("h1_highlight")}
            </span>

            <span className="block text-blue-100/90">{t("h1_2")}</span>
          </h1>

          {/* Subheadlines */}
          <div className="space-y-6 mb-12">
            <h2 className="text-xl md:text-2xl text-white font-semibold tracking-wide">
              {t("h2_1")}{" "}
              <span className="text-blue-300">{t("h2_highlight")}</span>
            </h2>

            <p className="text-lg md:text-xl text-blue-100/70 leading-relaxed max-w-2xl font-light">
              {t("p")}
              <br className="hidden md:block" />
              <span className="inline-block mt-3 text-white font-medium border-b border-blue-400/30 pb-0.5">
                {t("guarantee")}
              </span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <Link
              href={`/${locale}/contact`}
              className="group relative px-6 py-3.5 bg-[#3066be] hover:bg-[#2554a3] text-white font-bold text-base rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(48,102,190,0.2)] hover:shadow-[0_0_30px_rgba(48,102,190,0.4)] transform hover:-translate-y-1"
            >
              <span>{t("cta")}</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            <button
              onClick={() => {
                // @ts-ignore
                if (window.Calendly) {
                  // @ts-ignore
                  window.Calendly.initPopupWidget({
                    url: "https://calendly.com/markteekenschannel2/30min",
                  });
                }
              }}
              className="px-6 py-3.5 bg-white text-gray-900 font-bold text-base rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1 shadow-lg border border-gray-200"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 shrink-0"
                fill="#0069ff"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm2.5-5c0 1.38-1.12 2.5-2.5 2.5S9.5 13.38 9.5 12s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5z" />
              </svg>
              <span>{t("bookMeeting")}</span>
            </button>

            <Link
              href={`/${locale}/tools/roi-calculator`}
              className="px-6 py-3.5 bg-white/5 border border-white/10 rounded-full text-white font-medium text-base hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
            >
              {t("roi")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
