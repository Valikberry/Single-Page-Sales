// In-Memory Cache (Node.js/Edge Runtime)
class InMemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  async readCache<T>(key: string): Promise<{ data: T; timestamp: number } | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    const timeLeft = cached.ttl * 1000 - age;

    if (timeLeft <= 0) {
      this.cache.delete(key);
      return null;
    }

    return { data: cached.data as T, timestamp: cached.timestamp };
  }

  async writeCache<T>(key: string, data: T, ttlSeconds: number = 600): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds
    });
  }

  // Optional: Cleanup expired entries periodically
  startCleanup(intervalMs: number = 60000) {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (now - value.timestamp > value.ttl * 1000) {
          this.cache.delete(key);
        }
      }
    }, intervalMs);
  }
}

const memoryCache = new InMemoryCache();

// Export the same interface as your Upstash implementation
export const readCache = memoryCache.readCache.bind(memoryCache);
export const writeCache = memoryCache.writeCache.bind(memoryCache);

// Optional: Start cleanup on module load
// memoryCache.startCleanup();