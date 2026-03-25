// @ts-ignore Deno runtime import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModuleAction {
  action: 'enable_module' | 'disable_module' | 'set_maintenance' | 'get_activity' | 'get_health_metrics';
  data: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check role - Boss Panel access
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const userRoles = roles?.map(r => r.role) || [];
    const isAuthorized = userRoles.includes('boss_owner') || userRoles.includes('super_admin') || userRoles.includes('master');

    if (!isAuthorized) {
      // Log unauthorized access attempt
      await supabase.from('audit_logs').insert({
        action: 'unauthorized_module_access',
        action_type: 'security',
        performed_by: user.id,
        performed_by_role: userRoles[0] || 'unknown',
        details: { module: 'system_modules_manager' }
      });

      return new Response(JSON.stringify({ error: 'Forbidden - Boss Panel access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body: ModuleAction = await req.json();
    const { action, data } = body;

    console.log(`[System Modules Manager] ${action}`, data);

    let response: any = { success: false, message: 'Unknown action' };
    let status = 400;

    // ==================== ENABLE MODULE ====================
    if (action === 'enable_module') {
      const { module_id, module_name } = data;

      // Update module status in database
      const { data: updatedModule, error: updateError } = await supabase
        .from('system_modules')
        .update({
          status: 'active',
          health_score: 100,
          last_updated: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('id', module_id)
        .select('*')
        .single();

      if (updateError) {
        response = { success: false, message: `Failed to enable module: ${updateError.message}` };
        status = 500;
      } else {
        // Log the action
        await supabase.from('system_audit_logs').insert({
          action: 'module_enabled',
          action_type: 'module_management',
          performed_by: user.id,
          performed_by_role: userRoles[0],
          target_type: 'system_module',
          target_id: module_id,
          details: { module_name, new_status: 'active' }
        });

        response = {
          success: true,
          message: `${module_name} module enabled successfully`,
          data: {
            id: updatedModule.id,
            status: updatedModule.status,
            health: updatedModule.health_score,
            lastUpdated: updatedModule.last_updated
          }
        };
        status = 200;
      }
    }

    // ==================== DISABLE MODULE ====================
    else if (action === 'disable_module') {
      const { module_id, module_name } = data;

      const { data: updatedModule, error: updateError } = await supabase
        .from('system_modules')
        .update({
          status: 'disabled',
          health_score: 0,
          last_updated: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('id', module_id)
        .select('*')
        .single();

      if (updateError) {
        response = { success: false, message: `Failed to disable module: ${updateError.message}` };
        status = 500;
      } else {
        // Log the action
        await supabase.from('system_audit_logs').insert({
          action: 'module_disabled',
          action_type: 'module_management',
          performed_by: user.id,
          performed_by_role: userRoles[0],
          target_type: 'system_module',
          target_id: module_id,
          details: { module_name, new_status: 'disabled' }
        });

        response = {
          success: true,
          message: `${module_name} module disabled successfully`,
          data: {
            id: updatedModule.id,
            status: updatedModule.status,
            health: updatedModule.health_score,
            lastUpdated: updatedModule.last_updated
          }
        };
        status = 200;
      }
    }

    // ==================== SET MAINTENANCE ====================
    else if (action === 'set_maintenance') {
      const { module_id, module_name, reason } = data;

      const { data: updatedModule, error: updateError } = await supabase
        .from('system_modules')
        .update({
          status: 'maintenance',
          health_score: 50,
          last_updated: new Date().toISOString(),
          updated_by: user.id,
          maintenance_reason: reason
        })
        .eq('id', module_id)
        .select('*')
        .single();

      if (updateError) {
        response = { success: false, message: `Failed to set maintenance: ${updateError.message}` };
        status = 500;
      } else {
        // Log the action
        await supabase.from('system_audit_logs').insert({
          action: 'module_maintenance_set',
          action_type: 'module_management',
          performed_by: user.id,
          performed_by_role: userRoles[0],
          target_type: 'system_module',
          target_id: module_id,
          details: { module_name, reason, new_status: 'maintenance' }
        });

        response = {
          success: true,
          message: `${module_name} set to maintenance mode`,
          data: {
            id: updatedModule.id,
            status: updatedModule.status,
            health: updatedModule.health_score,
            lastUpdated: updatedModule.last_updated,
            maintenance_reason: updatedModule.maintenance_reason
          }
        };
        status = 200;
      }
    }

    // ==================== GET ACTIVITY ====================
    else if (action === 'get_activity') {
      const { module_id, limit = 50 } = data;

      const { data: activities, error: activityError } = await supabase
        .from('system_audit_logs')
        .select(`
          *,
          performed_by_user:auth.users!system_audit_logs_performed_by_fkey(email, raw_user_meta_data)
        `)
        .eq('target_type', 'system_module')
        .eq('target_id', module_id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (activityError) {
        response = { success: false, message: `Failed to get activity: ${activityError.message}` };
        status = 500;
      } else {
        response = {
          success: true,
          data: activities || []
        };
        status = 200;
      }
    }

    // ==================== GET HEALTH METRICS ====================
    else if (action === 'get_health_metrics') {
      const { module_id } = data;

      // Get current module status
      const { data: module, error: moduleError } = await supabase
        .from('system_modules')
        .select('*')
        .eq('id', module_id)
        .single();

      if (moduleError) {
        response = { success: false, message: `Module not found: ${moduleError.message}` };
        status = 404;
      } else {
        // Get recent health history
        const { data: healthHistory } = await supabase
          .from('system_health_metrics')
          .select('*')
          .eq('module_id', module_id)
          .order('recorded_at', { ascending: false })
          .limit(24); // Last 24 hours

        // Calculate metrics
        const uptime = module.status === 'active' ? 100 : module.status === 'maintenance' ? 50 : 0;
        const responseTime = healthHistory?.length ?
          healthHistory.reduce((acc, h) => acc + (h.response_time_ms || 0), 0) / healthHistory.length : 0;
        const errorRate = healthHistory?.length ?
          (healthHistory.filter(h => h.has_errors).length / healthHistory.length) * 100 : 0;

        response = {
          success: true,
          data: {
            module_id,
            status: module.status,
            health_score: module.health_score,
            uptime_percentage: uptime,
            avg_response_time_ms: Math.round(responseTime),
            error_rate_percentage: Math.round(errorRate * 100) / 100,
            last_health_check: module.last_updated,
            health_history: healthHistory || []
          }
        };
        status = 200;
      }
    }

    return new Response(JSON.stringify(response), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('System Modules Manager error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});