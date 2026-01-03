"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#3066be20_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#4f46e510_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-600/20 transition-all duration-700" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 text-blue-400 text-xs font-bold tracking-widest uppercase">
                AI Knowledge Hub
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                Mis Geen Trend in <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">2026</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Wekelijks de scherpste analyses over AI Agents, ROI-optimalisatie en automatisering voor het MKB. Direct in je inbox.
              </p>
              
              <ul className="space-y-3">
                {["Exclusieve Case Studies", "Prompt Engineering Tips", "Tool Reviews"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              {status === "success" ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-slideDown">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Je bent aangemeld!</h3>
                  <p className="text-emerald-100/70 text-sm">Check je inbox voor een welkomstcadeau.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="group relative">
                    <input
                      type="email"
                      required
                      placeholder="naam@bedrijf.nl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <button
                    disabled={status === "loading"}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Verstuur Analyse
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-500 text-center px-4 uppercase tracking-tighter">
                    Geen spam. Alleen pure waarde. Afmelden kan met één klik.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
