// ========================================
// FILE: app/news/[slug]/page.tsx
// ========================================

import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { news } from "./data";

// ✅ SEO Metadata per blogpagina
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

  // ✅ Clean content - remove leading/trailing whitespace and normalize line breaks
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
        className="bg-gray-950 py-4 border-b border-gray-800"
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

      <article className="py-12 md:py-20 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-3xl px-6 mx-auto">
          <header className="mb-10">
            {article.category && (
              <span className="inline-block px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full text-sm font-semibold mb-6">
                {article.category}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-xs">
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{article.author}</span>
              </div>
              <span>•</span>
              <time dateTime={new Date(article.date).toISOString()}>
                {new Date(article.date).toLocaleDateString("nl-NL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>•</span>
              <span className="flex items-center gap-1">
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
                {readTime} min lezen
              </span>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed">
              {article.excerpt}
            </p>
          </header>

          {article.image && (
            <figure className="mb-10">
              <img
                src={article.image}
                alt={article.title}
                className="rounded-xl w-full object-cover shadow-2xl border border-gray-800"
                width={1200}
                height={630}
                loading="eager"
              />
            </figure>
          )}

          {/* ✅ MARKDOWN CONTENT WITH CUSTOM STYLING */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ node, ...props }) => (
                <h2
                  className="text-3xl font-bold text-white mt-12 mb-6 leading-tight"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-2xl font-bold text-white mt-8 mb-4 leading-snug"
                  {...props}
                />
              ),
              h4: ({ node, ...props }) => (
                <h4
                  className="text-xl font-bold text-white mt-6 mb-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="text-gray-300 text-lg leading-relaxed mb-6"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc ml-6 my-6 text-gray-300 space-y-2"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal ml-6 my-6 text-gray-300 space-y-2"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="text-gray-300 leading-relaxed" {...props} />
              ),
              a: ({ node, href, ...props }) => (
                <a
                  href={href}
                  className="text-purple-400 font-medium hover:text-purple-300 hover:underline"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href?.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="text-white font-semibold" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-purple-500 pl-6 py-2 my-6 italic text-gray-400 bg-gray-900/30"
                  {...props}
                />
              ),
              code: ({ node, inline, ...props }: any) =>
                inline ? (
                  <code
                    className="text-purple-400 bg-gray-800 px-2 py-1 rounded text-sm font-mono"
                    {...props}
                  />
                ) : (
                  <code
                    className="block bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm"
                    {...props}
                  />
                ),
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className="rounded-xl shadow-lg my-8 w-full"
                  loading="lazy"
                />
              ),
              hr: ({ node, ...props }) => (
                <hr className="border-gray-800 my-12" {...props} />
              ),
            }}
          >
            {cleanContent}
          </ReactMarkdown>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm hover:border-purple-500 hover:text-purple-400 transition cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {article.authorBio && (
            <div className="mt-12 bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-2xl">
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white text-lg mb-2">
                    Over {article.author}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {article.authorBio}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">
              Deel dit artikel:
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  article.title
                )}&url=${encodeURIComponent(
                  `https://aifais.com/news/${slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-400 transition flex items-center gap-2 text-gray-300"
                aria-label="Deel op Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `https://aifais.com/news/${slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-500 transition flex items-center gap-2 text-gray-300"
                aria-label="Deel op LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `https://aifais.com/news/${slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition flex items-center gap-2 text-gray-300"
                aria-label="Deel op Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl font-bold mb-10 text-center text-white">
              Lees Ook
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/news/${related.slug}`}
                  className="group rounded-2xl overflow-hidden border border-gray-700 bg-gray-950 hover:shadow-xl hover:border-purple-500/50 transition-all"
                >
                  {related.image && (
                    <div className="overflow-hidden">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        width={400}
                        height={192}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition">
                      {related.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {related.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <time dateTime={new Date(related.date).toISOString()}>
                        {new Date(related.date).toLocaleDateString("nl-NL", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <span>•</span>
                      <span>
                        {related.readTime ||
                          Math.ceil(
                            related.content.split(/\s+/).length / 200
                          )}{" "}
                        min lezen
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/news"
                className="inline-block px-6 py-3 border border-purple-500 text-purple-400 rounded-xl hover:bg-purple-500 hover:text-black transition font-semibold"
              >
                Bekijk Alle Artikelen
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Klaar Voor Jouw Eigen{" "}
            <span className="text-purple-400">Automatisering</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Net als in dit artikel beschreven, kunnen we jouw bedrijf helpen met
            workflow automatisering. Plan een gratis haalbaarheidscheck.
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
