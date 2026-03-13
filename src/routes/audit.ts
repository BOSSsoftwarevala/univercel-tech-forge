import { supabase } from '@/integrations/supabase/client';

export interface AuditFilters {
  action?: string;
  userId?: string;
  entityType?: string;
}

export async function getAuditLogs(tenantId: string, limit = 200, filters: AuditFilters = {}) {
  let query = supabase.from('audit_logs').select('*');
  if (filters.action) query = query.eq('action', filters.action);
  if (filters.userId) query = query.eq('user_id', filters.userId);
  if (filters.entityType) query = query.eq('entity_type', filters.entityType);
  return query.order('created_at', { ascending: false }).limit(limit);
}

export async function getAdminActionLogs(tenantId: string) {
  return supabase
    .from('audit_logs')
    .select('*')
    .in('action', ['block_user', 'kill_all', 'kill_ai', 'lock_wallet', 'resume', 'delete_service', 'rotate_key'])
    .order('created_at', { ascending: false })
    .limit(200);
}

export async function exportAuditLogs(tenantId: string, format: 'csv' | 'json') {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5000);

  if (error) return { data: null, error };

  if (format === 'json') {
    return { data: JSON.stringify(data, null, 2), error: null };
  }

  const rows = data ?? [];
  if (rows.length === 0) return { data: '', error: null };

  const headers = Object.keys(rows[0]).join(',');
  const lines = rows.map(row =>
    Object.values(row)
      .map(v => (typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v ?? '')))
      .join(','),
  );

  return { data: [headers, ...lines].join('\n'), error: null };
}
