'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Transaction as TransactionType } from '../types/transaction';

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

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get current month stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Fetch monthly stats
        const statsResponse = await fetch(
          `/api/transactions/stats?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch recent transactions (last 5)
        const transactionsResponse = await fetch('/api/transactions?limit=5');

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setRecentTransactions(transactionsData.transactions || []);
        }

        // Fetch all transactions for spending categories
        const allTransactionsResponse = await fetch('/api/transactions');

        if (allTransactionsResponse.ok) {
          const allTransactionsData = await allTransactionsResponse.json();
          setAllTransactions(allTransactionsData.transactions || []);
        }
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  return {
    stats,
    recentTransactions,
    allTransactions,
    isLoading,
    refetch: () => {
      if (session) {
        // Re-fetch data
        const fetchData = async () => {
          try {
            setIsLoading(true);

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(
              now.getFullYear(),
              now.getMonth() + 1,
              0
            );

            const [statsResponse, transactionsResponse] = await Promise.all([
              fetch(
                `/api/transactions/stats?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`
              ),
              fetch('/api/transactions?limit=5'),
            ]);

            if (statsResponse.ok) {
              const statsData = await statsResponse.json();
              setStats(statsData);
            }

            if (transactionsResponse.ok) {
              const transactionsData = await transactionsResponse.json();
              setRecentTransactions(transactionsData.transactions || []);
            }

            // Fetch all transactions
            const allTransactionsResponse = await fetch('/api/transactions');
            if (allTransactionsResponse.ok) {
              const allTransactionsData = await allTransactionsResponse.json();
              setAllTransactions(allTransactionsData.transactions || []);
            }
          } catch (error) {
            console.error('Error refetching transaction data:', error);
          } finally {
            setIsLoading(false);
          }
        };

        fetchData();
      }
    },
  };
}
