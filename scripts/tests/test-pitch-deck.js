const LOCAL_API_URL = "http://localhost:3000";

async function testPitchDeck() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST: Pitch Deck Generator');
    console.log('='.repeat(60));

    const payload = {
        companyName: "TechStartup BV",
        productService: "AI-powered CRM systeem",
        targetAudience: "MKB bedrijven met 10-100 medewerkers",
        problemSolution: "Handmatige data entry kost uren. Wij automatiseren dit met AI.",
        uniqueValue: "Enige oplossing die 90% van CRM taken automatiseert",
        slideCount: 5,
        signature: "DEV_BYPASS"
    };

    try {
        const response = await fetch(`${LOCAL_API_URL}/api/v1/sales/pitch-deck`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Origin": LOCAL_API_URL },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log(`📊 RESPONSE STATUS: ${response.status}`);
        console.log(JSON.stringify(data, null, 2));
        console.log(response.ok && data.success ? "✅ Pitch Deck PASSED" : "❌ Pitch Deck FAILED");
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testPitchDeck();
