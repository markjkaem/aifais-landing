import nodemailer from "nodemailer";

// Simple in-memory rate limit storage (resets on server restart)
const rateLimitStore: {
  [key: string]: { count: number; lastRequest: number };
} = {};
const MAX_REQUESTS = 2;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, message } = data;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
      });
    }

    const now = Date.now();
    const user = email.toLowerCase(); // Rate limit per email

    // Initialize if first request
    if (
      !rateLimitStore[user] ||
      now - rateLimitStore[user].lastRequest > WINDOW_MS
    ) {
      rateLimitStore[user] = { count: 0, lastRequest: now };
    }

    if (rateLimitStore[user].count >= MAX_REQUESTS) {
      return new Response(
        JSON.stringify({ error: "Max requests per day reached" }),
        { status: 429 }
      );
    }

    rateLimitStore[user].count += 1;
    rateLimitStore[user].lastRequest = now;

    // SMTP setup
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const TO_EMAIL = process.env.TO_EMAIL || "contact@aifais.com";

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return new Response(JSON.stringify({ error: "SMTP not configured" }), {
        status: 500,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const mailBody = `Nieuw contactformulier:\n\nNaam: ${name}\nEmail: ${email}\nTelefoon: ${phone}\n\nBericht:\n${message}`;

    // Send email
    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: TO_EMAIL,
      subject: `Contactformulier: ${name} via Aifais`,
      text: mailBody,
    });

    // Add to Notion CRM
    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

    if (NOTION_API_KEY && NOTION_DATABASE_ID) {
      try {
        await fetch("https://api.notion.com/v1/pages", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${NOTION_API_KEY}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
          body: JSON.stringify({
            parent: {
              type: "database_id",
              database_id: NOTION_DATABASE_ID,
            },
            properties: {
              "Naam": {
                title: [
                  {
                    text: {
                      content: name || "Geen naam",
                    },
                  },
                ],
              },
              "Email": {
                email: email,
              },
              "Telefoon": {
                phone_number: phone || null,
              },
              "Bericht": {
                rich_text: [
                  {
                    text: {
                      content: message || "",
                    },
                  },
                ],
              },
              "Status": {
                select: {
                  name: "Nieuw",
                },
              },
              "Bron": {
                select: {
                  name: "Website contactformulier",
                },
              },
              "Prioriteit": {
                select: {
                  name: "Normaal",
                },
              },
            },
          }),
        });
        console.log("✅ Lead toegevoegd aan Notion CRM");
      } catch (notionError) {
        console.error("⚠️ Notion fout (email wel verzonden):", notionError);
        // Don't fail the request if Notion fails
      }
    } else {
      console.warn("⚠️ Notion niet geconfigureerd - alleen email verzonden");
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("contact error", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}