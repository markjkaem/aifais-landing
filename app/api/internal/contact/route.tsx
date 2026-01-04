import nodemailer from "nodemailer";
import { addLeadToNotion } from "@/lib/crm/notion";
import { withApiGuard } from "@/lib/security/api-guard";
import { contactSchema } from "@/lib/security/schemas";

export const POST = withApiGuard(async (request, data: any) => {
  try {
    const { name, email, phone, message } = data;

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
    await addLeadToNotion({
      name,
      email,
      phone,
      message,
      source: "Contact Form",
      priority: "Normaal"
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("contact error", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}, {
  schema: contactSchema,
  rateLimit: { windowMs: 86400000, maxRequests: 2 }, // 2 per 24 uur per IP
  requireOrigin: true
});
