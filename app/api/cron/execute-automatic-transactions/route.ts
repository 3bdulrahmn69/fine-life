import { NextRequest, NextResponse } from 'next/server';
import { AutomaticTransactionService } from '../../../services/automaticTransactionService';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication check for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

    // Verify the request is from a valid source (cron job or admin)
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[CRON] Starting automatic transactions processing...');

    // Execute the automatic transactions service
    const result =
      await AutomaticTransactionService.processAutomaticTransactions();

    console.log(
      `[CRON] Processing complete: ${result.processed} transactions processed`
    );

    if (result.errors.length > 0) {
      console.error('[CRON] Errors occurred:', result.errors);
    }

    return NextResponse.json({
      success: true,
      message: 'Automatic transactions processed successfully',
      processed: result.processed,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      '[CRON] Fatal error processing automatic transactions:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process automatic transactions',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Optional: Allow GET for manual testing (remove in production)
export async function GET() {
  return NextResponse.json({
    message: 'Automatic Transaction Processor',
    usage:
      'Send a POST request with Bearer token to execute automatic transactions',
    timestamp: new Date().toISOString(),
  });
}
