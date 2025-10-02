import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../lib/mongodb';
import Budget from '../../models/Budget';
import Transaction from '../../models/Transaction';
import { TransactionType } from '../../types/transaction';
import { convertTransactionsToUserCurrency } from '../../lib/transaction-converter';
import { convertAmount } from '../../lib/currency-converter';
import UserPreferences from '../../models/UserPreferences';

// GET /api/budget
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    // Always use current month/year for spending calculation, but get ALL user budgets
    const now = new Date();
    const month = parseInt(
      searchParams.get('month') || (now.getMonth() + 1).toString()
    );
    const year = parseInt(
      searchParams.get('year') || now.getFullYear().toString()
    );

    // Get ALL budgets for the user and clean up any legacy fields
    await Budget.updateMany(
      {
        userId: session.user.id,
        $or: [
          { month: { $exists: true } },
          { year: { $exists: true } },
          { isActive: { $exists: true } },
        ],
      },
      {
        $unset: { month: 1, year: 1, isActive: 1 },
      }
    );

    // Get all budgets for the user
    const budgets = await Budget.find({
      userId: session.user.id,
    }).sort({
      isOverall: -1,
      category: 1,
    });

    // Get user preferences to determine preferred currency
    let userPreferences = await UserPreferences.findOne({
      userId: session.user.id,
    });

    if (!userPreferences) {
      userPreferences = new UserPreferences({
        userId: session.user.id,
        currency: 'USD',
        timezone: 'UTC',
      });
      await userPreferences.save();
    }

    const userCurrency = userPreferences.currency;

    // Get transactions for current month to calculate spending (this resets monthly)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      userId: session.user.id,
      date: { $gte: startDate, $lte: endDate },
      type: TransactionType.EXPENSE,
    });

    // Convert all transactions to user's preferred currency
    const convertedTransactions = await convertTransactionsToUserCurrency(
      transactions,
      userCurrency
    );

    // Calculate spending by category (using converted amounts)
    const spendingByCategory = convertedTransactions.reduce(
      (acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) acc[category] = 0;
        acc[category] += transaction.convertedAmount;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate total spending (using converted amounts)
    const totalSpent = convertedTransactions.reduce(
      (sum, t) => sum + t.convertedAmount,
      0
    );

    // Enhance budgets with spending data (convert budget amounts to user currency)
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        // Convert budget amount to user's preferred currency if different
        let convertedBudgetAmount = budget.amount;
        if (budget.currency !== userCurrency) {
          try {
            convertedBudgetAmount = await convertAmount(
              budget.amount,
              budget.currency,
              userCurrency
            );
          } catch (error) {
            console.error(
              `Failed to convert budget currency from ${budget.currency} to ${userCurrency}:`,
              error
            );
            // Keep original amount if conversion fails
            convertedBudgetAmount = budget.amount;
          }
        }

        const spent = budget.isOverall
          ? totalSpent
          : spendingByCategory[budget.category || ''] || 0;

        const remaining = convertedBudgetAmount - spent;
        const percentage =
          convertedBudgetAmount > 0 ? (spent / convertedBudgetAmount) * 100 : 0;

        return {
          ...budget.toObject(),
          amount: convertedBudgetAmount, // Use converted amount
          currency: userCurrency, // Update currency to user's preferred currency
          spent,
          remaining,
          percentage: Math.min(percentage, 100),
          isOverBudget: spent > convertedBudgetAmount,
        };
      })
    );

    // Calculate stats (using converted amounts)
    const totalBudget = budgetsWithSpending.reduce(
      (sum, b) => (b.isOverall ? sum : sum + b.amount),
      0
    );
    const overallBudgetWithSpending = budgetsWithSpending.find(
      (b) => b.isOverall
    );
    const categoryBudgets = budgetsWithSpending.filter((b) => !b.isOverall);

    const stats = {
      totalBudget: overallBudgetWithSpending?.amount || totalBudget,
      totalSpent,
      totalRemaining:
        (overallBudgetWithSpending?.amount || totalBudget) - totalSpent,
      overallPercentage: overallBudgetWithSpending?.amount
        ? (totalSpent / overallBudgetWithSpending.amount) * 100
        : 0,
      categoryBudgets,
      overallBudget: overallBudgetWithSpending,
    };

    return NextResponse.json({
      budgets: budgetsWithSpending,
      stats,
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/budget
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, amount, currency, isOverall } = body;

    // Validation
    if (!name?.trim() || !amount || !currency) {
      return NextResponse.json(
        { error: 'Name, amount, and currency are required' },
        { status: 400 }
      );
    }

    if (!isOverall && !category?.trim()) {
      return NextResponse.json(
        { error: 'Category is required for category budgets' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if a budget for this category/overall already exists
    const existingBudgetQuery: Record<string, unknown> = {
      userId: session.user.id,
      isOverall: Boolean(isOverall),
    };

    if (!isOverall && category?.trim()) {
      existingBudgetQuery.category = category.trim();
    }

    const existingBudget = await Budget.findOne(existingBudgetQuery);
    if (existingBudget) {
      const message = isOverall
        ? 'You already have an overall budget'
        : 'You already have a budget for this category';
      return NextResponse.json({ error: message }, { status: 409 });
    }

    const budgetData = {
      userId: session.user.id,
      name: name.trim(),
      category: isOverall ? undefined : category?.trim(),
      amount,
      currency: currency.toUpperCase(),
      isOverall: Boolean(isOverall),
      createdAt: new Date(),
    };

    const budget = new Budget(budgetData);
    await budget.save();

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
