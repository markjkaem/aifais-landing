const LOCAL_API_URL = "http://localhost:3000";

async function testCvScreener() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: CV Screener');
    console.log('='.repeat(60));

    const payload = {
        cvBase64: "DEV_BYPASS",
        mimeType: "application/pdf",
        jobDescription: "Senior JavaScript Developer met 5+ jaar ervaring",
        signature: "DEV_BYPASS"
    };

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/hr/cv-screener`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Origin": LOCAL_API_URL },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log(JSON.stringify(data, null, 2));
        console.log(response.ok && data.success ? "✅ CV Screener PASSED" : "❌ CV Screener FAILED");
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testCvScreener();
