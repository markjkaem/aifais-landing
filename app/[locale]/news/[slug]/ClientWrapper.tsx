// ========================================
// FILE: app/news/[slug]/ClientWrapper.tsx
// ========================================

"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";

// ========================================
// All your client components here
// ========================================

function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];

    const extractedHeadings = matches.map((match, index) => ({
      id: `heading-${index}`,
      text: match[2],
      level: match[1].length,
    }));

    setHeadings(extractedHeadings);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    document.querySelectorAll("h2, h3").forEach((heading, index) => {
      heading.id = `heading-${index}`;
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block fixed left-8 top-44 w-64 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 sticky top-32">
        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
          Op deze pagina
        </h4>
        <nav>
          <ul className="space-y-2 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ marginLeft: (heading.level - 2) * 12 }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className={`block py-1 border-l-2 pl-3 transition-colors ${
                    activeId === heading.id
                      ? "border-purple-500 text-purple-400 font-medium"
                      : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-medium">Leesvoortgang</span>
        <span className="text-xs text-purple-400 font-bold">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function StickyRightSidebar({ article, slug }: { article: any; slug: string }) {
  return (
    <aside className="hidden xl:block absolute right-8 top-32 w-72">
      <div className="space-y-6">
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
            Deel dit artikel
          </h4>
          <div className="space-y-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                article.title
              )}&url=${encodeURIComponent(`https://aifais.com/news/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition group"
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white text-sm font-medium">
                Twitter
              </span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `https://aifais.com/news/${slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-600 hover:bg-blue-600/10 transition group"
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white text-sm font-medium">
                LinkedIn
              </span>
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://aifais.com/news/${slug}`
                );
                alert("Link gekopieerd!");
              }}
              className="flex items-center gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition group w-full"
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-300 group-hover:text-white text-sm font-medium">
                Kopieer link
              </span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Meer Automatisering Tips?
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            Ontvang wekelijks praktische tips in je inbox.
          </p>
          <form action="/api/newsletter" method="POST" className="space-y-3">
            <input
              type="email"
              name="email"
              placeholder="je@email.nl"
              required
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Inschrijven
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Geen spam. Uitschrijven wanneer je wilt.
          </p>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Klaar om te starten?
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            Ontdek in 2 minuten hoeveel tijd je kunt besparen.
          </p>
          <a
            href="/quickscan"
            className="block w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition text-center"
          >
            Gratis Quickscan →
          </a>
        </div>

        <ReadingProgress />
      </div>
    </aside>
  );
}

function FloatingShareButton({
  article,
  slug,
}: {
  article: any;
  slug: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="xl:hidden fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:bg-purple-700 transition"
        aria-label="Deel artikel"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl space-y-2 min-w-[200px]">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              article.title
            )}&url=${encodeURIComponent(`https://aifais.com/news/${slug}`)}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition text-sm text-white"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              `https://aifais.com/news/${slug}`
            )}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition text-sm text-white"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://aifais.com/news/${slug}`);
              alert("Link gekopieerd!");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition text-sm text-white w-full text-left"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Kopieer link
          </button>
        </div>
      )}
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gray-800 border border-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition xl:hidden"
      aria-label="Terug naar boven"
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}

// ========================================
// MAIN CLIENT WRAPPER
// ========================================
export function ClientWrapper({
  article,
  slug,
  cleanContent,
  readTime,
  relatedArticles,
}: {
  article: any;
  slug: string;
  cleanContent: string;
  readTime: number;
  relatedArticles: any[];
}) {
  return (
    <>
      <div className="relative">
        <TableOfContents content={article.content} />

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
                      href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
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
                  {article.tags.map((tag: string) => (
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
          </div>
        </article>

        <StickyRightSidebar article={article} slug={slug} />
      </div>

      <FloatingShareButton article={article} slug={slug} />
      <BackToTop />

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
        </div>
      </section>
    </>
  );
}
