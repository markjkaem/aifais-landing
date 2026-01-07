"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Calculator,
  Clock,
  TrendingUp,
  Send,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  Users,
  Euro,
} from "lucide-react";

type TabType = "calculator" | "scan" | "contact";

export default function ArticleCTA() {
  const locale = useLocale();
  const t = useTranslations("articleCta");
  const [activeTab, setActiveTab] = useState<TabType>("calculator");

  // Calculator state
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(45);
  const [teamSize, setTeamSize] = useState(3);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    process: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Calculate ROI
  const weeklyHoursSaved = hoursPerWeek * 0.7; // 70% automation potential
  const monthlySavings = weeklyHoursSaved * 4 * hourlyRate * teamSize;
  const yearlySavings = monthlySavings * 12;
  const implementationCost = 3500; // Average starting cost
  const paybackMonths = Math.ceil(implementationCost / monthlySavings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");

    try {
      const res = await fetch("/api/internal/quickscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          results: {
            totalSavings: `€${yearlySavings.toLocaleString("nl-NL")}`,
            hoursReclaimed: Math.round(weeklyHoursSaved * 52 * teamSize),
            fteRecovered: ((weeklyHoursSaved * teamSize) / 40).toFixed(1),
          },
          formData: {
            name: formData.name,
            company: formData.company,
            process: formData.process,
          },
        }),
      });

      if (res.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const tabs = [
    { id: "calculator" as const, label: t("tabs.calculator"), icon: Calculator },
    { id: "scan" as const, label: t("tabs.scan"), icon: Sparkles },
    { id: "contact" as const, label: t("tabs.contact"), icon: Send },
  ];

  return (
    <div className="my-16 bg-linear-to-br from-stone-900 via-stone-900 to-stone-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-8 sm:px-10 sm:py-10 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {t("header")}
          </h3>
        </div>
        <p className="text-stone-400">
          {t("description")}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "text-white bg-white/10 border-b-2 border-blue-500"
                : "text-stone-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {/* Calculator Tab */}
          {activeTab === "calculator" && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Sliders */}
              <div className="space-y-6 mb-8">
                {/* Hours per week */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-stone-300 text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      {t("calculator.hoursLabel")}
                    </label>
                    <span className="text-white font-bold">{hoursPerWeek} {t("calculator.hoursUnit")}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                {/* Hourly rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-stone-300 text-sm font-medium flex items-center gap-2">
                      <Euro className="w-4 h-4 text-emerald-400" />
                      {t("calculator.rateLabel")}
                    </label>
                    <span className="text-white font-bold">€{hourlyRate}</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="100"
                    step="5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                {/* Team size */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-stone-300 text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      {t("calculator.teamLabel")}
                    </label>
                    <span className="text-white font-bold">{teamSize} {t("calculator.teamUnit")}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <div className="text-stone-400 text-xs uppercase tracking-wider mb-1">
                    {t("calculator.results.yearly")}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
                    €{yearlySavings.toLocaleString("nl-NL")}
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <div className="text-stone-400 text-xs uppercase tracking-wider mb-1">
                    {t("calculator.results.hours")}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                    {Math.round(weeklyHoursSaved * 52 * teamSize)} {t("calculator.results.hoursUnit")}
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <div className="text-stone-400 text-xs uppercase tracking-wider mb-1">
                    {t("calculator.results.payback")}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                    {paybackMonths} {t("calculator.results.paybackUnit")}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setActiveTab("scan")}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-stone-100 text-stone-900 font-semibold rounded-xl transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  {t("calculator.cta")}
                </button>
                <Link
                  href={`/${locale}/tools/roi-calculator`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/10"
                >
                  {locale === "nl" ? "Uitgebreide calculator" : "Advanced calculator"}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <p className="text-stone-500 text-xs text-center mt-4">
                {t("calculator.note")}
              </p>
            </motion.div>
          )}

          {/* Scan Form Tab */}
          {activeTab === "scan" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {formStatus === "success" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {t("scan.success.title")}
                  </h4>
                  <p className="text-stone-400">
                    {t("scan.success.description")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-400 text-sm mb-2">
                        {locale === "nl" ? "Naam" : "Name"}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        placeholder={t("scan.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-sm mb-2">
                        {locale === "nl" ? "E-mail" : "Email"}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        placeholder={t("scan.emailPlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 text-sm mb-2">
                      {locale === "nl" ? "Bedrijfsnaam" : "Company name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      placeholder={t("scan.companyPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 text-sm mb-2">
                      {t("scan.processPlaceholder").split("?")[0] + "?"}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.process}
                      onChange={(e) =>
                        setFormData({ ...formData, process: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                      placeholder={locale === "nl" ? "Bijv. factuurverwerking, email triage, lead opvolging..." : "E.g. invoice processing, email triage, lead follow-up..."}
                    />
                  </div>

                  {/* Show calculated savings if available */}
                  {monthlySavings > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                      <span className="text-emerald-400 text-sm">
                        {locale === "nl" ? "Je geschatte besparing:" : "Your estimated savings:"}
                      </span>
                      <span className="text-white font-bold">
                        €{yearlySavings.toLocaleString("nl-NL")}/{locale === "nl" ? "jaar" : "year"}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === "loading"}
                    className="w-full py-4 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {formStatus === "loading" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        {t("scan.submit")}
                      </>
                    )}
                  </button>

                  {formStatus === "error" && (
                    <p className="text-red-400 text-sm text-center">
                      {t("scan.error")}
                    </p>
                  )}

                  <p className="text-stone-500 text-xs text-center">
                    {locale === "nl"
                      ? "Vrijblijvend • Reactie binnen 24 uur • Geen verplichtingen"
                      : "No obligation • Response within 24 hours • No commitments"}
                  </p>
                </form>
              )}
            </motion.div>
          )}

          {/* Direct Contact Tab */}
          {activeTab === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-blue-400" />
              </div>

              <h4 className="text-xl font-bold text-white mb-2">
                {t("contact.title")}
              </h4>
              <p className="text-stone-400 mb-8 max-w-md mx-auto">
                {t("contact.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-stone-100 text-stone-900 font-semibold rounded-xl transition-all"
                >
                  <Clock className="w-5 h-5" />
                  {t("contact.cta")}
                </button>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/10"
                >
                  {locale === "nl" ? "Contactformulier" : "Contact form"}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <p className="text-stone-500 text-xs mt-6">
                {t("contact.responseTime")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
