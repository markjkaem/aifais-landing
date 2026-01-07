"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, CheckCircle2, Sparkles, FileText, Loader2 } from "lucide-react";

interface LeadMagnetPopupProps {
  // Delay before showing (in ms) - default 30 seconds
  delay?: number;
  // Show on exit intent
  exitIntent?: boolean;
}

export default function LeadMagnetPopup({
  delay = 30000,
  exitIntent = true
}: LeadMagnetPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if already dismissed or submitted
    const dismissed = localStorage.getItem("leadMagnetDismissed");
    const submitted = localStorage.getItem("leadMagnetSubmitted");

    if (dismissed || submitted) return;

    // Timer-based popup
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (exitIntent && e.clientY <= 0 && !isOpen) {
        setIsOpen(true);
      }
    };

    if (exitIntent) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      clearTimeout(timer);
      if (exitIntent) {
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [delay, exitIntent, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("leadMagnetDismissed", Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/internal/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "lead_magnet",
          resource: "ai_checklist"
        }),
      });

      if (res.ok) {
        setStatus("success");
        localStorage.setItem("leadMagnetSubmitted", Date.now().toString());
        // Auto close after 3 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 pt-10 pb-16">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M15 0v30M0 15h30%22 stroke=%22%23fff%22 stroke-opacity=%22.05%22/%3E%3C/svg%3E')] pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-4">
                  <Sparkles className="w-3 h-3" />
                  Gratis Download
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  AI Readiness Checklist
                </h2>
                <p className="text-blue-100 text-sm sm:text-base">
                  Ontdek in 5 minuten welke processen jij kunt automatiseren
                </p>
              </div>

              {/* Floating document icon */}
              <div className="absolute -bottom-8 right-8 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pt-12 pb-8">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">
                    Check je inbox!
                  </h3>
                  <p className="text-stone-500 text-sm">
                    De checklist is onderweg naar {email}
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Benefits */}
                  <ul className="space-y-3 mb-6">
                    {[
                      "10 vragen om je AI-gereedheid te testen",
                      "ROI calculator template (Excel)",
                      "Prioriteiten matrix voor processen",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-stone-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      placeholder="jouw@email.nl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Download Gratis Checklist</span>
                        </>
                      )}
                    </button>

                    {status === "error" && (
                      <p className="text-red-500 text-sm text-center">
                        Er ging iets mis. Probeer het opnieuw.
                      </p>
                    )}
                  </form>

                  <p className="text-xs text-stone-400 text-center mt-4">
                    Geen spam. Je kunt je altijd uitschrijven.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
