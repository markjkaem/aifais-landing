"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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

  // ✅ VALIDATION
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

        // ✅ SCROLL TO SUCCESS MESSAGE
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
    <div className="bg-black min-h-screen py-14 px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* ✅ IMPROVED: Header met keywords */}
        <motion.header variants={fadeUp} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Neem Contact Op
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Klaar om 40+ uur per maand te besparen? Vraag een gratis
            haalbaarheidscheck aan en ontdek hoe n8n workflow automatisering
            jouw bedrijf kan transformeren.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
            <span className="flex items-center gap-2 text-gray-400">
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
              Reactie binnen 24 uur
            </span>
            <span className="flex items-center gap-2 text-gray-400">
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
              Geen verplichtingen
            </span>
            <span className="flex items-center gap-2 text-gray-400">
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
              Gratis consult
            </span>
          </div>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ✅ IMPROVED: Form met betere labels en validation */}
          <motion.div variants={fadeUp}>
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Vraag een Gratis Haalbaarheidscheck Aan
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Naam *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Bijv. Jan Jansen"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`w-full p-4 rounded-xl bg-gray-800 text-white border ${
                      errors.name ? "border-red-500" : "border-gray-700"
                    } focus:border-purple-500 focus:outline-none transition`}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className="text-red-400 text-sm mt-1"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    E-mailadres *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Bijv. jan@bedrijf.nl"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full p-4 rounded-xl bg-gray-800 text-white border ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    } focus:border-purple-500 focus:outline-none transition`}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-red-400 text-sm mt-1"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Telefoonnummer (optioneel)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Bijv. 06 12345678"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Bericht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Vertel ons over je automatiseringsvraag..."
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    rows={5}
                    className={`w-full p-4 rounded-xl bg-gray-800 text-white border ${
                      errors.message ? "border-red-500" : "border-gray-700"
                    } focus:border-purple-500 focus:outline-none transition resize-none`}
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="text-red-400 text-sm mt-1"
                      role="alert"
                    >
                      {errors.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {form.message.length}/500 karakters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-400 text-black font-bold text-lg rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {status === "sending" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
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
                        Versturen...
                      </span>
                    ) : (
                      "Verstuur Aanvraag →"
                    )}
                  </button>

                  {/* Status Messages */}
                  {status === "ok" && (
                    <div
                      id="success-message"
                      className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-xl"
                      role="alert"
                    >
                      <p className="text-green-400 font-semibold flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Bedankt! We nemen binnen 24 uur contact op.
                      </p>
                    </div>
                  )}

                  {status === "error" && (
                    <div
                      className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-xl"
                      role="alert"
                    >
                      <p className="text-red-400">
                        Er ging iets mis. Probeer het opnieuw of mail direct
                        naar{" "}
                        <a
                          href="mailto:contact@aifais.com"
                          className="underline"
                        >
                          contact@aifais.com
                        </a>
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Door te versturen ga je akkoord met onze{" "}
                    <Link
                      href="/privacy"
                      className="text-purple-400 hover:underline"
                    >
                      privacyverklaring
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>

          {/* ✅ IMPROVED: Contact Info + Map */}
          <motion.div variants={fadeUp} className="space-y-6">
            {/* Building Image */}
            <div className="rounded-2xl overflow-hidden border border-gray-800">
              <img
                src="/building.jpg"
                alt="Aifais kantoor in Gouda - n8n workflow automatisering specialist"
                width={600}
                height={400}
                loading="lazy"
                className="w-full object-cover h-80"
              />
            </div>

            {/* Contact Details */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white">Contactgegevens</h2>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-400"
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
                  <p className="font-semibold text-white">Adres</p>
                  <address className="not-italic text-gray-300 text-sm">
                    Kampenringweg 45D
                    <br />
                    2803 PE Gouda
                    <br />
                    Zuid-Holland, Nederland
                  </address>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-400"
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
                  <p className="font-semibold text-white">Email</p>
                  <a
                    href="mailto:contact@aifais.com"
                    className="text-purple-400 hover:underline text-sm"
                  >
                    contact@aifais.com
                  </a>
                </div>
              </div>

              {/* Phone (if you want to add it) */}
              {/* <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Telefoon</p>
                  <a 
                    href="tel:+31XXXXXXXXX" 
                    className="text-purple-400 hover:underline text-sm"
                  >
                    +31 (0)XX XXX XXXX
                  </a>
                </div>
              </div> */}

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-400"
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
                  <p className="font-semibold text-white">Bereikbaar</p>
                  <p className="text-gray-300 text-sm">
                    Ma - Vr: 09:00 - 17:00
                    <br />
                    <span className="text-xs text-gray-500">
                      Reactie binnen 24 uur
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ NEW: Quick Links */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">
                Liever eerst meer informatie?
              </h3>
              <div className="space-y-3">
                <Link
                  href="/quickscan"
                  className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                >
                  <p className="font-semibold text-purple-400">
                    Gratis Quickscan
                  </p>
                  <p className="text-sm text-gray-400">
                    Bereken je besparing in 2 minuten
                  </p>
                </Link>
                <Link
                  href="/portfolio"
                  className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                >
                  <p className="font-semibold text-purple-400">Bekijk Cases</p>
                  <p className="text-sm text-gray-400">
                    Zie wat we voor anderen hebben gebouwd
                  </p>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
