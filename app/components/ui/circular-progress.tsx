'use client';

import React from 'react';

interface CircularProgressProps {
  percentage: number;
  spent: number;
  total: number;
  currency: string;
  size?: number;
  strokeWidth?: number;
  isOverBudget?: boolean;
  showLabels?: boolean;
  className?: string;
}

export default function CircularProgress({
  percentage,
  spent,
  total,
  currency,
  size = 120,
  strokeWidth = 8,
  isOverBudget = false,
  showLabels = true,
  className = '',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color logic
  const getColors = () => {
    if (isOverBudget) {
      return {
        progress: '#ef4444', // red-500
        track: '#fee2e2', // red-50
        text: '#dc2626', // red-600
      };
    } else if (percentage >= 80) {
      return {
        progress: '#f59e0b', // amber-500
        track: '#fef3c7', // amber-50
        text: '#d97706', // amber-600
      };
    } else {
      return {
        progress: '#10b981', // emerald-500
        track: '#d1fae5', // emerald-50
        text: '#059669', // emerald-600
      };
    }
  };

  const colors = getColors();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.track}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="drop-shadow-sm"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.progress}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out drop-shadow-sm"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-bold text-primary-foreground">
              {formatCurrency(spent)}
            </div>
            <div className="text-xs text-primary-muted-foreground">
              of {formatCurrency(total)}
            </div>
            <div
              className="text-xs font-medium mt-1"
              style={{ color: colors.text }}
            >
              {Math.round(percentage)}%
            </div>
          </div>
        </div>
      </div>

      {showLabels && (
        <div className="mt-3 text-center">
          <div className="text-xs text-primary-muted-foreground">
            Remaining: {formatCurrency(Math.max(0, total - spent))}
          </div>
          {isOverBudget && (
            <div className="text-xs text-red-600 font-medium mt-1">
              Over budget by {formatCurrency(spent - total)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
