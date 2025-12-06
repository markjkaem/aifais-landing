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
  connection: Connection
): Promise<X402Result> {
  // 1. Geen handtekening? Geef 402 Challenge.
  if (!signature) {
    return generate402Challenge();
  }

  // 2. Replay Protection (Check Redis)
  // Gebruikt de 'get' methode van ioredis
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

    // 4. Valideer Ontvanger en Bedrag
    let paidAmount = 0;
    // @ts-ignore - Gebruikt type casting voor parsed instructions
    const instructions = tx.transaction.message.instructions;

    for (const ix of instructions) {
      // Zoek naar SystemProgram transfers naar ons wallet adres
      // @ts-ignore
      if (ix.program === "system" && ix.parsed?.type === "transfer") {
        // @ts-ignore
        const info = ix.parsed.info;
        if (info.destination === WALLET_ADDRESS) {
          paidAmount += info.lamports;
        }
      }
    }

    const paidSol = paidAmount / 1e9;

    if (paidSol < PRICE_PER_SCAN * TOLERANCE) {
      return { 
        status: "error", 
        code: 402, 
        message: `Insufficient funds. Sent: ${paidSol} SOL. Required: ${PRICE_PER_SCAN} SOL.` 
      };
    }

    // Alles OK
    return { status: "paid", amount: paidSol };

  } catch (error) {
    console.error("Payment check failed", error);
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
function generate402Challenge(): X402Result {
  return {
    status: "error",
    code: 402,
    message: "Payment Required",
    details: {
      x402_offer: {
        amount: PRICE_PER_SCAN,
        currency: "SOL",
        address: WALLET_ADDRESS,
        network: "solana-mainnet",
        description: "Payment required for Invoice OCR Service"
      }
    }
  };
}