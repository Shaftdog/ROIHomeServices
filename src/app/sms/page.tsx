import type { Metadata } from 'next';
import Link from 'next/link';
import {
  SMS_BRAND,
  SMS_PROGRAM_NAME,
  SMS_SENDING_NUMBERS,
  SMS_SUPPORT_EMAIL,
  SMS_SUPPORT_PHONE,
} from '@/lib/sms-consent';

export const metadata: Metadata = {
  title: 'Text Messages from ROI Home Services',
  description: 'How ROI Home Services appointment and order text messages work: who sends them, what they say, and how to opt in or out.',
};

export default function SmsProgramPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Text Messages from {SMS_BRAND}</h1>
        <p className="text-sm text-muted-foreground">Last updated: October 31, 2026</p>
      </header>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          This page describes the {SMS_PROGRAM_NAME} program run by {SMS_BRAND}.
        </p>

        <h2>Who sends the texts</h2>
        <p>
          {SMS_BRAND} sends these texts, from {SMS_SENDING_NUMBERS[0]} or {SMS_SENDING_NUMBERS[1]}.
        </p>

        <h2>What the texts are about</h2>
        <p>
          Our texts cover appraisal inspection scheduling, confirmations and reminders for homeowners, and order updates for our lending and AMC clients. We do not send marketing or promotional texts under this program. Example messages:
        </p>
        <ul>
          <li>&quot;ROI Home Services: Your appraisal inspection at 123 Main St is confirmed for Tue 10/14, 10-12. Reply here to reschedule. Reply STOP to opt out.&quot;</li>
          <li>&quot;ROI Home Services: Reminder - your appraisal inspection at 123 Main St is tomorrow, 10-12. Please make sure we can access the home. Reply STOP to opt out.&quot;</li>
        </ul>

        <h2>How to opt in</h2>
        <p>
          You can opt in by checking the optional SMS consent box next to the phone field on our{' '}
          <Link href="/contact">contact form</Link> or <Link href="/book">booking form</Link>, or by texting START to {SMS_SENDING_NUMBERS[0]} or {SMS_SENDING_NUMBERS[1]}. The box is never checked for you, and consent is not a condition of purchase.
        </p>

        <h2>How to opt out</h2>
        <p>
          Reply STOP to any message to stop receiving texts. You will receive one confirmation text, and then no more messages.
        </p>

        <h2>Help</h2>
        <p>
          Reply HELP to any message, call {SMS_SUPPORT_PHONE}, or email {SMS_SUPPORT_EMAIL}.
        </p>

        <h2>Frequency and rates</h2>
        <p>
          Message frequency varies with your order. Msg &amp; data rates may apply.
        </p>

        <h2>More information</h2>
        <p>
          See our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link> (including the SMS Terms). We do not sell, rent or share mobile phone numbers or SMS opt-in data and consent with third parties or affiliates for marketing or promotional purposes.
        </p>
      </div>
    </div>
  );
}
