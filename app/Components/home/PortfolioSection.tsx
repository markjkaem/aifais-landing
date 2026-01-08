"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface Project {
  slug: string;
  image: string;
  title: string;
  description: string;
}

interface PortfolioSectionProps {
  projects: Project[];
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
  const t = useTranslations("portfolio");
  const locale = useLocale();

  return (
    <section id="cases" className="relative py-24 md:py-32 bg-[#fafaf9] overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="text-sm font-medium text-stone-600">
              {t("badge")}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-stone-900 tracking-tight">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.slice(0, 3).map((project, index) => (
            <Link
              key={project.slug || index}
              href={`/${locale}/portfolio/${project.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-stone-300 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Status Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold text-stone-700">
                    {t("status")}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-6">
                {/* Tags */}
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-medium text-stone-500 px-2 py-1 bg-stone-100 rounded-md">
                    {t("tags.automation")}
                  </span>
                  <span className="text-xs font-medium text-blue-600 px-2 py-1 bg-blue-50 rounded-md">
                    {t("tags.agent")}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-stone-600 transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 flex-grow">
                  {project.description}
                </p>

                {/* Link indicator */}
                <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-900 group-hover:text-stone-600 transition-colors">
                    {t("viewCase")}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/portfolio`}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-stone-200 rounded-full text-stone-900 font-semibold hover:bg-stone-50 hover:border-stone-300 hover:shadow-md transition-all duration-300 group"
          >
            {t("viewAll")}
            <svg
              className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
