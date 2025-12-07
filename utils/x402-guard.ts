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
    console.log(`-> START checkPayment: Signature provided? ${!!signature}.`);
    
    // 1. Geen handtekening? Geef 402 Challenge.
    if (!signature) {
        console.log(`-> CHALLENGE: No signature provided. Returning 402.`);
        return generate402Challenge(); 
    }

    console.log(`-> CHECKING: Wallet Address is: ${WALLET_ADDRESS}`); 
    
    // 2. Replay Protection (Check Redis)
    console.log(`-> REDIS: Checking for replay attack on tx:${signature.slice(0, 10)}...`);
    const isUsed = await redis.get(`tx:${signature}`);
    if (isUsed) {
        console.warn(`-> REDIS FAIL: Signature already used (409).`);
        return { status: "error", code: 409, message: "Double Spend: Transaction signature already used." };
    }

    // 3. Check On-Chain
    try {
        console.log(`-> ON-CHAIN: Fetching transaction ${signature.slice(0, 10)}...`);
        const tx = await connection.getParsedTransaction(signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });

        if (!tx || !tx.meta) {
            console.warn(`-> ON-CHAIN FAIL: Transaction not found or failed (403).`);
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
             console.warn(`-> VALIDATION FAIL: Recipient wallet is not an involved account in this transaction.`);
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
            console.log(`-> BALANCE ADJUSTED: Recipient is Fee Payer (Index ${feePayerIndex}). Added Fee (${fee} Lamports). Net amount now reflects payment.`);
        }

        console.log(`-> BALANCE CHECK: Index ${recipientIndex}. Pre/Post Balances: ${preBalance} / ${postBalance} Lamports.`);


        const paidSol = paidAmount / 1e9;
        console.log(`-> VALIDATION: Paid ${paidSol} SOL. Required: ${PRICE_PER_SCAN} SOL.`);
        
        if (paidSol < PRICE_PER_SCAN * TOLERANCE) {
            console.warn(`-> VALIDATION FAIL: Insufficient funds (402). Sent: ${paidSol} SOL.`);
            return { 
              status: "error", 
              code: 402, 
              message: `Insufficient funds. Sent: ${paidSol} SOL. Required: ${PRICE_PER_SCAN} SOL.` 
            };
        }

        // Alles OK
        console.log(`-> SUCCESS: Payment verified (Paid: ${paidSol} SOL).`);
        return { status: "paid", amount: paidSol };

    } catch (error) {
        console.error("Payment check failed (500)", error); 
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