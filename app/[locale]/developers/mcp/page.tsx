import { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

const heading = Space_Grotesk({
  weight: ["600", "700"],
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCP Server Setup | AIFAIS Developers",
  description:
    "Configure the AIFAIS MCP server for AI agents. Direct integration with Cursor, Claude Desktop, and more.",
};

// ============================================================================
// CONFIGURATION
// ============================================================================

import { API_ENDPOINTS, APIEndpoint } from "@/config/apis";

// ... (other imports)

// Use the types and constants from config
const tools = API_ENDPOINTS.filter(t => t.status === "live");

const platforms = [
  { name: "Claude Desktop", supported: true },
  { name: "Cursor IDE", supported: true },
  { name: "VS Code", supported: true },
  { name: "Custom Agents", supported: true },
];

// ============================================================================
// COMPONENTS
// ============================================================================

import CopyButton from "@/app/Components/CopyButton";

function ToolCard({ tool }: { tool: APIEndpoint }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {tool.status === "live" ? (
            <span className={`${mono.className} px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold rounded border border-emerald-500/20`}>
              LIVE
            </span>
          ) : (
            <span className={`${mono.className} px-2 py-0.5 bg-zinc-500/10 text-zinc-400 text-[10px] font-semibold rounded border border-zinc-500/20`}>
              COMING
            </span>
          )}
        </div>
        <span className={`${mono.className} text-xs ${tool.isFree ? "text-cyan-400" : "text-zinc-500"}`}>
          {tool.price}
        </span>
      </div>
      <h3 className={`${mono.className} text-base font-semibold text-white mb-2`}>{tool.name}()</h3>
      <p className="text-sm text-zinc-500">{tool.description}</p>
    </div>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <span className={`${mono.className} text-sm font-semibold text-emerald-400`}>{step}</span>
        </div>
      </div>
      <div className="flex-1">
        <h4 className={`${heading.className} font-semibold text-white mb-2`}>{title}</h4>
        <div className="text-sm text-zinc-400">{children}</div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default async function MCPPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const installCommand = "https://aifais.com/api/mcp";
  const liveTools = tools.filter((t) => t.status === "live");

  return (
    <main className="bg-zinc-950 min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/developers`}
              className={`${mono.className} text-zinc-500 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Developers
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-400">mcp</span>
          </div>
          <div className={`${mono.className} hidden sm:flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs`}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            MCP Protocol
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[128px]" />
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <p className={`${mono.className} text-violet-400 text-sm mb-4`}>// Model Context Protocol</p>
          <h1 className={`${heading.className} text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight`}>
            <span className="text-white">MCP Server</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400">
              voor AI Agents
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mb-10">
            Direct integration met Claude Desktop en Cursor IDE via het Model Context Protocol. 
            Geen API key nodig - betaal per gebruik via Solana.
          </p>

          {/* Install command */}
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 blur-xl rounded-xl opacity-50" />
            <div className={`${mono.className} relative bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex items-center justify-between gap-4`}>
              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="text-emerald-400">URL:</span>
                <code className="text-white whitespace-nowrap">{installCommand}</code>
              </div>
              <CopyButton text={installCommand} />
            </div>
          </div>

          {/* Info box */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 mb-8">
            <div className="flex gap-4">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className={`${mono.className} font-semibold text-emerald-400 mb-1`}>No API Key Required</h4>
                <p className="text-sm text-zinc-400">
                  Betalingen worden per call afgehandeld via het X402 protocol op Solana. Connect via SSE.
                </p>
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className={`${mono.className} flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-400`}
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {platform.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="py-20 border-t border-zinc-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Claude Desktop */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className={`${heading.className} text-xl font-bold text-white`}>Claude Desktop</h2>
                  <p className={`${mono.className} text-sm text-zinc-500`}>claude_desktop_config.json</p>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  </div>
                  <span className={`${mono.className} text-xs text-zinc-600`}>JSON</span>
                </div>
                <pre className={`${mono.className} p-5 text-sm leading-relaxed overflow-x-auto`}>
                  <code>
                    <span className="text-zinc-600">{"{"}</span>{"\n"}
                    <span className="text-violet-400 pl-2">"mcpServers"</span><span className="text-zinc-600">: {"{"}</span>{"\n"}
                    <span className="text-cyan-400 pl-4">"aifais"</span><span className="text-zinc-600">: {"{"}</span>{"\n"}
                    <span className="text-emerald-400 pl-6">"url"</span><span className="text-zinc-600">: </span><span className="text-amber-400">"https://aifais.com/api/mcp"</span><span className="text-zinc-600">,</span>{"\n"}
                    <span className="text-emerald-400 pl-6">"transport"</span><span className="text-zinc-600">: </span><span className="text-amber-400">"sse"</span>{"\n"}
                    <span className="text-zinc-600 pl-4">{"}"}</span>{"\n"}
                    <span className="text-zinc-600 pl-2">{"}"}</span>{"\n"}
                    <span className="text-zinc-600">{"}"}</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* Cursor IDE */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className={`${heading.className} text-xl font-bold text-white`}>Cursor IDE</h2>
                  <p className={`${mono.className} text-sm text-zinc-500`}>Settings → Features → MCP</p>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                <StepCard step={1} title="Open Settings">
                  <p>Ga naar <code className={`${mono.className} px-2 py-0.5 bg-zinc-800 rounded text-cyan-400`}>Settings → Features → MCP</code></p>
                </StepCard>
                <StepCard step={2} title="Add MCP Server">
                  <p>Klik op "Add MCP Server" en selecteer type "SSE"</p>
                </StepCard>
                <StepCard step={3} title="Enter Command">
                  <p>Voer in: <code className={`${mono.className} px-2 py-0.5 bg-zinc-800 rounded text-cyan-400`}>{installCommand}</code></p>
                </StepCard>
                <StepCard step={4} title="Done!">
                  <p>Cursor herkent nu automatisch de AIFAIS tools</p>
                </StepCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tools */}
      <section className="py-20 border-t border-zinc-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className={`${mono.className} text-emerald-400 text-sm mb-2`}>// Available Tools</p>
          <h2 className={`${heading.className} text-3xl font-bold text-white mb-8`}>
            {liveTools.length} Tools Beschikbaar
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* More Integrations */}
      <section className="py-20 border-t border-zinc-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className={`${mono.className} text-cyan-400 text-sm mb-2`}>// More Options</p>
          <h2 className={`${heading.className} text-3xl font-bold text-white mb-8`}>Andere Integraties</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              href={`/${locale}/developers/docs`}
              className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`${heading.className} text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors`}>
                REST API Documentation
              </h3>
              <p className="text-sm text-zinc-500">
                Volledige API reference met alle endpoints, parameters en voorbeelden.
              </p>
            </Link>

            <a
              href="https://github.com/modelcontextprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className={`${heading.className} text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors`}>
                MCP SDK
              </h3>
              <p className="text-sm text-zinc-500">
                Gebruik de TypeScript of Python SDK voor custom agent integraties.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-emerald-500/5" />

        <div className="container mx-auto px-6 max-w-2xl relative z-10 text-center">
          <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className={`${heading.className} text-2xl sm:text-3xl font-bold text-white mb-4`}>
            Hulp nodig bij de setup?
          </h2>
          <p className="text-zinc-400 mb-8">
            We kunnen ook custom integraties bouwen voor jouw specifieke use case.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="px-6 py-3 bg-white text-zinc-900 font-semibold rounded-xl hover:bg-zinc-100 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href={`/${locale}/developers/docs`}
              className={`${mono.className} px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl hover:bg-zinc-800 transition-colors`}
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}