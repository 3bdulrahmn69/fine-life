import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { AutomaticTransactionService } from '../../../services/automaticTransactionService';

export async function POST() {
  try {
    // Check authentication - only authenticated users can trigger processing
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(
      'Manual trigger of automatic transaction processing requested by:',
      session.user.id
    );

    // Process automatic transactions
    const result =
      await AutomaticTransactionService.processAutomaticTransactions();

    return NextResponse.json({
      success: true,
      processed: result.processed,
      errors: result.errors,
      message: `Successfully processed ${
        result.processed
      } automatic transaction${result.processed === 1 ? '' : 's'}`,
    });
  } catch (error) {
    console.error('Error processing automatic transactions:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// For development/admin purposes - get processing status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Automatic transaction processing service is available',
      lastRun: null, // TODO: Store last run timestamp in database
    });
  } catch (error) {
    console.error('Error checking processing status:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
