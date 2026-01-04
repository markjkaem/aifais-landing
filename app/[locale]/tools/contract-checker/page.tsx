import { Metadata } from "next";
import ContractCheckerClient from "./ContractCheckerClient";
import { ShieldAlert, Search, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Contract Checker AI | Voorkom Juridische Risico's | AIFAIS",
  description: "Upload je contract en laat AI direct de risico's checken. Geen dure advocaat nodig voor een basic review. Ontdek verborgen clausules.",
};

function Feature({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="flex gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-blue-600 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function ContractCheckerPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-24">
      {/* HERO */}
      <section className="bg-white border-b border-slate-200 pt-20 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs text-blue-600 font-bold uppercase tracking-wider mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              AI Legal Assistant
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Contract Controleren in <span className="text-blue-600">Seconden</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12">
              Upload een PDF (NDA, arbeidsovereenkomst, offerte) en krijg direct inzicht in de juridische risico's.
            </p>

            <ContractCheckerClient />
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Feature 
            icon={ShieldAlert} 
            title="Risico Detectie" 
            text="Onze AI scant op nadelige clausules zoals onbeperkte aansprakelijkheid, concurrentiebedingen en automatische verlengingen."
          />
          <Feature 
            icon={Search} 
            title="Duidelijke Taal" 
            text="Geen juridisch jargon. Krijg uitleg in gewone mensentaal over wat een artikel precies betekent voor jou."
          />
          <Feature 
            icon={FileText} 
            title="PDF Annotaties" 
            text="Download je contract met de opmerkingen direct in de kantlijn geplaatst. Klaar om te delen met de tegenpartij."
          />
          <Feature 
            icon={CheckCircle2} 
            title="Beter Onderhandelen" 
            text="We geven niet alleen aan wat fout is, maar genereren ook suggesties voor betere formuleringen."
          />
        </div>
      </section>

      {/* FAQ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Vervangt dit een advocaat?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Nee. De AI Contract Checker is een 'first pass' tool om grove fouten te vinden. Voor complex advies of grote belangen adviseren we altijd een jurist."
                }
              },
              {
                "@type": "Question",
                "name": "Is mijn contract veilig?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ja. Documenten worden versleuteld verwerkt en na analyse direct verwijderd van onze servers."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
