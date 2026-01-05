"use client";

import Link from "next/link";
import { Star, ArrowRight, Sparkles } from "lucide-react";
import { ToolUI } from "@/types/common";
import { motion } from "framer-motion";
import Image from "next/image";

interface FeaturedToolCardProps {
  tool: ToolUI;
  index: number;
}

export function FeaturedToolCard({ tool, index }: FeaturedToolCardProps) {
  // Rotating accent colors for visual variety
  const accentColors = [
    { bg: "from-blue-600 to-indigo-700", badge: "bg-blue-500", glow: "bg-blue-500/20" },
    { bg: "from-emerald-600 to-teal-700", badge: "bg-emerald-500", glow: "bg-emerald-500/20" },
    { bg: "from-amber-500 to-orange-600", badge: "bg-amber-500", glow: "bg-amber-500/20" },
    { bg: "from-purple-600 to-violet-700", badge: "bg-purple-500", glow: "bg-purple-500/20" },
  ];
  
  const accent = accentColors[index % accentColors.length];

  return (
    <Link href={tool.href} className="group block h-full">
      <div className={`
        relative h-full overflow-hidden rounded-2xl 
        bg-gradient-to-br ${accent.bg}
        p-6 flex flex-col
        transition-all duration-300
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20
      `}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        {/* Floating sparkles */}
        <Image width={40} height={40} src="/logo-official.png" alt="aifais" className="absolute top-6 right-6 h-8  w-auto text-white/30" />
        
        {/* Badges */}
        <div className="relative flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium text-white">
            <Star className="w-3 h-3 fill-current" />
            Uitgelicht
          </span>
          {tool.new && (
            <span className="px-2.5 py-1 rounded-full bg-amber-400 text-xs font-semibold text-amber-900">
              Nieuw
            </span>
          )}
        </div>

        {/* Content - flex-grow to push button down */}
        <div className="relative flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
            {tool.title}
          </h3>
          
          {/* Description - fixed height with line-clamp */}
          <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
            {tool.description}
          </p>
          
          {/* Button - always at bottom */}
          <div className="mt-auto">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-stone-900 text-sm font-semibold group-hover:bg-white/90 transition-colors">
              Bekijk tool
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}