/**
 * useDataScope - STEP 11: Data Scope Filtering
 * Ensures each role only sees data within their scope
 */

import { useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalAppStore, DataScope, DataScopeLevel } from '@/stores/globalAppStore';
import { supabase } from '@/integrations/supabase/client';

// Role to scope level mapping
const ROLE_SCOPE_MAP: Record<string, DataScopeLevel> = {
  'boss_owner': 'global',
  'ceo': 'global',
  'server_manager': 'global', // Infrastructure only
  'area_manager': 'continent',
  'country_head': 'country',
  'finance_manager': 'global', // All financial data
  'franchise': 'franchise_owned',
  'reseller': 'assigned',
  'support': 'ticket_lead',
  'developer': 'build_assigned',
  'lead_manager': 'global', // All leads
  'task_manager': 'global', // All tasks
};

// Fields to filter by scope
const SCOPE_FILTER_FIELDS: Record<DataScopeLevel, string[]> = {
  'global': [], // No filtering
  'continent': ['continent_id', 'region'],
  'country': ['country_id', 'country'],
  'franchise_owned': ['franchise_id', 'franchise_user_id'],
  'assigned': ['assigned_to', 'reseller_id'],
  'ticket_lead': ['assigned_support_id', 'ticket_owner'],
  'build_assigned': ['developer_id', 'assigned_developer'],
};

export interface ScopedQuery {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
}

export function useDataScope() {
  const { user } = useAuth();
  const { dataScope, setDataScope } = useGlobalAppStore();
  const userRole = (user as any)?.role as string | null;
  const userId = user?.id;

  // Get current scope level
  const scopeLevel = useMemo(() => {
    return ROLE_SCOPE_MAP[userRole || ''] || 'assigned';
  }, [userRole]);

  // Get scope-specific user identifiers
  const scopeIds = useMemo(() => {
    return {
      userId,
      franchiseId: (user as any)?.franchise_id,
      countryId: (user as any)?.country_id,
      continentId: (user as any)?.continent_id,
      assignedIds: (user as any)?.assigned_ids || [],
    };
  }, [user, userId]);

  // Build scoped Supabase query
  const buildScopedQuery = useCallback((
    query: ScopedQuery
  ) => {
    let supabaseQuery = supabase
      .from(query.table as any)
      .select(query.select || '*');

    // Apply user-provided filters first
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            supabaseQuery = (supabaseQuery as any).in(key, value);
          } else {
            supabaseQuery = (supabaseQuery as any).eq(key, value);
          }
        }
      });
    }

    // Apply scope filters (unless global)
    if (scopeLevel !== 'global') {
      const scopeFields = SCOPE_FILTER_FIELDS[scopeLevel];
      
      switch (scopeLevel) {
        case 'continent':
          if (scopeIds.continentId && scopeFields.length > 0) {
            supabaseQuery = supabaseQuery.or(
              scopeFields.map(f => `${f}.eq.${scopeIds.continentId}`).join(',')
            );
          }
          break;
          
        case 'country':
          if (scopeIds.countryId && scopeFields.length > 0) {
            supabaseQuery = supabaseQuery.or(
              scopeFields.map(f => `${f}.eq.${scopeIds.countryId}`).join(',')
            );
          }
          break;
          
        case 'franchise_owned':
          if (scopeFields.length > 0) {
            supabaseQuery = supabaseQuery.or(
              scopeFields.map(f => `${f}.eq.${userId}`).join(',')
            );
          }
          break;
          
        case 'assigned':
        case 'ticket_lead':
        case 'build_assigned':
          if (scopeFields.length > 0) {
            supabaseQuery = supabaseQuery.or(
              scopeFields.map(f => `${f}.eq.${userId}`).join(',')
            );
          }
          break;
      }
    }

    // Apply ordering
    if (query.orderBy) {
      supabaseQuery = supabaseQuery.order(
        query.orderBy.column, 
        { ascending: query.orderBy.ascending ?? false }
      );
    }

    // Apply pagination
    if (query.limit) {
      const offset = query.offset || 0;
      supabaseQuery = supabaseQuery.range(offset, offset + query.limit - 1);
    }

    return supabaseQuery;
  }, [scopeLevel, scopeIds, userId]);

  // Filter data array by scope (client-side fallback)
  const filterByScope = useCallback(<T extends Record<string, any>>(
    data: T[],
    scopeField?: string
  ): T[] => {
    if (scopeLevel === 'global') return data;
    if (!scopeField) return data;

    return data.filter(item => {
      switch (scopeLevel) {
        case 'continent':
          return item[scopeField] === scopeIds.continentId;
          
        case 'country':
          return item[scopeField] === scopeIds.countryId;
          
        case 'franchise_owned':
          return item[scopeField] === userId || 
                 item.franchise_user_id === userId;
          
        case 'assigned':
          return item[scopeField] === userId ||
                 item.assigned_to === userId ||
                 scopeIds.assignedIds.includes(item.id);
          
        case 'ticket_lead':
          return item.assigned_support_id === userId ||
                 item.ticket_owner === userId;
          
        case 'build_assigned':
          return item.developer_id === userId ||
                 item.assigned_developer === userId;
          
        default:
          return true;
      }
    });
  }, [scopeLevel, scopeIds, userId]);

  // Check if user can access specific entity
  const canAccessEntity = useCallback((
    entity: Record<string, any>,
    ownerField?: string
  ): boolean => {
    if (scopeLevel === 'global') return true;
    
    const ownerId = ownerField ? entity[ownerField] : entity.user_id;
    
    switch (scopeLevel) {
      case 'continent':
        return entity.continent_id === scopeIds.continentId ||
               entity.region === scopeIds.continentId;
               
      case 'country':
        return entity.country_id === scopeIds.countryId ||
               entity.country === scopeIds.countryId;
               
      case 'franchise_owned':
        return ownerId === userId ||
               entity.franchise_user_id === userId;
               
      case 'assigned':
        return ownerId === userId ||
               entity.assigned_to === userId ||
               entity.reseller_id === userId;
               
      case 'ticket_lead':
        return entity.assigned_support_id === userId ||
               entity.ticket_owner === userId ||
               ownerId === userId;
               
      case 'build_assigned':
        return entity.developer_id === userId ||
               entity.assigned_developer === userId ||
               ownerId === userId;
               
      default:
        return ownerId === userId;
    }
  }, [scopeLevel, scopeIds, userId]);

  // Get scope description for UI
  const scopeDescription = useMemo(() => {
    const descriptions: Record<DataScopeLevel, string> = {
      'global': 'All data',
      'continent': `Continent: ${scopeIds.continentId || 'N/A'}`,
      'country': `Country: ${scopeIds.countryId || 'N/A'}`,
      'franchise_owned': 'Your franchise only',
      'assigned': 'Assigned to you',
      'ticket_lead': 'Your tickets/leads',
      'build_assigned': 'Your assigned builds',
    };
    
    return descriptions[scopeLevel];
  }, [scopeLevel, scopeIds]);

  // Update scope (for continent/country admins switching views)
  const updateScope = useCallback((newScope: Partial<DataScope>) => {
    setDataScope({
      ...dataScope,
      ...newScope,
    });
  }, [dataScope, setDataScope]);

  return {
    scopeLevel,
    scopeIds,
    scopeDescription,
    buildScopedQuery,
    filterByScope,
    canAccessEntity,
    updateScope,
    dataScope,
  };
}

export default useDataScope;
