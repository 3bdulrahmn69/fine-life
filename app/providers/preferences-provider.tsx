'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useSession } from 'next-auth/react';
import { CurrencyCode } from '../lib/currency';

export interface UserPreferences {
  currency: CurrencyCode;
  timezone: string;
}

interface PreferencesContextType {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updatePreferences: (
    updates: Partial<UserPreferences>
  ) => Promise<{ success: boolean }>;
}

const defaultPreferences: UserPreferences = {
  currency: 'USD',
  timezone: 'UTC',
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

interface PreferencesProviderProps {
  children: React.ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch preferences from API
  const fetchPreferences = useCallback(
    async (showLoading = true) => {
      if (!session?.user?.id) {
        // Set defaults when no session
        setPreferences(defaultPreferences);
        setIsLoading(false);
        setHasInitialized(true);
        return;
      }

      try {
        if (showLoading) setIsLoading(true);
        setError(null);

        const response = await fetch('/api/preferences');

        if (!response.ok) {
          // If API fails, use defaults
          console.warn('Failed to fetch preferences, using defaults');
          setPreferences(defaultPreferences);
          setError(null); // Don't show error for this
          return;
        }

        const data = await response.json();

        // Merge with defaults to ensure all fields exist
        const mergedPreferences = {
          ...defaultPreferences,
          ...data,
        };

        setPreferences(mergedPreferences);
      } catch (error) {
        console.error('Error fetching preferences:', error);
        // Use defaults on error
        setPreferences(defaultPreferences);
        setError(null); // Don't show error to user, just use defaults
      } finally {
        setIsLoading(false);
        setHasInitialized(true);
      }
    },
    [session?.user?.id]
  );

  // Update preferences (optimistic updates)
  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      // Optimistic update
      setPreferences((prev) =>
        prev ? { ...prev, ...updates } : { ...defaultPreferences, ...updates }
      );

      try {
        const response = await fetch('/api/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update preferences');
        }

        const data = await response.json();

        // Update with server response
        setPreferences((prev) => ({
          ...defaultPreferences,
          ...prev,
          currency:
            data.currency || prev?.currency || defaultPreferences.currency,
          timezone:
            data.timezone || prev?.timezone || defaultPreferences.timezone,
        }));

        return { success: true };
      } catch (error) {
        // Revert optimistic update on error
        await fetchPreferences(false);

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update preferences';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [session?.user?.id, fetchPreferences]
  );

  // Refetch preferences
  const refetch = useCallback(async () => {
    await fetchPreferences(true);
  }, [fetchPreferences]);

  // Initial load when session changes
  useEffect(() => {
    if (!hasInitialized || session?.user?.id) {
      fetchPreferences(true);
    }
  }, [session?.user?.id, hasInitialized, fetchPreferences]);

  // Provide context value
  const contextValue: PreferencesContextType = {
    preferences,
    isLoading,
    error,
    refetch,
    updatePreferences,
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Hook to use preferences context
export function useGlobalPreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);

  if (context === undefined) {
    throw new Error(
      'useGlobalPreferences must be used within a PreferencesProvider'
    );
  }

  return context;
}

// Backward compatibility hook (wrapper around global preferences)
export function useUserPreferences() {
  const { preferences, isLoading, error, updatePreferences } =
    useGlobalPreferences();

  const updateCurrency = useCallback(
    async (currency: CurrencyCode) => {
      return updatePreferences({ currency });
    },
    [updatePreferences]
  );

  const updateTimezone = useCallback(
    async (timezone: string) => {
      return updatePreferences({ timezone });
    },
    [updatePreferences]
  );

  return {
    preferences: preferences || defaultPreferences,
    isLoading,
    error,
    updatePreferences,
    updateCurrency,
    updateTimezone,
  };
}
