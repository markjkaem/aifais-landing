"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { X, CheckCircle2, Loader2, ExternalLink, Copy } from "lucide-react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

interface CryptoModalProps {
  priceInSol: number;
  priceInEur: number; // ✅ Toegevoegd voor backend verificatie
  scansAmount: number;
  label: string;
  onClose: () => void;
  onSuccess: (signature: string, reference: string) => void;
}

export default function CryptoModal({
  priceInSol,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  priceInEur,
  scansAmount,
  label,
  onClose,
  onSuccess,
}: CryptoModalProps) {
  const [solanaPayUrl, setSolanaPayUrl] = useState<string>("");
  const [referenceKey, setReferenceKey] = useState<string>("");
  const [isPolling, setIsPolling] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string>("");
  const [copied, setCopied] = useState(false);
  // ✅ Timestamp wanneer modal opent
  // eslint-disable-next-line react-hooks/purity
  const [startTime] = useState<number>(Date.now());
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Genereer de Solana Pay URL bij mount
  useEffect(() => {
    const generatePaymentUrl = () => {
      const recipient = process.env.NEXT_PUBLIC_SOLANA_WALLET;
      if (!recipient) {
        console.error("❌ NEXT_PUBLIC_SOLANA_WALLET niet geconfigureerd");
        return;
      }

      // Genereer unieke reference key (deze wordt later gebruikt voor verificatie)
      const reference = PublicKey.unique().toString();
      setReferenceKey(reference);

      // Bouw de Solana Pay URL volgens spec:
      // solana:<recipient>?amount=<amount>&reference=<reference>&label=<label>&message=<message>
      const params = new URLSearchParams({
        amount: priceInSol.toString(),
        reference: reference,
        label: `AIFAIS - ${label}`,
        message: `Koop ${scansAmount} scan credits`,
      });

      const payUrl = `solana:${recipient}?${params.toString()}`;
      setSolanaPayUrl(payUrl);
    };

    generatePaymentUrl();
  }, [priceInSol, label, scansAmount]);

  // ✅ Poll de blockchain voor de transactie
  useEffect(() => {
    if (!referenceKey || isPaid) return;

    const pollForTransaction = async () => {
      try {
        const connection = new Connection(
          process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta")
        );
        const referencePublicKey = new PublicKey(referenceKey);

        // Zoek transacties met deze reference key
        const signatures = await connection.getSignaturesForAddress(
          referencePublicKey,
          { limit: 5 } // Haal laatste 5 op
        );

        if (signatures.length > 0) {
          // ✅ FILTER: Alleen transacties NA modal opening
          const recentSignatures = signatures.filter((sig) => {
            const txTime = (sig.blockTime || 0) * 1000; // Blockchain tijd in ms
            return txTime > startTime; // Moet NA modal opening zijn
          });

          if (recentSignatures.length === 0) {
            // Nog geen nieuwe transactie gevonden
            return;
          }

          const signature = recentSignatures[0].signature;

          // Verifieer dat de transactie succesvol was
          const tx = await connection.getTransaction(signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx || tx.meta?.err) {
            // Transactie bestaat niet of is gefaald
            return;
          }

          // ✅ Extra check: Verifieer dat het juiste bedrag is betaald
          const recipientKey = new PublicKey(
            process.env.NEXT_PUBLIC_SOLANA_WALLET!
          );
          const accountKeys = tx.transaction.message.getAccountKeys();
          const recipientIndex = accountKeys.staticAccountKeys.findIndex(
            (key) => key.equals(recipientKey)
          );

          if (recipientIndex === -1) {
            console.warn("Recipient niet gevonden in transactie");
            return;
          }

          const postBalance = tx.meta?.postBalances[recipientIndex] || 0;
          const preBalance = tx.meta?.preBalances[recipientIndex] || 0;
          const amountReceivedLamports = postBalance - preBalance;
          const amountReceivedSol = amountReceivedLamports / 1e9;

          // Check of het bedrag klopt (met 10% marge voor fees)
          const minExpected = priceInSol * 0.9;
          if (amountReceivedSol < minExpected) {
            console.warn(
              `Bedrag te laag: verwacht ${priceInSol}, ontvangen ${amountReceivedSol}`
            );
            return;
          }

          // ✅ Alles klopt! Betaling gevonden en geverifieerd
          setIsPaid(true);
          setTransactionSignature(signature);
          setIsPolling(false);

          // Stop polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          // Wacht 2 seconden en redirect
          setTimeout(() => {
            onSuccess(signature, referenceKey);
          }, 2000);
        }
      } catch (error) {
        console.error("Polling error:", error);
        // Continue polling bij errors
      }
    };

    // Start polling na 5 seconden (gebruiker moet eerst QR scannen)
    const startPollingTimeout = setTimeout(() => {
      setIsPolling(true);
      pollForTransaction(); // Eerste check meteen

      // Poll elke 3 seconden
      pollingIntervalRef.current = setInterval(pollForTransaction, 3000);
    }, 5000);

    // Cleanup
    return () => {
      clearTimeout(startPollingTimeout);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [referenceKey, isPaid, onSuccess, startTime, priceInSol]);

  const copyToClipboard = () => {
    if (solanaPayUrl) {
      navigator.clipboard.writeText(solanaPayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const viewOnExplorer = () => {
    if (transactionSignature) {
      window.open(
        `https://explorer.solana.com/tx/${transactionSignature}`,
        "_blank"
      );
    }
  };

  // Use portal to render at document.body level
  if (typeof window === "undefined") return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm sm:max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 sm:p-8 relative my-auto">
        {/* Close button */}
        {!isPaid && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Success state */}
        {isPaid ? (
          <div className="text-center py-4 sm:py-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-green-500/20">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
            </div>
            <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
              Betaling Ontvangen!
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
              Je wordt doorgestuurd naar de scanner...
            </p>
            {transactionSignature && (
              <button
                onClick={viewOnExplorer}
                className="text-gray-400 hover:text-gray-300 text-xs sm:text-sm flex items-center gap-2 justify-center mx-auto"
              >
                Bekijk transactie
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-white font-bold text-base sm:text-lg mb-1">
                Solana Pay - {label}
              </h3>
              <div className="text-2xl sm:text-3xl font-bold text-[#14F195] font-mono mb-2">
                {priceInSol} SOL
              </div>
              <p className="text-gray-500 text-xs">
                Scan de QR-code met je Solana wallet
              </p>
            </div>

            {/* QR Code - responsive container */}
            {solanaPayUrl ? (
              <div className="flex justify-center mb-4 px-2">
                <div
                  className="bg-white rounded-xl flex-shrink-0 p-3 sm:p-4"
                  style={{
                    width: 'min(220px, calc(100vw - 80px))',
                    height: 'min(220px, calc(100vw - 80px))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <QRCodeSVG
                    value={solanaPayUrl}
                    size={180}
                    level="H"
                    includeMargin={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '180px',
                      maxHeight: '180px'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white/5 h-[200px] rounded-xl flex items-center justify-center mb-4 mx-2">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              </div>
            )}

            {/* Polling status */}
            {isPolling && (
              <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-xs sm:text-sm">
                  Wachten op betaling...
                </span>
              </div>
            )}

            {/* Copy button */}
            <button
              onClick={copyToClipboard}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 sm:py-3 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition mb-3 sm:mb-4"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Gekopieerd!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopieer Payment Link
                </>
              )}
            </button>

            {/* Instructions */}
            <div className="bg-white/5 rounded-xl p-3 sm:p-4 space-y-2 text-xs text-gray-400">
              <p className="font-bold text-white text-xs sm:text-sm">Hoe te betalen:</p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] sm:text-xs">
                <li>Open Phantom, Backpack of andere Solana wallet</li>
                <li>Scan de QR-code of gebruik de payment link</li>
                <li>Bevestig de transactie</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
