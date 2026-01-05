import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createToolHandler } from './createToolHandler';
import { z } from 'zod';
import { NextRequest } from 'next/server';

// Mock withApiGuard to just return the inner function for easier testing
vi.mock('@/lib/security/api-guard', () => ({
    withApiGuard: vi.fn((handler) => handler),
}));

vi.mock('@/lib/payment-gatekeeper', () => ({
    gatekeepPayment: vi.fn(),
}));

import { gatekeepPayment } from '@/lib/payment-gatekeeper';

describe('createToolHandler', () => {
    const schema = z.object({ foo: z.string() });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a handler that calls the business logic', async () => {
        const mockHandler = vi.fn().mockResolvedValue({ result: 'ok' });
        const handler = createToolHandler({
            schema,
            handler: mockHandler,
        });

        const req = new NextRequest('http://localhost');
        const response = await handler(req, { foo: 'bar' });
        const json = await response.json();

        expect(mockHandler).toHaveBeenCalledWith({ foo: 'bar' }, expect.objectContaining({
            payment: { success: true, method: 'free' }
        }));
        expect(json.success).toBe(true);
        expect(json.data.result).toBe('ok');
    });

    it('should handle payment gatekeeping', async () => {
        (gatekeepPayment as any).mockResolvedValue({ success: true, method: 'solana_x402' });

        const mockHandler = vi.fn().mockResolvedValue({ result: 'paid-ok' });
        const handler = createToolHandler({
            schema,
            pricing: { price: 0.1, currency: 'SOL' },
            handler: mockHandler,
        });

        const req = new NextRequest('http://localhost');
        const response = await handler(req, { foo: 'bar', signature: 'sig' });
        const json = await response.json();

        expect(gatekeepPayment).toHaveBeenCalled();
        expect(mockHandler).toHaveBeenCalledWith({ foo: 'bar', signature: 'sig' }, expect.objectContaining({
            payment: expect.objectContaining({ method: 'solana_x402' })
        }));
        expect(json.success).toBe(true);
    });

    it('should return error if payment fails', async () => {
        (gatekeepPayment as any).mockResolvedValue({ success: false, error: 'Payment required', status: 402 });

        const handler = createToolHandler({
            schema,
            pricing: { price: 0.1, currency: 'SOL' },
            handler: vi.fn(),
        });

        const req = new NextRequest('http://localhost');
        const response = await handler(req, { foo: 'bar' });
        const json = await response.json();

        expect(response.status).toBe(402);
        expect(json.error).toBe('Payment required');
    });
});
