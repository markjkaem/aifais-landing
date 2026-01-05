"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowRight,
  FileText,
  Scale,
  Mail,
  Calculator,
  PenTool,
  Lock,
  Sparkles,
} from "lucide-react";

export default function ToolsTeaser() {
  const t = useTranslations("tools");
  const locale = useLocale();

  return (
    <section className="py-28 bg-[#fafaf9] relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-stone-100 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl  mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="text-sm font-medium text-stone-600">{t("badge")}</span>
          </div>
          <div className="flex text-left flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-3">
                {t("title")}{" "}
                <span className="text-[#3066be]">{t("titleHighlight")}</span>
              </h2>
              <p className="text-stone-500 text-lg max-w-xl">
                {t("subtitle")}
              </p>
            </div>
            <Link
              href={`/${locale}/tools`}
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors group shrink-0"
            >
              {t("viewAll")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Featured: Invoice Scanner API - Takes 3 columns */}
          <Link
            href={`/${locale}/tools/invoice-extraction`}
            className="lg:col-span-3 group"
          >
            <div className="h-full bg-white border border-stone-200/80 rounded-2xl p-6 md:p-8 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/[0.04] transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                      <Sparkles className="w-3 h-3" />
                      Live API
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-stone-900 mb-2 group-hover:text-stone-800 transition-colors">
                  {t("invoiceScanner.title")}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-1">
                  {t("invoiceScanner.description")}
                </p>

                {/* Tech Stack - Only for this card */}
                <div className="pt-5 border-t border-stone-100">
                  <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-3">
                    {t("invoiceScanner.stackLabel")}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded text-[10px] text-stone-600 font-mono font-semibold">
                      SOLANA
                    </span>
                    <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded text-[10px] text-stone-600 font-mono font-semibold">
                      X402 Protocol
                    </span>
                    <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded text-[10px] text-stone-600 font-mono font-semibold">
                      MCP Server
                    </span>
                    <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded text-[10px] text-stone-600 font-mono font-semibold">
                      0.001 SOL/scan
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs text-stone-500 font-medium">
                        {t("invoiceScanner.status")}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t("invoiceScanner.cta")}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Right Column: Free Tools - Takes 2 columns */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* ROI Calculator */}
            <Link href={`/${locale}/tools/roi-calculator`} className="group flex-1">
              <div className="h-full bg-white border border-stone-200/80 rounded-2xl p-5 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/[0.04] transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                    <Calculator className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-semibold text-stone-900 group-hover:text-stone-800 transition-colors">
                        {t("roiCalculator.title")}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 uppercase tracking-wide">
                        {t("roiCalculator.label")}
                      </span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {t("roiCalculator.description")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Invoice Creator */}
            <Link href={`/${locale}/tools/invoice-creation`} className="group flex-1">
              <div className="h-full bg-white border border-stone-200/80 rounded-2xl p-5 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/[0.04] transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-500 group-hover:text-white transition-colors shrink-0">
                    <PenTool className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-semibold text-stone-900 group-hover:text-stone-800 transition-colors">
                        {t("invoiceCreator.title")}
                      </h3>
                      <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200/60 uppercase tracking-wide">
                        {t("invoiceCreator.label")}
                      </span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {t("invoiceCreator.description")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Coming Soon: Stacked */}
            <div className="bg-stone-50/80 border border-stone-200/60 rounded-2xl p-5">
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                {t("comingSoon.label")}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-stone-500 font-medium">
                    {t("comingSoon.debtGenerator")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-stone-500 font-medium">
                    {t("comingSoon.proposalAi")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
