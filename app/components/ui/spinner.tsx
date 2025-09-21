import { cn } from '../../lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const sizeVariants = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-4',
};

const colorVariants = {
  primary: 'border-primary-button border-t-transparent',
  secondary: 'border-primary-muted-foreground border-t-transparent',
  white: 'border-white border-t-transparent',
};

export default function Spinner({
  size = 'md',
  variant = 'primary',
  className,
}: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeVariants[size],
        colorVariants[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Loading component with text
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

export function Loading({
  size = 'md',
  variant = 'primary',
  text = 'Loading...',
  className,
}: LoadingProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Spinner size={size} variant={variant} />
      {text && (
        <span className="text-primary-muted-foreground text-sm font-medium">
          {text}
        </span>
      )}
    </div>
  );
}

// Full page loading component
export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-primary-background flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" variant="primary" className="mx-auto mb-4" />
        <p className="text-primary-muted-foreground text-lg">{text}</p>
      </div>
    </div>
  );
}
