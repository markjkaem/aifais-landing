// ========================================
// FILE: app/diensten/[slug]/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "../data";

// 1. GENERATE METADATA (Dynamisch per dienst)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return { title: "Dienst Niet Gevonden | AIFAIS" };
  }

  return {
    title: `${service.title} | AIFAIS Automatisering`,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      type: "website",
      url: `https://aifais.com/diensten/${slug}`,
    },
  };
}

// 2. STATIC PARAMS (Zorgt dat deze pagina's ultrasnel laden)
export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

// 3. PAGE COMPONENT
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // ✅ SCHEMA: Service + FAQ (100% Validatie Proof)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://aifais.com/diensten/${slug}#service`, // Unieke ID voor deze service
        name: service.title,
        description: service.description,
        serviceType: service.title, // ✅ Hier is serviceType verplicht en toegestaan
        provider: {
          "@type": "LocalBusiness",
          "@id": "https://aifais.com/#organization", // Linkt aan je layout schema
          name: "AIFAIS",
          image: "https://aifais.com/logo_official.png",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Groningenweg 8",
            postalCode: "2803 PV",
            addressLocality: "Gouda",
            addressCountry: "NL",
          },
        },
        areaServed: {
          "@type": "Country",
          name: "Nederland",
        },
        // ✅ Extra detail: Je features als 'aanbod' markeren
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Functionaliteiten",
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
        "@id": `https://aifais.com/diensten/${slug}#faq`,
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
            item: "https://aifais.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Diensten",
            item: "https://aifais.com/diensten",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `https://aifais.com/diensten/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- HERO --- */}
      <section className="relative py-20 md:py-28 bg-black overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <Link
            href="/diensten"
            className="inline-block mb-6 text-sm text-gray-400 hover:text-purple-400 transition"
          >
            ← Terug naar alle diensten
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            {service.title}
          </h1>
          <p className="text-xl md:text-2xl text-purple-400 font-medium mb-6">
            {service.subtitle}
          </p>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {service.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Vraag Advies Aan
            </Link>
            <Link
              href="/quickscan"
              className="px-8 py-4 border border-gray-700 bg-gray-900/50 text-white font-semibold rounded-xl hover:bg-gray-800 transition"
            >
              Doe de Quickscan
            </Link>
          </div>
        </div>
      </section>

      {/* --- BENEFITS & FEATURES --- */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: Features */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                Wat we voor je doen
              </h2>
              <div className="space-y-6">
                {service.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <span className="text-gray-200 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                Het resultaat
              </h2>
              <ul className="space-y-4">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-400 flex-shrink-0"
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
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 p-6 bg-gradient-to-br from-purple-900/20 to-gray-900 rounded-2xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-2">
                  Klaar om te starten?
                </h3>
                <p className="text-gray-400 mb-4">
                  Ontdek hoeveel tijd jij kunt besparen met{" "}
                  {service.title.toLowerCase()}.
                </p>
                <Link
                  href="/contact"
                  className="text-purple-400 font-bold hover:text-purple-300 flex items-center gap-2"
                >
                  Plan een gratis sessie <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 bg-black border-t border-gray-900">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Veelgestelde Vragen
          </h2>
          <div className="space-y-6">
            {service.faq.map((item, i) => (
              <div
                key={i}
                className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition"
              >
                <h3 className="text-lg font-bold text-white mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 bg-gradient-to-b from-black to-purple-950/20 text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Niet zeker of dit bij jou past?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Geen probleem. Plan een vrijblijvend adviesgesprek in. We kijken
            samen naar jouw processen en geven eerlijk advies.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25"
          >
            Plan Adviesgesprek
          </Link>
        </div>
      </section>
    </>
  );
}
