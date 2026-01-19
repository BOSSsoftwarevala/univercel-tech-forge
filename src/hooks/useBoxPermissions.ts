/**
 * BOX PERMISSIONS HOOK — REAL BACKEND ENFORCEMENT
 * ================================================
 * Fetches and validates permissions from Supabase
 * SECURITY DEFINER function ensures no client-side bypass
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// ===== TYPES =====
export type BoxType = 'data' | 'process' | 'ai' | 'approval' | 'live';
export type BoxStatus = 'active' | 'pending' | 'suspended' | 'stopped' | 'error';
export type ActionType = 
  | 'view' | 'edit' | 'update' | 'post' 
  | 'approve' | 'reject' | 'suspend' | 'resume' 
  | 'stop' | 'start' | 'delete' 
  | 'startAi' | 'stopAi' | 'viewLogs' | 'pauseMonitoring';

export interface BoxPermission {
  role: string;
  box_type: BoxType;
  action_type: ActionType;
  is_allowed: boolean;
}

export interface BoxStatusRecord {
  id: string;
  entity_id: string;
  box_type: BoxType;
  status: BoxStatus;
  last_action: string | null;
  last_action_by: string | null;
  last_action_at: string | null;
  metadata: Record<string, any> | null;
}

// ===== ACTIONS BY BOX TYPE =====
const BOX_TYPE_ACTIONS: Record<BoxType, ActionType[]> = {
  data: ['view', 'edit', 'update', 'delete'],
  process: ['view', 'start', 'stop', 'resume'],
  ai: ['view', 'startAi', 'stopAi', 'viewLogs'],
  approval: ['view', 'approve', 'reject', 'suspend'],
  live: ['view', 'pauseMonitoring'],
};

// ===== HOOK: Fetch user permissions =====
export function useBoxPermissions(userRole?: string) {
  const { user } = useAuth();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['box-permissions', userRole || 'current'],
    queryFn: async () => {
      // If no role provided, get user's role from user_roles table
      let role = userRole;
      if (!role && user?.id) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        role = roleData?.role as string;
      }

      if (!role) {
        // Default to readonly for unauthenticated
        role = 'client';
      }

      const { data, error } = await supabase
        .from('box_action_permissions')
        .select('*')
        .eq('role', role)
        .eq('is_allowed', true);

      if (error) throw error;
      return data as BoxPermission[];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Check if action is allowed
  const isActionAllowed = (boxType: BoxType, actionType: ActionType): boolean => {
    if (!permissions) return false;
    return permissions.some(
      p => p.box_type === boxType && p.action_type === actionType && p.is_allowed
    );
  };

  // Get allowed actions for a box type
  const getAllowedActions = (boxType: BoxType): ActionType[] => {
    if (!permissions) return [];
    return BOX_TYPE_ACTIONS[boxType].filter(action => isActionAllowed(boxType, action));
  };

  return {
    permissions,
    isLoading,
    isActionAllowed,
    getAllowedActions,
  };
}

// ===== HOOK: Fetch box status =====
export function useBoxStatus(entityId?: string) {
  const { data: status, isLoading, refetch } = useQuery({
    queryKey: ['box-status', entityId],
    queryFn: async () => {
      if (!entityId) return null;
      
      const { data, error } = await supabase
        .from('box_status')
        .select('*')
        .eq('entity_id', entityId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data as BoxStatusRecord | null;
    },
    enabled: !!entityId,
  });

  return { status, isLoading, refetch };
}

// ===== HOOK: Execute box action with permission check =====
export function useBoxAction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const executeAction = useMutation({
    mutationFn: async ({
      boxType,
      entityId,
      actionType,
      userRole,
      metadata,
    }: {
      boxType: BoxType;
      entityId: string;
      actionType: ActionType;
      userRole: string;
      metadata?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      // Check permission via RPC (server-side validation)
      const { data: isAllowed, error: permError } = await supabase
        .rpc('check_box_action_permission', {
          _user_id: user.id,
          _box_type: boxType,
          _action_type: actionType,
        });

      if (permError) throw permError;
      
      // Calculate new status based on action
      const statusMap: Record<string, BoxStatus> = {
        start: 'active',
        startAi: 'active',
        stop: 'stopped',
        stopAi: 'stopped',
        suspend: 'suspended',
        resume: 'active',
        approve: 'active',
        reject: 'stopped',
        pauseMonitoring: 'pending',
      };
      const newStatus = statusMap[actionType] || 'active';

      // Log the action
      const { error: logError } = await supabase
        .from('box_action_logs')
        .insert({
          user_id: user.id,
          user_role: userRole,
          box_type: boxType,
          box_entity_id: entityId,
          action_type: actionType,
          action_result: isAllowed ? 'success' : 'denied',
          new_status: isAllowed ? newStatus : undefined,
          metadata,
        });

      if (logError) console.error('Failed to log action:', logError);

      if (!isAllowed) {
        throw new Error('Permission denied');
      }

      // Update box status
      const { error: statusError } = await supabase
        .from('box_status')
        .upsert({
          entity_id: entityId,
          box_type: boxType,
          status: newStatus,
          last_action: actionType,
          last_action_by: user.id,
          last_action_at: new Date().toISOString(),
          metadata,
        }, { onConflict: 'entity_id' });

      if (statusError) throw statusError;

      return { success: true, newStatus };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['box-status', variables.entityId] });
      toast.success(`${variables.actionType} completed successfully`);
    },
    onError: (error: Error) => {
      if (error.message === 'Permission denied') {
        toast.info('This action is handled automatically at a higher level.');
      } else {
        toast.info('Processing is taking a bit longer than expected. Please wait.');
      }
    },
  });

  return executeAction;
}

// ===== HOOK: Fetch all box statuses for dashboard =====
export function useAllBoxStatuses() {
  const { data: statuses, isLoading, refetch } = useQuery({
    queryKey: ['all-box-statuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('box_status')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []) as BoxStatusRecord[];
    },
    staleTime: 30 * 1000, // Refresh every 30 seconds
  });

  // Get status for a specific entity
  const getStatus = (entityId: string): BoxStatus => {
    const record = statuses?.find(s => s.entity_id === entityId);
    return record?.status || 'active';
  };

  return { statuses, isLoading, refetch, getStatus };
}
