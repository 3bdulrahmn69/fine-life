import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../lib/mongodb';
import AutomaticTransaction from '../../../models/AutomaticTransaction';
import { AutomaticTransactionService } from '../../../services/automaticTransactionService';

// POST /api/automatic-transactions/recalculate
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find all automatic transactions for this user
    const autoTransactions = await AutomaticTransaction.find({
      userId: session.user.id,
    });

    let updatedCount = 0;
    const errors: string[] = [];

    for (const transaction of autoTransactions) {
      try {
        // Recalculate the next execution date
        const nextExecutionDate =
          AutomaticTransactionService.calculateInitialNextExecutionDate(
            transaction.startDate,
            transaction.recurrenceType,
            transaction.recurrenceInterval || 1,
            transaction.dayOfMonth,
            transaction.dayOfWeek
          );

        // Update the transaction
        await AutomaticTransaction.findByIdAndUpdate(transaction._id, {
          nextExecutionDate,
        });

        updatedCount++;
      } catch (error) {
        const errorMessage = `Failed to update transaction ${
          transaction._id
        }: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMessage);
      }
    }

    return NextResponse.json({
      message: `Successfully recalculated ${updatedCount} automatic transactions`,
      updatedCount,
      errors,
    });
  } catch (error) {
    console.error('Error recalculating automatic transactions:', error);
    return NextResponse.json(
      { error: 'Failed to recalculate automatic transactions' },
      { status: 500 }
    );
  }
}
