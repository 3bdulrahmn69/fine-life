'use client';

import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showPasswordToggle?: boolean;
  icon?: ReactNode; // For backward compatibility
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      icon, // backward compatibility
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Use leftIcon or icon for backward compatibility
    const actualLeftIcon = leftIcon || icon;

    const inputType = useMemo(
      () => (showPasswordToggle ? (showPassword ? 'text' : 'password') : type),
      [showPasswordToggle, showPassword, type]
    );

    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    // If showPasswordToggle is true, override rightIcon with password toggle
    const actualRightIcon = showPasswordToggle ? (
      <button
        type="button"
        tabIndex={-1}
        onClick={togglePasswordVisibility}
        className="text-primary-muted-foreground hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary-button focus:ring-offset-1 rounded p-1"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <FaEyeSlash className="w-4 h-4" aria-hidden="true" />
        ) : (
          <FaEye className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    ) : (
      rightIcon
    );

    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-sm font-medium text-primary-foreground block">
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {actualLeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-muted-foreground pointer-events-none">
              {actualLeftIcon}
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              'flex h-11 w-full rounded-lg border border-primary-border bg-primary-input py-3 text-sm text-primary-input-foreground placeholder:text-primary-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-button focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
              actualLeftIcon && actualRightIcon ? 'pl-10 pr-10' : '',
              actualLeftIcon && !actualRightIcon ? 'pl-10 pr-4' : '',
              !actualLeftIcon && actualRightIcon ? 'pl-4 pr-10' : '',
              !actualLeftIcon && !actualRightIcon ? 'px-4' : '',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${props.id || 'input'}-error` : undefined
            }
            {...props}
          />
          {actualRightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-muted-foreground">
              {actualRightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            className="text-red-500 text-sm flex items-center gap-2 mt-1"
            role="alert"
            id={`${props.id || 'input'}-error`}
          >
            <span
              className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-xs font-semibold text-red-500"
              aria-hidden="true"
            >
              !
            </span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
