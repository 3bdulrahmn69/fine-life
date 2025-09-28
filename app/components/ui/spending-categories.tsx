'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, TransactionType } from '../../types/transaction';
import { TRANSACTION_CATEGORIES } from '../../data/categories';
import { formatCurrency, CurrencyCode } from '../../lib/currency';
import { CardContent } from './card';
import { FiBarChart } from 'react-icons/fi';
import {
  convertTransactionsToUserCurrency,
  calculateCategoryTotals,
} from '../../lib/transaction-converter';

interface CategorySpending {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  transactionCount: number;
}

// Type for recharts data
interface ChartDataItem {
  [key: string]: unknown;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface SpendingCategoriesProps {
  transactions: Transaction[];
  currency?: CurrencyCode;
  period?: 'week' | 'month' | 'year';
}

export default function SpendingCategories({
  transactions,
  currency = 'USD' as CurrencyCode,
  period = 'month',
}: SpendingCategoriesProps) {
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const processTransactionsWithCurrency = async () => {
      if (!currency || transactions.length === 0) {
        setCategoryData([]);
        setTotalExpenses(0);
        return;
      }

      try {
        // Filter transactions based on period and type
        const now = new Date();
        const periodStart = new Date();

        switch (period) {
          case 'week':
            periodStart.setDate(now.getDate() - 7);
            break;
          case 'month':
            periodStart.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            periodStart.setFullYear(now.getFullYear() - 1);
            break;
        }

        const periodTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate >= periodStart &&
            transactionDate <= now &&
            transaction.type === TransactionType.EXPENSE
          );
        });

        // Convert transactions to user currency
        const convertedTransactions = await convertTransactionsToUserCurrency(
          periodTransactions,
          currency
        );

        // Calculate total expenses with converted amounts
        const total = convertedTransactions.reduce(
          (sum, transaction) => sum + transaction.convertedAmount,
          0
        );
        setTotalExpenses(total);

        // Group by category and calculate spending with converted amounts
        const categoryMap = new Map<string, CategorySpending>();

        convertedTransactions.forEach((transaction) => {
          const category = TRANSACTION_CATEGORIES.find(
            (cat) => cat.id === transaction.category
          );
          if (!category) return;

          const existing = categoryMap.get(category.id);
          if (existing) {
            existing.amount += transaction.convertedAmount;
            existing.transactionCount += 1;
          } else {
            categoryMap.set(category.id, {
              id: category.id,
              name: category.name,
              amount: transaction.convertedAmount,
              percentage: 0, // Will calculate after
              color: category.color,
              icon: category.icon,
              transactionCount: 1,
            });
          }
        });

        // Calculate percentages and sort by amount
        const categories = Array.from(categoryMap.values()).map((cat) => ({
          ...cat,
          percentage: total > 0 ? (cat.amount / total) * 100 : 0,
        }));

        categories.sort((a, b) => b.amount - a.amount);
        setCategoryData(categories); // Show all categories
      } catch (error) {
        console.error(
          'Error processing spending categories with currency:',
          error
        );
        setCategoryData([]);
        setTotalExpenses(0);
      }
    };

    processTransactionsWithCurrency();
  }, [transactions, period, currency]);

  if (categoryData.length === 0) {
    return (
      <CardContent>
        <div className="flex items-center justify-center h-48 text-primary-muted-foreground">
          <div className="text-center">
            <FiBarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No expense data available for the selected period.</p>
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pie Chart */}
      <div className="h-64 sm:h-80 lg:h-96 w-full spending-pie-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            className="focus:outline-none focus-visible:outline-none"
            style={{
              outline: 'none',
              userSelect: 'none',
            }}
          >
            <Pie
              data={categoryData as unknown as ChartDataItem[]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#000000"
              dataKey="amount"
              minAngle={3}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(
                value: number,
                name: string,
                props: { payload?: { percentage?: number } }
              ) => [
                formatCurrency(value, currency),
                `${name} (${props.payload?.percentage?.toFixed(1)}%)`,
              ]}
              contentStyle={{
                color: '#ffffff',
                border: '1px solid var(--primary-border)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend with Percentages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
        {categoryData.map((category) => (
          <div
            key={`legend-${category.id}`}
            className="flex items-center space-x-2"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-primary-foreground truncate">
                {category.name}
              </div>
              <div className="text-xs text-primary-muted-foreground">
                {category.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-primary-border">
        <div className="text-center p-2 sm:p-0">
          <div className="text-xs sm:text-sm text-primary-muted-foreground">
            Categories
          </div>
          <div className="text-base sm:text-lg font-semibold text-primary-foreground">
            {categoryData.length}
          </div>
        </div>
        <div className="text-center p-2 sm:p-0">
          <div className="text-xs sm:text-sm text-primary-muted-foreground">
            Avg/Category
          </div>
          <div className="text-base sm:text-lg font-semibold text-primary-foreground">
            {formatCurrency(totalExpenses / categoryData.length, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
