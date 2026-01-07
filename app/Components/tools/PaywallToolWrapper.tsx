"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import CryptoModal from "@/app/Components/CryptoModal";
import { ToolMetadata } from "@/config/tools";
import { X, CreditCard, Wallet } from "lucide-react";

interface PaywallToolWrapperProps {
    toolMetadata: ToolMetadata;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (signature: string) => void;
}

export function PaywallToolWrapper({
    toolMetadata,
    isOpen,
    onClose,
    onSuccess,
}: PaywallToolWrapperProps) {
    const [showCryptoModal, setShowCryptoModal] = useState(false);

    if (!isOpen) return null;

    const priceInSol = toolMetadata.pricing.price || 0.001;
    const priceInEur = toolMetadata.pricing.priceEur || 0.50;
    const stripeLink = toolMetadata.pricing.stripeLink;

    const handleStripeClick = () => {
        if (stripeLink) {
            // Add return URL with session_id placeholder
            const currentUrl = window.location.href.split('?')[0];
            const separator = stripeLink.includes('?') ? '&' : '?';
            window.location.href = `${stripeLink}${separator}success_url=${encodeURIComponent(currentUrl + '?session_id={CHECKOUT_SESSION_ID}')}`;
        }
    };

    const handleCryptoSuccess = (signature: string, reference: string) => {
        setShowCryptoModal(false);
        onSuccess(signature);
    };

    // Show crypto modal if selected
    if (showCryptoModal) {
        return (
            <CryptoModal
                priceInSol={priceInSol}
                priceInEur={priceInEur}
                scansAmount={1}
                label={toolMetadata.title}
                onClose={() => {
                    setShowCryptoModal(false);
                    onClose();
                }}
                onSuccess={handleCryptoSuccess}
            />
        );
    }

    // Render payment method selection modal
    if (typeof window === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white">Betaalmethode</h3>
                        <p className="text-sm text-zinc-400">{toolMetadata.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                {/* Payment options */}
                <div className="p-6 space-y-3">
                    {/* Stripe/iDEAL option */}
                    {stripeLink ? (
                        <button
                            onClick={handleStripeClick}
                            className="group w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all border border-zinc-700 hover:border-zinc-600"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-blue-400" />
                                </div>
                                <span>iDEAL / Card</span>
                            </div>
                            <span className="text-lg font-bold">€{priceInEur.toFixed(2)}</span>
                        </button>
                    ) : null}

                    {/* Solana Pay option */}
                    <button
                        onClick={() => setShowCryptoModal(true)}
                        className="group w-full bg-gradient-to-r from-[#14F195]/20 to-[#9945FF]/20 hover:from-[#14F195]/30 hover:to-[#9945FF]/30 text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between transition-all border border-[#14F195]/30 hover:border-[#14F195]/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-[#14F195]/20 to-[#9945FF]/20 rounded-lg">
                                <Wallet className="w-5 h-5 text-[#14F195]" />
                            </div>
                            <span>Solana Pay</span>
                        </div>
                        <span className="text-lg font-bold text-[#14F195]">{priceInSol} SOL</span>
                    </button>
                </div>

                {/* Footer info */}
                <div className="px-6 pb-6">
                    <p className="text-xs text-zinc-500 text-center">
                        Veilige betaling via Stripe of Solana blockchain
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
