const LOCAL_API_URL = "http://localhost:3000";

async function testSeoAudit() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: SEO Audit Tool');
    console.log('='.repeat(60));

    const payload = {
        url: "https://example.com",
        focusKeywords: ["AI", "automatisering"],
        signature: "DEV_BYPASS"
    };

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/marketing/seo-audit`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Origin": LOCAL_API_URL },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log(JSON.stringify(data, null, 2));
        console.log(response.ok && data.success ? "✅ SEO Audit PASSED" : "❌ SEO Audit FAILED");
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testSeoAudit();
