'use client';

import { useState, useCallback } from 'react';
import { BudgetWithSpending, BudgetStats } from '../types/budget';
import { toast } from 'react-toastify';

interface UseBudgetDataReturn {
  budgets: BudgetWithSpending[];
  stats: BudgetStats | null;
  loading: boolean;
  error: string | null;
  refreshBudgets: () => Promise<void>;
  invalidateBudgets: () => void;
}

export function useBudgetData(): UseBudgetDataReturn {
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([]);
  const [stats, setStats] = useState<BudgetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/budget');
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }

      const data = await response.json();
      setBudgets(data.budgets || []);
      setStats(data.stats || null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load budgets';
      setError(errorMessage);
      console.error('Error fetching budgets:', error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBudgets = useCallback(async () => {
    await fetchBudgets();
  }, [fetchBudgets]);

  const invalidateBudgets = useCallback(() => {
    setBudgets([]);
    setStats(null);
    setError(null);
  }, []);

  return {
    budgets,
    stats,
    loading,
    error,
    refreshBudgets,
    invalidateBudgets,
  };
}
