import { Metadata } from "next";
import Link from "next/link";
import {
  ScanLine,
  Scale,
  Mail,
  ArrowRight,
  CheckCircle2,
  Lock,
  PenTool,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Aifais Tools | Slimme AI Software voor MKB",
  description:
    "Direct aan de slag met onze AI tools. Factuur scanners, juridische checks en meer. Geen abonnement nodig.",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#fbfff1] font-sans text-gray-900 relative overflow-hidden">
      {/* Achtergrond (Light Mode) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3066be10_1px,transparent_1px),linear-gradient(to_bottom,#3066be10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3066be]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navigatie Terug */}
      <nav className="relative z-10 px-6 py-6 max-w-6xl mx-auto">
        <Link
          href="/"
          className="text-gray-500 hover:text-[#3066be] transition flex items-center gap-2 text-sm font-medium"
        >
          ← Terug naar Aifais.com
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-4 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-gray-900">
            Aifais <span className="text-[#3066be]">Tools</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Krachtige micro-services voor ondernemers. <br />
            Betaal per gebruik, geen contracten.
          </p>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TOOL 1: Factuur Scanner (LIVE) */}
          <Link
            href="/tools/invoice-extraction"
            className="group relative bg-white border border-gray-200 rounded-3xl p-1 overflow-hidden hover:border-[#3066be]/50 hover:shadow-xl hover:shadow-[#3066be]/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative bg-white rounded-[22px] p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-[#3066be]/5 rounded-xl flex items-center justify-center mb-4 text-[#3066be] group-hover:bg-[#3066be] group-hover:text-white transition-colors">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#3066be] transition-colors">
                Factuur Scanner
              </h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">
                Sleep PDF facturen en krijg direct een Excel export. Met KvK
                check.
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <span className="text-xs font-mono text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 font-bold">
                  LIVE
                </span>
                <span className="text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-[#3066be]">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* TOOL 2: Factuur Maker (NIEUW & GRATIS) */}
          <Link
            href="/tools/invoice-creation"
            className="group relative bg-white border border-gray-200 rounded-3xl p-1 overflow-hidden hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative bg-white rounded-[22px] p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                Factuur Maker
              </h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">
                Maak gratis professionele PDF facturen. Snel, simpel en zonder
                account.
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <span className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100 font-bold">
                  GRATIS
                </span>
                <span className="text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-purple-600">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* TOOL 3: Incasso (Coming Soon) */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-3xl p-6 opacity-70 cursor-not-allowed">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 text-gray-400">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-500">
              Incasso Generator
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Juridische brieven genereren met AI.
            </p>
            <span className="text-xs border border-gray-200 bg-white text-gray-400 px-2 py-1 rounded inline-flex items-center gap-1 font-medium">
              <Lock className="w-3 h-3" /> Binnenkort
            </span>
          </div>

          {/* TOOL 4: Offerte (Coming Soon) */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-3xl p-6 opacity-70 cursor-not-allowed">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 text-gray-400">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-500">Offerte AI</h3>
            <p className="text-gray-500 text-sm mb-4">
              Overtuigende offertes op basis van steekwoorden.
            </p>
            <span className="text-xs border border-gray-200 bg-white text-gray-400 px-2 py-1 rounded inline-flex items-center gap-1 font-medium">
              <Lock className="w-3 h-3" /> Binnenkort
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
