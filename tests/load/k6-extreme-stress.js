// ================================================================
// Software Vala - Extreme Stress Testing Suite
// ================================================================

import http from 'k6/http';
import ws from 'k6/ws';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend, Gauge } from 'k6/metrics';

// ================================================================
// EXTREME STRESS METRICS
// ================================================================

// Chat stress metrics
const chatMessagesSent = new Counter('chat_messages_sent');
const chatMessagesFailed = new Counter('chat_messages_failed');
const chatLatency = new Trend('chat_latency');
const chatConcurrent = new Gauge('chat_concurrent_users');

// WebSocket metrics
const wsConnections = new Counter('ws_connections');
const wsDisconnects = new Counter('ws_disconnects');
const wsReconnects = new Counter('ws_reconnects');
const wsLatency = new Trend('ws_latency');

// Buzzer metrics
const buzzerAlerts = new Counter('buzzer_alerts_sent');
const buzzerAcknowledged = new Counter('buzzer_acknowledged');
const buzzerLatency = new Trend('buzzer_latency');

// Timer metrics
const timerStarts = new Counter('timer_starts');
const timerUpdates = new Counter('timer_updates');
const timerAccuracy = new Rate('timer_accuracy');

// Wallet metrics
const walletCredits = new Counter('wallet_credits');
const walletDebits = new Counter('wallet_debits');
const walletPayouts = new Counter('wallet_payouts');
const walletErrors = new Counter('wallet_errors');
const walletLatency = new Trend('wallet_latency');
const walletAccuracy = new Rate('wallet_accuracy');

// Demo metrics
const demoClicks = new Counter('demo_clicks');
const demoStreams = new Counter('demo_streams');
const demoLatency = new Trend('demo_latency');

// API metrics
const apiCalls = new Counter('api_calls');
const apiErrors = new Counter('api_errors');
const apiLatency = new Trend('api_latency');
const apiRateLimited = new Counter('api_rate_limited');

// Fraud & SLA metrics
const fraudChecks = new Counter('fraud_checks');
const fraudDetected = new Counter('fraud_detected');
const slaBreaches = new Counter('sla_breaches');

// System metrics
const memoryUsage = new Gauge('memory_usage_mb');
const crashPoints = new Counter('crash_points');
const maskingIntact = new Rate('masking_intact');
const rbacIsolated = new Rate('rbac_isolated');

// ================================================================
// EXTREME STRESS TEST CONFIGURATION
// ================================================================

export const options = {
  scenarios: {
    // EXTREME: 1000+ concurrent chat messages
    chat_extreme_stress: {
      executor: 'constant-arrival-rate',
      rate: 1000, // 1000 messages per second
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 200,
      maxVUs: 1000,
      exec: 'chatExtremeStress',
      startTime: '0s',
    },
    
    // EXTREME: WebSocket connection flood
    websocket_flood: {
      executor: 'ramping-vus',
      startVUs: 50,
      stages: [
        { duration: '30s', target: 500 },
        { duration: '1m', target: 1000 },
        { duration: '1m', target: 2000 },
        { duration: '30s', target: 500 },
      ],
      exec: 'websocketFlood',
      startTime: '30s',
    },
    
    // EXTREME: Buzzer notification storm
    buzzer_storm: {
      executor: 'constant-arrival-rate',
      rate: 500, // 500 buzzer events per second
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 100,
      maxVUs: 500,
      exec: 'buzzerStorm',
      startTime: '1m',
    },
    
    // EXTREME: Timer concurrent operations
    timer_stress: {
      executor: 'constant-vus',
      vus: 500, // 500 concurrent timer operations
      duration: '3m',
      exec: 'timerStress',
      startTime: '1m30s',
    },
    
    // EXTREME: Wallet transaction flood
    wallet_flood: {
      executor: 'constant-arrival-rate',
      rate: 200, // 200 transactions per second
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 100,
      maxVUs: 500,
      exec: 'walletFlood',
      startTime: '2m',
    },
    
    // EXTREME: Demo library stress (40x9 = 360 demos)
    demo_library_stress: {
      executor: 'ramping-vus',
      startVUs: 100,
      stages: [
        { duration: '1m', target: 1000 },
        { duration: '2m', target: 5000 },
        { duration: '1m', target: 10000 },
        { duration: '1m', target: 1000 },
      ],
      exec: 'demoLibraryStress',
      startTime: '2m30s',
    },
    
    // EXTREME: API endpoint hammering
    api_hammer: {
      executor: 'constant-arrival-rate',
      rate: 2000, // 2000 API calls per second
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 200,
      maxVUs: 1000,
      exec: 'apiHammer',
      startTime: '3m',
    },
    
    // EXTREME: Fraud detection stress
    fraud_stress: {
      executor: 'constant-vus',
      vus: 100,
      duration: '2m',
      exec: 'fraudStress',
      startTime: '3m30s',
    },
    
    // EXTREME: Backup operations
    backup_stress: {
      executor: 'shared-iterations',
      vus: 20,
      iterations: 100,
      maxDuration: '2m',
      exec: 'backupStress',
      startTime: '4m',
    },
    
    // Security verification under load
    security_verification: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      exec: 'securityVerification',
      startTime: '0s', // Runs throughout
    },
  },
  
  thresholds: {
    // Chat thresholds
    chat_latency: ['p(95)<200', 'p(99)<500'],
    chat_messages_failed: ['count<100'], // Less than 100 failures
    
    // WebSocket thresholds
    ws_latency: ['p(95)<100', 'p(99)<300'],
    ws_disconnects: ['count<50'],
    
    // Wallet thresholds (critical - no errors allowed)
    wallet_errors: ['count<1'], // Zero tolerance for financial errors
    wallet_accuracy: ['rate>0.9999'], // 99.99% accuracy required
    wallet_latency: ['p(95)<300'],
    
    // API thresholds
    api_errors: ['rate<0.01'], // Less than 1% errors
    api_latency: ['p(95)<500', 'p(99)<1000'],
    
    // Security thresholds (must be perfect)
    masking_intact: ['rate>0.9999'], // Masking must never fail
    rbac_isolated: ['rate>0.9999'], // RBAC must never leak
    
    // System thresholds
    crash_points: ['count<1'], // No crashes
  },
};

const BASE_URL = __ENV.API_URL || 'https://feqdqyadkijpohyllfdq.supabase.co/functions/v1';
const WS_URL = __ENV.WS_URL || 'wss://feqdqyadkijpohyllfdq.supabase.co/functions/v1/ws-realtime';

// ================================================================
// SETUP
// ================================================================

export function setup() {
  const loginRes = http.post(`${BASE_URL}/api-auth/login`, JSON.stringify({
    email: __ENV.TEST_EMAIL || 'stresstest@softwarevala.com',
    password: __ENV.TEST_PASSWORD || 'StressTest@123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (loginRes.status === 200) {
    const body = JSON.parse(loginRes.body);
    return { token: body.access_token, userId: body.user?.id };
  }
  
  return { token: '', userId: '' };
}

// ================================================================
// CHAT EXTREME STRESS (1000+ concurrent messages)
// ================================================================

export function chatExtremeStress(data) {
  const startTime = Date.now();
  
  const payload = JSON.stringify({
    thread_id: `stress-thread-${__VU % 100}`, // 100 concurrent threads
    message_text: `Stress test message ${__VU}-${__ITER} at ${Date.now()}`,
    sender_role: 'developer',
  });
  
  const res = http.post(`${BASE_URL}/api-chat/send`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`,
    },
  });
  
  const latency = Date.now() - startTime;
  chatLatency.add(latency);
  
  if (res.status === 200 || res.status === 201) {
    chatMessagesSent.add(1);
    
    // Verify masking is intact
    const body = JSON.parse(res.body || '{}');
    if (body.masked_sender && body.masked_sender.length >= 2) {
      maskingIntact.add(1);
    } else {
      maskingIntact.add(0);
    }
  } else {
    chatMessagesFailed.add(1);
    
    if (res.status === 429) {
      apiRateLimited.add(1);
    }
  }
  
  // Verify no edit/delete capability
  check(res, {
    'message sent': (r) => r.status === 200 || r.status === 201,
    'cannot_edit flag set': (r) => {
      const body = JSON.parse(r.body || '{}');
      return body.cannot_edit === true;
    },
    'cannot_delete flag set': (r) => {
      const body = JSON.parse(r.body || '{}');
      return body.cannot_delete === true;
    },
  });
}

// ================================================================
// WEBSOCKET FLOOD TEST
// ================================================================

export function websocketFlood(data) {
  const url = WS_URL;
  
  const res = ws.connect(url, {}, function(socket) {
    wsConnections.add(1);
    chatConcurrent.add(1);
    
    socket.on('open', function() {
      // Authenticate
      socket.send(JSON.stringify({
        type: 'auth',
        token: data.token,
      }));
      
      // Subscribe to channels
      socket.send(JSON.stringify({
        type: 'subscribe',
        channel: `buzzer_${__VU % 10}`,
      }));
      
      socket.send(JSON.stringify({
        type: 'subscribe',
        channel: `chat_thread_${__VU % 100}`,
      }));
    });
    
    socket.on('message', function(msg) {
      const start = Date.now();
      try {
        const message = JSON.parse(msg);
        wsLatency.add(Date.now() - start);
        
        // Verify RBAC isolation - should only see own channel messages
        if (message.channel && !message.channel.includes(String(__VU % 10)) && !message.channel.includes(String(__VU % 100))) {
          rbacIsolated.add(0);
        } else {
          rbacIsolated.add(1);
        }
      } catch (e) {
        // Non-JSON message
      }
    });
    
    socket.on('close', function() {
      wsDisconnects.add(1);
      chatConcurrent.add(-1);
    });
    
    socket.on('error', function(e) {
      crashPoints.add(1);
    });
    
    // Send periodic pings
    for (let i = 0; i < 10; i++) {
      socket.send(JSON.stringify({ type: 'ping' }));
      sleep(1);
    }
    
    socket.close();
  });
}

// ================================================================
// BUZZER NOTIFICATION STORM
// ================================================================

export function buzzerStorm(data) {
  const startTime = Date.now();
  
  // Create buzzer alert
  const alertPayload = JSON.stringify({
    alert_type: ['urgent', 'warning', 'info'][Math.floor(Math.random() * 3)],
    role_target: ['developer', 'reseller', 'franchise'][Math.floor(Math.random() * 3)],
    message: `Stress test buzzer ${__VU}-${__ITER}`,
    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
  });
  
  const res = http.post(`${BASE_URL}/api-alerts/create`, alertPayload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`,
    },
  });
  
  buzzerLatency.add(Date.now() - startTime);
  
  if (res.status === 200 || res.status === 201) {
    buzzerAlerts.add(1);
    
    // Acknowledge the alert
    const body = JSON.parse(res.body || '{}');
    if (body.alert_id) {
      const ackRes = http.post(`${BASE_URL}/api-alerts/acknowledge`, JSON.stringify({
        alert_id: body.alert_id,
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`,
        },
      });
      
      if (ackRes.status === 200) {
        buzzerAcknowledged.add(1);
      }
    }
  }
}

// ================================================================
// TIMER STRESS TEST
// ================================================================

export function timerStress(data) {
  group('Timer Operations', function() {
    const taskId = `stress-task-${__VU}-${__ITER}`;
    
    // Start timer
    const startRes = http.post(`${BASE_URL}/api-developer/task/start`, JSON.stringify({
      task_id: taskId,
      promised_hours: Math.floor(Math.random() * 8) + 1,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
    if (startRes.status === 200) {
      timerStarts.add(1);
    }
    
    sleep(0.5);
    
    // Multiple timer updates
    for (let i = 0; i < 5; i++) {
      const updateRes = http.post(`${BASE_URL}/api-developer/task/update`, JSON.stringify({
        task_id: taskId,
        elapsed_seconds: (i + 1) * 300, // 5 minute increments
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`,
        },
      });
      
      if (updateRes.status === 200) {
        timerUpdates.add(1);
        timerAccuracy.add(1);
      } else {
        timerAccuracy.add(0);
      }
      
      sleep(0.1);
    }
    
    // Complete with promise check
    const completeRes = http.post(`${BASE_URL}/api-developer/task/complete`, JSON.stringify({
      task_id: taskId,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
    // Verify promise enforcement
    check(completeRes, {
      'completion processed': (r) => r.status === 200,
      'promise checked': (r) => {
        const body = JSON.parse(r.body || '{}');
        return body.promise_met !== undefined;
      },
    });
  });
}

// ================================================================
// WALLET TRANSACTION FLOOD
// ================================================================

export function walletFlood(data) {
  const startTime = Date.now();
  const amount = Math.floor(Math.random() * 10000) + 100;
  const isCredit = Math.random() > 0.3; // 70% credits, 30% debits
  
  const payload = JSON.stringify({
    user_id: `stress-user-${__VU % 100}`,
    amount: amount,
    type: isCredit ? 'commission' : 'payout',
    description: `Stress test ${isCredit ? 'credit' : 'debit'} ${__VU}-${__ITER}`,
  });
  
  const endpoint = isCredit ? '/credit' : '/debit';
  const res = http.post(`${BASE_URL}/api-wallet${endpoint}`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`,
    },
  });
  
  walletLatency.add(Date.now() - startTime);
  
  if (res.status === 200) {
    if (isCredit) {
      walletCredits.add(1);
    } else {
      walletDebits.add(1);
    }
    
    // Verify transaction accuracy
    const body = JSON.parse(res.body || '{}');
    if (body.new_balance !== undefined) {
      walletAccuracy.add(1);
    } else {
      walletAccuracy.add(0);
    }
  } else {
    walletErrors.add(1);
    
    // Log error for analysis
    console.error(`Wallet error: ${res.status} - ${res.body}`);
  }
  
  // Periodically test payout
  if (__ITER % 50 === 0) {
    const payoutRes = http.post(`${BASE_URL}/api-wallet/payout/request`, JSON.stringify({
      amount: 1000,
      payment_method: 'bank_transfer',
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
    if (payoutRes.status === 200) {
      walletPayouts.add(1);
    }
  }
}

// ================================================================
// DEMO LIBRARY STRESS (40x9 = 360 demos)
// ================================================================

export function demoLibraryStress(data) {
  const categories = 9; // 9 categories
  const demosPerCategory = 40; // 40 demos each
  
  const category = __VU % categories;
  const demoIndex = __ITER % demosPerCategory;
  const demoId = `demo-cat${category}-${demoIndex}`;
  
  const startTime = Date.now();
  
  // Click tracking
  const clickRes = http.post(`${BASE_URL}/api-demo/click`, JSON.stringify({
    demo_id: demoId,
    referrer: `https://referrer-${__VU}.com`,
    device_type: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
    region: ['in-west', 'in-south', 'us-east', 'eu-west', 'ap-southeast'][Math.floor(Math.random() * 5)],
    is_prime: Math.random() > 0.7,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  demoLatency.add(Date.now() - startTime);
  
  if (clickRes.status === 200 || clickRes.status === 201) {
    demoClicks.add(1);
  }
  
  sleep(0.1);
  
  // Stream simulation
  const streamRes = http.get(`${BASE_URL}/api-demo/${demoId}`, {
    headers: { 'Authorization': `Bearer ${data.token}` },
  });
  
  if (streamRes.status === 200) {
    demoStreams.add(1);
    
    // Verify regional pricing/currency handling
    check(streamRes, {
      'demo loaded': (r) => r.status === 200,
      'has regional config': (r) => {
        const body = JSON.parse(r.body || '{}');
        return body.currency !== undefined || body.region !== undefined;
      },
    });
  }
}

// ================================================================
// API ENDPOINT HAMMER
// ================================================================

export function apiHammer(data) {
  const endpoints = [
    { path: '/api-leads', method: 'GET' },
    { path: '/api-demo', method: 'GET' },
    { path: '/api-tasks', method: 'GET' },
    { path: '/api-wallet', method: 'GET' },
    { path: '/api-alerts', method: 'GET' },
    { path: '/api-health', method: 'GET' },
    { path: '/api-developer/performance', method: 'GET' },
    { path: '/api-reseller/performance', method: 'GET' },
  ];
  
  const endpoint = endpoints[__ITER % endpoints.length];
  const startTime = Date.now();
  
  let res;
  if (endpoint.method === 'GET') {
    res = http.get(`${BASE_URL}${endpoint.path}`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
  }
  
  apiLatency.add(Date.now() - startTime);
  apiCalls.add(1);
  
  if (res.status >= 400) {
    apiErrors.add(1);
    
    if (res.status === 429) {
      apiRateLimited.add(1);
    }
  }
  
  // Verify RBAC isolation
  check(res, {
    'RBAC enforced': (r) => {
      // Should not contain data from other roles
      const body = JSON.parse(r.body || '{}');
      return !body._raw_user_ids && !body._unmasked_data;
    },
  });
}

// ================================================================
// FRAUD DETECTION STRESS
// ================================================================

export function fraudStress(data) {
  group('Fraud & SLA Monitoring', function() {
    // Trigger fraud check
    const fraudPayload = JSON.stringify({
      user_id: `stress-user-${__VU}`,
      check_type: ['login', 'transaction', 'behavior'][Math.floor(Math.random() * 3)],
      data: {
        ip_address: `192.168.${__VU % 255}.${__ITER % 255}`,
        device_fingerprint: `device-${__VU}-${__ITER}`,
        location: ['IN', 'US', 'UK', 'SG'][Math.floor(Math.random() * 4)],
      },
    });
    
    const fraudRes = http.post(`${BASE_URL}/api-risk-engine/check`, fraudPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
    fraudChecks.add(1);
    
    if (fraudRes.status === 200) {
      const body = JSON.parse(fraudRes.body || '{}');
      if (body.fraud_detected) {
        fraudDetected.add(1);
      }
      if (body.sla_breach) {
        slaBreaches.add(1);
      }
    }
    
    sleep(0.5);
    
    // Check SLA compliance
    const slaRes = http.get(`${BASE_URL}/api-sla/status`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
    
    check(slaRes, {
      'SLA status retrieved': (r) => r.status === 200,
    });
  });
}

// ================================================================
// BACKUP STRESS TEST
// ================================================================

export function backupStress(data) {
  group('Backup Operations', function() {
    // Trigger backup status check
    const statusRes = http.get(`${BASE_URL}/api-backup/status`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
    
    check(statusRes, {
      'backup status OK': (r) => r.status === 200,
      'has last backup time': (r) => {
        const body = JSON.parse(r.body || '{}');
        return body.last_backup_at !== undefined;
      },
    });
    
    // Verify backup integrity
    const integrityRes = http.get(`${BASE_URL}/api-backup/integrity`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
    
    check(integrityRes, {
      'integrity verified': (r) => r.status === 200,
      'checksum valid': (r) => {
        const body = JSON.parse(r.body || '{}');
        return body.integrity_valid === true;
      },
    });
    
    sleep(1);
  });
}

// ================================================================
// SECURITY VERIFICATION (runs throughout)
// ================================================================

export function securityVerification(data) {
  // Test masking preservation
  const chatRes = http.get(`${BASE_URL}/api-chat/threads`, {
    headers: { 'Authorization': `Bearer ${data.token}` },
  });
  
  if (chatRes.status === 200) {
    const body = JSON.parse(chatRes.body || '{}');
    const threads = body.threads || [];
    
    for (const thread of threads) {
      // Verify sender IDs are masked
      if (thread.last_message?.sender_id) {
        const isMasked = thread.last_message.sender_id.length <= 8;
        maskingIntact.add(isMasked ? 1 : 0);
      }
    }
  }
  
  // Test RBAC isolation
  const rolesRes = http.get(`${BASE_URL}/api-auth/my-permissions`, {
    headers: { 'Authorization': `Bearer ${data.token}` },
  });
  
  if (rolesRes.status === 200) {
    const body = JSON.parse(rolesRes.body || '{}');
    // Should only see own permissions
    rbacIsolated.add(body.permissions !== undefined ? 1 : 0);
  }
  
  // Attempt role escalation (should fail)
  const escalationRes = http.post(`${BASE_URL}/api-admin/grant-role`, JSON.stringify({
    target_user_id: 'some-user',
    role: 'super_admin',
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`,
    },
  });
  
  // Should be rejected
  check(escalationRes, {
    'escalation blocked': (r) => r.status === 401 || r.status === 403,
  });
  
  sleep(2);
}

// ================================================================
// TEARDOWN
// ================================================================

export function teardown(data) {
  console.log('\n========================================');
  console.log('EXTREME STRESS TEST RESULTS');
  console.log('========================================');
  
  console.log('\n--- CHAT METRICS ---');
  console.log(`Messages sent: ${chatMessagesSent}`);
  console.log(`Messages failed: ${chatMessagesFailed}`);
  
  console.log('\n--- WEBSOCKET METRICS ---');
  console.log(`Connections: ${wsConnections}`);
  console.log(`Disconnects: ${wsDisconnects}`);
  console.log(`Reconnects: ${wsReconnects}`);
  
  console.log('\n--- WALLET METRICS ---');
  console.log(`Credits: ${walletCredits}`);
  console.log(`Debits: ${walletDebits}`);
  console.log(`Payouts: ${walletPayouts}`);
  console.log(`Errors: ${walletErrors}`);
  
  console.log('\n--- DEMO METRICS ---');
  console.log(`Clicks: ${demoClicks}`);
  console.log(`Streams: ${demoStreams}`);
  
  console.log('\n--- API METRICS ---');
  console.log(`Total calls: ${apiCalls}`);
  console.log(`Errors: ${apiErrors}`);
  console.log(`Rate limited: ${apiRateLimited}`);
  
  console.log('\n--- SECURITY METRICS ---');
  console.log(`Crash points: ${crashPoints}`);
  console.log(`Fraud detected: ${fraudDetected}`);
  console.log(`SLA breaches: ${slaBreaches}`);
  
  console.log('\n========================================');
}
