const fs = require('fs');
const path = require('path');

// 1. Configuratie
const LOCAL_API_URL = "http://localhost:3000/api/v1/scan";
const API_KEY_BYPASS = "DEV_BYPASS";

// bestandsnaam van je test factuur in de scripts map
const TEST_FILE_NAME = "mock-invoice.pdf";

function getBase64() {
    const filePath = path.join(__dirname, TEST_FILE_NAME);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Kan test bestand niet vinden: ${filePath}`);
        console.log("👉 Plaats een bestand genaamd 'mock-invoice.jpg' in de scripts map of pas het script aan.");
        process.exit(1);
    }
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
}

const BASE64_DATA = getBase64();

async function testApi() {
    console.log(`🚀 Testing /api/v1/scan with ${TEST_FILE_NAME} & DEV_BYPASS...`);

    const payload = {
        // Bulk mode test
        invoices: [
            {
                base64: BASE64_DATA,
                mimeType: "application/pdf"
            }
        ],
        signature: API_KEY_BYPASS,
        format: "csv"
    };

    try {
        const response = await fetch(LOCAL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.text();

        console.log(`\nRESPONSE STATUS: ${response.status}`);
        console.log("RESPONSE DATA (Text/CSV):");
        console.log(data);

        if (response.ok) {
            console.log("\n✅ API Test Successful (Logic executed)");
        } else {
            console.log("\n❌ API returned error (Expected if using dummy image)");
        }

    } catch (error) {
        console.error("\n❌ Network/Script Error:", error.message);
    }
}

testApi();
