"use client";

import dynamic from "next/dynamic";

const AdvancedROICalculator = dynamic(
  () => import("@/app/Components/ROICalculator").then((mod) => mod.AdvancedROICalculator),
  {
    loading: () => <div className="h-96 flex items-center justify-center bg-gray-50 animate-pulse rounded-2xl">Laden...</div>,
    ssr: false,
  }
);

export default function ROICalculatorPageClient() {
  return (
    <div className="relative">
      {/* Subtle frame */}
      <div className="absolute -inset-px bg-linear-to-b from-gray-200 to-gray-300/50 rounded-2xl" />
      <div className="relative bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden">
        <AdvancedROICalculator />
      </div>
    </div>
  );
}
