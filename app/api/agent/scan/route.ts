// app/api/agent/scan/route.ts
// API endpoint voor AI agents om direct facturen te scannen na betaling

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { signature, invoiceBase64, mimeType } = await req.json();

    // 1. Verifieer de Solana betaling
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta");
    const connection = new Connection(rpcUrl, "confirmed");
    
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || tx.meta?.err) {
      return NextResponse.json(
        { error: "Invalid or failed transaction" },
        { status: 403 }
      );
    }

    // 2. Scan de factuur
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { 
                type: "base64", 
                media_type: mimeType as any, 
                data: invoiceBase64 
              },
            },
            {
              type: "text",
              text: `Extract invoice data to JSON. Fields: leverancier, factuurdatum (YYYY-MM-DD), factuurnummer, totaal_incl (number), kvk_nummer.`
            }
          ],
        }
      ],
    });

    let text = msg.content[0].type === 'text' ? msg.content[0].text : "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
    
    const result = JSON.parse(text);

    return NextResponse.json({
      success: true,
      data: result,
      creditsUsed: 1,
    });

  } catch (error: any) {
    console.error("Agent scan error:", error);
    return NextResponse.json(
      { error: error.message || "Scan failed" },
      { status: 500 }
    );
  }
}