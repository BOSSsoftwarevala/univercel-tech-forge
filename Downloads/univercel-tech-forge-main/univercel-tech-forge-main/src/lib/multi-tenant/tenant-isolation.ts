/**
 * Tenant Data Isolation Layer
 * Ensures data segregation per franchise/reseller/prime
 * Preserves existing masking and RBAC rules
 */

import { supabase } from '@/integrations/supabase/client';

export interface IsolationPolicy {
  table: string;
  tenantColumn: string;
  inheritFromParent: boolean;
  encryptFields: string[];
}

export interface TenantDataFilter {
  tenantId: string;
  includeChildren: boolean;
  maskOutput: boolean;
}

// Tables with tenant isolation
const ISOLATED_TABLES: IsolationPolicy[] = [
  { table: 'wallet_transactions', tenantColumn: 'user_id', inheritFromParent: true, encryptFields: ['amount'] },
  { table: 'chat_messages', tenantColumn: 'sender_id', inheritFromParent: false, encryptFields: ['message_text'] },
  { table: 'developer_tasks', tenantColumn: 'assigned_to', inheritFromParent: true, encryptFields: [] },
  { table: 'demos', tenantColumn: 'created_by', inheritFromParent: true, encryptFields: [] },
  { table: 'audit_logs', tenantColumn: 'user_id', inheritFromParent: true, encryptFields: [] },
  { table: 'buzzer_queue', tenantColumn: 'accepted_by', inheritFromParent: false, encryptFields: [] },
];

export class TenantIsolationManager {
  private tenantId: string;
  private tenantType: string;
  private childTenantIds: string[];

  constructor(tenantId: string, tenantType: string, childTenantIds: string[] = []) {
    this.tenantId = tenantId;
    this.tenantType = tenantType;
    this.childTenantIds = childTenantIds;
  }

  /**
   * Get allowed tenant IDs based on hierarchy
   */
  getAllowedTenantIds(): string[] {
    return [this.tenantId, ...this.childTenantIds];
  }

  /**
   * Check if a record belongs to this tenant's scope
   */
  isWithinScope(recordTenantId: string): boolean {
    return this.getAllowedTenantIds().includes(recordTenantId);
  }

  /**
   * Apply tenant filter to a query
   */
  applyFilter(query: any, table: string): any {
    const policy = ISOLATED_TABLES.find(p => p.table === table);
    if (!policy) return query;

    const allowedIds = policy.inheritFromParent 
      ? this.getAllowedTenantIds()
      : [this.tenantId];

    return query.in(policy.tenantColumn, allowedIds);
  }

  /**
   * Validate data before insert/update
   */
  validateDataOwnership(data: Record<string, any>, table: string): boolean {
    const policy = ISOLATED_TABLES.find(p => p.table === table);
    if (!policy) return true;

    const recordTenantId = data[policy.tenantColumn];
    return this.isWithinScope(recordTenantId);
  }

  /**
   * Mask sensitive fields for cross-tenant viewing
   */
  maskSensitiveData(data: Record<string, any>, table: string): Record<string, any> {
    const policy = ISOLATED_TABLES.find(p => p.table === table);
    if (!policy) return data;

    const masked = { ...data };
    policy.encryptFields.forEach(field => {
      if (masked[field]) {
        masked[field] = this.maskValue(masked[field]);
      }
    });

    return masked;
  }

  private maskValue(value: any): string {
    if (typeof value === 'number') {
      return '****';
    }
    if (typeof value === 'string') {
      if (value.length <= 4) return '****';
      return value.substring(0, 2) + '****' + value.substring(value.length - 2);
    }
    return '****';
  }
}

/**
 * Tenant-aware database operations
 */
export const createTenantQuery = async (
  tenantId: string,
  tenantType: string,
  table: string
) => {
  const isolation = new TenantIsolationManager(tenantId, tenantType);
  
  return {
    select: async (columns: string = '*') => {
      let query = supabase.from(table as any).select(columns);
      query = isolation.applyFilter(query, table);
      return query;
    },
    
    insert: async (data: Record<string, any>) => {
      if (!isolation.validateDataOwnership(data, table)) {
        throw new Error('TENANT_ISOLATION_VIOLATION');
      }
      return supabase.from(table as any).insert(data);
    },
    
    update: async (data: Record<string, any>, id: string) => {
      if (!isolation.validateDataOwnership(data, table)) {
        throw new Error('TENANT_ISOLATION_VIOLATION');
      }
      return supabase.from(table as any).update(data).eq('id', id);
    },
    
    delete: async (id: string) => {
      // Verify ownership before delete
      const { data: record } = await supabase
        .from(table as any)
        .select('*')
        .eq('id', id)
        .single();
        
      if (record && !isolation.validateDataOwnership(record, table)) {
        throw new Error('TENANT_ISOLATION_VIOLATION');
      }
      
      // No-delete policy for certain tables
      if (table === 'chat_messages' || table === 'audit_logs') {
        throw new Error('DELETE_NOT_ALLOWED');
      }
      
      return supabase.from(table as any).delete().eq('id', id);
    }
  };
};

/**
 * Tenant billing segregation
 */
export interface TenantBilling {
  tenantId: string;
  walletBalance: number;
  pendingTransactions: number;
  lastSettlement: string;
  currency: string;
}

export const getTenantBilling = async (tenantId: string): Promise<TenantBilling> => {
  // Query wallet data - uses generic approach to avoid type conflicts
  const { data: walletData } = await supabase
    .from('wallets')
    .select('balance, currency, updated_at')
    .eq('user_id', tenantId)
    .single();

  // For pending transactions, we calculate from audit logs or a simpler approach
  const pendingAmount = 0; // Calculate from actual transaction data

  const wallet = walletData as { balance?: number; currency?: string; updated_at?: string } | null;

  return {
    tenantId,
    walletBalance: wallet?.balance || 0,
    pendingTransactions: pendingAmount,
    lastSettlement: wallet?.updated_at || new Date().toISOString(),
    currency: wallet?.currency || 'USD'
  };
};

export default TenantIsolationManager;
