'use client';

import { useState, useEffect } from 'react';
import { FiTrendingDown, FiTrendingUp, FiCheck } from 'react-icons/fi';
import {
  TransactionFormData,
  TransactionType,
  Transaction,
} from '../../types/transaction';
import { CurrencyCode } from '../../lib/currency';
import AmountInput from './amount-input';
import CategorySelector from './category-selector';
import CurrencySelector from './currency-selector';

interface TransactionFormProps {
  initialData?: Transaction;
  currency?: CurrencyCode;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TransactionForm({
  initialData,
  currency = 'USD',
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: initialData?.amount.toString() || '',
    currency: initialData?.currency || currency,
    description: initialData?.description || '',
    category: initialData?.category || '',
    subcategory: initialData?.subcategory || '',
    notes: initialData?.notes || '',
    isMandatory: initialData?.isMandatory || false,
    isAutomatic: false, // Always false for regular transactions
    type: initialData?.type || TransactionType.EXPENSE,
    date: initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 16)
      : (() => {
          const now = new Date();
          // Format for datetime-local input: YYYY-MM-DDTHH:MM
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        })(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
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
      console.error('Error submitting transaction:', error);
    }
  };

  const updateFormData = (
    field: keyof TransactionFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Transaction Type
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => updateFormData('type', TransactionType.EXPENSE)}
            disabled={isSubmitting}
            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center space-x-2 ${
              formData.type === TransactionType.EXPENSE
                ? 'border-destructive bg-destructive/10 text-destructive'
                : 'border-primary-border text-primary-foreground hover:border-primary-accent'
            }`}
          >
            <FiTrendingDown className="w-4 h-4" />
            <span>Expense</span>
          </button>
          <button
            type="button"
            onClick={() => updateFormData('type', TransactionType.INCOME)}
            disabled={isSubmitting}
            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center space-x-2 ${
              formData.type === TransactionType.INCOME
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-primary-border text-primary-foreground hover:border-primary-accent'
            }`}
          >
            <FiTrendingUp className="w-4 h-4" />
            <span>Income</span>
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Amount <span className="text-destructive">*</span>
        </label>
        <AmountInput
          value={formData.amount}
          onChange={(value) => updateFormData('amount', value)}
          currency={formData.currency as CurrencyCode}
          error={errors.amount}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Currency */}
      <div>
        <CurrencySelector
          value={formData.currency as CurrencyCode}
          onChange={(currency) => updateFormData('currency', currency)}
          disabled={isSubmitting}
          label="Currency"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Description <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="What did you spend money on?"
          required
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
            errors.description ? 'border-destructive' : 'border-primary-border'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Category Selection */}
      <CategorySelector
        selectedCategory={formData.category}
        selectedSubcategory={formData.subcategory}
        transactionType={formData.type}
        onCategoryChange={(categoryId) =>
          updateFormData('category', categoryId)
        }
        onSubcategoryChange={(subcategoryId) =>
          updateFormData('subcategory', subcategoryId)
        }
        error={errors.category}
        required
        disabled={isSubmitting}
      />

      {/* Date and Time */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Date & Time <span className="text-destructive">*</span>
        </label>
        <input
          type="datetime-local"
          value={formData.date}
          onChange={(e) => updateFormData('date', e.target.value)}
          required
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
            errors.date ? 'border-destructive' : 'border-primary-border'
          }`}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-destructive">{errors.date}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          placeholder="Add any additional notes..."
          rows={3}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-primary-border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent resize-none"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isMandatory"
            checked={formData.isMandatory}
            onChange={(e) => updateFormData('isMandatory', e.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 text-primary-accent focus:ring-primary-accent border-primary-border rounded"
          />
          <label
            htmlFor="isMandatory"
            className="ml-2 block text-sm text-primary-foreground"
          >
            This is a mandatory expense (essential for living)
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 border border-primary-border text-primary-foreground rounded-lg hover:bg-primary-card/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-primary-accent text-primary-accent-foreground hover:bg-primary-accent/90"
        >
          {isSubmitting
            ? 'Saving...'
            : initialData
            ? 'Update Transaction'
            : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
