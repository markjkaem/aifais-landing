const LOCAL_API_URL = "http://localhost:3000";

async function testInterviewQuestions() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Interview Questions Generator');
    console.log('='.repeat(60));

    const payload = {
        jobTitle: "Frontend Developer",
        jobDescription: "React en TypeScript expert voor SaaS platform",
        experienceLevel: "medior",
        questionCount: 5,
        signature: "DEV_BYPASS"
    };

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/hr/interview-questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Origin": LOCAL_API_URL },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log(JSON.stringify(data, null, 2));
        console.log(response.ok && data.success ? "✅ Interview Questions PASSED" : "❌ Interview Questions FAILED");
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testInterviewQuestions();
