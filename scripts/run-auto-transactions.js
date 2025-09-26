#!/usr/bin/env node

/**
 * Manual Automatic Transactions Executor
 *
 * This script manually triggers the execution of all due automatic transactions.
 * Useful for testing or manual execution outside of the scheduled cron job.
 *
 * Usage:
 *   node run-auto-transactions.js [local|production]
 */

// Load environment variables from .env.local for local development
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');

// Configuration
const LOCAL_URL = 'http://localhost:3000';
const PRODUCTION_URL = process.env.VERCEL_URL || 'https://fine-life.vercel.app';
const CRON_SECRET = process.env.CRON_SECRET;

// Test mode: 'local' or 'production'
const mode = process.argv[2] || 'local';
const baseUrl = mode === 'production' ? PRODUCTION_URL : LOCAL_URL;

console.log(`🚀 Running Automatic Transactions (${mode} mode)`);
console.log(`📡 Target: ${baseUrl}`);
console.log(`🔐 CRON_SECRET: ${CRON_SECRET ? 'Set ✅' : 'Not Set ❌'}\n`);

if (!CRON_SECRET) {
  console.log('❌ Error: CRON_SECRET environment variable is not set');
  console.log('💡 Set it by running: export CRON_SECRET=your-secret-here');
  process.exit(1);
}

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;

    const req = client.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function runAutomaticTransactions() {
  console.log('⏳ Executing automatic transactions...\n');

  try {
    const response = await makeRequest(
      `${baseUrl}/api/cron/execute-automatic-transactions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CRON_SECRET}`,
          'Content-Type': 'application/json',
          'User-Agent': 'manual-execution-script',
        },
        body: JSON.stringify({}),
      }
    );

    if (response.status === 200) {
      const data = response.data;

      console.log('✅ Automatic transactions executed successfully!\n');
      console.log('📊 Results:');
      console.log(`   • Processed: ${data.processed || 0} transactions`);
      console.log(`   • Errors: ${data.errors?.length || 0}`);
      console.log(`   • Timestamp: ${data.timestamp}`);

      if (data.errors && data.errors.length > 0) {
        console.log('\n⚠️  Errors encountered:');
        data.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      } else {
        console.log('\n🎉 All transactions processed without errors!');
      }

      if (data.processed === 0) {
        console.log('\n💡 No transactions were due for processing.');
        console.log('   This could mean:');
        console.log('   • No automatic transactions are configured');
        console.log('   • All automatic transactions are PAUSED');
        console.log('   • No transactions are due today');
      }
    } else if (response.status === 401) {
      console.log('❌ Authentication failed!');
      console.log(
        '💡 Check that CRON_SECRET is correct and matches your Vercel environment variable'
      );
    } else {
      console.log(`❌ Request failed with status ${response.status}`);
      console.log(`📊 Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ Error executing automatic transactions:');
    console.log(`   ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused. Make sure:');
      if (mode === 'local') {
        console.log(
          '   • Your local development server is running (npm run dev)'
        );
        console.log('   • The server is accessible at http://localhost:3000');
      } else {
        console.log('   • Your production app is deployed and accessible');
        console.log('   • The URL is correct in the script configuration');
      }
    }
  }
}

// Run the script
console.log('🎯 Starting execution...\n');
runAutomaticTransactions();
