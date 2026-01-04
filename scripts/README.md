# AIFAIS API Test Scripts

Deze folder bevat test scripts voor alle AIFAIS API endpoints.

## 📁 Folder Structuur

```
scripts/
├── tests/              # Alle test scripts
│   ├── test-invoice-scanner.js
│   ├── test-contract-checker.js
│   ├── test-quote-generator.js
│   └── test-terms-generator.js
├── mocks/              # Mock bestanden voor tests
│   ├── mock-invoice.pdf
│   └── mock-contract.pdf
├── output/             # Test output (gitignored)
│   └── .gitignore
├── test-all.js         # Master test runner
└── README.md           # Deze file
```

## 📋 Beschikbare Tests

### 1. Invoice Scanner (`tests/test-invoice-scanner.js`)
- **Endpoint:** `/api/v1/finance/scan`
- **Mock file:** `mocks/mock-invoice.pdf`
- **Auth:** DEV_BYPASS (Solana gemockt)
- **Test:** Bulk invoice scanning met AI

### 2. Contract Checker (`tests/test-contract-checker.js`)
- **Endpoint:** `/api/v1/legal/check-contract`
- **Mock file:** `mocks/mock-contract.pdf`
- **Auth:** DEV_BYPASS (Solana gemockt)
- **Test:** Contract analyse met PDF report generatie
- **Output:** `output/test-contract-report.pdf`

### 3. Quote Generator (`tests/test-quote-generator.js`)
- **Endpoint:** `/api/v1/finance/generate-quote`
- **Mock file:** Geen (gebruikt JSON payload)
- **Auth:** Geen (gratis tool)
- **Test:** PDF offerte generatie
- **Output:** `output/test-quote.pdf`

### 4. Terms Generator (`tests/test-terms-generator.js`)
- **Endpoint:** `/api/v1/legal/generate-terms`
- **Mock file:** Geen (gebruikt JSON payload)
- **Auth:** Geen (gratis tool)
- **Test:** AI-powered algemene voorwaarden generatie
- **Output:** `output/test-terms.pdf`

## 🚀 Gebruik

### Individuele test runnen:
```bash
node scripts/tests/test-invoice-scanner.js
node scripts/tests/test-contract-checker.js
node scripts/tests/test-quote-generator.js
node scripts/tests/test-terms-generator.js
```

### Alle tests runnen:
```bash
node scripts/test-all.js
```

## 📁 Benodigde Mock Files

Zorg dat deze bestanden in de `scripts/mocks/` folder staan:

- ✅ `mock-invoice.pdf` - Voor Invoice Scanner test
- ✅ `mock-contract.pdf` - Voor Contract Checker test

## 🔐 Solana Mocking

Tests die betaling vereisen gebruiken `DEV_BYPASS` als signature:
- Invoice Scanner
- Contract Checker

Dit wordt automatisch herkend door de API en skipt de Solana verificatie in development mode.

## 📊 Output Files

Tests genereren output in de `scripts/output/` folder:
- `test-contract-report.pdf` - Contract analyse rapport
- `test-quote.pdf` - Gegenereerde offerte
- `test-terms.pdf` - Algemene voorwaarden

**Note:** De output folder is gitignored, dus deze files worden niet gecommit.

## ⚙️ Configuratie

Alle tests gebruiken:
- **API URL:** `http://localhost:3000`
- **Auth:** `DEV_BYPASS` voor betaalde tools
- **Format:** JSON/PDF afhankelijk van endpoint

## 🧪 Test Output

Elke test toont:
- ✅ Request details (endpoint, payload size)
- ✅ Response status en content type
- ✅ Success/failure indicatie
- ✅ Gedetailleerde error messages bij failures
- ✅ Output file locatie (voor PDF tests)

## 📝 Nieuwe Test Toevoegen

1. Maak een nieuw bestand in `tests/`: `test-[tool-name].js`
2. Gebruik het template van bestaande tests
3. Update mock files in `mocks/` indien nodig
4. Voeg toe aan `test-all.js` in de `tests` array
5. Update deze README

## 🔧 Troubleshooting

**Test faalt met "Cannot find mock file":**
- Controleer of de mock PDF in de `scripts/mocks/` folder staat
- Check de bestandsnaam (case-sensitive)

**Test faalt met "Connection refused":**
- Zorg dat de dev server draait: `bun dev`
- Check of de API op `localhost:3000` draait

**PDF generatie faalt:**
- Check of OpenAI API key is geconfigureerd (voor AI tools)
- Controleer de console output voor specifieke errors

**Output files niet gevonden:**
- Check de `scripts/output/` folder
- Zorg dat de folder bestaat (wordt automatisch aangemaakt)

## 📚 Meer Info

Zie de individuele test files voor gedetailleerde payload voorbeelden en response handling.
