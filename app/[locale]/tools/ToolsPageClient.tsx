"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, X, Grid3X3, List, SlidersHorizontal, Sparkles, ArrowUpRight, Check } from "lucide-react";
import { getAllTools, ToolStatus } from "@/config/tools";
import { SECTORS } from "@/config/sectors";
import { ToolUI, SectorId } from "@/types/common";
import { ToolCard } from "@/app/Components/tools/list/ToolCard";
import { FeaturedToolCard } from "@/app/Components/tools/list/FeaturedToolCard";
import { motion, AnimatePresence } from "framer-motion";

// Performance: Convert tools once at module level
const TOOLS: ToolUI[] = getAllTools().map(tool => ({
  ...tool,
  href: `/tools/${tool.slug}`,
  category: tool.category as SectorId,
  description: tool.shortDescription,
  tags: tool.keywords || [],
}));

const ITEMS_PER_PAGE = 24;

type ViewMode = "grid" | "list";
type SortOption = "name" | "newest" | "popular";

export default function ToolsPageClient({ locale }: { locale: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<SectorId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ToolStatus | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Keyboard shortcut: CMD/CTRL + K to focus search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedSector, statusFilter, sortBy]);

  const filteredTools = useMemo(() => {
    let result = TOOLS.filter((tool) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = tool.title.toLowerCase().includes(query);
        const matchesDescription = tool.description.toLowerCase().includes(query);
        const matchesTags = tool.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }
      if (selectedSector !== "all" && tool.category !== selectedSector) return false;
      if (statusFilter !== "all" && tool.status !== statusFilter) return false;
      return true;
    });

    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case "popular":
        result.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
        break;
    }

    return result;
  }, [searchQuery, selectedSector, statusFilter, sortBy]);

  const visibleTools = filteredTools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTools.length;

  const featuredTools = useMemo(
    () => TOOLS.filter((t) => t.featured && t.status === "live").slice(0, 4),
    []
  );

  const sectorsWithCounts = useMemo(() => {
    return SECTORS.map((sector) => ({
      ...sector,
      count: TOOLS.filter((t) => t.category === sector.id).length,
    })).filter((s) => s.count > 0);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedSector("all");
    setStatusFilter("all");
  }, []);

  const hasActiveFilters = searchQuery || selectedSector !== "all" || statusFilter !== "all";

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0a] selection:bg-amber-200 dark:selection:bg-amber-900">
      {/* Hero Section - Editorial Style */}
      <header className="relative overflow-hidden border-b border-stone-200 dark:border-stone-800">
        {/* Subtle grain texture */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 mb-6">
              <span className="w-8 h-px bg-stone-300 dark:bg-stone-600" />
              {TOOLS.length} AI Tools
            </span>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-900 dark:text-stone-100 leading-[0.95] tracking-tight mb-8">
              Tools die
              <br />
              <span className="italic text-stone-500 dark:text-stone-400">voor je werken</span>
            </h1>
            
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed font-light">
              Ontdek AI-oplossingen die naadloos integreren in je werkprocessen. 
              Gebouwd voor het Nederlandse MKB.
            </p>
          </motion.div>

          {/* Search Bar - Refined */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 max-w-2xl"
          >
            <div className="group relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 transition-colors group-focus-within:text-stone-600 dark:group-focus-within:text-stone-300" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Zoek op naam, functie of sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl py-4 pl-14 pr-24 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:ring-offset-2 focus:ring-offset-[#fafaf9] dark:focus:ring-offset-[#0a0a0a] transition-all shadow-sm"
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
                ⌘K
              </kbd>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Featured Section */}
      {!hasActiveFilters && featuredTools.length > 0 && (
        <section className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
            <div className="flex items-center gap-3 mb-10">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-medium tracking-[0.15em] uppercase text-stone-600 dark:text-stone-400">
                Uitgelicht
              </h2>
            </div>
            
            {/* Auto-fit grid: responsive columns with equal heights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-fr">
              {featuredTools.map((tool, i) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <FeaturedToolCard tool={tool} index={i} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Sticky */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-8 space-y-10">
              {/* Sectors */}
              <nav>
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-stone-500 dark:text-stone-400 mb-4">
                  Sectoren
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSector("all")}
                    className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                      selectedSector === "all"
                        ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                        : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                  >
                    <span className="font-medium">Alle tools</span>
                    <span className={`text-xs tabular-nums ${
                      selectedSector === "all" ? "text-stone-400 dark:text-stone-500" : "text-stone-400"
                    }`}>
                      {TOOLS.length}
                    </span>
                  </button>
                  
                  {sectorsWithCounts.map((sector) => (
                    <button
                      key={sector.id}
                      onClick={() => setSelectedSector(sector.id)}
                      className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                        selectedSector === sector.id
                          ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                          : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {(() => {
                          const Icon = sector.icon;
                          return <Icon className="w-5 h-5 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors" />;
                        })()}
                        <span className="font-medium">{sector.name}</span>
                      </span>
                      <span className={`text-xs tabular-nums ${
                        selectedSector === sector.id ? "text-stone-400 dark:text-stone-500" : "text-stone-400"
                      }`}>
                        {sector.count}
                      </span>
                    </button>
                  ))}
                </div>
              </nav>

              {/* Status Filter */}
              <div>
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-stone-500 dark:text-stone-400 mb-4">
                  Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "Alle" },
                    { value: "live", label: "Live" },
                    { value: "beta", label: "Beta" },
                    { value: "soon", label: "Binnenkort" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setStatusFilter(status.value as ToolStatus | "all")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        statusFilter === status.value
                          ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      Actieve filters
                    </span>
                    <button
                      onClick={clearFilters}
                      className="text-xs text-amber-700 dark:text-amber-300 hover:underline"
                    >
                      Wis alles
                    </button>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {filteredTools.length} van {TOOLS.length} tools
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Tools Grid */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-800">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {filteredTools.length}
                </span>{" "}
                {filteredTools.length === 1 ? "tool" : "tools"} gevonden
              </p>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-sm text-stone-600 dark:text-stone-400 border-0 focus:ring-0 cursor-pointer pr-8"
                >
                  <option value="name">Naam A-Z</option>
                  <option value="newest">Nieuwste eerst</option>
                  <option value="popular">Meest gebruikt</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100"
                        : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                    }`}
                    aria-label="Grid weergave"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100"
                        : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                    }`}
                    aria-label="Lijst weergave"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid View */}
            <AnimatePresence mode="wait">
              {filteredTools.length > 0 ? (
                <motion.div
                  key={`${viewMode}-${selectedSector}-${sortBy}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                      : "flex flex-col gap-3"
                  }
                >
                  {visibleTools.map((tool, i) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(i * 0.03, 0.3),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {viewMode === "grid" ? (
                        <ToolCard tool={tool} index={i} />
                      ) : (
                        <ToolListItem tool={tool} />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    <Search className="w-7 h-7 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
                    Geen tools gevonden
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 mb-6">
                    Probeer andere zoektermen of filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                  >
                    Wis alle filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load More Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-12">
                <div className="flex items-center gap-3 text-stone-400">
                  <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                  <span className="text-sm">Meer tools laden...</span>
                </div>
              </div>
            )}

            {/* Results Count Footer */}
            {!hasMore && filteredTools.length > ITEMS_PER_PAGE && (
              <div className="text-center py-12 text-sm text-stone-400">
                Alle {filteredTools.length} tools weergegeven
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Search Results Count */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-5 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full shadow-2xl">
            <span className="text-sm">
              <span className="font-semibold">{filteredTools.length}</span> resultaten voor "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 hover:bg-white/10 dark:hover:bg-black/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// List View Item Component
function ToolListItem({ tool }: { tool: ToolUI }) {
  return (
    <Link
      href={tool.href}
      className="group flex items-center gap-6 p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-lg hover:shadow-stone-200/50 dark:hover:shadow-stone-900/50 transition-all"
    >
      {/* Icon */}
      <div className="shrink-0 w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 group-hover:scale-105 transition-transform">
        {(() => {
          const Icon = tool.icon;
          return <Icon className="w-8 h-8" />;
        })()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-medium text-stone-900 dark:text-stone-100 truncate">
            {tool.title}
          </h3>
          {tool.status === "beta" && (
            <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full">
              Beta
            </span>
          )}
          {tool.status === "soon" && (
            <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-full">
              Binnenkort
            </span>
          )}
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-1">
          {tool.description}
        </p>
      </div>

      {/* Arrow */}
      <ArrowUpRight className="shrink-0 w-5 h-5 text-stone-300 dark:text-stone-600 group-hover:text-stone-500 dark:group-hover:text-stone-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </Link>
  );
}