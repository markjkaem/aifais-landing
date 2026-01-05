const fs = require('fs');
const path = require('path');

// ============================================
// TEST: Contract Checker
// ============================================

const LOCAL_API_URL = "http://localhost:3000";
const API_KEY_BYPASS = "DEV_BYPASS";
const TEST_FILE_NAME = "mock-contract.pdf";

function getBase64(filename) {
    const filePath = path.join(__dirname, '..', 'mocks', filename);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Kan test bestand niet vinden: ${filePath}`);
        console.log(`👉 Plaats een bestand genaamd '${filename}' in de scripts/mocks map.`);
        console.log(`👉 Of gebruik mock-invoice.pdf als alternatief voor testen.`);
        process.exit(1);
    }
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
}

async function testContractChecker() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Contract Checker');
    console.log('='.repeat(60));
    console.log(`📄 File: ${TEST_FILE_NAME}`);
    console.log(`🔐 Auth: DEV_BYPASS (Solana mocked)`);
    console.log('');

    const BASE64_DATA = getBase64(TEST_FILE_NAME);

    const payload = {
        contractBase64: BASE64_DATA,
        mimeType: "application/pdf",
        signature: API_KEY_BYPASS
    };

    console.log('📤 Sending request to:', `${LOCAL_API_URL}/api/v1/legal/check-contract`);
    console.log('📦 Payload size:', Math.round(BASE64_DATA.length / 1024), 'KB');
    console.log('');

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/legal/check-contract`, {
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

        if (contentType && contentType.includes('application/pdf')) {
            // PDF response
            const buffer = await response.arrayBuffer();
            const outputPath = path.join(__dirname, '..', 'output', 'test-contract-report.pdf');
            fs.writeFileSync(outputPath, Buffer.from(buffer));

            console.log("✅ Contract Checker Test PASSED");
            console.log(`📄 PDF Report saved to: ${outputPath}`);
            console.log(`📊 PDF Size: ${Math.round(buffer.byteLength / 1024)} KB`);
        } else {
            // JSON response (likely error)
            const data = await response.json();
            console.log('📋 RESPONSE DATA:');
            console.log(JSON.stringify(data, null, 2));
            console.log('');

            if (response.ok) {
                console.log("✅ Contract Checker Test PASSED");
            } else {
                console.log("❌ Contract Checker Test FAILED");
                console.log(`   Error: ${data.error || 'Unknown error'}`);
            }
        }

    } catch (error) {
        console.error("\n❌ Network/Script Error:", error.message);
        process.exit(1);
    }
}

testContractChecker();
