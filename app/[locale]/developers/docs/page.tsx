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
  title: "API Documentation | AIFAIS Developers",
  description:
    "Complete API reference for AIFAIS. Authentication, endpoints, parameters, and response formats.",
};

// ============================================================================
// CONFIGURATION - Scalable for 100+ APIs
// ============================================================================

import { API_CATEGORIES, API_ENDPOINTS, APIEndpoint, APIParam } from "@/config/apis";

// ... (other imports)

// Use the types and constants from config
const categories = API_CATEGORIES;
const endpoints = API_ENDPOINTS;



const errorCodes = [
  { code: 400, name: "Bad Request", description: "Invalid parameters or missing required fields" },
  { code: 401, name: "Unauthorized", description: "Missing or invalid authentication" },
  { code: 402, name: "Payment Required", description: "X402 payment signature required or invalid" },
  { code: 429, name: "Rate Limited", description: "Too many requests, please slow down" },
  { code: 500, name: "Server Error", description: "Internal server error, please retry" },
];

// ============================================================================
// COMPONENTS
// ============================================================================

function MethodBadge({ method }: { method: string }) {
  const styles: Record<string, string> = {
    GET: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    POST: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    PUT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span className={`${mono.className} px-2.5 py-1 rounded text-xs font-semibold border ${styles[method]}`}>
      {method}
    </span>
  );
}

function ParamRow({ param }: { param: APIParam }) {
  return (
    <div className="grid grid-cols-12 gap-4 py-3 border-b border-zinc-800/50 last:border-0">
      <div className="col-span-3 flex items-center gap-2">
        <code className={`${mono.className} text-sm text-cyan-400`}>{param.name}</code>
        {param.required && (
          <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-semibold rounded border border-red-500/20">
            required
          </span>
        )}
      </div>
      <div className="col-span-2">
        <code className={`${mono.className} text-xs text-zinc-500`}>{param.type}</code>
      </div>
      <div className="col-span-7">
        <p className="text-sm text-zinc-400">{param.description}</p>
      </div>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: APIEndpoint }) {
  return (
    <div id={endpoint.id} className="scroll-mt-24 mb-12">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <MethodBadge method={endpoint.method} />
            <code className={`${mono.className} text-white font-semibold`}>{endpoint.path}</code>
          </div>
          <div className="flex items-center gap-3">
            {endpoint.isFree ? (
              <span className={`${mono.className} px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded border border-cyan-500/20`}>
                FREE
              </span>
            ) : (
              <span className={`${mono.className} text-xs text-zinc-500`}>{endpoint.price}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className={`${heading.className} text-xl font-semibold text-white mb-2`}>{endpoint.title}</h3>
          <p className="text-zinc-400 mb-6">{endpoint.description}</p>

          {/* Parameters */}
          {endpoint.params.length > 0 && (
            <div className="mb-6">
              <h4 className={`${mono.className} text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4`}>
                Parameters
              </h4>
              <div className="bg-zinc-950/50 rounded-lg border border-zinc-800/50 p-4">
                {endpoint.params.map((param) => (
                  <ParamRow key={param.name} param={param} />
                ))}
              </div>
            </div>
          )}

          {/* Response Example */}
          {endpoint.responseExample && (
            <div>
              <h4 className={`${mono.className} text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4`}>
                Response Example
              </h4>
              <pre className={`${mono.className} bg-zinc-950 rounded-lg border border-zinc-800/50 p-4 text-sm overflow-x-auto`}>
                <code className="text-zinc-300">{endpoint.responseExample}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Build navigation from categories and endpoints
  const navSections = [
    {
      title: "Getting Started",
      items: [
        { id: "overview", label: "Overview" },
        { id: "authentication", label: "Authentication" },
        { id: "x402-payments", label: "X402 Payments" },
      ],
    },
    ...categories.map((cat) => ({
      title: cat.name,
      items: endpoints
        .filter((e) => e.category === cat.id)
        .map((e) => ({ id: e.id, label: e.title })),
    })),
    {
      title: "Reference",
      items: [
        { id: "pricing", label: "Pricing" },
        { id: "errors", label: "Error Codes" },
      ],
    },
  ];

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
            <span className="text-zinc-400">docs</span>
          </div>
          <div className={`${mono.className} hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            v1.2.0
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12 max-w-7xl mx-auto">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-8">
              {navSections.map((section) => (
                <div key={section.title}>
                  <h3 className={`${mono.className} text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3`}>
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`${mono.className} block px-3 py-2 text-sm text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors`}
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

          {/* Content */}
          <div className="min-w-0">
            {/* Page Header */}
            <div className="mb-16">
              <p className={`${mono.className} text-emerald-400 text-sm mb-3`}>// Documentation</p>
              <h1 className={`${heading.className} text-4xl sm:text-5xl font-bold text-white mb-4`}>API Reference</h1>
              <p className="text-lg text-zinc-400 max-w-2xl">
                Complete technical documentation for the AIFAIS API. Authentication, endpoints, and response formats.
              </p>
            </div>

            {/* Overview */}
            <section id="overview" className="scroll-mt-24 mb-16">
              <h2 className={`${heading.className} text-2xl font-bold text-white mb-4`}>Overview</h2>
              <p className="text-zinc-400 mb-6">
                The AIFAIS API provides AI-powered tools for Dutch businesses. All endpoints accept JSON and return JSON responses.
              </p>
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
                <h4 className={`${mono.className} text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3`}>
                  Base URL
                </h4>
                <code className={`${mono.className} text-emerald-400`}>https://aifais.com/api</code>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="scroll-mt-24 mb-16">
              <h2 className={`${heading.className} text-2xl font-bold text-white mb-4`}>Authentication</h2>
              <p className="text-zinc-400 mb-6">
                AIFAIS uses different authentication methods depending on your use case:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">🤖</span>
                    <h4 className={`${heading.className} font-semibold text-white`}>AI Agents</h4>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Use X402 payment signatures. No API key required - pay per request via Solana.
                  </p>
                </div>
                <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">🔑</span>
                    <h4 className={`${heading.className} font-semibold text-white`}>Enterprise</h4>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Contact us for API keys with monthly billing and volume discounts.
                  </p>
                </div>
              </div>
            </section>

            {/* X402 Payments */}
            <section id="x402-payments" className="scroll-mt-24 mb-16">
              <h2 className={`${heading.className} text-2xl font-bold text-white mb-4`}>X402 Payments</h2>
              <p className="text-zinc-400 mb-6">
                We support the HTTP 402 Payment Required standard for AI agents. Include a Solana payment signature in your request.
              </p>
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <span className={`${mono.className} text-xs text-zinc-500`}>Request Header</span>
                </div>
                <pre className={`${mono.className} p-4 text-sm overflow-x-auto`}>
                  <code>
                    <span className="text-zinc-500">X-Payment:</span> <span className="text-emerald-400">&lt;solana_signature&gt;</span>
                  </code>
                </pre>
              </div>
            </section>

            {/* Endpoints by Category */}
            {categories.map((category) => {
              const categoryEndpoints = endpoints.filter((e) => e.category === category.id);
              if (categoryEndpoints.length === 0) return null;

              return (
                <section key={category.id} className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className={`${heading.className} text-2xl font-bold text-white`}>{category.name} Endpoints</h2>
                  </div>
                  {categoryEndpoints.map((endpoint) => (
                    <EndpointCard key={endpoint.id} endpoint={endpoint} />
                  ))}
                </section>
              );
            })}

            {/* Pricing */}
            <section id="pricing" className="scroll-mt-24 mb-16">
              <h2 className={`${heading.className} text-2xl font-bold text-white mb-6`}>Pricing</h2>
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className={`${mono.className} px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider`}>
                        Endpoint
                      </th>
                      <th className={`${mono.className} px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider`}>
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoints.map((endpoint) => (
                      <tr key={endpoint.id} className="border-b border-zinc-800/50 last:border-0">
                        <td className="px-6 py-4">
                          <code className={`${mono.className} text-sm text-zinc-300`}>{endpoint.path}</code>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`${mono.className} text-sm ${endpoint.isFree ? "text-cyan-400" : "text-zinc-400"}`}>
                            {endpoint.price}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Error Codes */}
            <section id="errors" className="scroll-mt-24">
              <h2 className={`${heading.className} text-2xl font-bold text-white mb-6`}>Error Codes</h2>
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className={`${mono.className} px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-24`}>
                        Code
                      </th>
                      <th className={`${mono.className} px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-40`}>
                        Name
                      </th>
                      <th className={`${mono.className} px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider`}>
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorCodes.map((error) => (
                      <tr key={error.code} className="border-b border-zinc-800/50 last:border-0">
                        <td className="px-6 py-4">
                          <code className={`${mono.className} text-sm ${error.code >= 500 ? "text-red-400" : error.code >= 400 ? "text-amber-400" : "text-zinc-400"}`}>
                            {error.code}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-zinc-300">{error.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-zinc-500">{error.description}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}