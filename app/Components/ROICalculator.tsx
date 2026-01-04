// ========================================
// FILE: components/ROICalculator.tsx
// Simplified Multi-Step ROI QuickScan
// ========================================

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function AdvancedROICalculator() {
  const [step, setStep] = useState(0); // 0: Start, 1: Team, 2: Time, 3: Cost, 4: Email, 5: Final
  const [teamSize, setTeamSize] = useState(5);
  const [hoursLost, setHoursLost] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(45);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const results = useMemo(() => {
    const weeklyHours = teamSize * hoursLost;
    const yearlyHours = weeklyHours * 52;
    const efficiencyGain = 0.8; // Standard 80% improvement
    const potentialSavings = yearlyHours * hourlyRate * efficiencyGain;
    const hoursReclaimed = yearlyHours * efficiencyGain;
    const fteEquivalent = hoursReclaimed / 1700;

    return {
      potentialSavings,
      hoursReclaimed,
      fteEquivalent,
      monthlyValue: potentialSavings / 12,
    };
  }, [teamSize, hoursLost, hourlyRate]);

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/internal/quickscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          results: {
            totalSavings: formatEuro(results.potentialSavings),
            hoursReclaimed: Math.round(results.hoursReclaimed).toString(),
            fteRecovered: results.fteEquivalent.toFixed(1),
          },
          formData: { name, teamSize, hoursLost, hourlyRate },
        }),
      });
      setStep(5);
    } catch (error) {
      console.error("Submission error:", error);
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Ontdek uw AI Potentieel",
      subtitle: "In 3 simpele stappen berekenen we wat automatisering voor uw team betekent.",
      content: (
        <div className="text-center">
          <button
            onClick={() => setStep(1)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#3066be] text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-[#234a8c] transition-all"
          >
            Start Gratis Analyse
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      ),
    },
    {
      title: "Om hoeveel mensen gaat het?",
      subtitle: "Voor hoeveel FTE / medewerkers voeren we de berekening uit?",
      content: (
        <div className="space-y-8">
          <div className="flex justify-center flex-wrap gap-3">
            {[1, 3, 5, 10, 25, 50].map((val) => (
              <button
                key={val}
                onClick={() => setTeamSize(val)}
                className={`w-14 h-14 rounded-xl font-bold transition-all border-2 ${
                  teamSize === val
                    ? "bg-[#3066be] text-white border-[#3066be] scale-110"
                    : "bg-white text-gray-500 border-gray-100 hover:border-blue-200"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <input
              type="range"
              min="1"
              max="100"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#3066be]"
            />
            <div className="flex justify-between mt-3 text-xs font-bold text-gray-400">
              <span>1 PERSOON</span>
              <span>100 PERSONEN</span>
            </div>
          </div>
          <button onClick={() => setStep(2)} className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl">Volgende Stap</button>
        </div>
      ),
    },
    {
      title: "Hoeveel uur wordt er 'verspild'?",
      subtitle: "Denk aan administratie, overtypen, e-mail management en repetitieve data-entry per persoon per week.",
      content: (
        <div className="space-y-8">
          <div className="text-center">
             <div className="text-6xl font-black text-[#3066be] mb-2">{hoursLost}</div>
             <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Uur per week</div>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <input
              type="range"
              min="1"
              max="40"
              value={hoursLost}
              onChange={(e) => setHoursLost(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#3066be]"
            />
            <div className="flex justify-between mt-3 text-xs font-bold text-gray-400">
               <span>BIJNA NIETS</span>
               <span>40 UUR (FULLTIME)</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setStep(1)} className="py-4 border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50">Terug</button>
            <button onClick={() => setStep(3)} className="py-4 bg-gray-900 text-white font-bold rounded-2xl">Volgende Stap</button>
          </div>
        </div>
      ),
    },
    {
      title: "Uurtarief & Loonkosten",
      subtitle: "Geef het gemiddelde bruto uurtarief op (inclusief werkgeverslasten).",
      content: (
        <div className="space-y-8">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300">€</span>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full pl-12 pr-6 py-6 bg-gray-50 border-2 border-gray-100 rounded-2xl text-3xl font-bold text-gray-900 focus:border-[#3066be] focus:outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button onClick={() => setStep(2)} className="py-4 border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50">Terug</button>
            <button onClick={() => setStep(4)} className="py-4 bg-gray-900 text-white font-bold rounded-2xl">Bekijk Analyse</button>
          </div>
        </div>
      ),
    },
    {
      title: "Analyse Klaar! 🚀",
      subtitle: "De berekening voor uw team is voltooid. Waar mogen we het uitgebreide rapport naartoe sturen?",
      content: (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Uw Naam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#3066be] outline-none font-medium"
          />
          <input
            type="email"
            required
            placeholder="uw-naam@bedrijf.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#3066be] outline-none font-medium"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#3066be] hover:bg-[#234a8c] text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Bezig met genereren..." : "Ontvang ROI Rapport"}
          </button>
          <p className="text-[10px] text-center text-gray-400 leading-tight pt-2">
            Uw data is veilig. We sturen u direct de resultaten en optioneel onze AI-nieuwsbrief.
          </p>
        </form>
      ),
    },
    {
      title: "Uw Resultaten",
      subtitle: "Op basis van uw input hebben we dit potentieel berekend:",
      content: (
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-[#3066be] to-[#1e3a5f] p-8 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
               <div className="text-xs font-bold tracking-[0.2em] opacity-60 mb-2">JAARLIJKSE BESPARING</div>
               <div className="text-5xl md:text-6xl font-black mb-3">{formatEuro(results.potentialSavings)}</div>
               <div className="text-blue-200 font-medium">Dat is {formatEuro(results.monthlyValue)} / maand</div>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                <div className="text-2xl font-bold text-gray-900">{Math.round(results.hoursReclaimed)}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Uren per jaar</div>
             </div>
             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                <div className="text-2xl font-bold text-gray-900">{results.fteEquivalent.toFixed(1)}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">FTE potentieel</div>
             </div>
           </div>

           <div className="text-center pt-4">
             <Link
               href="/contact"
               className="inline-flex items-center gap-2 text-[#3066be] font-bold hover:underline"
             >
               Plan een gratis strategiegesprek →
             </Link>
           </div>
        </div>
      ),
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="relative bg-white pt-10 pb-12 px-8">
      {/* Step Indicator */}
      {step > 0 && step < 5 && (
        <div className="absolute top-6 left-8 right-8 h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#3066be]"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-black text-gray-900 mb-3 tracking-tight`}>
              {currentStep.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {currentStep.subtitle}
            </p>
          </div>

          <div className="min-h-[200px] flex flex-col justify-center">
            {currentStep.content}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
