"use client";

import { useState } from "react";
import { ToolState, PaymentProof, ToolResponse } from "@/lib/tools/types";
import { useDevMode } from "./useDevMode";

interface UsePaywallToolOptions<TInput, TOutput> {
    apiEndpoint: string;
    requiredAmount?: number;
}

export function usePaywallTool<TInput, TOutput>(
    options: UsePaywallToolOptions<TInput, TOutput>
) {
    const [state, setState] = useState<ToolState<TOutput>>({ status: "idle" });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [pendingInput, setPendingInput] = useState<TInput | null>(null);
    const { isDevMode, devBypassSignature } = useDevMode();

    const reset = () => {
        setState({ status: "idle" });
        setPendingInput(null);
    };

    const execute = async (input: TInput, paymentProof?: PaymentProof) => {
        // In dev mode with ?dev=true, automatically bypass payment
        if (isDevMode && devBypassSignature && !paymentProof) {
            paymentProof = { type: "crypto", id: devBypassSignature };
        }

        // If it's a paid tool and no proof yet, show modal
        if (options.requiredAmount && options.requiredAmount > 0 && !paymentProof) {
            setPendingInput(input);
            setShowPaymentModal(true);
            return;
        }

        setState({ status: "loading" });

        try {
            const body: any = { ...input };

            if (paymentProof) {
                if (paymentProof.type === "crypto") {
                    body.signature = paymentProof.id;
                } else if (paymentProof.type === "stripe") {
                    body.stripeSessionId = paymentProof.id;
                }
            }

            const response = await fetch(options.apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const result: ToolResponse<TOutput> = await response.json();

            if (result.success) {
                setState({ status: "success", data: result.data });
            } else {
                setState({
                    status: "error",
                    error: result.error || "Er is een onbekende fout opgetreden."
                });
            }
        } catch (error: any) {
            setState({
                status: "error",
                error: error.message || "Netwerkfout. Controleer je verbinding."
            });
        }
    };

    const handlePaymentSuccess = (signature: string) => {
        setShowPaymentModal(false);
        if (pendingInput) {
            execute(pendingInput, { type: "crypto", id: signature });
        }
    };

    return {
        state,
        execute,
        reset,
        showPaymentModal,
        setShowPaymentModal,
        handlePaymentSuccess,
        isDevMode,
    };
}
