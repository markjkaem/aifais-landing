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
    <main className="bg-slate-50 min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-[#3066be] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24 pb-32">
        <div className="text-center mb-16 text-white">
          <h1 className={`${h1_font.className} text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight`}>
            Sector Benchmark <br/> & <span className="text-blue-200">AI Volwassenheid</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Beantwoord 5 korte vragen en ontdek direct hoe u scoort ten opzichte van +500 andere MKB bedrijven in Nederland.
          </p>
        </div>

        <BenchmarkTool locale={locale} />
      </div>
    </main>
  );
}
