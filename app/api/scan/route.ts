import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import Stripe from "stripe";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { getScansForAmount } from "@/utils/solana-pricing";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || "",
});

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);

// In-memory cache voor Solana gebruik
const SOLANA_USAGE_CACHE = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Image, mimeType, sessionId } = body; 

    if (!sessionId) return NextResponse.json({ error: "Geen sessie ID." }, { status: 401 });
    
    let maxScans = 1;
    let scansCompleted = 0;

    if (sessionId.startsWith("SOL-")) {
        // === SOLANA LOGICA ===
        const signature = sessionId.replace("SOL-", "");
        console.log(`🔎 Scan request voor signature: ${signature.slice(0,8)}...`);
        
        try {
            // A. Check Cache
            scansCompleted = SOLANA_USAGE_CACHE.get(signature) || 0;
            console.log(`   - Huidig verbruik (Cache): ${scansCompleted}`);

            // B. Haal transactie op (gebruik 'confirmed' voor snelheid)
            const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta");
            const connection = new Connection(rpcUrl, "confirmed");
            
            const tx = await connection.getTransaction(signature, { 
                maxSupportedTransactionVersion: 0,
            });

            if (!tx) {
                console.error("   ❌ Transactie niet gevonden op RPC (Scan route)");
                return NextResponse.json({ error: "Transactie niet gevonden (wacht even...)" }, { status: 403 });
            }

            // C. Check bedrag en bepaal scans via dynamische pricing
            const myWallet = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_WALLET!);
            const accountKeys = tx.transaction.message.getAccountKeys();
            const recipientIndex = accountKeys.staticAccountKeys.findIndex((key) =>
              key.equals(myWallet)
            );

            if (recipientIndex === -1) {
                console.error("   ❌ Betaling niet naar onze wallet");
                return NextResponse.json({ error: "Ongeldige transactie" }, { status: 403 });
            }

            const postBalance = tx.meta?.postBalances[recipientIndex] || 0;
            const preBalance = tx.meta?.preBalances[recipientIndex] || 0;
            const paidLamports = postBalance - preBalance;
            const paidSol = paidLamports / 1e9;

            console.log(`   - Betaald bedrag: ${paidLamports} lamports (${paidSol.toFixed(6)} SOL)`);

            // ✅ Gebruik dynamische pricing om scans te bepalen
            maxScans = await getScansForAmount(paidSol);

            if (maxScans === 0) {
                console.error("   ❌ Betaald bedrag komt niet overeen met een pakket");
                return NextResponse.json({ 
                    error: `Betaling te laag of ongeldig: ${paidSol.toFixed(6)} SOL` 
                }, { status: 403 });
            }

            console.log(`   - Max scans toegestaan: ${maxScans}`);

            // D. Check Limiet
            if (scansCompleted >= maxScans) {
                console.warn("   ⛔ LIMIET BEREIKT");
                return NextResponse.json({ 
                    error: `Limiet bereikt (${scansCompleted}/${maxScans} verbruikt).` 
                }, { status: 403 });
            }

        } catch (e) {
            console.error("Solana check error:", e);
            return NextResponse.json({ error: "Validatie fout bij Solana." }, { status: 500 });
        }

    } else {
        // === STRIPE LOGICA ===
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
            return NextResponse.json({ error: "Niet betaald." }, { status: 403 });
        }
        
        const amount = session.amount_total || 0;
        if (amount === 50) maxScans = 1;
        if (amount === 250) maxScans = 10;
        if (amount === 400) maxScans = 20;
        
        scansCompleted = parseInt(session.metadata?.scans_completed || "0");
        
        if (scansCompleted >= maxScans) {
            return NextResponse.json({ error: "Limiet bereikt." }, { status: 403 });
        }
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

    let text = msg.content[0].type === 'text' ? msg.content[0].text : "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) text = text.substring(firstBrace, lastBrace + 1);
    const jsonResult = JSON.parse(text);

    // --- 3. ADMINISTRATIE BIJWERKEN ---
    const newCount = scansCompleted + 1;

    if (sessionId.startsWith("SOL-")) {
        const signature = sessionId.replace("SOL-", "");
        SOLANA_USAGE_CACHE.set(signature, newCount);
        console.log(`   ✅ Cache geüpdatet naar: ${newCount}/${maxScans}`);
    } else {
        await stripe.checkout.sessions.update(sessionId, {
            metadata: {
                scans_completed: newCount.toString(),
                used: newCount >= maxScans ? "true" : "false",
                last_scan: new Date().toISOString()
            }
        });
    }

    // Stuur status mee
    jsonResult._meta = { scansRemaining: maxScans - newCount };

    return NextResponse.json(jsonResult);

  } catch (error) {
     console.error("API Error:", error);
     return NextResponse.json({ error: "Server fout." }, { status: 500 });
  }
}