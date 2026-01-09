# AIFAIS Tool Test Plan - Playwright Developer Mode

## Overzicht

Dit testplan beschrijft de systematische testing van alle 20 AIFAIS tools met Playwright in developer mode (`?dev=true`).

---

## Test Methodologie

### Test URL Formaat
```
http://localhost:3000/nl/tools/{slug}?dev=true
```

### Test Criteria per Tool

| Criterium | Beschrijving | Check |
|-----------|--------------|-------|
| **Page Load** | Pagina laadt zonder errors | [ ] |
| **Console Errors** | Geen JavaScript errors in console | [ ] |
| **Form Rendering** | Alle form fields zichtbaar | [ ] |
| **Form Validation** | Validatie werkt correct | [ ] |
| **Submission** | Form kan worden ingediend (dev mode) | [ ] |
| **Result Display** | Resultaat wordt correct getoond | [ ] |
| **Responsiveness** | Mobile/desktop layout werkt | [ ] |
| **Export (indien van toepassing)** | PDF/Excel export werkt | [ ] |

---

## Tool Inventaris

### GRATIS Tools (7 tools) - Volledig testbaar

| # | Slug | Tool Naam | Category |
|---|------|-----------|----------|
| 1 | `invoice-creation` | Factuur Maker | Finance |
| 2 | `price-calculator` | Prijs Calculator | Finance |
| 3 | `btw-calculator` | BTW Calculator | Finance |
| 4 | `quote-generator` | Offerte Generator | Finance |
| 5 | `roi-calculator` | ROI Calculator | Consulting |
| 6 | `benchmark` | AI Benchmark Tool | Consulting |
| 7 | `email-generator` | Email Generator | Marketing |

### BETAALDE Tools (13 tools) - Met DEV_BYPASS

| # | Slug | Tool Naam | Category | Stripe Link |
|---|------|-----------|----------|-------------|
| 1 | `invoice-extraction` | Factuur Scanner | Finance | SINGLE |
| 2 | `contract-checker` | Contract Checker | Legal | CONTRACT |
| 3 | `terms-generator` | Algemene Voorwaarden | Legal | TERMS |
| 4 | `cv-screener` | CV Screener | HR | CV |
| 5 | `interview-questions` | Sollicitatievragen | HR | INTERVIEW |
| 6 | `social-planner` | Social Media Planner | Marketing | SOCIAL |
| 7 | `pitch-deck` | Pitch Deck Generator | Sales | PITCH |
| 8 | `lead-scorer` | Lead Scorer | Sales | LEAD |
| 9 | `kvk-search` | KVK Bedrijfszoeker | Business | KVK |
| 10 | `business-plan` | Business Plan Generator | Consulting | BUSINESSPLAN |
| 11 | `meeting-summarizer` | Meeting Summarizer | Business | MEETING |
| 12 | `competitor-analyzer` | Competitor Analyzer | Sales | COMPETITOR |
| 13 | `swot-generator` | SWOT Generator | Consulting | SWOT |

---

## Test Data per Tool

### 1. invoice-creation (Gratis)
```json
{
  "companyName": "Test BV",
  "companyAddress": "Teststraat 1, 1234 AB Amsterdam",
  "kvkNumber": "12345678",
  "btwNumber": "NL123456789B01",
  "clientName": "Klant BV",
  "clientAddress": "Klantweg 2, 5678 CD Rotterdam",
  "invoiceNumber": "2024-001",
  "items": [{"description": "Consultancy", "quantity": 10, "unitPrice": 100}]
}
```

### 2. price-calculator (Gratis)
```json
{
  "productName": "Test Product",
  "costPrice": 50,
  "targetMargin": 30,
  "vatRate": 21
}
```

### 3. btw-calculator (Gratis)
```json
{
  "amount": 100,
  "vatRate": 21,
  "direction": "netto_to_bruto"
}
```

### 4. quote-generator (Gratis)
```json
{
  "companyName": "Test BV",
  "clientName": "Klant BV",
  "validDays": 30,
  "items": [{"description": "Dienst A", "quantity": 1, "unitPrice": 500}]
}
```

### 5. roi-calculator (Gratis)
```json
{
  "currentHours": 40,
  "hourlyRate": 75,
  "automationPercentage": 30
}
```

### 6. benchmark (Gratis)
```json
{
  "sector": "technology",
  "companySize": "10-50",
  "aiUsage": "some"
}
```

### 7. email-generator (Gratis)
```json
{
  "emailType": "proposal",
  "recipientName": "Jan Jansen",
  "companyName": "Client BV",
  "context": "Website redesign project",
  "tone": "professional"
}
```

### 8. invoice-extraction (Betaald)
- Upload test PDF factuur
- Verwacht: Extracted data met bedrijfsnaam, bedragen, BTW

### 9. contract-checker (Betaald)
```json
{
  "contractText": "Dit is een arbeidsovereenkomst tussen partij A en partij B. De overeenkomst gaat in op 1 januari 2024 en heeft een looptijd van 1 jaar. Partij B ontvangt een salaris van EUR 4000 bruto per maand."
}
```

### 10. terms-generator (Betaald)
```json
{
  "companyName": "Test BV",
  "businessType": "dienstverlening",
  "services": ["consultancy", "software development"]
}
```

### 11. cv-screener (Betaald)
```json
{
  "cvText": "Jan Jansen - Senior Developer\n5 jaar ervaring met React, Node.js\nWerkervaring: Google, Microsoft",
  "jobDescription": "Wij zoeken een Senior Frontend Developer met React ervaring"
}
```

### 12. interview-questions (Betaald)
```json
{
  "jobTitle": "Senior Frontend Developer",
  "level": "senior",
  "skills": ["React", "TypeScript", "Testing"]
}
```

### 13. social-planner (Betaald)
```json
{
  "topic": "Lancering nieuwe AI tool",
  "platforms": ["linkedin", "twitter"],
  "tone": "professional"
}
```

### 14. pitch-deck (Betaald)
```json
{
  "companyName": "Test Startup",
  "problem": "Bedrijven verspillen tijd aan admin",
  "solution": "AI automatisering",
  "market": "EUR 1B Nederlandse MKB markt"
}
```

### 15. lead-scorer (Betaald)
```json
{
  "companyName": "Prospect BV",
  "companySize": "50-100",
  "industry": "technology",
  "engagement": "high"
}
```

### 16. kvk-search (Betaald)
```json
{
  "query": "Coolblue",
  "type": "naam"
}
```

### 17. business-plan (Betaald)
```json
{
  "companyName": "Test Startup BV",
  "businessIdea": "AI automatisering voor MKB",
  "targetMarket": "Nederlandse MKB",
  "revenueModel": "SaaS subscriptie"
}
```

### 18. meeting-summarizer (Betaald)
```json
{
  "notes": "Meeting over Q1 planning. Jan neemt marketing op zich. Deadline: 15 januari. Besloten: budget verhogen naar 10k. Actie: offerte opvragen bij leverancier."
}
```

### 19. competitor-analyzer (Betaald)
```json
{
  "yourCompany": "AIFAIS",
  "competitors": ["Competitor A", "Competitor B"],
  "industry": "AI tools"
}
```

### 20. swot-generator (Betaald)
```json
{
  "companyName": "Test BV",
  "description": "Software development bureau gespecialiseerd in AI oplossingen voor MKB",
  "industry": "technology"
}
```

---

## Test Volgorde

### Fase 1: Quick Smoke Tests
Snel alle 20 tools laden om page load errors te detecteren.

### Fase 2: Gratis Tools Deep Test
Volledig testen van de 7 gratis tools met form submission.

### Fase 3: Betaalde Tools Dev Mode Test
Testen van 13 betaalde tools met `?dev=true` en DEV_BYPASS.

### Fase 4: Verbeterplan Generatie
Per tool een verbeterplan opstellen op basis van bevindingen.

---

## Verbeterplan Template

Per tool wordt het volgende genoteerd:

```markdown
## [Tool Naam]

### Status: [PASS/FAIL/PARTIAL]

### Bevindingen
- [ ] Issue 1: beschrijving
- [ ] Issue 2: beschrijving

### Verbeterpunten
1. **Prioriteit HOOG**: ...
2. **Prioriteit MIDDEL**: ...
3. **Prioriteit LAAG**: ...

### Aanbevelingen
- ...
```

---

## Output

Na afronding worden de resultaten opgeslagen in:
- `test-results/tool-tests.json` - Gestructureerde test resultaten
- `test-results/improvement-plans.md` - Verbeterplannen per tool
