import { describe, it, expect, vi } from 'vitest';
import { withApiGuard } from './api-guard';
import { NextRequest, NextResponse } from 'next/server';

describe('withApiGuard Vulnerability Reproduction', () => {
    it('should allow malicious origin that includes the host string (VULNERABILITY)', async () => {
        // Setup
        const handler = vi.fn(async () => NextResponse.json({ success: true }));
        const guardedHandler = withApiGuard(handler, { requireOrigin: true });

        const host = 'aifais.com';
        const maliciousOrigin = 'https://evil-aifais.com'; // Includes 'aifais.com'

        const req = new NextRequest('https://aifais.com/api/test', {
            headers: {
                'host': host,
                'origin': maliciousOrigin
            }
        });

        // Act
        const response = await guardedHandler(req);

        // Assert
        // FIXED BEHAVIOR: It should BLOCK the request because 'evil-aifais.com' is not exactly 'aifais.com'.
        // We expect this to return 403.

        expect(response.status).toBe(403);
        expect(handler).not.toHaveBeenCalled();
    });

    it('should allow legitimate origin', async () => {
         // Setup
         const handler = vi.fn(async () => NextResponse.json({ success: true }));
         const guardedHandler = withApiGuard(handler, { requireOrigin: true });

         const host = 'aifais.com';
         const safeOrigin = 'https://aifais.com';

         const req = new NextRequest('https://aifais.com/api/test', {
             headers: {
                 'host': host,
                 'origin': safeOrigin
             }
         });

         // Act
         const response = await guardedHandler(req);

         // Assert
         expect(response.status).toBe(200);
         expect(handler).toHaveBeenCalled();
    });
});
