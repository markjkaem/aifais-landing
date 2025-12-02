import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
  apiVersion: "2025-11-17.clover", 
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) return NextResponse.json({ valid: false }, { status: 400 });

  // --- PAD A: SOLANA VERIFICATIE ---
  if (sessionId.startsWith("SOL-")) {
      const signature = sessionId.replace("SOL-", "");
      console.log("🔍 Verifying Solana Signature:", signature);
      
      try {
          // FIX 1: We voegen 'confirmed' toe als tweede parameter. 
          // Dit zorgt dat de backend sneller synchroniseert met de frontend.
          const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta");
          const connection = new Connection(rpcUrl, "confirmed");
          
          // 1. Haal transactie op
          const tx = await connection.getParsedTransaction(signature, { 
              maxSupportedTransactionVersion: 0,
              commitment: "confirmed" // Ook hier expliciet forceren
          });
          
          if (!tx) {
              console.error("❌ Transactie nog niet gevonden op RPC.");
              // Tip: Als dit gebeurt, is je RPC misschien traag. Helius lost dit meestal op.
              return NextResponse.json({ valid: false, reason: "tx_not_found" });
          }
          
          // 2. CHECK HET BEDRAG (LAMPORTS)
          let paidLamports = 0;
          // Zorg dat deze EXACT matcht met je ontvangende wallet in .env
          const myWallet = process.env.NEXT_PUBLIC_SOLANA_WALLET; 

          // Loop door instructies
          tx.transaction.message.instructions.forEach((inst: any) => {
             if (inst.parsed?.type === "transfer") {
                 if (inst.parsed.info.destination === myWallet) {
                     paidLamports += inst.parsed.info.lamports;
                 }
             }
          });

          console.log(`💰 Betaald: ${paidLamports} Lamports naar ${myWallet}`);

          if (paidLamports === 0) {
              console.error("❌ Geen betaling naar jouw wallet gevonden in deze transactie.");
              return NextResponse.json({ valid: false, reason: "invalid_payment" });
          }

          // 3. BEPAAL PAKKET
          let maxScans = 1;
          if (paidLamports >= 20_000_000) maxScans = 20;      // > 0.02 SOL
          else if (paidLamports >= 10_000_000) maxScans = 10; // > 0.01 SOL
          else if (paidLamports >= 2_000_000) maxScans = 1;   // > 0.002 SOL (jouw test bedrag was 0.003, dus dit klopt)
          
          console.log("✅ Toegang verleend voor:", maxScans, "scans");
          return NextResponse.json({ valid: true, maxScans });

      } catch (e) {
          console.error("⚠️ Solana verify error:", e);
          return NextResponse.json({ valid: false, reason: "solana_error" });
      }
  }

  // --- PAD B: STRIPE VERIFICATIE (Ongewijzigd) ---
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ valid: false, reason: "unpaid" });
    }

    const scansCompleted = parseInt(session.metadata?.scans_completed || "0");
    if (scansCompleted > 0 || session.metadata?.used === "true") {
       return NextResponse.json({ valid: false, reason: "already_used" });
    }

    let maxScans = 1;
    const amount = session.amount_total || 0;
    if (amount === 50) maxScans = 1;
    else if (amount === 250) maxScans = 10;
    else if (amount === 400) maxScans = 20;

    return NextResponse.json({ valid: true, maxScans });

  } catch (error) {
    console.error("Stripe verify error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}