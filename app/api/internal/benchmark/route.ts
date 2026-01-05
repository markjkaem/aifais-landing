import { NextResponse } from "next/server";
import { addLeadToNotion } from "@/lib/crm/notion";
import nodemailer from "nodemailer";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { benchmarkSchema } from "@/lib/security/schemas";

export const POST = createToolHandler({
    schema: benchmarkSchema,
    rateLimit: { windowMs: 3600000, maxRequests: 5 }, // 5 per uur per IP
    handler: async (data, context) => {
        const { email, sector, score, benchmark } = data;

        // 1. Capture benchmark lead in Notion CRM
        await addLeadToNotion({
            email: email,
            source: "Tool Landing Page",
            priority: "Normaal",
            message: `Benchmark Resultaten:\n- Sector: ${sector}\n- Score: ${score}%\n- Sectorgemiddelde: ${benchmark}%`,
            metadata: {
                tool: "Digital Benchmark",
                sector,
                score,
                benchmark
            }
        });

        // 2. SMTP setup
        const SMTP_HOST = process.env.SMTP_HOST;
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;
        const TO_EMAIL = process.env.TO_EMAIL || "contact@aifais.com";

        if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: SMTP_USER, pass: SMTP_PASS },
            });

            const isAbove = score > benchmark;

            const userMailOptions = {
                from: `"AIFAIS Automatisering" <${SMTP_USER}>`,
                to: email,
                subject: `Uw AI Benchmark Resultaten - ${sector}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #3066be;">Uw AI Benchmark Score: ${score}%</h2>
                        <p>Bedankt voor het gebruiken van de AIFAIS Benchmark Tool. Hier zijn uw resultaten voor de sector <strong>${sector}</strong>:</p>
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Uw Score:</strong> ${score}%</p>
                            <p style="margin: 5px 0;"><strong>Sector Gemiddelde:</strong> ${benchmark}%</p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> ${isAbove ? "Boven gemiddeld 🚀" : "Groeipotentieel 📈"}</p>
                        </div>
                        <p>${isAbove ? "Gefeliciteerd! U loopt voorop." : "U scoort momenteel onder het gemiddelde."}</p>
                        <a href="https://aifais.com/contact" style="display: inline-block; background-color: #3066be; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Plan een gesprek</a>
                    </div>
                `
            };

            const adminMailOptions = {
                from: `"AIFAIS Tool" <${SMTP_USER}>`,
                to: TO_EMAIL,
                subject: `Nieuwe Benchmark Lead: ${email}`,
                text: `Email: ${email}\nSector: ${sector}\nScore: ${score}%\nBenchmark: ${benchmark}%`
            };

            await Promise.all([
                transporter.sendMail(userMailOptions),
                transporter.sendMail(adminMailOptions)
            ]);
        }

        return { success: true };
    }
});
