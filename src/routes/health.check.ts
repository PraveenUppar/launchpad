import { Router, Request, Response } from 'express';
import { prisma } from '../libs/prisma';
import redis from '../redis/redis';

const router = Router();

/**
 * Health check endpoint for database and Redis
 * Used by Kubernetes liveness and readiness probes
 */
router.get('/database', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection
    const redisPong = await redis.ping();
    const redisStatus = redisPong === 'PONG' ? 'Connected' : 'Disconnected';

    return res.status(200).json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: 'Connected',
        redis: redisStatus,
      },
    });
  } catch (error) {
    return res.status(503).json({
      status: 'unhealthy',
      message: 'Service unavailable',
      timestamp: new Date().toISOString(),
      services: {
        database: 'Disconnected',
        redis: 'Unknown',
      },
    });
  }
});

/**
 * liveness probe
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

/**
 * readiness probe
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
