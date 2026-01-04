import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import BenchmarkTool from "./BenchmarkTool";

const h1_font = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Benchmark Tool | Vergelijk uw organisatie | AIFAIS",
  description: "Ontdek hoe uw organisatie presteert op het gebied van digitale volwassenheid en AI integratie vergeleken met uw branchegenoten.",
};

export default async function BenchmarkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="bg-gray-900 min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-[70vh] bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-transparent" />

        {/* Grid pattern */}
        <div className="absolute top-0 left-0 right-0 h-[70vh] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-violet-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24 pb-32">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-sm font-medium text-white/80">500+ MKB bedrijven vergeleken</span>
          </div>

          <h1 className={`${h1_font.className} text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]`}>
            <span className="text-white">Sector Benchmark</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400">
              & AI Volwassenheid
            </span>
          </h1>

          <p className="text-xl text-white/50 leading-relaxed max-w-xl mx-auto">
            Beantwoord 5 korte vragen en ontdek direct hoe u scoort ten opzichte van uw branchegenoten.
          </p>
        </div>

        <BenchmarkTool locale={locale} />

        {/* Trust indicators */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 text-white/30 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>100% Anoniem</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>2 minuten</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Gratis Rapport</span>
          </div>
        </div>
      </div>
    </main>
  );
}
