const LOCAL_API_URL = "http://localhost:3000";

async function testContactForm() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Contact Form');
    console.log('='.repeat(60));

    const payload = {
        name: "DEV_BYPASS",
        email: "DEV_BYPASS@example.com",
        phone: "0612345678",
        message: "Dit is een testbericht."
    };

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/internal/contact`, {
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
            console.log("✅ Contact Form Test PASSED");
        } else {
            console.log("❌ Contact Form Test FAILED");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testContactForm();
