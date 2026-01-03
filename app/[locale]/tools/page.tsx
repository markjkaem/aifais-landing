// ========================================
// FILE: app/tools/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";
import {
  ScanLine,
  Scale,
  Mail,
  ArrowRight,
  Lock,
  PenTool,
  Calculator,
  Sparkles,
  CircleDot,
  BarChart3,
} from "lucide-react";

import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "toolsPage" });

  return {
    title: `${t("title")} | Aifais – AI Software`,
    description: t("description"),
    alternates: {
      canonical: `https://aifais.com${locale === "nl" ? "" : "/" + locale}/tools`,
      languages: {
        nl: "https://aifais.com/tools",
        en: "https://aifais.com/en/tools",
      },
    },
  };
}

const accentStyles = {
  emerald: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    hover: "group-hover:bg-emerald-500",
    ring: "ring-emerald-500/20",
  },
  blue: {
    bg: "bg-sky-500",
    bgLight: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-200",
    hover: "group-hover:bg-sky-500",
    ring: "ring-sky-500/20",
  },
  violet: {
    bg: "bg-violet-500",
    bgLight: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
    hover: "group-hover:bg-violet-500",
    ring: "ring-violet-500/20",
  },
  slate: {
    bg: "bg-slate-400",
    bgLight: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    hover: "",
    ring: "ring-slate-500/10",
  },
};

function StatusBadge({ status, t }: { status: "free" | "api" | "soon"; t: any }) {
  if (status === "free") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
        <CircleDot className="w-3 h-3" />
        {t("status.free")}
      </span>
    );
  }
  if (status === "api") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/60">
        <Sparkles className="w-3 h-3" />
        {t("status.api")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
      <Lock className="w-3 h-3" />
      {t("status.soon")}
    </span>
  );
}

function ToolCard({ tool, t }: { tool: any; t: any }) {
  const styles = accentStyles[tool.accent as keyof typeof accentStyles];
  const isDisabled = tool.status === "soon";
  const Icon = tool.icon;

  const content = (
    <div
      className={`
        relative h-full flex flex-col p-6 rounded-2xl border transition-all duration-300
        ${
          isDisabled
            ? "bg-slate-50/50 border-slate-200/60 cursor-not-allowed"
            : `bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/4 hover:-translate-y-0.5 cursor-pointer`
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300
          ${
            isDisabled
              ? "bg-slate-100 text-slate-400"
              : `${styles.bgLight} ${styles.text} ${styles.hover} group-hover:text-white group-hover:shadow-lg`
          }
        `}
      >
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3
          className={`
            text-lg font-semibold tracking-tight mb-2 transition-colors
            ${
              isDisabled
                ? "text-slate-400"
                : "text-slate-900 group-hover:text-slate-800"
            }
          `}
        >
          {tool.title}
        </h3>
        <p
          className={`
            text-sm leading-relaxed
            ${isDisabled ? "text-slate-400" : "text-slate-500"}
          `}
        >
          {tool.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
        <StatusBadge status={tool.status} t={t} />
        {!isDisabled && (
          <span
            className={`
              text-sm font-medium flex items-center gap-1 transition-all
              ${styles.text} group-hover:gap-2
            `}
          >
            {t("open")}
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );

  if (isDisabled) {
    return <div className="group">{content}</div>;
  }

  return (
    <Link href={tool.href} className="group">
      {content}
    </Link>
  );
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "toolsPage" });
  const hrefPrefix = locale === "nl" ? "" : "/" + locale;

  const tools = [
    {
      title: t("items.roiCalculator.title"),
      description: t("items.roiCalculator.description"),
      href: `${hrefPrefix}/tools/roi-calculator`,
      icon: Calculator,
      status: "free" as const,
      accent: "emerald",
    },
    {
      title: t("items.invoiceScanner.title"),
      description: t("items.invoiceScanner.description"),
      href: `${hrefPrefix}/tools/invoice-extraction`,
      icon: ScanLine,
      status: "api" as const,
      accent: "blue",
    },
    {
      title: t("items.invoiceCreator.title"),
      description: t("items.invoiceCreator.description"),
      href: `${hrefPrefix}/tools/invoice-creation`,
      icon: PenTool,
      status: "free" as const,
      accent: "violet",
    },
    {
      title: t("items.benchmarkTool.title"),
      description: t("items.benchmarkTool.description"),
      href: `${hrefPrefix}/tools/benchmark`,
      icon: BarChart3,
      status: "free" as const,
      accent: "blue",
    },
    {
      title: t("items.debtCollection.title"),
      description: t("items.debtCollection.description"),
      href: "#",
      icon: Scale,
      status: "soon" as const,
      accent: "slate",
    },
    {
      title: t("items.proposalAi.title"),
      description: t("items.proposalAi.description"),
      href: "#",
      icon: Mail,
      status: "soon" as const,
      accent: "slate",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Subtle background texture */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 pointer-events-none" />
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-8 max-w-5xl mx-auto">
        <Link
          href={`${hrefPrefix}/`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>{t("backLink")}</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[60px] bg-linear-to-r from-slate-300 to-transparent" />
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
              {t("toolsLabel")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            {t("title")}
            <br />
            <span className="text-slate-400">{t("subtitle")}</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
            {t("description")}
          </p>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.title} tool={tool} t={t} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400">
            {t("footerText")}{" "}
            <Link
              href={`${hrefPrefix}/#contact`}
              className="text-slate-600 hover:text-slate-900 underline underline-offset-2 transition-colors"
            >
              {t("suggestions")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
