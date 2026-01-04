import { Metadata } from "next";
import ScannerClient from "./ScannerClient";
import { CheckCircle2, ShieldCheck, Zap, FileJson, ArrowRight, Download } from "lucide-react";

// --- 1. DEFINITIONS ---
const BASE_URL = "https://aifais.com";

// --- 2. SEO METADATA ---
export const metadata: Metadata = {
  title: "AI Factuur Scanner | PDF naar Excel & CSV | AIFAIS",
  description:
    "Scan facturen en bonnetjes direct naar Excel, CSV of JSON met AI. Automatische herkenning van KvK, BTW en regels. Werkt met Exact, Moneybird en meer.",
  keywords: [
    "factuur scannen",
    "pdf naar excel",
    "ocr software",
    "boekhouding automatiseren",
    "bonnetjes scannen",
    "aifais scanner",
    "ubl conversie"
  ],
  openGraph: {
    title: "AI Factuur Scanner | Direct van PDF naar Excel",
    description:
      "Stop met overtypen. Sleep je factuur hierheen en krijg direct de data in Excel formaat.",
    url: `${BASE_URL}/tools/invoice-extraction`,
    siteName: "AIFAIS Tools",
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/tools/invoice-extraction`,
  },
};

// --- 3. SCHEMA (SoftwareApplication + FAQ) ---
const ToolSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "AIFAIS Factuur Scanner",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0.50",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
        },
        "description": "AI-gedreven tool om PDF facturen en afbeeldingen te converteren naar gestructureerde data (CSV/Excel).",
        "featureList": "KvK herkenning, BTW uitsplitsing, PDF conversie, CSV Export",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Welke bestandstypes worden ondersteund?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Wij ondersteunen PDF bestanden, JPG en PNG afbeeldingen. Zowel digitale PDF's als foto's van bonnetjes worden herkend."
            }
          },
          {
            "@type": "Question",
            "name": "Is de data compatible met mijn boekhoudpakket?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja, onze CSV export is geoptimaliseerd voor import in Exact Online, Moneybird, SnelStart en AFAS. Daarnaast bieden we JSON voor developers."
            }
          },
          {
            "@type": "Question",
            "name": "Worden mijn facturen opgeslagen?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nee. Bestanden worden in het geheugen verwerkt en direct na analyse verwijderd. Wij bewaren geen gevoelige financiële documenten."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

// --- 4. CONTENT COMPONENTS ---
function Feature({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="flex gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#3066be] shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// --- 5. PAGE RENDER ---
export default function FactuurScannerPage() {
  return (
    <div className="min-h-screen bg-white font-sans relative flex flex-col items-center">
      <ToolSchema />

      {/* HERO SECTION */}
      <section className="relative z-10 w-full max-w-6xl px-6 pt-20 pb-12 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs text-blue-600 font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          AIFAIS Intelligence Engine v1.0
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 text-center max-w-3xl">
          Factuur Scannen met <br/>
          <span className="text-blue-600">
            Superhuman Accuracy
          </span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl text-center leading-relaxed mb-12">
          Zet PDF facturen en bonnetjes in seconden om naar Excel, CSV of JSON ready data. 
          Perfect voor ondernemers, accountants en developers.
        </p>

        {/* THE TOOL */}
        <div className="w-full flex justify-center mb-24">
          <ScannerClient />
        </div>
      </section>

      {/* FEATURES SECTION (SEO CONTENT) */}
      <section className="w-full bg-white py-24 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Waarom AIFAIS Factuur Scanner?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Traditionele OCR faalt vaak bij complexe layouts. Onze AI "leest" de factuur zoals een mens dat doet, 
              maar dan in milliseconden.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Feature 
              icon={Zap}
              title="Razendsnelle Extractie"
              text="Verwerk facturen in < 3 seconden. Wij extraheren factuurnummer, datum, totalen, BTW-uitsplitsing en regels."
            />
            <Feature 
              icon={CheckCircle2}
              title="KvK & BTW Validatie"
              text="Het AI model valideert automatisch of het KvK nummer en BTW nummer op de factuur geldig zijn."
            />
            <Feature 
              icon={FileJson}
              title="CSV & JSON Export"
              text="Download je data direct als CSV voor Excel/Numbers, of als JSON voor je eigen software integraties."
            />
            <Feature 
              icon={ShieldCheck}
              title="Privacy First"
              text="Jou data is van jou. Bestanden worden na verwerking direct verwijderd en nooit gebruikt voor AI training."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="w-full bg-slate-50 py-24 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Hoe werkt het?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload PDF", text: "Sleep je facturen of bonnetjes in de scanner. Je kunt tot 10 bestanden tegelijk verwerken." },
              { step: "02", title: "AI Analyse", text: "Onze Claude 3.5 Sonnet engine analyseert de documenten en extraheert alle relevante velden." },
              { step: "03", title: "Export Data", text: "Download de resultaten als CSV bestand dat direct in je boekhoudpakket kan." }
            ].map((item, i) => (
              <div key={i} className="relative">
                 <span className="text-6xl font-bold text-slate-200 absolute -top-8 -left-2 select-none -z-10">{item.step}</span>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                 <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATION GUIDE */}
      <section className="w-full bg-white py-24 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Compatibel met je workflow</h2>
            <div className="flex flex-wrap justify-center gap-4 text-gray-400 font-semibold text-lg opacity-70">
                <span className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-600" /> Excel
                </span>
                <span className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">Moneybird</span>
                <span className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">Exact Online</span>
                <span className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">SnelStart</span>
                <span className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">AFAS</span>
            </div>
            <p className="mt-8 text-gray-500">
              Gebruik de CSV export optie om de gescande data direct te importeren in bovenstaande pakketten.
            </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#0c0c0c] text-white py-12">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-white/40 text-sm mb-4">
               AIFAIS Factuur Scanner is onderdeel van het AIFAIS Developers Platform.
            </p>
             <div className="flex justify-center gap-6 text-sm text-white/60">
                <a href="/developers/docs" className="hover:text-emerald-400 transition-colors">API Docs</a>
                <a href="/terms" className="hover:text-white transition-colors">Voorwaarden</a>
                <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
             </div>
         </div>
      </footer>
    </div>
  );
}
