import { Request, Response, NextFunction } from 'express';
import { Ratelimit } from '@upstash/ratelimit';

import redis from '../redis/redis';
import AppError from '../utils/AppError';

const limiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, '60 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Skip rate limiting in test environment
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  try {
    const identifier =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const { success, limit, remaining, reset } =
      await limiter.limit(identifier);

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);

    if (!success) {
      return next(
        new AppError('Too many requests, please try again in a minute.', 429),
      );
    }

    next();
  } catch (error) {
    console.error('Rate Limiter Error:', error);
    next();
  }
};
