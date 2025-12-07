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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-4 flex flex-col h-full justify-center">
          {/* Top Bar: Badge Left, Logo Right */}
          <div className="flex w-full items-center justify-between mb-16 md:mb-24">
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
                href="/diensten"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
              >
                Bekijk Diensten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPLAINER (Light Theme) ================= */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decoratieve achtergrond details */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute -left-20 top-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -right-20 bottom-40 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <h2
                className={`${h1.className} text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 tracking-tight leading-[1.1]`}
              >
                Software die{" "}
                <span className="text-[#3066be] relative inline-block">
                  werkt
                  {/* Onderstreping effect */}
                  <svg
                    className="absolute w-full h-3 -bottom-1 left-0 text-[#3066be]/20"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                </span>
                ,
                <br />
                niet software die{" "}
                <span className="text-slate-400 line-through decoration-slate-400/50 decoration-4 decoration-wavy">
                  wacht
                </span>
                .
              </h2>

              <div className="prose prose-lg text-slate-600 mb-10">
                <p className="leading-relaxed">
                  Traditionele software is passief: het wacht tot jij op de
                  knoppen drukt. Een{" "}
                  <strong className="text-slate-900">Digitale Werknemer</strong>{" "}
                  is proactief.
                </p>
                <p className="leading-relaxed">
                  Wij bouwen intelligente agenten die zelfstandig taken
                  oppakken. Ze lezen je mail, begrijpen context, en voeren
                  acties uit in je systemen. Zonder dat jij erbij hoeft te zijn.
                </p>
              </div>

              <ul className="space-y-8 mt-8">
                {[
                  {
                    title: "Autonome Uitvoering",
                    desc: "Geen kliks nodig. Onze agents nemen het volledige proces over, van start tot finish.",
                    icon: (
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Contextuele AI",
                    desc: "Begrijpt niet alleen data, maar ook de nuance. Leest e-mails en PDF's zoals een mens dat doet.",
                    icon: (
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "No Cure, No Pay",
                    desc: "Wij geloven in resultaat. Je betaalt alleen voor succesvol afgeronde taken.",
                    icon: (
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                        />
                      </svg>
                    ),
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 md:gap-5 group">
                    {/* Icon Container */}
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-50 text-[#3066be] border border-blue-100 flex items-center justify-center transition-all duration-300 group-hover:bg-[#3066be] group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30">
                      {item.icon}
                    </div>

                    {/* Text */}
                    <div className="pt-1">
                      <h3 className="text-slate-900 font-bold text-lg mb-1 group-hover:text-[#3066be] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual: Workflow Architectuur */}
            <div className="order-1 lg:order-2 relative w-full">
              {/* Card Container */}
              <div className="relative bg-white rounded-[2rem] border border-slate-200 p-8 md:p-10 shadow-2xl shadow-slate-200/60 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                {/* Grid Background inside Card */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "radial-gradient(#3066be 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                ></div>

                <div className="relative z-10 flex flex-col items-center w-full space-y-2">
                  {/* INPUT LAYER */}
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm relative group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Input Bronnen
                      </span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400/20"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400/20"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400/20"></div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>{" "}
                        Nieuwe E-mail
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span>{" "}
                        Factuur PDF
                      </div>
                    </div>
                  </div>

                  {/* Connecting Line 1 */}
                  <div className="h-8 border-l-2 border-dashed border-slate-300"></div>

                  {/* PROCESSING LAYER (The Brain) */}
                  <div className="w-full relative p-1 rounded-xl bg-gradient-to-r from-[#3066be] via-blue-400 to-[#3066be] shadow-lg shadow-blue-500/20">
                    <div className="bg-white rounded-[10px] p-6 relative overflow-hidden">
                      {/* Scanning Animation Line */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[shimmer_2s_infinite] opacity-50"></div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3066be]"></span>
                          </span>
                          <span className="text-[#3066be] font-bold text-sm tracking-wide">
                            AI PROCESSING
                          </span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono">
                          Running...
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Simulated Code/Log lines */}
                        <div className="h-2 w-3/4 bg-slate-100 rounded animate-pulse"></div>
                        <div className="h-2 w-1/2 bg-slate-100 rounded animate-pulse delay-75"></div>
                        <div className="h-2 w-2/3 bg-slate-100 rounded animate-pulse delay-150"></div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-1">
                        <p className="text-xs text-slate-500 font-mono flex items-center gap-2">
                          <span className="text-green-500">✔</span> Context
                          begrepen
                        </p>
                        <p className="text-xs text-slate-500 font-mono flex items-center gap-2">
                          <span className="text-green-500">✔</span> Data
                          geëxtraheerd
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Line 2 */}
                  <div className="h-8 border-l-2 border-dashed border-slate-300"></div>

                  {/* OUTPUT LAYER */}
                  <div className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold tracking-wider text-emerald-600/70 uppercase mb-1">
                        Resultaat
                      </span>
                      <span className="text-emerald-900 font-medium text-sm">
                        Factuur ingeboekt & betaald
                      </span>
                    </div>
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-emerald-100 shadow-sm text-emerald-600">
                      <svg
                        className="w-6 h-6"
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating element behind for depth */}
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-slate-100 rounded-[2rem] -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= PROCESS (Light Mode) ================= */}
      <section className="relative py-24 bg-white overflow-hidden border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2
              className={`${h1.className} text-3xl md:text-4xl font-bold mb-4 text-gray-900`}
            >
              Hoe we werken
            </h2>
            <p className="text-gray-600">
              Transparant, eerlijk en zonder verrassingen.
            </p>
          </div>

          <div className="space-y-6 relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 md:left-1/2 md:-ml-px"></div>

            {/* Stap 1: Kennismaking */}
            <div className="relative flex md:justify-end items-center md:flex-row flex-row-reverse gap-8">
              <div className="hidden md:block w-1/2"></div>
              <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 bg-white border-4 border-[#3066be] rounded-full z-10"></div>
              <div className="w-full md:w-1/2 pl-16 md:pl-12">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#3066be] text-xs font-bold uppercase mb-2">
                    Stap 01
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Koffie & Kritische Vragen
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Het begint altijd met een gesprek. We drinken een koffie en
                    stellen veel vragen: Waar verlies je tijd? Wat zijn de
                    vervelende klusjes? We willen je bedrijf écht snappen. Deze
                    kennismaking is volledig op onze kosten.
                  </p>
                </div>
              </div>
            </div>

            {/* Stap 2: Plan */}
            <div className="relative flex md:justify-start items-center gap-8">
              <div className="w-full md:w-1/2 pl-16 md:pr-12 md:pl-0 md:text-right">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#3066be] text-xs font-bold uppercase mb-2">
                    Stap 02
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Concreet Voorstel
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Daarna maken we een plan. Concreet: <em>dit</em>{" "}
                    automatiseren we, <em>dit</em> levert het op en <em>dit</em>{" "}
                    kost het. Geen verplichtingen, geen kleine lettertjes. Vind
                    je het niks? Dan schudden we handen en gaan we allebei
                    verder.
                  </p>
                </div>
              </div>
              <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 bg-white border-4 border-[#3066be] rounded-full z-10"></div>
              <div className="hidden md:block w-1/2"></div>
            </div>

            {/* Stap 3: Bouwen & Garantie */}
            <div className="relative flex md:justify-end items-center md:flex-row flex-row-reverse gap-8">
              <div className="hidden md:block w-1/2"></div>
              <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 bg-white border-4 border-[#3066be] rounded-full z-10"></div>
              <div className="w-full md:w-1/2 pl-16 md:pl-12">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#3066be] text-xs font-bold uppercase mb-2">
                    Stap 03
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Bouwen & Garantie
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Zeg je ja? Dan gaan we aan de slag. Je betaalt de helft
                    vooraf, wij bouwen. Bij oplevering, als alles werkt, volgt
                    de rest. Werkt het niet zoals beloofd?
                    <span className="text-[#3066be] font-semibold">
                      {" "}
                      Dan krijg je je geld terug.
                    </span>
                  </p>
                </div>
              </div>
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
      <section id="cases" className="relative py-24 bg-white">
        <div className="relative container mx-auto px-6 max-w-7xl">
          <header className="text-center mb-16">
            <h2
              className={`${h1.className} text-4xl md:text-5xl font-bold mb-4 text-gray-900`}
            >
              Collega's aan het werk
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Onze <strong>Headless Agents</strong> draaien nu al productie bij
              diverse bedrijven.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {projects.slice(0, 3).map((project: any) => (
              <article
                key={project.slug}
                className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-[#3066be]/50 hover:shadow-xl hover:shadow-[#3066be]/10 transition-all duration-500"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md border border-white/50 text-[#3066be] text-xs font-bold rounded-full shadow-sm">
                    Live Systeem
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#3066be] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-2 text-[#3066be] font-bold hover:gap-4 transition-all duration-300"
                  >
                    <span>Bekijk Case Study</span>
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TEAM (Light Mode) ================= */}
      <section
        id="about"
        className="relative py-24 bg-white border-t border-gray-200"
      >
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className={`${h1.className} text-4xl md:text-5xl font-bold mb-6 text-gray-900`}
            >
              Engineering & Strategie
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Wij combineren diepe technische kennis (Blockchain, AI) met
              bedrijfskundig inzicht. Wij bouwen oplossingen die technisch
              robuust zijn én commercieel renderen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Mark */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-[#3066be]/30 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#3066be] transition-colors shadow-inner">
                  <Image
                    src="/mark.png"
                    alt="Mark"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Mark</h3>
                  <p className="text-[#3066be] font-mono text-sm">
                    Head of Engineering
                  </p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Techniek moet niet ingewikkeld zijn. Dat is waar Mark in
                gelooft. Met jarenlange ervaring als software engineer weet hij
                hoe je slimme systemen bouwt die voor iedereen bruikbaar zijn.
                Hij is de stille kracht achter elke workflow die wij opleveren.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                  System Architecture
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                  Security
                </span>
              </div>
              <Link
                href="https://www.linkedin.com/in/mark-v-898408309/"
                target="_blank"
                className="text-gray-500 hover:text-[#3066be] transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <LinkedInIcon /> LinkedIn Profiel
              </Link>
            </div>

            {/* Faissal */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-[#3066be]/30 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#3066be] transition-colors shadow-inner">
                  <Image
                    src="/faissal.png"
                    alt="Faissal"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Faissal</h3>
                  <p className="text-[#3066be] font-mono text-sm">
                    Business Logic Architect
                  </p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Ik vertaal complexe operationele vraagstukken naar logische
                workflows die door AI kunnen worden uitgevoerd. Focus op ROI en
                procesoptimalisatie.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                  Workflow Design
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                  Business Analysis
                </span>
              </div>
              <a
                href="mailto:faissal@aifais.com"
                className="text-gray-500 hover:text-[#3066be] transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <EmailIcon /> Email Contact
              </a>
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
