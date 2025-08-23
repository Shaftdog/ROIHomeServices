import { NextRequest, NextResponse } from 'next/server';
import { requestCorrelationMiddleware } from '@/lib/log-helpers';

export function middleware(request: NextRequest) {
  // Add request correlation for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return requestCorrelationMiddleware(request);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
