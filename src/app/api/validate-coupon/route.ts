import { NextRequest, NextResponse } from 'next/server';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';

const couponLogger = createChildLogger({ context: LOG_CONTEXTS.PAYMENT, component: 'coupon' });

// Coupon configuration - can be extended to use database in the future
// Format: CODE -> { discountPercent, description, active }
const COUPONS: Record<string, { discountPercent: number; description: string; active: boolean }> = {
  // Test coupon for 100% off - for testing conversion tracking
  'TEST100': {
    discountPercent: 100,
    description: 'Test coupon - 100% off',
    active: true,
  },
  // Add more coupons as needed
  'WELCOME10': {
    discountPercent: 10,
    description: 'Welcome discount - 10% off',
    active: true,
  },
  'FRIEND25': {
    discountPercent: 25,
    description: 'Referral discount - 25% off',
    active: true,
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, originalAmount } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();
    const coupon = COUPONS[normalizedCode];

    if (!coupon) {
      couponLogger.info({ code: normalizedCode }, 'Invalid coupon code attempted');
      return NextResponse.json(
        { valid: false, error: 'Invalid coupon code' },
        { status: 200 }
      );
    }

    if (!coupon.active) {
      couponLogger.info({ code: normalizedCode }, 'Expired coupon code attempted');
      return NextResponse.json(
        { valid: false, error: 'This coupon has expired' },
        { status: 200 }
      );
    }

    const discountAmount = originalAmount ? (originalAmount * coupon.discountPercent) / 100 : 0;
    const finalAmount = originalAmount ? originalAmount - discountAmount : 0;

    couponLogger.info({
      code: normalizedCode,
      discountPercent: coupon.discountPercent,
      originalAmount,
      discountAmount,
      finalAmount,
    }, 'Coupon applied successfully');

    return NextResponse.json({
      valid: true,
      code: normalizedCode,
      discountPercent: coupon.discountPercent,
      description: coupon.description,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    couponLogger.error({ err: error }, 'Error validating coupon');
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
