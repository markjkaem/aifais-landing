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

// GET: Wallet vraagt "Wat is dit?"
export async function GET(req: NextRequest) {
  const iconUrl = "https://aifais.com/logo_official.png";
  const payload = {
    icon: iconUrl,
    label: "Koop Credits",
    title: "Aifais Factuur Scanner",
    description: "Laat AI je boekhouding doen. Koop scan-credits met Solana.",
    links: {
      actions: [
        {
          label: "1 Scan (0.003 SOL)",
          href: "/api/actions/top-up?amount=0.003&scans=1",
        },
        {
          label: "10 Scans (0.015 SOL)",
          href: "/api/actions/top-up?amount=0.015&scans=10",
        },
        {
          label: "20 Scans (0.025 SOL)",
          href: "/api/actions/top-up?amount=0.025&scans=20",
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
    const amountParam = searchParams.get("amount") || "0.003";
    const scansParam = searchParams.get("scans") || "1";
    
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

    const connection = new Connection(clusterApiUrl("mainnet-beta"));

    // ✅ Genereer unieke reference key
    const reference = Keypair.generate().publicKey;

    const transaction = new Transaction();

    // Hoofdtransactie: betaling naar AIFAIS wallet
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: parseFloat(amountParam) * LAMPORTS_PER_SOL,
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
      message: `Bedankt! Je ontvangt ${scansParam} scan credits.`,
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