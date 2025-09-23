'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Transaction, TransactionType } from '../../types/transaction';
import { CurrencyCode } from '../../lib/currency';
import TransactionCard from '../../components/ui/transaction-card';
import TransactionModal from '../../components/ui/transaction-modal';
import { FiChevronLeft, FiChevronRight, FiBarChart } from 'react-icons/fi';

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<
    MonthlyGroup[]
  >([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currency] = useState<CurrencyCode>('USD'); // TODO: Get from user preferences
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Get current month data
  const currentMonthData = groupedTransactions.find(
    (group) =>
      group.year === currentYear &&
      group.month === format(new Date(currentYear, currentMonth), 'MMMM')
  );

  // Navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
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

  // Load transactions on mount
  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session]);

  // Handle edit
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  // Handle delete
  const handleDelete = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTransactions(); // Refresh the list
      } else {
        console.error('Error deleting transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-foreground">
            Transactions
          </h1>
          <p className="text-primary-muted-foreground mt-1">
            Track your income and expenses
          </p>
        </div>

        <button
          onClick={() => setShowTransactionModal(true)}
          className="bg-primary-accent text-primary-accent-foreground px-6 py-2 rounded-lg hover:bg-primary-accent/90 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center mb-8 bg-primary-card/20 rounded-xl p-4 border border-primary-border/30">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-primary-card/40 transition-colors mr-4"
          aria-label="Previous month"
        >
          <FiChevronLeft className="w-5 h-5 text-primary-foreground" />
        </button>

        <div className="flex items-center space-x-4">
          {/* Year Picker */}
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="bg-primary-card border border-primary-border rounded-lg px-3 py-2 text-primary-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary-accent"
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
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="bg-primary-card border border-primary-border rounded-lg px-3 py-2 text-primary-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary-accent min-w-[120px]"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(new Date(2024, i), 'MMMM')}
              </option>
            ))}
          </select>

          <button
            onClick={goToCurrentMonth}
            className="text-sm px-3 py-2 bg-primary-accent/10 text-primary-accent hover:bg-primary-accent/20 rounded-lg transition-colors font-medium"
          >
            Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-primary-card/40 transition-colors ml-4"
          aria-label="Next month"
        >
          <FiChevronRight className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

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
              <div className="bg-gradient-to-r from-primary-card/40 to-primary-card/20 rounded-xl p-6 border border-primary-border/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-primary-foreground">
                    {currentMonthData.month} {currentMonthData.year}
                  </h2>
                  <div className="text-right">
                    <div className="text-sm text-primary-muted-foreground mb-1">
                      Net Balance
                    </div>
                    <div
                      className={`text-2xl font-bold ${
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

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-sm text-green-600 font-medium mb-1">
                      Income
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      +${currentMonthData.totalIncome.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="text-sm text-red-600 font-medium mb-1">
                      Expenses
                    </div>
                    <div className="text-xl font-bold text-red-600">
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
                    <div className="flex items-center justify-between py-3 px-4 bg-primary-card/30 rounded-lg border-l-4 border-primary-accent">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-primary-foreground">
                          {format(day.date, 'EEEE, MMM d')}
                        </h3>
                        <span className="text-sm text-primary-muted-foreground">
                          {day.transactions.length} transaction
                          {day.transactions.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            day.balance >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {day.balance >= 0 ? '+' : ''}${day.balance.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Day Transactions */}
                    <div className="space-y-2 ml-4">
                      {day.transactions.map((transaction) => (
                        <TransactionCard
                          key={transaction._id}
                          transaction={transaction}
                          currency={currency}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
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

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setEditingTransaction(null);
        }}
        onSuccess={() => {
          fetchTransactions();
        }}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
