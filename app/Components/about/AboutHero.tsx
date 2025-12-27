"use client";

import { useTranslations } from "next-intl";

export default function AboutHero() {
  const t = useTranslations("aboutPage.hero");

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#3066be] opacity-20 blur-[100px]"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-8 shadow-sm animate-slideDown">
          <span className="w-2 h-2 rounded-full bg-[#3066be]"></span>
          <span className="text-sm font-medium text-gray-600 tracking-wide uppercase">
            {t("badge")}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 tracking-tight leading-[1.1]">
          {t("title")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-[#60a5fa] animate-gradient">
            {t("titleHighlight")}
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
          {t("subtitle")}
        </p>
      </div>
    </section>
  );
}
