"use client";

import { useState } from "react";
import { FileText, Loader2, AlertTriangle, CheckCircle2, Download, X } from "lucide-react";
import CryptoModal from "@/app/Components/CryptoModal";

const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_LINK_SINGLE || "https://buy.stripe.com/test_...";

const CONFIG = {
  priceSol: 0.01,
  priceEur: 5.0,
  name: "Contract Checker",
};

export default function ContractCheckerClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCryptoQR, setShowCryptoQR] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<{ type: "crypto" | "stripe"; id: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCryptoSuccess = async (signature: string) => {
    setShowCryptoQR(false);
    setShowPaymentModal(false);
    setPaymentProof({ type: "crypto", id: signature });
    await performAnalysis({ type: "crypto", id: signature });
  };

  const performAnalysis = async (proof: { type: "crypto" | "stripe"; id: string }) => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64 = await convertToBase64(selectedFile);

      const response = await fetch("/api/v1/legal/check-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractBase64: base64,
          mimeType: selectedFile.type,
          signature: proof.type === "crypto" ? proof.id : undefined,
          stripeSessionId: proof.type === "stripe" ? proof.id : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setPaymentProof(null);
          throw new Error("Deze betaling is al gebruikt. Betaal opnieuw.");
        }
        throw new Error(data.error || "Analyse mislukt");
      }

      setResult(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Er is iets misgegaan.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadPDF = () => {
    if (!result?.pdfBase64) return;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${result.pdfBase64}`;
    link.download = `contract_analyse_${Date.now()}.pdf`;
    link.click();
  };

  const reset = () => {
    setSelectedFile(null);
    setResult(null);
    setPaymentProof(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl relative">
      <div className="relative bg-white border border-slate-200 rounded-xl p-8 shadow-sm overflow-hidden min-h-[400px]">
        {/* PAYMENT MODAL */}
        {showPaymentModal && !showCryptoQR && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-sm shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 font-bold">Kies betaalmethode</h3>
                <button onClick={() => setShowPaymentModal(false)}>
                  <X className="text-slate-400 hover:text-slate-600" />
                </button>
              </div>

              <button
                onClick={() => (window.location.href = STRIPE_LINK)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-between px-4 mb-3 transition"
              >
                <span>iDEAL / Card</span>
                <span>€ {CONFIG.priceEur.toFixed(2)}</span>
              </button>

              <button
                onClick={() => setShowCryptoQR(true)}
                className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-between px-4 transition"
              >
                <span>Solana Pay</span>
                <span>{CONFIG.priceSol} SOL</span>
              </button>
            </div>
          </div>
        )}

        {/* CRYPTO MODAL */}
        {showCryptoQR && (
          <CryptoModal
            priceInSol={CONFIG.priceSol}
            scansAmount={1}
            label={CONFIG.name}
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
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            Contract Checker
          </h2>
          {result && <button onClick={reset} className="text-xs text-slate-500 hover:text-blue-600 font-medium">Nieuw</button>}
        </div>

        {/* UPLOAD STATE */}
        {!selectedFile && !result && (
          <div className="animate-in fade-in duration-300">
            <div className="relative group cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="h-64 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center transition-all duration-300 group-hover:border-blue-500/50 group-hover:bg-blue-50/50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <FileText className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
                </div>
                <p className="text-slate-600 font-medium">Sleep je contract hierheen</p>
                <p className="text-xs text-slate-400 mt-2">PDF • Max 10 MB</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span>0.01 SOL / €5 per analyse</span>
              <span>•</span>
              <span>Claude 3.5 Sonnet</span>
            </div>
          </div>
        )}

        {/* PREVIEW & ACTION */}
        {selectedFile && !result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center gap-3 mb-6">
              <FileText className="text-slate-400 w-6 h-6" />
              <div className="flex-1">
                <p className="text-slate-900 font-medium text-sm">{selectedFile.name}</p>
                <p className="text-slate-500 text-xs">{(selectedFile.size / 1024).toFixed(0)} KB</p>
              </div>
              <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {!paymentProof ? (
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3"
              >
                Analyseer Contract & Pay
              </button>
            ) : (
              <button
                onClick={() => performAnalysis(paymentProof!)}
                disabled={isAnalyzing}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyseren...
                  </>
                ) : (
                  "Start Analyse"
                )}
              </button>
            )}
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="animate-in zoom-in-95 duration-300 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <h3 className="text-green-700 font-bold">Analyse Voltooid!</h3>
                  <p className="text-xs text-green-600">Je rapport staat klaar om te downloaden.</p>
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

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="font-bold text-slate-900 mb-3">Samenvatting</h4>
              <div className="prose prose-sm max-w-none text-slate-600">
                {result.summary && <p>{result.summary}</p>}
                {result.risks && result.risks.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-semibold text-slate-900">Gevonden Risico's:</h5>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.risks.map((risk: string, i: number) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full mt-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition"
            >
              Nieuw Contract Analyseren
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
