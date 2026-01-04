"use client";

import { useState } from "react";
import { benchmarkData, questions, BenchmarkSector } from "./benchmarkData";
import Link from "next/link";

const sectorIcons: Record<string, string> = {
  accountants: "📊",
  advocaten: "⚖️",
  "e-commerce": "🛒",
  overig: "📁",
};

export default function BenchmarkTool({ locale }: { locale: string }) {
  const [step, setStep] = useState(0);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch("/api/internal/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sector: selectedSector?.name,
          score: finalScore,
          benchmark: benchmark
        }),
      });
      
      if (!response.ok) throw new Error("API response not ok");
      
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit benchmark lead:", err);
      // Still show success UI so user isn't blocked, but log error
      setSubmitted(true);
    }
  };

  const finalScore = calculateFinalScore();
  const benchmark = selectedSector?.avgDigitalScore || 50;
  const isAboveBenchmark = finalScore > benchmark;

  // Sector Selection
  if (step === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-black/5 p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">In welke sector bent u actief?</h2>
            <p className="text-gray-500">Selecteer uw sector voor een nauwkeurige benchmark vergelijking</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {Object.values(benchmarkData).map((s) => (
              <button
                key={s.slug}
                onClick={() => handleSectorSelect(s.slug)}
                className="group relative p-6 text-left bg-gray-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-violet-50 border-2 border-gray-100 hover:border-blue-200 rounded-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{sectorIcons[s.slug] || "📁"}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {s.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      Gem. score: <span className="text-gray-600 font-medium">{s.avgDigitalScore}%</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Questions
  if (step >= 1 && step <= questions.length) {
    const q = questions[step - 1];
    const progress = (step / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-black/5 p-8 md:p-12">
          {/* Progress header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Terug
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400">
                {step} / {questions.length}
              </span>
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < step ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100 rounded-full mb-10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4">
              <span>Vraag {step}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {q.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.score)}
                className="group w-full p-5 text-left bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-violet-50 border-2 border-gray-100 hover:border-blue-300 rounded-2xl transition-all duration-200 flex items-center justify-between gap-4"
              >
                <span className="text-gray-700 group-hover:text-gray-900 font-medium transition-colors">
                  {opt.label}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-blue-500 border border-gray-200 group-hover:border-blue-500 flex items-center justify-center transition-all shrink-0">
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-2xl shadow-black/10 overflow-hidden">
        {/* Score Header */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 md:p-14 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ${
              isAboveBenchmark
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {isAboveBenchmark ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Boven sectorgemiddelde
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  Groeipotentieel
                </>
              )}
            </div>

            {/* Score display */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400">
                  {finalScore}
                </div>
                <div className="text-white/40 font-medium">Uw Score</div>
              </div>
              <div className="text-6xl text-white/20 font-light">/</div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white/30">
                  {benchmark}
                </div>
                <div className="text-white/40 font-medium">Benchmark</div>
              </div>
            </div>

            <p className="text-white/60 max-w-md mx-auto">
              {isAboveBenchmark
                ? `Uitstekend! U scoort ${finalScore - benchmark}% boven het gemiddelde van de ${selectedSector?.name} sector.`
                : `Er is potentieel voor ${benchmark - finalScore}% verbetering ten opzichte van uw branchegenoten.`}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Sector Stats */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                  <span className="text-xl">{sectorIcons[selectedSector?.slug || ""] || "📁"}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{selectedSector?.name}</div>
                  <div className="text-sm text-gray-400">Sectorgemiddelde</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Digitale score</span>
                  <span className="font-bold text-gray-900">{selectedSector?.avgDigitalScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Admin overhead</span>
                  <span className="font-bold text-gray-900">{selectedSector?.avgFTEAdmin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Top uitdaging</span>
                  <span className="font-bold text-gray-900 text-right text-sm max-w-[150px]">{selectedSector?.topChallenge}</span>
                </div>
              </div>
            </div>

            {/* Potential Savings */}
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold">Besparingspotentieel</div>
                    <div className="text-sm text-blue-200">Jaarlijks met AI automatisering</div>
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-extrabold mb-3">{selectedSector?.potentialSaving}</div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Dit is een schatting op basis van vergelijkbare bedrijven die hun processen hebben geautomatiseerd.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          {!submitted ? (
            <div className="bg-gray-900 rounded-2xl p-8 md:p-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-3">Ontvang het Volledige Rapport</h3>
                <p className="text-gray-400 max-w-lg mx-auto">
                  We sturen u een gedetailleerde analyse met 3 specifieke verbeterpunten voor uw organisatie.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="uw-naam@bedrijf.nl"
                  required
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 whitespace-nowrap">
                  Stuur Rapport
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-2">Rapport Onderweg!</h3>
              <p className="text-emerald-600 mb-6">
                We hebben de volledige benchmark analyse naar <strong>{email}</strong> gestuurd.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-800 transition-all"
              >
                Plan een gratis adviesgesprek
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Reset button */}
      <div className="text-center mt-8">
        <button
          onClick={() => { setStep(0); setAnswers([]); setSubmitted(false); setEmail(""); }}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Opnieuw beginnen
        </button>
      </div>
    </div>
  );
}
