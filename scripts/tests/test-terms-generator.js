const fs = require('fs');
const path = require('path');

// ============================================
// TEST: Terms Generator
// ============================================

const LOCAL_API_URL = "http://localhost:3000";

async function testTermsGenerator() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Terms Generator');
    console.log('='.repeat(60));
    console.log('📝 Testing AI-powered terms generation');
    console.log('');

    const payload = {
        companyName: "Test BV",
        companyType: "BV",
        industry: "IT consultancy",
        hasPhysicalProducts: false,
        hasDigitalProducts: true,
        hasServices: true,
        acceptsReturns: false,
        returnDays: 0,
        paymentTerms: 14,
        jurisdiction: "Nederland",
        signature: "DEV_BYPASS" // Triggers mock mode
    };

    console.log('📤 Sending request to:', `${LOCAL_API_URL}/api/v1/legal/generate-terms`);
    console.log('🏢 Company Type:', payload.companyType);
    console.log('');

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/legal/generate-terms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type');

        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log(`📋 CONTENT TYPE: ${contentType}`);
        console.log('');

        if (contentType && contentType.includes('application/pdf')) {
            // PDF response
            const buffer = await response.arrayBuffer();
            const outputPath = path.join(__dirname, '..', 'output', 'test-terms.pdf');
            fs.writeFileSync(outputPath, Buffer.from(buffer));

            console.log("✅ Terms Generator Test PASSED");
            console.log(`📄 PDF Terms saved to: ${outputPath}`);
            console.log(`📊 PDF Size: ${Math.round(buffer.byteLength / 1024)} KB`);
        } else {
            // Check for JSON
            const text = await response.text();
            try {
                const data = JSON.parse(text);
                console.log('📋 RESPONSE DATA:');
                console.log(JSON.stringify(data, null, 2));
                console.log('');

                if (response.ok) {
                    console.log("✅ Terms Generator Test PASSED");
                } else {
                    console.log("❌ Terms Generator Test FAILED");
                    console.log(`   Error: ${data.error || 'Unknown error'}`);
                }
            } catch (e) {
                console.log('📋 RESPONSE RAW (Not JSON):');
                console.log(text.substring(0, 500)); // Show start of response
                console.log('');
                console.log("❌ Terms Generator Test FAILED - Invalid JSON response");
                process.exit(1);
            }
        }

    } catch (error) {
        console.error("\n❌ Network/Script Error:", error.message);
        process.exit(1);
    }
}

testTermsGenerator();
