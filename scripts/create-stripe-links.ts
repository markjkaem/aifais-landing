/**
 * Script to create Stripe Payment Links for all paid tools
 * Run: npx tsx scripts/create-stripe-links.ts
 */

import Stripe from 'stripe';
import { config } from 'dotenv';

// Load environment variables
config();

if (!process.env.STRIPE_PRIVATE_KEY) {
    console.error('Error: STRIPE_PRIVATE_KEY not found in environment');
    process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const TOOLS = [
    { name: 'CV Screener', envVar: 'NEXT_PUBLIC_STRIPE_LINK_CV' },
    { name: 'Interview Questions Generator', envVar: 'NEXT_PUBLIC_STRIPE_LINK_INTERVIEW' },
    { name: 'Social Media Planner', envVar: 'NEXT_PUBLIC_STRIPE_LINK_SOCIAL' },
    { name: 'Pitch Deck Generator', envVar: 'NEXT_PUBLIC_STRIPE_LINK_PITCH' },
    { name: 'Lead Scorer', envVar: 'NEXT_PUBLIC_STRIPE_LINK_LEAD' },
];

const PRICE_EUR = 50; // €0.50 in cents

async function createPaymentLinks() {
    console.log('Creating Stripe Payment Links for AIFAIS tools...\n');

    // First, create a product and price
    const product = await stripe.products.create({
        name: 'AIFAIS Tool Access',
        description: 'Single use access to an AIFAIS AI-powered business tool',
    });

    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: PRICE_EUR,
        currency: 'eur',
    });

    console.log(`Created product: ${product.id}`);
    console.log(`Created price: ${price.id} (€${PRICE_EUR / 100})\n`);

    const links: Record<string, string> = {};

    for (const tool of TOOLS) {
        try {
            const paymentLink = await stripe.paymentLinks.create({
                line_items: [{ price: price.id, quantity: 1 }],
                metadata: { tool: tool.name },
                after_completion: {
                    type: 'redirect',
                    redirect: {
                        url: 'https://aifais.com/tools?session_id={CHECKOUT_SESSION_ID}',
                    },
                },
                payment_method_types: ['card', 'ideal'],
            });

            links[tool.envVar] = paymentLink.url;
            console.log(`✅ ${tool.name}: ${paymentLink.url}`);
        } catch (error: any) {
            console.error(`❌ Failed to create link for ${tool.name}: ${error.message}`);
        }
    }

    console.log('\n--- Add these to your .env file ---\n');
    for (const [envVar, url] of Object.entries(links)) {
        console.log(`${envVar}=${url}`);
    }
}

createPaymentLinks().catch(console.error);
