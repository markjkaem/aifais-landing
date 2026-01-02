// ========================================
// FILE: app/agv/page.tsx - LIGHT THEME
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
    <div className="bg-white min-h-screen py-14 px-6 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Algemene Voorwaarden
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
            Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten
            tussen <strong className="text-gray-900">Aifais</strong> (hierna:
            "wij" of "Aifais"), gevestigd aan Groningenweg 8, 2803 PV Gouda, en
            de opdrachtgever (hierna: "u" of "klant") betreffende n8n workflow
            automatisering diensten.
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
          </div>
        </section>

        {/* Table of Contents */}
        <nav className="mb-12 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Inhoudsopgave
          </h2>
          <ol className="space-y-2 text-[#3066be]">
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
        <div className="space-y-12 text-gray-700">
          {/* Artikel 1 - Toepasselijkheid */}
          <article id="toepasselijkheid" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 1 - Toepasselijkheid
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">1.1</strong> Deze algemene
                voorwaarden zijn van toepassing op alle aanbiedingen, offertes
                en overeenkomsten tussen Aifais en de klant.
              </p>
              <p>
                <strong className="text-gray-900">1.2</strong> Afwijkingen van
                deze voorwaarden zijn slechts geldig indien deze uitdrukkelijk
                schriftelijk zijn overeengekomen.
              </p>
              <p>
                <strong className="text-gray-900">1.3</strong> De
                toepasselijkheid van eventuele inkoop- of andere voorwaarden van
                de klant wordt uitdrukkelijk van de hand gewezen.
              </p>
              <p>
                <strong className="text-gray-900">1.4</strong> Indien een of
                meerdere bepalingen in deze algemene voorwaarden nietig zijn of
                vernietigd worden, blijven de overige bepalingen volledig van
                toepassing.
              </p>
            </div>
          </article>

          {/* Artikel 2 - Diensten */}
          <article id="diensten" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 2 - Diensten
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">2.1</strong> Aifais biedt
                diensten aan op het gebied van workflow automatisering,
                waaronder maar niet beperkt tot: n8n implementatie, AI
                integraties, advies en consultancy, training en onderhoud.
              </p>
              <p>
                <strong className="text-gray-900">2.2</strong> De specifieke
                inhoud en omvang van de diensten worden vastgelegd in een
                offerte of overeenkomst.
              </p>
              <p>
                <strong className="text-gray-900">2.3</strong> Aifais spant zich
                in om de diensten naar beste inzicht en vermogen uit te voeren
                conform de eisen van goed vakmanschap.
              </p>
              <p>
                <strong className="text-gray-900">2.4</strong> Alle diensten
                worden uitgevoerd op basis van een inspanningsverbintenis,
                tenzij uitdrukkelijk schriftelijk een resultaatverbintenis is
                overeengekomen.
              </p>
            </div>
          </article>

          {/* Artikel 3 - Offertes en Overeenkomsten */}
          <article id="offertes" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 3 - Offertes en Overeenkomsten
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">3.1</strong> Alle offertes
                zijn vrijblijvend en geldig gedurende 30 dagen, tenzij anders
                aangegeven.
              </p>
              <p>
                <strong className="text-gray-900">3.2</strong> Een overeenkomst
                komt tot stand op het moment dat de klant de offerte schriftelijk
                of per e-mail accepteert, of wanneer Aifais met de uitvoering
                van de werkzaamheden is begonnen.
              </p>
              <p>
                <strong className="text-gray-900">3.3</strong> Wijzigingen in de
                overeenkomst zijn slechts geldig indien deze schriftelijk zijn
                overeengekomen. Meerwerk wordt apart gefactureerd.
              </p>
              <p>
                <strong className="text-gray-900">3.4</strong> Aifais behoudt
                zich het recht voor om een opdracht te weigeren zonder opgave
                van redenen.
              </p>
            </div>
          </article>

          {/* Artikel 4 - Uitvoering Opdracht */}
          <article id="uitvoering" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 4 - Uitvoering Opdracht
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">4.1</strong> Aifais bepaalt de
                wijze waarop de opdracht wordt uitgevoerd, met inachtneming van
                de wensen van de klant voor zover redelijk.
              </p>
              <p>
                <strong className="text-gray-900">4.2</strong> De klant zorgt
                ervoor dat alle gegevens en toegangen die nodig zijn voor een
                goede uitvoering van de opdracht tijdig beschikbaar worden
                gesteld.
              </p>
              <p>
                <strong className="text-gray-900">4.3</strong> Indien de klant
                niet tijdig de benodigde informatie of toegang verstrekt,
                behoudt Aifais zich het recht voor de uitvoering op te schorten
                en eventuele extra kosten door te berekenen.
              </p>
              <p>
                <strong className="text-gray-900">4.4</strong> Genoemde
                (leverings)termijnen zijn indicatief en gelden niet als fatale
                termijnen, tenzij uitdrukkelijk anders overeengekomen.
              </p>
              <p>
                <strong className="text-gray-900">4.5</strong> Aifais mag derden
                inschakelen bij de uitvoering van de opdracht.
              </p>
            </div>
          </article>

          {/* Artikel 5 - Prijzen en Betaling */}
          <article id="prijzen" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 5 - Prijzen en Betaling
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">5.1</strong> Alle prijzen zijn
                in euro&apos;s en exclusief BTW, tenzij anders vermeld.
              </p>
              <p>
                <strong className="text-gray-900">5.2</strong> Facturering vindt
                plaats zoals overeengekomen in de offerte, bij gebreke waarvan
                maandelijks achteraf wordt gefactureerd.
              </p>
              <p>
                <strong className="text-gray-900">5.3</strong> Betaling dient te
                geschieden binnen 14 dagen na factuurdatum, tenzij anders
                overeengekomen.
              </p>
              <p>
                <strong className="text-gray-900">5.4</strong> Bij niet tijdige
                betaling is de klant van rechtswege in verzuim en is de
                wettelijke handelsrente verschuldigd. Alle gerechtelijke en
                buitengerechtelijke incassokosten komen voor rekening van de
                klant.
              </p>
              <p>
                <strong className="text-gray-900">5.5</strong> Aifais behoudt
                zich het recht voor de prijzen jaarlijks aan te passen. Bij
                lopende overeenkomsten wordt de klant hiervan minimaal 30 dagen
                van tevoren op de hoogte gesteld.
              </p>
            </div>
          </article>

          {/* Artikel 6 - Intellectueel Eigendom */}
          <article id="intellectueel" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 6 - Intellectueel Eigendom
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">6.1</strong> Alle
                intellectuele eigendomsrechten op door Aifais ontwikkelde
                materialen, workflows, code en documentatie blijven bij Aifais,
                tenzij schriftelijk anders overeengekomen.
              </p>
              <p>
                <strong className="text-gray-900">6.2</strong> Na volledige
                betaling verkrijgt de klant een niet-exclusief gebruiksrecht op
                de specifiek voor de klant ontwikkelde workflows en integraties.
              </p>
              <p>
                <strong className="text-gray-900">6.3</strong> Het is de klant
                niet toegestaan om zonder schriftelijke toestemming de
                geleverde materialen te kopiëren, wijzigen of aan derden ter
                beschikking te stellen, anders dan voor eigen bedrijfsvoering.
              </p>
              <p>
                <strong className="text-gray-900">6.4</strong> Aifais behoudt
                het recht om generieke componenten, methoden en kennis opgedaan
                tijdens de opdracht te hergebruiken voor andere klanten.
              </p>
            </div>
          </article>

          {/* Artikel 7 - Garantie en Support */}
          <article id="garantie" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 7 - Garantie en Support
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">7.1</strong> Aifais garandeert
                dat de geleverde diensten voldoen aan de overeengekomen
                specificaties gedurende een periode van 30 dagen na oplevering.
              </p>
              <p>
                <strong className="text-gray-900">7.2</strong> Gebreken die
                binnen de garantieperiode worden gemeld en aantoonbaar te wijten
                zijn aan Aifais, worden kosteloos hersteld.
              </p>
              <p>
                <strong className="text-gray-900">7.3</strong> De garantie
                vervalt indien de klant zonder overleg wijzigingen heeft
                aangebracht aan de geleverde workflows of systemen.
              </p>
              <p>
                <strong className="text-gray-900">7.4</strong> Support buiten de
                garantieperiode of voor issues die niet onder de garantie
                vallen, wordt gefactureerd tegen het overeengekomen uurtarief.
              </p>
              <p>
                <strong className="text-gray-900">7.5</strong> Aifais is niet
                verantwoordelijk voor storingen veroorzaakt door derden,
                waaronder n8n, API-providers of hosting partijen.
              </p>
            </div>
          </article>

          {/* Artikel 8 - Aansprakelijkheid */}
          <article id="aansprakelijkheid" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 8 - Aansprakelijkheid
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">8.1</strong> De
                aansprakelijkheid van Aifais is beperkt tot het bedrag dat in
                het betreffende geval door de aansprakelijkheidsverzekering
                wordt uitgekeerd, vermeerderd met het eigen risico.
              </p>
              <p>
                <strong className="text-gray-900">8.2</strong> Indien geen
                uitkering plaatsvindt, is de aansprakelijkheid beperkt tot
                maximaal het factuurbedrag van de betreffende opdracht, met een
                maximum van €10.000.
              </p>
              <p>
                <strong className="text-gray-900">8.3</strong> Aifais is nooit
                aansprakelijk voor indirecte schade, waaronder gederfde winst,
                gemiste besparingen, bedrijfsstagnatie of gevolgschade.
              </p>
              <p>
                <strong className="text-gray-900">8.4</strong> De klant
                vrijwaart Aifais voor aanspraken van derden die verband houden
                met de door Aifais geleverde diensten.
              </p>
              <p>
                <strong className="text-gray-900">8.5</strong> Aanspraken tot
                schadevergoeding vervallen indien deze niet binnen 12 maanden na
                ontdekking schriftelijk zijn gemeld.
              </p>
            </div>
          </article>

          {/* Artikel 9 - Geheimhouding */}
          <article id="geheimhouding" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 9 - Geheimhouding
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">9.1</strong> Beide partijen
                zijn verplicht tot geheimhouding van alle vertrouwelijke
                informatie die zij in het kader van de overeenkomst van elkaar
                hebben verkregen.
              </p>
              <p>
                <strong className="text-gray-900">9.2</strong> Informatie geldt
                als vertrouwelijk indien dit door de andere partij is
                medegedeeld of als dit voortvloeit uit de aard van de
                informatie.
              </p>
              <p>
                <strong className="text-gray-900">9.3</strong> De
                geheimhoudingsplicht geldt niet voor informatie die reeds
                openbaar was, onafhankelijk is verkregen, of op grond van
                wettelijke verplichting moet worden verstrekt.
              </p>
              <p>
                <strong className="text-gray-900">9.4</strong> De
                geheimhoudingsplicht blijft ook na beëindiging van de
                overeenkomst van kracht.
              </p>
            </div>
          </article>

          {/* Artikel 10 - Opzegging en Ontbinding */}
          <article id="opzegging" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 10 - Opzegging en Ontbinding
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">10.1</strong> Overeenkomsten
                voor bepaalde tijd kunnen niet tussentijds worden opgezegd,
                tenzij schriftelijk anders overeengekomen.
              </p>
              <p>
                <strong className="text-gray-900">10.2</strong> Overeenkomsten
                voor onbepaalde tijd kunnen door beide partijen schriftelijk
                worden opgezegd met inachtneming van een opzegtermijn van 1
                maand.
              </p>
              <p>
                <strong className="text-gray-900">10.3</strong> Aifais kan de
                overeenkomst met onmiddellijke ingang ontbinden indien de klant
                in verzuim is, surseance van betaling aanvraagt of failliet
                wordt verklaard.
              </p>
              <p>
                <strong className="text-gray-900">10.4</strong> Bij voortijdige
                beëindiging door de klant blijft de klant gehouden tot betaling
                van de reeds verrichte werkzaamheden.
              </p>
              <p>
                <strong className="text-gray-900">10.5</strong> Na beëindiging
                van de overeenkomst zal Aifais op verzoek alle aan de klant
                toebehorende materialen retourneren of vernietigen.
              </p>
            </div>
          </article>

          {/* Artikel 11 - Klachten */}
          <article id="klachten" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 11 - Klachten
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">11.1</strong> Klachten over de
                verrichte werkzaamheden dienen zo spoedig mogelijk, doch
                uiterlijk binnen 14 dagen na ontdekking, schriftelijk te worden
                gemeld aan Aifais.
              </p>
              <p>
                <strong className="text-gray-900">11.2</strong> De klacht dient
                een zo gedetailleerd mogelijke omschrijving van de tekortkoming
                te bevatten, zodat Aifais adequaat kan reageren.
              </p>
              <p>
                <strong className="text-gray-900">11.3</strong> Aifais zal
                binnen 14 dagen na ontvangst van de klacht reageren. Indien een
                langere verwerkingstijd nodig is, wordt de klant hiervan op de
                hoogte gesteld.
              </p>
              <p>
                <strong className="text-gray-900">11.4</strong> Het indienen van
                een klacht schort de betalingsverplichting van de klant niet op.
              </p>
            </div>
          </article>

          {/* Artikel 12 - Toepasselijk Recht */}
          <article id="toepasselijk-recht" className="scroll-mt-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Artikel 12 - Toepasselijk Recht
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <p>
                <strong className="text-gray-900">12.1</strong> Op alle
                overeenkomsten tussen Aifais en de klant is Nederlands recht van
                toepassing.
              </p>
              <p>
                <strong className="text-gray-900">12.2</strong> Geschillen
                worden bij uitsluiting voorgelegd aan de bevoegde rechter in het
                arrondissement waar Aifais is gevestigd, tenzij dwingend recht
                anders bepaalt.
              </p>
              <p>
                <strong className="text-gray-900">12.3</strong> Partijen zullen
                eerst een beroep op de rechter doen nadat zij zich tot het
                uiterste hebben ingespannen een geschil in onderling overleg te
                beslechten.
              </p>
              <p>
                <strong className="text-gray-900">12.4</strong> Indien enige
                bepaling van deze algemene voorwaarden nietig wordt verklaard,
                tast dit de geldigheid van de overige bepalingen niet aan.
                Partijen zullen in dat geval in overleg treden om een
                vervangende bepaling overeen te komen.
              </p>
            </div>
          </article>
        </div>

        {/* Contact Section */}
        <section className="mt-16 bg-[#3066be]/5 border border-[#3066be]/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">
            Vragen Over Deze Voorwaarden?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Neem gerust contact op voor toelichting of vragen over onze algemene
            voorwaarden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@aifais.com"
              className="px-8 py-4 bg-[#3066be] text-white font-bold rounded-xl hover:bg-[#234a8c] transition-transform text-center shadow-lg"
            >
              📧 Email Ons
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
            <Link href="/privacy" className="text-[#3066be] hover:underline">
              Privacyverklaring
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
