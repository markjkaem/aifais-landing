"use client";

import { useState } from "react";

export default function QuickScanPage() {
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

  const isValidPhone = (phone: string) => /^\+?[0-9\s-]{8,15}$/.test(phone); // eenvoudige check

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

    // check of er errors zijn
    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    if (hasErrors) return;

    // Berekening medewerkersaantal
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

    const besparing = formData.uren * 30 * medewerkersNum * 52;
    setResult(besparing);

    // Verstuur naar backend
    setStatus("sending");
    try {
      const res = await fetch("/api/quickscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) setStatus("ok");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const workflowCost = 4500;

  return (
    <div className="bg-black min-h-screen py-14 px-6 text-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Gratis Automatisering Quickscan</h1>
        <p className="text-gray-300">
          Vul onderstaande velden in en ontdek hoeveel tijd jouw team kan
          besparen.
        </p>

        {/* Formulier: naam/email/telefoon */}
        <div className="space-y-4 text-black">
          <div>
            <input
              placeholder="Naam *"
              value={formData.naam}
              onChange={(e) =>
                setFormData({ ...formData, naam: e.target.value })
              }
              className={`p-3 rounded-xl w-full bg-gray-100 text-black ${
                errors.naam ? "border-red-500 border-2" : ""
              }`}
            />
            {errors.naam && (
              <p className="text-red-500 text-sm">{errors.naam}</p>
            )}
          </div>
          <div>
            <input
              placeholder="Email *"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`p-3 rounded-xl w-full bg-gray-100 text-black ${
                errors.email ? "border-red-500 border-2" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              placeholder="Telefoon *"
              value={formData.telefoon}
              onChange={(e) =>
                setFormData({ ...formData, telefoon: e.target.value })
              }
              className={`p-3 rounded-xl w-full bg-gray-100 text-black ${
                errors.telefoon ? "border-red-500 border-2" : ""
              }`}
            />
            {errors.telefoon && (
              <p className="text-red-500 text-sm">{errors.telefoon}</p>
            )}
          </div>
        </div>

        {/* Medewerkers */}
        <div>
          <label className="block mb-2 text-white font-medium">
            Hoeveel medewerkers kunnen tijd besparen met workflows?
          </label>
          <select
            value={formData.medewerkers}
            onChange={(e) =>
              setFormData({ ...formData, medewerkers: e.target.value })
            }
            className={`p-3 rounded-xl w-full bg-gray-100 text-black ${
              errors.medewerkers ? "border-red-500 border-2" : ""
            }`}
          >
            <option value="">Selecteer</option>
            <option value="1">1-5</option>
            <option value="6">6-20</option>
            <option value="21">21-50</option>
            <option value="51">50+</option>
          </select>
          {errors.medewerkers && (
            <p className="text-red-500 text-sm">{errors.medewerkers}</p>
          )}
        </div>

        {/* Taken */}
        <div>
          <p className="mb-2 text-white font-medium">
            Welke taken kosten jullie het meest tijd? (max 3)
          </p>
          {takenOptions.map((t) => (
            <label key={t} className="block text-white">
              <input
                type="checkbox"
                checked={formData.taken.includes(t)}
                onChange={() => handleToggleTaken(t)}
                className="mr-2 accent-purple-500"
              />
              {t}
            </label>
          ))}
          {errors.taken && (
            <p className="text-red-500 text-sm">{errors.taken}</p>
          )}
        </div>

        {/* Uren */}
        <div>
          <label className="block mb-2 text-white font-medium">
            Hoeveel uur per week kost dit gemiddeld?
          </label>
          <input
            type="range"
            min={0}
            max={40}
            value={formData.uren}
            onChange={(e) =>
              setFormData({ ...formData, uren: parseInt(e.target.value) })
            }
            className="w-full"
          />
          <p className="text-white">{formData.uren} uur/week</p>
          {errors.uren && <p className="text-red-500 text-sm">{errors.uren}</p>}
        </div>

        <button
          type="button"
          onClick={calculateBesparing}
          className="px-6 py-3 bg-purple-500 text-black rounded-xl mt-4"
        >
          Bereken mijn besparing
        </button>

        {/* Resultaat */}
        {result !== null && (
          <div className="mt-6 p-6 bg-gray-900 rounded-xl text-white space-y-4">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                Jouw team kan {formData.uren} uur per week besparen (~€
                {result.toLocaleString()}/jaar)
              </span>
              <span className="text-xs">
                *uitgegaan van minimale aantal medewerkers die u heeft gekozen
              </span>
            </div>

            <p>
              Met een workflow van €4.500 verdien je dit in ongeveer{" "}
              {((workflowCost / result) * 12).toFixed(1)} maanden terug.
            </p>

            {status === "sending" && <p className="text-white">Versturen...</p>}
            {status === "ok" && (
              <p className="text-purple-400">Bedankt! We nemen contact op.</p>
            )}
            {status === "error" && (
              <p className="text-red-500">Er ging iets mis.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
