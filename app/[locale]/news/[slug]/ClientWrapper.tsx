// ========================================
// FILE: app/news/[slug]/ClientWrapper.tsx
// ========================================

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo } from "react";
import Link from "next/link";
import ArticleCTA from "@/app/Components/ArticleCTA";


// Types (Zorg dat aeoSnippet hierin zit)
interface Article {
  title: string;
  content: string;
  excerpt: string;
  aeoSnippet?: string; // NIEUW
  date: string;
  author: string;
  authorBio?: string;
  tags?: string[];
  faq?: { question: string; answer: string }[]; // NIEUW
  [key: string]: any;
}

interface ClientWrapperProps {
  article: Article;
  slug: string;
  cleanContent: string;
  relatedArticles: any[];
}

// Helper voor IDs
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// ... TableOfContents Component blijft hetzelfde ... (hier weggelaten voor lengte)

export function ClientWrapper({
  article,
  cleanContent,
  relatedArticles,
}: ClientWrapperProps) {
  // Markdown Components (Hetzelfde als je had, maar schoon)
  const markdownComponents = useMemo(
    () => ({
      h2: ({ children, ...props }: any) => {
        const id = slugify(children?.toString() || "");
        return (
          <h2
            id={id}
            className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mt-16 mb-6 scroll-mt-24 border-b pb-2 border-gray-100"
            {...props}
          >
            {children}
          </h2>
        );
      },
      h3: ({ children, ...props }: any) => {
        const id = slugify(children?.toString() || "");
        return (
          <h3
            id={id}
            className="text-xl md:text-2xl font-bold text-[#3066be] mt-10 mb-4"
            {...props}
          >
            {children}
          </h3>
        );
      },
      p: ({ ...props }: any) => (
        <p className="text-gray-700 text-lg leading-relaxed mb-6" {...props} />
      ),
      ul: ({ ...props }: any) => (
        <ul
          className="list-disc ml-6 my-6 text-gray-700 space-y-2 marker:text-[#3066be]"
          {...props}
        />
      ),
      table: ({ ...props }: any) => (
        <div className="not-prose my-10 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-left text-sm md:text-base" {...props} />
        </div>
      ),
      thead: ({ ...props }: any) => (
        <thead className="bg-[#3066be]/5 border-b border-[#3066be]/10" {...props} />
      ),
      th: ({ ...props }: any) => (
        <th className="px-6 py-4 font-bold text-gray-900 border-r border-[#3066be]/10 last:border-r-0 whitespace-nowrap" {...props} />
      ),
      td: ({ ...props }: any) => (
        <td className="px-6 py-4 text-gray-700 border-t border-gray-100 border-r last:border-r-0" {...props} />
      ),
      tr: ({ ...props }: any) => (
        <tr className="even:bg-gray-50/30 transition-colors" {...props} />
      ),

      // ... voeg je andere custom components hier toe (img, code, etc) ...
      a: ({ href, children, ...props }: any) => {
        const isCTA = children?.toString().includes("→") || children?.toString().toLowerCase().includes("contact") || children?.toString().toLowerCase().includes("gesprek");
        if (isCTA && href) {
          const isInternal = href.startsWith("/") || !href.startsWith("http");
          const buttonClasses = "inline-flex items-center gap-2 px-8 py-4 bg-[#3066be] hover:bg-[#234a8c] text-white font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-[#3066be]/25 active:scale-95 no-underline";
          
          if (isInternal) {
            return (
              <span className="block my-12">
                <Link href={href} className={buttonClasses} {...props}>
                  {children}
                </Link>
              </span>
            );
          }
          return (
            <span className="block my-12">
              <a href={href} className={buttonClasses} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            </span>
          );
        }

        return <a href={href} className="text-[#3066be] hover:underline font-medium" {...props}>{children}</a>;
      },
    }),
    []
  );


  return (
    <>
      <article className="pb-12 md:pb-20">
        <div className="max-w-3xl px-6 mx-auto">
          {/* 🔥 AEO / KEY TAKEAWAY BOX (NIEUW) */}
          {/* Dit blok toont direct het antwoord voor scannende lezers en bots */}
          {article.aeoSnippet && (
            <div className="my-10 p-6 bg-[#3066be]/5 border-l-4 border-[#3066be] rounded-r-xl">
              <h3 className="text-[#3066be] font-bold uppercase tracking-wider text-xs mb-2">
                In het kort
              </h3>
              <p className="text-lg font-medium text-gray-800 leading-relaxed">
                {article.aeoSnippet}
              </p>
            </div>
          )}

          {/* De Artikel Content */}
          <div className="prose prose-lg prose-gray max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {cleanContent}
            </ReactMarkdown>
          </div>

          {/* FAQ Sectie (Visueel weergeven voor de lezer) */}
          {article.faq && article.faq.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-200">
              <h2 className="text-3xl font-bold mb-8 text-[#1e3a8a]">Veelgestelde Vragen</h2>
              <div className="space-y-6">
                {article.faq.map((item, i) => (
                  <div key={i} className="bg-[#3066be]/5 border border-[#3066be]/10 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive CTA - ROI Calculator & Gratis Scan */}
          <ArticleCTA />

          {/* Author Bio Box (Bestaand) */}
          {article.authorBio && (
            <div className="mt-16 bg-white border border-gray-200 rounded-2xl p-8 flex gap-6 items-center shadow-sm">
              {/* ... jouw author code ... */}
              <div>
                <p className="font-bold">{article.author}</p>
                <p className="text-gray-600">{article.authorBio}</p>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Articles & CTA (Bestaand) */}
      {/* ... */}
    </>
  );
}
