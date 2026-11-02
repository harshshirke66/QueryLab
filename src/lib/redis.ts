import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isConfigured = Boolean(redisUrl && redisToken && !redisUrl.includes('sample'));

export const upstashRedis = isConfigured
  ? new Redis({
      url: redisUrl!,
      token: redisToken!,
    })
  : null;

// In-memory fallback cache
class MemoryCache {
  private store = new Map<string, { value: any; expiresAt?: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set(key: string, value: any, options?: { ex?: number }): Promise<'OK'> {
    const expiresAt = options?.ex ? Date.now() + options.ex * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const deleted = this.store.delete(key);
    return deleted ? 1 : 0;
  }
}

const memoryCache = new MemoryCache();

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (upstashRedis) {
      try {
        return await upstashRedis.get<T>(key);
      } catch (err) {
        console.warn('Upstash Redis get error, using fallback:', err);
      }
    }
    return await memoryCache.get<T>(key);
  },

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    if (upstashRedis) {
      try {
        await upstashRedis.set(key, value, { ex: ttlSeconds });
        return;
      } catch (err) {
        console.warn('Upstash Redis set error, using fallback:', err);
      }
    }
    await memoryCache.set(key, value, { ex: ttlSeconds });
  },

  async checkRateLimit(identifier: string, maxRequests: number = 20, windowSeconds: number = 60): Promise<{
    allowed: boolean;
    remaining: number;
  }> {
    const key = `ratelimit:${identifier}`;
    const current = (await this.get<number>(key)) || 0;
    if (current >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }
    await this.set(key, current + 1, windowSeconds);
    return { allowed: true, remaining: maxRequests - (current + 1) };
  },
};

