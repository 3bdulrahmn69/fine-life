'use client';

import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { BudgetWithSpending } from '../../types/budget';
import { formatCurrency, CurrencyCode } from '../../lib/currency';
import CircularProgress from './circular-progress';

interface CategoryBudgetCardProps {
  budget: BudgetWithSpending;
  onEdit: (budget: BudgetWithSpending) => void;
  onDelete: (budgetId: string, budgetName: string) => void;
  onViewTransactions: (budget: BudgetWithSpending) => void;
}

export default function CategoryBudgetCard({
  budget,
  onEdit,
  onDelete,
  onViewTransactions,
}: CategoryBudgetCardProps) {
  return (
    <div
      className="bg-primary-card rounded-xl p-6 border border-primary-border cursor-pointer hover:bg-primary-card/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group"
      onClick={() => onViewTransactions(budget)}
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
              onEdit(budget);
            }}
            className="p-1.5 text-primary-muted-foreground hover:text-primary-foreground hover:bg-primary-muted/50 rounded-lg transition-colors"
          >
            <FiEdit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(budget._id!, budget.name);
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
  );
}