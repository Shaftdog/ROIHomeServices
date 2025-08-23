# Structured Logging with Pino

This document describes the structured logging implementation using Pino for comprehensive API monitoring and debugging.

## Overview

We use Pino for high-performance structured logging with:
- **PII Redaction**: Automatic removal of sensitive data
- **Request Correlation**: Unique request IDs for tracing
- **Vercel Optimization**: JSON logs for production, structured logs for development
- **Error Tracking**: Comprehensive error logging with stack traces

## Features

### ✅ **PII Protection**
Automatically redacts sensitive fields:
- `email`, `phone`, `fullName`, `firstName`, `lastName`, `address`
- `password`, `token`, `ssn`, `cardNumber`, `cvv`
- `authorization`, `cookie` headers
- Custom fields via `LOG_REDACT_EXTRA`

### ✅ **Request Correlation**
Every API request gets a unique `requestId` for tracing:
- Generated automatically or from `x-request-id` header
- Added to all log entries and response headers
- Enables end-to-end request tracing

### ✅ **Structured Events**
Predefined event types for business logic:
- `form_submit` - Form submissions
- `booking_request` - Booking requests
- `booking_confirm` - Booking confirmations
- `quote_request` - Quote calculations
- `payment_attempt` - Payment processing

## Configuration

### Environment Variables

```env
# Log level (trace, debug, info, warn, error, fatal)
LOG_LEVEL=info

# Additional fields to redact (comma-separated)
LOG_REDACT_EXTRA=body.customField,headers.x-api-key
```

### Log Levels

- **TRACE (10)**: Very detailed debugging
- **DEBUG (20)**: Debugging information
- **INFO (30)**: General information (default)
- **WARN (40)**: Warning conditions
- **ERROR (50)**: Error conditions
- **FATAL (60)**: Fatal errors

## Usage

### Basic Logging

```typescript
import { logger } from '@/lib/logger';

logger.info('User action completed');
logger.warn({ userId: 123 }, 'Rate limit approaching');
logger.error({ err: error }, 'Operation failed');
```

### Request Logging (Automatic)

API routes are automatically wrapped with logging:

```typescript
// App Router
export const POST = withRouteLogging(async (request: NextRequest) => {
  // Your handler logic
  return NextResponse.json({ success: true });
});

// Pages API
export default withApiRouteLogging(async (req, res) => {
  // Your handler logic
  res.json({ success: true });
});
```

### Event Logging

```typescript
import { logEvent, createChildLogger } from '@/lib/log-helpers';

const logger = createChildLogger({ context: 'booking' });

logEvent(logger, 'booking_request', {
  serviceType: 'appraisal',
  email: 'user@example.com', // Will be redacted
  zip: '32789'
}, requestId);
```

## Log Structure

### Request Logs

```json
{
  "level": 30,
  "time": "2024-01-15T10:30:00.000Z",
  "pid": 1234,
  "hostname": "us-east-1",
  "service": "roi-home-services",
  "event": "request:start",
  "method": "POST",
  "path": "/api/booking",
  "requestId": "req_abc123",
  "ipMasked": "192.168.1.0",
  "ua": "Mozilla/5.0...",
  "msg": "POST /api/booking - Request started"
}
```

### Event Logs

```json
{
  "level": 30,
  "time": "2024-01-15T10:30:01.000Z",
  "service": "roi-home-services",
  "event": "booking_request",
  "requestId": "req_abc123",
  "data": {
    "serviceType": "appraisal",
    "email": "[REDACTED]",
    "zip": "32789"
  },
  "msg": "Event: booking_request"
}
```

## Vercel Logs Integration

### Querying Logs

In Vercel dashboard, use these filters:

```bash
# Find specific request
requestId:"req_abc123"

# Find booking events
event:"booking_request"

# Find errors
level:50

# Find slow requests
durationMs:>5000

# Find specific user actions (by IP)
ipMasked:"192.168.1.0"
```

## Sample Log Output

When testing the booking API, you'll see logs like this:

**Development/Production (JSON):**
```json
{"level":30,"time":"2024-01-15T10:30:00.123Z","service":"roi-home-services","event":"request:start","method":"POST","path":"/api/booking","requestId":"e336f237-8be5-4b5f-bc01-fc9cd903a6ac","ipMasked":"127.0.0.0","msg":"POST /api/booking - Request started"}
{"level":30,"time":"2024-01-15T10:30:00.456Z","service":"roi-home-services","event":"booking_request","requestId":"e336f237-8be5-4b5f-bc01-fc9cd903a6ac","data":{"serviceType":"appraisal","email":"[REDACTED]","phone":"[REDACTED]","zip":"32789"},"msg":"Event: booking_request"}
{"level":30,"time":"2024-01-15T10:30:00.789Z","service":"roi-home-services","event":"request:end","method":"POST","path":"/api/booking","status":200,"durationMs":666,"requestId":"e336f237-8be5-4b5f-bc01-fc9cd903a6ac","msg":"POST /api/booking - 200 (666ms)"}
```

## API Endpoints

The following API endpoints are implemented with logging:

### POST /api/booking
- **Purpose**: Handle booking requests
- **Events**: `booking_request`, `booking_confirm`
- **PII Redacted**: email, phone
- **Response**: `{ success: true, bookingId: "uuid", requestId: "uuid" }`

### POST /api/contact
- **Purpose**: Handle contact form submissions
- **Events**: `form_submit`
- **PII Redacted**: name, email, phone
- **Response**: `{ success: true, message: "...", requestId: "uuid" }`

### POST /api/quote
- **Purpose**: Calculate service quotes
- **Events**: `quote_request`
- **PII Redacted**: email (if provided)
- **Response**: `{ success: true, quoteId: "uuid", estimatedPrice: 595, requestId: "uuid" }`

## Testing

Test the logging system with these curl commands:

```bash
# Test booking API
curl -X POST http://localhost:9002/api/booking \
  -H 'Content-Type: application/json' \
  -d '{
    "serviceType": "appraisal",
    "preferredDate": "2025-09-01",
    "zip": "32789",
    "email": "test@example.com",
    "phone": "555-555-1234"
  }'

# Test contact API
curl -X POST http://localhost:9002/api/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Test Subject",
    "message": "This is a test message."
  }'
```

## Security & Privacy

- **PII Redaction**: All sensitive data is automatically redacted
- **IP Anonymization**: Last octet of IP addresses is zeroed
- **Request IDs**: UUIDs prevent enumeration attacks
- **No Credentials**: Authentication tokens and passwords are never logged
- **Configurable**: Additional fields can be redacted via environment variables

## Performance

Pino is designed for high performance:
- Asynchronous logging
- Minimal CPU overhead
- Structured JSON output
- Built-in serializers

Typical overhead: <5% CPU impact

## Production Deployment

For production on Vercel:
1. Logs are automatically collected and available in Vercel dashboard
2. Use JSON format for optimal parsing and filtering
3. Set appropriate log levels to control volume
4. Monitor log retention limits based on your Vercel plan

## Troubleshooting

### Common Issues

**Logs not appearing:**
- Check log level configuration
- Verify API routes are wrapped with logging functions
- Ensure middleware is properly configured

**PII not redacted:**
- Verify field names match redaction patterns
- Add custom fields to `LOG_REDACT_EXTRA`
- Check case sensitivity of field names

**Missing request IDs:**
- Ensure middleware is configured for `/api/*` routes
- Check that API routes use the logging wrappers
- Verify header propagation in request chain
