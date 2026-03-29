import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

async function getDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset()
  ];
  const str = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function useSuperAdminApi() {
  const callApi = useCallback(async <T = unknown>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    body?: Record<string, unknown>
  ): Promise<ApiResponse<T>> => {
    try {
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        return { success: false, error: 'Not authenticated' };
      }

      const deviceFingerprint = await getDeviceFingerprint();

      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: method !== 'GET' ? body : undefined,
        headers: {
          Authorization: `Bearer ${authData.session.access_token}`,
          'x-device-fingerprint': deviceFingerprint
        }
      });

      if (error) {
        console.error(`API Error [${endpoint}]:`, error);
        return { success: false, error: error.message };
      }

      return data as ApiResponse<T>;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`API Error [${endpoint}]:`, err);
      return { success: false, error: message };
    }
  }, []);

  // ==================== DASHBOARD ====================
  const fetchDashboardStats = useCallback(async () => {
    return callApi<{
      totalUsers: number;
      totalAdmins: number;
      pendingApprovals: number;
      activeRentals: number;
      activeRules: number;
      securityAlerts: number;
    }>('super-admin-operations/dashboard/stats');
  }, [callApi]);

  // ==================== USERS ====================
  const fetchUsers = useCallback(async (filters?: { status?: string; search?: string }) => {
    return callApi<{ users: unknown[] }>('super-admin-users/list', 'POST', filters);
  }, [callApi]);

  const getUser = useCallback(async (userId: string) => {
    return callApi<{ user: unknown }>('super-admin-users/get', 'POST', { user_id: userId });
  }, [callApi]);

  const suspendUser = useCallback(async (userId: string, reason: string) => {
    const result = await callApi('super-admin-users/suspend', 'POST', { user_id: userId, reason });
    if (result.success) toast.success('User suspended');
    else toast.error(result.error || 'Failed to suspend user');
    return result;
  }, [callApi]);

  const lockUser = useCallback(async (userId: string, reason: string) => {
    const result = await callApi('super-admin-users/lock', 'POST', { user_id: userId, reason });
    if (result.success) toast.success('User locked');
    else toast.error(result.error || 'Failed to lock user');
    return result;
  }, [callApi]);

  const unlockUser = useCallback(async (userId: string) => {
    const result = await callApi('super-admin-users/unlock', 'POST', { user_id: userId });
    if (result.success) toast.success('User unlocked');
    else toast.error(result.error || 'Failed to unlock user');
    return result;
  }, [callApi]);

  // ==================== ADMINS ====================
  const fetchAdmins = useCallback(async () => {
    return callApi<{ admins: unknown[] }>('super-admin-operations/admins/list');
  }, [callApi]);

  const createAdmin = useCallback(async (data: {
    user_id: string;
    assigned_scope: unknown;
    scope_type: string;
    permissions_list: unknown;
  }) => {
    const result = await callApi('super-admin-operations/admins/create', 'POST', data);
    if (result.success) toast.success('Admin created');
    else toast.error(result.error || 'Failed to create admin');
    return result;
  }, [callApi]);

  const updateAdminScope = useCallback(async (adminId: string, newScope: unknown, reason: string) => {
    const result = await callApi('super-admin-operations/admins/update-scope', 'POST', {
      admin_id: adminId,
      new_scope: newScope,
      reason
    });
    if (result.success) toast.success('Admin scope updated');
    else toast.error(result.error || 'Failed to update scope');
    return result;
  }, [callApi]);

  const suspendAdmin = useCallback(async (adminId: string, reason: string) => {
    const result = await callApi('super-admin-operations/admins/suspend', 'POST', {
      admin_id: adminId,
      reason
    });
    if (result.success) toast.success('Admin suspended');
    else toast.error(result.error || 'Failed to suspend admin');
    return result;
  }, [callApi]);

  // ==================== ROLES & PERMISSIONS ====================
  const fetchRoles = useCallback(async () => {
    return callApi<{ roles: unknown[] }>('super-admin-operations/roles/list');
  }, [callApi]);

  const fetchPermissions = useCallback(async () => {
    return callApi<{ permissions: unknown[] }>('super-admin-operations/permissions/list');
  }, [callApi]);

  // ==================== GEOGRAPHY ====================
  const fetchContinents = useCallback(async () => {
    return callApi<{ continents: unknown[] }>('super-admin-operations/scope/continents');
  }, [callApi]);

  const fetchCountries = useCallback(async (continentId?: string) => {
    return callApi<{ countries: unknown[] }>('super-admin-operations/scope/countries', 'POST', 
      continentId ? { continent_id: continentId } : {}
    );
  }, [callApi]);

  const toggleRegion = useCallback(async (regionType: 'continent' | 'country', regionId: string, enabled: boolean) => {
    const result = await callApi('super-admin-operations/scope/toggle-region', 'POST', {
      region_type: regionType,
      region_id: regionId,
      enabled
    });
    if (result.success) toast.success(`Region ${enabled ? 'enabled' : 'disabled'}`);
    else toast.error(result.error || 'Failed to update region');
    return result;
  }, [callApi]);

  // ==================== MODULES ====================
  const fetchModules = useCallback(async () => {
    return callApi<{ modules: unknown[] }>('super-admin-operations/modules/list');
  }, [callApi]);

  const toggleModule = useCallback(async (moduleId: string, enabled: boolean) => {
    const result = await callApi('super-admin-operations/modules/toggle', 'POST', {
      module_id: moduleId,
      enabled
    });
    if (result.success) toast.success(`Module ${enabled ? 'enabled' : 'disabled'}`);
    else toast.error(result.error || 'Failed to update module');
    return result;
  }, [callApi]);

  // ==================== RENTALS ====================
  const fetchRentals = useCallback(async () => {
    return callApi<{ rentals: unknown[] }>('super-admin-operations/rentals/list');
  }, [callApi]);

  const assignRental = useCallback(async (data: {
    feature_id: string;
    plan_id: string;
    user_id: string;
    end_time: string;
  }) => {
    const result = await callApi('super-admin-operations/rentals/assign', 'POST', data);
    if (result.success) toast.success('Rental assigned');
    else toast.error(result.error || 'Failed to assign rental');
    return result;
  }, [callApi]);

  const revokeRental = useCallback(async (rentalId: string, reason: string) => {
    const result = await callApi('super-admin-operations/rentals/revoke', 'POST', {
      rental_id: rentalId,
      reason
    });
    if (result.success) toast.success('Rental revoked');
    else toast.error(result.error || 'Failed to revoke rental');
    return result;
  }, [callApi]);

  // ==================== RULES ====================
  const fetchRules = useCallback(async () => {
    return callApi<{ rules: unknown[] }>('super-admin-operations/rules/list');
  }, [callApi]);

  const createRule = useCallback(async (data: {
    rule_name: string;
    rule_type: string;
    rule_logic: unknown;
    scope_definition: unknown;
    priority: number;
  }) => {
    const result = await callApi('super-admin-operations/rules/create', 'POST', data);
    if (result.success) toast.success('Rule created');
    else toast.error(result.error || 'Failed to create rule');
    return result;
  }, [callApi]);

  const activateRule = useCallback(async (ruleId: string) => {
    const result = await callApi('super-admin-operations/rules/activate', 'POST', { rule_id: ruleId });
    if (result.success) toast.success('Rule activated');
    else toast.error(result.error || 'Failed to activate rule');
    return result;
  }, [callApi]);

  const deactivateRule = useCallback(async (ruleId: string) => {
    const result = await callApi('super-admin-operations/rules/deactivate', 'POST', { rule_id: ruleId });
    if (result.success) toast.success('Rule deactivated');
    else toast.error(result.error || 'Failed to deactivate rule');
    return result;
  }, [callApi]);

  // ==================== APPROVALS ====================
  const fetchPendingApprovals = useCallback(async () => {
    return callApi<{ approvals: unknown[] }>('super-admin-operations/approvals/pending');
  }, [callApi]);

  const approveRequest = useCallback(async (approvalId: string, reason: string) => {
    const result = await callApi('super-admin-operations/approvals/approve', 'POST', {
      approval_id: approvalId,
      reason
    });
    if (result.success) toast.success('Request approved');
    else toast.error(result.error || 'Failed to approve request');
    return result;
  }, [callApi]);

  const rejectRequest = useCallback(async (approvalId: string, reason: string) => {
    const result = await callApi('super-admin-operations/approvals/reject', 'POST', {
      approval_id: approvalId,
      reason
    });
    if (result.success) toast.success('Request rejected');
    else toast.error(result.error || 'Failed to reject request');
    return result;
  }, [callApi]);

  // ==================== SECURITY ====================
  const fetchSecurityEvents = useCallback(async (filters?: { severity?: string; type?: string }) => {
    return callApi<{ events: unknown[] }>('super-admin-security/events/list', 'POST', filters);
  }, [callApi]);

  const blockIP = useCallback(async (ipAddress: string, reason: string, expiresAt?: string) => {
    const result = await callApi('super-admin-security/block-ip', 'POST', {
      ip_address: ipAddress,
      reason,
      expires_at: expiresAt
    });
    if (result.success) toast.success('IP blocked');
    else toast.error(result.error || 'Failed to block IP');
    return result;
  }, [callApi]);

  const resolveSecurityEvent = useCallback(async (eventId: string, resolution: string) => {
    const result = await callApi('super-admin-security/resolve', 'POST', {
      event_id: eventId,
      resolution
    });
    if (result.success) toast.success('Event resolved');
    else toast.error(result.error || 'Failed to resolve event');
    return result;
  }, [callApi]);

  // ==================== LOCKS ====================
  const fetchLocks = useCallback(async () => {
    return callApi<{ locks: unknown[] }>('super-admin-locks/list');
  }, [callApi]);

  const applyLock = useCallback(async (data: {
    lock_type: 'user' | 'region' | 'module';
    target_id: string;
    reason: string;
  }) => {
    const result = await callApi('super-admin-locks/apply', 'POST', data);
    if (result.success) toast.success('Lock applied');
    else toast.error(result.error || 'Failed to apply lock');
    return result;
  }, [callApi]);

  const releaseLock = useCallback(async (lockId: string) => {
    const result = await callApi('super-admin-locks/release', 'POST', { lock_id: lockId });
    if (result.success) toast.success('Lock released');
    else toast.error(result.error || 'Failed to release lock');
    return result;
  }, [callApi]);

  // ==================== ACTIVITY LOG ====================
  const fetchActivityLog = useCallback(async (filters?: { module?: string; startDate?: string; endDate?: string }) => {
    return callApi<{ logs: unknown[] }>('super-admin-actions/history', 'POST', filters);
  }, [callApi]);

  // ==================== AUDIT ====================
  const fetchAuditLog = useCallback(async (filters?: { startDate?: string; endDate?: string }) => {
    return callApi<{ entries: unknown[] }>('super-admin-operations/audit/list', 'POST', filters);
  }, [callApi]);

  const exportAudit = useCallback(async (filters?: { startDate?: string; endDate?: string }) => {
    const result = await callApi<{ url: string }>('super-admin-operations/audit/export', 'POST', filters);
    if (result.success) toast.success('Audit export ready');
    else toast.error(result.error || 'Failed to export audit');
    return result;
  }, [callApi]);

  return {
    // Dashboard
    fetchDashboardStats,
    // Users
    fetchUsers,
    getUser,
    suspendUser,
    lockUser,
    unlockUser,
    // Admins
    fetchAdmins,
    createAdmin,
    updateAdminScope,
    suspendAdmin,
    // Roles & Permissions
    fetchRoles,
    fetchPermissions,
    // Geography
    fetchContinents,
    fetchCountries,
    toggleRegion,
    // Modules
    fetchModules,
    toggleModule,
    // Rentals
    fetchRentals,
    assignRental,
    revokeRental,
    // Rules
    fetchRules,
    createRule,
    activateRule,
    deactivateRule,
    // Approvals
    fetchPendingApprovals,
    approveRequest,
    rejectRequest,
    // Security
    fetchSecurityEvents,
    blockIP,
    resolveSecurityEvent,
    // Locks
    fetchLocks,
    applyLock,
    releaseLock,
    // Activity Log
    fetchActivityLog,
    // Audit
    fetchAuditLog,
    exportAudit
  };
}
