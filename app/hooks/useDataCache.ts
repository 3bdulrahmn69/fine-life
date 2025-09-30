'use client';

import { useState, useCallback, useRef } from 'react';

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Cache configuration
const CACHE_CONFIG = {
  transactions: {
    ttl: 5 * 60 * 1000, // 5 minutes
    key: 'transactions_cache',
  },
  stats: {
    ttl: 3 * 60 * 1000, // 3 minutes
    key: 'stats_cache',
  },
  monthlyData: {
    ttl: 4 * 60 * 1000, // 4 minutes
    keyPrefix: 'monthly_data_',
  },
  budgets: {
    ttl: 5 * 60 * 1000, // 5 minutes
    key: 'budgets_cache',
  },
};

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  invalidatePattern(pattern: string): void {
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}

// Global cache instance
const globalCache = new MemoryCache();

// Cache hook for transactions
export const useTransactionCache = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef<Promise<any> | null>(null);

  const getCachedTransactions = useCallback(() => {
    return globalCache.get(CACHE_CONFIG.transactions.key);
  }, []);

  const fetchTransactions = useCallback(async (forceRefresh = false) => {
    const cacheKey = CACHE_CONFIG.transactions.key;

    // Return cached data if available and not forcing refresh
    if (!forceRefresh && globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey);
    }

    // Prevent multiple simultaneous requests
    if (fetchingRef.current && !forceRefresh) {
      return fetchingRef.current;
    }

    setIsLoading(true);
    setError(null);

    const fetchPromise = (async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        const transactions = data.transactions || [];

        // Cache the data
        globalCache.set(cacheKey, transactions, CACHE_CONFIG.transactions.ttl);

        return transactions;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch transactions';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
        fetchingRef.current = null;
      }
    })();

    fetchingRef.current = fetchPromise;
    return fetchPromise;
  }, []);

  const invalidateTransactions = useCallback(() => {
    globalCache.invalidate(CACHE_CONFIG.transactions.key);
  }, []);

  return {
    getCachedTransactions,
    fetchTransactions,
    invalidateTransactions,
    isLoading,
    error,
    hasCachedData: globalCache.has(CACHE_CONFIG.transactions.key),
  };
};

// Cache hook for stats
export const useStatsCache = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef<Promise<any> | null>(null);

  const getCachedStats = useCallback(() => {
    return globalCache.get(CACHE_CONFIG.stats.key);
  }, []);

  const fetchStats = useCallback(async (forceRefresh = false) => {
    const cacheKey = CACHE_CONFIG.stats.key;

    // Return cached data if available and not forcing refresh
    if (!forceRefresh && globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey);
    }

    // Prevent multiple simultaneous requests
    if (fetchingRef.current && !forceRefresh) {
      return fetchingRef.current;
    }

    setIsLoading(true);
    setError(null);

    const fetchPromise = (async () => {
      try {
        const response = await fetch('/api/transactions/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const stats = await response.json();

        // Cache the data
        globalCache.set(cacheKey, stats, CACHE_CONFIG.stats.ttl);

        return stats;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch stats';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
        fetchingRef.current = null;
      }
    })();

    fetchingRef.current = fetchPromise;
    return fetchPromise;
  }, []);

  const invalidateStats = useCallback(() => {
    globalCache.invalidate(CACHE_CONFIG.stats.key);
  }, []);

  return {
    getCachedStats,
    fetchStats,
    invalidateStats,
    isLoading,
    error,
    hasCachedData: globalCache.has(CACHE_CONFIG.stats.key),
  };
};

// Cache hook for budgets
export const useBudgetCache = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef<Promise<any> | null>(null);

  const getCachedBudgets = useCallback(() => {
    return globalCache.get(CACHE_CONFIG.budgets.key);
  }, []);

  const fetchBudgets = useCallback(async (forceRefresh = false) => {
    const cacheKey = CACHE_CONFIG.budgets.key;

    // Return cached data if available and not forcing refresh
    if (!forceRefresh && globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey);
    }

    // Prevent multiple simultaneous requests
    if (fetchingRef.current && !forceRefresh) {
      return fetchingRef.current;
    }

    setIsLoading(true);
    setError(null);

    const fetchPromise = (async () => {
      try {
        const response = await fetch('/api/budget');
        if (!response.ok) {
          throw new Error('Failed to fetch budgets');
        }

        const data = await response.json();

        // Cache the data
        globalCache.set(cacheKey, data, CACHE_CONFIG.budgets.ttl);

        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch budgets';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
        fetchingRef.current = null;
      }
    })();

    fetchingRef.current = fetchPromise;
    return fetchPromise;
  }, []);

  const invalidateBudgets = useCallback(() => {
    globalCache.invalidate(CACHE_CONFIG.budgets.key);
  }, []);

  return {
    getCachedBudgets,
    fetchBudgets,
    invalidateBudgets,
    isLoading,
    error,
    hasCachedData: globalCache.has(CACHE_CONFIG.budgets.key),
  };
};

// Cache hook for monthly data (overview page)
export const useMonthlyDataCache = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef<Map<string, Promise<any>>>(new Map());

  const generateCacheKey = useCallback(
    (
      year: number,
      month: number,
      type: 'stats' | 'transactions' | 'recent'
    ) => {
      return `${CACHE_CONFIG.monthlyData.keyPrefix}${year}_${month}_${type}`;
    },
    []
  );

  const getCachedMonthlyData = useCallback(
    (
      year: number,
      month: number,
      type: 'stats' | 'transactions' | 'recent'
    ) => {
      const cacheKey = generateCacheKey(year, month, type);
      return globalCache.get(cacheKey);
    },
    [generateCacheKey]
  );

  const fetchMonthlyData = useCallback(
    async (
      year: number,
      month: number,
      type: 'stats' | 'transactions' | 'recent',
      forceRefresh = false
    ) => {
      const cacheKey = generateCacheKey(year, month, type);

      // Return cached data if available and not forcing refresh
      if (!forceRefresh && globalCache.has(cacheKey)) {
        return globalCache.get(cacheKey);
      }

      // Prevent multiple simultaneous requests for the same data
      const requestKey = cacheKey;
      if (fetchingRef.current.has(requestKey) && !forceRefresh) {
        return fetchingRef.current.get(requestKey);
      }

      setIsLoading(true);
      setError(null);

      const fetchPromise = (async () => {
        try {
          const startOfMonth = new Date(year, month, 1);
          const endOfMonth = new Date(year, month + 1, 0);

          let url = '';
          let limit = '';

          switch (type) {
            case 'stats':
              url = `/api/transactions/stats?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`;
              break;
            case 'transactions':
              url = `/api/transactions?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`;
              break;
            case 'recent':
              url = `/api/transactions?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}&limit=5`;
              break;
          }

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${type} data`);
          }

          const data = await response.json();
          const result = type === 'stats' ? data : data.transactions || [];

          // Cache the data
          globalCache.set(cacheKey, result, CACHE_CONFIG.monthlyData.ttl);

          return result;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : `Failed to fetch ${type} data`;
          setError(errorMessage);
          throw err;
        } finally {
          setIsLoading(false);
          fetchingRef.current.delete(requestKey);
        }
      })();

      fetchingRef.current.set(requestKey, fetchPromise);
      return fetchPromise;
    },
    [generateCacheKey]
  );

  const invalidateMonthlyData = useCallback(
    (
      year?: number,
      month?: number,
      type?: 'stats' | 'transactions' | 'recent'
    ) => {
      if (year !== undefined && month !== undefined && type) {
        // Invalidate specific month/type data
        const cacheKey = generateCacheKey(year, month, type);
        globalCache.invalidate(cacheKey);
      } else {
        // Invalidate all monthly data
        globalCache.invalidatePattern(CACHE_CONFIG.monthlyData.keyPrefix);
      }
    },
    [generateCacheKey]
  );

  const hasCachedMonthlyData = useCallback(
    (
      year: number,
      month: number,
      type: 'stats' | 'transactions' | 'recent'
    ) => {
      const cacheKey = generateCacheKey(year, month, type);
      return globalCache.has(cacheKey);
    },
    [generateCacheKey]
  );

  return {
    getCachedMonthlyData,
    fetchMonthlyData,
    invalidateMonthlyData,
    hasCachedMonthlyData,
    isLoading,
    error,
  };
};

// Combined cache utilities
export const useCacheUtils = () => {
  const invalidateAll = useCallback(() => {
    globalCache.clear();
  }, []);

  const invalidateTransactionRelated = useCallback(() => {
    globalCache.invalidate(CACHE_CONFIG.transactions.key);
    globalCache.invalidate(CACHE_CONFIG.stats.key);
    globalCache.invalidatePattern(CACHE_CONFIG.monthlyData.keyPrefix);
  }, []);

  const invalidateBudgetRelated = useCallback(() => {
    globalCache.invalidate(CACHE_CONFIG.budgets.key);
  }, []);

  return {
    invalidateAll,
    invalidateTransactionRelated,
    invalidateBudgetRelated,
  };
};
