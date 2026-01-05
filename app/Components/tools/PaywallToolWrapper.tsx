"use client";

import React from "react";
import CryptoModal from "@/app/Components/CryptoModal";
import { ToolMetadata } from "@/config/tools";

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
    if (!isOpen) return null;
    
    return (
        <CryptoModal
            priceInSol={toolMetadata.pricing.price || 0.001}
            priceInEur={0.50} // Default to 0.50 for standard tools
            scansAmount={1}
            label={toolMetadata.title}
            onClose={onClose}
            onSuccess={onSuccess}
        />
    );
}
