import { cn } from '@/app/lib/utils';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'card' | 'accent' | 'none';
  as?: 'section' | 'div';
  id?: string;
}

const sizeClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = {
  sm: 'px-4 py-8',
  md: 'px-4 py-12',
  lg: 'px-4 py-16',
  xl: 'px-4 py-20',
};

const backgroundClasses = {
  default: '',
  card: 'bg-primary-card/30',
  accent: 'bg-primary-accent/5',
  none: '',
};

export default function Container({
  children,
  className,
  size = 'lg',
  padding = 'lg',
  background = 'default',
  as: Component = 'section',
  id,
}: ContainerProps) {
  return (
    <Component
      id={id}
      className={cn(
        'container mx-auto',
        sizeClasses[size],
        paddingClasses[padding],
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </Component>
  );
}
