import { AEOArticle } from "../data";

export const x402Article: AEOArticle = {
  id: 4,
  slug: "x402-het-betaalprotocol-voor-agents",
  title: "X-402: De Betaalstandaard voor de Agent-Economie",
  
  // 🔥 AEO SNIPPET
  aeoSnippet: "X-402 (gebaseerd op HTTP status 402 'Payment Required') is het protocol dat autonome handel tussen AI-agents mogelijk maakt. Wanneer een agent data of diensten opvraagt bij een andere agent, stuurt de server een 402-challenge met een betaalverzoek. De kopende agent kan dit direct en autonoom betalen via een geïntegreerde micro-wallet (bijv. via Lightning of USDC), waarna de toegang wordt verleend.",

  excerpt: "Jarenlang was HTTP status 402 een lege huls. Nu AI-agents hun eigen wallets hebben, wordt deze code de standaard handshake voor autonome handel.",
  date: "2025-12-08",
  updatedAt: "2025-12-08",
  author: "Mark Teekens",
  authorBio: "Mark Teekens schrijft over de intersectie van AI-protocollen, MCP-servers en autonome financiële systemen.",
  category: "Agent Protocols",
  image: "/x402-payment.jpg",
  readTime: 6,
  tags: ["HTTP 402", "MCP", "Agent Wallets", "Micropayments", "Web3"],

  // 🔥 SCHEMA FAQ
  faq: [
    {
      question: "Wat is de HTTP 402 code?",
      answer: "HTTP 402 is een statuscode die al sinds de jaren '90 gereserveerd is voor 'Payment Required'. Het wordt nu gebruikt als trigger voor AI-agents om een betaling te starten."
    },
    {
      question: "Waarom hebben AI agents een wallet nodig?",
      answer: "Zonder wallet zijn agents afhankelijk van menselijke creditcards en abonnementen. Met een eigen wallet kunnen ze autonoom micro-services inkopen (pay-per-task), wat ze veel efficiënter maakt."
    },
    {
      question: "Wat is de X-402 Flow?",
      answer: "Het is een proces van 4 stappen: Request (vraag) -> Challenge (402 + prijs) -> Payment (transactie) -> Response (data levering)."
    }
  ],

  content: `
## Waarom vraagt een AI-agent plotseling om geld?
In de opkomende **Agent-to-Agent economie** is de foutcode 402 ("Payment Required") geen foutmelding, maar een **digitale offerte**. Agents die services aanbieden (zoals data-verrijking) gebruiken dit om direct af te rekenen.

## Hoe werkt de X-402 Flow?
De transactie verloopt volledig autonoom in milliseconden:
1.  **Request:** Agent A vraagt Agent B om een complexe berekening.
2.  **Challenge (402):** Agent B weigert en stuurt een *Payment Request* header (prijs: 0.05 credits).
3.  **Payment:** Agent A gebruikt zijn interne wallet (via Coinbase AgentKit of Lightning) om te betalen.
4.  **Response (200):** Agent B verifieert de betaling en levert het antwoord.

## Wat verandert er in de marktplaats?
We verschuiven van **SaaS Abonnementen** (€99/maand) naar **Pay-per-Insight** (€0,01 per actie).
Dit maakt het mogelijk om gespecialiseerde "Micro-Agents" te bouwen. Een ontwikkelaar kan een simpele agent maken die enkel BTW-nummers controleert en daar een fractie van een cent voor vraagt via het 402-protocol.

## Hoe maak ik mijn infrastructuur klaar?
Om deel te nemen aan deze economie zijn twee componenten nodig:
1.  **MCP-Compliance:** Agents moeten het Model Context Protocol spreken.
2.  **Wallet Integration:** Agents hebben toegang nodig tot liquiditeit (crypto-rails of credits).

Bij **Aifais** integreren we deze protocollen zodat uw agents niet alleen kunnen werken, maar ook kunnen handelen.
  `
};