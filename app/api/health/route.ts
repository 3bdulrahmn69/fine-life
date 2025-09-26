import { NextResponse } from 'next/server';

// Simple health check endpoint for the application
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Fine Life API is running',
    features: {
      automaticTransactions: 'enabled',
      cronJobs: 'configured',
    },
  });
}
