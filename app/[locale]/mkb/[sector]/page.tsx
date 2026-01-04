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

      {/* Hero Section - Premium Dark Design */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3066be]/20 via-transparent to-purple-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(48,102,190,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-[#3066be]/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              {/* Sector badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl mb-8 group hover:bg-white/10 transition-all cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                </span>
                <span className="text-sm font-medium text-white/80">
                  {locale === 'en' ? `AI Solutions for ${data.name}` : `AI Oplossingen voor de ${data.name}`}
                </span>
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              {/* Main headline */}
              <h1 className={`${h1_font.className} text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight`}>
                <span className="text-white">{data.h1.split(' ').slice(0, -2).join(' ')}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-300 to-white">
                  {data.h1.split(' ').slice(-2).join(' ')}
                </span>
              </h1>

              {/* Intro text */}
              <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed max-w-xl">
                {data.intro}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href={`/${locale}/contact?sector=${decodedSector}`}
                  className="group relative px-8 py-4 bg-[#3066be] hover:bg-[#2554a3] text-white font-bold text-base rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(48,102,190,0.3)] hover:shadow-[0_0_40px_rgba(48,102,190,0.5)] transform hover:-translate-y-1"
                >
                  <span>{t("cta", { city: data.name })}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/tools/roi-calculator?sector=${decodedSector}`}
                  className="px-8 py-4 bg-white/5 border border-white/20 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
                >
                  {locale === 'en' ? 'Calculate your ROI' : 'Bereken uw ROI'}
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{locale === 'en' ? '40+ hours saved/week' : '40+ uur besparing/week'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{locale === 'en' ? 'Live within 8 weeks' : 'Live binnen 8 weken'}</span>
                </div>
              </div>
            </div>

            {/* Right side - Citation card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-[#3066be]/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/60">Sector Insight</span>
                </div>
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-white/90 mb-6">
                  &ldquo;{data.citationSnippet}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-[#3066be] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">AIFAIS</div>
                    <div className="text-sm text-white/50">{locale === 'en' ? `${data.name} Specialist` : `${data.name} Specialist`}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-red-700">{locale === 'en' ? 'Common Challenges' : 'Uitdagingen'}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              {locale === 'en' ? 'Recognize these challenges?' : 'Herkent u deze uitdagingen?'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.painPoints.map((point: string, i: number) => (
              <div key={i} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#3066be]/20 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3066be]/10 to-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-[#3066be]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{data.localStats.stat1}</div>
              <div className="text-sm font-medium text-gray-500">{data.localStats.label1}</div>
            </div>

            {/* Stat 2 */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#3066be]/20 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{data.localStats.stat2}</div>
              <div className="text-sm font-medium text-gray-500">{data.localStats.label2}</div>
            </div>

            {/* Stat 3 - ROI */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#3066be]/20 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{data.roiExample.euro}</div>
              <div className="text-sm font-medium text-gray-500">{data.roiExample.timeframe}</div>
            </div>

            {/* Stat 4 - Hours */}
            <div className="group bg-gradient-to-br from-[#3066be] to-blue-700 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-2">{data.roiExample.hours}</div>
              <div className="text-sm font-medium text-blue-100">{locale === 'en' ? 'Time saved' : 'Tijdsbesparing'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 md:py-32 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-50 to-blue-50 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-[#3066be]" />
              <span className="text-sm font-medium text-gray-600">{locale === 'en' ? 'Our Solutions' : 'Onze oplossingen'}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              {locale === 'en' ? 'Pragmatic AI for' : 'Pragmatische AI voor'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-[#3066be]">{data.name}</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {locale === 'en'
                ? `AIFAIS understands the specific workflows in the ${data.name} sector. We don't just deliver software, we deliver measurable business results.`
                : `AIFAIS begrijpt de specifieke workflows in de ${data.name}. We leveren geen software, we leveren meetbaar resultaat.`}
            </p>
          </div>

          {/* Solutions grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {data.solutions.map((service: { title: string; desc: string; icon: string }, i: number) => (
              <div
                key={i}
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500 hover:-translate-y-2"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-[#3066be]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#3066be] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-purple-500 to-[#3066be] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-gray-600">{locale === 'en' ? 'Why AIFAIS' : 'Waarom AIFAIS'}</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 tracking-tight leading-tight">
                {locale === 'en' ? 'Why' : 'Waarom'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-[#3066be]">{data.name}</span>{' '}
                {locale === 'en' ? 'professionals choose AIFAIS' : 'professionals kiezen voor AIFAIS'}
              </h2>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                {locale === 'en'
                  ? `We understand the unique challenges in the ${data.name} sector. Our AI solutions are tailored to your specific workflows and deliver measurable results.`
                  : `Wij begrijpen de unieke uitdagingen in de ${data.name}. Onze AI-oplossingen zijn afgestemd op uw specifieke workflows en leveren meetbaar resultaat.`}
              </p>

              {/* Benefits list */}
              <div className="space-y-5">
                {[
                  { icon: '🎯', title: locale === 'en' ? 'Sector expertise' : 'Sector expertise', desc: locale === 'en' ? `Deep understanding of ${data.name} workflows` : `Diepgaande kennis van ${data.name} workflows` },
                  { icon: '⚡', title: locale === 'en' ? 'Fast implementation' : 'Snelle implementatie', desc: locale === 'en' ? 'First results visible within 2-4 weeks' : 'Eerste resultaten binnen 2-4 weken zichtbaar' },
                  { icon: '🤝', title: locale === 'en' ? 'Personal approach' : 'Persoonlijke aanpak', desc: locale === 'en' ? 'Dedicated support and guidance' : 'Toegewijde ondersteuning en begeleiding' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                      <div className="text-gray-600 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Visual element */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-[#3066be]/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl p-10 border border-gray-100 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-[#3066be] mb-6 shadow-lg shadow-purple-500/30">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{locale === 'en' ? 'Result Guarantee' : 'Resultaatgarantie'}</h3>
                  <p className="text-gray-600">{locale === 'en' ? 'Measurable ROI or your money back' : 'Meetbare ROI of uw geld terug'}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">{locale === 'en' ? 'Average time saved' : 'Gemiddelde tijdsbesparing'}</span>
                    <span className="font-bold text-gray-900">40+ {locale === 'en' ? 'hrs/week' : 'uur/week'}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">{locale === 'en' ? 'Implementation time' : 'Implementatietijd'}</span>
                    <span className="font-bold text-gray-900">2-8 {locale === 'en' ? 'weeks' : 'weken'}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <span className="text-emerald-700">{locale === 'en' ? 'Customer satisfaction' : 'Klanttevredenheid'}</span>
                    <span className="font-bold text-emerald-700">9.2/10</span>
                  </div>
                </div>

                <Link
                  href={`/${locale}/contact?sector=${decodedSector}`}
                  className="mt-8 w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors"
                >
                  {locale === 'en' ? 'Start your free process scan' : 'Start uw gratis proces-scan'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#3066be]" />
              <span className="text-sm font-medium text-gray-600">{locale === 'en' ? 'FAQ' : 'Veelgestelde vragen'}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              {locale === 'en' ? `Questions about AI in ${data.name}` : `Vragen over AI voor ${data.name}`}
            </h2>
          </div>

          {/* FAQ items */}
          <div className="space-y-4">
            {data.faq.map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#3066be]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#3066be]/10 to-blue-100 flex items-center justify-center group-hover:from-[#3066be] group-hover:to-blue-600 transition-all duration-300">
                      <svg className="w-5 h-5 text-[#3066be] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3066be] transition-colors">
                        {item.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More questions CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">{locale === 'en' ? 'Have another question?' : 'Heeft u een andere vraag?'}</p>
            <Link
              href={`/${locale}/contact?sector=${decodedSector}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all"
            >
              {locale === 'en' ? 'Contact us' : 'Neem contact op'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Component */}
      <HomeClient projects={projects} hideHero />
    </main>
  );
}
