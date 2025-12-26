"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function X402Demo() {
  const [step, setStep] = useState(0);
  const t = useTranslations("agentApiPage.demo");

  // Auto-play de demo
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      label: t("step1.label"),
      desc: t("step1.desc"),
      status: "POST /api/scan-contract",
      color: "bg-gray-100 text-gray-600",
    },
    {
      label: t("step2.label"),
      desc: t("step2.desc"),
      status: "HTTP 402: Payment Required",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      label: t("step3.label"),
      desc: t("step3.desc"),
      status: "Tx: 0x8a...3f confirmed",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      label: t("step4.label"),
      desc: t("step4.desc"),
      status: "HTTP 200: { risk_score: 'high' }",
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      label: t("step5.label"),
      desc: t("step5.desc"),
      status: "Ready for next",
      color: "bg-gray-50 text-gray-400",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6 overflow-hidden relative">
      {/* Visual Connection Line */}
      <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gray-100"></div>

      <div className="space-y-6 relative">
        {steps.slice(0, 4).map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 transition-all duration-500 ${
              step >= i
                ? "opacity-100 translate-x-0"
                : "opacity-30 translate-x-4"
            }`}
          >
            {/* Dot indicator */}
            <div
              className={`w-4 h-4 rounded-full border-2 z-10 shrink-0 ${
                step >= i
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-300"
              }`}
            ></div>

            {/* Card */}
            <div
              className={`flex-1 p-3 rounded-lg border text-sm flex justify-between items-center ${
                step === i
                  ? "ring-2 ring-blue-100 border-blue-300 shadow-sm"
                  : "border-transparent"
              } ${s.color}`}
            >
              <div>
                <span className="font-bold block">{s.label}</span>
                <span className="text-xs opacity-80">{s.desc}</span>
              </div>
              <code className="bg-white/50 px-2 py-1 rounded text-xs font-mono">
                {s.status}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
