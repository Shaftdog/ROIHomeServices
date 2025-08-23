import pino from 'pino';

// Base redaction paths for PII protection
const baseRedactPaths = [
  'req.headers.cookie',
  'req.headers.authorization',
  'headers.cookie',
  'headers.authorization',
  'body.email',
  'body.phone',
  'body.fullName',
  'body.firstName',
  'body.lastName',
  'body.address',
  'body.password',
  'body.token',
  'body.ssn',
  'body.cardNumber',
  'body.cvv',
  'body.clientSecret',
  'body.paymentMethodId',
  'body.stripeToken',
];

// Add extra redaction paths from environment
const extraRedactPaths = process.env.LOG_REDACT_EXTRA
  ? process.env.LOG_REDACT_EXTRA.split(',').map(path => path.trim())
  : [];

const allRedactPaths = [...baseRedactPaths, ...extraRedactPaths];

// Create logger configuration
const loggerConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  
  // Redact sensitive information
  redact: {
    paths: allRedactPaths,
    censor: '[REDACTED]',
  },
  
  // Base fields for all logs
  base: {
    pid: process.pid,
    hostname: process.env.VERCEL_REGION || 'local',
    env: process.env.NODE_ENV || 'development',
    service: 'roi-home-services',
    version: process.env.VERCEL_GIT_COMMIT_SHA || 'dev',
  },
  
  // Timestamp configuration
  timestamp: pino.stdTimeFunctions.isoTime,
  
  // Pretty formatting for development (disabled for Turbopack compatibility)
  // transport: process.env.NODE_ENV === 'development' ? {
  //   target: 'pino-pretty',
  //   options: {
  //     colorize: true,
  //     translateTime: 'SYS:standard',
  //     ignore: 'pid,hostname',
  //     singleLine: false,
  //     hideObject: false,
  //   },
  // } : undefined,
  
  // Serializers for common objects
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
};

// Create singleton logger instance
export const logger = pino(loggerConfig);

// Export logger types for TypeScript
export type Logger = typeof logger;

// Helper function to create child loggers with context
export function createChildLogger(context: Record<string, any>) {
  return logger.child(context);
}

// Log levels for easy reference
export const LOG_LEVELS = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
} as const;

// Common log contexts
export const LOG_CONTEXTS = {
  API: 'api',
  AUTH: 'auth',
  DATABASE: 'database',
  PAYMENT: 'payment',
  EMAIL: 'email',
  BOOKING: 'booking',
  FORM: 'form',
  CONSENT: 'consent',
  RATE_LIMIT: 'rate_limit',
} as const;

export type LogContext = typeof LOG_CONTEXTS[keyof typeof LOG_CONTEXTS];
