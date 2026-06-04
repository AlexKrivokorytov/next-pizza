import { redis } from './redis';

/**
 * Simple Redis-based fixed-window rate limiter.
 * 
 * @param key The unique key to rate limit (e.g. "rate_limit:login:IP")
 * @param limit Maximum number of requests allowed in the window
 * @param windowSecs Window size in seconds
 * @returns boolean True if allowed, false if rate limited
 */
export async function rateLimit(key: string, limit: number, windowSecs: number): Promise<boolean> {
  // Use NX to atomically create the key with a TTL if it doesn't exist
  await redis.set(key, 0, 'EX', windowSecs, 'NX');
  const current = await redis.incr(key);
  return current <= limit;
}
