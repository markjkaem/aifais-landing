import { Metadata } from "next";
import TermsGeneratorClient from "./TermsGeneratorClient";
import { Shield, Zap, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Gratis Algemene Voorwaarden Generator | Juridisch Dicht | AIFAIS",
  description: "Genereer professionele algemene voorwaarden voor je bedrijf in 3 stappen. Gratis, geen account nodig. Direct downloaden als PDF.",
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

export default function TermsGeneratorPage() {
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
            Algemene Voorwaarden in <span className="text-blue-600">3 Stappen</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12">
            Bescherm je bedrijf met professionele algemene voorwaarden. Geen juridische kennis nodig.
          </p>

          <TermsGeneratorClient />
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Feature 
            icon={Shield} 
            title="Juridisch Dicht" 
            text="Onze voorwaarden zijn gebaseerd op Nederlandse wetgeving en dekken alle belangrijke punten af."
          />
          <Feature 
            icon={Zap} 
            title="In 3 Minuten Klaar" 
            text="Beantwoord een paar vragen en download direct je professionele algemene voorwaarden."
          />
          <Feature 
            icon={FileText} 
            title="Direct PDF" 
            text="Download meteen als PDF. Klaar om te gebruiken op je website of in je contracten."
          />
          <Feature 
            icon={CheckCircle2} 
            title="Volledig Gratis" 
            text="Geen verborgen kosten, geen account nodig. Genereer zoveel voorwaarden als je wilt."
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
                "name": "Zijn deze algemene voorwaarden juridisch bindend?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ja, mits correct geïmplementeerd. We raden aan om de voorwaarden te laten controleren door een jurist voor specifieke situaties."
                }
              },
              {
                "@type": "Question",
                "name": "Kan ik de voorwaarden aanpassen?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ja, je kunt de gegenereerde PDF bewerken in een PDF-editor of tekstverwerker om specifieke clausules toe te voegen."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
