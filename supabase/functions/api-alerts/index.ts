import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getUser(supabase: any, req: Request) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

async function getUserRoles(supabase: any, userId: string) {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  return data?.map((r: any) => r.role) || [];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.replace('/api-alerts', '');

    console.log(`[ALERTS API] ${req.method} ${path}`);

    const user = await getUser(supabase, req);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED"
      }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userRoles = await getUserRoles(supabase, user.id);

    // POST /create - Create new alert/buzzer
    if (path === '/create' && req.method === 'POST') {
      const { 
        trigger_type, priority, role_target,
        task_id, lead_id, region, auto_escalate_after
      } = await req.json();

      if (!trigger_type || !role_target) {
        return new Response(JSON.stringify({
          success: false,
          message: "Trigger type and target role are required",
          code: "MISSING_FIELDS"
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const { data: alert, error } = await supabase
        .from('buzzer_queue')
        .insert({
          trigger_type,
          priority: priority || 'medium',
          role_target,
          task_id,
          lead_id,
          region,
          auto_escalate_after: auto_escalate_after || 300, // 5 minutes default
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Alert creation error:', error);
        return new Response(JSON.stringify({
          success: false,
          message: "Unable to create alert",
          code: "CREATE_ERROR"
        }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      return new Response(JSON.stringify({
        success: true,
        message: "Alert created and dispatched",
        data: {
          id: alert.id,
          trigger_type: alert.trigger_type,
          target_role: role_target
        }
      }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // GET /live - Get live alerts for user's roles
    if (path === '/live' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      const { data: alerts, count } = await supabase
        .from('buzzer_queue')
        .select('*', { count: 'exact' })
        .in('role_target', userRoles)
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      return new Response(JSON.stringify({
        success: true,
        message: "Live alerts retrieved",
        data: {
          alerts: alerts || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            total_pages: Math.ceil((count || 0) / limit)
          }
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // PATCH /:id/accept - Accept alert
    if (path.match(/^\/[^/]+\/accept$/) && req.method === 'PATCH') {
      const alertId = path.split('/')[1];

      // Check if alert exists and is for user's role
      const { data: alert } = await supabase
        .from('buzzer_queue')
        .select('*')
        .eq('id', alertId)
        .single();

      if (!alert) {
        return new Response(JSON.stringify({
          success: false,
          message: "Alert not found",
          code: "NOT_FOUND"
        }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (!userRoles.includes(alert.role_target) && !userRoles.includes('super_admin')) {
        return new Response(JSON.stringify({
          success: false,
          message: "This alert is not assigned to your role",
          code: "PERMISSION_DENIED"
        }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (alert.status !== 'pending') {
        return new Response(JSON.stringify({
          success: false,
          message: "Alert has already been handled",
          code: "ALREADY_HANDLED"
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Accept the alert
      await supabase
        .from('buzzer_queue')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          accepted_by: user.id
        })
        .eq('id', alertId);

      return new Response(JSON.stringify({
        success: true,
        message: "Alert accepted! You're now responsible for this item",
        data: {
          alert_id: alertId,
          task_id: alert.task_id,
          lead_id: alert.lead_id
        },
        next_action: alert.task_id ? "View task details" : "Handle the lead"
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // PATCH /:id/escalate - Escalate alert
    if (path.match(/^\/[^/]+\/escalate$/) && req.method === 'PATCH') {
      const alertId = path.split('/')[1];
      const { escalate_to_role, reason } = await req.json();

      const { data: alert } = await supabase
        .from('buzzer_queue')
        .select('*')
        .eq('id', alertId)
        .single();

      if (!alert) {
        return new Response(JSON.stringify({
          success: false,
          message: "Alert not found",
          code: "NOT_FOUND"
        }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Create escalation record
      await supabase.from('alert_escalation').insert({
        buzzer_id: alertId,
        original_role: alert.role_target,
        escalated_to_role: escalate_to_role || 'super_admin',
        escalation_reason: reason,
        auto_escalated: false
      });

      // Update alert
      await supabase
        .from('buzzer_queue')
        .update({
          role_target: escalate_to_role || 'super_admin',
          escalation_level: (alert.escalation_level || 0) + 1,
          status: 'pending'
        })
        .eq('id', alertId);

      return new Response(JSON.stringify({
        success: true,
        message: `Alert escalated to ${escalate_to_role || 'super_admin'}`,
        data: {
          alert_id: alertId,
          new_target: escalate_to_role || 'super_admin'
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // GET /history - Get alert history
    if (path === '/history' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;

      const { data: alerts, count } = await supabase
        .from('buzzer_queue')
        .select('*', { count: 'exact' })
        .in('status', ['accepted', 'resolved', 'expired'])
        .or(`accepted_by.eq.${user.id},role_target.in.(${userRoles.join(',')})`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      return new Response(JSON.stringify({
        success: true,
        message: "Alert history retrieved",
        data: {
          alerts: alerts || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            total_pages: Math.ceil((count || 0) / limit)
          }
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // GET /stats - Get alert statistics
    if (path === '/stats' && req.method === 'GET') {
      const { data: pending } = await supabase
        .from('buzzer_queue')
        .select('id', { count: 'exact' })
        .eq('status', 'pending')
        .in('role_target', userRoles);

      const { data: accepted } = await supabase
        .from('buzzer_queue')
        .select('id', { count: 'exact' })
        .eq('status', 'accepted')
        .eq('accepted_by', user.id);

      const { data: escalated } = await supabase
        .from('buzzer_queue')
        .select('id', { count: 'exact' })
        .gt('escalation_level', 0)
        .in('role_target', userRoles);

      return new Response(JSON.stringify({
        success: true,
        message: "Alert stats retrieved",
        data: {
          pending: pending?.length || 0,
          my_active: accepted?.length || 0,
          escalated: escalated?.length || 0
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: false,
      message: "Endpoint not found",
      code: "NOT_FOUND"
    }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('[ALERTS API Error]', error);
    return new Response(JSON.stringify({
      success: false,
      message: "Something went wrong. Please try again",
      code: "INTERNAL_ERROR"
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
