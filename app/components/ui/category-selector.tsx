'use client';

import { useState } from 'react';
import { TransactionType } from '../../types/transaction';
import {
  getCategoriesByType,
  getAllSubcategories,
} from '../../data/categories';
import { CategoryIcon } from '../../lib/icons';

interface CategorySelectorProps {
  selectedCategory: string;
  selectedSubcategory?: string;
  transactionType: TransactionType;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategoryId: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function CategorySelector({
  selectedCategory,
  selectedSubcategory,
  transactionType,
  onCategoryChange,
  onSubcategoryChange,
  error,
  required = false,
  disabled = false,
}: CategorySelectorProps) {
  const [showSubcategories, setShowSubcategories] = useState(
    !!selectedCategory
  );

  const categories = getCategoriesByType(transactionType);
  const subcategories = selectedCategory
    ? getAllSubcategories(selectedCategory)
    : [];

  const handleCategoryChange = (categoryId: string) => {
    onCategoryChange(categoryId);
    setShowSubcategories(!!categoryId);

    // Reset subcategory when category changes
    if (selectedSubcategory) {
      onSubcategoryChange('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-2">
          Category {required && <span className="text-red-500">*</span>}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              disabled={disabled}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1
                ${
                  selectedCategory === category.id
                    ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                    : 'border-primary-border hover:border-primary-accent/50 bg-primary-card text-primary-card-foreground'
                }
                ${
                  disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-sm cursor-pointer'
                }
              `}
            >
              <CategoryIcon categoryId={category.id} className="w-5 h-5" />
              <span className="text-xs font-medium text-center">
                {category.name}
              </span>
            </button>
          ))}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {/* Subcategory Selection */}
      {showSubcategories && subcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-primary-foreground mb-2">
            Subcategory (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                type="button"
                onClick={() => onSubcategoryChange(subcategory.id)}
                disabled={disabled}
                className={`
                  px-3 py-1 rounded-full text-sm border transition-all duration-200
                  ${
                    selectedSubcategory === subcategory.id
                      ? 'border-primary-accent bg-primary-accent text-primary-accent-foreground'
                      : 'border-primary-border bg-primary-card text-primary-card-foreground hover:border-primary-accent/50'
                  }
                  ${
                    disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:shadow-sm'
                  }
                `}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
