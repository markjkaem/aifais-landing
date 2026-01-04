// ========================================
// FILE: app/[locale]/mkb/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import { sectorData, sectorDataEn } from "./data";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "AI Solutions for SME | AIFAIS" : "AI Oplossingen voor MKB | AIFAIS",
    description: isEn 
      ? "Discover our AI solutions specifically for SMEs. Optimize your business processes in various sectors." 
      : "Ontdek onze AI oplossingen specifiek voor het MKB. Optimaliseer uw bedrijfsprocessen in diverse sectoren.",
  };
}

export default async function MkbPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const data = isEn ? sectorDataEn : sectorData;
  const sectors = Object.values(data);

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3066be]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3066be]/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3066be]/10 text-[#3066be] rounded-full text-sm font-bold mb-6 uppercase tracking-wider">
            <Zap className="w-4 h-4 fill-current" />
            <span>{isEn ? "SME Solutions" : "MKB Oplossingen"}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight text-gray-900">
            {isEn ? "Smarter Business with" : "Slimmer Ondernemen met"}
            <span className="text-[#3066be]"> AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            {isEn 
              ? "Every sector is unique. That's why we build tailored AI solutions that really work for your company. Choose your sector and discover the possibilities."
              : "Elke sector is uniek. Daarom bouwen wij AI-oplossingen op maat die écht werken voor jouw bedrijf. Kies jouw branche en ontdek de mogelijkheden."}
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <Target className="w-5 h-5 text-[#3066be]" />
              <span>{isEn ? "Tailored Solutions" : "Maatwerk oplossingen"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <Sparkles className="w-5 h-5 text-[#3066be]" />
              <span>{isEn ? "Instant ROI" : "Directe ROI"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector) => (
              <Link
                key={sector.slug}
                href={`/${locale}/mkb/${sector.slug}`}
                className="group relative flex flex-col p-8 rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:border-[#3066be]/30 hover:shadow-2xl hover:shadow-[#3066be]/10 hover:-translate-y-2 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#3066be]/5 rounded-bl-[4rem] transition-transform duration-500 group-hover:scale-110" />

                {/* Content */}
                <span className="text-4xl mb-6 block transform transition-transform duration-300 group-hover:scale-110 origin-left">
                  {sector.solutions?.[0]?.icon || "🏢"}
                </span>
                
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#3066be] transition-colors">
                  {sector.name}
                </h3>
                
                <p className="text-gray-600 mb-8 flex-1 leading-relaxed">
                  {sector.intro.length > 120 
                    ? sector.intro.substring(0, 117) + "..." 
                    : sector.intro}
                </p>

                <div className="flex items-center gap-2 text-[#3066be] font-bold mt-auto group/btn">
                  <span>{isEn ? "Discover possibilities" : "Ontdek mogelijkheden"}</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#3066be]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            {isEn ? "Ready to Transform Your Business?" : "Klaar om Jouw Bedrijf te Transformeren?"}
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Not sure which solution is best for your sector? We're happy to think along during a free analysis call."
              : "Nog niet zeker welke oplossing het beste past bij jouw branche? We denken graag met je mee tijdens een gratis analysemoment."}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#3066be] text-white font-bold rounded-2xl hover:bg-[#234a8c] transition-all hover:scale-105 shadow-xl shadow-[#3066be]/30"
          >
            {isEn ? "Start Free Analysis" : "Start Gratis Analyse"}
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
