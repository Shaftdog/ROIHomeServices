'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQSchema } from '@/components/seo/JsonLd';
import type { FAQItem } from '@/data/faqs';

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
  includeSchema?: boolean;
}

export default function FAQSection({
  title = 'Frequently Asked Questions',
  subtitle,
  items,
  className = '',
  includeSchema = true,
}: FAQSectionProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      {includeSchema && <FAQSchema items={items} />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto bg-background p-6 rounded-lg shadow-md"
        >
          {items.map((faq, index) => (
            <AccordionItem value={`faq-${index}`} key={index}>
              <AccordionTrigger className="text-md md:text-lg text-left hover:text-accent">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
