"use client";

import { useState } from "react";
import { benchmarkData, questions, BenchmarkSector } from "./benchmarkData";
import Link from "next/link";

export default function BenchmarkTool({ locale }: { locale: string }) {
  const [step, setStep] = useState(0); // 0 = Sector, 1-5 = Questions, 6 = Results
  const [selectedSector, setSelectedSector] = useState<BenchmarkSector | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSectorSelect = (slug: string) => {
    setSelectedSector(benchmarkData[slug]);
    setStep(1);
  };

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    setStep(step + 1);
  };

  const calculateFinalScore = () => {
    if (answers.length === 0) return 0;
    return Math.round(answers.reduce((a, b) => a + b, 0) / answers.length);
  };

  const finalScore = calculateFinalScore();
  const benchmark = selectedSector?.avgDigitalScore || 50;

  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">Selecteer uw sector</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.values(benchmarkData).map((s) => (
            <button
              key={s.slug}
              onClick={() => handleSectorSelect(s.slug)}
              className="p-6 text-left border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
            >
              <div className="font-bold text-slate-900 group-hover:text-blue-600 mb-1">{s.name}</div>
              <div className="text-xs text-slate-400">Benchmark: {s.avgDigitalScore}% digital score</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step >= 1 && step <= questions.length) {
    const q = questions[step - 1];
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="mb-8 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>Stap {step} van {questions.length}</span>
          <span>{Math.round((step / questions.length) * 100)}%</span>
        </div>
        <div className="w-full h-1 bg-slate-100 rounded-full mb-12">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500" 
            style={{ width: `${(step / questions.length) * 100}%` }}
          ></div>
        </div>
        
        <h2 className="text-2xl font-bold mb-8 text-slate-900 leading-tight">{q.question}</h2>
        <div className="space-y-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.score)}
              className="w-full p-6 text-left border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all text-slate-700 font-medium"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4">UW SCORE</div>
          <div className="text-7xl font-extrabold text-[#3066be] mb-4">{finalScore}%</div>
          <p className="text-slate-500 font-medium">
            {finalScore > benchmark 
              ? `U scoort boven het gemiddelde van ${benchmark}% in de ${selectedSector?.name} sector!` 
              : `U scoort onder het sectorgemiddelde van ${benchmark}%. Er is veel potentieel voor groei.`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-slate-50 rounded-3xl">
            <h3 className="font-bold text-slate-900 mb-4">Sectorgemiddelde ({selectedSector?.name})</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-500">Digitale score:</span>
                <span className="font-bold">{selectedSector?.avgDigitalScore}%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Admin overhead:</span>
                <span className="font-bold">{selectedSector?.avgFTEAdmin}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Top uitdaging:</span>
                <span className="font-bold text-right ml-4">{selectedSector?.topChallenge}</span>
              </li>
            </ul>
          </div>
          
          <div className="p-8 bg-blue-600 rounded-3xl text-white">
            <h3 className="font-bold mb-4 text-white">Uw Besparingspotentieel</h3>
            <div className="text-4xl font-bold mb-2">{selectedSector?.potentialSaving}</div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Op basis van uw antwoorden kunt u tot wel {selectedSector?.potentialSaving} besparen door processen te automatiseren via AIFAIS AI Agents.
            </p>
          </div>
        </div>

        {!submitted ? (
          <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Ontvang het Volledige Rapport</h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              We hebben een gedetailleerde analyse voor u klaarstaan met 3 specifieke verbeterpunten voor uw organisatie.
            </p>
            <form 
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input 
                type="email" 
                placeholder="uw-naam@bedrijf.nl"
                required
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all">
                Stuur Rapport
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">✓</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Rapport Onderweg!</h3>
            <p className="text-slate-600 mb-6">We hebben de volledige benchmark analyse naar <strong>{email}</strong> gestuurd.</p>
            <Link href="/contact" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-500 transition-all">
              Plan een gratis adviesgesprek
            </Link>
          </div>
        )}
      </div>
      
      <div className="text-center mt-12">
        <button 
          onClick={() => { setStep(0); setAnswers([]); setSubmitted(false); }}
          className="text-slate-400 text-sm hover:text-blue-600 transition-colors font-medium"
        >
          Opnieuw beginnen
        </button>
      </div>
    </div>
  );
}
