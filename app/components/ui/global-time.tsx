'use client';

import React from 'react';
import { useGlobalPreferences } from '../../providers/preferences-provider';

interface GlobalTimeProps {
  /** The date/time to display - can be Date object, ISO string, or timestamp */
  date: Date | string | number;
  /** Format options for the time display */
  format?: {
    /** Include date in display (default: true) */
    showDate?: boolean;
    /** Include time in display (default: true) */
    showTime?: boolean;
    /** Include timezone name (default: false) */
    showTimezone?: boolean;
    /** Use 12-hour format (default: true) */
    use12Hour?: boolean;
    /** Date format style */
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    /** Time format style */
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    /** Custom format options (overrides other format settings) */
    customOptions?: Intl.DateTimeFormatOptions;
  };
  /** Additional CSS classes */
  className?: string;
  /** Show loading state while timezone is loading */
  showLoading?: boolean;
  /** Fallback timezone if user preferences not loaded (default: 'UTC') */
  fallbackTimezone?: string;
}

/**
 * GlobalTime Component
 *
 * Automatically displays dates/times in the user's preferred timezone.
 * Handles loading states and provides consistent formatting across the app.
 *
 * @example
 * // Basic usage
 * <GlobalTime date={new Date()} />
 *
 * // Custom formatting
 * <GlobalTime
 *   date="2024-01-15T10:30:00Z"
 *   format={{
 *     showDate: true,
 *     showTime: true,
 *     showTimezone: true,
 *     dateStyle: 'medium',
 *     timeStyle: 'short'
 *   }}
 * />
 *
 * // Just time, no date
 * <GlobalTime
 *   date={Date.now()}
 *   format={{ showDate: false, showTime: true }}
 * />
 */
export default function GlobalTime({
  date,
  format = {},
  className = '',
  showLoading = true,
  fallbackTimezone = 'UTC',
}: GlobalTimeProps) {
  const { preferences, isLoading } = useGlobalPreferences();
  const [hasMounted, setHasMounted] = React.useState(false);

  const {
    showDate = true,
    showTime = true,
    showTimezone = false,
    use12Hour = true,
    dateStyle = 'medium',
    timeStyle = 'short',
    customOptions,
  } = format;

  // Ensure component has mounted to avoid hydration issues
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Convert input to Date object
  const dateObj = React.useMemo(() => {
    if (date instanceof Date) return date;
    if (typeof date === 'string' || typeof date === 'number') {
      return new Date(date);
    }
    return new Date();
  }, [date]);

  // Get user timezone or fallback
  const timezone = React.useMemo(() => {
    return preferences?.timezone || fallbackTimezone;
  }, [preferences?.timezone, fallbackTimezone]);

  // Format the date/time according to user preferences
  const formattedTime = React.useMemo(() => {
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    try {
      // Use custom options if provided
      if (customOptions) {
        return dateObj.toLocaleString('en-US', {
          timeZone: timezone,
          ...customOptions,
        });
      }

      // Build format options based on props
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
      };

      // Add date formatting
      if (showDate) {
        switch (dateStyle) {
          case 'full':
            options.weekday = 'long';
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            break;
          case 'long':
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            break;
          case 'medium':
            options.year = 'numeric';
            options.month = 'short';
            options.day = 'numeric';
            break;
          case 'short':
            options.year = '2-digit';
            options.month = 'numeric';
            options.day = 'numeric';
            break;
        }
      }

      // Add time formatting
      if (showTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';

        if (timeStyle === 'full' || timeStyle === 'long') {
          options.second = '2-digit';
        }

        options.hour12 = use12Hour;
      }

      // Add timezone info
      if (showTimezone) {
        options.timeZoneName = timeStyle === 'short' ? 'short' : 'long';
      }

      return dateObj.toLocaleString('en-US', options);
    } catch (error) {
      console.error('Error formatting time:', error);
      return dateObj.toISOString();
    }
  }, [
    dateObj,
    timezone,
    showDate,
    showTime,
    showTimezone,
    use12Hour,
    dateStyle,
    timeStyle,
    customOptions,
  ]);

  // Show loading state if requested and still loading, or if not mounted yet
  if (showLoading && (isLoading || !hasMounted)) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50"></div>
        <span className="opacity-50">Loading time...</span>
      </span>
    );
  }

  // During SSR, show a simple ISO format to avoid hydration mismatch
  if (!hasMounted) {
    return (
      <time
        dateTime={dateObj.toISOString()}
        className={className}
        suppressHydrationWarning={true}
      >
        {dateObj.toISOString().split('T')[0]}{' '}
        {dateObj.toISOString().split('T')[1].split('.')[0]}
      </time>
    );
  }

  return (
    <time
      dateTime={dateObj.toISOString()}
      className={className}
      title={`${formattedTime} (${timezone})`}
    >
      {formattedTime}
    </time>
  );
}

/**
 * Utility hook for formatting times without rendering
 */
export function useGlobalTime() {
  const { preferences, isLoading } = useGlobalPreferences();

  const formatTime = React.useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = date instanceof Date ? date : new Date(date);
      const timezone = preferences?.timezone || 'UTC';

      try {
        return dateObj.toLocaleString('en-US', {
          timeZone: timezone,
          ...options,
        });
      } catch (error) {
        console.error('Error formatting time:', error);
        return dateObj.toISOString();
      }
    },
    [preferences?.timezone]
  );

  const getTimezone = React.useCallback(() => {
    return preferences?.timezone || 'UTC';
  }, [preferences?.timezone]);

  return {
    formatTime,
    getTimezone,
    isLoading,
    timezone: preferences?.timezone || 'UTC',
  };
}
