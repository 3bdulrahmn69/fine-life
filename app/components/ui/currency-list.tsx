'use client';

import { DropdownItem } from './dropdown';
import { FiCheck } from 'react-icons/fi';
import { CurrencyCode, getAllCurrencies } from '../../lib/currency';
import { useDropdownContext } from './dropdown';

interface CurrencyListProps {
  selectedCurrency: CurrencyCode;
  onSelect: (currency: CurrencyCode) => void;
  filterFunction: (query: string) => ReturnType<typeof getAllCurrencies>;
}

export default function CurrencyList({
  selectedCurrency,
  onSelect,
  filterFunction,
}: CurrencyListProps) {
  // Get search query from dropdown context
  const { searchQuery } = useDropdownContext();

  const filteredCurrencies = filterFunction(searchQuery);

  return (
    <>
      {filteredCurrencies.length > 0 ? (
        filteredCurrencies.map((currency, index) => (
          <div key={currency.currencyCode}>
            <DropdownItem
              onClick={() => onSelect(currency.currencyCode)}
              className={`group relative flex items-center justify-between p-4 transition-all duration-200 ease-in-out rounded-md mx-1 my-1 ${
                selectedCurrency === currency.currencyCode
                  ? 'bg-primary-accent/15 text-primary-accent shadow-sm border border-primary-accent/20'
                  : 'hover:bg-primary-muted/50 text-primary-foreground'
              }`}
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <span className="text-2xl drop-shadow-sm">
                    {currency.flag}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold text-base leading-tight ${
                      selectedCurrency === currency.currencyCode
                        ? 'text-primary-accent'
                        : 'text-primary-foreground group-hover:text-primary-foreground'
                    }`}
                  >
                    {currency.symbol} {currency.code}
                  </div>
                  <div
                    className={`text-sm leading-tight truncate ${
                      selectedCurrency === currency.currencyCode
                        ? 'text-primary-accent/80'
                        : 'text-primary-muted-foreground group-hover:text-primary-muted-foreground/80'
                    }`}
                  >
                    {currency.name}
                  </div>
                </div>
              </div>
              {selectedCurrency === currency.currencyCode && (
                <div className="flex-shrink-0 ml-3">
                  <div className="w-6 h-6 rounded-full bg-primary-accent/20 flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-primary-accent" />
                  </div>
                </div>
              )}
            </DropdownItem>
            {index < filteredCurrencies.length - 1 && (
              <div className="mx-3 border-b border-primary-border/30 last:border-b-0" />
            )}
          </div>
        ))
      ) : (
        <div className="p-8 text-center">
          <div className="text-primary-muted-foreground text-sm font-medium">
            No currencies found matching &ldquo;{searchQuery}&rdquo;
          </div>
          <div className="text-primary-muted-foreground/60 text-xs mt-1">
            Try a different search term
          </div>
        </div>
      )}
    </>
  );
}
