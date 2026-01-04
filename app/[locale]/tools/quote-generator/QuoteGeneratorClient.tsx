"use client";

import { useState } from "react";
import { FileText, Loader2, Download, CheckCircle2 } from "lucide-react";

export default function QuoteGeneratorClient() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    companyKvk: "",
    companyVat: "",
    clientName: "",
    clientAddress: "",
    projectTitle: "",
    projectDescription: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    validUntil: 30, // days
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/finance/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generatie mislukt");
      }

      // Create blob URL for PDF
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
    link.download = `offerte_${formData.projectTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    link.click();
  };

  const reset = () => {
    setPdfUrl(null);
    setError(null);
  };

  if (pdfUrl) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <h3 className="text-green-700 font-bold">Offerte Gegenereerd!</h3>
              <p className="text-xs text-green-600">Je professionele offerte staat klaar.</p>
            </div>
          </div>

          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden" style={{ height: "600px" }}>
          <iframe src={pdfUrl} className="w-full h-full" title="Offerte Preview" />
        </div>

        <button
          onClick={reset}
          className="w-full mt-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition"
        >
          Nieuwe Offerte Maken
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        Offerte Generator
      </h2>

      <div className="space-y-6">
        {/* Jouw Bedrijfsgegevens */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Jouw Bedrijfsgegevens</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Bedrijfsnaam *"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Adres"
              value={formData.companyAddress}
              onChange={(e) => handleInputChange("companyAddress", e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="KvK nummer"
              value={formData.companyKvk}
              onChange={(e) => handleInputChange("companyKvk", e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="BTW nummer"
              value={formData.companyVat}
              onChange={(e) => handleInputChange("companyVat", e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Klantgegevens */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Klantgegevens</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Klantnaam *"
              value={formData.clientName}
              onChange={(e) => handleInputChange("clientName", e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Klant adres"
              value={formData.clientAddress}
              onChange={(e) => handleInputChange("clientAddress", e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Project Details */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Project Details</h3>
          <input
            type="text"
            placeholder="Project titel *"
            value={formData.projectTitle}
            onChange={(e) => handleInputChange("projectTitle", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <textarea
            placeholder="Project omschrijving"
            value={formData.projectDescription}
            onChange={(e) => handleInputChange("projectDescription", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Items */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Onderdelen</h3>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Omschrijving"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Aantal"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                  className="w-24 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Prijs"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                  className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Onderdeel toevoegen
          </button>
        </div>

        {/* Total */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900">Totaal (excl. BTW):</span>
            <span className="text-2xl font-bold text-blue-600">€ {calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !formData.companyName || !formData.clientName || !formData.projectTitle}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Genereren...
            </>
          ) : (
            <>
              <FileText className="w-6 h-6" />
              Genereer Offerte (Gratis)
            </>
          )}
        </button>

        <p className="text-xs text-slate-400 text-center">
          100% gratis • Geen account nodig • Direct downloaden
        </p>
      </div>
    </div>
  );
}
