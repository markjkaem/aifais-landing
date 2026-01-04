/**
 * Test script voor Quote Generator API
 * 
 * Gebruik: node scripts/test-quote-generator.js
 */

const fs = require('fs');
const path = require('path');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function testQuoteGenerator() {
    console.log('🧪 Testing Quote Generator API...\n');

    const payload = {
        companyName: "AIFAIS B.V.",
        companyAddress: "Innovatiestraat 123, 1234 AB Amsterdam",
        companyKvk: "12345678",
        companyVat: "NL123456789B01",
        clientName: "Test Klant B.V.",
        clientAddress: "Klantlaan 456, 5678 CD Rotterdam",
        projectTitle: "Website Ontwikkeling",
        projectDescription: "Ontwikkeling van een moderne, responsive website met CMS integratie en SEO optimalisatie.",
        items: [
            {
                description: "UI/UX Design",
                quantity: 40,
                price: 85.00
            },
            {
                description: "Frontend Development (React)",
                quantity: 60,
                price: 95.00
            },
            {
                description: "Backend Development (Node.js)",
                quantity: 40,
                price: 95.00
            },
            {
                description: "CMS Integratie",
                quantity: 20,
                price: 85.00
            },
            {
                description: "SEO Optimalisatie",
                quantity: 10,
                price: 75.00
            }
        ],
        validUntil: 30
    };

    console.log('📤 Sending request to:', `${API_URL}/api/v1/finance/generate-quote`);
    console.log('📦 Project:', payload.projectTitle);
    console.log('📊 Items:', payload.items.length);
    console.log('');

    try {
        const response = await fetch(`${API_URL}/api/v1/finance/generate-quote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('📡 Response status:', response.status, response.statusText);
        console.log('');

        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            const data = await response.json();

            if (response.ok) {
                console.log('✅ SUCCESS!');
                console.log('');

                if (data.data.pdfBase64) {
                    // Save PDF to file
                    const outputPath = path.join(__dirname, 'quote-output.pdf');
                    const pdfBuffer = Buffer.from(data.data.pdfBase64, 'base64');
                    fs.writeFileSync(outputPath, pdfBuffer);
                    console.log('📄 Offerte PDF opgeslagen:', outputPath);
                    console.log('📏 Bestandsgrootte:', Math.round(pdfBuffer.length / 1024), 'KB');

                    // Calculate total
                    const subtotal = payload.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                    const vat = subtotal * 0.21;
                    const total = subtotal + vat;

                    console.log('');
                    console.log('💰 Financieel Overzicht:');
                    console.log('  Subtotaal: €', subtotal.toFixed(2));
                    console.log('  BTW (21%): €', vat.toFixed(2));
                    console.log('  Totaal:    €', total.toFixed(2));
                }
            } else {
                console.log('❌ ERROR:', data.error);
                if (data.details) {
                    console.log('Details:', JSON.stringify(data.details, null, 2));
                }
            }
        } else {
            const text = await response.text();
            console.log('❌ Unexpected response type:', contentType);
            console.log('Response:', text.substring(0, 500));
        }

    } catch (error) {
        console.error('❌ Request failed:', error.message);
    }
}

// Run test
testQuoteGenerator().catch(console.error);
