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
  Code,
} from "lucide-react";
import CryptoModal from "@/app/Components/CryptoModal";

// --- CONFIG ---
// Vul hier je Stripe Payment Link in voor 1 scan
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
  // Checkt of de gebruiker terugkomt van Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      // We hebben betaald via Stripe!
      setPaymentProof({ type: "stripe", id: sessionId });
      // Haal de params weg uit de URL voor netheid
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // --- BESTAND LOGICA ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setScanResult(null);
      setError(null);

      // Reset payment proof NIET als het Stripe is (want die page reload is net geweest)
      // Maar wel als je een nieuw bestand kiest na een scan.
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

  // --- SCAN LOGICA ---
  const handleCryptoSuccess = async (signature: string) => {
    setShowCryptoQR(false);
    setShowPaymentModal(false);
    setPaymentProof({ type: "crypto", id: signature });
    await performScan({ type: "crypto", id: signature });
  };

  // Deze wordt aangeroepen als er al een Stripe ID is (bij page load)
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

      // Stuur naar de Backend
      const response = await fetch("/api/agent/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // We sturen OF een signature (Crypto) OF een sessionId (Stripe)
          signature: proof.type === "crypto" ? proof.id : undefined,
          stripeSessionId: proof.type === "stripe" ? proof.id : undefined,
          invoiceBase64: base64,
          mimeType: mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
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

  const reset = () => {
    setSelectedFile(null);
    setScanResult(null);
    setPaymentProof(null);
    setPreviewUrl(null);
  };

  return (
    <div className="w-full max-w-2xl relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-600 rounded-[2rem] blur-2xl opacity-20 pointer-events-none" />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden min-h-[400px]">
        {/* PAYMENT MODAL (KEUZE) */}
        {showPaymentModal && !showCryptoQR && (
          <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold">Kies betaalmethode</h3>
                <button onClick={() => setShowPaymentModal(false)}>
                  <X className="text-gray-500 hover:text-white" />
                </button>
              </div>

              <button
                onClick={() => (window.location.href = STRIPE_LINK_SINGLE)}
                className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl flex items-center justify-between px-4 mb-3 transition"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" /> iDEAL / Card
                </div>
                <span>€ {SCAN_CONFIG.priceEur.toFixed(2)}</span>
              </button>

              <button
                onClick={() => setShowCryptoQR(true)}
                className="w-full bg-[#14F195]/10 border border-[#14F195]/50 hover:bg-[#14F195]/20 text-[#14F195] font-bold py-4 rounded-xl flex items-center justify-between px-4 transition"
              >
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5" /> Solana Pay
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
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600/20 rounded-xl flex items-center justify-center border border-gray-500/30">
              <Zap className="w-5 h-5 text-gray-400" />
            </div>
            AI Invoice Scanner
          </h2>
          {scanResult && (
            <button
              onClick={reset}
              className="text-xs text-gray-500 hover:text-white"
            >
              Nieuw
            </button>
          )}
        </div>

        {/* --- STATE 1: UPLOAD --- */}
        {!selectedFile && (
          <div className="animate-in fade-in duration-300">
            {/* 🔥 NIEUW: Melding als er betaald is maar bestand weg is */}
            {paymentProof && (
              <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                <div>
                  <h3 className="text-green-400 font-bold text-sm">
                    Betaling Succesvol!
                  </h3>
                  <p className="text-gray-400 text-xs">
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
                    ? "border-green-500/50 bg-green-900/5" // Groene gloed als betaald is
                    : "border-white/10 group-hover:border-gray-500/50 group-hover:bg-gray-900/5"
                }`}
              >
                {paymentProof ? (
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-green-400" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <FileText className="w-8 h-8 text-gray-400 group-hover:text-gray-400" />
                  </div>
                )}

                <p className="text-gray-300 font-medium">
                  {paymentProof
                    ? "Selecteer bestand om te starten"
                    : "Sleep je factuur hierheen"}
                </p>
                <p className="text-xs text-gray-500 mt-2">PDF, JPG of PNG</p>
              </div>
            </div>

            {/* Verberg de prijzen als er al betaald is */}
            {!paymentProof && (
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#14F195]" />
                  Pay-per-scan ({SCAN_CONFIG.priceSol} SOL)
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Powered by Claude 4.5 Opus
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- STATE 2: PREVIEW & ACTION --- */}
        {selectedFile && !scanResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-black/50 rounded-lg flex items-center justify-center overflow-hidden">
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
                <p className="text-white font-medium truncate">
                  {selectedFile.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                disabled={isScanning}
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* ACTIE KNOPPEN */}
            {!paymentProof ? (
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={isScanning}
                className="w-full bg-white hover:bg-gray-200 text-black font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3"
              >
                <span>Scan & Pay</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              /* Er is al betaald (bijv terug van Stripe) */
              <button
                onClick={
                  paymentProof.type === "stripe"
                    ? handleStripeContinue
                    : () => {}
                }
                disabled={isScanning}
                className="w-full bg-[#14F195] hover:bg-[#10c479] text-black font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3"
              >
                {isScanning ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span>Betaling ontvangen! Start Scan</span>
                )}
              </button>
            )}

            {!paymentProof && (
              <p className="text-center text-xs text-gray-500 mt-4">
                iDEAL, Creditcard & Solana geaccepteerd.
              </p>
            )}
          </div>
        )}

        {/* --- STATE 3: RESULT --- */}
        {scanResult && (
          <div className="animate-in zoom-in-95 duration-300">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-green-400 font-bold">Scan Succesvol!</h3>
                <p className="text-xs text-green-400/70">
                  Betaald via:{" "}
                  {paymentProof?.type === "crypto" ? "Solana" : "Stripe"}
                </p>
              </div>
            </div>
            <div className="bg-black/50 rounded-xl border border-white/10 p-4 relative">
              <pre className="text-xs font-mono text-gray-300 overflow-x-auto">
                {JSON.stringify(scanResult, null, 2)}
              </pre>
            </div>
            <button
              onClick={reset}
              className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition"
            >
              Volgende Factuur
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
