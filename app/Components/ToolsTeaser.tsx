import Link from "next/link";
import {
  ArrowRight,
  Zap,
  FileText,
  Scale,
  Mail,
  Calculator,
  PenTool,
  CircleDot,
  Lock,
  Sparkles,
} from "lucide-react";

export default function ToolsTeaser() {
  return (
    <section className="py-28 bg-slate-50/50 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-50 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-slate-300 to-transparent" />
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
              Tools
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                Praktische tools,{" "}
                <span className="text-slate-400">direct bruikbaar</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-xl">
                Van gratis calculators tot geavanceerde API's. Geen account
                nodig.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group shrink-0"
            >
              Bekijk alle tools
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Featured: Invoice Scanner API - Takes 3 columns */}
          <Link
            href="/tools/invoice-extraction"
            className="lg:col-span-3 group"
          >
            <div className="h-full bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/[0.04] transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/60">
                      <Sparkles className="w-3 h-3" />
                      Live API
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
                  Factuur Scanner
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                  Sleep facturen, krijg gestructureerde data. Met KvK
                  verificatie en Excel export. Een showcase tool die draait op
                  blockchain infrastructuur.
                </p>

                {/* Tech Stack - Only for this card */}
                <div className="pt-5 border-t border-slate-100">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-3">
                    Blockchain Stack
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 font-mono font-semibold">
                      SOLANA
                    </span>
                    <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 font-mono font-semibold">
                      X402 Protocol
                    </span>
                    <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 font-mono font-semibold">
                      MCP Server
                    </span>
                    <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 font-mono font-semibold">
                      0.001 SOL/scan
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs text-slate-500 font-medium">
                        Online
                      </span>
                    </div>
                    <span className="text-sm font-medium text-sky-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Probeer nu
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Right Column: Free Tools - Takes 2 columns */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* ROI Calculator */}
            <Link href="/tools/roi-calculator" className="group flex-1">
              <div className="h-full bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/[0.04] transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                    <Calculator className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-800 transition-colors">
                        Besparings Calculator
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 uppercase tracking-wide">
                        Gratis
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Bereken je ROI op automatisering
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Invoice Creator */}
            <Link href="/tools/invoice-creation" className="group flex-1">
              <div className="h-full bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/[0.04] transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-500 group-hover:text-white transition-colors shrink-0">
                    <PenTool className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-800 transition-colors">
                        Factuur Maker
                      </h3>
                      <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200/60 uppercase tracking-wide">
                        Gratis
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      PDF facturen in je browser
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Coming Soon: Stacked */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Binnenkort
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-500 font-medium">
                    Incasso Generator
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-500 font-medium">
                    Offerte AI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
