"use client";

import { Sector } from "@/types/common";
import { cn } from "@/lib/utils"; // Assuming cn utility exists, if not I'll just use string template

export function SectorButton({
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
      className={`
        relative flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300
        ${isActive 
          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900" 
          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800"
        }
      `}
    >
      <Icon className={`w-4 h-4 ${isActive ? "text-white dark:text-slate-900" : "text-slate-400 group-hover:text-blue-500"}`} />
      <span>{sector.name}</span>
      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 dark:bg-slate-800"}`}>
        {count}
      </span>
    </button>
  );
}
