'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Transaction, TransactionType } from '../../types/transaction';
import TransactionCard from '../../components/ui/transaction-card';
import TransactionModal from '../../components/ui/transaction-modal';
import { FiBarChart, FiRepeat } from 'react-icons/fi';
import MonthYearNavigator from '../../components/ui/month-year-navigator';
import { useMonthYearNavigation } from '../../hooks/useMonthYearNavigation';
import {
  AutomaticTransaction,
  AutomaticTransactionFormData,
} from '../../types/automatic-transaction';
import AutoTransactionForm from '../../components/ui/auto-transaction-form';
import AutoTransactionList from '../../components/ui/auto-transaction-list';
import Modal from '../../components/ui/modal';
import ConfirmModal from '../../components/ui/confirm-modal';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useTransactionCache, useCacheUtils } from '../../hooks/useDataCache';

interface MonthlyGroup {
  month: string;
  year: number;
  days: DailyGroup[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

interface DailyGroup {
  date: Date;
  dateString: string;
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export default function TransactionsPage() {
  const { data: session } = useSession();
  const { preferences } = useUserPreferences();
  const {
    getCachedTransactions,
    fetchTransactions,
    invalidateTransactions,
    isLoading: cacheLoading,
    hasCachedData,
  } = useTransactionCache();
  const { invalidateTransactionRelated } = useCacheUtils();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<
    MonthlyGroup[]
  >([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Month/Year navigation using custom hook
  const {
    selectedMonth: currentMonth,
    selectedYear: currentYear,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    setMonth: setCurrentMonth,
    setYear: setCurrentYear,
  } = useMonthYearNavigation();

  // Automatic transactions state
  const [showAutoTransactionsModal, setShowAutoTransactionsModal] =
    useState(false);
  const [showAutoTransactionForm, setShowAutoTransactionForm] = useState(false);
  const [editingAutoTransaction, setEditingAutoTransaction] =
    useState<AutomaticTransaction | null>(null);
  const [isSubmittingAuto, setIsSubmittingAuto] = useState(false);
  const [autoTransactionRefresh, setAutoTransactionRefresh] = useState(0);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    transactionId: string | null;
    transactionDescription: string;
  }>({
    isOpen: false,
    transactionId: null,
    transactionDescription: '',
  });

  // Get current month data
  const currentMonthData = groupedTransactions.find(
    (group) =>
      group.year === currentYear &&
      group.month === format(new Date(currentYear, currentMonth), 'MMMM')
  );

  // Navigation functions are now provided by useMonthYearNavigation hook

  // Load transactions from cache or fetch
  const loadTransactions = async (forceRefresh = false) => {
    try {
      setIsLoading(true);

      // Try to get cached data first
      if (!forceRefresh && hasCachedData) {
        const cachedData = getCachedTransactions() as Transaction[];
        if (cachedData && Array.isArray(cachedData)) {
          setTransactions(cachedData);
          setIsLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const data = await fetchTransactions(forceRefresh);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group transactions by month and day
  useEffect(() => {
    const grouped = transactions.reduce(
      (acc: Record<string, MonthlyGroup>, transaction) => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: format(date, 'MMMM'),
            year: date.getFullYear(),
            days: [],
            totalIncome: 0,
            totalExpenses: 0,
            balance: 0,
          };
        }

        // Find or create day group
        const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        let dayGroup = acc[monthKey].days.find((d) => d.dateString === dayKey);

        if (!dayGroup) {
          dayGroup = {
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            dateString: dayKey,
            transactions: [],
            totalIncome: 0,
            totalExpenses: 0,
            balance: 0,
          };
          acc[monthKey].days.push(dayGroup);
        }

        dayGroup.transactions.push(transaction);

        if (transaction.type === TransactionType.INCOME) {
          dayGroup.totalIncome += transaction.amount;
          acc[monthKey].totalIncome += transaction.amount;
        } else {
          dayGroup.totalExpenses += transaction.amount;
          acc[monthKey].totalExpenses += transaction.amount;
        }

        dayGroup.balance = dayGroup.totalIncome - dayGroup.totalExpenses;
        acc[monthKey].balance =
          acc[monthKey].totalIncome - acc[monthKey].totalExpenses;

        return acc;
      },
      {}
    );

    // Sort by date (newest first) and sort days and transactions within each month
    const sortedGroups = Object.values(grouped)
      .sort((a, b) => b.year - a.year || b.month.localeCompare(a.month))
      .map((group) => ({
        ...group,
        days: group.days
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((day) => ({
            ...day,
            transactions: day.transactions.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
          })),
      }));

    setGroupedTransactions(sortedGroups);
  }, [transactions]);

  // Load transactions on mount only
  useEffect(() => {
    if (session && transactions.length === 0) {
      loadTransactions();
    }
  }, [session]); // Remove transactions dependency to prevent reload loops

  // Prevent unnecessary API calls when page is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only fetch if page becomes visible and we have no data
      if (!document.hidden && session && transactions.length === 0) {
        loadTransactions();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session, transactions.length]);

  // Handle edit
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  // Handle delete
  const handleDeleteClick = (transactionId: string) => {
    const transaction = transactions.find((t) => t._id === transactionId);
    setDeleteConfirm({
      isOpen: true,
      transactionId: transactionId,
      transactionDescription: transaction?.description || 'this transaction',
    });
  };

  const handleDeleteConfirm = async () => {
    const transactionId = deleteConfirm.transactionId;
    if (!transactionId) return;

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Invalidate cache and refresh data
        invalidateTransactions();
        await loadTransactions(true);
        setDeleteConfirm({
          isOpen: false,
          transactionId: null,
          transactionDescription: '',
        });
      } else {
        console.error('Error deleting transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({
      isOpen: false,
      transactionId: null,
      transactionDescription: '',
    });
  };

  // Automatic transaction handlers
  const handleManageAutoTransactions = () => {
    setEditingAutoTransaction(null);
    setShowAutoTransactionForm(false); // Show list first, not form
    setShowAutoTransactionsModal(true);
  };

  const handleEditAutoTransaction = (transaction: AutomaticTransaction) => {
    setEditingAutoTransaction(transaction);
    setShowAutoTransactionForm(true);
  };

  const handleCloseAutoTransactionForm = () => {
    setShowAutoTransactionForm(false);
    setEditingAutoTransaction(null);
  };

  const handleCloseAutoTransactionsModal = () => {
    setShowAutoTransactionsModal(false);
    setShowAutoTransactionForm(false);
    setEditingAutoTransaction(null);
  };

  const handleSubmitAutoTransaction = async (
    formData: AutomaticTransactionFormData
  ) => {
    if (!session?.user?.id) {
      return;
    }

    try {
      setIsSubmittingAuto(true);

      const endpoint = editingAutoTransaction
        ? `/api/automatic-transactions/${editingAutoTransaction._id}`
        : '/api/automatic-transactions';

      const method = editingAutoTransaction ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || 'Failed to save automatic transaction'
        );
      }

      // Close form and refresh list
      handleCloseAutoTransactionForm();
      setAutoTransactionRefresh((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving automatic transaction:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to save automatic transaction'
      );
    } finally {
      setIsSubmittingAuto(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-primary-muted-foreground">
          Please sign in to view your transactions.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
            Transactions
          </h1>
          <p className="text-primary-muted-foreground mt-1 text-sm sm:text-base">
            Track your income and expenses
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-primary-accent text-primary-accent-foreground px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-accent/90 flex items-center space-x-2 justify-center"
          >
            <span>+</span>
            <span>Add Transaction</span>
          </button>
          <button
            onClick={handleManageAutoTransactions}
            className="bg-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 justify-center"
          >
            <FiRepeat className="w-4 h-4" />
            <span>Manage Auto Transactions</span>
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <MonthYearNavigator
        selectedMonth={currentMonth}
        selectedYear={currentYear}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onCurrentMonth={goToCurrentMonth}
        onMonthChange={setCurrentMonth}
        onYearChange={setCurrentYear}
        showDropdowns={true}
        className="mb-6 sm:mb-8"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="bg-primary-card/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
          </div>
          <p className="text-primary-muted-foreground text-lg">
            Loading your transactions...
          </p>
        </div>
      )}

      {/* Transactions List */}
      {!isLoading && (
        <div className="space-y-8">
          {!currentMonthData ? (
            <div className="text-center py-16">
              <div className="bg-primary-card/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FiBarChart className="w-10 h-10 text-primary-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                No transactions for{' '}
                {format(new Date(currentYear, currentMonth), 'MMMM yyyy')}
              </h3>
              <p className="text-primary-muted-foreground mb-8 max-w-md mx-auto">
                Start tracking your finances by adding your first transaction
                for this month.
              </p>
              <button
                onClick={() => setShowTransactionModal(true)}
                className="bg-primary-accent text-primary-accent-foreground px-8 py-3 rounded-lg hover:bg-primary-accent/90 font-medium transition-colors"
              >
                Add Transaction
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Month Summary - Clean and Minimal */}
              <div className="bg-gradient-to-r from-primary-card/40 to-primary-card/20 rounded-xl p-4 sm:p-6 border border-primary-border/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-primary-foreground">
                    {currentMonthData.month} {currentMonthData.year}
                  </h2>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="text-sm text-primary-muted-foreground mb-1">
                      Net Balance
                    </div>
                    <div
                      className={`text-xl sm:text-2xl font-bold ${
                        currentMonthData.balance >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      ${Math.abs(currentMonthData.balance).toFixed(2)}
                      {currentMonthData.balance < 0 && (
                        <span className="text-sm ml-1">deficit</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-sm text-green-600 font-medium mb-1">
                      Income
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-green-600">
                      +${currentMonthData.totalIncome.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="text-sm text-red-600 font-medium mb-1">
                      Expenses
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-red-600">
                      -${currentMonthData.totalExpenses.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions by Day */}
              <div className="space-y-4">
                {currentMonthData.days.map((day) => (
                  <div key={day.dateString} className="space-y-3">
                    {/* Day Header - Clean and Minimal */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-3 sm:px-4 bg-primary-card/30 rounded-lg border-l-4 border-primary-accent gap-2 sm:gap-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                        <h3 className="text-base sm:text-lg font-semibold text-primary-foreground">
                          {format(day.date, 'EEEE, MMM d')}
                        </h3>
                        <span className="text-xs sm:text-sm text-primary-muted-foreground">
                          {day.transactions.length} transaction
                          {day.transactions.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-xs sm:text-sm text-primary-muted-foreground mb-1">
                          Daily Balance
                        </div>
                        <div
                          className={`text-base sm:text-lg font-bold ${
                            day.balance >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {day.balance >= 0 ? '+' : ''}${day.balance.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Day Transactions */}
                    <div className="space-y-2 ml-0 sm:ml-4">
                      {day.transactions.map((transaction) => (
                        <TransactionCard
                          key={transaction._id}
                          transaction={transaction}
                          currency={preferences.currency}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Automatic Transactions Modal */}
      <Modal
        isOpen={showAutoTransactionsModal}
        onClose={handleCloseAutoTransactionsModal}
        title="Manage Automatic Transactions"
        size="xl"
      >
        {showAutoTransactionForm ? (
          <AutoTransactionForm
            initialData={editingAutoTransaction || undefined}
            currency={preferences.currency}
            onSubmit={handleSubmitAutoTransaction}
            onCancel={handleCloseAutoTransactionForm}
            isSubmitting={isSubmittingAuto}
          />
        ) : (
          <AutoTransactionList
            onCreateNew={() => setShowAutoTransactionForm(true)}
            onEdit={handleEditAutoTransaction}
            refreshTrigger={autoTransactionRefresh}
            currency={preferences.currency}
          />
        )}
      </Modal>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setEditingTransaction(null);
        }}
        onSuccess={() => {
          // Invalidate cache and refresh data
          invalidateTransactions();
          loadTransactions(true);
        }}
        editingTransaction={editingTransaction}
        currency={preferences.currency}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deleteConfirm.transactionDescription}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
