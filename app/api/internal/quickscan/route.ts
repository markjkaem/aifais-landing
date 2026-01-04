import { NextRequest, NextResponse } from "next/server";
import { addLeadToNotion } from "@/lib/crm/notion";
import nodemailer from "nodemailer";
import { withApiGuard } from "@/lib/security/api-guard";
import { quickscanSchema } from "@/lib/security/schemas";

export const POST = withApiGuard(async (req, data: any) => {
    try {
        const { email, results, formData } = data;

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

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
        const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;
        const TO_EMAIL = process.env.TO_EMAIL || "contact@aifais.com";

        if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: SMTP_USER, pass: SMTP_PASS },
            });

            // Email to User
            const userMailOptions = {
                from: `"AIFAIS Automatisering" <${SMTP_USER}>`,
                to: email,
                subject: `Uw Automatisering ROI Analyse - AIFAIS`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #3066be;">Uw Besparingspotentieel met AI</h2>
                        <p>Beste ${formData?.name || "ondernemer"},</p>
                        <p>Bedankt voor het uitvoeren van onze ROI QuickScan. Op basis van uw gegevens hebben we een aanzienlijke kans voor optimalisatie gevonden:</p>
                        
                        <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #cce3ff;">
                            <h3 style="margin-top: 0; color: #0056b3;">Jaarlijkse Besparing: ${results?.totalSavings}</h3>
                            <p style="margin: 5px 0;"><strong>Vrijgekomen uren:</strong> ${results?.hoursReclaimed} uur per jaar</p>
                            <p style="margin: 5px 0;"><strong>FTE Equivalent:</strong> ${results?.fteRecovered} FTE</p>
                        </div>

                        <p>Dit is tijd en geld die u momenteel verliest aan repetitieve, administratieve taken. Met de inzet van <strong>Digital Employees</strong> kunt u deze middelen direct teruggeven aan uw kernactiviteiten.</p>

                        <h3 style="color: #3066be; margin-top: 30px;">Wilt u weten hoe u dit realiseert?</h3>
                        <p>In een korte kennismaking van 15 minuten kunnen we precies laten zien hoe we deze automatisering voor u bouwen en implementeren.</p>
                        
                        <a href="https://aifais.com/contact" style="display: inline-block; background-color: #3066be; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Vraag een gratis analyse aan</a>
                        
                        <p style="margin-top: 30px; font-size: 12px; color: #666;">
                            Met vriendelijke groet,<br>
                            Het team van AIFAIS
                        </p>
                    </div>
                `
            };

            // Email to Admin
            const adminMailOptions = {
                from: `"AIFAIS ROI Tool" <${SMTP_USER}>`,
                to: TO_EMAIL,
                subject: `Nieuwe ROI Lead: ${formData?.name || email}`,
                text: `Nieuwe ROI berekening uitgevoerd.\n\nNaam: ${formData?.name}\nEmail: ${email}\nBesparing: ${results?.totalSavings}\nUren: ${results?.hoursReclaimed}\nFTE: ${results?.fteRecovered}\n\nLead is toegevoegd aan Notion.`
            };

            // Send both emails
            await Promise.all([
                transporter.sendMail(userMailOptions),
                transporter.sendMail(adminMailOptions)
            ]);

            console.log(`✅ QuickScan emails sent: ${email}`);
        } else {
            console.warn("⚠️ SMTP not configured, skipping QuickScan emails.");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ QuickScan capture/email error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}, {
    schema: quickscanSchema,
    rateLimit: { windowMs: 3600000, maxRequests: 5 }, // 5 per uur per IP
    requireOrigin: true
});
