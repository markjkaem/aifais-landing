import { Connection, clusterApiUrl } from "@solana/web3.js";
import Stripe from "stripe";
import { redis } from "@/lib/redis";
import { checkPayment, markPaymentUsed } from "@/utils/x402-guard"; // Zorg dat deze import klopt met jouw structuur

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
 */
export async function gatekeepPayment(reqBody: any): Promise<PaymentResult> {
  const { signature, stripeSessionId } = reqBody;

  console.log(`🔒 GATEKEEPER: Checking payment. Sig=${!!signature}, Session=${!!stripeSessionId}`);

  // --- OPTIE A: SOLANA (X402) ---
  if (signature) {
    console.log("LOGIC: Checking Solana Signature.");
    const payCheck = await checkPayment(signature, connection);

    if (payCheck.status === "error") {
      console.warn(`PAYMENT REJECTED: ${payCheck.message}`);
      return { 
        success: false, 
        error: payCheck.message, 
        status: payCheck.code, 
        details: payCheck.details 
      };
    }

    console.log(`Payment Verified. Marking signature as used...`);
    await markPaymentUsed(signature);
    return { success: true, method: "solana_x402" };
  }

  // --- OPTIE B: STRIPE (iDEAL/CARD) ---
  else if (stripeSessionId) {
    console.log(`LOGIC: Checking Stripe Session: ${stripeSessionId.slice(0, 10)}...`);
    const paymentKey = `stripe:${stripeSessionId}`;

    // 1. Replay Check
    const isUsed = await redis.get(paymentKey);
    if (isUsed) {
      console.warn(`STRIPE REPLAY DETECTED.`);
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
      console.error("REDIS ERROR", e);
      return { success: false, error: "Internal Server Error (Redis)", status: 500 };
    }

    return { success: true, method: "stripe_fiat" };
  }

  // --- GEEN BETALING ---
  else {
    const walletAddress = process.env.NEXT_PUBLIC_SOLANA_WALLET;
    console.error(`NO PAYMENT PROOF.`);
    return {
      success: false,
      error: "Payment Required",
      status: 402,
      details: {
        address: walletAddress,
        amount: 0.001
      }
    };
  }
}