import { Metadata } from "next";
import Link from "next/link";
import {
  ScanLine,
  Scale,
  Mail,
  ArrowRight,
  CheckCircle2,
  Lock,
  PenTool, // ✅ Nieuw icoon voor de Factuur Maker
} from "lucide-react";

export const metadata: Metadata = {
  title: "Aifais Tools | Slimme AI Software voor MKB",
  description:
    "Direct aan de slag met onze AI tools. Factuur scanners, juridische checks en meer. Geen abonnement nodig.",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white relative overflow-hidden">
      {/* Achtergrond */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navigatie Terug */}
      <nav className="relative z-10 px-6 py-6 max-w-6xl mx-auto">
        <Link
          href="/"
          className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm"
        >
          ← Terug naar Aifais.com
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-4 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Aifais <span className="text-blue-500">Tools</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Krachtige micro-services voor ondernemers. <br />
            Betaal per gebruik, geen contracten.
          </p>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TOOL 1: Factuur Scanner (LIVE) */}
          <Link
            href="/tools/factuur-scanner"
            className="group relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-1 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative bg-[#111] rounded-[22px] p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Factuur Scanner</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">
                Sleep PDF facturen en krijg direct een Excel export. Met KvK
                check.
              </p>
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <span className="text-xs font-mono text-green-400 bg-green-900/20 px-2 py-1 rounded">
                  LIVE
                </span>
                <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-blue-400">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* TOOL 2: Factuur Maker (NIEUW & GRATIS) */}
          <Link
            href="/tools/factuur-aanmaken"
            className="group relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-1 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative bg-[#111] rounded-[22px] p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Factuur Maker</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">
                Maak gratis professionele PDF facturen. Snel, simpel en zonder
                account.
              </p>
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <span className="text-xs font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                  GRATIS
                </span>
                <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-blue-400">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* TOOL 3: Incasso (Coming Soon) */}
          <div className="relative bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 opacity-60">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4 text-gray-500">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-500">
              Incasso Generator
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Juridische brieven genereren met AI.
            </p>
            <span className="text-xs border border-gray-700 text-gray-500 px-2 py-1 rounded inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> Binnenkort
            </span>
          </div>

          {/* TOOL 4: Offerte (Coming Soon) */}
          <div className="relative bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 opacity-60">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4 text-gray-500">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-500">Offerte AI</h3>
            <p className="text-gray-600 text-sm mb-4">
              Overtuigende offertes op basis van steekwoorden.
            </p>
            <span className="text-xs border border-gray-700 text-gray-500 px-2 py-1 rounded inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> Binnenkort
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
