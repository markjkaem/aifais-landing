"use client";

import { useTranslations } from "next-intl";

export default function StorySection() {
  const t = useTranslations("aboutPage.story");

  const values = [
    {
      key: "transparency",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      key: "quality",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: "results",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-6">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                            {t("badge")}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 text-gray-900">
                        {t("title")}{" "}
                        <span className="text-[#3066be]">{t("titleHighlight")}</span>
                    </h2>
                    <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                        <p>{t("p1")}</p>
                        <p>{t("p2")}</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {values.map((v) => (
                        <div key={v.key} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-start hover:shadow-md transition-shadow">
                            <div className="p-3 bg-blue-50 text-[#3066be] rounded-lg shrink-0">
                                {v.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">{t(`values.${v.key}.title`)}</h3>
                                <p className="text-gray-500">{t(`values.${v.key}.desc`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
}
