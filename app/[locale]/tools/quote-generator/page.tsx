import { Metadata } from "next";
import QuoteGeneratorClient from "./QuoteGeneratorClient";
import { FileText, Zap, Download, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Gratis Offerte Maken | Professionele PDF Generator | AIFAIS",
  description: "Maak in 2 minuten een professionele offerte. Gratis, geen account nodig. Direct downloaden als PDF. Perfect voor ZZP en MKB.",
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

export default function QuoteGeneratorPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-24">
      {/* HERO */}
      <section className="bg-white border-b border-slate-200 pt-20 pb-16 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs text-blue-600 font-bold uppercase tracking-wider mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            100% Gratis Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Professionele Offerte Maken in <span className="text-blue-600">2 Minuten</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12">
            Geen ingewikkelde software nodig. Vul het formulier in en download direct je offerte als PDF.
          </p>

          <QuoteGeneratorClient />
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Feature 
            icon={Zap} 
            title="Supersnel" 
            text="Binnen 2 minuten heb je een professionele offerte klaar om te versturen naar je klant."
          />
          <Feature 
            icon={FileText} 
            title="Professioneel Design" 
            text="Automatisch een strak, zakelijk design dat vertrouwen wekt bij je klanten."
          />
          <Feature 
            icon={Download} 
            title="Direct PDF" 
            text="Download meteen als PDF. Geen wachttijden, geen gedoe met exporteren."
          />
          <Feature 
            icon={Shield} 
            title="Privacy First" 
            text="Alles gebeurt lokaal in je browser. We slaan geen gegevens op."
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
                "name": "Is deze offerte generator echt gratis?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ja, 100% gratis. Geen verborgen kosten, geen account nodig, geen limiet op het aantal offertes."
                }
              },
              {
                "@type": "Question",
                "name": "Kan ik mijn logo toevoegen?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Momenteel niet, maar je kunt de PDF na downloaden bewerken in een PDF editor om je logo toe te voegen."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
