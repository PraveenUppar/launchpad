import { Redis } from '@upstash/redis';

let redis: any;

if (process.env.NODE_ENV === 'test') {
  // Mock Redis for tests
  redis = {
    get: async () => null,
    set: async () => {},
    keys: async () => [],
    del: async () => {},
  };
} else {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export default redis;
