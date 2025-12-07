// ========================================
// FILE: app/news/[slug]/page.tsx
// ========================================

import Link from "next/link";
import Image from "next/image"; // ✅ Added for LCP optimization
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientWrapper } from "./ClientWrapper";
import { news } from "../data";

const SITE_URL = "https://aifais.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ✅ SEO METADATA
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((p) => p.slug === slug);

  if (!article) {
    return {
      title: "Artikel Niet Gevonden | AIFAIS",
      robots: { index: false, follow: false },
    };
  }

  const ogImage = article.image
    ? `${SITE_URL}${article.image}`
    : `${SITE_URL}/og-news.jpg`;

  return {
    title: `${article.title} | AIFAIS Kennisbank`,
    description: article.excerpt,
    authors: [{ name: article.author }],
    keywords: [
      "AI automatisering kennisbank",
      "n8n tutorials",
      "bedrijfsprocessen optimaliseren",
      ...((article.tags as string[]) || []),
    ],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `${SITE_URL}/news/${slug}`,
      publishedTime: new Date(article.date).toISOString(),
      modifiedTime: article.updatedAt
        ? new Date(article.updatedAt).toISOString()
        : undefined,
      authors: [article.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      siteName: "AIFAIS",
      locale: "nl_NL",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
      creator: "@aifais",
    },
    alternates: {
      canonical: `${SITE_URL}/news/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return news.map((article) => ({
    slug: article.slug,
  }));
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = news.find((p) => p.slug === slug);

  if (!article) {
    return notFound();
  }

  // Pre-calculations
  const wordCount = article.content.split(/\s+/).length;
  const readTime = article.readTime || Math.ceil(wordCount / 200);
  const relatedArticles = news.filter((a) => a.slug !== slug).slice(0, 3);
  const cleanContent = article.content.trim().replace(/\r\n/g, "\n");
  const articleUrl = `${SITE_URL}/news/${slug}`;
  const imageUrl = article.image ? `${SITE_URL}${article.image}` : undefined;

  // 1. Blog Posting Schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: imageUrl ? [imageUrl] : [],
    datePublished: new Date(article.date).toISOString(),
    dateModified: article.updatedAt
      ? new Date(article.updatedAt).toISOString()
      : new Date(article.date).toISOString(),
    author: {
      "@type": "Person",
      name: article.author,
      url: `${SITE_URL}/#about`,
    },
    publisher: {
      "@type": "Organization",
      name: "AIFAIS",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo_official.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: article.tags?.join(", "),
  };

  // 2. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kennisbank",
        item: `${SITE_URL}/news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Navigation Header (Consistent UI) */}
      <nav
        className="bg-black py-4 border-b border-gray-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-80"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-6 max-w-4xl">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-400 hover:text-gray-400 transition"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-600 flex items-center">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>
              <Link
                href="/news"
                className="text-gray-400 hover:text-gray-400 transition"
              >
                Kennisbank
              </Link>
            </li>
            <li className="text-gray-600 flex items-center">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li
              className="text-white font-medium truncate max-w-[150px] sm:max-w-xs md:max-w-none"
              aria-current="page"
            >
              {article.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* ✅ SERVER-SIDE HERO (H1 & Image moved here for SEO/LCP) */}
      <div className="bg-black pt-12 md:pt-20 pb-0">
        <div className="max-w-3xl px-6 mx-auto">
          <header className="mb-10">
            {/* Category */}
            {article.category && (
              <span className="inline-block px-4 py-1.5 bg-gray-600/10 text-gray-400 border border-gray-600/20 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                {article.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-white tracking-tight">
              {article.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm pb-8 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-gray-600 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="block text-white font-medium">
                    {article.author}
                  </span>
                  <span className="text-xs text-gray-500">Aifais Redactie</span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-gray-800 pl-4 h-8">
                <time
                  dateTime={new Date(article.date).toISOString()}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
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
                  {new Date(article.date).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
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
                  {readTime} min lezen
                </span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mt-8 font-light">
              {article.excerpt}
            </p>
          </header>

          {/* Featured Image - Optimized */}
          {article.image && (
            <figure className="mb-12 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
              <Image
                src={article.image}
                alt={article.title}
                width={1200}
                height={630}
                priority // ✅ Critical for Core Web Vitals
                className="relative rounded-xl w-full object-cover shadow-2xl bg-gray-900 aspect-video border border-gray-800"
              />
            </figure>
          )}
        </div>
      </div>

      {/* Client Logic (Content Rendering & Sidebar) */}
      <ClientWrapper
        article={article}
        slug={slug}
        cleanContent={cleanContent}
        readTime={readTime}
        relatedArticles={relatedArticles}
      />

      {/* ✅ RELATED ARTICLES (Moved to Server Component for SEO & Performance) */}
      {relatedArticles.length > 0 && (
        <section className="py-20 bg-gray-950 border-t border-gray-900">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-2xl font-bold mb-10 text-white flex items-center gap-3">
              <span className="w-1 h-8 bg-gray-600 rounded-full"></span>
              Lees ook dit
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/news/${related.slug}`}
                  className="group flex flex-col h-full bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-500/50 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-300"
                >
                  {related.image && (
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10" />
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-gray-400 transition line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                      {related.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-800">
                      <span>
                        {new Date(related.date).toLocaleDateString("nl-NL", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
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
                        {Math.ceil(related.content.split(/\s+/).length / 200)}{" "}
                        min
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ✅ CTA SECTION */}
      <section className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-950/20"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Klaar Voor Jouw Eigen{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-pink-400">
              Automatisering
            </span>
            ?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Net als in dit artikel beschreven, kunnen we jouw bedrijf helpen met
            workflow automatisering. Plan een gratis haalbaarheidscheck en
            ontdek jouw besparing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quickscan"
              className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              Bereken Mijn Besparing →
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-700 bg-gray-900/50 text-white font-semibold rounded-xl hover:bg-gray-800 transition hover:border-gray-500 backdrop-blur-sm"
            >
              Plan een Gesprek
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
