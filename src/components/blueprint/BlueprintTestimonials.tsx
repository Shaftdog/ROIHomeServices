import { Card, CardContent } from '@/components/ui/card';
import {
  blueprintTestimonials,
  type BlueprintTestimonial,
} from '@/data/blueprint-testimonials';

interface BlueprintTestimonialsProps {
  /** Defaults to the (currently empty) real-quote list. */
  testimonials?: BlueprintTestimonial[];
  title?: string;
}

/**
 * Data-driven testimonial section. Renders NOTHING when there are no real,
 * permission-granted quotes — see src/data/blueprint-testimonials.ts. There is no
 * placeholder, sample, or "representative" quote anywhere in this component.
 */
export default function BlueprintTestimonials({
  testimonials = blueprintTestimonials,
  title = 'What clients say',
}: BlueprintTestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-light-gray py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">{title}</h2>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={`${testimonial.name}-${testimonial.quote.slice(0, 24)}`} className="h-full">
              <CardContent className="flex h-full flex-col p-6">
                <blockquote className="flex-1 italic text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <footer className="mt-4 text-sm">
                  <p className="font-semibold">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  )}
                </footer>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
