'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  FiPlus,
  FiTarget,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiTrendingDown,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  BudgetWithSpending,
  BudgetStats,
  BudgetFormData,
} from '../../types/budget';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { formatCurrency, CurrencyCode } from '../../lib/currency';
import {
  convertTransactionsToUserCurrency,
  ConvertedTransaction,
} from '../../lib/transaction-converter';
import CircularProgress from '../../components/ui/circular-progress';
import BudgetForm from '../../components/ui/budget-form';
import Modal from '../../components/ui/modal';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ui/confirm-modal';
import PageHeader from '../../components/ui/page-header';
import { useBudgetCache, useCacheUtils } from '../../hooks/useDataCache';

export default function BudgetPage() {
  const { data: session } = useSession();
  const { preferences } = useUserPreferences();
  const {
    getCachedBudgets,
    fetchBudgets: fetchBudgetsFromCache,
    invalidateBudgets,
    isLoading: cacheLoading,
  } = useBudgetCache();
  const { invalidateBudgetRelated } = useCacheUtils();
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([]);
  const [stats, setStats] = useState<BudgetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetWithSpending | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    budgetId: string | null;
    budgetName: string;
  }>({
    isOpen: false,
    budgetId: null,
    budgetName: '',
  });
  const [categoryTransactions, setCategoryTransactions] = useState<{
    isOpen: boolean;
    category: string;
    transactions: ConvertedTransaction[];
    loading: boolean;
    budgetName: string;
  }>({
    isOpen: false,
    category: '',
    transactions: [],
    loading: false,
    budgetName: '',
  });

  // Load budgets using cache
  const loadBudgets = async (forceRefresh = false) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);

      // Try to get cached data first
      if (!forceRefresh) {
        const cachedData = getCachedBudgets() as {
          budgets?: BudgetWithSpending[];
          stats?: BudgetStats;
        } | null;
        if (cachedData) {
          setBudgets(cachedData.budgets || []);
          setStats(cachedData.stats || null);
          setLoading(false);
          return;
        }
      }

      // Fetch from API and cache
      const data = await fetchBudgetsFromCache(forceRefresh);
      setBudgets(data.budgets || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [session?.user?.id]);

  const handleSubmitBudget = async (formData: BudgetFormData) => {
    try {
      setIsSubmitting(true);

      const budgetData = {
        name: formData.name,
        category: formData.isOverall ? undefined : formData.category,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        isOverall: formData.isOverall,
      };

      const url = editingBudget
        ? `/api/budget/${editingBudget._id}`
        : '/api/budget';
      const method = editingBudget ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save budget');
      }

      toast.success(
        editingBudget
          ? 'Budget updated successfully'
          : 'Budget created successfully'
      );
      setShowBudgetForm(false);
      setEditingBudget(null);

      // Invalidate cache and refresh
      invalidateBudgets();
      loadBudgets(true);
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save budget'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBudget = (budget: BudgetWithSpending) => {
    setEditingBudget(budget);
    setShowBudgetForm(true);
  };

  const handleViewCategoryTransactions = async (budget: BudgetWithSpending) => {
    if (budget.isOverall || !budget.category) return;

    setCategoryTransactions({
      isOpen: true,
      category: budget.category,
      transactions: [],
      loading: true,
      budgetName: budget.name,
    });

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // JavaScript months are 0-indexed

      const response = await fetch(
        `/api/transactions?category=${encodeURIComponent(
          budget.category
        )}&month=${month}&year=${year}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();

      // Convert transactions to user's preferred currency
      const convertedTransactions = await convertTransactionsToUserCurrency(
        data.transactions || [],
        preferences.currency
      );

      setCategoryTransactions((prev) => ({
        ...prev,
        transactions: convertedTransactions,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching category transactions:', error);
      toast.error('Failed to load transactions');
      setCategoryTransactions((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      const response = await fetch(`/api/budget/${budgetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      toast.success('Budget deleted successfully');
      setDeleteConfirm({ isOpen: false, budgetId: null, budgetName: '' });

      // Invalidate cache and refresh
      invalidateBudgets();
      loadBudgets(true);
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const categoryBudgets = budgets.filter((b) => !b.isOverall);
  const overallBudget = budgets.find((b) => b.isOverall);

  if (loading || cacheLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          icon={<FiTarget className="w-5 h-5 text-primary-accent" />}
          title="Budget Tracker"
          subtitle={`${getCurrentMonth()} • Manage your spending limits`}
          actionButton={{
            label: 'Create Budget',
            onClick: () => setShowBudgetForm(true),
            icon: <FiPlus className="w-4 h-4" />,
          }}
        />

        {/* Overall Budget */}
        {overallBudget && (
          <div className="bg-primary-card rounded-xl p-6 border border-primary-border">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-shrink-0">
                <CircularProgress
                  percentage={overallBudget.percentage}
                  spent={overallBudget.spent}
                  total={overallBudget.amount}
                  currency={overallBudget.currency}
                  size={140}
                  strokeWidth={10}
                  isOverBudget={overallBudget.isOverBudget}
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary-foreground">
                      {overallBudget.name}
                    </h2>
                    <p className="text-primary-muted-foreground text-sm">
                      Overall monthly spending limit
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditBudget(overallBudget)}
                      className="p-2 text-primary-muted-foreground hover:text-primary-foreground hover:bg-primary-muted/50 rounded-lg transition-colors"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          budgetId: overallBudget._id!,
                          budgetName: overallBudget.name,
                        })
                      }
                      className="p-2 text-primary-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-primary-input/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-primary-muted-foreground text-xs mb-1">
                      <FiTrendingDown className="w-3 h-3" />
                      Total Spent
                    </div>
                    <div className="font-bold text-primary-foreground">
                      {formatCurrency(
                        overallBudget.spent,
                        overallBudget.currency as CurrencyCode
                      )}
                    </div>
                  </div>

                  <div className="bg-primary-input/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-primary-muted-foreground text-xs mb-1">
                      <FiTrendingUp className="w-3 h-3" />
                      Budget Limit
                    </div>
                    <div className="font-bold text-primary-foreground">
                      {formatCurrency(
                        overallBudget.amount,
                        overallBudget.currency as CurrencyCode
                      )}
                    </div>
                  </div>

                  <div className="bg-primary-input/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-primary-muted-foreground text-xs mb-1">
                      <FiTarget className="w-3 h-3" />
                      Remaining
                    </div>
                    <div
                      className={`font-bold ${
                        overallBudget.remaining >= 0
                          ? 'text-success'
                          : 'text-destructive'
                      }`}
                    >
                      {formatCurrency(
                        Math.abs(overallBudget.remaining),
                        overallBudget.currency as CurrencyCode
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Budgets */}
        {categoryBudgets.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-primary-foreground mb-4">
              Category Budgets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categoryBudgets.map((budget) => (
                <div
                  key={budget._id}
                  className="bg-primary-card rounded-xl p-6 border border-primary-border cursor-pointer hover:bg-primary-card/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group"
                  onClick={() => handleViewCategoryTransactions(budget)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-primary-foreground">
                        {budget.name}
                      </h3>
                      <p className="text-sm text-primary-muted-foreground capitalize">
                        {budget.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBudget(budget);
                        }}
                        className="p-1.5 text-primary-muted-foreground hover:text-primary-foreground hover:bg-primary-muted/50 rounded-lg transition-colors"
                      >
                        <FiEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({
                            isOpen: true,
                            budgetId: budget._id!,
                            budgetName: budget.name,
                          });
                        }}
                        className="p-1.5 text-primary-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <CircularProgress
                      percentage={budget.percentage}
                      spent={budget.spent}
                      total={budget.amount}
                      currency={budget.currency}
                      size={110}
                      strokeWidth={6}
                      isOverBudget={budget.isOverBudget}
                      showLabels={false}
                    />
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-primary-muted-foreground">
                      Remaining:{' '}
                      {formatCurrency(
                        Math.max(0, budget.remaining),
                        budget.currency as CurrencyCode
                      )}
                    </div>
                    {budget.isOverBudget && (
                      <div className="text-xs text-destructive font-medium mt-1">
                        Over budget by{' '}
                        {formatCurrency(
                          budget.spent - budget.amount,
                          budget.currency as CurrencyCode
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-1 text-xs text-primary-muted-foreground/60 mt-2 group-hover:text-primary-foreground/80 transition-colors">
                      <FiEye className="w-3 h-3" />
                      Click to view transactions
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-primary-card rounded-xl border border-primary-border">
            <div className="w-16 h-16 bg-primary-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTarget className="w-8 h-8 text-primary-accent" />
            </div>
            <h3 className="text-lg font-semibold text-primary-foreground mb-2">
              No Budgets Set
            </h3>
            <p className="text-primary-muted-foreground mb-6">
              Create your first budget to start tracking your spending limits
              and take control of your finances.
            </p>
            <button
              onClick={() => setShowBudgetForm(true)}
              className="inline-flex items-center px-6 py-3 bg-primary-accent text-primary-accent-foreground rounded-lg hover:bg-primary-accent/90 transition-colors font-medium"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Create Your First Budget
            </button>
          </div>
        )}
      </div>

      {/* Budget Form Modal */}
      <Modal
        isOpen={showBudgetForm}
        onClose={() => {
          setShowBudgetForm(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Budget' : 'Create New Budget'}
      >
        <BudgetForm
          initialData={
            editingBudget
              ? {
                  name: editingBudget.name,
                  category: editingBudget.category,
                  amount: editingBudget.amount.toString(),
                  currency: editingBudget.currency,
                  isOverall: editingBudget.isOverall,
                }
              : undefined
          }
          currency={preferences.currency}
          onSubmit={handleSubmitBudget}
          onCancel={() => {
            setShowBudgetForm(false);
            setEditingBudget(null);
          }}
          isSubmitting={isSubmitting}
          isEditing={!!editingBudget}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() =>
          setDeleteConfirm({ isOpen: false, budgetId: null, budgetName: '' })
        }
        onConfirm={() =>
          deleteConfirm.budgetId && handleDeleteBudget(deleteConfirm.budgetId)
        }
        title="Delete Budget"
        message={`Are you sure you want to delete "${deleteConfirm.budgetName}"? This action cannot be undone.`}
        confirmText="Delete Budget"
        variant="danger"
      />

      {/* Category Transactions Modal */}
      <Modal
        isOpen={categoryTransactions.isOpen}
        onClose={() =>
          setCategoryTransactions({
            isOpen: false,
            category: '',
            transactions: [],
            loading: false,
            budgetName: '',
          })
        }
        title={`${categoryTransactions.budgetName} - Transactions`}
        size="lg"
      >
        <div className="space-y-4">
          {categoryTransactions.loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : categoryTransactions.transactions.length === 0 ? (
            <div className="text-center py-8 text-primary-muted-foreground">
              <FiTarget className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>
                No transactions found for this category in the current month.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {categoryTransactions.transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="bg-primary-input/30 rounded-lg p-4 border border-primary-border"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-primary-foreground mb-1">
                        {transaction.description}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-primary-muted-foreground">
                        <span className="capitalize">
                          {transaction.category}
                        </span>
                        {transaction.subcategory && (
                          <span>• {transaction.subcategory}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                      {transaction.notes && (
                        <p className="text-sm text-primary-muted-foreground mt-2">
                          {transaction.notes}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <div className="font-semibold text-primary-foreground">
                        {formatCurrency(
                          transaction.convertedAmount,
                          preferences.currency
                        )}
                      </div>
                      <div className="text-xs text-primary-muted-foreground">
                        {transaction.originalCurrency !==
                        preferences.currency ? (
                          <span>
                            Original:{' '}
                            {formatCurrency(
                              transaction.originalAmount,
                              transaction.originalCurrency
                            )}
                          </span>
                        ) : (
                          <span>{preferences.currency}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {categoryTransactions.transactions.length > 0 && (
            <div className="border-t border-primary-border pt-4 mt-4">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-primary-foreground">Total:</span>
                <span className="text-primary-foreground">
                  {formatCurrency(
                    categoryTransactions.transactions.reduce(
                      (sum, t) => sum + t.convertedAmount,
                      0
                    ),
                    preferences.currency
                  )}
                </span>
              </div>
              <div className="text-xs text-primary-muted-foreground mt-1 text-right">
                All amounts converted to {preferences.currency}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
