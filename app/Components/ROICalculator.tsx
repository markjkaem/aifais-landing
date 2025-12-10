// ========================================
// FILE: components/AdvancedROICalculator.tsx
// ========================================

"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

// Types
type RoleRow = {
  id: number;
  roleName: string;
  employeeCount: number;
  hourlyRate: number;
  hoursWastedPerWeek: number;
};

export function AdvancedROICalculator() {
  const [rows, setRows] = useState<RoleRow[]>([
    {
      id: 1,
      roleName: "Administratie / Backoffice",
      employeeCount: 2,
      hourlyRate: 35,
      hoursWastedPerWeek: 8,
    },
    {
      id: 2,
      roleName: "Sales / Account Managers",
      employeeCount: 3,
      hourlyRate: 65,
      hoursWastedPerWeek: 5,
    },
  ]);

  const [efficiencyGain, setEfficiencyGain] = useState(80);
  const [opportunityMultiplier, setOpportunityMultiplier] = useState(1.5);

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows([
      ...rows,
      {
        id: newId,
        roleName: "Nieuwe Rol",
        employeeCount: 1,
        hourlyRate: 45,
        hoursWastedPerWeek: 5,
      },
    ]);
  };

  const updateRow = (id: number, field: keyof RoleRow, value: any) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const removeRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
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

    return {
      totalCurrentCost,
      totalSavings,
      costAfterAI,
      hoursReclaimed,
      fteRecovered,
    };
  }, [rows, efficiencyGain, opportunityMultiplier]);

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    // ✅ FIX: 'relative z-20' toegevoegd zodat hij altijd bovenop de gloed ligt
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative z-20">
      {/* Header */}
      <div className="bg-[#3066be] p-6 text-white text-center">
        <h3 className="text-2xl font-bold">ROI & Besparingscalculator</h3>
        <p className="text-blue-100 text-sm mt-1">
          Bereken de impact van AI-automatisering op jouw organisatie
        </p>
      </div>

      <div className="p-6 md:p-8 grid lg:grid-cols-2 gap-12">
        {/* KOLOM 1: INPUTS */}
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-gray-900 font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">
                  1
                </span>
                Jouw Team
              </h4>
              <button
                onClick={addRow}
                className="text-xs text-[#3066be] font-bold hover:underline"
              >
                + Rol Toevoegen
              </button>
            </div>

            <div className="space-y-4">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group"
                >
                  <div className="flex justify-between mb-2">
                    <input
                      type="text"
                      value={row.roleName}
                      onChange={(e) =>
                        updateRow(row.id, "roleName", e.target.value)
                      }
                      className="bg-transparent font-bold text-gray-800 focus:outline-none focus:border-b border-[#3066be] w-full"
                    />
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="block text-gray-500 text-xs mb-1">
                        Aantal FTE
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={row.employeeCount}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "employeeCount",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 bg-white rounded border border-gray-200 focus:ring-2 ring-[#3066be]/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs mb-1">
                        Uurtarief (€)
                      </label>
                      <input
                        type="number"
                        min="15"
                        value={row.hourlyRate}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "hourlyRate",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 bg-white rounded border border-gray-200 focus:ring-2 ring-[#3066be]/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs mb-1">
                        Verspilde uren/week
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
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 bg-white rounded border border-gray-200 focus:ring-2 ring-[#3066be]/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Sliders */}
          <div>
            <h4 className="text-gray-900 font-bold flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">
                2
              </span>
              Geavanceerde Factoren
            </h4>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="text-gray-600 font-medium">
                    Automatisering Efficiëntie
                  </label>
                  <span className="text-[#3066be] font-bold">
                    {efficiencyGain}%
                  </span>
                </div>
                {/* ✅ FIX: 'appearance-none' weggehaald zodat sliders werken in alle browsers */}
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={efficiencyGain}
                  onChange={(e) => setEfficiencyGain(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-[#3066be]"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Hoeveel van het handwerk kan AI overnemen?
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="text-gray-600 font-medium">
                    Opportunity Multiplier
                  </label>
                  <span className="text-[#3066be] font-bold">
                    {opportunityMultiplier}x
                  </span>
                </div>
                {/* ✅ FIX: 'appearance-none' weggehaald */}
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={opportunityMultiplier}
                  onChange={(e) =>
                    setOpportunityMultiplier(Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-[#3066be]"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Waarde die je misloopt (1 uur sales = 1.5x uurtarief aan
                  omzet).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM 2: RESULTATEN */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col justify-between">
          <div>
            <h4 className="text-gray-900 font-bold mb-6 text-xl">
              Jouw Besparingspotentieel
            </h4>

            <div className="text-center mb-8">
              <span className="block text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Jaarlijkse Winst met AI
              </span>
              <span className="text-5xl md:text-6xl font-extrabold text-[#3066be] tracking-tight">
                {formatEuro(results.totalSavings)}
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Huidige Kosten (Inclusief gemiste omzet)</span>
                  <span>{formatEuro(results.totalCurrentCost)}</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden w-full">
                  <div className="h-full bg-red-400 w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Kosten met AIFAIS</span>
                  <span className="font-bold text-green-600">
                    {formatEuro(results.costAfterAI)}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden w-full relative">
                  <div
                    className="h-full bg-green-500 absolute left-0 top-0 transition-all duration-500"
                    style={{
                      width: `${
                        (results.costAfterAI / results.totalCurrentCost) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                <span className="block text-2xl font-bold text-gray-800">
                  {Math.round(results.hoursReclaimed).toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  Uur Teruggewonnen / Jaar
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                <span className="block text-2xl font-bold text-gray-800">
                  {results.fteRecovered.toFixed(1)} FTE
                </span>
                <span className="text-xs text-gray-500">Capaciteit Erbij</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Wil je een gedetailleerd rapport van deze cijfers per e-mail
              ontvangen?
            </p>
            <Link
              href="/contact"
              className="block w-full py-4 bg-[#3066be] hover:bg-[#234a8c] text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-1 text-center"
            >
              Neem contact op →
            </Link>
            <p className="text-xs text-gray-400 mt-3">
              Geen zorgen, we spammen niet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
