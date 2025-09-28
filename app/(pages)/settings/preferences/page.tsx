'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  FiSettings,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiChevronDown,
} from 'react-icons/fi';
import ThemeToggle from '../../../components/ui/theme-toggle';
import SettingsLayout from '../SettingsLayout';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from '../../../components/ui/dropdown';
import CurrencyList from '../../../components/ui/currency-list';
import TimezoneList from '../../../components/ui/timezone-list';
import { useUserPreferences } from '../../../hooks/useUserPreferences';
import { CurrencyCode, getAllCurrencies } from '../../../lib/currency';
import { Loading } from '../../../components/ui/spinner';
import GlobalTime from '../../../components/ui/global-time';

export default function PreferencesPage() {
  const { preferences, isLoading, error, updateCurrency, updateTimezone } =
    useUserPreferences();
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [selectedCurrencyCode, setSelectedCurrencyCode] =
    useState<CurrencyCode>('USD');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC');

  // Get all currencies and find the selected one
  const currencies = useMemo(() => getAllCurrencies(), []);
  const selectedCurrency = currencies.find(
    (c) => c.currencyCode === selectedCurrencyCode
  );

  // Update local state when preferences are loaded
  React.useEffect(() => {
    if (preferences && !isLoading) {
      if (
        preferences.currency &&
        preferences.currency !== selectedCurrencyCode
      ) {
        setSelectedCurrencyCode(preferences.currency);
      }
      if (preferences.timezone && preferences.timezone !== selectedTimezone) {
        setSelectedTimezone(preferences.timezone);
      }
    }
  }, [preferences.currency, preferences.timezone, isLoading]);

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setSelectedCurrencyCode(currency);
    setSaveStatus('idle');
  };

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
    setSaveStatus('idle');
  };

  const handleSavePreferences = async () => {
    try {
      setSaveStatus('saving');

      // Update currency if changed
      if (selectedCurrencyCode !== preferences.currency) {
        await updateCurrency(selectedCurrencyCode);
      }

      // Update timezone if changed
      if (selectedTimezone !== preferences.timezone) {
        await updateTimezone(selectedTimezone);
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const hasUnsavedChanges =
    selectedCurrencyCode !== preferences.currency ||
    selectedTimezone !== preferences.timezone;

  // Filter currencies based on search query
  const filterCurrencies = (searchQuery: string) => {
    if (!searchQuery) return currencies;
    const query = searchQuery.toLowerCase();
    return currencies.filter(
      (currency) =>
        currency.name.toLowerCase().includes(query) ||
        currency.code.toLowerCase().includes(query) ||
        currency.currencyCode.toLowerCase().includes(query)
    );
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
          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loading
                size="lg"
                variant="primary"
                text="Loading your preferences..."
              />
            </div>
          ) : (
            <>
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

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                    {error}
                  </div>
                )}

                {/* Currency Dropdown */}
                <div className="w-full max-w-lg">
                  <Dropdown>
                    <DropdownTrigger
                      className="w-full flex items-center justify-between p-3 bg-primary-card border-2 border-primary-border rounded-lg transition-all duration-200 hover:border-primary-accent focus:border-primary-accent focus:outline-none"
                      asChild
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">
                          {selectedCurrency?.flag}
                        </span>
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-medium text-primary-foreground">
                            {selectedCurrency?.symbol} {selectedCurrency?.code}
                          </div>
                          <div className="text-sm text-primary-muted-foreground truncate">
                            {selectedCurrency?.name}
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
                        selectedCurrency={selectedCurrencyCode}
                        onSelect={handleCurrencyChange}
                        filterFunction={filterCurrencies}
                      />
                    </DropdownContent>
                  </Dropdown>
                </div>
              </div>

              {/* Timezone Selection */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiSettings className="w-5 h-5 mr-2 text-primary-foreground" />
                  <div>
                    <h3 className="text-lg font-medium text-primary-foreground">
                      Timezone
                    </h3>
                    <p className="text-sm text-primary-text">
                      Select your timezone for accurate date and time displays
                    </p>
                  </div>
                </div>

                {/* Timezone Dropdown */}
                <div className="w-full max-w-lg">
                  <Dropdown>
                    <DropdownTrigger
                      className="w-full flex items-center justify-between p-3 bg-primary-card border-2 border-primary-border rounded-lg transition-all duration-200 hover:border-primary-accent focus:border-primary-accent focus:outline-none"
                      asChild
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-medium text-primary-foreground truncate">
                            {selectedTimezone}
                          </div>
                          <GlobalTime
                            date={new Date()}
                            format={{
                              showDate: false,
                              showTime: true,
                              showTimezone: true,
                              timeStyle: 'short',
                            }}
                            fallbackTimezone={selectedTimezone}
                            showLoading={false}
                            className="text-sm text-primary-muted-foreground truncate"
                          />
                        </div>
                        <FiChevronDown className="w-5 h-5 text-primary-muted-foreground flex-shrink-0" />
                      </div>
                    </DropdownTrigger>

                    <DropdownContent
                      searchable
                      searchPlaceholder="Search timezones..."
                      align="start"
                    >
                      <TimezoneList
                        selectedTimezone={selectedTimezone}
                        onSelect={handleTimezoneChange}
                      />
                    </DropdownContent>
                  </Dropdown>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-primary-border">
                <button
                  onClick={handleSavePreferences}
                  disabled={!hasUnsavedChanges || saveStatus === 'saving'}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    hasUnsavedChanges && saveStatus !== 'saving'
                      ? 'bg-primary-accent text-primary-accent-foreground hover:bg-primary-accent/90'
                      : 'bg-primary-muted text-primary-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {saveStatus === 'saving' && (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </div>
                  )}
                  {saveStatus === 'saved' && (
                    <div className="flex items-center">
                      <FiCheck className="w-4 h-4 mr-1" />
                      Saved
                    </div>
                  )}
                  {saveStatus === 'error' && (
                    <div className="flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      Error
                    </div>
                  )}
                  {saveStatus === 'idle' && hasUnsavedChanges && 'Save Changes'}
                  {saveStatus === 'idle' && !hasUnsavedChanges && 'Saved'}
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </SettingsLayout>
  );
}
