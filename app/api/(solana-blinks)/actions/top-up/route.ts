import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Keypair, // Nodig voor referentie
} from "@solana/web3.js";
import { ACTIONS_CORS_HEADERS, ActionGetResponse } from "@solana/actions";

// CONFIGURATIE: Zorg dat dit overeenkomt met je Agent prijs!
const PRICE_PER_SCAN = 0.001; 
const MY_WALLET = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_WALLET!);

const CORS_HEADERS = {
  ...ACTIONS_CORS_HEADERS,
  "X-Action-Version": "2.2.1",
  "X-Blockchain-Ids": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

// GET: Toon de Blink knop op Twitter
export async function GET(req: NextRequest) {
  const payload: ActionGetResponse = {
    icon: "https://aifais.com/logo_official.png", // Zorg dat dit plaatje bestaat!
    label: `Scan Factuur (${PRICE_PER_SCAN} SOL)`,
    title: "Direct Invoice Scanner",
    description: "Betaal 0.001 SOL om direct één factuur te scannen met AI. Na betaling word je doorgestuurd naar de upload pagina.",
    links: {
      actions: [
        {
          label: `Koop 1 Scan (${PRICE_PER_SCAN} SOL)`,
          href: `${req.nextUrl.origin}/api/actions/top-up`, // Verwijst naar de POST hieronder
          type: "transaction"
        }
      ],
    },
  };
  
  return NextResponse.json(payload, { headers: CORS_HEADERS });
}

// POST: Bouw de transactie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { account } = body;

    if (!account) {
      return NextResponse.json({ error: "Wallet required" }, { status: 400, headers: CORS_HEADERS });
    }

    const sender = new PublicKey(account);
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta"));

    // Maak een unieke referentie key (om de betaling te kunnen volgen in je DB als je dat wilt)
    const reference = Keypair.generate().publicKey;

    const transaction = new Transaction();

    // 1. De Betaling
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: MY_WALLET,
        lamports: PRICE_PER_SCAN * LAMPORTS_PER_SOL,
      })
    );

    // 2. De Referentie (zodat we weten wie betaald heeft)
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: reference,
            lamports: 0, // Kost niks, is alleen marker
        })
    );
    
    transaction.feePayer = sender;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const payload = {
      transaction: transaction.serialize({ requireAllSignatures: false }).toString("base64"),
      message: "Betaling geslaagd! Ga verder om je bestand te uploaden.",
      // 👇 HIER IS DE TRUC: Stuur de mens door naar je website
      links: {
        next: {
            type: "inline", // Of 'post' afhankelijk van client support, inline toont resultaat
            action: {
                description: "Betaling ontvangen. Klik om te uploaden.",
                icon: "https://aifais.com/upload-icon.png",
                label: "Upload Factuur",
                title: "Ga naar Upload",
                type: "external-link", // Stuur ze naar je frontend website
                href: `https://aifais.com/upload?tx=${reference.toBase58()}` 
            }
        }
      }
    };

    return NextResponse.json(payload, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: "Transaction failed" }, { status: 500, headers: CORS_HEADERS });
  }
}