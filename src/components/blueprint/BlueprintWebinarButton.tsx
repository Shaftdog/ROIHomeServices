import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hasWebinar, webinarHref } from '@/lib/blueprint-config';

/**
 * Always-visible floating webinar CTA.
 *
 * The webinar registration URL does not exist yet. Rather than ship a dead link,
 * this falls back to the existing booking page AND changes its own label so it
 * doesn't promise a webinar that isn't scheduled. Set NEXT_PUBLIC_WEBINAR_URL and
 * it becomes a real webinar button.
 */
export default function BlueprintWebinarButton() {
  const isExternal = webinarHref.startsWith('http');

  return (
    <div className="fixed bottom-6 left-4 z-40 sm:left-6">
      <Button
        asChild
        variant="highlight"
        size="lg"
        className="shadow-lg transition-shadow hover:shadow-xl"
      >
        <a
          href={webinarHref}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <CalendarDays aria-hidden="true" />
          {hasWebinar ? 'Join the webinar' : 'Webinar dates — book a call'}
        </a>
      </Button>
    </div>
  );
}
