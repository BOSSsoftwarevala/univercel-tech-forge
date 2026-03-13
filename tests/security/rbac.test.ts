// ================================================================
// Software Vala - RBAC (Role-Based Access Control) Security Tests
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

type AppRole =
  | 'super_admin'
  | 'tenant_admin'
  | 'product_manager'
  | 'developer'
  | 'reseller'
  | 'franchise'
  | 'user'
  | 'support'
  | 'finance';

type Permission =
  | 'kill_switch'
  | 'wallet_read'
  | 'wallet_write'
  | 'billing_read'
  | 'billing_write'
  | 'user_manage'
  | 'api_service_manage'
  | 'api_service_read'
  | 'audit_log_read'
  | 'system_config'
  | 'role_assign'
  | 'report_read'
  | 'support_ticket_manage'
  | 'developer_tools';

// ============= RBAC ENGINE SIMULATION =============

const ROLE_PERMISSIONS: Record<AppRole, Set<Permission>> = {
  super_admin: new Set<Permission>([
    'kill_switch', 'wallet_read', 'wallet_write', 'billing_read', 'billing_write',
    'user_manage', 'api_service_manage', 'api_service_read', 'audit_log_read',
    'system_config', 'role_assign', 'report_read', 'support_ticket_manage', 'developer_tools',
  ]),
  tenant_admin: new Set<Permission>([
    'wallet_read', 'wallet_write', 'billing_read', 'billing_write',
    'user_manage', 'api_service_manage', 'api_service_read', 'audit_log_read',
    'role_assign', 'report_read', 'support_ticket_manage',
  ]),
  product_manager: new Set<Permission>([
    'api_service_read', 'api_service_manage', 'billing_read', 'report_read',
  ]),
  developer: new Set<Permission>([
    'api_service_read', 'developer_tools',
  ]),
  reseller: new Set<Permission>([
    'wallet_read', 'billing_read', 'api_service_read', 'report_read',
  ]),
  franchise: new Set<Permission>([
    'wallet_read', 'billing_read', 'api_service_read',
  ]),
  user: new Set<Permission>([
    'api_service_read',
  ]),
  support: new Set<Permission>([
    'support_ticket_manage', 'audit_log_read', 'user_manage',
  ]),
  finance: new Set<Permission>([
    'wallet_read', 'wallet_write', 'billing_read', 'billing_write', 'report_read',
  ]),
};

function hasPermission(role: AppRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

function checkAccess(role: AppRole, permission: Permission): { allowed: boolean; reason: string } {
  const allowed = hasPermission(role, permission);
  return {
    allowed,
    reason: allowed
      ? `Role '${role}' has '${permission}' permission`
      : `Role '${role}' does not have '${permission}' permission — access denied`,
  };
}

function getAllPermissions(role: AppRole): Permission[] {
  return Array.from(ROLE_PERMISSIONS[role] ?? []);
}

// ============= TESTS =============

async function runTests(): Promise<void> {

  // -----------------------------------------------------------------------
  // 1. Super admin has all permissions
  // -----------------------------------------------------------------------

  await test('Super admin: has kill_switch permission', 'critical', () => {
    assert(hasPermission('super_admin', 'kill_switch'), 'Super admin must have kill_switch');
  });

  await test('Super admin: has all 15 permissions', 'critical', () => {
    const all: Permission[] = [
      'kill_switch', 'wallet_read', 'wallet_write', 'billing_read', 'billing_write',
      'user_manage', 'api_service_manage', 'api_service_read', 'audit_log_read',
      'system_config', 'role_assign', 'report_read', 'support_ticket_manage', 'developer_tools',
    ];
    for (const perm of all) {
      assert(hasPermission('super_admin', perm), `Super admin missing permission: ${perm}`);
    }
  });

  await test('Super admin: can assign roles', 'critical', () => {
    const { allowed } = checkAccess('super_admin', 'role_assign');
    assert(allowed, 'Super admin must be able to assign roles');
  });

  await test('Super admin: can access system_config', 'critical', () => {
    assert(hasPermission('super_admin', 'system_config'), 'Super admin must access system_config');
  });

  // -----------------------------------------------------------------------
  // 2. Regular user cannot kill switch
  // -----------------------------------------------------------------------

  await test('User: cannot activate kill switch', 'critical', () => {
    const { allowed } = checkAccess('user', 'kill_switch');
    assert(!allowed, 'Regular user must NOT have kill_switch permission');
  });

  await test('Developer: cannot activate kill switch', 'critical', () => {
    assert(!hasPermission('developer', 'kill_switch'), 'Developer must NOT have kill_switch');
  });

  await test('Reseller: cannot activate kill switch', 'critical', () => {
    assert(!hasPermission('reseller', 'kill_switch'), 'Reseller must NOT have kill_switch');
  });

  await test('Franchise: cannot activate kill switch', 'critical', () => {
    assert(!hasPermission('franchise', 'kill_switch'), 'Franchise must NOT have kill_switch');
  });

  await test('Product manager: cannot activate kill switch', 'critical', () => {
    assert(!hasPermission('product_manager', 'kill_switch'), 'Product manager must NOT have kill_switch');
  });

  await test('Support: cannot activate kill switch', 'critical', () => {
    assert(!hasPermission('support', 'kill_switch'), 'Support must NOT have kill_switch');
  });

  await test('Finance: cannot activate kill switch', 'critical', () => {
    assert(!hasPermission('finance', 'kill_switch'), 'Finance must NOT have kill_switch');
  });

  // -----------------------------------------------------------------------
  // 3. Finance role can access billing
  // -----------------------------------------------------------------------

  await test('Finance: can read billing', 'high', () => {
    assert(hasPermission('finance', 'billing_read'), 'Finance must have billing_read');
  });

  await test('Finance: can write billing', 'high', () => {
    assert(hasPermission('finance', 'billing_write'), 'Finance must have billing_write');
  });

  await test('Finance: can read wallet', 'high', () => {
    assert(hasPermission('finance', 'wallet_read'), 'Finance must have wallet_read');
  });

  await test('Finance: can write wallet (fund adjustments)', 'high', () => {
    assert(hasPermission('finance', 'wallet_write'), 'Finance must have wallet_write');
  });

  await test('Finance: can access reports', 'high', () => {
    assert(hasPermission('finance', 'report_read'), 'Finance must have report_read');
  });

  await test('Finance: cannot manage users', 'high', () => {
    assert(!hasPermission('finance', 'user_manage'), 'Finance must NOT manage users');
  });

  await test('Finance: cannot access developer tools', 'high', () => {
    assert(!hasPermission('finance', 'developer_tools'), 'Finance must NOT have developer_tools');
  });

  // -----------------------------------------------------------------------
  // 4. Developer cannot access wallet
  // -----------------------------------------------------------------------

  await test('Developer: cannot read wallet', 'critical', () => {
    assert(!hasPermission('developer', 'wallet_read'), 'Developer must NOT have wallet_read');
  });

  await test('Developer: cannot write wallet', 'critical', () => {
    assert(!hasPermission('developer', 'wallet_write'), 'Developer must NOT have wallet_write');
  });

  await test('Developer: cannot read billing', 'high', () => {
    assert(!hasPermission('developer', 'billing_read'), 'Developer must NOT have billing_read');
  });

  await test('Developer: cannot manage users', 'high', () => {
    assert(!hasPermission('developer', 'user_manage'), 'Developer must NOT manage users');
  });

  await test('Developer: can use developer_tools', 'medium', () => {
    assert(hasPermission('developer', 'developer_tools'), 'Developer must have developer_tools');
  });

  await test('Developer: can read api_services', 'medium', () => {
    assert(hasPermission('developer', 'api_service_read'), 'Developer must have api_service_read');
  });

  await test('Developer: cannot manage api_services', 'high', () => {
    assert(!hasPermission('developer', 'api_service_manage'), 'Developer must NOT manage api_services');
  });

  // -----------------------------------------------------------------------
  // 5. Additional role boundary checks
  // -----------------------------------------------------------------------

  await test('User: has minimal permissions (api_service_read only)', 'high', () => {
    const perms = getAllPermissions('user');
    assertEqual(perms.length, 1, 'User should have exactly 1 permission');
    assert(perms.includes('api_service_read'), 'User must have api_service_read');
  });

  await test('User: cannot access billing', 'high', () => {
    assert(!hasPermission('user', 'billing_read'), 'User must NOT read billing');
    assert(!hasPermission('user', 'billing_write'), 'User must NOT write billing');
  });

  await test('User: cannot manage other users', 'critical', () => {
    assert(!hasPermission('user', 'user_manage'), 'User must NOT manage users');
  });

  await test('Tenant admin: can manage users within tenant', 'high', () => {
    assert(hasPermission('tenant_admin', 'user_manage'), 'Tenant admin can manage users');
  });

  await test('Tenant admin: cannot access system_config (only super_admin)', 'critical', () => {
    assert(!hasPermission('tenant_admin', 'system_config'), 'Tenant admin must NOT access system_config');
  });

  await test('Tenant admin: cannot activate kill switch', 'critical', () => {
    assert(!hasPermission('tenant_admin', 'kill_switch'), 'Tenant admin must NOT have kill_switch');
  });

  await test('Support: can manage tickets', 'medium', () => {
    assert(hasPermission('support', 'support_ticket_manage'), 'Support must manage tickets');
  });

  await test('Support: can read audit logs', 'high', () => {
    assert(hasPermission('support', 'audit_log_read'), 'Support needs audit_log_read for investigations');
  });

  await test('Support: cannot read wallet balance', 'critical', () => {
    assert(!hasPermission('support', 'wallet_read'), 'Support must NOT read wallet balances');
  });

  await test('Support: cannot write billing records', 'critical', () => {
    assert(!hasPermission('support', 'billing_write'), 'Support must NOT write billing');
  });

  await test('Reseller: can read wallet (own funds visibility)', 'high', () => {
    assert(hasPermission('reseller', 'wallet_read'), 'Reseller needs wallet_read');
  });

  await test('Reseller: cannot write wallet directly', 'critical', () => {
    assert(!hasPermission('reseller', 'wallet_write'), 'Reseller must NOT write wallet');
  });

  await test('Franchise: can read billing (view invoices)', 'medium', () => {
    assert(hasPermission('franchise', 'billing_read'), 'Franchise can view billing');
  });

  await test('Franchise: cannot write billing records', 'critical', () => {
    assert(!hasPermission('franchise', 'billing_write'), 'Franchise must NOT write billing');
  });

  await test('Franchise: cannot assign roles', 'critical', () => {
    assert(!hasPermission('franchise', 'role_assign'), 'Franchise must NOT assign roles');
  });

  await test('checkAccess returns reason message for denied access', 'medium', () => {
    const { allowed, reason } = checkAccess('developer', 'kill_switch');
    assert(!allowed, 'Access denied');
    assert(reason.includes('does not have'), 'Reason message is descriptive');
  });

  await test('checkAccess returns reason message for allowed access', 'medium', () => {
    const { allowed, reason } = checkAccess('super_admin', 'kill_switch');
    assert(allowed, 'Access allowed');
    assert(reason.includes('has'), 'Reason message confirms permission');
  });

  // ============= REPORT =============
  const passed   = results.filter(r => r.passed).length;
  const failed   = results.filter(r => !r.passed).length;
  const critFail = results.filter(r => !r.passed && r.severity === 'critical').length;

  console.log('\n================================================================================');
  console.log('                    RBAC SECURITY TEST RESULTS');
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
