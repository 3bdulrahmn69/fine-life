import { useState } from 'react';
import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import {
  AutomaticTransactionFormData,
  RecurrenceType,
  AutomaticTransaction,
} from '../../types/automatic-transaction';
import { TransactionType } from '../../types/transaction';
import { CurrencyCode } from '../../lib/currency';
import AmountInput from './amount-input';
import CategorySelector from './category-selector';
import CurrencySelector from './currency-selector';

interface AutoTransactionFormProps {
  initialData?: AutomaticTransaction;
  currency?: CurrencyCode;
  onSubmit: (data: AutomaticTransactionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function AutoTransactionForm({
  initialData,
  currency = 'USD',
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AutoTransactionFormProps) {
  const [formData, setFormData] = useState<AutomaticTransactionFormData>({
    amount: initialData?.amount.toString() || '',
    currency: initialData?.currency || currency,
    description: initialData?.description || '',
    category: initialData?.category || '',
    subcategory: initialData?.subcategory || '',
    notes: initialData?.notes || '',
    isMandatory: initialData?.isMandatory || false,
    type: initialData?.type || 'expense',

    recurrenceType: initialData?.recurrenceType || RecurrenceType.MONTHLY,
    recurrenceInterval: initialData?.recurrenceInterval?.toString() || '1',
    dayOfMonth: initialData?.dayOfMonth?.toString() || '',
    dayOfWeek: initialData?.dayOfWeek?.toString() || '',

    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().slice(0, 10)
      : '',
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

    if (!formData.startDate) {
      newErrors.startDate = 'Please select a start date';
    }

    if (
      !formData.recurrenceInterval ||
      parseInt(formData.recurrenceInterval) <= 0
    ) {
      newErrors.recurrenceInterval = 'Please enter a valid interval';
    }

    // Validate day of month for monthly/yearly
    if (
      [RecurrenceType.MONTHLY, RecurrenceType.YEARLY].includes(
        formData.recurrenceType
      )
    ) {
      if (
        !formData.dayOfMonth ||
        parseInt(formData.dayOfMonth) < 1 ||
        parseInt(formData.dayOfMonth) > 31
      ) {
        newErrors.dayOfMonth = 'Please select a valid day (1-31)';
      }
    }

    // Validate day of week for weekly
    if (formData.recurrenceType === RecurrenceType.WEEKLY) {
      if (
        !formData.dayOfWeek ||
        parseInt(formData.dayOfWeek) < 0 ||
        parseInt(formData.dayOfWeek) > 6
      ) {
        newErrors.dayOfWeek = 'Please select a day of the week';
      }
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
      console.error('Error submitting automatic transaction:', error);
    }
  };

  const updateFormData = (
    field: keyof AutomaticTransactionFormData,
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
            onClick={() => updateFormData('type', 'expense')}
            disabled={isSubmitting}
            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center space-x-2 ${
              formData.type === 'expense'
                ? 'border-destructive bg-destructive/10 text-destructive'
                : 'border-primary-border text-primary-foreground hover:border-primary-accent'
            }`}
          >
            <FiTrendingDown className="w-4 h-4" />
            <span>Expense</span>
          </button>
          <button
            type="button"
            onClick={() => updateFormData('type', 'income')}
            disabled={isSubmitting}
            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center space-x-2 ${
              formData.type === 'income'
                ? 'border-success bg-success/10 text-success'
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
          placeholder="e.g., Netflix subscription, Monthly salary"
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
        transactionType={formData.type as TransactionType}
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

      {/* Recurrence Settings */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Frequency <span className="text-destructive">*</span>
        </label>
        <select
          value={formData.recurrenceType}
          onChange={(e) =>
            updateFormData('recurrenceType', e.target.value as RecurrenceType)
          }
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-primary-border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent bg-primary-input text-primary-input-foreground"
        >
          <option value={RecurrenceType.DAILY}>Daily</option>
          <option value={RecurrenceType.WEEKLY}>Weekly</option>
          <option value={RecurrenceType.MONTHLY}>Monthly</option>
          <option value={RecurrenceType.YEARLY}>Yearly</option>
        </select>
      </div>

      {/* Recurrence Interval */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Repeat every <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            min="1"
            max="99"
            value={formData.recurrenceInterval}
            onChange={(e) =>
              updateFormData('recurrenceInterval', e.target.value)
            }
            disabled={isSubmitting}
            className={`w-20 px-3 py-2 border rounded-lg text-center focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
              errors.recurrenceInterval
                ? 'border-destructive'
                : 'border-primary-border'
            }`}
          />
          <span className="text-primary-foreground">
            {formData.recurrenceType === RecurrenceType.DAILY &&
              (parseInt(formData.recurrenceInterval) === 1 ? 'day' : 'days')}
            {formData.recurrenceType === RecurrenceType.WEEKLY &&
              (parseInt(formData.recurrenceInterval) === 1 ? 'week' : 'weeks')}
            {formData.recurrenceType === RecurrenceType.MONTHLY &&
              (parseInt(formData.recurrenceInterval) === 1
                ? 'month'
                : 'months')}
            {formData.recurrenceType === RecurrenceType.YEARLY &&
              (parseInt(formData.recurrenceInterval) === 1 ? 'year' : 'years')}
          </span>
        </div>
        {errors.recurrenceInterval && (
          <p className="mt-1 text-sm text-destructive">
            {errors.recurrenceInterval}
          </p>
        )}
      </div>

      {/* Day of Week for Weekly */}
      {formData.recurrenceType === RecurrenceType.WEEKLY && (
        <div>
          <label className="block text-sm font-medium text-primary-foreground mb-2">
            Day of Week
          </label>
          <select
            value={formData.dayOfWeek}
            onChange={(e) => updateFormData('dayOfWeek', e.target.value)}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent bg-primary-input text-primary-input-foreground ${
              errors.dayOfWeek ? 'border-destructive' : 'border-primary-border'
            }`}
          >
            <option value="">Select day</option>
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
          </select>
          {errors.dayOfWeek && (
            <p className="mt-1 text-sm text-destructive">{errors.dayOfWeek}</p>
          )}
        </div>
      )}

      {/* Day of Month for Monthly/Yearly */}
      {[RecurrenceType.MONTHLY, RecurrenceType.YEARLY].includes(
        formData.recurrenceType
      ) && (
        <div>
          <label className="block text-sm font-medium text-primary-foreground mb-2">
            Day of Month
          </label>
          <input
            type="number"
            min="1"
            max="31"
            value={formData.dayOfMonth}
            onChange={(e) => updateFormData('dayOfMonth', e.target.value)}
            placeholder="e.g., 15 for the 15th"
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
              errors.dayOfMonth ? 'border-destructive' : 'border-primary-border'
            }`}
          />
          <p className="mt-1 text-xs text-primary-muted">
            If a month doesn&apos;t have the selected day, the transaction will
            occur on the last day of that month.
          </p>
          {errors.dayOfMonth && (
            <p className="mt-1 text-sm text-destructive">{errors.dayOfMonth}</p>
          )}
        </div>
      )}

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Start Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => updateFormData('startDate', e.target.value)}
          required
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
            errors.startDate ? 'border-destructive' : 'border-primary-border'
          }`}
        />
        <p className="mt-1 text-xs text-primary-muted">
          When should the first transaction occur?
        </p>
        {errors.startDate && (
          <p className="mt-1 text-sm text-destructive">{errors.startDate}</p>
        )}
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          End Date (Optional)
        </label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => updateFormData('endDate', e.target.value)}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-primary-border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
        />
        <p className="mt-1 text-xs text-primary-muted">
          Leave empty to continue indefinitely
        </p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          placeholder="Add any additional details about this automatic transaction..."
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
          className="flex-1 px-4 py-2 bg-primary-accent text-primary-accent-foreground rounded-lg hover:bg-primary-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Saving...'
            : initialData
            ? 'Update Auto Transaction'
            : 'Create Auto Transaction'}
        </button>
      </div>
    </form>
  );
}
