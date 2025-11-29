// ========================================
// FILE: app/news/[slug]/page.tsx
// ========================================

import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { news } from "./data";
import { ClientWrapper } from "./ClientWrapper";

// Define a consistent domain constant to avoid repetition
const SITE_URL = "https://aifais.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ✅ SEO Metadata
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((p) => p.slug === slug);

  if (!article) {
    return {
      title: "Artikel Niet Gevonden | Aifais",
      robots: { index: false, follow: false }, // Don't index 404s
    };
  }

  const ogImage = article.image
    ? `${SITE_URL}${article.image}`
    : `${SITE_URL}/default-og.png`; // Fallback image recommended

  return {
    title: `${article.title} | Aifais Blog`,
    description: article.excerpt,
    authors: [{ name: article.author }],
    keywords: [
      "AI automatisering",
      "workflow automatisering",
      "n8n",
      "bedrijfsautomatisering",
      "MKB automatisering",
      article.title,
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
      siteName: "Aifais",
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
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
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

  // Pre-calculate data
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
    image: imageUrl,
    datePublished: new Date(article.date).toISOString(),
    dateModified: article.updatedAt
      ? new Date(article.updatedAt).toISOString()
      : new Date(article.date).toISOString(),
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Aifais",
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
        name: "Blog",
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
      {/* Schema Data (Cleaned up) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Navigation Header */}
      <nav
        className="bg-black py-4 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-6 max-w-4xl">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-600" aria-hidden="true">
              /
            </li>
            <li>
              {/* ✅ FIXED: Changed div to Link so users can actually click 'Blog' */}
              <Link
                href="/news"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                Blog
              </Link>
            </li>
            <li className="text-gray-600" aria-hidden="true">
              /
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

      {/* Content */}
      <ClientWrapper
        article={article}
        slug={slug}
        cleanContent={cleanContent}
        readTime={readTime}
        relatedArticles={relatedArticles}
      />
    </>
  );
}
