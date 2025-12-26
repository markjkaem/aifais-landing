import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bedrijfsbreinPage.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://aifais.com${locale === "nl" ? "" : "/" + locale}/diensten/bedrijfsbrein`,
      languages: {
        nl: "https://aifais.com/diensten/bedrijfsbrein",
        en: "https://aifais.com/en/diensten/bedrijfsbrein",
      },
    },
  };
}

export default async function BrainServicePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bedrijfsbreinPage" });
  const hrefPrefix = locale === "nl" ? "" : "/" + locale;

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {/* --- HERO --- */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-white border-b border-gray-200">
        {/* Background gradient */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3066be]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <Link
            href={`${hrefPrefix}/diensten`}
            className="inline-block mb-6 text-sm text-gray-500 hover:text-[#3066be] transition"
          >
            ← {t("hero.back")}
          </Link>

          <span className="block text-[#3066be] font-mono text-sm font-bold uppercase tracking-widest mb-4">
            {t("hero.badge")}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            {t("hero.title")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-purple-600">
              {t("hero.titleHighlight")}
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`${hrefPrefix}/contact`}
              className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-[#234a8c] transition-all hover:-translate-y-1 shadow-lg shadow-[#3066be]/20"
            >
              {t("hero.ctaDemo")}
            </Link>
            <Link
              href="#hoe-het-werkt"
              className="px-8 py-4 border border-gray-300 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              {t("hero.ctaHow")}
            </Link>
          </div>
        </div>
      </section>

      {/* --- PROBLEM / SOLUTION VISUAL --- */}
      <section id="hoe-het-werkt" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("problemSolution.title")}{" "}
                <span className="text-[#3066be]">{t("problemSolution.titleHighlight")}</span>
              </h2>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {t("problemSolution.p1")}
              </p>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                {t("problemSolution.p2")}
              </p>

              <ul className="space-y-4 font-medium text-gray-800">
                <li className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                    1
                  </div>
                  <span>{t("problemSolution.step1")}</span>
                </li>
                <li className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <span>{t("problemSolution.step2")}</span>
                </li>
                <li className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                    3
                  </div>
                  <span>{t("problemSolution.step3")}</span>
                </li>
              </ul>
            </div>

            {/* Visual Representation of Knowledge Graph */}
            <div className="relative w-full aspect-square bg-white rounded-3xl border border-gray-200 p-8 shadow-xl flex items-center justify-center overflow-hidden">
              {/* Abstract Graph Nodes Visual */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

              {/* Central Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#3066be] rounded-full flex items-center justify-center text-white font-bold z-20 shadow-lg shadow-[#3066be]/30">
                {t("problemSolution.visualNodes.center")}
              </div>

              {/* Connecting Lines */}
              <div className="absolute top-1/2 left-1/2 w-40 h-0.5 bg-gray-300 -translate-y-1/2 rotate-0 origin-left z-0"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-0.5 bg-gray-300 -translate-y-1/2 -rotate-45 origin-left z-0"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-0.5 bg-gray-300 -translate-y-1/2 rotate-45 origin-left z-0"></div>

              {/* Satellite Nodes */}
              <div className="absolute top-1/2 right-12 -translate-y-1/2 w-16 h-16 bg-white border-2 border-purple-400 rounded-full flex items-center justify-center text-xs text-center font-semibold text-gray-700 z-10 px-1">
                {t("problemSolution.visualNodes.node1")}
              </div>
              <div className="absolute top-24 right-24 w-16 h-16 bg-white border-2 border-green-400 rounded-full flex items-center justify-center text-xs text-center font-semibold text-gray-700 z-10 px-1">
                {t("problemSolution.visualNodes.node2")}
              </div>
              <div className="absolute bottom-24 right-24 w-16 h-16 bg-white border-2 border-orange-400 rounded-full flex items-center justify-center text-xs text-center font-semibold text-gray-700 z-10 px-1">
                {t("problemSolution.visualNodes.node3")}
              </div>

              {/* Floating Tag */}
              <div className="absolute bottom-6 left-6 bg-gray-900 text-white text-xs px-3 py-1 rounded-full font-mono">
                {t("problemSolution.visualTag")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- USE CASES --- */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("useCases.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Case 1 */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:border-[#3066be]/30 transition">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("useCases.case1.title")}
              </h3>
              <p className="text-gray-600">
                {t("useCases.case1.desc")}
              </p>
            </div>
            {/* Case 2 */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:border-[#3066be]/30 transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("useCases.case2.title")}
              </h3>
              <p className="text-gray-600">
                {t("useCases.case2.desc")}
              </p>
            </div>
            {/* Case 3 */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:border-[#3066be]/30 transition">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("useCases.case3.title")}
              </h3>
              <p className="text-gray-600">
                {t("useCases.case3.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECH STACK (Trust) --- */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 uppercase tracking-widest text-sm mb-8 font-semibold">
            {t("techStack.title")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-mono text-sm">
              LangGraph
            </span>
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-mono text-sm">
              Graphiti (Knowledge Graph)
            </span>
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-mono text-sm">
              Model Context Protocol (MCP)
            </span>
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-mono text-sm">
              Solana (Optioneel)
            </span>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 bg-gradient-to-b from-white to-white text-center border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
            {t("cta.title")} <br />
            <span className="text-[#3066be]">{t("cta.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`${hrefPrefix}/contact`}
              className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-[#234a8c] transition-all shadow-lg hover:-translate-y-1"
            >
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
