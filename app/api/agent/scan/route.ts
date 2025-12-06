import { NextRequest, NextResponse } from "next/server";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import Stripe from "stripe"; // Zorg dat je 'npm install stripe' hebt gedaan
import { checkPayment, markPaymentUsed } from "@/utils/x402-guard";
import { scanInvoiceWithClaude } from "@/utils/ai-scanner";

// Init services
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta"), "confirmed");

export async function POST(req: NextRequest) {
  try {
    const { signature, stripeSessionId, invoiceBase64, mimeType } = await req.json();
    let paymentMethod = "";

    // -----------------------------------------------------------
    // OPTIE A: SOLANA (X402)
    // -----------------------------------------------------------
    if (signature) {
        const payCheck = await checkPayment(signature, connection);
        if (payCheck.status === "error") {
            return NextResponse.json({ error: payCheck.message, ...payCheck.details }, { status: payCheck.code });
        }
        await markPaymentUsed(signature);
        paymentMethod = "solana_x402";
    } 
    // -----------------------------------------------------------
    // OPTIE B: STRIPE (iDEAL/CARD)
    // -----------------------------------------------------------
    else if (stripeSessionId) {
        // Verifieer Stripe Sessie
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
        if (session.payment_status !== "paid") {
            return NextResponse.json({ error: "Stripe payment not completed" }, { status: 402 });
        }
        // Check replay protection voor Stripe (gebruik sessie ID als key)
        // We hergebruiken je 'markPaymentUsed' functie, want die praat met Redis!
        // Maar we prefixen het zodat het niet botst met signatures.
        try {
             await markPaymentUsed(`stripe:${stripeSessionId}`);
        } catch (e) {
             return NextResponse.json({ error: "Double spend: This payment session was already used." }, { status: 409 });
        }
        paymentMethod = "stripe_fiat";
    } 
    // -----------------------------------------------------------
    // GEEN BETALING
    // -----------------------------------------------------------
    else {
        return NextResponse.json({ error: "Missing payment proof (signature or stripeSessionId)" }, { status: 402 });
    }

    // -----------------------------------------------------------
    // UITVOEREN SCAN
    // -----------------------------------------------------------
    const result = await scanInvoiceWithClaude(invoiceBase64, mimeType);

    return NextResponse.json({ 
        success: true, 
        data: result, 
        meta: { method: paymentMethod } 
    });

  } catch (error: any) {
    // Vang dubbele uitgaven van Redis af als ze als error gegooid worden
    if (error.message && error.message.includes("Double Spend")) {
         return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}