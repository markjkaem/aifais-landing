const path = require('path');

// ============================================
// TEST: ROI QuickScan
// ============================================

const LOCAL_API_URL = "http://localhost:3000";

async function testQuickScan() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: ROI QuickScan');
    console.log('='.repeat(60));
    console.log('📝 Testing internal ROI calculation lead capture');
    console.log('');

    const payload = {
        email: "roi-lead@example.com",
        formData: {
            name: "Test Ondernemer",
            companySize: "10-50",
            industry: "Logistiek"
        },
        results: {
            totalSavings: "€ 45.000",
            hoursReclaimed: "1200",
            fteRecovered: "0.7"
        }
    };

    console.log('📤 Sending request to:', `${LOCAL_API_URL}/api/internal/quickscan`);
    console.log('💰 Estimated Savings:', payload.results.totalSavings);
    console.log('');

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/internal/quickscan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": LOCAL_API_URL
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log('📋 RESPONSE DATA:');
        console.log(JSON.stringify(data, null, 2));
        console.log('');

        if (response.ok && data.success) {
            console.log("✅ QuickScan Test PASSED");
        } else {
            console.log("❌ QuickScan Test FAILED");
            console.log(`   Error: ${data.error || 'Unknown error'}`);
        }

    } catch (error) {
        console.error("\n❌ Network/Script Error:", error.message);
        process.exit(1);
    }
}

testQuickScan();
