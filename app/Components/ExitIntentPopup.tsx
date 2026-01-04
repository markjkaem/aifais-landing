"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function ExitIntentPopup() {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const locale = useLocale();

  // Check if current page should show popup
  const excludedPaths = ["/", "/quickscan", "/contact", "/thank-you"];
  const shouldShowPopup = !excludedPaths.some((path) =>
    pathname.includes(path)
  );

  useEffect(() => {
    // Don't set up listener if we're on excluded page
    if (!shouldShowPopup) {
      return;
    }

    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem("exit-popup-shown");
    if (popupShown) {
      setHasShown(true);
      return;
    }

    // Detect exit intent (mouse leaving viewport at top)
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top and hasn't been shown yet
      if (e.clientY <= 0 && !hasShown && !showPopup) {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem("exit-popup-shown", "true");
      }
    };

    // Add event listener
    document.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown, showPopup, shouldShowPopup]);

  const closePopup = () => {
    setShowPopup(false);
  };

  // Return null AFTER all hooks are called
  if (!shouldShowPopup || !showPopup) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={closePopup}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-gray-500/50 rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl pointer-events-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors group"
            aria-label="Sluit popup"
          >
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gray-600/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-600 via-gray-400 to-amber-400 rounded-t-3xl" />

          {/* Content */}
          <div className="relative text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-600/20 to-amber-600/20 rounded-2xl flex items-center justify-center">
                <span className="text-5xl">⚡</span>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-gray-300 to-amber-400 bg-clip-text text-transparent">
                Wacht! Niet Zo Snel...
              </span>
            </h2>

            {/* Subheading */}
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Voordat je gaat: ontdek in{" "}
              <span className="text-white font-semibold">2 minuten</span>{" "}
              hoeveel tijd en geld je kunt besparen met automatisering.
            </p>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-sm text-gray-300">
                  Gratis analyse van jouw processen
                </p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
                <div className="text-3xl mb-2">⚡</div>
                <p className="text-sm text-gray-300">
                  Direct concrete quick wins
                </p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
                <div className="text-3xl mb-2">💰</div>
                <p className="text-sm text-gray-300">
                  ROI berekening binnen 24u
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link
                href={`/${locale}/contact`}
                onClick={closePopup}
                className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-300 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-gray-500/30"
              >
                <span>Start Gratis Analyse Gesprek</span>
                <svg
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <button
                onClick={closePopup}
                className="px-6 py-4 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-xl hover:bg-zinc-700 hover:border-zinc-600 transition-all"
              >
                Nee bedankt, ik blijf handmatig werken
              </button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-3 text-gray-400 text-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-zinc-900" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 border-2 border-zinc-900" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-zinc-900" />
              </div>
              <span>50+ bedrijven gingen je voor</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
