// ========================================
// FILE: app/privacy/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Privacybeleid | GDPR-Compliant | Aifais",
  description:
    "Privacyverklaring van Aifais. Lees hoe wij omgaan met jouw persoonsgegevens conform AVG/GDPR wetgeving.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://aifais.com/privacy",
  },
};

export default function PrivacyPage() {
  const lastUpdated = "22 november 2024";

  return (
    <div className="bg-black min-h-screen py-14 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacyverklaring
          </h1>
          <p className="text-gray-400 text-sm">Laatste update: {lastUpdated}</p>
        </header>

        {/* Intro */}
        <section className="mb-12 bg-gray-900/40 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-300 leading-relaxed mb-4">
            Aifais, gevestigd aan Groningenweg 8, 2803 PV Gouda, is
            verantwoordelijk voor de verwerking van persoonsgegevens zoals
            weergegeven in deze privacyverklaring.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <strong className="text-white">Contactgegevens:</strong>
            </p>
            <p>Groningenweg 8, 2803 PV Gouda</p>
            <p>
              Email:{" "}
              <a
                href="mailto:contact@aifais.com"
                className="text-purple-400 hover:underline"
              >
                contact@aifais.com
              </a>
            </p>
            <p>KvK: 27199999</p>
            <p>BTW: NL000099998B57</p>
          </div>
        </section>

        {/* Table of Contents */}
        <nav className="mb-12 bg-gray-900/40 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Inhoudsopgave</h2>
          <ol className="space-y-2 text-purple-400">
            <li>
              <a href="#welke-gegevens" className="hover:underline">
                1. Welke persoonsgegevens verzamelen wij?
              </a>
            </li>
            <li>
              <a href="#waarom" className="hover:underline">
                2. Waarom verzamelen wij deze gegevens?
              </a>
            </li>
            <li>
              <a href="#bewaring" className="hover:underline">
                3. Hoe lang bewaren wij gegevens?
              </a>
            </li>
            <li>
              <a href="#delen" className="hover:underline">
                4. Delen wij gegevens met derden?
              </a>
            </li>
            <li>
              <a href="#cookies" className="hover:underline">
                5. Cookies & tracking
              </a>
            </li>
            <li>
              <a href="#beveiliging" className="hover:underline">
                6. Beveiliging
              </a>
            </li>
            <li>
              <a href="#rechten" className="hover:underline">
                7. Jouw rechten (AVG)
              </a>
            </li>
            <li>
              <a href="#klachten" className="hover:underline">
                8. Klachten
              </a>
            </li>
            <li>
              <a href="#wijzigingen" className="hover:underline">
                9. Wijzigingen
              </a>
            </li>
          </ol>
        </nav>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Section 1 */}
          <section id="welke-gegevens">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              1. Welke Persoonsgegevens Verzamelen Wij?
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Contactformulieren & Quickscan
                </h3>
                <p className="text-gray-300 mb-3">
                  Wanneer je een formulier invult op onze website, verzamelen
                  wij:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Voor- en achternaam</li>
                  <li>E-mailadres</li>
                  <li>Telefoonnummer (optioneel)</li>
                  <li>Bedrijfsnaam (indien opgegeven)</li>
                  <li>Bericht/vraag</li>
                  <li>IP-adres (automatisch)</li>
                </ul>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Analytische Gegevens
                </h3>
                <p className="text-gray-300 mb-3">
                  Via Google Analytics 4 verzamelen wij geanonimiseerde data
                  over websitebezoek:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Pagina's die je bezoekt</li>
                  <li>Tijd doorgebracht op de website</li>
                  <li>Verwijzende website (hoe je ons vond)</li>
                  <li>Apparaattype (desktop/mobiel)</li>
                  <li>Locatie (alleen stad/regio niveau)</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">
                  Wij lossen klachten graag intern op binnen 14 dagen.
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">
                  🏛️ Stap 2: Autoriteit Persoonsgegevens
                </h3>
                <p className="text-gray-300 mb-3">
                  Ben je niet tevreden met onze reactie? Dan kun je een klacht
                  indienen bij:
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4 text-sm">
                  <p className="text-white font-semibold mb-2">
                    Autoriteit Persoonsgegevens
                  </p>
                  <p className="text-gray-300">Postbus 93374</p>
                  <p className="text-gray-300">2509 AJ Den Haag</p>
                  <p className="text-gray-300 mt-2">
                    Website:{" "}
                    <a
                      href="https://autoriteitpersoonsgegevens.nl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      autoriteitpersoonsgegevens.nl
                    </a>
                  </p>
                  <p className="text-gray-300">
                    Telefoon:{" "}
                    <a
                      href="tel:+31703888500"
                      className="text-purple-400 hover:underline"
                    >
                      (+31) 070 - 888 85 00
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="waarom">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              2. Waarom Verzamelen Wij Deze Gegevens?
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-400">✓</span> Contact & Offertes
                </h3>
                <p className="text-gray-300">
                  Om jouw aanvraag te verwerken, contact met je op te nemen, en
                  offertes op te stellen voor workflow automatisering diensten.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Rechtsgrond:</strong> Uitvoering overeenkomst (AVG
                  Art. 6 lid 1 sub b)
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-400">✓</span> Dienstverlening
                </h3>
                <p className="text-gray-300">
                  Om onze diensten (n8n workflow automatisering) uit te voeren
                  en projecten te kunnen realiseren.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Rechtsgrond:</strong> Uitvoering overeenkomst (AVG
                  Art. 6 lid 1 sub b)
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-400">✓</span> Website
                  Optimalisatie
                </h3>
                <p className="text-gray-300">
                  Om onze website te verbeteren, gebruikservaring te
                  optimaliseren en technische problemen op te lossen.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Rechtsgrond:</strong> Gerechtvaardigd belang (AVG Art.
                  6 lid 1 sub f)
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-400">✓</span> Marketing (Opt-in)
                </h3>
                <p className="text-gray-300">
                  Alleen als je daar expliciet toestemming voor hebt gegeven,
                  gebruiken we je gegevens voor nieuwsbrieven of
                  productinformatie.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Rechtsgrond:</strong> Toestemming (AVG Art. 6 lid 1
                  sub a)
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="bewaring">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              3. Hoe Lang Bewaren Wij Gegevens?
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="text-left p-4 border-b border-gray-800">
                      Type Gegevens
                    </th>
                    <th className="text-left p-4 border-b border-gray-800">
                      Bewaartermijn
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr>
                    <td className="p-4 border-b border-gray-800">
                      Contactformulier aanvragen
                    </td>
                    <td className="p-4 border-b border-gray-800">
                      2 jaar na laatste contact
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-800">
                      Klantgegevens (actieve projecten)
                    </td>
                    <td className="p-4 border-b border-gray-800">
                      7 jaar na einde project (fiscaal)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-800">
                      Email correspondentie
                    </td>
                    <td className="p-4 border-b border-gray-800">
                      2 jaar na laatste email
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-800">
                      Analytics data (GA4)
                    </td>
                    <td className="p-4 border-b border-gray-800">
                      14 maanden (Google standaard)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">Marketing toestemming</td>
                    <td className="p-4">Tot intrekking toestemming</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              ℹ️ Na afloop van deze termijnen worden gegevens automatisch
              verwijderd, tenzij wettelijk verplicht om langer te bewaren (bijv.
              belastingwetgeving: 7 jaar).
            </p>
          </section>

          {/* Section 4 */}
          <section id="delen">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              4. Delen Wij Gegevens Met Derden?
            </h2>

            <p className="text-gray-300 mb-6">
              Aifais verkoopt <strong className="text-white">NOOIT</strong> je
              gegevens aan derden. We delen alleen gegevens met de volgende
              partijen voor functionele doeleinden:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Google (Analytics & Tag Manager)
                </h3>
                <p className="text-gray-300 mb-2">
                  <strong>Doel:</strong> Website analytics en conversie tracking
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Data:</strong> Geanonimiseerde gebruikersdata
                </p>
                <p className="text-gray-300">
                  <strong>Locatie:</strong> EU servers (Google Cloud Platform
                  Europa)
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  🔒 Google heeft een verwerkersovereenkomst met ons conform AVG
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Hosting Provider (Vercel)
                </h3>
                <p className="text-gray-300 mb-2">
                  <strong>Doel:</strong> Website hosting en beschikbaarheid
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Data:</strong> Website bezoekersdata (IP, pagina
                  requests)
                </p>
                <p className="text-gray-300">
                  <strong>Locatie:</strong> EU servers
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Email Service (bij gebruik nieuwsbrief)
                </h3>
                <p className="text-gray-300 mb-2">
                  <strong>Doel:</strong> Verzenden nieuwsbrieven (alleen bij
                  toestemming)
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Data:</strong> Naam, emailadres
                </p>
                <p className="text-gray-300">
                  <strong>Locatie:</strong> EU servers
                </p>
              </div>
            </div>

            <div className="mt-6 bg-yellow-900/20 border border-yellow-700 rounded-xl p-6">
              <p className="text-yellow-300 font-semibold mb-2">
                ⚠️ Juridische Verplichting
              </p>
              <p className="text-gray-300 text-sm">
                We kunnen verplicht worden gegevens te delen met autoriteiten
                indien dit wettelijk verplicht is (bijv. gerechtelijk bevel,
                fiscale controle).
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="cookies">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              5. Cookies & Tracking
            </h2>

            <p className="text-gray-300 mb-6">
              Onze website gebruikt cookies en vergelijkbare technologieën.
              Hieronder een overzicht:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-400">🍪</span> Functionele Cookies
                  (Noodzakelijk)
                </h3>
                <p className="text-gray-300 mb-3">
                  Deze cookies zijn noodzakelijk voor de werking van de website.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 text-sm">
                  <li>Sessie cookies (verlopen na sluiten browser)</li>
                  <li>Taalvoorkeur opslag</li>
                  <li>Cookie consent keuze</li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">
                  ✓ Geen toestemming vereist (technisch noodzakelijk)
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-blue-400">📊</span> Analytische Cookies
                  (Google Analytics 4)
                </h3>
                <p className="text-gray-300 mb-3">
                  Voor website statistieken en optimalisatie.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 text-sm">
                  <li>
                    <code className="bg-gray-800 px-2 py-1 rounded">_ga</code> -
                    Onderscheidt gebruikers (2 jaar)
                  </li>
                  <li>
                    <code className="bg-gray-800 px-2 py-1 rounded">_ga_*</code>{" "}
                    - Sessie tracking (2 jaar)
                  </li>
                  <li>IP-anonimisering is actief</li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">
                  ⚙️ Je kunt dit weigeren via cookie instellingen
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-purple-400">🎯</span> Marketing Cookies
                  (optioneel)
                </h3>
                <p className="text-gray-300 mb-3">
                  Alleen actief als je advertenties via Google/Meta bekijkt.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 text-sm">
                  <li>Google Ads conversie tracking</li>
                  <li>Remarketing pixels</li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">
                  ⚙️ Alleen met expliciete toestemming
                </p>
              </div>
            </div>

            <div className="mt-6 bg-gray-900/40 border border-purple-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Cookies Beheren</h3>
              <p className="text-gray-300 mb-4">
                Je kunt cookies altijd beheren via je browserinstellingen:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 text-sm">
                <li>
                  <strong>Chrome:</strong> Settings → Privacy → Cookies
                </li>
                <li>
                  <strong>Firefox:</strong> Options → Privacy & Security
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Privacy
                </li>
                <li>
                  <strong>Edge:</strong> Settings → Cookies and site permissions
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section id="beveiliging">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              6. Beveiliging
            </h2>

            <p className="text-gray-300 mb-6">
              Wij nemen de bescherming van jouw gegevens serieus en hebben
              passende technische en organisatorische maatregelen getroffen:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-400">🔒</span> SSL Encryptie
                </h3>
                <p className="text-gray-300 text-sm">
                  Alle data wordt via HTTPS versleuteld verzonden
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-blue-400">🛡️</span> Firewall Beveiliging
                </h3>
                <p className="text-gray-300 text-sm">
                  Servers zijn beveiligd met moderne firewalls
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-purple-400">🔐</span> Toegangscontrole
                </h3>
                <p className="text-gray-300 text-sm">
                  Alleen geautoriseerd personeel heeft toegang tot gegevens
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-yellow-400">💾</span> Reguliere Backups
                </h3>
                <p className="text-gray-300 text-sm">
                  Dagelijkse backups met encryptie
                </p>
              </div>
            </div>

            <div className="mt-6 bg-red-900/20 border border-red-700 rounded-xl p-6">
              <p className="text-red-300 font-semibold mb-2">
                🚨 Datalek Meldplicht
              </p>
              <p className="text-gray-300 text-sm">
                In het onwaarschijnlijke geval van een datalek, melden wij dit
                binnen 72 uur bij de Autoriteit Persoonsgegevens en informeren
                we getroffen personen conform AVG wetgeving.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="rechten">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              7. Jouw Rechten (AVG)
            </h2>

            <p className="text-gray-300 mb-6">
              Onder de Algemene Verordening Gegevensbescherming (AVG) heb je de
              volgende rechten:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-400">
                  📋 Recht op Inzage
                </h3>
                <p className="text-gray-300 text-sm">
                  Je hebt recht op inzage in welke persoonsgegevens wij van je
                  verwerken.
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-400">
                  ✏️ Recht op Rectificatie
                </h3>
                <p className="text-gray-300 text-sm">
                  Je kunt onjuiste of onvolledige gegevens laten corrigeren.
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-400">
                  🗑️ Recht op Verwijdering ("Recht op Vergetelheid")
                </h3>
                <p className="text-gray-300 text-sm">
                  Je kunt verzoeken om verwijdering van je gegevens, tenzij wij
                  wettelijk verplicht zijn deze te bewaren (bijv. fiscale
                  administratie).
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-400">
                  ⛔ Recht op Beperking
                </h3>
                <p className="text-gray-300 text-sm">
                  Je kunt vragen om beperking van de verwerking van je gegevens.
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-400">
                  🚫 Recht van Bezwaar
                </h3>
                <p className="text-gray-300 text-sm">
                  Je kunt bezwaar maken tegen verwerking van je gegevens voor
                  direct marketing doeleinden.
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-400">
                  📤 Recht op Dataportabiliteit
                </h3>
                <p className="text-gray-300 text-sm">
                  Je kunt vragen om een kopie van je gegevens in een
                  gestructureerd, machineleesbaar formaat (bijv. CSV, JSON).
                </p>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-400">
                  ❌ Recht op Intrekking Toestemming
                </h3>
                <p className="text-gray-300 text-sm">
                  Als verwerking gebaseerd is op toestemming, kun je deze altijd
                  intrekken (bijv. nieuwsbrief uitschrijven).
                </p>
              </div>
            </div>

            <div className="mt-6 bg-purple-900/20 border border-purple-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">
                Hoe Een Verzoek Indienen?
              </h3>
              <p className="text-gray-300 mb-4">
                Stuur een email naar{" "}
                <a
                  href="mailto:contact@aifais.com"
                  className="text-purple-400 hover:underline font-semibold"
                >
                  contact@aifais.com
                </a>{" "}
                met:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 text-sm">
                <li>Je volledige naam</li>
                <li>Het recht dat je wilt uitoefenen</li>
                <li>Eventueel een kopie ID (voor verificatie)</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                ⏱️ We reageren binnen 30 dagen op jouw verzoek.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="klachten">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              8. Klachten
            </h2>

            <p className="text-gray-300 mb-6">
              Als je niet tevreden bent met hoe wij met je gegevens omgaan, hoor
              we dat graag:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">
                  📧 Stap 1: Contact Met Ons
                </h3>
                <p className="text-gray-300 mb-2">
                  Email ons op:{" "}
                  <a
                    href="mailto:contact@aifais.com"
                    className="text-purple-400 hover:underline"
                  >
                    contact@aifais.com
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  We streven ernaar om binnen 14 dagen te reageren.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="wijzigingen">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              9. Wijzigingen in Deze Privacyverklaring
            </h2>

            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                Wij kunnen deze privacyverklaring van tijd tot tijd aanpassen.
                Wijzigingen worden gepubliceerd op deze pagina.
              </p>
              <p className="text-gray-300 mb-4">
                <strong className="text-white">Laatste update:</strong>{" "}
                {lastUpdated}
              </p>
              <p className="text-sm text-gray-500">
                💡 Tip: Bookmark deze pagina en check regelmatig voor updates.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-12 bg-gradient-to-br from-purple-900/20 to-gray-900/40 border border-purple-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Vragen Over Deze Privacyverklaring?
            </h2>
            <p className="text-gray-300 text-center mb-6">
              We helpen je graag verder met eventuele vragen over privacy en
              gegevensbescherming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@aifais.com"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-400 text-black font-bold rounded-xl hover:scale-105 transition-transform text-center"
              >
                📧 Email Ons
              </a>
              <Link
                href="/contact"
                className="px-8 py-4 border border-purple-500 text-purple-400 font-semibold rounded-xl hover:bg-purple-500 hover:text-black transition text-center"
              >
                Contactformulier
              </Link>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <nav className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 mb-4">Bekijk ook:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/agv" className="text-purple-400 hover:underline">
              Algemene Voorwaarden
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/contact" className="text-purple-400 hover:underline">
              Contact
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/" className="text-purple-400 hover:underline">
              Terug naar Home
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
