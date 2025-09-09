
"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AppraisalFormData } from "@/types/scheduler-types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const formSchema = z.object({
  address: z.string().min(10, "Please enter a complete street address"),
  zipCode: z.string().optional().refine(val => !val || /^\d{5}(-\d{4})?$/.test(val), { 
    message: "ZIP code must be in format 12345 or 12345-6789" 
  }),
  dateNeeded: z.string().min(1, "Date is required").refine(val => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, { message: "Date must be today or in the future" }),
  purpose: z.string().min(1, "Purpose is required"),
  requester: z.string().min(1, "Requester role is required"),
  sizeOfHome: z.string().min(1, "Size of home is required").refine(val => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 100 && num <= 50000;
  }, { message: "Home size must be between 100 and 50,000 sq ft" }),
  siteInfluences: z.string().optional(),
  sizeOfLot: z.string().optional().refine(val => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num <= 1000;
  }, { message: "Lot size must be between 0 and 1,000 acres" }),
  isLotOverOneAcre: z.boolean().optional().default(false),
  hasSiteInfluence: z.boolean().optional().default(false),
  numberOfLivingUnits: z.string().min(1, "Number of living units is required"),
  scopeOfInspection: z.string().min(1, "Assignment type is required"),
});

interface PropertyDetailsFormProps {
  onContinue: (data: AppraisalFormData) => void;
  onBack?: () => void;
  defaultValues?: Partial<AppraisalFormData>;
}

// Pricing logic from lib/calculatePrice.ts
interface QuoteParams {
  scopeOfInspection: string;
  sizeOfHome: number;
  numberOfLivingUnits: string;
  isLotOverOneAcre?: boolean;
  hasSiteInfluence?: boolean;
}

function calculateQuote(params: QuoteParams): number | string {
  const { 
    scopeOfInspection, 
    sizeOfHome = 0, 
    numberOfLivingUnits,
    isLotOverOneAcre = false,
    hasSiteInfluence = false
  } = params;
  
  let basePrice = 450;
  
  if (scopeOfInspection === 'inspection') basePrice = 200;
  else if (scopeOfInspection === 'desktop') basePrice = 250;
  else if (scopeOfInspection === 'interior') basePrice = 450;
  else if (scopeOfInspection === 'exterior') basePrice = 350;
  
  if (numberOfLivingUnits === '5+') {
    return "Please call for a quote. We only appraise residential properties with up to four units.";
  }
  
  if (sizeOfHome > 3000) {
    basePrice += (sizeOfHome - 3000) * 0.1;
  }
  
  if (isLotOverOneAcre) basePrice += 100;
  if (hasSiteInfluence) basePrice += 100;
  if (['2', '3', '4'].includes(numberOfLivingUnits)) basePrice += 200;
  
  return basePrice;
}


export default function PropertyDetailsForm({ onContinue, onBack, defaultValues = {} }: PropertyDetailsFormProps) {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: defaultValues.address || "",
      zipCode: defaultValues.zipCode || "",
      dateNeeded: defaultValues.dateNeeded || "",
      purpose: defaultValues.purpose || "",
      requester: defaultValues.requester || "",
      sizeOfHome: defaultValues.sizeOfHome?.toString() || "",
      siteInfluences: defaultValues.siteInfluences || "",
      sizeOfLot: defaultValues.sizeOfLot?.toString() || "",
      isLotOverOneAcre: defaultValues.isLotOverOneAcre || false,
      hasSiteInfluence: defaultValues.hasSiteInfluence || false,
      numberOfLivingUnits: defaultValues.numberOfLivingUnits || "",
      scopeOfInspection: defaultValues.scopeOfInspection || "",
    }
  });

  const watchedValues = form.watch();

  const quoteResult = useMemo(() => {
    return calculateQuote({
        ...watchedValues,
        sizeOfHome: parseInt(watchedValues.sizeOfHome) || 0,
    });
  }, [watchedValues]);

  const showCallMessage = typeof quoteResult === 'string';

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (showCallMessage) return;
    
    const formData = {
      ...defaultValues,
      ...values,
      sizeOfHome: parseInt(values.sizeOfHome) || 0,
      sizeOfLot: values.sizeOfLot ? parseFloat(values.sizeOfLot) : undefined,
      quoteAmount: quoteResult,
    } as AppraisalFormData;
    
    onContinue(formData);
  };

  return (
    <div className="step-content">
      <h2 className="text-2xl font-semibold text-primary mb-6">Property Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address<span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="Street address" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="zipCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl><Input placeholder="12345" maxLength={10} {...field} /></FormControl>
                    <FormDescription>Optional - helps ensure accurate service area coverage</FormDescription>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="dateNeeded" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Needed<span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="purpose" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Appraisal<span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="refinance">Refinance</SelectItem>
                        <SelectItem value="divorce">Divorce</SelectItem>
                        <SelectItem value="estate">Estate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="requester" render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am the<span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="owner">Property Owner</SelectItem>
                        <SelectItem value="agent">Real Estate Agent</SelectItem>
                        <SelectItem value="lender">Lender</SelectItem>
                        <SelectItem value="lawyer">Lawyer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="scopeOfInspection" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Type<span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select assignment type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="inspection">Inspection ($200 base)</SelectItem>
                        <SelectItem value="desktop">Desktop ($250 base)</SelectItem>
                        <SelectItem value="interior">Interior ($450 base)</SelectItem>
                        <SelectItem value="exterior">Exterior ($350 base)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
              )}/>
            </div>

            <div className="space-y-6">
              <FormField control={form.control} name="sizeOfHome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size of Home (sq ft)<span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input type="number" placeholder="Square footage" {...field} /></FormControl>
                    <FormDescription>
                      {(parseInt(field.value) || 0) > 3000 ? 
                        `Additional fee: $${((parseInt(field.value) - 3000) * 0.1).toFixed(2)} (10¢ per sq ft > 3000)` : 
                        "No additional fee for homes 3000 sq ft or less"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="isLotOverOneAcre" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Lot size exceeds one acre (+$100)</FormLabel>
                      <FormDescription>Check if the property lot is larger than one acre</FormDescription>
                    </div>
                  </FormItem>
              )}/>
              <FormField control={form.control} name="hasSiteInfluence" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Property has site influence (+$100)</FormLabel>
                      <FormDescription>E.g., waterfront, golf course, views, etc.</FormDescription>
                    </div>
                  </FormItem>
              )}/>
              <FormField control={form.control} name="numberOfLivingUnits" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Living Units<span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select number of units" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 (Single Family)</SelectItem>
                        <SelectItem value="2">2 (Duplex) (+$200)</SelectItem>
                        <SelectItem value="3">3 (+$200)</SelectItem>
                        <SelectItem value="4">4 (+$200)</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
              )}/>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-border">
            {showCallMessage ? (
              <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    {quoteResult}
                  </AlertDescription>
              </Alert>
            ) : (
              <div className="bg-secondary p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-primary">QUOTE</h3>
                  <div className="text-4xl font-bold text-primary">${typeof quoteResult === 'number' ? quoteResult.toFixed(2) : '0.00'}</div>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  This quote is based on the property details provided and may be subject to change.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            {onBack && (<Button type="button" variant="outline" onClick={onBack}>Back</Button>)}
            <Button type="submit" disabled={showCallMessage}>Continue to Schedule</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
