"use client";

import { useEffect, useState, useRef } from "react";
import { createQR, encodeURL, findReference } from "@solana/pay";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { Loader2, CheckCircle2 } from "lucide-react";

interface CryptoModalProps {
  priceInSol: number;
  label: string;
  onSuccess: (signature: string) => void;
  onClose: () => void;
}

export default function CryptoModal({
  priceInSol,
  label,
  onSuccess,
  onClose,
}: CryptoModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [reference, setReference] = useState<PublicKey | null>(null);
  const [status, setStatus] = useState<"pending" | "confirmed">("pending");

  // CONFIGURATIE
  const recipient = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_WALLET!);
  const amount = new BigNumber(priceInSol);
  const memo = `Scan Payment: ${label}`;

  // --- DE HARDE GRENZEN ---
  const QR_SIZE = 240;

  // 1. Genereer Payment Link & QR
  useEffect(() => {
    const ref = Keypair.generate().publicKey;
    setReference(ref);

    const url = encodeURL({
      recipient,
      amount,
      reference: ref,
      label: "AI Scanner",
      message: label,
      memo,
    });

    const qr = createQR(url, QR_SIZE, "white");

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }
  }, [priceInSol, label]);

  // 2. Luister naar de Blockchain
  useEffect(() => {
    if (!reference) return;

    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta")
    );

    const interval = setInterval(async () => {
      try {
        const signatureInfo = await findReference(connection, reference, {
          finality: "confirmed",
        });

        if (signatureInfo.signature) {
          clearInterval(interval);
          setStatus("confirmed");

          setTimeout(() => {
            onSuccess(signatureInfo.signature);
          }, 1500);
        }
      } catch (e) {
        // Polling...
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [reference]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full relative shadow-2xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
        >
          ✕
        </button>

        <div className="text-center space-y-2 mb-4">
          <h3 className="text-xl font-bold text-white">Betaal met Solana</h3>
          <p className="text-gray-400 text-xs">
            Scan met je telefoon of wallet.
          </p>
        </div>

        {/* QR Container */}
        <div className="relative mb-6">
          <div
            ref={qrRef}
            className={`bg-white rounded-xl overflow-hidden flex items-center justify-center transition-all duration-500`}
            style={{
              width: `${QR_SIZE}px`,
              height: `${QR_SIZE}px`,
            }}
          ></div>

          {status === "confirmed" && (
            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-300">
              <div className="bg-green-500 rounded-full p-4 shadow-[0_0_50px_rgba(34,197,94,0.6)]">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="w-full bg-white/5 rounded-lg p-3 flex justify-between items-center text-xs border border-white/5 mb-4">
          <span className="text-gray-400">Totaal:</span>
          <span className="font-mono text-white font-bold tracking-wider">
            {amount.toString()} SOL
          </span>
        </div>

        <div className="text-center h-6">
          {status === "pending" ? (
            <div className="flex items-center justify-center gap-2 text-xs text-blue-400 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" /> Wachten op
              betaling...
            </div>
          ) : (
            <span className="text-green-400 text-sm font-bold">
              Betaling Succesvol!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
