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
  Check
} from "lucide-react";
import CryptoModal from "@/app/Components/CryptoModal";
import { convertToCSV } from "@/utils/csv-formatter";

// --- CONFIG ---
const STRIPE_LINK_SINGLE =
  process.env.NEXT_PUBLIC_STRIPE_LINK_SINGLE ||
  "https://buy.stripe.com/test_...";

const SCAN_CONFIG = {
  priceSol: 0.001,
  priceEur: 0.5,
  name: "AI Factuur Scan",
};

interface ScanResult {
  supplier_name?: string;
  invoice_date?: string;
  total_amount?: number;
  invoice_number?: string;
  currency?: string;
  vat_amount?: number;
  [key: string]: any;
}

export default function ScannerClient() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  // State
  const [isScanning, setIsScanning] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCryptoQR, setShowCryptoQR] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Results can now be an array or single object (backward compat)
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

  // --- BESTAND LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 10); // Max 10 files
      
      setSelectedFiles(combinedFiles);
      setScanResults(null);
      setError(null);
      if (scanResults) setPaymentProof(null);

      // Generate previews
      newFiles.forEach(file => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews(prev => ({ ...prev, [file.name]: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = selectedFiles[index];
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    // Cleanup preview
    if (fileToRemove) {
      const newPreviews = { ...previews };
      delete newPreviews[fileToRemove.name];
      setPreviews(newPreviews);
    }
  };

  const convertFileToBase64 = async (
    file: File
  ): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          base64: (reader.result as string).split(",")[1],
          mimeType:
            file.type === "application/pdf" ? "application/pdf" : file.type,
        });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // --- DOWNLOAD & COPY LOGIC ---
  const handleCopyJSON = () => {
    if (!scanResults) return;
    const json = JSON.stringify(scanResults, null, 2);
    navigator.clipboard.writeText(json);
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

  // --- SCAN LOGIC ---
  const handleCryptoSuccess = async (signature: string) => {
    setShowCryptoQR(false);
    setShowPaymentModal(false);
    setPaymentProof({ type: "crypto", id: signature });
    await performScan({ type: "crypto", id: signature });
  };

  const performScan = async (proof: {
    type: "crypto" | "stripe";
    id: string;
  }) => {
    if (selectedFiles.length === 0) return;

    setIsScanning(true);
    setError(null);

    try {
      // Process all files
      const invoices = await Promise.all(
        selectedFiles.map(file => convertFileToBase64(file))
      );

      const response = await fetch("/api/v1/finance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: proof.type === "crypto" ? proof.id : undefined,
          stripeSessionId: proof.type === "stripe" ? proof.id : undefined,
          invoices: invoices // Send array of invoices
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check for double spend
        const isDoubleSpend = response.status === 409 || 
          data.error?.toLowerCase().includes('double spend') ||
          data.error?.toLowerCase().includes('already used');
        
        if (isDoubleSpend) {
          setPaymentProof(null);
          throw new Error("Deze betaling is al gebruikt. Betaal opnieuw om door te gaan.");
        }
        
        throw new Error(data.error || "Scan failed");
      }

      // Ensure data is array
      const results = Array.isArray(data.data) ? data.data : [data.data];
      setScanResults(results);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Er is iets misgegaan bij het scannen.");
    } finally {
      setIsScanning(false);
    }
  };

  const retryWithNewFile = () => {
    setSelectedFiles([]);
    setPreviews({});
    setError(null);
  };

  const reset = () => {
    setSelectedFiles([]);
    setPreviews({});
    setScanResults(null);
    setPaymentProof(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl relative">
      <div className="relative bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden min-h-[400px]">
        {/* PAYMENT MODAL */}
        {showPaymentModal && !showCryptoQR && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-sm shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-900 font-bold">Kies betaalmethode</h3>
                <button onClick={() => setShowPaymentModal(false)}>
                  <X className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <button
                onClick={() => (window.location.href = STRIPE_LINK_SINGLE)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-between px-4 mb-3 transition shadow-md shadow-blue-600/10"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" /> iDEAL / Card
                </div>
                <span>€ {SCAN_CONFIG.priceEur.toFixed(2)}</span>
              </button>

              <button
                onClick={() => setShowCryptoQR(true)}
                className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-between px-4 transition"
              >
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-green-500" /> Solana Pay
                </div>
                <span>{SCAN_CONFIG.priceSol} SOL</span>
              </button>
            </div>
          </div>
        )}

        {/* CRYPTO MODAL */}
        {showCryptoQR && (
          <CryptoModal
            priceInSol={SCAN_CONFIG.priceSol}
            scansAmount={selectedFiles.length}
            label={SCAN_CONFIG.name}
            onClose={() => {
              setShowCryptoQR(false);
              setShowPaymentModal(false);
            }}
            onSuccess={handleCryptoSuccess}
            priceInEur={0}
          />
        )}

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            AI Invoice Scanner
            {selectedFiles.length > 0 && <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{selectedFiles.length}/10</span>}
          </h2>
          {scanResults && (
            <button onClick={reset} className="text-xs text-gray-500 hover:text-[#3066be] font-medium">Nieuw</button>
          )}
        </div>

        {/* --- STATE 1: UPLOAD --- */}
        {selectedFiles.length === 0 && (
          <div className="animate-in fade-in duration-300">
            {paymentProof && (
              <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <h3 className="text-green-700 font-bold text-sm">Betaling Succesvol!</h3>
                  <p className="text-green-600 text-xs">Selecteer je bestanden om te starten.</p>
                </div>
              </div>
            )}

            <div className="relative group cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*, application/pdf"
                multiple // Enable multiple files
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className={`h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                paymentProof ? "border-green-500/50 bg-green-50" : "border-gray-300 group-hover:border-[#3066be]/50 group-hover:bg-[#3066be]/5"
              }`}>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <FileText className={`w-8 h-8 ${paymentProof ? "text-green-600" : "text-gray-400 group-hover:text-[#3066be]"}`} />
                </div>
                <p className="text-gray-600 font-medium">
                  {paymentProof ? "Selecteer facturen (max 10)" : "Sleep facturen hierheen"}
                </p>
                <p className="text-xs text-gray-400 mt-2">PDF, JPG of PNG • Max 10 bestanden</p>
              </div>
            </div>

            {!paymentProof && (
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-green-500" />
                  0.001 SOL per batch (max 10)
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#3066be]" />
                  Claude 3.5 Sonnet
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- STATE 2: PREVIEW & ACTION --- */}
        {selectedFiles.length > 0 && !scanResults && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* File List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-[400px] overflow-y-auto p-1">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-center gap-3 relative group">
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {previews[file.name] ? (
                      <img src={previews[file.name]} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="text-gray-400 w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate text-sm">{file.name}</p>
                    <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button 
                    onClick={() => removeFile(idx)}
                    disabled={isScanning}
                    className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Add more button */}
              {selectedFiles.length < 10 && (
                 <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center min-h-[70px] hover:border-[#3066be]/50 hover:bg-[#3066be]/5 transition cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*, application/pdf"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className="text-2xl text-gray-400 font-light">+</span>
                    <span className="text-xs text-gray-500">Toevoegen</span>
                 </div>
              )}
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* ACTION BUTTONS */}
            {!paymentProof ? (
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={isScanning}
                className="w-full bg-[#3066be] hover:bg-[#234a8c] text-white font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg shadow-[#3066be]/20"
              >
                <span>Scan {selectedFiles.length} Facturen & Pay</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => performScan(paymentProof!)}
                  disabled={isScanning}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </>
                  ) : error ? (
                    <span>Opnieuw Proberen</span>
                  ) : (
                    <span>Start Bulk Scan ({selectedFiles.length})</span>
                  )}
                </button>
                 {error && (
                  <button
                    onClick={retryWithNewFile}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition text-sm"
                  >
                    Andere bestanden kiezen
                  </button>
                )}
              </div>
            )}
            
            {!paymentProof && (
               <p className="text-center text-xs text-gray-400 mt-4">
                 Betaal één keer 0.001 SOL voor de hele batch.
               </p>
             )}
          </div>
        )}

        {/* --- STATE 3: RESULTS (BULK) --- */}
        {scanResults && (
           <div className="animate-in zoom-in-95 duration-300 space-y-4">
             <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                  <div>
                    <h3 className="text-green-700 font-bold">Bulk Scan Voltooid!</h3>
                    <p className="text-xs text-green-600">
                      {scanResults.filter(r => r.success).length} geslaagd, {scanResults.filter(r => !r.success).length} gefaald
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   {/* COPY JSON */}
                   <button 
                     onClick={handleCopyJSON}
                     className="px-3 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition flex items-center gap-2"
                     title="Kopieer ruwe JSON naar klembord"
                   >
                     {copied === "json" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                     JSON
                   </button>

                   {/* DOWNLOAD JSON */}
                   <button 
                     onClick={handleDownloadJSON}
                     className="px-3 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition flex items-center gap-2"
                     title="Download JSON bestand"
                   >
                     <FileJson className="w-3 h-3" />
                     Save JSON
                   </button>

                   {/* DOWNLOAD CSV */}
                   <button 
                     onClick={handleDownloadCSV}
                     className="px-3 py-2 bg-green-600 text-white border border-green-600 rounded-lg text-xs font-medium hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
                     title="Download CSV voor Excel/Boekhouding"
                   >
                     <Download className="w-3 h-3" />
                     Download CSV
                   </button>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-4 pr-1">
                {scanResults.map((result, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <span className="font-medium text-sm text-gray-700 truncate max-w-[200px]">
                        {/* Try to find filename match or use index */}
                        {selectedFiles[idx]?.name || `Resultaat #${idx + 1}`}
                      </span>
                      {result.success ? (
                         <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Succes</span>
                      ) : (
                         <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Error</span>
                      )}
                    </div>
                    <div className="p-3 bg-gray-50/50">
                      {result.success ? (
                        <pre className="text-[10px] font-mono text-gray-600 overflow-x-auto">
                          {JSON.stringify(result.result, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-xs text-red-500">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={reset}
                className="w-full mt-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition"
              >
                Nieuwe Batch Scannen
              </button>
           </div>
        )}
      </div>
    </div>
  );
}
