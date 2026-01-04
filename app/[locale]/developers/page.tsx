import { Metadata } from "next";
import Link from "next/link";
import { SolanaLogo } from "@/app/Components/CustomIcons";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";

const h1_font = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Developers Hub | Build with AIFAIS Infrastructure",
  description: "Agent-Ready Infrastructure voor de Nederlandse markt. Integreer AIFAIS tools direct in je workflows via MCP of onze REST API.",
};

export default async function DevelopersLanding({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  const tools = [
    {
      name: "scan_invoice",
      desc: "Deep-learning factuur extractie met 100% accuraatheid via het x402 protocol.",
      status: "Live",
      type: "MCP / API",
      color: "emerald"
    },
    {
      name: "create_invoice",
      desc: "Genereer professionele PDF facturen via een simpele JSON payload.",
      status: "Live",
      type: "MCP / API",
      color: "cyan"
    },
    {
      name: "check_contract",
      desc: "AI-gedreven contractanalyse op basis van Nederlands recht (0.01 SOL).",
      status: "Live",
      type: "MCP / API",
      color: "violet"
    },
    {
      name: "generate_terms",
      desc: "Genereer juridisch dichte algemene voorwaarden op maat (0.005 SOL).",
      status: "Live",
      type: "MCP / API",
      color: "amber"
    }
  ];

  const features = [
    { icon: "⚡", title: "< 200ms Response", desc: "Geoptimaliseerd voor real-time agent workflows" },
    { icon: "🔐", title: "SOC2 Ready", desc: "Enterprise-grade security & data soevereiniteit" },
    { icon: "🇳🇱", title: "NL Context", desc: "Gebouwd voor Nederlandse wet- en regelgeving" },
    { icon: "💳", title: "X402 Native", desc: "Pay-per-call via Solana of traditionele billing" },
  ];

  return (
    <main className="bg-[#0c0c0c] text-white min-h-screen antialiased selection:bg-emerald-500/30">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[72px_72px]" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[128px]" />

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-5xl mx-auto">
            {/* Terminal-style badge */}
            <div className={`${mono.className} inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs mb-10`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="opacity-50">$</span> npx github:aifais/aifais-mcp-server --status
              <span className="text-emerald-300">OPERATIONAL</span>
            </div>

            {/* Main headline */}
            <h1 className={`${h1_font.className} text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight leading-[0.95]`}>
              <span className="text-white/90">Agent-Ready</span>
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-cyan-400 to-violet-400">
                Infrastructure
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/40 max-w-2xl mb-12 leading-relaxed">
              De eerste Nederlandse infrastructuur gebouwd voor AI Agents.
              Integreer tools direct via MCP of REST API.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <Link
                href={`/${locale}/developers/docs`}
                className="group px-8 py-4 bg-linear-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <span>Start Building</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={`/${locale}/developers/mcp`}
                className={`${mono.className} px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all border border-white/10 hover:border-white/20 flex items-center justify-center gap-3`}
              >
                <span className="text-emerald-400">$</span>
                <span>Explore MCP Server</span>
              </Link>
            </div>

            {/* Protocol badges */}
            <div className={`${mono.className} flex flex-wrap gap-6 text-xs text-white/30`}>
              {["MCP Protocol", "X402 Payments", "REST API", "Webhooks", "TypeScript SDK"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-linear-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-20 border-y border-white/5 bg-white/1">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className={`${mono.className} text-lg font-bold text-white mb-2`}>{feature.title}</h3>
                <p className="text-white/40 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <div className="flex items-end justify-between mb-16">
              <div>
                <div className={`${mono.className} text-emerald-400 text-sm mb-4`}>// Available Tools</div>
                <h2 className={`${h1_font.className} text-4xl md:text-5xl font-bold text-white`}>
                  Plug & Play AI Tools
                </h2>
              </div>
              <Link href={`/${locale}/developers/docs`} className={`${mono.className} hidden md:flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors text-sm`}>
                View all docs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Tools grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool, i) => (
                <div
                  key={i}
                  className="group relative bg-white/2 border border-white/5 rounded-2xl p-8 hover:bg-white/4 hover:border-white/10 transition-all duration-300"
                >
                  {/* Status badge */}
                  <div className="flex justify-between items-start mb-8">
                    <div className={`${mono.className} px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      tool.status === 'Live'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {tool.status}
                    </div>
                    <div className={`${mono.className} text-[10px] text-white/30`}>{tool.type}</div>
                  </div>

                  {/* Tool name */}
                  <h3 className={`${mono.className} text-xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors`}>
                    {tool.name}()
                  </h3>

                  {/* Description */}
                  <p className="text-white/40 text-sm leading-relaxed mb-8">
                    {tool.desc}
                  </p>

                  {/* Arrow link */}
                  <div className="flex items-center gap-2 text-emerald-400/50 group-hover:text-emerald-400 transition-colors">
                    <span className={`${mono.className} text-xs`}>Read docs</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    tool.color === 'emerald' ? 'bg-emerald-500/5' : tool.color === 'amber' ? 'bg-amber-500/5' : 'bg-violet-500/5'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left content */}
              <div>
                <div className={`${mono.className} text-cyan-400 text-sm mb-4`}>// Why AIFAIS</div>
                <h2 className={`${h1_font.className} text-4xl md:text-5xl font-bold mb-8 text-white leading-tight`}>
                  Gebouwd voor
                  <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-violet-400">Agentic Flows</span>
                </h2>

                <p className="text-lg text-white/40 leading-relaxed mb-10">
                  Vergeet complexe enterprise integraties. Met AIFAIS roep je tools aan met simpele JSON schema's.
                  Of je nu Claude, GPT of een open-source agent gebruikt.
                </p>

                {/* Checklist */}
                <div className="space-y-4">
                  {[
                    "MCP Server voor directe Cursor/Claude integratie",
                    "Pay-per-use via Solana (X402) of traditionele billing",
                    "Nederlandse lokale context & data soevereiniteit",
                    "TypeScript & Python SDK beschikbaar"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/60">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Terminal */}
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 blur-2xl rounded-3xl opacity-50" />

                <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  {/* Terminal header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    </div>
                    <div className={`${mono.className} text-xs text-white/30`}>terminal</div>
                    <div className="w-16" />
                  </div>

                  {/* Terminal content */}
                  <div className={`${mono.className} p-6 text-sm leading-relaxed`}>
                    <div className="text-white/30 mb-4"># Scan an invoice with AIFAIS (X402)</div>

                    <div className="text-emerald-400 mb-1">
                      <span className="text-cyan-400">$</span> curl -X POST https://api.aifais.com/v1/scan \
                    </div>
                    <div className="text-white/60 pl-4 mb-1">-H "Content-Type: application/json" \</div>
                    <div className="text-white/60 pl-4 mb-4">-d '{"{"}"invoiceBase64": "...", "signature": "SOL_SIG"{"}"}' </div>

                    <div className="text-white/30 mb-2"># Response (42ms)</div>
                    <div className="text-amber-300">{"{"}</div>
                    <div className="text-white/60 pl-4">"vendor": <span className="text-emerald-300">"Bol.com B.V."</span>,</div>
                    <div className="text-white/60 pl-4">"total": <span className="text-cyan-300">149.99</span>,</div>
                    <div className="text-white/60 pl-4">"vat": <span className="text-cyan-300">26.03</span>,</div>
                    <div className="text-white/60 pl-4">"currency": <span className="text-emerald-300">"EUR"</span></div>
                    <div className="text-amber-300">{"}"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-32 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`${mono.className} text-violet-400 text-sm mb-4`}>// Pricing</div>
            <h2 className={`${h1_font.className} text-4xl md:text-5xl font-bold mb-6 text-white`}>
              Usage-Based Pricing
            </h2>
            <p className="text-xl text-white/40 mb-16">
              Start gratis. Schaal wanneer je klaar bent.
            </p>



            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Pay-per-Tool Card */}
              <div className="relative p-8 rounded-2xl border transition-all bg-linear-to-b from-violet-500/10 to-transparent border-violet-500/30">
                  <div className={`${mono.className} absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-500 text-white text-[10px] font-bold rounded-full uppercase`}>
                    Agent Ready
                  </div>
                  <div className={`${mono.className} text-sm text-white/40 mb-2`}>Pay-per-Tool</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                     <span className={`${h1_font.className} text-3xl font-bold text-white`}>Vanaf 0.001</span>
                     <SolanaLogo className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-white/30">Betaal per gebruik (X402)</div>
              </div>

              {/* Enterprise Card */}
              <div className="relative p-8 rounded-2xl border transition-all bg-white/2 border-white/5 hover:border-white/10">
                  <div className={`${mono.className} text-sm text-white/40 mb-2`}>Enterprise</div>
                  <div className={`${h1_font.className} text-3xl font-bold text-white mb-2`}>Custom</div>
                  <div className="text-sm text-white/30">Volume korting & API keys</div>
              </div>
            </div>

            <Link
              href={`/${locale}/developers/docs#pricing`}
              className={`${mono.className} inline-flex items-center gap-2 mt-12 text-emerald-400 hover:text-emerald-300 transition-colors`}
            >
              View full pricing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-cyan-500/5 to-violet-500/10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[48px_48px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`${mono.className} inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-8`}>
              <span className="text-emerald-400">$</span> npx github:aifais/aifais-mcp-server
            </div>

            <h2 className={`${h1_font.className} text-4xl md:text-6xl font-bold mb-8 text-white`}>
              Ready to Build?
            </h2>

            <p className="text-xl text-white/40 mb-12 leading-relaxed">
              Geen sign-up nodig voor agents. Integreer de MCP server direct in Cursor of Claude en begin vandaag nog.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/developers/docs`}
                className="px-10 py-5 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all shadow-2xl shadow-white/10"
              >
                Get Started
              </Link>
              <Link
                href={`/${locale}/contact`}
                className={`${mono.className} px-10 py-5 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all`}
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
