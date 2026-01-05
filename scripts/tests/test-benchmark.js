const path = require('path');

// ============================================
// TEST: Benchmark Tool
// ============================================

const LOCAL_API_URL = "http://localhost:3000";

async function testBenchmark() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: AI Benchmark Tool');
    console.log('='.repeat(60));
    console.log('📝 Testing internal benchmark submission and email logic');
    console.log('');

    const payload = {
        email: "test-lead@example.com",
        sector: "Finance",
        score: 75,
        benchmark: 60
    };

    console.log('📤 Sending request to:', `${LOCAL_API_URL}/api/internal/benchmark`);
    console.log('📧 Target Email:', payload.email);
    console.log('');

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/internal/benchmark`, {
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
            console.log("✅ Benchmark Test PASSED");
        } else {
            console.log("❌ Benchmark Test FAILED");
            console.log(`   Error: ${data.error || 'Unknown error'}`);
        }

    } catch (error) {
        console.error("\n❌ Network/Script Error:", error.message);
        process.exit(1);
    }
}

testBenchmark();
