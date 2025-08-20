
import type { LucideProps } from 'lucide-react';
import { HelpCircle } from 'lucide-react'; // Default icon
import { cn } from '@/lib/utils';

interface IconPlaceholderProps extends LucideProps {
  icon?: React.ComponentType<LucideProps>;
  label?: string; // For accessibility
}

export function IconPlaceholder({ icon: Icon = HelpCircle, label = "Placeholder Icon", className, ...props }: IconPlaceholderProps) {
  return (
    <div className={cn("p-3 bg-accent/10 rounded-full inline-flex items-center justify-center", className)}>
      <Icon className="h-6 w-6 text-accent" aria-label={label} {...props} />
    </div>
  );
}
