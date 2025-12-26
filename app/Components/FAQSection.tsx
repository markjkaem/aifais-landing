import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const t = useTranslations("faq");
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = t.raw("items") as FAQItem[];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative py-24 bg-white overflow-hidden border-t border-gray-200"
    >
      {/* Background effects (Light Mode) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#3066be]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-[#3066be]/10 border border-[#3066be]/20 rounded-full">
            <span className="text-[#3066be] text-sm font-semibold tracking-wide">
              {t("badge")}
            </span>
          </div>
          <h2
            id="faq-heading"
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
          >
            {t("title")}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
            <a
              href={`/${locale}/contact`}
              className="text-[#3066be] hover:text-[#234a8c] ml-1 underline font-medium"
            >
              {t("contactLink")}
            </a>
          </p>
        </div>

        {/* FAQ Accordion */}
        <dl className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`group relative bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-[#3066be]/30 shadow-md ring-1 ring-[#3066be]/10"
                  : "border-gray-200 hover:border-[#3066be]/30"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="relative w-full text-left p-6 focus:outline-none rounded-xl"
                aria-expanded={openIndex === index}
              >
                <dt className="flex items-start justify-between gap-4">
                  <span
                    className={`font-bold text-lg transition-colors pr-8 ${
                      openIndex === index
                        ? "text-[#3066be]"
                        : "text-gray-900 group-hover:text-[#3066be]"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border transition-transform duration-300 ${
                      openIndex === index
                        ? "bg-[#3066be] border-[#3066be] text-white rotate-180"
                        : "bg-gray-50 border-gray-200 text-gray-400 group-hover:border-[#3066be] group-hover:text-[#3066be]"
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
                  className={`mt-4 text-gray-600 leading-relaxed transition-all duration-300 overflow-hidden ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {faq.answer}
                </dd>
              </button>
            </div>
          ))}
        </dl>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {t("ctaTitle")}
          </h3>
          <p className="text-gray-600 mb-6">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3066be] text-white font-semibold rounded-lg hover:bg-[#234a8c] transition-all shadow-lg shadow-[#3066be]/20 hover:-translate-y-1"
            >
              <span>{t("ctaButton")}</span>
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
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-white hover:border-gray-300 transition-all"
            >
              <span>{t("ctaSecondary")}</span>
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
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t("responseTime")}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
