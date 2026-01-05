import { NextResponse } from "next/server";
import { addLeadToNotion } from "@/lib/crm/notion";
import nodemailer from "nodemailer";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { quickscanSchema } from "@/lib/security/schemas";

export const POST = createToolHandler({
    schema: quickscanSchema,
    rateLimit: { windowMs: 3600000, maxRequests: 5 }, // 5 per uur per IP
    handler: async (data) => {
        const { email, results, formData } = data;

        // 1. Capture high-intent lead in Notion CRM
        await addLeadToNotion({
            name: formData?.name || "QuickScan User",
            email: email,
            source: "ROI Calculator",
            priority: "Hoog",
            message: `QuickScan ROI Resultaten:\n- Besparing: ${results?.totalSavings}\n- Uren: ${results?.hoursReclaimed}\n- FTE: ${results?.fteRecovered}`,
            metadata: {
                calculationResults: results,
                inputData: formData
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

            const userMailOptions = {
                from: `"AIFAIS Automatisering" <${SMTP_USER}>`,
                to: email,
                subject: `Uw Automatisering ROI Analyse - AIFAIS`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #3066be;">Uw Besparingspotentieel met AI</h2>
                        <p>Beste ${formData?.name || "ondernemer"},</p>
                        <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #cce3ff;">
                            <h3 style="margin-top: 0; color: #0056b3;">Jaarlijkse Besparing: ${results?.totalSavings}</h3>
                            <p style="margin: 5px 0;"><strong>Vrijgekomen uren:</strong> ${results?.hoursReclaimed} uur per jaar</p>
                            <p style="margin: 5px 0;"><strong>FTE Equivalent:</strong> ${results?.fteRecovered} FTE</p>
                        </div>
                        <a href="https://aifais.com/contact" style="display: inline-block; background-color: #3066be; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Vraag analyse aan</a>
                    </div>
                `
            };

            const adminMailOptions = {
                from: `"AIFAIS ROI Tool" <${SMTP_USER}>`,
                to: TO_EMAIL,
                subject: `Nieuwe ROI Lead: ${formData?.name || email}`,
                text: `Naam: ${formData?.name}\nBesparing: ${results?.totalSavings}\nUren: ${results?.hoursReclaimed}`
            };

            await Promise.all([
                transporter.sendMail(userMailOptions),
                transporter.sendMail(adminMailOptions)
            ]);
        }

        return { success: true };
    }
});
