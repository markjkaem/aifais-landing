"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ChevronRight, Shield, BarChart3, Megaphone } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay for better UX
      setTimeout(() => {
        setShowBanner(true);
      }, 1500);
    } else if (consent === "accepted") {
      // Load analytics if user previously accepted
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = () => {
    // Google Analytics - Replace with your GA4 ID
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }

    // Hotjar
    if (typeof window !== "undefined" && (window as any).hj) {
      (window as any).hj("stateChange", window.location.pathname);
    }
  };

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    loadAnalytics();
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary-only");
    // Don't load analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Subtle backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-[2px] z-[9990]"
            onClick={acceptNecessary}
          />

          {/* Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 z-[9991] md:bottom-6 md:left-6 md:right-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl shadow-stone-200/50 border border-stone-200 overflow-hidden">
                {/* Top accent line */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                <div className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    {/* Icon and Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center border border-amber-200/50">
                          <Cookie className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-stone-900 mb-1">
                            Cookies op AIFAIS
                          </h3>
                          <p className="text-sm text-stone-500 leading-relaxed">
                            We gebruiken cookies om je ervaring te verbeteren en onze site te analyseren.
                          </p>
                        </div>
                      </div>

                      {/* Expandable details */}
                      <div className="mt-4 ml-15">
                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors group"
                        >
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              showDetails ? "rotate-90" : ""
                            }`}
                          />
                          <span>Meer informatie</span>
                        </button>

                        <AnimatePresence>
                          {showDetails && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 space-y-3">
                                {/* Necessary */}
                                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-stone-900">
                                        Noodzakelijk
                                      </span>
                                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded">
                                        Altijd aan
                                      </span>
                                    </div>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                      Essentieel voor de werking van de website
                                    </p>
                                  </div>
                                </div>

                                {/* Analytics */}
                                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <BarChart3 className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-semibold text-stone-900">
                                      Analytics
                                    </span>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                      Google Analytics voor websitegebruik analyse
                                    </p>
                                  </div>
                                </div>

                                {/* Marketing */}
                                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <Megaphone className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-semibold text-stone-900">
                                      Marketing
                                    </span>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                      Voor het meten van campagne-effectiviteit
                                    </p>
                                  </div>
                                </div>

                                {/* Links */}
                                <p className="text-xs text-stone-400 pt-1">
                                  Lees meer in onze{" "}
                                  <Link
                                    href="/privacy"
                                    className="text-blue-600 hover:underline"
                                  >
                                    privacyverklaring
                                  </Link>{" "}
                                  en{" "}
                                  <Link
                                    href="/cookies"
                                    className="text-blue-600 hover:underline"
                                  >
                                    cookiebeleid
                                  </Link>
                                  .
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2.5 lg:flex-col xl:flex-row lg:w-auto">
                      <button
                        onClick={acceptAll}
                        className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-stone-900/10 hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
                      >
                        Accepteer alles
                      </button>
                      <button
                        onClick={acceptNecessary}
                        className="px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-sm rounded-xl transition-all border border-stone-200 hover:border-stone-300 whitespace-nowrap"
                      >
                        Alleen noodzakelijk
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
