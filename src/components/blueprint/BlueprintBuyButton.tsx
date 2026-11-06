'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { pushEvent } from '@/lib/gtm';
import { AVM_SHORT_LINE, freeScreenUrl } from '@/lib/appraisal-intelligence';
import {
  FLORIDA_ONLY_NOTICE,
  nonFloridaMessage,
  US_STATES,
  isFloridaOnlySku,
} from '@/lib/blueprint-florida';
import { setPropertyState, usePropertyState } from '@/lib/blueprint-property-state';

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
 * The request body carries the SKU, plus the buyer-stated property state for
 * Florida-only SKUs and the plan interval for subscriptions — never an amount,
 * price, or discount code. The server resolves the charge from the catalog
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
  const propertyState = usePropertyState();
  const stateId = useId();
  const [needsState, setNeedsState] = useState(false);
  // Only the instance whose select the buyer changed announces the refusal, so
  // screen readers hear it once however many Florida-only buttons are on the page.
  const [announcement, setAnnouncement] = useState('');
  const selectRef = useRef<HTMLSelectElement>(null);
  const ownChoice = useRef('');
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

  // The shared state changed (possibly via another button): drop this instance's
  // stale error, "choose a state" prompt and announcement.
  useEffect(() => {
    if (propertyState !== ownChoice.current) setAnnouncement('');
    setError(null);
    setNeedsState(false);
  }, [propertyState]);

  async function startCheckout() {
    if (floridaOnly && propertyState !== 'FL') {
      setNeedsState(true);
      selectRef.current?.focus();
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
            ref={selectRef}
            autoComplete="off"
            value={propertyState}
            onChange={(e) => {
              const next = e.target.value;
              ownChoice.current = next;
              setAnnouncement(next !== '' && next !== 'FL' ? nonFloridaMessage(sku) : '');
              setPropertyState(next);
            }}
            disabled={isSubmitting}
            aria-invalid={needsState && propertyState === '' ? true : undefined}
            aria-describedby={
              needsState && propertyState === '' ? `${stateId}-needs` : undefined
            }
            className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="">Select a state</option>
            {US_STATES.map((st) => (
              <option key={st.code} value={st.code}>
                {st.name}
              </option>
            ))}
          </select>
          {needsState && propertyState === '' && (
            <p id={`${stateId}-needs`} role="alert" className={`mt-2 text-sm ${errorClassName}`}>
              Choose the state the property is in before checking out.
            </p>
          )}
        </div>
      )}
      {/* Mounted only on Florida-only buttons, and filled only on the instance the
          buyer just changed, so the refusal is announced once. */}
      {floridaOnly && (
        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>
      )}
      {nonFlorida && (
        <div className="rounded-md border border-border bg-background p-3 text-foreground">
          <p className="text-sm">{nonFloridaMessage(sku)}</p>
          <Button asChild variant="outline" size={size} className="mt-3 w-full">
            <a href={freeScreenUrl('blueprint-non-florida')}>Screen a deal free</a>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">{AVM_SHORT_LINE}</p>
        </div>
      )}
      {!nonFlorida && (
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
