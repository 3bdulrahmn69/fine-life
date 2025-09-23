'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { FiSettings, FiDollarSign } from 'react-icons/fi';
import ThemeToggle from '../../../components/ui/theme-toggle';
import SettingsLayout from '../SettingsLayout';
import { getAllCurrencies, CurrencyCode } from '../../../lib/currency';

export default function PreferencesPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [isLoading, setIsLoading] = useState(false);

  const currencies = getAllCurrencies();

  // Load user preferences
  useEffect(() => {
    // TODO: Load from user preferences API
    // For now, default to USD
    setSelectedCurrency('USD');
  }, []);

  const handleCurrencyChange = async (currency: CurrencyCode) => {
    try {
      setIsLoading(true);
      setSelectedCurrency(currency);

      // TODO: Save to user preferences API
      // await fetch('/api/user/preferences', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currency })
      // });

      console.log('Currency preference saved:', currency);
    } catch (error) {
      console.error('Error saving currency preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout>
      <Card className="bg-primary-card border-primary-border">
        <CardHeader>
          <CardTitle className="flex items-center text-primary-foreground">
            <FiSettings className="w-5 h-5 mr-2" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your application experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-primary-foreground">
                Theme
              </h3>
              <p className="text-sm text-primary-text">
                Choose your preferred theme
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Currency Selection */}
          <div className="space-y-4">
            <div className="flex items-center">
              <FiDollarSign className="w-5 h-5 mr-2 text-primary-foreground" />
              <div>
                <h3 className="text-lg font-medium text-primary-foreground">
                  Currency
                </h3>
                <p className="text-sm text-primary-text">
                  Select your preferred currency for displaying amounts
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {currencies.map((currency) => (
                <button
                  key={currency.currencyCode}
                  onClick={() => handleCurrencyChange(currency.currencyCode)}
                  disabled={isLoading}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedCurrency === currency.currencyCode
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  } ${
                    isLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">{currency.symbol}</span>
                    <div>
                      <div className="font-medium text-sm">{currency.code}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
}
