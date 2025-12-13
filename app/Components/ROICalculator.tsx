// ========================================
// FILE: components/AdvancedROICalculator.tsx
// Premium Fintech/Consultancy Aesthetic
// ========================================

"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

type RoleRow = {
  id: number;
  roleName: string;
  employeeCount: number;
  hourlyRate: number;
  hoursWastedPerWeek: number;
};

const presetRoles = [
  { name: "Administratie", rate: 35, hours: 8 },
  { name: "Sales", rate: 65, hours: 5 },
  { name: "Klantenservice", rate: 38, hours: 10 },
  { name: "Operations", rate: 45, hours: 6 },
  { name: "Finance", rate: 55, hours: 7 },
];

export function AdvancedROICalculator() {
  const [rows, setRows] = useState<RoleRow[]>([
    {
      id: 1,
      roleName: "Administratie",
      employeeCount: 1,
      hourlyRate: 30,
      hoursWastedPerWeek: 8,
    },
  ]);

  const [efficiencyGain, setEfficiencyGain] = useState(80);
  const [opportunityMultiplier, setOpportunityMultiplier] = useState(1.5);
  const [activeTab, setActiveTab] = useState<"input" | "results">("input");

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    const unusedPreset = presetRoles.find(
      (p) => !rows.some((r) => r.roleName === p.name)
    );
    setRows([
      ...rows,
      {
        id: newId,
        roleName: unusedPreset?.name || "Nieuwe rol",
        employeeCount: 1,
        hourlyRate: unusedPreset?.rate || 45,
        hoursWastedPerWeek: unusedPreset?.hours || 5,
      },
    ]);
  };

  const updateRow = (
    id: number,
    field: keyof RoleRow,
    value: string | number
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const results = useMemo(() => {
    let totalDirectCost = 0;
    let totalOpportunityCost = 0;
    let totalHoursWasted = 0;

    rows.forEach((row) => {
      const weeklyHours = row.hoursWastedPerWeek * row.employeeCount;
      const yearlyHours = weeklyHours * 52;
      const directCost = yearlyHours * row.hourlyRate;
      const oppCost = directCost * (opportunityMultiplier - 1);

      totalHoursWasted += yearlyHours;
      totalDirectCost += directCost;
      totalOpportunityCost += oppCost;
    });

    const totalCurrentCost = totalDirectCost + totalOpportunityCost;
    const savingsDirect = totalDirectCost * (efficiencyGain / 100);
    const savingsOpportunity = totalOpportunityCost * (efficiencyGain / 100);
    const totalSavings = savingsDirect + savingsOpportunity;
    const costAfterAI = totalCurrentCost - totalSavings;
    const hoursReclaimed = totalHoursWasted * (efficiencyGain / 100);
    const fteRecovered = hoursReclaimed / 1700;
    const monthlyValue = totalSavings / 12;

    return {
      totalCurrentCost,
      totalDirectCost,
      totalOpportunityCost,
      totalSavings,
      costAfterAI,
      hoursReclaimed,
      fteRecovered,
      monthlyValue,
      savingsPercentage:
        totalCurrentCost > 0 ? (totalSavings / totalCurrentCost) * 100 : 0,
    };
  }, [rows, efficiencyGain, opportunityMultiplier]);

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("nl-NL").format(Math.round(num));

  return (
    <div className="font-body relative z-20">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden border-b border-gray-200 bg-gray-50">
        <div className="flex">
          <button
            onClick={() => setActiveTab("input")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === "input"
                ? "text-[#1e3a5f] border-b-2 border-[#1e3a5f] bg-white"
                : "text-gray-500"
            }`}
          >
            Invoer
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === "results"
                ? "text-[#1e3a5f] border-b-2 border-[#1e3a5f] bg-white"
                : "text-gray-500"
            }`}
          >
            Resultaten
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        {/* LEFT: INPUT PANEL */}
        <div
          className={`p-6 md:p-8 border-r border-gray-100 ${
            activeTab === "results" ? "hidden lg:block" : ""
          }`}
        >
          {/* Section 1: Team Roles */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#3066be] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h4 className="font-semibold text-gray-900">
                  Teamsamenstelling
                </h4>
              </div>
              <button
                onClick={addRow}
                className="text-sm text-[#1e3a5f] font-semibold hover:text-[#2d4a6f] transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Rol toevoegen
              </button>
            </div>

            <div className="space-y-3">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="group relative bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {/* Role Header */}
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={row.roleName}
                      onChange={(e) =>
                        updateRow(row.id, "roleName", e.target.value)
                      }
                      className="bg-transparent font-semibold text-gray-900 focus:outline-none border-b border-transparent focus:border-[#1e3a5f] transition-colors text-sm"
                      placeholder="Rolnaam"
                    />
                    <button
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length <= 1}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        rows.length <= 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                      title={
                        rows.length <= 1
                          ? "Minimaal één rol vereist"
                          : "Verwijderen"
                      }
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Input Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Aantal FTE
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={row.employeeCount}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "employeeCount",
                            Math.max(1, Number(e.target.value))
                          )
                        }
                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none text-sm font-medium text-gray-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        €/uur
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="500"
                        value={row.hourlyRate}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "hourlyRate",
                            Math.max(15, Number(e.target.value))
                          )
                        }
                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none text-sm font-medium text-gray-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Uren/week
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={row.hoursWastedPerWeek}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "hoursWastedPerWeek",
                            Math.min(40, Math.max(1, Number(e.target.value)))
                          )
                        }
                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none text-sm font-medium text-gray-900 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Parameters */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-[#3066be] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h4 className="font-semibold text-gray-900">Parameters</h4>
            </div>

            <div className="space-y-6">
              {/* Efficiency Slider */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900">
                      Automatiseringsgraad
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Percentage taken dat geautomatiseerd wordt
                    </p>
                  </div>
                  <span className="text-lg font-bold text-[#1e3a5f] tabular-nums">
                    {efficiencyGain}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={efficiencyGain}
                  onChange={(e) => setEfficiencyGain(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full cursor-pointer accent-[#1e3a5f]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                  <span>Conservatief</span>
                  <span>Optimaal</span>
                </div>
              </div>

              {/* Opportunity Multiplier */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900">
                      Opportuniteitsfactor
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Gederfde waarde per uur (bijv. sales → omzet)
                    </p>
                  </div>
                  <span className="text-lg font-bold text-[#1e3a5f] tabular-nums">
                    {opportunityMultiplier.toFixed(1)}×
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={opportunityMultiplier}
                  onChange={(e) =>
                    setOpportunityMultiplier(Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-full cursor-pointer accent-[#1e3a5f]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                  <span>1× (alleen loon)</span>
                  <span>5× (hoge leverage)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: RESULTS PANEL */}
        <div
          className={` bg-[#3066be]  p-6 md:p-8 text-white ${
            activeTab === "input" ? "hidden lg:block" : ""
          }`}
        >
          {/* Hero Number */}
          <div className="text-center mb-8">
            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">
              Geschat jaarlijks voordeel
            </span>
            <div className="relative">
              <span className="block text-5xl md:text-6xl font-bold tracking-tight tabular-nums">
                {formatEuro(results.totalSavings)}
              </span>
              <span className="block text-sm text-white/60 mt-2">
                {formatEuro(results.monthlyValue)} per maand
              </span>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between text-xs text-white/60 mb-3">
              <span>Huidige situatie</span>
              <span>Na automatisering</span>
            </div>

            <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-3">
              {/* Current cost bar (full width = 100%) */}
              <div
                className="absolute inset-y-0 left-0 bg-red-400/80 rounded-full"
                style={{ width: "100%" }}
              />
              {/* Cost after AI (proportional) */}
              <div
                className="absolute inset-y-0 left-0 bg-emerald-400 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max(
                    5,
                    (results.costAfterAI / results.totalCurrentCost) * 100
                  )}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-white/50 text-xs block">Was</span>
                <span className="font-semibold text-red-300">
                  {formatEuro(results.totalCurrentCost)}
                </span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/20 px-2 py-1 rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  {results.savingsPercentage.toFixed(0)}% besparing
                </span>
              </div>
              <div className="text-right">
                <span className="text-white/50 text-xs block">Wordt</span>
                <span className="font-semibold text-emerald-300">
                  {formatEuro(results.costAfterAI)}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <span className="block text-2xl font-bold tabular-nums">
                {formatNumber(results.hoursReclaimed)}
              </span>
              <span className="text-xs text-white/60 leading-tight block mt-1">
                uren teruggewonnen
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <span className="block text-2xl font-bold tabular-nums">
                {results.fteRecovered.toFixed(1)}
              </span>
              <span className="text-xs text-white/60 leading-tight block mt-1">
                FTE-equivalent
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="border-t border-white/10 pt-6 mb-8">
            <h5 className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 mb-4">
              Uitsplitsing
            </h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">
                  Directe loonkosten
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatEuro(results.totalDirectCost)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">
                  Opportuniteitskosten
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatEuro(results.totalOpportunityCost)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-sm font-semibold text-white/90">
                  Totale vermijdbare kosten
                </span>
                <span className="text-sm font-bold tabular-nums">
                  {formatEuro(results.totalCurrentCost)}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 w-full py-4 bg-white text-[#1e3a5f] font-semibold rounded-xl hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              Bespreek uw situatie
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <p className="text-center text-xs text-white/40">
              Vrijblijvend gesprek van 30 minuten
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
