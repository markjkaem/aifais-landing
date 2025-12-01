import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import Stripe from "stripe";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || "",
});

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Image, mimeType, sessionId } = body; 

    if (!sessionId) return NextResponse.json({ error: "Geen sessie ID." }, { status: 401 });
    
    // --- 1. SESSIE & LIMIET CHECK ---
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Niet betaald." }, { status: 403 });
    }

    // Bepaal max limiet o.b.v. prijs
    const amount = session.amount_total || 0;
    let maxScans = 1;
    if (amount === 250) maxScans = 10;
    if (amount === 400) maxScans = 20;

    // Haal huidige stand op
    const scansCompleted = parseInt(session.metadata?.scans_completed || "0");

    // IS DE KOEK OP?
    if (scansCompleted >= maxScans) {
        return NextResponse.json({ error: "Limiet bereikt. Koop een nieuwe bundel." }, { status: 403 });
    }

    // --- 2. AI VERWERKING ---
    if (!base64Image) return NextResponse.json({ error: "Geen beeld." }, { status: 400 });

    const msg = await anthropic.messages.create({
      model: process.env.CLAUDE_API_MODEL || "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mimeType as any, data: base64Image },
            },
            {
              type: "text",
              text: `Extract data naar JSON. Velden: leverancier, factuurdatum (YYYY-MM-DD), factuurnummer, totaal_incl (number), kvk_nummer (8 cijfers, clean).`
            }
          ],
        }
      ],
    });

    // Parse JSON
    let text = msg.content[0].type === 'text' ? msg.content[0].text : "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) text = text.substring(firstBrace, lastBrace + 1);
    const jsonResult = JSON.parse(text);

    // --- 3. ADMINISTRATIE BIJWERKEN ---
    const newCount = scansCompleted + 1;
    
    // Update metadata
    await stripe.checkout.sessions.update(sessionId, {
        metadata: {
            scans_completed: newCount.toString(),
            // Als we nu op het maximum zitten, markeren we hem expliciet als 'used' voor jouw overzicht
            used: newCount >= maxScans ? "true" : "false",
            last_scan: new Date().toISOString()
        }
    });

    return NextResponse.json(jsonResult);

  } catch (error) {
    console.error("API Error:", error); 
    return NextResponse.json({ error: "Server fout." }, { status: 500 });
  }
}