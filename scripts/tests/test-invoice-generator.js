const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = "http://localhost:3000/api/v1/finance/create-invoice";
const OUTPUT_DIR = path.join(__dirname, "../output");
const MOCK_DIR = path.join(__dirname, "../mocks");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to encode file to base64
function encodeFileToBase64(filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, { encoding: 'base64' });
    }
    return null;
}

async function testInvoiceGenerator() {
    console.log("--- TEST START: Invoice Generator API ---");

    try {
        // Prepare mock data
        const logoPath = path.join(MOCK_DIR, "test-logo.jpg"); // We reuse test-logo if it exists, or skip
        const logoBase64 = encodeFileToBase64(logoPath);

        // Construct the invoice payload (matching Zod schema)
        const payload = {
            ownName: "AI Fais Services",
            ownAddress: "Kerkstraat 1, 1000 AA Amsterdam",
            ownKvk: "12345678",
            ownIban: "NL99BANK0123456789",
            ownLogo: logoBase64 ? `data:image/jpeg;base64,${logoBase64}` : null,

            clientName: "Tech Solutions BV",
            clientAddress: "Industrieweg 20, 3000 BB Rotterdam",

            invoiceNumber: "INV-2024-001",
            invoiceDate: "2024-05-20",
            expiryDate: "2024-06-03",

            discountPercentage: 10,
            notes: "Graag betalen binnen 14 dagen onder vermelding van factuurnummer.",

            items: [
                {
                    id: "1",
                    description: "Consultancy Services - May 2024",
                    quantity: 40,
                    price: 125.00,
                    vatRate: 21
                },
                {
                    id: "2",
                    description: "Software License (Annual)",
                    quantity: 1,
                    price: 2500.00,
                    vatRate: 21
                },
                {
                    id: "3",
                    description: "Travel Expenses (No VAT)",
                    quantity: 1,
                    price: 150.00,
                    vatRate: 0
                }
            ]
        };

        console.log(`Sending invoice request... (Items: ${payload.items.length})`);

        // Send request
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.success && result.data.pdfBase64) {
            console.log("✅ Invoice generated successfully!");

            const pdfBuffer = Buffer.from(result.data.pdfBase64, 'base64');
            const outputPath = path.join(OUTPUT_DIR, "generated-invoice.pdf");
            fs.writeFileSync(outputPath, pdfBuffer);

            console.log(`📄 PDF saved to: ${outputPath}`);
        } else {
            console.error("❌ Failed to generate invoice:", result);
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ Test failed with error:", error);
        process.exit(1);
    }
}

// Run the test
testInvoiceGenerator();
