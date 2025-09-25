import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { AutomaticTransactionService } from '../../../services/automaticTransactionService';
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

    // Verify the transaction belongs to the user
    const autoTransaction = await AutomaticTransaction.findOne({
      _id: transactionId,
      userId: session.user.id,
    });

    if (!autoTransaction) {
      return NextResponse.json(
        { error: 'Automatic transaction not found' },
        { status: 404 }
      );
    }

    // Create a transaction from the automatic transaction (for testing)
    const result =
      await AutomaticTransactionService.processAutomaticTransactions();

    return NextResponse.json({
      success: true,
      message: 'Manual execution completed',
      processed: result.processed,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in manual execution:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
