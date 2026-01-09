import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
    test('homepage loads correctly', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/AIFAIS/i);
    });

    test('tools page is accessible', async ({ page }) => {
        await page.goto('/nl/tools');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('MCP endpoint returns valid response', async ({ request }) => {
        const response = await request.get('/api/mcp');
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data).toHaveProperty('name');
        expect(data).toHaveProperty('tools');
    });

    test('free tool endpoint works without payment', async ({ request }) => {
        const response = await request.post('/api/v1/finance/create-invoice', {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
            },
            data: {
                clientName: 'Test Client',
                clientEmail: 'test@example.com',
                items: [
                    { description: 'Test Service', quantity: 1, unitPrice: 100 }
                ],
            },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.success).toBe(true);
    });
});

test.describe('Payment Flow', () => {
    test('paid endpoint returns 402 without payment', async ({ request }) => {
        const response = await request.post('/api/v1/hr/cv-screener', {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
            },
            data: {
                cvText: 'Test CV content',
                jobDescription: 'Test job description',
            },
        });

        // Should return 402 Payment Required
        expect(response.status()).toBe(402);
    });
});
