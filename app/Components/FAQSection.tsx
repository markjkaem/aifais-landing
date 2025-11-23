"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Hoe snel kan ik resultaat zien?",
    answer:
      "De meeste klanten zien binnen 2 weken hun eerste workflow live gaan. Simpele automatiseringen zoals data-sync of email workflows vaak al binnen een week. We focussen op quick wins eerst, zodat je snel rendement ziet.",
  },
  {
    question: "Moet ik zelf technisch zijn om dit te gebruiken?",
    answer:
      "Absoluut niet. Wij bouwen alles voor je, testen het grondig, en trainen je team. Je krijgt een overzichtelijk dashboard waar je zonder code aanpassingen kunt maken. Denk aan het wijzigen van teksten, timing, of ontvangers - gewoon in normale taal.",
  },
  {
    question: "Wat zijn de kosten?",
    answer:
      "Een standaard workflow start vanaf €2.500. Complexere multi-step automatiseringen beginnen bij €5.000. Je krijgt altijd vooraf een transparante offerte met een duidelijk ROI-overzicht. De meeste klanten verdienen hun investering binnen 2-3 maanden terug door tijdsbesparing.",
  },
  {
    question: "Werkt dit met onze huidige software?",
    answer:
      "Waarschijnlijk wel! We integreren met 400+ populaire tools zoals Gmail, Slack, HubSpot, Exact Online, Salesforce, Shopify, en meer. Zelfs als jouw tool er niet tussen staat, kunnen we vaak via API's of webhooks toch integreren. In het gratis gesprek kijken we direct of het past.",
  },
  {
    question: "Wat als het niet werkt zoals ik wil?",
    answer:
      "Je krijgt 30 dagen gratis support na de lancering. We blijven doorwerken totdat alles perfect loopt. Daarna kun je kiezen voor een onderhoudscontract (vanaf €200/maand) of alleen betalen voor wijzigingen wanneer je ze nodig hebt. Geen verplichtingen.",
  },
  {
    question: "Hoe weet ik of automatisering wat voor ons is?",
    answer:
      "Als je team meer dan 5 uur per week bezig is met repetitieve taken (data-invoer, emails, rapportages, offertes), is automatisering bijna altijd de moeite waard. In ons gratis gesprek berekenen we samen de potentiële ROI voor jouw specifieke situatie.",
  },
  {
    question: "Kunnen we het zelf later aanpassen?",
    answer:
      "Ja! We bouwen workflows zo dat je zelf eenvoudige aanpassingen kunt doen zonder programmeerkennis. Voor grotere wijzigingen of nieuwe workflows kun je altijd bij ons terugkomen. Je bent niet vendor-locked - de workflows blijven van jou.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative py-24 bg-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/5 via-transparent to-purple-950/5" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-950/30 border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-sm font-semibold tracking-wide">
              ❓ VEELGESTELDE VRAGEN
            </span>
          </div>
          <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-purple-300 to-amber-400 bg-clip-text text-transparent">
              Alles Wat Je Moet Weten
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Nog twijfels? Deze vragen krijgen we het meest. Staat jouw vraag er
            niet tussen?
            <a
              href="/contact"
              className="text-purple-400 hover:text-purple-300 ml-1 underline"
            >
              Neem contact op
            </a>
          </p>
        </div>

        {/* FAQ Accordion */}
        <dl className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <button
                onClick={() => toggleFAQ(index)}
                className="relative w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-xl"
                aria-expanded={openIndex === index}
              >
                <dt className="flex items-start justify-between gap-4">
                  <span className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors pr-8">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-400 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </dt>
                <dd
                  className={`mt-4 text-gray-300 leading-relaxed transition-all duration-300 overflow-hidden ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {faq.answer}
                </dd>
              </button>

              {/* Bottom border accent when open */}
              <div
                className={`h-1 bg-gradient-to-r from-purple-600 via-purple-400 to-amber-400 transition-all duration-300 ${
                  openIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ))}
        </dl>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-purple-950/20 via-zinc-900/50 to-purple-950/20 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-3">
            Nog meer vragen?
          </h3>
          <p className="text-gray-400 mb-6">
            We beantwoorden ze graag in een vrijblijvend gesprek van 30 minuten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/quickscan"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-white text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              <span>Start Gratis Quickscan</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-purple-500/50 text-white font-semibold rounded-lg hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300"
            >
              <span>Stel Je Vraag</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Gemiddelde responstijd: binnen 4 uur</span>
          </p>
        </div>
      </div>
    </section>
  );
}
