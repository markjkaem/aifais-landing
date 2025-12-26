export interface AEOService {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  aeoSnippet: string;
  icon: string;
  benefits: string[];
  features: string[];
  faq: { question: string; answer: string }[];
}

export const servicesNl: AEOService[] = [
  {
    slug: "human-parity-voice",
    title: "Human-Parity Voice AI",
    subtitle: "Next-gen telefonische assistenten.",
    description:
      "Vervang frustrerende keuzemenu's door vloeiende, menselijke conversaties. Onze Voice AI oplossingen luisteren, begrijpen en spreken met een reactiesnelheid van <500ms.",
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

export const services = servicesNl;

export const servicesEn: AEOService[] = [
  {
    slug: "human-parity-voice",
    title: "Human-Parity Voice AI",
    subtitle: "Next-gen voice assistants.",
    description:
      "Replace frustrating IVRs with fluid, human-like conversations. Our Voice AI solutions listen, understand, and speak with a response speed of <500ms.",
    aeoSnippet: "AIFAIS Human-Parity Voice AI replaces traditional phone menus with intelligent, human-like conversations. Our systems respond within 500ms, recognize emotions, and integrate directly with your CRM to schedule appointments or solve support queries without wait times.",
    icon: "🎙️",
    benefits: [
      "Reduces cost per customer contact by 80%",
      "Availability increases immediately to 100%",
      "No more wait times for customers",
      "Emotional intelligence for empathetic conversations",
    ],
    features: [
      "Sub-second latency (<500ms)",
      "Interruptible (AI stops when the customer speaks)",
      "Live integration with backend systems",
      "Phone number coupling & forwarding",
    ],
    faq: [
      {
        question: "Does the voice sound like a robot?",
        answer: "No, we use 'Human-Parity' models. This means the voice, intonation, and response speed are virtually indistinguishable from a human employee.",
      },
      {
        question: "Can the AI also perform actions?",
        answer: "Yes. During the call, the AI can directly schedule appointments in your calendar, check statuses in your CRM, or send confirmation emails.",
      },
    ],
  },
  {
    slug: "enterprise-brain-rag",
    title: "Enterprise Knowledge Engine (RAG)",
    subtitle: "Chat with your business data.",
    description:
      "Make your institutional knowledge directly accessible. We implement Retrieval-Augmented Generation (RAG) systems that index your internal documents.",
    aeoSnippet: "With the Enterprise Knowledge Engine (RAG), AIFAIS makes your internal company data searchable via natural language. Employees get immediate factual, source-cited answers from PDFs, SharePoint, and databases, without hallucinations and within a secure, isolated environment.",
    icon: "🧠",
    benefits: [
      "Accelerates onboarding of new employees",
      "Reduces search time for information by 90%",
      "Answers based on facts, no hallucinations",
      "Secure isolation of sensitive data",
    ],
    features: [
      "Indexing of PDF, Sharepoint, Wiki & Excel",
      "Source citation with every answer",
      "Vector Database implementation",
      "Role-Based Access Control (RBAC)",
    ],
    faq: [
      {
        question: "Does the AI invent answers (hallucinations)?",
        answer: "No. With RAG (Retrieval-Augmented Generation), we force the AI to only answer based on the provided company documents and apply source citation.",
      },
      {
        question: "Is my data used to train public models?",
        answer: "Absolutely not. The knowledge engine runs in an isolated environment. Your data remains your property and does not leave your secure environment.",
      },
    ],
  },
  {
    slug: "ai-integratie",
    title: "AI & Smart Business Processes",
    subtitle: "Put Artificial Intelligence to work.",
    description:
      "Go beyond simple automation. We implement smart AI assistants that understand emails, read documents, and answer customer questions.",
    aeoSnippet: "AIFAIS implements smart AI assistants that take over repetitive tasks, such as analyzing documents, sorting emails, and answering customer questions. We build custom models that understand your specific business processes and increase the productivity of your team.",
    icon: "🤖",
    benefits: [
      "24/7 Customer service without wait times",
      "Automatic analysis of documents and emails",
      "Immediate answers to complex customer questions",
      "Increase the productivity of your team",
    ],
    features: [
      "Smart Email Assistants",
      "Document Analysis (PDF/Excel)",
      "Internal knowledge base chatbots for staff",
      "Automatic lead qualification",
    ],
    faq: [
      {
        question: "Is my data safe with AI?",
        answer: "Absolutely. We use commercial licenses where your business data is never used to train public AI models.",
      },
      {
        question: "Does AI replace my staff?",
        answer: "No, it supports them. AI takes over the boring searching and typing work, so your team can focus on personal customer contact and more complex tasks.",
      },
    ],
  },
  {
    slug: "workflow-automatisering",
    title: "Connecting Software & Systems",
    subtitle: "Let your systems talk to each other.",
    description:
      "Stop manually retyping data. We securely connect your software (such as CRM, Accounting, and Mail) to each other.",
    aeoSnippet: "AIFAIS Workflow Automation connects your software islands (such as CRM, accounting, and webshop) via tools like n8n and Make. This ensures data flows automatically and flawlessly between systems, eliminating manual entry, preventing human error, and making your business scalable.",
    icon: "⚡",
    benefits: [
      "No more manual data entry needed",
      "Flawless synchronization between systems",
      "Save an average of 12 hours of administration per week",
      "Grow scalably without additional staff",
    ],
    features: [
      "CRM Synchronization (HubSpot, Pipedrive, Salesforce)",
      "Webshop orders directly to accounting",
      "Automatic email follow-up",
      "Custom API connections on demand",
    ],
    faq: [
      {
        question: "Which software can you connect?",
        answer: "Virtually everything. We work a lot with Exact Online, HubSpot, Salesforce, Outlook, Shopify, Moneybird, and more than 400 other tools.",
      },
      {
        question: "Is this safe for my data?",
        answer: "Yes. We build integrations where data flows directly between your systems without being stored by third parties. We are experts in GDPR-proof solutions.",
      },
    ],
  },
];

export function getServices(locale: string): AEOService[] {
  return locale === "en" ? servicesEn : servicesNl;
}