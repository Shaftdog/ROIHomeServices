"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ServicesBannerSlide } from "@/data/services-banner";

const AUTOPLAY_INTERVAL_MS = 6000;

/**
 * Homepage services carousel. Replaces the old single-hero section.
 *
 * - Auto-rotates every ~6s, pauses on hover/focus, and never auto-rotates
 *   when the visitor has prefers-reduced-motion set.
 * - Dots + arrows + native Embla swipe/drag for touch.
 * - aria-roledescription="carousel", per-slide labels, and arrow-key
 *   navigation for accessibility.
 *
 * The page's real, static <h1> lives above this component (see
 * src/app/page.tsx) — crawlers and screen readers get a real headline that
 * never changes slides. Each slide's own headline below is an <h2>.
 */
export default function ServicesBanner({ slides }: { slides: ServicesBannerSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay — skipped entirely while paused (hover/focus) or when the
  // visitor prefers reduced motion.
  useEffect(() => {
    if (!emblaApi || isPaused || prefersReducedMotion) return;
    const id = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [emblaApi, isPaused, prefersReducedMotion]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Our services"
      className="relative overflow-hidden bg-deep-charcoal text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      {/*
        Height is content-driven (padding on the inner wrapper below), not a
        fixed vh box. A fixed/capped height clipped the CTA and disclosure on
        slide 1 at mobile viewports once the verbatim AVM disclosure wrapped
        to several lines — flexbox's default align-items: stretch still gives
        every slide the same height (the tallest slide's natural height), so
        the carousel still reads as one consistent band, it just can never
        clip content.
      */}
      <div className="w-full" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.headline}`}
              aria-hidden={index !== selectedIndex}
            >
              {slide.background === "video" ? (
                <>
                  <video
                    src="/hero.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/55" />
                </>
              ) : (
                <div className={cn("absolute inset-0", slide.gradientClassName)} />
              )}

              <div className="relative z-10 flex min-h-[480px] flex-col items-center justify-center px-6 py-14 text-center sm:min-h-[560px] sm:px-10 sm:py-20 md:min-h-[640px] md:py-24 lg:min-h-[720px]">
                {slide.eyebrow && (
                  <span className="mb-4 inline-flex items-center rounded-full bg-highlight px-4 py-1.5 text-sm font-semibold text-highlight-foreground">
                    {slide.eyebrow}
                  </span>
                )}
                <h2 className="max-w-3xl text-balance text-2xl font-bold leading-tight sm:text-3xl md:text-5xl">
                  {slide.headline}
                </h2>
                <p className="mt-3 max-w-xl text-balance text-base text-slate-200 sm:mt-4 sm:text-lg md:text-xl">
                  {slide.support}
                </p>
                <div className="mt-5 sm:mt-8">
                  <Button asChild size="lg" variant="highlight" className="text-base">
                    <Link href={slide.ctaHref} tabIndex={index === selectedIndex ? 0 : -1}>
                      {slide.ctaLabel}
                    </Link>
                  </Button>
                </div>
                {slide.disclosureText && (
                  <p className="mx-auto mt-4 max-w-xl text-balance text-xs leading-relaxed text-slate-300/90 sm:mt-5">
                    {slide.disclosureText}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight sm:left-6"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={scrollNext}
        className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight sm:right-6"
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2 sm:bottom-8">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${index + 1}: ${slide.headline}`}
            aria-current={index === selectedIndex}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight",
              index === selectedIndex ? "bg-highlight" : "bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </section>
  );
}
