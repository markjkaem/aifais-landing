// ========================================
// FILE: app/news/[slug]/ClientWrapper.tsx
// ========================================

"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState, useMemo, useCallback } from "react";

// ✅ Type Definitions
interface Article {
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  authorBio?: string;
  category?: string;
  image?: string;
  tags?: string[];
  [key: string]: any;
}

interface ClientWrapperProps {
  article: Article;
  slug: string;
  cleanContent: string;
  readTime: number;
  relatedArticles: any[];
}

// ✅ Helper to generate safe IDs for headers
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

// ========================================
// SUB-COMPONENTS
// ========================================

function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // 1. Extract headings from raw markdown
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];

    const extractedHeadings = matches.map((match) => ({
      id: slugify(match[2]), // Generate text-based ID
      text: match[2],
      level: match[1].length,
    }));

    setHeadings(extractedHeadings);

    // 2. Set up Observer for scrolling highlight
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

    // Wait for DOM to paint
    setTimeout(() => {
      extractedHeadings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.observe(element);
      });
    }, 100);

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block fixed left-8 top-44 w-64 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 sticky top-32 backdrop-blur-sm">
        <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
          Inhoudsopgave
        </h4>
        <nav>
          <ul className="space-y-1 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: (heading.level - 2) * 12 }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    setActiveId(heading.id);
                  }}
                  className={`block py-1.5 border-l-2 pl-3 transition-all duration-200 ${
                    activeId === heading.id
                      ? "border-purple-500 text-purple-400 font-medium translate-x-1"
                      : "border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"
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
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 mt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-medium">Leesvoortgang</span>
        <span className="text-xs text-purple-400 font-bold">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function StickyRightSidebar({
  article,
  slug,
}: {
  article: Article;
  slug: string;
}) {
  const shareUrl = `https://aifais.com/news/${slug}`;

  return (
    <aside className="hidden xl:block absolute right-8 top-32 w-72">
      <div className="space-y-6 sticky top-32">
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
            Deel dit artikel
          </h4>
          <div className="space-y-3">
            <ShareLink
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                article.title
              )}&url=${encodeURIComponent(shareUrl)}`}
              label="Twitter / X"
              icon={
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              }
            />
            <ShareLink
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                shareUrl
              )}`}
              label="LinkedIn"
              icon={
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              }
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
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
                Link kopiëren
              </span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-gray-900/40 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors" />
          <h4 className="text-lg font-bold text-white mb-2 relative z-10">
            Klaar om te starten?
          </h4>
          <p className="text-sm text-gray-300 mb-4 relative z-10">
            Ontdek in 2 minuten hoeveel tijd je kunt besparen.
          </p>
          <a
            href="/quickscan"
            className="relative z-10 block w-full px-4 py-3 bg-white text-purple-900 font-bold rounded-lg hover:bg-gray-100 transition text-center shadow-lg"
          >
            Gratis Quickscan →
          </a>
        </div>

        <ReadingProgress />
      </div>
    </aside>
  );
}

// Helper component to dry up share links
const ShareLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition group"
  >
    <svg
      className="w-5 h-5 text-gray-400 group-hover:text-blue-400"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      {icon}
    </svg>
    <span className="text-gray-300 group-hover:text-white text-sm font-medium">
      {label}
    </span>
  </a>
);

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShow(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 left-6 z-40 w-12 h-12 bg-gray-800 border border-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-all duration-300 xl:hidden ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
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

function FloatingShareButton({
  article,
  slug,
}: {
  article: Article;
  slug: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = `https://aifais.com/news/${slug}`;

  return (
    <div className="xl:hidden fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:bg-purple-700 transition"
        aria-label="Deel artikel"
      >
        {isOpen ? (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
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
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-900 border border-gray-700 rounded-xl p-2 shadow-2xl space-y-1 min-w-[200px] animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Mobile Share Links simplified */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              article.title
            )}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition text-sm text-white"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition text-sm text-white"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition text-sm text-white w-full text-left"
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
            Kopieer Link
          </button>
        </div>
      )}
    </div>
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
}: ClientWrapperProps) {
  // ✅ Memoize Markdown components to prevent unnecessary re-renders during scroll
  const markdownComponents = useMemo(
    () => ({
      h2: ({ node, children, ...props }: any) => {
        // ✅ CRITICAL FIX: Add IDs to H2 so the TOC works
        const id = slugify(children);
        return (
          <h2
            id={id}
            className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 leading-tight scroll-mt-24"
            {...props}
          >
            {children}
          </h2>
        );
      },
      h3: ({ node, children, ...props }: any) => {
        const id = slugify(children);
        return (
          <h3
            id={id}
            className="text-xl md:text-2xl font-bold text-white mt-8 mb-4 leading-snug scroll-mt-24"
            {...props}
          >
            {children}
          </h3>
        );
      },
      h4: ({ node, ...props }: any) => (
        <h4
          className="text-lg md:text-xl font-bold text-white mt-6 mb-3"
          {...props}
        />
      ),
      p: ({ node, ...props }: any) => (
        <p className="text-gray-300 text-lg leading-relaxed mb-6" {...props} />
      ),
      ul: ({ node, ...props }: any) => (
        <ul
          className="list-disc ml-6 my-6 text-gray-300 space-y-2 marker:text-purple-500"
          {...props}
        />
      ),
      ol: ({ node, ...props }: any) => (
        <ol
          className="list-decimal ml-6 my-6 text-gray-300 space-y-2 marker:text-purple-500"
          {...props}
        />
      ),
      li: ({ node, ...props }: any) => (
        <li className="text-gray-300 leading-relaxed pl-2" {...props} />
      ),
      a: ({ node, href, ...props }: any) => (
        <a
          href={href}
          className="text-purple-400 font-medium hover:text-purple-300 hover:underline decoration-purple-500/30 underline-offset-4"
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          {...props}
        />
      ),
      strong: ({ node, ...props }: any) => (
        <strong className="text-white font-semibold" {...props} />
      ),
      blockquote: ({ node, ...props }: any) => (
        <blockquote
          className="border-l-4 border-purple-500 pl-6 py-3 my-8 italic text-gray-400 bg-gray-900/50 rounded-r-lg"
          {...props}
        />
      ),
      code: ({ node, inline, ...props }: any) =>
        inline ? (
          <code
            className="text-purple-300 bg-gray-800/80 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-700/50"
            {...props}
          />
        ) : (
          <code
            className="block bg-gray-950 border border-gray-800 rounded-xl p-5 overflow-x-auto text-sm font-mono my-6 custom-scrollbar"
            {...props}
          />
        ),
      img: ({ node, ...props }: any) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          {...props}
          className="rounded-xl shadow-lg my-10 w-full border border-gray-800"
          loading="lazy"
          alt={props.alt || "Article Image"}
        />
      ),
      hr: ({ node, ...props }: any) => (
        <hr className="border-gray-800 my-12" {...props} />
      ),
    }),
    []
  );

  return (
    <>
      <div className="relative">
        <TableOfContents content={article.content} />

        <article className="py-12 md:py-6 bg-black min-h-screen">
          <div className="max-w-3xl px-6 mx-auto">
            {/* Markdown Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {cleanContent}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-800">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-md text-sm hover:border-purple-500 hover:text-purple-400 transition cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Box */}
            {article.authorBio && (
              <div className="mt-12 bg-gray-900/30 border border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg ring-4 ring-gray-900">
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                    {article.author}
                    <span className="px-2 py-0.5 bg-purple-900/50 text-purple-300 text-[10px] uppercase tracking-wider rounded border border-purple-500/20">
                      Auteur
                    </span>
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {article.authorBio}
                  </p>
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
        <section className="py-20 bg-gray-950 border-t border-gray-900">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-2xl font-bold mb-10 text-white flex items-center gap-3">
              <span className="w-1 h-8 bg-purple-600 rounded-full"></span>
              Lees ook dit
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/news/${related.slug}`}
                  className="group flex flex-col h-full bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300"
                >
                  {related.image && (
                    <div className="overflow-hidden h-48 relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-purple-400 transition line-clamp-2">
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

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950/20"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Klaar Voor Jouw Eigen{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
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
