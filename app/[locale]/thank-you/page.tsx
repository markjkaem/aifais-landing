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

  // ✅ BELANGRIJK: NOINDEX voor thank you pages (voorkomt duplicate content)
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

  const besparing =
    params.besparing && params.besparing !== "null"
      ? Number(params.besparing).toLocaleString()
      : null;

  const uren = params.uren || null;

  return (
    <>
      {/* ✅ SCHEMA.ORG - CONFIRMATION PAGE */}
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
          {/* ✅ IMPROVED: Icon with animation */}
          <div className="mx-auto w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center animate-pulse">
            <svg
              className="w-10 h-10 text-purple-400"
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

          {/* ✅ IMPROVED: H1 for SEO */}
          <header>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Bedankt voor je Aanvraag!
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              We hebben je gegevens ontvangen. Ons team neemt binnen{" "}
              <strong className="text-purple-400">1 werkdag</strong> contact met
              je op.
            </p>
          </header>

          {/* ✅ IMPROVED: Result Box with better formatting */}
          {besparing && uren && (
            <section
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 mt-6 space-y-4 shadow-2xl"
              aria-labelledby="result-heading"
            >
              <h2
                id="result-heading"
                className="text-2xl font-bold text-purple-400"
              >
                Jouw Automatiserings-Inzicht
              </h2>

              <p className="text-lg text-gray-300">
                Op basis van jouw invoer kan je team ongeveer:
              </p>

              <div className="bg-black/40 rounded-xl p-6 border border-purple-500/30">
                <p className="text-4xl md:text-5xl font-bold text-purple-300">
                  {uren} uur per week
                </p>
                <p className="text-sm text-gray-400 mt-2">Tijdsbesparing</p>
              </div>

              <p className="text-lg text-gray-300">
                Omgerekend is dat een potentiële jaarlijkse besparing van:
              </p>

              <div className="bg-black/40 rounded-xl p-6 border border-green-500/30">
                <p className="text-4xl md:text-5xl font-bold text-green-400">
                  €{besparing}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Jaarlijkse kostenbesparing
                </p>
              </div>

              {/* ✅ NEW: ROI Calculator */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">
                  Met een gemiddelde workflow investering van €2.500 - €5.000:
                </p>
                <p className="text-lg font-semibold text-purple-300">
                  ROI binnen 3-4 maanden
                </p>
              </div>
            </section>
          )}

          {/* ✅ NEW: What happens next */}
          <section className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 text-left space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">
              Wat Gebeurt Er Nu?
            </h2>

            <ol className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                  1
                </span>
                <div>
                  <p className="font-semibold">We analyseren je aanvraag</p>
                  <p className="text-sm text-gray-400">
                    Ons team bekijkt je specifieke situatie en
                    besparingspotentieel
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                  2
                </span>
                <div>
                  <p className="font-semibold">We nemen contact met je op</p>
                  <p className="text-sm text-gray-400">
                    Binnen 1 werkdag bellen we je om de mogelijkheden door te
                    nemen
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                  3
                </span>
                <div>
                  <p className="font-semibold">Gratis haalbaarheidscheck</p>
                  <p className="text-sm text-gray-400">
                    In een 30-min gesprek bespreken we concrete quick wins voor
                    jouw bedrijf
                  </p>
                </div>
              </li>
            </ol>
          </section>

          {/* ✅ NEW: Social Proof */}
          <aside className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
            <p className="text-sm text-gray-400 mb-3">Wat anderen zeggen:</p>
            <blockquote className="italic text-gray-300 border-l-4 border-purple-500 pl-4">
              "Binnen 2 weken hadden we onze eerste workflow live. Het bespaart
              ons nu structureel 15 uur per week."
              <footer className="text-sm text-gray-500 mt-2 not-italic">
                — CFO, E-commerce bedrijf (28 medewerkers)
              </footer>
            </blockquote>
          </aside>

          {/* ✅ IMPROVED: Footer with CTA */}
          <footer className="space-y-4 pt-6">
            <p className="text-gray-400 text-base">
              Mocht je in de tussentijd vragen hebben, neem gerust contact met
              ons op.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portfolio"
                className="px-6 py-3 border border-purple-500 text-purple-400 rounded-xl hover:bg-purple-500 hover:text-black transition font-semibold"
              >
                Bekijk Onze Cases
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:border-gray-500 hover:text-white transition"
              >
                Terug naar Home
              </Link>
            </div>

            {/* ✅ NEW: Email check reminder */}
            <p className="text-sm text-gray-500 mt-6">
              💡 Tip: Check je spam folder als je binnen 24 uur niets hoort
            </p>
          </footer>
        </article>
      </div>
    </>
  );
}

// ========================================
// OPTIONAL: ADD TRACKING SCRIPT
// ========================================

// Als je Google Analytics events wilt tracken, voeg dit toe:
// In app/thank-you/page.tsx, voeg deze script toe in de return:

/*
<script
  dangerouslySetInnerHTML={{
    __html: `
      // Google Analytics conversion event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-XXXXXXXXX/XXXXXX', // ✅ VUL IN MET JOUW GOOGLE ADS CONVERSION ID
          'value': ${besparing ? besparing.replace(/\./g, '') : '0'},
          'currency': 'EUR',
          'transaction_id': ''
        });
      }

      // Facebook Pixel conversion (als je die hebt)
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
          value: ${besparing ? besparing.replace(/\./g, '') : '0'},
          currency: 'EUR'
        });
      }
    `
  }}
/>
*/
