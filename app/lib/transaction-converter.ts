import { currencyConverter, convertAmount } from './currency-converter';
import { CurrencyCode } from './currency';
import { Transaction, TransactionType } from '../types/transaction';

/**
 * Transaction conversion utilities for consistent currency handling
 */

export interface ConvertedTransaction extends Transaction {
  convertedAmount: number;
  originalAmount: number;
  originalCurrency: CurrencyCode;
  displayCurrency: CurrencyCode;
  conversionRate: number;
}

/**
 * Convert a single transaction to user's preferred currency
 */
export async function convertTransactionToUserCurrency(
  transaction: Transaction,
  userCurrency: CurrencyCode
): Promise<ConvertedTransaction> {
  const originalCurrency = (transaction.currency as CurrencyCode) || 'USD';
  const originalAmount = transaction.amount;

  try {
    const conversionResult = await currencyConverter.convertCurrency(
      originalAmount,
      originalCurrency,
      userCurrency
    );

    return {
      ...transaction,
      convertedAmount: conversionResult.convertedAmount,
      originalAmount,
      originalCurrency,
      displayCurrency: userCurrency,
      conversionRate: conversionResult.rate,
      // Keep original amount field unchanged to prevent double conversion
    };
  } catch (error) {
    console.error('Error converting transaction:', error);

    // Fallback: return original transaction with conversion values set to original
    return {
      ...transaction,
      convertedAmount: originalAmount,
      originalAmount,
      originalCurrency,
      displayCurrency: userCurrency,
      conversionRate: 1,
      // Keep original amount unchanged
    };
  }
}

/**
 * Convert multiple transactions to user's preferred currency
 */
export async function convertTransactionsToUserCurrency(
  transactions: Transaction[],
  userCurrency: CurrencyCode
): Promise<ConvertedTransaction[]> {
  // Process all conversions in parallel for better performance
  const conversionPromises = transactions.map((transaction) =>
    convertTransactionToUserCurrency(transaction, userCurrency)
  );

  try {
    return await Promise.all(conversionPromises);
  } catch (error) {
    console.error('Error converting transactions:', error);

    // Fallback: return transactions with original amounts
    return transactions.map((transaction) => ({
      ...transaction,
      convertedAmount: transaction.amount,
      originalAmount: transaction.amount,
      originalCurrency: (transaction.currency as CurrencyCode) || 'USD',
      displayCurrency: userCurrency,
      conversionRate: 1,
    }));
  }
}

/**
 * Calculate monthly totals in user's preferred currency
 */
export async function calculateMonthlyTotals(
  transactions: Transaction[],
  userCurrency: CurrencyCode
): Promise<{
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}> {
  try {
    // Convert all transactions to user currency
    const convertedTransactions = await convertTransactionsToUserCurrency(
      transactions,
      userCurrency
    );

    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    convertedTransactions.forEach((transaction) => {
      const amount = transaction.convertedAmount;

      if (transaction.type === TransactionType.INCOME) {
        totalIncome += amount;
        incomeCount++;
      } else if (transaction.type === TransactionType.EXPENSE) {
        totalExpenses += amount;
        expenseCount++;
      }
    });

    return {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netAmount: Math.round((totalIncome - totalExpenses) * 100) / 100,
      transactionCount: convertedTransactions.length,
      incomeCount,
      expenseCount,
    };
  } catch (error) {
    console.error('Error calculating monthly totals:', error);

    // Fallback: return zero totals
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netAmount: 0,
      transactionCount: 0,
      incomeCount: 0,
      expenseCount: 0,
    };
  }
}

/**
 * Calculate category totals in user's preferred currency
 */
export async function calculateCategoryTotals(
  transactions: Transaction[],
  userCurrency: CurrencyCode
): Promise<
  Record<string, { amount: number; count: number; type: TransactionType }>
> {
  try {
    const convertedTransactions = await convertTransactionsToUserCurrency(
      transactions,
      userCurrency
    );

    const categoryTotals: Record<
      string,
      { amount: number; count: number; type: TransactionType }
    > = {};

    convertedTransactions.forEach((transaction) => {
      const category = transaction.category;
      const amount = transaction.convertedAmount;

      if (!categoryTotals[category]) {
        categoryTotals[category] = {
          amount: 0,
          count: 0,
          type: transaction.type,
        };
      }

      categoryTotals[category].amount += amount;
      categoryTotals[category].count++;
    });

    // Round all amounts to 2 decimal places
    Object.keys(categoryTotals).forEach((category) => {
      categoryTotals[category].amount =
        Math.round(categoryTotals[category].amount * 100) / 100;
    });

    return categoryTotals;
  } catch (error) {
    console.error('Error calculating category totals:', error);
    return {};
  }
}

/**
 * Get conversion rate between two currencies (uses latest rates)
 */
export async function getConversionRate(
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> {
  if (fromCurrency === toCurrency) return 1;

  try {
    const result = await currencyConverter.convertCurrency(
      1,
      fromCurrency,
      toCurrency
    );
    return result.rate;
  } catch (error) {
    console.error('Error getting conversion rate:', error);
    return 1;
  }
}

/**
 * Convert amount with proper rounding and formatting
 */
export async function convertAndRoundAmount(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> {
  if (fromCurrency === toCurrency) return amount;

  try {
    const convertedAmount = await convertAmount(
      amount,
      fromCurrency,
      toCurrency
    );
    return Math.round(convertedAmount * 100) / 100;
  } catch (error) {
    console.error('Error converting and rounding amount:', error);
    return amount;
  }
}
