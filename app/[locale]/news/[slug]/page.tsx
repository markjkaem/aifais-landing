// ========================================
// FILE: app/news/[slug]/page.tsx
// ========================================

import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientWrapper } from "./ClientWrapper";
import { news } from "../data"; // Zorg dat dit pad klopt

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

  if (!article) return { title: "Niet gevonden", robots: { index: false } };

  const ogImage = article.image
    ? `${SITE_URL}${article.image}`
    : `${SITE_URL}/og-news.jpg`;

  return {
    title: `${article.title} | AIFAIS`,
    // AEO FIX: Gebruik de geoptimaliseerde snippet als description indien beschikbaar
    description: article.aeoSnippet || article.excerpt,
    authors: [{ name: article.author }],
    keywords: article.tags || [],
    openGraph: {
      title: article.title,
      description: article.aeoSnippet || article.excerpt,
      type: "article",
      url: `${SITE_URL}/news/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      siteName: "AIFAIS",
      locale: "nl_NL",
    },
  };
}

export async function generateStaticParams() {
  return news.map((article) => ({ slug: article.slug }));
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = news.find((p) => p.slug === slug);

  if (!article) return notFound();

  // Calculations
  const wordCount = article.content.split(/\s+/).length;
  const readTime = article.readTime || Math.ceil(wordCount / 200);
  const relatedArticles = news.filter((a) => a.slug !== slug).slice(0, 3);
  const cleanContent = article.content.trim().replace(/\r\n/g, "\n");
  const articleUrl = `${SITE_URL}/news/${slug}`;
  const imageUrl = article.image ? `${SITE_URL}${article.image}` : undefined;

  // 1. Blog Posting Schema (Bestaand)
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.aeoSnippet || article.excerpt,
    image: imageUrl ? [imageUrl] : [],
    datePublished: new Date(article.date).toISOString(),
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: "AIFAIS",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };

  // 2. FAQ Page Schema (NIEUW: Voor AEO!)
  // Dit vertelt Google/AI precies welke vragen beantwoord worden
  const faqSchema = article.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      {/* Inject Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Navigatie (Ongewijzigd) */}
      <nav className="bg-white/95 py-4 border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* ... jouw bestaande breadcrumbs ... */}
          <div className="text-sm text-gray-500">
            <Link href="/">Home</Link> / <Link href="/news">Kennisbank</Link> /{" "}
            <span className="text-gray-900 font-medium">{article.title}</span>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="bg-white pt-12 md:pt-20 pb-0 border-b border-gray-100">
        <div className="max-w-3xl px-6 mx-auto">
          <header className="mb-10">
            {article.category && (
              <span className="inline-block px-4 py-1.5 bg-[#3066be]/5 text-[#3066be] border border-[#3066be]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                {article.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900 tracking-tight">
              {article.title}
            </h1>

            {/* Meta Data Row */}
            <div className="flex items-center gap-4 text-gray-500 text-sm pb-8 border-b border-gray-200">
              <span className="font-bold text-gray-900">{article.author}</span>
              <span>•</span>
              <time>{new Date(article.date).toLocaleDateString("nl-NL")}</time>
              <span>•</span>
              <span>{readTime} min lezen</span>
            </div>

            {/* Intro / Excerpt */}
            <p className="text-xl text-gray-600 leading-relaxed mt-8 font-light">
              {article.excerpt}
            </p>
          </header>

          {/* Featured Image */}
          {article.image && (
            <figure className="mb-12 relative shadow-2xl rounded-xl overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                width={1200}
                height={630}
                priority
                className="w-full object-cover aspect-video"
              />
            </figure>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white">
        <ClientWrapper
          article={article}
          slug={slug}
          cleanContent={cleanContent}
          relatedArticles={relatedArticles}
        />
      </div>
    </>
  );
}
