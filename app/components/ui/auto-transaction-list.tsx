'use client';

import { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPlay,
  FiPause,
  FiCalendar,
  FiDollarSign,
  FiRepeat,
  FiTrendingUp,
  FiTrendingDown,
} from 'react-icons/fi';
import { format } from 'date-fns';
import {
  AutomaticTransaction,
  AutoTransactionStatus,
  RecurrenceType,
} from '../../types/automatic-transaction';
import { formatCurrency, CurrencyCode } from '../../lib/currency';
import ConfirmModal from './confirm-modal';

interface AutoTransactionListProps {
  onCreateNew: () => void;
  onEdit: (transaction: AutomaticTransaction) => void;
  refreshTrigger?: number;
  currency?: CurrencyCode;
}

export default function AutoTransactionList({
  onCreateNew,
  onEdit,
  refreshTrigger,
  currency = 'USD',
}: AutoTransactionListProps) {
  const [transactions, setTransactions] = useState<AutomaticTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    transactionId: string | null;
    transactionName: string;
  }>({
    isOpen: false,
    transactionId: null,
    transactionName: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/automatic-transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch automatic transactions');
      }
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching automatic transactions:', error);
      setError('Failed to load automatic transactions');
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (
    id: string,
    status: AutoTransactionStatus
  ) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/automatic-transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction status');
      }

      // Update local state
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
    } catch (error) {
      console.error('Error updating transaction status:', error);
      setError('Failed to update transaction status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (transaction: AutomaticTransaction) => {
    setDeleteConfirm({
      isOpen: true,
      transactionId: transaction._id || '',
      transactionName: transaction.description,
    });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.transactionId;
    if (!id) return;

    try {
      setActionLoading(id);
      const response = await fetch(`/api/automatic-transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      // Remove from local state
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      setDeleteConfirm({
        isOpen: false,
        transactionId: null,
        transactionName: '',
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({
      isOpen: false,
      transactionId: null,
      transactionName: '',
    });
  };

  const getRecurrenceText = (transaction: AutomaticTransaction) => {
    const interval = transaction.recurrenceInterval || 1;
    const intervalText = interval === 1 ? '' : `${interval} `;

    switch (transaction.recurrenceType) {
      case RecurrenceType.DAILY:
        return `Every ${intervalText}day${interval > 1 ? 's' : ''}`;
      case RecurrenceType.WEEKLY:
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName =
          transaction.dayOfWeek !== undefined
            ? dayNames[transaction.dayOfWeek]
            : '';
        return `Every ${intervalText}${dayName || 'week'}`;
      case RecurrenceType.MONTHLY:
        const day = transaction.dayOfMonth
          ? ` on ${transaction.dayOfMonth}`
          : '';
        return `Monthly${day}`;
      case RecurrenceType.YEARLY:
        return `Yearly`;
      default:
        return 'Custom';
    }
  };

  const getStatusColor = (status: AutoTransactionStatus) => {
    switch (status) {
      case AutoTransactionStatus.ACTIVE:
        return 'text-success bg-success/10 border-success/30';
      case AutoTransactionStatus.PAUSED:
        return 'text-warning bg-warning/10 border-warning/30';
      default:
        return 'text-primary-muted bg-primary-card/50 border-primary-border';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent shadow-lg shadow-primary-accent/20"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-accent/10 rounded-lg flex items-center justify-center">
            <FiRepeat className="w-5 h-5 text-primary-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-foreground">
              Automatic Transactions
            </h2>
            <p className="text-primary-muted-foreground mt-1">
              Manage your recurring income and expenses
            </p>
          </div>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 bg-primary-accent text-primary-accent-foreground rounded-lg hover:bg-primary-accent/90 transition-colors font-medium"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Auto Transaction
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3">
          <div className="w-5 h-5 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-destructive text-xs font-bold">!</span>
          </div>
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="text-center py-16 bg-primary-card rounded-xl border border-primary-border border-dashed">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiRepeat className="w-8 h-8 text-primary-accent" />
            </div>
            <h3 className="text-xl font-semibold text-primary-foreground mb-2">
              No Automatic Transactions Yet
            </h3>
            <p className="text-primary-muted mb-8 leading-relaxed">
              Set up recurring transactions to automatically track your regular
              income and expenses. Save time and stay organized with automated
              financial management.
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-6 py-3 bg-primary-accent text-primary-accent-foreground rounded-lg hover:bg-primary-accent/90 transition-colors font-medium shadow-sm"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Create Your First Auto Transaction
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-primary-card border border-primary-border rounded-xl p-6 hover:shadow-lg hover:border-primary-accent/50 transition-all duration-200 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Transaction Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {transaction.type === 'income' ? (
                          <FiTrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <FiTrendingDown className="w-4 h-4 text-destructive" />
                        )}
                        <h3 className="text-lg font-semibold text-primary truncate">
                          {transaction.description}
                        </h3>
                      </div>
                      <p className="text-primary-muted-foreground text-sm flex items-center gap-1">
                        <FiDollarSign className="w-3 h-3" />
                        {transaction.category}
                        {transaction.subcategory &&
                          ` → ${transaction.subcategory}`}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status === AutoTransactionStatus.ACTIVE && (
                        <FiPlay className="w-3 h-3 text-success" />
                      )}
                      {transaction.status === AutoTransactionStatus.PAUSED && (
                        <FiPause className="w-3 h-3 text-warning" />
                      )}
                      {transaction.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-4">
                    <div className="flex items-center text-primary-foreground bg-primary-card/50 rounded-lg p-3 border border-primary-border/30">
                      <FiDollarSign className="w-4 h-4 mr-2 text-primary-muted flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-primary-muted-foreground font-medium">
                          Amount
                        </p>
                        <span
                          className={
                            transaction.type === 'expense'
                              ? 'text-destructive font-semibold'
                              : 'text-success font-semibold'
                          }
                        >
                          {transaction.type === 'expense' ? '-' : '+'}
                          {formatCurrency(transaction.amount, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-primary-foreground bg-primary-card/50 rounded-lg p-3 border border-primary-border/30">
                      <FiRepeat className="w-4 h-4 mr-2 text-primary-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-primary-muted-foreground font-medium">
                          Frequency
                        </p>
                        <span className="text-primary-foreground">
                          {getRecurrenceText(transaction)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-primary-foreground bg-primary-card/50 rounded-lg p-3 border border-primary-border/30">
                      <FiCalendar className="w-4 h-4 mr-2 text-primary-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-primary-muted-foreground font-medium">
                          Next Run
                        </p>
                        <span className="text-primary-foreground">
                          {format(
                            new Date(transaction.nextExecutionDate),
                            'MMM d, yyyy'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {transaction.notes && (
                    <div className="mt-4 p-3 bg-primary-card/30 rounded-lg border border-primary-border/20">
                      <p className="text-sm text-primary-muted italic flex items-start gap-2">
                        <span className="text-primary-muted/60 mt-0.5">
                          &ldquo;
                        </span>
                        {transaction.notes}
                        <span className="text-primary-muted/60 mt-0.5">
                          &rdquo;
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2 lg:self-start">
                  <div className="flex lg:flex-col gap-1">
                    {/* Status Toggle */}
                    {transaction.status === AutoTransactionStatus.ACTIVE ? (
                      <button
                        onClick={() =>
                          transaction._id &&
                          updateTransactionStatus(
                            transaction._id,
                            AutoTransactionStatus.PAUSED
                          )
                        }
                        disabled={actionLoading === transaction._id}
                        className="p-2 text-warning hover:bg-warning/10 rounded-lg transition-colors disabled:opacity-50 group/action"
                        title="Pause Transaction"
                      >
                        <FiPause className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          transaction._id &&
                          updateTransactionStatus(
                            transaction._id,
                            AutoTransactionStatus.ACTIVE
                          )
                        }
                        disabled={actionLoading === transaction._id}
                        className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors disabled:opacity-50 group/action"
                        title="Activate Transaction"
                      >
                        <FiPlay className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(transaction)}
                      disabled={actionLoading === transaction._id}
                      className="p-2 text-primary-accent hover:bg-primary-accent/10 rounded-lg transition-colors disabled:opacity-50 group/action"
                      title="Edit Transaction"
                    >
                      <FiEdit className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteClick(transaction)}
                      disabled={actionLoading === transaction._id}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 group/action"
                      title="Delete Transaction"
                    >
                      <FiTrash2 className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Automatic Transaction"
        message={`Are you sure you want to delete "${deleteConfirm.transactionName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={actionLoading === deleteConfirm.transactionId}
      />
    </div>
  );
}
