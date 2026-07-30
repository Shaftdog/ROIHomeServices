import { Video } from 'lucide-react';

interface BlueprintVideoProps {
  /** Video URL from config/env. `null` renders the neutral "not posted yet" state. */
  url: string | null;
  /** Accessible title for the embed. */
  title: string;
  /** Shown in the empty state so a visitor knows what belongs here. */
  emptyLabel: string;
  className?: string;
}

/** MP4/WebM get a native player; everything else is treated as an embed URL. */
function isDirectFile(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

/**
 * Config-driven video slot.
 *
 * There is deliberately NO placeholder video, fake thumbnail, or stock reel: when
 * no URL is configured the slot says the video has not been posted yet. See
 * src/lib/blueprint-config.ts.
 */
export default function BlueprintVideo({
  url,
  title,
  emptyLabel,
  className = '',
}: BlueprintVideoProps) {
  if (!url) {
    return (
      <div
        className={`flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-light-gray p-6 text-center ${className}`}
      >
        <Video className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-muted-foreground">{emptyLabel}</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          This video hasn&rsquo;t been posted yet. Everything below is live and
          orderable in the meantime.
        </p>
      </div>
    );
  }

  if (isDirectFile(url)) {
    return (
      <video
        controls
        preload="metadata"
        className={`aspect-video w-full rounded-xl bg-deep-charcoal ${className}`}
        aria-label={title}
      >
        <source src={url} />
        Your browser doesn&rsquo;t support embedded video.{' '}
        <a href={url} className="underline">
          Open the video directly
        </a>
        .
      </video>
    );
  }

  return (
    <iframe
      src={url}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      allowFullScreen
      className={`aspect-video w-full rounded-xl border-0 bg-deep-charcoal ${className}`}
    />
  );
}
