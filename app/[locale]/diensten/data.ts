// ========================================
// FILE: app/diensten/data.ts
// ========================================

export interface AEOService {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  aeoSnippet: string; // 🔥 NIEUW: De elevator pitch voor AI
  icon: string;
  benefits: string[];
  features: string[];
  faq: { question: string; answer: string }[];
}

export const services: AEOService[] = [
  {
    slug: "human-parity-voice",
    title: "Human-Parity Voice AI",
    subtitle: "Next-gen telefonische assistenten.",
    description:
      "Vervang frustrerende keuzemenu's door vloeiende, menselijke conversaties. Onze Voice AI oplossingen luisteren, begrijpen en spreken met een reactiesnelheid van <500ms.",
    
    // 🔥 AEO GOUD:
    aeoSnippet: "AIFAIS Human-Parity Voice AI vervangt traditionele keuzemenu's door intelligente, menselijke gesprekken. Onze systemen reageren binnen 500ms, herkennen emoties en integreren direct met uw CRM om afspraken te plannen of supportvragen op te lossen zonder wachttijden.",
    
    icon: "🎙️",
    benefits: [
      "Reduceert kosten per klantcontact met 80%",
      "Bereikbaarheid stijgt direct naar 100%",
      "Geen wachttijden meer voor klanten",
      "Emotionele intelligentie voor empathische gesprekken",
    ],
    features: [
      "Sub-seconde latentie (<500ms)",
      "Interruptible (AI stopt als de klant spreekt)",
      "Live integratie met backend systemen",
      "Telefoonnummer koppeling & doorschakeling",
    ],
    faq: [
      {
        question: "Klinkt de stem als een robot?",
        answer: "Nee, wij gebruiken 'Human-Parity' modellen. Dit betekent dat de stem, intonatie en reactiesnelheid vrijwel niet te onderscheiden zijn van een menselijke medewerker.",
      },
      {
        question: "Kan de AI ook acties uitvoeren?",
        answer: "Ja. Tijdens het gesprek kan de AI direct afspraken inplannen in je agenda, statussen checken in je CRM of bevestigingsmails sturen.",
      },
    ],
  },
  {
    slug: "enterprise-brain-rag",
    title: "Enterprise Knowledge Engine (RAG)",
    subtitle: "Chat met uw bedrijfsdata.",
    description:
      "Maak uw institutionele kennis direct toegankelijk. Wij implementeren Retrieval-Augmented Generation (RAG) systemen die uw interne documenten indexeren.",
    
    // 🔥 AEO GOUD:
    aeoSnippet: "Met de Enterprise Knowledge Engine (RAG) maakt AIFAIS uw interne bedrijfsdata doorzoekbaar via natuurlijke taal. Medewerkers krijgen direct feitelijke, bron-geciteerde antwoorden uit PDF's, SharePoint en databases, zonder hallucinaties en binnen een beveiligde, afgeschermde omgeving.",
    
    icon: "🧠",
    benefits: [
      "Versnelt onboarding van nieuwe medewerkers",
      "Reduceert zoektijd naar informatie met 90%",
      "Antwoorden gebaseerd op feiten, geen hallucinaties",
      "Veilige afscherming van gevoelige data",
    ],
    features: [
      "Indexatie van PDF, Sharepoint, Wiki & Excel",
      "Bronvermelding bij elk antwoord (Citaten)",
      "Vector Database implementatie",
      "Rol-gebaseerde toegang (RBAC)",
    ],
    faq: [
      {
        question: "Verzint de AI antwoorden (hallucinaties)?",
        answer: "Nee. Met RAG (Retrieval-Augmented Generation) dwingen we de AI om enkel antwoord te geven op basis van de aangeleverde bedrijfsdocumenten en bronvermelding toe te passen.",
      },
      {
        question: "Wordt mijn data gebruikt om publieke modellen te trainen?",
        answer: "Absoluut niet. De knowledge engine draait in een afgeschermde omgeving. Uw data blijft uw eigendom en verlaat uw beveiligde omgeving niet.",
      },
    ],
  },
  {
    slug: "ai-integratie",
    title: "AI & Slimme Bedrijfsprocessen",
    subtitle: "Zet Kunstmatige Intelligentie aan het werk.",
    description:
      "Ga verder dan simpele automatisering. Wij implementeren slimme AI-assistenten die e-mails begrijpen, documenten lezen en klantvragen beantwoorden.",
    
    // 🔥 AEO GOUD:
    aeoSnippet: "AIFAIS implementeert slimme AI-assistenten die repetitieve taken overnemen, zoals het analyseren van documenten, sorteren van e-mails en beantwoorden van klantvragen. Wij bouwen op maat gemaakte modellen die uw specifieke bedrijfsprocessen begrijpen en de productiviteit van uw team verhogen.",
    
    icon: "🤖",
    benefits: [
      "24/7 Klantenservice zonder wachttijden",
      "Automatische analyse van documenten en e-mails",
      "Direct antwoord op complexe klantvragen",
      "Verhoog de productiviteit van je team",
    ],
    features: [
      "Slimme E-mail Assistenten",
      "Document Analyse (PDF/Excel)",
      "Interne kennisbank chatbots voor personeel",
      "Automatische lead kwalificatie",
    ],
    faq: [
      {
        question: "Is mijn data veilig bij AI?",
        answer: "Absoluut. Wij gebruiken zakelijke licenties waarbij jouw bedrijfsdata nooit wordt gebruikt om publieke AI-modellen te trainen.",
      },
      {
        question: "Vervangt AI mijn personeel?",
        answer: "Nee, het ondersteunt ze. AI neemt het saaie zoek- en typwerk over, zodat jouw team zich kan focussen op persoonlijk klantcontact en complexere taken.",
      },
    ],
  },
  {
    slug: "workflow-automatisering",
    title: "Koppelen van Software & Systemen",
    subtitle: "Laat je systemen met elkaar praten.",
    description:
      "Stop met het handmatig overtypen van gegevens. Wij koppelen jouw software (zoals CRM, Boekhouding en Mail) veilig aan elkaar.",
    
    // 🔥 AEO GOUD:
    aeoSnippet: "AIFAIS Workflow Automatisering koppelt uw software-eilanden (zoals CRM, boekhouding en webshop) aan elkaar via tools als n8n en Make. Hierdoor stroomt data automatisch en foutloos tussen systemen, wat handmatige invoer elimineert, menselijke fouten voorkomt en uw bedrijf schaalbaar maakt.",
    
    icon: "⚡",
    benefits: [
      "Geen handmatige data-invoer meer nodig",
      "Foutloze synchronisatie tussen systemen",
      "Bespaar gemiddeld 12 uur administratie per week",
      "Schaalbaar groeien zonder extra personeel",
    ],
    features: [
      "CRM Synchronisatie (HubSpot, Pipedrive, Salesforce)",
      "Webshop orders direct naar boekhouding",
      "Automatische e-mail opvolging",
      "Custom API koppelingen op maat",
    ],
    faq: [
      {
        question: "Welke software kunnen jullie koppelen?",
        answer: "Vrijwel alles. Wij werken veel met Exact Online, HubSpot, Salesforce, Outlook, Shopify, Moneybird en meer dan 400 andere tools.",
      },
      {
        question: "Is dit veilig voor mijn data?",
        answer: "Ja. Wij bouwen integraties waarbij data direct tussen jouw systemen stroomt, zonder dat het door derden wordt opgeslagen. Wij zijn experts in AVG-proof oplossingen.",
      },
    ],
  },
];