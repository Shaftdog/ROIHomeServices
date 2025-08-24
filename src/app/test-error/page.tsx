"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestErrorPage() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("This is a test error for demonstrating the error boundary");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Error Boundary Test</h1>
      <p className="mb-4">Click the button below to trigger an error and test the error boundary:</p>
      <Button onClick={() => setShouldError(true)} variant="destructive">
        Trigger Error
      </Button>
    </div>
  );
}
