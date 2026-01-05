"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Code2, Zap, ExternalLink, Clock, TrendingUp, CheckCircle2 } from "lucide-react";

interface ServiceLink {
  title: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
}

interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  category?: string;
}

interface MegaMenuServicesProps {
  serviceLinks: ServiceLink[];
  getLocalizedPath: (path: string) => string;
  closeAll: () => void;
  t: (key: string) => string;
}

export function MegaMenuServices({
  serviceLinks,
  getLocalizedPath,
  closeAll,
  t,
}: MegaMenuServicesProps) {
  return (
    <div className="hidden lg:block w-full bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-stone-950/50 animate-slideDown">
      <div className="h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Services Grid - 8 columns */}
          <div className="col-span-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                {t("solutions")}
              </span>
              <span className="flex-1 h-px bg-stone-100 dark:bg-stone-800" />
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              {serviceLinks.map((service) => (
                <Link
                  key={service.slug}
                  href={getLocalizedPath(service.slug)}
                  className="group relative p-3 rounded-xl transition-all duration-200 hover:bg-stone-50 dark:hover:bg-stone-900"
                  onClick={closeAll}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-white dark:group-hover:text-stone-900 transition-all duration-200">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100 mb-0.5 group-hover:text-stone-700 dark:group-hover:text-white transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                        {service.description}
                      </p>
                    </div>
                    <ArrowRight className="shrink-0 w-3.5 h-3.5 text-stone-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <Link
                href={getLocalizedPath("/diensten")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors group"
                onClick={closeAll}
              >
                {t("allServices")}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* CTA Card - 4 columns */}
          <div className="col-span-4">
            <div className="h-full bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-100 dark:to-stone-200 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 h-full flex flex-col">
                <span className="inline-block self-start px-2 py-0.5 rounded-full bg-white/10 dark:bg-black/10 text-[10px] font-medium text-white/80 dark:text-stone-600 mb-3">
                  Gratis
                </span>
                <h3 className="text-base font-bold text-white dark:text-stone-900 mb-1.5">
                  {t("analysisTitle")}
                </h3>
                <p className="text-xs text-white/70 dark:text-stone-600 leading-relaxed mb-4 flex-1">
                  {t("analysisSub")}
                </p>
                
                <Link
                  href={getLocalizedPath("/contact")}
                  onClick={closeAll}
                  className="block w-full py-2.5 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-center rounded-lg font-semibold text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  {t("analysisCTA")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MegaMenuNewsProps {
  news: NewsItem[];
  getLocalizedPath: (path: string) => string;
  closeAll: () => void;
  tEvent: (key: string) => string;
  tMega: (key: string) => string;
}

export function MegaMenuNews({
  news,
  getLocalizedPath,
  closeAll,
  tEvent,
  tMega,
}: MegaMenuNewsProps) {
  const featuredNews = news[0];
  const otherNews = news.slice(1, 4);

  return (
    <div className="hidden lg:block w-full bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-stone-950/50 animate-slideDown">
      <div className="h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* News Section - 8 columns */}
          <div className="col-span-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                {tMega("articles")}
              </span>
              <span className="flex-1 h-px bg-stone-100 dark:bg-stone-800" />
            </div>
            
            {/* Featured + Other in row */}
            <div className="grid grid-cols-5 gap-4">
              {/* Featured Article - 3 cols */}
              {featuredNews && (
                <Link
                  href={getLocalizedPath(`/news/${featuredNews.slug}`)}
                  className="col-span-3 group block"
                  onClick={closeAll}
                >
                  <div className="flex gap-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:border-stone-200 dark:hover:border-stone-700 transition-all h-full">
                    <div className="relative w-32 aspect-[4/3] rounded-lg overflow-hidden shrink-0 bg-stone-200 dark:bg-stone-800">
                      <Image
                        src={featuredNews.image || "/lesson1.jpg"}
                        alt={featuredNews.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center py-1 min-w-0">
                      <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-[10px] font-semibold text-amber-700 dark:text-amber-300 mb-2">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Trend
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors line-clamp-2">
                        {featuredNews.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                        {featuredNews.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
              
              {/* Other articles - 2 cols */}
              <div className="col-span-2 space-y-1">
                {otherNews.map((article) => (
                  <Link
                    key={article.slug}
                    href={getLocalizedPath(`/news/${article.slug}`)}
                    className="group block p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                    onClick={closeAll}
                  >
                    <h4 className="font-medium text-stone-900 dark:text-stone-100 text-xs mb-0.5 line-clamp-1 group-hover:text-stone-600 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 line-clamp-1">
                      {article.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <Link
                href={getLocalizedPath("/news")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors group"
                onClick={closeAll}
              >
                {tMega("knowledgeBase")}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Event Card - 4 columns */}
          <div className="col-span-4">
            <div className="h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden group hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col">
              <div className="relative h-28 overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                <Image
                  src="/lesson.jpg"
                  alt="Event"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-stone-700">
                    <Clock className="w-2.5 h-2.5" />
                    Binnenkort
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-1.5">
                  {tEvent("title")}
                </h3>
                <Link
                  href={getLocalizedPath("/contact")}
                  onClick={closeAll}
                  className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mt-auto"
                >
                  {tEvent("cta")}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MegaMenuToolsProps {
  toolLinks: ServiceLink[];
  getLocalizedPath: (path: string) => string;
  closeAll: () => void;
  t: (key: string) => string;
}

export function MegaMenuTools({
  toolLinks,
  getLocalizedPath,
  closeAll,
  t,
}: MegaMenuToolsProps) {
  const featuredTools = toolLinks.slice(0, 2);
  const otherTools = toolLinks.slice(2, 6); // Limit to 4 other tools

  return (
    <div className="hidden lg:block w-full bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-stone-950/50 animate-slideDown">
      <div className="h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Tools Section - 8 columns */}
          <div className="col-span-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                AI Tools
              </span>
              <span className="flex-1 h-px bg-stone-100 dark:bg-stone-800" />
            </div>
            
            {/* Featured Tools - Compact gradient cards */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {featuredTools.map((tool, index) => (
                <Link
                  key={tool.slug}
                  href={getLocalizedPath(tool.slug)}
                  className="group relative p-4 rounded-xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${index === 0 ? '#2563eb' : '#059669'} 0%, ${index === 0 ? '#4338ca' : '#0d9488'} 100%)`
                  }}
                  onClick={closeAll}
                >
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <Sparkles className="absolute top-3 right-3 w-3.5 h-3.5 text-white/30" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-semibold text-white uppercase tracking-wider">
                        <Zap className="w-2.5 h-2.5" />
                        Populair
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white mb-2">
                      {tool.icon}
                    </div>
                    <h3 className="font-bold text-white text-sm mb-0.5">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                  
                  <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-white/50 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
            
            {/* Other Tools - Compact 2x2 grid */}
            <div className="grid grid-cols-2 gap-1">
              {otherTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={getLocalizedPath(tool.slug)}
                  className="group flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                  onClick={closeAll}
                >
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs text-stone-900 dark:text-stone-100 truncate group-hover:text-stone-600 transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 truncate">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <Link
                href={getLocalizedPath("/tools")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors group"
                onClick={closeAll}
              >
                Alle {toolLinks.length}+ tools bekijken
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Developer CTA - 4 columns - Combined card */}
          <div className="col-span-4">
            <div className="h-full bg-stone-900 dark:bg-stone-100 rounded-xl p-5 relative overflow-hidden flex flex-col">
              {/* Code pattern background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-2 left-3 text-xs font-mono text-white dark:text-stone-900">{"{ }"}</div>
                <div className="absolute top-8 right-6 text-xs font-mono text-white dark:text-stone-900">{"</>"}</div>
                <div className="absolute bottom-12 left-6 text-xs font-mono text-white dark:text-stone-900">{"=>"}</div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-black/10 flex items-center justify-center mb-3">
                  <Code2 className="w-5 h-5 text-white dark:text-stone-900" />
                </div>
                
                <h3 className="text-base font-bold text-white dark:text-stone-900 mb-1">
                  Developers API
                </h3>
                <p className="text-xs text-white/60 dark:text-stone-600 leading-relaxed mb-4">
                  Bouw je eigen AI agents met onze krachtige API en MCP server.
                </p>
                
                {/* Stats integrated */}
                <div className="flex items-center gap-4 mb-4 py-3 border-y border-white/10 dark:border-black/10">
                  <div>
                    <div className="text-lg font-bold text-white dark:text-stone-900">99.9%</div>
                    <div className="text-[10px] text-white/50 dark:text-stone-500">Uptime</div>
                  </div>
                  <div className="w-px h-8 bg-white/10 dark:bg-black/10" />
                  <div>
                    <div className="text-lg font-bold text-white dark:text-stone-900">&lt;50ms</div>
                    <div className="text-[10px] text-white/50 dark:text-stone-500">Latency</div>
                  </div>
                </div>
                
                <Link
                  href={getLocalizedPath("/developers")}
                  onClick={closeAll}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white dark:bg-stone-900 text-stone-900 dark:text-white rounded-lg text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors mt-auto"
                >
                  <span>Documentatie</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}