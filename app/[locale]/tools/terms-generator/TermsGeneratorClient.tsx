"use client";

import { useState } from "react";
import { FileText, Loader2, Download, CheckCircle2, ChevronRight } from "lucide-react";

export default function TermsGeneratorClient() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "bv",
    industry: "",
    hasPhysicalProducts: false,
    hasDigitalProducts: false,
    hasServices: true,
    acceptsReturns: false,
    returnDays: 14,
    paymentTerms: 14,
    jurisdiction: "Nederland",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/legal/generate-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generatie mislukt");
      }

      const pdfBlob = new Blob(
        [Uint8Array.from(atob(data.data.pdfBase64), c => c.charCodeAt(0))],
        { type: "application/pdf" }
      );
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Er is iets misgegaan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `algemene_voorwaarden_${formData.companyName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    link.click();
  };

  const reset = () => {
    setPdfUrl(null);
    setError(null);
    setStep(1);
  };

  if (pdfUrl) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white border-2 border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <h3 className="text-green-700 font-bold">Algemene Voorwaarden Gegenereerd!</h3>
              <p className="text-xs text-green-600">Je document staat klaar om te downloaden.</p>
            </div>
          </div>

          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        <div className="border-2 border-slate-200 rounded-xl overflow-hidden" style={{ height: "600px" }}>
          <iframe src={pdfUrl} className="w-full h-full" title="Voorwaarden Preview" />
        </div>

        <button
          onClick={reset}
          className="w-full mt-6 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition"
        >
          Nieuwe Voorwaarden Genereren
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border-2 border-slate-200 rounded-xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        Algemene Voorwaarden Generator
      </h2>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= s ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 ${step > s ? "bg-blue-600" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* Step 1: Bedrijfsgegevens */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Bedrijfsgegevens</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bedrijfsnaam *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bijv. AIFAIS B.V."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rechtsvorm *</label>
                <select
                  value={formData.companyType}
                  onChange={(e) => handleInputChange("companyType", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bv">B.V.</option>
                  <option value="eenmanszaak">Eenmanszaak</option>
                  <option value="vof">V.O.F.</option>
                  <option value="stichting">Stichting</option>
                  <option value="vereniging">Vereniging</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Branche</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bijv. Software, E-commerce, Consultancy"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.companyName}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              Volgende Stap
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Producten & Diensten */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Wat bied je aan?</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasPhysicalProducts}
                  onChange={(e) => handleInputChange("hasPhysicalProducts", e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-medium text-slate-900">Fysieke producten</div>
                  <div className="text-sm text-slate-500">Producten die je verzendt</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasDigitalProducts}
                  onChange={(e) => handleInputChange("hasDigitalProducts", e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-medium text-slate-900">Digitale producten</div>
                  <div className="text-sm text-slate-500">Software, downloads, e-books</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasServices}
                  onChange={(e) => handleInputChange("hasServices", e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-medium text-slate-900">Diensten</div>
                  <div className="text-sm text-slate-500">Consultancy, advies, onderhoud</div>
                </div>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition"
              >
                Vorige
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                Volgende Stap
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Voorwaarden */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Voorwaarden & Beleid</h3>
            
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.acceptsReturns}
                    onChange={(e) => handleInputChange("acceptsReturns", e.target.checked)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-medium text-slate-900">Retourrecht toestaan</span>
                </label>
                
                {formData.acceptsReturns && (
                  <div className="ml-8">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Retourperiode (dagen)</label>
                    <input
                      type="number"
                      value={formData.returnDays}
                      onChange={(e) => handleInputChange("returnDays", parseInt(e.target.value))}
                      className="w-32 px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Betaaltermijn (dagen)</label>
                <input
                  type="number"
                  value={formData.paymentTerms}
                  onChange={(e) => handleInputChange("paymentTerms", parseInt(e.target.value))}
                  className="w-32 px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rechtsbevoegdheid</label>
                <select
                  value={formData.jurisdiction}
                  onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Nederland">Nederland</option>
                  <option value="België">België</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition"
              >
                Vorige
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Genereren...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Genereer Voorwaarden (Gratis)
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center mt-6">
        100% gratis • Geen account nodig • Direct downloaden
      </p>
    </div>
  );
}
