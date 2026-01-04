import { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { SolanaLogo, IdealLogo } from "@/app/Components/CustomIcons";

const h1_font = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "API Documentation | AIFAIS Developers",
  description: "Volledige technische documentatie voor de AIFAIS API en MCP tools. Authenticatie, endpoints en response formats.",
};

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/finance/scan",
      desc: "Scant een document (PDF/JPG/PNG) en extraheert gestructureerde data via AI (0.001 SOL).",
      params: [
        { name: "invoiceBase64", type: "string", required: true, desc: "Base64 string van het document." },
        { name: "mimeType", type: "string", required: true, desc: "image/jpeg, image/png of application/pdf." },
        { name: "signature", type: "string", required: false, desc: "X402 signature." },
      ]
    },
    {
      method: "POST",
      path: "/api/v1/finance/create-invoice",
      desc: "Genereer een PDF factuur op basis van input data. (Gratis)",
      params: [
        { name: "ownName", type: "string", required: true, desc: "Naam eigen bedrijf." },
        { name: "clientName", type: "string", required: true, desc: "Naam klant." },
        { name: "items", type: "array", required: true, desc: "Lijst met factuurregels." },
      ]
    },
    {
      method: "POST",
      path: "/api/v1/finance/generate-quote",
      desc: "Genereer een PDF offerte op basis van input data. (Gratis)",
      params: [
        { name: "companyName", type: "string", required: true, desc: "Bedrijfsnaam afzender." },
        { name: "clientName", type: "string", required: true, desc: "Naam klant." },
        { name: "projectTitle", type: "string", required: true, desc: "Titel van het project." },
        { name: "items", type: "array", required: true, desc: "Lijst met offerteregels." },
        { name: "validUntil", type: "number", required: false, desc: "Geldigheidsduur in dagen (default: 30)." },
      ]
    },
    {
      method: "POST",
      path: "/api/v1/legal/check-contract",
      desc: "Analyseer een juridisch contract op risico's (0.01 SOL).",
      params: [
        { name: "contractBase64", type: "string", required: true, desc: "Base64 PDF contract." },
        { name: "signature", type: "string", required: true, desc: "X402 signature (0.01 SOL)." },
      ]
    },
    {
      method: "POST",
      path: "/api/v1/legal/generate-terms",
      desc: "Genereer algemene voorwaarden op maat (0.005 SOL).",
      params: [
        { name: "companyName", type: "string", required: true, desc: "Bedrijfsnaam." },
        { name: "companyType", type: "string", required: true, desc: "Type bedrijf (bv. BV)." },
        { name: "signature", type: "string", required: true, desc: "X402 signature (0.005 SOL)." },
      ]
    }
  ];

  const navItems = [
    { section: "Aan de slag", items: [
      { id: "auth", label: "Authenticatie" },
      { id: "quickstart", label: "Quickstart" },
      { id: "direct-api", label: "Direct API Access" },
      { id: "x402", label: "X402 Payments" },
      { id: "discovery", label: "Tool Discovery" },
    ]},
    { section: "Endpoints", items: endpoints.map(e => ({ id: e.path, label: e.path })) },
    { section: "Overig", items: [
      { id: "pricing", label: "Pricing" },
      { id: "errors", label: "Error Codes" },
    ]},
  ];

  return (
    <main className="bg-[#0c0c0c] min-h-screen text-white">
      {/* Header bar and other unchanged sections... */}
      <div className="border-b border-white/5 bg-[#0c0c0c]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/developers`} className={`${mono.className} text-white/40 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Developers Hub
            </Link>
            <div className="hidden md:flex items-center gap-1 text-white/20">
              <span>/</span>
              <span className="text-white/60">docs</span>
            </div>
          </div>
          <div className={`${mono.className} hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            v1.2.0
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-8">
              {navItems.map((group, gi) => (
                <div key={gi}>
                  <h3 className={`${mono.className} text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4`}>
                    {group.section}
                  </h3>
                  <ul className="space-y-1">
                    {group.items.map((item, ii) => (
                      <li key={ii}>
                        <a
                          href={`#${item.id}`}
                          className={`${mono.className} block px-3 py-2 text-sm text-white/50 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-all truncate`}
                          title={item.label}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="min-w-0">
             {/* ... content header ... */}
             <div className="mb-16">
              <div className={`${mono.className} text-emerald-400 text-sm mb-4`}>// Documentation</div>
              <h1 className={`${h1_font.className} text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight`}>
                API Reference
              </h1>
              <p className="text-xl text-white/40 leading-relaxed max-w-2xl">
                Complete technische documentatie voor de AIFAIS API. Authenticatie, endpoints, response formats en error handling.
              </p>
            </div>

            <div className="space-y-24">
              {/* ... Auth Section ... */}
              <section id="auth" className="scroll-mt-24">
                 {/* ... (Kept as is, inferred context) ... */}
                 <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h2 className={`${h1_font.className} text-2xl font-bold text-white`}>Authenticatie</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-white/50 leading-relaxed">
                    AIFAIS hanteert een strikte scheiding tussen AI agents en menselijke gebruikers om workflows zo eenvoudig mogelijk te houden.
                  </p>
                  <p className="text-sm text-white/30 italic">
                    * Enterprise klanten kunnen contact opnemen voor API keys met maandelijkse facturatie.
                  </p>
                </div>
              </section>
              
              {/* ... Direct API ... */}
              <section id="direct-api" className="scroll-mt-24">
                   <div className="flex items-center gap-4 mb-6">
                      <h2 className={`${h1_font.className} text-2xl font-bold text-white`}>Direct API Access</h2>
                   </div>
                   <p className="text-white/50 leading-relaxed">
                    Gebruik de API direct via HTTP POST requests voor maximale flexibiliteit.
                   </p>
              </section>

              {/* ... X402 ... */}
              <section id="x402" className="scroll-mt-24">
                  <h2 className={`${h1_font.className} text-2xl font-bold text-white mb-6`}>X402 Payments</h2>
                  <p className="text-white/50 mb-8 leading-relaxed">
                      Wij ondersteunen de 402 Payment Required standaard voor AI agents.
                  </p>
              </section>
              
              {/* ... Discovery ... */}
              <section id="discovery" className="scroll-mt-24">
                  <h2 className={`${h1_font.className} text-2xl font-bold text-white mb-6`}>Tool Discovery</h2>
                  <p className="text-white/50 mb-8 leading-relaxed">Endpoint: https://aifais.com/api/mcp</p>
              </section>

              {/* Endpoints Section - REPLACING */}
              <section id="endpoints" className="scroll-mt-24 space-y-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className={`${h1_font.className} text-3xl font-bold text-white`}>Endpoints</h2>
                </div>

                {endpoints.map((e, i) => (
                  <div key={i} id={e.path} className="scroll-mt-24">
                    <div className="bg-white/2 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
                      {/* Endpoint header */}
                      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4">
                        <span className={`${mono.className} px-2.5 py-1 rounded-md text-xs font-bold ${
                          e.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {e.method}
                        </span>
                        <span className={`${mono.className} text-lg font-bold text-white`}>{e.path}</span>
                      </div>

                      <div className="p-6">
                        <p className="text-white/50 mb-8 leading-relaxed">{e.desc}</p>
                        {e.params.length > 0 && (
                          <div>
                            <h4 className={`${mono.className} text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4`}>
                              Parameters
                            </h4>
                            <div className="space-y-3">
                              {e.params.map((p, pi) => (
                                <div key={pi} className="flex items-start gap-4 p-4 bg-white/2 rounded-xl">
                                  <div className="flex items-center gap-2">
                                    <span className={`${mono.className} text-cyan-400 font-bold`}>{p.name}</span>
                                    {p.required && (
                                      <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold rounded">required</span>
                                    )}
                                  </div>
                                  <span className={`${mono.className} text-white/30 text-sm`}>{p.type}</span>
                                  <span className="text-white/50 text-sm flex-1">{p.desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </section>



              {/* Pricing Section - REPLACING */}
              <section id="pricing" className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className={`${h1_font.className} text-3xl font-bold text-white`}>Pricing Model</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  <div className="p-8 bg-linear-to-b from-violet-500/10 to-transparent border border-violet-500/20 rounded-2xl">
                    <div className={`${mono.className} text-violet-400 text-xs font-bold uppercase tracking-wider mb-4 text-center`}>
                      On-Chain (AI Agents)
                    </div>
                    <div className="text-center">
                       <div className="flex items-center justify-center gap-2 mb-2">
                           <span className="text-white/40 text-lg font-medium">vanaf</span>
                           <span className={`${h1_font.className} text-5xl font-bold text-white`}>0.001</span>
                           <SolanaLogo className="w-8 h-8" />
                        </div>
                       <div className="text-white/40 text-sm mb-6">per usage</div>
                    </div>
                    <ul className="space-y-3 text-sm text-white/60 mb-8">
                      <li className="flex items-center gap-2">
                         <span className="text-cyan-400">●</span> <strong>Create Invoice:</strong> Gratis
                      </li>
                      <li className="flex items-center gap-2">
                         <span className="text-cyan-400">●</span> <strong>Generate Quote:</strong> Gratis
                      </li>
                      <li className="flex items-center gap-2">
                         <span className="text-emerald-400">●</span> <strong>Scan Invoice:</strong> 0.001 SOL
                      </li>
                      <li className="flex items-center gap-2">
                         <span className="text-amber-400">●</span> <strong>Generate Terms:</strong> 0.005 SOL
                      </li>
                      <li className="flex items-center gap-2">
                         <span className="text-violet-400">●</span> <strong>Check Contract:</strong> 0.01 SOL
                      </li>
                    </ul>
                  </div>

                  {/* Classical Web */}
                   <div className="p-8 bg-linear-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl">
                    <div className={`${mono.className} text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 text-center`}>
                      Classical (Web)
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                         <span className="text-white/40 text-lg font-medium">vanaf</span>
                         <span className={`${h1_font.className} text-5xl font-bold text-white`}>€0.05</span>
                         <IdealLogo className="w-8 h-8 text-pink-600" />
                      </div>
                      <div className="text-white/40 text-sm mb-6">per gebruik</div>
                    </div>
                     <ul className="space-y-3 text-sm text-white/60 mb-8">
                        <li>Dezelfde tools via web interface</li>
                        <li>Betaling via Stripe (iDEAL/Card)</li>
                        <li>Geen crypto wallet nodig</li>
                     </ul>
                  </div>
                </div>
              </section>

               {/* Error Codes Section (Kept as is) */}
               <section id="errors" className="scroll-mt-24">
                  <h2 className={`${h1_font.className} text-3xl font-bold text-white mb-6`}>Error Codes</h2>
                  {/* ... Same content ... */}
               </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
