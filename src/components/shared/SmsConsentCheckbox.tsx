'use client';

import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { SMS_CONSENT_TEXT } from '@/lib/sms-consent';

interface SmsConsentCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** Optional, unchecked-by-default SMS consent checkbox. Never required. */
export function SmsConsentCheckbox({ id, checked, onCheckedChange, disabled }: SmsConsentCheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        disabled={disabled}
        className="mt-1"
      />
      <label htmlFor={id} className="text-sm text-muted-foreground leading-snug">
        {SMS_CONSENT_TEXT}{' '}
        <Link href="/privacy" className="underline hover:text-accent">Privacy Policy</Link>
        {' '}and{' '}
        <Link href="/terms" className="underline hover:text-accent">SMS Terms</Link>.
      </label>
    </div>
  );
}
