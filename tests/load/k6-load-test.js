// ================================================================
// Software Vala - K6 Load Testing Script
// ================================================================

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const leadCreationErrors = new Counter('lead_creation_errors');
const walletTransactionErrors = new Counter('wallet_transaction_errors');
const demoClickErrors = new Counter('demo_click_errors');
const successRate = new Rate('success_rate');
const leadCreationTime = new Trend('lead_creation_time');

// Test configuration
export const options = {
  scenarios: {
    // Scenario 1: 50,000 leads per day simulation (steady load)
    daily_leads: {
      executor: 'constant-arrival-rate',
      rate: 35, // 35 leads per second = ~3M leads/day (scaled for test)
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 50,
      maxVUs: 200,
      exec: 'createLeads',
      startTime: '0s',
    },
    
    // Scenario 2: 200 concurrent developers
    developer_concurrency: {
      executor: 'constant-vus',
      vus: 200,
      duration: '5m',
      exec: 'developerWorkflow',
      startTime: '30s',
    },
    
    // Scenario 3: 5,000 reseller concurrent access
    reseller_load: {
      executor: 'ramping-vus',
      startVUs: 100,
      stages: [
        { duration: '1m', target: 1000 },
        { duration: '3m', target: 5000 },
        { duration: '1m', target: 100 },
      ],
      exec: 'resellerDemoAccess',
      startTime: '1m',
    },
    
    // Scenario 4: Demo click flood testing
    demo_click_flood: {
      executor: 'constant-arrival-rate',
      rate: 1000, // 1000 clicks per second
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 100,
      maxVUs: 500,
      exec: 'demoClickFlood',
      startTime: '2m',
    },
    
    // Scenario 5: Wallet transaction stress
    wallet_stress: {
      executor: 'shared-iterations',
      vus: 100,
      iterations: 10000,
      maxDuration: '5m',
      exec: 'walletTransactions',
      startTime: '3m',
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% under 500ms, 99% under 1s
    http_req_failed: ['rate<0.01'], // Less than 1% failure rate
    success_rate: ['rate>0.99'], // 99% success rate
    lead_creation_time: ['p(95)<300'], // Lead creation under 300ms
  },
};

const BASE_URL = __ENV.API_URL || 'https://feqdqyadkijpohyllfdq.supabase.co/functions/v1';
let authToken = '';

// Setup - Get auth token
export function setup() {
  const loginRes = http.post(`${BASE_URL}/api-auth/login`, JSON.stringify({
    email: __ENV.TEST_EMAIL || 'loadtest@softwarevala.com',
    password: __ENV.TEST_PASSWORD || 'LoadTest@123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (loginRes.status === 200) {
    const body = JSON.parse(loginRes.body);
    return { token: body.access_token };
  }
  
  console.error('Setup failed: Could not authenticate');
  return { token: '' };
}

// Scenario 1: Create Leads (50,000/day simulation)
export function createLeads(data) {
  const payload = JSON.stringify({
    company_name: `Load Test Company ${Date.now()}`,
    contact_name: `Contact ${__VU}-${__ITER}`,
    email: `loadtest${__VU}${__ITER}@test.com`,
    phone: `+91-98765${String(__ITER).padStart(5, '0')}`,
    source: ['website', 'referral', 'campaign'][Math.floor(Math.random() * 3)],
    industry: ['technology', 'manufacturing', 'retail'][Math.floor(Math.random() * 3)],
  });
  
  const startTime = Date.now();
  
  const res = http.post(`${BASE_URL}/api-leads/create`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`,
    },
  });
  
  const duration = Date.now() - startTime;
  leadCreationTime.add(duration);
  
  const success = check(res, {
    'lead created': (r) => r.status === 201,
    'has lead_id': (r) => JSON.parse(r.body).lead_id !== undefined,
    'response time OK': (r) => r.timings.duration < 500,
  });
  
  successRate.add(success);
  
  if (!success) {
    leadCreationErrors.add(1);
  }
  
  sleep(0.01); // Small delay to prevent overwhelming
}

// Scenario 2: Developer Workflow Simulation
export function developerWorkflow(data) {
  group('Developer Task Workflow', function() {
    // Get assigned tasks
    const tasksRes = http.get(`${BASE_URL}/api-developer/tasks`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
    
    check(tasksRes, {
      'tasks fetched': (r) => r.status === 200,
    });
    
    sleep(1);
    
    // Start timer on a task
    const startRes = http.post(`${BASE_URL}/api-developer/task/start`, JSON.stringify({
      task_id: 'simulated-task-id',
      promised_hours: 2,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
    sleep(2); // Simulate work
    
    // Pause timer
    const pauseRes = http.post(`${BASE_URL}/api-developer/task/pause`, JSON.stringify({
      task_id: 'simulated-task-id',
      reason: 'Break',
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
    sleep(1);
    
    // Resume timer
    const resumeRes = http.post(`${BASE_URL}/api-developer/task/resume`, JSON.stringify({
      task_id: 'simulated-task-id',
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
    sleep(2);
    
    // Get performance
    const perfRes = http.get(`${BASE_URL}/api-developer/performance`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
    
    check(perfRes, {
      'performance fetched': (r) => r.status === 200,
    });
  });
  
  sleep(5); // Wait before next iteration
}

// Scenario 3: Reseller Demo Access
export function resellerDemoAccess(data) {
  group('Reseller Demo Access', function() {
    // Get demos list
    const demosRes = http.get(`${BASE_URL}/api-demo`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
    
    check(demosRes, {
      'demos fetched': (r) => r.status === 200,
    });
    
    sleep(0.5);
    
    // Generate share link
    const shareRes = http.post(`${BASE_URL}/api-reseller/demo/share`, JSON.stringify({
      demo_id: 'test-demo-id',
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
    check(shareRes, {
      'share link created': (r) => r.status === 200 || r.status === 201,
    });
    
    sleep(0.5);
    
    // Get commission analytics
    const analyticsRes = http.get(`${BASE_URL}/api-reseller/performance`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
    
    check(analyticsRes, {
      'analytics fetched': (r) => r.status === 200,
    });
  });
  
  sleep(1);
}

// Scenario 4: Demo Click Flood
export function demoClickFlood(data) {
  const payload = JSON.stringify({
    demo_id: 'test-demo-id',
    referrer: 'https://referrer.com',
    device_type: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
    browser: ['chrome', 'firefox', 'safari'][Math.floor(Math.random() * 3)],
  });
  
  const res = http.post(`${BASE_URL}/api-demo/click`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const success = check(res, {
    'click tracked': (r) => r.status === 200 || r.status === 201,
    'response fast': (r) => r.timings.duration < 100,
  });
  
  if (!success) {
    demoClickErrors.add(1);
  }
}

// Scenario 5: Wallet Transactions
export function walletTransactions(data) {
  group('Wallet Operations', function() {
    // Get balance
    const balanceRes = http.get(`${BASE_URL}/api-wallet`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
    
    check(balanceRes, {
      'balance fetched': (r) => r.status === 200,
    });
    
    // Credit transaction
    const creditRes = http.post(`${BASE_URL}/api-wallet/credit`, JSON.stringify({
      user_id: 'test-user-id',
      amount: Math.floor(Math.random() * 10000) + 100,
      type: 'commission',
      description: 'Load test credit',
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
    const success = check(creditRes, {
      'credit processed': (r) => r.status === 200,
    });
    
    if (!success) {
      walletTransactionErrors.add(1);
    }
    
    sleep(0.1);
    
    // Get ledger
    const ledgerRes = http.get(`${BASE_URL}/api-wallet/ledger`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
    
    check(ledgerRes, {
      'ledger fetched': (r) => r.status === 200,
    });
  });
  
  sleep(0.5);
}

// Teardown
export function teardown(data) {
  console.log('Load test completed');
  console.log(`Lead creation errors: ${leadCreationErrors.values}`);
  console.log(`Wallet transaction errors: ${walletTransactionErrors.values}`);
  console.log(`Demo click errors: ${demoClickErrors.values}`);
}
