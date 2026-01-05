const LOCAL_API_URL = "http://localhost:3000";

async function testLeadScorer() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Lead Scorer');
    console.log('='.repeat(60));

    const payload = {
        companyName: "Innovatie Partners BV",
        industry: "Consultancy",
        companySize: "51-200",
        budget: "medium",
        engagement: {
            websiteVisits: 12,
            emailOpens: 5,
            demoRequested: true
        },
        signature: "DEV_BYPASS"
    };

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/sales/lead-scorer`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Origin": LOCAL_API_URL },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log(JSON.stringify(data, null, 2));
        console.log(response.ok && data.success ? "✅ Lead Scorer PASSED" : "❌ Lead Scorer FAILED");
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testLeadScorer();
