// ========================================
// FILE 2: app/HomeClient.tsx (NIEUWE FILE!)
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
import GoogleReviews from "./Components/Reviews";
import { projects } from "./portfolio/data";

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
            title="n8n workflow automatisering in actie"
            aria-label="Achtergrond video van workflow automatisering code"
            poster="/coding-poster.jpg"
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
              n8n Workflow Automatisering
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
              Stop met handmatig werk. Automatiseer repetitieve processen met
              n8n – van offertes versturen tot data-synchronisatie.
              <span className="text-white font-semibold">
                {" "}
                Bespaar kosten, voorkom fouten, en schaal zonder nieuwe
                medewerkers.
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

        {/* Google Reviews - Floating card */}
        <div className="absolute bottom-8 right-8 hidden xl:block z-20">
          <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-2xl hover:scale-105 transition-transform duration-300">
            <GoogleReviews />
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
            alt="Aifais partner - workflow automatisering specialist"
            width={160}
            height={60}
            loading="lazy"
            className="md:w-40 w-14 object-contain h-auto opacity-50 invert"
          />
          <img
            src="/google.svg"
            alt="Google Workspace integratie voor n8n workflows"
            width={160}
            height={60}
            loading="lazy"
            className="md:w-40 object-contain w-14 h-auto opacity-50 grayscale"
          />
          <img
            src="/n8n.svg"
            alt="n8n workflow automatisering platform"
            width={160}
            height={60}
            loading="lazy"
            className="object-contain md:w-40 w-14 h-auto opacity-50 grayscale invert"
          />
          <img
            src="/openai.svg"
            alt="OpenAI GPT integratie in automatisering workflows"
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

      {/* PROMO VIDEO SECTION */}
      <section
        id="introduction"
        aria-labelledby="intro-heading"
        className="py-24 md:py-32 bg-gradient-to-b from-black via-gray-950 to-black relative"
      >
        <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* TEXT */}
          <div>
            <h2
              id="intro-heading"
              className="text-2xl md:text-4xl font-bold mb-6"
            >
              Zie Hoe Wij 15 Uur Per Week Besparen Voor Bedrijven
              <span className="text-purple-400"> Zoals Het Jouwe</span>
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6 text-base md:text-lg">
              In deze 60-seconden demo zie je exact hoe onze n8n workflows
              handmatige processen overnemen – van lead-opvolging tot
              rapportage-automatisering. Geen technische kennis nodig.
            </p>
            <blockquote className="text-gray-400 italic text-sm md:text-base border-l-4 border-purple-500 pl-4">
              <p>
                "Eindelijk een team dat hun uren investeert in groei, niet in
                data-invoer."
              </p>
              <footer className="mt-2">
                — Oprichter MKB-bedrijf, 25 medewerkers
              </footer>
            </blockquote>
          </div>

          {/* VIDEO */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-lg bg-white/5 mx-auto">
            <video
              ref={videoRef}
              src="/aifaispromo.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full aspect-[1] object-cover"
              title="Aifais promo video - n8n workflow automatisering demo"
            />

            {/* MUTE / UNMUTE BUTTON */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 bg-purple-500/70 hover:bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5v14l12-7-12-7z"
                  />
                  <line
                    x1="5"
                    y1="5"
                    x2="19"
                    y2="19"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5v14l12-7-12-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Subtle glow behind video */}
        <div
          className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-purple-600/20 blur-3xl rounded-full opacity-40"
          aria-hidden="true"
        />
      </section>

      {/* DIENSTEN / PROJECTEN */}
      <section id="cases" aria-labelledby="cases-heading" className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <header className="text-center mb-14">
            <h2
              id="cases-heading"
              className="text-3xl md:text-4xl font-bold mb-3"
            >
              Welke Processen Kunnen Wij Voor Jou Automatiseren?
            </h2>
            <p className="text-gray-400 text-lg">
              Deze workflows draaien al bij 50+ Nederlandse bedrijven
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
            {projects
              .slice(0, 3)
              .map(
                (s: {
                  slug: Key | null | undefined;
                  image: string | Blob | undefined;
                  title:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  description:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }) => (
                  <article
                    key={s.slug}
                    className="group rounded-2xl overflow-hidden border border-gray-700 bg-gray-950 hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={s.image}
                      alt={`${s.title} workflow automatisering case study`}
                      width={400}
                      height={224}
                      loading="lazy"
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {s.description}
                      </p>
                      <Link
                        href={`/portfolio/${s.slug}`}
                        className="inline-block mt-2 text-purple-300 font-semibold hover:underline"
                        aria-label={`Bekijk ${s.title} workflow automatisering case`}
                      >
                        Bekijk Case →
                      </Link>
                    </div>
                  </article>
                )
              )}
          </div>

          {/* CTA naar volledige portfolio */}
          <div className="text-center mt-16">
            <Link
              href="/portfolio"
              className={`mt-8 inline-block px-10 py-4 ${accentColor} border border-purple-500 font-semibold rounded-lg hover:bg-purple-500 hover:text-black transition`}
            >
              Bekijk Volledige Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* OVER ONS */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="py-24 bg-gradient-to-b from-black via-gray-950 to-black"
      >
        <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Tekst */}
          <div>
            <h2 id="about-heading" className="text-4xl font-bold mb-6">
              Waarom Kiezen Bedrijven Voor Aifais?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Wij zijn geen IT-consultants die jargon verkopen. Wij zijn
              specialisten die al 3+ jaar n8n workflows bouwen voor Nederlandse
              MKB-bedrijven. Van 5-mans teams tot scale-ups met 100+
              medewerkers.
            </p>

            <ul className="space-y-3 mb-6 list-none">
              <li className="flex items-start gap-3">
                <span
                  className="text-purple-400 text-xl flex-shrink-0"
                  aria-hidden="true"
                >
                  •
                </span>
                <span>
                  We luisteren naar jouw frustraties met handmatig werk
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="text-purple-400 text-xl flex-shrink-0"
                  aria-hidden="true"
                >
                  •
                </span>
                <span>
                  We bouwen een custom workflow die direct inzetbaar is
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="text-purple-400 text-xl flex-shrink-0"
                  aria-hidden="true"
                >
                  •
                </span>
                <span>We trainen jouw team zodat jullie autonoom zijn</span>
              </li>
            </ul>

            <p className="text-gray-300 font-semibold mb-4">
              Resultaat? Gemiddeld 40 uur per maand tijdsbesparing, binnen 2
              weken operationeel.
            </p>

            <blockquote className="text-gray-400 italic border-l-4 border-purple-500 pl-4">
              <p>
                "Eindelijk iemand die begrijpt dat wij geen IT-afdeling hebben,
                maar wel willen automatiseren."
              </p>
              <footer className="text-sm mt-2">
                — Operations Manager, E-commerce bedrijf
              </footer>
            </blockquote>
          </div>

          {/* Foto's */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/logo_official.png"
              alt="Aifais team aan het werk op kantoor"
              width={256}
              height={256}
              loading="lazy"
              className="rounded-2xl object-contain invert h-64 w-full hover:scale-105 transition-transform duration-300"
            />
            <img
              src="/office-people.jpg"
              alt="Aifais specialist geeft uitleg aan klant over workflow automatisering"
              width={256}
              height={256}
              loading="lazy"
              className="rounded-2xl object-cover h-64 w-full hover:scale-105 transition-transform duration-300"
            />
            <img
              src="/lesson.jpg"
              alt="Aifais team in overleg met klant over n8n implementatie"
              width={512}
              height={256}
              loading="lazy"
              className="rounded-2xl object-cover object-right h-64 w-full hover:scale-105 transition-transform duration-300 col-span-2"
            />
          </div>
        </div>
      </section>

      {/* AFSLUITENDE CTA */}
      <section className="py-24 mx-auto text-center bg-gray-950">
        <h2 className="text-4xl font-bold">
          Klaar Om 40+ Uur Per Maand Terug Te Winnen?
        </h2>
        <div className="mt-6 text-lg text-gray-300 w-5/6 md:w-3/6 mx-auto space-y-4">
          <p>
            We beginnen met een gratis 30-minuten haalbaarheidscheck waarin we:
          </p>
          <ul className="text-left max-w-2xl mx-auto space-y-2 list-none">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1" aria-hidden="true">
                ✓
              </span>
              <span>Jouw grootste tijdvreters in kaart brengen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1" aria-hidden="true">
                ✓
              </span>
              <span>
                2-3 quick wins identificeren die direct te automatiseren zijn
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1" aria-hidden="true">
                ✓
              </span>
              <span>Een ROI-inschatting maken (investering vs. besparing)</span>
            </li>
          </ul>
          <p className="text-sm text-gray-400 italic">
            Geen verplichtingen. Geen sales pressure. Gewoon eerlijk advies.
          </p>
        </div>
        <Link
          href="/contact"
          className={`mt-8 inline-block px-10 py-4 ${accentColor} border border-purple-500 font-semibold rounded-lg hover:bg-purple-500 hover:text-black transition`}
        >
          Plan een Gesprek
        </Link>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="py-24 p-8 max-w-3xl mx-auto"
      >
        <h2 id="faq-heading" className="text-4xl font-bold text-center mb-8">
          Veelgestelde Vragen
        </h2>

        <dl className="space-y-6">
          <div className="border border-gray-800 rounded-lg p-6 hover:border-purple-500 transition">
            <dt className="font-bold text-lg text-purple-400 mb-2">
              Hoelang duurt het voordat een workflow live is?
            </dt>
            <dd className="text-gray-300">
              Gemiddeld 2 weken van intake tot go-live. Simpele workflows (zoals
              data-sync) vaak binnen 1 week.
            </dd>
          </div>

          <div className="border border-gray-800 rounded-lg p-6 hover:border-purple-500 transition">
            <dt className="font-bold text-lg text-purple-400 mb-2">
              Hoe lang duurt de implementatie van een n8n workflow?
            </dt>
            <dd className="text-gray-300">
              Van eerste gesprek tot go-live: gemiddeld 2-3 weken. Dit omvat
              intake, development, testing, en training van jouw team.
            </dd>
          </div>

          <div className="border border-gray-800 rounded-lg p-6 hover:border-purple-500 transition">
            <dt className="font-bold text-lg text-purple-400 mb-2">
              Moet ik technische kennis hebben?
            </dt>
            <dd className="text-gray-300">
              Nee. Wij bouwen en implementeren alles. Jij krijgt een dashboard
              waar je in gewone taal aanpassingen kunt maken.
            </dd>
          </div>

          <div className="border border-gray-800 rounded-lg p-6 hover:border-purple-500 transition">
            <dt className="font-bold text-lg text-purple-400 mb-2">
              Wat kost een workflow gemiddeld?
            </dt>
            <dd className="text-gray-300">
              Vanaf €2.500 voor een standaard workflow. Complexe multi-step
              automatiseringen vanaf €5.000. Altijd transparante offerte vooraf.
            </dd>
          </div>

          <div className="border border-gray-800 rounded-lg p-6 hover:border-purple-500 transition">
            <dt className="font-bold text-lg text-purple-400 mb-2">
              Werken jullie ook met ons bestaande software?
            </dt>
            <dd className="text-gray-300">
              Ja. n8n integreert met 400+ tools zoals Google Workspace, HubSpot,
              Exact Online, Salesforce, Slack, en meer.
            </dd>
          </div>

          <div className="border border-gray-800 rounded-lg p-6 hover:border-purple-500 transition">
            <dt className="font-bold text-lg text-purple-400 mb-2">
              Wat als de workflow niet werkt zoals verwacht?
            </dt>
            <dd className="text-gray-300">
              We bieden 30 dagen gratis support na go-live. Daarna optionele
              onderhoudscontracten vanaf €200/maand.
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
