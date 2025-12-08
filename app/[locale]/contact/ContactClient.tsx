"use client";

import { useState } from "react";
import VoiceInput from "@/app/Components/VoiceInput";

export default function ContactClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );

  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "", message: "" };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = "Naam is verplicht";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      newErrors.email = "Voer een geldig emailadres in";
      isValid = false;
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      newErrors.message = "Bericht moet minimaal 10 karakters bevatten";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Er ging iets mis.");

      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-100/40 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-gray-600">
              Gratis Adviesgesprek
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
            Klaar om te{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              starten?
            </span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Vertel ons waar je tijd aan verliest. Binnen 24 uur heb je een
            concreet plan.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 shadow-xl shadow-gray-200/50">
              {status === "ok" ? (
                /* Success State */
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-emerald-600"
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
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Bericht ontvangen!
                  </h2>
                  <p className="text-gray-500 mb-6">
                    We nemen binnen 24 uur contact met je op.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Nog een bericht sturen →
                  </button>
                </div>
              ) : (
                /* Form */
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Stuur een bericht
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Vul je gegevens in — we reageren snel.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Naam <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="Jouw naam"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border transition-all outline-none
                          ${
                            errors.name
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 hover:border-gray-300"
                          }`}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          E-mailadres <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          placeholder="naam@bedrijf.nl"
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            if (errors.email)
                              setErrors({ ...errors, email: "" });
                          }}
                          className={`w-full px-4 py-3 rounded-xl bg-gray-50 border transition-all outline-none
                            ${
                              errors.email
                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 hover:border-gray-300"
                            }`}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Telefoon{" "}
                          <span className="text-gray-400 font-normal">
                            (optioneel)
                          </span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="06 12345678"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 hover:border-gray-300 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Waar kunnen we je mee helpen?{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <VoiceInput
                          onTranscript={(text) =>
                            setForm((prev) => ({
                              ...prev,
                              message:
                                prev.message + (prev.message ? " " : "") + text,
                            }))
                          }
                        />
                      </div>
                      <textarea
                        id="message"
                        required
                        placeholder="Beschrijf je uitdaging of vraag..."
                        value={form.message}
                        onChange={(e) => {
                          setForm({ ...form, message: e.target.value });
                          if (errors.message)
                            setErrors({ ...errors, message: "" });
                        }}
                        rows={5}
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border transition-all outline-none resize-none
                          ${
                            errors.message
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 hover:border-gray-300"
                          }`}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group w-full px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {status === "sending" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Versturen...</span>
                        </>
                      ) : (
                        <>
                          <span>Verstuur Aanvraag</span>
                          <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </>
                      )}
                    </button>

                    {/* Error state */}
                    {status === "error" && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-red-800 font-medium text-sm">
                            Er ging iets mis
                          </p>
                          <p className="text-red-600 text-sm">
                            Probeer het opnieuw of mail ons direct.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Trust indicator */}
                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Je gegevens zijn 100% veilig
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* What happens next */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-200/30">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Wat gebeurt er hierna?
              </h3>

              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Analyse",
                    desc: "We bekijken je aanvraag en checken of we een match zijn.",
                    color: "bg-blue-500",
                  },
                  {
                    step: "2",
                    title: "Kennismaking",
                    desc: "Kort gesprek (15-30 min) om je processen door te nemen.",
                    color: "bg-purple-500",
                  },
                  {
                    step: "3",
                    title: "Voorstel",
                    desc: "Je ontvangt een plan met vaste prijs en verwachte ROI.",
                    color: "bg-emerald-500",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct contact */}
            <div className="grid gap-3">
              <a
                href="mailto:contact@aifais.com"
                className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Mail ons</p>
                  <p className="text-gray-900 font-semibold">
                    contact@aifais.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+31618424470"
                className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    Bel direct
                  </p>
                  <p className="text-gray-900 font-semibold">+31 6 1842 4470</p>
                </div>
              </a>
            </div>

            {/* Response time */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Gemiddelde responstijd: binnen 4 uur</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
