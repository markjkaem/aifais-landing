"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Play,
  Mail,
  Bot,
  FileText,
  ArrowRight,
  Sparkles,
  Clock,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function AgentDemoSection() {
  const locale = useLocale();
  const t = useTranslations("agentDemo");

  const features = [
    { icon: Clock, text: t("features.emails"), color: "text-blue-400" },
    { icon: Bot, text: t("features.autonomous"), color: "text-purple-400" },
    { icon: Sparkles, text: t("features.realAi"), color: "text-amber-400" },
    { icon: Zap, text: t("features.free"), color: "text-emerald-400" },
  ];

  const emails = [
    { subject: t("visual.emails.email1"), status: "done" },
    { subject: t("visual.emails.email2"), status: "done" },
    { subject: t("visual.emails.email3"), status: "processing" },
    { subject: t("visual.emails.email4"), status: "pending" },
  ];

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800 relative overflow-hidden">
      {/* Background effects - hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none mobile-hide-blur">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-sm font-medium text-white/80">
                {t("badge")}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
            >
              {t("title")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {t("titleHighlight")}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-lg text-stone-400 mb-8 leading-relaxed max-w-lg"
            >
              {t("description")}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              {features.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-stone-300 text-sm font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href={`/${locale}/agents`}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 font-semibold rounded-full hover:bg-stone-100 transition-all duration-300 shadow-2xl shadow-white/10 hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5" />
                <span>{t("cta")}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-stone-500 text-sm">
                {t("noAccount")}
              </span>
            </motion.div>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-[2rem] blur-2xl" />

            {/* Main visual card */}
            <div className="relative bg-stone-800/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm sm:text-base truncate">{t("visual.header")}</div>
                    <div className="text-stone-500 text-[10px] sm:text-xs truncate">{t("visual.headerSub")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-500/20 rounded-full flex-shrink-0">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-[10px] sm:text-xs font-medium">{t("visual.live")}</span>
                </div>
              </div>

              {/* Content - Simulated workflow */}
              <div className="p-4 sm:p-6">
                {/* Flow visualization - Mobile: vertical, Desktop: horizontal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2 mb-6 sm:mb-8">
                  {/* Inbox */}
                  <div className="flex sm:flex-col items-center gap-3 sm:gap-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center sm:mb-2">
                      <Mail className="w-5 h-5 sm:w-7 sm:h-7 text-blue-400" />
                    </div>
                    <div className="sm:text-center">
                      <span className="text-stone-400 text-xs block">{t("visual.inbox")}</span>
                      <span className="text-white text-sm font-semibold">{t("visual.inboxCount")}</span>
                    </div>
                  </div>

                  {/* Arrow - hidden on mobile, shown on desktop */}
                  <div className="hidden sm:flex flex-1 items-center justify-center px-2 md:px-4">
                    <div className="flex items-center gap-1">
                      <div className="w-8 md:w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>

                  {/* Agent */}
                  <div className="flex sm:flex-col items-center gap-3 sm:gap-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/30 flex items-center justify-center sm:mb-2">
                      <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-purple-400" />
                    </div>
                    <div className="sm:text-center">
                      <span className="text-stone-400 text-xs block">{t("visual.agent")}</span>
                      <span className="text-white text-sm font-semibold">{t("visual.processing")}</span>
                    </div>
                  </div>

                  {/* Arrow - hidden on mobile, shown on desktop */}
                  <div className="hidden sm:flex flex-1 items-center justify-center px-2 md:px-4">
                    <div className="flex items-center gap-1">
                      <div className="w-8 md:w-16 h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full" />
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  {/* Drafts */}
                  <div className="flex sm:flex-col items-center gap-3 sm:gap-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center sm:mb-2">
                      <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400" />
                    </div>
                    <div className="sm:text-center">
                      <span className="text-stone-400 text-xs block">{t("visual.drafts")}</span>
                      <span className="text-white text-sm font-semibold">{t("visual.ready")}</span>
                    </div>
                  </div>
                </div>

                {/* Sample emails being processed */}
                <div className="space-y-2 sm:space-y-3">
                  {emails.map((email, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                        email.status === "processing"
                          ? "bg-purple-500/10 border border-purple-500/20"
                          : email.status === "done"
                          ? "bg-white/5"
                          : "bg-white/5 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 ${
                          email.status === "done"
                            ? "bg-emerald-500/20"
                            : email.status === "processing"
                            ? "bg-purple-500/20"
                            : "bg-white/10"
                        }`}
                      >
                        {email.status === "done" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                        ) : email.status === "processing" ? (
                          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                        ) : (
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />
                        )}
                      </div>
                      <span
                        className={`text-xs sm:text-sm truncate flex-1 min-w-0 ${
                          email.status === "done"
                            ? "text-stone-300"
                            : email.status === "processing"
                            ? "text-white"
                            : "text-stone-500"
                        }`}
                      >
                        {email.subject}
                      </span>
                      {email.status === "processing" && (
                        <span className="text-[10px] sm:text-xs text-purple-400 font-medium flex-shrink-0">
                          {t("visual.processingText")}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="text-xs sm:text-sm">
                  <span className="text-stone-500">{t("visual.avgTime")}</span>
                  <span className="ml-1 sm:ml-2 text-white font-semibold">{t("visual.avgValue")}</span>
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="text-stone-500">{t("visual.savings")}</span>
                  <span className="ml-1 sm:ml-2 text-emerald-400 font-semibold">{t("visual.savingsValue")}</span>
                </div>
              </div>
            </div>

            {/* Floating elements - hidden on mobile to prevent overflow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="hidden sm:block absolute -top-4 -right-4 px-4 py-2 bg-white rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-stone-900">
                  {t("badges.noCode")}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="hidden sm:block absolute -bottom-4 -left-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">{t("badges.powered")}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
