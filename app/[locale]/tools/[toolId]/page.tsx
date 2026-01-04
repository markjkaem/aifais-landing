import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, getToolSlugs, ToolMetadata } from "@/config/tools";
import dynamic from "next/dynamic";

interface Props {
  params: Promise<{ locale: string; toolId: string }>;
}

// Generate static params for all tools
export async function generateStaticParams() {
  const slugs = getToolSlugs();
  return slugs.map((toolId) => ({ toolId }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, toolId } = await params;
  const tool = getToolBySlug(toolId);

  if (!tool) {
    return {
      title: "Tool niet gevonden | AIFAIS",
      description: "Deze tool bestaat niet of is verplaatst.",
    };
  }

  const canonicalUrl = `https://aifais.com${locale === "nl" ? "" : "/" + locale}/tools/${toolId}`;

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    authors: [{ name: "AIFAIS", url: "https://aifais.com" }],
    creator: "AIFAIS",
    publisher: "AIFAIS",
    robots: {
      index: tool.status === "live",
      follow: true,
      googleBot: {
        index: tool.status === "live",
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        nl: `https://aifais.com/tools/${toolId}`,
        en: `https://aifais.com/en/tools/${toolId}`,
        "x-default": `https://aifais.com/tools/${toolId}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "nl" ? "nl_NL" : "en_US",
      url: canonicalUrl,
      siteName: "AIFAIS",
      title: tool.metaTitle,
      description: tool.metaDescription,
      images: [
        {
          url: `https://aifais.com/og/tools/${toolId}.png`,
          width: 1200,
          height: 630,
          alt: tool.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aifais",
      creator: "@aifais",
      title: tool.metaTitle,
      description: tool.metaDescription,
      images: [`https://aifais.com/og/tools/${toolId}.png`],
    },
  };
}

// Generate JSON-LD structured data
function generateToolJsonLd(tool: ToolMetadata, locale: string) {
  const isNL = locale === "nl";
  const toolUrl = `https://aifais.com${isNL ? "" : "/" + locale}/tools/${tool.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${toolUrl}#software`,
        name: tool.title,
        description: tool.longDescription,
        url: toolUrl,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: tool.pricing.type === "free" ? "0" : tool.pricing.price?.toString() || "0",
          priceCurrency: tool.pricing.currency || "EUR",
        },
        featureList: tool.features,
      },
      {
        "@type": "WebPage",
        "@id": `${toolUrl}#webpage`,
        url: toolUrl,
        name: tool.metaTitle,
        description: tool.metaDescription,
        isPartOf: { "@id": "https://aifais.com#website" },
        inLanguage: isNL ? "nl-NL" : "en-US",
        breadcrumb: {
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
              name: "Tools",
              item: "https://aifais.com/tools",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: tool.title,
              item: toolUrl,
            },
          ],
        },
      },
    ],
  };
}

export default async function ToolPage({ params }: Props) {
  const { locale, toolId } = await params;
  const tool = getToolBySlug(toolId);

  // 404 if tool doesn't exist
  if (!tool) {
    notFound();
  }

  // Static component mapping (required for Next.js)
  const componentMap: Record<string, React.ComponentType<any>> = {
    "invoice-extraction/ScannerClient": require("@/app/[locale]/tools/invoice-extraction/ScannerClient").default,
    "invoice-creation/InvoiceGenerator": require("@/app/[locale]/tools/invoice-creation/InvoiceGenerator").default,
    "quote-generator/QuoteGeneratorClient": require("@/app/[locale]/tools/quote-generator/QuoteGeneratorClient").default,
    "contract-checker/ContractCheckerClient": require("@/app/[locale]/tools/contract-checker/ContractCheckerClient").default,
    "terms-generator/TermsGeneratorClient": require("@/app/[locale]/tools/terms-generator/TermsGeneratorClient").default,
    "roi-calculator/ROICalculatorPageClient": require("@/app/[locale]/tools/roi-calculator/ROICalculatorPageClient").default,
    "benchmark/BenchmarkTool": require("@/app/[locale]/tools/benchmark/BenchmarkTool").default,
  };

  const ToolComponent = componentMap[tool.componentPath];

  if (!ToolComponent) {
    console.error(`Component not found for path: ${tool.componentPath}`);
    notFound();
  }

  const jsonLd = generateToolJsonLd(tool, locale);
  const Icon = tool.icon;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page Content */}
      <div className="min-h-screen bg-slate-50/50 font-sans pb-24">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200 pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
              <a href="/" className="hover:text-blue-600 transition-colors">
                Home
              </a>
              <span>/</span>
              <a href="/tools" className="hover:text-blue-600 transition-colors">
                Tools
              </a>
              <span>/</span>
              <span className="text-slate-900 font-medium">{tool.title}</span>
            </nav>

            {/* Status Badge */}
            {tool.status === "live" && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs text-green-700 font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                Beschikbaar
              </div>
            )}
            {tool.new && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs text-orange-700 font-bold uppercase tracking-wider mb-6 ml-2">
                Nieuw
              </div>
            )}

            {/* Title & Description */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                {tool.title}
              </h1>
              
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                {tool.longDescription}
              </p>

              {/* Pricing */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm">
                {tool.pricing.type === "free" ? (
                  <span className="font-semibold text-slate-900">100% Gratis</span>
                ) : (
                  <>
                    <span className="text-slate-600">Vanaf</span>
                    <span className="font-bold text-slate-900">
                      {tool.pricing.price} {tool.pricing.currency}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tool Component */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <ToolComponent />
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Belangrijkste Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tool.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200"
              >
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-slate-700 leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        {tool.useCases.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 py-16 bg-white rounded-2xl border border-slate-200 mx-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Wanneer gebruik je deze tool?
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {tool.useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                >
                  {useCase}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
