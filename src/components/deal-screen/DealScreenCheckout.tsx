"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAttributionData,
  sendGTMEvent,
  sendPurchaseEvent,
} from "@/lib/gtag";
import { pushEvent } from "@/lib/gtm";

// Fixed Deal Screen price (in dollars) for conversion-event values.
const DEAL_SCREEN_PRICE = 49;

// Load Stripe once, outside the component, so it isn't recreated on render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface DealScreenDeal {
  address?: string;
  contract?: string;
  arv?: string;
}

interface DealScreenCheckoutProps {
  deal: DealScreenDeal;
  /** Display strings for the order summary (already currency-formatted). */
  display: {
    propertyLabel: string;
    contract: string | null;
    arv: string | null;
  };
}

/** Format raw digits as USD for the inner Stripe form. */
const PRICE_LABEL = "$49";

/**
 * Inner form rendered inside <Elements>. Confirms the $49 PaymentIntent, then
 * hands the paid order off to the capture endpoint.
 */
function CheckoutForm({
  deal,
  customerEmail,
  customerName,
  onSucceeded,
}: {
  deal: DealScreenDeal;
  customerEmail: string;
  customerName: string;
  onSucceeded: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { receipt_email: customerEmail },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Capture the paid order server-side (lead capture + admin notify).
        // We do NOT block the success state on this — the payment is done.
        try {
          await fetch("/api/deal-screen/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              email: customerEmail,
              name: customerName || undefined,
              deal,
            }),
          });
        } catch {
          // Swallowed deliberately: payment succeeded; the webhook + Stripe
          // dashboard remain a backstop if this capture call fails in transit.
        }

        // SAL-39 / SAL-48 — "purchase" funnel event on payment success.
        const attributionData = getAttributionData();
        sendPurchaseEvent({
          transactionId: paymentIntent.id,
          value: DEAL_SCREEN_PRICE,
          currency: "USD",
          items: [
            {
              item_id: "DEAL_SCREEN",
              item_name: "Deal Screen",
              category: "deal_screen",
              quantity: 1,
              price: DEAL_SCREEN_PRICE,
            },
          ],
        });
        sendGTMEvent("deal_screen_purchase", {
          page_type: "deal_screen",
          step_name: "payment_completed",
          transaction_id: paymentIntent.id,
          conversion_value: DEAL_SCREEN_PRICE,
          value: DEAL_SCREEN_PRICE,
          currency: "USD",
          ...attributionData,
        });
        sendGTMEvent("ads_conversion", {
          conversion_id: "deal_screen_purchase",
          conversion_value: DEAL_SCREEN_PRICE,
          currency: "USD",
          transaction_id: paymentIntent.id,
          ...attributionData,
        });
        // Legacy event for backwards compatibility.
        pushEvent("deal_screen_purchase", {
          page: "/deal-screen/start",
          transaction_id: paymentIntent.id,
          value: DEAL_SCREEN_PRICE,
        });

        onSucceeded();
        return;
      }

      setErrorMessage("Payment could not be confirmed. Please try again.");
      setIsProcessing(false);
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
          defaultValues: {
            billingDetails: {
              name: customerName || undefined,
              email: customerEmail || undefined,
            },
          },
        }}
      />

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          `Pay ${PRICE_LABEL}`
        )}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        Secure payment via Stripe. Decision-support only — not an appraisal.
      </p>
    </form>
  );
}

export default function DealScreenCheckout({
  deal,
  display,
}: DealScreenCheckoutProps) {
  // Funnel state: collect email -> init PaymentIntent -> pay -> confirmation.
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  // Lock the captured email so the PaymentIntent metadata + receipt stay aligned.
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [confirmedName, setConfirmedName] = useState("");

  // SAL-39 / SAL-48 — "checkout started" funnel event when checkout mounts.
  useEffect(() => {
    const attributionData = getAttributionData();
    sendGTMEvent("deal_screen_checkout_started", {
      page_type: "deal_screen",
      step: 2,
      step_name: "checkout_started",
      conversion_value: 20,
      value: DEAL_SCREEN_PRICE,
      currency: "USD",
      ...attributionData,
    });
    pushEvent("deal_screen_checkout_started", {
      page: "/deal-screen/start",
      step: 2,
    });
  }, []);

  const startCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setInitError("Please enter a valid email address.");
      return;
    }

    setIsInitializing(true);
    setInitError(null);

    try {
      const res = await fetch("/api/deal-screen/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NOTE: we intentionally send NO amount. The server fixes the $49 price
        // by SKU; the client cannot influence what is charged.
        body: JSON.stringify({
          sku: "DEAL_SCREEN",
          customerEmail: trimmedEmail,
          customerName: name.trim() || undefined,
          deal,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize payment");
      }

      const data = await res.json();
      if (!data.clientSecret) {
        throw new Error("Missing client secret");
      }

      setConfirmedEmail(trimmedEmail);
      setConfirmedName(name.trim());
      setClientSecret(data.clientSecret);

      // SAL-39 / SAL-48 — payment begins (PaymentElement is about to render).
      const attributionData = getAttributionData();
      sendGTMEvent("deal_screen_payment_started", {
        page_type: "deal_screen",
        step: 3,
        step_name: "payment_started",
        conversion_value: 30,
        value: DEAL_SCREEN_PRICE,
        currency: "USD",
        ...attributionData,
      });
      pushEvent("deal_screen_payment_started", {
        page: "/deal-screen/start",
        step: 3,
      });
    } catch {
      setInitError("We couldn't start checkout. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  };

  // Reset Elements appearance options memo per clientSecret.
  const elementsOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "stripe" as const,
          variables: { colorPrimary: "#2563eb" },
        },
      }
    : undefined;

  // ----- Confirmation state -----
  if (succeeded) {
    return (
      <Card className="mx-auto max-w-xl shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl text-primary">
            Payment received — your Deal Screen is being prepared
          </CardTitle>
          <CardDescription>
            We&rsquo;ve charged $49 and started work on{" "}
            <span className="font-medium">{display.propertyLabel}</span>. A
            receipt is on its way to{" "}
            <span className="font-medium">{confirmedEmail}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <Mail className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              You&rsquo;ll receive your verdict, ARV range, MLS-verified comps,
              risk flags, and pro-forma by email. Check your inbox (and spam) for
              updates.
            </p>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href="/deal-screen">Back to Deal Screen</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Decision-support only &mdash; not an appraisal, not for lending.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ----- Checkout state -----
  return (
    <Card className="mx-auto max-w-xl shadow-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl text-primary">
          Complete your $49 Deal Screen for {display.propertyLabel}
        </CardTitle>
        <CardDescription>
          You&rsquo;re one step from your verdict, ARV range, MLS-verified comps,
          risk flags, and pro-forma.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="divide-y rounded-lg border bg-secondary/40 text-sm">
          <div className="flex items-center justify-between gap-4 p-4">
            <dt className="font-medium text-muted-foreground">Property</dt>
            <dd className="text-right font-semibold">
              {display.propertyLabel}
            </dd>
          </div>
          {display.contract && (
            <div className="flex items-center justify-between gap-4 p-4">
              <dt className="font-medium text-muted-foreground">
                Contract price
              </dt>
              <dd className="text-right font-semibold">{display.contract}</dd>
            </div>
          )}
          {display.arv && (
            <div className="flex items-center justify-between gap-4 p-4">
              <dt className="font-medium text-muted-foreground">Target ARV</dt>
              <dd className="text-right font-semibold">{display.arv}</dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 p-4">
            <dt className="font-medium text-muted-foreground">Deal Screen</dt>
            <dd className="text-right font-semibold text-accent">$49</dd>
          </div>
        </dl>

        {!clientSecret ? (
          <form onSubmit={startCheckout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-name">Name</Label>
              <Input
                id="checkout-name"
                type="text"
                autoComplete="name"
                placeholder="Jane Investor"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="checkout-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your receipt and Deal Screen results go here.
              </p>
            </div>

            {initError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{initError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isInitializing}
              className="w-full"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting secure checkout…
                </>
              ) : (
                "Continue to Payment — $49"
              )}
            </Button>
          </form>
        ) : (
          <Elements
            stripe={stripePromise}
            options={elementsOptions}
            key={clientSecret}
          >
            <CheckoutForm
              deal={deal}
              customerEmail={confirmedEmail}
              customerName={confirmedName}
              onSucceeded={() => setSucceeded(true)}
            />
          </Elements>
        )}

        <Button asChild variant="ghost" className="w-full text-muted-foreground">
          <Link href="/deal-screen">Back to Deal Screen</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
