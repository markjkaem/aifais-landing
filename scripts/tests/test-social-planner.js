const LOCAL_API_URL = "http://localhost:3000";

async function testSocialPlanner() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Social Media Planner');
    console.log('='.repeat(60));

    const payload = {
        topic: "AI in het MKB",
        platforms: ["linkedin", "instagram"],
        postCount: 3,
        tone: "professional",
        includeHashtags: true,
        signature: "DEV_BYPASS"
    };

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/marketing/social-planner`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Origin": LOCAL_API_URL },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log(JSON.stringify(data, null, 2));
        console.log(response.ok && data.success ? "✅ Social Planner PASSED" : "❌ Social Planner FAILED");
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testSocialPlanner();
