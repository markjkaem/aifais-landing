import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, getToolSlugs, ToolMetadata } from "@/config/tools";
import { Zap, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SolanaLogo, IdealLogo } from "@/app/Components/CustomIcons";

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

  if (!tool) {
    notFound();
  }

  // Static component mapping
  const componentMap: Record<string, React.ComponentType<any>> = {
    "invoice-extraction/ScannerClient": require("@/app/[locale]/tools/invoice-extraction/ScannerClient").default,
    "invoice-creation/InvoiceGenerator": require("@/app/[locale]/tools/invoice-creation/InvoiceGenerator").default,
    "quote-generator/QuoteGeneratorClient": require("@/app/[locale]/tools/quote-generator/QuoteGeneratorClient").default,
    "contract-checker/ContractCheckerClient": require("@/app/[locale]/tools/contract-checker/ContractCheckerClient").default,
    "terms-generator/TermsGeneratorClient": require("@/app/[locale]/tools/terms-generator/TermsGeneratorClient").default,
    "roi-calculator/ROICalculatorPageClient": require("@/app/[locale]/tools/roi-calculator/ROICalculatorPageClient").default,
    "benchmark/BenchmarkTool": require("@/app/[locale]/tools/benchmark/BenchmarkTool").default,
    // HR Tools
    "cv-screener/CvScreenerClient": require("@/app/[locale]/tools/cv-screener/CvScreenerClient").default,
    "interview-questions/InterviewQuestionsClient": require("@/app/[locale]/tools/interview-questions/InterviewQuestionsClient").default,
    // Marketing Tools
    "social-planner/SocialPlannerClient": require("@/app/[locale]/tools/social-planner/SocialPlannerClient").default,
    "seo-audit/SeoAuditClient": require("@/app/[locale]/tools/seo-audit/SeoAuditClient").default,
    // Sales Tools
    "pitch-deck/PitchDeckClient": require("@/app/[locale]/tools/pitch-deck/PitchDeckClient").default,
    "lead-scorer/LeadScorerClient": require("@/app/[locale]/tools/lead-scorer/LeadScorerClient").default,
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

      <div className="min-h-screen bg-white">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/80 via-white to-white" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center gap-2 text-sm text-zinc-400 mb-10">
              <Link href="/" className="hover:text-zinc-600 transition-colors">
                Home
              </Link>
              <span className="text-zinc-300">/</span>
              <Link href="/tools" className="hover:text-zinc-600 transition-colors">
                Tools
              </Link>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-600 font-medium">{tool.title}</span>
            </nav>

            {/* Badges */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {tool.status === "live" && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Beschikbaar
                </div>
              )}
              {tool.new && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-xs text-white font-semibold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  Nieuw
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-20" />
                <div className="relative w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/25">
                  <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-zinc-900 tracking-tight mb-6">
              {tool.title}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-zinc-500 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
              {tool.longDescription}
            </p>

            {/* Pricing Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-zinc-200 rounded-full shadow-sm">
                {tool.pricing.type === "free" ? (
                  <>
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span className="relative z-10 bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient animate-pulse-slow">
                    Gratis te gebruiken
                  </span>
                  </>
                ) : (
                  <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-500">Vanaf</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-50 rounded-md border border-zinc-200">
                             <SolanaLogo className="w-5 h-4 object-contain" />
                             <span className="text-lg font-bold text-zinc-900">{tool.pricing.price} {tool.pricing.currency}</span>
                        </div>
                      </div>
                      {tool.pricing.currency === "SOL" && tool.pricing.price && (
                           <div className="flex items-center gap-1 mt-1 -mr-1">
                               <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">
                                   ≈ €{(tool.pricing.price * 500).toFixed(2)}
                               </span>
                               <IdealLogo className="w-12 h-4 object-contain" />
                           </div>
                       )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== TOOL COMPONENT ===== */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ToolComponent />
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section className="py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-4">
                Belangrijkste Features
              </h2>
              <p className="text-zinc-500 max-w-xl mx-auto">
                Alles wat je nodig hebt, ingebouwd in één krachtige tool
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {tool.features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-5 bg-white border border-zinc-200 rounded-2xl hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-zinc-700 leading-relaxed pt-1.5">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== USE CASES SECTION ===== */}
        {tool.useCases.length > 0 && (
          <section className="py-16 sm:py-24 bg-zinc-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-8">
                  Wanneer gebruik je deze tool?
                </h2>
                
                <div className="flex flex-wrap justify-center gap-3">
                  {tool.useCases.map((useCase, index) => (
                    <span
                      key={index}
                      className="px-5 py-2.5 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all cursor-default shadow-sm"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== CTA SECTION ===== */}
        <section className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200/50 rounded-full text-sm font-medium text-emerald-700 mb-6">
              <Zap className="w-4 h-4" />
              Geen account nodig
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-4">
              Andere tools ontdekken?
            </h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">
              Bekijk onze volledige collectie AI-tools voor het Nederlandse MKB
            </p>
            
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10"
            >
              Bekijk alle tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}