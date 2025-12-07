import { NextRequest, NextResponse } from "next/server";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import Stripe from "stripe"; 
import { checkPayment, markPaymentUsed } from "@/utils/x402-guard";
import { scanInvoiceWithClaude } from "@/utils/ai-scanner";
import { redis } from "@/lib/redis"; // ✅ NODIG VOOR STRIPE REPLAY CHECK

// Init services
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta"), "confirmed");

// /api/agent/scan POST handler

export async function POST(req: NextRequest) {
  console.log("--- API START: /api/agent/scan ---"); 

  try {
    const { signature, stripeSessionId, invoiceBase64, mimeType } = await req.json();
    let paymentMethod = "";

    console.log(`Incoming Data: Signature=${!!signature}, SessionID=${!!stripeSessionId}`);

    // -----------------------------------------------------------
    // OPTIE A: SOLANA (X402) - Logica blijft ongewijzigd
    // -----------------------------------------------------------
    if (signature) {
        console.log("LOGIC: Checking Solana Signature (X402).");
        const payCheck = await checkPayment(signature, connection);
        
        if (payCheck.status === "error") {
            console.warn(`PAYMENT REJECTED: Code ${payCheck.code}, Message: ${payCheck.message}`); 
            return NextResponse.json({ error: payCheck.message, ...payCheck.details }, { status: payCheck.code });
        }
        
        console.log(`Payment Verified. Marking signature as used: ${signature.slice(0, 10)}...`);
        await markPaymentUsed(signature);
        paymentMethod = "solana_x402";
    } 
    // -----------------------------------------------------------
    // OPTIE B: STRIPE (iDEAL/CARD) - Met directe Redis bewerking
    // -----------------------------------------------------------
    else if (stripeSessionId) {
        console.log(`LOGIC: Checking Stripe Session: ${stripeSessionId.slice(0, 10)}...`);
        const paymentKey = `stripe:${stripeSessionId}`;

        // STAP 1: Replay Protection Check
        const isUsed = await redis.get(paymentKey);
        if (isUsed) {
            console.warn(`STRIPE REPLAY DETECTED: Sessie ${stripeSessionId} is al gebruikt. (409)`);
            return NextResponse.json({ error: "Double spend: This payment session was already used." }, { status: 409 });
        }
        
        // STAP 2: Verifieer Stripe Sessie
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
        if (session.payment_status !== "paid") {
            console.warn(`STRIPE FAIL: Status is niet 'paid' voor ${stripeSessionId}. (402)`);
            return NextResponse.json({ error: "Stripe payment not completed" }, { status: 402 });
        }

        // STAP 3: MARKERING: Markeer nu direct als gebruikt in Redis
        try {
            // Gebruik direct redis.set om zeker te zijn van de sleutel
            await redis.set(paymentKey, "used", 'EX', 86400); // 86400 seconden = 24 uur
            console.log(`STRIPE OK. Session verified and marked as used: ${paymentKey}.`);
        } catch (e) {
            console.error(`REDIS SET FAILED (500): Kon sleutel ${paymentKey} niet markeren.`, e);
            return NextResponse.json({ error: "Internal Redis marking error." }, { status: 500 });
        }
        paymentMethod = "stripe_fiat";
    } 
    // -----------------------------------------------------------
    // GEEN BETALING - Logica blijft ongewijzigd
    // -----------------------------------------------------------
    else {
        const walletAddress = process.env.NEXT_PUBLIC_SOLANA_WALLET;
        
        console.error(`LOGIC: NO PAYMENT PROOF. Issuing 402 Challenge. Wallet Address in ENV: ${walletAddress || "MISSING/UNDEFINED"}`);
        
        return NextResponse.json({ 
            error: "Payment Required",
            address: walletAddress, 
            amount: 0.001 
        }, { status: 402 });
    }

    // -----------------------------------------------------------
    // UITVOEREN SCAN - Logica blijft ongewijzigd
    // -----------------------------------------------------------
    console.log(`Starting scan with method: ${paymentMethod}`);
    const result = await scanInvoiceWithClaude(invoiceBase64, mimeType);

    // Vang de UNREADABLE_DOCUMENT fout van Claude af (400)
    if (result && result.error === "UNREADABLE_DOCUMENT") {
        console.warn(`SCAN FAILED (400): ${result.message}`);
        return NextResponse.json({ error: result.message }, { status: 400 }); 
    }

    // Nu pas return je de 200 SUCCESS
    console.log(`--- API END: Success (200) via ${paymentMethod} ---`);
    return NextResponse.json({ 
        success: true, 
        data: result, 
        meta: { method: paymentMethod } 
    });

  } catch (error: any) {
    // Vang dubbele uitgaven van Redis af als ze als error gegooid worden
    if (error.message && error.message.includes("Double Spend")) {
         console.warn(`Double Spend detected (409): ${error.message}`);
         return NextResponse.json({ error: error.message }, { status: 409 });
    }
    
    console.error("--- API END: CRITICAL ERROR (500) ---", error); 
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}