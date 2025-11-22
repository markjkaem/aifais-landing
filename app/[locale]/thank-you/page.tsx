// ========================================
// FILE: app/thank-you/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Bedankt voor je Aanvraag | Aifais Automatisering Quickscan",
  description:
    "We hebben je quickscan ontvangen en nemen binnen 1 werkdag contact op om jouw automatiseringsmogelijkheden te bespreken.",

  robots: {
    index: false,
    follow: true,
  },

  openGraph: {
    title: "Bedankt voor je Aanvraag | Aifais",
    description: "We nemen binnen 1 werkdag contact met je op.",
    url: "https://aifais.com/thank-you",
    type: "website",
  },
};

interface BedanktPageProps {
  searchParams: Promise<{
    besparing?: string;
    uren?: string;
  }>;
}

export default async function BedanktPage({ searchParams }: BedanktPageProps) {
  const params = await searchParams;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Bedankt voor je aanvraag",
            description:
              "Bevestigingspagina voor automatisering quickscan aanvraag",
            provider: {
              "@type": "Organization",
              name: "Aifais",
              "@id": "https://aifais.com/#organization",
            },
          }),
        }}
      />

      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 md:p-10">
        <article className="max-w-2xl w-full text-center space-y-8">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center border border-purple-500/30">
            <svg
              className="w-12 h-12 text-purple-400"
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
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Je Quickscan is Ontvangen! 🎉
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
              Bedankt voor je vertrouwen. We gaan direct aan de slag met jouw
              aanvraag.
            </p>
          </header>

          {/* Email Check Box */}
          <section className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 rounded-2xl p-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-purple-400"
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

            <h2 className="text-2xl font-bold text-white">Check Je Inbox 📧</h2>
            <p className="text-gray-300 text-lg">
              We hebben je een email gestuurd met:
            </p>

            <ul className="text-left max-w-md mx-auto space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-xl flex-shrink-0">✓</span>
                <span className="text-gray-300">
                  Je persoonlijke besparingsinzicht
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-xl flex-shrink-0">✓</span>
                <span className="text-gray-300">
                  Concrete automatiseringsmogelijkheden
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-xl flex-shrink-0">✓</span>
                <span className="text-gray-300">
                  Wat de volgende stappen zijn
                </span>
              </li>
            </ul>

            <div className="pt-4 border-t border-purple-500/20 mt-6">
              <p className="text-sm text-gray-400">
                💡 <strong>Tip:</strong> Check ook je spam folder als je de
                email niet ziet
              </p>
            </div>
          </section>

          {/* What Happens Next */}
          <section className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8 text-left space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">
              Wat Gebeurt Er Nu?
            </h2>

            <ol className="space-y-5 list-none">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white text-lg">
                    Check je email
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Je ontvangt direct een email met jouw persoonlijke quickscan
                    resultaat
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                  2
                </span>
                <div>
                  <p className="font-semibold text-white text-lg">
                    We analyseren je situatie
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Ons team bekijkt je specifieke automatiseringsmogelijkheden
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                  3
                </span>
                <div>
                  <p className="font-semibold text-white text-lg">
                    We bellen binnen{" "}
                    <span className="text-purple-400">1 werkdag</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    In een 15-30 min gesprek bespreken we concrete quick wins
                    voor jouw bedrijf
                  </p>
                </div>
              </li>
            </ol>
          </section>

          {/* Social Proof */}
          <aside className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 border border-gray-700 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-4 text-center">
              Wat anderen zeggen:
            </p>
            <blockquote className="text-gray-300 border-l-4 border-purple-500 pl-4">
              <p className="italic mb-3">
                "Binnen 2 weken hadden we onze eerste workflow live. Het
                bespaart ons nu structureel 15 uur per week."
              </p>
              <footer className="text-sm text-purple-400 font-semibold not-italic">
                — CFO, E-commerce bedrijf (28 medewerkers)
              </footer>
            </blockquote>
          </aside>

          {/* CTA Buttons */}
          <footer className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portfolio"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                Bekijk Onze Cases
              </Link>
              <Link
                href="/"
                className="px-8 py-4 border-2 border-purple-500/50 text-purple-400 rounded-xl hover:bg-purple-500/10 hover:border-purple-500 transition font-semibold"
              >
                Terug naar Home
              </Link>
            </div>

            {/* Contact Info */}
            <div className="pt-6 border-t border-gray-800">
              <p className="text-gray-400 text-sm mb-2">
                Directe vragen? We helpen je graag:
              </p>
              <a
                href="mailto:contact@aifais.com"
                className="text-purple-400 hover:text-purple-300 transition font-semibold"
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
