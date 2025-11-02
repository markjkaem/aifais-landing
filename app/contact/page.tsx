"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="bg-gradient-to-br bg-black min-h-screen py-24 px-6">
      <motion.section
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h1
          variants={fadeUp}
          className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-purple-500"
        >
          Neem contact op — Vraag een offerte aan
        </motion.h1>
        <motion.p variants={fadeUp} className=" mb-12 text-center">
          Vul het formulier in en ons team neemt snel contact met je op. Samen
          zorgen we voor een schone, comfortabele en gezonde ruimte.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            required
            placeholder="Naam"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-4 rounded-xl border border-gray-300"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-4 rounded-xl border border-gray-300"
          />
          <input
            placeholder="Telefoon"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="p-4 rounded-xl border border-gray-300"
          />
          <textarea
            required
            placeholder="Bericht"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="p-4 rounded-xl border border-gray-300 col-span-1 sm:col-span-2 h-40"
          />

          <div className="sm:col-span-2 flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-black cursor-pointer font-semibold rounded-xl shadow-lg hover:scale-105 transition"
            >
              Verstuur
            </button>
            {status === "sending" && (
              <span className="text-gray-700">Versturen...</span>
            )}
            {status === "ok" && (
              <span className="text-green-600">
                Bedankt! We nemen snel contact op.
              </span>
            )}
            {status === "error" && (
              <span className="text-red-600">
                Er ging iets mis. Probeer later of mail direct.
              </span>
            )}
          </div>
        </motion.form>
      </motion.section>
    </div>
  );
}
