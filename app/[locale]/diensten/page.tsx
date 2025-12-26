import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(","),
    alternates: {
      canonical: `https://aifais.com${locale === "nl" ? "" : "/" + locale}/diensten`,
      languages: {
        nl: "https://aifais.com/diensten",
        en: "https://aifais.com/en/diensten",
      },
    },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "AI Agent Development",
    provider: {
      "@type": "Organization",
      name: "AIFAIS",
      "@id": "https://aifais.com/#organization",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digitale Werknemers",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom AI Agents",
            description:
              "Op maat gemaakte autonome AI agents voor elk bedrijfsproces.",
          },
        },
      ],
    },
  };

  // Example agents we've built - not a limitation
  const exampleAgents = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: t("exampleAgents.email.title"),
      description: t("exampleAgents.email.description"),
      link: `/${locale}/portfolio/email-reply-ai-agent`,
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: t("exampleAgents.document.title"),
      description: t("exampleAgents.document.description"),
      link: `/${locale}/portfolio/data-pipeline-and-reporting-automation`,
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      title: t("exampleAgents.sales.title"),
      description: t("exampleAgents.sales.description"),
      link: `/${locale}/portfolio/sales-lead-automation`,
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      title: t("exampleAgents.support.title"),
      description: t("exampleAgents.support.description"),
      link: `/${locale}/portfolio/support-ticket-summarizer`,
    },
  ];

  const steps = t.raw("steps") as { number: string; title: string; description: string }[];

  return (
    <main className="bg-white text-gray-900 min-h-screen selection:bg-gray-900 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-blue-50 via-transparent to-purple-50 rounded-full blur-3xl opacity-60" />

        <div className="container mx-auto px-6 max-w-5xl relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              <span className="text-sm font-medium text-gray-600">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 tracking-tight leading-[1.1]">
              {t("hero.title")}
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light mb-12">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5"
              >
                {t("hero.ctaTalk")}
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href={`/${locale}/portfolio`}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                {t("hero.ctaView")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Explanation */}
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                {t("intro.title")}
                <br />
                <span className="text-gray-400">
                  {t("intro.titleHighlight")}
                </span>
              </h2>

              <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                {t("intro.p")}
              </p>

              <div className="space-y-4 mb-10">
                <p className="text-gray-600 font-medium">
                  {t("intro.capTitle")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(t.raw("capabilities") as string[]).map((capability, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
                      <span className="text-sm">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-gray-500 text-sm italic">
                {t("intro.capNote")}
              </p>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-[2rem] blur-2xl opacity-40" />

              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 md:p-10 text-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-500 text-sm ml-2 font-mono">
                    {t("visual.label")}
                  </span>
                </div>

                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400">→</span>
                    <span className="text-gray-300">
                      {t("visual.step1")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400">⚡</span>
                    <span className="text-gray-300">
                      {t("visual.step2")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400">✓</span>
                    <span className="text-gray-300">
                      {t("visual.step3")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-gray-300">
                      {t("visual.step4")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-gray-300">
                      {t("visual.step5")}
                    </span>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <span className="text-gray-500">
                      {t("visual.footer")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              {t("examples.title")}
            </h2>
            <p className="text-xl text-gray-500">
              {t("examples.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exampleAgents.map((agent, index) => (
              <Link
                key={index}
                href={agent.link}
                className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 mb-4 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                  {agent.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {agent.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {agent.description}
                </p>
                <div className="mt-4 text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors flex items-center gap-1">
                  {t("examples.viewCase")}
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-white rounded-full border border-gray-200 shadow-sm">
              <span className="text-gray-600">{t("examples.other")}</span>
              <Link
                href={`/${locale}/contact`}
                className="text-gray-900 font-semibold hover:underline"
              >
                {t("examples.talk")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("why.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-red-500/80 font-semibold text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs">
                  ✕
                </span>
                {t("why.tradTitle")}
              </div>
              <ul className="space-y-4 text-gray-600">
                {(t.raw("why.tradPoints") as string[]).map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              <div className="text-emerald-400 font-semibold text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">
                  ✓
                </span>
                {t("why.agentTitle")}
              </div>
              <ul className="space-y-4 text-gray-300">
                {(t.raw("why.agentPoints") as string[]).map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              {t("process.title")}
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              {t("process.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-2rem)] h-[2px] bg-gradient-to-r from-gray-200 to-gray-200" />
                )}

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-gray-200 shadow-sm mb-6">
                    <span className="text-xl font-bold text-gray-900">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {(t.raw("stats") as { value: string; label: string }[]).map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gray-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />

        <div className="container mx-auto px-6 max-w-4xl relative">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                {t("cta.button")}
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href={`/${locale}/portfolio`}
                className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-full border border-white/20 hover:bg-white/10 transition-all"
              >
                {t("cta.viewCases")}
              </Link>
            </div>

            <div className="mt-16 pt-12 border-t border-white/10">
              <p className="text-gray-500 text-sm mb-6">
                {t("cta.enterprise")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                    <span className="text-xs font-bold">◎</span>
                  </div>
                  <span className="text-sm">Solana</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                    <span className="text-xs font-bold">AI</span>
                  </div>
                  <span className="text-sm">Claude 4.5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                    <span className="text-xs font-bold">⚡</span>
                  </div>
                  <span className="text-sm">MCP Protocol</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
