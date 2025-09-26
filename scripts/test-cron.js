#!/usr/bin/env node

/**
 * Test script for Vercel Cron Job functionality
 *
 * This script helps verify that the automatic transaction processing
 * works correctly both locally and in production.
 *
 * Usage:
 *   node test-cron.js [local|production]
 */

// Load environment variables from .env.local for local development
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');

// Configuration
const LOCAL_URL = 'http://localhost:3000';
const PRODUCTION_URL = process.env.VERCEL_URL || 'https://your-app.vercel.app';
const CRON_SECRET = process.env.CRON_SECRET || 'your-cron-secret-here';

// Test mode: 'local' or 'production'
const mode = process.argv[2] || 'local';
const baseUrl = mode === 'production' ? PRODUCTION_URL : LOCAL_URL;

console.log(`🧪 Testing Cron Job Functionality (${mode} mode)`);
console.log(`📡 Base URL: ${baseUrl}`);
console.log(`🔐 Using CRON_SECRET: ${CRON_SECRET ? '***' : 'NOT SET'}\n`);

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

// Test functions
async function testHealthCheck() {
  console.log('🔍 1. Testing Health Check...');
  try {
    const response = await makeRequest(`${baseUrl}/api/health`);

    if (response.status === 200) {
      console.log('   ✅ Health check passed');
      console.log(`   📊 Response:`, response.data);
    } else {
      console.log(`   ❌ Health check failed (${response.status})`);
      console.log(`   📊 Response:`, response.data);
    }
  } catch (error) {
    console.log('   ❌ Health check error:', error.message);
  }
  console.log();
}

async function testCronEndpoint() {
  console.log('🔍 2. Testing Cron Endpoint (GET)...');
  try {
    const response = await makeRequest(
      `${baseUrl}/api/cron/execute-automatic-transactions`
    );

    if (response.status === 200) {
      console.log('   ✅ Cron endpoint is accessible');
      console.log(`   📊 Response:`, response.data);
    } else {
      console.log(`   ⚠️  Cron endpoint returned ${response.status}`);
      console.log(`   📊 Response:`, response.data);
    }
  } catch (error) {
    console.log('   ❌ Cron endpoint error:', error.message);
  }
  console.log();
}

async function testCronAuthentication() {
  console.log('🔍 3. Testing Cron Authentication...');

  if (!CRON_SECRET || CRON_SECRET === 'your-cron-secret-here') {
    console.log('   ⚠️  CRON_SECRET not properly configured');
    console.log('   💡 Set CRON_SECRET environment variable for this test');
    console.log();
    return;
  }

  try {
    const response = await makeRequest(
      `${baseUrl}/api/cron/execute-automatic-transactions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CRON_SECRET}`,
          'Content-Type': 'application/json',
          'User-Agent': 'test-script',
        },
        body: JSON.stringify({}),
      }
    );

    if (response.status === 200) {
      console.log('   ✅ Authentication successful');
      console.log(
        `   📊 Processed: ${response.data.processed || 0} transactions`
      );
      console.log(`   📊 Errors: ${response.data.errors?.length || 0}`);

      if (response.data.errors && response.data.errors.length > 0) {
        console.log('   ⚠️  Errors occurred:');
        response.data.errors.forEach((error, index) => {
          console.log(`      ${index + 1}. ${error}`);
        });
      }
    } else {
      console.log(`   ❌ Authentication failed (${response.status})`);
      console.log(`   📊 Response:`, response.data);
    }
  } catch (error) {
    console.log('   ❌ Authentication test error:', error.message);
  }
  console.log();
}

async function testVercelCronHeaders() {
  console.log('🔍 4. Testing Vercel Cron Headers...');

  if (!CRON_SECRET || CRON_SECRET === 'your-cron-secret-here') {
    console.log('   ⚠️  CRON_SECRET not properly configured');
    console.log('   💡 Set CRON_SECRET environment variable for this test');
    console.log();
    return;
  }

  try {
    const response = await makeRequest(
      `${baseUrl}/api/cron/execute-automatic-transactions`,
      {
        method: 'POST',
        headers: {
          'x-vercel-cron-secret': CRON_SECRET,
          'user-agent': 'vercel-cron',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );

    if (response.status === 200) {
      console.log('   ✅ Vercel cron headers accepted');
      console.log(
        `   📊 Processed: ${response.data.processed || 0} transactions`
      );
      console.log(`   📊 Errors: ${response.data.errors?.length || 0}`);
    } else {
      console.log(`   ❌ Vercel cron headers rejected (${response.status})`);
      console.log(`   📊 Response:`, response.data);
    }
  } catch (error) {
    console.log('   ❌ Vercel cron headers test error:', error.message);
  }
  console.log();
}

async function testUnauthorizedAccess() {
  console.log('🔍 5. Testing Unauthorized Access...');
  try {
    const response = await makeRequest(
      `${baseUrl}/api/cron/execute-automatic-transactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );

    if (response.status === 401) {
      console.log('   ✅ Unauthorized access correctly blocked');
    } else {
      console.log(`   ⚠️  Expected 401, got ${response.status}`);
      console.log(`   📊 Response:`, response.data);
    }
  } catch (error) {
    console.log('   ❌ Unauthorized access test error:', error.message);
  }
  console.log();
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Cron Job Tests\n');

  await testHealthCheck();
  await testCronEndpoint();
  await testCronAuthentication();
  await testVercelCronHeaders();
  await testUnauthorizedAccess();

  console.log('✅ All tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Deploy to Vercel if testing locally');
  console.log('   2. Set CRON_SECRET environment variable in Vercel');
  console.log('   3. Monitor Vercel function logs after midnight UTC');
  console.log('   4. Check your transactions list for auto-generated entries');
  console.log(
    '\n💡 Tip: Create some automatic transactions to see the cron job in action!'
  );
}

// Run the tests
runTests().catch(console.error);
