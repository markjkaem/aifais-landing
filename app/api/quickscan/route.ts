import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Simple in-memory rate limit (optioneel)
const rateLimitStore: { [key: string]: { count: number; lastRequest: number } } = {};
const MAX_REQUESTS = 2;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 uur

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { naam, email, telefoon, medewerkers, taken, uren } = data;

    if (!email || !naam) {
      return NextResponse.json({ error: "Naam en email zijn verplicht" }, { status: 400 });
    }

    // Rate limiting per email
    const now = Date.now();
    const user = email.toLowerCase();
    if (!rateLimitStore[user] || now - rateLimitStore[user].lastRequest > WINDOW_MS) {
      rateLimitStore[user] = { count: 0, lastRequest: now };
    }
    if (rateLimitStore[user].count >= MAX_REQUESTS) {
      return NextResponse.json({ error: "Max requests per day bereikt" }, { status: 429 });
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
      return NextResponse.json({ error: "SMTP niet geconfigureerd" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true voor 465, false voor andere poorten
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const mailBody = `
Nieuwe Quickscan aanvraag:

Naam: ${naam}
Email: ${email}
Telefoon: ${telefoon || "-"}
Aantal medewerkers: ${medewerkers}
Taken: ${taken.join(", ")}
Uren per week: ${uren}
`;

    await transporter.sendMail({
      from: `${naam} <${email}>`,
      to: TO_EMAIL,
      subject: `Nieuwe Quickscan aanvraag: ${naam}`,
      text: mailBody,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Quickscan API error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
