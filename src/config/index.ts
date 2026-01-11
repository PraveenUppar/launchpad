import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

// Base schema with required fields
const baseSchema = {
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .default('3000')
    .transform((val) => parseInt(val, 10)),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required').optional(),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),

  // OpenTelemetry (optional)
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  OTEL_SERVICE_NAME: z.string().default('todo-backend'),

  // Test environment
  TEST_USER_ID: z.string().optional(),

  // CORS
  CORS_ORIGIN: z.string().default('*'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .default('60000')
    .transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .default('30')
    .transform((val) => parseInt(val, 10)),
};

// Redis - required in production/development, optional in test
const redisSchema = isTest
  ? {
      UPSTASH_REDIS_URL: z.string().url('UPSTASH_REDIS_URL must be a valid URL').optional(),
      UPSTASH_REDIS_TOKEN: z.string().min(1, 'UPSTASH_REDIS_TOKEN is required').optional(),
    }
  : {
      UPSTASH_REDIS_URL: z.string().url('UPSTASH_REDIS_URL must be a valid URL'),
      UPSTASH_REDIS_TOKEN: z.string().min(1, 'UPSTASH_REDIS_TOKEN is required'),
    };

const envSchema = z.object({
  ...baseSchema,
  ...redisSchema,
});

type EnvConfig = z.infer<typeof envSchema>;

let config: EnvConfig;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment variable validation failed:');
    error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      console.error(`  - ${path}: ${issue.message}`);
    });
    // Throw error instead of process.exit to allow Jest to handle it
    throw new Error('Environment variable validation failed');
  }
  throw error;
}

export default {
  env: config.NODE_ENV,
  port: config.PORT,
  isDevelopment: config.NODE_ENV === 'development',
  isProduction: config.NODE_ENV === 'production',
  isTest: config.NODE_ENV === 'test',

  database: {
    url: config.DATABASE_URL,
    directUrl: config.DIRECT_URL || config.DATABASE_URL,
  },

  jwt: {
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRES_IN,
  },

  redis: {
    url: config.UPSTASH_REDIS_URL || 'http://localhost:6379',
    token: config.UPSTASH_REDIS_TOKEN || 'test-token',
  },

  otel: {
    endpoint: config.OTEL_EXPORTER_OTLP_ENDPOINT,
    serviceName: config.OTEL_SERVICE_NAME,
  },

  test: {
    get userId() {
      // In test mode, read from process.env dynamically to allow runtime changes
      return process.env.TEST_USER_ID || config.TEST_USER_ID;
    },
  },

  cors: {
    origin: config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN.split(','),
  },

  rateLimit: {
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    maxRequests: config.RATE_LIMIT_MAX_REQUESTS,
  },
} as const;
