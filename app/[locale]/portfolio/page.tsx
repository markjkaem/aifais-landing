// ========================================
// FILE: app/portfolio/page.tsx - LIGHT THEME
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"; // ✅ CRITICAL IMPORT
import { projects } from "./data";

// ✅ SEO METADATA (Optimized for CTR)
export const metadata: Metadata = {
  title: "Portfolio AI Automatisering | 50+ MKB Cases | AIFAIS",
  description:
    "Bekijk concrete voorbeelden van bedrijfsautomatisering. Zie hoe wij Nederlandse MKB-bedrijven helpen 40+ uur per week te besparen met n8n en AI.",

  keywords: [
    "automatisering portfolio",
    "automatisering voorbeelden",
    "n8n cases nederland",
    "bedrijfsautomatisering projecten",
    "praktijkvoorbeelden ai mkb",
    "workflow automatisering cases",
  ],

  openGraph: {
    title: "Portfolio | 50+ Bedrijfsautomatisering Cases | AIFAIS",
    description:
      "Bekijk onze succesvolle automatisering projecten voor Nederlandse MKB-bedrijven. Concrete resultaten en besparingen.",
    url: "https://aifais.com/portfolio",
    type: "website",
    locale: "nl_NL",
    siteName: "AIFAIS",
    images: [
      {
        url: "https://aifais.com/og-portfolio.jpg", // Ensure this image exists!
        width: 1200,
        height: 630,
        alt: "AIFAIS Portfolio - Bedrijfsautomatisering Cases",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Bedrijfsautomatisering Cases",
    description: "Bekijk onze succesvolle automatisering projecten.",
    images: ["https://aifais.com/og-portfolio.jpg"],
    creator: "@aifais",
  },

  alternates: {
    canonical: "https://aifais.com/portfolio",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Portfolio() {
  // ✅ SCHEMA: ItemList is better for listing pages than just HasPart
  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Portfolio - Bedrijfsautomatisering Cases",
    description:
      "Overzicht van succesvolle automatisering projecten voor MKB bedrijven",
    url: "https://aifais.com/portfolio",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://aifais.com/portfolio/${project.slug}`,
        name: project.title,
        image: `https://aifais.com${project.image}`,
        description: project.description,
      })),
    },
    provider: {
      "@type": "Organization",
      name: "AIFAIS",
      "@id": "https://aifais.com/#organization",
    },
  };

  return (
    <main className="bg-[#fbfff1] min-h-screen text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />

      {/* ✅ HERO SECTION (Light Theme) */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-white border-b border-gray-200">
        {/* Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#3066be]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
          <header className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-6 border border-[#3066be]/20 bg-[#3066be]/5 text-[#3066be] rounded-full text-sm font-semibold tracking-wide uppercase">
              Bewezen Resultaten
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
              Portfolio: Succesvolle{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-purple-600">
                Automatisering
              </span>{" "}
              Projecten
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Ontdek hoe we Nederlandse MKB-bedrijven helpen met het
              automatiseren van repetitieve processen. Van lead-opvolging tot
              complexe data-synchronisatie.
            </p>

            {/* ✅ STATS: Visual Trust (Light Theme) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-12 max-w-3xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <p className="text-4xl font-bold text-[#3066be] mb-1">
                  {projects.length}+
                </p>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  Projecten
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <p className="text-4xl font-bold text-[#3066be] mb-1">50+</p>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  Tevreden Klanten
                </p>
              </div>
              <div className="col-span-2 md:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-purple-600 mb-1">
                  40+
                </p>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  Uur/mnd Bespaard
                </p>
              </div>
            </div>
          </header>
        </div>
      </section>

      {/* ✅ PROJECTS GRID (Light Theme) */}
      <section className="py-16 md:py-24 bg-[#fbfff1] min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <article
                  key={project.slug}
                  className="group flex flex-col h-full rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl hover:shadow-[#3066be]/10 hover:border-[#3066be]/30 transition-all duration-300"
                >
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="flex flex-col h-full"
                    aria-label={`Bekijk case: ${project.title}`}
                  >
                    {/* ✅ OPTIMIZED IMAGE CONTAINER */}
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <Image
                        src={project.image}
                        alt={`${project.title} - bedrijfsautomatisering case study`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                      {/* Optional: Category Badge if exists */}
                      {project.category && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md border border-white/50 rounded-full text-xs font-bold text-[#3066be]">
                          {project.category}
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3066be] transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                        {project.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <span className="text-sm font-bold text-[#3066be] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                          Bekijk Resultaten
                          <svg
                            className="w-4 h-4"
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
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nog geen cases gepubliceerd
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We zijn druk bezig met het documenteren van onze recente
                projecten. Kom binnenkort terug!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ✅ CTA SECTION (Light Theme) */}
      <section className="py-24 bg-gradient-to-b from-[#fbfff1] to-white text-center relative overflow-hidden border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
            Jouw Bedrijf Ook In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-purple-600">
              Dit Portfolio?
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Net als deze bedrijven kun jij 40+ uur per maand besparen. Plan een
            gratis haalbaarheidscheck en ontdek jouw mogelijkheden.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-[#234a8c] transition-all shadow-lg hover:-translate-y-1"
            >
              Gratis analyse gesprek →
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-300 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Plan een Gesprek
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-6 font-semibold">
              Technologieën die wij gebruiken
            </p>
            <div className="flex flex-wrap gap-8 md:gap-12 justify-center items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* ✅ SEO: Use Next/Image for these logos too */}
              <div className="relative h-8 w-24">
                <Image
                  src="/n8n.svg"
                  alt="n8n workflow automation"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-8 w-24">
                <Image
                  src="/openai.svg"
                  alt="OpenAI GPT integratie"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-8 w-24">
                <Image
                  src="/google.svg"
                  alt="Google Workspace Automatisering"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
