// ========================================
// FILE: app/portfolio/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import { projects } from "./data";
import Image from "next/image";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Portfolio | n8n Workflow Automatisering Cases | Aifais",
  description:
    "Bekijk onze succesvolle n8n workflow automatisering projecten voor Nederlandse MKB-bedrijven. Van lead-automatisering tot data-integratie. Bewezen resultaten.",

  keywords: [
    "n8n portfolio",
    "workflow automatisering voorbeelden",
    "automatisering cases",
    "n8n projecten Nederland",
    "bedrijfsautomatisering voorbeelden",
  ],

  openGraph: {
    title: "Portfolio | n8n Workflow Automatisering Cases | Aifais",
    description:
      "Bekijk onze succesvolle workflow automatisering projecten voor Nederlandse MKB-bedrijven.",
    url: "https://aifais.com/portfolio",
    type: "website",
    images: [
      {
        url: "https://aifais.com/og-portfolio.jpg", // ✅ MAAK DEZE IMAGE (optioneel)
        width: 1200,
        height: 630,
        alt: "Aifais Portfolio - n8n Workflow Automatisering Cases",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Portfolio | n8n Workflow Automatisering Cases",
    description: "Bekijk onze succesvolle workflow automatisering projecten.",
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
            name: "Portfolio - n8n Workflow Automatisering Cases",
            description:
              "Overzicht van succesvolle workflow automatisering projecten",
            url: "https://aifais.com/portfolio",
            provider: {
              "@type": "Organization",
              name: "Aifais",
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-950 to-gray-900">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <header className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Portfolio: Succesvolle{" "}
              <span className="text-purple-400">n8n Workflow</span>{" "}
              Automatiseringen
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
      <section className="py-16 md:py-24 bg-gray-900 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="group rounded-2xl overflow-hidden border border-gray-700 bg-gray-950 hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300"
              >
                <Link href={`/portfolio/${project.slug}`}>
                  {/* ✅ IMPROVED: Image with Next.js Image component (if you want optimization) */}
                  <div className="relative h-56 overflow-hidden bg-gray-800">
                    <img
                      src={project.image}
                      alt={`${project.title} - n8n workflow automatisering case study`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      width={400}
                      height={224}
                    />
                    {/* ✅ NEW: Category Badge (if you have categories in data) */}
                    {/* {project.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {project.category}
                      </span>
                    )} */}
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* ✅ NEW: Tags (if you have them in data) */}
                    {/* {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )} */}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <span className="text-purple-400 font-semibold group-hover:underline">
                        Bekijk Case →
                      </span>

                      {/* ✅ NEW: Read time (if you have it) */}
                      {/* {project.readTime && (
                        <span className="text-gray-500 text-sm">
                          {project.readTime} min lezen
                        </span>
                      )} */}
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

      {/* ✅ NEW: Categories/Filters Section (if you add categories later) */}
      {/* <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Filteren op Type Automatisering
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Alle', 'Lead Automatisering', 'Data Integratie', 'Rapportage', 'CRM'].map((cat) => (
              <button
                key={cat}
                className="px-6 py-3 bg-gray-900 border border-gray-700 rounded-xl hover:border-purple-500 hover:text-purple-400 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section> */}

      {/* ✅ IMPROVED: CTA Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-center">
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
              {/* Add client logos here if you have them */}
              <img
                src="/logo-1.webp"
                alt="Client logo"
                width={100}
                height={40}
                className="h-8 object-contain invert"
              />
              <img
                src="/n8n.svg"
                alt="n8n platform"
                width={100}
                height={40}
                className="h-8 object-contain invert"
              />
              {/* Add more logos */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
