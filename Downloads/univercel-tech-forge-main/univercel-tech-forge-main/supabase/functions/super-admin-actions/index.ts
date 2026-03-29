import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================
// SUPER ADMIN ACTIONS API
// Log Every Click, View, Toggle, Action
// ============================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Validate Super Admin session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Authorization required' 
      }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid session' 
      }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get device info
    const deviceFingerprint = req.headers.get('x-device-fingerprint') || 'unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';

    // Get active session
    const { data: sessionData } = await supabase
      .from('super_admin_sessions')
      .select('id, assigned_scope')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('login_at', { ascending: false })
      .limit(1)
      .single();

    if (!sessionData) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No active session' 
      }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();
    const body = await req.json();

    console.log(`[SUPER-ADMIN-ACTIONS] User: ${user.id}, Action: ${action}`);

    switch (action) {
      case 'log': {
        // Log a single action
        const { 
          action_type, 
          action_category, 
          target_entity, 
          target_id, 
          action_data,
          is_sensitive,
          duration_ms 
        } = body;

        if (!action_type || !action_category) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'action_type and action_category required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { data: logData, error: logError } = await supabase
          .from('super_admin_actions')
          .insert({
            user_id: user.id,
            session_id: sessionData.id,
            action_type,
            action_category,
            target_entity,
            target_id,
            action_data: action_data || {},
            scope_context: sessionData.assigned_scope || {},
            ip_address: ipAddress,
            device_fingerprint: deviceFingerprint,
            is_sensitive: is_sensitive || false,
            duration_ms,
            result_status: 'success'
          })
          .select()
          .single();

        if (logError) {
          console.error('[SUPER-ADMIN-ACTIONS] Log error:', logError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to log action' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // If sensitive, also log to blackbox
        if (is_sensitive) {
          await supabase.from('blackbox_events').insert({
            event_type: action_type,
            module_name: action_category,
            user_id: user.id,
            entity_id: target_id,
            entity_type: target_entity,
            role_name: 'super_admin',
            ip_address: ipAddress,
            device_fingerprint: deviceFingerprint,
            is_sealed: true,
            metadata: action_data
          });
        }

        return new Response(JSON.stringify({
          success: true,
          data: { action_id: logData.id }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'batch': {
        // Log multiple actions at once
        const { actions } = body;

        if (!Array.isArray(actions) || actions.length === 0) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'actions array required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const logsToInsert = actions.map((a: any) => ({
          user_id: user.id,
          session_id: sessionData.id,
          action_type: a.action_type,
          action_category: a.action_category,
          target_entity: a.target_entity,
          target_id: a.target_id,
          action_data: a.action_data || {},
          scope_context: sessionData.assigned_scope || {},
          ip_address: ipAddress,
          device_fingerprint: deviceFingerprint,
          is_sensitive: a.is_sensitive || false,
          duration_ms: a.duration_ms,
          result_status: 'success'
        }));

        const { data: logData, error: logError } = await supabase
          .from('super_admin_actions')
          .insert(logsToInsert)
          .select('id');

        if (logError) {
          console.error('[SUPER-ADMIN-ACTIONS] Batch log error:', logError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to log actions' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        console.log(`[SUPER-ADMIN-ACTIONS] Batch logged ${logData?.length || 0} actions`);

        return new Response(JSON.stringify({
          success: true,
          data: { logged_count: logData?.length || 0 }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'history': {
        // Get action history
        const { 
          limit = 50, 
          offset = 0, 
          action_type, 
          action_category,
          start_date,
          end_date 
        } = body;

        let query = supabase
          .from('super_admin_actions')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (action_type) query = query.eq('action_type', action_type);
        if (action_category) query = query.eq('action_category', action_category);
        if (start_date) query = query.gte('created_at', start_date);
        if (end_date) query = query.lte('created_at', end_date);

        const { data, error, count } = await query;

        if (error) {
          console.error('[SUPER-ADMIN-ACTIONS] History error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch history' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Log this view action
        await supabase.from('super_admin_actions').insert({
          user_id: user.id,
          session_id: sessionData.id,
          action_type: 'view_history',
          action_category: 'audit',
          ip_address: ipAddress,
          device_fingerprint: deviceFingerprint,
          result_status: 'success',
          action_data: { filters: { action_type, action_category, start_date, end_date } }
        });

        return new Response(JSON.stringify({
          success: true,
          data: { actions: data, total: count }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'stats': {
        // Get action statistics
        const { period = '24h' } = body;

        let startDate: Date;
        const now = new Date();

        switch (period) {
          case '1h':
            startDate = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case '24h':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }

        const { data: statsData, error: statsError } = await supabase
          .from('super_admin_actions')
          .select('action_type, action_category, is_sensitive')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString());

        if (statsError) {
          console.error('[SUPER-ADMIN-ACTIONS] Stats error:', statsError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch stats' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Calculate stats
        const stats = {
          total_actions: statsData.length,
          sensitive_actions: statsData.filter(a => a.is_sensitive).length,
          by_category: {} as Record<string, number>,
          by_type: {} as Record<string, number>
        };

        statsData.forEach(action => {
          stats.by_category[action.action_category] = (stats.by_category[action.action_category] || 0) + 1;
          stats.by_type[action.action_type] = (stats.by_type[action.action_type] || 0) + 1;
        });

        return new Response(JSON.stringify({
          success: true,
          data: { stats, period }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      default:
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Unknown action' 
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SUPER-ADMIN-ACTIONS] Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
