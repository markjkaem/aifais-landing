"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    const besparing = formData.uren * 30 * medewerkersNum * 52;
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
    <div className="bg-black min-h-screen py-14 px-6 text-white">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ✅ IMPROVED: Proper H1 with keywords */}
        <header>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Gratis Automatisering Quickscan
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-2">
            Ontdek in 2 minuten hoeveel tijd en geld jouw bedrijf kan besparen
            met n8n workflow automatisering
          </p>
          <p className="text-sm text-gray-400">
            ✓ Direct resultaat • ✓ Geen verplichtingen • ✓ 100% gratis
          </p>
        </header>

        {/* ✅ IMPROVED: Semantic form with proper structure */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateBesparing();
          }}
          className="space-y-6"
          aria-label="Automatisering besparing calculator"
        >
          {/* ✅ IMPROVED: Fieldset for contact info */}
          <fieldset className="space-y-4 border border-gray-800 rounded-xl p-6">
            <legend className="text-xl font-semibold text-white px-2">
              Jouw Contactgegevens
            </legend>

            <div>
              <label
                htmlFor="naam"
                className="block text-sm font-medium text-gray-300 mb-1"
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
                className={`p-3 rounded-xl w-full bg-gray-100 text-black placeholder:text-gray-500 ${
                  errors.naam ? "border-red-500 border-2" : ""
                }`}
              />
              {errors.naam && (
                <p
                  id="naam-error"
                  className="text-red-400 text-sm mt-1"
                  role="alert"
                >
                  {errors.naam}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
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
                className={`p-3 rounded-xl w-full bg-gray-100 text-black placeholder:text-gray-500 ${
                  errors.email ? "border-red-500 border-2" : ""
                }`}
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

            <div>
              <label
                htmlFor="telefoon"
                className="block text-sm font-medium text-gray-300 mb-1"
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
                className={`p-3 rounded-xl w-full bg-gray-100 text-black placeholder:text-gray-500 ${
                  errors.telefoon ? "border-red-500 border-2" : ""
                }`}
              />
              {errors.telefoon && (
                <p
                  id="telefoon-error"
                  className="text-red-400 text-sm mt-1"
                  role="alert"
                >
                  {errors.telefoon}
                </p>
              )}
            </div>
          </fieldset>

          {/* ✅ IMPROVED: Fieldset for business info */}
          <fieldset className="space-y-6 border border-gray-800 rounded-xl p-6">
            <legend className="text-xl font-semibold text-white px-2">
              Jouw Situatie
            </legend>

            {/* Medewerkers */}
            <div>
              <label
                htmlFor="medewerkers"
                className="block mb-2 text-white font-medium"
              >
                Hoeveel medewerkers kunnen tijd besparen met workflows?
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
                className={`p-3 rounded-xl w-full bg-gray-100 text-black ${
                  errors.medewerkers ? "border-red-500 border-2" : ""
                }`}
              >
                <option value="">Selecteer aantal medewerkers</option>
                <option value="1">1-5 medewerkers</option>
                <option value="6">6-20 medewerkers</option>
                <option value="21">21-50 medewerkers</option>
                <option value="51">50+ medewerkers</option>
              </select>
              {errors.medewerkers && (
                <p
                  id="medewerkers-error"
                  className="text-red-400 text-sm mt-1"
                  role="alert"
                >
                  {errors.medewerkers}
                </p>
              )}
            </div>

            {/* Taken */}
            <div>
              <fieldset>
                <legend className="mb-3 text-white font-medium">
                  Welke taken kosten jullie het meest tijd? (selecteer max 3)
                </legend>
                <div
                  className="space-y-2"
                  role="group"
                  aria-label="Tijdrovende taken"
                >
                  {takenOptions.map((t) => (
                    <label
                      key={t}
                      className="flex items-center text-white hover:bg-gray-900 p-2 rounded-lg cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.taken.includes(t)}
                        onChange={() => handleToggleTaken(t)}
                        disabled={
                          !formData.taken.includes(t) &&
                          formData.taken.length >= 3
                        }
                        className="mr-3 accent-purple-500 w-5 h-5"
                        aria-label={t}
                      />
                      <span
                        className={
                          formData.taken.includes(t) ? "font-semibold" : ""
                        }
                      >
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.taken && (
                  <p className="text-red-400 text-sm mt-2" role="alert">
                    {errors.taken}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  {formData.taken.length}/3 taken geselecteerd
                </p>
              </fieldset>
            </div>

            {/* Uren */}
            <div>
              <label
                htmlFor="uren"
                className="block mb-3 text-white font-medium"
              >
                Hoeveel uur per week kost dit gemiddeld?
              </label>
              <div className="space-y-2">
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
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>0 uur</span>
                  <span className="text-2xl font-bold text-purple-400">
                    {formData.uren} uur/week
                  </span>
                  <span>40 uur</span>
                </div>
              </div>
              {errors.uren && (
                <p className="text-red-400 text-sm mt-1" role="alert">
                  {errors.uren}
                </p>
              )}
            </div>
          </fieldset>

          {/* ✅ IMPROVED: Better CTA button with status */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-400 text-black font-bold text-lg rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Bereken mijn automatisering besparing"
            >
              {status === "sending" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                "Bereken Mijn Besparing →"
              )}
            </button>

            {status === "error" && (
              <p className="text-red-400 text-center mt-3" role="alert">
                Er ging iets mis. Probeer het opnieuw of neem contact op.
              </p>
            )}

            <p className="text-center text-sm text-gray-400 mt-4">
              Door te klikken ga je akkoord met onze{" "}
              <a href="/privacy" className="text-purple-400 hover:underline">
                privacyverklaring
              </a>
            </p>
          </div>
        </form>

        {/* ✅ NEW: Trust signals */}
        <aside className="mt-12 pt-8 border-t border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Waarom Meer Dan 50+ Bedrijven Ons Vertrouwen
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-gray-900 rounded-xl">
              <p className="text-3xl font-bold text-purple-400 mb-2">2 weken</p>
              <p className="text-sm text-gray-300">
                Gemiddelde implementatietijd
              </p>
            </div>
            <div className="p-4 bg-gray-900 rounded-xl">
              <p className="text-3xl font-bold text-purple-400 mb-2">40+ uur</p>
              <p className="text-sm text-gray-300">
                Gemiddelde besparing per maand
              </p>
            </div>
            <div className="p-4 bg-gray-900 rounded-xl">
              <p className="text-3xl font-bold text-purple-400 mb-2">
                3 maanden
              </p>
              <p className="text-sm text-gray-300">Gemiddelde ROI periode</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
