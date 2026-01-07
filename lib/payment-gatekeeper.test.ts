import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gatekeepPayment } from './payment-gatekeeper';
import { redis } from '@/lib/redis';
import { checkPayment } from '@/utils/x402-guard';
import Stripe from 'stripe';

// Mock dependencies
vi.mock('@/lib/redis', () => ({
    redis: {
        get: vi.fn(),
        set: vi.fn(),
    },
}));

vi.mock('@/utils/x402-guard', () => ({
    checkPayment: vi.fn(),
    markPaymentUsed: vi.fn(),
}));

vi.mock('stripe', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            checkout: {
                sessions: {
                    retrieve: vi.fn(),
                },
            },
        })),
    };
});

describe('gatekeepPayment', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return error if no payment proof is provided', async () => {
        const result = await gatekeepPayment({});
        expect(result.success).toBe(false);
        expect(result.status).toBe(402);
    });

    it('should verify Solana payment if signature is provided', async () => {
        (checkPayment as any).mockResolvedValue({ status: 'success' });

        const result = await gatekeepPayment({ signature: 'fake-sig' });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.method).toBe('solana_x402');
        }
    });

    it('should return error if Solana payment fails', async () => {
        (checkPayment as any).mockResolvedValue({ status: 'error', message: 'Invalid payment', code: 402 });

        const result = await gatekeepPayment({ signature: 'fake-sig' });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe('Invalid payment');
        }
    });
});
