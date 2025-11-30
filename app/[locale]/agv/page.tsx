// ========================================
// FILE: app/agv/page.tsx
// ========================================

import { Metadata } from "next";
import Link from "next/link";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Algemene Voorwaarden | n8n Workflow Automatisering | Aifais",
  description:
    "Algemene voorwaarden van Aifais voor n8n workflow automatisering diensten. Transparante afspraken over dienstverlening, betaling, en aansprakelijkheid.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://aifais.com/agv",
  },
};

export default function AGVPage() {
  const lastUpdated = "22 november 2024";
  const version = "1.0";

  return (
    <div className="bg-black text-white min-h-screen py-14 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Algemene Voorwaarden
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <p>Laatste update: {lastUpdated}</p>
            <span>•</span>
            <p>Versie: {version}</p>
          </div>
        </header>

        {/* Intro */}
        <section className="mb-12 bg-gray-900/40 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-300 leading-relaxed mb-4">
            Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten
            tussen <strong className="text-white">Aifais</strong> (hierna: "wij"
            of "Aifais"), gevestigd aan Groningenweg 8, 2803 PV Gouda, en de
            opdrachtgever (hierna: "u" of "klant") betreffende n8n workflow
            automatisering diensten.
          </p>
          <div className="space-y-2 text-sm text-gray-400 border-t border-gray-800 pt-4 mt-4">
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
            {/* <p>KvK: 27199999</p>
            <p>BTW: NL000099998B57</p> */}
          </div>
        </section>

        {/* Table of Contents */}
        <nav className="mb-12 bg-gray-900/40 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Inhoudsopgave</h2>
          <ol className="space-y-2 text-purple-400">
            <li>
              <a href="#toepasselijkheid" className="hover:underline">
                1. Toepasselijkheid
              </a>
            </li>
            <li>
              <a href="#diensten" className="hover:underline">
                2. Diensten
              </a>
            </li>
            <li>
              <a href="#offertes" className="hover:underline">
                3. Offertes en Overeenkomsten
              </a>
            </li>
            <li>
              <a href="#uitvoering" className="hover:underline">
                4. Uitvoering Opdracht
              </a>
            </li>
            <li>
              <a href="#prijzen" className="hover:underline">
                5. Prijzen en Betaling
              </a>
            </li>
            <li>
              <a href="#intellectueel" className="hover:underline">
                6. Intellectueel Eigendom
              </a>
            </li>
            <li>
              <a href="#garantie" className="hover:underline">
                7. Garantie en Support
              </a>
            </li>
            <li>
              <a href="#aansprakelijkheid" className="hover:underline">
                8. Aansprakelijkheid
              </a>
            </li>
            <li>
              <a href="#geheimhouding" className="hover:underline">
                9. Geheimhouding
              </a>
            </li>
            <li>
              <a href="#opzegging" className="hover:underline">
                10. Opzegging en Ontbinding
              </a>
            </li>
            <li>
              <a href="#klachten" className="hover:underline">
                11. Klachten
              </a>
            </li>
            <li>
              <a href="#toepasselijk-recht" className="hover:underline">
                12. Toepasselijk Recht
              </a>
            </li>
          </ol>
        </nav>

        {/* Articles */}
        <div className="space-y-12">
          {/* Article 1 */}
          <article id="toepasselijkheid" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 1 - Toepasselijkheid
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">1.1</strong> Deze algemene
                  voorwaarden zijn van toepassing op alle aanbiedingen, offertes
                  en overeenkomsten tussen Aifais en de klant.
                </p>
                <p className="mb-4">
                  <strong className="text-white">1.2</strong> Afwijkingen van
                  deze voorwaarden zijn alleen geldig indien uitdrukkelijk
                  schriftelijk overeengekomen.
                </p>
                <p>
                  <strong className="text-white">1.3</strong> De
                  toepasselijkheid van eventuele inkoop- of andere voorwaarden
                  van de klant wordt uitdrukkelijk van de hand gewezen.
                </p>
              </div>
            </div>
          </article>

          {/* Article 2 */}
          <article id="diensten" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 2 - Diensten
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">2.1</strong> Aifais levert
                  professionele diensten op het gebied van:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                  <li>n8n workflow automatisering</li>
                  <li>Bedrijfsproces automatisering</li>
                  <li>Data-integraties tussen systemen</li>
                  <li>AI-gestuurde automatiseringsoplossingen</li>
                  <li>Support en onderhoud van automatiseringen</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-white">2.2</strong> De exacte omvang
                  en specificaties van de dienstverlening worden per opdracht
                  vastgelegd in een offerte of projectplan.
                </p>
                <p>
                  <strong className="text-white">2.3</strong> Aifais behoudt
                  zich het recht voor om derden in te schakelen bij de
                  uitvoering van de opdracht.
                </p>
              </div>
            </div>
          </article>

          {/* Article 3 */}
          <article id="offertes" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 3 - Offertes en Overeenkomsten
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">3.1</strong> Alle offertes zijn
                  vrijblijvend en geldig gedurende 30 dagen, tenzij anders
                  vermeld.
                </p>
                <p className="mb-4">
                  <strong className="text-white">3.2</strong> Een overeenkomst
                  komt tot stand zodra de klant de offerte schriftelijk (per
                  email) heeft geaccepteerd of door betaling van een voorschot.
                </p>
                <p className="mb-4">
                  <strong className="text-white">3.3</strong> Prijzen in
                  offertes zijn gebaseerd op de informatie die de klant heeft
                  verstrekt. Bij onvolledige of onjuiste informatie kunnen
                  aanpassingen plaatsvinden.
                </p>
                <p>
                  <strong className="text-white">3.4</strong> Mondelinge
                  toezeggingen of afspraken zijn pas bindend na schriftelijke
                  bevestiging door Aifais.
                </p>
              </div>
            </div>
          </article>

          {/* Article 4 */}
          <article id="uitvoering" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 4 - Uitvoering Opdracht
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">4.1</strong> Aifais zal de
                  opdracht naar beste inzicht en vermogen uitvoeren volgens de
                  eisen van goed vakmanschap.
                </p>
                <p className="mb-4">
                  <strong className="text-white">4.2</strong> Opgegeven
                  termijnen zijn indicatief en kunnen niet worden beschouwd als
                  fatale termijnen, tenzij uitdrukkelijk anders overeengekomen.
                </p>
                <p className="mb-4">
                  <strong className="text-white">4.3</strong> De klant is
                  verplicht alle informatie, toegang tot systemen en medewerking
                  te verstrekken die nodig zijn voor de uitvoering van de
                  opdracht.
                </p>
                <p className="mb-4">
                  <strong className="text-white">4.4</strong> Vertragingen als
                  gevolg van onvoldoende medewerking van de klant kunnen leiden
                  tot aanpassing van planning en/of kosten.
                </p>
                <p>
                  <strong className="text-white">4.5</strong> Aifais heeft het
                  recht de uitvoering op te schorten indien de klant zijn
                  verplichtingen niet nakomt.
                </p>
              </div>
            </div>
          </article>

          {/* Article 5 */}
          <article id="prijzen" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 5 - Prijzen en Betaling
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">5.1</strong> Alle prijzen zijn
                  exclusief BTW en andere heffingen, tenzij anders vermeld.
                </p>
                <p className="mb-4">
                  <strong className="text-white">5.2</strong> Bij projecten
                  boven €5.000 kan een voorschot van 50% worden gevraagd voor
                  aanvang van de werkzaamheden.
                </p>
                <p className="mb-4">
                  <strong className="text-white">5.3</strong> Facturen dienen
                  binnen 14 dagen na factuurdatum te worden voldaan, tenzij
                  schriftelijk een andere betalingstermijn is overeengekomen.
                </p>
                <p className="mb-4">
                  <strong className="text-white">5.4</strong> Bij niet-tijdige
                  betaling is de klant van rechtswege in verzuim en is Aifais
                  gerechtigd wettelijke rente en incassokosten in rekening te
                  brengen.
                </p>
                <p className="mb-4">
                  <strong className="text-white">5.5</strong> De klant heeft
                  geen recht op verrekening van bedragen, tenzij uitdrukkelijk
                  schriftelijk overeengekomen.
                </p>
                <p>
                  <strong className="text-white">5.6</strong> Bij meerwerk
                  worden de extra kosten vooraf schriftelijk aan de klant
                  gecommuniceerd en gefactureerd na goedkeuring.
                </p>
              </div>
            </div>
          </article>

          {/* Article 6 */}
          <article id="intellectueel" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 6 - Intellectueel Eigendom
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">6.1</strong> Alle intellectuele
                  eigendomsrechten op de door Aifais ontwikkelde workflows,
                  code, documentatie en methodieken berusten bij Aifais.
                </p>
                <p className="mb-4">
                  <strong className="text-white">6.2</strong> De klant verkrijgt
                  na volledige betaling een niet-exclusief, niet-overdraagbaar
                  gebruiksrecht voor de geleverde automatiseringen binnen zijn
                  eigen organisatie.
                </p>
                <p className="mb-4">
                  <strong className="text-white">6.3</strong> Het is de klant
                  niet toegestaan de geleverde workflows te kopiëren, aan te
                  passen of door te verkopen aan derden zonder schriftelijke
                  toestemming van Aifais.
                </p>
                <p>
                  <strong className="text-white">6.4</strong> Aifais behoudt
                  zich het recht voor ontwikkelde methodes en kennis op te nemen
                  in haar algemene dienstverlening aan andere klanten.
                </p>
              </div>
            </div>
          </article>

          {/* Article 7 */}
          <article id="garantie" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 7 - Garantie en Support
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">7.1</strong> Aifais garandeert
                  dat de geleverde workflows functioneren conform specificaties
                  bij oplevering.
                </p>
                <p className="mb-4">
                  <strong className="text-white">7.2</strong> Fouten of gebreken
                  die binnen 30 dagen na oplevering worden gemeld, worden
                  kosteloos hersteld (garantieperiode).
                </p>
                <p className="mb-4">
                  <strong className="text-white">7.3</strong> De garantie
                  vervalt indien:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                  <li>
                    De klant zonder toestemming wijzigingen heeft aangebracht
                  </li>
                  <li>Fouten het gevolg zijn van onjuist gebruik</li>
                  <li>
                    Wijzigingen in externe systemen/APIs de workflow verstoren
                  </li>
                  <li>Facturen niet zijn voldaan</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-white">7.4</strong> Na de
                  garantieperiode kan support en onderhoud worden afgenomen via
                  een apart onderhoudscontract.
                </p>
                <p>
                  <strong className="text-white">7.5</strong> Support op
                  maat-werk wordt gefactureerd op basis van daadwerkelijk
                  bestede uren, tenzij anders overeengekomen.
                </p>
              </div>
            </div>
          </article>

          {/* Article 8 */}
          <article id="aansprakelijkheid" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 8 - Aansprakelijkheid
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">8.1</strong> Aifais is
                  uitsluitend aansprakelijk voor directe schade die het gevolg
                  is van opzet of grove nalatigheid.
                </p>
                <p className="mb-4">
                  <strong className="text-white">8.2</strong> De
                  aansprakelijkheid is beperkt tot het bedrag dat in het
                  betreffende geval wordt uitgekeerd onder de
                  beroepsaansprakelijkheidsverzekering, vermeerderd met het
                  eigen risico.
                </p>
                <p className="mb-4">
                  <strong className="text-white">8.3</strong> Indien geen
                  uitkering plaatsvindt, is de aansprakelijkheid beperkt tot
                  maximaal het gefactureerde bedrag voor de betreffende opdracht
                  (met een maximum van €10.000).
                </p>
                <p className="mb-4">
                  <strong className="text-white">8.4</strong> Aifais is niet
                  aansprakelijk voor:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                  <li>
                    Indirecte schade (gevolgschade, gederfde winst,
                    reputatieschade)
                  </li>
                  <li>Schade door verstoringen in externe systemen of APIs</li>
                  <li>Schade door onjuist gebruik van de workflows</li>
                  <li>Schade door handelen van derden</li>
                  <li>Dataverlies (klant is verantwoordelijk voor backups)</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-white">8.5</strong> De klant vrijwaart
                  Aifais voor aanspraken van derden met betrekking tot door
                  Aifais geleverde diensten.
                </p>
                <p>
                  <strong className="text-white">8.6</strong> Eventuele
                  aanspraken op schadevergoeding vervallen na 12 maanden na het
                  moment waarop de klant bekend was of redelijkerwijs bekend kon
                  zijn met de schade.
                </p>
              </div>
            </div>
          </article>

          {/* Article 9 */}
          <article id="geheimhouding" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 9 - Geheimhouding
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">9.1</strong> Beide partijen
                  zijn verplicht tot geheimhouding van alle vertrouwelijke
                  informatie die zij in het kader van de overeenkomst van elkaar
                  hebben verkregen.
                </p>
                <p className="mb-4">
                  <strong className="text-white">9.2</strong> Informatie geldt
                  als vertrouwelijk als dit door de andere partij is medegedeeld
                  of als dit voortvloeit uit de aard van de informatie.
                </p>
                <p className="mb-4">
                  <strong className="text-white">9.3</strong> Aifais zal geen
                  bedrijfsgevoelige gegevens of systeem-toegangen delen met
                  derden zonder expliciete toestemming.
                </p>
                <p>
                  <strong className="text-white">9.4</strong> De
                  geheimhoudingsplicht blijft van kracht na beëindiging van de
                  overeenkomst.
                </p>
              </div>
            </div>
          </article>

          {/* Article 10 */}
          <article id="opzegging" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 10 - Opzegging en Ontbinding
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">10.1</strong> Voor eenmalige
                  projecten geldt geen opzegtermijn. De overeenkomst eindigt na
                  oplevering en betaling.
                </p>
                <p className="mb-4">
                  <strong className="text-white">10.2</strong>{" "}
                  Onderhoudscontracten kunnen door beide partijen worden
                  opgezegd met inachtneming van een opzegtermijn van 1 maand.
                </p>
                <p className="mb-4">
                  <strong className="text-white">10.3</strong> Aifais heeft het
                  recht de overeenkomst met onmiddellijke ingang te ontbinden
                  indien:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                  <li>De klant in staat van faillissement wordt verklaard</li>
                  <li>De klant surseance van betaling aanvraagt</li>
                  <li>
                    De klant in gebreke blijft en na schriftelijke aanmaning
                    niet binnen 14 dagen alsnog voldoet
                  </li>
                </ul>
                <p>
                  <strong className="text-white">10.4</strong> Bij ontbinding
                  blijven alle reeds gefactureerde bedragen onverminderd
                  verschuldigd.
                </p>
              </div>
            </div>
          </article>

          {/* Article 11 */}
          <article id="klachten" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 11 - Klachten
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">11.1</strong> Klachten over de
                  uitvoering van de overeenkomst dienen binnen 7 dagen na
                  ontdekking schriftelijk te worden gemeld aan Aifais.
                </p>
                <p className="mb-4">
                  <strong className="text-white">11.2</strong> Aifais zal binnen
                  14 dagen na ontvangst van de klacht inhoudelijk reageren.
                </p>
                <p className="mb-4">
                  <strong className="text-white">11.3</strong> Een klacht schort
                  de betalingsverplichting van de klant niet op.
                </p>
                <p>
                  <strong className="text-white">11.4</strong> Indien een klacht
                  gegrond wordt bevonden, zal Aifais naar keuze de werkzaamheden
                  kosteloos verbeteren of een gedeeltelijke terugbetaling doen.
                </p>
              </div>
            </div>
          </article>

          {/* Article 12 */}
          <article id="toepasselijk-recht" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Artikel 12 - Toepasselijk Recht en Geschillen
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <p className="mb-4">
                  <strong className="text-white">12.1</strong> Op alle
                  overeenkomsten tussen Aifais en de klant is uitsluitend
                  Nederlands recht van toepassing.
                </p>
                <p className="mb-4">
                  <strong className="text-white">12.2</strong> Geschillen zullen
                  bij uitsluiting worden voorgelegd aan de bevoegde rechter in
                  het arrondissement Rotterdam.
                </p>
                <p>
                  <strong className="text-white">12.3</strong> Partijen zullen
                  eerst een beroep doen op de rechter nadat zij zich hebben
                  ingespannen een geschil in onderling overleg te beslechten.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Contact Section */}
        <section className="mt-16 bg-gradient-to-br from-purple-900/20 to-gray-900/40 border border-purple-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Vragen Over Deze Voorwaarden?
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Neem gerust contact op voor toelichting of vragen over onze algemene
            voorwaarden.
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

        {/* Footer Navigation */}
        <nav className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 mb-4">Bekijk ook:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/privacy" className="text-purple-400 hover:underline">
              Privacyverklaring
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
