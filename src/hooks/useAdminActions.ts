import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminDetails {
  id: string;
  name: string;
  region: string;
  status: 'active' | 'inactive' | 'suspended';
  riskScore: number;
  scope: string[];
}

/**
 * Real Backend Hook for Super Admin Operations
 * Connects to: supabase.functions.invoke('admin-operations')
 * All actions are logged in audit trail with 2FA verification
 */
export const useAdminActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAdminOps = async (action: string, data: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        'admin-operations',
        { body: { action, data } }
      );

      if (fnError) {
        console.error('Admin operations error:', fnError);
        setError(fnError.message);
        throw new Error(fnError.message);
      }

      if (!result?.success) {
        throw new Error(result?.message || 'Admin action failed');
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Admin operations exception:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * View detailed admin profile
   * Returns: full admin info, activity history, scope details
   */
  const viewAdminDetails = async (adminId: string): Promise<AdminDetails | null> => {
    try {
      const result = await callAdminOps('view_admin_details', { 
        admin_id: adminId
      });
      
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      toast.error('Failed to load admin details');
      return null;
    }
  };

  /**
   * Suspend an active admin
   * Requires 2FA verification
   * Logs: admin_suspended, severity: critical
   * Scope: revokes all access immediately
   */
  const suspendAdmin = async (
    adminId: string,
    adminName: string,
    reason: string
  ): Promise<boolean> => {
    try {
      const result = await callAdminOps('suspend_admin', { 
        admin_id: adminId,
        admin_name: adminName,
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
        requires_2fa: true // System enforces 2FA verification
      });
      
      if (result.success) {
        toast.success(`${adminName} has been suspended`);
        return true;
      }
      return false;
    } catch (err) {
      toast.error(`Failed to suspend ${adminName}`);
      return false;
    }
  };

  /**
   * Reactivate a suspended admin
   * Requires explicit approval
   * Logs: admin_reactivated, severity: critical
   */
  const reactivateAdmin = async (adminId: string, adminName: string): Promise<boolean> => {
    try {
      const result = await callAdminOps('reactivate_admin', { 
        admin_id: adminId,
        admin_name: adminName,
        reactivated_at: new Date().toISOString()
      });
      
      if (result.success) {
        toast.success(`${adminName} has been reactivated`);
        return true;
      }
      return false;
    } catch (err) {
      toast.error(`Failed to reactivate ${adminName}`);
      return false;
    }
  };

  /**
   * Update admin scope (regions they can manage)
   * Logs: admin_scope_changed, severity: warning
   */
  const updateAdminScope = async (
    adminId: string,
    newScope: string[],
    reason: string
  ): Promise<boolean> => {
    try {
      const result = await callAdminOps('update_admin_scope', { 
        admin_id: adminId,
        new_scope: newScope,
        reason,
        updated_at: new Date().toISOString()
      });
      
      if (result.success) {
        toast.success('Admin scope has been updated');
        return true;
      }
      return false;
    } catch (err) {
      toast.error('Failed to update admin scope');
      return false;
    }
  };

  /**
   * Retrieve admin activity history
   * Returns: all actions performed by this admin, timestamps, details
   */
  const getAdminActivityHistory = async (
    adminId: string,
    limit: number = 100
  ): Promise<any | null> => {
    try {
      return await callAdminOps('get_activity_history', { 
        admin_id: adminId,
        limit
      });
    } catch (err) {
      console.error('Failed to load activity history');
      return null;
    }
  };

  /**
   * Revoke admin permissions
   * Immediate effect - all API keys invalidated
   * Logs: admin_permissions_revoked, severity: critical
   */
  const revokePermissions = async (
    adminId: string,
    adminName: string,
    reason: string
  ): Promise<boolean> => {
    try {
      const result = await callAdminOps('revoke_permissions', { 
        admin_id: adminId,
        admin_name: adminName,
        reason,
        revoked_at: new Date().toISOString()
      });
      
      if (result.success) {
        toast.success(`All permissions revoked for ${adminName}`);
        return true;
      }
      return false;
    } catch (err) {
      toast.error('Failed to revoke permissions');
      return false;
    }
  };

  /**
   * Grant new permissions to admin
   * Logs: admin_permissions_granted, severity: warning
   */
  const grantPermissions = async (
    adminId: string,
    permissions: string[],
    reason: string
  ): Promise<boolean> => {
    try {
      const result = await callAdminOps('grant_permissions', { 
        admin_id: adminId,
        permissions,
        reason,
        granted_at: new Date().toISOString()
      });
      
      if (result.success) {
        toast.success('Permissions have been granted');
        return true;
      }
      return false;
    } catch (err) {
      toast.error('Failed to grant permissions');
      return false;
    }
  };

  return {
    isLoading,
    error,
    viewAdminDetails,
    suspendAdmin,
    reactivateAdmin,
    updateAdminScope,
    getAdminActivityHistory,
    revokePermissions,
    grantPermissions
  };
};
