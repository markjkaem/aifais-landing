import { Metadata } from "next";
import InvoiceGenerator from "./InvoiceGenerator";
import AgentMarketplace from "@/app/Components/AgentMarketplace";

// 1. SUPERCHARGED METADATA
export const metadata: Metadata = {
  title: "Gratis Factuur Maken (2025) | PDF Zonder Account | AIFAIS",
  description:
    "Direct een professionele factuur maken en downloaden als PDF. 100% gratis, geen registratie nodig en voldoet aan alle eisen van de Belastingdienst. Ideaal voor ZZP en MKB.",
  keywords: [
    "factuur maken",
    "gratis factuur programma",
    "factuur voorbeeld zzp",
    "factuur zonder kvk",
    "online factureren",
    "pdf factuur generator",
    "factuur template 2025",
  ],
  openGraph: {
    title: "Gratis Factuur Maken | Binnen 30 seconden PDF",
    description: "Geen login nodig. Vul in en download direct je factuur.",
    type: "website",
    locale: "nl_NL",
    // images: ['/og-invoice.jpg'], // Voeg later een OG image toe voor social sharing
  },
};

// 2. STRUCTURED DATA (JSON-LD)
// Dit vertelt Google dat dit een gratis Software Tool is.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Aifais Factuur Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  description:
    "Een gratis online tool om direct PDF facturen te genereren zonder account.",
  featureList: "PDF export, BTW berekening, KvK validatie, Logo upload",
};

export default function FactuurMakerPage() {
  return (
    <div className="min-h-screen bg-white font-sans relative flex flex-col items-center justify-start overflow-x-hidden text-gray-900">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background (Clean) */}
      <div className="absolute inset-0 bg-slate-50 -z-10"></div>

      {/* System Notification - Cleaner */}
      <div className="w-full bg-slate-900 text-slate-300 text-xs py-2 px-4 flex justify-between items-center font-medium z-50 border-b border-slate-800">
        <div className="flex gap-4">
          <span className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             SYSTEM: ONLINE
          </span>
          <span className="opacity-70">X402 PROTOCOL: ACTIVE</span>
        </div>
        <div className="opacity-70 hidden sm:block">AIFAIS GENERATOR V1.2</div>
      </div>

      <div className="w-full max-w-7xl px-4 py-10 flex flex-col items-center">
        {/* Header */}
        <div className="relative z-10 max-w-2xl w-full text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3066be]/10 border border-[#3066be]/20 text-xs text-[#3066be] font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#3066be]"></span>
            Gratis Tool (Geen Account Nodig)
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Gratis Factuur{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-purple-600">
              Maken
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
            Maak in 30 seconden een professionele PDF factuur die voldoet aan
            alle eisen. Veilig, lokaal en snel.
          </p>
        </div>

        {/* 3. THE TOOL (Main Content) */}
        <div className="relative z-10 w-full flex justify-center mb-24">
          <InvoiceGenerator />
        </div>

        {/* 4. SEO CONTENT BLOCK (Crucial for Ranking) */}
        {/* Deze tekst staat onder de tool zodat de gebruiker niet hoeft te scrollen, maar Google het wel leest. */}
        <section className="max-w-4xl w-full mx-auto mb-24 prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 text-gray-600">
          <h2 className="text-3xl text-center mb-8">
            Hoe werkt deze online factuur maker?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-sm not-prose mb-12">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <span className="text-[#3066be] font-bold text-xl block mb-2">
                1. Vul in
              </span>
              Vul jouw bedrijfsgegevens, die van de klant en de producten of
              diensten in.
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <span className="text-[#3066be] font-bold text-xl block mb-2">
                2. Controleer
              </span>
              Zie direct een live preview van hoe jouw factuur eruit komt te
              zien.
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <span className="text-[#3066be] font-bold text-xl block mb-2">
                3. Download PDF
              </span>
              Klik op downloaden. Je factuur is direct klaar om te versturen.
            </div>
          </div>

          <h3>Wat moet er op een ZZP factuur staan in 2025?</h3>
          <p>
            Als ondernemer ben je verplicht bepaalde gegevens op je factuur te
            zetten. Deze gratis tool zorgt ervoor dat je velden niet vergeet,
            maar let zelf altijd op de volgende punten:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Jouw gegevens:</strong> Bedrijfsnaam, adres, KvK-nummer en
              BTW-nummer.
            </li>
            <li>
              <strong>Klantgegevens:</strong> Naam en adres van de afnemer.
            </li>
            <li>
              <strong>Factuurnummer:</strong> Een uniek, opeenvolgend nummer.
            </li>
            <li>
              <strong>Datum:</strong> De datum waarop de factuur is uitgereikt.
            </li>
            <li>
              <strong>Specificatie:</strong> Een duidelijke omschrijving van de
              dienst of het product.
            </li>
          </ul>

          <h3 className="mt-8">Is deze factuur generator echt gratis?</h3>
          <p>
            Ja, de Aifais factuur maker is 100% gratis te gebruiken. Wij slaan
            geen gegevens op; alles gebeurt lokaal in jouw browser (Local
            Storage). Dit betekent maximale privacy voor jou en je klanten.
          </p>

          <p className="italic text-sm mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <strong>Tip:</strong> Wil je dit proces niet elke keer handmatig
            doen? Bekijk hieronder hoe onze AI-Agents jouw administratie
            volledig kunnen automatiseren.
          </p>
        </section>

        {/* 5. AGENT MARKETPLACE (The Bridge) */}
        <AgentMarketplace />

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-100 text-center w-full">
          <p className="text-xs text-gray-400 mb-2">
            © {new Date().getFullYear()} Aifais. Alle rechten voorbehouden.
          </p>
          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            Disclaimer: Hoewel deze tool met zorg is samengesteld, ben je als
            ondernemer zelf eindverantwoordelijk voor de juistheid van je
            administratie en belastingaangifte.
          </p>
        </footer>
      </div>
    </div>
  );
}
