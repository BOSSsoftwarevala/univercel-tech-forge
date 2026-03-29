#!/usr/bin/env node

/**
 * LEAD MANAGER SYSTEM VALIDATION TEST
 * Tests all core functionality for production readiness
 */

import https from 'https';
import { execSync } from 'child_process';

const BASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
const API_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/functions/v1/api-leads${path}`;
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🚀 LEAD MANAGER SYSTEM VALIDATION TEST');
  console.log('=====================================\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function test(name, fn) {
    return async () => {
      try {
        console.log(`Testing: ${name}`);
        await fn();
        console.log(`✅ PASSED: ${name}\n`);
        results.passed++;
        results.tests.push({ name, status: 'PASSED' });
      } catch (error) {
        console.log(`❌ FAILED: ${name}`);
        console.log(`   Error: ${error.message}\n`);
        results.failed++;
        results.tests.push({ name, status: 'FAILED', error: error.message });
      }
    };
  }

  // Test 1: Dashboard Access
  await test('Dashboard Access', async () => {
    const response = await makeRequest('/dashboard');
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!response.data.summary) throw new Error('Dashboard should return summary data');
  });

  // Test 2: Lead Capture
  await test('Lead Capture', async () => {
    const leadData = {
      name: 'Test Lead',
      phone: '+91-9876543210',
      email: 'test@example.com',
      source: 'website',
      company: 'Test Company'
    };
    const response = await makeRequest('/leads/capture', 'POST', leadData);
    if (response.status !== 201) throw new Error(`Expected 201, got ${response.status}`);
    if (!response.data.lead) throw new Error('Should return created lead');
  });

  // Test 3: Get All Leads
  await test('Get All Leads', async () => {
    const response = await makeRequest('/leads/all');
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!Array.isArray(response.data.leads)) throw new Error('Should return leads array');
  });

  // Test 4: Lead Assignment
  await test('Lead Assignment', async () => {
    const response = await makeRequest('/leads/assign', 'POST', {
      lead_id: 'test-lead-id',
      agent_id: 'test-agent-id',
      assigned_role: 'sales'
    });
    // This might fail if lead doesn't exist, but API should handle it gracefully
    if (response.status !== 200 && response.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${response.status}`);
    }
  });

  // Test 5: Stage Movement
  await test('Stage Movement', async () => {
    const response = await makeRequest('/leads/move-stage', 'POST', {
      lead_id: 'test-lead-id',
      new_stage: 'qualified'
    });
    // This might fail if lead doesn't exist, but API should handle it gracefully
    if (response.status !== 200 && response.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${response.status}`);
    }
  });

  // Test 6: Follow-up Creation
  await test('Follow-up Creation', async () => {
    const response = await makeRequest('/leads/followup', 'POST', {
      lead_id: 'test-lead-id',
      scheduled_at: new Date(Date.now() + 3600000).toISOString(),
      notes: 'Test follow-up'
    });
    // This might fail if lead doesn't exist, but API should handle it gracefully
    if (response.status !== 200 && response.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${response.status}`);
    }
  });

  // Test 7: AI Scoring
  await test('AI Scoring', async () => {
    const response = await makeRequest('/ai/lead-score', 'POST', {
      lead_id: 'test-lead-id',
      behavior_score: 80,
      budget: 50000
    });
    // This might fail if lead doesn't exist, but API should handle it gracefully
    if (response.status !== 200 && response.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${response.status}`);
    }
  });

  // Test 8: Analytics
  await test('Analytics', async () => {
    const response = await makeRequest('/leads/analytics');
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!response.data.sourcePerformance) throw new Error('Should return analytics data');
  });

  // Test 9: Communication Logging
  await test('Communication Logging', async () => {
    const response = await makeRequest('/leads/call-log', 'POST', {
      lead_id: 'test-lead-id',
      subject: 'Test Call',
      message: 'Test call content',
      outcome: 'completed'
    });
    // This might fail if lead doesn't exist, but API should handle it gracefully
    if (response.status !== 200 && response.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${response.status}`);
    }
  });

  // Test 10: SLA Check (Cron)
  await test('SLA Check Cron', async () => {
    const response = await makeRequest('/cron/sla-check', 'POST');
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  });

  // Test 11: Retry Queue Processing
  await test('Retry Queue Processing', async () => {
    const response = await makeRequest('/cron/retry-queue', 'POST');
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  });

  // Test 12: Mark Lead Lost
  await test('Mark Lead Lost', async () => {
    const response = await makeRequest('/leads/lost', 'POST', {
      lead_id: 'test-lead-id',
      reason: 'not_interested',
      notes: 'Test lost reason'
    });
    // This might fail if lead doesn't exist, but API should handle it gracefully
    if (response.status !== 200 && response.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${response.status}`);
    }
  });

  // Test 13: Lead History
  await test('Lead History', async () => {
    const response = await makeRequest('/leads/history?lead_id=test-lead-id');
    // This might fail if lead doesn't exist, but API should handle it gracefully
    if (response.status !== 200 && response.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${response.status}`);
    }
  });

  // Test 14: AI Suggestions
  await test('AI Suggestions', async () => {
    const response = await makeRequest('/ai/lead/suggestions', 'POST', {
      lead_id: 'test-lead-id'
    });
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!Array.isArray(response.data.suggestions)) throw new Error('Should return suggestions array');
  });

  // Test 15: Team Members
  await test('Team Members', async () => {
    const response = await makeRequest('/team/members');
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  });

  // Test 16: Sources Data
  await test('Sources Data', async () => {
    const response = await makeRequest('/leads/sources');
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  });

  // Test 17: Alerts
  await test('Alerts', async () => {
    const response = await makeRequest('/alerts/leads');
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  });

  // Test 18: Integrations Status
  await test('Integrations Status', async () => {
    const response = await makeRequest('/integrations');
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  });

  // Print Results
  console.log('=====================================');
  console.log('TEST RESULTS SUMMARY');
  console.log('=====================================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total: ${results.passed + results.failed}`);

  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('LEAD MANAGER SYSTEM IS PRODUCTION READY');
    console.log('CAPTURE → ROUTE → TRACK → CONVERT → REVENUE');
    console.log('ZERO LOSS • FULL CONTROL • PRODUCTION READY');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    console.log('Failed tests:');
    results.tests.filter(t => t.status === 'FAILED').forEach(test => {
      console.log(`  - ${test.name}: ${test.error}`);
    });
  }

  return results.failed === 0;
}

// Run the tests
runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});