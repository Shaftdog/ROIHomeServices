'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Testimonial } from '@/data/testimonials';

interface StarRatingProps {
  rating: number;
}

function StarRating({ rating }: StarRatingProps) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <Star
          key={i}
          className="h-5 w-5 text-highlight"
          fill="hsl(var(--highlight))"
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <div key={i} className="relative">
          <Star className="h-5 w-5 text-highlight" />
          <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
            <Star
              className="h-5 w-5 text-highlight"
              fill="hsl(var(--highlight))"
            />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} className="h-5 w-5 text-highlight opacity-50" />
      );
    }
  }
  return <div className="flex">{stars}</div>;
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
  variant?: 'default' | 'compact';
}

export default function TestimonialsSection({
  title = 'What Our Clients Say',
  subtitle,
  testimonials,
  className = '',
  variant = 'default',
}: TestimonialsSectionProps) {
  if (variant === 'compact') {
    return (
      <section className={`py-12 md:py-16 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <StarRating rating={testimonial.rating} />
                  <blockquote className="text-muted-foreground italic my-4 flex-grow">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="text-sm">
                    <p className="font-semibold">- {testimonial.name}</p>
                    {testimonial.location && (
                      <p className="text-muted-foreground text-xs">
                        {testimonial.location}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="flex flex-col h-full bg-background">
                    <CardContent className="flex-grow flex flex-col justify-between p-6">
                      <blockquote className="text-muted-foreground italic mb-4 flex-grow">
                        &quot;{testimonial.quote}&quot;
                      </blockquote>
                      <div>
                        <StarRating rating={testimonial.rating} />
                        <p className="font-semibold mt-2 text-right">
                          - {testimonial.name}
                        </p>
                        {testimonial.location && (
                          <p className="text-xs text-muted-foreground text-right">
                            {testimonial.location}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-foreground" />
          <CarouselNext className="text-foreground" />
        </Carousel>
      </div>
    </section>
  );
}
