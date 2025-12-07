"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function ThankYouClient() {
  useEffect(() => {
    // Fire Google Ads conversion
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-17756832047/sfZjCJfeiMgbEK-Cj5NC",
        value: 0.0,
        currency: "EUR",
      });
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#fbfff1] text-gray-900 flex flex-col items-center justify-center p-6 md:p-10">
        <article className="max-w-2xl w-full text-center space-y-8">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-[#3066be]/10 flex items-center justify-center border border-[#3066be]/20 shadow-lg shadow-[#3066be]/10">
            <svg
              className="w-12 h-12 text-[#3066be]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>

          {/* Header */}
          <header>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3066be] to-purple-600">
                Je Quickscan is Ontvangen! 🎉
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
              Bedankt voor je vertrouwen. We gaan direct aan de slag met jouw
              aanvraag.
            </p>
          </header>

          {/* Email Check Box */}
          <section className="bg-white border border-gray-200 rounded-2xl p-8 space-y-4 shadow-xl shadow-[#3066be]/5">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Check Je Inbox 📧
            </h2>
            <p className="text-gray-600 text-lg">
              We hebben je een email gestuurd met:
            </p>

            <ul className="text-left max-w-md mx-auto space-y-3 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <li className="flex items-start gap-3">
                <span className="text-[#3066be] text-xl flex-shrink-0">✓</span>
                <span className="text-gray-700 font-medium">
                  Je persoonlijke besparingsinzicht
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#3066be] text-xl flex-shrink-0">✓</span>
                <span className="text-gray-700 font-medium">
                  Concrete automatiseringsmogelijkheden
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#3066be] text-xl flex-shrink-0">✓</span>
                <span className="text-gray-700 font-medium">
                  Wat de volgende stappen zijn
                </span>
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-100 mt-6">
              <p className="text-sm text-gray-500">
                💡 <strong>Tip:</strong> Check ook je spam folder als je de
                email niet ziet
              </p>
            </div>
          </section>

          {/* What Happens Next */}
          <section className="bg-white border border-gray-200 rounded-2xl p-8 text-left space-y-6 shadow-sm">
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Wat Gebeurt Er Nu?
            </h2>

            <ol className="space-y-6 list-none relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <li className="flex items-start gap-4 relative">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#3066be] flex items-center justify-center text-white font-bold border-4 border-white shadow-sm z-10">
                  1
                </span>
                <div className="pt-1">
                  <p className="font-bold text-gray-900 text-lg">
                    Check je email
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Je ontvangt direct een email met jouw persoonlijke quickscan
                    resultaat
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4 relative">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 font-bold border-2 border-gray-200 z-10">
                  2
                </span>
                <div className="pt-1">
                  <p className="font-bold text-gray-900 text-lg">
                    We analyseren je situatie
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Ons team bekijkt je specifieke automatiseringsmogelijkheden
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4 relative">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 font-bold border-2 border-gray-200 z-10">
                  3
                </span>
                <div className="pt-1">
                  <p className="font-bold text-gray-900 text-lg">
                    We bellen binnen{" "}
                    <span className="text-[#3066be]">1 werkdag</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    In een 15-30 min gesprek bespreken we concrete quick wins
                    voor jouw bedrijf
                  </p>
                </div>
              </li>
            </ol>
          </section>

          {/* Social Proof */}
          <aside className="bg-[#3066be]/5 border border-[#3066be]/10 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-4 text-center font-medium uppercase tracking-wide">
              Wat anderen zeggen:
            </p>
            <blockquote className="text-gray-700 border-l-4 border-[#3066be] pl-4 italic bg-white p-4 rounded-r-lg shadow-sm">
              <p className="mb-3">
                "Binnen 2 weken hadden we onze eerste workflow live. Het
                bespaart ons nu structureel 15 uur per week."
              </p>
              <footer className="text-sm text-gray-900 font-bold not-italic flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                  C
                </div>
                CFO, E-commerce bedrijf (28 medewerkers)
              </footer>
            </blockquote>
          </aside>

          {/* CTA Buttons */}
          <footer className="space-y-6 pt-6 border-t border-gray-200 w-full">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portfolio"
                className="px-8 py-4 bg-[#3066be] hover:bg-[#234a8c] text-white font-bold rounded-xl transition-all shadow-lg hover:-translate-y-1"
              >
                Bekijk Onze Cases
              </Link>
              <Link
                href="/"
                className="px-8 py-4 border border-gray-300 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Terug naar Home
              </Link>
            </div>

            {/* Contact Info */}
            <div className="pt-6">
              <p className="text-gray-500 text-sm mb-2">
                Directe vragen? We helpen je graag:
              </p>
              <a
                href="mailto:contact@aifais.com"
                className="text-[#3066be] hover:text-[#234a8c] transition font-semibold"
              >
                contact@aifais.com
              </a>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}
