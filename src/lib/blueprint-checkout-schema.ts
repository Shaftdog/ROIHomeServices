import { z } from 'zod';

/**
 * Request body for POST /api/blueprint/checkout.
 *
 * NOTE: no `amount`, no `price`, no `coupon`. `.strict()` rejects unknown keys,
 * so a request that tries to smuggle an amount fails validation outright.
 * `interval` only chooses between plans a subscription SKU actually offers in the
 * catalog — it can never change what a one-time product costs.
 * `propertyState` is the buyer-stated two-letter state; it can only gate a
 * purchase, never change a charge.
 */
export const blueprintCheckoutBodySchema = z
  .object({
    sku: z.string().min(1, 'A product SKU is required'),
    email: z.string().email('A valid email is required').optional(),
    interval: z.enum(['month', 'year']).optional(),
    propertyState: z
      .string()
      .regex(/^[A-Za-z]{2}$/, 'Property state must be a two-letter state code')
      .optional(),
  })
  .strict();
