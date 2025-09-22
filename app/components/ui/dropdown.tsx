'use client';

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { cn } from '../../lib/utils';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

interface DropdownTriggerProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  ariaLabel?: string;
}

interface DropdownContentProps {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
}

interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const Dropdown = ({ children, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className={cn('relative inline-block', className)} ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const DropdownTrigger = ({
  children,
  className,
  asChild = false,
  ariaLabel = 'Toggle Dropdown',
}: DropdownTriggerProps) => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('DropdownTrigger must be used within a Dropdown');
  }

  const { isOpen, setIsOpen, triggerRef } = context;

  if (asChild) {
    return (
      <div onClick={() => setIsOpen(!isOpen)} className={className}>
        {children}
      </div>
    );
  }

  return (
    <button
      ref={triggerRef}
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        'bg-primary-button text-primary-button-foreground hover:bg-primary-button-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-button focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

const DropdownContent = ({
  children,
  className,
  align = 'center',
  side = 'bottom',
}: DropdownContentProps) => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('DropdownContent must be used within a Dropdown');
  }

  const { isOpen } = context;

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  const sideClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2 top-0',
    right: 'left-full ml-2 top-0',
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-primary-border bg-primary-card p-1 shadow-lg',
        'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        sideClasses[side],
        alignmentClasses[align],
        className
      )}
      role="menu"
      aria-orientation="vertical"
    >
      {children}
    </div>
  );
};

const DropdownItem = ({
  children,
  className,
  onClick,
  disabled = false,
  ...props
}: DropdownItemProps) => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('DropdownItem must be used within a Dropdown');
  }

  const { setIsOpen } = context;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      if (onClick) {
        onClick(event);
      }
      setIsOpen(false);
    }
  };

  return (
    <button
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors',
        'hover:bg-primary-muted hover:text-primary-muted-foreground focus:bg-primary-muted focus:text-primary-muted-foreground',
        'text-primary-card-foreground',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      role="menuitem"
      {...props}
    >
      {children}
    </button>
  );
};

const DropdownSeparator = ({ className }: { className?: string }) => (
  <div
    className={cn('my-1 h-px bg-primary-border', className)}
    role="separator"
  />
);

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
};
