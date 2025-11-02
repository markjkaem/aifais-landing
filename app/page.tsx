"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  // Classes based on dark/light mode
  const bgClass = "bg-black";
  const textClass = "text-white";
  const accentColor = "text-purple-500"; // tertiary color

  return (
    <main
      className={`${bgClass} ${textClass} min-h-screen transition-colors duration-500`}
    >
      {/* HERO */}
      <section className="relative overflow-hidden py-6">
        <div className="container mx-auto px-18 mt-32 max-w-4xl text-center">
          <h1 className={`text-5xl md:text-6xl font-bold leading-tight`}>
            AI Consulting & Automation for <br />
            <span className={`${accentColor}`}>Future-Ready Businesses</span>
          </h1>
          <p className={`mt-6 text-lg text-gray-300`}>
            Deploy smart automation, custom AI workflows, and data-aware
            copilots. We help companies scale, innovate, and operate faster in
            2026 and beyond.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/contact"
              className={`px-6 py-3 ${accentColor} border border-green-500 font-semibold rounded-lg hover:bg-green-500 hover:text-black transition`}
            >
              Schedule Strategy Call
            </Link>
            <a
              href="#services"
              className={`px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:${accentColor} transition`}
            >
              Explore Solutions
            </a>
          </div>
        </div>
        <div>
          <Image
            src="/afais.jpg"
            alt="Hero"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full opacity-20 object-center pointer-events-none"
          />
        </div>
      </section>

      <section>
        <div className="w-full justify-center flex md:gap-32 gap-6">
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
                className={`p-8 border border-gray-700 rounded-2xl hover:shadow-xl transition`}
              >
                <h3 className="text-2xl font-semibold">{s.title}</h3>
                <p className={`mt-3 text-gray-300`}>{s.text}</p>
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
        <p className={`mt-4 text-lg text-gray-300`}>
          Let’s architect your AI advantage.
        </p>
        <Link
          href="/contact"
          className={`mt-8 inline-block px-10 py-4 ${accentColor} border border-green-500 font-semibold rounded-lg hover:bg-green-500 hover:text-black transition`}
        >
          Book a Session
        </Link>
      </section>
    </main>
  );
}
