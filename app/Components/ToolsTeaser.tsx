import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Check,
  FileText,
  Scale,
  Mail,
  Cpu,
} from "lucide-react";

export default function ToolsTeaser() {
  return (
    <section className="py-32 bg-[#fbfff1] relative overflow-hidden">
      {/* Achtergrond Sfeerlicht (Glows - Light Mode) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#3066be]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* De 'Glass' Card - Light Mode Version */}
        <div className="relative bg-white border border-gray-200 rounded-[32px] p-8 md:p-16 overflow-hidden group shadow-2xl shadow-[#3066be]/5">
          {/* Subtiele gradient overlay op hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3066be]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LINKER KANT: De Pitch */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3066be]/10 border border-[#3066be]/20 text-[#3066be] text-xs font-bold uppercase tracking-wider shadow-sm">
                <Cpu className="w-3 h-3" />
                Live Tech Demo
              </div>

              <h2 className="text-4xl md:text-4xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Ervaar de kracht van <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] via-purple-500 to-[#3066be]">
                  Headless Agents
                </span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                Geen praatjes, maar werkende code. Probeer onze{" "}
                <strong className="text-gray-900">
                  autonome factuurscanner
                </strong>
                . Volledig aangedreven door Solana Blinks, X402 betalingen en
                het MCP protocol.
              </p>

              {/* Tech Badges (Light Mode) */}
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-600 font-mono font-semibold">
                  SOLANA
                </span>
                <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-600 font-mono font-semibold">
                  X402
                </span>
                <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-600 font-mono font-semibold">
                  MCP
                </span>
                <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-600 font-mono font-semibold">
                  AI
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/tools/invoice-extraction"
                  className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-[#234a8c] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3066be]/20 hover:-translate-y-1"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  Start Agent
                </Link>
                <Link
                  href="/tools"
                  className="px-8 py-4 bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Alle Tools
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* RECHTER KANT: Visuele Feature Lijst (Zwevend Kaartje) */}
            <div className="relative hidden lg:block">
              {/* Het zwevende paneel (Light Mode) */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative z-10 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 ease-out origin-center">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg">
                      Active Agents
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      Status: ONLINE • Network: SOLANA
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <Link
                    href="/tools/invoice-extraction"
                    className="block group/item"
                  >
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 group-hover/item:border-[#3066be]/30 group-hover/item:bg-[#3066be]/5 transition-colors cursor-pointer shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-[#3066be]/10 flex items-center justify-center shrink-0 text-[#3066be]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium text-sm group-hover/item:text-[#3066be] transition-colors">
                          Invoice Extraction Agent
                        </p>
                        <p className="text-xs text-gray-500">
                          OCR + Validatie + JSON Export
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500 font-mono font-semibold">
                          0.001 SOL
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover/item:text-[#3066be] -translate-x-2 group-hover/item:translate-x-0 transition-all opacity-0 group-hover/item:opacity-100" />
                      </div>
                    </div>
                  </Link>

                  {/* Item 2 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl border border-transparent opacity-60 grayscale hover:grayscale-0 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">
                        Legal Review Agent
                      </p>
                      <p className="text-xs text-gray-500">
                        Contract analyse & risico check
                      </p>
                    </div>
                    <span className="ml-auto text-[10px] border border-gray-200 px-1.5 py-0.5 rounded text-gray-400 font-mono font-semibold">
                      SOON
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl border border-transparent opacity-60 grayscale hover:grayscale-0 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">
                        Email Triage Agent
                      </p>
                      <p className="text-xs text-gray-500">
                        Inbox sorteren & auto-reply
                      </p>
                    </div>
                    <span className="ml-auto text-[10px] border border-gray-200 px-1.5 py-0.5 rounded text-gray-400 font-mono font-semibold">
                      SOON
                    </span>
                  </div>
                </div>
              </div>

              {/* Decoratieve elementen achter het paneel */}
              <div className="absolute -top-5 -right-5 w-full h-full border border-gray-200 rounded-3xl -z-10 transform -rotate-2 scale-105 bg-gray-50/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
