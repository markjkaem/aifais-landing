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

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept-Encoding",
  "X-Action-Version": "1.0",
  "X-Blockchain-Ids": "solana",
};

// OPTIONS: Preflight request
export async function OPTIONS() {
  return new NextResponse(null, { headers: defaultHeaders });
}

// GET: Wallet vraagt "Wat is dit?" - Dynamische prijzen!
export async function GET(req: NextRequest) {
  const iconUrl = "https://aifais.com/logo_official.png";
  
  // ✅ Haal actuele prijzen op
  const prices = await calculatePackagePrices();
  
  const payload = {
    icon: iconUrl,
    label: "Koop Credits",
    title: "Aifais Factuur Scanner",
    description: "Laat AI je boekhouding doen. Koop scan-credits met Solana.",
    links: {
      actions: [
        {
          label: `${prices.SINGLE.scans} Scan (${prices.SINGLE.priceSol.toFixed(4)} SOL)`,
          href: `/api/actions/top-up?package=SINGLE`,
        },
        {
          label: `${prices.BATCH_10.scans} Scans (${prices.BATCH_10.priceSol.toFixed(4)} SOL)`,
          href: `/api/actions/top-up?package=BATCH_10`,
        },
        {
          label: `${prices.BATCH_20.scans} Scans (${prices.BATCH_20.priceSol.toFixed(4)} SOL)`,
          href: `/api/actions/top-up?package=BATCH_20`,
        },
      ],
    },
  };
  return NextResponse.json(payload, { headers: defaultHeaders });
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
        { status: 400, headers: defaultHeaders }
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
        { status: 400, headers: defaultHeaders }
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
      reference: reference.toString(),
    };

    return NextResponse.json(payload, { headers: defaultHeaders });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return NextResponse.json(
      { error: "Transactie mislukt" },
      { status: 500, headers: defaultHeaders }
    );
  }
}