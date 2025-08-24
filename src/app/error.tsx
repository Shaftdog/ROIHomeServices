"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackHomeLink } from "@/components/shared/back-home-link";
import { AlertTriangle, RefreshCw, Phone, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for debugging (no PII)
    console.error("Application error:", {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Something went wrong
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-2">
            We&apos;re sorry, but something unexpected happened. 
            This error has been logged and we&apos;ll look into it.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-muted rounded-lg text-left text-sm">
              <summary className="cursor-pointer font-medium text-foreground mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="whitespace-pre-wrap text-muted-foreground overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={reset}
              variant="default"
              className="min-w-[140px]"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <BackHomeLink />
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">What you can do:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/offerings">
                <Home className="h-5 w-5" />
                <span className="font-medium">Browse Services</span>
                <span className="text-sm text-muted-foreground">
                  Explore our offerings
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/contact">
                <Phone className="h-5 w-5" />
                <span className="font-medium">Contact Support</span>
                <span className="text-sm text-muted-foreground">
                  We&apos;re here to help
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            If this problem persists, please{" "}
            <Link 
              href="/contact" 
              className="text-accent hover:text-accent/80 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              contact our support team
            </Link>{" "}
            and mention error ID: {error.digest || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
