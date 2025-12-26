"use client";

import { useTranslations } from "next-intl";

export default function TechStackSection() {
  const t = useTranslations("techStack");

  const techs = [
    { name: "Solana", label: t("techs.solana") },
    { name: "Claude 4.5", label: t("techs.claude") },
    { name: "Stripe", label: t("techs.stripe") },
    { name: "MCP", label: t("techs.mcp") },
  ];

  return (
    <section className="py-16 border-b border-gray-200 bg-white">
      <p className="text-center text-gray-500 text-xs font-mono uppercase tracking-[0.3em] mb-10">
        {t("enterprise")}
      </p>
      <div className="w-full justify-center items-center flex md:gap-24 gap-12 flex-wrap px-6 grayscale transition-all duration-500 opacity-70 hover:opacity-100 hover:grayscale-0">
        {techs.map((tech, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-gray-900">{tech.name}</span>
            <span className="text-[10px] text-gray-500 font-mono">
              {tech.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
