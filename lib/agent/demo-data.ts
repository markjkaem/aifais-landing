// Demo data for the Inbox Agent Demo

export interface DemoEmail {
  id: number;
  from: string;
  fromName: string;
  company: string;
  subject: string;
  body: string;
  type: "offerte" | "factuur" | "klacht" | "meeting" | "algemeen";
  receivedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  icon: string;
  content: string;
}

// Simulated company: TechTools Nederland BV
export const COMPANY_INFO = {
  name: "TechTools Nederland BV",
  description: "Software tools voor het MKB",
  email: "info@techtools.nl",
  tone: "professioneel maar vriendelijk",
};

// Knowledge base documents (simulating vector DB)
export const KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: "prijslijst",
    title: "Prijslijst 2024",
    icon: "💰",
    content: `PRIJZEN TECHTOOLS 2024:
- Starter pakket: €29/maand (1-3 gebruikers)
- Business pakket: €49/maand per gebruiker (4-10 gebruikers)
- Enterprise pakket: €39/maand per gebruiker (11+ gebruikers, 20% korting)
- Jaarlijks betalen: 2 maanden gratis
- Proefperiode: 14 dagen gratis, geen creditcard nodig`,
  },
  {
    id: "voorwaarden",
    title: "Algemene Voorwaarden",
    icon: "📋",
    content: `VOORWAARDEN TECHTOOLS:
- Betalingstermijn: 14 dagen na factuurdatum
- Opzegtermijn: 1 maand voor einde contractperiode
- Support: Ma-Vr 9:00-17:00 via support@techtools.nl
- SLA: 99.9% uptime garantie
- Jaarcontract met maandelijkse facturatie mogelijk`,
  },
  {
    id: "retourbeleid",
    title: "Retourbeleid",
    icon: "↩️",
    content: `RETOURBELEID TECHTOOLS:
- 30 dagen niet-goed-geld-terug garantie
- Volledige restitutie binnen eerste 30 dagen
- Na 30 dagen: pro-rata terugbetaling bij jaarcontracten
- Opzeggen kan via e-mail of in het dashboard`,
  },
  {
    id: "productinfo",
    title: "Product Specificaties",
    icon: "⚙️",
    content: `PRODUCT INFO TECHTOOLS:
- Cloud-based SaaS oplossing
- Werkt op Windows, Mac, Linux en mobiel
- Integraties: Exact Online, Moneybird, HubSpot, Slack
- API beschikbaar voor maatwerk koppelingen
- Data wordt gehost in Nederland (AVG-compliant)`,
  },
  {
    id: "faq",
    title: "Veelgestelde Vragen",
    icon: "❓",
    content: `FAQ TECHTOOLS:
- Installatie: Geen installatie nodig, werkt volledig in de browser
- Training: Gratis onboarding sessie van 30 minuten
- Updates: Automatisch, geen downtime
- Backup: Dagelijkse backups, 30 dagen bewaard
- Support contact: support@techtools.nl of 020-1234567`,
  },
];

// Simulated incoming emails
export const DEMO_EMAILS: DemoEmail[] = [
  {
    id: 1,
    from: "j.bakker@bakker-installatietechniek.nl",
    fromName: "Jan Bakker",
    company: "Bakker Installatietechniek",
    subject: "Offerte aanvraag voor 8 gebruikers",
    body: `Beste TechTools,

Wij zijn een installatiebedrijf met 8 medewerkers en zijn op zoek naar een goede softwareoplossing voor onze planning en administratie.

Kunnen jullie mij een offerte sturen? We zouden graag weten:
- Wat zijn de kosten per maand?
- Is er een proefperiode mogelijk?
- Kunnen we koppelen met Exact Online?

Met vriendelijke groet,
Jan Bakker
Eigenaar`,
    type: "offerte",
    receivedAt: "09:14",
  },
  {
    id: 2,
    from: "administratie@jansen-logistics.nl",
    fromName: "Petra Jansen",
    company: "Jansen Logistics",
    subject: "Factuur #2024-0892 niet ontvangen",
    body: `Goedemorgen,

Volgens ons boekhoudprogramma is factuur #2024-0892 nog niet betaald, maar we kunnen de factuur niet terugvinden in onze administratie.

Kunt u deze opnieuw versturen naar administratie@jansen-logistics.nl?

Alvast bedankt,
Petra Jansen
Administratie`,
    type: "factuur",
    receivedAt: "09:31",
  },
  {
    id: 3,
    from: "m.devries@devries-consultancy.nl",
    fromName: "Michel de Vries",
    company: "De Vries Consultancy",
    subject: "Probleem met exportfunctie",
    body: `Hallo,

Sinds gisteren werkt de exportfunctie naar Excel niet meer. Als ik op 'Exporteren' klik gebeurt er niets.

Ik heb het geprobeerd in Chrome en Firefox, maar het probleem blijft. Dit is urgent want ik moet vandaag nog een rapportage aanleveren.

Kunnen jullie dit zo snel mogelijk oplossen?

Groet,
Michel de Vries`,
    type: "klacht",
    receivedAt: "10:02",
  },
  {
    id: 4,
    from: "info@hr-solutions.nl",
    fromName: "Sandra Vermeer",
    company: "HR Solutions Nederland",
    subject: "Kennismakingsgesprek plannen",
    body: `Beste TechTools team,

Wij zijn HR Solutions, een bureau met 25 consultants. Via een collega-ondernemer hoorden we over jullie software.

We zouden graag een online demo willen plannen om te kijken of het bij ons past. Hebben jullie volgende week dinsdag of woensdag tijd?

Met vriendelijke groet,
Sandra Vermeer
Operations Manager`,
    type: "meeting",
    receivedAt: "10:45",
  },
  {
    id: 5,
    from: "s.vandenbosch@student.uva.nl",
    fromName: "Sophie van den Bosch",
    company: "Universiteit van Amsterdam",
    subject: "Informatie voor scriptie over SaaS",
    body: `Geachte heer/mevrouw,

Ik ben masterstudent Bedrijfskunde aan de UvA en schrijf mijn scriptie over de adoptie van SaaS-oplossingen in het Nederlandse MKB.

Zou het mogelijk zijn om enkele vragen te stellen over jullie bedrijf en klanten? Het zou telefonisch of per mail kunnen, wat jullie het beste uitkomt.

Bij voorbaat dank,
Sophie van den Bosch`,
    type: "algemeen",
    receivedAt: "11:23",
  },
];

// Map email types to relevant knowledge documents
export const EMAIL_KNOWLEDGE_MAP: Record<string, string[]> = {
  offerte: ["prijslijst", "voorwaarden", "productinfo"],
  factuur: ["voorwaarden", "faq"],
  klacht: ["faq", "productinfo"],
  meeting: ["prijslijst", "productinfo"],
  algemeen: ["productinfo", "faq"],
};
