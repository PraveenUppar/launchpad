"use strict";
// import { Redis } from '@upstash/redis';
// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });
// export default redis;
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("@upstash/redis");
const redis = new redis_1.Redis({
    url: 'https://settled-ghost-32735.upstash.io',
    token: 'AX_fAAIncDJhYWI2YTM3NTBkOTk0YzcxODRkNTFmNmFjNjE2MDI2OHAyMzI3MzU',
});
exports.default = redis;
//# sourceMappingURL=redis.js.map