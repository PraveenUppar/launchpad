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
    url: 'https://settled-ghost-32735.upstash.io',
    token: 'AX_fAAIncDJhYWI2YTM3NTBkOTk0YzcxODRkNTFmNmFjNjE2MDI2OHAyMzI3MzU',
  });
}

export default redis;
