/**
 * Ensures all Stripe payment links exist
 * Checks env vars and creates missing ones via Stripe API
 *
 * Run during build: npx tsx scripts/ensure-stripe-links.ts
 */

import Stripe from 'stripe';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config();

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

const PRICE_EUR_CENTS = 50; // €0.50

async function ensureStripeLinks() {
    if (!process.env.STRIPE_PRIVATE_KEY) {
        console.log('⚠️  STRIPE_PRIVATE_KEY not set, skipping payment link creation');
        return;
    }

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

    // Check which links are missing
    const missingTools = TOOLS.filter(t => !process.env[t.envVar]);

    if (missingTools.length === 0) {
        console.log('✅ All Stripe payment links are configured');
        return;
    }

    console.log(`Creating ${missingTools.length} missing Stripe payment links...\n`);

    // Find or create product and price
    let price: Stripe.Price;

    const existingPrices = await stripe.prices.list({
        limit: 100,
        active: true,
    });

    const matchingPrice = existingPrices.data.find(
        p => p.unit_amount === PRICE_EUR_CENTS && p.currency === 'eur'
    );

    if (matchingPrice) {
        price = matchingPrice;
        console.log(`Using existing price: ${price.id}`);
    } else {
        const product = await stripe.products.create({
            name: 'AIFAIS Tool Access',
            description: 'Single use access to an AIFAIS AI-powered business tool',
        });

        price = await stripe.prices.create({
            product: product.id,
            unit_amount: PRICE_EUR_CENTS,
            currency: 'eur',
        });
        console.log(`Created new price: ${price.id}`);
    }

    const newLinks: Record<string, string> = {};

    for (const tool of missingTools) {
        try {
            const paymentLink = await stripe.paymentLinks.create({
                line_items: [{ price: price.id, quantity: 1 }],
                metadata: { tool: tool.name },
                after_completion: {
                    type: 'redirect',
                    redirect: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://aifais.com'}/tools?session_id={CHECKOUT_SESSION_ID}`,
                    },
                },
                payment_method_types: ['card', 'ideal'],
            });

            newLinks[tool.envVar] = paymentLink.url;
            console.log(`✅ ${tool.name}: ${paymentLink.url}`);
        } catch (error: any) {
            console.error(`❌ ${tool.name}: ${error.message}`);
        }
    }

    // Output for manual addition to Vercel
    if (Object.keys(newLinks).length > 0) {
        console.log('\n========================================');
        console.log('Add these environment variables to Vercel:');
        console.log('========================================\n');

        for (const [envVar, url] of Object.entries(newLinks)) {
            console.log(`${envVar}=${url}`);
        }

        // Also write to a local file for reference
        const outputPath = path.join(process.cwd(), '.stripe-links-output.txt');
        fs.writeFileSync(outputPath, Object.entries(newLinks).map(([k, v]) => `${k}=${v}`).join('\n'));
        console.log(`\n📄 Also saved to: ${outputPath}`);
    }
}

ensureStripeLinks().catch(console.error);
