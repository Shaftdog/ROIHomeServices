import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { logger, createChildLogger, type Logger, LOG_CONTEXTS } from './logger';

// Anonymize IP address for privacy
export function anonymizeIp(ip: string): string {
  if (!ip || ip === 'unknown') {
    return 'unknown';
  }
  
  // Handle IPv4
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }
  
  // Handle IPv6 - keep first 4 segments, zero the rest
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      return `${parts.slice(0, 4).join(':')}::0`;
    }
  }
  
  return 'anonymized';
}

// Extract client IP from request
export function getClientIp(req: NextRequest | NextApiRequest): string {
  // Try various headers in order of preference
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'x-vercel-forwarded-for',
    'cf-connecting-ip',
    'x-client-ip',
  ];
  
  for (const header of headers) {
    let value: string | string[] | undefined;
    
    if ('get' in req.headers && typeof req.headers.get === 'function') {
      // NextRequest headers
      value = req.headers.get(header) || undefined;
    } else {
      // NextApiRequest headers
      value = (req.headers as any)[header];
    }
      
    if (value) {
      // x-forwarded-for can be a comma-separated list
      const ip = Array.isArray(value) ? value[0] : value.split(',')[0];
      return ip.trim();
    }
  }
  
  return 'unknown';
}

// Get or generate request ID
export function getRequestId(req: NextRequest | NextApiRequest): string {
  let existingId: string | string[] | undefined;
  
  if ('get' in req.headers && typeof req.headers.get === 'function') {
    // NextRequest headers
    existingId = req.headers.get('x-request-id') || undefined;
  } else {
    // NextApiRequest headers
    existingId = (req.headers as any)['x-request-id'];
  }
    
  if (existingId) {
    return Array.isArray(existingId) ? existingId[0] : existingId;
  }
  
  return crypto.randomUUID();
}

// Get user agent safely
export function getUserAgent(req: NextRequest | NextApiRequest): string {
  let ua: string | string[] | undefined;
  
  if ('get' in req.headers && typeof req.headers.get === 'function') {
    // NextRequest headers
    ua = req.headers.get('user-agent') || undefined;
  } else {
    // NextApiRequest headers
    ua = (req.headers as any)['user-agent'];
  }
    
  return (Array.isArray(ua) ? ua[0] : ua) || 'unknown';
}

// Deep sanitize data using the same redaction rules as logger
export function sanitizeData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const sensitiveKeys = [
    'email', 'phone', 'fullName', 'firstName', 'lastName', 'address',
    'password', 'token', 'ssn', 'cardNumber', 'cvv', 'clientSecret',
    'paymentMethodId', 'stripeToken', 'authorization', 'cookie',
  ];
  
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  
  for (const key in sanitized) {
    if (sensitiveKeys.some(sensitive => 
      key.toLowerCase().includes(sensitive.toLowerCase())
    )) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  
  return sanitized;
}

// Log structured events (form submissions, bookings, etc.)
export function logEvent(
  eventLogger: Logger,
  eventType: 'form_submit' | 'booking_request' | 'booking_confirm' | 'payment_attempt' | 'payment_success' | 'payment_failure' | 'consent_update' | 'quote_request',
  data: Record<string, any>,
  requestId?: string
) {
  const sanitizedData = sanitizeData(data);
  
  eventLogger.info({
    event: eventType,
    requestId,
    data: sanitizedData,
    timestamp: new Date().toISOString(),
  }, `Event: ${eventType}`);
}

// App Router logging wrapper
export function withRouteLogging<T extends any[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    const request = args[0] as NextRequest;
    const startTime = Date.now();
    
    // Extract request information
    const method = request.method;
    const url = new URL(request.url);
    const path = url.pathname;
    const requestId = getRequestId(request);
    const clientIp = getClientIp(request);
    const ipMasked = anonymizeIp(clientIp);
    const userAgent = getUserAgent(request);
    
    // Create request-scoped logger
    const requestLogger = createChildLogger({
      requestId,
      method,
      path,
      context: LOG_CONTEXTS.API,
    });
    
    // Log request start
    requestLogger.info({
      event: 'request:start',
      method,
      path,
      requestId,
      ipMasked,
      ua: userAgent,
      query: Object.fromEntries(url.searchParams),
    }, `${method} ${path} - Request started`);
    
    try {
      // Execute the handler
      const response = await handler(...args);
      const durationMs = Date.now() - startTime;
      const status = response.status;
      
      // Add request ID to response headers
      response.headers.set('x-request-id', requestId);
      
      // Log successful response
      requestLogger.info({
        event: 'request:end',
        method,
        path,
        status,
        durationMs,
        requestId,
        ipMasked,
      }, `${method} ${path} - ${status} (${durationMs}ms)`);
      
      return response;
      
    } catch (error) {
      const durationMs = Date.now() - startTime;
      
      // Log error
      requestLogger.error({
        event: 'request:error',
        method,
        path,
        durationMs,
        requestId,
        ipMasked,
        err: error,
        stack: error instanceof Error ? error.stack : undefined,
      }, `${method} ${path} - Error (${durationMs}ms): ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Re-throw the error
      throw error;
    }
  };
}

// Pages API logging wrapper
export function withApiRouteLogging(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const startTime = Date.now();
    
    // Extract request information
    const method = req.method || 'UNKNOWN';
    const path = req.url || 'unknown';
    const requestId = getRequestId(req);
    const clientIp = getClientIp(req);
    const ipMasked = anonymizeIp(clientIp);
    const userAgent = getUserAgent(req);
    
    // Create request-scoped logger
    const requestLogger = createChildLogger({
      requestId,
      method,
      path,
      context: LOG_CONTEXTS.API,
    });
    
    // Add request ID to response headers
    res.setHeader('x-request-id', requestId);
    
    // Log request start
    requestLogger.info({
      event: 'request:start',
      method,
      path,
      requestId,
      ipMasked,
      ua: userAgent,
      query: req.query,
    }, `${method} ${path} - Request started`);
    
    // Wrap res.end to capture response
    const originalEnd = res.end;
    let responseLogged = false;
    
    res.end = function(chunk?: any, encoding?: any) {
      if (!responseLogged) {
        const durationMs = Date.now() - startTime;
        const status = res.statusCode;
        
        requestLogger.info({
          event: 'request:end',
          method,
          path,
          status,
          durationMs,
          requestId,
          ipMasked,
        }, `${method} ${path} - ${status} (${durationMs}ms)`);
        
        responseLogged = true;
      }
      
      return originalEnd.call(this, chunk, encoding);
    };
    
    try {
      // Execute the handler
      await handler(req, res);
      
    } catch (error) {
      const durationMs = Date.now() - startTime;
      
      // Log error
      requestLogger.error({
        event: 'request:error',
        method,
        path,
        durationMs,
        requestId,
        ipMasked,
        err: error,
        stack: error instanceof Error ? error.stack : undefined,
      }, `${method} ${path} - Error (${durationMs}ms): ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Send error response if not already sent
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Internal Server Error',
          requestId,
        });
      }
    }
  };
}

// Middleware for request correlation
export function requestCorrelationMiddleware(request: NextRequest) {
  const requestId = getRequestId(request);
  
  // Add request ID to headers for downstream handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
