import { NextRequest, NextResponse } from "next/server";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { getScansForAmount } from "@/utils/solana-pricing";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const signature = searchParams.get("signature");
  const reference = searchParams.get("reference");

  // Validatie
  if (!signature || !reference) {
    return NextResponse.json(
      { 
        valid: false, 
        error: "Signature en reference zijn verplicht" 
      },
      { status: 400 }
    );
  }

  try {
    // Verbind met Solana mainnet
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta"),
      "confirmed"
    );
    
    // Haal de transactie op
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    // Check 1: Bestaat de transactie?
    if (!tx) {
      return NextResponse.json({
        valid: false,
        error: "Transactie niet gevonden op de blockchain",
      });
    }

    // Check 2: Was de transactie succesvol?
    if (tx.meta?.err) {
      return NextResponse.json({
        valid: false,
        error: "Transactie is gefaald",
      });
    }

    // Check 3: Zit onze reference key erin?
    const referenceKey = new PublicKey(reference);
    const accountKeys = tx.transaction.message.getAccountKeys();
    const hasReference = accountKeys.staticAccountKeys.some((key) =>
      key.equals(referenceKey)
    );

    if (!hasReference) {
      return NextResponse.json({
        valid: false,
        error: "Reference key niet gevonden in transactie",
      });
    }

    // Check 4: Is de betaling naar onze wallet gegaan?
    const recipientKey = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_WALLET!);
    const recipientIndex = accountKeys.staticAccountKeys.findIndex((key) =>
      key.equals(recipientKey)
    );

    if (recipientIndex === -1) {
      return NextResponse.json({
        valid: false,
        error: "Betaling niet naar correcte wallet",
      });
    }

    // Check 5: Hoeveel is er betaald?
    const postBalance = tx.meta?.postBalances[recipientIndex] || 0;
    const preBalance = tx.meta?.preBalances[recipientIndex] || 0;
    const amountReceivedLamports = postBalance - preBalance;
    const amountReceivedSol = amountReceivedLamports / 1e9;

    // ✅ Gebruik dynamische pricing om scans te bepalen
    const maxScans = await getScansForAmount(amountReceivedSol);

    if (maxScans === 0) {
      return NextResponse.json({
        valid: false,
        error: `Betaald bedrag komt niet overeen met een pakket: ${amountReceivedSol.toFixed(4)} SOL`,
      });
    }

    console.log("✅ Solana verificatie succesvol:", {
      signature,
      amountReceivedSol,
      maxScans,
    });

    // ✅ Alles klopt!
    return NextResponse.json({
      valid: true,
      maxScans,
      amountReceived: amountReceivedSol,
      signature,
    });

  } catch (error: any) {
    console.error("Solana verification error:", error);
    
    return NextResponse.json(
      {
        valid: false,
        error: error.message || "Verificatie mislukt",
      },
      { status: 500 }
    );
  }
}