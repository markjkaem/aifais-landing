const LOCAL_API_URL = "http://localhost:3000";

async function testNewsletter() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Newsletter Signup');
    console.log('='.repeat(60));

    const payload = {
        email: "newsletter-test@example.com"
    };

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/internal/newsletter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": LOCAL_API_URL
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log(`📊 RESPONSE STATUS: ${response.status}`);

        if (response.ok && data.success) {
            console.log("✅ Newsletter Test PASSED");
        } else {
            console.log("❌ Newsletter Test FAILED");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testNewsletter();
