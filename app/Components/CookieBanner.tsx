"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay for better UX
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 1000);
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

    // Mailchimp tracking (if applicable)
    // Add any other tracking scripts here
  };

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    loadAnalytics();
    closeBanner();
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary-only");
    // Don't load analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
    closeBanner();
  };

  const closeBanner = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={acceptNecessary}
      />

      {/* Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-zinc-900/95 to-zinc-950/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Decorative gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-400 to-amber-400 rounded-t-2xl" />

            {/* Decorative corner glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🍪</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        We Gebruiken Cookies
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        We gebruiken cookies om onze website te verbeteren en te
                        analyseren hoe bezoekers onze site gebruiken. Met
                        "Accepteer Alles" stem je in met alle cookies, inclusief
                        analytics en marketing. Met "Alleen Noodzakelijk"
                        gebruiken we alleen cookies die essentieel zijn voor de
                        werking van de site.
                      </p>
                    </div>
                  </div>

                  {/* Cookie types info */}
                  <div className="ml-16 space-y-2 mb-4 md:mb-0">
                    <details className="group">
                      <summary className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer list-none flex items-center gap-2">
                        <svg
                          className="w-4 h-4 transition-transform group-open:rotate-90"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        Meer informatie over cookies
                      </summary>
                      <div className="mt-3 pl-6 text-xs text-gray-400 space-y-2">
                        <p>
                          <strong className="text-gray-300">
                            Noodzakelijke cookies:
                          </strong>{" "}
                          Essentieel voor de werking van de website (altijd
                          actief)
                        </p>
                        <p>
                          <strong className="text-gray-300">
                            Analytics cookies:
                          </strong>{" "}
                          Google Analytics voor het analyseren van
                          websitegebruik
                        </p>
                        <p>
                          <strong className="text-gray-300">
                            Marketing cookies:
                          </strong>{" "}
                          Mailchimp voor het bijhouden van
                          campagne-effectiviteit
                        </p>
                        <p className="pt-2">
                          Lees meer in onze{" "}
                          <Link
                            href="/privacy"
                            className="text-purple-400 hover:text-purple-300 underline"
                          >
                            privacyverklaring
                          </Link>{" "}
                          en{" "}
                          <Link
                            href="/cookies"
                            className="text-purple-400 hover:text-purple-300 underline"
                          >
                            cookie policy
                          </Link>
                          .
                        </p>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:flex-shrink-0">
                  <button
                    onClick={acceptAll}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-white text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 whitespace-nowrap"
                  >
                    Accepteer Alles
                  </button>
                  <button
                    onClick={acceptNecessary}
                    className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-lg hover:bg-zinc-700 hover:border-zinc-600 transition-all whitespace-nowrap"
                  >
                    Alleen Noodzakelijk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
