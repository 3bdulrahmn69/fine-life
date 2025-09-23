'use client';

import { useState } from 'react';
import {
  parseCurrencyInput,
  getCurrencySymbol,
  CurrencyCode,
} from '../../lib/currency';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currency?: CurrencyCode;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function AmountInput({
  value,
  onChange,
  currency = 'USD',
  placeholder = '0.00',
  className = '',
  error,
  required = false,
  disabled = false,
}: AmountInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number when focused
    setDisplayValue(value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format for display when not focused
    const numericValue = parseCurrencyInput(value);
    if (numericValue !== 0) {
      setDisplayValue(numericValue.toString());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow only numbers, decimal point, and minus sign
    const cleaned = inputValue.replace(/[^\d.-]/g, '');

    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setDisplayValue(cleaned);
    onChange(cleaned);
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-muted-foreground pointer-events-none">
          {currencySymbol}
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={isFocused ? displayValue : value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full pl-8 pr-3 py-2 bg-primary-input text-primary-input-foreground border border-primary-border rounded-lg 
            focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-colors
            ${error ? 'border-red-500' : ''}
            ${disabled ? 'bg-primary-muted cursor-not-allowed opacity-50' : ''}
            ${className}
          `}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
