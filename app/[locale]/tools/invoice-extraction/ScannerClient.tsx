"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Zap,
  X,
  Coins,
  ArrowRight,
  CreditCard,
  Download,
  Copy,
  FileJson,
  Check,
  Upload,
  Sparkles,
  FileSpreadsheet,
  RotateCcw,
  Plus,
  File,
  Image as ImageIcon,
  ScanLine,
  Shield,
  Clock,
  TrendingUp,
  ArrowDown,
} from "lucide-react";
import CryptoModal from "@/app/Components/CryptoModal";
import { convertToCSV } from "@/utils/csv-formatter";

// --- CONFIG ---
const STRIPE_LINK_SINGLE =
  process.env.NEXT_PUBLIC_STRIPE_LINK_SINGLE ||
  "https://buy.stripe.com/test_4gM5kF3JOb2faig72R8EM00";

const SCAN_CONFIG = {
  priceSol: 0.001,
  priceEur: 0.50,
  name: "AI Factuur Scan",
};

// --- FEATURE DATA ---
const FEATURES = [
  {
    icon: ScanLine,
    title: "KvK & BTW Herkenning",
    description: "Automatische extractie van alle bedrijfsgegevens"
  },
  {
    icon: FileSpreadsheet,
    title: "Bulk Verwerking",
    description: "Tot 10 facturen tegelijk scannen"
  },
  {
    icon: Download,
    title: "Excel & CSV Export",
    description: "Direct klaar voor je boekhouding"
  },
  {
    icon: Shield,
    title: "99% Nauwkeurigheid",
    description: "Powered by Claude 3.5 Sonnet AI"
  },
];

const USE_CASES = [
  "Administratie automatiseren",
  "Boekhouding versnellen",
  "Facturen digitaliseren",
  "Gegevens extraheren",
];

export default function InvoiceScannerPage() {
  return (
    <div className="min-h-screen bg-white">
     

      {/* SCANNER SECTION */}
      <section className="relative py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScannerClient />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-4">
              Belangrijkste Features
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Alles wat je nodig hebt om facturen snel en nauwkeurig te verwerken
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="group relative bg-white border border-zinc-200 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-zinc-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-16 sm:py-24 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-8">
              Wanneer gebruik je deze tool?
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3">
              {USE_CASES.map((useCase, idx) => (
                <span 
                  key={idx}
                  className="px-5 py-2.5 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-default"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-sm font-medium text-emerald-700 mb-6">
            <Zap className="w-4 h-4" />
            Geen account nodig
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-zinc-500 mb-8">
            Upload je eerste factuur en ervaar hoe eenvoudig het is.
          </p>
          
          <a 
            href="#scanner"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Start nu
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}


// ============================================
// SCANNER CLIENT COMPONENT
// ============================================

function ScannerClient() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [isDragging, setIsDragging] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCryptoQR, setShowCryptoQR] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [scanResults, setScanResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<{
    type: "crypto" | "stripe";
    id: string;
  } | null>(null);

  // --- INIT PDF WORKER ---
  useEffect(() => {
    const initPdfWorker = async () => {
      if (typeof window !== "undefined") {
        try {
          const pdfjs = await import("pdfjs-dist");
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        } catch (e) {
          console.error(e);
        }
      }
    };
    initPdfWorker();
  }, []);

  // --- STRIPE RETURN HANDLER ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      setPaymentProof({ type: "stripe", id: sessionId });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // --- DRAG & DROP ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processNewFiles = (newFiles: File[]) => {
    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 10);
    setSelectedFiles(combinedFiles);
    setScanResults(null);
    setError(null);
    if (scanResults) setPaymentProof(null);

    newFiles.forEach(file => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({ ...prev, [file.name]: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processNewFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = selectedFiles[index];
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    if (fileToRemove) {
      const newPreviews = { ...previews };
      delete newPreviews[fileToRemove.name];
      setPreviews(newPreviews);
    }
  };

  const convertFileToBase64 = async (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        base64: (reader.result as string).split(",")[1],
        mimeType: file.type === "application/pdf" ? "application/pdf" : file.type,
      });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCopyJSON = () => {
    if (!scanResults) return;
    navigator.clipboard.writeText(JSON.stringify(scanResults, null, 2));
    setCopied("json");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadCSV = () => {
    if (!scanResults) return;
    const csv = convertToCSV(scanResults);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoices_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    if (!scanResults) return;
    const json = JSON.stringify(scanResults, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoices_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCryptoSuccess = async (signature: string) => {
    setShowCryptoQR(false);
    setShowPaymentModal(false);
    setPaymentProof({ type: "crypto", id: signature });
    await performScan({ type: "crypto", id: signature });
  };

  const performScan = async (proof: { type: "crypto" | "stripe"; id: string }) => {
    if (selectedFiles.length === 0) return;
    setIsScanning(true);
    setError(null);

    try {
      const invoices = await Promise.all(selectedFiles.map(file => convertFileToBase64(file)));
      const response = await fetch("/api/v1/finance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: proof.type === "crypto" ? proof.id : undefined,
          stripeSessionId: proof.type === "stripe" ? proof.id : undefined,
          invoices: invoices
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const isDoubleSpend = response.status === 409 || 
          data.error?.toLowerCase().includes('double spend') ||
          data.error?.toLowerCase().includes('already used');
        if (isDoubleSpend) {
          setPaymentProof(null);
          throw new Error("Deze betaling is al gebruikt. Betaal opnieuw om door te gaan.");
        }
        throw new Error(data.error || "Scan failed");
      }

      setScanResults(Array.isArray(data.data) ? data.data : [data.data]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Er is iets misgegaan bij het scannen.");
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setSelectedFiles([]);
    setPreviews({});
    setScanResults(null);
    setPaymentProof(null);
    setError(null);
  };

  const successCount = scanResults?.filter(r => r.success).length || 0;
  const failCount = scanResults?.filter(r => !r.success).length || 0;

  return (
    <div id="scanner" className="scroll-mt-8">
      {/* Main Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-zinc-900/10 border border-zinc-200/80 overflow-hidden">
        
        {/* PAYMENT MODAL */}
        {showPaymentModal && !showCryptoQR && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-zinc-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Betaalmethode</h3>
                  <p className="text-sm text-zinc-500">{selectedFiles.length} facturen scannen</p>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                <button
                  onClick={() => (window.location.href = STRIPE_LINK_SINGLE)}
                  className="group w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span>iDEAL / Card</span>
                  </div>
                  <span className="text-lg">€{SCAN_CONFIG.priceEur.toFixed(2)}</span>
                </button>

                <button
                  onClick={() => setShowCryptoQR(true)}
                  className="group w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Coins className="w-5 h-5" />
                    </div>
                    <span>Solana Pay</span>
                  </div>
                  <span className="text-lg">{SCAN_CONFIG.priceSol} SOL</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CRYPTO MODAL */}
        {showCryptoQR && (
          <CryptoModal
            priceInSol={SCAN_CONFIG.priceSol}
            scansAmount={selectedFiles.length}
            label={SCAN_CONFIG.name}
            onClose={() => { setShowCryptoQR(false); setShowPaymentModal(false); }}
            onSuccess={handleCryptoSuccess}
            priceInEur={0}
          />
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-25" />
                <div className="relative w-14 h-14 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Zap className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">AI Factuur Scanner</h2>
                <p className="text-sm text-zinc-500">Powered by Claude 3.5 Sonnet</p>
              </div>
            </div>
            
            {selectedFiles.length > 0 && !scanResults && (
              <span className="hidden sm:flex px-4 py-2 bg-zinc-100 text-zinc-600 rounded-full text-sm font-medium">
                {selectedFiles.length}/10
              </span>
            )}
            {scanResults && (
              <button onClick={reset} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors">
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Nieuw</span>
              </button>
            )}
          </div>

          {/* STATE 1: UPLOAD */}
          {selectedFiles.length === 0 && (
            <div className="space-y-6">
              {paymentProof && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-emerald-800 font-semibold">Betaling succesvol!</h3>
                    <p className="text-emerald-600 text-sm">Selecteer je facturen om te starten.</p>
                  </div>
                </div>
              )}

              <div 
                className="relative"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*, application/pdf"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className={`
                  relative h-64 sm:h-72 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                  ${isDragging ? "border-emerald-500 bg-emerald-50 scale-[1.01]" : "border-zinc-300 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-100/50"}
                `}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragging ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-400"}`}>
                    <Upload className="w-7 h-7" />
                  </div>
                  
                  <p className="text-base sm:text-lg font-semibold text-zinc-700 mb-1">
                    {isDragging ? "Laat los om te uploaden" : "Sleep facturen hierheen"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    of <span className="text-emerald-600 font-medium">klik om te bladeren</span>
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5"><File className="w-3.5 h-3.5" /> PDF</span>
                    <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> JPG, PNG</span>
                    <span>Max 10 bestanden</span>
                  </div>
                </div>
              </div>

              {!paymentProof && (
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full">
                    <Coins className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-zinc-600 font-medium">0.001 SOL / batch</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    <span className="text-sm text-zinc-600 font-medium">Claude AI</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATE 2: PREVIEW & ACTION */}
          {selectedFiles.length > 0 && !scanResults && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="group bg-zinc-50 hover:bg-zinc-100 rounded-xl p-3 border border-zinc-200 flex items-center gap-3 transition-colors">
                    <div className="w-11 h-11 bg-white border border-zinc-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {previews[file.name] ? (
                        <img src={previews[file.name]} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <FileText className="text-zinc-400 w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-900 font-medium truncate text-sm">{file.name}</p>
                      <p className="text-zinc-400 text-xs">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={() => removeFile(idx)} disabled={isScanning} className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg text-zinc-400 hover:text-red-500 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {selectedFiles.length < 10 && (
                  <div className="relative group">
                    <input type="file" onChange={handleFileChange} accept="image/*, application/pdf" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="h-full min-h-[68px] border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer">
                      <Plus className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-xs text-zinc-400 group-hover:text-emerald-600 mt-1">Toevoegen</span>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-medium text-sm">Er ging iets mis</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {!paymentProof ? (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={isScanning}
                  className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
                >
                  <span>Scan {selectedFiles.length} {selectedFiles.length === 1 ? 'factuur' : 'facturen'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => performScan(paymentProof!)}
                  disabled={isScanning}
                  className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 disabled:opacity-70"
                >
                  {isScanning ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Scannen...</span></>
                  ) : (
                    <><Zap className="w-5 h-5" /><span>Start scan</span></>
                  )}
                </button>
              )}
            </div>
          )}

          {/* STATE 3: RESULTS */}
          {scanResults && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-800">Scan voltooid!</h3>
                      <p className="text-sm text-emerald-600">{successCount} geslaagd{failCount > 0 && `, ${failCount} gefaald`}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={handleCopyJSON} className="px-3 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2">
                      {copied === "json" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">Kopieer</span>
                    </button>
                    <button onClick={handleDownloadJSON} className="px-3 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2">
                      <FileJson className="w-4 h-4" />
                      <span className="hidden sm:inline">JSON</span>
                    </button>
                    <button onClick={handleDownloadCSV} className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
                      <FileSpreadsheet className="w-4 h-4" />
                      CSV
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {scanResults.map((result, idx) => (
                  <div key={idx} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                    <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.success ? 'bg-emerald-100' : 'bg-red-100'}`}>
                          {result.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                        <span className="font-medium text-sm text-zinc-700 truncate max-w-[200px]">
                          {selectedFiles[idx]?.name || `Resultaat #${idx + 1}`}
                        </span>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${result.success ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {result.success ? 'Succes' : 'Fout'}
                      </span>
                    </div>
                    <div className="p-4">
                      {result.success ? (
                        <pre className="text-xs font-mono text-zinc-600 overflow-x-auto bg-zinc-50 rounded-lg p-3 border border-zinc-100">
                          {JSON.stringify(result.result, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-sm text-red-600">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={reset} className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Nieuwe batch scannen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}