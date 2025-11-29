// ========================================
// FILE: app/news/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { news } from "./data"; // Adjust path if your data is elsewhere

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Kennisbank & Nieuws | AI & Automatisering Inzichten | AIFAIS",
  description:
    "Blijf op de hoogte van de laatste trends in bedrijfsautomatisering, n8n tutorials, AI-integraties en praktische tips voor het MKB.",
  keywords: [
    "automatisering blog",
    "n8n tutorials nederlands",
    "ai nieuws mkb",
    "bedrijfsprocessen optimaliseren tips",
    "chatgpt zakelijk gebruik",
    "aifais kennisbank",
  ],
  openGraph: {
    title: "AIFAIS Kennisbank | Slimmer Werken met Automatisering",
    description:
      "Praktische tips, cases en nieuws over AI en workflow automatisering.",
    url: "https://aifais.com/news",
    type: "website",
    locale: "nl_NL",
    siteName: "AIFAIS",
    images: [
      {
        url: "https://aifais.com/og-news.jpg",
        width: 1200,
        height: 630,
        alt: "AIFAIS Kennisbank Overview",
      },
    ],
  },
  alternates: {
    canonical: "https://aifais.com/news",
  },
};

export default function NewsIndexPage() {
  // ✅ SCHEMA: CollectionPage
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AIFAIS Kennisbank",
    description: "Artikelen en handleidingen over bedrijfsautomatisering.",
    url: "https://aifais.com/news",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: news.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://aifais.com/news/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* ✅ HERO SECTION */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-black via-gray-950 to-gray-950 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 border border-purple-500/30 bg-purple-500/10 text-purple-300 rounded-full text-sm font-semibold tracking-wide uppercase">
            Kennisbank
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Inzichten in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Slimme Automatisering
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Praktische gidsen, updates over AI-technologie en tips om jouw
            bedrijf efficiënter te maken.
          </p>
        </div>
      </section>

      {/* ✅ ARTICLES GRID */}
      <section className="py-16 md:py-24 bg-gray-950 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <article
                key={article.slug}
                className="group flex flex-col h-full rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 hover:shadow-2xl hover:shadow-purple-900/10 hover:border-purple-500/50 transition-all duration-300"
              >
                <Link
                  href={`/news/${article.slug}`}
                  className="flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gray-800">
                    {article.image && (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />

                    {/* Category Badge */}
                    {article.category && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                        {article.category}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Meta Data */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <time dateTime={new Date(article.date).toISOString()}>
                        {new Date(article.date).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      <span>•</span>
                      <span>{article.readTime || 5} min lezen</span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center text-sm font-semibold text-purple-400 group-hover:translate-x-1 transition-transform pt-4 border-t border-gray-800 mt-auto">
                      Lees Artikel
                      <svg
                        className="w-4 h-4 ml-2"
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
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Empty State / Coming Soon */}
          {news.length === 0 && (
            <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
              <p className="text-gray-400">
                Er zijn nog geen artikelen geplaatst. Kom binnenkort terug!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ✅ NEWSLETTER / CTA */}
      <section className="py-20 bg-black border-t border-gray-900">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Direct aan de slag met automatiseren?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Lezen is goed, doen is beter. Ontdek binnen 2 minuten waar jouw
            kansen liggen met onze gratis quickscan.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/quickscan"
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Start Quickscan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
