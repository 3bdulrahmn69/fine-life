'use client';

import { useState } from 'react';
import { BudgetFormData } from '../../types/budget';
import { TRANSACTION_CATEGORIES } from '../../data/categories';
import { CurrencyCode } from '../../lib/currency';
import AmountCurrencyInput from './amount-currency-input';
import { FiSave, FiX } from 'react-icons/fi';
import { Category, TransactionType } from '../../types/transaction';

interface BudgetFormProps {
  initialData?: Partial<BudgetFormData>;
  currency?: CurrencyCode;
  onSubmit: (data: BudgetFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEditing?: boolean;
}

export default function BudgetForm({
  initialData,
  currency = 'USD',
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEditing = false,
}: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    name: initialData?.name || '',
    category: initialData?.category || '',
    amount: initialData?.amount || '',
    currency: initialData?.currency || currency,
    isOverall: initialData?.isOverall || false,
  });

  const [errors, setErrors] = useState<Partial<BudgetFormData>>({});

  const expenseCategories = TRANSACTION_CATEGORIES.filter(
    (cat: Category) => cat.type === TransactionType.EXPENSE
  );

  const validateForm = () => {
    const newErrors: Partial<BudgetFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Budget name is required';
    }

    if (!formData.isOverall && !formData.category) {
      newErrors.category = 'Category is required for category budgets';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting budget:', error);
    }
  };

  const handleBudgetTypeChange = (isOverall: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isOverall,
      category: isOverall ? '' : prev.category,
      name: isOverall ? 'Monthly Budget' : prev.name,
    }));
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Budget Type Selection */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-3">
          Budget Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleBudgetTypeChange(false)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              !formData.isOverall
                ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                : 'border-primary-border bg-primary-card hover:border-primary-accent/50'
            }`}
          >
            <div className="font-medium text-sm">Category Budget</div>
            <div className="text-xs text-primary-muted-foreground mt-1">
              Set budget for a specific category
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleBudgetTypeChange(true)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              formData.isOverall
                ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                : 'border-primary-border bg-primary-card hover:border-primary-accent/50'
            }`}
          >
            <div className="font-medium text-sm">Overall Budget</div>
            <div className="text-xs text-primary-muted-foreground mt-1">
              Set overall monthly spending limit
            </div>
          </button>
        </div>
      </div>

      {/* Budget Name */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Budget Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={
            formData.isOverall ? 'Monthly Budget' : 'Enter budget name'
          }
          className="w-full px-3 py-2 bg-primary-input text-primary-input-foreground border-2 border-primary-border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-all duration-200"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Category Selection (only for category budgets) */}
      {!formData.isOverall && (
        <div>
          <label className="block text-sm font-medium text-primary-foreground mb-2">
            Category <span className="text-destructive">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 bg-primary-input text-primary-input-foreground border-2 border-primary-border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-all duration-200"
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            {expenseCategories.map((category: Category) => (
              <option key={category.id} value={category.name.toLowerCase()}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-destructive">{errors.category}</p>
          )}
        </div>
      )}

      {/* Amount and Currency */}
      <AmountCurrencyInput
        label="Budget Amount"
        value={formData.amount}
        onChange={(value) => setFormData({ ...formData, amount: value })}
        currency={formData.currency as CurrencyCode}
        onCurrencyChange={(curr) =>
          setFormData({ ...formData, currency: curr })
        }
        placeholder="0.00"
        required
        disabled={isSubmitting}
        error={errors.amount}
      />

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2 bg-primary-muted text-primary-muted-foreground rounded-lg hover:bg-primary-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiX className="w-4 h-4 inline mr-2" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:flex-1 px-6 py-2 bg-primary-accent text-primary-accent-foreground rounded-lg hover:bg-primary-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-accent-foreground mr-2"></div>
              {isEditing ? 'Updating Budget...' : 'Creating Budget...'}
            </>
          ) : (
            <>
              <FiSave className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Budget' : 'Create Budget'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
