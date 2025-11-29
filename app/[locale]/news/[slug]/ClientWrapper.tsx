// ========================================
// FILE: app/news/[slug]/ClientWrapper.tsx
// ========================================

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState, useMemo } from "react";

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
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// ... (Sub-components TableOfContents, ReadingProgress, StickyRightSidebar, etc. remain the same) ...
// (I will omit them here for brevity, but keep them in your file!)

// ========================================
// SUB-COMPONENTS (Keep these exactly as they were)
// ========================================

function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];
    const extractedHeadings = matches.map((match) => ({
      id: slugify(match[2]),
      text: match[2],
      level: match[1].length,
    }));
    setHeadings(extractedHeadings);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

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
                    document
                      .getElementById(heading.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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

// ... (Include ReadingProgress, StickyRightSidebar, etc.) ...
// START MOCK COMPONENTS (Replace with your actual components if you copy-paste this block)
function ReadingProgress() {
  return null;
}
function StickyRightSidebar({ article, slug }: any) {
  return null;
}
function FloatingShareButton({ article, slug }: any) {
  return null;
}
function BackToTop() {
  return null;
}
// END MOCK COMPONENTS

// ========================================
// MAIN CLIENT WRAPPER (UPDATED)
// ========================================
export function ClientWrapper({
  article,
  slug,
  cleanContent,
  readTime,
  relatedArticles,
}: ClientWrapperProps) {
  // ✅ Markdown Configuration
  const markdownComponents = useMemo(
    () => ({
      h2: ({ node, children, ...props }: any) => {
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

        {/* ✅ REMOVED HEADER SECTION (It is now in page.tsx) */}

        <article className="pb-12 md:pb-20 bg-black min-h-screen">
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

      {/* REMOVED: Related Articles (Moved to page.tsx) */}
      {/* REMOVED: CTA Section (Moved to page.tsx) */}
    </>
  );
}
