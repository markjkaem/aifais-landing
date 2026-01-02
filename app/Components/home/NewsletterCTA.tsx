"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Mocking a newsletter signup
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-linear-to-br from-[#3066be] to-[#1e4a91] rounded-3xl p-8 md:p-16 shadow-2xl shadow-blue-900/20 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
              Blijf de concurrentie voor met <span className="text-blue-200">AI-inzichten</span>
            </h2>
            <p className="text-lg md:text-xl text-blue-100/90 mb-10 leading-relaxed font-light">
              Ontvang wekelijks de laatste trends, praktische tips en concrete cases over AI-automatisering voor het MKB. Geen spam, alleen waarde voor jouw bedrijf.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                required
                placeholder="Je zakelijke e-mailadres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-blue-100/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition backdrop-blur-md"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`px-8 py-4 rounded-full font-bold text-gray-900 transition-all shadow-xl hover:scale-105 active:scale-95 ${
                  status === "success" ? "bg-green-400" : "bg-white hover:bg-blue-50"
                }`}
              >
                {status === "loading" ? "Laden..." : status === "success" ? "Bedankt!" : "Inschrijven"}
              </button>
            </form>

            <p className="mt-6 text-sm text-blue-100/60 font-mono tracking-wide uppercase">
              Al 150+ MKB-ondernemers gingen je voor
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
