"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import { ToolUI } from "@/types/common";
import { motion } from "framer-motion";

export function ToolCard({ tool, index }: { tool: ToolUI; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={tool.href}
        className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
              <tool.icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            {tool.new && (
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3" /> New
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {tool.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        <div className="mt-auto px-6 pb-6 pt-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              {tool.pricing.type === "free" ? "Gratis" : 
               tool.pricing.currency === "SOL" ? `${tool.pricing.price} SOL` : 
               `Vanaf € ${(tool.pricing.price || 0).toFixed(2)}`}
            </span>
            <span className="capitalize">{tool.category}</span>
          </div>
          
          <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:gap-2 transition-all">
            Probeer nu
            <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
