"use client";
// ========================================
// FILE: app/HomeClient.tsx - LIGHT THEME (#fbfff1 & #3066be)
// ========================================

import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { useRef } from "react";
import { projects } from "./portfolio/data";
import FAQSection from "../Components/FAQSection";
import ToolsTeaser from "../Components/ToolsTeaser";

// Fonts
const h1 = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

// Colors
const PRIMARY_BLUE = "#3066be";
const BG_CREAM = "#fbfff1";

// Icons Components
const LinkedInIcon = () => (
  <svg
    className="w-6 h-6 text-gray-500 group-hover:text-[#3066be] transition-colors"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    className="w-6 h-6 text-gray-500 group-hover:text-[#3066be] transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export default function HomeClient() {
  return (
    <main className="bg-white text-gray-900 min-h-screen transition-colors duration-500  ">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden font-sans">
        {/* Background Video / Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Base Background Color (Fallback) */}
          <div className="absolute inset-0 bg-[#0f172a]"></div>

          {/* Gradient Overlay - Darkened for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#1e3a8a]/40 to-[#0f172a]/90" />

          {/* Subtle Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex flex-col h-full justify-center">
          {/* Top Bar: Badge Left, Logo Right */}
          <div className="flex w-full items-center justify-between mb-16 md:mb-8">
            {/* Left Side: Tech Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-lg shadow-lg shadow-black/5 cursor-default hover:bg-white/10 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3066be] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0cff10] shadow-[0_0_8px_#0cff10]"></span>
              </span>
              <span className="text-xs font-mono tracking-widest uppercase text-blue-100/80">
                AI-Driven Workforce
              </span>
            </div>

            {/* Right Side: Logo */}
            <div className="relative group">
              <Link
                href="/"
                className="block transition-transform duration-500 hover:scale-105"
              >
                <Image
                  src="/logo-official.png"
                  alt="Aifais Logo"
                  width={400}
                  height={100}
                  /* w-40 is a standard tailwind width (10rem). Adjust if needed */
                  className="w-36 md:w-44  h-auto object-contain drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity"
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="max-w-4xl">
            {/* Main Headline */}
            <h1
              className={`${h1.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05] mb-8 text-white`}
            >
              <span className="block text-blue-100/90">Neem je eerste</span>

              {/* Professional Gradient Text */}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white drop-shadow-sm pb-2">
                Digitale Werknemer
              </span>

              <span className="block text-blue-100/90">aan.</span>
            </h1>

            {/* Subheadlines */}
            <div className="space-y-6 mb-12">
              <h2 className="text-xl md:text-2xl text-white font-semibold tracking-wide">
                Meer tijd. Meer winst.{" "}
                <span className="text-blue-300">Minder gedoe.</span>
              </h2>

              <p className="text-lg md:text-xl text-blue-100/70 leading-relaxed max-w-2xl font-light">
                Wij automatiseren de taken die je tijd kosten, zodat jij je kunt
                focussen op wat écht belangrijk is: je bedrijf laten groeien.
                <br className="hidden md:block" />
                <span className="inline-block mt-3 text-white font-medium border-b border-blue-400/30 pb-0.5">
                  Gratis analyse. Gratis plan. Niet goed, geld terug.
                </span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/contact"
                className="group relative px-8 py-4 bg-[#3066be] hover:bg-[#2554a3] text-white font-bold text-lg rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(48,102,190,0.3)] hover:shadow-[0_0_30px_rgba(48,102,190,0.5)] transform hover:-translate-y-1"
              >
                <span>Plan gratis analyse</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              <Link
                href="/tools/roi-calculator"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
              >
                Besparings tool proberen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPLAINER (Light Theme) ================= */}
      {/* Software die Werkt Section - Premium Redesign */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-l from-purple-100/40 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              {/* Heading with visual flair */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 tracking-tight leading-[1.1]">
                Software die{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                    werkt
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-0 rounded" />
                </span>
                ,
                <br />
                niet software die{" "}
                <span className="text-gray-300 line-through decoration-2">
                  wacht
                </span>
                .
              </h2>

              {/* Description */}
              <div className="space-y-4 mb-10">
                <p className="text-xl text-gray-500 leading-relaxed">
                  Traditionele software is passief: het wacht tot jij op de
                  knoppen drukt.
                </p>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Een{" "}
                  <span className="font-semibold text-gray-900">
                    Digitale Werknemer
                  </span>{" "}
                  is proactief. Hij leest je mail, begrijpt context, en voert
                  acties uit — zonder dat jij erbij hoeft te zijn.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4">
                {[
                  {
                    title: "Autonome Uitvoering",
                    desc: "Geen kliks nodig. Je agent neemt het volledige proces over, van start tot finish.",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                        />
                      </svg>
                    ),
                    color: "blue" as const,
                  },
                  {
                    title: "Contextuele AI",
                    desc: "Begrijpt niet alleen data, maar ook nuance. Leest documenten zoals een mens dat doet.",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                        />
                      </svg>
                    ),
                    color: "purple" as const,
                  },
                  {
                    title: "Niet Goed, Geld Terug",
                    desc: "Wij geloven in resultaat. Werkt het niet zoals afgesproken? Dan betaal je niet.",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                        />
                      </svg>
                    ),
                    color: "emerald" as const,
                  },
                ].map((item, i) => {
                  const colors: Record<"blue" | "purple" | "emerald", string> =
                    {
                      blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                      purple:
                        "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
                      emerald:
                        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
                    };

                  return (
                    <div
                      key={i}
                      className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 cursor-default"
                    >
                      <div
                        className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          colors[item.color]
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Interactive Visual */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-[2.5rem] blur-2xl opacity-60" />

                {/* Main Card */}
                <div className="relative bg-white rounded-[2rem] border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden">
                  {/* Card Header */}
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <span className="text-sm text-gray-400 font-mono">
                        agent.process
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs text-emerald-600 font-medium">
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Input Section */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Input
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm">
                          <div className="w-2 h-2 rounded-full bg-orange-400" />
                          <span className="text-gray-600">email_inbox</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="text-gray-600">invoice.pdf</span>
                        </div>
                      </div>
                    </div>

                    {/* Processing Section */}
                    <div className="relative">
                      {/* Connector */}
                      <div className="absolute left-1/2 -top-2 w-px h-2 bg-gray-200" />

                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-[2px]">
                        <div className="bg-white rounded-[10px] p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
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
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                  />
                                </svg>
                              </div>
                              <span className="font-semibold text-gray-900">
                                AI Processing
                              </span>
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                              3.2s
                            </span>
                          </div>

                          <div className="space-y-2 font-mono text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                              <svg
                                className="w-4 h-4 text-emerald-500"
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
                              <span>Document geanalyseerd</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <svg
                                className="w-4 h-4 text-emerald-500"
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
                              <span>€2.450,00 geëxtraheerd</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <svg
                                className="w-4 h-4 text-emerald-500"
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
                              <span>Matched met PO #2024-0891</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Connector */}
                      <div className="absolute left-1/2 -bottom-2 w-px h-2 bg-gray-200" />
                    </div>

                    {/* Output Section */}
                    <div className="bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-emerald-600/70 uppercase tracking-wider mb-1">
                          Output
                        </div>
                        <div className="text-emerald-900 font-semibold">
                          Factuur verwerkt & ingeboekt
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Geen menselijke actie nodig
                      </span>
                      <span className="text-gray-500 font-medium">
                        24/7 actief
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-lg text-xs font-semibold text-gray-600">
                  100% automatisch
                </div>

                <div className="absolute -bottom-3 -left-3 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg text-xs font-semibold text-white">
                  Claude 4.5 Powered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= PROCESS (Light Mode) ================= */}
      {/* Hoe Wij Werken Section - Premium Redesign */}
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
                Ons Proces
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Hoe wij{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                werken
              </span>
            </h2>

            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Geen black box. Transparant, eerlijk, en zonder verrassingen.
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
                      Stap 1
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Koffie & Kritische Vragen
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-4">
                    Het begint met een gesprek. Waar verlies je tijd? Wat zijn
                    de vervelende klusjes? We stellen de juiste vragen.
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
                    100% Gratis
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
                {/* Mobile only */}
                <div className="md:hidden mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      Stap 1
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Koffie & Kritische Vragen
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-3">
                    Het begint met een gesprek. Waar verlies je tijd? Wat zijn
                    de vervelende klusjes?
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
                    100% Gratis
                  </span>
                </div>

                {/* Desktop visual */}
                <div className="hidden md:block bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <span className="text-lg">☕</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Gratis Kennismaking
                      </div>
                      <div className="text-xs text-gray-400">
                        30 minuten • Online of op locatie
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      Welke taken kosten je de meeste tijd?
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      Welke software gebruik je al?
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      Wat zou je het liefst automatiseren?
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 mb-12 md:mb-20">
              {/* Left content (desktop) - Card */}
              <div className="hidden md:flex w-1/2 justify-end pr-12">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-200/50 max-w-sm">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Voorstel Voorbeeld
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Wat we bouwen</span>
                      <span className="font-medium text-gray-900">
                        Email Agent
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Tijdsbesparing</span>
                      <span className="font-medium text-emerald-600">
                        ~15 uur/week
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Doorlooptijd</span>
                      <span className="font-medium text-gray-900">2 weken</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Investering</span>
                      <span className="font-bold text-gray-900">€2.500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center node */}
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

              {/* Right content */}
              <div className="w-full md:w-1/2 pl-20 md:pl-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full mb-4">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Stap 2
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Concreet Voorstel
                </h3>
                <p className="text-gray-500 leading-relaxed mb-4">
                  <strong className="text-gray-700">Dit</strong> automatiseren
                  we, <strong className="text-gray-700">dit</strong> levert het
                  op, <strong className="text-gray-700">dit</strong> kost het.
                  Geen kleine lettertjes.
                </p>
                <p className="text-gray-400 text-sm">
                  Vind je het niks? Dan schudden we handen en gaan we verder.
                  Geen harde feelings.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 mb-12 md:mb-20">
              {/* Left content (desktop) */}
              <div className="hidden md:flex w-1/2 justify-end pr-12">
                <div className="max-w-md text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-4">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      Stap 3
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Bouwen & Testen
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    Je betaalt 50% vooraf, wij gaan bouwen. We houden je op de
                    hoogte en testen samen tot het perfect werkt.
                  </p>
                </div>
              </div>

              {/* Center node */}
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

              {/* Right content */}
              <div className="w-full md:w-1/2 pl-20 md:pl-12">
                {/* Mobile only */}
                <div className="md:hidden mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      Stap 3
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Bouwen & Testen
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    50% vooraf, wij bouwen. We testen samen tot het perfect
                    werkt.
                  </p>
                </div>

                {/* Desktop visual */}
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
                      Mark & Faissal aan het werk
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
                      Gemiddelde doorlooptijd: 2 weken
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 - Final */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0">
              {/* Left content (desktop) - Card */}
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
                      <div className="font-semibold">Onze Garantie</div>
                      <div className="text-sm text-gray-400">
                        Geen risico voor jou
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Werkt het niet zoals afgesproken? Dan krijg je je geld
                    terug. Zo simpel is het.
                  </p>
                </div>
              </div>

              {/* Center node - Final (different style) */}
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

              {/* Right content */}
              <div className="w-full md:w-1/2 pl-20 md:pl-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                    Stap 4
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Live & Garantie
                </h3>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Je Digitale Werknemer gaat live en draait 24/7. Bij oplevering
                  betaal je de rest — alleen als alles werkt.
                </p>

                {/* Mobile guarantee */}
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
                      Niet goed? Geld terug.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 bg-white rounded-full border border-gray-200 shadow-lg">
              <span className="text-gray-600 px-4">Klaar om te beginnen?</span>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all"
              >
                Plan gratis gesprek
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
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ================= TECH STACK (Light Mode) ================= */}
      <section className="py-16 border-b border-gray-200 bg-white">
        <p className="text-center text-gray-500 text-xs font-mono uppercase tracking-[0.3em] mb-10">
          Gebouwd op Enterprise Standaarden
        </p>
        <div className="w-full justify-center items-center flex md:gap-24 gap-12 flex-wrap px-6 grayscale transition-all duration-500 opacity-70 hover:opacity-100 hover:grayscale-0">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Solana</span>
            <span className="text-[10px] text-gray-500 font-mono">
              Settlement
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Claude 4.5</span>
            <span className="text-[10px] text-gray-500 font-mono">
              Intelligence
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Stripe</span>
            <span className="text-[10px] text-gray-500 font-mono">
              Fiat Rails
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-gray-900">MCP</span>
            <span className="text-[10px] text-gray-500 font-mono">
              Connectivity
            </span>
          </div>
        </div>
      </section>

      {/* ================= CASES (Light Mode) ================= */}
      {/* Portfolio / Cases Section - Premium Redesign */}
      <section
        id="cases"
        className="relative py-24 md:py-32 bg-gray-50 overflow-hidden"
      >
        {/* Subtle background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              <span className="text-sm font-medium text-gray-600">
                Portfolio
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Digitale Werknemers{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                in actie
              </span>
            </h2>

            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Geen concepten, maar agents die vandaag al draaien in productie.
            </p>
          </header>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.slice(0, 3).map((project: any, index: number) => (
              <Link
                key={project.slug || index}
                href={`/portfolio/${project.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      Live
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-6">
                  {/* Tags */}
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded-md">
                      Automatisering
                    </span>
                    <span className="text-xs font-medium text-blue-600 px-2 py-1 bg-blue-50 rounded-md">
                      AI Agent
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-grow">
                    {project.description}
                  </p>

                  {/* Link indicator */}
                  <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                      Bekijk case
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
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
              href="/portfolio"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
            >
              Bekijk alle cases
              <svg
                className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform"
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

      {/* ================= TEAM (Light Mode) ================= */}
      {/* About / Team Section - Premium Redesign */}
      <section
        id="about"
        className="relative py-24 md:py-32 bg-white overflow-hidden"
      >
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              <span className="text-sm font-medium text-gray-600">
                Het Team
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Engineering &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Strategie
              </span>
            </h2>

            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Technische diepgang meets bedrijfskundig inzicht. Wij bouwen
              oplossingen die werken én renderen.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Mark */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
              {/* Gradient accent top */}
              <div className="h-1 bg-gradient-to-r from-blue-300 to-blue-600" />

              <div className="p-8">
                <div className="flex items-start gap-5 mb-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                      <Image
                        src="/mark.png"
                        alt="Mark"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Status dot */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-gray-900">Mark</h3>
                    <p className="text-sm text-gray-500">Head of Engineering</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  Techniek moet niet ingewikkeld zijn. Met jarenlange ervaring
                  als software engineer bouwt Mark slimme systemen die voor
                  iedereen bruikbaar zijn. De stille kracht achter elke
                  oplossing die we opleveren.
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100">
                    System Architecture
                  </span>
                  <span className="text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100">
                    AI Integration
                  </span>
                  <span className="text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100">
                    Blockchain
                  </span>
                </div>

                {/* Link */}
                <a
                  href="https://www.linkedin.com/in/mark-v-898408309/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors group/link"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                  <svg
                    className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform"
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
                </a>
              </div>
            </div>

            {/* Faissal */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
              {/* Gradient accent top */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-800" />

              <div className="p-8">
                <div className="flex items-start gap-5 mb-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                      <Image
                        src="/faissal.png"
                        alt="Faissal"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Status dot */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-gray-900">Faissal</h3>
                    <p className="text-sm text-gray-500">
                      Business Logic Architect
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  Vertaalt complexe operationele vraagstukken naar logische
                  workflows die door AI kunnen worden uitgevoerd. Focus op ROI
                  en procesoptimalisatie voor elk project.
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100">
                    Workflow Design
                  </span>
                  <span className="text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100">
                    Business Analysis
                  </span>
                  <span className="text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100">
                    ROI Optimization
                  </span>
                </div>

                {/* Link */}
                <a
                  href="mailto:faissal@aifais.com"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors group/link"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Email</span>
                  <svg
                    className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform"
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
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Stats / Trust */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-500">Founders</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gray-200" />
              <div>
                <div className="text-3xl font-bold text-gray-900">Gouda</div>
                <div className="text-sm text-gray-500">Zuid-Holland, NL</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gray-200" />
              <div>
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-500">Bootstrapped</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gray-200" />
              <div>
                <div className="text-3xl font-bold text-gray-900">24h</div>
                <div className="text-sm text-gray-500">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DEMO SECTION ================= */}
      <div id="demo" className="scroll-mt-24">
        <ToolsTeaser />
      </div>

      {/* FAQ */}
      <FAQSection />
    </main>
  );
}
