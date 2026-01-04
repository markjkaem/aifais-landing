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
  title: "API Documentation | AIFAIS Developers",
  description: "Volledige technische documentatie voor de AIFAIS API en MCP tools. Authenticatie, endpoints en response formats.",
};

export default function DocsPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/scan",
      desc: "Scant een document (PDF/JPG/PNG) en extraheert gestructureerde data via AI.",
      params: [
        { name: "invoiceBase64", type: "string", required: true, desc: "Base64 string van het document." },
        { name: "mimeType", type: "string", required: true, desc: "image/jpeg, image/png of application/pdf." },
        { name: "signature", type: "string", required: false, desc: "Solana transaction signature voor X402 payment." },
      ]
    }
  ];

  const pricing = [
    { tier: "Developer", calls: "100", price: "Gratis", extra: "N/A" },
    { tier: "Growth", calls: "1.000+", price: "€0,05", extra: "per call" },
    { tier: "Scale", calls: "10.000+", price: "€0,03", extra: "per call" },
    { tier: "Enterprise", calls: "Custom", price: "Custom", extra: "Volume korting" }
  ];

  const navItems = [
    { section: "Aan de slag", items: [
      { id: "auth", label: "Authenticatie" },
      { id: "quickstart", label: "Quickstart" },
      { id: "x402", label: "X402 Payments" },
    ]},
    { section: "Endpoints", items: endpoints.map(e => ({ id: e.path, label: e.path })) },
    { section: "Overig", items: [
      { id: "pricing", label: "Pricing" },
      { id: "errors", label: "Error Codes" },
    ]},
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
              <span className="text-white/60">docs</span>
            </div>
          </div>
          <div className={`${mono.className} hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            v1.0.0
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
                          className={`${mono.className} block px-3 py-2 text-sm text-white/50 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-all`}
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
            {/* Page header */}
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
              {/* Authentication Section */}
              <section id="auth" className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h2 className={`${h1_font.className} text-2xl font-bold text-white`}>Authenticatie</h2>
                </div>
                <p className="text-white/50 mb-8 leading-relaxed">
                  De AIFAIS API gebruikt Bearer tokens voor authenticatie. Stuur je API key mee in de header van elk verzoek.
                  Je kunt een API key aanmaken via het dashboard (coming soon) of door contact op te nemen.
                </p>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-xl rounded-xl opacity-50" />
                  <div className={`${mono.className} relative bg-[#0a0a0a] rounded-xl border border-white/10 p-6 text-sm`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/30 text-xs">HTTP Header</span>
                      <button className="text-white/30 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <code className="text-emerald-300">Authorization: Bearer </code>
                    <code className="text-cyan-300">YOUR_API_KEY</code>
                  </div>
                </div>
              </section>

              {/* X402 Section */}
              <section id="x402" className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className={`${h1_font.className} text-2xl font-bold text-white`}>X402: Pay-per-Call Infrastructure</h2>
                </div>
                <p className="text-white/50 mb-8 leading-relaxed">
                  Wij ondersteunen de 402 Payment Required standaard voor AI agents. Als je een call maakt zonder geldig abonnement,
                  ontvang je een 402 error met betalingsinstructies (Solana). Na betaling stuur je de <code className={`${mono.className} bg-white/5 px-2 py-0.5 rounded text-violet-400`}>signature</code> mee om de taak te voltooien.
                </p>
                <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <span className="text-amber-400">💡</span>
                    </div>
                    <div>
                      <h4 className={`${mono.className} font-bold text-amber-400 mb-2`}>Pro Tip</h4>
                      <p className="text-amber-200/70 text-sm leading-relaxed">
                        Onze MCP server handelt dit automatisch af voor agents die het protocol ondersteunen.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Endpoints Section */}
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
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
                      {/* Endpoint header */}
                      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4">
                        <span className={`${mono.className} px-2.5 py-1 rounded-md text-xs font-bold ${
                          e.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          e.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
                                <div key={pi} className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-xl">
                                  <div className="flex items-center gap-2">
                                    <span className={`${mono.className} text-cyan-400 font-bold`}>{p.name}</span>
                                    {p.required && (
                                      <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold rounded">
                                        required
                                      </span>
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

              {/* Pricing Section */}
              <section id="pricing" className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className={`${h1_font.className} text-3xl font-bold text-white`}>Usage-Based Pricing</h2>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className={`${mono.className} text-left p-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]`}>Tier</th>
                        <th className={`${mono.className} text-left p-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]`}>Calls / Maand</th>
                        <th className={`${mono.className} text-left p-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]`}>Prijs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricing.map((p, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-white">{p.tier}</span>
                          </td>
                          <td className={`${mono.className} p-4 text-white/50`}>{p.calls}</td>
                          <td className="p-4">
                            <span className="text-emerald-400 font-bold">{p.price}</span>
                            <span className="text-white/30 text-sm ml-2">{p.extra}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={`${mono.className} text-xs text-white/30 mt-4`}>
                  * Alle prijzen zijn exclusief BTW. Billing geschiedt per kalendermaand op basis van werkelijk verbruik.
                </p>
              </section>

              {/* Error Codes Section */}
              <section id="errors" className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className={`${h1_font.className} text-3xl font-bold text-white`}>Error Codes</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { code: 400, title: "Bad Request", desc: "Verplichte velden missen of data is onjuist geformatteerd.", color: "amber" },
                    { code: 402, title: "Payment Required", desc: "X402 protocol: Betaling via Solana is vereist voor deze call.", color: "violet" },
                    { code: 409, title: "Conflict / Double Spend", desc: "Deze transactie signature is al eerder gebruikt.", color: "amber" },
                    { code: 500, title: "Internal Server Error", desc: "Er is iets misgegaan aan onze kant. Probeer het later opnieuw.", color: "red" }
                  ].map((err, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                      <div className={`${mono.className} text-2xl font-bold ${
                        err.color === 'red' ? 'text-red-400' :
                        err.color === 'violet' ? 'text-violet-400' :
                        'text-amber-400'
                      }`}>
                        {err.code}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">{err.title}</h4>
                        <p className="text-white/50 text-sm">{err.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
