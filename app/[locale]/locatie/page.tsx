// ========================================
// FILE: app/[locale]/locatie/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Zap, Globe } from "lucide-react";

const cities = [
  { slug: "rotterdam", name: "Rotterdam", icon: "🚢" },
  { slug: "den-haag", name: "Den Haag", icon: "⚖️" },
  { slug: "utrecht", name: "Utrecht", icon: "🏢" },
  { slug: "leiden", name: "Leiden", icon: "🧬" },
  { slug: "zoetermeer", name: "Zoetermeer", icon: "💻" },
  { slug: "alphen-aan-den-rijn", name: "Alphen a/d Rijn", icon: "🏗️" },
  { slug: "gouda", name: "Gouda", icon: "🧀" },
  { slug: "woerden", name: "Woerden", icon: "🚛" },
];

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Locaties | AIFAIS" : "Locaties | AIFAIS",
    description: isEn 
      ? "Discover where AIFAIS is active. We provide AI solutions for SMEs throughout the Netherlands." 
      : "Ontdek waar AIFAIS actief is. Wij leveren AI-oplossingen voor het MKB in heel Nederland.",
  };
}

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#0a0a0a] overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3066be]/20 via-transparent to-[#3066be]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(48,102,190,0.15),transparent_50%)]" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/80 rounded-full text-sm font-bold mb-6 uppercase tracking-wider backdrop-blur-xl">
            <Globe className="w-4 h-4" />
            <span>{isEn ? "Our Reach" : "Ons Bereik"}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight text-white leading-tight">
            {isEn ? "AI Solutions" : "AI Oplossingen"}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
              {isEn ? "In Your Region" : "In Jouw Regio"}
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-12">
            {isEn 
              ? "AIFAIS helps SMEs throughout the Netherlands to work smarter. Although we work from Gouda, we are active in all these innovative cities."
              : "AIFAIS helpt MKB-bedrijven in heel Nederland om slimmer te werken. Hoewel we vanuit Gouda werken, zijn we actief in al deze innovatieve steden."}
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${locale}/locatie/${city.slug}`}
                className="group relative flex flex-col p-8 rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:border-[#3066be]/30 hover:shadow-2xl hover:shadow-[#3066be]/10 hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl mb-6 group-hover:bg-[#3066be]/5 transition-colors">
                  {city.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#3066be] transition-colors">
                  {city.name}
                </h3>
                
                <p className="text-sm text-gray-500 mb-6">
                  {isEn ? "Local AI partner" : "Lokale AI partner"}
                </p>

                <div className="flex items-center gap-2 text-[#3066be] font-bold mt-auto opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  <span className="text-sm uppercase tracking-wider">{isEn ? "View Details" : "Bekijk Details"}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {isEn ? "Is your city not listed?" : "Staat jouw stad er niet tussen?"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              {isEn
                ? "Don't worry! We work throughout the Netherlands and can often help you remotely or on location."
                : "Geen zorgen! Wij werken in heel Nederland en kunnen je vaak ook op afstand of op locatie helpen."}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
            >
              {isEn ? "Contact Us" : "Neem Contact Op"}
              <MapPin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
