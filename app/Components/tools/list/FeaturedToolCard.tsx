"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { ToolUI } from "@/types/common";
import { motion } from "framer-motion";

export function FeaturedToolCard({ tool, index }: { tool: ToolUI; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="col-span-1 md:col-span-2 group"
    >
      <Link
        href={tool.href}
        className="relative flex flex-col md:flex-row h-full bg-slate-900 rounded-4xl border border-white/5 overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent)]" />
        
        <div className="relative p-8 md:p-12 md:w-2/3 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              <Star className="w-3 h-3 fill-amber-400" /> Featured
            </div>
            {tool.new && (
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                New
              </div>
            )}
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
            {tool.title}
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
            {tool.description}
          </p>

          <div className="mt-auto flex items-center gap-4">
            <div className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
              Direct aan de slag
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        <div className="md:w-1/3 relative bg-slate-800/50 flex items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent)]" />
          <tool.icon className="w-32 h-32 text-blue-500/20 group-hover:text-blue-500/40 group-hover:scale-110 transition-all duration-700" />
          <Sparkles className="absolute top-1/4 right-1/4 w-8 h-8 text-blue-400/20 animate-pulse" />
        </div>
      </Link>
    </motion.div>
  );
}
