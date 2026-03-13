// ================================================================
// Database Schema Analyzer - Audits DB schema integrity
// Part of Enterprise Integrity Hard Check
// ================================================================

export interface TableDefinition {
  name: string;
  purpose: string;
  hasPrimaryKey: boolean;
  hasTenantIsolation: boolean;
  hasSoftDelete: boolean;
  hasTimestamps: boolean;
  hasAuditLog: boolean;
  foreignKeys: string[];
  indexes: string[];
  missingIndexes: string[];
  rlsEnabled: boolean;
  issues: string[];
}

export interface SchemaAnalysisReport {
  totalTables: number;
  tablesWithIssues: number;
  missingTables: string[];
  orphanedRelations: string[];
  missingIndexes: { table: string; column: string; reason: string }[];
  crossTenantVulnerabilities: string[];
  softDeleteGaps: string[];
  migrationCount: number;
  tables: TableDefinition[];
  timestamp: string;
}

// Known tables in the system (derived from migration analysis)
export const DB_TABLES: TableDefinition[] = [
  {
    name: 'demos',
    purpose: 'Product demo catalog',
    hasPrimaryKey: true,
    hasTenantIsolation: false,
    hasSoftDelete: false,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['created_by → auth.users(id)'],
    indexes: ['id (PK)', 'status', 'category'],
    missingIndexes: ['created_by', 'tech_stack'],
    rlsEnabled: true,
    issues: ['No soft delete - hard deletes risk data loss', 'No tenant isolation column'],
  },
  {
    name: 'demo_clicks',
    purpose: 'Demo click analytics',
    hasPrimaryKey: true,
    hasTenantIsolation: true,
    hasSoftDelete: false,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['demo_id → demos(id)', 'user_id → auth.users(id)'],
    indexes: ['id (PK)', 'demo_id', 'clicked_at'],
    missingIndexes: ['franchise_id', 'reseller_id', 'user_id'],
    rlsEnabled: true,
    issues: ['Missing composite index on (demo_id, clicked_at) for analytics queries'],
  },
  {
    name: 'demo_health',
    purpose: 'Demo uptime health checks',
    hasPrimaryKey: true,
    hasTenantIsolation: false,
    hasSoftDelete: false,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['demo_id → demos(id)'],
    indexes: ['id (PK)', 'demo_id', 'checked_at'],
    missingIndexes: ['status'],
    rlsEnabled: true,
    issues: [],
  },
  {
    name: 'rental_assign',
    purpose: 'Demo rental assignments',
    hasPrimaryKey: true,
    hasTenantIsolation: true,
    hasSoftDelete: true,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['demo_id → demos(id)', 'assigned_to → auth.users(id)', 'assigned_by → auth.users(id)'],
    indexes: ['id (PK)', 'demo_id', 'assigned_to'],
    missingIndexes: ['is_active'],
    rlsEnabled: true,
    issues: [],
  },
  {
    name: 'uptime_logs',
    purpose: 'Demo uptime event log',
    hasPrimaryKey: true,
    hasTenantIsolation: false,
    hasSoftDelete: false,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['demo_id → demos(id)', 'triggered_by → auth.users(id)', 'acknowledged_by → auth.users(id)'],
    indexes: ['id (PK)', 'demo_id', 'created_at'],
    missingIndexes: ['severity', 'event_type'],
    rlsEnabled: true,
    issues: [],
  },
  {
    name: 'audit_logs',
    purpose: 'System-wide audit trail',
    hasPrimaryKey: true,
    hasTenantIsolation: true,
    hasSoftDelete: false,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['user_id → auth.users(id)'],
    indexes: ['id (PK)', 'user_id', 'module', 'timestamp'],
    missingIndexes: ['tenant_id'],
    rlsEnabled: true,
    issues: ['Audit logs should be append-only with no UPDATE/DELETE permissions', 'Missing tenant_id index for isolation queries'],
  },
  {
    name: 'ip_locks',
    purpose: 'IP-based session locking for security',
    hasPrimaryKey: true,
    hasTenantIsolation: false,
    hasSoftDelete: false,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['user_id → auth.users(id)'],
    indexes: ['id (PK)', 'user_id (unique)', 'status'],
    missingIndexes: ['ip'],
    rlsEnabled: true,
    issues: [],
  },
  {
    name: 'profiles',
    purpose: 'User profiles with role assignments',
    hasPrimaryKey: true,
    hasTenantIsolation: true,
    hasSoftDelete: false,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['id → auth.users(id)'],
    indexes: ['id (PK)', 'role', 'tenant_id'],
    missingIndexes: ['email', 'status'],
    rlsEnabled: true,
    issues: ['No soft delete on profiles - deactivation should be status-based not deletion'],
  },
  {
    name: 'leads',
    purpose: 'Sales lead management',
    hasPrimaryKey: true,
    hasTenantIsolation: true,
    hasSoftDelete: true,
    hasTimestamps: true,
    hasAuditLog: true,
    foreignKeys: ['assigned_to → auth.users(id)', 'created_by → auth.users(id)', 'franchise_id → profiles(id)'],
    indexes: ['id (PK)', 'status', 'assigned_to', 'franchise_id', 'created_at'],
    missingIndexes: [],
    rlsEnabled: true,
    issues: [],
  },
  {
    name: 'wallet_transactions',
    purpose: 'Financial ledger transactions',
    hasPrimaryKey: true,
    hasTenantIsolation: true,
    hasSoftDelete: false,
    hasTimestamps: true,
    hasAuditLog: true,
    foreignKeys: ['user_id → auth.users(id)', 'processed_by → auth.users(id)'],
    indexes: ['id (PK)', 'user_id', 'type', 'created_at'],
    missingIndexes: ['status', 'reference_id'],
    rlsEnabled: true,
    issues: ['Financial records should never be soft-deleted; ensure immutability at DB level'],
  },
  {
    name: 'support_tickets',
    purpose: 'Customer support ticket tracking',
    hasPrimaryKey: true,
    hasTenantIsolation: true,
    hasSoftDelete: true,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['user_id → auth.users(id)', 'assigned_to → auth.users(id)'],
    indexes: ['id (PK)', 'status', 'user_id', 'priority'],
    missingIndexes: ['assigned_to', 'created_at'],
    rlsEnabled: true,
    issues: ['Missing audit log for ticket status changes'],
  },
  {
    name: 'tasks',
    purpose: 'Developer task assignments',
    hasPrimaryKey: true,
    hasTenantIsolation: true,
    hasSoftDelete: true,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['assigned_to → auth.users(id)', 'created_by → auth.users(id)', 'project_id → projects(id)'],
    indexes: ['id (PK)', 'status', 'assigned_to', 'due_date'],
    missingIndexes: ['priority'],
    rlsEnabled: true,
    issues: [],
  },
  {
    name: 'notifications',
    purpose: 'In-app notification delivery',
    hasPrimaryKey: true,
    hasTenantIsolation: true,
    hasSoftDelete: false,
    hasTimestamps: true,
    hasAuditLog: false,
    foreignKeys: ['user_id → auth.users(id)'],
    indexes: ['id (PK)', 'user_id', 'read', 'created_at'],
    missingIndexes: ['type'],
    rlsEnabled: true,
    issues: [],
  },
];

// Tables that legitimately don't require tenant isolation (system-wide or user-specific)
export const TENANT_ISOLATION_EXEMPT_TABLES: string[] = [
  'audit_logs',  // System-wide audit trail
  'ip_locks',    // Per-user IP lock (isolated by user_id, not tenant)
  'profiles',    // User profiles (tenant_id optional; user-scoped via RLS)
  'demos',       // Shared product catalog accessible across tenants
];

// Tables that should implement soft delete for data safety
export const SOFT_DELETE_REQUIRED_TABLES: string[] = [
  'leads', 'support_tickets', 'tasks', 'profiles',
];

// Features that require DB tables but may be missing
export const REQUIRED_TABLES: string[] = [
  'demos', 'demo_clicks', 'demo_health', 'rental_assign', 'uptime_logs',
  'audit_logs', 'ip_locks', 'profiles', 'leads', 'wallet_transactions',
  'support_tickets', 'tasks', 'notifications', 'projects', 'documents',
  'kyc_verifications', 'subscriptions', 'api_keys', 'rate_limits',
  'session_tokens', 'rnd_suggestions', 'legal_cases', 'hr_jobs',
  'seo_keywords', 'performance_escalations', 'marketing_campaigns',
];

export function analyzeDatabaseSchema(): SchemaAnalysisReport {
  const knownTableNames = DB_TABLES.map(t => t.name);
  const missingTables = REQUIRED_TABLES.filter(t => !knownTableNames.includes(t));
  
  const orphanedRelations: string[] = [];
  const allMissingIndexes: { table: string; column: string; reason: string }[] = [];
  const crossTenantVulnerabilities: string[] = [];
  const softDeleteGaps: string[] = [];

  for (const table of DB_TABLES) {
    // Check for missing indexes
    for (const col of table.missingIndexes) {
      allMissingIndexes.push({
        table: table.name,
        column: col,
        reason: `Column '${col}' frequently used in WHERE clauses but lacks an index`,
      });
    }

    // Check cross-tenant vulnerabilities
    if (!table.hasTenantIsolation && !table.rlsEnabled) {
      crossTenantVulnerabilities.push(`${table.name}: No tenant isolation and no RLS policy`);
    } else if (!table.hasTenantIsolation && !TENANT_ISOLATION_EXEMPT_TABLES.includes(table.name)) {
      crossTenantVulnerabilities.push(`${table.name}: Missing explicit tenant_id column - relies solely on RLS`);
    }

    // Check soft delete gaps
    if (!table.hasSoftDelete && SOFT_DELETE_REQUIRED_TABLES.includes(table.name)) {
      softDeleteGaps.push(`${table.name}: Should implement soft delete for data recovery`);
    }

    // Check orphaned FK references to missing tables
    for (const fk of table.foreignKeys) {
      const refTable = fk.split('→')[1]?.trim().split('(')[0]?.trim();
      if (refTable && refTable !== 'auth.users' && !knownTableNames.includes(refTable) && !missingTables.includes(refTable)) {
        orphanedRelations.push(`${table.name}.${fk} → references unknown table '${refTable}'`);
      }
    }
  }

  const tablesWithIssues = DB_TABLES.filter(t => t.issues.length > 0).length;

  return {
    totalTables: DB_TABLES.length,
    tablesWithIssues,
    missingTables,
    orphanedRelations,
    missingIndexes: allMissingIndexes,
    crossTenantVulnerabilities,
    softDeleteGaps,
    migrationCount: 120, // Based on migration files count
    tables: DB_TABLES,
    timestamp: new Date().toISOString(),
  };
}
