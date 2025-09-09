"use client";

import React from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void; errorId: string }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = crypto.randomUUID();
    
    // Log error to our logging system
    logger.error({
      err: error,
      errorId,
      component: 'ErrorBoundary',
      stack: error.stack,
    }, `Unhandled error caught by ErrorBoundary: ${error.message}`);

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Additional error logging with React context
    logger.error({
      err: error,
      errorId: this.state.errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    }, 'Error boundary caught error with component stack');
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorId) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error} 
            reset={this.handleReset}
            errorId={this.state.errorId}
          />
        );
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p>
                  We encountered an unexpected error. This has been automatically reported 
                  to our team for investigation.
                </p>
                <p className="text-sm text-muted-foreground">
                  Error ID: <code className="bg-muted px-1 py-0.5 rounded">{this.state.errorId}</code>
                </p>
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={this.handleReset}
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()}
                    size="sm"
                  >
                    Reload Page
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    const errorId = crypto.randomUUID();
    
    logger.error({
      err: error,
      errorId,
      ...errorInfo,
    }, `Handled error: ${error.message}`);
    
    return errorId;
  };
}

// Default fallback component for booking-specific errors
export function BookingErrorFallback({ 
  error, 
  reset, 
  errorId 
}: { 
  error: Error; 
  reset: () => void; 
  errorId: string; 
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Booking System Error</AlertTitle>
        <AlertDescription className="mt-2 space-y-3">
          <p>
            We're experiencing a temporary issue with our booking system. 
            Your payment information is safe and has not been processed.
          </p>
          <p className="text-sm">
            Error ID: <code className="bg-muted px-1 py-0.5 rounded">{errorId}</code>
          </p>
          <div className="flex gap-2 mt-4">
            <Button onClick={reset} size="sm" variant="outline">
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/contact'}
              size="sm"
            >
              Contact Support
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            If this problem persists, please call us at (407) 340-2202 or email admin@roiappraise.com
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
