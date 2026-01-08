"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Play, Sparkles, Shield } from "lucide-react";

export default function ExplainerSection() {
  const t = useTranslations("explainer");

  const features = [
    {
      title: t("features.execution.title"),
      desc: t("features.execution.desc"),
      icon: <Play className="w-5 h-5" />,
      color: "blue" as const,
    },
    {
      title: t("features.context.title"),
      desc: t("features.context.desc"),
      icon: <Sparkles className="w-5 h-5" />,
      color: "purple" as const,
    },
    {
      title: t("features.guarantee.title"),
      desc: t("features.guarantee.desc"),
      icon: <Shield className="w-5 h-5" />,
      color: "emerald" as const,
    },
  ];

  const colors = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  };

  return (
    <section className="py-24 md:py-32 bg-[#fafaf9] relative overflow-hidden">
      {/* Background elements matching Hero - hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none mobile-hide-blur">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="order-2 lg:order-1"
          >
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-stone-900 tracking-tight leading-[1.1]">
              {t("titlePrefix")}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                  {t("titleHighlight")}
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-0 rounded" />
              </span>
              ,
              <br />
              {t("titleSuffix")}{" "}
              <span className="text-stone-300 line-through decoration-2">
                {t("titleStrikethrough")}
              </span>
              .
            </h2>

            {/* Description */}
            <div className="space-y-4 mb-10">
              <p className="text-lg text-stone-500 leading-relaxed">
                {t("p1")}
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                {t.rich("p2", {
                  bold: (children) => <span className="font-semibold text-stone-900">{children}</span>
                })}
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3">
              {features.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-100 hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300"
                >
                  <div
                    className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${colors[item.color]}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Interactive Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-[2.5rem] blur-2xl" />

              {/* Main Card */}
              <div className="relative bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/50 overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-stone-200" />
                      <div className="w-3 h-3 rounded-full bg-stone-200" />
                      <div className="w-3 h-3 rounded-full bg-stone-200" />
                    </div>
                    <span className="text-sm text-stone-400 font-mono">
                      agent.process
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs text-emerald-600 font-medium">
                      {t("visual.status")}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Input Section */}
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                      {t("visual.input")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        <span className="text-stone-600">email_inbox</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-stone-600">invoice.pdf</span>
                      </div>
                    </div>
                  </div>

                  {/* Processing Section */}
                  <div className="relative">
                    <div className="absolute left-1/2 -top-2 w-px h-2 bg-stone-200" />
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-[2px]">
                      <div className="bg-white rounded-[10px] p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-stone-900">
                              {t("visual.label")}
                            </span>
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                            3.2s
                          </span>
                        </div>

                        <div className="space-y-2 font-mono text-sm">
                          {(t.raw("visual.steps") as string[]).map((text, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 + idx * 0.15 }}
                              className="flex items-center gap-2 text-stone-500"
                            >
                              <svg
                                className="w-4 h-4 text-emerald-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 -bottom-2 w-px h-2 bg-stone-200" />
                  </div>

                  {/* Output Section */}
                  <div className="bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-emerald-600/70 uppercase tracking-wider mb-1">
                        {t("visual.outputLabel")}
                      </div>
                      <div className="text-emerald-900 font-semibold">
                        {t("visual.output")}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-400">
                      {t("visual.footer")}
                    </span>
                    <span className="text-stone-600 font-medium">
                      {t("visual.active")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="absolute -top-3 -right-3 px-3 py-1.5 bg-white rounded-full border border-stone-200 shadow-lg text-xs font-semibold text-stone-600"
              >
                {t("visual.automatic")}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="absolute -bottom-3 -left-3 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg text-xs font-semibold text-white"
              >
                {t("visual.poweredBy")}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
