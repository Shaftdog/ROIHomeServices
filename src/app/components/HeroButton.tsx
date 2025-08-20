
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroButtonProps {
  href: string;
  label: string;
  className?: string;
}

const HeroButton: React.FC<HeroButtonProps> = ({ href, label, className }) => {
  return (
    <Link
      href={href}
      className={cn(
        'inline-block bg-brand hover:bg-brand/90 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 text-lg',
        className
      )}
    >
      {label}
    </Link>
  );
};

export default HeroButton;
