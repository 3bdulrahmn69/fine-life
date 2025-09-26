'use client';

import { Button } from './button';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

interface MonthYearNavigatorProps {
  selectedMonth: number;
  selectedYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
  onMonthChange?: (month: number) => void;
  onYearChange?: (year: number) => void;
  className?: string;
  showCurrentButton?: boolean;
  showDropdowns?: boolean;
  title?: string;
}

export default function MonthYearNavigator({
  selectedMonth,
  selectedYear,
  onPreviousMonth,
  onNextMonth,
  onCurrentMonth,
  onMonthChange,
  onYearChange,
  className = '',
  showCurrentButton = true,
  showDropdowns = false,
  title,
}: MonthYearNavigatorProps) {
  const currentDate = new Date(selectedYear, selectedMonth);
  const formattedDate = format(currentDate, 'MMMM yyyy');

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-primary-card rounded-lg border border-primary-border ${className}`}
    >
      <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousMonth}
          className="h-9 w-9 p-0"
        >
          <FiChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          {!showDropdowns && (
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-primary-muted-foreground" />
              {title && (
                <span className="text-sm font-medium text-primary-muted-foreground">
                  {title}
                </span>
              )}
            </div>
          )}

          {showDropdowns && onYearChange && onMonthChange ? (
            <>
              {/* Year Picker */}
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                className="bg-primary-card border border-primary-border rounded-lg px-3 py-2 text-primary-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary-accent text-sm w-full sm:w-auto"
              >
                {Array.from(
                  { length: 10 },
                  (_, i) => new Date().getFullYear() - 5 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Month Picker */}
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(parseInt(e.target.value))}
                className="bg-primary-card border border-primary-border rounded-lg px-3 py-2 text-primary-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary-accent text-sm min-w-[120px] w-full sm:w-auto"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {format(new Date(2024, i), 'MMMM')}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <h2 className="text-lg font-semibold text-primary-foreground">
              {formattedDate}
            </h2>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNextMonth}
          className="h-9 w-9 p-0"
        >
          <FiChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {showCurrentButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCurrentMonth}
          className="text-sm"
        >
          Current Month
        </Button>
      )}
    </div>
  );
}
