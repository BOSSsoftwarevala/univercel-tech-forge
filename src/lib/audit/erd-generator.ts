// ================================================================
// ERD Generator - Generates Entity Relationship Diagram data
// Part of Enterprise Integrity Hard Check
// ================================================================

export interface ERDEntity {
  name: string;
  schema: string;
  columns: ERDColumn[];
  primaryKey: string;
  indexes: ERDIndex[];
  rlsEnabled: boolean;
}

export interface ERDColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  isForeignKey: boolean;
  referencesTable?: string;
  referencesColumn?: string;
  isPrimaryKey: boolean;
  isUnique?: boolean;
}

export interface ERDIndex {
  name: string;
  columns: string[];
  isUnique: boolean;
  type: 'btree' | 'hash' | 'gin' | 'gist';
}

export interface ERDRelationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  label: string;
}

export interface ERDDiagram {
  entities: ERDEntity[];
  relationships: ERDRelationship[];
  tenantIsolatedTables: string[];
  sharedTables: string[];
  auditTables: string[];
  generatedAt: string;
}

// ERD entity definitions
export const ERD_ENTITIES: ERDEntity[] = [
  {
    name: 'profiles',
    schema: 'public',
    primaryKey: 'id',
    rlsEnabled: true,
    columns: [
      { name: 'id', type: 'uuid', nullable: false, isPrimaryKey: true, isForeignKey: true, referencesTable: 'auth.users', referencesColumn: 'id' },
      { name: 'email', type: 'text', nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: 'full_name', type: 'text', nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: 'role', type: 'app_role', nullable: false, defaultValue: 'client', isPrimaryKey: false, isForeignKey: false },
      { name: 'tenant_id', type: 'uuid', nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: 'status', type: 'text', nullable: false, defaultValue: 'active', isPrimaryKey: false, isForeignKey: false },
      { name: 'created_at', type: 'timestamptz', nullable: false, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
      { name: 'updated_at', type: 'timestamptz', nullable: false, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
    ],
    indexes: [
      { name: 'profiles_pkey', columns: ['id'], isUnique: true, type: 'btree' },
      { name: 'profiles_role_idx', columns: ['role'], isUnique: false, type: 'btree' },
      { name: 'profiles_tenant_id_idx', columns: ['tenant_id'], isUnique: false, type: 'btree' },
    ],
  },
  {
    name: 'demos',
    schema: 'public',
    primaryKey: 'id',
    rlsEnabled: true,
    columns: [
      { name: 'id', type: 'uuid', nullable: false, defaultValue: 'gen_random_uuid()', isPrimaryKey: true, isForeignKey: false },
      { name: 'title', type: 'text', nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'category', type: 'text', nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'url', type: 'text', nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'tech_stack', type: 'demo_tech_stack', nullable: false, defaultValue: 'other', isPrimaryKey: false, isForeignKey: false },
      { name: 'status', type: 'demo_status', nullable: false, defaultValue: 'active', isPrimaryKey: false, isForeignKey: false },
      { name: 'created_by', type: 'uuid', nullable: true, isPrimaryKey: false, isForeignKey: true, referencesTable: 'auth.users', referencesColumn: 'id' },
      { name: 'created_at', type: 'timestamptz', nullable: false, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
      { name: 'updated_at', type: 'timestamptz', nullable: false, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
    ],
    indexes: [
      { name: 'demos_pkey', columns: ['id'], isUnique: true, type: 'btree' },
      { name: 'demos_status_idx', columns: ['status'], isUnique: false, type: 'btree' },
    ],
  },
  {
    name: 'leads',
    schema: 'public',
    primaryKey: 'id',
    rlsEnabled: true,
    columns: [
      { name: 'id', type: 'uuid', nullable: false, defaultValue: 'gen_random_uuid()', isPrimaryKey: true, isForeignKey: false },
      { name: 'name', type: 'text', nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'email', type: 'text', nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: 'phone', type: 'text', nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: 'status', type: 'text', nullable: false, defaultValue: 'new', isPrimaryKey: false, isForeignKey: false },
      { name: 'assigned_to', type: 'uuid', nullable: true, isPrimaryKey: false, isForeignKey: true, referencesTable: 'profiles', referencesColumn: 'id' },
      { name: 'created_by', type: 'uuid', nullable: false, isPrimaryKey: false, isForeignKey: true, referencesTable: 'auth.users', referencesColumn: 'id' },
      { name: 'franchise_id', type: 'uuid', nullable: true, isPrimaryKey: false, isForeignKey: true, referencesTable: 'profiles', referencesColumn: 'id' },
      { name: 'deleted_at', type: 'timestamptz', nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: 'created_at', type: 'timestamptz', nullable: false, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
      { name: 'updated_at', type: 'timestamptz', nullable: false, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
    ],
    indexes: [
      { name: 'leads_pkey', columns: ['id'], isUnique: true, type: 'btree' },
      { name: 'leads_status_idx', columns: ['status'], isUnique: false, type: 'btree' },
      { name: 'leads_assigned_to_idx', columns: ['assigned_to'], isUnique: false, type: 'btree' },
      { name: 'leads_franchise_id_idx', columns: ['franchise_id'], isUnique: false, type: 'btree' },
      { name: 'leads_created_at_idx', columns: ['created_at'], isUnique: false, type: 'btree' },
    ],
  },
  {
    name: 'audit_logs',
    schema: 'public',
    primaryKey: 'id',
    rlsEnabled: true,
    columns: [
      { name: 'id', type: 'uuid', nullable: false, defaultValue: 'gen_random_uuid()', isPrimaryKey: true, isForeignKey: false },
      { name: 'user_id', type: 'uuid', nullable: true, isPrimaryKey: false, isForeignKey: true, referencesTable: 'auth.users', referencesColumn: 'id' },
      { name: 'module', type: 'text', nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'action', type: 'text', nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'meta_json', type: 'jsonb', nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: 'timestamp', type: 'timestamptz', nullable: false, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
    ],
    indexes: [
      { name: 'audit_logs_pkey', columns: ['id'], isUnique: true, type: 'btree' },
      { name: 'audit_logs_user_id_idx', columns: ['user_id'], isUnique: false, type: 'btree' },
      { name: 'audit_logs_module_idx', columns: ['module'], isUnique: false, type: 'btree' },
      { name: 'audit_logs_timestamp_idx', columns: ['timestamp'], isUnique: false, type: 'btree' },
    ],
  },
  {
    name: 'ip_locks',
    schema: 'public',
    primaryKey: 'id',
    rlsEnabled: true,
    columns: [
      { name: 'id', type: 'uuid', nullable: false, defaultValue: 'gen_random_uuid()', isPrimaryKey: true, isForeignKey: false },
      { name: 'user_id', type: 'uuid', nullable: false, isUnique: true, isPrimaryKey: false, isForeignKey: true, referencesTable: 'auth.users', referencesColumn: 'id' },
      { name: 'ip', type: 'text', nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'device', type: 'text', nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'status', type: 'text', nullable: false, defaultValue: 'active', isPrimaryKey: false, isForeignKey: false },
      { name: 'created_at', type: 'timestamptz', nullable: false, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
      { name: 'updated_at', type: 'timestamptz', nullable: false, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
    ],
    indexes: [
      { name: 'ip_locks_pkey', columns: ['id'], isUnique: true, type: 'btree' },
      { name: 'ip_locks_user_id_key', columns: ['user_id'], isUnique: true, type: 'btree' },
      { name: 'ip_locks_status_idx', columns: ['status'], isUnique: false, type: 'btree' },
    ],
  },
];

// All entity relationships
export const ERD_RELATIONSHIPS: ERDRelationship[] = [
  { fromTable: 'profiles', fromColumn: 'id', toTable: 'auth.users', toColumn: 'id', type: 'one-to-one', onDelete: 'CASCADE', label: 'extends' },
  { fromTable: 'demos', fromColumn: 'created_by', toTable: 'auth.users', toColumn: 'id', type: 'one-to-many', onDelete: 'SET NULL', label: 'created by' },
  { fromTable: 'demo_clicks', fromColumn: 'demo_id', toTable: 'demos', toColumn: 'id', type: 'one-to-many', onDelete: 'CASCADE', label: 'tracks clicks' },
  { fromTable: 'demo_health', fromColumn: 'demo_id', toTable: 'demos', toColumn: 'id', type: 'one-to-many', onDelete: 'CASCADE', label: 'health checks' },
  { fromTable: 'rental_assign', fromColumn: 'demo_id', toTable: 'demos', toColumn: 'id', type: 'one-to-many', onDelete: 'CASCADE', label: 'assigned' },
  { fromTable: 'leads', fromColumn: 'assigned_to', toTable: 'profiles', toColumn: 'id', type: 'one-to-many', onDelete: 'SET NULL', label: 'assigned to' },
  { fromTable: 'leads', fromColumn: 'franchise_id', toTable: 'profiles', toColumn: 'id', type: 'one-to-many', onDelete: 'SET NULL', label: 'owned by franchise' },
  { fromTable: 'audit_logs', fromColumn: 'user_id', toTable: 'auth.users', toColumn: 'id', type: 'one-to-many', onDelete: 'SET NULL', label: 'audit trail' },
  { fromTable: 'ip_locks', fromColumn: 'user_id', toTable: 'auth.users', toColumn: 'id', type: 'one-to-one', onDelete: 'CASCADE', label: 'ip locked' },
];

export function generateERD(): ERDDiagram {
  const tenantIsolatedTables = ERD_ENTITIES
    .filter(e => e.columns.some(c => c.name === 'tenant_id'))
    .map(e => e.name);

  const sharedTables = ERD_ENTITIES
    .filter(e => !e.columns.some(c => c.name === 'tenant_id'))
    .map(e => e.name);

  const auditTables = ['audit_logs', 'uptime_logs', 'demo_health'];

  return {
    entities: ERD_ENTITIES,
    relationships: ERD_RELATIONSHIPS,
    tenantIsolatedTables,
    sharedTables,
    auditTables,
    generatedAt: new Date().toISOString(),
  };
}
