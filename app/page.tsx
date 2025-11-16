"use client";
import Image from "next/image";
import Link from "next/link";
import { projects } from "./portfolio/data";
import { Space_Grotesk } from "next/font/google";

const h1 = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

export default function Home() {
  // Klassen op basis van dark/light mode
  const bgClass = "bg-black";
  const textClass = "text-white";
  const accentColor = "text-purple-500"; // accentkleur

  return (
    <main
      className={`${bgClass} ${textClass}  min-h-screen transition-colors duration-500`}
    >
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Achtergrondafbeelding met gradient overlay */}
        <div className="absolute inset-0">
          <Image
            src="/afais.jpg"
            alt="AI Background"
            layout="fill"
            objectFit="cover"
            className="opacity-60 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-4xl md:text-7xl font-extrabold  tracking-widest leading-tight">
            <span
              className={`${h1.className} font-bold block text-gray-100  text-shadow-white text-shadow-lg`}
            >
              AI Automatisering
            </span>
            <span
              className={`block text-4xl   mt-2 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent`}
            >
              Voor Toekomstgerichte Bedrijven
            </span>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-300/20 via-fuchsia-400/10 to-blue-400/20 blur-3xl animate-pulse" />
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Wij ontwerpen en implementeren intelligente workflows, autonome
            agents en data-gedreven AI-oplossingen die groei versnellen, kosten
            verlagen en innovatie stimuleren.
          </p>

          {/* CTA-knoppen */}
          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-300 text-black font-semibold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              Vraag offerte aan
            </Link>
            <a
              href="#services"
              className="px-8 py-4 border border-gray-700 rounded-xl text-gray-200 hover:text-white hover:border-purple-400 transition"
            >
              Ontdek Oplossingen
            </a>
          </div>
        </div>
        {/* Glass panels */}
        <div className="absolute inset-y-0 left-0 w-[120px] bg-white/5 backdrop-blur-sm border-r border-white/10 hidden md:block" />
        <div className="absolute inset-y-0 right-0 w-[120px] bg-white/5 backdrop-blur-sm border-l border-white/10 hidden md:block" />

        {/* Subtiele animatie-glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />
      </section>

      {/* PARTNERS / LOGO'S */}
      <section>
        <div className="w-full justify-center flex md:gap-32 gap-6">
          <img
            src="/logo-1.webp"
            alt="Partnerlogo"
            className="md:w-40 w-14 object-contain h-auto opacity-50 invert"
          />
          <img
            src="/google.svg"
            alt="Google logo"
            className="md:w-40 object-contain w-14 h-auto opacity-50 grayscale"
          />
          <img
            src="/n8n.svg"
            alt="n8n logo"
            className="object-contain md:w-40 w-14 h-auto opacity-50 grayscale invert"
          />
          <img
            src="/openai.svg"
            alt="OpenAI logo"
            className="md:w-40 w-14 object-contain h-auto grayscale opacity-50 invert"
          />
          <img
            src="/claude.svg"
            alt="Claude logo"
            className="md:w-40 w-14 object-contain h-auto grayscale opacity-50 invert"
          />
        </div>
      </section>

      {/* DIENSTEN / PROJECTEN */}
      <section id="services" className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-14">
            Wat Wij Bouwen
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((s) => (
              <div
                key={s.slug}
                className="group rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={s.image}
                  alt={s.title}
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
                  >
                    Bekijk Case →
                  </Link>
                </div>
              </div>
            ))}
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
      {/* OVER ONS / FOUNDER */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Tekst */}
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Over <span className="text-purple-400">Aifais</span>
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Aifais is opgericht met één missie: bedrijven helpen om het
              maximale uit AI te halen. Met ervaring in automatisering,
              data-integratie en AI-strategie helpen wij organisaties om
              slimmer, efficiënter en innovatiever te werken.
            </p>
            <p className="text-gray-400 italic">
              “AI is geen hype — het is de nieuwe bedrijfsmotor. En wij helpen
              je hem starten.”
            </p>
          </div>

          {/* Foto’s van jou */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/logo.png"
              alt="Aan het werk op kantoor"
              className="rounded-2xl object-contain invert h-64 w-full hover:scale-105 transition-transform duration-300"
            />
            <img
              src="/office-people.jpg"
              alt="Uitleg geven aan klant"
              className="rounded-2xl object-cover h-64 w-full hover:scale-105 transition-transform duration-300"
            />
            <img
              src="/lesson.jpg"
              alt="In overleg met klant"
              className="rounded-2xl object-cover object-right h-64 w-full hover:scale-105 transition-transform duration-300 col-span-2"
            />
          </div>
        </div>
      </section>

      {/* AFSLUITENDE CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold">
          Klaar om jouw bedrijf toekomstbestendig te maken?
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Samen ontwerpen we jouw AI-voorsprong.
        </p>
        <Link
          href="/contact"
          className={`mt-8 inline-block px-10 py-4 ${accentColor} border border-purple-500 font-semibold rounded-lg hover:bg-purple-500 hover:text-black transition`}
        >
          Plan een Gesprek
        </Link>
      </section>
    </main>
  );
}
