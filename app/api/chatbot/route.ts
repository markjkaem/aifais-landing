import { NextRequest, NextResponse } from "next/server";

// AIFAIS Knowledge Base
const AIFAIS_CONTEXT = `
Je bent een professionele virtuele assistent voor AIFAIS, een bedrijf gespecialiseerd in bedrijfsautomatisering voor Nederlandse MKB-bedrijven.

BEDRIJFSINFORMATIE:
- Bedrijfsnaam: AIFAIS
- Locatie: Groningenweg 8, 2803 PV Gouda, Nederland
- Email: info@aifais.com
- Specialisatie: Bedrijfsautomatisering voor MKB - repetitieve taken automatisch laten verlopen

DIENSTEN & PRIJZEN:
- Standaard automatisering: Vanaf €2.500
- Complexe multi-step automatisering: Vanaf €5.000
- Altijd transparante offerte vooraf met ROI-overzicht
- Gemiddelde ROI terugverdiend binnen 2-3 maanden

IMPLEMENTATIE:
- Gemiddelde duur: 2 weken van intake tot live
- Simpele automatiseringen: Binnen 1 week
- Proces: Intake → Bouwen → Testen → Training → Live
- 30 dagen gratis support na lancering
- Optionele onderhoudscontracten: Vanaf €200/maand

USP'S:
- Bespaar gemiddeld 40+ uur per week
- Live binnen 2 weken
- 50+ tevreden Nederlandse bedrijven
- Geen technische kennis of programmeerervaring vereist
- Eenvoudig dashboard voor aanpassingen in gewone taal

INTEGRATIES:
- Werkt met 400+ tools waaronder:
  * Google Workspace (Gmail, Drive, Sheets, Calendar)
  * HubSpot, Salesforce
  * Exact Online, Moneybird
  * Slack, Microsoft Teams
  * Shopify, WooCommerce
  * Mailchimp
  * En veel meer via API's en koppelingen

VEELGESTELDE VRAGEN:

Q: Moet ik technisch zijn?
A: Nee, absoluut niet. Wij bouwen alles voor u, testen grondig en trainen uw team. U krijgt een dashboard waar u zonder code aanpassingen kunt maken.

Q: Hoe weet ik of automatisering wat voor ons is?
A: Als uw team meer dan 5 uur per week bezig is met repetitieve taken (data-invoer, emails, rapportages, offertes), is automatisering bijna altijd de moeite waard. Wij bieden een gratis haalbaarheidscheck.

Q: Werkt dit met onze huidige software?
A: Waarschijnlijk wel. We integreren met 400+ tools. Ook als uw tool er niet tussen staat, kunnen we vaak via API's of koppelingen toch integreren.

Q: Wat als het niet werkt zoals verwacht?
A: U krijgt 30 dagen gratis support na lancering. We blijven doorwerken totdat alles perfect loopt.

Q: Kunnen we het later zelf aanpassen?
A: Ja! We bouwen automatiseringen zo dat u zelf eenvoudige aanpassingen kunt doen. Voor grotere wijzigingen kunt u altijd bij ons terugkomen.

Q: Welke taken kunnen jullie automatiseren?
A: Praktisch alle repetitieve taken: offertes/facturen maken, lead follow-up emails, data-invoer in systemen, rapportages genereren, documentverwerking, social media posts, email beantwoording, en meer.

Q: Hoeveel besparen wij concreet?
A: Gemiddeld besparen onze klanten 40+ uur per week. Gebruik onze gratis QuickScan om uw specifieke besparing te berekenen: https://aifais.com/quickscan

TONE OF VOICE:
- Formeel maar toegankelijk
- Professioneel en behulpzaam
- Concrete antwoorden met cijfers en tijdlijnen
- Eindig gesprekken met een zachte CTA naar QuickScan of contact

BELANGRIJKE REGELS:
1. Wees altijd professioneel en vriendelijk
2. Als je iets niet weet, verwijs naar info@aifais.com
3. Moedig mensen aan om de gratis QuickScan te doen (https://aifais.com/quickscan)
4. Geef concrete voorbeelden waar mogelijk
5. Noem geen prijzen voor specifieke projecten zonder meer context
6. Bij complexe vragen: stel voor om een gratis gesprek te plannen
7. Houd antwoorden beknopt (max 200 woorden)
8. Vermijd technisch jargon - spreek de taal van bedrijfseigenaren
9. Focus op problemen oplossen (tijd besparen, kosten verlagen) niet op technische termen
`;

// ✅ ABUSE PREVENTION - Rate Limiting per IP (STRICT!)
const rateLimitStore: { [key: string]: { count: number; lastReset: number } } = {};
const MAX_REQUESTS_PER_IP = 5; // Max 5 requests per 10 minuten (was 15)
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minuten (was 15)

// ✅ ABUSE PREVENTION - Session tracking (STRICT!)
const sessionStore: { [key: string]: { messageCount: number; startTime: number } } = {};
const MAX_MESSAGES_PER_SESSION = 10; // Max 10 berichten per sessie (was 20)
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 uur

export async function POST(req: NextRequest) {
  try {
    const { messages, email, sessionId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // ✅ ABUSE PREVENTION #1: Rate Limiting per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const now = Date.now();

    if (!rateLimitStore[ip] || now - rateLimitStore[ip].lastReset > RATE_LIMIT_WINDOW) {
      rateLimitStore[ip] = { count: 0, lastReset: now };
    }

    if (rateLimitStore[ip].count >= MAX_REQUESTS_PER_IP) {
      return NextResponse.json(
        {
          message:
            "U heeft te veel verzoeken gedaan. Probeer het over 10 minuten opnieuw of neem direct contact op via contact@aifais.com voor urgente vragen.",
        },
        { status: 429 }
      );
    }

    rateLimitStore[ip].count += 1;

    // ✅ ABUSE PREVENTION #2: Message count per session
    if (sessionId) {
      if (!sessionStore[sessionId] || now - sessionStore[sessionId].startTime > SESSION_TIMEOUT) {
        sessionStore[sessionId] = { messageCount: 0, startTime: now };
      }

      sessionStore[sessionId].messageCount += 1;

      if (sessionStore[sessionId].messageCount > MAX_MESSAGES_PER_SESSION) {
        return NextResponse.json({
          message:
            "U heeft het maximaal aantal berichten voor deze sessie bereikt. Voor uitgebreidere vragen raad ik u aan contact op te nemen via contact@aifais.com of plan een gratis gesprek via onze website.",
          isLimit: true,
        });
      }
    }

    // ✅ ABUSE PREVENTION #3: Character limit per message
    const lastUserMessage = messages[messages.length - 1];
    const MAX_MESSAGE_LENGTH = 300; // Was 500

    if (lastUserMessage.content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({
        message:
          "Uw bericht is te lang. Probeer uw vraag in maximaal 300 karakters samen te vatten. Voor uitgebreide vragen kunt u beter direct contact opnemen via contact@aifais.com",
      });
    }

    // ✅ ABUSE PREVENTION #4: Detect spam/repetitive messages
    if (messages.length >= 3) {
      const lastThree = messages.slice(-3).map((m) => m.content.toLowerCase());
      const allSame = lastThree.every((msg) => msg === lastThree[0]);

      if (allSame) {
        return NextResponse.json({
          message:
            "Het lijkt erop dat u dezelfde vraag herhaalt. Heeft u een andere vraag, of kan ik u anders doorverwijzen naar contact@aifais.com?",
        });
      }
    }

    // ✅ ABUSE PREVENTION #5: Token limit voor context
    const MAX_CONVERSATION_TOKENS = 3000; // Limit total conversation size
    const estimatedTokens = messages.reduce(
      (acc, msg) => acc + Math.ceil(msg.content.length / 4),
      0
    );

    if (estimatedTokens > MAX_CONVERSATION_TOKENS) {
      return NextResponse.json({
        message:
          "Dit gesprek wordt te uitgebreid voor de chat. Ik raad u aan een gratis gesprek te plannen via onze website of direct contact op te nemen via contact@aifais.com zodat we u beter kunnen helpen.",
        isLimit: true,
      });
    }

    // Call Claude API with Prompt Caching
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400, // ✅ Reduced from 1000 to save costs
        system: [
          {
            type: "text",
            text: AIFAIS_CONTEXT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API Error:", errorData);
      throw new Error("Claude API request failed");
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;

    // Log voor monitoring (optioneel)
    console.log(`Chat from ${email || ip}: ${messages.length} messages, ${estimatedTokens} tokens`);

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { 
        message: "Excuses, er ging iets mis. Probeer het opnieuw of neem direct contact op via contact@aifais.com",
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}