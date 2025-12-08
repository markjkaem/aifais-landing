import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;

  const mcpDefinition = {
    mcp_version: "1.0.0",
    tools: [
      // Tool 1: Scan Invoice (Bestaand)
      {
        name: "scan_invoice",
        description: "Extraheert data uit facturen (JPG/PNG/PDF). Vereist betaling van 0.001 SOL.",
        endpoint: `${baseUrl}/api/agent/scan`,
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
      },
      // Tool 2: Create Invoice (NIEUW)
      {
        name: "create_invoice",
        description: "Genereert een PDF factuur op basis van data en retourneert een Base64 string. De Agent kan deze opslaan als bestand.",
        endpoint: `${baseUrl}/api/agent/create-invoice`, // 👈 We maken deze zo aan
        method: "POST",
        input_schema: {
          type: "object",
          properties: {
            ownName: { type: "string", description: "Naam van eigen bedrijf" },
            clientName: { type: "string", description: "Naam van de klant" },
            invoiceNumber: { type: "string" },
            items: { 
              type: "array", 
              description: "Lijst met producten/diensten",
              items: {
                  type: "object",
                  properties: {
                      description: { type: "string" },
                      quantity: { type: "number" },
                      price: { type: "number" },
                      vatRate: { type: "number" }
                  }
              }
            },
            signature: { type: "string", description: "Solana transactie signature (optioneel voor nu)" },
          },
          required: ["ownName", "clientName", "items"],
        },
        pricing: { amount: 0.001, currency: "SOL" } // Optioneel: vraag geld voor genereren
      },
    ],
  };

  return NextResponse.json(mcpDefinition);
}