import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Simple in-memory rate limit (optioneel)
const rateLimitStore: { [key: string]: { count: number; lastRequest: number } } = {};
const MAX_REQUESTS = 2;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 uur

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { naam, email, telefoon, medewerkers, taken, uren } = data;

    const besparing = uren * 12 * medewerkers * 52;

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

    // ✅ Add to Mailchimp
    let mailchimpSuccess = false;
    try {
      const memberHash = crypto
        .createHash('md5')
        .update(email.toLowerCase())
        .digest('hex');

      const mailchimpData = {
        email_address: email,
        status: 'subscribed',
       merge_fields: {
  FNAME: naam.split(' ')[0] || naam,
  LNAME: naam.split(' ').slice(1).join(' ') || '',
  PHONE: telefoon || '',
  MMERGE7: medewerkers.toString(),  // ✅
  MMERGE8: taken.join(', '),        // ✅
  MMERGE9: Number(uren),            // ✅
  MMERGE10: Number(besparing),   // ✅
},
        tags: ['Analyse gesprek Lead', 'Website'],
      };

      const mailchimpResponse = await fetch(
        `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members/${memberHash}`,
        {
          method: 'PUT', // PUT = update or create
          headers: {
            Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mailchimpData),
        }
      );
     

      const mailchimpResult = await mailchimpResponse.json();

      if (mailchimpResponse.ok) {
  mailchimpSuccess = true;
  console.log('✅ Lead added to Mailchimp:', email);
} else {
  console.error('❌ Mailchimp error:', mailchimpResult);
}
    } catch (mailchimpError) {
      console.error('❌ Mailchimp exception:', mailchimpError);
      // Don't fail the whole request if Mailchimp fails
    }

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
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const mailBody = `
Nieuwe Analyse Gesprek aanvraag:

Naam: ${naam}
Email: ${email}
Telefoon: ${telefoon || "-"}
Aantal medewerkers: ${medewerkers}
Taken: ${taken.join(", ")}
Uren per week: ${uren}

Mailchimp: ${mailchimpSuccess ? '✅ Toegevoegd' : '❌ Gefaald'}
`;

    await transporter.sendMail({
      from: `${naam} <${email}>`,
      to: TO_EMAIL,
      subject: `Nieuwe Analyse Gesprek aanvraag: ${naam}`,
      text: mailBody,
    });

    return NextResponse.json({ 
      ok: true,
      mailchimp: mailchimpSuccess ? 'added' : 'failed'
    }, { status: 200 });
    
  } catch (err) {
    console.error("Quickscan API error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}