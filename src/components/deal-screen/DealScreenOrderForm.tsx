"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Contract price / target ARV come in as free-text so users can paste
// "$450,000" or "450000"; we normalize to digits before validating range.
const numericOptional = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      const digitsOnly = val.replace(/[^0-9.]/g, "");
      const num = parseFloat(digitsOnly);
      return !isNaN(num) && num > 0 && num <= 100_000_000;
    },
    { message: "Enter a valid dollar amount" }
  );

const orderFormSchema = z.object({
  address: z
    .string()
    .min(8, "Please enter a complete property address")
    .max(200, "Address is too long"),
  contract: numericOptional,
  arv: numericOptional,
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

/** Strip formatting characters so query params carry clean numeric values. */
function normalizeAmount(value?: string): string {
  if (!value) return "";
  const digitsOnly = value.replace(/[^0-9.]/g, "");
  return digitsOnly;
}

interface DealScreenOrderFormProps {
  /** Optional id so the hero CTA can scroll/focus the form. */
  id?: string;
  className?: string;
}

export default function DealScreenOrderForm({
  id = "order-form",
  className,
}: DealScreenOrderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      address: "",
      contract: "",
      arv: "",
    },
  });

  const onSubmit = (values: OrderFormValues) => {
    setIsSubmitting(true);

    const params = new URLSearchParams();
    params.set("address", values.address.trim());

    const contract = normalizeAmount(values.contract);
    if (contract) params.set("contract", contract);

    const arv = normalizeAmount(values.arv);
    if (arv) params.set("arv", arv);

    router.push(`/deal-screen/start?${params.toString()}`);
  };

  return (
    <Card id={id} className={className}>
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          Start Your $49 Deal Screen
        </CardTitle>
        <CardDescription>
          Enter the property address. Add the contract price and your target
          after-repair value if you have them &mdash; it sharpens the read.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Property Address
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="123 Main St, Orlando, FL 32801"
                        autoComplete="street-address"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Price</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        placeholder="$300,000"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target ARV</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        placeholder="$425,000"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      After-repair value, optional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="group w-full"
            >
              {isSubmitting ? "Starting…" : "Continue to Checkout — $49"}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Decision-support only &mdash; not an appraisal, not for lending.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
