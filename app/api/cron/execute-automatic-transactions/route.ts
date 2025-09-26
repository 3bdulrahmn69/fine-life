import { NextRequest, NextResponse } from 'next/server';
import { AutomaticTransactionService } from '../../../services/automaticTransactionService';

export async function POST(request: NextRequest) {
  try {
    // Vercel Cron authentication - Enhanced security check
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const vercelCronSecret = request.headers.get('x-vercel-cron-secret');
    const isVercelCron =
      request.headers.get('user-agent')?.includes('vercel-cron') ||
      request.headers.get('x-vercel-signature');

    // Enhanced security: Check multiple authentication methods
    const isAuthenticated =
      (isVercelCron && vercelCronSecret === cronSecret) || // Vercel cron with secret
      authHeader === `Bearer ${cronSecret}` || // Bearer token
      (process.env.NODE_ENV === 'development' && cronSecret); // Dev mode with secret

    if (!isAuthenticated) {
      console.error('[CRON] Authentication failed:', {
        hasAuthHeader: !!authHeader,
        hasCronSecret: !!cronSecret,
        hasVercelCronSecret: !!vercelCronSecret,
        isVercelCron,
        userAgent: request.headers.get('user-agent'),
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startTime = Date.now();
    console.log('[CRON] Starting automatic transactions processing...', {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      isVercelCron: isVercelCron,
      headers: Object.fromEntries(
        [
          'authorization',
          'x-vercel-cron-secret',
          'x-vercel-signature',
          'user-agent',
        ]
          .map((key) => [key, request.headers.get(key)])
          .filter(([, value]) => value)
      ),
    });

    // Execute the automatic transactions service with error handling
    const result =
      await AutomaticTransactionService.processAutomaticTransactions();

    const duration = Date.now() - startTime;
    console.log(`[CRON] Processing complete in ${duration}ms:`, {
      processed: result.processed,
      errors: result.errors.length,
      timestamp: new Date().toISOString(),
    });

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

// GET endpoint for manual testing and health checks
export async function GET(request: NextRequest) {
  try {
    // Allow manual execution with proper authentication
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (authHeader === `Bearer ${cronSecret}`) {
      // If authenticated, execute the cron job
      console.log(
        '[MANUAL] Starting manual automatic transactions processing...'
      );

      const result =
        await AutomaticTransactionService.processAutomaticTransactions();

      return NextResponse.json({
        success: true,
        message: 'Manual execution completed',
        processed: result.processed,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      });
    }

    // If not authenticated, just return status
    return NextResponse.json({
      message: 'Automatic Transaction Processor',
      status: 'Ready',
      usage:
        'Send a POST request (Vercel Cron) or GET with Bearer token for manual execution',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Manual execution failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
