import { z } from "zod";

export const newsletterSchema = z.object({
    email: z.string().email("Ongeldig emailadres"),
});

export const contactSchema = z.object({
    name: z.string().min(2, "Naam is te kort"),
    email: z.string().email("Ongeldig emailadres"),
    phone: z.string().optional(),
    message: z.string().min(5, "Bericht is te kort"),
});

export const benchmarkSchema = z.object({
    email: z.string().email("Ongeldig emailadres"),
    sector: z.string().min(1, "Sector is verplicht"),
    score: z.number().min(0).max(100),
    benchmark: z.number().min(0).max(100),
});

export const quickscanSchema = z.object({
    email: z.string().email("Ongeldig emailadres"),
    results: z.object({
        totalSavings: z.string().optional(),
        hoursReclaimed: z.union([z.string(), z.number()]).optional(),
        fteRecovered: z.union([z.string(), z.number()]).optional(),
    }).optional(),
    formData: z.object({
        name: z.string().optional(),
    }).optional(),
});

export const scanSchema = z.object({
    // Single file mode (legacy)
    invoiceBase64: z.string().optional(),
    mimeType: z.enum(["image/jpeg", "image/png", "application/pdf"]).optional(),

    // Bulk mode
    invoices: z.array(z.object({
        base64: z.string().min(1),
        mimeType: z.enum(["image/jpeg", "image/png", "application/pdf"])
    })).max(10).optional(),

    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
    format: z.enum(["json", "csv"]).optional().default("json"),
});

export const checkContractSchema = z.object({
    contractBase64: z.string().min(1),
    mimeType: z.enum(["application/pdf"]),
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

