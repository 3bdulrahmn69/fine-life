'use client';

import { useState } from 'react';

export function useMonthYearNavigation(
  initialMonth?: number,
  initialYear?: number
) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    initialMonth ?? now.getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(
    initialYear ?? now.getFullYear()
  );

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
  };

  const setMonth = (month: number) => {
    setSelectedMonth(month);
  };

  const setYear = (year: number) => {
    setSelectedYear(year);
  };

  const setMonthYear = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return {
    selectedMonth,
    selectedYear,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    setMonth,
    setYear,
    setMonthYear,
  };
}
