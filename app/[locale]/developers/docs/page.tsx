import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";

const h1_font = Space_Grotesk({
  weight: "700",
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
    },
    {
      method: "POST",
      path: "/api/v1/create-invoice",
      desc: "Genereert een professionele PDF factuur op basis van JSON data.",
      params: [
        { name: "clientName", type: "string", required: true, desc: "Naam van de klant." },
        { name: "items", type: "array", required: true, desc: "Lijst met factuurregels (description, quantity, price)." },
      ]
    }
  ];

  const pricing = [
    { tier: "Developer", calls: "100", price: "Gratis", extra: "N/A" },
    { tier: "Growth", calls: "1.000+", price: "€0,05", extra: "per call" },
    { tier: "Scale", calls: "10.000+", price: "€0,03", extra: "per call" },
    { tier: "Enterprise", calls: "Custom", price: "Custom", extra: "Volume korting" }
  ];

  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-24 max-w-5xl">
        <Link href="/developers" className="text-blue-600 font-bold mb-8 inline-block hover:underline">
          ← Developers Hub
        </Link>
        <h1 className={`${h1_font.className} text-4xl md:text-5xl font-extrabold mb-12 text-slate-900 tracking-tight`}>
          API Documentation
        </h1>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 border-r border-slate-100 pr-8 hidden lg:block">
            <nav className="space-y-6 sticky top-24">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Aan de slag</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#auth" className="text-slate-600 hover:text-blue-600">Authenticatie</a></li>
                  <li><a href="#quickstart" className="text-slate-600 hover:text-blue-600">Quickstart</a></li>
                  <li><a href="#x402" className="text-slate-600 hover:text-blue-600">X402 Payments</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Endpoints</h3>
                <ul className="space-y-2 text-sm">
                  {endpoints.map(e => (
                    <li key={e.path}><a href={`#${e.path}`} className="text-slate-600 hover:text-blue-600 font-mono">{e.path}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Overig</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#pricing" className="text-slate-600 hover:text-blue-600">Pricing</a></li>
                  <li><a href="#errors" className="text-slate-600 hover:text-blue-600">Error Codes</a></li>
                </ul>
              </div>
            </nav>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-24">
            {/* Authentificatie Section */}
            <section id="auth">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Authenticatie</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                De AIFAIS API gebruikt Bearer tokens voor authenticatie. Stuur je API key mee in de header van elk verzoek. Je kunt een API key aanmaken via het dashboard (coming soon) of door contact op te nemen.
              </p>
              <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-blue-300">
                Authorization: Bearer YOUR_API_KEY
              </div>
            </section>

            {/* X402 Section */}
            <section id="x402">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">X402: Pay-per-Call Infrastructure</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Wij ondersteunen de 402 Payment Required standaard voor AI agents. Als je een call maakt zonder geldig abonnement, ontvang je een 402 error met betalingsinstructies (Solana). Na betaling stuur je de <code className="bg-slate-100 px-1 rounded">signature</code> mee om de taak te voltooien.
              </p>
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl text-amber-800 text-sm">
                <strong>Pro Tip:</strong> Onze MCP server handelt dit automatisch af voor agents die het protocol ondersteunen.
              </div>
            </section>

            {/* Endpoints Section */}
            <section id="endpoints" className="space-y-16">
              <h2 className="text-3xl font-bold text-slate-900">Endpoints</h2>
              {endpoints.map((e) => (
                <div key={e.path} id={e.path} className="border-t border-slate-100 pt-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">{e.method}</span>
                    <span className="text-lg font-mono font-bold text-slate-900">{e.path}</span>
                  </div>
                  <p className="text-slate-600 mb-8">{e.desc}</p>
                  
                  {e.params.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Parameters</h4>
                      <table className="w-full text-sm text-left">
                        <thead className="text-slate-400 border-b border-slate-100">
                          <tr>
                            <th className="pb-2">Naam</th>
                            <th className="pb-2">Type</th>
                            <th className="pb-2">Uitleg</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {e.params.map(p => (
                            <tr key={p.name}>
                              <td className="py-3 font-mono text-blue-600">{p.name}{p.required && '*'}</td>
                              <td className="py-3 text-slate-500">{p.type}</td>
                              <td className="py-3 text-slate-600">{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* Pricing Section */}
            <section id="pricing">
              <h2 className="text-3xl font-bold mb-8 text-slate-900">Usage-Based Pricing</h2>
              <table className="w-full text-left rounded-2xl overflow-hidden border border-slate-100">
                <thead className="bg-slate-50 text-slate-900 font-bold">
                  <tr>
                    <th className="p-4">Tier</th>
                    <th className="p-4">Calls / Maand</th>
                    <th className="p-4">Prijs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pricing.map(p => (
                    <tr key={p.tier}>
                      <td className="p-4 font-bold text-slate-900">{p.tier}</td>
                      <td className="p-4 text-slate-600">{p.calls}</td>
                      <td className="p-4 text-blue-600 font-bold">{p.price} <span className="text-xs text-slate-400 font-normal">{p.extra}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-slate-400 mt-6">* Alle prijzen zijn exclusief BTW. Billing geschiedt per kalendermaand op basis van werkelijk verbruik.</p>
            </section>

            {/* Error Codes Section */}
            <section id="errors">
              <h2 className="text-3xl font-bold mb-8 text-slate-900">Error Codes</h2>
              <div className="space-y-4">
                {[
                  { code: 400, title: "Bad Request", desc: "Verplichte velden missen of data is onjuist geformatteerd." },
                  { code: 402, title: "Payment Required", desc: "X402 protocol: Betaling via Solana is vereist voor deze call." },
                  { code: 409, title: "Conflict / Double Spend", desc: "Deze transactie signature is al eerder gebruikt." },
                  { code: 500, title: "Internal Server Error", desc: "Er is iets misgegaan aan onze kant. Probeer het later opnieuw." }
                ].map(err => (
                  <div key={err.code} className="flex gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-lg font-bold text-slate-900 font-mono w-12">{err.code}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{err.title}</h4>
                      <p className="text-slate-600 text-sm">{err.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
