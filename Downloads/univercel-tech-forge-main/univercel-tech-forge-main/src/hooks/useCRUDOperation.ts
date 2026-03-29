/**
 * useCRUDOperation - STEP 11: CRUD Data Consistency
 * Optimistic UI updates with backend confirmation and rollback
 */

import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuditLog } from './useAuditLog';
import { useRolePermission } from './useRolePermission';
import { useGlobalAppStore } from '@/stores/globalAppStore';

export interface CRUDConfig {
  table: string;
  entityType: string;
  module: string;
  primaryKey?: string;
  softDeleteField?: string; // For disable instead of delete
}

export interface CRUDResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useCRUDOperation<T extends Record<string, any>>(config: CRUDConfig) {
  const { table, entityType, module, primaryKey = 'id', softDeleteField = 'is_active' } = config;
  
  const [isLoading, setIsLoading] = useState(false);
  const [localData, setLocalData] = useState<T[]>([]);
  
  const { logCreate, logUpdate, logDelete, logDisable } = useAuditLog();
  const { checkAndLog } = useRolePermission();
  const { invalidateKPICache, setLoading, setError, setSuccess } = useGlobalAppStore();

  // Create with optimistic update
  const create = useCallback(async (
    data: Partial<T>,
    optimisticId?: string
  ): Promise<CRUDResult<T>> => {
    // Permission check
    const permResult = await checkAndLog('create', entityType);
    if (!permResult.allowed) {
      toast.error('Permission denied');
      return { success: false, error: permResult.reason };
    }

    setIsLoading(true);
    setLoading(true, `Creating ${entityType}...`);

    // Optimistic update
    const tempId = optimisticId || `temp-${Date.now()}`;
    const optimisticItem = { ...data, [primaryKey]: tempId, _isOptimistic: true } as unknown as T;
    setLocalData(prev => [...prev, optimisticItem]);

    try {
      const { data: created, error } = await supabase
        .from(table as any)
        .insert(data as any)
        .select()
        .single();

      if (error) throw error;

      // Replace optimistic with real data
      setLocalData(prev => prev.map(item => 
        item[primaryKey] === tempId ? (created as unknown as T) : item
      ));

      // Log action
      await logCreate(entityType, (created as any)[primaryKey], module, created as any);

      // Invalidate related KPIs
      invalidateKPICache([`${table}_count`, `${module}_total`]);

      setSuccess(`${entityType} created successfully`);
      toast.success(`${entityType} created`);

      return { success: true, data: created as unknown as T };
    } catch (err: any) {
      // Rollback optimistic update
      setLocalData(prev => prev.filter(item => item[primaryKey] !== tempId));
      
      const errorMsg = err.message || 'Failed to create';
      setError(errorMsg);
      toast.error('Creation failed', { description: errorMsg });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [table, entityType, module, primaryKey, checkAndLog, logCreate, invalidateKPICache, setLoading, setError, setSuccess]);

  // Update with optimistic update
  const update = useCallback(async (
    id: string,
    updates: Partial<T>,
    previousState?: T
  ): Promise<CRUDResult<T>> => {
    // Permission check
    const ownerId = previousState?.user_id || previousState?.created_by;
    const permResult = await checkAndLog('update', entityType, id, ownerId);
    if (!permResult.allowed) {
      toast.error('Permission denied');
      return { success: false, error: permResult.reason };
    }

    setIsLoading(true);
    setLoading(true, `Updating ${entityType}...`);

    // Store original for rollback
    const original = localData.find(item => item[primaryKey] === id);
    
    // Optimistic update
    setLocalData(prev => prev.map(item =>
      item[primaryKey] === id ? { ...item, ...updates, _isOptimistic: true } : item
    ));

    try {
      const { data: updated, error } = await supabase
        .from(table as any)
        .update(updates as any)
        .eq(primaryKey, id)
        .select()
        .single();

      if (error) throw error;

      // Replace with confirmed data
      setLocalData(prev => prev.map(item =>
        item[primaryKey] === id ? { ...(updated as unknown as T), _isOptimistic: false } : item
      ));

      // Log action
      await logUpdate(entityType, id, module, previousState, updated as any);

      // Invalidate related KPIs
      invalidateKPICache([`${table}_count`, `${module}_total`]);

      setSuccess(`${entityType} updated`);
      toast.success(`${entityType} updated`);

      return { success: true, data: updated as unknown as T };
    } catch (err: any) {
      // Rollback
      if (original) {
        setLocalData(prev => prev.map(item =>
          item[primaryKey] === id ? original : item
        ));
      }

      const errorMsg = err.message || 'Failed to update';
      setError(errorMsg);
      toast.error('Update failed', { description: errorMsg });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [table, entityType, module, primaryKey, localData, checkAndLog, logUpdate, invalidateKPICache, setLoading, setError, setSuccess]);

  // Disable (soft delete) with optimistic update
  const disable = useCallback(async (
    id: string,
    reason?: string,
    previousState?: T
  ): Promise<CRUDResult<T>> => {
    // Permission check
    const ownerId = previousState?.user_id || previousState?.created_by;
    const permResult = await checkAndLog('disable', entityType, id, ownerId);
    if (!permResult.allowed) {
      toast.error('Permission denied');
      return { success: false, error: permResult.reason };
    }

    setIsLoading(true);
    setLoading(true, `Disabling ${entityType}...`);

    // Store original for rollback
    const original = localData.find(item => item[primaryKey] === id);

    // Optimistic update
    setLocalData(prev => prev.map(item =>
      item[primaryKey] === id ? { ...item, [softDeleteField]: false, _isOptimistic: true } : item
    ));

    try {
      const { data: updated, error } = await supabase
        .from(table as any)
        .update({ 
          [softDeleteField]: false,
          disabled_at: new Date().toISOString(),
          disabled_reason: reason,
        } as any)
        .eq(primaryKey, id)
        .select()
        .single();

      if (error) throw error;

      // Replace with confirmed data
      setLocalData(prev => prev.map(item =>
        item[primaryKey] === id ? { ...(updated as unknown as T), _isOptimistic: false } : item
      ));

      // Log action
      await logDisable(entityType, id, module, reason);

      // Invalidate related KPIs
      invalidateKPICache([`${table}_count`, `${table}_active`, `${module}_total`]);

      setSuccess(`${entityType} disabled`);
      toast.success(`${entityType} disabled`, { description: reason });

      return { success: true, data: updated as unknown as T };
    } catch (err: any) {
      // Rollback
      if (original) {
        setLocalData(prev => prev.map(item =>
          item[primaryKey] === id ? original : item
        ));
      }

      const errorMsg = err.message || 'Failed to disable';
      setError(errorMsg);
      toast.error('Disable failed', { description: errorMsg });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [table, entityType, module, primaryKey, softDeleteField, localData, checkAndLog, logDisable, invalidateKPICache, setLoading, setError, setSuccess]);

  // Enable (restore from soft delete)
  const enable = useCallback(async (
    id: string
  ): Promise<CRUDResult<T>> => {
    const permResult = await checkAndLog('update', entityType, id);
    if (!permResult.allowed) {
      toast.error('Permission denied');
      return { success: false, error: permResult.reason };
    }

    setIsLoading(true);
    setLoading(true, `Enabling ${entityType}...`);

    try {
      const { data: updated, error } = await supabase
        .from(table as any)
        .update({ 
          [softDeleteField]: true,
          disabled_at: null,
          disabled_reason: null,
        } as any)
        .eq(primaryKey, id)
        .select()
        .single();

      if (error) throw error;

      setLocalData(prev => prev.map(item =>
        item[primaryKey] === id ? (updated as unknown as T) : item
      ));

      // Log action
      await logUpdate(entityType, id, module, { [softDeleteField]: false }, { [softDeleteField]: true });

      // Invalidate related KPIs
      invalidateKPICache([`${table}_count`, `${table}_active`, `${module}_total`]);

      setSuccess(`${entityType} enabled`);
      toast.success(`${entityType} enabled`);

      return { success: true, data: updated as unknown as T };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to enable';
      setError(errorMsg);
      toast.error('Enable failed', { description: errorMsg });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [table, entityType, module, primaryKey, softDeleteField, checkAndLog, logUpdate, invalidateKPICache, setLoading, setError, setSuccess]);

  // Hard delete (use sparingly - prefer disable)
  const hardDelete = useCallback(async (
    id: string,
    previousState?: T
  ): Promise<CRUDResult<void>> => {
    // Permission check - requires delete_any permission
    const ownerId = previousState?.user_id || previousState?.created_by;
    const permResult = await checkAndLog('delete', entityType, id, ownerId);
    if (!permResult.allowed) {
      toast.error('Permission denied');
      return { success: false, error: permResult.reason };
    }

    setIsLoading(true);
    setLoading(true, `Deleting ${entityType}...`);

    // Store original for rollback reference
    const original = localData.find(item => item[primaryKey] === id);

    // Optimistic removal
    setLocalData(prev => prev.filter(item => item[primaryKey] !== id));

    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq(primaryKey, id);

      if (error) throw error;

      // Log action
      await logDelete(entityType, id, module, previousState || original);

      // Invalidate related KPIs
      invalidateKPICache([`${table}_count`, `${table}_active`, `${module}_total`]);

      setSuccess(`${entityType} deleted`);
      toast.success(`${entityType} deleted permanently`);

      return { success: true };
    } catch (err: any) {
      // Rollback
      if (original) {
        setLocalData(prev => [...prev, original]);
      }

      const errorMsg = err.message || 'Failed to delete';
      setError(errorMsg);
      toast.error('Delete failed', { description: errorMsg });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [table, entityType, module, primaryKey, localData, checkAndLog, logDelete, invalidateKPICache, setLoading, setError, setSuccess]);

  // Sync local data with fetched data
  const syncData = useCallback((data: T[]) => {
    setLocalData(data);
  }, []);

  return {
    isLoading,
    localData,
    create,
    update,
    disable,
    enable,
    hardDelete,
    syncData,
  };
}

export default useCRUDOperation;
