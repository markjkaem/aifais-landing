import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServices } from "../data";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const services = getServices(locale);
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return { title: "Dienst Niet Gevonden | AIFAIS" };
  }

  return {
    title: `${service.title} | AIFAIS Automatisering`,
    description: service.aeoSnippet || service.description,
    openGraph: {
      title: service.title,
      description: service.aeoSnippet || service.description,
      type: "website",
      url: `https://aifais.com/${locale}/diensten/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const locales = ["nl", "en"];
  const allParams = [];
  
  for (const locale of locales) {
    const services = getServices(locale);
    for (const service of services) {
      allParams.push({ locale, slug: service.slug });
    }
  }
  
  return allParams;
}

export default async function ServiceDetailPage({
  params,
}: Props) {
  const { slug, locale } = await params;
  const services = getServices(locale);
  const service = services.find((s) => s.slug === slug);
  const t = await getTranslations({ locale, namespace: "serviceDetail" });

  if (!service) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://aifais.com/${locale}/diensten/${slug}#service`,
        padding: "service.title",
        name: service.title,
        description: service.aeoSnippet,
        serviceType: service.title,
        provider: {
          "@type": "LocalBusiness",
          "@id": "https://aifais.com/#organization",
          name: "AIFAIS",
          image: "https://aifais.com/logo_official.png",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Groningenweg 8",
            postalCode: "2803 PV",
            addressLocality: "Gouda",
            addressRegion: "Zuid-Holland",
            addressCountry: "NL",
          },
          priceRange: "€2500 - €5000+",
        },
        areaServed: {
          "@type": "Country",
          name: "Nederland",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Features",
          itemListElement: service.features.map((feature) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: feature,
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `https://aifais.com/${locale}/diensten/${slug}#faq`,
        mainEntity: service.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `https://aifais.com/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Diensten",
            item: `https://aifais.com/${locale}/diensten`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `https://aifais.com/${locale}/diensten/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- HERO --- */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden border-b border-gray-200">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3066be]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <Link
            href={`/${locale}/diensten`}
            className="inline-block mb-6 text-sm text-gray-500 hover:text-[#3066be] transition"
          >
            ← {t("back")}
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            {service.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#3066be] font-medium mb-6">
            {service.subtitle}
          </p>

          <div className="my-10 p-6 bg-[#3066be]/5 border-l-4 border-[#3066be] rounded-r-xl text-left max-w-3xl mx-auto">
            <h3 className="text-[#3066be] font-bold uppercase tracking-wider text-xs mb-2">
              {t("shortIntro")}
            </h3>
            <p className="text-lg font-medium text-gray-800 leading-relaxed">
              {service.aeoSnippet}
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-[#234a8c] transition-all hover:-translate-y-1 shadow-lg shadow-[#3066be]/20"
            >
              {t("ctaTalk")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-4 border border-gray-300 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              {t("ctaAnalysis")}
            </Link>
          </div>
        </div>
      </section>

      {/* --- BENEFITS & FEATURES --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Features */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {t("featuresTitle")}
              </h2>
              <div className="space-y-6">
                {service.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-[#3066be]/10 text-[#3066be] rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {t("benefitsTitle")}
              </h2>
              <ul className="space-y-4">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 p-6 bg-white rounded-2xl border border-[#3066be]/20 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t("readyTitle")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("readySubtitle", { service: service.title.toLowerCase() })}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="text-[#3066be] font-bold hover:text-[#234a8c] flex items-center gap-2"
                >
                  {t("readyLink")} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("faqTitle")}
          </h2>
          <div className="space-y-6">
            {service.faq.map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-[#3066be]/30 transition"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 bg-gradient-to-b from-white to-white text-center border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t("footerTitle")}
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            {t("footerText")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#3066be] hover:bg-[#234a8c] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#3066be]/20 hover:-translate-y-1"
          >
            {t("footerCta")}
          </Link>
        </div>
      </section>
    </main>
  );
}
