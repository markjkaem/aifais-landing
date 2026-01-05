"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    try {
      const res = await fetch("/api/internal/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-[#1c1917] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden p-8 md:p-16 lg:p-20 border border-white/5 shadow-2xl">
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full -ml-32 -mb-32 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Content */}
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8">
                AI Knowledge Hub
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1]">
                Mis Geen Trend in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  2026
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-stone-400 mb-12 leading-relaxed max-w-lg">
                Wekelijks de scherpste analyses over AI Agents, ROI-optimalisatie en automatisering voor het MKB. Direct in je inbox.
              </p>
              
              <ul className="space-y-5">
                {[
                  "Exclusieve Case Studies",
                  "Prompt Engineering Tips",
                  "Tool Reviews"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white/90 text-base md:text-lg font-medium">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Form */}
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-inner shadow-white/5">
                {status === "success" ? (
                  <div className="text-center py-8 animate-slideDown">
                    <div className="w-20 h-20 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
                      <Check className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Je bent aangemeld!</h3>
                    <p className="text-stone-400">Check je inbox voor de eerste update.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="naam@bedrijf.nl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-lg"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-extrabold text-xl rounded-2xl transition-all shadow-xl shadow-blue-900/40 hover:shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      {status === "loading" ? (
                        <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Schrijf je in</span>
                          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                    
                    <p className="text-[10px] md:text-xs text-stone-500 text-center uppercase tracking-widest font-bold opacity-60">
                      Geen spam. Alleen pure waarde. Afmelden kan met één klik.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
