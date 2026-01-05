const fs = require('fs');
const path = require('path');

// ============================================
// TEST: Quote Generator
// ============================================

const LOCAL_API_URL = "http://localhost:3000";

async function testQuoteGenerator() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Quote Generator');
    console.log('='.repeat(60));
    console.log('📝 Testing PDF generation for quotes');
    console.log('');

    const payload = {
        companyName: "Test BV",
        companyAddress: "Teststraat 123, 1234 AB Amsterdam",
        companyKvk: "12345678",
        companyEmail: "test@example.com",
        companyPhone: "+31 6 12345678",
        clientName: "Klant Bedrijf",
        clientAddress: "Klantstraat 456, 5678 CD Rotterdam",
        projectTitle: "Website Development Project",
        projectDescription: "Complete website redesign and development",
        quoteNumber: "OFF-2024-001",
        quoteDate: "2024-01-04",
        validUntil: 30,  // Number of days
        items: [
            {
                description: "Consultancy uren",
                quantity: 8,
                price: 125,
                vatRate: 21
            },
            {
                description: "Project management",
                quantity: 4,
                price: 150,
                vatRate: 21
            }
        ],
        notes: "Gelieve de offerte binnen 30 dagen te accepteren.",
        paymentTerms: "Betaling binnen 14 dagen na acceptatie.",
        signature: "DEV_BYPASS"
    };

    console.log('📤 Sending request to:', `${LOCAL_API_URL}/api/v1/finance/generate-quote`);
    console.log('📦 Items:', payload.items.length);
    console.log('');

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/finance/generate-quote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": LOCAL_API_URL
            },
            body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type');

        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log(`📋 CONTENT TYPE: ${contentType}`);
        console.log('');

        if (response.ok) {
            const data = await response.json();

            if (data.success && data.data && data.data.pdfBase64) {
                // Decode base64 and save PDF
                const pdfBuffer = Buffer.from(data.data.pdfBase64, 'base64');
                const outputPath = path.join(__dirname, '..', 'output', 'test-quote.pdf');
                fs.writeFileSync(outputPath, pdfBuffer);

                console.log("✅ Quote Generator Test PASSED");
                console.log(`📄 PDF Quote saved to: ${outputPath}`);
                console.log(`📊 PDF Size: ${Math.round(pdfBuffer.length / 1024)} KB`);
            } else {
                console.log("❌ Quote Generator Test FAILED");
                console.log(`   Error: Unexpected response format`);
                console.log('📋 RESPONSE DATA:');
                console.log(JSON.stringify(data, null, 2));
            }
        } else {
            const data = await response.json();
            console.log('📋 RESPONSE DATA:');
            console.log(JSON.stringify(data, null, 2));
            console.log('');
            console.log("❌ Quote Generator Test FAILED");
            console.log(`   Error: ${data.error || 'Unknown error'}`);
        }

    } catch (error) {
        console.error("\n❌ Network/Script Error:", error.message);
        process.exit(1);
    }
}

testQuoteGenerator();
