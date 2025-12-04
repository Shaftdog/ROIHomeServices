"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { AppraisalFormData } from "@/types/scheduler-types";
import { Loader2, AlertCircle, Tag, Check, X } from "lucide-react";

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CouponData {
  valid: boolean;
  code: string;
  discountPercent: number;
  description: string;
  discountAmount: number;
  finalAmount: number;
}

interface PaymentFormProps {
  onComplete: () => void;
  onBack: () => void;
  formData: AppraisalFormData;
}

interface CheckoutFormProps extends PaymentFormProps {
  clientSecret: string;
  appliedCoupon: CouponData | null;
}

function CheckoutForm({ onComplete, onBack, formData, clientSecret, appliedCoupon }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: formData.email,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment successful!", paymentIntent.id);
        // Call the original onComplete to trigger email and confirmation
        onComplete();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  const appointmentDate = formData.appointmentDate ? new Date(formData.appointmentDate) : null;
  const originalAmount = typeof formData.quoteAmount === 'number'
    ? formData.quoteAmount
    : typeof formData.quoteAmount === 'string'
      ? parseFloat(formData.quoteAmount)
      : 0;

  const finalAmount = appliedCoupon ? appliedCoupon.finalAmount : originalAmount;
  const formattedOriginalAmount = originalAmount.toFixed(2);
  const formattedFinalAmount = finalAmount.toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service:</span>
              <span>Property Appraisal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Address:</span>
              <span className="text-right max-w-[200px]">{formData.address}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span>{appointmentDate ? format(appointmentDate, "MMM dd, yyyy") : "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time:</span>
              <span>{formData.appointmentTime}</span>
            </div>
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${formattedOriginalAmount}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                  </span>
                  <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">${formattedFinalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentElement 
              options={{
                layout: "tabs",
                defaultValues: {
                  billingDetails: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                  }
                }
              }}
            />
            
            {errorMessage && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
        >
          Back
        </Button>
        
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="min-w-[150px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${formattedFinalAmount}`
          )}
        </Button>
      </div>
    </form>
  );
}

// Component for 100% off free booking (no Stripe needed)
function FreeBookingForm({ onComplete, onBack, formData, appliedCoupon }: PaymentFormProps & { appliedCoupon: CouponData }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    console.log("Free booking completed with coupon:", appliedCoupon.code);
    // Small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));
    onComplete();
  };

  const appointmentDate = formData.appointmentDate ? new Date(formData.appointmentDate) : null;
  const originalAmount = typeof formData.quoteAmount === 'number'
    ? formData.quoteAmount
    : typeof formData.quoteAmount === 'string'
      ? parseFloat(formData.quoteAmount)
      : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service:</span>
            <span>Property Appraisal</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Address:</span>
            <span className="text-right max-w-[200px]">{formData.address}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date:</span>
            <span>{appointmentDate ? format(appointmentDate, "MMM dd, yyyy") : "N/A"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time:</span>
            <span>{formData.appointmentTime}</span>
          </div>
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="line-through text-muted-foreground">${originalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
              </span>
              <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total:</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>
          </div>
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              No payment required - your coupon covers the full amount!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
        >
          Back
        </Button>

        <Button
          type="submit"
          disabled={isProcessing}
          className="min-w-[150px] bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Booking"
          )}
        </Button>
      </div>
    </form>
  );
}

export default function PaymentForm({ onComplete, onBack, formData }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);

  const originalAmount = typeof formData.quoteAmount === 'number'
    ? formData.quoteAmount
    : typeof formData.quoteAmount === 'string'
      ? parseFloat(formData.quoteAmount)
      : 0;

  const finalAmount = appliedCoupon ? appliedCoupon.finalAmount : originalAmount;

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError(null);

    try {
      const response = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          originalAmount,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon(data);
        setCouponCode("");
      } else {
        setCouponError(data.error || "Invalid coupon code");
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Create payment intent when component mounts or when coupon changes
  useEffect(() => {
    // Skip payment intent creation if coupon covers full amount
    if (appliedCoupon && appliedCoupon.finalAmount === 0) {
      setIsLoading(false);
      setClientSecret(null);
      return;
    }

    const createPaymentIntent = async () => {
      setIsLoading(true);
      try {
        const amountToCharge = appliedCoupon ? appliedCoupon.finalAmount : originalAmount;

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountToCharge,
            customerEmail: formData.email,
            customerName: formData.name,
            bookingDetails: {
              serviceType: `Property Appraisal - ${formData.purpose}`,
              appointmentDate: formData.appointmentDate,
              appointmentTime: formData.appointmentTime,
              address: formData.address,
              couponCode: appliedCoupon?.code || null,
              originalAmount,
              discountAmount: appliedCoupon?.discountAmount || 0,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError("Failed to initialize payment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [formData, appliedCoupon, originalAmount]);

  // Coupon input section
  const CouponSection = () => (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Have a coupon?
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">{appliedCoupon.code}</span>
              <span className="text-sm text-green-600">({appliedCoupon.discountPercent}% off)</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeCoupon}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  validateCoupon();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={validateCoupon}
              disabled={couponLoading}
            >
              {couponLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        )}
        {couponError && (
          <p className="text-sm text-red-600 mt-2">{couponError}</p>
        )}
      </CardContent>
    </Card>
  );

  // If 100% off coupon applied, show free booking form
  if (appliedCoupon && appliedCoupon.finalAmount === 0) {
    return (
      <div className="space-y-6">
        <CouponSection />
        <FreeBookingForm
          onComplete={onComplete}
          onBack={onBack}
          formData={formData}
          appliedCoupon={appliedCoupon}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CouponSection />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Initializing payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="space-y-6">
        <CouponSection />
        <div className="flex items-center justify-center min-h-[300px]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error || "Failed to initialize payment. Please try again."}
                </AlertDescription>
              </Alert>
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full mt-4"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
      },
    },
  };

  return (
    <div className="space-y-6">
      <CouponSection />
      <Elements stripe={stripePromise} options={options} key={clientSecret}>
        <CheckoutForm
          onComplete={onComplete}
          onBack={onBack}
          formData={formData}
          clientSecret={clientSecret}
          appliedCoupon={appliedCoupon}
        />
      </Elements>
    </div>
  );
}