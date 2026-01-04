/**
 * Test script voor Contract Checker API
 * 
 * Gebruik: node scripts/test-contract-checker.js
 */

const fs = require('fs');
const path = require('path');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function testContractChecker() {
    console.log('🧪 Testing Contract Checker API...\n');

    // Lees een test PDF (we gebruiken de mock invoice als placeholder)
    const pdfPath = path.join(__dirname, 'mock-invoice.pdf');

    if (!fs.existsSync(pdfPath)) {
        console.error('❌ Test PDF niet gevonden:', pdfPath);
        console.log('💡 Plaats een test contract PDF in scripts/mock-contract.pdf');
        return;
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64 = pdfBuffer.toString('base64');

    const payload = {
        contractBase64: base64,
        mimeType: 'application/pdf',
        // Voor test: gebruik een dummy signature (in productie moet dit een echte Solana tx zijn)
        signature: 'test_signature_' + Date.now(),
    };

    console.log('📤 Sending request to:', `${API_URL}/api/v1/legal/check-contract`);
    console.log('📦 Payload size:', Math.round(base64.length / 1024), 'KB');
    console.log('');

    try {
        const response = await fetch(`${API_URL}/api/v1/legal/check-contract`, {
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
                console.log('📊 Analysis Results:');
                console.log('-------------------');
                console.log('Summary:', data.data.summary);
                console.log('Score:', data.data.score + '/10');
                console.log('Risks found:', data.data.risks?.length || 0);
                if (data.data.risks) {
                    data.data.risks.forEach((risk, i) => {
                        console.log(`  ${i + 1}. ${risk}`);
                    });
                }
                console.log('');

                if (data.data.pdfBase64) {
                    // Save PDF to file
                    const outputPath = path.join(__dirname, 'contract-analysis-output.pdf');
                    const pdfBuffer = Buffer.from(data.data.pdfBase64, 'base64');
                    fs.writeFileSync(outputPath, pdfBuffer);
                    console.log('📄 PDF rapport opgeslagen:', outputPath);
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
testContractChecker().catch(console.error);
