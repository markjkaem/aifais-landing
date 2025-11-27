"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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

      if (res.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", phone: "", message: "" });

        setTimeout(() => {
          document.getElementById("success-message")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="relative bg-black min-h-screen py-20 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-purple-950/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <motion.div
        className="relative max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* Header */}
        <motion.header variants={fadeUp} className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-950/30 border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-sm font-semibold tracking-wide">
              💬 LATEN WE PRATEN
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-300 to-amber-400 bg-clip-text text-transparent">
              Klaar Om Te Starten?
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Plan een vrijblijvend gesprek van 30 minuten. We kijken samen naar
            jouw situatie en berekenen hoeveel tijd en geld je kunt besparen met
            automatisering.
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
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
              </div>
              <span>Reactie binnen 4 uur</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>100% vrijblijvend</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Geen sales pressure</span>
            </div>
          </div>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div variants={fadeUp}>
            <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-600/30 to-transparent rounded-tl-3xl blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-600/20 to-transparent rounded-br-3xl blur-2xl" />

              <div className="relative">
                <h2 className="text-3xl font-bold mb-2 text-white">
                  Stuur Een Bericht
                </h2>
                <p className="text-gray-400 mb-8">
                  Vertel ons over je situatie en we nemen zo snel mogelijk
                  contact op.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-200 mb-2"
                    >
                      Naam <span className="text-purple-400">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jan Jansen"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`w-full p-4 rounded-xl bg-zinc-950/50 text-white border ${
                        errors.name ? "border-red-500" : "border-zinc-800"
                      } focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition`}
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                        role="alert"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-200 mb-2"
                    >
                      E-mailadres <span className="text-purple-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jan@bedrijf.nl"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      className={`w-full p-4 rounded-xl bg-zinc-950/50 text-white border ${
                        errors.email ? "border-red-500" : "border-zinc-800"
                      } focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition`}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                        role="alert"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-200 mb-2"
                    >
                      Telefoonnummer{" "}
                      <span className="text-gray-500 text-xs">(optioneel)</span>
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
                      className="w-full p-4 rounded-xl bg-zinc-950/50 text-white border border-zinc-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-200 mb-2"
                    >
                      Wat wil je automatiseren?{" "}
                      <span className="text-purple-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Bijvoorbeeld: 'We krijgen dagelijks 50+ emails met vragen. Nu beantwoordt ons team alles handmatig, wat 10+ uur per week kost...'"
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message)
                          setErrors({ ...errors, message: "" });
                      }}
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                      rows={6}
                      className={`w-full p-4 rounded-xl bg-zinc-950/50 text-white border ${
                        errors.message ? "border-red-500" : "border-zinc-800"
                      } focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition resize-none`}
                    />
                    {errors.message && (
                      <p
                        id="message-error"
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                        role="alert"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.message}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        Hoe meer detail, hoe beter we je kunnen helpen
                      </p>
                      <p className="text-xs text-gray-500">
                        {form.message.length}/500
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group w-full px-8 py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-white text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                    >
                      {status === "sending" ? (
                        <>
                          <svg
                            className="animate-spin h-6 w-6"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Versturen...</span>
                        </>
                      ) : (
                        <>
                          <span>Verstuur Aanvraag</span>
                          <svg
                            className="w-6 h-6 group-hover:translate-x-1 transition-transform"
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
                        </>
                      )}
                    </button>

                    {/* Status Messages */}
                    {status === "ok" && (
                      <div
                        id="success-message"
                        className="mt-6 p-5 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-xl backdrop-blur-sm"
                        role="alert"
                      >
                        <p className="text-green-300 font-semibold flex items-center gap-3 text-lg">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-6 h-6 text-green-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span>
                            Perfect! We nemen binnen 4 uur contact op.
                          </span>
                        </p>
                      </div>
                    )}

                    {status === "error" && (
                      <div
                        className="mt-6 p-5 bg-red-900/40 border border-red-700/50 rounded-xl backdrop-blur-sm"
                        role="alert"
                      >
                        <p className="text-red-300 flex items-start gap-3">
                          <svg
                            className="w-6 h-6 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>
                            Oeps, er ging iets mis. Mail ons direct op{" "}
                            <a
                              href="mailto:contact@aifais.com"
                              className="underline font-semibold"
                            >
                              contact@aifais.com
                            </a>
                          </span>
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-6 text-center">
                      Door te versturen ga je akkoord met onze{" "}
                      <Link
                        href="/privacy"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        privacyverklaring
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={fadeUp} className="space-y-6">
            {/* Contact Info Card */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                Of Neem Direct Contact Op
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <a
                  href="mailto:contact@aifais.com"
                  className="group flex items-start gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center group-hover:bg-purple-600/30 transition">
                    <svg
                      className="w-6 h-6 text-purple-400"
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
                    <p className="font-semibold text-white mb-1">Email</p>
                    <p className="text-purple-400 group-hover:text-purple-300 transition">
                      contact@aifais.com
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reactie binnen 4 uur
                    </p>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Kantoor</p>
                    <div>
                      <Image
                        src="/office.jpg"
                        alt="Kantoor locatie"
                        width={200}
                        height={150}
                        className=" py-2 rounded-2xl"
                      />
                    </div>
                    <address className="not-italic text-gray-300 text-sm leading-relaxed">
                      Groningenweg 8
                      <br />
                      2803 PV Gouda
                      <br />
                      Nederland
                    </address>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Bereikbaar</p>
                    <p className="text-gray-300 text-sm">
                      Ma - Vr: 09:00 - 17:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-xl">
              <h3 className="font-bold text-white mb-4 text-lg">
                Eerst meer weten?
              </h3>
              <div className="space-y-3">
                <Link
                  href="/quickscan"
                  className="group block p-4 bg-gradient-to-r from-purple-950/50 to-purple-900/30 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">⚡</span>
                    <p className="font-semibold text-white group-hover:text-purple-300 transition">
                      Gratis Quickscan
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Bereken je besparing in 2 minuten
                  </p>
                </Link>

                <Link
                  href="/portfolio"
                  className="group block p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📊</span>
                    <p className="font-semibold text-white group-hover:text-purple-300 transition">
                      Bekijk Cases
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Zie wat we voor anderen hebben gebouwd
                  </p>
                </Link>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gradient-to-r from-purple-950/20 via-zinc-900/50 to-purple-950/20 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 border-2 border-black" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 border-2 border-black" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-black" />
                </div>
                <div>
                  <p className="text-white font-semibold">50+ bedrijven</p>
                  <p className="text-gray-400 text-sm">gingen je voor</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
