import { NextRequest, NextResponse } from "next/server";
import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  clusterApiUrl, 
  LAMPORTS_PER_SOL,
  Keypair // ✅ TOEGEVOEGD
} from "@solana/web3.js";

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept-Encoding",
  "X-Action-Version": "1.0",
  "X-Blockchain-Ids": "solana", 
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: defaultHeaders });
}

export async function GET(req: NextRequest) {
  const iconUrl = "https://aifais.com/logo_official.png"; 
  const payload = {
    icon: iconUrl,
    label: "Koop 5 Credits",
    title: "Aifais Factuur Scanner",
    description: "Laat AI je boekhouding doen. Koop 5 scan-credits voor 0.02 SOL.",
    links: {
      actions: [
        {
          label: "Koop 5 Credits (0.02 SOL)",
          href: "/api/actions/top-up?amount=0.02", 
        },
      ],
    },
  };
  return NextResponse.json(payload, { headers: defaultHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amountParam = searchParams.get("amount") || "0.02";
    const body = await req.json();
    const { account } = body; 
    
    if (!account) {
      return NextResponse.json(
        { error: "Geen wallet account gevonden" }, 
        { status: 400, headers: defaultHeaders }
      );
    }

    const sender = new PublicKey(account);
    const recipient = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_WALLET!); 
    
    const connection = new Connection(clusterApiUrl('devnet'));
    
    // ✅ Genereer een unieke reference
    const reference = Keypair.generate().publicKey;
    
    const transaction = new Transaction();
    
    // Hoofdtransactie
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: parseFloat(amountParam) * LAMPORTS_PER_SOL,
      })
    );
    
    // ✅ Voeg reference toe als memo (correcte methode)
    // Je kunt ook een memo instructie toevoegen met @solana/spl-memo
    // maar een 0-transfer werkt ook voor tracking
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: reference,
        lamports: 0,
      })
    );
    
    transaction.feePayer = sender;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash('finalized')
    ).blockhash; 
    
    const payload = {
      transaction: transaction
        .serialize({ requireAllSignatures: false })
        .toString("base64"),
      message: "Bedankt! Je credits worden bijgeschreven.",
      reference: reference.toString(),
    };
    
    return NextResponse.json(payload, { headers: defaultHeaders });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Transactie mislukt" }, 
      { status: 500, headers: defaultHeaders }
    );
  }
}