import { Metadata } from "next";
import Link from "next/link";
import {
  Cpu,
  Globe,
  Coins,
  Lock,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import X402Demo from "./X402Demo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agentApiPage.hero" });

  return {
    title: `${t("title")} | AIFAIS`,
    description: t("subtitle").substring(0, 160),
    alternates: {
      canonical: `https://aifais.com${locale === "nl" ? "" : "/" + locale}/diensten/agent-api`,
      languages: {
        nl: "https://aifais.com/diensten/agent-api",
        en: "https://aifais.com/en/diensten/agent-api",
      },
    },
  };
}

export default async function AgentApiPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agentApiPage" });
  const hrefPrefix = locale === "nl" ? "" : "/" + locale;

  // Localized Code Snippet
  const codeSnippet = locale === "nl" ? `import requests
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
` : `import requests
from agent_wallet import pay_x402

# 1. Agent tries to send contract
url = "https://api.witted.nl/v1/scan-contract"
files = {'file': open('contract.pdf', 'rb')}

response = requests.post(url, files=files)

# 2. Server responds with 402 + price
if response.status_code == 402:
    price = response.headers['X-Price-USDC']
    wallet = response.headers['X-Wallet-Address']
    
    print(f"Payment required: {price} USDC")
    
    # 3. Agent pays automatically
    proof = pay_x402(to=wallet, amount=price)
    
    # 4. Agent retries with payment proof
    headers = {'Authorization': f'x402 {proof}'}
    final_res = requests.post(url, files=files, headers=headers)
    
    print(final_res.json()) 
    # Output: {"risk": "low", "clauses": [...]}
`;

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
                <span>{t("hero.badge")}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
                {t("hero.title")} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  {t("hero.titleHighlight")}
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`${hrefPrefix}/contact`}
                  className="px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {t("hero.ctaActivate")} <Zap className="w-4 h-4 text-yellow-400" />
                </Link>
                <Link
                  href="#techniek"
                  className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-all text-center"
                >
                  {t("hero.ctaApi")}
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

      {/* --- USE CASE --- */}
      <section className="py-20 bg-slate-50 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {t("useCase.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("useCase.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("useCase.card1.title")}</h3>
              <p className="text-gray-600 text-sm">
                {t("useCase.card1.desc")}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 text-green-600">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("useCase.card2.title")}</h3>
              <p className="text-gray-600 text-sm">
                {t("useCase.card2.desc")}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-600">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("useCase.card3.title")}</h3>
              <p className="text-gray-600 text-sm">
                {t("useCase.card3.desc")}
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
              {t("tech.title")}
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              {t("tech.description")}
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <strong className="block text-white">
                    {t("tech.check1.title")}
                  </strong>
                  <span className="text-slate-400 text-sm">
                    {t("tech.check1.desc")}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <strong className="block text-white">
                    {t("tech.check2.title")}
                  </strong>
                  <span className="text-slate-400 text-sm">
                    {t("tech.check2.desc")}
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
                  {codeSnippet}
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
            {t("cta.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <Link
            href={`${hrefPrefix}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-shadow hover:shadow-lg"
          >
            {t("cta.button")} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
