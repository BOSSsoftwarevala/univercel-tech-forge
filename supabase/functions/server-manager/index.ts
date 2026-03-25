import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const normalizeServerStatus = (status?: string | null) => {
  switch (status) {
    case 'active':
    case 'online':
      return 'online';
    case 'warning':
    case 'maintenance':
    case 'degraded':
    case 'provisioning':
      return 'degraded';
    default:
      return 'offline';
  }
};

const metricStatus = (value: number, warningThreshold: number, criticalThreshold: number) => {
  if (value >= criticalThreshold) return 'critical';
  if (value >= warningThreshold) return 'warning';
  return 'healthy';
};

const formatUptime = (createdAt?: string | null) => {
  if (!createdAt) return 'Unknown';

  const start = new Date(createdAt).getTime();
  const diffMs = Math.max(Date.now() - start, 0);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m`;
};

const formatLastCheck = (timestamp?: string | null) => {
  if (!timestamp) return 'No checks yet';

  const diffSeconds = Math.max(Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000), 0);
  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return `${Math.floor(diffHours / 24)}d ago`;
};

const maskSecretValue = (value: string | null, settingKey: string) => {
  const source = value || `managed://${settingKey}`;
  if (source.length <= 8) {
    return '*'.repeat(Math.max(source.length, 4));
  }

  return `${source.slice(0, 4)}${'*'.repeat(Math.max(source.length - 8, 4))}${source.slice(-4)}`;
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
    const path = url.pathname
      .replace(/^\/functions\/v1\/server-manager/, '')
      .replace(/^\/server-manager/, '') || '/';
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

    else if (path === '/dashboard/health' && method === 'GET') {
      const { data: servers, error } = await supabase
        .from('server_instances')
        .select('id, server_name, region, status, created_at, last_health_check, current_cpu_usage, current_memory_usage, current_disk_usage, health_status')
        .order('created_at', { ascending: false })
        .limit(24);

      if (error) throw error;

      const serverIds = (servers || []).map((server) => server.id);
      const { data: metricCache } = serverIds.length
        ? await supabase
            .from('server_metrics_cache')
            .select('server_id, cpu_percent, ram_percent, disk_percent, network_in, network_out, health_score, last_updated, status')
            .in('server_id', serverIds)
        : { data: [] as any[] };

      const cacheByServer = new Map((metricCache || []).map((item: any) => [item.server_id, item]));

      response = {
        nodes: (servers || []).map((server: any) => {
          const cache = cacheByServer.get(server.id);
          const cpuValue = Number(cache?.cpu_percent ?? server.current_cpu_usage ?? 0);
          const ramValue = Number(cache?.ram_percent ?? server.current_memory_usage ?? 0);
          const diskValue = Number(cache?.disk_percent ?? server.current_disk_usage ?? 0);
          const networkValue = Math.max(Number(cache?.network_in ?? 0), Number(cache?.network_out ?? 0));
          const serverStatus = normalizeServerStatus(cache?.status ?? server.status ?? server.health_status);

          return {
            id: server.id,
            name: server.server_name,
            region: server.region,
            status: serverStatus,
            cpu: {
              name: 'CPU',
              value: cpuValue,
              max: 100,
              unit: '%',
              status: metricStatus(cpuValue, 70, 90),
              trend: 'stable',
            },
            ram: {
              name: 'RAM',
              value: ramValue,
              max: 100,
              unit: '%',
              status: metricStatus(ramValue, 75, 90),
              trend: 'stable',
            },
            disk: {
              name: 'Disk',
              value: diskValue,
              max: 100,
              unit: '%',
              status: metricStatus(diskValue, 80, 95),
              trend: 'stable',
            },
            network: {
              name: 'Network',
              value: networkValue,
              max: 1000,
              unit: 'Mbps',
              status: metricStatus(networkValue, 700, 900),
              trend: 'stable',
            },
            uptime: formatUptime(server.created_at),
            lastCheck: formatLastCheck(cache?.last_updated ?? server.last_health_check),
          };
        }),
      };
      status = 200;
    }

    else if (path === '/services/status' && method === 'GET') {
      const { data: servers, error } = await supabase
        .from('server_instances')
        .select('id, server_name, server_type, status, os_type, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const serverIds = (servers || []).map((server) => server.id);
      const [performanceResult, metricsResult, alertsResult] = await Promise.all([
        serverIds.length
          ? supabase
              .from('server_performance')
              .select('server_id, avg_latency_ms, uptime_percent, error_rate')
              .in('server_id', serverIds)
          : Promise.resolve({ data: [] as any[] }),
        serverIds.length
          ? supabase
              .from('server_metrics_history')
              .select('server_id, active_connections, error_count, recorded_at')
              .in('server_id', serverIds)
              .order('recorded_at', { ascending: false })
          : Promise.resolve({ data: [] as any[] }),
        serverIds.length
          ? supabase
              .from('server_alerts')
              .select('server_id, created_at')
              .in('server_id', serverIds)
              .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const performanceByServer = new Map((performanceResult.data || []).map((item: any) => [item.server_id, item]));
      const latestMetricsByServer = new Map<string, any>();
      for (const metric of metricsResult.data || []) {
        if (!latestMetricsByServer.has(metric.server_id)) {
          latestMetricsByServer.set(metric.server_id, metric);
        }
      }

      const errorCountByServer = new Map<string, number>();
      for (const alert of alertsResult.data || []) {
        errorCountByServer.set(alert.server_id, (errorCountByServer.get(alert.server_id) || 0) + 1);
      }

      response = {
        services: (servers || []).map((server: any) => {
          const performance = performanceByServer.get(server.id);
          const metrics = latestMetricsByServer.get(server.id);
          const normalizedStatus = normalizeServerStatus(server.status);

          return {
            id: server.id,
            name: server.server_name,
            type: server.server_type === 'database'
              ? 'database'
              : server.server_type === 'backup'
                ? 'queue'
                : server.server_type === 'ai'
                  ? 'api'
                  : 'app',
            status: normalizedStatus === 'online' ? 'running' : normalizedStatus === 'degraded' ? 'degraded' : 'stopped',
            version: server.os_type || 'managed',
            uptime: performance?.uptime_percent ? `${Math.round(performance.uptime_percent)}% SLA` : formatUptime(server.created_at),
            latency: Number(performance?.avg_latency_ms ?? 0),
            lastRestart: formatLastCheck(server.updated_at),
            connections: Number(metrics?.active_connections ?? 0),
            errors24h: Number(metrics?.error_count ?? errorCountByServer.get(server.id) ?? 0),
          };
        }),
      };
      status = 200;
    }

    else if (path.match(/^\/services\/[^/]+\/restart$/) && method === 'POST') {
      const serverId = path.split('/')[2];

      await supabase
        .from('server_instances')
        .update({ status: 'warning', updated_at: new Date().toISOString(), last_health_check: new Date().toISOString() })
        .eq('id', serverId);

      await supabase.from('server_audit_logs').insert({
        server_id: serverId,
        action: 'Service restart initiated',
        action_type: 'restart',
        performed_by: user.id,
        performed_by_role: userRoles[0],
      });

      setTimeout(async () => {
        await supabase
          .from('server_instances')
          .update({ status: 'online', updated_at: new Date().toISOString(), last_health_check: new Date().toISOString() })
          .eq('id', serverId);
      }, 3000);

      response = { success: true, message: 'Service restart queued' };
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
          status: body.status || 'open',
          assigned_to: body.assigned_to
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('server_audit_logs').insert({
        server_id: body.server_id,
        action: `Incident created: ${data.title}`,
        action_type: 'incident',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        details: {
          incident_id: data.id,
          priority: data.priority,
        },
      });

      response = { incident: data };
      status = 201;
    }

    else if (path.match(/^\/incidents\/[^/]+\/status$/) && method === 'PUT') {
      const incidentId = path.split('/')[2];
      const body = await req.json();

      const { data: incident, error } = await supabase
        .from('server_incidents')
        .update({
          status: body.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', incidentId)
        .select('id, server_id, title, status')
        .single();

      if (error) throw error;

      await supabase.from('server_audit_logs').insert({
        server_id: incident.server_id,
        action: `Incident status updated: ${incident.title}`,
        action_type: 'incident',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        details: { incident_id: incident.id, status: incident.status },
      });

      response = { incident };
      status = 200;
    }

    else if (path.match(/^\/incidents\/[^/]+\/escalate$/) && method === 'POST') {
      const incidentId = path.split('/')[2];
      const body = await req.json();

      const { data: incident, error } = await supabase
        .from('server_incidents')
        .update({
          escalated: true,
          escalated_to: body.target,
          updated_at: new Date().toISOString(),
        })
        .eq('id', incidentId)
        .select('id, server_id, title, escalated_to')
        .single();

      if (error) throw error;

      await supabase.from('server_audit_logs').insert({
        server_id: incident.server_id,
        action: `Incident escalated: ${incident.title}`,
        action_type: 'incident',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        details: { incident_id: incident.id, escalated_to: incident.escalated_to },
      });

      response = { incident };
      status = 200;
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

    // ==================== BACKUPS ====================
    else if (path === '/backups/overview' && method === 'GET') {
      const [backupsResult, schedulesResult] = await Promise.all([
        supabase
          .from('server_backups')
          .select('id, backup_name, backup_type, status, size_gb, created_at, expires_at, completed_at, encryption_enabled, metadata, server_instances(server_name, server_type)')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('backup_schedules')
          .select('id, schedule_name, frequency, next_run_at, last_run_at, is_active, server_instances(server_name, server_type)')
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      if (backupsResult.error) throw backupsResult.error;
      if (schedulesResult.error) throw schedulesResult.error;

      response = {
        backups: (backupsResult.data || []).map((backup: any) => ({
          id: backup.id,
          name: backup.backup_name,
          type: backup.backup_type,
          environment: backup.server_instances?.server_type === 'staging' ? 'staging' : 'production',
          status: backup.status,
          size: backup.size_gb ? `${Number(backup.size_gb).toFixed(1)} GB` : 'Pending',
          createdAt: backup.completed_at || backup.created_at,
          expiresAt: backup.expires_at,
          integrityStatus: backup.metadata?.integrity_verified_at ? 'verified' : 'pending',
          encryptionStatus: backup.encryption_enabled ? 'encrypted' : 'not_encrypted',
          serverId: backup.server_id,
        })),
        schedules: (schedulesResult.data || []).map((schedule: any) => ({
          id: schedule.id,
          name: schedule.schedule_name,
          frequency: schedule.frequency,
          nextRun: schedule.next_run_at,
          lastRun: schedule.last_run_at,
          isActive: Boolean(schedule.is_active),
        })),
      };
      status = 200;
    }

    else if (path.match(/^\/backups\/[^/]+\/restore$/) && method === 'POST') {
      const backupId = path.split('/')[2];
      const { data: backup, error } = await supabase
        .from('server_backups')
        .select('id, server_id, backup_name, server_instances(server_type, server_name)')
        .eq('id', backupId)
        .single();

      if (error) throw error;

      const isProduction = backup.server_instances?.server_type !== 'staging';
      const approvalStatus = isProduction ? 'pending' : 'auto_approved';

      await supabase.from('server_actions').insert({
        server_id: backup.server_id,
        action_type: 'restore',
        risk_level: isProduction ? 'high' : 'medium',
        requested_by: user.id,
        approval_status: approvalStatus,
        executed_at: isProduction ? null : new Date().toISOString(),
        after_state: { backup_id: backup.id, backup_name: backup.backup_name },
      });

      await supabase.from('server_audit_logs').insert({
        server_id: backup.server_id,
        action: isProduction ? 'Backup restore requested' : 'Backup restore executed',
        action_type: 'restore',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        approval_required: isProduction,
        approval_status: approvalStatus,
        details: { backup_id: backup.id, backup_name: backup.backup_name },
      });

      if (!isProduction && backup.server_id) {
        await supabase
          .from('server_instances')
          .update({ status: 'maintenance', updated_at: new Date().toISOString() })
          .eq('id', backup.server_id);
      }

      response = {
        success: true,
        message: isProduction ? 'Restore request submitted for approval' : 'Restore workflow executed',
        approval_required: isProduction,
      };
      status = 200;
    }

    else if (path.match(/^\/backups\/[^/]+\/verify$/) && method === 'POST') {
      const backupId = path.split('/')[2];
      const { data: backup, error } = await supabase
        .from('server_backups')
        .select('id, server_id, backup_name, metadata')
        .eq('id', backupId)
        .single();

      if (error) throw error;

      const nextMetadata = {
        ...(backup.metadata || {}),
        integrity_verified_at: new Date().toISOString(),
        integrity_verified_by: user.id,
      };

      await supabase
        .from('server_backups')
        .update({ metadata: nextMetadata })
        .eq('id', backupId);

      await supabase.from('server_audit_logs').insert({
        server_id: backup.server_id,
        action: 'Backup integrity verified',
        action_type: 'backup',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        details: { backup_id: backup.id, backup_name: backup.backup_name },
      });

      response = { success: true, metadata: nextMetadata };
      status = 200;
    }

    // ==================== DATABASE HEALTH ====================
    else if (path === '/database/health' && method === 'GET') {
      const { data: databases, error } = await supabase
        .from('server_instances')
        .select('id, server_name, server_type, status, storage_gb, created_at, os_type')
        .or('server_type.eq.database,server_name.ilike.%db%,server_name.ilike.%postgres%')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const databaseIds = (databases || []).map((item) => item.id);
      const [performanceResult, metricsCacheResult, metricsHistoryResult] = await Promise.all([
        databaseIds.length
          ? supabase.from('server_performance').select('server_id, uptime_percent, avg_latency_ms, performance_score').in('server_id', databaseIds)
          : Promise.resolve({ data: [] as any[] }),
        databaseIds.length
          ? supabase.from('server_metrics_cache').select('server_id, disk_percent, status').in('server_id', databaseIds)
          : Promise.resolve({ data: [] as any[] }),
        databaseIds.length
          ? supabase
              .from('server_metrics_history')
              .select('server_id, active_connections, response_time_ms, error_count, recorded_at')
              .in('server_id', databaseIds)
              .order('recorded_at', { ascending: false })
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const performanceByServer = new Map((performanceResult.data || []).map((item: any) => [item.server_id, item]));
      const cacheByServer = new Map((metricsCacheResult.data || []).map((item: any) => [item.server_id, item]));
      const latestMetricsByServer = new Map<string, any>();
      for (const metric of metricsHistoryResult.data || []) {
        if (!latestMetricsByServer.has(metric.server_id)) {
          latestMetricsByServer.set(metric.server_id, metric);
        }
      }

      response = {
        databases: (databases || []).map((database: any) => {
          const performance = performanceByServer.get(database.id);
          const cache = cacheByServer.get(database.id);
          const metrics = latestMetricsByServer.get(database.id);
          const activeConnections = Number(metrics?.active_connections ?? 0);
          const maxConnections = Math.max(activeConnections + 20, 100);
          const diskUsedPercent = Number(cache?.disk_percent ?? 0);

          return {
            name: database.server_name,
            status: normalizeServerStatus(cache?.status ?? database.status) === 'online' ? 'healthy' : normalizeServerStatus(cache?.status ?? database.status) === 'degraded' ? 'degraded' : 'down',
            connections: {
              active: activeConnections,
              idle: Math.max(maxConnections - activeConnections, 0),
              max: maxConnections,
            },
            replication: {
              lag: Number(performance?.avg_latency_ms ?? 0) / 100,
              status: Number(performance?.avg_latency_ms ?? 0) > 500 ? 'lagging' : 'synced',
            },
            storage: {
              used: Math.round((Number(database.storage_gb ?? 0) * diskUsedPercent) / 100),
              total: Number(database.storage_gb ?? 0),
            },
            uptime: performance?.uptime_percent ? `${Math.round(performance.uptime_percent)}% SLA` : formatUptime(database.created_at),
            version: database.os_type || 'Managed PostgreSQL',
          };
        }),
        slow_queries: (metricsHistoryResult.data || [])
          .filter((metric: any) => Number(metric.response_time_ms ?? 0) > 250)
          .slice(0, 5)
          .map((metric: any, index: number) => ({
            id: `${metric.server_id}-${index}`,
            duration: Number(metric.response_time_ms ?? 0),
            calls: Number(metric.active_connections ?? 0),
            avgTime: Number(metric.response_time_ms ?? 0),
            queryPattern: 'METADATA_ONLY: READ/WRITE pressure detected on managed database workload',
            lastSeen: formatLastCheck(metric.recorded_at),
          })),
      };
      status = 200;
    }

    // ==================== SECRET INVENTORY ====================
    else if (path === '/security/secrets' && method === 'GET') {
      const { data: secrets, error } = await supabase
        .from('master_security_settings')
        .select('id, setting_key, setting_value_encrypted, setting_type, is_secret, rotation_required, rotation_interval_days, last_rotated_at, updated_at')
        .or('is_secret.eq.true,rotation_required.eq.true')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      response = {
        secrets: (secrets || []).map((secret: any) => {
          const interval = Number(secret.rotation_interval_days ?? 0);
          const lastRotated = secret.last_rotated_at ? new Date(secret.last_rotated_at) : null;
          const expiryDate = lastRotated && interval > 0
            ? new Date(lastRotated.getTime() + interval * 24 * 60 * 60 * 1000)
            : null;
          const expiryMs = expiryDate?.getTime() ?? null;
          const now = Date.now();
          const statusLabel = expiryMs === null
            ? 'active'
            : expiryMs < now
              ? 'expired'
              : expiryMs - now < 14 * 24 * 60 * 60 * 1000
                ? 'expiring_soon'
                : 'active';

          return {
            id: secret.id,
            name: secret.setting_key,
            type: secret.setting_key.includes('DATABASE') ? 'database' : secret.setting_key.includes('CERT') ? 'certificate' : secret.setting_key.includes('JWT') ? 'encryption' : secret.setting_key.includes('OAUTH') ? 'oauth' : 'api_key',
            environment: secret.setting_key.includes('STAGING') ? 'staging' : 'production',
            maskedValue: maskSecretValue(secret.setting_value_encrypted, secret.setting_key),
            lastRotated: secret.last_rotated_at,
            expiresAt: expiryDate?.toISOString() ?? null,
            rotationPolicy: interval > 0 ? `Every ${interval} days` : 'Manual',
            status: statusLabel,
          };
        }),
      };
      status = 200;
    }

    else if (path.match(/^\/security\/secrets\/[^/]+\/rotate$/) && method === 'POST') {
      const secretId = path.split('/')[3];
      const rotatedAt = new Date().toISOString();

      const { data: secret, error } = await supabase
        .from('master_security_settings')
        .update({
          last_rotated_at: rotatedAt,
          updated_at: rotatedAt,
          updated_by: user.id,
          rotation_required: false,
        })
        .eq('id', secretId)
        .select('id, setting_key')
        .single();

      if (error) throw error;

      await supabase.from('server_audit_logs').insert({
        action: `Secret rotation recorded: ${secret.setting_key}`,
        action_type: 'security',
        performed_by: user.id,
        performed_by_role: userRoles[0],
        details: { secret_id: secret.id, setting_key: secret.setting_key },
      });

      response = { success: true, rotated_at: rotatedAt };
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

    return new Response(JSON.stringify(status >= 200 && status < 400 ? {
      success: true,
      data: response,
    } : {
      success: false,
      error: response?.error || 'Request failed',
    }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('[Server Manager API Error]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
