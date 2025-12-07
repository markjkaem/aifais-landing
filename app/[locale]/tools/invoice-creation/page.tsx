import { Metadata } from "next";
import InvoiceGenerator from "./InvoiceGenerator";

export const metadata: Metadata = {
  title: "Gratis Factuur Maker | PDF Factuur in 1 minuut | AIFAIS",
  description:
    "Maak professionele facturen in PDF formaat. Geen account nodig, 100% gratis en direct downloaden. Geschikt voor ZZP en MKB.",
  keywords: [
    "factuur maken",
    "gratis factuur programma",
    "pdf factuur",
    "zzp factuur template",
    "online factureren",
  ],
};

export default function FactuurMakerPage() {
  return (
    <div className="min-h-screen bg-black font-sans relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 max-w-2xl w-full text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-6">
          <span className="w-2 h-2 rounded-full bg-gray-500"></span>
          Gratis Tool
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
          Factuur{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-indigo-500">
            Maker
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Maak in 30 seconden een professionele PDF factuur. Geen account nodig.
        </p>
      </div>

      {/* Tool */}
      <div className="relative z-10 w-full flex justify-center">
        <InvoiceGenerator />
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-16 text-center pb-10">
        <p className="text-xs text-gray-600 max-w-xl mx-auto">
          Disclaimer: Dit is een gratis tool. Wij slaan geen gegevens op. Jij
          bent zelf verantwoordelijk voor de juistheid van je factuur.
        </p>
      </div>
    </div>
  );
}
