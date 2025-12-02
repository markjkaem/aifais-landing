import { calculatePackagePrices } from "@/utils/solana-pricing";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Altijd verse data

export async function GET() {
  try {
    const prices = await calculatePackagePrices();
    
    return NextResponse.json(prices, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Cache 5 min
      },
    });
  } catch (error) {
    console.error("Failed to calculate prices:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}