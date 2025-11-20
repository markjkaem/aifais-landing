"use client";
import Image from "next/image";
import Link from "next/link";
import { projects } from "./portfolio/data";
import { Space_Grotesk } from "next/font/google";
import { useRef, useState } from "react";
import GoogleReviews from "./Components/Reviews";

const h1 = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

export default function Home() {
  // Klassen op basis van dark/light mode
  const bgClass = "bg-black";
  const textClass = "text-white";
  const accentColor = "text-purple-500"; // accentkleur

  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;

    if (isMuted) {
      // Video unmute en opnieuw starten
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      // Video mute
      videoRef.current.muted = true;
    }

    setIsMuted(!isMuted);
  };

  return (
    <main
      className={`${bgClass} ${textClass}  min-h-screen transition-colors duration-500`}
    >
      {/* HERO */}
      <section className="relative min-h-[90vh] flex mx-2 md:mx-10 items-center">
        {/* Achtergrondafbeelding met gradient overlay */}
        <video
          src={"coding.mp4"}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-50 contrast-125 saturate-150"
        />
        <div className="absolute inset-0 bg-black/50" />
        {/* Hero content */}
        <div className="relative z-10 text-left md:max-w-6xl px-4 md:px-40">
          <h1 className="text-4xl md:text-6xl uppercase font-extrabold tracking-widest leading-12">
            <span className="text-4xl md:text-3xl">
              {" "}
              Bespaar uren Per week!
            </span>
            <span className={`${h1.className} font-bold block text-zinc-300  `}>
              Met Slimme Workflow Automatisering
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
            Stop met handmatig werk dat jouw team 10+ uur per week kost. Wij
            automatiseren repetitieve processen met n8n – van offertes versturen
            tot data-synchronisatie. Bespaar kosten, voorkom fouten, en schaal
            zonder nieuwe medewerkers.
          </p>
          <div className="flex mt-4 flex-col">
            <span>
              <span className="text-green-400">✓</span> Binnen 2 weken
              operationeel{" "}
            </span>
            <span>
              <span className="text-green-400">✓</span> Gemiddelde ROI: 3
              maanden
            </span>
            <span>
              <span className="text-green-400">✓</span> Gespecialiseerd in
              Nederlandse MKB-bedrijven
            </span>
          </div>

          {/* CTA-knoppen */}
          <div className="mt-6 flex  gap-4 flex-wrap">
            <Link
              href="/quickscan"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-300 text-black font-semibold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              Bereken jouw besparing
            </Link>
            <a
              href="#cases"
              className="px-8 py-4 border border-gray-700 rounded-xl text-gray-200 hover:text-white hover:border-purple-400 transition"
            >
              Bekijk voorbeelden
            </a>
            <div className=" md:flex hidden absolute -right-32 bottom-0">
              <GoogleReviews />
            </div>
          </div>

          {/* small text */}
          <span className="text-xs text-white">
            * Gratis en vrijblijvend, antwoord binnen 24 uur
          </span>
        </div>
        {/* Glass panels */}
        <div className="absolute inset-y-0 left-0 w-[120px] bg-black/70 backdrop-blur-sm border-r border-white/10 hidden md:block" />
        <div className="absolute inset-y-0 right-0 w-[120px] bg-black/70 backdrop-blur-sm border-l border-white/10 hidden md:block" />
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

      {/* PROMO VIDEO SECTION */}
      <section
        id="introduction"
        className="py-24 md:py-32 bg-gradient-to-b from-black via-gray-950 to-black relative"
      >
        <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* TEXT */}
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Zie Hoe Wij 15 Uur Per Week Besparen Voor Bedrijven
              <span className="text-purple-400"> Zoals Het Jouwe</span>
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6 text-base md:text-lg">
              In deze 60-seconden demo zie je exact hoe onze n8n workflows
              handmatige processen overnemen – van lead-opvolging tot
              rapportage-automatisering. Geen technische kennis nodig.
              "Eindelijk een team dat hun uren investeert in groei, niet in
              data-invoer."
            </p>
            <p className="text-gray-400 italic text-sm md:text-base">
              — Oprichter MKB-bedrijf, 25 medewerkers
            </p>
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
        <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-purple-600/20 blur-3xl rounded-full opacity-40" />
      </section>

      {/* DIENSTEN / PROJECTEN */}
      <section id="cases" className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-14">
            Welke Processen Kunnen Wij Voor Jou Automatiseren? Deze workflows
            draaien al bij 50+ Nederlandse bedrijven
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((s) => (
              <div
                key={s.slug}
                className="group rounded-2xl overflow-hidden border border-gray-700 bg-gray-950 hover:shadow-xl transition-shadow duration-300"
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
      <section
        id="about"
        className="py-24 bg-gradient-to-b from-black via-gray-950 to-black"
      >
        <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Tekst */}
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Waarom Kiezen Bedrijven Voor Aifais?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Wij zijn geen IT-consultants die jargon verkopen. Wij zijn
              specialisten die al 3+ jaar n8n workflows bouwen voor Nederlandse
              MKB-bedrijven. Van 5-mans teams tot scale-ups met 100+
              medewerkers. Onze aanpak is simpel: - We luisteren naar jouw
              frustraties met handmatig werk - We bouwen een custom workflow die
              direct inzetbaar is - We trainen jouw team zodat jullie autonoom
              zijn Resultaat? Gemiddeld 40 uur per maand tijdsbesparing, binnen
              2 weken operationeel. "Eindelijk iemand die begrijpt dat wij geen
              IT-afdeling hebben, maar wel willen automatiseren."
            </p>
            <p className="text-gray-400 italic">
              — Operations Manager, E-commerce bedrijf
            </p>
          </div>

          {/* Foto’s van jou */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/logo_official.png"
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
      <section className="py-24 mx-auto text-center bg-gray-950 ">
        <h2 className="text-4xl font-bold">
          Klaar Om 40+ Uur Per Maand Terug Te Winnen?
        </h2>
        <p className="mt-4 text-lg text-gray-300 w-5/6  md:w-3/6 mx-auto">
          We beginnen met een gratis 30-minuten haalbaarheidscheck waarin we: ✓
          Jouw grootste tijdvreters in kaart brengen ✓ 2-3 quick wins
          identificeren die direct te automatiseren zijn ✓ Een ROI-inschatting
          maken (investering vs. besparing) Geen verplichtingen. Geen sales
          pressure. Gewoon eerlijk advies.
        </p>
        <Link
          href="/contact"
          className={`mt-8 inline-block px-10 py-4 ${accentColor} border border-purple-500 font-semibold rounded-lg hover:bg-purple-500 hover:text-black transition`}
        >
          Plan een Gesprek
        </Link>
      </section>
      <section className="py-24 p-8 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold">
          Vragen Die We Vaak Krijgen (FAQ){" "}
        </h2>
        <div className="py-2 mt-4">
          {" "}
          <h3 className="font-bold text-purple-400">
            Hoelang duurt het voordat een workflow live is?
          </h3>
          <p>
            {" "}
            Gemiddeld 2 weken van intake tot go-live. Simpele workflows (zoals
            data-sync) vaak binnen 1 week.{" "}
          </p>
        </div>
        <div className="py-2">
          {" "}
          <h3 className="font-bold text-purple-400">
            {" "}
            Moet ik technische kennis hebben?
          </h3>{" "}
          <p>
            Nee. Wij bouwen en implementeren alles. Jij krijgt een dashboard
            waar je in gewone taal aanpassingen kunt maken.{" "}
          </p>
        </div>
        <div className="py-2">
          {" "}
          <h3 className="font-bold text-purple-400">
            {" "}
            Wat kost een workflow gemiddeld?
          </h3>
          <p>
            Vanaf €2.500 voor een standaard workflow. Complexe multi-step
            automatiseringen vanaf €5.000. Altijd transparante offerte vooraf.{" "}
          </p>
        </div>
        <div className="py-2">
          {" "}
          <h3 className="font-bold text-purple-400">
            {" "}
            Werken jullie ook met ons bestaande software?
          </h3>
          <p>
            Ja. n8n integreert met 400+ tools zoals Google Workspace, HubSpot,
            Exact Online, Salesforce, Slack, en meer.
          </p>
        </div>
        <div className="py-2">
          {" "}
          <h3 className="font-bold text-purple-400">
            {" "}
            Wat als de workflow niet werkt zoals verwacht?
          </h3>
          <p>
            We bieden 30 dagen gratis support na go-live. Daarna optionele
            onderhoudscontracten vanaf €200/maand.
          </p>
        </div>
      </section>
    </main>
  );
}
