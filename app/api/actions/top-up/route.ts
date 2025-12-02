import { NextRequest, NextResponse } from "next/server";
import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  clusterApiUrl, 
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";

// Nieuwe, uitgebreide headers met de vereiste X-Action velden
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept-Encoding",
  // ✅ FIX: Deze headers zijn verplicht voor de Solana Action specificatie
  "X-Action-Version": "1.0",
  "X-Blockchain-Ids": "solana", 
};

// 1. OPTIONS: De browser vraagt eerst of hij mag praten
export async function OPTIONS() {
  return new NextResponse(null, { headers });
}

// 2. GET: De Wallet vraagt "Wat is dit?" (Toont het plaatje + knop)
export async function GET(req: NextRequest) {
  const iconUrl = "https://aifais.com/og-scanner.jpg"; // Zorg dat dit plaatje bestaat!

  const payload = {
    icon: iconUrl,
    label: "Koop 5 Credits",
    title: "Aifais Factuur Scanner",
    description: "Laat AI je boekhouding doen. Koop 5 scan-credits voor 0.02 SOL.",
    links: {
      actions: [
        {
          label: "Koop 5 Credits (0.02 SOL)",
          href: "/api/actions/top-up?amount=0.02", // De link die de POST aanroept
        },
      ],
    },
  };

  return NextResponse.json(payload, { headers });
}

// 3. POST: De Gebruiker klikt op de knop (Maakt de transactie)
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amountParam = searchParams.get("amount") || "0.02";
    const body = await req.json();
    const { account } = body; // Het wallet adres van de gebruiker

    if (!account) {
      return NextResponse.json({ error: "Geen wallet account gevonden" }, { status: 400, headers });
    }

    const sender = new PublicKey(account);
    // HIER MOET JOUW WALLET STAAN (uit .env.local)
    const recipient = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_WALLET!); 
    
    const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta")
    );

    // Bouw de transactie
    const transaction = new Transaction();
    
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: parseFloat(amountParam) * LAMPORTS_PER_SOL,
      })
    );

    transaction.feePayer = sender;
    // Blokhash moet vers zijn
    transaction.recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash; 

    // Stuur de ongetekende transactie terug zodat de gebruiker kan tekenen
    const payload = {
      transaction: transaction.serialize({ requireAllSignatures: false }).toString("base64"),
      message: "Bedankt! Je credits worden bijgeschreven.",
    };

    return NextResponse.json(payload, { headers });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Transactie mislukt" }, { status: 500, headers });
  }
}