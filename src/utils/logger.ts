import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Colorize only in development
    process.env.NODE_ENV === 'development'
      ? winston.format.colorize({ all: true })
      : winston.format.uncolorize(),

    // Custom print format
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
    // In production, save errors to a file
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

export default logger;

// You write logs to files:
// new winston.transports.File({ filename: 'logs/error.log' })

// Inside Docker:
// Containers are ephemeral
// Files disappear
// Kubernetes ignores them

// Why:

// Docker captures stdout
// Kubernetes reads container logs
// This is how production works
