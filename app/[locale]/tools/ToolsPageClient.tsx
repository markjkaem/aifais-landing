"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Sparkles,
  Star,
  Filter,
  X,
  ChevronDown,
  ArrowUpRight,
  Command,
  Layers,
  Zap,
  Mail,
  Calculator,
  Scale,
  Users,
  Megaphone,
  Target,
  ShoppingCart,
  Truck,
  Heart,
  GraduationCap,
  Home,
  Utensils,
  Car,
  Plane,
  Briefcase,
  Leaf,
  Cpu,
  Palette,
  Camera,
  Gamepad2,
  Wrench,
  Landmark,
  Factory,
  Globe,
  Shield,
  Headphones,
  Package,
  ScanLine,
} from "lucide-react";
import { getAllTools, TOOL_REGISTRY, ToolMetadata, ToolStatus } from "@/config/tools";

// Import SECTORS from the original (we'll keep this for now)
export type SectorId =
  | "finance"
  | "legal"
  | "hr"
  | "marketing"
  | "sales"
  | "ecommerce"
  | "logistics"
  | "healthcare"
  | "education"
  | "realestate"
  | "hospitality"
  | "automotive"
  | "travel"
  | "consulting"
  | "sustainability"
  | "technology"
  | "creative"
  | "media"
  | "entertainment"
  | "manufacturing"
  | "construction"
  | "energy"
  | "government"
  | "nonprofit"
  | "security"
  | "support"
  | "retail"
  | "agriculture"
  | "telecom"
  | "insurance";

interface Sector {
  id: SectorId;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  accentColor: string;
}

export const SECTORS: Sector[] = [
  { id: "finance", name: "Finance & Administratie", icon: Calculator, color: "emerald", gradient: "from-emerald-500 to-teal-600", accentColor: "#10b981" },
  { id: "legal", name: "Juridisch & Compliance", icon: Scale, color: "violet", gradient: "from-violet-500 to-purple-600", accentColor: "#8b5cf6" },
  { id: "hr", name: "HR & Personeel", icon: Users, color: "blue", gradient: "from-blue-500 to-indigo-600", accentColor: "#3b82f6" },
  { id: "marketing", name: "Marketing", icon: Megaphone, color: "pink", gradient: "from-pink-500 to-rose-600", accentColor: "#ec4899" },
  { id: "sales", name: "Sales & CRM", icon: Target, color: "orange", gradient: "from-orange-500 to-amber-600", accentColor: "#f97316" },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart, color: "cyan", gradient: "from-cyan-500 to-blue-600", accentColor: "#06b6d4" },
  { id: "technology", name: "IT & Software", icon: Cpu, color: "blue", gradient: "from-blue-600 to-violet-600", accentColor: "#2563eb" },
  { id: "support", name: "Klantenservice", icon: Headphones, color: "teal", gradient: "from-teal-500 to-cyan-600", accentColor: "#14b8a6" },
  { id: "creative", name: "Creatief & Design", icon: Palette, color: "fuchsia", gradient: "from-fuchsia-500 to-pink-600", accentColor: "#d946ef" },
  { id: "consulting", name: "Consulting", icon: Briefcase, color: "slate", gradient: "from-slate-600 to-gray-700", accentColor: "#475569" },
];

// Convert ToolMetadata to the format expected by the UI
interface Tool {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: any;
  status: ToolStatus;
  sector: SectorId;
  featured?: boolean;
  new?: boolean;
}

// Get tools from registry and convert to UI format
const TOOLS: Tool[] = getAllTools().map(tool => ({
  id: tool.id,
  title: tool.title,
  description: tool.shortDescription,
  href: `/tools/${tool.slug}`,
  icon: tool.icon,
  status: tool.status,
  sector: tool.category as SectorId,
  featured: tool.featured,
  new: tool.new,
}));

// ============================================
// COMPONENTS
// ============================================

function StatusBadge({ status }: { status: ToolStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-full ring-1 ring-emerald-200/50">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        Beschikbaar
      </span>
    );
  }
  if (status === "beta") {
    return (
      <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 rounded-full ring-1 ring-amber-200/50">
        Beta
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-100 rounded-full ring-1 ring-zinc-200/50">
      Binnenkort
    </span>
  );
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const isSoon = tool.status === "soon";
  const Icon = tool.icon;
  const sector = SECTORS.find((s) => s.id === tool.sector);

  const content = (
    <div 
      className="relative h-full flex flex-col"
      style={{ 
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" 
        style={{ padding: '1px' }}
      />
      
      {/* New badge */}
      {tool.new && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full blur-sm opacity-50" />
            <div className="relative px-3 py-1 text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-lg">
              NIEUW
            </div>
          </div>
        </div>
      )}

      {/* Card inner */}
      <div className="relative h-full flex flex-col p-6 bg-white rounded-2xl border border-zinc-200/80 group-hover:border-zinc-300 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              isSoon
                ? "bg-zinc-100 text-zinc-400"
                : "text-white shadow-lg group-hover:shadow-xl group-hover:scale-105"
            }`}
            style={{
              background: isSoon ? undefined : `linear-gradient(135deg, ${sector?.accentColor}ee, ${sector?.accentColor}99)`,
            }}
          >
            <Icon className="w-5 h-5" strokeWidth={1.5} />
            {!isSoon && (
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${sector?.accentColor}ff, ${sector?.accentColor}cc)`,
                }}
              />
            )}
            <Icon className="w-5 h-5 relative z-10" strokeWidth={1.5} />
          </div>
          <StatusBadge status={tool.status} />
        </div>

        {/* Content */}
        <h3 className={`text-lg font-semibold mb-2 tracking-tight ${isSoon ? "text-zinc-400" : "text-zinc-900 group-hover:text-zinc-700"} transition-colors`}>
          {tool.title}
        </h3>
        <p className={`text-sm leading-relaxed flex-1 ${isSoon ? "text-zinc-400" : "text-zinc-500"}`}>
          {tool.description}
        </p>

        {/* Footer */}
        {!isSoon && (
          <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              {sector?.name.split(" ")[0]}
            </span>
            <div className="flex items-center gap-1 text-sm font-medium text-zinc-900 group-hover:gap-2 transition-all">
              Open
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const baseClasses = "group relative block animate-fade-in-up";

  if (isSoon) {
    return <div className={`${baseClasses} cursor-not-allowed`}>{content}</div>;
  }

  return (
    <Link href={tool.href} className={baseClasses}>
      {content}
    </Link>
  );
}

function FeaturedToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = tool.icon;
  const sector = SECTORS.find((s) => s.id === tool.sector);

  return (
    <Link
      href={tool.href}
      className="group relative block animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card with gradient border on hover */}
      <div className="relative h-full">
        {/* Gradient border effect */}
        <div 
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ 
            background: `linear-gradient(135deg, ${sector?.accentColor}60, ${sector?.accentColor}20, transparent)`,
          }}
        />
        
        {/* Glow effect */}
        <div 
          className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
          style={{ background: `${sector?.accentColor}15` }}
        />
        
        <div className="relative h-full p-6 bg-white rounded-2xl border border-zinc-200/80 group-hover:border-transparent transition-all duration-300 overflow-hidden">
          {/* Background accent */}
          <div 
            className="absolute top-0 right-0 w-40 h-40 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
            style={{ 
              background: `radial-gradient(circle at top right, ${sector?.accentColor}, transparent 70%)`,
            }}
          />
          
          {/* Top row: Icon + Badges */}
          <div className="flex items-start justify-between mb-5">
            <div className="relative">
              {/* Icon glow */}
              <div 
                className="absolute inset-0 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"
                style={{ background: sector?.accentColor }}
              />
              <div
                className="relative p-3.5 rounded-xl text-white shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${sector?.accentColor}, ${sector?.accentColor}dd)` }}
              >
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex items-center gap-2">
              {tool.new && (
                <span className="px-2.5 py-1 text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-sm">
                  NIEUW
                </span>
              )}
              <span 
                className="px-3 py-1 text-[11px] font-semibold rounded-full"
                style={{ 
                  background: `${sector?.accentColor}12`,
                  color: sector?.accentColor,
                }}
              >
                {sector?.name}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight mb-2 group-hover:text-zinc-700 transition-colors">
              {tool.title}
            </h3>
            <p className="text-zinc-500 leading-relaxed mb-5 line-clamp-2">{tool.description}</p>
            
            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-600">Beschikbaar</span>
              </div>
              <div 
                className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-300"
                style={{ color: sector?.accentColor }}
              >
                <span>Probeer nu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectorButton({
  sector,
  isActive,
  count,
  onClick,
}: {
  sector: Sector;
  isActive: boolean;
  count: number;
  onClick: () => void;
}) {
  const Icon = sector.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
        isActive
          ? "bg-zinc-900 text-white shadow-lg"
          : "hover:bg-zinc-100 text-zinc-600"
      }`}
    >
      <div 
        className={`p-1.5 rounded-lg ${isActive ? "bg-white/20" : "bg-zinc-100"}`}
        style={{ color: isActive ? 'white' : sector.accentColor }}
      >
        <Icon className="w-4 h-4" strokeWidth={1.5} />
      </div>
      <span className="flex-1 text-sm font-medium truncate">{sector.name}</span>
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isActive ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ToolsPageClient({ locale }: { locale: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<SectorId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ToolStatus | "all">("all");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter tools
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedSector !== "all" && tool.sector !== selectedSector) {
        return false;
      }
      if (statusFilter !== "all" && tool.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedSector, statusFilter]);

  const featuredTools = TOOLS.filter((t) => t.featured && t.status === "live");

  const sectorsWithCounts = useMemo(() => {
    return SECTORS.map((sector) => ({
      ...sector,
      count: TOOLS.filter((t) => t.sector === sector.id).length,
    })).filter((s) => s.count > 0);
  }, []);

  const liveCount = TOOLS.filter((t) => t.status === "live").length;
  const totalCount = TOOLS.length;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>

      {/* HERO HEADER */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-zinc-950" />
        
        {/* Gradient mesh background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[128px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>
        
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Stats badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full text-sm text-white/80 mb-8 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-medium">{liveCount} tools live</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-white/60" />
                <span>{totalCount - liveCount} in ontwikkeling</span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
              <span className="block">AI Tools voor het</span>
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  Nederlandse MKB
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-blue-500/30 blur-xl" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Professionele AI-tools die je uren werk besparen. 
              <span className="text-white/80"> Van administratie tot marketing</span>, 
              alles op één plek.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center">
                  <Search className="absolute left-5 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Zoek een tool... bijv. 'factuur', 'contract', 'offerte'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-14 py-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300"
                  />
                  <div className="absolute right-4 flex items-center gap-2">
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-zinc-400" />
                      </button>
                    ) : (
                      <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                        <Command className="w-3 h-3 text-zinc-500" />
                        <span className="text-xs text-zinc-500 font-medium">K</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50 to-transparent" />
      </div>

      {/* FEATURED TOOLS */}
      {!searchQuery && selectedSector === "all" && statusFilter === "all" && featuredTools.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-16">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-xl blur-md opacity-40" />
                <div className="relative p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                  <Star className="w-5 h-5 text-white" fill="currentColor" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Populair bij ondernemers</h2>
                <p className="text-sm text-zinc-500">Onze meest gebruikte tools</p>
              </div>
            </div>
            <Link 
              href="#all-tools" 
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Bekijk alle tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Featured cards grid - always 3 columns on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTools.map((tool, index) => (
              <FeaturedToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR */}
          <aside className="lg:w-80 shrink-0">
            {/* Mobile filter button */}
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden w-full flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 mb-4 shadow-sm"
            >
              <span className="flex items-center gap-3 font-medium text-zinc-700">
                <Filter className="w-4 h-4" />
                Filters
                {(selectedSector !== "all" || statusFilter !== "all") && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-zinc-900 text-white rounded-full">
                    Actief
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showMobileSidebar ? "rotate-180" : ""}`} />
            </button>

            {/* Sidebar content */}
            <div className={`${showMobileSidebar ? "block" : "hidden"} lg:block lg:sticky lg:top-8`}>
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm mb-6">
                {/* Status filters */}
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Status</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {(["all", "live", "beta", "soon"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                        statusFilter === status
                          ? "bg-zinc-900 text-white shadow-md"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {status === "all" ? "Alles" : status === "soon" ? "Binnenkort" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Sector filters */}
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Sectoren</h3>
                <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-2 -mr-2">
                  <button
                    onClick={() => setSelectedSector("all")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      selectedSector === "all"
                        ? "bg-zinc-900 text-white shadow-lg"
                        : "hover:bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${selectedSector === "all" ? "bg-white/20" : "bg-zinc-100"}`}>
                      <Layers className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <span className="flex-1 text-sm font-medium">Alle sectoren</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        selectedSector === "all" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-500"
                      }`}
                    >
                      {TOOLS.length}
                    </span>
                  </button>

                  {sectorsWithCounts.map((sector) => (
                    <SectorButton
                      key={sector.id}
                      sector={sector}
                      isActive={selectedSector === sector.id}
                      count={sector.count}
                      onClick={() => setSelectedSector(sector.id)}
                    />
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <div className="relative overflow-hidden rounded-2xl">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
                
                <div className="relative p-6 text-white">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Mis je een tool?</h3>
                  <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
                    Laat ons weten welke AI tool jij nodig hebt voor je business.
                  </p>
                  <a
                    href="mailto:info@aifais.com?subject=Tool suggestie"
                    className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-white text-zinc-900 font-semibold rounded-xl text-sm hover:bg-zinc-100 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Stuur suggestie
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* TOOLS GRID */}
          <main className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {selectedSector !== "all"
                    ? SECTORS.find((s) => s.id === selectedSector)?.name
                    : searchQuery
                    ? `Zoekresultaten`
                    : "Alle Tools"}
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""} gevonden
                </p>
              </div>

              {/* Clear filters */}
              {(searchQuery || selectedSector !== "all" || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSector("all");
                    setStatusFilter("all");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                  Wis filters
                </button>
              )}
            </div>

            {/* Tools grid */}
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredTools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Geen tools gevonden</h3>
                <p className="text-zinc-500 mb-6">Probeer een andere zoekterm of filter.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSector("all");
                    setStatusFilter("all");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  Toon alle tools
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="relative overflow-hidden border-t border-zinc-200">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 to-white" />
        
        {/* Decorative grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Gratis te gebruiken
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-5 tracking-tight">
            Klaar om slimmer te werken?
          </h2>
          <p className="text-lg text-zinc-500 mb-10 max-w-xl mx-auto">
            Begin vandaag nog met een van onze gratis AI tools. Geen account, geen abonnement, geen gedoe.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tools/invoice-extraction"
              className="group inline-flex items-center gap-3 px-6 py-4 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-all duration-200 shadow-lg shadow-zinc-900/20 hover:shadow-xl hover:shadow-zinc-900/30"
            >
              <ScanLine className="w-5 h-5" />
              Probeer Factuur Scanner
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tools/contract-checker"
              className="group inline-flex items-center gap-3 px-6 py-4 bg-white text-zinc-900 font-semibold rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-200 shadow-sm"
            >
              <Scale className="w-5 h-5" />
              Probeer Contract Checker
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}