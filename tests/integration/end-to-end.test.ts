// ================================================================
// Software Vala - End-to-End Integration Tests
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

interface Tenant {
  id: string;
  name: string;
  created_at: Date;
}

interface ApiService {
  id: string;
  tenant_id: string;
  name: string;
  provider: string;
  cost_per_call: number;
  is_active: boolean;
  created_at: Date;
}

interface Wallet {
  id: string;
  tenant_id: string;
  balance: number;
  held_amount: number;
  is_locked: boolean;
}

interface BillingRecord {
  id: string;
  tenant_id: string;
  service_id: string;
  amount: number;
  description: string;
  created_at: Date;
}

interface WalletTransaction {
  id: string;
  wallet_id: string;
  tenant_id?: string;
  type: 'credit' | 'debit' | 'hold' | 'release';
  amount: number;
  running_balance: number;
  created_at: Date;
}

interface ApiCallResult {
  success: boolean;
  error?: string;
  cost?: number;
  blocked_reason?: string;
}

interface SystemState {
  kill_switch_active: boolean;
}

// ============= IN-MEMORY PLATFORM SIMULATION =============

class PlatformSimulator {
  private tenants: Map<string, Tenant>           = new Map();
  private services: Map<string, ApiService>      = new Map();
  private wallets: Map<string, Wallet>           = new Map();
  private billingRecords: BillingRecord[]        = [];
  private transactions: WalletTransaction[]      = [];
  private systemState: SystemState               = { kill_switch_active: false };
  private idCounter = 0;

  private uid(): string {
    return `id-${++this.idCounter}`;
  }

  // -- Tenant --
  createTenant(name: string): Tenant {
    const tenant: Tenant = { id: this.uid(), name, created_at: new Date() };
    this.tenants.set(tenant.id, tenant);
    // Auto-create wallet for tenant
    const wallet: Wallet = { id: this.uid(), tenant_id: tenant.id, balance: 0, held_amount: 0, is_locked: false };
    this.wallets.set(tenant.id, wallet);
    return tenant;
  }

  getTenant(id: string): Tenant | undefined {
    return this.tenants.get(id);
  }

  // -- API Service --
  createApiService(tenant_id: string, name: string, provider: string, cost_per_call: number): ApiService {
    if (!this.tenants.has(tenant_id)) throw new Error('Tenant not found');
    const svc: ApiService = { id: this.uid(), tenant_id, name, provider, cost_per_call, is_active: true, created_at: new Date() };
    this.services.set(svc.id, svc);
    return svc;
  }

  getService(id: string): ApiService | undefined {
    return this.services.get(id);
  }

  // -- Wallet --
  getWallet(tenant_id: string): Wallet {
    const w = this.wallets.get(tenant_id);
    if (!w) throw new Error('Wallet not found for tenant');
    return w;
  }

  addFunds(tenant_id: string, amount: number): Wallet {
    if (amount <= 0) throw new Error('Amount must be positive');
    const w = this.getWallet(tenant_id);
    const updated = { ...w, balance: w.balance + amount };
    this.wallets.set(tenant_id, updated);
    this.transactions.push({ id: this.uid(), wallet_id: w.id, type: 'credit', amount, running_balance: updated.balance, created_at: new Date() });
    return updated;
  }

  placeHold(tenant_id: string, amount: number): string {
    const w = this.getWallet(tenant_id);
    if (w.is_locked) throw new Error('Wallet is locked');
    const available = w.balance - w.held_amount;
    if (available < amount) throw new Error('Insufficient funds for hold');
    const updated = { ...w, held_amount: w.held_amount + amount };
    this.wallets.set(tenant_id, updated);
    const holdId = this.uid();
    this.transactions.push({ id: this.uid(), wallet_id: w.id, type: 'hold', amount, running_balance: updated.balance, created_at: new Date() });
    return holdId;
  }

  releaseHold(tenant_id: string, amount: number): Wallet {
    const w = this.getWallet(tenant_id);
    if (w.held_amount < amount) throw new Error('Cannot release more than held');
    const updated = { ...w, held_amount: w.held_amount - amount };
    this.wallets.set(tenant_id, updated);
    this.transactions.push({ id: this.uid(), wallet_id: w.id, type: 'release', amount, running_balance: updated.balance, created_at: new Date() });
    return updated;
  }

  debitWallet(tenant_id: string, amount: number, service_id: string, description: string): Wallet {
    const w = this.getWallet(tenant_id);
    if (w.is_locked) throw new Error('Wallet is locked');
    const available = w.balance - w.held_amount;
    if (available < amount) throw new Error('Insufficient funds');
    const updated = { ...w, balance: w.balance - amount };
    this.wallets.set(tenant_id, updated);
    this.transactions.push({ id: this.uid(), wallet_id: w.id, type: 'debit', amount, running_balance: updated.balance, created_at: new Date() });
    this.billingRecords.push({ id: this.uid(), tenant_id, service_id, amount, description, created_at: new Date() });
    return updated;
  }

  setWalletLock(tenant_id: string, locked: boolean): void {
    const w = this.getWallet(tenant_id);
    this.wallets.set(tenant_id, { ...w, is_locked: locked });
  }

  // -- Kill switch --
  setKillSwitch(active: boolean): void {
    this.systemState.kill_switch_active = active;
  }

  isKillSwitchActive(): boolean {
    return this.systemState.kill_switch_active;
  }

  // -- Execute API call --
  executeApiCall(tenant_id: string, service_id: string): ApiCallResult {
    if (this.systemState.kill_switch_active) {
      return { success: false, error: 'Kill switch active', blocked_reason: 'kill_switch' };
    }
    const svc = this.services.get(service_id);
    if (!svc) return { success: false, error: 'Service not found' };
    if (!svc.is_active) return { success: false, error: 'Service inactive' };
    if (svc.tenant_id !== tenant_id) return { success: false, error: 'Service does not belong to tenant' };

    const w = this.getWallet(tenant_id);
    if (w.is_locked) return { success: false, error: 'Wallet locked', blocked_reason: 'wallet_locked' };
    const available = w.balance - w.held_amount;
    if (available < svc.cost_per_call) {
      return { success: false, error: 'Insufficient funds', blocked_reason: 'insufficient_funds' };
    }

    // Charge
    this.debitWallet(tenant_id, svc.cost_per_call, service_id, `API call to ${svc.name}`);
    return { success: true, cost: svc.cost_per_call };
  }

  getBillingRecords(tenant_id: string): BillingRecord[] {
    return this.billingRecords.filter(b => b.tenant_id === tenant_id);
  }

  getTransactions(tenant_id: string): WalletTransaction[] {
    const w = this.wallets.get(tenant_id);
    if (!w) return [];
    return this.transactions.filter(t => t.wallet_id === w.id);
  }
}

// ============= TESTS =============

async function runTests(): Promise<void> {

  // -----------------------------------------------------------------------
  // Scenario 1: Create tenant → Create API service → Execute API call → Check billing
  // -----------------------------------------------------------------------

  await test('S1: Create tenant creates wallet automatically', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Acme Corp');
    assert(tenant.id !== '', 'Tenant has id');
    const wallet = p.getWallet(tenant.id);
    assertEqual(wallet.balance, 0, 'New wallet starts at zero');
    assertEqual(wallet.tenant_id, tenant.id, 'Wallet linked to tenant');
  });

  await test('S1: Create API service linked to tenant', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Acme Corp');
    const svc = p.createApiService(tenant.id, 'GPT-4 Chat', 'openai', 0.02);
    assertEqual(svc.tenant_id, tenant.id, 'Service belongs to tenant');
    assertEqual(svc.cost_per_call, 0.02, 'Cost per call set');
    assert(svc.is_active, 'Service is active by default');
  });

  await test('S1: Execute API call charges wallet and creates billing record', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Acme Corp');
    p.addFunds(tenant.id, 10.00);
    const svc = p.createApiService(tenant.id, 'GPT-4 Chat', 'openai', 0.50);
    const result = p.executeApiCall(tenant.id, svc.id);

    assertEqual(result.success, true, 'API call succeeds');
    assertEqual(result.cost, 0.50, 'Correct cost returned');

    const wallet = p.getWallet(tenant.id);
    assertEqual(wallet.balance, 9.50, 'Balance reduced by cost');

    const billing = p.getBillingRecords(tenant.id);
    assertEqual(billing.length, 1, 'One billing record created');
    assertEqual(billing[0].amount, 0.50, 'Billing amount correct');
    assertEqual(billing[0].service_id, svc.id, 'Billing linked to service');
  });

  await test('S1: Multiple API calls accumulate billing records', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Acme Corp');
    p.addFunds(tenant.id, 5.00);
    const svc = p.createApiService(tenant.id, 'GPT-4 Chat', 'openai', 1.00);
    p.executeApiCall(tenant.id, svc.id);
    p.executeApiCall(tenant.id, svc.id);
    p.executeApiCall(tenant.id, svc.id);
    const billing = p.getBillingRecords(tenant.id);
    assertEqual(billing.length, 3, 'Three billing records');
    assertEqual(p.getWallet(tenant.id).balance, 2.00, 'Balance correct after 3 calls');
  });

  await test('S1: API call fails gracefully when service not found', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Acme Corp');
    p.addFunds(tenant.id, 10);
    const result = p.executeApiCall(tenant.id, 'nonexistent-svc');
    assertEqual(result.success, false, 'Call fails');
    assert(result.error !== undefined, 'Error message present');
  });

  // -----------------------------------------------------------------------
  // Scenario 2: Add funds → Place hold → Execute → Release unused hold → Check balance
  // -----------------------------------------------------------------------

  await test('S2: Add funds → balance increases', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Beta Ltd');
    p.addFunds(tenant.id, 100.00);
    assertEqual(p.getWallet(tenant.id).balance, 100.00, 'Balance after funding');
  });

  await test('S2: Place hold reduces available balance not ledger balance', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Beta Ltd');
    p.addFunds(tenant.id, 100.00);
    p.placeHold(tenant.id, 30.00);
    const w = p.getWallet(tenant.id);
    assertEqual(w.balance, 100, 'Ledger balance unchanged');
    assertEqual(w.held_amount, 30, 'Hold recorded');
  });

  await test('S2: Execute API call uses available (non-held) funds', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Beta Ltd');
    p.addFunds(tenant.id, 100.00);
    p.placeHold(tenant.id, 95.00); // Only 5 available
    const svc = p.createApiService(tenant.id, 'Embed', 'openai', 3.00);
    const result = p.executeApiCall(tenant.id, svc.id);
    assertEqual(result.success, true, 'Call succeeds with sufficient available funds');
  });

  await test('S2: Execute API call fails when held reduces available below cost', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Beta Ltd');
    p.addFunds(tenant.id, 100.00);
    p.placeHold(tenant.id, 98.00); // Only 2 available
    const svc = p.createApiService(tenant.id, 'Embed', 'openai', 3.00);
    const result = p.executeApiCall(tenant.id, svc.id);
    assertEqual(result.success, false, 'Call fails with insufficient available');
    assertEqual(result.blocked_reason, 'insufficient_funds', 'Blocked for funds reason');
  });

  await test('S2: Release unused hold restores available balance', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Beta Ltd');
    p.addFunds(tenant.id, 100.00);
    p.placeHold(tenant.id, 50.00);
    p.releaseHold(tenant.id, 50.00);
    const w = p.getWallet(tenant.id);
    assertEqual(w.held_amount, 0, 'Hold fully released');
    assertEqual(w.balance - w.held_amount, 100, 'Full balance available again');
  });

  await test('S2: Full hold/execute/release cycle produces correct final balance', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Beta Ltd');
    p.addFunds(tenant.id, 100.00);
    p.placeHold(tenant.id, 20.00);            // anticipate 20 cost
    const svc = p.createApiService(tenant.id, 'API', 'openai', 15.00); // actual=15
    p.executeApiCall(tenant.id, svc.id);       // debit 15
    p.releaseHold(tenant.id, 20.00);           // release full hold (call already settled separately)
    const w = p.getWallet(tenant.id);
    assertEqual(w.balance, 85.00, 'Balance correct: 100 - 15 = 85');
    assertEqual(w.held_amount, 0, 'No remaining holds');
  });

  await test('S2: Transaction log has credit + hold + debit + release entries', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Beta Ltd');
    p.addFunds(tenant.id, 100.00);
    p.placeHold(tenant.id, 20.00);
    const svc = p.createApiService(tenant.id, 'API', 'openai', 15.00);
    p.executeApiCall(tenant.id, svc.id);
    p.releaseHold(tenant.id, 20.00);
    const txns = p.getTransactions(tenant.id);
    const types = txns.map(t => t.type);
    assert(types.includes('credit'),  'Credit transaction recorded');
    assert(types.includes('hold'),    'Hold transaction recorded');
    assert(types.includes('debit'),   'Debit transaction recorded');
    assert(types.includes('release'), 'Release transaction recorded');
  });

  // -----------------------------------------------------------------------
  // Scenario 3: Set kill switch → Attempt API call (should fail) → Resume → API call succeeds
  // -----------------------------------------------------------------------

  await test('S3: Kill switch prevents API call', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Gamma Inc');
    p.addFunds(tenant.id, 100.00);
    const svc = p.createApiService(tenant.id, 'LLM', 'anthropic', 1.00);
    p.setKillSwitch(true);
    const result = p.executeApiCall(tenant.id, svc.id);
    assertEqual(result.success, false, 'Call blocked by kill switch');
    assertEqual(result.blocked_reason, 'kill_switch', 'Correct block reason');
  });

  await test('S3: Kill switch does not deduct balance', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Gamma Inc');
    p.addFunds(tenant.id, 100.00);
    const svc = p.createApiService(tenant.id, 'LLM', 'anthropic', 1.00);
    p.setKillSwitch(true);
    p.executeApiCall(tenant.id, svc.id);
    assertEqual(p.getWallet(tenant.id).balance, 100, 'Balance unchanged during kill switch');
  });

  await test('S3: After kill switch disabled, API call succeeds', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Gamma Inc');
    p.addFunds(tenant.id, 100.00);
    const svc = p.createApiService(tenant.id, 'LLM', 'anthropic', 1.00);
    p.setKillSwitch(true);
    const blocked = p.executeApiCall(tenant.id, svc.id);
    assertEqual(blocked.success, false, 'First call blocked');
    p.setKillSwitch(false);
    const resumed = p.executeApiCall(tenant.id, svc.id);
    assertEqual(resumed.success, true, 'Call succeeds after resume');
    assertEqual(p.getWallet(tenant.id).balance, 99.00, 'Balance deducted after resume');
  });

  await test('S3: Kill switch can be toggled multiple times', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Gamma Inc');
    p.addFunds(tenant.id, 50.00);
    const svc = p.createApiService(tenant.id, 'LLM', 'anthropic', 1.00);

    p.setKillSwitch(false); assertEqual(p.executeApiCall(tenant.id, svc.id).success, true,  'Call 1 ok');
    p.setKillSwitch(true);  assertEqual(p.executeApiCall(tenant.id, svc.id).success, false, 'Call 2 blocked');
    p.setKillSwitch(false); assertEqual(p.executeApiCall(tenant.id, svc.id).success, true,  'Call 3 ok');
    p.setKillSwitch(true);  assertEqual(p.executeApiCall(tenant.id, svc.id).success, false, 'Call 4 blocked');

    assertEqual(p.getWallet(tenant.id).balance, 48.00, 'Only 2 successful calls charged');
  });

  await test('S3: Kill switch does not create billing records', () => {
    const p = new PlatformSimulator();
    const tenant = p.createTenant('Gamma Inc');
    p.addFunds(tenant.id, 100.00);
    const svc = p.createApiService(tenant.id, 'LLM', 'anthropic', 5.00);
    p.setKillSwitch(true);
    p.executeApiCall(tenant.id, svc.id);
    p.executeApiCall(tenant.id, svc.id);
    assertEqual(p.getBillingRecords(tenant.id).length, 0, 'No billing during kill switch');
  });

  // ============= REPORT =============
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n================================================================================');
  console.log('               END-TO-END INTEGRATION TEST RESULTS');
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
