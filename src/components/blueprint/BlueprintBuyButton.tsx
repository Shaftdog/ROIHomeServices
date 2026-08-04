'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';

interface BlueprintBuyButtonProps {
  /** The ONLY thing sent to the server. Price is resolved server-side from the SKU. */
  sku: string;
  /** Plan selector for subscription SKUs — the server only honors it when the
   *  catalog marks the SKU as a subscription, and resolves the price itself. */
  interval?: 'month' | 'year';
  label: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
}

/**
 * Starts a Stripe Checkout Session for one SKU.
 *
 * The request body carries the SKU and nothing else — no amount, no price, no
 * discount code. The server resolves the charge from the catalog
 * (src/app/api/blueprint/checkout/route.ts), and Stripe Checkout collects the
 * email and validates any promotion code the buyer enters.
 */
export default function BlueprintBuyButton({
  sku,
  interval,
  label,
  variant = 'default',
  size = 'default',
  className = '',
}: BlueprintBuyButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/blueprint/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, ...(interval ? { interval } : {}) }),
      });

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!res.ok || !data?.url) {
        setError(
          data?.error === 'Pricing is temporarily unavailable'
            ? 'Pricing is temporarily unavailable. Please try again shortly.'
            : "We couldn't start checkout. Please try again or book a call."
        );
        setIsSubmitting(false);
        return;
      }

      window.location.assign(data.url);
    } catch {
      setError("We couldn't reach the payment service. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={startCheckout}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Starting checkout&hellip;
          </>
        ) : (
          label
        )}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
