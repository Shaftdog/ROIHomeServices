'use client';

import { useEffect, useId, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { pushEvent } from '@/lib/gtm';
import { freeScreenUrl } from '@/lib/appraisal-intelligence';
import {
  FLORIDA_ONLY_NOTICE,
  NON_FLORIDA_MESSAGE,
  US_STATES,
  isFloridaOnlySku,
} from '@/lib/blueprint-florida';

interface BlueprintBuyButtonProps {
  /** The ONLY thing sent to the server. Price is resolved server-side from the SKU. */
  sku: string;
  /** Plan selector for subscription SKUs — the server only honors it when the
   *  catalog marks the SKU as a subscription, and resolves the price itself. */
  interval?: 'month' | 'year';
  label: string;
  /** Where on the page this button sits; sent on the GTM click event so hero/tile/package buys can be told apart. */
  placement?: 'hero' | 'tile' | 'package' | 'detail';
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
  /** Extra classes for the inner Button (e.g. text size). */
  buttonClassName?: string;
  /** Error text color; defaults to the destructive token. */
  errorClassName?: string;
  /** Color for the Florida note and state label; defaults to the muted token. */
  noteClassName?: string;
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
  placement,
  variant = 'default',
  size = 'default',
  className = '',
  buttonClassName = '',
  errorClassName = 'text-destructive',
  noteClassName = 'text-muted-foreground',
}: BlueprintBuyButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const floridaOnly = isFloridaOnlySku(sku);
  const [propertyState, setPropertyState] = useState('');
  const stateId = useId();
  const nonFlorida = floridaOnly && propertyState !== '' && propertyState !== 'FL';

  // Back from Stripe can restore this page from the bfcache with the button still
  // disabled; reset it when the page is restored.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsSubmitting(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  async function startCheckout() {
    if (floridaOnly && propertyState !== 'FL') {
      setError(
        propertyState === ''
          ? 'Choose the state the property is in before checking out.'
          : NON_FLORIDA_MESSAGE
      );
      return;
    }
    pushEvent('blueprint_buy_click', {
      sku,
      placement: placement ?? 'unknown',
      interval: interval ?? 'one-time',
      ...(floridaOnly ? { property_state: propertyState } : {}),
    });
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/blueprint/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku,
          ...(interval ? { interval } : {}),
          ...(floridaOnly ? { propertyState } : {}),
        }),
      });

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string; code?: string } | null;

      if (!res.ok || !data?.url) {
        setError(
          data?.error === 'Pricing is temporarily unavailable'
            ? 'Pricing is temporarily unavailable. Please try again shortly.'
            : data?.code && data.error
              ? data.error
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
      {floridaOnly && (
        <div className="mb-3">
          <p className={`text-xs font-semibold uppercase tracking-wide ${noteClassName}`}>
            {FLORIDA_ONLY_NOTICE}
          </p>
          <label htmlFor={stateId} className={`mt-2 block text-sm ${noteClassName}`}>
            Which state is the property in?
          </label>
          <select
            id={stateId}
            value={propertyState}
            onChange={(e) => {
              setPropertyState(e.target.value);
              setError(null);
            }}
            aria-describedby={nonFlorida ? `${stateId}-msg` : undefined}
            className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="">Select a state</option>
            {US_STATES.map((st) => (
              <option key={st.code} value={st.code}>
                {st.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {nonFlorida ? (
        <div id={`${stateId}-msg`} role="status" className="rounded-md border border-border bg-background p-3 text-foreground">
          <p className="text-sm">{NON_FLORIDA_MESSAGE}</p>
          <Button asChild variant="outline" size={size} className="mt-3 w-full">
            <a href={freeScreenUrl('blueprint-non-florida')}>Screen a deal free</a>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            An automated valuation (AVM), not an appraisal.
          </p>
        </div>
      ) : (
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={startCheckout}
        disabled={isSubmitting}
        className={`w-full ${buttonClassName}`}
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
      )}
      {error && !nonFlorida && (
        <p role="alert" className={`mt-2 text-sm ${errorClassName}`}>
          {error}
        </p>
      )}
    </div>
  );
}
