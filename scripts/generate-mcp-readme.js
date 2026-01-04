#!/usr/bin/env node
/**
 * generate-mcp-readme.js
 * 
 * Generates README.md for aifais-mcp-server from website documentation.
 * Run with: node scripts/generate-mcp-readme.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MCP_DIR = path.join(ROOT, 'aifais-mcp-server');

// Configuration - update these when pricing or tools change
// Configuration - update these when pricing or tools change
const CONFIG = {
  version: '1.2.0',
  pricingModel: 'Pay-per-tool (vanaf 0.001 SOL)',
  tools: [
    {
      name: 'scan_invoice',
      description: 'Scant een factuur/bonnetje en extraheert gestructureerde data via AI.',
      params: ['invoiceBase64 (required)', 'mimeType (required)', 'signature (optional, 0.001 SOL)'],
      price: '0.001 SOL'
    },
    {
      name: 'create_invoice',
      description: 'Genereer een PDF factuur op basis van JSON data.',
      params: ['ownName', 'clientName', 'items (array)'],
      price: 'Gratis'
    },
    {
      name: 'generate_quote',
      description: 'Genereer een PDF offerte op basis van JSON data.',
      params: ['companyName', 'clientName', 'projectTitle', 'items (array)', 'validUntil (optional)'],
      price: 'Gratis'
    },
    {
      name: 'check_contract',
      description: 'Analyseer een juridisch contract op risico\'s.',
      params: ['contractBase64 (required)', 'signature (required, 0.001 SOL)'],
      price: '0.001 SOL'
    },
    {
      name: 'generate_terms',
      description: 'Genereer algemene voorwaarden op maat.',
      params: ['companyName', 'companyType', 'signature (required, 0.001 SOL)'],
      price: '0.001 SOL'
    }
  ],
  wallet: 'Bqpo3emFG46VGLX4korYoeta3a317pWbR2DMbWnFpZ8c',
};

function generateReadme() {
  const content = `# AIFAIS MCP Server ⚡

De officiële Model Context Protocol (MCP) server voor AIFAIS. Geef je AI agents (zoals Claude of Cursor) direct toegang tot specialistische tools voor de Nederlandse markt.

> **Noot:** Deze MCP server is specifiek voor Claude Desktop en Cursor. Andere AI agents kunnen de API [direct aanroepen](https://aifais.mobi/developers/docs#direct-api) via HTTP zonder server.

## 🚀 Quick Start

### Voor Claude Desktop
Voeg dit toe aan je \`claude_desktop_config.json\`:

\`\`\`json
{
  "mcpServers": {
    "aifais": {
      "command": "npx",
      "args": ["-y", "github:aifais/aifais-mcp-server"]
    }
  }
}
\`\`\`

### Voor Cursor IDE
1. Ga naar **Settings** -> **Features** -> **MCP**.
2. Klik op **+ Add MCP Server**.
3. Kies type **command**.
4. Gebruik als command: \`npx -y github:aifais/aifais-mcp-server\`.

---

## 💎 Beschikbare Tools

${CONFIG.tools.map(tool => `### \`${tool.name}\` (${tool.price})
${tool.description}

**Parameters:**
${tool.params.map(p => `- \`${p}\``).join('\n')}
`).join('\n')}

---

## 🔍 Discovery API

Je kunt de actuele tool-definities en prijzen altijd ophalen via ons discovery endpoint:
\`https://aifais.com/api/mcp\`

---

## 💳 Pricing

Prijzen zijn **Pay-per-Tool** via het X402 protocol.
Sommige tools zijn gratis (factuur/offerte genereren), anderen kosten een klein bedrag in SOL.

**Hoe het werkt:**
1. De agent doet een verzoek zonder \`signature\`.
2. De server antwoordt met een \`402 Error\` en geeft een Solana wallet adres + bedrag.
3. Jij (of je agent) betaalt de transactie.
4. De agent stuurt het verzoek opnieuw, maar nu met de \`signature\`.

Wallet: \`${CONFIG.wallet}\`

---

## 🛠️ Lokale Ontwikkeling

\`\`\`bash
npm install
npm run build
npm start
\`\`\`

Configuratie via \`.env\`:
\`\`\`env
AIFAIS_API_URL=https://aifais.com/api/v1/scan
DEBUG=true
\`\`\`

---

## 🪵 Debugging

Zet \`DEBUG=true\` aan in je environment. Logs worden naar \`stderr\` geschreven.

---

## 📝 Licentie

MIT © AIFAIS

---

*Auto-generated from website docs. Version ${CONFIG.version}*
`;

  const outputPath = path.join(MCP_DIR, 'README.md');
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`✅ Generated ${outputPath}`);
}

generateReadme();
