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
    <main className="bg-[#fbfff1] text-gray-900 min-h-screen transition-colors duration-500  ">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full bg-[#3066be]/60">
            <div className="absolute left-2 top-2 mb-12 md:mb-20">
              <Link
                href="/"
                className="inline-block hover:scale-105 transition-transform"
              >
                <Image
                  src="/logo_official.png"
                  alt="Aifais Logo"
                  width={200}
                  height={80}
                  className="w-42 h-auto object-contain"
                  priority
                />
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#3066be]/40 via-[#3066be]/40 to-[#3066be]/40" />
          {/* Fade naar de lichte achtergrondkleur aan de onderkant */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fbfff1] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 top-4 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4">
          <div className="max-w-4xl">
            {/* Tech Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-md cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3066be] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0cff10]"></span>
              </span>
              <span className="text-xs md:text-sm text-black font-mono tracking-wide uppercase">
                AI-Driven Workforce
              </span>
            </div>
            {/* Main Headline */}
            <h1
              className={`${h1.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6`}
            >
              <span className="text-black block">Neem je eerste</span>
              {/* Gebruik hier een lichte blauw/wit gradient zodat het popt op de donkere video */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-black to-black animate-gradient block">
                Digitale Werknemer
              </span>
              <span className="text-black block">aan.</span>
            </h1>
            {/* Subheadline */}'
            <span className="block text-lg md:text-2xl mt-2 text-black font-bold">
              Meer tijd. Meer winst. Minder gedoe.
            </span>
            <p className="text-lg md:text-xl lg:text-2xl text-black leading-relaxed mb-10 max-w-2xl">
              Wij automatiseren de taken die je tijd kosten, zodat jij je kunt
              focussen op wat écht belangrijk is: je bedrijf laten groeien.
              Gratis analyse.
              <span className="block mt-2 text-black font-bold">
                Gratis plan. Niet goed, geld terug.
              </span>
            </p>
            {/* CTAs */}
            <div className="flex flex-col mb-2 sm:flex-row gap-4">
              <Link
                href="/contact"
                className="group relative px-8 py-4 bg-[#3066be] text-white font-bold text-lg rounded-full hover:bg-[#234a8c] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#3066be]/30"
              >
                <span>Plan nu de gratis analyse</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
              <Link
                href="/diensten"
                className="px-8 py-4 border border-black/30 rounded-full text-black font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
              >
                Bekijk Diensten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPLAINER (Light Theme) ================= */}
      <section className="py-24 bg-[#fbfff1] border-y border-gray-200">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div>
              <h2
                className={`${h1.className} text-3xl md:text-5xl font-bold mb-6 text-gray-900`}
              >
                Software die <span className="text-[#3066be]">werkt</span>,
                <br />
                niet software die{" "}
                <span className="text-gray-600 line-through decoration-black">
                  wacht
                </span>
                .
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Traditionele software is passief: het wacht tot jij op de
                knoppen drukt. Een <strong>Digitale Werknemer</strong> is
                proactief.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Wij bouwen intelligente agenten die zelfstandig taken oppakken.
                Ze lezen je mail, begrijpen context, en voeren acties uit in je
                systemen. Zonder dat jij erbij hoeft te zijn.
              </p>

              <ul className="space-y-4 font-medium text-gray-700">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3066be]/10 flex items-center justify-center text-[#3066be] border border-[#3066be]/20">
                    ⚡
                  </div>
                  <span>
                    <strong>Autonome Uitvoering:</strong> Geen kliks nodig, de
                    agent doet het werk.
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3066be]/10 flex items-center justify-center text-[#3066be] border border-[#3066be]/20">
                    🧠
                  </div>
                  <span>
                    <strong>AI Intelligentie:</strong> Begrijpt
                    ongestructureerde data (PDF's, e-mails).
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3066be]/10 flex items-center justify-center text-[#3066be] border border-[#3066be]/20">
                    💸
                  </div>
                  <span>
                    <strong>Pay-per-Task:</strong> Betaal alleen voor succesvol
                    afgerond werk (X402).
                  </span>
                </li>
              </ul>
            </div>

            {/* Visual: Workflow Architectuur (Light Mode Card) */}
            <div className="relative w-full bg-white rounded-3xl border border-gray-200 p-8 flex flex-col justify-center items-center overflow-hidden shadow-2xl shadow-gray-200/50">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

              <div className="z-10 w-full space-y-4">
                {/* INPUT LAYER */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50 shadow-sm">
                  <span className="text-sm font-mono text-gray-500">INPUT</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                      Nieuwe E-mail
                    </span>
                    <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                      Factuur PDF
                    </span>
                  </div>
                </div>

                {/* PROCESSING LAYER (Animated Blue) */}
                <div className="relative p-6 rounded-xl border border-[#3066be]/20 bg-[#3066be]/5 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3066be] to-transparent animate-[shimmer_2s_infinite]"></div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#3066be] font-bold text-sm">
                      DIGITALE WERKNEMER
                    </span>
                    <span className="text-xs text-[#3066be]/70 font-mono">
                      STATUS: BEZIG
                    </span>
                  </div>
                  <div className="space-y-2 font-mono text-xs text-gray-600">
                    <p>{`> Document lezen & begrijpen...`}</p>
                    <p>{`> Gegevens controleren...`}</p>
                    <p>{`> Invoeren in boekhouding...`}</p>
                  </div>
                </div>

                {/* OUTPUT LAYER */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-green-500/20 bg-green-50">
                  <span className="text-sm font-mono text-green-700">
                    RESULTAAT
                  </span>
                  <span className="text-xs text-green-700 flex items-center gap-1">
                    Taak Voltooid{" "}
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= PROCESS (Light Mode) ================= */}
      <section className="relative py-24 bg-[#fbfff1] overflow-hidden border-t border-gray-200">
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
              <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 bg-[#fbfff1] border-4 border-[#3066be] rounded-full z-10"></div>
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
              <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 bg-[#fbfff1] border-4 border-[#3066be] rounded-full z-10"></div>
              <div className="hidden md:block w-1/2"></div>
            </div>

            {/* Stap 3: Bouwen & Garantie */}
            <div className="relative flex md:justify-end items-center md:flex-row flex-row-reverse gap-8">
              <div className="hidden md:block w-1/2"></div>
              <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 bg-[#fbfff1] border-4 border-[#3066be] rounded-full z-10"></div>
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
      <section className="py-16 border-b border-gray-200 bg-[#fbfff1]">
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
                className="group relative bg-[#fbfff1] border border-gray-200 rounded-3xl overflow-hidden hover:border-[#3066be]/50 hover:shadow-xl hover:shadow-[#3066be]/10 transition-all duration-500"
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
        className="relative py-24 bg-[#fbfff1] border-t border-gray-200"
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
