"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Loader2,
  Download,
  CheckCircle2,
  Building2,
  User,
  Briefcase,
  Plus,
  Trash2,
  CreditCard,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";

export default function QuoteGeneratorClient() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    companyKvk: "",
    companyVat: "",
    companyLogo: null as string | null,
    clientName: "",
    clientAddress: "",
    projectTitle: "Project Offerte",
    projectDescription: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    validUntil: 30, // days
    quoteDate: new Date().toISOString().split("T")[0],
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedData = localStorage.getItem("quote_data");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved quote data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("quote_data", JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

  // --- HANDLERS ---
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange("companyLogo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        [Uint8Array.from(atob(data.data.pdfBase64), (c) => c.charCodeAt(0))],
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
    link.download = `offerte_${formData.projectTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    link.click();
  };

  const reset = () => {
    setPdfUrl(null);
    setError(null);
  };

  // --- RENDER SUCCESS ---
  if (pdfUrl) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-2xl shadow-emerald-900/10 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Offerte Klaar!</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Je professionele offerte is succesvol gegenereerd en klaar om te versturen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={downloadPDF}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={reset}
              className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Nieuwe Maken
            </button>
          </div>

          <div className="border-4 border-slate-100 rounded-2xl overflow-hidden h-[600px] shadow-inner bg-slate-50">
            <iframe src={pdfUrl} className="w-full h-full" title="Offerte Preview" />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER EDITOR ---
  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* === LEFT COLUMN: EDITOR === */}
        <div className="space-y-6">
          
          {/* Section: Company Info */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm group hover:border-emerald-300 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Jouw Bedrijf</h3>
                <p className="text-xs text-gray-500">De afzender van de offerte</p>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden relative group hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer">
                {formData.companyLogo ? (
                  <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900">Bedrijfslogo</p>
                <p className="text-xs text-zinc-500 mt-0.5">JPG of PNG, max 2MB</p>
                {formData.companyLogo && (
                  <button
                    onClick={() => handleInputChange("companyLogo", null)}
                    className="text-xs text-red-500 mt-2 hover:underline"
                  >
                    Verwijder logo
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Bedrijfsnaam"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              />
              <input
                type="text"
                placeholder="Volledig adres"
                value={formData.companyAddress}
                onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="KvK nummer"
                    value={formData.companyKvk}
                    onChange={(e) => handleInputChange("companyKvk", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  />
                </div>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="BTW nummer"
                    value={formData.companyVat}
                    onChange={(e) => handleInputChange("companyVat", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Client & Project */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm group hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Klant & Project</h3>
                <p className="text-xs text-gray-500">Voor wie is deze offerte?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Klantnaam"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
                <input
                  type="text"
                  placeholder="Klant adres"
                  value={formData.clientAddress}
                  onChange={(e) => handleInputChange("clientAddress", e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="pt-4 border-t border-dashed border-zinc-200">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Project Details</label>
                <input
                  type="text"
                  placeholder="Project Titel (bijv. Website Ontwikkeling)"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold mb-3"
                />
                <textarea
                  placeholder="Korte omschrijving van de werkzaamheden..."
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Items */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm group hover:border-violet-300 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Onderdelen</h3>
                  <p className="text-xs text-gray-500">Wat ga je leveren?</p>
                </div>
              </div>
              <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold">
                {formData.items.length} regels
              </span>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex flex-col gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200 hover:border-violet-200 transition-all">
                  <input
                    type="text"
                    placeholder="Omschrijving dienst/product"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  />
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4">
                      <input
                        type="number"
                        placeholder="#"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-center focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div className="col-span-6 relative">
                      <span className="absolute left-3 top-2 text-zinc-400">€</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-right focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={addItem}
                className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50/50 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Regel Toevoegen
              </button>
            </div>
          </div>

        </div>

        {/* === RIGHT COLUMN: LIVE PREVIEW === */}
        <div className="flex flex-col gap-6 sticky top-8 h-fit">
          <div className="bg-white border border-zinc-200 rounded-sm shadow-xl p-8 min-h-[600px] flex flex-col relative font-sans text-sm">
            
            {/* Preview Banner */}
            <div className="absolute top-0 right-0 bg-zinc-100 text-zinc-400 text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-bl-lg">Current Preview</div>

            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                {formData.companyLogo ? (
                  <img src={formData.companyLogo} alt="Logo" className="h-12 object-contain mb-4" />
                ) : null}
                <h1 className="text-3xl font-bold text-emerald-600 tracking-tight mb-2">OFFERTE</h1>
                <p className="text-zinc-500 font-medium">#{new Date().getFullYear()}-001</p>
                <p className="text-zinc-400 text-xs mt-1">Datum: {formData.quoteDate}</p>
              </div>
              <div className="text-right">
                <h2 className="font-bold text-zinc-900 text-lg">{formData.companyName || "Jouw Bedrijf"}</h2>
                <p className="text-zinc-500 text-xs">{formData.companyAddress || "Adresgegevens"}</p>
                {formData.companyKvk && <p className="text-zinc-400 text-xs mt-1">KvK: {formData.companyKvk}</p>}
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-10 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
              <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-2">Offerte voor:</p>
              <h3 className="font-bold text-zinc-900 text-lg">{formData.clientName || "Klantnaam"}</h3>
              <p className="text-zinc-600">{formData.clientAddress || "Klant adres"}</p>
            </div>

            {/* Project Info */}
            <div className="mb-8">
              <h3 className="font-bold text-zinc-900 text-xl mb-1">{formData.projectTitle}</h3>
              <p className="text-zinc-600 leading-relaxed">{formData.projectDescription}</p>
            </div>

            {/* Items Table */}
            <div className="flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-zinc-100">
                    <th className="py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">Omschrijving</th>
                    <th className="py-2 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider w-16">Aantal</th>
                    <th className="py-2 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider w-24">Prijs</th>
                    <th className="py-2 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider w-24">Totaal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {formData.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-3 text-zinc-700 font-medium">{item.description || "..."}</td>
                      <td className="py-3 text-center text-zinc-500">{item.quantity}</td>
                      <td className="py-3 text-right text-zinc-500">{formatCurrency(item.price)}</td>
                      <td className="py-3 text-right text-zinc-900 font-medium">{formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-8 pt-4 border-t border-zinc-100 flex justify-end">
              <div className="w-1/2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-500">Subtotaal</span>
                  <span className="font-medium text-zinc-700">{formatCurrency(calculateTotal())}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-emerald-600 mt-4 pt-4 border-t border-zinc-100">
                  <span>Totaal (excl. BTW)</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-xs text-zinc-400">
              <p>Offerte geldig tot {formData.validUntil} dagen na dagtekening.</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.companyName || !formData.clientName}
            className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Bezig met genereren...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download PDF Offerte
              </>
            )}
          </button>
           {!formData.companyName && (
             <p className="text-xs text-center text-red-400 font-medium animate-pulse">
               * Vul eerst je bedrijfsnaam in om te genereren
             </p>
           )}
        </div>

      </div>
    </div>
  );
}
