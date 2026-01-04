import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";

const h1_font = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCP Server Setup | AIFAIS Developers",
  description: "Configureer de AIFAIS MCP server voor je AI agents. Directe integratie met Cursor, Claude Desktop en meer.",
};

export default function MCPPage() {
  return (
    <main className="bg-slate-50 min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/developers" className="text-blue-600 font-bold mb-8 inline-block hover:underline">
          ← Developers Hub
        </Link>
        <h1 className={`${h1_font.className} text-4xl md:text-5xl font-extrabold mb-8 text-slate-900 tracking-tight`}>
          Model Context Protocol (MCP)
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
          AIFAIS ondersteunt het Model Context Protocol (MCP), de nieuwe standaard voor tool use door AI-modellen. Met onze server geef je je agent direct toegang tot specialistische tools voor de Nederlandse markt.
        </p>

        <div className="space-y-16">
          {/* Quick Setup */}
          <section className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Snelle Configuratie (Claude Desktop)</h2>
            <p className="text-slate-600 mb-6">Voeg de AIFAIS MCP server toe aan je <code className="bg-slate-100 px-1 rounded text-red-600">claude_desktop_config.json</code>:</p>
            
            <pre className="bg-slate-900 p-6 rounded-xl text-sm font-mono text-blue-300 overflow-x-auto">
{`{
  "mcpServers": {
    "aifais": {
      "command": "npx",
      "args": ["-y", "@aifais/mcp-server"],
      "env": {
        "AIFAIS_API_KEY": "your_api_key_here"
      }
    }
  }
}`}
            </pre>
          </section>

          {/* Available Tools */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Beschikbare MCP Tools</h2>
            <div className="grid gap-6">
              {[
                { name: "scan_invoice", desc: "Extracteert gestructureerde data uit facturen/bonnen via LLM-vison. (Live)" },
                { name: "verify_business", desc: "Controleert bedrijfsgegevens direct in het Nederlandse Handelsregister. (Binnenkort)" },
                { name: "analyze_contract", desc: "Analyseert contracten op risico's en ongunstige clausules. (Binnenkort)" }
              ].map(tool => (
                <div key={tool.name} className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">
                    TOOL
                  </div>
                  <div>
                    <h3 className="text-lg font-mono font-bold text-slate-900 mb-1">{tool.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Integration Guides */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Integratie Gidsen</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-blue-600 rounded-3xl text-white">
                <h3 className="text-xl font-bold mb-4">Cursor IDE</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Ga naar <strong>Settings {" > "} Features {" > "} MCP</strong> en voeg de server toe. Cursor herkent direct de tools voor gebruik in Composer en Chat.
                </p>
                <Link href="/developers/docs#cursor" className="text-xs font-bold uppercase tracking-widest border-b border-blue-400 pb-1">
                  View Setup Guide
                </Link>
              </div>
              
              <div className="p-8 bg-slate-900 rounded-3xl text-white">
                <h3 className="text-xl font-bold mb-4">Custom Agents</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Gebruik de MCP SDK (TypeScript/Python) om de AIFAIS server direct aan je eigen agentic framework te koppelen.
                </p>
                <Link href="https://github.com/modelcontextprotocol" target="_blank" className="text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-1">
                  MCP SDK Docs
                </Link>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Hulp nodig bij de setup?</h2>
            <p className="text-slate-600 mb-8">Onze developers staan klaar om je te helpen met de implementatie.</p>
            <Link href="/contact" className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-blue-600 transition-all">
              Contact Developer Support
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
