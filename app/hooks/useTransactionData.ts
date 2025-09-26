'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Transaction as TransactionType } from '../types/transaction';
import { useTransactionCache, useStatsCache } from './useDataCache';

interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  categoriesBreakdown: {
    category: string;
    income: number;
    expenses: number;
    total: number;
    percentage: number;
  }[];
}

export function useTransactionData() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionType[]
  >([]);
  const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use cache hooks
  const {
    getCachedTransactions,
    fetchTransactions,
    hasCachedData: hasTransactionCache,
    invalidateTransactions: invalidateTransactionCache,
  } = useTransactionCache();

  const {
    getCachedStats,
    fetchStats,
    hasCachedData: hasStatsCache,
    invalidateStats: invalidateStatsCache,
  } = useStatsCache();

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load transactions (try cache first)
        let transactionData = getCachedTransactions() as
          | TransactionType[]
          | null;
        if (!transactionData) {
          transactionData = await fetchTransactions();
        }

        if (transactionData && Array.isArray(transactionData)) {
          setAllTransactions(transactionData);
          // Get recent 5 transactions
          const recent = transactionData
            .sort(
              (a: TransactionType, b: TransactionType) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 5);
          setRecentTransactions(recent);
        }

        // Load stats (try cache first)
        let statsData = getCachedStats() as TransactionStats | null;
        if (!statsData) {
          statsData = await fetchStats();
        }

        if (statsData) {
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error loading transaction data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session, hasTransactionCache, hasStatsCache]);

  return {
    stats,
    recentTransactions,
    allTransactions,
    isLoading,
    refetch: async () => {
      if (session) {
        try {
          setIsLoading(true);

          // Invalidate caches and refetch
          invalidateTransactionCache();
          invalidateStatsCache();

          // Fetch fresh data
          const [transactionData, statsData] = await Promise.all([
            fetchTransactions(true),
            fetchStats(true),
          ]);

          if (transactionData && Array.isArray(transactionData)) {
            setAllTransactions(transactionData);
            const recent = transactionData
              .sort(
                (a: TransactionType, b: TransactionType) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 5);
            setRecentTransactions(recent);
          }

          if (statsData) {
            setStats(statsData as TransactionStats);
          }
        } catch (error) {
          console.error('Error refetching transaction data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    },
  };
}
