import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ModuleAction {
  action: 'enable' | 'disable' | 'maintenance';
  moduleId: string;
  moduleName: string;
}

interface ModuleStatus {
  id: string;
  status: 'active' | 'maintenance' | 'disabled';
  health: number;
  lastUpdated: string;
}

/**
 * Real Backend Hook for System Module Management
 * Connects to: supabase.functions.invoke('system-modules-manager')
 */
export const useSystemModules = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callModuleManager = async (action: string, data: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        'system-modules-manager',
        { body: { action, data } }
      );

      if (fnError) {
        console.error('Module manager error:', fnError);
        setError(fnError.message);
        throw new Error(fnError.message);
      }

      if (!result?.success) {
        throw new Error(result?.message || 'Module action failed');
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Module manager exception:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Enable a system module
   * Logs: module_status_changed, severity: info
   */
  const enableModule = async (moduleId: string, moduleName: string): Promise<ModuleStatus | null> => {
    try {
      const result = await callModuleManager('enable_module', { 
        module_id: moduleId,
        module_name: moduleName
      });
      
      if (result.success) {
        toast.success(`${moduleName} module has been enabled`);
        return result.data;
      }
      return null;
    } catch (err) {
      toast.error(`Failed to enable ${moduleName}`);
      return null;
    }
  };

  /**
   * Disable a system module
   * Logs: module_status_changed, severity: warning
   */
  const disableModule = async (moduleId: string, moduleName: string): Promise<ModuleStatus | null> => {
    try {
      const result = await callModuleManager('disable_module', { 
        module_id: moduleId,
        module_name: moduleName
      });
      
      if (result.success) {
        toast.success(`${moduleName} module has been disabled`);
        return result.data;
      }
      return null;
    } catch (err) {
      toast.error(`Failed to disable ${moduleName}`);
      return null;
    }
  };

  /**
   * Put module into maintenance mode
   * Blocks user access, alerts system
   * Logs: module_maintenance_start, severity: warning
   */
  const setMaintenance = async (moduleId: string, moduleName: string, reason?: string): Promise<ModuleStatus | null> => {
    try {
      const result = await callModuleManager('set_maintenance', { 
        module_id: moduleId,
        module_name: moduleName,
        reason: reason || 'Admin maintenance'
      });
      
      if (result.success) {
        toast.success(`${moduleName} is now in maintenance mode`);
        return result.data;
      }
      return null;
    } catch (err) {
      toast.error(`Failed to set maintenance for ${moduleName}`);
      return null;
    }
  };

  /**
   * Get activity logs for a specific module
   * Returns: recent activities, errors, performance metrics
   */
  const getActivity = async (moduleId: string): Promise<any | null> => {
    try {
      return await callModuleManager('get_activity', { 
        module_id: moduleId,
        limit: 50
      });
    } catch (err) {
      toast.error('Failed to load module activity');
      return null;
    }
  };

  /**
   * Get module health metrics
   * Returns: health %, uptime, response time, error rate
   */
  const getHealthMetrics = async (moduleId: string): Promise<any | null> => {
    try {
      return await callModuleManager('get_health_metrics', { 
        module_id: moduleId
      });
    } catch (err) {
      console.error('Failed to get health metrics');
      return null;
    }
  };

  return {
    isLoading,
    error,
    enableModule,
    disableModule,
    setMaintenance,
    getActivity,
    getHealthMetrics
  };
};
