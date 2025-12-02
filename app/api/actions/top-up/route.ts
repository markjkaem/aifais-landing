import { NextRequest, NextResponse } from "next/server";
import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  clusterApiUrl, 
  LAMPORTS_PER_SOL, 
  Keypair
} from "@solana/web3.js";

// ✅ FIX: Deze headers zijn verplicht voor de Solana Action specificatie.
const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept-Encoding",
  "X-Action-Version": "1.0",
  "X-Blockchain-Ids": "solana", 
};

// 1. OPTIONS: De browser vraagt eerst of hij mag praten
export async function OPTIONS() {
  return new NextResponse(null, { headers: defaultHeaders });
}

// 2. GET: De Wallet vraagt "Wat is dit?" (Toont het plaatje + knop)
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
          // Pas de href aan naar de volledige pad
          href: "https://aifais.com/api/actions/top-up?amount=0.02", 
        },
      ],
    },
  };

  return NextResponse.json(payload, { headers: defaultHeaders });
}

// 3. POST: De Gebruiker klikt op de knop (Maakt de transactie)
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amountParam = searchParams.get("amount") || "0.02";
    const body = await req.json();
    const { account } = body; 

    if (!account) {
      return NextResponse.json({ error: "Geen wallet account gevonden" }, { status: 400, headers: defaultHeaders });
    }

    const sender = new PublicKey(account);
    const recipient = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_WALLET!); 
    
    // Gebruik mainnet-beta, want testnet support is vaak onbetrouwbaar voor Blinks
    const connection = new Connection(clusterApiUrl('mainnet-beta'));

    // Bouw de transactie
    const transaction = new Transaction();
    
    // FIX: Genereer een unieke sleutel (referentie) voor deze transactie
    // Dit is nodig voor de frontend om te 'luisteren' naar de betaling
    const uniqueReference = Keypair.generate().publicKey; 

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: parseFloat(amountParam) * LAMPORTS_PER_SOL,
      })
    );
    
    // FIX: Voeg de reference toe aan de transactie
    // Dit is het "bestelnummer" op de blockchain
    // We versturen de reference als data in een aparte instructie
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: uniqueReference,
            lamports: 0, // 0 Lamports, puur voor de data
        })
    );


    transaction.feePayer = sender;
    // Gebruik de laatste finalized blockhash
    transaction.recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash; 

    // Stuur de ongetekende transactie terug zodat de gebruiker kan tekenen
    const payload = {
      transaction: transaction.serialize({ requireAllSignatures: false }).toString("base64"),
      message: "Bedankt! Je credits worden bijgeschreven.",
      // FIX: Stuur de unieke referentie mee terug. De frontend moet hierop luisteren.
      reference: uniqueReference.toString(), 
    };

    return NextResponse.json(payload, { headers: defaultHeaders });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Transactie mislukt" }, { status: 500, headers: defaultHeaders });
  }
}