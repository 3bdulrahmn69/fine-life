'use client';

import { useState } from 'react';
import {
  parseCurrencyInput,
  getCurrencySymbol,
  CurrencyCode,
  getAllCurrencies,
} from '../../lib/currency';
import { Dropdown, DropdownTrigger, DropdownContent } from './dropdown';
import CurrencyList from './currency-list';
import { FiChevronDown } from 'react-icons/fi';

interface AmountCurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  showCurrencyName?: boolean;
}

export default function AmountCurrencyInput({
  value,
  onChange,
  currency,
  onCurrencyChange,
  placeholder = '0.00',
  className = '',
  error,
  required = false,
  disabled = false,
  label = 'Amount',
  showCurrencyName = false,
}: AmountCurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  const currencies = getAllCurrencies();
  const selectedCurrency = currencies.find((c) => c.currencyCode === currency);

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value);
  };

  const handleBlur = () => {
    setIsFocused(false);
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

  const filterCurrencies = (query: string) => {
    if (!query.trim()) return currencies;

    const searchTerm = query.toLowerCase();
    return currencies.filter(
      (curr) =>
        curr.name.toLowerCase().includes(searchTerm) ||
        curr.code.toLowerCase().includes(searchTerm) ||
        curr.currencyCode.toLowerCase().includes(searchTerm)
    );
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className="flex items-stretch">
        {/* Amount Input */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-muted-foreground pointer-events-none z-10">
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
              w-full h-full pl-8 pr-3 py-3 bg-primary-input text-primary-input-foreground 
              border-2 border-primary-border rounded-l-lg border-r-0
              focus:ring-2 focus:ring-primary-accent focus:border-primary-accent 
              transition-all duration-200
              ${error ? 'border-destructive focus:border-destructive' : ''}
              ${
                disabled ? 'bg-primary-muted cursor-not-allowed opacity-50' : ''
              }
            `}
          />
        </div>

        {/* Currency Selector */}
        <div className="relative flex">
          <Dropdown>
            <DropdownTrigger
              className={`
                flex items-center h-full px-3 py-3 bg-primary-input border-2 border-l-0 border-primary-border rounded-r-lg
                hover:bg-primary-muted/50 focus:ring-2 focus:ring-primary-accent focus:border-primary-accent
                transition-all duration-200 min-w-[80px] sm:min-w-[120px]
                ${error ? 'border-destructive focus:border-destructive' : ''}
                ${
                  disabled
                    ? 'bg-primary-muted cursor-not-allowed opacity-50 pointer-events-none'
                    : 'cursor-pointer'
                }
              `}
              asChild
            >
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="text-lg flex-shrink-0">
                    {selectedCurrency?.flag || '💰'}
                  </span>
                  <div className="hidden sm:block text-left min-w-0">
                    <div className="font-medium text-primary-foreground text-sm">
                      {selectedCurrency?.code || currency}
                    </div>
                    {showCurrencyName && (
                      <div className="text-xs text-primary-muted-foreground truncate max-w-[60px]">
                        {selectedCurrency?.name || 'Currency'}
                      </div>
                    )}
                  </div>
                  <div className="sm:hidden text-xs font-medium text-primary-foreground">
                    {selectedCurrency?.code || currency}
                  </div>
                </div>
                <FiChevronDown className="w-4 h-4 text-primary-muted-foreground flex-shrink-0 ml-1" />
              </div>
            </DropdownTrigger>

            <DropdownContent
              searchable
              searchPlaceholder="Search currencies..."
              align="end"
              className="w-80"
            >
              <CurrencyList
                selectedCurrency={currency}
                onSelect={onCurrencyChange}
                filterFunction={filterCurrencies}
              />
            </DropdownContent>
          </Dropdown>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
