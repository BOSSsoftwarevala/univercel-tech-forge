// ================================================================
// Software Vala - Tenant Isolation Security Tests
// Standalone TypeScript test runner (no framework required)
// ================================================================
export {};

interface TestResult {
  name: string;
  passed: boolean;
  severity: 'critical' | 'high' | 'medium';
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

async function test(
  name: string,
  severity: 'critical' | 'high' | 'medium',
  fn: () => void | Promise<void>
): Promise<void> {
  try {
    await fn();
    results.push({ name, severity, passed: true });
  } catch (err) {
    results.push({ name, severity, passed: false, error: (err as Error).message });
  }
}

// ============= DOMAIN TYPES =============

interface Tenant {
  id: string;
  name: string;
}

interface Wallet {
  id: string;
  tenant_id: string;
  balance: number;
}

interface ApiService {
  id: string;
  tenant_id: string;
  name: string;
}

interface WalletTransaction {
  id: string;
  wallet_id: string;
  tenant_id: string;
  amount: number;
  type: string;
}

interface BillingRecord {
  id: string;
  tenant_id: string;
  amount: number;
}

interface AuditLog {
  id: string;
  tenant_id: string;
  action: string;
}

// ============= ISOLATED DATA STORE SIMULATION =============
// Models the RLS (Row Level Security) behaviour expected in Supabase

class IsolatedDataStore {
  private wallets: Wallet[]             = [];
  private services: ApiService[]        = [];
  private transactions: WalletTransaction[] = [];
  private billing: BillingRecord[]      = [];
  private auditLogs: AuditLog[]         = [];
  private counter = 0;

  private uid(): string { return `${++this.counter}`; }

  // Seed data for two tenants
  seed(tenantA: Tenant, tenantB: Tenant): void {
    this.wallets.push(
      { id: this.uid(), tenant_id: tenantA.id, balance: 1000 },
      { id: this.uid(), tenant_id: tenantB.id, balance: 500  },
    );
    this.services.push(
      { id: this.uid(), tenant_id: tenantA.id, name: 'Tenant A Service' },
      { id: this.uid(), tenant_id: tenantB.id, name: 'Tenant B Service' },
    );
    this.transactions.push(
      { id: this.uid(), wallet_id: '1', tenant_id: tenantA.id, amount: 100, type: 'credit' },
      { id: this.uid(), wallet_id: '2', tenant_id: tenantB.id, amount: 50,  type: 'credit' },
    );
    this.billing.push(
      { id: this.uid(), tenant_id: tenantA.id, amount: 10 },
      { id: this.uid(), tenant_id: tenantB.id, amount: 20 },
    );
    this.auditLogs.push(
      { id: this.uid(), tenant_id: tenantA.id, action: 'login' },
      { id: this.uid(), tenant_id: tenantB.id, action: 'login' },
    );
  }

  // RLS-enforced queries: always filter by requesting_tenant_id
  getWallet(wallet_id: string, requesting_tenant_id: string): Wallet | null {
    const w = this.wallets.find(w => w.id === wallet_id);
    if (!w) return null;
    if (w.tenant_id !== requesting_tenant_id) return null; // RLS denies
    return w;
  }

  getWalletsForTenant(tenant_id: string): Wallet[] {
    return this.wallets.filter(w => w.tenant_id === tenant_id);
  }

  getServicesForTenant(tenant_id: string): ApiService[] {
    return this.services.filter(s => s.tenant_id === tenant_id);
  }

  getTransactionsForTenant(tenant_id: string): WalletTransaction[] {
    return this.transactions.filter(t => t.tenant_id === tenant_id);
  }

  getBillingForTenant(tenant_id: string): BillingRecord[] {
    return this.billing.filter(b => b.tenant_id === tenant_id);
  }

  getAuditLogsForTenant(tenant_id: string): AuditLog[] {
    return this.auditLogs.filter(a => a.tenant_id === tenant_id);
  }

  // Cross-tenant direct access attempt (returns null if tenant mismatch)
  getServiceById(service_id: string, requesting_tenant_id: string): ApiService | null {
    const svc = this.services.find(s => s.id === service_id);
    if (!svc) return null;
    if (svc.tenant_id !== requesting_tenant_id) return null; // RLS denies
    return svc;
  }

  // Simulates a query missing the tenant_id filter (bad practice — should always include it)
  unsafeGetAllWallets(): Wallet[] {
    return this.wallets; // Returns ALL tenants' wallets — this is the vulnerability
  }

  queriesIncludeTenantFilter(query: string): boolean {
    return query.toLowerCase().includes('tenant_id');
  }
}

// ============= TESTS =============

async function runTests(): Promise<void> {
  const tenantA: Tenant = { id: 'tenant-a-uuid-0001', name: 'Acme Corp' };
  const tenantB: Tenant = { id: 'tenant-b-uuid-0002', name: 'Beta Ltd' };

  const store = new IsolatedDataStore();
  store.seed(tenantA, tenantB);

  // Pre-fetch wallet IDs to use in cross-tenant tests
  const walletA = store.getWalletsForTenant(tenantA.id)[0];
  const walletB = store.getWalletsForTenant(tenantB.id)[0];
  const serviceB = store.getServicesForTenant(tenantB.id)[0];

  // -----------------------------------------------------------------------
  // 1. Tenant A cannot see Tenant B's data
  // -----------------------------------------------------------------------

  await test('Tenant A cannot read Tenant B wallet by ID', 'critical', () => {
    const result = store.getWallet(walletB.id, tenantA.id);
    assertEqual(result, null, 'Cross-tenant wallet access must be denied');
  });

  await test('Tenant A wallet query returns only Tenant A wallets', 'critical', () => {
    const wallets = store.getWalletsForTenant(tenantA.id);
    assert(wallets.length > 0, 'Tenant A has wallets');
    assert(wallets.every(w => w.tenant_id === tenantA.id), 'All returned wallets belong to Tenant A');
    assert(!wallets.some(w => w.tenant_id === tenantB.id), 'No Tenant B wallets in result');
  });

  await test('Tenant A service query returns only Tenant A services', 'critical', () => {
    const services = store.getServicesForTenant(tenantA.id);
    assert(services.every(s => s.tenant_id === tenantA.id), 'All services belong to Tenant A');
  });

  await test('Tenant A cannot access Tenant B service by ID', 'critical', () => {
    const result = store.getServiceById(serviceB.id, tenantA.id);
    assertEqual(result, null, 'Cross-tenant service lookup denied');
  });

  await test('Tenant A transaction history excludes Tenant B transactions', 'high', () => {
    const txns = store.getTransactionsForTenant(tenantA.id);
    assert(txns.every(t => t.tenant_id === tenantA.id), 'Only Tenant A transactions returned');
    assert(!txns.some(t => t.tenant_id === tenantB.id), 'No Tenant B transactions leaked');
  });

  await test('Tenant A billing records exclude Tenant B records', 'high', () => {
    const records = store.getBillingForTenant(tenantA.id);
    assert(records.every(r => r.tenant_id === tenantA.id), 'Billing isolation maintained');
  });

  await test('Tenant A audit logs exclude Tenant B audit logs', 'high', () => {
    const logs = store.getAuditLogsForTenant(tenantA.id);
    assert(logs.every(l => l.tenant_id === tenantA.id), 'Audit log isolation maintained');
  });

  await test('Tenant B cannot read Tenant A wallet by ID', 'critical', () => {
    const result = store.getWallet(walletA.id, tenantB.id);
    assertEqual(result, null, 'Reverse cross-tenant access also denied');
  });

  await test('Tenant B data does not appear in Tenant A queries', 'critical', () => {
    const wallets  = store.getWalletsForTenant(tenantA.id);
    const services = store.getServicesForTenant(tenantA.id);
    const txns     = store.getTransactionsForTenant(tenantA.id);
    const billing  = store.getBillingForTenant(tenantA.id);

    const allRecords = [...wallets, ...services, ...txns, ...billing];
    assert(
      allRecords.every(r => (r as { tenant_id: string }).tenant_id === tenantA.id),
      'All records across all tables belong to Tenant A only'
    );
  });

  // -----------------------------------------------------------------------
  // 2. All queries include tenant_id filter
  // -----------------------------------------------------------------------

  await test('Wallet query pattern includes tenant_id filter', 'critical', () => {
    const query = 'SELECT * FROM wallets WHERE tenant_id = $1';
    assert(store.queriesIncludeTenantFilter(query), 'Query must include tenant_id filter');
  });

  await test('Transaction query pattern includes tenant_id filter', 'critical', () => {
    const query = 'SELECT * FROM wallet_transactions WHERE tenant_id = $1 AND wallet_id = $2';
    assert(store.queriesIncludeTenantFilter(query), 'Transaction query must include tenant_id');
  });

  await test('Billing query pattern includes tenant_id filter', 'critical', () => {
    const query = 'SELECT * FROM billing_records WHERE tenant_id = $1';
    assert(store.queriesIncludeTenantFilter(query), 'Billing query must include tenant_id');
  });

  await test('API service query pattern includes tenant_id filter', 'critical', () => {
    const query = 'SELECT * FROM api_services WHERE tenant_id = $1 AND is_active = true';
    assert(store.queriesIncludeTenantFilter(query), 'Service query must include tenant_id');
  });

  await test('Unfiltered query (missing tenant_id) is detectable', 'critical', () => {
    const unsafeQuery = 'SELECT * FROM wallets'; // Missing tenant_id
    assert(!store.queriesIncludeTenantFilter(unsafeQuery), 'Unsafe query should fail the filter check');
  });

  await test('Audit log query pattern includes tenant_id filter', 'high', () => {
    const query = 'SELECT * FROM audit_logs WHERE tenant_id = $1 ORDER BY created_at DESC';
    assert(store.queriesIncludeTenantFilter(query), 'Audit query must include tenant_id');
  });

  // -----------------------------------------------------------------------
  // 3. Cross-tenant wallet access denied
  // -----------------------------------------------------------------------

  await test('Direct wallet ID lookup enforces tenant ownership', 'critical', () => {
    // tenantB's wallet ID, accessed by tenantA — must be null
    const result = store.getWallet(walletB.id, tenantA.id);
    assert(result === null, 'Wallet lookup must return null for wrong tenant');
  });

  await test('Tenant can only access their own wallet balance', 'critical', () => {
    const ownWallet = store.getWallet(walletA.id, tenantA.id);
    assert(ownWallet !== null, 'Own wallet is accessible');
    assertEqual(ownWallet!.tenant_id, tenantA.id, 'Wallet belongs to requesting tenant');
    assertEqual(ownWallet!.balance, 1000, 'Correct balance returned');
  });

  await test('Unsafe unfiltered query exposes cross-tenant data (demonstrates RLS necessity)', 'critical', () => {
    // This test intentionally demonstrates that WITHOUT RLS, data leaks
    const allWallets = store.unsafeGetAllWallets();
    assert(allWallets.length > 1, 'Multiple tenant wallets exist');
    const tenantIds = [...new Set(allWallets.map(w => w.tenant_id))];
    assert(tenantIds.length > 1, 'Without RLS filter, wallets from multiple tenants are returned — RLS is critical');
  });

  await test('Wallet balance from cross-tenant lookup is not exposed', 'critical', () => {
    const stolen = store.getWallet(walletB.id, tenantA.id);
    assert(stolen === null, 'Balance not accessible cross-tenant');
    // tenantB has 500 balance — tenantA must not know this
    assert(stolen?.balance !== 500, 'Cross-tenant balance not leaked');
  });

  await test('Service IDs from other tenants cannot be used to make calls', 'critical', () => {
    // Tenant A tries to use Tenant B's service_id
    const crossSvc = store.getServiceById(serviceB.id, tenantA.id);
    assertEqual(crossSvc, null, 'Cannot access another tenant service');
  });

  // ============= REPORT =============
  const passed   = results.filter(r => r.passed).length;
  const failed   = results.filter(r => !r.passed).length;
  const critFail = results.filter(r => !r.passed && r.severity === 'critical').length;

  console.log('\n================================================================================');
  console.log('                TENANT ISOLATION SECURITY TEST RESULTS');
  console.log('================================================================================\n');

  for (const r of results) {
    const icon = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon}  [${r.severity.toUpperCase()}] ${r.name}`);
    if (r.error) console.log(`       Error: ${r.error}`);
  }

  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`Total: ${results.length}  |  Passed: ${passed}  |  Failed: ${failed}  |  Critical Failures: ${critFail}`);
  console.log('================================================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
