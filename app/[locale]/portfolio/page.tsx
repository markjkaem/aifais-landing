// ========================================
// FILE: app/portfolio/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import { projects } from "./data";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Portfolio | Bedrijfsautomatisering Cases | AIFAIS",
  description:
    "Bekijk onze succesvolle automatisering projecten voor Nederlandse MKB-bedrijven. Van lead-automatisering tot data-integratie. Bewezen resultaten.",

  keywords: [
    "automatisering portfolio",
    "automatisering voorbeelden",
    "automatisering cases",
    "bedrijfsautomatisering projecten Nederland",
    "bedrijfsautomatisering voorbeelden",
    "mkb automatisering cases",
  ],

  openGraph: {
    title: "Portfolio | Bedrijfsautomatisering Cases | AIFAIS",
    description:
      "Bekijk onze succesvolle automatisering projecten voor Nederlandse MKB-bedrijven.",
    url: "https://aifais.com/portfolio",
    type: "website",
    images: [
      {
        url: "https://aifais.com/og-portfolio.jpg",
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
  return (
    <>
      {/* ✅ SCHEMA.ORG - COLLECTION PAGE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Portfolio - Bedrijfsautomatisering Cases",
            description:
              "Overzicht van succesvolle automatisering projecten voor MKB bedrijven",
            url: "https://aifais.com/portfolio",
            provider: {
              "@type": "Organization",
              name: "AIFAIS",
              "@id": "https://aifais.com/#organization",
            },
            hasPart: projects.map((project) => ({
              "@type": "CreativeWork",
              name: project.title,
              description: project.description,
              url: `https://aifais.com/portfolio/${project.slug}`,
              image: `https://aifais.com${project.image}`,
            })),
          }),
        }}
      />

      {/* ✅ IMPROVED: Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-950 to-gray-950">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <header className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Portfolio: Succesvolle{" "}
              <span className="text-purple-400">Automatisering</span> Projecten
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Ontdek hoe we Nederlandse MKB-bedrijven helpen met het
              automatiseren van repetitieve processen. Van lead-opvolging tot
              data-synchronisatie.
            </p>

            {/* ✅ NEW: Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl mx-auto">
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-400">
                  {projects.length}+
                </p>
                <p className="text-sm text-gray-400">Projecten</p>
              </div>
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-400">50+</p>
                <p className="text-sm text-gray-400">Bedrijven</p>
              </div>
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-400">40+</p>
                <p className="text-sm text-gray-400">Uur/maand bespaard</p>
              </div>
            </div>
          </header>
        </div>
      </section>

      {/* ✅ IMPROVED: Projects Grid */}
      <section className="py-16 md:py-24 bg-gray-950 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="group rounded-2xl overflow-hidden border border-gray-700 bg-gray-950 hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300"
              >
                <Link href={`/portfolio/${project.slug}`}>
                  {/* ✅ IMPROVED: Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-800">
                    <img
                      src={project.image}
                      alt={`${project.title} - bedrijfsautomatisering case study`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      width={400}
                      height={224}
                    />
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <span className="text-purple-400 font-semibold group-hover:underline">
                        Bekijk Case →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* ✅ NEW: Empty State (if no projects) */}
          {projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                Nieuwe cases worden binnenkort toegevoegd. Check later terug!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ✅ IMPROVED: CTA Section */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-black text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar Voor Jouw Eigen{" "}
            <span className="text-purple-400">Automatisering Succes</span>?
          </h2>
          <p className="mt-4 text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Net als deze bedrijven kun jij 40+ uur per maand besparen. Plan een
            gratis haalbaarheidscheck en ontdek jouw mogelijkheden.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quickscan"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-400 text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              Bereken Mijn Besparing →
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-purple-500 text-purple-400 font-semibold rounded-xl hover:bg-purple-500 hover:text-black transition"
            >
              Plan een Gesprek
            </Link>
          </div>

          {/* ✅ NEW: Trust signals */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-500 mb-4">
              Vertrouwd door 50+ Nederlandse bedrijven
            </p>
            <div className="flex flex-wrap gap-6 justify-center items-center opacity-50 grayscale">
              <img
                src="/logo-1.webp"
                alt="Client logo"
                width={100}
                height={40}
                className="h-8 object-contain invert"
              />
              <img
                src="/n8n.svg"
                alt="Automatisering platform"
                width={100}
                height={40}
                className="h-8 object-contain invert"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
