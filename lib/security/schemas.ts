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
    invoiceBase64: z.string().min(1, "Invoice data is verplicht"),
    mimeType: z.enum(["image/jpeg", "image/png", "application/pdf"]),
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});
