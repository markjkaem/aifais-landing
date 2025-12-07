"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import VoiceInput from "@/app/Components/VoiceInput";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
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

  // In ContactClient.tsx

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus("sending");

    try {
      // ✅ DE ECHTE API CALL
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });

      if (!res.ok) {
        throw new Error("Er ging iets mis bij het versturen.");
      }

      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "" });

      // Smooth scroll to success message
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

  return (
    <div className="relative bg-[#fbfff1] min-h-screen py-20 px-6 overflow-hidden text-gray-900">
      {/* Background effects (Light Mode) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3066be]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(48,102,190,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(48,102,190,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <motion.div
        className="relative max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* Header */}
        <motion.header variants={fadeUp} className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-[#3066be]/10 border border-[#3066be]/20 rounded-full">
            <span className="text-[#3066be] text-sm font-semibold tracking-wide">
              💬 GRATIS ADVIESGESPREK
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3066be] to-purple-600">
              Klaar Om Te Starten?
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Vul het formulier in en ontvang binnen 24 uur een concreet plan.
            Geen verplichtingen, alleen helder advies.
          </p>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* LEFT: FORM */}
          <motion.div variants={fadeUp}>
            <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#3066be]/10 to-transparent rounded-tl-3xl blur-2xl pointer-events-none" />

              <div className="relative">
                <h2 className="text-3xl font-bold mb-2 text-gray-900">
                  Stuur Een Bericht
                </h2>
                <p className="text-gray-500 mb-8 text-sm">
                  Velden met een <span className="text-[#3066be]">*</span> zijn
                  verplicht.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Naam <span className="text-[#3066be]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jouw naam"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      className={`w-full p-4 rounded-xl bg-gray-50 text-gray-900 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } focus:border-[#3066be] focus:outline-none focus:ring-2 focus:ring-[#3066be]/20 transition`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        E-mailadres <span className="text-[#3066be]">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="naam@bedrijf.nl"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        className={`w-full p-4 rounded-xl bg-gray-50 text-gray-900 border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } focus:border-[#3066be] focus:outline-none focus:ring-2 focus:ring-[#3066be]/20 transition`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Telefoon{" "}
                        <span className="text-gray-400 text-xs font-normal">
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
                        className="w-full p-4 rounded-xl bg-gray-50 text-gray-900 border border-gray-300 focus:border-[#3066be] focus:outline-none focus:ring-2 focus:ring-[#3066be]/20 transition"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    {/* Message Veld met Voice Input */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label
                          htmlFor="message"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Waar kunnen we je mee helpen?{" "}
                          <span className="text-[#3066be]">*</span>
                        </label>

                        {/* 🔥 HIER ZIT DE MICROFOON KNOP */}
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
                        name="message"
                        required
                        placeholder="Typ of spreek je bericht in..."
                        value={form.message}
                        onChange={(e) => {
                          setForm({ ...form, message: e.target.value });
                          if (errors.message)
                            setErrors({ ...errors, message: "" });
                        }}
                        rows={5}
                        className={`w-full p-4 rounded-xl bg-gray-50 text-gray-900 border ${
                          errors.message ? "border-red-500" : "border-gray-300"
                        } focus:border-[#3066be] focus:outline-none focus:ring-2 focus:ring-[#3066be]/20 transition resize-none`}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group w-full px-8 py-4 bg-[#3066be] hover:bg-[#234a8c] text-white font-bold text-lg rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-[#3066be]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {status === "sending" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Versturen...</span>
                        </div>
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

                    {/* Trust Micro-copy */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
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
                      <span>
                        Je gegevens zijn veilig en worden nooit gedeeld.
                      </span>
                    </div>

                    {status === "ok" && (
                      <div
                        id="success-message"
                        className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fadeIn"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          ✓
                        </div>
                        <p className="text-green-700 text-sm font-medium">
                          Bedankt! We hebben je bericht ontvangen en nemen
                          binnen 24 uur contact op.
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: SIDEBAR (TRUST & PROCESS) */}
          <motion.div
            variants={fadeUp}
            className="space-y-8 lg:sticky lg:top-32"
          >
            {/* Timeline */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Wat gebeurt er hierna?
              </h3>
              <div className="space-y-8 relative">
                {/* Connecting Line */}
                <div className="absolute top-2 left-3.5 bottom-6 w-0.5 bg-gray-200" />

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-[#3066be] text-white rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-white z-10">
                    1
                  </div>
                  <h4 className="text-gray-900 font-semibold mb-1">
                    Wij analyseren je aanvraag
                  </h4>
                  <p className="text-sm text-gray-600">
                    Mark of Faissal kijkt persoonlijk naar je vraag om te zien
                    of we een match zijn.
                  </p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-white z-10 border border-gray-200">
                    2
                  </div>
                  <h4 className="text-gray-900 font-semibold mb-1">
                    Korte kennismaking
                  </h4>
                  <p className="text-sm text-gray-600">
                    We plannen een kort gesprek (15-30 min) om je processen door
                    te nemen.
                  </p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-white z-10 border border-gray-200">
                    3
                  </div>
                  <h4 className="text-gray-900 font-semibold mb-1">
                    Concreet voorstel
                  </h4>
                  <p className="text-sm text-gray-600">
                    Je ontvangt een plan van aanpak met vaste prijs en ROI
                    berekening.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="bg-[#fbfff1] border border-[#3066be]/20 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Liever direct contact?
              </h2>
              <div className="space-y-4">
                <a
                  href="mailto:contact@aifais.com"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#3066be]/50 transition group shadow-sm"
                >
                  <div className="w-10 h-10 bg-[#3066be]/10 rounded-full flex items-center justify-center text-[#3066be] group-hover:bg-[#3066be] group-hover:text-white transition">
                    ✉️
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mail ons</p>
                    <p className="text-gray-900 font-medium">
                      contact@aifais.com
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+31618424470"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#3066be]/50 transition group shadow-sm"
                >
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition">
                    📞
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bel ons</p>
                    <p className="text-gray-900 font-medium">+31 6 1842 4470</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 italic text-gray-600 text-sm leading-relaxed shadow-sm">
              "AIFAIS reageerde enorm snel. Binnen een week hadden we onze
              eerste workflow draaien die ons nu al 4 uur per week scheelt.
              Aanrader!"
              <div className="mt-4 flex items-center gap-3 not-italic">
                <div className="w-8 h-8 bg-[#3066be] rounded-full flex items-center justify-center font-bold text-white text-xs">
                  J
                </div>
                <span className="text-gray-900 font-semibold text-xs">
                  Jeroen, E-commerce eigenaar
                </span>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
