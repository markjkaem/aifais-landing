"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, X, ChevronDown, Command, Layers, Sparkles, Mail, ArrowRight, Star } from "lucide-react";
import { getAllTools, ToolStatus } from "@/config/tools";
import { SECTORS } from "@/config/sectors";
import { ToolUI, SectorId } from "@/types/common";
import { ToolCard } from "@/app/Components/tools/list/ToolCard";
import { FeaturedToolCard } from "@/app/Components/tools/list/FeaturedToolCard";
import { SectorButton } from "@/app/Components/tools/list/SectorButton";

// Get tools from registry and convert to UI format
const TOOLS: ToolUI[] = getAllTools().map(tool => ({
    ...tool,
    href: `/tools/${tool.slug}`,
    category: tool.category as SectorId,
    description: tool.shortDescription,
}));

export default function ToolsPageClient({ locale }: { locale: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<SectorId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ToolStatus | "all">("all");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return tool.title.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query);
      }
      if (selectedSector !== "all" && tool.category !== selectedSector) return false;
      if (statusFilter !== "all" && tool.status !== statusFilter) return false;
      return true;
    });
  }, [searchQuery, selectedSector, statusFilter]);

  const featuredTools = TOOLS.filter((t) => t.featured && t.status === "live");

  const sectorsWithCounts = useMemo(() => {
    return SECTORS.map((sector) => ({
      ...sector,
      count: TOOLS.filter((t) => t.category === sector.id).length,
    })).filter((s) => s.count > 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden bg-slate-900 py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#3066be_0%,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                AI Tools voor het <span className="text-blue-400">MKB</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
                Bespaar uren werk met onze op maat gemaakte AI oplossingen.
            </p>
            
            <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Zoek een tool..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Sectoren</h3>
              <div className="space-y-2">
                <button
                    onClick={() => setSelectedSector("all")}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSector === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    Alle sectoren
                    <span className="text-xs opacity-50">{TOOLS.length}</span>
                </button>
                {sectorsWithCounts.map(sector => (
                    <SectorButton 
                        key={sector.id} 
                        sector={sector} 
                        count={sector.count} 
                        isActive={selectedSector === sector.id}
                        onClick={() => setSelectedSector(sector.id)}
                    />
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {!searchQuery && selectedSector === 'all' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {featuredTools.map((tool, i) => (
                        <FeaturedToolCard key={tool.id} tool={tool} index={i} />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool, i) => (
                    <ToolCard key={tool.id} tool={tool} index={i} />
                ))}
            </div>

            {filteredTools.length === 0 && (
                <div className="text-center py-24">
                    <p className="text-slate-500">Geen tools gevonden voor deze selectie.</p>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}