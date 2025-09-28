'use client';

import React from 'react';
import { CurrencyCode, getAllCurrencies } from '../../lib/currency';
import { Dropdown, DropdownTrigger, DropdownContent } from './dropdown';
import CurrencyList from './currency-list';
import { FiChevronDown } from 'react-icons/fi';

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function CurrencySelector({
  value,
  onChange,
  disabled = false,
  error,
  label = 'Currency',
  required = false,
  className = '',
}: CurrencySelectorProps) {
  const currencies = getAllCurrencies();
  const selectedCurrency = currencies.find((c) => c.currencyCode === value);

  const filterCurrencies = (query: string) => {
    if (!query.trim()) return currencies;

    const searchTerm = query.toLowerCase();
    return currencies.filter(
      (currency) =>
        currency.name.toLowerCase().includes(searchTerm) ||
        currency.code.toLowerCase().includes(searchTerm) ||
        currency.currencyCode.toLowerCase().includes(searchTerm)
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <Dropdown>
        <DropdownTrigger
          className={`w-full flex items-center justify-between p-3 bg-primary-input border-2 rounded-lg transition-all duration-200 hover:border-primary-accent focus:border-primary-accent focus:outline-none ${
            error ? 'border-destructive' : 'border-primary-border'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          asChild
        >
          <div className="flex items-center space-x-3 min-w-0">
            <span className="text-2xl flex-shrink-0">
              {selectedCurrency?.flag || '💰'}
            </span>
            <div className="text-left flex-1 min-w-0">
              <div className="font-medium text-primary-foreground">
                {selectedCurrency?.symbol} {selectedCurrency?.code || value}
              </div>
              <div className="text-sm text-primary-muted-foreground truncate">
                {selectedCurrency?.name || 'Select currency'}
              </div>
            </div>
            <FiChevronDown className="w-5 h-5 text-primary-muted-foreground flex-shrink-0" />
          </div>
        </DropdownTrigger>

        <DropdownContent
          searchable
          searchPlaceholder="Search currencies..."
          align="start"
        >
          <CurrencyList
            selectedCurrency={value}
            onSelect={onChange}
            filterFunction={filterCurrencies}
          />
        </DropdownContent>
      </Dropdown>

      {error && (
        <p className="mt-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
