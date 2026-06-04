import { redis } from './redis';

/**
 * Fetches a value from Redis cache or runs the factory function on cache miss.
 * Automatically serializes/deserializes JSON.
 *
 * @param key - The Redis cache key.
 * @param factory - Async function that produces the value on cache miss.
 * @param ttlSeconds - Time-to-live in seconds. Defaults to 60.
 * @returns The cached or freshly computed value.
 */
export async function withCache<T>(
  key: string,
  factory: () => Promise<T>,
  ttlSeconds = 60,
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    // Redis unavailable — fall through to DB
    console.warn('[Cache] Redis get failed, falling back to DB:', err);
  }

  const value = await factory();

  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    // Silently skip caching if Redis is unavailable
    console.warn('[Cache] Redis set failed:', err);
  }

  return value;
}

/**
 * Invalidates one or more cache keys.
 *
 * @param keys - One or more Redis cache keys to delete.
 */
export async function invalidateCache(...keys: string[]): Promise<void> {
  try {
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.warn('[Cache] Redis invalidation failed:', err);
  }
}
