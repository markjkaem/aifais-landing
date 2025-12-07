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
    // Simulate API call for now - replace with actual endpoint
    try {
      // const res = await fetch("/api/contact", { ... });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake delay
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
      setStatus("error");
    }
  }

  return (
    <div className="relative bg-black min-h-screen py-20 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/10 via-transparent to-gray-950/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl" />
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
          <div className="inline-block mb-4 px-4 py-2 bg-gray-950/30 border border-gray-500/30 rounded-full">
            <span className="text-gray-300 text-sm font-semibold tracking-wide">
              💬 GRATIS ADVIESGESPREK
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-gray-300 to-amber-400 bg-clip-text text-transparent">
              Klaar Om Te Starten?
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Vul het formulier in en ontvang binnen 24 uur een concreet plan.
            Geen verplichtingen, alleen helder advies.
          </p>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* LEFT: FORM */}
          <motion.div variants={fadeUp}>
            <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-gray-500/20 rounded-3xl p-8 shadow-2xl">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-gray-600/30 to-transparent rounded-tl-3xl blur-2xl pointer-events-none" />

              <div className="relative">
                <h2 className="text-3xl font-bold mb-2 text-white">
                  Stuur Een Bericht
                </h2>
                <p className="text-gray-400 mb-8 text-sm">
                  Velden met een <span className="text-gray-400">*</span> zijn
                  verplicht.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-200 mb-2"
                    >
                      Naam <span className="text-gray-400">*</span>
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
                      className={`w-full p-4 rounded-xl bg-zinc-950/50 text-white border ${
                        errors.name ? "border-red-500" : "border-zinc-800"
                      } focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-200 mb-2"
                      >
                        E-mailadres <span className="text-gray-400">*</span>
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
                        className={`w-full p-4 rounded-xl bg-zinc-950/50 text-white border ${
                          errors.email ? "border-red-500" : "border-zinc-800"
                        } focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition`}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-200 mb-2"
                      >
                        Telefoon{" "}
                        <span className="text-gray-500 text-xs font-normal">
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
                        className="w-full p-4 rounded-xl bg-zinc-950/50 text-white border border-zinc-800 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-200 mb-2"
                    >
                      Waar kunnen we je mee helpen?{" "}
                      <span className="text-gray-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Bijvoorbeeld: 'Ik wil mijn factuurverwerking automatiseren...'"
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message)
                          setErrors({ ...errors, message: "" });
                      }}
                      rows={5}
                      className={`w-full p-4 rounded-xl bg-zinc-950/50 text-white border ${
                        errors.message ? "border-red-500" : "border-zinc-800"
                      } focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition resize-none`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group w-full px-8 py-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-300 text-white font-bold text-lg rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-gray-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                        className="mt-6 p-4 bg-green-900/30 border border-green-500/30 rounded-xl flex items-center gap-3 animate-fadeIn"
                      >
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                          ✓
                        </div>
                        <p className="text-green-300 text-sm font-medium">
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
            {/* ✅ NEW: "Hoe het werkt" Timeline */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Wat gebeurt er hierna?
              </h3>
              <div className="space-y-8 relative">
                {/* Connecting Line */}
                <div className="absolute top-2 left-3.5 bottom-6 w-0.5 bg-gray-800" />

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm ring-4 ring-black z-10">
                    1
                  </div>
                  <h4 className="text-white font-semibold mb-1">
                    Wij analyseren je aanvraag
                  </h4>
                  <p className="text-sm text-gray-400">
                    Mark of Faissal kijkt persoonlijk naar je vraag om te zien
                    of we een match zijn.
                  </p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-zinc-800 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-black z-10">
                    2
                  </div>
                  <h4 className="text-white font-semibold mb-1">
                    Korte kennismaking
                  </h4>
                  <p className="text-sm text-gray-400">
                    We plannen een kort gesprek (15-30 min) om je processen door
                    te nemen.
                  </p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-zinc-800 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-black z-10">
                    3
                  </div>
                  <h4 className="text-white font-semibold mb-1">
                    Concreet voorstel
                  </h4>
                  <p className="text-sm text-gray-400">
                    Je ontvangt een plan van aanpak met vaste prijs en ROI
                    berekening.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-gray-500/20 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">
                Liever direct contact?
              </h2>
              <div className="space-y-4">
                <a
                  href="mailto:contact@aifais.com"
                  className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-zinc-800 hover:border-gray-500/50 transition group"
                >
                  <div className="w-10 h-10 bg-gray-500/10 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-gray-500 group-hover:text-white transition">
                    ✉️
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mail ons</p>
                    <p className="text-white font-medium">contact@aifais.com</p>
                  </div>
                </a>
                <a
                  href="tel:+31618424470"
                  className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-zinc-800 hover:border-gray-500/50 transition group"
                >
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition">
                    📞
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bel ons</p>
                    <p className="text-white font-medium">+31 6 1842 4470</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Testimonial (Social Proof) */}
            <div className="bg-gray-900/10 border border-gray-500/10 rounded-2xl p-6 italic text-gray-300 text-sm leading-relaxed">
              "AIFAIS reageerde enorm snel. Binnen een week hadden we onze
              eerste workflow draaien die ons nu al 4 uur per week scheelt.
              Aanrader!"
              <div className="mt-4 flex items-center gap-3 not-italic">
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-white text-xs">
                  J
                </div>
                <span className="text-white font-semibold text-xs">
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
