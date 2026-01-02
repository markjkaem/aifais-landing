// ========================================
// FILE: app/privacy/page.tsx - LIGHT THEME
// ========================================

import { Metadata } from "next";
import Link from "next/link";

// SEO METADATA
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
  const lastUpdated = "2 januari 2025";
  const version = "1.0";

  return (
    <div className="bg-white min-h-screen py-14 px-6 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Privacyverklaring
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <p>Laatste update: {lastUpdated}</p>
            <span>•</span>
            <p>Versie: {version}</p>
          </div>
        </header>

        {/* Intro */}
        <section className="mb-12 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 leading-relaxed mb-4">
            Aifais, gevestigd aan Groningenweg 8, 2803 PV Gouda, is
            verantwoordelijk voor de verwerking van persoonsgegevens zoals
            weergegeven in deze privacyverklaring. Wij respecteren jouw privacy
            en handelen conform de Algemene Verordening Gegevensbescherming
            (AVG/GDPR).
          </p>
          <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4 mt-4">
            <p>
              <strong className="text-gray-900">Contactgegevens:</strong>
            </p>
            <p>Groningenweg 8, 2803 PV Gouda</p>
            <p>
              Email:{" "}
              <a
                href="mailto:contact@aifais.com"
                className="text-[#3066be] hover:underline"
              >
                contact@aifais.com
              </a>
            </p>
            <p>KVK: [KVK nummer]</p>
          </div>
        </section>

        {/* Table of Contents */}
        <nav className="mb-12 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Inhoudsopgave
          </h2>
          <ol className="space-y-2 text-[#3066be]">
            <li>
              <a href="#welke-gegevens" className="hover:underline">
                1. Welke persoonsgegevens verzamelen wij?
              </a>
            </li>
            <li>
              <a href="#doel" className="hover:underline">
                2. Met welk doel verwerken wij persoonsgegevens?
              </a>
            </li>
            <li>
              <a href="#grondslag" className="hover:underline">
                3. Op basis van welke grondslag?
              </a>
            </li>
            <li>
              <a href="#bewaartermijn" className="hover:underline">
                4. Hoe lang bewaren wij gegevens?
              </a>
            </li>
            <li>
              <a href="#delen" className="hover:underline">
                5. Delen wij gegevens met derden?
              </a>
            </li>
            <li>
              <a href="#cookies" className="hover:underline">
                6. Cookies en tracking
              </a>
            </li>
            <li>
              <a href="#rechten" className="hover:underline">
                7. Jouw rechten (AVG)
              </a>
            </li>
            <li>
              <a href="#beveiliging" className="hover:underline">
                8. Beveiliging van gegevens
              </a>
            </li>
            <li>
              <a href="#wijzigingen" className="hover:underline">
                9. Wijzigingen privacyverklaring
              </a>
            </li>
          </ol>
        </nav>

        {/* Content Sections */}
        <div className="space-y-12 text-gray-700">
          {/* Section 1 */}
          <article id="welke-gegevens" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              1. Welke Persoonsgegevens Verzamelen Wij?
            </h2>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Contactformulieren & Analyse Gesprekken
                </h3>
                <p className="text-gray-600 mb-3">
                  Wanneer je een formulier invult op onze website of contact met
                  ons opneemt, verzamelen wij:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Voor- en achternaam</li>
                  <li>E-mailadres</li>
                  <li>Telefoonnummer (indien verstrekt)</li>
                  <li>Bedrijfsnaam (indien van toepassing)</li>
                  <li>Inhoud van je bericht of vraag</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Automatisch verzamelde gegevens
                </h3>
                <p className="text-gray-600 mb-3">
                  Bij bezoek aan onze website kunnen wij automatisch de volgende
                  gegevens verzamelen:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>IP-adres (geanonimiseerd)</li>
                  <li>Browsertype en -versie</li>
                  <li>Besturingssysteem</li>
                  <li>Bezochte pagina's en klikgedrag</li>
                  <li>Datum en tijd van bezoek</li>
                  <li>Verwijzende website</li>
                </ul>
              </div>
            </div>
          </article>

          {/* Section 2 */}
          <article id="doel" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              2. Met Welk Doel Verwerken Wij Persoonsgegevens?
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="mb-4">
                Aifais verwerkt jouw persoonsgegevens voor de volgende doelen:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-3 ml-4">
                <li>
                  <strong className="text-gray-900">Communicatie:</strong>{" "}
                  Beantwoorden van vragen via contactformulier, e-mail of
                  telefoon
                </li>
                <li>
                  <strong className="text-gray-900">Dienstverlening:</strong>{" "}
                  Uitvoeren van onze n8n workflow automatisering diensten
                </li>
                <li>
                  <strong className="text-gray-900">Offertes:</strong> Opstellen
                  en verzenden van offertes en facturen
                </li>
                <li>
                  <strong className="text-gray-900">Nieuwsbrieven:</strong>{" "}
                  Verzenden van nieuwsbrieven (alleen met jouw expliciete
                  toestemming)
                </li>
                <li>
                  <strong className="text-gray-900">Website analyse:</strong>{" "}
                  Verbeteren van onze website en diensten op basis van
                  gebruiksstatistieken
                </li>
                <li>
                  <strong className="text-gray-900">
                    Wettelijke verplichtingen:
                  </strong>{" "}
                  Voldoen aan wettelijke verplichtingen zoals belastingaangifte
                </li>
              </ul>
            </div>
          </article>

          {/* Section 3 */}
          <article id="grondslag" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              3. Op Basis Van Welke Grondslag?
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="mb-4">
                Wij verwerken persoonsgegevens op basis van de volgende
                wettelijke grondslagen (conform AVG artikel 6):
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-3 ml-4">
                <li>
                  <strong className="text-gray-900">Toestemming:</strong> Voor
                  het verzenden van nieuwsbrieven en marketingcommunicatie
                </li>
                <li>
                  <strong className="text-gray-900">
                    Uitvoering overeenkomst:
                  </strong>{" "}
                  Voor het leveren van onze diensten na opdrachtverstrekking
                </li>
                <li>
                  <strong className="text-gray-900">
                    Wettelijke verplichting:
                  </strong>{" "}
                  Voor fiscale administratie en andere wettelijke verplichtingen
                </li>
                <li>
                  <strong className="text-gray-900">Gerechtvaardigd belang:</strong>{" "}
                  Voor website-analyse en verbetering van onze dienstverlening
                </li>
              </ul>
            </div>
          </article>

          {/* Section 4 */}
          <article id="bewaartermijn" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              4. Hoe Lang Bewaren Wij Gegevens?
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="mb-4">
                Wij bewaren persoonsgegevens niet langer dan strikt noodzakelijk
                is voor de doeleinden waarvoor ze zijn verzameld:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left mt-4">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold border-b border-gray-200">
                        Type gegevens
                      </th>
                      <th className="px-4 py-3 font-semibold border-b border-gray-200">
                        Bewaartermijn
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="px-4 py-3 border-b border-gray-100">
                        Contactformulier gegevens
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        1 jaar na laatste contact
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b border-gray-100">
                        Klantgegevens (overeenkomsten)
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        7 jaar na einde overeenkomst (wettelijke verplichting)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b border-gray-100">
                        Factuurgegevens
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        7 jaar (fiscale bewaarplicht)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b border-gray-100">
                        Nieuwsbrief abonnees
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        Tot intrekking toestemming
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Website analytics</td>
                      <td className="px-4 py-3">26 maanden (geanonimiseerd)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </article>

          {/* Section 5 */}
          <article id="delen" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              5. Delen Wij Gegevens Met Derden?
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="mb-4">
                Aifais deelt jouw persoonsgegevens alleen met derden als dit
                noodzakelijk is voor onze dienstverlening of als wij daartoe
                wettelijk verplicht zijn:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-3 ml-4">
                <li>
                  <strong className="text-gray-900">Hosting providers:</strong>{" "}
                  Voor het hosten van onze website (servers binnen de EU)
                </li>
                <li>
                  <strong className="text-gray-900">E-mail diensten:</strong>{" "}
                  Voor het verzenden van e-mails en nieuwsbrieven
                </li>
                <li>
                  <strong className="text-gray-900">Boekhouding:</strong> Voor
                  fiscale administratie
                </li>
                <li>
                  <strong className="text-gray-900">Analyse tools:</strong> Voor
                  website statistieken (privacy-vriendelijke alternatieven)
                </li>
              </ul>
              <div className="mt-6 p-4 bg-[#3066be]/5 border border-[#3066be]/20 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Let op:</strong> Wij sluiten
                  verwerkersovereenkomsten met alle partijen die namens ons
                  persoonsgegevens verwerken. Wij verkopen nooit
                  persoonsgegevens aan derden.
                </p>
              </div>
            </div>
          </article>

          {/* Section 6 */}
          <article id="cookies" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              6. Cookies en Tracking
            </h2>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Wat zijn cookies?
                </h3>
                <p className="text-gray-600 mb-4">
                  Cookies zijn kleine tekstbestanden die op je apparaat worden
                  opgeslagen wanneer je onze website bezoekt. Wij gebruiken
                  cookies om de website goed te laten functioneren en om
                  anonieme statistieken te verzamelen.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Welke cookies gebruiken wij?
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Functionele cookies (noodzakelijk)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Deze cookies zijn nodig voor het functioneren van de
                      website, zoals het onthouden van formuliergegevens en
                      taalvoorkeuren.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Analytische cookies
                    </h4>
                    <p className="text-sm text-gray-600">
                      Wij gebruiken privacy-vriendelijke analytics om te
                      begrijpen hoe bezoekers onze website gebruiken. IP-adressen
                      worden geanonimiseerd.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Cookies beheren
                </h3>
                <p className="text-gray-600">
                  Je kunt cookies beheren of uitschakelen via je
                  browserinstellingen. Let op: het uitschakelen van functionele
                  cookies kan de werking van de website beperken. De meeste
                  browsers bieden de mogelijkheid om cookies te weigeren of te
                  verwijderen via de instellingen.
                </p>
              </div>
            </div>
          </article>

          {/* Section 7 */}
          <article id="rechten" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              7. Jouw Rechten (AVG)
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="mb-4">
                Op grond van de AVG heb je de volgende rechten met betrekking
                tot je persoonsgegevens:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-3 ml-4">
                <li>
                  <strong className="text-gray-900">Recht op inzage:</strong>{" "}
                  Je kunt opvragen welke gegevens wij van je verwerken
                </li>
                <li>
                  <strong className="text-gray-900">Recht op rectificatie:</strong>{" "}
                  Je kunt onjuiste gegevens laten corrigeren
                </li>
                <li>
                  <strong className="text-gray-900">Recht op verwijdering:</strong>{" "}
                  Je kunt in bepaalde gevallen vragen om verwijdering van je
                  gegevens
                </li>
                <li>
                  <strong className="text-gray-900">
                    Recht op beperking van verwerking:
                  </strong>{" "}
                  Je kunt vragen om beperking van de verwerking
                </li>
                <li>
                  <strong className="text-gray-900">
                    Recht op gegevensoverdraagbaarheid:
                  </strong>{" "}
                  Je kunt je gegevens opvragen in een gestructureerd formaat
                </li>
                <li>
                  <strong className="text-gray-900">Recht van bezwaar:</strong>{" "}
                  Je kunt bezwaar maken tegen de verwerking van je gegevens
                </li>
                <li>
                  <strong className="text-gray-900">
                    Recht om toestemming in te trekken:
                  </strong>{" "}
                  Eerder gegeven toestemming kun je altijd intrekken
                </li>
              </ul>

              <div className="mt-6 p-4 bg-[#3066be]/5 border border-[#3066be]/20 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Een verzoek indienen?</strong>{" "}
                  Stuur een e-mail naar{" "}
                  <a
                    href="mailto:contact@aifais.com"
                    className="text-[#3066be] hover:underline"
                  >
                    contact@aifais.com
                  </a>{" "}
                  met je verzoek. Wij reageren binnen 30 dagen. Om er zeker van
                  te zijn dat het verzoek door jou is gedaan, kunnen wij je
                  vragen om een kopie van je identiteitsbewijs mee te sturen.
                </p>
              </div>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Klacht?</strong> Je hebt het
                  recht om een klacht in te dienen bij de Autoriteit
                  Persoonsgegevens:{" "}
                  <a
                    href="https://autoriteitpersoonsgegevens.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3066be] hover:underline"
                  >
                    autoriteitpersoonsgegevens.nl
                  </a>
                </p>
              </div>
            </div>
          </article>

          {/* Section 8 */}
          <article id="beveiliging" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              8. Beveiliging van Gegevens
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="mb-4">
                Wij nemen de bescherming van jouw gegevens serieus en nemen
                passende maatregelen om misbruik, verlies, onbevoegde toegang,
                ongewenste openbaarmaking en ongeoorloofde wijziging tegen te
                gaan:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>SSL/TLS-versleuteling op onze website (HTTPS)</li>
                <li>Beveiligde servers binnen de EU</li>
                <li>
                  Toegangsbeperking tot persoonsgegevens (need-to-know basis)
                </li>
                <li>Regelmatige software updates en beveiligingspatches</li>
                <li>Sterke wachtwoorden en waar mogelijk twee-factor authenticatie</li>
              </ul>
              <p className="mt-4 text-gray-600">
                Als je de indruk hebt dat jouw gegevens niet goed beveiligd zijn
                of er aanwijzingen zijn van misbruik, neem dan contact met ons
                op via{" "}
                <a
                  href="mailto:contact@aifais.com"
                  className="text-[#3066be] hover:underline"
                >
                  contact@aifais.com
                </a>
                .
              </p>
            </div>
          </article>

          {/* Section 9 */}
          <article id="wijzigingen" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              9. Wijzigingen Privacyverklaring
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-gray-600">
                Wij kunnen deze privacyverklaring van tijd tot tijd aanpassen.
                Wijzigingen worden op deze pagina gepubliceerd met een nieuwe
                "laatste update" datum. Wij raden je aan om deze
                privacyverklaring regelmatig te raadplegen, zodat je op de
                hoogte blijft van eventuele wijzigingen. Bij ingrijpende
                wijzigingen zullen wij je hierover actief informeren, indien
                mogelijk.
              </p>
            </div>
          </article>
        </div>

        {/* Contact Section */}
        <section className="mt-16 bg-[#3066be]/5 border border-[#3066be]/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">
            Vragen Over Je Privacy?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Heb je vragen over deze privacyverklaring of wil je gebruik maken
            van je rechten? Neem gerust contact met ons op.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@aifais.com"
              className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-[#234a8c] transition-transform text-center shadow-lg"
            >
              Email Ons
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-300 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition text-center"
            >
              Contactformulier
            </Link>
          </div>
        </section>

        {/* Footer Navigation */}
        <nav className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 mb-4">Bekijk ook:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/agv" className="text-[#3066be] hover:underline">
              Algemene Voorwaarden
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/contact" className="text-[#3066be] hover:underline">
              Contact
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/" className="text-[#3066be] hover:underline">
              Terug naar Home
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
