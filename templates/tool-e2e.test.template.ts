/**
 * E2E Test Template for Tools
 *
 * Copy this file to e2e/tools/{{TOOL_SLUG}}.test.ts and replace:
 * - {{TOOL_SLUG}} with the tool slug (e.g., 'cv-screener')
 * - {{TOOL_URL}} with the tool URL path (e.g., '/nl/tools/cv-screener')
 * - {{FORM_FIELDS}} with the form field selectors and test values
 * - {{RESULT_TEXT}} with expected text in result
 */

import { test, expect } from '@playwright/test';

test.describe('{{TOOL_SLUG}} Tool', () => {
    const toolUrl = '{{TOOL_URL}}';
    const devUrl = `${toolUrl}?dev=true`;

    test('page loads correctly', async ({ page }) => {
        await page.goto(toolUrl);
        await expect(page).toHaveTitle(/AIFAIS/i);
        // Tool-specific title check
        await expect(page.locator('h1')).toBeVisible();
    });

    test('form is interactive', async ({ page }) => {
        await page.goto(devUrl);

        // Check form elements are present
        // {{FORM_FIELDS}} - Replace with actual selectors
        // Example:
        // await expect(page.getByLabel('CV Tekst')).toBeVisible();
        // await expect(page.getByRole('button', { name: /analyseer/i })).toBeVisible();
    });

    test('dev mode bypasses payment', async ({ page }) => {
        await page.goto(devUrl);

        // Fill form with test data
        // {{FORM_FIELDS}} - Replace with actual form filling
        // Example:
        // await page.getByLabel('CV Tekst').fill('Test CV content...');
        // await page.getByLabel('Functieomschrijving').fill('Test job description...');

        // Submit form
        // await page.getByRole('button', { name: /analyseer/i }).click();

        // Should NOT show payment modal (dev mode bypasses)
        await expect(page.locator('[data-testid="payment-modal"]')).not.toBeVisible();

        // Wait for result
        // await expect(page.getByText('{{RESULT_TEXT}}')).toBeVisible({ timeout: 30000 });
    });

    test('shows payment modal in non-dev mode', async ({ page }) => {
        // Note: This test only works if the tool is paid
        await page.goto(toolUrl); // No ?dev=true

        // Fill and submit form
        // {{FORM_FIELDS}}

        // Payment modal should appear for paid tools
        // await expect(page.locator('[data-testid="payment-modal"]')).toBeVisible();
    });

    test('result can be exported', async ({ page }) => {
        await page.goto(devUrl);

        // Fill form and submit
        // {{FORM_FIELDS}}

        // Wait for result
        // await page.waitForSelector('[data-testid="result-container"]');

        // Check export buttons are present
        // await expect(page.getByRole('button', { name: /pdf/i })).toBeVisible();
        // await expect(page.getByRole('button', { name: /csv/i })).toBeVisible();
    });
});

/**
 * Test data for {{TOOL_SLUG}}
 *
 * Replace the FORM_FIELDS comments above with actual test data like:
 *
 * // CV Screener example:
 * await page.getByLabel('CV Tekst').fill(`
 *     Software Engineer met 5 jaar ervaring
 *     - React, Node.js, TypeScript
 *     - Agile development
 * `);
 * await page.getByLabel('Functieomschrijving').fill(`
 *     Senior Frontend Developer gezocht
 *     Vereisten: 3+ jaar React ervaring
 * `);
 * await page.getByRole('button', { name: /analyseer/i }).click();
 */
