import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import HomeClient from '../../HomeClient'; 
import { getTranslations } from "next-intl/server";
import { getProjects } from "@/app/[locale]/portfolio/data";
import { sectorData, sectorDataEn } from "../data";

const h1_font = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return Object.keys(sectorData).map((sector) => ({ sector }));
}

type Params = Promise<{ locale: string; sector: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { sector, locale } = await params;
  const decodedSector = decodeURIComponent(sector).toLowerCase();
  const data = locale === 'en' ? sectorDataEn[decodedSector] : sectorData[decodedSector];
  
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
  };
}

export default async function SectorPage({
  params,
}: {
  params: Params;
}) {
  const { sector, locale } = await params;
  const decodedSector = decodeURIComponent(sector).toLowerCase();
  const data = locale === 'en' ? sectorDataEn[decodedSector] : sectorData[decodedSector];
  const t = await getTranslations({ locale, namespace: "cityPage" }); // Reuse some keys, but might need own ns later

  if (!data) {
    notFound();
  }

  const BASE_URL = "https://aifais.com";
  const sectorSlug = decodedSector;
  const projects = getProjects(locale);

  // Schema.org Graph
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": data.h1,
      "provider": {
        "@type": "LocalBusiness",
        "name": "AIFAIS"
      },
      "description": data.description,
      "audience": {
        "@type": "Audience",
        "audienceType": data.name
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}/${locale}` },
        { "@type": "ListItem", "position": 2, "name": "MKB Sectoren", "item": `${BASE_URL}/${locale}/mkb` },
        { "@type": "ListItem", "position": 3, "name": data.name, "item": `${BASE_URL}/${locale}/mkb/${sectorSlug}` }
      ]
    }
  ];

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Sector Specific Hero */}
      <section className="bg-linear-to-br from-[#1e3a8a] to-[#0f172a] py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500 opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-sm font-bold mb-6 backdrop-blur-md border border-white/20">
              {locale === 'en' ? `AI Solutions for ${data.name}` : `AI Oplossingen voor de ${data.name}`}
            </span>
            <h1 className={`${h1_font.className} text-5xl md:text-7xl font-bold mb-8 leading-tight text-white`}>
              {data.h1}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              {data.intro}
            </p>

            {/* 🔥 Citation Snippet Box */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-10 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold tracking-widest uppercase text-blue-200">Sector Inzicht</span>
              </div>
              <p className="text-lg md:text-xl font-medium leading-relaxed italic text-white/95">
                "{data.citationSnippet}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href={`/${locale}/contact?sector=${decodedSector}`}
                className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-full text-center hover:bg-blue-600 transition-all hover:scale-105 shadow-xl"
              >
                {t("cta", { city: data.name })}
              </Link>
              <div className="flex items-center gap-4 text-sm font-medium text-blue-100/80 italic">
                <span>{locale === 'en' ? `Already helping 5+ ${data.name} firms` : `Helpt al 5+ ${data.name} experts`}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 text-center">
                {locale === 'en' ? 'Common Challenges' : 'Herkent u deze uitdagingen?'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.painPoints.map((point: string, i: number) => (
                    <div key={i} className="p-6 bg-red-50/30 border border-red-100 rounded-2xl">
                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold mb-4">!</div>
                        <p className="text-gray-700 font-medium">{point}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 leading-tight">
                {locale === 'en' ? 'Pragmatic AI Solutions' : 'Pragmatische AI Oplossingen'}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {locale === 'en' 
                  ? `AIFAIS understands the specific workflows in the ${data.name} sector. We don't just deliver software, we deliver measurable business results.` 
                  : `AIFAIS begrijpt de specifieke workflows in de ${data.name}. We leveren geen software, we leveren meetbaar resultaat voor uw kantoor of webshop.`}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-3xl font-bold text-[#3066be] mb-2">{data.localStats.stat1}</div>
                  <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">{data.localStats.label1}</div>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-3xl font-bold text-[#3066be] mb-2">{data.localStats.stat2}</div>
                  <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">{data.localStats.label2}</div>
                </div>
              </div>

              {/* ROI BOX */}
              <div className="p-8 bg-linear-to-r from-[#3066be] to-[#1e3a8a] rounded-2xl text-white">
                <h3 className="text-xl font-bold mb-2">{locale === 'en' ? 'Potential ROI' : 'Verwachte ROI'}</h3>
                <p className="text-3xl font-bold mb-2">{data.roiExample.euro}</p>
                <p className="text-blue-100">{data.roiExample.timeframe} ({data.roiExample.hours} besparing)</p>
                <Link href={`/${locale}/tools/roi-calculator?sector=${decodedSector}`} className="mt-6 inline-block text-sm font-bold border-b border-blue-400 pb-1 hover:text-blue-200 transition-colors">
                    {locale === 'en' ? 'Calculate your ROI exactly' : 'Bereken exact uw ROI'} →
                </Link>
              </div>
            </div>

            <div className="grid gap-6">
              {data.solutions.map((service: { title: string; desc: string; icon: string }, i: number) => (
                <div key={i} className="group p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#3066be]/20 transition-all flex gap-6 items-start">
                  <div className="text-4xl bg-gray-50 p-4 rounded-xl group-hover:bg-[#3066be]/5 transition-colors">{service.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sector FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {locale === 'en' ? `Common Questions in ${data.name}` : `Veelgestelde vragen voor ${data.name}`}
          </h2>
          <div className="space-y-6">
            {data.faq.map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3066be]/10 text-[#3066be] rounded-full flex items-center justify-center text-sm font-bold">?</span>
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Component */}
      <HomeClient projects={projects} />
    </main>
  );
}
