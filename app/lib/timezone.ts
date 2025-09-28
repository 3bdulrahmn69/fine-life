// Timezone utilities for the Fine Life app

/**
 * Format a date according to user's timezone preference
 */
export function formatDateInTimezone(
  date: Date,
  timezone: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  try {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      ...options,
    });
  } catch (error) {
    console.warn(
      `Invalid timezone: ${timezone}, falling back to local timezone`
    );
    return date.toLocaleString('en-US', options);
  }
}

/**
 * Format a date for display in automatic transactions (user-friendly format)
 */
export function formatNextExecutionDate(
  date: Date,
  timezone: string = 'UTC'
): string {
  return formatDateInTimezone(date, timezone, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a full date and time for user display
 */
export function formatDateTime(date: Date, timezone: string = 'UTC'): string {
  return formatDateInTimezone(date, timezone, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get user's current timezone if available
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Convert a UTC date to user's timezone for display
 */
export function utcToUserTimezone(utcDate: Date, userTimezone: string): Date {
  // Note: This returns the same Date object but when displayed with the timezone,
  // it will show the correct local time
  return utcDate;
}

/**
 * Common timezone options for dropdowns
 */
export const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'America/Chicago', label: 'Central Time (US)' },
  { value: 'America/Denver', label: 'Mountain Time (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Baghdad', label: 'Baghdad (AST)' },
  { value: 'Asia/Riyadh', label: 'Riyadh (AST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
];

export default {
  formatDateInTimezone,
  formatNextExecutionDate,
  formatDateTime,
  getUserTimezone,
  utcToUserTimezone,
  COMMON_TIMEZONES,
};
