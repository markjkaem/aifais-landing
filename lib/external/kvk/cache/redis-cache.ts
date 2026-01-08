/**
 * Redis Cache Layer for KVK Data
 *
 * Provides caching with automatic TTL management and rate limiting.
 */

import { redis } from "@/lib/redis";
import { CacheTTL, getTTLForKey } from "./cache-keys";
import type { CachedData, RateLimitConfig, RateLimitStatus } from "../types";

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    if (!redis) return false;
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get cached data with metadata
 */
export async function getCached<T>(key: string): Promise<CachedData<T> | null> {
  try {
    if (!redis) return null;

    const cached = await redis.get(key);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as CachedData<T>;

    // Check if expired (belt and suspenders with Redis TTL)
    if (new Date(parsed.expiresAt) < new Date()) {
      await redis.del(key);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(`[KVK Cache] Error reading key ${key}:`, error);
    return null;
  }
}

/**
 * Set cached data with automatic TTL
 */
export async function setCache<T>(
  key: string,
  data: T,
  ttl?: number,
  source: string = "unknown"
): Promise<boolean> {
  try {
    if (!redis) return false;

    const effectiveTTL = ttl ?? getTTLForKey(key);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + effectiveTTL * 1000);

    const cacheData: CachedData<T> = {
      data,
      cachedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      source,
    };

    await redis.setex(key, effectiveTTL, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error(`[KVK Cache] Error writing key ${key}:`, error);
    return false;
  }
}

/**
 * Delete cached data
 */
export async function deleteCache(key: string): Promise<boolean> {
  try {
    if (!redis) return false;
    await redis.del(key);
    return true;
  } catch (error) {
    console.error(`[KVK Cache] Error deleting key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple cached entries by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  try {
    if (!redis) return 0;

    const keys = await redis.keys(pattern);
    if (keys.length === 0) return 0;

    await redis.del(...keys);
    return keys.length;
  } catch (error) {
    console.error(`[KVK Cache] Error deleting pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Get or fetch data with caching
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number,
  source: string = "unknown"
): Promise<{ data: T; fromCache: boolean; cachedAt?: string }> {
  // Try cache first
  const cached = await getCached<T>(key);
  if (cached) {
    return {
      data: cached.data,
      fromCache: true,
      cachedAt: cached.cachedAt,
    };
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache (fire and forget)
  setCache(key, data, ttl, source).catch(() => {
    // Ignore cache write errors
  });

  return { data, fromCache: false };
}

/**
 * Check rate limit for a source using sliding window
 */
export async function checkRateLimit(
  source: string,
  config: RateLimitConfig
): Promise<RateLimitStatus> {
  const key = `kvk:ratelimit:${source}`;
  const now = Date.now();

  try {
    if (!redis) {
      // If no Redis, allow but warn
      console.warn(`[KVK Cache] Redis unavailable, rate limiting disabled for ${source}`);
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: now + config.windowMs,
        windowMs: config.windowMs,
      };
    }

    // Remove old entries outside the window
    await redis.zremrangebyscore(key, 0, now - config.windowMs);

    // Count current requests in window
    const count = await redis.zcard(key);

    if (count >= config.maxRequests) {
      // Rate limited - find when the oldest entry expires
      const oldestEntries = await redis.zrange(key, 0, 0, "WITHSCORES");
      const oldestTimestamp = oldestEntries.length >= 2 ? parseInt(oldestEntries[1]) : now;
      const resetAt = oldestTimestamp + config.windowMs;

      return {
        allowed: false,
        remaining: 0,
        resetAt,
        windowMs: config.windowMs,
      };
    }

    // Add this request to the window
    const requestId = `${now}-${Math.random().toString(36).slice(2, 8)}`;
    await redis.zadd(key, now, requestId);

    // Set expiry on the sorted set
    await redis.expire(key, Math.ceil(config.windowMs / 1000) + 60);

    return {
      allowed: true,
      remaining: config.maxRequests - count - 1,
      resetAt: now + config.windowMs,
      windowMs: config.windowMs,
    };
  } catch (error) {
    console.error(`[KVK Cache] Rate limit check failed for ${source}:`, error);
    // On error, allow but log
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: now + config.windowMs,
      windowMs: config.windowMs,
    };
  }
}

/**
 * Wait for rate limit to reset (for retry logic)
 */
export async function waitForRateLimit(status: RateLimitStatus): Promise<void> {
  if (status.allowed) return;

  const waitTime = Math.max(0, status.resetAt - Date.now());
  if (waitTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }
}

/**
 * Cache negative results (not found) to prevent repeated lookups
 */
export async function cacheNotFound(key: string, source: string): Promise<void> {
  await setCache(key, { notFound: true, source }, CacheTTL.NOT_FOUND, source);
}

/**
 * Check if a key is cached as not found
 */
export async function isNotFoundCached(key: string): Promise<boolean> {
  const cached = await getCached<{ notFound?: boolean }>(key);
  return cached?.data?.notFound === true;
}

/**
 * Get cache stats for monitoring
 */
export async function getCacheStats(): Promise<{
  available: boolean;
  keyCount: number;
  memoryUsage: string;
}> {
  try {
    if (!redis) {
      return { available: false, keyCount: 0, memoryUsage: "N/A" };
    }

    const keys = await redis.keys("kvk:*");
    const info = await redis.info("memory");
    const memoryMatch = info.match(/used_memory_human:(\S+)/);

    return {
      available: true,
      keyCount: keys.length,
      memoryUsage: memoryMatch ? memoryMatch[1] : "unknown",
    };
  } catch {
    return { available: false, keyCount: 0, memoryUsage: "N/A" };
  }
}
