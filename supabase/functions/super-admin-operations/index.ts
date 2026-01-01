import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================
// SUPER ADMIN OPERATIONS API
// Unified API for Admins, Scope, Modules, Rentals, Rules, Approvals, Audit
// ============================================

async function validateSession(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) throw new Error('Authorization required');

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) throw new Error('Invalid session');

  const { data: sessionData } = await supabase
    .from('super_admin_sessions')
    .select('id, assigned_scope')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('login_at', { ascending: false })
    .limit(1)
    .single();

  if (!sessionData) throw new Error('No active session');
  return { user, session: sessionData };
}

async function logActivity(supabase: any, superAdminId: string, module: string, action: string, targetEntity: string | null, targetId: string | null, actionData: Record<string, unknown>, req: Request) {
  const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
  const deviceFingerprint = req.headers.get('x-device-fingerprint') || 'unknown';

  await supabase.from('super_admin_activity_log').insert({
    super_admin_id: superAdminId,
    module,
    action,
    target_entity: targetEntity,
    target_id: targetId,
    action_data: actionData,
    ip_address: ipAddress,
    device_fingerprint: deviceFingerprint
  });

  // Critical actions go to blackbox
  if (['create', 'delete', 'suspend', 'lock', 'approve', 'reject'].includes(action)) {
    await supabase.from('blackbox_events').insert({
      event_type: action,
      module_name: module,
      user_id: superAdminId,
      entity_id: targetId,
      entity_type: targetEntity,
      role_name: 'super_admin',
      ip_address: ipAddress,
      device_fingerprint: deviceFingerprint,
      is_sealed: true,
      risk_score: action === 'delete' ? 90 : 60,
      metadata: actionData
    });
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { user, session } = await validateSession(req, supabase);
    
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const category = pathParts[pathParts.length - 2] || '';
    const action = pathParts[pathParts.length - 1] || '';
    const body = req.method !== 'GET' ? await req.json() : {};

    console.log(`[SUPER-ADMIN-OPS] User: ${user.id}, Category: ${category}, Action: ${action}`);

    // Get super admin profile ID
    const { data: profileData } = await supabase
      .from('super_admin_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const superAdminId = profileData?.id || user.id;

    // ==================== ADMINS ====================
    if (category === 'admins') {
      switch (action) {
        case 'list': {
          const { data, error } = await supabase
            .from('admins')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw new Error('Failed to fetch admins');

          await logActivity(supabase, superAdminId, 'admin_management', 'list', 'admin', null, {}, req);

          return new Response(JSON.stringify({ success: true, data: { admins: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'create': {
          const { user_id, assigned_scope, scope_type, permissions_list } = body;

          const { data, error } = await supabase
            .from('admins')
            .insert({
              user_id,
              created_by_super_admin_id: superAdminId,
              assigned_scope,
              scope_type,
              permissions_list
            })
            .select()
            .single();

          if (error) throw new Error('Failed to create admin');

          await logActivity(supabase, superAdminId, 'admin_management', 'create', 'admin', data.id, { user_id, scope_type }, req);

          return new Response(JSON.stringify({ success: true, data: { admin: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'update-scope': {
          const { admin_id, new_scope, reason } = body;

          // Get current scope
          const { data: currentAdmin } = await supabase
            .from('admins')
            .select('assigned_scope')
            .eq('id', admin_id)
            .single();

          // Update admin
          const { error: updateError } = await supabase
            .from('admins')
            .update({ assigned_scope: new_scope })
            .eq('id', admin_id);

          if (updateError) throw new Error('Failed to update admin scope');

          // Log scope history
          await supabase.from('admin_scope_history').insert({
            admin_id,
            changed_by_super_admin_id: superAdminId,
            old_scope: currentAdmin?.assigned_scope,
            new_scope,
            change_reason: reason
          });

          await logActivity(supabase, superAdminId, 'admin_management', 'update_scope', 'admin', admin_id, { reason }, req);

          return new Response(JSON.stringify({ success: true, message: 'Scope updated' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'suspend': {
          const { admin_id, reason } = body;

          const { error } = await supabase
            .from('admins')
            .update({ status: 'suspended' })
            .eq('id', admin_id);

          if (error) throw new Error('Failed to suspend admin');

          await logActivity(supabase, superAdminId, 'admin_management', 'suspend', 'admin', admin_id, { reason }, req);

          return new Response(JSON.stringify({ success: true, message: 'Admin suspended' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // ==================== SCOPE (Geographic) ====================
    if (category === 'scope') {
      switch (action) {
        case 'continents': {
          const { data, error } = await supabase.from('continents').select('*').order('name');
          if (error) throw new Error('Failed to fetch continents');

          await logActivity(supabase, superAdminId, 'geographic', 'view_continents', 'continent', null, {}, req);

          return new Response(JSON.stringify({ success: true, data: { continents: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'countries': {
          const { continent_id } = body;
          let query = supabase.from('countries').select('*').order('name');
          if (continent_id) query = query.eq('continent_id', continent_id);

          const { data, error } = await query;
          if (error) throw new Error('Failed to fetch countries');

          await logActivity(supabase, superAdminId, 'geographic', 'view_countries', 'country', null, { continent_id }, req);

          return new Response(JSON.stringify({ success: true, data: { countries: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'toggle-region': {
          const { region_type, region_id, enabled } = body;
          const table = region_type === 'continent' ? 'continents' : 'countries';

          const { error } = await supabase
            .from(table)
            .update({ status: enabled ? 'active' : 'inactive' })
            .eq('id', region_id);

          if (error) throw new Error('Failed to toggle region');

          await supabase.from('super_admin_region_actions').insert({
            super_admin_id: superAdminId,
            region_type,
            region_id,
            action: enabled ? 'enable' : 'disable'
          });

          await logActivity(supabase, superAdminId, 'geographic', 'toggle_region', region_type, region_id, { enabled }, req);

          return new Response(JSON.stringify({ success: true, message: 'Region status updated' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // ==================== MODULES ====================
    if (category === 'modules') {
      switch (action) {
        case 'list': {
          const { data, error } = await supabase.from('system_modules').select('*').order('module_name');
          if (error) throw new Error('Failed to fetch modules');

          await logActivity(supabase, superAdminId, 'modules', 'list', 'module', null, {}, req);

          return new Response(JSON.stringify({ success: true, data: { modules: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'toggle': {
          const { module_id, enabled } = body;

          const { error } = await supabase
            .from('system_modules')
            .update({ status: enabled ? 'active' : 'inactive' })
            .eq('id', module_id);

          if (error) throw new Error('Failed to toggle module');

          await supabase.from('super_admin_module_actions').insert({
            super_admin_id: superAdminId,
            module_id,
            action: enabled ? 'enable' : 'disable'
          });

          await logActivity(supabase, superAdminId, 'modules', 'toggle', 'module', module_id, { enabled }, req);

          return new Response(JSON.stringify({ success: true, message: 'Module status updated' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // ==================== RENTALS ====================
    if (category === 'rentals') {
      switch (action) {
        case 'list': {
          const { data, error } = await supabase
            .from('rentals')
            .select('*, rentable_features(*), rental_plans(*)')
            .order('created_at', { ascending: false });

          if (error) throw new Error('Failed to fetch rentals');

          await logActivity(supabase, superAdminId, 'rentals', 'list', 'rental', null, {}, req);

          return new Response(JSON.stringify({ success: true, data: { rentals: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'assign': {
          const { feature_id, plan_id, user_id, end_time } = body;

          const { data, error } = await supabase
            .from('rentals')
            .insert({
              feature_id,
              plan_id,
              assigned_to_user_id: user_id,
              assigned_by_super_admin_id: superAdminId,
              end_time
            })
            .select()
            .single();

          if (error) throw new Error('Failed to assign rental');

          await supabase.from('super_admin_rental_actions').insert({
            super_admin_id: superAdminId,
            rental_id: data.id,
            action: 'assign'
          });

          await logActivity(supabase, superAdminId, 'rentals', 'assign', 'rental', data.id, { user_id, feature_id }, req);

          return new Response(JSON.stringify({ success: true, data: { rental: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'revoke': {
          const { rental_id, reason } = body;

          const { error } = await supabase
            .from('rentals')
            .update({ status: 'revoked' })
            .eq('id', rental_id);

          if (error) throw new Error('Failed to revoke rental');

          await supabase.from('super_admin_rental_actions').insert({
            super_admin_id: superAdminId,
            rental_id,
            action: 'revoke',
            action_data: { reason }
          });

          await logActivity(supabase, superAdminId, 'rentals', 'revoke', 'rental', rental_id, { reason }, req);

          return new Response(JSON.stringify({ success: true, message: 'Rental revoked' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // ==================== RULES ====================
    if (category === 'rules') {
      switch (action) {
        case 'list': {
          const { data, error } = await supabase.from('rules').select('*').order('created_at', { ascending: false });
          if (error) throw new Error('Failed to fetch rules');

          await logActivity(supabase, superAdminId, 'rules', 'list', 'rule', null, {}, req);

          return new Response(JSON.stringify({ success: true, data: { rules: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'create': {
          const { rule_name, rule_type, rule_logic, scope_definition, priority } = body;

          const { data, error } = await supabase
            .from('rules')
            .insert({
              rule_name,
              rule_type,
              rule_logic,
              scope_definition,
              priority,
              created_by_super_admin_id: superAdminId,
              status: 'draft'
            })
            .select()
            .single();

          if (error) throw new Error('Failed to create rule');

          await logActivity(supabase, superAdminId, 'rules', 'create', 'rule', data.id, { rule_name, rule_type }, req);

          return new Response(JSON.stringify({ success: true, data: { rule: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'activate': {
          const { rule_id } = body;

          const { error } = await supabase
            .from('rules')
            .update({ status: 'active' })
            .eq('id', rule_id);

          if (error) throw new Error('Failed to activate rule');

          await logActivity(supabase, superAdminId, 'rules', 'activate', 'rule', rule_id, {}, req);

          return new Response(JSON.stringify({ success: true, message: 'Rule activated' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'deactivate': {
          const { rule_id } = body;

          const { error } = await supabase
            .from('rules')
            .update({ status: 'inactive' })
            .eq('id', rule_id);

          if (error) throw new Error('Failed to deactivate rule');

          await logActivity(supabase, superAdminId, 'rules', 'deactivate', 'rule', rule_id, {}, req);

          return new Response(JSON.stringify({ success: true, message: 'Rule deactivated' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // ==================== APPROVALS ====================
    if (category === 'approvals') {
      switch (action) {
        case 'pending': {
          const { data, error } = await supabase
            .from('approvals')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

          if (error) throw new Error('Failed to fetch pending approvals');

          await logActivity(supabase, superAdminId, 'approvals', 'view_pending', 'approval', null, {}, req);

          return new Response(JSON.stringify({ success: true, data: { approvals: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'approve': {
          const { approval_id, reason } = body;

          await supabase
            .from('approvals')
            .update({ status: 'approved' })
            .eq('id', approval_id);

          await supabase.from('approval_decisions').insert({
            approval_id,
            super_admin_id: superAdminId,
            decision: 'approved',
            decision_reason: reason
          });

          await logActivity(supabase, superAdminId, 'approvals', 'approve', 'approval', approval_id, { reason }, req);

          return new Response(JSON.stringify({ success: true, message: 'Approval granted' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'reject': {
          const { approval_id, reason } = body;

          await supabase
            .from('approvals')
            .update({ status: 'rejected' })
            .eq('id', approval_id);

          await supabase.from('approval_decisions').insert({
            approval_id,
            super_admin_id: superAdminId,
            decision: 'rejected',
            decision_reason: reason
          });

          await logActivity(supabase, superAdminId, 'approvals', 'reject', 'approval', approval_id, { reason }, req);

          return new Response(JSON.stringify({ success: true, message: 'Approval rejected' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // ==================== AUDIT ====================
    if (category === 'audit') {
      switch (action) {
        case 'logs': {
          const { limit = 100, offset = 0, module: filterModule, start_date, end_date } = body;

          let query = supabase
            .from('super_admin_activity_log')
            .select('*', { count: 'exact' })
            .eq('super_admin_id', superAdminId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

          if (filterModule) query = query.eq('module', filterModule);
          if (start_date) query = query.gte('created_at', start_date);
          if (end_date) query = query.lte('created_at', end_date);

          const { data, error, count } = await query;
          if (error) throw new Error('Failed to fetch audit logs');

          // Log this access
          await supabase.from('super_admin_audit_access').insert({
            user_id: user.id,
            session_id: session.id,
            access_type: 'view',
            accessed_module: 'activity_log',
            filter_criteria: { filterModule, start_date, end_date },
            records_viewed: data?.length || 0
          });

          return new Response(JSON.stringify({ success: true, data: { logs: data, total: count } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'blackbox': {
          const { limit = 50 } = body;

          const { data, error } = await supabase
            .from('blackbox_events')
            .select('*')
            .eq('role_name', 'super_admin')
            .order('created_at', { ascending: false })
            .limit(limit);

          if (error) throw new Error('Failed to fetch blackbox events');

          await supabase.from('super_admin_audit_access').insert({
            user_id: user.id,
            session_id: session.id,
            access_type: 'view',
            accessed_module: 'blackbox',
            records_viewed: data?.length || 0
          });

          return new Response(JSON.stringify({ success: true, data: { events: data } }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'export-request': {
          const { module: exportModule, start_date, end_date, reason } = body;

          await supabase.from('super_admin_audit_access').insert({
            user_id: user.id,
            session_id: session.id,
            access_type: 'export_request',
            accessed_module: exportModule,
            filter_criteria: { start_date, end_date, reason },
            export_requested: true,
            export_approved: false
          });

          await logActivity(supabase, superAdminId, 'audit', 'export_request', 'report', null, { exportModule, reason }, req);

          return new Response(JSON.stringify({ success: true, message: 'Export request submitted for review' }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    return new Response(JSON.stringify({ success: false, error: 'Unknown endpoint' }), 
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SUPER-ADMIN-OPS] Error:', error);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), 
      { status: errorMessage.includes('Authorization') ? 401 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
