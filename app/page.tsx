"use client";
import { useState } from "react";

export default function Home() {
  const [dark, setDark] = useState(true);

  // Classes based on dark/light mode
  const bgClass = dark ? "bg-black" : "bg-white";
  const textClass = dark ? "text-white" : "text-black";
  const secondaryText = dark ? "text-gray-300" : "text-gray-700";
  const borderColor = dark ? "border-gray-700" : "border-gray-300";
  const accentColor = "text-purple-500"; // tertiary color

  return (
    <main
      className={`${bgClass} ${textClass} min-h-screen transition-colors duration-500`}
    >
      {/* HERO */}
      <section className="relative overflow-hidden py-6">
        <header className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Faiss</h1>
          <nav className="space-x-6">
            <a
              href="#services"
              className={`${secondaryText} hover:${accentColor} transition`}
            >
              Services
            </a>
            <a
              href="/contact"
              className={`${secondaryText} hover:${accentColor} transition`}
            >
              Contact
            </a>
          </nav>
        </header>

        <div className="container mx-auto px-6 mt-32 max-w-4xl text-center">
          <h1 className={`text-5xl md:text-6xl font-bold leading-tight`}>
            AI Consulting & Automation for <br />
            <span className={`${accentColor}`}>Future-Ready Businesses</span>
          </h1>
          <p className={`mt-6 text-lg ${secondaryText}`}>
            Deploy smart automation, custom AI workflows, and data-aware
            copilots. We help companies scale, innovate, and operate faster in
            2026 and beyond.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/contact"
              className={`px-6 py-3 ${accentColor} border border-green-500 font-semibold rounded-lg hover:bg-green-500 hover:text-black transition`}
            >
              Schedule Strategy Call
            </a>
            <a
              href="#services"
              className={`px-6 py-3 border ${borderColor} rounded-lg ${secondaryText} hover:${accentColor} transition`}
            >
              Explore Solutions
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="w-screen justify-center flex md:gap-32 gap-6">
          {" "}
          <img
            src="/logo-1.webp"
            alt="Description of image"
            className="md:w-40 w-14 h-auto invert"
          />
          <img
            src="/logo-1.webp"
            alt="Description of image"
            className="md:w-40 w-14 h-auto invert"
          />
          <img
            src="/logo-1.webp"
            alt="Description of image"
            className="md:w-40 w-14 h-auto invert"
          />
          <img
            src="/logo-1.webp"
            alt="Description of image"
            className="md:w-40 w-14 h-auto invert"
          />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-14">
            What We Build
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Strategy & Advisory",
                text: "Executive-level AI roadmaps, technical review & deployment plans.",
              },
              {
                title: "End-to-End Automation",
                text: "Automated workflows across sales, operations, support & finance.",
              },
              {
                title: "Custom AI Agents",
                text: "Data-aware agents integrated with your stack and real-world tools.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className={`p-8 border ${borderColor} rounded-2xl hover:shadow-xl transition`}
              >
                <h3 className="text-2xl font-semibold">{s.title}</h3>
                <p className={`mt-3 ${secondaryText}`}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold">
          Ready to future-proof your business?
        </h2>
        <p className={`mt-4 text-lg ${secondaryText}`}>
          Let’s architect your AI advantage.
        </p>
        <a
          href="/contact"
          className={`mt-8 inline-block px-10 py-4 ${accentColor} border border-green-500 font-semibold rounded-lg hover:bg-green-500 hover:text-black transition`}
        >
          Book a Session
        </a>
      </section>
    </main>
  );
}
