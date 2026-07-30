/**
 * Configuration for assets on the Billionaire Blueprint landing page that do not
 * exist yet.
 *
 * Nothing here has a fabricated default. Every value is read from an env var and
 * is `null` when unset — the components render an honest "not available yet"
 * state rather than a placeholder video, stock reel, or dead link. Drop a URL into
 * the env var and the slot fills itself; no component changes needed.
 */

function readUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Hero intro video: Rod explaining the Billionaire Appraisal Platform. */
export const HERO_VIDEO_URL = readUrl(process.env.NEXT_PUBLIC_BLUEPRINT_HERO_VIDEO_URL);

/** Explainer video shown beside the deal-lifecycle timeline. */
export const EXPLAINER_VIDEO_URL = readUrl(
  process.env.NEXT_PUBLIC_BLUEPRINT_EXPLAINER_VIDEO_URL
);

/**
 * Webinar registration URL. Does not exist yet — until it does, the floating
 * webinar button falls back to the existing booking page rather than a dead link.
 */
export const WEBINAR_URL = readUrl(process.env.NEXT_PUBLIC_WEBINAR_URL);

/** Where the webinar button actually points today. */
export const BOOKING_PATH = '/book';

export const webinarHref = WEBINAR_URL ?? BOOKING_PATH;

/** True when the button is a real webinar link rather than the booking fallback. */
export const hasWebinar = WEBINAR_URL !== null;
