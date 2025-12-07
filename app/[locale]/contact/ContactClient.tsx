"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VoiceInput from "@/app/Components/VoiceInput";

// Animaties
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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

  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "ok" | "error"

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

  async function handleSubmit(e: { preventDefault: () => void }) {
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

      setTimeout(() => {
        document.getElementById("success-message")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  // Hulpcomponent voor inputs om code schoon te houden
  const InputField = ({
    label,
    id,
    type = "text",
    placeholder,
    required,
    value,
    error,
    onChange,
  }: {
    label: string;
    id: string;
    type?: string;
    placeholder: string;
    required: boolean;
    value: string;
    error: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700"
      >
        {label} {required && <span className="text-[#3066be]">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 text-slate-900 border transition-all duration-300 outline-none
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-200 focus:border-[#3066be] focus:ring-4 focus:ring-[#3066be]/10 hover:border-slate-300"
          }`}
      />
      {error && (
        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="relative bg-white min-h-screen py-24 px-6 overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>

      <motion.div
        className="relative max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {/* Header */}
        <motion.header variants={fadeUp} className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6 text-[#3066be] text-sm font-bold tracking-wide uppercase shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3066be] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3066be]"></span>
            </span>
            Gratis Adviesgesprek
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 tracking-tight">
            Klaar om te{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-blue-600">
              Starten?
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Vul het formulier in en ontvang binnen 24 uur een concreet plan.
            Geen verplichtingen, alleen helder advies over jouw automatisering.
          </p>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: FORM (7 Columns) */}
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Stuur een bericht
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Vul je gegevens in. Wij reageren écht snel.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name */}
                <InputField
                  id="name"
                  label="Naam"
                  required
                  placeholder="Jouw volledige naam"
                  value={form.name}
                  error={errors.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                />

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id="email"
                    label="E-mailadres"
                    type="email"
                    required
                    placeholder="naam@bedrijf.nl"
                    value={form.email}
                    error={errors.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Telefoon{" "}
                      <span className="text-slate-400 font-normal text-xs">
                        (Optioneel)
                      </span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="06 12345678"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:border-[#3066be] focus:ring-4 focus:ring-[#3066be]/10 hover:border-slate-300 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Waar kunnen we je mee helpen?{" "}
                      <span className="text-[#3066be]">*</span>
                    </label>

                    {/* Voice Input Integration */}
                    <div className="scale-90 origin-right">
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
                  </div>

                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Beschrijf je uitdaging of vraag..."
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    rows={5}
                    className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 text-slate-900 border transition-all duration-300 outline-none resize-none
                      ${
                        errors.message
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-[#3066be] focus:ring-4 focus:ring-[#3066be]/10 hover:border-slate-300"
                      }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                      ⚠️ {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group w-full px-8 py-4 bg-[#3066be] hover:bg-[#2554a3] text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(48,102,190,0.5)] hover:shadow-[0_20px_30px_-10px_rgba(48,102,190,0.6)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
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

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>Je gegevens zijn 100% veilig.</span>
                  </div>

                  {/* Success Message */}
                  {status === "ok" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="success-message"
                      className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4"
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-emerald-800 font-bold text-sm">
                          Aanvraag succesvol!
                        </h4>
                        <p className="text-emerald-700 text-sm">
                          We hebben je bericht ontvangen en nemen binnen 24 uur
                          contact op.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* RIGHT: SIDEBAR (5 Columns) */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 space-y-8 lg:sticky lg:top-32"
          >
            {/* Timeline Process */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-lg shadow-slate-200/40">
              <h3 className="text-xl font-bold text-slate-900 mb-8">
                Wat gebeurt er hierna?
              </h3>

              <div className="relative space-y-10 pl-2">
                {/* Vertical Line */}
                <div className="absolute top-2 left-[19px] bottom-4 w-[2px] bg-gradient-to-b from-slate-200 to-transparent border-r border-dashed border-slate-300" />

                {[
                  {
                    title: "Analyse",
                    desc: "Mark of Faissal bekijkt je case om te zien of we een match zijn.",
                    icon: (
                      <svg
                        className="w-5 h-5 text-[#3066be]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Kennismaking",
                    desc: "Kort gesprek (15-30 min) om je processen door te nemen.",
                    icon: (
                      <svg
                        className="w-5 h-5 text-[#3066be]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Voorstel",
                    desc: "Je ontvangt een plan van aanpak met vaste prijs en ROI.",
                    icon: (
                      <svg
                        className="w-5 h-5 text-[#3066be]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    ),
                  },
                ].map((step, i) => (
                  <div key={i} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm z-10">
                      {step.icon}
                    </div>
                    <h4 className="text-slate-900 font-bold text-base mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 gap-4">
              <a
                href="mailto:contact@aifais.com"
                className="group flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 hover:border-[#3066be]/30 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#3066be] group-hover:bg-[#3066be] group-hover:text-white transition-colors duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    Mail ons
                  </p>
                  <p className="text-slate-900 font-bold">contact@aifais.com</p>
                </div>
              </a>

              <a
                href="tel:+31618424470"
                className="group flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 hover:border-green-400/50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    Bel direct
                  </p>
                  <p className="text-slate-900 font-bold">+31 6 1842 4470</p>
                </div>
              </a>
            </div>

            {/* Micro Testimonial */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative">
              <svg
                className="absolute top-6 left-6 w-8 h-8 text-[#3066be]/10 rotate-180"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.55228 16 10 15.5523 10 15V9C10 8.44772 9.55228 8 9 8H5C4.44772 8 4 8.44772 4 9V15C4 18.3137 6.68629 21 10 21H14.017ZM21.017 21L21.017 18C21.017 16.8954 20.1216 16 19.017 16H16C16.5523 16 17 15.5523 17 15V9C17 8.44772 16.5523 8 16 8H12C11.4477 8 11 8.44772 11 9V15C11 18.3137 13.6863 21 17 21H21.017Z" />
              </svg>
              <p className="text-slate-600 text-sm leading-relaxed italic relative z-10 pl-4 border-l-2 border-[#3066be]/20">
                "AIFAIS reageerde enorm snel. Binnen een week hadden we onze
                eerste workflow draaien die ons nu al 4 uur per week scheelt."
              </p>
              <div className="mt-4 flex items-center gap-3 pl-4">
                <div className="w-8 h-8 bg-[#3066be] rounded-full flex items-center justify-center font-bold text-white text-xs">
                  J
                </div>
                <div className="text-xs">
                  <span className="block font-bold text-slate-900">Jeroen</span>
                  <span className="text-slate-500">E-commerce eigenaar</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
