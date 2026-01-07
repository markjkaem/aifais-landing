import { Connection, clusterApiUrl } from "@solana/web3.js";
import Stripe from "stripe";
import { redis } from "@/lib/redis";
import { checkPayment, markPaymentUsed } from "@/utils/x402-guard"; // Zorg dat deze import klopt met jouw structuur
import { isDevBypass } from "@/lib/security/dev-bypass";

// Init services (singleton pattern buiten de functie)
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta"),
  "confirmed"
);

export type PaymentResult =
  | { success: true; method: string; status?: number }
  | { success: false; error: string; status: number; details?: any };

/**
 * Deze functie controleert of een request geldig betaald is via Solana (X-402) of Stripe.
 * @param reqBody De request body (moet signature of stripeSessionId bevatten)
 * @param requiredAmount Het vereiste bedrag in SOL (optioneel, default 0.001)
 */
export async function gatekeepPayment(reqBody: any, requiredAmount?: number): Promise<PaymentResult> {
  const { signature, stripeSessionId } = reqBody;

  // --- OPTIE A: SOLANA (X402) ---
  if (signature) {
    // DEVELOPMENT BACKDOOR
    if (isDevBypass(signature)) {
      console.warn("⚠️ DEV_BYPASS used for payment verification");
      return { success: true, method: "dev_bypass" };
    }

    const payCheck = await checkPayment(signature, connection, requiredAmount);

    if (payCheck.status === "error") {
      return {
        success: false,
        error: payCheck.message,
        status: payCheck.code,
        details: payCheck.details
      };
    }

    await markPaymentUsed(signature);
    return { success: true, method: "solana_x402" };
  }

  // --- OPTIE B: STRIPE (iDEAL/CARD) ---
  else if (stripeSessionId) {
    const paymentKey = `stripe:${stripeSessionId}`;

    // 1. Replay Check
    const isUsed = await redis.get(paymentKey);
    if (isUsed) {
      return { success: false, error: "Double spend: Session already used.", status: 409 };
    }

    // 2. Stripe Verificatie
    try {
      const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
      if (session.payment_status !== "paid") {
        return { success: false, error: "Stripe payment not completed", status: 402 };
      }
    } catch (e) {
      return { success: false, error: "Invalid Stripe Session", status: 400 };
    }

    // 3. Mark as Used
    try {
      await redis.set(paymentKey, "used", 'EX', 86400); // 24 uur
    } catch (e) {
      return { success: false, error: "Internal Server Error (Redis)", status: 500 };
    }

    return { success: true, method: "stripe_fiat" };
  }

  // --- GEEN BETALING ---
  else {
    const walletAddress = process.env.NEXT_PUBLIC_SOLANA_WALLET;
    return {
      success: false,
      error: "Payment Required",
      status: 402,
      details: {
        address: walletAddress,
        amount: requiredAmount || 0.001
      }
    };
  }
}