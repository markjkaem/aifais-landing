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
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Achtergrond Sfeerlicht (Glows) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* De 'Glass' Card */}
        <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[32px] p-8 md:p-16 overflow-hidden group">
          {/* Subtiele gradient overlay op hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LINKER KANT: De Pitch */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <Cpu className="w-3 h-3" />
                Live Tech Demo
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                Ervaar de kracht van <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white">
                  Headless Agents
                </span>
              </h2>

              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Geen praatjes, maar werkende code. Probeer onze{" "}
                <strong>autonome factuurscanner</strong>. Volledig aangedreven
                door Solana Blinks, X402 betalingen en het MCP protocol.
              </p>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-gray-400 font-mono">
                  SOLANA
                </span>
                <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-gray-400 font-mono">
                  X402
                </span>
                <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-gray-400 font-mono">
                  MCP
                </span>
                <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-gray-400 font-mono">
                  AI
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/tools/invoice-extraction"
                  className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  Start Agent
                </Link>
                <Link
                  href="/tools"
                  className="px-8 py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-sm group/btn"
                >
                  Alle Tools
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* RECHTER KANT: Visuele Feature Lijst (Zwevend Kaartje) */}
            <div className="relative hidden lg:block">
              {/* Het zwevende paneel */}
              <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 ease-out origin-center">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div>
                    <h4 className="text-white font-bold text-lg">
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
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 group-hover/item:border-purple-500/50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm group-hover/item:text-purple-300 transition-colors">
                          Invoice Extraction Agent
                        </p>
                        <p className="text-xs text-gray-500">
                          OCR + Validatie + JSON Export
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-gray-400 font-mono">
                          0.001 SOL
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover/item:text-purple-400 -translate-x-2 group-hover/item:translate-x-0 transition-all opacity-0 group-hover/item:opacity-100" />
                      </div>
                    </div>
                  </Link>

                  {/* Item 2 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl border border-transparent opacity-60">
                    <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center shrink-0 text-gray-400">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        Legal Review Agent
                      </p>
                      <p className="text-xs text-gray-500">
                        Contract analyse & risico check
                      </p>
                    </div>
                    <span className="ml-auto text-[10px] border border-gray-700 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                      SOON
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl border border-transparent opacity-60">
                    <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center shrink-0 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        Email Triage Agent
                      </p>
                      <p className="text-xs text-gray-500">
                        Inbox sorteren & auto-reply
                      </p>
                    </div>
                    <span className="ml-auto text-[10px] border border-gray-700 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                      SOON
                    </span>
                  </div>
                </div>
              </div>

              {/* Decoratieve elementen achter het paneel */}
              <div className="absolute -top-5 -right-5 w-full h-full border border-white/5 rounded-3xl -z-10 transform -rotate-2 scale-105" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
