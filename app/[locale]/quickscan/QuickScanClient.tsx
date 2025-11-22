"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { recentSubmissions } from "./data/Socialproofsubmissions";

export default function QuickScanClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    medewerkers: "",
    taken: [] as string[],
    uren: 0,
    naam: "",
    email: "",
    telefoon: "",
  });

  const [errors, setErrors] = useState({
    naam: "",
    email: "",
    telefoon: "",
    medewerkers: "",
    taken: "",
    uren: "",
  });

  const [result, setResult] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );

  const recentSubmissionsData = recentSubmissions;

  const [showNotification, setShowNotification] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeAgo, setTimeAgo] = useState("20 minuten");

  const getTimeAgo = (submission: any) => {
    if (!submission) return "20 minuten";
    const elapsedMinutes = Math.floor(
      (Date.now() - submission.startTime) / 60000
    );
    const totalMinutes = submission.startMinutes + elapsedMinutes;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return minutes > 0
        ? `${hours} uur en ${minutes} minuten`
        : `${hours} uur`;
    }
    return `${minutes} minuten`;
  };

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 0 && currentHour < 9) {
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * recentSubmissionsData.length
    );
    const randomMinutes = Math.floor(Math.random() * 161) + 20;

    const initialSubmission = {
      ...recentSubmissionsData[randomIndex],
      startTime: Date.now(),
      startMinutes: randomMinutes,
    };

    setSubmissions([initialSubmission]);
    setTimeAgo(getTimeAgo(initialSubmission));
    setShowNotification(true);
  }, []);

  const currentSubmission = submissions[currentIndex] || { name: "", hours: 0 };

  useEffect(() => {
    if (submissions.length === 0) return;

    const timer = setInterval(() => {
      if (currentSubmission && currentSubmission.startTime) {
        setTimeAgo(getTimeAgo(currentSubmission));
      }
    }, 6000);

    return () => clearInterval(timer);
  }, [currentSubmission, submissions.length]);

  useEffect(() => {
    if (submissions.length === 0) return;

    const addAndRotate = () => {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= 0 && currentHour < 9) {
        return;
      }

      const randomIndex = Math.floor(
        Math.random() * recentSubmissionsData.length
      );
      const randomMinutes = Math.floor(Math.random() * 161) + 20;

      const newSubmission = {
        ...recentSubmissionsData[randomIndex],
        startTime: Date.now(),
        startMinutes: randomMinutes,
      };

      setShowNotification(false);
      setTimeout(() => {
        setSubmissions((prev) => [...prev, newSubmission]);
        setCurrentIndex((prev) => prev + 1);
        setTimeAgo(getTimeAgo(newSubmission));
        setShowNotification(true);
      }, 1000);
    };

    const interval = setInterval(addAndRotate, 50000);
    return () => clearInterval(interval);
  }, [submissions.length, recentSubmissionsData]);

  const takenOptions = [
    "Offertes/facturen maken",
    "Data-invoer in systemen",
    "Lead follow-up emails",
    "Rapportages genereren",
    "Documentverwerking",
  ];

  const handleToggleTaken = (taak: string) => {
    setFormData((prev) => ({
      ...prev,
      taken: prev.taken.includes(taak)
        ? prev.taken.filter((t) => t !== taak)
        : prev.taken.length < 3
        ? [...prev.taken, taak]
        : prev.taken,
    }));
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) => /^\+?[0-9\s-]{8,15}$/.test(phone);

  const calculateBesparing = async () => {
    const newErrors = {
      naam: "",
      email: "",
      telefoon: "",
      medewerkers: "",
      taken: "",
      uren: "",
    };

    if (!formData.naam.trim()) newErrors.naam = "Vul je naam in";
    if (!formData.email.trim() || !isValidEmail(formData.email))
      newErrors.email = "Vul een geldig emailadres in";
    if (!formData.telefoon.trim() || !isValidPhone(formData.telefoon))
      newErrors.telefoon = "Vul een geldig telefoonnummer in";
    if (!formData.medewerkers)
      newErrors.medewerkers = "Selecteer aantal medewerkers";
    if (formData.taken.length === 0)
      newErrors.taken = "Selecteer minimaal 1 taak";
    if (formData.uren === 0)
      newErrors.uren = "Selecteer het aantal uur per week";

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    if (hasErrors) return;

    const medewerkersNum = (() => {
      switch (formData.medewerkers) {
        case "1":
          return 3;
        case "6":
          return 13;
        case "21":
          return 35;
        case "51":
          return 60;
        default:
          return 1;
      }
    })();

    const besparing = formData.uren * 12 * medewerkersNum * 52;
    setResult(besparing);

    setStatus("sending");
    try {
      const res = await fetch("/api/quickscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("ok");
        router.push(`/thank-you?besparing=${besparing}&uren=${formData.uren}`);
        return;
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-black min-h-screen py-14 px-6 text-white relative">
      {submissions.length > 0 && currentSubmission.name && (
        <div
          className={`fixed top-6 right-6 z-50 transition-all duration-500 hidden md:block ${
            showNotification
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          <div className="bg-gradient-to-r from-purple-900/90 to-purple-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-4 shadow-2xl max-w-xs">
            <div className="flex items-start gap-3">
              <div className="bg-purple-500 rounded-full p-2 flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">
                  {currentSubmission.name}
                </p>
                <p className="text-xs text-purple-200">
                  berekende zojuist{" "}
                  <span className="font-bold text-purple-300">
                    {currentSubmission.hours} uur
                  </span>{" "}
                  besparing
                </p>
                <p className="text-xs text-purple-300/70 mt-1">
                  {timeAgo} geleden
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-orange-400 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-bold text-orange-300">
              Beperkte Beschikbaarheid
            </p>
          </div>
          <p className="text-lg font-semibold text-white">
            Wij nemen maximaal{" "}
            <span className="text-orange-400">12 nieuwe klanten</span> per maand
            aan
          </p>
          <p className="text-sm text-gray-300 mt-1">
            December 2025:{" "}
            <span className="text-orange-400 font-semibold">
              3 plekken over
            </span>
          </p>
        </div>

        <header className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Gratis Automatisering Quickscan
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-3 font-medium">
            Ontdek in 2 minuten hoeveel tijd en geld jouw bedrijf kan besparen
            met AI workflow automatisering
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-2">
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
              Direct resultaat
            </span>
            <span className="flex items-center gap-2">
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
            <span className="flex items-center gap-2">
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
              100% gratis
            </span>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4 py-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/20 px-4">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-purple-400">
              247
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Berekeningen deze maand
            </p>
          </div>
          <div className="text-center border-x border-gray-700">
            <p className="text-3xl md:text-4xl font-bold text-purple-400">
              42 uur
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Gem. besparing/maand
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-purple-400">
              2.3 mnd
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Gemiddelde ROI
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateBesparing();
          }}
          className="space-y-6"
          aria-label="Automatisering besparing calculator"
        >
          <fieldset className="space-y-6 border-2 border-purple-500/30 rounded-2xl p-6 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
            <legend className="text-2xl font-bold text-white px-3">
              📊 Jouw Situatie
            </legend>

            <div>
              <label
                htmlFor="medewerkers"
                className="block mb-3 text-white font-semibold text-lg"
              >
                Hoeveel medewerkers kunnen tijd besparen?
              </label>
              <select
                id="medewerkers"
                name="medewerkers"
                value={formData.medewerkers}
                onChange={(e) =>
                  setFormData({ ...formData, medewerkers: e.target.value })
                }
                aria-invalid={!!errors.medewerkers}
                aria-describedby={
                  errors.medewerkers ? "medewerkers-error" : undefined
                }
                className={`p-4 rounded-xl w-full bg-white text-black font-medium text-lg ${
                  errors.medewerkers ? "border-red-500 border-2" : ""
                }`}
              >
                <option value="">👥 Selecteer aantal medewerkers</option>
                <option value="1">1-5 medewerkers</option>
                <option value="6">6-20 medewerkers</option>
                <option value="21">21-50 medewerkers</option>
                <option value="51">50+ medewerkers</option>
              </select>
              {errors.medewerkers && (
                <p
                  id="medewerkers-error"
                  className="text-red-400 text-sm mt-2 font-semibold"
                  role="alert"
                >
                  ⚠️ {errors.medewerkers}
                </p>
              )}
            </div>

            <div>
              <fieldset>
                <legend className="mb-4 text-white font-semibold text-lg">
                  Welke taken kosten het meest tijd? (max 3)
                </legend>
                <div
                  className="space-y-3"
                  role="group"
                  aria-label="Tijdrovende taken"
                >
                  {takenOptions.map((t) => (
                    <label
                      key={t}
                      className={`flex items-center text-white hover:bg-purple-900/30 p-4 rounded-xl cursor-pointer transition border-2 ${
                        formData.taken.includes(t)
                          ? "border-purple-500 bg-purple-900/20"
                          : "border-gray-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.taken.includes(t)}
                        onChange={() => handleToggleTaken(t)}
                        disabled={
                          !formData.taken.includes(t) &&
                          formData.taken.length >= 3
                        }
                        className="mr-4 accent-purple-500 w-6 h-6"
                        aria-label={t}
                      />
                      <span
                        className={`text-base ${
                          formData.taken.includes(t)
                            ? "font-bold text-purple-300"
                            : ""
                        }`}
                      >
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.taken && (
                  <p
                    className="text-red-400 text-sm mt-3 font-semibold"
                    role="alert"
                  >
                    ⚠️ {errors.taken}
                  </p>
                )}
                <div className="mt-3 text-center">
                  <span className="inline-block px-4 py-2 bg-purple-900/30 rounded-full text-purple-300 text-sm font-semibold">
                    {formData.taken.length}/3 taken geselecteerd
                  </span>
                </div>
              </fieldset>
            </div>

            <div>
              <label
                htmlFor="uren"
                className="block mb-4 text-white font-semibold text-lg"
              >
                Hoeveel uur per week kost dit gemiddeld?
              </label>
              <div className="space-y-3">
                <input
                  id="uren"
                  name="uren"
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={formData.uren}
                  onChange={(e) =>
                    setFormData({ ...formData, uren: parseInt(e.target.value) })
                  }
                  aria-valuemin={0}
                  aria-valuemax={40}
                  aria-valuenow={formData.uren}
                  aria-label="Aantal uren per week"
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>0 uur</span>
                  <div className="text-center px-6 py-3 bg-purple-500 rounded-xl">
                    <span className="text-3xl font-bold text-white">
                      {formData.uren}
                    </span>
                    <span className="text-white text-sm ml-2">uur/week</span>
                  </div>
                  <span>40 uur</span>
                </div>
              </div>
              {errors.uren && (
                <p
                  className="text-red-400 text-sm mt-2 font-semibold"
                  role="alert"
                >
                  ⚠️ {errors.uren}
                </p>
              )}
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-2 border-purple-500/30 rounded-2xl p-6 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
            <legend className="text-2xl font-bold text-white px-3">
              👤 Jouw Gegevens
            </legend>

            <p className="text-sm text-gray-300 mb-4">
              Vul je gegevens in om je persoonlijke besparingsrapport te
              ontvangen
            </p>

            <div>
              <label
                htmlFor="naam"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Naam *
              </label>
              <input
                id="naam"
                name="naam"
                type="text"
                placeholder="Bijv. Jan Jansen"
                value={formData.naam}
                onChange={(e) =>
                  setFormData({ ...formData, naam: e.target.value })
                }
                aria-invalid={!!errors.naam}
                aria-describedby={errors.naam ? "naam-error" : undefined}
                className={`p-4 rounded-xl w-full bg-white text-black placeholder:text-gray-500 font-medium ${
                  errors.naam ? "border-red-500 border-2" : ""
                }`}
              />
              {errors.naam && (
                <p
                  id="naam-error"
                  className="text-red-400 text-sm mt-1 font-semibold"
                  role="alert"
                >
                  ⚠️ {errors.naam}
                </p>
              )}
            </div>

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
                placeholder="Bijv. jan@bedrijf.nl"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`p-4 rounded-xl w-full bg-white text-black placeholder:text-gray-500 font-medium ${
                  errors.email ? "border-red-500 border-2" : ""
                }`}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-red-400 text-sm mt-1 font-semibold"
                  role="alert"
                >
                  ⚠️ {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="telefoon"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Telefoonnummer *
              </label>
              <input
                id="telefoon"
                name="telefoon"
                type="tel"
                placeholder="Bijv. 06 12345678"
                value={formData.telefoon}
                onChange={(e) =>
                  setFormData({ ...formData, telefoon: e.target.value })
                }
                aria-invalid={!!errors.telefoon}
                aria-describedby={
                  errors.telefoon ? "telefoon-error" : undefined
                }
                className={`p-4 rounded-xl w-full bg-white text-black placeholder:text-gray-500 font-medium ${
                  errors.telefoon ? "border-red-500 border-2" : ""
                }`}
              />
              {errors.telefoon && (
                <p
                  id="telefoon-error"
                  className="text-red-400 text-sm mt-1 font-semibold"
                  role="alert"
                >
                  ⚠️ {errors.telefoon}
                </p>
              )}
            </div>
          </fieldset>

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full px-8 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-transform duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Bereken mijn automatisering besparing"
            >
              {status === "sending" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
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
                  Berekenen...
                </span>
              ) : (
                "🚀 Bereken Mijn Besparing Nu →"
              )}
            </button>

            {status === "error" && (
              <div
                className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center mt-4"
                role="alert"
              >
                <p className="text-red-400 font-semibold">
                  ⚠️ Er ging iets mis. Probeer het opnieuw of neem contact op.
                </p>
              </div>
            )}

            <p className="text-center text-sm text-gray-400 mt-4">
              🔒 Door te klikken ga je akkoord met onze{" "}
              <a href="/privacy" className="text-purple-400 hover:underline">
                privacyverklaring
              </a>
            </p>
          </div>
        </form>

        <aside className="mt-12 pt-8 border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Waarom 50+ Bedrijven Ons Vertrouwen
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/20 text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">⚡</div>
              <p className="text-4xl font-bold text-purple-400 mb-2">2 weken</p>
              <p className="text-sm text-gray-300">
                Gemiddelde implementatietijd
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/20 text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">⏰</div>
              <p className="text-4xl font-bold text-purple-400 mb-2">40+ uur</p>
              <p className="text-sm text-gray-300">
                Gemiddelde besparing per maand
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/20 text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">💰</div>
              <p className="text-4xl font-bold text-purple-400 mb-2">
                3 maanden
              </p>
              <p className="text-sm text-gray-300">Gemiddelde ROI periode</p>
            </div>
          </div>
        </aside>

        <div className="mt-8 p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl">
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg
              className="w-8 h-8 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-xl font-bold text-white">
              100% Vrijblijvend & Gratis
            </h3>
          </div>
          <p className="text-center text-gray-300">
            Geen hidden costs, geen verplichtingen. Alleen een eerlijk inzicht
            in jouw besparingsmogelijkheden.
          </p>
        </div>
      </div>
    </div>
  );
}
