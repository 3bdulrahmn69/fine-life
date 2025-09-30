'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiPlus,
  FiCreditCard,
  FiDollarSign,
  FiPieChart,
} from 'react-icons/fi';
import { BiWallet } from 'react-icons/bi';
import { useTransactionData } from '../../hooks/useTransactionData';
import { formatCurrency, CurrencyCode } from '../../lib/currency';
import { format } from 'date-fns';
import SpendingCategories from '../../components/ui/spending-categories';
import TransactionModal from '../../components/ui/transaction-modal';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import ConvertedAmount from '../../components/ui/converted-amount';
import MonthYearNavigator from '../../components/ui/month-year-navigator';
import {
  calculateMonthlyTotals,
  convertTransactionsToUserCurrency,
} from '../../lib/transaction-converter';
import { useMonthYearNavigation } from '../../hooks/useMonthYearNavigation';
import { useMonthlyDataCache } from '../../hooks/useDataCache';
import PageHeader from '../../components/ui/page-header';

export default function OverviewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { preferences } = useUserPreferences();
  const { stats, recentTransactions, allTransactions, refetch } =
    useTransactionData();
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Month/Year navigation using custom hook
  const {
    selectedMonth,
    selectedYear,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    setMonth,
    setYear,
  } = useMonthYearNavigation();

  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [previousMonthStats, setPreviousMonthStats] = useState<any>(null);
  const [monthlyTransactions, setMonthlyTransactions] = useState<any[]>([]);
  const [monthlyRecentTransactions, setMonthlyRecentTransactions] = useState<
    any[]
  >([]);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);

  // Track previous currency to detect changes and invalidate cache
  const previousCurrencyRef = useRef<string>(preferences.currency);

  // Monthly data cache hook
  const {
    getCachedMonthlyData,
    fetchMonthlyData,
    invalidateMonthlyData,
    hasCachedMonthlyData,
  } = useMonthlyDataCache();

  // Fetch monthly data function with caching and currency conversion
  const loadMonthlyData = useCallback(
    async (forceRefresh = false) => {
      if (!session || !preferences.currency) return;

      try {
        setIsLoadingMonthly(true);

        // Calculate previous month for comparison
        let prevYear = selectedYear;
        let prevMonth = selectedMonth - 1;
        if (prevMonth < 0) {
          prevMonth = 11;
          prevYear = selectedYear - 1;
        }

        // Fetch fresh data (with cache) - current and previous month
        const [statsData, transactionsData, recentData, prevTransactionsData] =
          await Promise.all([
            fetchMonthlyData(
              selectedYear,
              selectedMonth,
              'stats',
              forceRefresh
            ),
            fetchMonthlyData(
              selectedYear,
              selectedMonth,
              'transactions',
              forceRefresh
            ),
            fetchMonthlyData(
              selectedYear,
              selectedMonth,
              'recent',
              forceRefresh
            ),
            fetchMonthlyData(prevYear, prevMonth, 'transactions', forceRefresh),
          ]);

        // Process transactions with currency conversion
        if (transactionsData && Array.isArray(transactionsData)) {
          // Convert transactions to user currency and calculate totals
          const convertedStats = await calculateMonthlyTotals(
            transactionsData,
            preferences.currency
          );

          // Convert transactions for display and calculate non-mandatory expenses
          const convertedTransactions = await convertTransactionsToUserCurrency(
            transactionsData,
            preferences.currency
          );

          // Calculate non-mandatory expenses (can be saved)
          const nonMandatoryExpenses = convertedTransactions
            .filter((t) => t.type === 'expense' && !t.isMandatory)
            .reduce((sum, t) => sum + t.convertedAmount, 0);

          // Update stats with converted amounts
          setMonthlyStats({
            totalIncome: convertedStats.totalIncome,
            totalExpenses: convertedStats.totalExpenses,
            balance: convertedStats.netAmount,
            transactionCount: convertedStats.transactionCount,
            canBeSaved: nonMandatoryExpenses,
          });

          setMonthlyTransactions(convertedTransactions);
        }

        // Process previous month's transactions for comparison
        if (prevTransactionsData && Array.isArray(prevTransactionsData)) {
          const prevConvertedStats = await calculateMonthlyTotals(
            prevTransactionsData,
            preferences.currency
          );

          const prevConvertedTransactions =
            await convertTransactionsToUserCurrency(
              prevTransactionsData,
              preferences.currency
            );

          // Calculate previous month non-mandatory expenses
          const prevNonMandatoryExpenses = prevConvertedTransactions
            .filter((t) => t.type === 'expense' && !t.isMandatory)
            .reduce((sum, t) => sum + t.convertedAmount, 0);

          setPreviousMonthStats({
            totalIncome: prevConvertedStats.totalIncome,
            totalExpenses: prevConvertedStats.totalExpenses,
            balance: prevConvertedStats.netAmount,
            transactionCount: prevConvertedStats.transactionCount,
            canBeSaved: prevNonMandatoryExpenses,
          });
        } else {
          // No previous month data
          setPreviousMonthStats(null);
        }

        // Process recent transactions with currency conversion
        if (recentData && Array.isArray(recentData)) {
          const convertedRecent = await convertTransactionsToUserCurrency(
            recentData,
            preferences.currency
          );
          setMonthlyRecentTransactions(convertedRecent);
        }
      } catch (error) {
        console.error('Error loading monthly data:', error);
      } finally {
        setIsLoadingMonthly(false);
      }
    },
    [
      session,
      preferences.currency,
      selectedYear,
      selectedMonth,
      fetchMonthlyData,
    ]
  );

  // Effect to handle currency changes and invalidate cache
  useEffect(() => {
    const currentCurrency = preferences.currency;
    const previousCurrency = previousCurrencyRef.current;

    if (
      currentCurrency &&
      previousCurrency &&
      currentCurrency !== previousCurrency
    ) {
      // Currency changed, invalidate all monthly cache to force fresh conversion
      invalidateMonthlyData();
      previousCurrencyRef.current = currentCurrency;
    } else if (currentCurrency && !previousCurrency) {
      // Initial currency set
      previousCurrencyRef.current = currentCurrency;
    }
  }, [preferences.currency, invalidateMonthlyData]);

  // Effect to load monthly data when month/year changes or currency changes
  useEffect(() => {
    loadMonthlyData();
  }, [loadMonthlyData]);

  // Helper function to calculate percentage change
  const calculatePercentageChange = (
    current: number,
    previous: number
  ): { change: string; trend: 'up' | 'down' | 'neutral' } => {
    if (!previous || previous === 0) {
      if (current > 0) return { change: '+100%', trend: 'up' };
      if (current < 0) return { change: '-100%', trend: 'down' };
      return { change: '0%', trend: 'neutral' };
    }

    const percentChange = ((current - previous) / Math.abs(previous)) * 100;
    const roundedChange = Math.round(percentChange * 10) / 10; // Round to 1 decimal place

    if (roundedChange > 0) {
      return { change: `+${roundedChange}%`, trend: 'up' };
    } else if (roundedChange < 0) {
      return { change: `${roundedChange}%`, trend: 'down' };
    } else {
      return { change: '0%', trend: 'neutral' };
    }
  };

  // Helper function for expenses - inverts the trend logic (less spending = good = green)
  const calculateExpensesChange = (
    current: number,
    previous: number
  ): { change: string; trend: 'up' | 'down' | 'neutral' } => {
    if (!previous || previous === 0) {
      if (current > 0) return { change: '+100%', trend: 'down' };
      if (current < 0) return { change: '-100%', trend: 'up' };
      return { change: '0%', trend: 'neutral' };
    }

    const percentChange = ((current - previous) / Math.abs(previous)) * 100;
    const roundedChange = Math.round(percentChange * 10) / 10;

    if (roundedChange > 0) {
      return { change: `+${roundedChange}%`, trend: 'down' }; // More expenses = bad = red
    } else if (roundedChange < 0) {
      return { change: `${roundedChange}%`, trend: 'up' }; // Less expenses = good = green
    } else {
      return { change: '0%', trend: 'neutral' };
    }
  };

  // Helper function for "Can be Saved" - inverts the trend logic (more "can be saved" = bad = red)
  const calculateSavingsChange = (
    current: number,
    previous: number
  ): { change: string; trend: 'up' | 'down' | 'neutral' } => {
    if (!previous || previous === 0) {
      if (current > 0) return { change: '+100%', trend: 'down' }; // New "can be saved" = bad = red
      if (current < 0) return { change: '-100%', trend: 'up' };
      return { change: '0%', trend: 'neutral' };
    }

    const percentChange = ((current - previous) / Math.abs(previous)) * 100;
    const roundedChange = Math.round(percentChange * 10) / 10;

    if (roundedChange > 0) {
      return { change: `+${roundedChange}%`, trend: 'down' }; // More "can be saved" = bad = red
    } else if (roundedChange < 0) {
      return { change: `${roundedChange}%`, trend: 'up' }; // Less "can be saved" = good = green
    } else {
      return { change: '0%', trend: 'neutral' };
    }
  };

  // Calculate stats with monthly data in the requested order
  const currentStats = [
    {
      title: 'Monthly Income',
      value: monthlyStats
        ? formatCurrency(monthlyStats.totalIncome, preferences.currency)
        : formatCurrency(0, preferences.currency),
      ...(() => {
        const current = monthlyStats?.totalIncome || 0;
        const previous = previousMonthStats?.totalIncome || 0;
        return calculatePercentageChange(current, previous);
      })(),
      icon: FiTrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Monthly Expenses',
      value: monthlyStats
        ? formatCurrency(monthlyStats.totalExpenses, preferences.currency)
        : formatCurrency(0, preferences.currency),
      ...(() => {
        const current = monthlyStats?.totalExpenses || 0;
        const previous = previousMonthStats?.totalExpenses || 0;
        return calculateExpensesChange(current, previous);
      })(),
      icon: FiTrendingDown,
      color: 'bg-red-500',
    },
    {
      title: 'Monthly Saved',
      value: monthlyStats
        ? formatCurrency(monthlyStats.balance, preferences.currency)
        : formatCurrency(0, preferences.currency),
      ...(() => {
        const current = monthlyStats?.balance || 0;
        const previous = previousMonthStats?.balance || 0;
        return calculatePercentageChange(current, previous);
      })(),
      icon: BiWallet,
      color:
        monthlyStats && monthlyStats.balance >= 0
          ? 'bg-blue-500'
          : 'bg-orange-500',
    },
    {
      title: 'Can be Saved',
      value: monthlyStats
        ? formatCurrency(monthlyStats.canBeSaved || 0, preferences.currency)
        : formatCurrency(0, preferences.currency),
      ...(() => {
        const current = monthlyStats?.canBeSaved || 0;
        const previous = previousMonthStats?.canBeSaved || 0;
        return calculateSavingsChange(current, previous);
      })(),
      icon: FiTarget,
      color: 'bg-purple-500',
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          icon={<BiWallet className="w-5 h-5 text-primary-accent" />}
          title={`Welcome back, ${
            session?.user?.name?.split(' ')[0] || 'User'
          }!`}
          subtitle={`Here's your financial overview for ${format(
            new Date(selectedYear, selectedMonth),
            'MMMM yyyy'
          )}`}
          actionButton={{
            label: 'Add Transaction',
            onClick: () => setShowTransactionModal(true),
            icon: <FiPlus className="w-4 h-4" />,
          }}
        />

        {/* Month/Year Navigation */}
        <MonthYearNavigator
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onCurrentMonth={goToCurrentMonth}
          onMonthChange={setMonth}
          onYearChange={setYear}
          showDropdowns={true}
        />
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-primary-card border-primary-border hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center">
                      {stat.trend === 'up' ? (
                        <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === 'up'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center ml-4 flex-shrink-0`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Charts and Recent Transactions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Spending Chart */}
          <Card className="bg-primary-card border-primary-border overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-primary-foreground text-xl">
                <FiPieChart className="w-5 h-5 mr-3" />
                Spending Categories
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Your spending breakdown for this month
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoadingMonthly && monthlyTransactions.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent mb-2"></div>
                    <p className="text-primary-muted-foreground text-sm">
                      Loading spending data...
                    </p>
                  </div>
                </div>
              ) : (
                <SpendingCategories
                  transactions={monthlyTransactions}
                  currency={preferences.currency}
                  period="month"
                />
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-primary-card border-primary-border flex flex-col min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-6 flex-shrink-0">
              <CardTitle className="flex items-center text-primary-foreground text-xl">
                <FiCreditCard className="w-5 h-5 mr-3" />
                Recent Transactions
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Your latest financial activity
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
              {/* Transactions Container - Scrollable */}
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-border scrollbar-track-transparent">
                <div className="space-y-4 pr-1">
                  {isLoadingMonthly &&
                  monthlyRecentTransactions.length === 0 ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent mb-2"></div>
                        <p className="text-primary-muted-foreground text-sm">
                          Loading recent transactions...
                        </p>
                      </div>
                    </div>
                  ) : monthlyRecentTransactions.length > 0 ? (
                    monthlyRecentTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-primary-muted/30 rounded-lg gap-3 hover:bg-primary-muted/40 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              transaction.type === 'income'
                                ? 'bg-green-100'
                                : 'bg-red-100'
                            }`}
                          >
                            <FiDollarSign
                              className={`w-5 h-5 ${
                                transaction.type === 'income'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-primary-foreground text-sm sm:text-base truncate">
                              {transaction.description}
                            </p>
                            <p className="text-xs sm:text-sm text-primary-muted-foreground">
                              <span className="capitalize">
                                {transaction.category}
                              </span>{' '}
                              •{' '}
                              {format(
                                new Date(transaction.date),
                                'MMM dd, yyyy'
                              )}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-semibold text-sm sm:text-base self-end sm:self-center ${
                            transaction.type === 'income'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          <ConvertedAmount
                            amount={transaction.amount}
                            originalCurrency={
                              (transaction.currency ||
                                preferences.currency) as CurrencyCode
                            }
                            displayCurrency={
                              preferences.currency as CurrencyCode
                            }
                            showOriginal={
                              transaction.currency !== preferences.currency
                            }
                          />
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-primary-muted-foreground">
                      <FiCreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No transactions yet</p>
                      <p className="text-xs mt-1">
                        Add your first transaction to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Button - Always at bottom */}
              <div className="flex-shrink-0 pt-4 sm:pt-6 border-t border-primary-border/50 mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/transactions')}
                >
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSuccess={() => {
          // Refresh both general data and monthly data
          refetch();
          // Invalidate monthly cache and refresh
          invalidateMonthlyData();
          loadMonthlyData(true);
        }}
        currency={preferences.currency}
      />
    </>
  );
}
