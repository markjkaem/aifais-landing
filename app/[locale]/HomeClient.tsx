"use client";
// ========================================
// FILE: app/HomeClient.tsx - MKB "JIP EN JANNEKE" EDITIE
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
  weight: "500",
  subsets: ["vietnamese"],
});

// Icons
const LinkedInIcon = () => (
  <svg
    className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export default function HomeClient() {
  return (
    <main className="bg-black text-white min-h-screen transition-colors duration-500">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            src="/coding.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-[0.3] contrast-125 saturate-0 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-purple-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4">
          <div className="max-w-4xl">
            {/* Tech Badge - Simpeler */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-full mb-8 backdrop-blur-md cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs md:text-sm text-gray-300 font-mono tracking-wide">
                NIEUW: INTELLIGENTE AUTOMATISERING
              </span>
            </div>

            {/* Main Headline - MKB Vriendelijk */}
            <h1
              className={`${h1.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6`}
            >
              <span className="text-white block">Neem je eerste</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-300 animate-gradient block">
                Digitale Werknemer
              </span>
              <span className="text-white block">aan.</span>
            </h1>

            {/* Subheadline - Probleem & Oplossing */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed mb-10 max-w-2xl">
              Stop met het verspillen van tijd aan saai klikwerk. Wij bouwen
              slimme software die{" "}
              <strong className="text-white">zelfstandig taken uitvoert</strong>
              . Van facturen inboeken tot mails beantwoorden.
              <span className="block mt-2 text-white font-medium">
                Nooit ziek. Werkt 24/7. Geen loonbelasting.
              </span>
            </p>

            {/* Stats / Tech Specs - Vertaald naar Business Value */}
            <div className="flex flex-wrap gap-8 md:gap-12 mb-10 pb-10 border-b border-white/10 font-mono">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  24/7
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  Beschikbaar
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  €0,00
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  Vaste lasten
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  100%
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  Foutloos
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/quickscan"
                className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Bereken je Winst</span>
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
                href="#demo"
                className="px-8 py-4 border border-white/20 rounded-full text-white font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
              >
                Hoe werkt het?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= UITLEG SECTIE (Jip en Janneke) ================= */}
      <section className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div>
              <h2
                className={`${h1.className} text-3xl md:text-5xl font-bold mb-6`}
              >
                Software die <span className="text-purple-300">doet</span>,
                <br />
                niet software die{" "}
                <span className="text-gray-300 line-through decoration-gray-100">
                  wacht
                </span>
                .
              </h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                De meeste software (zoals je boekhoudpakket of CRM) is dom. Het
                zit te wachten tot <strong>jij</strong> op de knoppen drukt.
              </p>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Wij bouwen <strong>Agenten</strong>. Zie dit als digitale robots
                die jouw software besturen. Ze lezen je mail, openen bijlagen,
                begrijpen de inhoud en zetten het in je systeem. Zonder dat jij
                iets hoeft te doen.
              </p>

              <ul className="space-y-4 font-medium">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
                    ✓
                  </div>
                  <span className="text-gray-200">
                    Koppelbaar met alles (Mail, Excel, Exact, Stripe)
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
                    ✓
                  </div>
                  <span className="text-gray-200">
                    Betaal per uitgevoerde taak (Micro-betalingen)
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
                    ✓
                  </div>
                  <span className="text-gray-200">
                    Slimmer dan standaard automatisering (AI)
                  </span>
                </li>
              </ul>
            </div>

            {/* Visual: Vergelijking Oud vs Nieuw */}
            <div className="relative w-full bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-zinc-800 p-8 flex flex-col justify-center items-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

              <div className="z-10 grid gap-6 w-full">
                {/* OUDE MANIER */}
                <div className="p-4 rounded-xl border border-red-900/30 bg-red-900/10 opacity-50">
                  <span className="text-xs text-red-400 font-bold uppercase mb-2 block">
                    De Oude Manier
                  </span>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <span>📩 Mail</span> → <span>👀 Jij leest</span> →{" "}
                    <span>⌨️ Jij typt</span> → <span>💾 Systeem</span>
                  </div>
                </div>

                {/* PIJL */}
                <div className="flex justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>

                {/* AIFAIS MANIER */}
                <div className="p-6 rounded-xl border border-green-500/50 bg-green-900/10 shadow-lg shadow-green-900/20">
                  <span className="text-xs text-green-400 font-bold uppercase mb-2 block">
                    De AIFAIS Manier
                  </span>
                  <div className="flex items-center justify-between text-white font-medium">
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-2xl">📩</span>
                      <span className="text-xs text-gray-500">Mail</span>
                    </span>

                    {/* Animated Processing Line */}
                    <div className="flex-1 mx-4 h-1 bg-gray-800 rounded overflow-hidden relative">
                      <div className="absolute inset-0 bg-green-500 w-1/2 animate-[shimmer_2s_infinite]"></div>
                    </div>

                    <span className="flex flex-col items-center gap-1">
                      <div className="bg-white text-black text-xs font-bold px-2 py-1 rounded">
                        AI Agent
                      </div>
                    </span>

                    <div className="flex-1 mx-4 h-1 bg-gray-800 rounded overflow-hidden relative">
                      <div className="absolute inset-0 bg-green-500 w-1/2 animate-[shimmer_2s_infinite_0.5s]"></div>
                    </div>

                    <span className="flex flex-col items-center gap-1">
                      <span className="text-2xl">💾</span>
                      <span className="text-xs text-gray-500">Klaar</span>
                    </span>
                  </div>
                  <div className="mt-4 text-center text-xs text-green-400 bg-green-900/20 py-1 rounded">
                    Jij doet helemaal niks.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DEMO SECTION ================= */}
      <div id="demo" className="scroll-mt-24">
        {/* Your ToolsTeaser likely contains the functional invoice scanner */}
        <ToolsTeaser />
      </div>

      {/* ================= CASES / VOORBEELDEN ================= */}
      <section id="cases" className="relative py-24 bg-zinc-950">
        <div className="relative container mx-auto px-6 max-w-7xl">
          <header className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-purple-300 text-xs font-bold tracking-widest uppercase">
                Praktijkvoorbeelden
              </span>
            </div>
            <h2
              className={`${h1.className} text-4xl md:text-5xl font-bold mb-4 text-white`}
            >
              Wat kan een Digitale Werknemer?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Hier zijn een paar voorbeelden van taken die wij nu al volledig
              geautomatiseerd hebben voor andere bedrijven.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {projects.slice(0, 3).map((project: any) => (
              <article
                key={project.slug}
                className="group relative bg-black border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-600 transition-all duration-500"
              >
                <div className="aspect-video relative overflow-hidden bg-zinc-900">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  {/* Tag die MKB begrijpt */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-full">
                    Bespaart 12u/week
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-2 text-white font-medium hover:gap-4 transition-all duration-300"
                  >
                    <span>Bekijk deze case</span>
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

      {/* ================= TEAM (Vertrouwen) ================= */}
      <section
        id="about"
        className="relative py-24 bg-black border-t border-white/5"
      >
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className={`${h1.className} text-4xl md:text-5xl font-bold mb-6 text-white`}
            >
              Wie bouwt dit?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Wij zijn Mark en Faissal. Geen consultants die uurtje-factuurtje
              schrijven, maar bouwers die oplossingen leveren.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Mark */}
            <div className="group bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 hover:bg-zinc-900 transition-all duration-300">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-purple-500 transition-colors">
                  <Image
                    src="/mark.png"
                    alt="Mark"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Mark</h3>
                  <p className="text-purple-400 font-mono text-sm">
                    Technische Realisatie
                  </p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Ik zorg dat de techniek werkt. Dat de koppelingen veilig zijn,
                dat de AI doet wat hij moet doen, en dat de betalingen kloppen.
                Geen blabla, gewoon werkende code.
              </p>
              <Link
                href="https://www.linkedin.com/in/mark-v-898408309/"
                target="_blank"
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <LinkedInIcon /> Connect op LinkedIn
              </Link>
            </div>

            {/* Faissal */}
            <div className="group bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 hover:bg-zinc-900 transition-all duration-300">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-purple-500 transition-colors">
                  <Image
                    src="/faissal.png"
                    alt="Faissal"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Faissal</h3>
                  <p className="text-purple-400 font-mono text-sm">
                    Proces & Strategie
                  </p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Ik kijk naar jouw bedrijfsprocessen. Waar zitten de knelpunten?
                Wat kan sneller? Ik vertaal jouw probleem naar een opdracht voor
                onze digitale werknemers.
              </p>
              <a
                href="mailto:faissal@aifais.com"
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <EmailIcon /> Stuur een email
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ================= PROCESS (3 Steps) ================= */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2
              className={`${h1.className} text-3xl md:text-4xl font-bold mb-4 text-white`}
            >
              De 3 Stappen naar Autonomie
            </h2>
          </div>

          <div className="space-y-6 relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-zinc-800 md:left-1/2 md:-ml-px"></div>

            {/* Step 1 */}
            <div className="relative flex md:justify-end items-center md:flex-row flex-row-reverse gap-8">
              <div className="hidden md:block w-1/2"></div>
              <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 bg-black border-4 border-purple-500 rounded-full z-10"></div>
              <div className="w-full md:w-1/2 pl-16 md:pl-12">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <div className="text-purple-400 text-xs font-bold uppercase mb-2">
                    Stap 01
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Proces Mapping
                  </h3>
                  <p className="text-gray-400 text-sm">
                    We analyseren niet alleen wat je doet, maar waarom. We
                    breken processen af tot logica voor de AI.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex md:justify-start items-center gap-8">
              <div className="w-full md:w-1/2 pl-16 md:pr-12 md:pl-0 md:text-right">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <div className="text-blue-400 text-xs font-bold uppercase mb-2">
                    Stap 02
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Agent Configuratie (MCP)
                  </h3>
                  <p className="text-gray-400 text-sm">
                    We bouwen de tools en koppelingen. Jouw AI krijgt "handjes"
                    om bestanden te lezen en betalingen te doen.
                  </p>
                </div>
              </div>
              <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 bg-black border-4 border-blue-500 rounded-full z-10"></div>
              <div className="hidden md:block w-1/2"></div>
            </div>

            {/* Step 3 */}
            <div className="relative flex md:justify-end items-center md:flex-row flex-row-reverse gap-8">
              <div className="hidden md:block w-1/2"></div>
              <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 bg-black border-4 border-green-500 rounded-full z-10"></div>
              <div className="w-full md:w-1/2 pl-16 md:pl-12">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <div className="text-green-400 text-xs font-bold uppercase mb-2">
                    Stap 03
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Autonome Uitvoering
                  </h3>
                  <p className="text-gray-400 text-sm">
                    We zetten de agent live. Hij werkt 24/7, schaalt oneindig en
                    kost alleen geld als hij resultaat levert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= FINAL CTA ================= */}
      <section className="relative py-24 bg-gradient-to-b from-black to-zinc-900 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h2
            className={`${h1.className} text-4xl md:text-6xl font-bold text-white mb-8`}
          >
            Start vandaag met besparen.
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Geen lang sales-traject. Geen verplichtingen. Plan een kort gesprek
            en we vertellen je direct of (en hoeveel) je kunt automatiseren.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/quickscan"
              className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)]"
            >
              Gratis Quickscan
            </Link>
            <Link
              href="/contact"
              className="px-10 py-5 border border-zinc-700 text-white font-medium rounded-full hover:bg-zinc-800 transition-all"
            >
              Neem Contact Op
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />
    </main>
  );
}
