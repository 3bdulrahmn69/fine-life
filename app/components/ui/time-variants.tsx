'use client';

import React from 'react';
import GlobalTime from './global-time';

// Common time component variants for easy use throughout the app

interface TimeComponentProps {
  date: Date | string | number;
  className?: string;
}

/**
 * Display just the date in user's timezone
 * Example: "Sep 27, 2025"
 */
export function TimeDate({ date, className }: TimeComponentProps) {
  return (
    <GlobalTime
      date={date}
      format={{
        showDate: true,
        showTime: false,
        dateStyle: 'medium',
      }}
      className={className}
    />
  );
}

/**
 * Display just the time in user's timezone
 * Example: "2:30 PM"
 */
export function TimeOnly({ date, className }: TimeComponentProps) {
  return (
    <GlobalTime
      date={date}
      format={{
        showDate: false,
        showTime: true,
        timeStyle: 'short',
      }}
      className={className}
    />
  );
}

/**
 * Display date and time in user's timezone
 * Example: "Sep 27, 2025 at 2:30 PM"
 */
export function DateTime({ date, className }: TimeComponentProps) {
  return (
    <GlobalTime
      date={date}
      format={{
        showDate: true,
        showTime: true,
        dateStyle: 'medium',
        timeStyle: 'short',
      }}
      className={className}
    />
  );
}

/**
 * Display full date and time with timezone
 * Example: "Thursday, September 27, 2025 at 2:30:45 PM GMT+3"
 */
export function DateTimeFull({ date, className }: TimeComponentProps) {
  return (
    <GlobalTime
      date={date}
      format={{
        showDate: true,
        showTime: true,
        showTimezone: true,
        dateStyle: 'full',
        timeStyle: 'medium',
      }}
      className={className}
    />
  );
}

/**
 * Display short date and time
 * Example: "9/27/25, 2:30 PM"
 */
export function DateTimeShort({ date, className }: TimeComponentProps) {
  return (
    <GlobalTime
      date={date}
      format={{
        showDate: true,
        showTime: true,
        dateStyle: 'short',
        timeStyle: 'short',
      }}
      className={className}
    />
  );
}

/**
 * Display relative time with tooltip showing exact time
 * Example: "2 hours ago" with tooltip "Sep 27, 2025 at 12:30 PM"
 */
export function RelativeTime({ date, className }: TimeComponentProps) {
  const dateObj = React.useMemo(() => {
    return date instanceof Date ? date : new Date(date);
  }, [date]);

  const relativeTime = React.useMemo(() => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000
    );

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }, [dateObj]);

  return (
    <span className={className} title="">
      <GlobalTime
        date={date}
        format={{
          showDate: true,
          showTime: true,
          dateStyle: 'medium',
          timeStyle: 'short',
        }}
        showLoading={false}
        className="sr-only"
      />
      <span aria-hidden="true">{relativeTime}</span>
    </span>
  );
}

/**
 * Display time in 24-hour format
 * Example: "14:30"
 */
export function Time24Hour({ date, className }: TimeComponentProps) {
  return (
    <GlobalTime
      date={date}
      format={{
        showDate: false,
        showTime: true,
        use12Hour: false,
        timeStyle: 'short',
      }}
      className={className}
    />
  );
}

/**
 * Display just the day and month
 * Example: "Sep 27"
 */
export function DayMonth({ date, className }: TimeComponentProps) {
  return (
    <GlobalTime
      date={date}
      format={{
        customOptions: {
          month: 'short',
          day: 'numeric',
        },
      }}
      className={className}
    />
  );
}

/**
 * Display weekday and time
 * Example: "Thursday, 2:30 PM"
 */
export function WeekdayTime({ date, className }: TimeComponentProps) {
  return (
    <GlobalTime
      date={date}
      format={{
        customOptions: {
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        },
      }}
      className={className}
    />
  );
}
