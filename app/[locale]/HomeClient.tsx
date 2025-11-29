// ========================================
// FILE: app/HomeClient.tsx - VOLLEDIG AANGEPAST
// ========================================

"use client";

import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useRef,
  useState,
} from "react";
import { projects } from "./portfolio/data";
import FAQSection from "../Components/FAQSection";

interface CasesProps {
  projects: Array<{
    slug: string;
    image: string;
    title: string;
    description: string;
    tag?: string;
    savings?: string;
  }>;
}

const h1 = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

export default function HomeClient() {
  const bgClass = "bg-black";
  const textClass = "text-white";
  const accentColor = "text-purple-500";

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.muted = true;
    }

    setIsMuted(!isMuted);
  };

  return (
    <main
      className={`${bgClass} ${textClass} min-h-screen transition-colors duration-500`}
    >
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Achtergrondvideo met gradient overlay */}
        <div className="absolute inset-0 w-full h-full">
          <video
            src="/coding.mp4"
            autoPlay
            loop
            muted
            playsInline
            title="Bedrijfsautomatisering in actie"
            aria-label="Achtergrond video van automatisering code"
            className="w-full h-full object-cover brightness-[0.35] contrast-125 saturate-150 scale-105"
          >
            <p>
              Je browser ondersteunt geen video. Bekijk onze diensten hieronder.
            </p>
          </video>
          {/* Multi-layer gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-purple-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Animated background particles/grid (optional) */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
        </div>

        {/* Glass side panels - improved */}
        <div
          className="absolute inset-y-0 left-0 w-[100px] lg:w-[140px] bg-gradient-to-r from-black/80 via-black/60 to-transparent backdrop-blur-md border-r border-white/5 hidden md:block"
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 right-0 w-[100px] lg:w-[140px] bg-gradient-to-l from-black/80 via-black/60 to-transparent backdrop-blur-md border-l border-white/5 hidden md:block"
          aria-hidden="true"
        />

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4">
          <div className="max-w-4xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-sm text-purple-300 font-medium">
                🇳🇱 Specialist in Nederlandse MKB Automatisering
              </span>
            </div>

            {/* Eyebrow */}
            <p className="text-purple-400 font-semibold text-base md:text-lg mb-4 tracking-wide uppercase">
              Bedrijfsautomatisering Nederland
            </p>

            {/* Main Headline - Improved hierarchy */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="text-white block">
                Bespaar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-yellow-300 animate-gradient">
                  40+ Uur Per Week
                </span>
              </span>
              <span className="text-gray-300 block mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Met Slimme Automatisering
              </span>
            </h1>

            {/* Subheadline - More compelling */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8 max-w-3xl">
              Stop met handmatig werk. Automatiseer repetitieve processen – van
              offertes versturen tot administratie.
              <span className="text-white font-semibold">
                {" "}
                Bespaar kosten, voorkom fouten, en schaal zonder nieuwe
                medewerkers. Geen programmeerkennis nodig.
              </span>
            </p>

            {/* Social Proof Stats - NEW */}
            <div className="flex flex-wrap gap-6 md:gap-8 mb-8 pb-8 border-b border-white/10">
              <div className="flex flex-col">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  40+
                </div>
                <div className="text-sm text-gray-400">Uur bespaard/week</div>
              </div>
              <div className="flex flex-col">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  2 weken
                </div>
                <div className="text-sm text-gray-400">Tot implementatie</div>
              </div>
              <div className="flex flex-col">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  3 mnd
                </div>
                <div className="text-sm text-gray-400">Gemiddelde ROI</div>
              </div>
              <div className="flex flex-col">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  95%
                </div>
                <div className="text-sm text-gray-400">Minder fouten</div>
              </div>
            </div>

            {/* Benefits List - Improved design */}
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              <li className="flex items-start gap-3 text-gray-200">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-base md:text-lg">
                  <strong className="text-white">Binnen 2 weken</strong>{" "}
                  operationeel
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-200">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-base md:text-lg">
                  <strong className="text-white">Geen programmeren</strong>{" "}
                  nodig
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-200">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-base md:text-lg">
                  <strong className="text-white">400+ integraties</strong>{" "}
                  beschikbaar
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-200">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-base md:text-lg">
                  <strong className="text-white">100% data-eigendom</strong>{" "}
                  gegarandeerd
                </span>
              </li>
            </ul>

            {/* CTA Buttons - Improved design */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href="/quickscan"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Bereken Jouw Besparing</span>
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <Link
                href="#cases"
                className="px-8 py-4 border-2 border-gray-600 rounded-xl text-white font-semibold hover:border-purple-400 hover:bg-purple-400/10 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>Bekijk Voorbeelden</span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Gratis haalbaarheidscheck</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Reactie binnen 24 uur</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Geen verplichtingen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-2/3 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Scroll
          </span>
          <svg
            className="w-6 h-6 text-gray-400"
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
      </section>

      {/* PARTNERS / LOGO'S */}
      <section aria-label="Onze integraties en partners" className="py-12">
        <div className="w-full justify-center flex md:gap-32 gap-6 flex-wrap">
          <img
            src="/logo-1.webp"
            alt="AIFAIS partner - automatisering specialist"
            width={160}
            height={60}
            loading="lazy"
            className="md:w-40 w-14 object-contain h-auto opacity-50 invert"
          />
          <img
            src="/google.svg"
            alt="Google Workspace integratie voor automatisering"
            width={160}
            height={60}
            loading="lazy"
            className="md:w-40 object-contain w-14 h-auto opacity-50 grayscale"
          />
          <img
            src="/n8n.svg"
            alt="Automatisering platform"
            width={160}
            height={60}
            loading="lazy"
            className="object-contain md:w-40 w-14 h-auto opacity-50 grayscale invert"
          />
          <img
            src="/openai.svg"
            alt="OpenAI GPT integratie in automatisering"
            width={160}
            height={60}
            loading="lazy"
            className="md:w-40 w-14 object-contain h-auto grayscale opacity-50 invert"
          />
          <img
            src="/claude.svg"
            alt="Claude AI integratie voor slimme automatisering"
            width={160}
            height={60}
            loading="lazy"
            className="md:w-40 w-14 object-contain h-auto grayscale opacity-50 invert"
          />
        </div>
      </section>

      {/* DIENSTEN / PROJECTEN */}
      <section
        id="cases"
        aria-labelledby="cases-heading"
        className="relative py-24 bg-black overflow-hidden"
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <header className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-950/30 border border-purple-500/30 rounded-full">
              <span className="text-purple-300 text-sm font-semibold tracking-wide">
                ⚡ BEWEZEN RESULTATEN
              </span>
            </div>
            <h2
              id="cases-heading"
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-white via-purple-300 to-amber-400 bg-clip-text text-transparent">
                Automatiseringen Die Écht Werken
              </span>
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Deze automatiseringen draaien succesvol bij{" "}
              <span className="text-white font-semibold">
                50+ Nederlandse bedrijven
              </span>{" "}
              en besparen gemiddeld{" "}
              <span className="text-purple-400 font-semibold">
                40+ uur per week
              </span>
            </p>
          </header>

          {/* Cases Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {projects.slice(0, 3).map((project: any) => (
              <article
                key={project.slug}
                className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 hover:border-purple-500/50 transition-all duration-300"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/0 via-purple-600/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Image */}
                <div className="relative overflow-hidden h-56 bg-zinc-950">
                  <Image
                    src={project.image}
                    alt={`${project.title} - bedrijfsautomatisering`}
                    width={400}
                    height={224}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-60" />

                  {/* Tag badge */}
                  {project.tag && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {project.tag}
                    </div>
                  )}

                  {/* Savings badge */}
                  {project.savings && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-black text-xs font-bold rounded-full">
                      {project.savings}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* CTA Link */}
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-2 text-purple-400 font-semibold hover:text-purple-300 transition-colors group/link"
                    aria-label={`Bekijk ${project.title} case study`}
                  >
                    <span>Bekijk Case Study</span>
                    <svg
                      className="w-5 h-5 group-hover/link:translate-x-1 transition-transform"
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

                {/* Decorative corner gradient */}
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </article>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mb-16 p-8 bg-gradient-to-r from-purple-950/20 via-zinc-900/50 to-purple-950/20 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-gray-400 text-sm">
                  Actieve Automatiseringen
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
                  2.000+
                </div>
                <div className="text-gray-400 text-sm">Uur Bespaard/Maand</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-gray-400 text-sm">Klanttevredenheid</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-gray-400 mb-6 text-lg">
              Benieuwd wat automatisering voor jouw bedrijf kan betekenen?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-purple-500/50 text-white font-semibold rounded-lg hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300"
              >
                <span>Bekijk Alle Cases</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/quickscan"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-white text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50"
              >
                <span>Start Gratis Quickscan</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="relative py-24 bg-black overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-amber-900/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-white to-amber-400 bg-clip-text text-transparent">
                Over Ons
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Wij zijn Mark en Faissal, specialisten in bedrijfsautomatisering
              voor MKB. Ons doel: bedrijven helpen 40+ uur per week te besparen
              door slimme automatisering.
            </p>
          </div>

          {/* Team Members */}
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Mark */}
            <div className="group relative">
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300">
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-pink-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Photo */}
                  <div className="mb-6 relative">
                    <div className="w-48 h-48 mx-auto rounded-xl overflow-hidden ring-4 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all duration-300">
                      <Image
                        src="/mark.png"
                        alt="Mark - Co-founder AIFAIS"
                        width={192}
                        height={192}
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    {/* Decorative gradient circle */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-purple-600 via-white to-amber-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Mark</h3>
                    <p className="text-purple-400 font-semibold mb-4">
                      Co-founder & Technical Expert
                    </p>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      Begonnen als software engineer heb ik jarenlang bedrijven
                      geholpen hun processen te digitaliseren. Mijn missie is om
                      automatisering toegankelijk te maken voor elk bedrijf.
                    </p>

                    {/* Skills/Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-500/30">
                        Software Development
                      </span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-500/30">
                        Automatisering Expert
                      </span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-500/30">
                        AI Integration
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Faisal */}
            <div className="group relative">
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300">
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/5 to-amber-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Photo */}
                  <div className="mb-6 relative">
                    <div className="w-48 h-48 mx-auto rounded-xl overflow-hidden ring-4 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all duration-300">
                      <Image
                        src="/faissal.png"
                        alt="Faissal - Co-founder AIFAIS"
                        width={192}
                        height={192}
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    {/* Decorative gradient circle */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-purple-600 via-white to-amber-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Faissal
                    </h3>
                    <p className="text-purple-400 font-semibold mb-4">
                      Co-founder & Business Development
                    </p>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      Na jaren ondernemerschap weet ik hoe het is om vast te
                      zitten in repetitieve taken. Bij AIFAIS vertaal ik die
                      frustratie naar concrete oplossingen die bedrijven écht
                      helpen groeien.
                    </p>

                    {/* Skills/Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-500/30">
                        Process Design
                      </span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-500/30">
                        Customer Success
                      </span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-500/30">
                        Growth Strategy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-6">
              Wil je kennismaken en ontdekken hoe wij jouw bedrijf kunnen
              helpen?
            </p>
            <Link
              href="/quickscan"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-white text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 hover:scale-105"
            >
              Start Gratis Quickscan
              <svg
                className="w-5 h-5"
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
      </section>

      {/* AFSLUITENDE CTA */}
      <section className="relative py-24 bg-black overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-purple-950/10" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-3xl" />

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="relative container mx-auto px-6 max-w-5xl">
          {/* Main content card */}
          <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-12 shadow-2xl">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-600/30 to-transparent rounded-tl-3xl blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-600/20 to-transparent rounded-br-3xl blur-2xl" />

            <div className="relative text-center">
              {/* Badge */}
              <div className="inline-block mb-6 px-4 py-2 bg-purple-950/50 border border-purple-500/30 rounded-full">
                <span className="text-purple-300 text-sm font-semibold tracking-wide">
                  🚀 GRATIS HAALBAARHEIDSCHECK
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-300 to-amber-400 bg-clip-text text-transparent">
                  Klaar Om 40+ Uur Per Maand
                </span>
                <br />
                <span className="text-white">Terug Te Winnen?</span>
              </h2>

              {/* Description */}
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                We beginnen met een{" "}
                <span className="text-white font-semibold">
                  gratis 30-minuten gesprek
                </span>{" "}
                waarin we precies uitzoeken wat automatisering voor jouw bedrijf
                kan betekenen.
              </p>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
                {/* Benefit 1 */}
                <div className="group relative bg-zinc-950/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Analyse</h3>
                    <p className="text-gray-400 text-sm">
                      Jouw grootste tijdvreters in kaart brengen
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="group relative bg-zinc-950/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      Quick Wins
                    </h3>
                    <p className="text-gray-400 text-sm">
                      2-3 taken die direct te automatiseren zijn
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="group relative bg-zinc-950/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      ROI Berekening
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Concrete inschatting van investering vs. besparing
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust elements */}
              <div className="mb-8 flex items-center justify-center gap-8 text-gray-400 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Geen verplichtingen</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Geen sales pressure</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Gewoon eerlijk advies</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/quickscan"
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-white text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                  <span>Start Gratis Quickscan</span>
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-purple-500/50 text-white font-semibold rounded-xl hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300"
                >
                  <span>Plan een Gesprek</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </Link>
              </div>

              {/* Social proof mini */}
              <p className="mt-8 text-gray-400 text-sm">
                <span className="text-purple-300 font-semibold">
                  50+ bedrijven
                </span>{" "}
                gingen je voor en besparen nu gemiddeld{" "}
                <span className="text-purple-300 font-semibold">
                  40+ uur per maand
                </span>
              </p>
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 border-2 border-black" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 border-2 border-black" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-black" />
              </div>
              <span>Sluit je aan bij 50+ tevreden klanten</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />
    </main>
  );
}
