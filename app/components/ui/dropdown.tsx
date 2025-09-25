'use client';

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { FiSearch } from 'react-icons/fi';
import { cn } from '../../lib/utils';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
}

interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const Dropdown = ({ children, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery('');
    }
  };

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen: handleSetIsOpen,
        triggerRef,
        searchQuery,
        setSearchQuery,
      }}
    >
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
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearchChange,
}: DropdownContentProps) => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('DropdownContent must be used within a Dropdown');
  }

  const { isOpen, searchQuery, setSearchQuery } = context;
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen, searchable]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

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
        'absolute z-50 min-w-[8rem] overflow-y-auto rounded-lg border border-primary-border bg-primary-card shadow-lg',
        'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        sideClasses[side],
        alignmentClasses[align],
        className
      )}
      role="menu"
      aria-orientation="vertical"
    >
      {searchable && (
        <div className="sticky top-0 z-10 bg-primary-background p-2 border-b border-primary-border">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-primary-input border border-primary-border rounded-md text-primary-foreground placeholder-primary-muted-foreground focus:border-primary-accent focus:outline-none text-sm"
            />
          </div>
        </div>
      )}
      <div className="p-1">{children}</div>
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

// Custom hook to use dropdown context
export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a Dropdown');
  }
  return context;
};

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
};
