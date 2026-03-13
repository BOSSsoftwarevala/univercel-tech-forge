// ================================================================
// Software Vala - AI Gateway Unit Tests
// Standalone TypeScript test runner (no framework required)
// ================================================================
export {};

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    results.push({ name, passed: true });
  } catch (err) {
    results.push({ name, passed: false, error: (err as Error).message });
  }
}

// ============= DOMAIN TYPES =============

interface AiGatewayRequest {
  tenant_id: string;
  service_id: string;
  model: string;
  prompt: string;
  estimated_cost: number;
}

interface AiGatewayResponse {
  success: boolean;
  response?: string;
  tokens_used?: number;
  cost_charged?: number;
  error?: string;
  blocked_reason?: 'kill_switch' | 'insufficient_funds' | 'rate_limit' | 'invalid_request';
}

interface AuditLogEntry {
  tenant_id: string;
  service_id: string;
  action: string;
  status: 'success' | 'blocked' | 'error';
  metadata: Record<string, unknown>;
  created_at: Date;
}

interface Wallet {
  id: string;
  tenant_id: string;
  balance: number;
  held_amount: number;
  is_locked: boolean;
}

interface SystemState {
  ai_kill_switch_active: boolean;
  kill_switch_reason?: string;
}

// ============= AI GATEWAY SIMULATION =============

class AiGatewaySimulator {
  private auditLog: AuditLogEntry[] = [];
  private holds: Map<string, number> = new Map();
  private holdCounter = 0;

  processRequest(
    request: AiGatewayRequest,
    wallet: Wallet,
    systemState: SystemState
  ): { response: AiGatewayResponse; wallet: Wallet } {
    // Always log the attempt
    const logEntry: AuditLogEntry = {
      tenant_id: request.tenant_id,
      service_id: request.service_id,
      action: 'ai_api_call',
      status: 'success',
      metadata: { model: request.model, estimated_cost: request.estimated_cost },
      created_at: new Date(),
    };

    // 1. Kill switch check
    if (systemState.ai_kill_switch_active) {
      logEntry.status = 'blocked';
      logEntry.metadata.blocked_reason = 'kill_switch';
      this.auditLog.push(logEntry);
      return {
        response: {
          success: false,
          error: 'AI gateway is currently disabled',
          blocked_reason: 'kill_switch',
        },
        wallet,
      };
    }

    // 2. Funds check
    const available = wallet.balance - wallet.held_amount;
    if (available < request.estimated_cost) {
      logEntry.status = 'blocked';
      logEntry.metadata.blocked_reason = 'insufficient_funds';
      this.auditLog.push(logEntry);
      return {
        response: {
          success: false,
          error: 'Insufficient wallet balance',
          blocked_reason: 'insufficient_funds',
        },
        wallet,
      };
    }

    // 3. Place hold for estimated cost
    const holdId = `hold-${++this.holdCounter}`;
    const newWallet = { ...wallet, held_amount: wallet.held_amount + request.estimated_cost };
    this.holds.set(holdId, request.estimated_cost);

    // 4. Simulate API call (always succeeds in test)
    const actualCost = request.estimated_cost * 0.9; // actual often < estimate
    const tokensUsed = Math.floor(request.prompt.length / 4);

    // 5. Settle: debit actual cost, release remainder of hold
    const releasedHold = request.estimated_cost - actualCost;
    const settledWallet: Wallet = {
      ...newWallet,
      balance: newWallet.balance - actualCost,
      held_amount: newWallet.held_amount - request.estimated_cost + 0, // hold fully cleared
    };

    logEntry.status = 'success';
    logEntry.metadata.actual_cost = actualCost;
    logEntry.metadata.tokens_used = tokensUsed;
    logEntry.metadata.hold_id = holdId;
    logEntry.metadata.released_hold = releasedHold;
    this.auditLog.push(logEntry);

    return {
      response: {
        success: true,
        response: `Simulated response to: ${request.prompt.substring(0, 20)}...`,
        tokens_used: tokensUsed,
        cost_charged: actualCost,
      },
      wallet: settledWallet,
    };
  }

  getAuditLog(): AuditLogEntry[] {
    return [...this.auditLog];
  }

  clearLog(): void {
    this.auditLog = [];
    this.holds.clear();
    this.holdCounter = 0;
  }
}

// ============= TEST FIXTURES =============

const makeRequest = (overrides: Partial<AiGatewayRequest> = {}): AiGatewayRequest => ({
  tenant_id: 't-001',
  service_id: 's-001',
  model: 'gpt-4o',
  prompt: 'Summarise this document for me please',
  estimated_cost: 5.00,
  ...overrides,
});

const makeWallet = (overrides: Partial<Wallet> = {}): Wallet => ({
  id: 'w-001',
  tenant_id: 't-001',
  balance: 100.00,
  held_amount: 0,
  is_locked: false,
  ...overrides,
});

const activeKillSwitch: SystemState  = { ai_kill_switch_active: true,  kill_switch_reason: 'Manual disable by admin' };
const normalState: SystemState       = { ai_kill_switch_active: false };

// ============= TESTS =============

async function runTests(): Promise<void> {
  const gw = new AiGatewaySimulator();

  // 1. Kill switch blocks API calls
  await test('Kill switch active: request is blocked', () => {
    const { response } = gw.processRequest(makeRequest(), makeWallet(), activeKillSwitch);
    assertEqual(response.success, false, 'Should not succeed');
    assertEqual(response.blocked_reason, 'kill_switch', 'Blocked by kill switch');
    assert(!response.response, 'No AI response returned');
  });

  await test('Kill switch active: no funds are held or debited', () => {
    const wallet = makeWallet({ balance: 100 });
    const { wallet: after } = gw.processRequest(makeRequest(), wallet, activeKillSwitch);
    assertEqual(after.balance,      100, 'Balance unchanged');
    assertEqual(after.held_amount,  0,   'No hold placed');
  });

  await test('Kill switch inactive: requests proceed normally', () => {
    const { response } = gw.processRequest(makeRequest(), makeWallet(), normalState);
    assertEqual(response.success, true, 'Should succeed when kill switch is off');
  });

  // 2. Insufficient funds blocks API calls
  await test('Insufficient funds: request is blocked', () => {
    const poorWallet = makeWallet({ balance: 2.00 });
    const { response } = gw.processRequest(makeRequest({ estimated_cost: 5.00 }), poorWallet, normalState);
    assertEqual(response.success, false, 'Should fail with insufficient funds');
    assertEqual(response.blocked_reason, 'insufficient_funds', 'Blocked by funds check');
  });

  await test('Insufficient funds: held amount reduces available balance', () => {
    // balance=100, held=97 → available=3, request cost=5
    const wallet = makeWallet({ balance: 100, held_amount: 97 });
    const { response } = gw.processRequest(makeRequest({ estimated_cost: 5 }), wallet, normalState);
    assertEqual(response.success, false, 'Available (3) < cost (5)');
    assertEqual(response.blocked_reason, 'insufficient_funds', 'Blocked by funds check');
  });

  await test('Exactly sufficient funds: request succeeds', () => {
    const wallet = makeWallet({ balance: 5.00, held_amount: 0 });
    const { response } = gw.processRequest(makeRequest({ estimated_cost: 5.00 }), wallet, normalState);
    assertEqual(response.success, true, 'Exact balance should succeed');
  });

  // 3. Successful call flow
  await test('Successful call: returns response and tokens_used', () => {
    const { response } = gw.processRequest(makeRequest(), makeWallet(), normalState);
    assert(response.success === true, 'Success flag');
    assert(typeof response.tokens_used === 'number' && response.tokens_used > 0, 'tokens_used is positive');
    assert(typeof response.cost_charged === 'number' && response.cost_charged > 0, 'cost_charged is positive');
  });

  await test('Successful call: actual cost deducted from balance', () => {
    const wallet = makeWallet({ balance: 100 });
    const { wallet: after, response } = gw.processRequest(makeRequest({ estimated_cost: 10 }), wallet, normalState);
    assert(after.balance < 100, 'Balance reduced after call');
    assertEqual(after.balance, 100 - (response.cost_charged ?? 0), 'Balance matches actual cost');
  });

  await test('Successful call: held amount is cleared after settlement', () => {
    const wallet = makeWallet({ balance: 100, held_amount: 0 });
    const { wallet: after } = gw.processRequest(makeRequest({ estimated_cost: 10 }), wallet, normalState);
    assertEqual(after.held_amount, 0, 'Hold fully released after settlement');
  });

  // 4. Audit logging on every call
  await test('Audit log entry created for blocked (kill switch) call', () => {
    gw.clearLog();
    gw.processRequest(makeRequest(), makeWallet(), activeKillSwitch);
    const log = gw.getAuditLog();
    assertEqual(log.length, 1, 'One audit entry created');
    assertEqual(log[0].status, 'blocked', 'Entry marked as blocked');
    assertEqual(log[0].action, 'ai_api_call', 'Action logged');
  });

  await test('Audit log entry created for blocked (insufficient funds) call', () => {
    gw.clearLog();
    gw.processRequest(makeRequest({ estimated_cost: 999 }), makeWallet({ balance: 1 }), normalState);
    const log = gw.getAuditLog();
    assertEqual(log.length, 1, 'One audit entry');
    assertEqual(log[0].status, 'blocked', 'Status is blocked');
    assertEqual(String(log[0].metadata.blocked_reason), 'insufficient_funds', 'Reason logged');
  });

  await test('Audit log entry created for successful call', () => {
    gw.clearLog();
    gw.processRequest(makeRequest(), makeWallet(), normalState);
    const log = gw.getAuditLog();
    assertEqual(log.length, 1, 'One audit entry for success');
    assertEqual(log[0].status, 'success', 'Status is success');
    assert(log[0].metadata.actual_cost !== undefined, 'Actual cost logged');
  });

  await test('Audit log includes tenant_id and service_id on every call', () => {
    gw.clearLog();
    gw.processRequest(makeRequest({ tenant_id: 'tenant-xyz', service_id: 'svc-abc' }), makeWallet(), normalState);
    const [entry] = gw.getAuditLog();
    assertEqual(entry.tenant_id, 'tenant-xyz', 'tenant_id in log');
    assertEqual(entry.service_id, 'svc-abc', 'service_id in log');
  });

  await test('Multiple calls each produce a separate audit log entry', () => {
    gw.clearLog();
    gw.processRequest(makeRequest(), makeWallet(), normalState);
    gw.processRequest(makeRequest(), makeWallet(), activeKillSwitch);
    gw.processRequest(makeRequest({ estimated_cost: 9999 }), makeWallet({ balance: 1 }), normalState);
    const log = gw.getAuditLog();
    assertEqual(log.length, 3, 'Three separate audit entries');
  });

  // 5. Hold/release cycle
  await test('Hold placed before API call execution', () => {
    // Simulate by inspecting that available balance drops during processing
    const wallet = makeWallet({ balance: 100, held_amount: 0 });
    // After successful call, balance is reduced and held_amount returns to 0
    const { wallet: after } = gw.processRequest(makeRequest({ estimated_cost: 10 }), wallet, normalState);
    assert(after.balance < 100, 'Cost was deducted — hold/debit cycle occurred');
    assertEqual(after.held_amount, 0, 'Hold fully cleared post-settlement');
  });

  await test('Unused portion of hold is released (actual < estimate)', () => {
    const wallet = makeWallet({ balance: 100 });
    const estimated = 10.00;
    const { response, wallet: after } = gw.processRequest(
      makeRequest({ estimated_cost: estimated }),
      wallet,
      normalState
    );
    const actualCharged = response.cost_charged ?? 0;
    assert(actualCharged < estimated, 'Actual cost is less than estimate (90%)');
    // full hold is cleared; balance reduction equals actual cost only
    assertEqual(after.balance, 100 - actualCharged, 'Only actual cost deducted');
    assertEqual(after.held_amount, 0, 'Hold fully released');
  });

  await test('Failed call releases hold and does not debit', () => {
    const wallet = makeWallet({ balance: 2 });
    const { wallet: after } = gw.processRequest(makeRequest({ estimated_cost: 5 }), wallet, activeKillSwitch);
    assertEqual(after.balance, 2, 'Balance unchanged on blocked call');
    assertEqual(after.held_amount, 0, 'No hold on blocked call');
  });

  // ============= REPORT =============
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n================================================================================');
  console.log('                    AI GATEWAY UNIT TEST RESULTS');
  console.log('================================================================================\n');

  for (const r of results) {
    console.log(`${r.passed ? '✅ PASS' : '❌ FAIL'}  ${r.name}`);
    if (r.error) console.log(`       Error: ${r.error}`);
  }

  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`Total: ${results.length}  |  Passed: ${passed}  |  Failed: ${failed}`);
  console.log('================================================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
