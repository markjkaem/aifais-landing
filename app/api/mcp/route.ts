import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const baseUrl = new URL(request.url).origin;

    const mcpDefinition = {
        mcp_version: "1.0.0",
        tools: [
            {
                name: "scan_invoice",
                description: "Extraheert data uit facturen (JPG/PNG/PDF). Vereist betaling van 0.001 SOL.",
                endpoint: `${baseUrl}/api/v1/scan`,
                method: "POST",
                input_schema: {
                    type: "object",
                    properties: {
                        invoiceBase64: { type: "string", description: "Base64 string van het bestand" },
                        mimeType: { type: "string", enum: ["image/jpeg", "image/png", "application/pdf"] },
                        signature: { type: "string", description: "Solana transactie signature" },
                    },
                    required: ["invoiceBase64", "mimeType"],
                },
                pricing: { amount: 0.001, currency: "SOL" }
            }
        ],
    };

    return NextResponse.json(mcpDefinition);
}
