import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
   apiVersion: "2025-11-17.clover", // Check je eigen versie
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) return NextResponse.json({ valid: false }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 1. Is er betaald?
    if (session.payment_status !== "paid") {
      return NextResponse.json({ valid: false, reason: "unpaid" });
    }

    // 2. STRIKTE CHECK: Is deze sessie al eens gebruikt?
    // We kijken of er al scans zijn uitgevoerd.
    const scansCompleted = parseInt(session.metadata?.scans_completed || "0");

    // "Het is het probleem van de user": 
    // Als de teller op 1 of hoger staat, mag hij er NIET meer in via een refresh.
    if (scansCompleted > 0 || session.metadata?.used === "true") {
       return NextResponse.json({ valid: false, reason: "already_used" });
    }

    // 3. Bepaal hoeveel hij er in TOTAAL mag (voor de frontend UI)
    let maxScans = 1;
    const amount = session.amount_total || 0;
    
    if (amount === 50) maxScans = 1;       // €0.50
    else if (amount === 250) maxScans = 10; // €2.50
    else if (amount === 400) maxScans = 20; // €4.00

    return NextResponse.json({ valid: true, maxScans });

  } catch (error) {
    console.error("Stripe verify error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}