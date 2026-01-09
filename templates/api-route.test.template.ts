/**
 * API Route Test Template
 *
 * Copy this file and replace:
 * - {{ROUTE_PATH}} with the API route path (e.g., 'finance/create-invoice')
 * - {{SCHEMA_NAME}} with the Zod schema name
 * - {{VALID_INPUT}} with valid test input
 * - {{INVALID_INPUT}} with invalid test input
 * - {{IS_PAID}} with true/false for payment requirement
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/v1/{{ROUTE_PATH}}/route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/security/api-guard', () => ({
    withApiGuard: vi.fn((handler) => handler),
}));

vi.mock('@/lib/payment-gatekeeper', () => ({
    gatekeepPayment: vi.fn().mockResolvedValue({ success: true, method: 'free' }),
}));

// Mock Anthropic if needed
vi.mock('@anthropic-ai/sdk', () => ({
    default: vi.fn().mockImplementation(() => ({
        messages: {
            create: vi.fn().mockResolvedValue({
                content: [{ type: 'text', text: '{"result": "mocked"}' }],
            }),
        },
    })),
}));

import { gatekeepPayment } from '@/lib/payment-gatekeeper';

describe('{{ROUTE_PATH}} API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Valid Requests', () => {
        it('should process valid input successfully', async () => {
            const validInput = {{VALID_INPUT}};

            const req = new NextRequest('http://localhost/api/v1/{{ROUTE_PATH}}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:3000',
                },
                body: JSON.stringify(validInput),
            });

            const response = await POST(req);
            const json = await response.json();

            expect(response.status).toBe(200);
            expect(json.success).toBe(true);
        });
    });

    describe('Invalid Requests', () => {
        it('should reject invalid input', async () => {
            const invalidInput = {{INVALID_INPUT}};

            const req = new NextRequest('http://localhost/api/v1/{{ROUTE_PATH}}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:3000',
                },
                body: JSON.stringify(invalidInput),
            });

            const response = await POST(req);
            expect(response.status).toBe(400);
        });
    });

    // Include this block only for paid tools ({{IS_PAID}} === true)
    describe('Payment Requirements', () => {
        it('should return 402 when payment is required', async () => {
            (gatekeepPayment as any).mockResolvedValue({
                success: false,
                error: 'Payment required',
                status: 402,
            });

            const req = new NextRequest('http://localhost/api/v1/{{ROUTE_PATH}}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:3000',
                },
                body: JSON.stringify({{VALID_INPUT}}),
            });

            const response = await POST(req);
            expect(response.status).toBe(402);
        });

        it('should process request with valid payment', async () => {
            (gatekeepPayment as any).mockResolvedValue({
                success: true,
                method: 'solana_x402',
            });

            const req = new NextRequest('http://localhost/api/v1/{{ROUTE_PATH}}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:3000',
                },
                body: JSON.stringify({
                    ...{{VALID_INPUT}},
                    signature: 'valid_signature',
                }),
            });

            const response = await POST(req);
            const json = await response.json();

            expect(response.status).toBe(200);
            expect(json.success).toBe(true);
        });
    });
});
