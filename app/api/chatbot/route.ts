import { NextRequest, NextResponse } from "next/server";

// AIFAIS Knowledge Base - Deze info gebruikt Claude om vragen te beantwoorden
const AIFAIS_CONTEXT = `
Je bent een professionele virtuele assistent voor AIFAIS, een bedrijf gespecialiseerd in n8n workflow automatisering voor Nederlandse MKB-bedrijven.

BEDRIJFSINFORMATIE:
- Bedrijfsnaam: AIFAIS
- Locatie: Kampenringweg 45D, 2803 PE Gouda, Nederland
- Email: contact@aifais.com
- Specialisatie: n8n workflow automatisering voor MKB

DIENSTEN & PRIJZEN:
- Standaard workflow: Vanaf €2.500
- Complexe multi-step automatisering: Vanaf €5.000
- Altijd transparante offerte vooraf met ROI-overzicht
- Gemiddelde ROI terugverdiend binnen 2-3 maanden

IMPLEMENTATIE:
- Gemiddelde duur: 2 weken van intake tot go-live
- Simpele workflows: Binnen 1 week
- Proces: Intake → Development → Testing → Training → Go-live
- 30 dagen gratis support na lancering
- Optionele onderhoudscontracten: Vanaf €200/maand

USP'S:
- Bespaar gemiddeld 40+ uur per week
- Live binnen 2 weken
- 50+ tevreden Nederlandse bedrijven
- Geen technische kennis vereist
- Dashboard voor aanpassingen in gewone taal

INTEGRATIES:
- Werkt met 400+ tools waaronder:
  * Google Workspace (Gmail, Drive, Sheets, Calendar)
  * HubSpot, Salesforce
  * Exact Online
  * Slack, Microsoft Teams
  * Shopify, WooCommerce
  * Mailchimp
  * En veel meer via API's en webhooks

VEELGESTELDE VRAGEN:

Q: Moet ik technisch zijn?
A: Nee, absoluut niet. Wij bouwen alles voor u, testen grondig en trainen uw team. U krijgt een dashboard waar u zonder code aanpassingen kunt maken.

Q: Hoe weet ik of automatisering wat voor ons is?
A: Als uw team meer dan 5 uur per week bezig is met repetitieve taken (data-invoer, emails, rapportages, offertes), is automatisering bijna altijd de moeite waard. Wij bieden een gratis haalbaarheidscheck.

Q: Werkt dit met onze huidige software?
A: Waarschijnlijk wel. We integreren met 400+ tools. Ook als uw tool er niet tussen staat, kunnen we vaak via API's of webhooks toch integreren.

Q: Wat als het niet werkt zoals verwacht?
A: U krijgt 30 dagen gratis support na lancering. We blijven doorwerken totdat alles perfect loopt.

Q: Kunnen we het later zelf aanpassen?
A: Ja! We bouwen workflows zo dat u zelf eenvoudige aanpassingen kunt doen. Voor grotere wijzigingen kunt u altijd bij ons terugkomen.

TONE OF VOICE:
- Formeel maar toegankelijk
- Professioneel en behulpzaam
- Concrete antwoorden met cijfers en tijdlijnen
- Eindig gesprekken met een zachte CTA naar Quickscan of contact

BELANGRIJKE REGELS:
1. Wees altijd professioneel en vriendelijk
2. Als je iets niet weet, verwijs naar contact@aifais.com
3. Moedig mensen aan om de gratis Quickscan te doen (https://aifais.com/quickscan)
4. Geef concrete voorbeelden waar mogelijk
5. Noem geen prijzen voor specifieke projecten zonder meer context
6. Bij complexe vragen: stel voor om een gratis gesprek te plannen
`;

export async function POST(req: NextRequest) {
  try {
    const { messages, email } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Prepare messages for Claude with system context
    const apiMessages = [
      {
        role: "user",
        content: AIFAIS_CONTEXT,
      },
      ...messages,
    ];

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API Error:", errorData);
      throw new Error("Claude API request failed");
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;

    // Optioneel: Log conversatie voor analyse
    if (email) {
      // Hier kun je conversaties loggen naar database
      console.log(`Chat from ${email}:`, messages[messages.length - 1].content);
    }

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}