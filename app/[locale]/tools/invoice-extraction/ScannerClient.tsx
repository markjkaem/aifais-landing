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
} from "lucide-react";
import CryptoModal from "@/app/Components/CryptoModal";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // State
  const [isScanning, setIsScanning] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCryptoQR, setShowCryptoQR] = useState(false);

  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setScanResult(null);
      setError(null); // Clear any previous error

      if (scanResult) setPaymentProof(null);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
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

  // --- SCAN LOGIC ---
  const handleCryptoSuccess = async (signature: string) => {
    setShowCryptoQR(false);
    setShowPaymentModal(false);
    setPaymentProof({ type: "crypto", id: signature });
    await performScan({ type: "crypto", id: signature });
  };

  const handleStripeContinue = async () => {
    if (paymentProof && paymentProof.type === "stripe") {
      await performScan(paymentProof);
    }
  };

  const performScan = async (proof: {
    type: "crypto" | "stripe";
    id: string;
  }) => {
    if (!selectedFile) return;

    setIsScanning(true);
    setError(null);

    try {
      const { base64, mimeType } = await convertFileToBase64(selectedFile);

      const response = await fetch("/api/v1/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: proof.type === "crypto" ? proof.id : undefined,
          stripeSessionId: proof.type === "stripe" ? proof.id : undefined,
          invoiceBase64: base64,
          mimeType: mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if this is a double-spend / replay attack error
        const isDoubleSpend = response.status === 409 || 
          data.error?.toLowerCase().includes('double spend') ||
          data.error?.toLowerCase().includes('already used');
        
        if (isDoubleSpend) {
          // Payment signature is no longer valid, user needs to pay again
          setPaymentProof(null);
          throw new Error("Deze betaling is al gebruikt. Betaal opnieuw om door te gaan.");
        }
        
        throw new Error(data.error || "Scan failed");
      }

      setScanResult(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Er is iets misgegaan bij het scannen.");
    } finally {
      setIsScanning(false);
    }
  };

  const retryWithNewFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    // Keep paymentProof so user doesn't have to pay again
  };

  const reset = () => {
    setSelectedFile(null);
    setScanResult(null);
    setPaymentProof(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl relative">
      {/* Glow Effect (Light Mode) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#3066be]/20 to-purple-500/20 rounded-[2rem] blur-2xl pointer-events-none" />

      <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-xl overflow-hidden min-h-[400px]">
        {/* PAYMENT MODAL (KEUZE) */}
        {showPaymentModal && !showCryptoQR && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-900 font-bold">Kies betaalmethode</h3>
                <button onClick={() => setShowPaymentModal(false)}>
                  <X className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <button
                onClick={() => (window.location.href = STRIPE_LINK_SINGLE)}
                className="w-full bg-[#3066be] hover:bg-[#234a8c] text-white font-bold py-4 rounded-xl flex items-center justify-between px-4 mb-3 transition shadow-lg shadow-[#3066be]/20"
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
            scansAmount={1}
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
            <div className="w-10 h-10 bg-[#3066be]/10 rounded-xl flex items-center justify-center border border-[#3066be]/20">
              <Zap className="w-5 h-5 text-[#3066be]" />
            </div>
            AI Invoice Scanner
          </h2>
          {scanResult && (
            <button
              onClick={reset}
              className="text-xs text-gray-500 hover:text-[#3066be] font-medium"
            >
              Nieuw
            </button>
          )}
        </div>

        {/* --- STATE 1: UPLOAD --- */}
        {!selectedFile && (
          <div className="animate-in fade-in duration-300">
            {/* Melding als er betaald is */}
            {paymentProof && (
              <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <h3 className="text-green-700 font-bold text-sm">
                    Betaling Succesvol!
                  </h3>
                  <p className="text-green-600 text-xs">
                    Door de beveiliging van je browser moeten we je vragen het
                    bestand nog één keer te selecteren.
                  </p>
                </div>
              </div>
            )}

            <div className="relative group cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*, application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div
                className={`h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                  paymentProof
                    ? "border-green-500/50 bg-green-50"
                    : "border-gray-300 group-hover:border-[#3066be]/50 group-hover:bg-[#3066be]/5"
                }`}
              >
                {paymentProof ? (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition group-hover:bg-[#3066be]/10">
                    <FileText className="w-8 h-8 text-gray-400 group-hover:text-[#3066be]" />
                  </div>
                )}

                <p className="text-gray-600 font-medium">
                  {paymentProof
                    ? "Selecteer bestand om te starten"
                    : "Sleep je factuur hierheen"}
                </p>
                <p className="text-xs text-gray-400 mt-2">PDF, JPG of PNG</p>
              </div>
            </div>

            {!paymentProof && (
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-green-500" />
                  Pay-per-scan ({SCAN_CONFIG.priceSol} SOL)
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#3066be]" />
                  Powered by Claude 3.5 Opus
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- STATE 2: PREVIEW & ACTION --- */}
        {selectedFile && !scanResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium truncate">
                  {selectedFile.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                disabled={isScanning}
              >
                <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* ACTIE KNOPPEN */}
            {!paymentProof ? (
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={isScanning}
                className="w-full bg-[#3066be] hover:bg-[#234a8c] text-white font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg shadow-[#3066be]/20"
              >
                <span>Scan & Pay</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => performScan(paymentProof)}
                  disabled={isScanning}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                >
                  {isScanning ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : error ? (
                    <span>Opnieuw Proberen</span>
                  ) : (
                    <span>Betaling ontvangen! Start Scan</span>
                  )}
                </button>
                {error && (
                  <button
                    onClick={retryWithNewFile}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition text-sm"
                  >
                    Ander bestand kiezen
                  </button>
                )}
              </div>
            )}

            {!paymentProof && (
              <p className="text-center text-xs text-gray-400 mt-4">
                iDEAL, Creditcard & Solana geaccepteerd.
              </p>
            )}
          </div>
        )}

        {/* --- STATE 3: RESULT --- */}
        {scanResult && (
          <div className="animate-in zoom-in-95 duration-300">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-green-700 font-bold">Scan Succesvol!</h3>
                <p className="text-xs text-green-600">
                  Betaald via:{" "}
                  {paymentProof?.type === "crypto" ? "Solana" : "Stripe"}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 relative shadow-inner">
              <pre className="text-xs font-mono text-gray-700 overflow-x-auto">
                {JSON.stringify(scanResult, null, 2)}
              </pre>
            </div>
            <button
              onClick={reset}
              className="w-full mt-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition"
            >
              Volgende Factuur
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
