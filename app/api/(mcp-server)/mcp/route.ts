import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Bepaalt dynamisch of je op localhost of productie zit
  const baseUrl = new URL(request.url).origin;

  const mcpDefinition = {
    mcp_version: "1.0.0",
    tools: [
      {
        name: "scan_invoice",
        description: "Extraheert data uit facturen (JPG/PNG/PDF). Vereist betaling van 0.001 SOL.",
        endpoint: `${baseUrl}/api/agent/scan`, // 👈 Verwijst naar je nieuwe agent route
        method: "POST",
        input_schema: {
          type: "object",
          properties: {
            invoiceBase64: {
              type: "string",
              description: "Base64 encoded string van het bestand",
            },
            mimeType: {
              type: "string",
              enum: ["image/jpeg", "image/png", "application/pdf"],
              description: "Mime type van het bestand",
            },
            signature: {
              type: "string",
              description: "Solana transactie signature (hash) voor de 0.001 SOL betaling.",
            },
          },
          required: ["invoiceBase64", "mimeType"], // Signature is 'technisch' optioneel in schema, maar verplicht voor uitvoering
        },
        pricing: {
          amount: 0.001,
          currency: "SOL"
        }
      },
    ],
  };

  return NextResponse.json(mcpDefinition);
}