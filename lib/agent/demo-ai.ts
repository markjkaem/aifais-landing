// AI response generation using Claude Haiku (cheapest model)
import Anthropic from "@anthropic-ai/sdk";
import { DemoEmail, KNOWLEDGE_BASE, EMAIL_KNOWLEDGE_MAP, COMPANY_INFO } from "./demo-data";

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || "" });

// Use Claude 3.5 Haiku - the cheapest Claude model
const CHEAP_MODEL = "claude-3-5-haiku-20241022";

export async function generateDraftResponse(email: DemoEmail): Promise<string> {
  // Get relevant knowledge for this email type
  const relevantDocIds = EMAIL_KNOWLEDGE_MAP[email.type] || ["faq"];
  const relevantKnowledge = KNOWLEDGE_BASE
    .filter(doc => relevantDocIds.includes(doc.id))
    .map(doc => doc.content)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: CHEAP_MODEL,
    max_tokens: 250, // Keep responses short = cheap
    messages: [{
      role: "user",
      content: `Je bent de klantenservice van ${COMPANY_INFO.name}. Schrijf een kort, ${COMPANY_INFO.tone} concept-antwoord op deze email.

KENNISBANK:
${relevantKnowledge}

EMAIL VAN: ${email.fromName} (${email.company})
ONDERWERP: ${email.subject}
BERICHT:
${email.body}

INSTRUCTIES:
- Schrijf in het Nederlands
- Max 4-5 zinnen
- Begin met "Beste ${email.fromName.split(' ')[0]},"
- Eindig met "Met vriendelijke groet, Team ${COMPANY_INFO.name}"
- Beantwoord de vraag specifiek met info uit de kennisbank
- Wees behulpzaam en professioneel`
    }]
  });

  return response.content[0].type === 'text' ? response.content[0].text : "";
}

// Analyze email to determine intent (used for UI display)
export function analyzeEmailIntent(email: DemoEmail): {
  intent: string;
  priority: "hoog" | "normaal" | "laag";
  sentiment: "positief" | "neutraal" | "negatief";
} {
  const intentMap: Record<string, string> = {
    offerte: "Offerte aanvraag",
    factuur: "Factuur vraag",
    klacht: "Klacht/Support",
    meeting: "Meeting verzoek",
    algemeen: "Algemene vraag",
  };

  const priorityMap: Record<string, "hoog" | "normaal" | "laag"> = {
    klacht: "hoog",
    offerte: "normaal",
    factuur: "normaal",
    meeting: "normaal",
    algemeen: "laag",
  };

  const sentimentMap: Record<string, "positief" | "neutraal" | "negatief"> = {
    offerte: "positief",
    meeting: "positief",
    factuur: "neutraal",
    algemeen: "neutraal",
    klacht: "negatief",
  };

  return {
    intent: intentMap[email.type] || "Onbekend",
    priority: priorityMap[email.type] || "normaal",
    sentiment: sentimentMap[email.type] || "neutraal",
  };
}
