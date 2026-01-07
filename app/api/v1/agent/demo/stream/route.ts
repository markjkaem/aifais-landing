import { NextRequest } from "next/server";
import { DEMO_EMAILS, KNOWLEDGE_BASE, EMAIL_KNOWLEDGE_MAP } from "@/lib/agent/demo-data";
import { generateDraftResponse, analyzeEmailIntent } from "@/lib/agent/demo-ai";

// Demo session tracking (in-memory, resets on deploy)
const activeSessions = new Map<string, { startTime: number; stopped: boolean }>();
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return new Response("Missing sessionId", { status: 400 });
  }

  // Check if session is already running
  const existingSession = activeSessions.get(sessionId);
  if (existingSession && !existingSession.stopped) {
    return new Response("Session already running", { status: 409 });
  }

  // Create new session
  activeSessions.set(sessionId, { startTime: Date.now(), stopped: false });

  // Clean up old sessions
  for (const [id, session] of activeSessions.entries()) {
    if (Date.now() - session.startTime > SESSION_TIMEOUT) {
      activeSessions.delete(id);
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: any) => {
        const session = activeSessions.get(sessionId);
        if (session?.stopped) {
          controller.close();
          return false;
        }
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        return true;
      };

      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      try {
        // Send initial state
        send("init", {
          emails: DEMO_EMAILS.map(e => ({ id: e.id, subject: e.subject, fromName: e.fromName, company: e.company, receivedAt: e.receivedAt })),
          knowledgeBase: KNOWLEDGE_BASE.map(k => ({ id: k.id, title: k.title, icon: k.icon }))
        });

        await delay(1500);

        // Process each email
        for (let i = 0; i < DEMO_EMAILS.length; i++) {
          const email = DEMO_EMAILS[i];
          const session = activeSessions.get(sessionId);
          if (session?.stopped) break;

          // Step 1: Email arrives in inbox
          if (!send("email_arrive", { emailId: email.id })) break;
          await delay(2000);

          // Step 2: Agent starts reading
          if (!send("agent_status", {
            status: "reading",
            message: "Nieuwe email gedetecteerd...",
            emailId: email.id
          })) break;
          await delay(1500);

          // Step 3: Show email content being analyzed
          if (!send("agent_status", {
            status: "analyzing",
            message: `Analyseren: "${email.subject}"`,
            emailId: email.id
          })) break;
          await delay(2000);

          // Step 4: Intent detection
          const analysis = analyzeEmailIntent(email);
          if (!send("agent_analysis", {
            emailId: email.id,
            intent: analysis.intent,
            priority: analysis.priority,
            sentiment: analysis.sentiment
          })) break;
          await delay(1500);

          // Step 5: Knowledge base search
          if (!send("agent_status", {
            status: "searching",
            message: "Kennisbank raadplegen...",
            emailId: email.id
          })) break;
          await delay(1000);

          // Step 6: Show which documents are found
          const relevantDocs = EMAIL_KNOWLEDGE_MAP[email.type] || ["faq"];
          for (const docId of relevantDocs) {
            const doc = KNOWLEDGE_BASE.find(k => k.id === docId);
            if (doc) {
              const relevance = 85 + Math.floor(Math.random() * 15); // 85-99%
              if (!send("knowledge_hit", {
                documentId: docId,
                title: doc.title,
                relevance,
                emailId: email.id
              })) break;
              await delay(800);
            }
          }

          // Step 7: Generate response
          if (!send("agent_status", {
            status: "writing",
            message: "Concept schrijven...",
            emailId: email.id
          })) break;

          // Actually call Claude Haiku to generate response
          let draft: string;
          try {
            draft = await generateDraftResponse(email);
          } catch (error) {
            // Fallback if AI fails
            draft = `Beste ${email.fromName.split(' ')[0]},

Bedankt voor uw bericht. We hebben uw vraag ontvangen en zullen deze zo spoedig mogelijk behandelen.

Met vriendelijke groet,
Team TechTools Nederland BV`;
          }

          // Step 8: Stream the draft character by character (typewriter effect)
          if (!send("draft_start", { emailId: email.id, subject: `RE: ${email.subject}` })) break;

          // Send in chunks for smoother animation
          const chunkSize = 5;
          for (let j = 0; j < draft.length; j += chunkSize) {
            const chunk = draft.slice(j, j + chunkSize);
            if (!send("draft_chunk", { emailId: email.id, chunk })) break;
            await delay(30);
          }

          // Step 9: Draft complete
          if (!send("draft_complete", { emailId: email.id, fullDraft: draft })) break;
          await delay(2000);
        }

        // Demo complete
        send("demo_complete", {
          totalEmails: DEMO_EMAILS.length,
          message: "Alle emails zijn verwerkt!"
        });

      } catch (error) {
        send("error", { message: "Er is een fout opgetreden" });
      } finally {
        const session = activeSessions.get(sessionId);
        if (session) {
          session.stopped = true;
        }
        controller.close();
      }
    },
    cancel() {
      const session = activeSessions.get(sessionId);
      if (session) {
        session.stopped = true;
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}

// Stop a running demo
export async function DELETE(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return new Response("Missing sessionId", { status: 400 });
  }

  const session = activeSessions.get(sessionId);
  if (session) {
    session.stopped = true;
    activeSessions.delete(sessionId);
  }

  return new Response("Session stopped", { status: 200 });
}
