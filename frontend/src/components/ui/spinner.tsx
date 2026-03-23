/**
 * Reusable loading spinner component.
 */
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: number;
}

export function Spinner({ className, size = 24 }: SpinnerProps) {
  return <Loader2 className={cn('animate-spin text-primary', className)} size={size} />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={36} />
    </div>
  );
}
