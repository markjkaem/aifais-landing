"use client";

export default function ExplainerSection() {
  const features = [
    {
      title: "Autonome Uitvoering",
      desc: "Geen kliks nodig. Je agent neemt het volledige proces over, van start tot finish.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
          />
        </svg>
      ),
      color: "blue" as const,
    },
    {
      title: "Contextuele AI",
      desc: "Begrijpt niet alleen data, maar ook nuance. Leest documenten zoals een mens dat doet.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
      ),
      color: "purple" as const,
    },
    {
      title: "Niet Goed, Geld Terug",
      desc: "Wij geloven in resultaat. Werkt het niet zoals afgesproken? Dan betaal je niet.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
          />
        </svg>
      ),
      color: "emerald" as const,
    },
  ];

  const colors = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  };

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-l from-purple-100/40 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            {/* Heading with visual flair */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 tracking-tight leading-[1.1]">
              Software die{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                  werkt
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-0 rounded" />
              </span>
              ,
              <br />
              niet software die{" "}
              <span className="text-gray-300 line-through decoration-2">
                wacht
              </span>
              .
            </h2>

            {/* Description */}
            <div className="space-y-4 mb-10">
              <p className="text-xl text-gray-500 leading-relaxed">
                Traditionele software is passief: het wacht tot jij op de
                knoppen drukt.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                Een{" "}
                <span className="font-semibold text-gray-900">
                  Digitale Werknemer
                </span>{" "}
                is proactief. Hij leest je mail, begrijpt context, en voert
                acties uit — zonder dat jij erbij hoeft te zijn.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 cursor-default"
                >
                  <div
                    className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      colors[item.color]
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Visual */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-[2.5rem] blur-2xl opacity-60" />

              {/* Main Card */}
              <div className="relative bg-white rounded-[2rem] border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-sm text-gray-400 font-mono">
                      agent.process
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs text-emerald-600 font-medium">
                      Live
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Input Section */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Input
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        <span className="text-gray-600">email_inbox</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-gray-600">invoice.pdf</span>
                      </div>
                    </div>
                  </div>

                  {/* Processing Section */}
                  <div className="relative">
                    <div className="absolute left-1/2 -top-2 w-px h-2 bg-gray-200" />
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-[2px]">
                      <div className="bg-white rounded-[10px] p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-900">
                              AI Processing
                            </span>
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                            3.2s
                          </span>
                        </div>

                        <div className="space-y-2 font-mono text-sm">
                          {[
                            "Document geanalyseerd",
                            "€2.450,00 geëxtraheerd",
                            "Matched met PO #2024-0891",
                          ].map((text, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-gray-500">
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 -bottom-2 w-px h-2 bg-gray-200" />
                  </div>

                  {/* Output Section */}
                  <div className="bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-emerald-600/70 uppercase tracking-wider mb-1">
                        Output
                      </div>
                      <div className="text-emerald-900 font-semibold">
                        Factuur verwerkt & ingeboekt
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
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Geen menselijke actie nodig
                    </span>
                    <span className="text-gray-500 font-medium">
                      24/7 actief
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-lg text-xs font-semibold text-gray-600">
                100% automatisch
              </div>

              <div className="absolute -bottom-3 -left-3 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg text-xs font-semibold text-white">
                Claude 4.5 Powered
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
