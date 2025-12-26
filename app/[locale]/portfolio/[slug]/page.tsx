import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "../data";
import { getTranslations } from "next-intl/server";

// ✅ DYNAMIC METADATA
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolioDetail" });
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: `${t("notFoundTitle")} | AIFAIS`,
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${project.title} | ${t("resultsTitle")} Case Study | AIFAIS`,
    description: t("metaDescription", { description: project.description.substring(0, 120) }),

    keywords: [
      t("resultsTitle"),
      project.title,
      ...(project.tags || []),
    ],

    openGraph: {
      title: `${project.title} | ${t("resultsTitle")}`,
      description: project.description,
      url: `https://aifais.com/${locale}/portfolio/${slug}`,
      type: "article",
      locale: locale === "nl" ? "nl_NL" : "en_US",
      siteName: "AIFAIS",
      images: [
        {
          url: `https://aifais.com${project.image}`,
          width: 1200,
          height: 630,
          alt: `${project.title} - ${t("resultsTitle")}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${t("resultsTitle")}`,
      description: project.description,
      images: [`https://aifais.com${project.image}`],
      creator: "@aifais",
    },

    alternates: {
      canonical: `https://aifais.com${locale === "nl" ? "" : "/" + locale}/portfolio/${slug}`,
      languages: {
        nl: `https://aifais.com/portfolio/${slug}`,
        en: `https://aifais.com/en/portfolio/${slug}`,
      },
    },
  };
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function PortfolioItemPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolioDetail" });
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = projects
    .filter(
      (p) =>
        p.slug !== slug &&
        (p.category === project.category || !project.category)
    )
    .slice(0, 3);

  if (relatedProjects.length < 3) {
    const others = projects
      .filter((p) => p.slug !== slug && !relatedProjects.includes(p))
      .slice(0, 3 - relatedProjects.length);
    relatedProjects.push(...others);
  }

  // Schema: Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    image: `https://aifais.com${project.image}`,
    datePublished: project.date || new Date().toISOString(),
    dateModified: project.date || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "AIFAIS",
      url: `https://aifais.com/${locale}`,
    },
    publisher: {
      "@type": "Organization",
      name: "AIFAIS",
      logo: {
        "@type": "ImageObject",
        url: "https://aifais.com/logo_official.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://aifais.com/${locale}/portfolio/${slug}`,
    },
  };

  // Schema: Breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://aifais.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `https://aifais.com/${locale}/portfolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://aifais.com/${locale}/portfolio/${slug}`,
      },
    ],
  };

  const hrefPrefix = locale === "nl" ? "" : "/" + locale;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ✅ BREADCRUMBS UI (Light Theme) */}
      <nav
        className="bg-white/95 py-4 border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href={`${hrefPrefix}/`} className="hover:text-[#3066be] transition">
                Home
              </Link>
            </li>
            <li className="flex items-center">
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
                href={`${hrefPrefix}/portfolio`}
                className="hover:text-[#3066be] transition"
              >
                Portfolio
              </Link>
            </li>
            <li className="flex items-center">
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
            <li className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
              {project.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* ✅ HERO SECTION (Light Theme) */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <header className="text-center mb-12">
            {/* Category Badge */}
            {project.category && (
              <span className="inline-block px-4 py-2 bg-[#3066be]/5 text-[#3066be] border border-[#3066be]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                {project.category}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {project.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 justify-center mt-8 text-sm text-gray-500 font-medium">
              {project.readTime && (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                  {t("readTime", { time: project.readTime || 5 })}
                </span>
              )}
              {project.date && (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                  {new Date(project.date).toLocaleDateString(locale === "nl" ? "nl-NL" : "en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              )}
            </div>
          </header>

          {/* Hero Image (Optimized) */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-gray-50 aspect-video">
            <Image
              src={project.image}
              alt={`${project.title} - ${t("resultsTitle")}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>
        </div>
      </section>

      {/* ✅ RESULTS SECTION (Light Theme) */}
      {project.results && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">
              <span className="border-b-2 border-[#3066be] pb-2">
                {t("resultsTitle")}
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {project.results.timeSaved && (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-[#3066be]/30 hover:shadow-lg transition duration-300">
                  <div className="text-4xl lg:text-5xl font-bold text-[#3066be] mb-2">
                    {project.results.timeSaved}
                  </div>
                  <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                    {t("timeSaved")}
                  </p>
                </div>
              )}

              {project.results.roiMonths && (
                <div className="bg-white border border-green-200 rounded-2xl p-8 text-center hover:border-green-400 hover:shadow-lg transition duration-300">
                  <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                    {project.results.roiMonths} mnd
                  </div>
                  <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                    {t("roiPeriod")}
                  </p>
                </div>
              )}

              {project.results.costSaving && (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-[#3066be]/30 hover:shadow-lg transition duration-300">
                  <div className="text-4xl lg:text-5xl font-bold text-[#3066be] mb-2">
                    {project.results.costSaving}
                  </div>
                  <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                    {t("annualSaving")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ✅ MAIN CONTENT (Light Theme) */}
      <article className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Details/Features */}
          <section className="max-w-none">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {t("solutionTitle")}
            </h2>

            <ul className="space-y-4">
              {project.details.map((detail: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-[#3066be]/30 transition group"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-[#3066be]/10 text-[#3066be] rounded-full flex items-center justify-center font-bold text-sm mt-0.5 group-hover:bg-[#3066be] group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed text-lg">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <section className="mt-16 pt-12 border-t border-gray-200">
              <h3 className="text-lg font-bold mb-6 text-gray-500 uppercase tracking-wider text-sm">
                {t("techTitle")}
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-600 rounded-lg hover:border-[#3066be] hover:text-[#3066be] transition text-sm font-medium cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Testimonial */}
          {project.testimonial && (
            <section className="mt-16">
              <blockquote className="bg-white border border-[#3066be]/20 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm">
                {/* Quote Icon */}
                <div className="absolute top-6 left-8 text-[#3066be]/10 text-8xl font-serif leading-none select-none">
                  "
                </div>

                <p className="relative z-10 text-xl md:text-2xl text-gray-800 italic leading-relaxed mb-8 text-center md:text-left font-serif">
                  {project.testimonial.quote}
                </p>
                <footer className="flex items-center justify-center md:justify-start gap-5 relative z-10 border-t border-gray-200 pt-6">
                  <div className="w-14 h-14 bg-[#3066be] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                    {project.testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <cite className="not-italic font-bold text-gray-900 text-lg block">
                      {project.testimonial.author}
                    </cite>
                    <span className="text-sm text-gray-500 font-medium">
                      {project.testimonial.role}
                    </span>
                  </div>
                </footer>
              </blockquote>
            </section>
          )}
        </div>
      </article>

      {/* ✅ RELATED PROJECTS (Light Theme) */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-2xl font-bold mb-10 text-gray-900 flex items-center justify-center gap-3">
              {t("moreProjects")}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedProjects.map((related) => (
                <Link
                  key={related.slug}
                  href={`${hrefPrefix}/portfolio/${related.slug}`}
                  className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#3066be]/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-[#3066be] transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                      {related.description}
                    </p>
                    <span className="text-xs text-[#3066be] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {t("viewCase")}{" "}
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
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href={`${hrefPrefix}/portfolio`}
                className="inline-block px-8 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 hover:text-black transition font-medium"
              >
                {t("backOverview")}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ✅ CTA SECTION (Light Theme) */}
      <section className="py-24 bg-gradient-to-b from-white to-white text-center relative overflow-hidden border-t border-gray-200">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3066be]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
            {t("cta.title")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-purple-600">
              {t("cta.titleHighlight")}
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("cta.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`${hrefPrefix}/contact`}
              className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
            >
              {t("cta.button1")}
            </Link>
            <Link
              href={`${hrefPrefix}/contact`}
              className="px-8 py-4 border border-gray-300 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              {t("cta.button2")}
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-8 uppercase tracking-widest">
            {t("cta.footer")}
          </p>
        </div>
      </section>
    </>
  );
}
