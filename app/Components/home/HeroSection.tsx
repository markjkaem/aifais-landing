"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles, ChevronRight, Zap, Target } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden bg-[#fafaf9]">
      {/* Subtle background elements - hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none mobile-hide-blur">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
        {/* Main Content - Two columns */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="lg:col-span-6 xl:col-span-7">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-stone-200 rounded-full shadow-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium tracking-wide text-stone-600">
                {t("badge")}
              </span>
            </motion.div>

            {/* Headline - More compact */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-stone-900 leading-[1] tracking-tight mb-6"
            >
              <span className="block">{t("h1_1")}</span>
              <span className="block italic text-stone-400">{t("h1_highlight")}</span>
              <span className="block">{t("h1_2")}</span>
            </motion.h1>

            {/* Subheadline - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-lg mb-8"
            >
              <p className="text-base lg:text-lg text-stone-600 leading-relaxed">
                {t("p")}
              </p>
              <p className="mt-3 text-stone-900 font-medium inline-flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t("guarantee")}
              </p>
            </motion.div>

            {/* CTAs - Horizontal on larger screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              {/* Primary CTA */}
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-full transition-all duration-300 shadow-lg shadow-stone-900/10 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>{t("cta")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Calendly CTA */}
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
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 text-stone-900 font-semibold text-sm rounded-full transition-all duration-300 border border-stone-200 hover:border-stone-300 shadow-sm hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>{t("bookMeeting")}</span>
              </button>

              {/* Ghost CTA */}
              <Link
                href={`/${locale}/tools/roi-calculator`}
                className="group inline-flex items-center gap-1.5 px-4 py-3 text-stone-500 hover:text-stone-900 font-medium text-sm transition-colors"
              >
                <span>{t("roi")}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            
          </div>

          {/* Right: Compact Visual Element */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-6 xl:col-span-5 relative hidden lg:block"
          >
            <div className="relative">
              {/* Main card - More compact */}
              <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900 text-sm">AI Workflow</div>
                      <div className="text-xs text-stone-400">Actief • 24/7</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-xs font-medium text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>
                
                {/* Card content - Compact tasks */}
                <div className="p-5 space-y-3">
                  {[
                    { label: "Facturen verwerken", progress: 100, time: "2.3s" },
                    { label: "Data extractie", progress: 100, time: "1.1s" },
                    { label: "Export naar Excel", progress: 75, time: "..." },
                  ].map((task, i) => (
                    <motion.div 
                      key={task.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + (i * 0.1) }}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-700 font-medium">{task.label}</span>
                        <span className="text-stone-400 text-xs tabular-nums">{task.time}</span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.8 + (i * 0.15), ease: "easeOut" }}
                          className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Card footer */}
                <div className="px-5 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-stone-500">Vandaag bespaard:</span>
                    <span className="ml-1.5 font-semibold text-stone-900">4.2 uur</span>
                  </div>
                  <span className="text-xs font-medium text-blue-600">Details →</span>
                </div>
              </div>
              
              {/* Floating badges - Repositioned */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
                className="absolute -bottom-12 -left-4 px-3 py-2 bg-white rounded-xl shadow-lg border border-stone-100 z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-orange-500" fill="currentColor" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-stone-900">85% sneller</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                className="absolute -top-3 -right-3 px-3 py-2 bg-stone-900 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 text-white text-xs">
                  <Target className="w-3.5 h-3.5 text-pink-500" />
                  <span className="font-semibold">99.9% nauwkeurig</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}