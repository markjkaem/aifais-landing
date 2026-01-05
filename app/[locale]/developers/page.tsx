import { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const heading = Space_Grotesk({
  weight: ["600", "700"],
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Developers | AIFAIS API & MCP Infrastructure",
  description:
    "Agent-ready infrastructure voor de Nederlandse markt. Integreer AIFAIS tools via MCP of REST API met pay-per-use pricing.",
};

import { API_CATEGORIES, API_ENDPOINTS, APIEndpoint } from "@/config/apis";

// ... (other imports)

// Use the types and constants from config
const categories = API_CATEGORIES;
const apis = API_ENDPOINTS;

const features = [
// ... (keep features)
  {
    icon: "⚡",
    title: "< 200ms Response",
    description: "Optimized for real-time agent workflows",
  },
  {
    icon: "🔐",
    title: "Enterprise Security",
    description: "SOC2 ready, Dutch data sovereignty",
  },
  {
    icon: "🇳🇱",
    title: "NL Context",
    description: "Built for Dutch regulations & language",
  },
  {
    icon: "💳",
    title: "X402 Native",
    description: "Pay-per-call via Solana or traditional billing",
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const colorClasses = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "bg-emerald-500/5",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    glow: "bg-violet-500/5",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    glow: "bg-amber-500/5",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    glow: "bg-cyan-500/5",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    glow: "bg-rose-500/5",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "bg-blue-500/5",
  },
};

function StatusBadge({ status }: { status: "live" | "beta" | "coming" }) {
  const styles = {
    live: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    beta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    coming: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  const labels = { live: "Live", beta: "Beta", coming: "Coming" };

  return (
    <span
      className={`${mono.className} px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function APICard({ api, category }: { api: APIEndpoint; category: (typeof API_CATEGORIES)[number] }) {
  const colors = colorClasses[category.color];

  return (
    <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={api.status} />
          {api.isFree && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              FREE
            </span>
          )}
        </div>
        <span className={`${mono.className} text-xs ${api.isFree ? "text-cyan-400" : "text-zinc-500"}`}>
          {api.price}
        </span>
      </div>

      {/* Function name */}
      <h3
        className={`${mono.className} text-base font-semibold text-white mb-2 group-hover:${colors.text} transition-colors`}
      >
        {api.name}()
      </h3>

      {/* Description */}
      <p className="text-sm text-zinc-500 leading-relaxed">{api.description}</p>

      {/* Hover glow */}
      <div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${colors.glow}`}
      />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default async function DevelopersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const liveApis = apis.filter((a) => a.status === "live");
  const comingApis = apis.filter((a) => a.status !== "live");

  return (
    <main className="bg-zinc-950 text-white min-h-screen">
      {/* ================================================================== */}
      {/* HERO SECTION */}
      {/* ================================================================== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 py-24">
          <div className="max-w-4xl">
            {/* Status badge */}
            <div
              className={`${mono.className} inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs mb-8`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-zinc-500">All systems operational</span>
              <span className="text-emerald-400">{liveApis.length} APIs live</span>
            </div>

            {/* Headline */}
            <h1
              className={`${heading.className} text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]`}
            >
              <span className="text-white">Agent-Ready</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
                API Infrastructure
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
              Nederlandse AI infrastructure gebouwd voor agents. Integreer via MCP of REST API met pay-per-use
              pricing via Solana.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href={`/${locale}/developers/docs`}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-zinc-900 font-semibold rounded-xl hover:bg-zinc-100 transition-colors"
              >
                View Documentation
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={`/${locale}/developers/mcp`}
                className={`${mono.className} inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-colors`}
              >
                <span className="text-emerald-400">$</span>
                Setup MCP Server
              </Link>
            </div>

            {/* Protocol badges */}
            <div className="flex flex-wrap gap-3">
              {["MCP Protocol", "X402 Payments", "REST API", "TypeScript SDK"].map((item) => (
                <div
                  key={item}
                  className={`${mono.className} flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs text-zinc-500`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES STRIP */}
      {/* ================================================================== */}
      <section className="py-16 border-y border-zinc-900 bg-zinc-950/50">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className={`${mono.className} text-sm font-semibold text-white mb-1`}>{feature.title}</h3>
                <p className="text-sm text-zinc-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* AVAILABLE APIs */}
      {/* ================================================================== */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className={`${mono.className} text-emerald-400 text-sm mb-2`}>// Available APIs</p>
                <h2 className={`${heading.className} text-3xl sm:text-4xl font-bold text-white`}>
                  Plug & Play Tools
                </h2>
              </div>
              <Link
                href={`/${locale}/developers/docs`}
                className={`${mono.className} flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 transition-colors`}
              >
                Full API Reference
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Categories */}
            {categories
              .filter((cat) => apis.some((a) => a.category === cat.id && a.status === "live"))
              .map((category) => {
                const categoryApis = liveApis.filter((a) => a.category === category.id);
                if (categoryApis.length === 0) return null;

                return (
                  <div key={category.id} className="mb-12 last:mb-0">
                    {/* Category header */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-xl">{category.icon}</span>
                      <div>
                        <h3 className={`${heading.className} text-lg font-semibold text-white`}>{category.name}</h3>
                        <p className="text-sm text-zinc-500">{category.description}</p>
                      </div>
                    </div>

                    {/* API grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryApis.map((api) => (
                        <APICard key={api.name} api={api} category={category} />
                      ))}
                    </div>
                  </div>
                );
              })}

            {/* Coming Soon */}
            {comingApis.length > 0 && (
              <div className="mt-16 pt-16 border-t border-zinc-900">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl">🚀</span>
                  <div>
                    <h3 className={`${heading.className} text-lg font-semibold text-white`}>Coming Soon</h3>
                    <p className="text-sm text-zinc-500">{comingApis.length} APIs in development</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comingApis.map((api) => {
                    const category = categories.find((c) => c.id === api.category)!;
                    return <APICard key={api.name} api={api} category={category} />;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CODE EXAMPLE */}
      {/* ================================================================== */}
      <section className="py-24 border-t border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <p className={`${mono.className} text-cyan-400 text-sm mb-2`}>// Integration</p>
                <h2 className={`${heading.className} text-3xl sm:text-4xl font-bold text-white mb-6`}>
                  Simple JSON Schema
                </h2>
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                  Vergeet complexe enterprise integraties. Roep tools aan met simpele JSON. Werkt met Claude, GPT,
                  of je eigen agent.
                </p>

                <div className="space-y-4">
                  {[
                    "MCP Server voor Cursor & Claude Desktop",
                    "Pay-per-use via Solana (X402 protocol)",
                    "Nederlandse context & data sovereignty",
                    "TypeScript SDK beschikbaar",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-zinc-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Code block */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-violet-500/5 blur-2xl rounded-2xl" />
                <div className="relative bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-zinc-700" />
                      <div className="w-3 h-3 rounded-full bg-zinc-700" />
                      <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    </div>
                    <span className={`${mono.className} text-xs text-zinc-600`}>terminal</span>
                  </div>

                  {/* Code */}
                  <pre className={`${mono.className} p-5 text-sm leading-relaxed overflow-x-auto`}>
                    <code>
                      <span className="text-zinc-600"># Scan invoice with X402 payment</span>
                      {"\n"}
                      <span className="text-emerald-400">$</span>{" "}
                      <span className="text-white">curl -X POST aifais.com/api/v1/finance/scan</span>
                      {"\n"}
                      <span className="text-zinc-600">{`  -H "X-Payment: <solana_sig>"`}</span>
                      {"\n"}
                      <span className="text-zinc-600">{`  -d '{"invoice": "base64..."}'`}</span>
                      {"\n\n"}
                      <span className="text-zinc-600"># Response (38ms)</span>
                      {"\n"}
                      <span className="text-amber-400">{"{"}</span>
                      {"\n"}
                      <span className="text-zinc-500">{"  "}</span>
                      <span className="text-cyan-400">"vendor"</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-emerald-400">"Bol.com B.V."</span>
                      <span className="text-zinc-500">,</span>
                      {"\n"}
                      <span className="text-zinc-500">{"  "}</span>
                      <span className="text-cyan-400">"total"</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-violet-400">149.99</span>
                      <span className="text-zinc-500">,</span>
                      {"\n"}
                      <span className="text-zinc-500">{"  "}</span>
                      <span className="text-cyan-400">"currency"</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-emerald-400">"EUR"</span>
                      {"\n"}
                      <span className="text-amber-400">{"}"}</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRICING */}
      {/* ================================================================== */}
      <section className="py-24 border-t border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className={`${mono.className} text-violet-400 text-sm mb-2`}>// Pricing</p>
            <h2 className={`${heading.className} text-3xl sm:text-4xl font-bold text-white mb-4`}>Usage-Based Pricing</h2>
            <p className="text-zinc-400 mb-12">Start gratis. Betaal alleen wat je gebruikt.</p>

            <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
              {/* Pay per use */}
              <div className="relative p-6 rounded-xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20">
                <div
                  className={`${mono.className} absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-zinc-900 text-[10px] font-bold rounded-full uppercase`}
                >
                  Recommended
                </div>
                <p className={`${mono.className} text-sm text-zinc-400 mb-2`}>Pay-per-use</p>
                <p className={`${heading.className} text-2xl font-bold text-white mb-1`}>From 0.001 SOL</p>
                <p className="text-xs text-zinc-500">Per API call (X402)</p>
              </div>

              {/* Enterprise */}
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <p className={`${mono.className} text-sm text-zinc-400 mb-2`}>Enterprise</p>
                <p className={`${heading.className} text-2xl font-bold text-white mb-1`}>Custom</p>
                <p className="text-xs text-zinc-500">Volume discounts & API keys</p>
              </div>
            </div>

            <Link
              href={`/${locale}/developers/docs#pricing`}
              className={`${mono.className} inline-flex items-center gap-2 mt-8 text-sm text-zinc-500 hover:text-emerald-400 transition-colors`}
            >
              View full pricing
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA */}
      {/* ================================================================== */}
      <section className="py-24 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-violet-500/5" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className={`${mono.className} inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 mb-6`}
            >
              <span className="text-emerald-400">$</span>
              npx github:aifais/aifais-mcp-server
            </div>

            <h2 className={`${heading.className} text-3xl sm:text-4xl font-bold text-white mb-4`}>Ready to Build?</h2>
            <p className="text-zinc-400 mb-8">
              Geen sign-up nodig. Start direct met de MCP server of lees de documentatie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/developers/docs`}
                className="px-8 py-4 bg-white text-zinc-900 font-semibold rounded-xl hover:bg-zinc-100 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href={`/${locale}/contact`}
                className={`${mono.className} px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-xl hover:bg-zinc-800 transition-colors`}
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