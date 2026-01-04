const fs = require('fs');
const path = require('path');

// ============================================
// TEST: Invoice Scanner (Bulk Mode)
// ============================================

const LOCAL_API_URL = "http://localhost:3000";
const API_KEY_BYPASS = "DEV_BYPASS";
const TEST_FILE_NAME = "mock-invoice.pdf";

function getBase64(filename) {
    const filePath = path.join(__dirname, '..', 'mocks', filename);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Kan test bestand niet vinden: ${filePath}`);
        console.log(`👉 Plaats een bestand genaamd '${filename}' in de scripts/mocks map.`);
        process.exit(1);
    }
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
}

async function testInvoiceScanner() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Invoice Scanner (Bulk Mode)');
    console.log('='.repeat(60));
    console.log(`📄 File: ${TEST_FILE_NAME}`);
    console.log(`🔐 Auth: DEV_BYPASS (Solana mocked)`);
    console.log('');

    const BASE64_DATA = getBase64(TEST_FILE_NAME);

    const payload = {
        invoices: [
            {
                base64: BASE64_DATA,
                mimeType: "application/pdf"
            }
        ],
        signature: API_KEY_BYPASS,
        format: "json"
    };

    console.log('📤 Sending request to:', `${LOCAL_API_URL}/api/v1/finance/scan`);
    console.log('📦 Payload size:', Math.round(BASE64_DATA.length / 1024), 'KB');
    console.log('📊 Format:', payload.format);
    console.log('');

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/finance/scan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log('📋 RESPONSE DATA:');
        console.log(JSON.stringify(data, null, 2));
        console.log('');

        if (response.ok) {
            console.log("✅ Invoice Scanner Test PASSED");

            // Validate response structure
            if (data.data && Array.isArray(data.data)) {
                console.log(`✅ Returned ${data.data.length} result(s)`);
                data.data.forEach((result, idx) => {
                    if (result.success) {
                        console.log(`  ✅ Invoice ${idx + 1}: Success`);
                    } else {
                        console.log(`  ❌ Invoice ${idx + 1}: Failed - ${result.error}`);
                    }
                });
            }
        } else {
            console.log("❌ Invoice Scanner Test FAILED");
            console.log(`   Error: ${data.error || 'Unknown error'}`);
        }

    } catch (error) {
        console.error("\n❌ Network/Script Error:", error.message);
        process.exit(1);
    }
}

testInvoiceScanner();
