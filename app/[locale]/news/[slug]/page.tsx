// ========================================
// FILE: app/news/[slug]/page.tsx
// ========================================

import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { news } from "./data";
import { ClientWrapper } from "./ClientWrapper";

// ✅ SEO Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const article = news.find((p) => p.slug === slug);

  if (!article) {
    return {
      title: "Artikel Niet Gevonden | Aifais",
    };
  }

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
      publishedTime: new Date(article.date).toISOString(),
      modifiedTime: article.updatedAt
        ? new Date(article.updatedAt).toISOString()
        : undefined,
      authors: [article.author],
      images: article.image
        ? [
            {
              url: `https://aifais.com${article.image}`,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
      url: `https://aifais.com/news/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [`https://aifais.com${article.image}`] : [],
      creator: "@aifais",
    },
    alternates: {
      canonical: `https://aifais.com/news/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return news.map((article) => ({
    slug: article.slug,
  }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const article = news.find((p) => p.slug === slug);

  if (!article) {
    notFound();
  }

  const wordCount = article.content.split(/\s+/).length;
  const readTime = article.readTime || Math.ceil(wordCount / 200);
  const relatedArticles = news.filter((a) => a.slug !== slug).slice(0, 3);
  const cleanContent = article.content.trim().replace(/\r\n/g, "\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.excerpt,
            image: article.image
              ? `https://aifais.com${article.image}`
              : undefined,
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
                url: "https://aifais.com/logo_official.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://aifais.com/news/${slug}`,
            },
            keywords: article.tags?.join(", "),
          }),
        }}
      />

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
                name: "Blog",
                item: "https://aifais.com/news",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: `https://aifais.com/news/${slug}`,
              },
            ],
          }),
        }}
      />

      <nav
        className="bg-black 0 py-4 border-b border-gray-800"
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
            <li className="text-gray-600">/</li>
            <li>
              <div className="text-gray-400 hover:text-purple-400 transition">
                Blog
              </div>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-white font-medium truncate max-w-xs md:max-w-none">
              {article.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* ✅ Wrap everything interactive in ClientWrapper */}
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
