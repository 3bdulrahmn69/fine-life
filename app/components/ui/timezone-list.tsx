'use client';

import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { useDropdownContext } from './dropdown';

interface TimezoneListProps {
  selectedTimezone: string;
  onSelect: (timezone: string) => void;
}

// Common timezones organized by regions
const TIMEZONES = [
  // UTC and Popular
  { id: 'UTC', name: 'UTC (Coordinated Universal Time)', offset: '+00:00' },

  // Africa
  { id: 'Africa/Cairo', name: 'Cairo (Egypt)', offset: '+02:00' },
  { id: 'Africa/Lagos', name: 'Lagos (Nigeria)', offset: '+01:00' },
  {
    id: 'Africa/Johannesburg',
    name: 'Johannesburg (South Africa)',
    offset: '+02:00',
  },

  // Asia
  { id: 'Asia/Dubai', name: 'Dubai (UAE)', offset: '+04:00' },
  { id: 'Asia/Baghdad', name: 'Baghdad (Iraq)', offset: '+03:00' },
  { id: 'Asia/Riyadh', name: 'Riyadh (Saudi Arabia)', offset: '+03:00' },
  { id: 'Asia/Kuwait', name: 'Kuwait', offset: '+03:00' },
  { id: 'Asia/Qatar', name: 'Qatar', offset: '+03:00' },
  { id: 'Asia/Bahrain', name: 'Bahrain', offset: '+03:00' },
  { id: 'Asia/Tokyo', name: 'Tokyo (Japan)', offset: '+09:00' },
  { id: 'Asia/Shanghai', name: 'Shanghai (China)', offset: '+08:00' },
  { id: 'Asia/Kolkata', name: 'Mumbai/Delhi (India)', offset: '+05:30' },
  { id: 'Asia/Karachi', name: 'Karachi (Pakistan)', offset: '+05:00' },
  { id: 'Asia/Singapore', name: 'Singapore', offset: '+08:00' },
  { id: 'Asia/Bangkok', name: 'Bangkok (Thailand)', offset: '+07:00' },

  // Europe
  { id: 'Europe/London', name: 'London (UK)', offset: '+00:00/+01:00' },
  { id: 'Europe/Paris', name: 'Paris (France)', offset: '+01:00/+02:00' },
  { id: 'Europe/Berlin', name: 'Berlin (Germany)', offset: '+01:00/+02:00' },
  { id: 'Europe/Rome', name: 'Rome (Italy)', offset: '+01:00/+02:00' },
  { id: 'Europe/Madrid', name: 'Madrid (Spain)', offset: '+01:00/+02:00' },
  { id: 'Europe/Moscow', name: 'Moscow (Russia)', offset: '+03:00' },
  { id: 'Europe/Istanbul', name: 'Istanbul (Turkey)', offset: '+03:00' },

  // North America
  {
    id: 'America/New_York',
    name: 'New York (Eastern Time)',
    offset: '-05:00/-04:00',
  },
  {
    id: 'America/Chicago',
    name: 'Chicago (Central Time)',
    offset: '-06:00/-05:00',
  },
  {
    id: 'America/Denver',
    name: 'Denver (Mountain Time)',
    offset: '-07:00/-06:00',
  },
  {
    id: 'America/Los_Angeles',
    name: 'Los Angeles (Pacific Time)',
    offset: '-08:00/-07:00',
  },
  { id: 'America/Toronto', name: 'Toronto (Canada)', offset: '-05:00/-04:00' },

  // Australia/Oceania
  {
    id: 'Australia/Sydney',
    name: 'Sydney (Australia)',
    offset: '+10:00/+11:00',
  },
  {
    id: 'Australia/Melbourne',
    name: 'Melbourne (Australia)',
    offset: '+10:00/+11:00',
  },
  {
    id: 'Pacific/Auckland',
    name: 'Auckland (New Zealand)',
    offset: '+12:00/+13:00',
  },
];

export default function TimezoneList({
  selectedTimezone,
  onSelect,
}: TimezoneListProps) {
  const { searchQuery } = useDropdownContext();

  const getCurrentTime = (timezone: string) => {
    try {
      return new Date().toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Invalid';
    }
  };

  // Filter timezones based on search query
  const filteredTimezones = React.useMemo(() => {
    if (!searchQuery) return TIMEZONES;
    const query = searchQuery.toLowerCase();
    return TIMEZONES.filter(
      (timezone) =>
        timezone.name.toLowerCase().includes(query) ||
        timezone.id.toLowerCase().includes(query) ||
        timezone.offset.includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="max-h-64 overflow-y-auto">
      {filteredTimezones.length === 0 ? (
        <div className="p-4 text-center text-primary-muted-foreground text-sm">
          No timezones found for "{searchQuery}"
        </div>
      ) : (
        filteredTimezones.map((timezone) => (
          <button
            key={timezone.id}
            onClick={() => onSelect(timezone.id)}
            className={`w-full flex items-center justify-between p-3 hover:bg-primary-muted/20 transition-colors duration-200 ${
              selectedTimezone === timezone.id
                ? 'bg-primary-accent/10 border-l-2 border-primary-accent'
                : ''
            }`}
          >
            <div className="flex-1 text-left">
              <div className="font-medium text-primary-foreground text-sm">
                {timezone.name}
              </div>
              <div className="text-xs text-primary-muted-foreground">
                {timezone.offset} • Current time: {getCurrentTime(timezone.id)}
              </div>
            </div>
            {selectedTimezone === timezone.id && (
              <FiCheck className="w-4 h-4 text-primary-accent flex-shrink-0 ml-2" />
            )}
          </button>
        ))
      )}
    </div>
  );
}
