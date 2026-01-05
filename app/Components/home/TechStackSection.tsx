"use client";

import { useTranslations } from "next-intl";

export default function TechStackSection() {
  const t = useTranslations("techStack");

  const techs = [
    { key: "solana", name: "Solana", slug: "solana" },
    { key: "claude", name: "Anthropic", slug: "anthropic" },
    { key: "google", name: "Google", slug: "googlegemini" },
    { key: "microsoft", name: "Microsoft", slug: "dotnet" },
    { key: "n8n", name: "n8n", slug: "n8n" },
    { key: "zapier", name: "Zapier", slug: "zapier" },
    { key: "make", name: "Make", slug: "make" },
    { key: "hubspot", name: "HubSpot", slug: "hubspot" },
    { key: "slack", name: "Slack", slug: "slack" },
    { key: "airtable", name: "Airtable", slug: "airtable" },
    { key: "langchain", name: "LangChain", slug: "langchain" },
    { key: "stripe", name: "Stripe", slug: "stripe" },
  ];

  return (
    <section className="py-24 border-b border-stone-100 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#3066be] text-sm font-bold uppercase tracking-widest mb-3">
            {t("badge")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
            {t("title")} <span className="text-[#3066be]">{t("titleHighlight")}</span>
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-y-16 items-center justify-items-center transition-all duration-700">
          {techs.map((tech, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center gap-4 group cursor-default"
            >
              <div className="relative w-16 h-16 flex items-center justify-center grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">
                <img 
                  src={`https://cdn.simpleicons.org/${tech.slug}`} 
                  alt={tech.name}
                  className="w-10 h-10 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-stone-900 group-hover:text-[#3066be] transition-colors">
                  {tech.name}
                </p>
                <p className="text-[10px] text-stone-400 font-mono uppercase tracking-tighter">
                  {t(`techs.${tech.key}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
