import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";
import { calculatePackagePrices, PACKAGE_CONFIG } from "@/utils/solana-pricing";
import { ACTIONS_CORS_HEADERS, ActionGetResponse } from "@solana/actions";

// ✅ Override met correcte headers voor Actions spec 2.2.1
const CORS_HEADERS = {
  ...ACTIONS_CORS_HEADERS,
  "X-Action-Version": "2.2.1",
  "X-Blockchain-Ids": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
};

// OPTIONS: Preflight request - CRITICAL for CORS!
export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: CORS_HEADERS 
  });
}

// GET: Wallet vraagt "Wat is dit?" - Dynamische prijzen!
export async function GET(req: NextRequest) {
  const iconUrl = "https://aifais.com/logo_official.png";
  
  // ✅ Haal actuele prijzen op
  const prices = await calculatePackagePrices();
  
  // ✅ Bepaal de base URL (localhost of productie)
  const baseUrl = req.nextUrl.origin;
  
  const payload: ActionGetResponse = {
    icon: iconUrl,
    label: "Koop Credits",
    title: "Aifais Factuur Scanner",
    description: "Laat AI je boekhouding doen. Koop scan-credits met Solana. Agents: use /api/agent/scan endpoint after payment.",
    links: {
      actions: [
        {
          label: `${prices.SINGLE.scans} Scan (${prices.SINGLE.priceSol.toFixed(4)} SOL)`,
          href: `${baseUrl}/api/actions/top-up?package=SINGLE`,
          type: "external-link"
        },
        {
          label: `${prices.BATCH_10.scans} Scans (${prices.BATCH_10.priceSol.toFixed(4)} SOL)`,
          href: `${baseUrl}/api/actions/top-up?package=BATCH_10`,
          type: "external-link"
        },
        {
          label: `${prices.BATCH_20.scans} Scans (${prices.BATCH_20.priceSol.toFixed(4)} SOL)`,
          href: `${baseUrl}/api/actions/top-up?package=BATCH_20`,
          type: "external-link"
        },
      ],
    },
  };
  
  return NextResponse.json(payload, { headers: CORS_HEADERS });
}

// POST: Gebruiker klikt op knop
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageParam = searchParams.get("package") as keyof typeof PACKAGE_CONFIG | null;
    
    // Fallback naar oude amount/scans parameters voor backwards compatibility
    const amountParam = searchParams.get("amount");
    const scansParam = searchParams.get("scans");
    
    const body = await req.json();
    const { account } = body;

    if (!account) {
      return NextResponse.json(
        { error: "Geen wallet account gevonden" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // ✅ Bepaal prijs en aantal scans
    let solAmount: number;
    let scansAmount: number;

    if (packageParam && packageParam in PACKAGE_CONFIG) {
      // Nieuwe methode: gebruik package parameter
      const prices = await calculatePackagePrices();
      const selectedPackage = prices[packageParam];
      solAmount = selectedPackage.priceSol;
      scansAmount = selectedPackage.scans;
    } else if (amountParam && scansParam) {
      // Oude methode: gebruik directe amount/scans (backwards compatibility)
      solAmount = parseFloat(amountParam);
      scansAmount = parseInt(scansParam);
    } else {
      return NextResponse.json(
        { error: "Geen geldig pakket of bedrag opgegeven" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const sender = new PublicKey(account);
    const recipient = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_WALLET!);

    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta")
    );

    // ✅ Genereer unieke reference key
    const reference = Keypair.generate().publicKey;

    const transaction = new Transaction();

    // Hoofdtransactie: betaling naar AIFAIS wallet
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: Math.round(solAmount * LAMPORTS_PER_SOL),
      })
    );

    // Reference transfer (0 lamports) voor tracking
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: reference,
        lamports: 0,
      })
    );

    transaction.feePayer = sender;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("finalized")
    ).blockhash;

    const payload = {
      transaction: transaction
        .serialize({ requireAllSignatures: false })
        .toString("base64"),
      message: `Bedankt! Je ontvangt ${scansAmount} scan credits.`,
      // ✅ Action chaining: redirect naar success page na betaling
      links: {
        next: {
          type: "inline",
          action: {
            type: "completed",
            icon: "https://aifais.com/logo_official.png",
            label: "Ga naar Scanner",
            title: "Credits toegevoegd!",
            description: `Je hebt ${scansAmount} scan credits ontvangen. Klik hieronder om naar de scanner te gaan.`,
            links: {
              actions: [
                {
                  label: "Open Scanner",
                  href: `${req.nextUrl.origin}/tools/factuur-scanner?ref=blink`,
                  type: "external-link"
                }
              ]
            }
          }
        }
      }
    };

    return NextResponse.json(payload, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return NextResponse.json(
      { error: "Transactie mislukt" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}