import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { addLeadToNotion } from "@/lib/crm/notion";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { contactSchema } from "@/lib/security/schemas";

export const POST = createToolHandler({
    schema: contactSchema,
    rateLimit: { windowMs: 86400000, maxRequests: 2 }, // 2 per 24 uur per IP
    handler: async (data, context) => {
        const { name, email, phone, message } = data;

        // DEV_BYPASS logic
        if (email === 'DEV_BYPASS@example.com' || name === 'DEV_BYPASS') {
            console.log("DEV_BYPASS: Skipping email and Notion for contact form");
            return { ok: true };
        }

        // SMTP setup
        const SMTP_HOST = process.env.SMTP_HOST;
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;
        const TO_EMAIL = process.env.TO_EMAIL || "contact@aifais.com";

        if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: SMTP_USER, pass: SMTP_PASS },
            });

            const mailBody = `Nieuw contactformulier:\n\nNaam: ${name}\nEmail: ${email}\nTelefoon: ${phone}\n\nBericht:\n${message}`;

            await transporter.sendMail({
                from: `${name} <${email}>`,
                to: TO_EMAIL,
                subject: `Contactformulier: ${name} via Aifais`,
                text: mailBody,
            });
        }

        // Add to Notion CRM
        await addLeadToNotion({
            name,
            email,
            phone,
            message,
            source: "Contact Form",
            priority: "Normaal"
        });

        return { ok: true };
    }
});
