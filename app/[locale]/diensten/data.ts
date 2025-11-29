// ========================================
// FILE: app/diensten/data.ts
// ========================================

export const services = [
  {
    slug: "workflow-automatisering",
    title: "Workflow Automatisering & Systeemkoppelingen",
    subtitle: "Laat je software met elkaar praten.",
    description:
      "Stop met het handmatig overtypen van gegevens. Wij koppelen jouw systemen (CRM, Boekhouding, Mail) aan elkaar via n8n of Make, zodat data automatisch stroomt.",
    icon: "⚡",
    benefits: [
      "Geen menselijke fouten meer bij data-invoer",
      "Real-time synchronisatie tussen systemen",
      "Bespaar gemiddeld 12 uur per week aan administratie",
      "Schaalbaar zonder extra personeel",
    ],
    features: [
      "CRM Synchronisatie (HubSpot, Pipedrive, Salesforce)",
      "E-commerce automatisering (Shopify, Woocommerce)",
      "Automatisering van e-mail opvolging",
      "Custom API koppelingen",
    ],
    faq: [
      {
        question: "Welke software kunnen jullie koppelen?",
        answer: "Vrijwel alles met een API. Wij werken veel met Exact Online, HubSpot, Salesforce, Gmail, Outlook, Shopify, en meer dan 400 andere tools.",
      },
      {
        question: "Gebruiken jullie n8n of Make?",
        answer: "Wij zijn experts in beide platforms. Voor complexe, privacy-gevoelige processen adviseren wij vaak self-hosted n8n voor volledige data-controle.",
      },
    ],
  },
  {
    slug: "ai-integratie",
    title: "AI & ChatGPT Integraties",
    subtitle: "Zet Kunstmatige Intelligentie aan het werk.",
    description:
      "Ga verder dan simpele automatisering. Wij integreren LLM's (zoals GPT-4 en Claude) in jouw bedrijfsprocessen om intelligente beslissingen te nemen en content te genereren.",
    icon: "🤖",
    benefits: [
      "24/7 Klantenservice via slimme chatbots",
      "Automatische analyse van documenten en e-mails",
      "Direct antwoord op complexe klantvragen",
      "Verhoog de productiviteit van je team",
    ],
    features: [
      "Slimme E-mail Assistenten",
      "Document Analyse (PDF/Excel)",
      "AI Chatbots voor interne kennisbanken",
      "Automatische lead kwalificatie",
    ],
    faq: [
      {
        question: "Is mijn data veilig bij AI?",
        answer: "Ja. Wij kunnen systemen bouwen waarbij jouw bedrijfsdata niet wordt gebruikt om publieke AI-modellen te trainen (via API's en enterprise licenties).",
      },
      {
        question: "Kan AI mijn personeel vervangen?",
        answer: "AI vervangt geen mensen, maar taken. Het stelt jouw team in staat om zich te focussen op complex werk en klantcontact, terwijl AI het routinewerk doet.",
      },
    ],
  },
  {
    slug: "administratieve-automatisering",
    title: "Administratieve Automatisering",
    subtitle: "Nooit meer bonnetjes overtypen.",
    description:
      "Administratie is noodzakelijk, maar tijdrovend. Wij automatiseren het volledige proces van offerte tot factuur en betalingsherinnering.",
    icon: "bar_chart",
    benefits: [
      "Facturen worden automatisch verwerkt en geboekt",
      "Offertes automatisch opvolgen",
      "Altijd inzicht in openstaande posten",
      "Foutloze financiële rapportages",
    ],
    features: [
      "Factuurverwerking (OCR)",
      "Automatische incasso processen",
      "Urenregistratie koppelingen",
      "Onboarding van nieuwe medewerkers/klanten",
    ],
    faq: [
      {
        question: "Werkt dit met mijn boekhoudpakket?",
        answer: "Ja, wij koppelen met o.a. Exact Online, Moneybird, Twinfield, e-Boekhouden en SnelStart.",
      },
      {
        question: "Wat als er een fout in een factuur zit?",
        answer: "Onze automatisering herkent afwijkingen en zet deze apart voor menselijke controle. Je krijgt automatisch een notificatie.",
      },
    ],
  },
];