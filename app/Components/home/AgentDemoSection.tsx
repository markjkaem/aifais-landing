"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
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

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-sm font-medium text-white/80">
                Live Demo Beschikbaar
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
            >
              Zie een AI Agent{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                in actie
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-stone-400 mb-8 leading-relaxed max-w-lg"
            >
              Geen praatjes, maar resultaat. Bekijk hoe onze AI-agent een
              complete inbox verwerkt — volledig autonoom, zonder jouw input.
              Real-time. In 4 minuten.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              {[
                { icon: Clock, text: "5 emails in 4 min", color: "text-blue-400" },
                { icon: Bot, text: "Volledig autonoom", color: "text-purple-400" },
                { icon: Sparkles, text: "Echte AI responses", color: "text-amber-400" },
                { icon: Zap, text: "Gratis te proberen", color: "text-emerald-400" },
              ].map((item, i) => (
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
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href={`/${locale}/agents`}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 font-semibold rounded-full hover:bg-stone-100 transition-all duration-300 shadow-2xl shadow-white/10 hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5" />
                <span>Start Live Demo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-stone-500 text-sm">
                Geen account nodig
              </span>
            </motion.div>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-[2rem] blur-2xl" />

            {/* Main visual card */}
            <div className="relative bg-stone-800/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Inbox Agent</div>
                    <div className="text-stone-500 text-xs">Verwerkt emails automatisch</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-medium">Live</span>
                </div>
              </div>

              {/* Content - Simulated workflow */}
              <div className="p-6">
                {/* Flow visualization */}
                <div className="flex items-center justify-between mb-8">
                  {/* Inbox */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-2">
                      <Mail className="w-7 h-7 text-blue-400" />
                    </div>
                    <span className="text-stone-400 text-xs">Inbox</span>
                    <span className="text-white text-sm font-semibold">5 emails</span>
                  </div>

                  {/* Arrow */}
                  <div className="flex-1 flex items-center justify-center px-4">
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                    </motion.div>
                  </div>

                  {/* Agent */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/30 flex items-center justify-center mb-2"
                    >
                      <Bot className="w-7 h-7 text-purple-400" />
                    </motion.div>
                    <span className="text-stone-400 text-xs">Agent</span>
                    <span className="text-white text-sm font-semibold">Verwerkt</span>
                  </div>

                  {/* Arrow */}
                  <div className="flex-1 flex items-center justify-center px-4">
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full" />
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </motion.div>
                  </div>

                  {/* Drafts */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-2">
                      <FileText className="w-7 h-7 text-emerald-400" />
                    </div>
                    <span className="text-stone-400 text-xs">Concepten</span>
                    <span className="text-white text-sm font-semibold">Klaar</span>
                  </div>
                </div>

                {/* Sample emails being processed */}
                <div className="space-y-3">
                  {[
                    { subject: "Offerte aanvraag voor 8 gebruikers", status: "done" },
                    { subject: "Factuur #2024-0892 niet ontvangen", status: "done" },
                    { subject: "Probleem met exportfunctie", status: "processing" },
                    { subject: "Kennismakingsgesprek plannen", status: "pending" },
                  ].map((email, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        email.status === "processing"
                          ? "bg-purple-500/10 border border-purple-500/20"
                          : email.status === "done"
                          ? "bg-white/5"
                          : "bg-white/5 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          email.status === "done"
                            ? "bg-emerald-500/20"
                            : email.status === "processing"
                            ? "bg-purple-500/20"
                            : "bg-white/10"
                        }`}
                      >
                        {email.status === "done" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : email.status === "processing" ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Bot className="w-4 h-4 text-purple-400" />
                          </motion.div>
                        ) : (
                          <Mail className="w-4 h-4 text-stone-500" />
                        )}
                      </div>
                      <span
                        className={`text-sm truncate ${
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
                        <span className="ml-auto text-xs text-purple-400 font-medium">
                          Verwerken...
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-stone-500">Gemiddeld:</span>
                  <span className="ml-2 text-white font-semibold">45 sec/email</span>
                </div>
                <div className="text-sm">
                  <span className="text-stone-500">Besparing:</span>
                  <span className="ml-2 text-emerald-400 font-semibold">30+ min/dag</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="absolute -top-4 -right-4 px-4 py-2 bg-white rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-stone-900">
                  Geen code nodig
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="absolute -bottom-4 -left-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">Claude AI Powered</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
