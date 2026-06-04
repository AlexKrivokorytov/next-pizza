import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

declare global {
  // Preserve the singleton in Next.js hot-reload development mode
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

/**
 * Returns a singleton Redis client. Creates a new connection on first call.
 * In development, re-uses the global instance across hot-reloads.
 *
 * @returns Redis client instance.
 */
function createRedisClient(): Redis {
  const client = new Redis(REDIS_URL, {
    lazyConnect: false,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
  });

  client.on('error', (err) => {
    console.error('[Redis] Connection error:', err);
  });

  client.on('connect', () => {
    console.log('[Redis] Connected successfully');
  });

  return client;
}

export const redis: Redis =
  process.env.NODE_ENV === 'production'
    ? createRedisClient()
    : (global.__redis ??= createRedisClient());
