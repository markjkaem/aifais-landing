"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Cpu,
  Coins,
  Lock,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

// --- DEMO COMPONENT: x402 TRANSACTION FLOW ---
const X402Demo = () => {
  const [step, setStep] = useState(0);

  // Auto-play de demo
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      label: "Request",
      desc: "Agent X vraagt: 'Scan dit contract'",
      status: "POST /api/scan-contract",
      color: "bg-gray-100 text-gray-600",
    },
    {
      label: "402 Payment Required",
      desc: "Witted API: 'Dat kost 2.00 USDC'",
      status: "HTTP 402: Payment Required",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      label: "Payment",
      desc: "Agent X betaalt direct via Wallet",
      status: "Tx: 0x8a...3f confirmed",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      label: "Response",
      desc: "Witted API levert analyse",
      status: "HTTP 200: { risk_score: 'high' }",
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      label: "Done",
      desc: "Transactie voltooid in 400ms",
      status: "Ready for next",
      color: "bg-gray-50 text-gray-400",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6 overflow-hidden relative">
      {/* Visual Connection Line */}
      <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gray-100"></div>

      <div className="space-y-6 relative">
        {steps.slice(0, 4).map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 transition-all duration-500 ${
              step >= i
                ? "opacity-100 translate-x-0"
                : "opacity-30 translate-x-4"
            }`}
          >
            {/* Dot indicator */}
            <div
              className={`w-4 h-4 rounded-full border-2 z-10 shrink-0 ${
                step >= i
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-300"
              }`}
            ></div>

            {/* Card */}
            <div
              className={`flex-1 p-3 rounded-lg border text-sm flex justify-between items-center ${
                step === i
                  ? "ring-2 ring-blue-100 border-blue-300 shadow-sm"
                  : "border-transparent"
              } ${s.color}`}
            >
              <div>
                <span className="font-bold block">{s.label}</span>
                <span className="text-xs opacity-80">{s.desc}</span>
              </div>
              <code className="bg-white/50 px-2 py-1 rounded text-xs font-mono">
                {s.status}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AgentApiPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#f8fafc,transparent_30%)]"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent"></div>

        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                <Cpu className="w-4 h-4" />
                <span>Machine-to-Machine Economy</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
                Waar Agents zaken doen <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  met elkaar.
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Waarom zou u uw "Bedrijfsbrein" beperken tot uw eigen
                medewerkers? Met de <strong>x402 standaard</strong> kunnen
                externe AI-agents veilig betalen voor uw data, analyses en
                tools. Volautomatisch. Micro-transacties. Directe settlement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  Activeer x402 <Zap className="w-4 h-4 text-yellow-400" />
                </Link>
                <Link
                  href="#techniek"
                  className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-all text-center"
                >
                  Bekijk de API
                </Link>
              </div>
            </div>

            {/* Hero Visual: The Transaction */}
            <div className="md:w-1/2 w-full">
              <X402Demo />
            </div>
          </div>
        </div>
      </section>

      {/* --- USE CASE: CONTRACT SCAN --- */}
      <section className="py-20 bg-slate-50 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              De eerste 'Contract Scan' API op de Blockchain
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dit is geen toekomstmuziek. Wij kunnen uw juridische modellen
              vandaag nog beschikbaar maken voor agents wereldwijd.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Universele Toegang</h3>
              <p className="text-gray-600 text-sm">
                Een inkoop-agent uit New York kan uw Nederlandse
                arbeidsrecht-expertise aanroepen om een contract te checken.
                Geen account nodig.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 text-green-600">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pay-per-Request</h3>
              <p className="text-gray-600 text-sm">
                Geen maandelijkse abonnementen. De agent betaalt per pagina, per
                scan of per milliseconde compute. Direct in USDC.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-600">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Zero-Trust Security</h3>
              <p className="text-gray-600 text-sm">
                Als er niet betaald wordt, levert de API niets. Het "402 Payment
                Required" protocol dwingt betaling af vóór levering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECHNICAL DEEP DIVE --- */}
      <section id="techniek" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Integreer in 5 minuten.
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Wij bouwen de x402-gateway voor u. Voor de buitenwereld ziet het
              eruit als een standaard REST API, maar onder water handelt het
              complexe crypto-transacties af.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <strong className="block text-white">
                    Compatibel met alles
                  </strong>
                  <span className="text-slate-400 text-sm">
                    Werkt met Python (LangChain), Node.js, of curl.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <strong className="block text-white">
                    Automatische Facturatie
                  </strong>
                  <span className="text-slate-400 text-sm">
                    Elke transactie wordt gelogd voor uw boekhouding.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* CODE WINDOW */}
          <div className="md:w-1/2 w-full">
            <div className="rounded-lg overflow-hidden bg-[#1e1e1e] border border-slate-700 shadow-2xl font-mono text-sm">
              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-slate-400 text-xs">
                  agent_client.py
                </span>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-green-400">
                  {`import requests
from agent_wallet import pay_x402

# 1. Agent probeert contract te sturen
url = "https://api.witted.nl/v1/scan-contract"
files = {'file': open('contract.pdf', 'rb')}

response = requests.post(url, files=files)

# 2. Server reageert met 402 + prijs
if response.status_code == 402:
    price = response.headers['X-Price-USDC']
    wallet = response.headers['X-Wallet-Address']
    
    print(f"Payment required: {price} USDC")
    
    # 3. Agent betaalt automatisch
    proof = pay_x402(to=wallet, amount=price)
    
    # 4. Agent probeert opnieuw met betaalbewijs
    headers = {'Authorization': f'x402 {proof}'}
    final_res = requests.post(url, files=files, headers=headers)
    
    print(final_res.json()) 
    # Output: {"risk": "low", "clauses": [...]}
`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Uw data als winstmodel?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Ontsluit de waarde van uw bedrijfskennis voor de volgende generatie
            AI.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-shadow hover:shadow-lg"
          >
            Start met x402 Integratie <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
