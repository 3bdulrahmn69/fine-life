import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../lib/mongodb';
import AutomaticTransaction from '../../models/AutomaticTransaction';
import { AutoTransactionStatus } from '../../types/automatic-transaction';
import { AutomaticTransactionService } from '../../services/automaticTransactionService';

// GET /api/automatic-transactions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const query: Record<string, string> = { userId: session.user.id };

    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.category = category;

    const autoTransactions = await AutomaticTransaction.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      transactions: autoTransactions,
      count: autoTransactions.length,
    });
  } catch (error) {
    console.error('Error fetching automatic transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automatic transactions' },
      { status: 500 }
    );
  }
}

// POST /api/automatic-transactions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    // Normalize start and end dates to midnight (00:00:00)
    const normalizedStartDate = AutomaticTransactionService.createMidnightDate(
      data.startDate
    );
    const normalizedEndDate = data.endDate
      ? AutomaticTransactionService.createMidnightDate(data.endDate)
      : undefined;

    // Calculate the next execution date (will be normalized to midnight automatically)
    const nextExecutionDate =
      AutomaticTransactionService.calculateInitialNextExecutionDate(
        normalizedStartDate,
        data.recurrenceType,
        parseInt(data.recurrenceInterval) || 1,
        data.dayOfMonth ? parseInt(data.dayOfMonth) : undefined,
        data.dayOfWeek ? parseInt(data.dayOfWeek) : undefined
      );

    const autoTransaction = new AutomaticTransaction({
      ...data,
      userId: session.user.id,
      amount: parseFloat(data.amount),
      recurrenceInterval: parseInt(data.recurrenceInterval) || 1,
      dayOfMonth: data.dayOfMonth ? parseInt(data.dayOfMonth) : undefined,
      dayOfWeek: data.dayOfWeek ? parseInt(data.dayOfWeek) : undefined,
      startDate: normalizedStartDate,
      endDate: normalizedEndDate,
      nextExecutionDate,
      status: AutoTransactionStatus.ACTIVE,
      executionCount: 0,
    });

    await autoTransaction.save();

    return NextResponse.json({
      message: 'Automatic transaction created successfully',
      transaction: autoTransaction,
    });
  } catch (error) {
    console.error('Error creating automatic transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create automatic transaction' },
      { status: 500 }
    );
  }
}
