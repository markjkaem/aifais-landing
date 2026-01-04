import { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

const h1_font = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCP Server Setup | AIFAIS Developers",
  description: "Configureer de AIFAIS MCP server voor je AI agents. Directe integratie met Cursor, Claude Desktop en meer.",
};

export default function MCPPage() {
  const tools = [
    {
      name: "scan_invoice",
      desc: "Extracteert gestructureerde data uit facturen/bonnen via LLM-vision.",
      status: "Live",
      color: "emerald"
    },
    {
      name: "verify_business",
      desc: "Controleert bedrijfsgegevens direct in het Nederlandse Handelsregister.",
      status: "Coming Soon",
      color: "amber"
    },
    {
      name: "analyze_contract",
      desc: "Analyseert contracten op risico's en ongunstige clausules.",
      status: "Coming Soon",
      color: "violet"
    }
  ];

  return (
    <main className="bg-[#0c0c0c] min-h-screen text-white">
      {/* Header bar */}
      <div className="border-b border-white/5 bg-[#0c0c0c]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/developers" className={`${mono.className} text-white/40 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Developers Hub
            </Link>
            <div className="hidden md:flex items-center gap-1 text-white/20">
              <span>/</span>
              <span className="text-white/60">mcp</span>
            </div>
          </div>
          <div className={`${mono.className} hidden md:flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs`}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            MCP Protocol
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className={`${mono.className} text-violet-400 text-sm mb-6`}>// Model Context Protocol</div>

          <h1 className={`${h1_font.className} text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight leading-[1.1]`}>
            MCP Server
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400">
              voor AI Agents
            </span>
          </h1>

          <p className="text-xl text-white/40 mb-12 leading-relaxed max-w-2xl">
            AIFAIS ondersteunt het Model Context Protocol (MCP), de nieuwe standaard voor tool use door AI-modellen.
            Met onze server geef je je agent direct toegang tot specialistische tools voor de Nederlandse markt.
          </p>

          {/* Quick install */}
          <div className="relative mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-emerald-500/20 blur-xl rounded-2xl opacity-50" />
            <div className={`${mono.className} relative bg-[#0a0a0a] rounded-xl border border-white/10 p-4 flex items-center justify-between gap-4`}>
              <div className="flex items-center gap-4 overflow-x-auto">
                <span className="text-violet-400">$</span>
                <code className="text-white/80 whitespace-nowrap">npx -y @aifais/mcp-server</code>
              </div>
              <button className="shrink-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </div>

          {/* Supported platforms */}
          <div className="flex flex-wrap gap-4">
            {["Claude Desktop", "Cursor IDE", "Custom Agents", "VS Code"].map((platform, i) => (
              <div key={i} className={`${mono.className} flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-white/60`}>
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Configuration Section */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Claude Desktop Config */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className={`${h1_font.className} text-2xl font-bold text-white`}>Claude Desktop</h2>
                  <p className={`${mono.className} text-white/40 text-sm`}>claude_desktop_config.json</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-violet-500/10 blur-xl rounded-2xl opacity-50" />
                <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    </div>
                    <div className={`${mono.className} text-xs text-white/30`}>JSON</div>
                  </div>

                  <pre className={`${mono.className} p-6 text-sm leading-relaxed overflow-x-auto`}>
                    <code>
                      <span className="text-white/30">{"{"}</span>{"\n"}
                      <span className="text-violet-400 pl-4">"mcpServers"</span><span className="text-white/30">: {"{"}</span>{"\n"}
                      <span className="text-cyan-400 pl-8">"aifais"</span><span className="text-white/30">: {"{"}</span>{"\n"}
                      <span className="text-emerald-400 pl-12">"command"</span><span className="text-white/30">: </span><span className="text-amber-300">"npx"</span><span className="text-white/30">,</span>{"\n"}
                      <span className="text-emerald-400 pl-12">"args"</span><span className="text-white/30">: [</span><span className="text-amber-300">"-y"</span><span className="text-white/30">, </span><span className="text-amber-300">"@aifais/mcp-server"</span><span className="text-white/30">],</span>{"\n"}
                      <span className="text-emerald-400 pl-12">"env"</span><span className="text-white/30">: {"{"}</span>{"\n"}
                      <span className="text-violet-400 pl-16">"AIFAIS_API_KEY"</span><span className="text-white/30">: </span><span className="text-amber-300">"your_key"</span>{"\n"}
                      <span className="text-white/30 pl-12">{"}"}</span>{"\n"}
                      <span className="text-white/30 pl-8">{"}"}</span>{"\n"}
                      <span className="text-white/30 pl-4">{"}"}</span>{"\n"}
                      <span className="text-white/30">{"}"}</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Cursor IDE Config */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className={`${h1_font.className} text-2xl font-bold text-white`}>Cursor IDE</h2>
                  <p className={`${mono.className} text-white/40 text-sm`}>Settings → Features → MCP</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 h-[calc(100%-80px)]">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-1">
                      <span className={`${mono.className} text-cyan-400 text-sm font-bold`}>1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Open Settings</h4>
                      <p className="text-white/50 text-sm">Ga naar <code className={`${mono.className} bg-white/5 px-2 py-0.5 rounded text-cyan-400`}>Settings → Features → MCP</code></p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-1">
                      <span className={`${mono.className} text-cyan-400 text-sm font-bold`}>2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Add Server</h4>
                      <p className="text-white/50 text-sm">Klik op "Add MCP Server" en voeg <code className={`${mono.className} bg-white/5 px-2 py-0.5 rounded text-cyan-400`}>@aifais/mcp-server</code> toe</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-1">
                      <span className={`${mono.className} text-cyan-400 text-sm font-bold`}>3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Configure API Key</h4>
                      <p className="text-white/50 text-sm">Voeg je <code className={`${mono.className} bg-white/5 px-2 py-0.5 rounded text-cyan-400`}>AIFAIS_API_KEY</code> toe aan de environment variables</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Ready!</h4>
                      <p className="text-white/50 text-sm">Cursor herkent nu automatisch de AIFAIS tools in Composer en Chat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tools Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className={`${mono.className} text-emerald-400 text-sm mb-4`}>// Available MCP Tools</div>
          <h2 className={`${h1_font.className} text-4xl font-bold mb-12 text-white`}>
            Beschikbare Tools
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                {/* Status badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`${mono.className} px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    tool.status === 'Live'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {tool.status}
                  </div>
                  <div className={`${mono.className} text-[10px] text-white/30`}>MCP</div>
                </div>

                {/* Tool icon */}
                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${
                  tool.color === 'emerald' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                  tool.color === 'amber' ? 'bg-amber-500/10 border border-amber-500/20' :
                  'bg-violet-500/10 border border-violet-500/20'
                }`}>
                  <span className={`${mono.className} text-xs font-bold ${
                    tool.color === 'emerald' ? 'text-emerald-400' :
                    tool.color === 'amber' ? 'text-amber-400' :
                    'text-violet-400'
                  }`}>
                    fn
                  </span>
                </div>

                {/* Tool name */}
                <h3 className={`${mono.className} text-lg font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors`}>
                  {tool.name}()
                </h3>

                {/* Description */}
                <p className="text-white/40 text-sm leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Guides */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className={`${mono.className} text-cyan-400 text-sm mb-4`}>// Integration Guides</div>
          <h2 className={`${h1_font.className} text-4xl font-bold mb-12 text-white`}>
            Meer Integraties
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Custom Agents Card */}
            <div className="group relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`${h1_font.className} text-2xl font-bold mb-4 text-white`}>Custom Agents</h3>
                <p className="text-white/50 leading-relaxed mb-6">
                  Gebruik de MCP SDK (TypeScript/Python) om de AIFAIS server direct aan je eigen agentic framework te koppelen.
                </p>
                <Link
                  href="https://github.com/modelcontextprotocol"
                  target="_blank"
                  className={`${mono.className} inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm`}
                >
                  MCP SDK Documentation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* REST API Card */}
            <div className="group relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`${h1_font.className} text-2xl font-bold mb-4 text-white`}>REST API</h3>
                <p className="text-white/50 leading-relaxed mb-6">
                  Prefer REST over MCP? Onze volledige API documentatie bevat alle endpoints, parameters en voorbeelden.
                </p>
                <Link
                  href="/developers/docs"
                  className={`${mono.className} inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors text-sm`}
                >
                  View API Docs
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-cyan-500/5 to-emerald-500/5" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className={`${h1_font.className} text-3xl md:text-4xl font-bold mb-6 text-white`}>
            Hulp nodig bij de setup?
          </h2>
          <p className="text-xl text-white/40 mb-10 leading-relaxed">
            Onze developers staan klaar om je te helpen met de implementatie.
            We kunnen ook een custom integratie bouwen voor jouw specifieke use case.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
            >
              Contact Developer Support
            </Link>
            <Link
              href="/developers/docs"
              className={`${mono.className} px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all`}
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
