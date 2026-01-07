/**
 * Admin endpoint to create missing Stripe payment links
 *
 * POST /api/admin/create-stripe-links
 * Header: x-admin-key: your-secret-admin-key
 *
 * Returns the env vars you need to add to Vercel
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'change-this-in-production';

const TOOLS = [
    { name: 'Invoice Scanner', envVar: 'NEXT_PUBLIC_STRIPE_LINK_SINGLE' },
    { name: 'Contract Checker', envVar: 'NEXT_PUBLIC_STRIPE_LINK_CONTRACT' },
    { name: 'Terms Generator', envVar: 'NEXT_PUBLIC_STRIPE_LINK_TERMS' },
    { name: 'CV Screener', envVar: 'NEXT_PUBLIC_STRIPE_LINK_CV' },
    { name: 'Interview Questions', envVar: 'NEXT_PUBLIC_STRIPE_LINK_INTERVIEW' },
    { name: 'Social Media Planner', envVar: 'NEXT_PUBLIC_STRIPE_LINK_SOCIAL' },
    { name: 'Pitch Deck Generator', envVar: 'NEXT_PUBLIC_STRIPE_LINK_PITCH' },
    { name: 'Lead Scorer', envVar: 'NEXT_PUBLIC_STRIPE_LINK_LEAD' },
];

const PRICE_EUR_CENTS = 50;

export async function POST(request: Request) {
    // Verify admin key
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== ADMIN_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.STRIPE_PRIVATE_KEY) {
        return NextResponse.json({ error: 'STRIPE_PRIVATE_KEY not configured' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

    // Check which links are missing
    const missingTools = TOOLS.filter(t => !process.env[t.envVar]);
    const existingTools = TOOLS.filter(t => process.env[t.envVar]);

    if (missingTools.length === 0) {
        return NextResponse.json({
            message: 'All payment links already configured',
            existing: existingTools.map(t => ({
                name: t.name,
                envVar: t.envVar,
                url: process.env[t.envVar]
            }))
        });
    }

    try {
        // Find or create price
        const existingPrices = await stripe.prices.list({ limit: 100, active: true });
        let price = existingPrices.data.find(
            p => p.unit_amount === PRICE_EUR_CENTS && p.currency === 'eur'
        );

        if (!price) {
            const product = await stripe.products.create({
                name: 'AIFAIS Tool Access',
                description: 'Single use access to an AIFAIS AI-powered business tool',
            });

            price = await stripe.prices.create({
                product: product.id,
                unit_amount: PRICE_EUR_CENTS,
                currency: 'eur',
            });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aifais.com';
        const created: Array<{ name: string; envVar: string; url: string }> = [];
        const errors: Array<{ name: string; error: string }> = [];

        for (const tool of missingTools) {
            try {
                const paymentLink = await stripe.paymentLinks.create({
                    line_items: [{ price: price.id, quantity: 1 }],
                    metadata: { tool: tool.name },
                    after_completion: {
                        type: 'redirect',
                        redirect: {
                            url: `${baseUrl}/tools?session_id={CHECKOUT_SESSION_ID}`,
                        },
                    },
                    payment_method_types: ['card', 'ideal'],
                });

                created.push({
                    name: tool.name,
                    envVar: tool.envVar,
                    url: paymentLink.url
                });
            } catch (err: any) {
                errors.push({ name: tool.name, error: err.message });
            }
        }

        // Format for easy copy/paste to Vercel
        const envVarsForVercel = created.map(c => `${c.envVar}=${c.url}`).join('\n');

        return NextResponse.json({
            message: `Created ${created.length} payment links`,
            created,
            errors: errors.length > 0 ? errors : undefined,
            existing: existingTools.map(t => ({
                name: t.name,
                envVar: t.envVar,
                url: process.env[t.envVar]
            })),
            envVarsForVercel
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
