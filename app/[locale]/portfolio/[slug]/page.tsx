// ========================================
// FILE: app/portfolio/[slug]/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../data";

// ✅ DYNAMIC METADATA (per project)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Niet Gevonden | Aifais",
    };
  }

  return {
    title: `${project.title} | n8n Workflow Automatisering Case | Aifais`,
    description: `${project.description} Bekijk hoe we dit automatiseerden met n8n voor een Nederlands MKB-bedrijf.`,

    keywords: [
      "n8n case study",
      project.title,
      "workflow automatisering voorbeeld",
      "bedrijfsautomatisering resultaten",
    ],

    openGraph: {
      title: `${project.title} | n8n Case Study`,
      description: project.description,
      url: `https://aifais.com/portfolio/${slug}`,
      type: "article",
      images: [
        {
          url: `https://aifais.com${project.image}`,
          width: 1200,
          height: 630,
          alt: `${project.title} - n8n workflow automatisering case`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${project.title} | n8n Case Study`,
      description: project.description,
      images: [`https://aifais.com${project.image}`],
    },

    alternates: {
      canonical: `https://aifais.com/portfolio/${slug}`,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// ✅ GENERATE STATIC PARAMS (voor static generation)
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function PortfolioItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const project = projects.find((p) => p.slug === slug);

  // ✅ 404 if project not found
  if (!project) {
    notFound();
  }

  // ✅ Find related projects (same category or random 3)
  const relatedProjects = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      {/* ✅ SCHEMA.ORG - CASE STUDY */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: project.title,
            description: project.description,
            image: `https://aifais.com${project.image}`,
            datePublished: project.date || new Date().toISOString(),
            author: {
              "@type": "Organization",
              name: "Aifais",
              "@id": "https://aifais.com/#organization",
            },
            publisher: {
              "@type": "Organization",
              name: "Aifais",
              logo: {
                "@type": "ImageObject",
                url: "https://aifais.com/logo_official.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://aifais.com/portfolio/${slug}`,
            },
          }),
        }}
      />

      {/* ✅ BREADCRUMBS SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
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
                name: "Portfolio",
                item: "https://aifais.com/portfolio",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: project.title,
                item: `https://aifais.com/portfolio/${slug}`,
              },
            ],
          }),
        }}
      />

      {/* ✅ BREADCRUMBS UI */}
      <nav
        className="bg-black py-4 border-b border-gray-800"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <Link
                href="/portfolio"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                Portfolio
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-white font-medium">{project.title}</li>
          </ol>
        </div>
      </nav>

      {/* ✅ HERO SECTION */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container mx-auto px-6 max-w-5xl">
          <header className="text-center mb-12">
            {/* Category Badge */}
            {project.category && (
              <span className="inline-block px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full text-sm font-semibold mb-6">
                {project.category}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {project.title}
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {project.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 justify-center mt-8 text-sm text-gray-400">
              {project.readTime && (
                <span className="flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {project.readTime} min lezen
                </span>
              )}
              {project.date && (
                <span className="flex items-center gap-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(project.date).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              )}
            </div>
          </header>

          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            <img
              src={project.image}
              alt={`${project.title} - n8n workflow automatisering case study`}
              className="w-full h-[400px] md:h-[500px] object-cover"
              loading="eager"
              width={1200}
              height={500}
            />
          </div>
        </div>
      </section>

      {/* ✅ RESULTS SECTION (if available) */}
      {project.results && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Behaalde Resultaten
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {project.results.timeSaved && (
                <div className="bg-gradient-to-br from-purple-900/40 to-gray-800 border border-purple-500/30 rounded-2xl p-8 text-center">
                  <div className="text-5xl font-bold text-purple-400 mb-3">
                    {project.results.timeSaved}
                  </div>
                  <p className="text-gray-300 font-medium">Tijd Bespaard</p>
                </div>
              )}

              {project.results.roiMonths && (
                <div className="bg-gradient-to-br from-green-900/40 to-gray-800 border border-green-500/30 rounded-2xl p-8 text-center">
                  <div className="text-5xl font-bold text-green-400 mb-3">
                    {project.results.roiMonths} maanden
                  </div>
                  <p className="text-gray-300 font-medium">ROI Periode</p>
                </div>
              )}

              {project.results.costSaving && (
                <div className="bg-gradient-to-br from-blue-900/40 to-gray-800 border border-blue-500/30 rounded-2xl p-8 text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-3">
                    {project.results.costSaving}
                  </div>
                  <p className="text-gray-300 font-medium">
                    Jaarlijkse Besparing
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ✅ MAIN CONTENT */}
      <article className="py-16 bg-black">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Details/Features */}
          <section className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6">
              Belangrijkste Features & Impact
            </h2>

            <ul className="space-y-4 text-gray-300">
              {project.details.map((detail, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-gray-900/40 border border-gray-800 rounded-xl p-4 hover:border-purple-500/50 transition"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{detail}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tags (if available) */}
          {project.tags && project.tags.length > 0 && (
            <section className="mt-12 pt-12 border-t border-gray-800">
              <h3 className="text-xl font-bold mb-4">
                Gebruikte Technologieën
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-400 transition text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Testimonial (if available) */}
          {project.testimonial && (
            <section className="mt-12">
              <blockquote className="bg-gradient-to-br from-purple-900/20 to-gray-900/40 border border-purple-500/30 rounded-2xl p-8 md:p-10">
                <p className="text-xl md:text-2xl text-gray-200 italic leading-relaxed mb-6">
                  "{project.testimonial.quote}"
                </p>
                <footer className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-xl">
                    {project.testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {project.testimonial.author}
                    </p>
                    <p className="text-sm text-gray-400">
                      {project.testimonial.role}
                    </p>
                  </div>
                </footer>
              </blockquote>
            </section>
          )}
        </div>
      </article>

      {/* ✅ RELATED PROJECTS */}
      {relatedProjects.length > 0 && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Meer Projecten
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedProjects.map((related) => (
                <Link
                  key={related.slug}
                  href={`/portfolio/${related.slug}`}
                  className="group rounded-2xl overflow-hidden border border-gray-700 bg-gray-950 hover:shadow-xl hover:border-purple-500/50 transition-all"
                >
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    width={400}
                    height={192}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition">
                      {related.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {related.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/portfolio"
                className="inline-block px-6 py-3 border border-purple-500 text-purple-400 rounded-xl hover:bg-purple-500 hover:text-black transition font-semibold"
              >
                Bekijk Alle Projecten
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ✅ CTA SECTION */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-950 text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar Voor Jouw Eigen{" "}
            <span className="text-purple-400">Automatisering Succes</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Net als dit project kunnen we jouw bedrijf helpen 40+ uur per maand
            te besparen. Plan een gratis haalbaarheidscheck.
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

          <p className="text-sm text-gray-500 mt-8">
            Reactie binnen 24 uur • Geen verplichtingen • Gratis consult
          </p>
        </div>
      </section>
    </>
  );
}
