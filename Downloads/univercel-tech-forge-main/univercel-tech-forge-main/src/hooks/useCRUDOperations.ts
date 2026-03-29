import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGlobalActions, EntityType } from './useGlobalActions';
import { toast } from 'sonner';

/**
 * Universal CRUD Operations Hook
 * Provides standardized CRUD for any entity with full audit trail
 */

interface CRUDOptions {
  table: string;
  entityType: EntityType;
  primaryKey?: string;
  softDeleteField?: string;
}

interface QueryOptions {
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
}

export function useCRUDOperations({ table, entityType, primaryKey = 'id', softDeleteField = 'status' }: CRUDOptions) {
  const { logToAudit } = useGlobalActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CREATE
  const create = useCallback(async (data: Record<string, any>) => {
    setLoading(true);
    setError(null);
    const toastId = `create_${entityType}_${Date.now()}`;
    
    try {
      toast.loading(`Creating ${entityType}...`, { id: toastId });
      
      // Use type assertion to bypass strict table typing for generic CRUD
      const { data: result, error: dbError } = await (supabase
        .from(table as any)
        .insert(data)
        .select()
        .single() as any);

      if (dbError) throw dbError;

      await logToAudit('create_success', entityType, {
        recordId: result?.[primaryKey],
        data: Object.keys(data),
      });

      toast.success(`${entityType} created successfully`, { id: toastId });
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Create failed';
      setError(message);
      toast.error(message, { id: toastId });
      await logToAudit('create_error', entityType, { error: message });
      setLoading(false);
      return { success: false, error: message };
    }
  }, [table, entityType, primaryKey, logToAudit]);

  // READ (single)
  const read = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: result, error: dbError } = await (supabase
        .from(table as any)
        .select('*')
        .eq(primaryKey, id)
        .single() as any);

      if (dbError) throw dbError;

      await logToAudit('read', entityType, { recordId: id });
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Read failed';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, [table, entityType, primaryKey, logToAudit]);

  // READ (list with filters)
  const list = useCallback(async (options?: QueryOptions) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from(table as any).select('*') as any;

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? false 
        });
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data: result, error: dbError } = await query;

      if (dbError) throw dbError;

      await logToAudit('list', entityType, { 
        count: result?.length || 0,
        filters: options?.filters 
      });
      
      setLoading(false);
      return { success: true, data: result || [] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'List failed';
      setError(message);
      setLoading(false);
      return { success: false, error: message, data: [] };
    }
  }, [table, entityType, logToAudit]);

  // UPDATE
  const update = useCallback(async (id: string, data: Record<string, any>) => {
    setLoading(true);
    setError(null);
    const toastId = `update_${entityType}_${id}`;
    
    try {
      toast.loading(`Updating ${entityType}...`, { id: toastId });

      // Get current state for audit
      const { data: oldData } = await (supabase
        .from(table as any)
        .select('*')
        .eq(primaryKey, id)
        .single() as any);

      const { data: result, error: dbError } = await (supabase
        .from(table as any)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq(primaryKey, id)
        .select()
        .single() as any);

      if (dbError) throw dbError;

      await logToAudit('update_success', entityType, {
        recordId: id,
        changes: Object.keys(data),
        oldValues: oldData,
        newValues: result,
      });

      toast.success(`${entityType} updated`, { id: toastId });
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setError(message);
      toast.error(message, { id: toastId });
      await logToAudit('update_error', entityType, { recordId: id, error: message });
      setLoading(false);
      return { success: false, error: message };
    }
  }, [table, entityType, primaryKey, logToAudit]);

  // DELETE (soft by default)
  const remove = useCallback(async (id: string, hard: boolean = false) => {
    setLoading(true);
    setError(null);
    const toastId = `delete_${entityType}_${id}`;
    
    try {
      toast.loading(`${hard ? 'Deleting' : 'Archiving'} ${entityType}...`, { id: toastId });

      if (hard) {
        // Hard delete
        const { error: dbError } = await (supabase
          .from(table as any)
          .delete()
          .eq(primaryKey, id) as any);

        if (dbError) throw dbError;
      } else {
        // Soft delete - update status field only
        const { error: dbError } = await (supabase
          .from(table as any)
          .update({ [softDeleteField]: 'archived' })
          .eq(primaryKey, id) as any);

        if (dbError) throw dbError;
      }

      await logToAudit(hard ? 'hard_delete' : 'soft_delete', entityType, { recordId: id });

      toast.success(`${entityType} ${hard ? 'deleted' : 'archived'}`, { id: toastId });
      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      toast.error(message, { id: toastId });
      await logToAudit('delete_error', entityType, { recordId: id, error: message });
      setLoading(false);
      return { success: false, error: message };
    }
  }, [table, entityType, primaryKey, softDeleteField, logToAudit]);

  return {
    create,
    read,
    list,
    update,
    remove,
    loading,
    error,
  };
}
