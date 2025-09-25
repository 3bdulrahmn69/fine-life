'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { CurrencyCode } from '../lib/currency';

export interface UserPreferences {
  currency: CurrencyCode;
}

const defaultPreferences: UserPreferences = {
  currency: 'USD',
};

export const useUserPreferences = () => {
  const { data: session } = useSession();
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences from API
  const fetchPreferences = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/preferences');

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      setPreferences({
        currency: data.currency || 'USD',
      });
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load preferences'
      );
      // Use defaults on error
      setPreferences(defaultPreferences);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Update preferences
  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      // Only allow currency updates
      if (!updates.currency) {
        throw new Error('Only currency updates are allowed');
      }

      try {
        setError(null);

        const response = await fetch('/api/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currency: updates.currency }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update currency');
        }

        // Update local state
        setPreferences((prev) => ({ ...prev, ...updates }));

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update currency';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [session?.user?.id]
  );

  // Update currency specifically
  const updateCurrency = useCallback(
    async (currency: CurrencyCode) => {
      return updatePreferences({ currency });
    },
    [updatePreferences]
  );

  // Fetch preferences when session changes
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    updateCurrency,
    refetch: fetchPreferences,
  };
};
