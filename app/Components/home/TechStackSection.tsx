"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

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
    <section className="py-24 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-stone-100/50 to-stone-50/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="text-sm font-medium text-stone-600">
              {t("badge")}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Tech Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 md:gap-8">
          {techs.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-stone-100 hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                  <img
                    src={`https://cdn.simpleicons.org/${tech.slug}`}
                    alt={tech.name}
                    className="w-8 h-8 object-contain opacity-50 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-stone-700 group-hover:text-stone-900 transition-colors">
                    {tech.name}
                  </p>
                  <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">
                    {t(`techs.${tech.key}`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
