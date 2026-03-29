export interface GeneratedTableSpec {
  table: string;
  columns: string[];
  relations: string[];
  rlsPolicies: string[];
  seedData: string[];
}

const MODULE_TABLE_MAP: Record<string, GeneratedTableSpec[]> = {
  auth: [
    {
      table: 'app_users',
      columns: ['id uuid primary key', 'email text unique', 'full_name text', 'created_at timestamptz'],
      relations: [],
      rlsPolicies: ['owner_select', 'owner_update'],
      seedData: ['admin@example.com'],
    },
    {
      table: 'app_roles',
      columns: ['id uuid primary key', 'user_id uuid', 'role text', 'created_at timestamptz'],
      relations: ['user_id -> app_users.id'],
      rlsPolicies: ['owner_select', 'admin_manage'],
      seedData: ['admin'],
    },
  ],
  crm: [
    {
      table: 'crm_leads',
      columns: ['id uuid primary key', 'owner_id uuid', 'lead_name text', 'stage text', 'created_at timestamptz'],
      relations: ['owner_id -> app_users.id'],
      rlsPolicies: ['owner_select', 'owner_mutate'],
      seedData: ['Sample Lead'],
    },
  ],
  erp: [
    {
      table: 'erp_orders',
      columns: ['id uuid primary key', 'customer_id uuid', 'status text', 'total_amount numeric', 'created_at timestamptz'],
      relations: ['customer_id -> app_users.id'],
      rlsPolicies: ['owner_select', 'staff_mutate'],
      seedData: ['Draft Order'],
    },
  ],
  school: [
    {
      table: 'school_students',
      columns: ['id uuid primary key', 'guardian_id uuid', 'student_name text', 'grade text', 'created_at timestamptz'],
      relations: ['guardian_id -> app_users.id'],
      rlsPolicies: ['guardian_select', 'school_staff_manage'],
      seedData: ['Demo Student'],
    },
  ],
  hospital: [
    {
      table: 'hospital_patients',
      columns: ['id uuid primary key', 'doctor_id uuid', 'patient_name text', 'status text', 'created_at timestamptz'],
      relations: ['doctor_id -> app_users.id'],
      rlsPolicies: ['doctor_select', 'medical_staff_manage'],
      seedData: ['Demo Patient'],
    },
  ],
  marketplace: [
    {
      table: 'marketplace_catalog',
      columns: ['id uuid primary key', 'seller_id uuid', 'title text', 'price numeric', 'created_at timestamptz'],
      relations: ['seller_id -> app_users.id'],
      rlsPolicies: ['public_select', 'seller_mutate'],
      seedData: ['Demo Listing'],
    },
  ],
  transport: [
    {
      table: 'transport_trips',
      columns: ['id uuid primary key', 'driver_id uuid', 'route_name text', 'status text', 'created_at timestamptz'],
      relations: ['driver_id -> app_users.id'],
      rlsPolicies: ['driver_select', 'dispatcher_manage'],
      seedData: ['Demo Route'],
    },
  ],
};

export function generateDatabasePlan(systemType: string, modules: string[]) {
  const normalized = Array.from(new Set(['auth', systemType, ...modules].map((item) => item.toLowerCase())));
  const tables = normalized.flatMap((moduleKey) => MODULE_TABLE_MAP[moduleKey] || []);
  return {
    systemType,
    modules: normalized,
    tables,
    sqlPreview: tables.map((table) => `create table ${table.table} (${table.columns.join(', ')});`).join('\n'),
    rlsPreview: tables.flatMap((table) => table.rlsPolicies.map((policy) => `${table.table}:${policy}`)),
    seedPreview: tables.flatMap((table) => table.seedData.map((seed) => `${table.table}:${seed}`)),
  };
}