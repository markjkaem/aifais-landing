import { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { getTranslations } from "next-intl/server";

const h1_font = Space_Grotesk({
  weight: "700",
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
      type: "MCP / API"
    },
    {
      name: "verify_business",
      desc: "Directe verificatie van KvK gegevens en BTW nummers.",
      status: "Coming Soon",
      type: "MCP"
    },
    {
      name: "analyze_contract",
      desc: "AI-gedreven contractanalyse op basis van Nederlands recht.",
      status: "Coming Soon",
      type: "MCP"
    }
  ];

  return (
    <main className="bg-[#0f172a] text-white min-h-screen antialiased selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] opacity-50"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            X402 & MCP COMPLIANT
          </div>
          
          <h1 className={`${h1_font.className} text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight`}>
            Agent-Ready <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">Infrastructure</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            De eerste Nederlandse infrastructuur gebouwd voor AI Agents. Integreer krachtige tools direct via het Model Context Protocol of onze robust REST API.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/developers/docs`} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
              Start Building
            </Link>
            <Link href={`/${locale}/developers/mcp`} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700">
              Explore MCP Server
            </Link>
          </div>
          
          <div className="mt-16 opacity-50 grayscale hover:grayscale-0 transition-all flex flex-wrap justify-center gap-12 items-center">
            <span className="font-bold text-2xl tracking-tighter">MCP</span>
            <span className="font-bold text-2xl tracking-tighter">X402</span>
            <span className="font-bold text-2xl tracking-tighter">REST</span>
            <span className="font-bold text-2xl tracking-tighter">Webhooks</span>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Beschikbare Tools</h2>
            <p className="text-slate-400">Direct inzetbaar in je eigen LLM applicaties of AI agents.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool, i) => (
              <div key={i} className="group p-8 bg-slate-800/50 border border-slate-700 rounded-3xl hover:border-blue-500/50 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${tool.status === 'Live' ? 'bg-green-500/10 text-green-400' : tool.status === 'Beta' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'}`}>
                    {tool.status}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">{tool.type}</div>
                </div>
                <h3 className="text-xl font-mono font-bold mb-4 group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {tool.desc}
                </p>
                <Link href={`/${locale}/developers/docs#${tool.name}`} className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  Documentatie →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Gebouwd voor <br/>Snelheid & Agentic Flows</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Vergeet complexe enterprise integraties. Met AIFAIS roep je tools aan met simpele JSON schema's. Of je nu Claude, GPT of een open-source agent gebruikt.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-blue-500/10 rounded flex items-center justify-center text-blue-400">✓</div>
                  <span className="text-slate-300">MCP Server compliant voor directe Cursor/Claude desktop integratie</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-blue-500/10 rounded flex items-center justify-center text-blue-400">✓</div>
                  <span className="text-slate-300">Pay-per-use via Solana (X402) of traditionele billing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-blue-500/10 rounded flex items-center justify-center text-blue-400">✓</div>
                  <span className="text-slate-300">Nederlandse lokale context & data soevereiniteit</span>
                </li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-20"></div>
              <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-1 shadow-2xl overflow-hidden">
                <div className="flex gap-2 p-4 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
                  <code className="text-blue-300">
{`curl -X POST https://aifais.com/api/v1/scan \\
  -H "Content-Type: application/json" \\
  -d '{
    "invoiceBase64": "...",
    "mimeType": "application/pdf"
  }'`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Klaar om te bouwen?</h2>
          <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto">
            Krijg direct toegang tot 100 gratis API calls en begin vandaag nog met het automatiseren van Nederlandse MKB workflows.
          </p>
          <Link href="/contact" className="px-10 py-5 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl">
            Start met Gratis API Calls
          </Link>
        </div>
      </section>
    </main>
  );
}
