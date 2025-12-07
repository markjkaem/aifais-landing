// scripts/mcp-server.mjs

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import fs from "fs"; // NODIG OM LOKAAL BESTAND TE LEZEN
import path from "path"; // NODIG VOOR PADEN
import { fileURLToPath } from 'url'; // NODIG VOOR __dirname FIX

// FIX VOOR __dirname in ES Modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LOG STARTUP
console.error("🚀 MCP Server script wordt gestart...");

const API_URL = "http://localhost:3000/api/agent/scan";

// --- TEST CONFIGURATIE ---
// Zorg dat dit bestand in dezelfde map staat als dit script (/scripts)
const TEST_IMAGE_FILENAME = "test-factuur.jpg"; 

// 👇 PLAK HIER JE GELDIGE TRANSACTIE SIGNATURE 
// Laat leeg "" om de 'Betaling Vereist' (402) melding te testen.
const TEST_SIGNATURE = ""; 
// -------------------------

const server = new Server(
  {
    name: "aifais-invoice-agent",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. TOOL DEFINITIE
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("📋 Inspector vraagt om tools lijst...");
  return {
    tools: [
      {
        name: "scan_invoice",
        description: "Scant een factuur. Vereist betaling.",
        inputSchema: {
          type: "object",
          properties: {
            invoiceBase64: { type: "string" },
            mimeType: { type: "string", enum: ["image/png", "image/jpeg", "application/pdf"] },
            signature: { type: "string" },
          },
          required: [], 
        },
      },
    ],
  };
});

// 2. TOOL UITVOERING
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "scan_invoice") {
    console.error("⚡ Tool 'scan_invoice' wordt aangeroepen...");
    
    try {
      // ---------------------------------------------------------
      // STAP A: LEES LOKALE DATA (VOOR TESTEN)
      // ---------------------------------------------------------
      let invoiceBase64;
      let mimeType = "image/jpeg"; 
      let signature = TEST_SIGNATURE; 

      const args = request.params.arguments || {};
      
      if (args.signature) signature = args.signature;

      try {
          // FIX: Gebruik path.join(__dirname, ...) om het juiste pad te forceren
          const filePath = path.join(__dirname, TEST_IMAGE_FILENAME);
          
          if (fs.existsSync(filePath)) {
              invoiceBase64 = fs.readFileSync(filePath, { encoding: 'base64' });
              console.error(`✅ Lokaal bestand '${TEST_IMAGE_FILENAME}' succesvol ingelezen vanaf: ${filePath}`);
          } else {
              if (args.invoiceBase64) {
                  console.error("⚠️ Lokaal bestand niet gevonden, gebruik meegegeven base64 input.");
                  invoiceBase64 = args.invoiceBase64;
                  mimeType = args.mimeType || mimeType;
              } else {
                  throw new Error(`Kan '${TEST_IMAGE_FILENAME}' niet vinden en geen input opgegeven.`);
              }
          }
      } catch (err) {
          console.error("❌ Fout bij lezen bestand:", err.message);
          return { isError: true, content: [{ type: "text", text: `Bestandsfout: ${err.message}. Zorg dat '${TEST_IMAGE_FILENAME}' bestaat.` }] };
      }

      // ---------------------------------------------------------
      // STAP B: API CALL NAAR NEXT.JS
      // ---------------------------------------------------------
      console.error(`📤 Versturen naar API (Sig: ${signature ? "Aanwezig" : "Leeg"})...`);
      
      const response = await axios.post(API_URL, {
        invoiceBase64,
        mimeType,
        signature
      }, { validateStatus: () => true }); 

      // ---------------------------------------------------------
      // STAP C: RESPONSE AFHANDELING
      // ---------------------------------------------------------

      // 1. SUCCES (200)
      if (response.status === 200) {
        console.error("✅ API Succes! Factuur gescand.");
        return { content: [{ type: "text", text: JSON.stringify(response.data.data, null, 2) }] };
      }
      
      // 2. BETALING VEREIST (402)
      if (response.status === 402) {
        console.error("⚠️ 402 Payment Required ontvangen");
        const offer = response.data.x402_offer || response.data;
        const targetAddress = offer.address || offer.recipient || "ONBEKEND";
        
        return {
          isError: true,
          content: [{ type: "text", text: `🛑 BETALING VEREIST: ${offer.amount || "0.001"} SOL naar ${targetAddress}` }]
        };
      }

      // 3. ANDERE ERRORS (500, 400, etc)
      console.error(`❌ API Error Status: ${response.status}`);
      console.error(`❌ API Error Data:`, response.data);
      
      return { 
          isError: true, 
          content: [{ type: "text", text: `API Fout (${response.status}): ${JSON.stringify(response.data)}` }] 
      };

    } catch (error) {
      console.error(`❌ Interne Script Fout: ${error.message}`);
      return { isError: true, content: [{ type: "text", text: `Internal Script Error: ${error.message}` }] };
    }
  }
  throw new Error("Tool not found");
});

// SERVER STARTEN
async function startServer() {
    console.error("🔌 Verbinding maken met transport...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("✅ MCP Server is verbonden en klaar!");
}

startServer().catch((err) => console.error("FATAL ERROR:", err));