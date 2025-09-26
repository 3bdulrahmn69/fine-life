import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import AutomaticTransaction from '../../../models/AutomaticTransaction';
import { AutoTransactionStatus } from '../../../types/automatic-transaction';

// Health check endpoint for automatic transactions system
export async function GET() {
  try {
    await connectDB();
    
    // Get system status
    const now = new Date();
    const activeTransactions = await AutomaticTransaction.countDocuments({
      status: AutoTransactionStatus.ACTIVE,
    });
    
    const dueTransactions = await AutomaticTransaction.countDocuments({
      status: AutoTransactionStatus.ACTIVE,
      nextExecutionDate: { $lte: now },
    });
    
    const upcomingTransactions = await AutomaticTransaction.countDocuments({
      status: AutoTransactionStatus.ACTIVE,
      nextExecutionDate: { $gt: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
    });

    return NextResponse.json({
      status: 'healthy',
      timestamp: now.toISOString(),
      statistics: {
        activeTransactions,
        dueNow: dueTransactions,
        dueNext24Hours: upcomingTransactions,
      },
      cronEndpoint: '/api/cron/execute-automatic-transactions',
      lastUpdated: now.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}