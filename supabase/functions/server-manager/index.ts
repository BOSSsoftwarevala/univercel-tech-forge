import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Check role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const userRoles = roles?.map(r => r.role) || [];
    const isAuthorized = userRoles.includes('boss_owner') || userRoles.includes('server_manager');

    if (!isAuthorized) {
      // Log unauthorized access attempt
      await supabase.from('server_audit_logs').insert({
        action: 'unauthorized_access_attempt',
        action_type: 'security',
        performed_by: user.id,
        performed_by_role: userRoles[0] || 'unknown',
        details: { path: new URL(req.url).pathname }
      });

      return new Response(JSON.stringify({ error: 'Forbidden - Server Manager access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.replace('/server-manager', '');
    const method = req.method;

    console.log(`[Server Manager API] ${method} ${path}`);

    // Route handling
    let response: any = { error: 'Not found' };
    let status = 404;

    // ==================== DASHBOARD ====================
    if (path === '/dashboard/summary' && method === 'GET') {
      const { data: servers } = await supabase
        .from('server_instances')
        .select('id, status, health_score');

      const { data: alerts } = await supabase
        .from('server_alerts')
        .select('severity')
        .eq('is_resolved', false);

      const { data: metrics } = await supabase
        .from('server_metrics_history')
        .select('cpu_percent, ram_percent, network_in, network_out')
        .order('recorded_at', { ascending: false })
        .limit(100);

      const total = servers?.length || 0;
      const online = servers?.filter(s => s.status === 'online').length || 0;
      const offline = servers?.filter(s => s.status === 'offline').length || 0;
      const warnings = alerts?.filter(a => a.severity === 'warning').length || 0;
      const critical = alerts?.filter(a => a.severity === 'critical').length || 0;

      const avgCpu = metrics?.length ? metrics.reduce((acc, m) => acc + (m.cpu_percent || 0), 0) / metrics.length : 0;
      const avgRam = metrics?.length ? metrics.reduce((acc, m) => acc + (m.ram_percent || 0), 0) / metrics.length : 0;
      const networkIn = metrics?.reduce((acc, m) => acc + (m.network_in || 0), 0) || 0;
      const networkOut = metrics?.reduce((acc, m) => acc + (m.network_out || 0), 0) || 0;

      response = {
        total_servers: total,
        online,
        offline,
        warnings,
        critical_alerts: critical,
        avg_cpu: Math.round(avgCpu * 100) / 100,
        avg_ram: Math.round(avgRam * 100) / 100,
        network_throughput: { in: networkIn, out: networkOut }
      };
      status = 200;
    }

    // ==================== SERVER REGISTRY ====================
    else if (path === '/servers' && method === 'GET') {
      const region = url.searchParams.get('region');
      const serverStatus = url.searchParams.get('status');
      const cluster = url.searchParams.get('cluster');

      let query = supabase.from('server_instances').select('*');
      
      if (region) query = query.eq('region', region);
      if (serverStatus) query = query.eq('status', serverStatus);
      if (cluster) query = query.eq('cluster_name', cluster);

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      response = { servers: data };
      status = 200;
    }

    else if (path.match(/^\/servers\/[^/]+$/) && method === 'GET') {
      const serverId = path.split('/')[2];
      const { data, error } = await supabase
        .from('server_instances')
        .select('*, server_performance(*)')
        .eq('id', serverId)
        .single();

      if (error) throw error;
      response = { server: data };
      status = 200;
    }

    else if (path.match(/^\/servers\/[^/]+$/) && method === 'PUT') {
      const serverId = path.split('/')[2];
      const body = await req.json();

      const { data, error } = await supabase
        .from('server_instances')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', serverId)
        .select()
        .single();

      if (error) throw error;

      // Audit log
      await supabase.from('server_audit_logs').insert({
        server_id: serverId,
        action: 'Server metadata updated',
        action_type: 'update',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        details: body
      });

      response = { server: data };
      status = 200;
    }

    // ==================== SERVER ACTIONS ====================
    else if (path.match(/^\/servers\/[^/]+\/restart$/) && method === 'POST') {
      const serverId = path.split('/')[2];
      
      await supabase
        .from('server_instances')
        .update({ status: 'warning', updated_at: new Date().toISOString() })
        .eq('id', serverId);

      await supabase.from('server_audit_logs').insert({
        server_id: serverId,
        action: 'Server restart initiated',
        action_type: 'restart',
        performed_by: user.id,
        performed_by_role: userRoles[0]
      });

      // Simulate restart - set back to online after 5 seconds
      setTimeout(async () => {
        await supabase
          .from('server_instances')
          .update({ status: 'online', last_heartbeat: new Date().toISOString() })
          .eq('id', serverId);
      }, 5000);

      response = { success: true, message: 'Restart initiated' };
      status = 200;
    }

    else if (path.match(/^\/servers\/[^/]+\/shutdown$/) && method === 'POST') {
      const serverId = path.split('/')[2];
      
      await supabase
        .from('server_instances')
        .update({ status: 'offline', updated_at: new Date().toISOString() })
        .eq('id', serverId);

      await supabase.from('server_audit_logs').insert({
        server_id: serverId,
        action: 'Server shutdown',
        action_type: 'shutdown',
        performed_by: user.id,
        performed_by_role: userRoles[0]
      });

      response = { success: true, message: 'Server shutdown' };
      status = 200;
    }

    else if (path.match(/^\/servers\/[^/]+\/scale$/) && method === 'POST') {
      const serverId = path.split('/')[2];
      const body = await req.json();

      await supabase
        .from('server_instances')
        .update({
          cpu_allocated: body.cpu,
          ram_allocated: body.ram,
          storage_allocated: body.storage,
          updated_at: new Date().toISOString()
        })
        .eq('id', serverId);

      await supabase.from('server_audit_logs').insert({
        server_id: serverId,
        action: 'Server resources scaled',
        action_type: 'scale',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        details: body
      });

      response = { success: true, message: 'Resources scaled' };
      status = 200;
    }

    else if (path.match(/^\/servers\/[^/]+\/decommission$/) && method === 'POST') {
      const serverId = path.split('/')[2];
      
      // Requires approval for decommission
      await supabase.from('server_audit_logs').insert({
        server_id: serverId,
        action: 'Server decommission requested',
        action_type: 'decommission',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        approval_required: true,
        approval_status: 'pending'
      });

      response = { success: true, message: 'Decommission request submitted for approval', approval_required: true };
      status = 200;
    }

    // ==================== LIVE MONITORING ====================
    else if (path.match(/^\/servers\/[^/]+\/metrics\/live$/) && method === 'GET') {
      const serverId = path.split('/')[2];
      
      const { data } = await supabase
        .from('server_metrics_history')
        .select('*')
        .eq('server_id', serverId)
        .order('recorded_at', { ascending: false })
        .limit(60);

      response = { metrics: data || [] };
      status = 200;
    }

    else if (path === '/servers/metrics/compare' && method === 'POST') {
      const body = await req.json();
      const { server_ids, metric, time_range } = body;

      const results: any = {};
      for (const serverId of server_ids) {
        const { data } = await supabase
          .from('server_metrics_history')
          .select(`${metric}, recorded_at`)
          .eq('server_id', serverId)
          .order('recorded_at', { ascending: false })
          .limit(time_range === 'hour' ? 60 : time_range === 'day' ? 1440 : 10080);

        results[serverId] = data;
      }

      response = { comparison: results };
      status = 200;
    }

    // ==================== PERFORMANCE ====================
    else if (path.match(/^\/servers\/[^/]+\/performance$/) && method === 'GET') {
      const serverId = path.split('/')[2];
      
      const { data } = await supabase
        .from('server_performance')
        .select('*')
        .eq('server_id', serverId)
        .single();

      response = { performance: data };
      status = 200;
    }

    else if (path === '/servers/performance/summary' && method === 'GET') {
      const { data } = await supabase
        .from('server_performance')
        .select('*, server_instances(server_name, region, status)');

      response = { summary: data };
      status = 200;
    }

    // ==================== ALERTS & INCIDENTS ====================
    else if (path === '/alerts' && method === 'GET') {
      const severity = url.searchParams.get('severity');
      const alertStatus = url.searchParams.get('status');
      const serverId = url.searchParams.get('server_id');

      let query = supabase.from('server_alerts').select('*, server_instances(server_name)');
      
      if (severity) query = query.eq('severity', severity);
      if (alertStatus === 'active') query = query.eq('is_resolved', false);
      if (alertStatus === 'resolved') query = query.eq('is_resolved', true);
      if (serverId) query = query.eq('server_id', serverId);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      response = { alerts: data };
      status = 200;
    }

    else if (path.match(/^\/alerts\/[^/]+\/acknowledge$/) && method === 'POST') {
      const alertId = path.split('/')[2];
      
      await supabase
        .from('server_alerts')
        .update({
          is_acknowledged: true,
          acknowledged_by: user.id,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId);

      response = { success: true, message: 'Alert acknowledged' };
      status = 200;
    }

    else if (path === '/incidents' && method === 'GET') {
      const { data } = await supabase
        .from('server_incidents')
        .select('*, server_alerts(*), server_instances(server_name)')
        .order('created_at', { ascending: false });

      response = { incidents: data };
      status = 200;
    }

    else if (path === '/incidents' && method === 'POST') {
      const body = await req.json();
      
      const { data, error } = await supabase
        .from('server_incidents')
        .insert({
          alert_id: body.alert_id,
          server_id: body.server_id,
          title: body.title || 'New Incident',
          description: body.description,
          priority: body.priority || 'medium',
          assigned_to: body.assigned_to
        })
        .select()
        .single();

      if (error) throw error;
      response = { incident: data };
      status = 201;
    }

    else if (path.match(/^\/incidents\/[^/]+\/resolve$/) && method === 'PUT') {
      const incidentId = path.split('/')[2];
      const body = await req.json();
      
      await supabase
        .from('server_incidents')
        .update({
          status: 'resolved',
          resolution_notes: body.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', incidentId);

      response = { success: true, message: 'Incident resolved' };
      status = 200;
    }

    // ==================== SECURITY & FIREWALL ====================
    else if (path.match(/^\/servers\/[^/]+\/security$/) && method === 'GET') {
      const serverId = path.split('/')[2];
      
      const { data: rules } = await supabase
        .from('firewall_rules')
        .select('*')
        .eq('server_id', serverId);

      const { data: alerts } = await supabase
        .from('server_alerts')
        .select('*')
        .eq('server_id', serverId)
        .in('alert_type', ['security_breach', 'ddos'])
        .eq('is_resolved', false);

      response = { 
        firewall_rules: rules || [],
        security_alerts: alerts || [],
        health_score: 100 - (alerts?.length || 0) * 10
      };
      status = 200;
    }

    else if (path === '/firewall/rules' && method === 'POST') {
      const body = await req.json();
      
      const { data, error } = await supabase
        .from('firewall_rules')
        .insert({
          server_id: body.server_id,
          rule_name: body.rule_name,
          rule_type: body.rule_type,
          ip_range: body.ip_range,
          port_range: body.port_range,
          protocol: body.protocol || 'tcp',
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('server_audit_logs').insert({
        server_id: body.server_id,
        action: `Firewall rule added: ${body.rule_name}`,
        action_type: 'security',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        details: body
      });

      response = { rule: data };
      status = 201;
    }

    else if (path.match(/^\/servers\/[^/]+\/lockdown$/) && method === 'POST') {
      const serverId = path.split('/')[2];
      
      // Add deny-all rule
      await supabase.from('firewall_rules').insert({
        server_id: serverId,
        rule_name: 'EMERGENCY_LOCKDOWN',
        rule_type: 'deny',
        ip_range: '0.0.0.0/0',
        created_by: user.id
      });

      await supabase.from('server_audit_logs').insert({
        server_id: serverId,
        action: 'Emergency lockdown activated',
        action_type: 'security',
        performed_by: user.id,
        performed_by_role: userRoles[0]
      });

      response = { success: true, message: 'Lockdown mode activated' };
      status = 200;
    }

    // ==================== SERVER PLANS ====================
    else if (path === '/server-plans' && method === 'GET') {
      const region = url.searchParams.get('region');
      const planType = url.searchParams.get('type');

      let query = supabase.from('server_plans').select('*').eq('is_active', true);
      
      if (planType) query = query.eq('plan_type', planType);
      if (region) query = query.contains('regions', [region]);

      const { data, error } = await query.order('price_monthly');

      if (error) throw error;
      response = { plans: data };
      status = 200;
    }

    else if (path === '/server-plans/recommended' && method === 'GET') {
      // Get user's current usage patterns
      const { data: metrics } = await supabase
        .from('server_metrics_history')
        .select('cpu_percent, ram_percent, disk_percent')
        .order('recorded_at', { ascending: false })
        .limit(100);

      const avgCpu = metrics?.length ? metrics.reduce((acc, m) => acc + (m.cpu_percent || 0), 0) / metrics.length : 50;
      const avgRam = metrics?.length ? metrics.reduce((acc, m) => acc + (m.ram_percent || 0), 0) / metrics.length : 50;

      const { data: plans } = await supabase.from('server_plans').select('*').eq('is_active', true);

      // AI-like recommendation logic
      const basedOnUsage = plans?.find(p => 
        (avgCpu > 70 && p.plan_type === 'compute') || 
        (avgRam > 70 && p.plan_type === 'memory')
      ) || plans?.[0];

      const costOptimized = plans?.reduce((min, p) => 
        p.price_monthly < min.price_monthly ? p : min
      , plans[0]);

      const performanceBoost = plans?.reduce((max, p) => 
        (p.cpu_cores + p.ram_gb) > (max.cpu_cores + max.ram_gb) ? p : max
      , plans[0]);

      response = {
        based_on_usage: basedOnUsage,
        cost_optimized: costOptimized,
        performance_boost: performanceBoost
      };
      status = 200;
    }

    else if (path.match(/^\/server-plans\/[^/]+$/) && method === 'GET') {
      const planId = path.split('/')[2];
      const { data, error } = await supabase
        .from('server_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      response = { plan: data };
      status = 200;
    }

    // ==================== PURCHASE FLOW ====================
    else if (path === '/servers/purchase/init' && method === 'POST') {
      const body = await req.json();
      
      const { data: plan } = await supabase
        .from('server_plans')
        .select('*')
        .eq('id', body.plan_id)
        .single();

      if (!plan) {
        response = { error: 'Plan not found' };
        status = 404;
      } else {
        const { data: purchase, error } = await supabase
          .from('server_purchases')
          .insert({
            user_id: user.id,
            plan_id: body.plan_id,
            region: body.region,
            amount: plan.price_monthly,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        response = { purchase_id: purchase.id, plan, amount: plan.price_monthly };
        status = 201;
      }
    }

    else if (path === '/servers/purchase/configure' && method === 'POST') {
      const body = await req.json();
      
      const { error } = await supabase
        .from('server_purchases')
        .update({
          os: body.os,
          auto_backup: body.backup,
          firewall_preset: body.firewall_preset,
          scaling_rules: body.scaling_rules
        })
        .eq('id', body.purchase_id);

      if (error) throw error;
      response = { success: true, message: 'Configuration saved' };
      status = 200;
    }

    else if (path === '/servers/purchase/confirm' && method === 'POST') {
      const body = await req.json();
      
      // Get purchase details
      const { data: purchase } = await supabase
        .from('server_purchases')
        .select('*, server_plans(*)')
        .eq('id', body.purchase_id)
        .single();

      if (!purchase) {
        response = { error: 'Purchase not found' };
        status = 404;
      } else {
        // Create server instance
        const { data: server, error: serverError } = await supabase
          .from('server_instances')
          .insert({
            server_name: `server-${Date.now()}`,
            plan_id: purchase.plan_id,
            region: purchase.region,
            os: purchase.os,
            auto_backup: purchase.auto_backup,
            firewall_preset: purchase.firewall_preset,
            scaling_rules: purchase.scaling_rules,
            cpu_allocated: purchase.server_plans.cpu_cores,
            ram_allocated: purchase.server_plans.ram_gb,
            storage_allocated: purchase.server_plans.storage_gb,
            purchased_by: user.id,
            status: 'provisioning'
          })
          .select()
          .single();

        if (serverError) throw serverError;

        // Update purchase
        await supabase
          .from('server_purchases')
          .update({
            server_id: server.id,
            payment_method: body.payment_method,
            status: 'provisioning',
            completed_at: new Date().toISOString()
          })
          .eq('id', body.purchase_id);

        // Create performance record
        await supabase.from('server_performance').insert({
          server_id: server.id
        });

        await supabase.from('server_audit_logs').insert({
          server_id: server.id,
          action: 'New server purchased and provisioning',
          action_type: 'create',
          performed_by: user.id,
          performed_by_role: userRoles[0],
          details: { purchase_id: body.purchase_id, plan: purchase.server_plans.plan_name }
        });

        // Simulate provisioning - set online after 10 seconds
        setTimeout(async () => {
          await supabase
            .from('server_instances')
            .update({ status: 'online', last_heartbeat: new Date().toISOString() })
            .eq('id', server.id);
          
          await supabase
            .from('server_purchases')
            .update({ status: 'completed' })
            .eq('id', body.purchase_id);
        }, 10000);

        response = { 
          server_id: server.id, 
          provisioning_status: 'started',
          estimated_time: '2-5 minutes'
        };
        status = 201;
      }
    }

    // ==================== BILLING ====================
    else if (path.match(/^\/servers\/[^/]+\/usage$/) && method === 'GET') {
      const serverId = path.split('/')[2];
      
      const { data } = await supabase
        .from('server_billing')
        .select('*')
        .eq('server_id', serverId)
        .order('billing_period_start', { ascending: false });

      response = { usage: data };
      status = 200;
    }

    else if (path === '/billing/servers' && method === 'GET') {
      const { data } = await supabase
        .from('server_billing')
        .select('*, server_instances(server_name, region)')
        .order('created_at', { ascending: false });

      response = { billing: data };
      status = 200;
    }

    else if (path === '/billing/forecast' && method === 'GET') {
      const { data: billing } = await supabase
        .from('server_billing')
        .select('total_cost')
        .gte('billing_period_start', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      const currentCost = billing?.reduce((acc, b) => acc + (b.total_cost || 0), 0) || 0;
      const forecast = currentCost * 1.1; // 10% buffer

      response = { 
        current_month: currentCost,
        forecast_next_month: forecast,
        trend: currentCost > 0 ? 'stable' : 'low'
      };
      status = 200;
    }

    // ==================== LOGS & AUDIT ====================
    else if (path.match(/^\/servers\/[^/]+\/logs$/) && method === 'GET') {
      const serverId = path.split('/')[2];
      
      const { data } = await supabase
        .from('server_audit_logs')
        .select('*')
        .eq('server_id', serverId)
        .order('created_at', { ascending: false })
        .limit(100);

      response = { logs: data };
      status = 200;
    }

    else if (path.match(/^\/servers\/[^/]+\/audit$/) && method === 'GET') {
      const serverId = path.split('/')[2];
      
      const { data } = await supabase
        .from('server_audit_logs')
        .select('*')
        .eq('server_id', serverId)
        .order('created_at', { ascending: false });

      response = { audit: data };
      status = 200;
    }

    else if (path === '/system/audit' && method === 'GET') {
      const module = url.searchParams.get('module');
      
      let query = supabase.from('server_audit_logs').select('*, server_instances(server_name)');
      
      if (module) {
        query = query.ilike('action', `%${module}%`);
      }

      const { data } = await query.order('created_at', { ascending: false }).limit(500);

      response = { audit: data };
      status = 200;
    }

    // ==================== WEBHOOKS ====================
    else if (path === '/webhooks/server/events' && method === 'POST') {
      const body = await req.json();
      
      // Log webhook event
      await supabase.from('server_webhooks').insert({
        event_type: body.event_type,
        server_id: body.server_id,
        payload: body
      });

      // Process event
      if (body.event_type === 'server_down' || body.event_type === 'security_breach') {
        // Create critical alert
        await supabase.from('server_alerts').insert({
          server_id: body.server_id,
          alert_type: body.event_type,
          severity: 'critical',
          message: body.message || `Critical: ${body.event_type}`
        });

        // Auto-create incident for critical events
        await supabase.from('server_incidents').insert({
          server_id: body.server_id,
          title: `Auto-generated: ${body.event_type}`,
          description: body.message,
          priority: 'critical',
          status: 'open'
        });
      } else if (['cpu_spike', 'memory_leak', 'disk_full'].includes(body.event_type)) {
        await supabase.from('server_alerts').insert({
          server_id: body.server_id,
          alert_type: body.event_type,
          severity: 'warning',
          message: body.message || `Warning: ${body.event_type}`
        });
      }

      response = { success: true, processed: true };
      status = 200;
    }

    // ==================== SYSTEM HEALTH CHECK ====================
    else if (path === '/system/health-check' && method === 'POST') {
      const { data: servers } = await supabase
        .from('server_instances')
        .select('id, name, status, health_score, region');

      const serverList = servers || [];
      const healthyCount = serverList.filter((s: any) => s.status === 'running' || s.health_score >= 80).length;
      const degradedCount = serverList.filter((s: any) => s.health_score >= 50 && s.health_score < 80).length;
      const criticalCount = serverList.filter((s: any) => s.status === 'error' || s.health_score < 50).length;

      const overallStatus = criticalCount > 0 ? 'critical' : degradedCount > 0 ? 'degraded' : 'healthy';

      // Persist health snapshot
      await supabase.from('system_health').insert({
        check_type: 'full_system',
        overall_status: overallStatus,
        total_servers: serverList.length,
        healthy_servers: healthyCount,
        degraded_servers: degradedCount,
        critical_servers: criticalCount,
        checked_by: user.id,
        checked_at: new Date().toISOString(),
      });

      await supabase.from('server_audit_logs').insert({
        action: 'system_health_check',
        action_type: 'monitoring',
        performed_by: user.id,
        performed_by_role: userRoles[0] || 'unknown',
        details: { overall_status: overallStatus, server_count: serverList.length }
      });

      response = {
        overall_status: overallStatus,
        checked_at: new Date().toISOString(),
        summary: {
          total: serverList.length,
          healthy: healthyCount,
          degraded: degradedCount,
          critical: criticalCount,
        },
      };
      status = 200;
    }

    return new Response(JSON.stringify(response), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('[Server Manager API Error]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
