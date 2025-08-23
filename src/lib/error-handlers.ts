import { logger } from './logger';

// Global unhandled rejection handler
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error({
      event: 'unhandled_rejection',
      reason,
      promise: promise.toString(),
      stack: reason instanceof Error ? reason.stack : undefined,
    }, 'Unhandled Promise Rejection');
    
    // Don't exit on Vercel - let the platform handle it
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    }
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.fatal({
      event: 'uncaught_exception',
      err: error,
      stack: error.stack,
    }, 'Uncaught Exception');
    
    // Don't exit on Vercel - let the platform handle it
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    }
  });

  // Handle process warnings
  process.on('warning', (warning) => {
    logger.warn({
      event: 'process_warning',
      name: warning.name,
      message: warning.message,
      stack: warning.stack,
    }, `Process Warning: ${warning.name}`);
  });

  logger.info({
    event: 'error_handlers_initialized',
    pid: process.pid,
    nodeVersion: process.version,
  }, 'Global error handlers initialized');
}
