"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Make sure this path exists, or create a dummy data file if you haven't yet
import { recentSubmissions } from "./data/Socialproofsubmissions";

export default function QuickScanClient() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
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

  // --- SOCIAL PROOF LOGIC (The "FOMO" Popup) ---
  const recentSubmissionsData = recentSubmissions || []; // Fallback if empty
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

  // Initialize fake data logic
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 0 && currentHour < 7) return; // Don't show at night

    if (recentSubmissionsData.length > 0) {
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
    }
  }, []);

  const currentSubmission = submissions[currentIndex] || { name: "", hours: 0 };

  // Update "Time Ago" text every 6 seconds
  useEffect(() => {
    if (submissions.length === 0) return;
    const timer = setInterval(() => {
      if (currentSubmission && currentSubmission.startTime) {
        setTimeAgo(getTimeAgo(currentSubmission));
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSubmission, submissions.length]);

  // Rotate submissions
  useEffect(() => {
    if (submissions.length === 0) return;
    const addAndRotate = () => {
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
    const interval = setInterval(addAndRotate, 50000); // New notification every 50s
    return () => clearInterval(interval);
  }, [submissions.length, recentSubmissionsData]);

  // --- FORM LOGIC ---
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

    // Validation
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
    if (Object.values(newErrors).some((e) => e !== "")) return;

    // Calculation Logic
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

    const besparing = formData.uren * 12 * medewerkersNum * 52; // Simple Euro calc logic? Or Hours?
    // Assuming calculation is Eur/Year roughly? Or modify logic as needed.

    setResult(besparing);
    setStatus("sending");

    try {
      // ✅ Send to API (Make sure /api/quickscan exists or use /api/contact)
      const res = await fetch("/api/quickscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("ok");
        // ✅ Redirect to Thank You page with params
        router.push(`/thank-you?besparing=${besparing}&uren=${formData.uren}`);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 px-6">
      {/* 1. SOCIAL PROOF NOTIFICATION (Popup) */}
      {submissions.length > 0 && currentSubmission.name && (
        <div
          className={`fixed top-24 right-6 z-50 transition-all duration-500 hidden md:block ${
            showNotification
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          <div className="bg-zinc-900/90 backdrop-blur-lg border border-purple-500/30 rounded-xl p-4 shadow-2xl max-w-xs flex items-start gap-3">
            <div className="bg-purple-600 rounded-full p-2 flex-shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {currentSubmission.name}
              </p>
              <p className="text-xs text-gray-400">
                berekende zojuist{" "}
                <span className="text-purple-400 font-bold">
                  {currentSubmission.hours} uur
                </span>{" "}
                besparing
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                {timeAgo} geleden
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATS BAR (Trust Signals) */}
      <div className="grid grid-cols-3 gap-4 py-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 mb-8">
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-white">247</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
            Scans deze maand
          </p>
        </div>
        <div className="text-center border-x border-zinc-800">
          <p className="text-2xl md:text-3xl font-bold text-white">42 uur</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
            Gem. Besparing
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-white">2.3 mnd</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
            Gem. ROI
          </p>
        </div>
      </div>

      {/* 3. CALCULATOR FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateBesparing();
        }}
        className="space-y-8"
        aria-label="Automatisering besparing calculator"
      >
        {/* Step 1: Situation */}
        <fieldset className="space-y-6 border border-purple-500/20 rounded-2xl p-6 bg-zinc-900/30">
          <legend className="text-xl font-bold text-white px-2 flex items-center gap-2">
            <span>📊</span> Jouw Situatie
          </legend>

          {/* Medewerkers */}
          <div>
            <label
              htmlFor="medewerkers"
              className="block mb-3 text-gray-300 font-medium"
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
              className={`w-full p-4 rounded-xl bg-black border ${
                errors.medewerkers ? "border-red-500" : "border-zinc-700"
              } text-white focus:border-purple-500 focus:outline-none transition`}
            >
              <option value="">Selecteer aantal medewerkers...</option>
              <option value="1">1-5 medewerkers</option>
              <option value="6">6-20 medewerkers</option>
              <option value="21">21-50 medewerkers</option>
              <option value="51">50+ medewerkers</option>
            </select>
            {errors.medewerkers && (
              <p className="text-red-400 text-sm mt-2">
                ⚠️ {errors.medewerkers}
              </p>
            )}
          </div>

          {/* Taken (Checkboxes) */}
          <div>
            <span className="block mb-4 text-gray-300 font-medium">
              Welke taken kosten het meest tijd? (max 3)
            </span>
            <div className="space-y-3">
              {takenOptions.map((t) => (
                <label
                  key={t}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition border ${
                    formData.taken.includes(t)
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-zinc-800 hover:bg-zinc-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.taken.includes(t)}
                    onChange={() => handleToggleTaken(t)}
                    disabled={
                      !formData.taken.includes(t) && formData.taken.length >= 3
                    }
                    className="mr-4 accent-purple-500 w-5 h-5"
                  />
                  <span
                    className={
                      formData.taken.includes(t)
                        ? "text-white font-medium"
                        : "text-gray-400"
                    }
                  >
                    {t}
                  </span>
                </label>
              ))}
            </div>
            {errors.taken && (
              <p className="text-red-400 text-sm mt-2">⚠️ {errors.taken}</p>
            )}
          </div>

          {/* Slider (Uren) */}
          <div>
            <label
              htmlFor="uren"
              className="block mb-4 text-gray-300 font-medium"
            >
              Uren per week per medewerker aan deze taken?
            </label>
            <div className="px-2">
              <input
                id="uren"
                type="range"
                min={0}
                max={40}
                step={1}
                value={formData.uren}
                onChange={(e) =>
                  setFormData({ ...formData, uren: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-500 text-sm">0 uur</span>
              <span className="text-3xl font-bold text-white bg-purple-600 px-4 py-1 rounded-lg">
                {formData.uren}{" "}
                <span className="text-sm font-normal opacity-70">uur</span>
              </span>
              <span className="text-gray-500 text-sm">40 uur</span>
            </div>
            {errors.uren && (
              <p className="text-red-400 text-sm mt-2 text-center">
                ⚠️ {errors.uren}
              </p>
            )}
          </div>
        </fieldset>

        {/* Step 2: Contact Details */}
        <fieldset className="space-y-5 border border-purple-500/20 rounded-2xl p-6 bg-zinc-900/30">
          <legend className="text-xl font-bold text-white px-2 flex items-center gap-2">
            <span>👤</span> Waar mogen we het rapport heen sturen?
          </legend>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Naam *
            </label>
            <input
              type="text"
              placeholder="Jouw naam"
              value={formData.naam}
              onChange={(e) =>
                setFormData({ ...formData, naam: e.target.value })
              }
              className={`w-full p-4 rounded-xl bg-black border ${
                errors.naam ? "border-red-500" : "border-zinc-700"
              } text-white focus:border-purple-500 focus:outline-none transition`}
            />
            {errors.naam && (
              <p className="text-red-400 text-sm mt-1">⚠️ {errors.naam}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                E-mailadres *
              </label>
              <input
                type="email"
                placeholder="naam@bedrijf.nl"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full p-4 rounded-xl bg-black border ${
                  errors.email ? "border-red-500" : "border-zinc-700"
                } text-white focus:border-purple-500 focus:outline-none transition`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">⚠️ {errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Telefoon *
              </label>
              <input
                type="tel"
                placeholder="06 12345678"
                value={formData.telefoon}
                onChange={(e) =>
                  setFormData({ ...formData, telefoon: e.target.value })
                }
                className={`w-full p-4 rounded-xl bg-black border ${
                  errors.telefoon ? "border-red-500" : "border-zinc-700"
                } text-white focus:border-purple-500 focus:outline-none transition`}
              />
              {errors.telefoon && (
                <p className="text-red-400 text-sm mt-1">
                  ⚠️ {errors.telefoon}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="group w-full px-8 py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-white text-white font-bold text-xl rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {status === "sending" ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-white"
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
                <span>Bezig met berekenen...</span>
              </>
            ) : (
              <>
                <span>Bereken Mijn Besparing</span>
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

          {status === "error" && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-center mt-4 text-red-200">
              ⚠️ Er ging iets mis. Probeer het opnieuw of mail ons direct.
            </div>
          )}

          <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Je gegevens worden veilig verwerkt via SSL.
          </p>
        </div>
      </form>
    </div>
  );
}
