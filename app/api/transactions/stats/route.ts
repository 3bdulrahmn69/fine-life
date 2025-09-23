import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
import { TransactionType } from '../../../types/transaction';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: Record<string, unknown> = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }

    const matchFilter: Record<string, unknown> = { userId: session.user.id };
    if (Object.keys(dateFilter).length > 0) {
      matchFilter.date = dateFilter;
    }

    // Aggregate transaction stats
    const [stats] = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', TransactionType.INCOME] }, '$amount', 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [
                { $eq: ['$type', TransactionType.EXPENSE] },
                '$amount',
                0,
              ],
            },
          },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    // Get category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          income: {
            $sum: {
              $cond: [
                { $eq: ['$_id.type', TransactionType.INCOME] },
                '$amount',
                0,
              ],
            },
          },
          expenses: {
            $sum: {
              $cond: [
                { $eq: ['$_id.type', TransactionType.EXPENSE] },
                '$amount',
                0,
              ],
            },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const result = {
      totalIncome: stats?.totalIncome || 0,
      totalExpenses: stats?.totalExpenses || 0,
      balance: (stats?.totalIncome || 0) - (stats?.totalExpenses || 0),
      transactionCount: stats?.transactionCount || 0,
      categoriesBreakdown: categoryBreakdown.map((cat) => ({
        category: cat._id,
        income: cat.income,
        expenses: cat.expenses,
        total: cat.total,
        percentage:
          stats?.totalIncome + stats?.totalExpenses > 0
            ? (cat.total / (stats.totalIncome + stats.totalExpenses)) * 100
            : 0,
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
