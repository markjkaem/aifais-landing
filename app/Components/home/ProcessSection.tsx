"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function ProcessSection() {
  const t = useTranslations("process");
  const locale = useLocale();

  return (
    <section className="relative py-24 md:py-32 bg-gray-50 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="text-sm font-medium text-gray-600">
              {t("badge")}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />

          {/* Step 1 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 mb-12 md:mb-20">
            {/* Left content (desktop) */}
            <div className="hidden md:flex w-1/2 justify-end pr-12">
              <div className="max-w-md text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-4">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {t("steps.step1.label")}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t("steps.step1.title")}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-4">
                  {t("steps.step1.desc")}
                </p>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {t("steps.step1.free")}
                </span>
              </div>
            </div>

            {/* Center node */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center z-10 group-hover:border-blue-500 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right content (desktop) / Mobile content */}
            <div className="w-full md:w-1/2 pl-20 md:pl-12">
              <div className="md:hidden mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-3">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {t("steps.step1.label")}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t("steps.step1.title")}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-3">
                  {t("steps.step1.desc")}
                </p>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {t("steps.step1.free")}
                </span>
              </div>

              <div className="hidden md:block bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <span className="text-lg">☕</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {t("steps.step1.card.title")}
                    </div>
                    <div className="text-xs text-gray-400">
                      {t("steps.step1.card.info")}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-500">
                  {(t.raw("steps.step1.card.points") as string[]).map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 mb-12 md:mb-20">
            <div className="hidden md:flex w-1/2 justify-end pr-12">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-200/50 max-w-sm">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  {t("steps.step2.card.label")}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center space-x-4 py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t("steps.step2.card.what")}</span>
                    <span className="font-medium text-gray-900">
                      {t("steps.step2.card.agent")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t("steps.step2.card.savings")}</span>
                    <span className="font-medium text-emerald-600">
                      {t("steps.step2.card.hours")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t("steps.step2.card.duration")}</span>
                    <span className="font-medium text-gray-900">{t("steps.step2.card.time")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 pl-20 md:pl-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full mb-4">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  {t("steps.step2.label")}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {t("steps.step2.title")}
              </h3>
              <p className="text-gray-500 leading-relaxed mb-4">
                {t.rich("steps.step2.desc", {
                  highlight: (children) => <strong className="text-gray-700">{children}</strong>,
                  this_auto: t("steps.step2.auto"),
                  this_yield: t("steps.step2.yield"),
                  this_cost: t("steps.step2.cost")
                })}
              </p>
              <p className="text-gray-400 text-sm">
                {t("steps.step2.subText")}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 mb-12 md:mb-20">
            <div className="hidden md:flex w-1/2 justify-end pr-12">
              <div className="max-w-md text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-4">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {t("steps.step3.label")}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t("steps.step3.title")}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {t("steps.step3.desc")}
                </p>
              </div>
            </div>

            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 pl-20 md:pl-12">
              <div className="md:hidden mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-3">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {t("steps.step3.label")}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t("steps.step3.title")}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {t("steps.step3.desc")}
                </p>
              </div>

              <div className="hidden md:block bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      M
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      F
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {t("steps.step3.card.working")}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                      75%
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {t("steps.step3.card.avgTime")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 - Final */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0">
            <div className="hidden md:flex w-1/2 justify-end pr-12">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl max-w-sm text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">{t("steps.step4.guarantee.title")}</div>
                    <div className="text-sm text-gray-400">
                      {t("steps.step4.guarantee.subtitle")}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("steps.step4.guarantee.text")}
                </p>
              </div>
            </div>

            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center z-10 ring-4 ring-white">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="w-full md:w-1/2 pl-20 md:pl-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                  {t("steps.step4.label")}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {t("steps.step4.title")}
              </h3>
              <p className="text-gray-500 leading-relaxed mb-4">
                {t("steps.step4.desc")}
              </p>

              <div className="md:hidden bg-gray-900 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="font-semibold">
                    {t("steps.step4.guarantee.mobile")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 bg-white rounded-full border border-gray-200 shadow-lg">
            <span className="text-gray-600 px-4">{t("cta.text")}</span>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all"
            >
              {t("cta.button")}
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
