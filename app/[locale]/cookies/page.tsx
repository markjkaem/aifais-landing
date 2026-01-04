// ========================================
// FILE: app/[locale]/cookies/page.tsx - LIGHT THEME
// ========================================

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookiebeleid | Aifais",
  description: "Lees hoe Aifais cookies gebruikt om jouw ervaring op onze website te verbeteren.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const lastUpdated = isEn ? "January 4, 2026" : "4 januari 2026";

  return (
    <div className="bg-white min-h-screen py-14 px-6 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {isEn ? "Cookie Policy" : "Cookiebeleid"}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <p>{isEn ? "Last updated" : "Laatste update"}: {lastUpdated}</p>
          </div>
        </header>

        {/* Intro */}
        <section className="mb-12 bg-white border border-gray-200 rounded-xl p-6 shadow-sm leading-relaxed text-gray-700">
          <p className="mb-4">
            {isEn 
              ? "Aifais uses cookies to improve your user experience and to monitor website traffic. This policy explains what cookies are, how we use them, and how you can manage them."
              : "Aifais maakt gebruik van cookies om jouw gebruikerservaring te verbeteren en het websiteverkeer te monitoren. In dit beleid leggen we uit wat cookies zijn, hoe we ze gebruiken en hoe je ze kunt beheren."}
          </p>
        </section>

        {/* Content Sections */}
        <div className="space-y-12 text-gray-700">
          <article className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              1. {isEn ? "What are Cookies?" : "Wat zijn cookies?"}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p>
                {isEn
                  ? "Cookies are small text files that are stored on your computer or mobile device when you visit a website. They help us recognize your device and store certain information about your preferences or past actions."
                  : "Cookies zijn kleine tekstbestanden die op je computer of mobiele apparaat worden opgeslagen wanneer je een website bezoekt. Ze helpen ons om je apparaat te herkennen en bepaalde informatie over je voorkeuren of eerdere acties te onthouden."}
              </p>
            </div>
          </article>

          <article className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              2. {isEn ? "Which Cookies do we Use?" : "Welke cookies gebruiken wij?"}
            </h2>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm shadow-indigo-50/50">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {isEn ? "Functional Cookies (Essential)" : "Functionele cookies (Noodzakelijk)"}
                </h3>
                <p className="text-gray-600 mb-3">
                  {isEn
                    ? "These cookies are necessary for the basic functions of our website, such as security, network management, and accessibility. They cannot be turned off."
                    : "Deze cookies zijn noodzakelijk voor de basisfuncties van onze website, zoals beveiliging, netwerkbeheer en toegankelijkheid. Deze kunnen niet worden uitgeschakeld."}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm shadow-indigo-50/50">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {isEn ? "Analytical Cookies" : "Analytische cookies"}
                </h3>
                <p className="text-gray-600 mb-3">
                  {isEn
                    ? "We use analytical cookies to collect information about how visitors use our website. This helps us improve the performance and design of the site. All data is anonymized."
                    : "Wij gebruiken analytische cookies om informatie te verzamelen over hoe bezoekers onze website gebruiken. Dit helpt ons de prestaties en het ontwerp van de site te verbeteren. Alle gegevens worden geanonimiseerd."}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm shadow-indigo-50/50">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  {isEn ? "Marketing Cookies" : "Marketing cookies"}
                </h3>
                <p className="text-gray-600 mb-3">
                  {isEn
                    ? "These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user."
                    : "Deze cookies worden gebruikt om bezoekers te volgen wanneer ze verschillende websites bezoeken. Hun doel is om advertenties weer te geven die relevant en aantrekkelijk zijn voor de individuele gebruiker."}
                </p>
              </div>
            </div>
          </article>

          <article className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              3. {isEn ? "Managing Cookies" : "Cookies beheren"}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="mb-4">
                {isEn
                  ? "Most web browsers allow some control of most cookies through the browser settings. You can set your browser to refuse cookies, or to delete certain cookies."
                  : "De meeste webbrowsers bieden controle over cookies via de browserinstellingen. Je kunt je browser zo instellen dat deze cookies weigert of bepaalde cookies verwijdert."}
              </p>
              <p>
                {isEn
                  ? "Please note that if you choose to block cookies, the website may not function properly."
                  : "Houd er rekening mee dat als je ervoor kiest om cookies te blokkeren, de website mogelijk niet optimaal functioneert."}
              </p>
            </div>
          </article>
        </div>

        {/* Footer Navigation */}
        <nav className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 mb-4">{isEn ? "See also" : "Bekijk ook"}:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/${locale}/privacy`} className="text-[#3066be] hover:underline">
              {isEn ? "Privacy Policy" : "Privacybeleid"}
            </Link>
            <span className="text-gray-400">•</span>
            <Link href={`/${locale}/contact`} className="text-[#3066be] hover:underline">
              {isEn ? "Contact" : "Contact"}
            </Link>
            <span className="text-gray-400">•</span>
            <Link href={`/${locale}`} className="text-[#3066be] hover:underline">
              {isEn ? "Back to Home" : "Terug naar Home"}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
