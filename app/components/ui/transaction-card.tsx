'use client';

import { useState } from 'react';
import { Transaction, TransactionType } from '../../types/transaction';
import { getCategoryById, getSubcategoryById } from '../../data/categories';
import { formatCurrency, CurrencyCode } from '../../lib/currency';
import { format } from 'date-fns';
import { CategoryIcon } from '../../lib/icons';

interface TransactionCardProps {
  transaction: Transaction;
  currency?: CurrencyCode;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  showActions?: boolean;
}

export default function TransactionCard({
  transaction,
  currency = 'USD',
  onEdit,
  onDelete,
  showActions = true,
}: TransactionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const category = getCategoryById(transaction.category);
  const subcategory = transaction.subcategory
    ? getSubcategoryById(transaction.category, transaction.subcategory)
    : null;

  const isIncome = transaction.type === TransactionType.INCOME;
  const amountDisplay = isIncome ? transaction.amount : -transaction.amount;

  const hasNotes = transaction.notes && transaction.notes.trim().length > 0;

  return (
    <div className="bg-primary-card rounded-lg border border-primary-border p-3 sm:p-4 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
        <div
          className={`flex items-center space-x-3 flex-1 ${
            hasNotes ? 'cursor-pointer' : ''
          }`}
          onClick={hasNotes ? () => setIsExpanded(!isExpanded) : undefined}
        >
          {/* Category Icon */}
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{
              backgroundColor: category?.color || 'var(--primary-accent)',
            }}
          >
            <CategoryIcon
              categoryId={transaction.category}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
              <h3 className="text-sm sm:text-base font-medium text-primary-card-foreground truncate">
                {transaction.description}
              </h3>
              <span
                className={`text-base sm:text-lg font-semibold ${
                  isIncome ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isIncome ? '+' : ''}
                {formatCurrency(amountDisplay, currency)}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-primary-muted-foreground">
              <span>{category?.name}</span>
              {subcategory && (
                <>
                  <span>•</span>
                  <span>{subcategory.name}</span>
                </>
              )}
              <span>•</span>
              <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
              <span>•</span>
              <span>{format(new Date(transaction.date), 'h:mm a')}</span>
            </div>

            {/* Transaction Tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              {transaction.isMandatory && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive text-destructive-foreground">
                  Mandatory
                </span>
              )}
              {transaction.isAutomatic && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-accent text-primary-accent-foreground">
                  Automatic
                </span>
              )}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isIncome
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isIncome ? 'Income' : 'Expense'}
              </span>
            </div>

            {/* Notes Arrow */}
            {hasNotes && (
              <div className="mt-3 flex justify-start">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-accent/10 hover:bg-primary-accent/20 text-primary-accent transition-all duration-200 hover:scale-105"
                  title={isExpanded ? 'Hide notes' : 'Show notes'}
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && ((onEdit && !transaction.isAutomatic) || onDelete) && (
          <div className="flex items-center space-x-2 sm:ml-4 self-end sm:self-start">
            {onEdit && !transaction.isAutomatic && (
              <button
                onClick={() => onEdit(transaction)}
                className="p-1.5 sm:p-1 text-primary-muted-foreground hover:text-primary-accent transition-colors rounded-md hover:bg-primary-accent/10"
                title="Edit transaction"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction._id!)}
                className="p-1.5 sm:p-1 text-primary-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
                title="Delete transaction"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded Notes */}
      {isExpanded && hasNotes && (
        <div className="mt-4 pt-4 border-t border-primary-border/50">
          <div>
            <h4 className="text-sm font-medium text-primary-foreground mb-2">
              Notes:
            </h4>
            <div className="bg-primary-muted/20 rounded-lg p-3 text-sm text-primary-foreground whitespace-pre-wrap">
              {transaction.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
