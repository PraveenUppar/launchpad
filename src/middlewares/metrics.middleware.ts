import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs.toFixed(
        2,
      )}ms`,
    );
  });

  next();
};
