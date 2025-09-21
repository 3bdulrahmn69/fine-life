'use client';

import { useRouter } from 'next/navigation';
import { Button } from './button';
import { FiArrowLeft } from 'react-icons/fi';

interface BackButtonProps {
  href?: string;
  label?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onClick?: () => void;
  iconOnly?: boolean;
}

export default function BackButton({
  href,
  label = 'Back',
  variant = 'ghost',
  size = 'default',
  className = '',
  onClick,
  iconOnly = false,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={`flex items-center gap-2 text-primary-text hover:text-primary-foreground ${className}`}
    >
      <FiArrowLeft className="w-4 h-4" />
      {!iconOnly && <span>{label}</span>}
    </Button>
  );
}
