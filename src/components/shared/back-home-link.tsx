"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackHomeLinkProps {
  variant?: "button" | "link";
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function BackHomeLink({ 
  variant = "button", 
  showIcon = true, 
  className,
  children = "Back to Home"
}: BackHomeLinkProps) {
  if (variant === "link") {
    return (
      <Link 
        href="/" 
        className={cn(
          "inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1",
          className
        )}
      >
        {showIcon && <ArrowLeft className="h-4 w-4" />}
        {children}
      </Link>
    );
  }

  return (
    <Button asChild variant="default" className={className}>
      <Link href="/">
        {showIcon && <Home className="h-4 w-4" />}
        {children}
      </Link>
    </Button>
  );
}
