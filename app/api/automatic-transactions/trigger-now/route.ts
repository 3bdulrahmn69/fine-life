import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import AutomaticTransaction from '../../../models/AutomaticTransaction';
import connectMongoDB from '../../../lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Import the service for date normalization
    const { AutomaticTransactionService } = await import('../../../services/automaticTransactionService');

    // Update the nextExecutionDate to now (normalized to midnight for consistency)
    const result = await AutomaticTransaction.findOneAndUpdate(
      {
        _id: transactionId,
        userId: session.user.id,
      },
      {
        nextExecutionDate: AutomaticTransactionService.normalizeDateToMidnight(new Date()),
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Automatic transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction scheduled for immediate execution',
      transaction: {
        id: result._id,
        description: result.description,
        amount: result.amount,
        nextExecutionDate: result.nextExecutionDate,
      },
    });
  } catch (error) {
    console.error('Error updating transaction for testing:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to schedule transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
