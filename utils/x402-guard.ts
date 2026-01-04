import { Connection, PublicKey } from "@solana/web3.js";
import { redis } from "@/lib/redis"; // ✅ Importeert de 'ioredis' client

// Configuratie
const WALLET_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_WALLET!;
const PRICE_PER_SCAN = 0.001; // Prijs in SOL
const TOLERANCE = 0.96; // 4% speling voor floating point issues

export type X402Result =
  | { status: "paid"; amount: number }
  | { status: "error"; code: number; message: string; details?: any };

/**
 * Controleert de betaling:
 * 1. Is er een signature? Zo nee: geeft 402 Challenge.
 * 2. Is de signature al gebruikt (Replay Protection)?
 * 3. Is de transactie on-chain geldig en naar het juiste adres gestuurd?
 */
export async function checkPayment(
  signature: string | null,
  connection: Connection,
  requiredAmount: number = PRICE_PER_SCAN
): Promise<X402Result> {
  // 1. Geen handtekening? Geef 402 Challenge.
  if (!signature) {
    return generate402Challenge(requiredAmount);
  }

  // 2. Replay Protection (Check Redis)
  const isUsed = await redis.get(`tx:${signature}`);
  if (isUsed) {
    return { status: "error", code: 409, message: "Double Spend: Transaction signature already used." };
  }

  // 3. Check On-Chain
  try {
    const tx = await connection.getParsedTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || !tx.meta) {
      return { status: "error", code: 403, message: "Transaction not found or failed on-chain." };
    }

    // -------------------------------------------------------------------
    // 4. Valideer Ontvanger en Bedrag via Balansverschillen
    // -------------------------------------------------------------------

    const recipientIndex = tx.transaction.message.accountKeys.findIndex(
      key => key.pubkey.toBase58() === WALLET_ADDRESS
    );

    // Als de wallet niet in de lijst van betrokken accounts staat, is het geen betaling aan ons.
    if (recipientIndex === -1) {
      return { status: "error", code: 403, message: "Transaction is not directed at the required wallet address." };
    }

    const preBalance = tx.meta.preBalances[recipientIndex];
    const postBalance = tx.meta.postBalances[recipientIndex];

    // De verandering in saldo voor de ontvanger
    let paidAmount = postBalance - preBalance; // Dit is in Lamports

    // De fee payer is altijd het eerste account in de accountKeys array
    const feePayerIndex = 0;
    const fee = tx.meta.fee;

    // CRUCIALE FIX: Als de ontvanger (recipientIndex) ook de fee payer is (zoals bij 'naar jezelf sturen'),
    // moet de fee weer bij het saldoverschil worden opgeteld om de werkelijke overboeking te meten.
    if (recipientIndex === feePayerIndex) {
      paidAmount += fee;
    }

    const paidSol = paidAmount / 1e9;

    if (paidSol < requiredAmount * TOLERANCE) {
      return {
        status: "error",
        code: 402,
        message: `Insufficient funds. Sent: ${paidSol} SOL. Required: ${requiredAmount} SOL.`
      };
    }

    // Alles OK
    return { status: "paid", amount: paidSol };

  } catch (error) {
    return { status: "error", code: 500, message: "Payment verification failed internal error" };
  }
}

/**
 * Markeer de transactie als 'gebruikt' in Redis om Replay Attacks te voorkomen.
 */
export async function markPaymentUsed(signature: string) {
  // Gebruikt de 'set' methode van ioredis met 'EX' (expire in seconden)
  await redis.set(`tx:${signature}`, "used", 'EX', 86400); // 86400 seconden = 24 uur
}

/**
 * Genereert het HTTP 402 JSON object voor de agent.
 */
/**
 * Genereert het HTTP 402 JSON object voor de agent.
 */
function generate402Challenge(amount: number = PRICE_PER_SCAN): X402Result {
  return {
    status: "error",
    code: 402,
    message: "Payment Required",
    details: {
      x402_offer: {
        amount: amount,
        currency: "SOL",
        address: WALLET_ADDRESS,
        network: "solana-mainnet",
        description: "Payment required for Invoice OCR Service"
      }
    }
  };
}
