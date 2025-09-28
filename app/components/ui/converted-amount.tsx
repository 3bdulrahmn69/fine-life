'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, CurrencyCode } from '../../lib/currency';
import { currencyConverter } from '../../lib/currency-converter';

interface ConvertedAmountProps {
  /** The original amount in the original currency */
  amount: number;
  /** The currency the amount was originally in */
  originalCurrency: CurrencyCode;
  /** The currency to display the amount in (user's preference) */
  displayCurrency: CurrencyCode;
  /** Additional CSS classes */
  className?: string;
  /** Show original amount in a tooltip or text */
  showOriginal?: boolean;
  /** Loading placeholder text */
  loadingText?: string;
}

export default function ConvertedAmount({
  amount,
  originalCurrency,
  displayCurrency,
  className = '',
  showOriginal = false,
  loadingText = '...',
}: ConvertedAmountProps) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If currencies are the same, no conversion needed
    if (originalCurrency === displayCurrency) {
      setConvertedAmount(amount);
      return;
    }

    const convertAmount = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await currencyConverter.convertCurrency(
          amount,
          originalCurrency,
          displayCurrency
        );
        setConvertedAmount(result.convertedAmount);
      } catch (err) {
        console.error('Currency conversion error:', err);
        setError('Conversion failed');
        // Fallback to original amount if conversion fails
        setConvertedAmount(amount);
      } finally {
        setIsLoading(false);
      }
    };

    convertAmount();
  }, [amount, originalCurrency, displayCurrency]);

  // Show loading state
  if (isLoading) {
    return <span className={className}>{loadingText}</span>;
  }

  // Show error state (fallback to original amount)
  if (error && convertedAmount === null) {
    return (
      <span
        className={className}
        title={`Conversion failed. Showing original amount in ${originalCurrency}`}
      >
        {formatCurrency(amount, originalCurrency)}
      </span>
    );
  }

  // Show converted amount
  const displayAmount = convertedAmount ?? amount;
  const formattedAmount = formatCurrency(displayAmount, displayCurrency);

  if (showOriginal && originalCurrency !== displayCurrency) {
    const originalFormatted = formatCurrency(amount, originalCurrency);

    return (
      <span className={className}>
        <span title={`Original: ${originalFormatted}`}>{formattedAmount}</span>
        <span className="text-xs text-primary-muted-foreground ml-1">
          (was {originalFormatted})
        </span>
      </span>
    );
  }

  return (
    <span
      className={className}
      title={
        originalCurrency !== displayCurrency
          ? `Original: ${formatCurrency(amount, originalCurrency)}`
          : undefined
      }
    >
      {formattedAmount}
    </span>
  );
}

/**
 * Hook for converting amounts programmatically
 */
export function useConvertedAmount(
  amount: number,
  originalCurrency: CurrencyCode,
  displayCurrency: CurrencyCode
) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (originalCurrency === displayCurrency) {
      setConvertedAmount(amount);
      return;
    }

    const convertAmount = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await currencyConverter.convertCurrency(
          amount,
          originalCurrency,
          displayCurrency
        );
        setConvertedAmount(result.convertedAmount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        setConvertedAmount(amount); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    convertAmount();
  }, [amount, originalCurrency, displayCurrency]);

  return {
    convertedAmount: convertedAmount ?? amount,
    isLoading,
    error,
    formattedAmount: formatCurrency(convertedAmount ?? amount, displayCurrency),
    originalFormatted: formatCurrency(amount, originalCurrency),
  };
}
