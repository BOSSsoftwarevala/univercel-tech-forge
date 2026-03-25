// ==============================================
// System Monitoring & Alerting API
// Post-Deployment Monitoring for SOFTWARE VALA
// ==============================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Monitoring thresholds
const THRESHOLDS = {
  LATENCY_WARNING: 500,    // ms
  LATENCY_CRITICAL: 2000,  // ms
  ERROR_RATE_WARNING: 0.05, // 5%
  ERROR_RATE_CRITICAL: 0.15, // 15%
  UPTIME_WARNING: 99.5,    // %
  UPTIME_CRITICAL: 95.0,   // %
  PENDING_TX_WARNING: 50,
  PENDING_TX_CRITICAL: 200,
  FRAUD_SCORE_WARNING: 60,
  FRAUD_SCORE_CRITICAL: 80,
};

// Escalation targets
const ESCALATION_TARGETS = {
  critical: 'super_admin',      // 👑 BOSS
  fraud: 'legal_compliance',    // Incident center
  downtime: 'performance_manager', // Crisis response
  financial: 'finance_manager',
  security: 'admin',
};

// Generate masked monitor ID
function getMonitorMaskedId(): string {
  return `SYS-MON-${Date.now().toString(36).toUpperCase()}`;
}

// Measure endpoint response time
async function measureEndpoint(url: string, timeout = 5000): Promise<{
  responseTime: number;
  status: 'operational' | 'degraded' | 'outage';
  statusCode?: number;
}> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    const responseTime = performance.now() - start;
    
    if (!response.ok) {
      return { responseTime, status: 'degraded', statusCode: response.status };
    }
    
    if (responseTime > THRESHOLDS.LATENCY_CRITICAL) {
      return { responseTime, status: 'degraded', statusCode: response.status };
    }
    
    return { responseTime, status: 'operational', statusCode: response.status };
  } catch (error) {
    const responseTime = performance.now() - start;
    return { responseTime, status: 'outage' };
  }
}

// Create escalation alert
async function createEscalationAlert(
  supabase: any,
  alertType: string,
  severity: 'warning' | 'critical' | 'emergency',
  details: Record<string, any>,
  targetRole?: string
) {
  const role = targetRole || (severity === 'emergency' ? ESCALATION_TARGETS.critical : 
    alertType.includes('fraud') ? ESCALATION_TARGETS.fraud :
    alertType.includes('downtime') ? ESCALATION_TARGETS.downtime :
    alertType.includes('financial') ? ESCALATION_TARGETS.financial :
    ESCALATION_TARGETS.security);

  const priority = severity === 'emergency' ? 'critical' : severity === 'critical' ? 'high' : 'medium';

  await supabase.from('buzzer_queue').insert({
    trigger_type: `monitor_${alertType}`,
    priority,
    role_target: role,
    status: 'pending',
    auto_escalate_after: severity === 'emergency' ? 60 : severity === 'critical' ? 120 : 300,
  });

  // Also log to audit for permanent record
  await supabase.from('audit_logs').insert({
    module: 'system_monitor',
    action: `alert_${alertType}`,
    meta_json: {
      masked_id: getMonitorMaskedId(),
      severity,
      target_role: role,
      ...details,
      timestamp: new Date().toISOString(),
    },
  });

  console.log(`[MONITOR] Alert created: ${alertType} (${severity}) -> ${role}`);
}

// Log monitoring event with masked identity
async function logMonitorEvent(
  supabase: any,
  eventType: string,
  details: Record<string, any>
) {
  await supabase.from('audit_logs').insert({
    module: 'system_monitor',
    action: eventType,
    meta_json: {
      masked_id: getMonitorMaskedId(),
      ...details,
      timestamp: new Date().toISOString(),
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const url = new URL(req.url);
  const path = url.pathname.replace('/api-monitor', '');

  console.log(`[MONITOR API] ${req.method} ${path}`);

  try {
    // ========================================
    // GET /pulse - Quick health pulse (public)
    // ========================================
    if (path === '/pulse' && req.method === 'GET') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const dbCheck = await measureEndpoint(`${supabaseUrl}/rest/v1/`);
      
      return new Response(JSON.stringify({
        status: dbCheck.status,
        latency: Math.round(dbCheck.responseTime),
        timestamp: new Date().toISOString(),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /uptime - Uptime monitoring
    // ========================================
    if (path === '/uptime' && req.method === 'GET') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      
      const services = [
        { name: 'Database API', url: `${supabaseUrl}/rest/v1/` },
        { name: 'Auth Service', url: `${supabaseUrl}/auth/v1/health` },
        { name: 'Storage', url: `${supabaseUrl}/storage/v1/` },
        { name: 'Realtime', url: `${supabaseUrl}/realtime/v1/` },
      ];

      const results = await Promise.all(
        services.map(async (svc) => {
          const result = await measureEndpoint(svc.url);
          return { ...svc, ...result };
        })
      );

      const operational = results.filter(r => r.status === 'operational').length;
      const degraded = results.filter(r => r.status === 'degraded').length;
      const outage = results.filter(r => r.status === 'outage').length;
      
      const uptimePercent = (operational / results.length) * 100;
      const avgLatency = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

      // Check for alerts
      if (outage > 0) {
        await createEscalationAlert(supabase, 'downtime_outage', 'emergency', {
          services_down: results.filter(r => r.status === 'outage').map(r => r.name),
        });
      } else if (uptimePercent < THRESHOLDS.UPTIME_CRITICAL) {
        await createEscalationAlert(supabase, 'downtime_critical', 'critical', {
          uptime_percent: uptimePercent,
        });
      }

      await logMonitorEvent(supabase, 'uptime_check', {
        operational, degraded, outage,
        uptime_percent: uptimePercent,
        avg_latency: avgLatency,
      });

      return new Response(JSON.stringify({
        success: true,
        data: {
          overall_status: outage > 0 ? 'outage' : degraded > 0 ? 'degraded' : 'operational',
          uptime_percent: uptimePercent.toFixed(2),
          avg_latency_ms: Math.round(avgLatency),
          services: results.map(r => ({
            name: r.name,
            status: r.status,
            latency_ms: Math.round(r.responseTime),
          })),
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /latency - Latency tracking
    // ========================================
    if (path === '/latency' && req.method === 'GET') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      
      const endpoints = [
        { name: 'api-wallet', url: `${supabaseUrl}/functions/v1/api-wallet` },
        { name: 'api-chat', url: `${supabaseUrl}/functions/v1/api-chat` },
        { name: 'api-leads', url: `${supabaseUrl}/functions/v1/api-leads` },
        { name: 'api-demos', url: `${supabaseUrl}/functions/v1/api-demos` },
        { name: 'api-health', url: `${supabaseUrl}/functions/v1/api-health` },
      ];

      const results = await Promise.all(
        endpoints.map(async (ep) => {
          const result = await measureEndpoint(ep.url);
          return { ...ep, ...result };
        })
      );

      const criticalLatency = results.filter(r => r.responseTime > THRESHOLDS.LATENCY_CRITICAL);
      if (criticalLatency.length > 0) {
        await createEscalationAlert(supabase, 'latency_critical', 'warning', {
          slow_endpoints: criticalLatency.map(r => ({ name: r.name, latency: r.responseTime })),
        });
      }

      return new Response(JSON.stringify({
        success: true,
        data: {
          endpoints: results.map(r => ({
            name: r.name,
            latency_ms: Math.round(r.responseTime),
            status: r.responseTime > THRESHOLDS.LATENCY_CRITICAL ? 'slow' : 
                   r.responseTime > THRESHOLDS.LATENCY_WARNING ? 'warning' : 'fast',
          })),
          avg_latency_ms: Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length),
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /websocket - WebSocket stability (chat + buzzer)
    // ========================================
    if (path === '/websocket' && req.method === 'GET') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const realtimeCheck = await measureEndpoint(`${supabaseUrl}/realtime/v1/`);

      // Check active chat connections
      const { count: activeChats } = await supabase
        .from('chat_user_status')
        .select('*', { count: 'exact', head: true })
        .eq('is_online', true);

      // Check pending buzzers
      const { count: pendingBuzzers } = await supabase
        .from('buzzer_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const wsStatus = realtimeCheck.status;
      
      if (wsStatus === 'outage') {
        await createEscalationAlert(supabase, 'websocket_outage', 'emergency', {
          service: 'realtime',
          active_chats: activeChats || 0,
          pending_buzzers: pendingBuzzers || 0,
        });
      }

      await logMonitorEvent(supabase, 'websocket_check', {
        status: wsStatus,
        latency: realtimeCheck.responseTime,
        active_chats: activeChats || 0,
        pending_buzzers: pendingBuzzers || 0,
      });

      return new Response(JSON.stringify({
        success: true,
        data: {
          realtime_status: wsStatus,
          realtime_latency_ms: Math.round(realtimeCheck.responseTime),
          active_chat_connections: activeChats || 0,
          pending_buzzer_alerts: pendingBuzzers || 0,
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /wallet-audit - Wallet transaction auditing
    // ========================================
    if (path === '/wallet-audit' && req.method === 'GET') {
      // Check pending transactions across all wallet tables
      const [
        { count: pendingPayouts },
        { count: pendingUnified },
        { count: pendingDev },
      ] = await Promise.all([
        supabase.from('payout_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('unified_wallet_transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('developer_wallet_transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      const totalPending = (pendingPayouts || 0) + (pendingUnified || 0) + (pendingDev || 0);

      // Check for suspicious patterns - large pending amounts
      const { data: largePending } = await supabase
        .from('payout_requests')
        .select('amount, user_id')
        .eq('status', 'pending')
        .gt('amount', 50000)
        .limit(10);

      if (totalPending > THRESHOLDS.PENDING_TX_CRITICAL) {
        await createEscalationAlert(supabase, 'financial_backlog', 'critical', {
          pending_transactions: totalPending,
        }, ESCALATION_TARGETS.financial);
      } else if (totalPending > THRESHOLDS.PENDING_TX_WARNING) {
        await createEscalationAlert(supabase, 'financial_warning', 'warning', {
          pending_transactions: totalPending,
        }, ESCALATION_TARGETS.financial);
      }

      if (largePending && largePending.length > 3) {
        await createEscalationAlert(supabase, 'large_pending_payouts', 'warning', {
          count: largePending.length,
          amounts: largePending.map(p => p.amount),
        }, ESCALATION_TARGETS.financial);
      }

      await logMonitorEvent(supabase, 'wallet_audit', {
        pending_payouts: pendingPayouts || 0,
        pending_unified: pendingUnified || 0,
        pending_dev: pendingDev || 0,
        total_pending: totalPending,
      });

      return new Response(JSON.stringify({
        success: true,
        data: {
          pending_payouts: pendingPayouts || 0,
          pending_unified_transactions: pendingUnified || 0,
          pending_developer_transactions: pendingDev || 0,
          total_pending: totalPending,
          status: totalPending > THRESHOLDS.PENDING_TX_CRITICAL ? 'critical' :
                  totalPending > THRESHOLDS.PENDING_TX_WARNING ? 'warning' : 'healthy',
          large_pending_count: largePending?.length || 0,
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /demo-health - Demo uptime alerting
    // ========================================
    if (path === '/demo-health' && req.method === 'GET') {
      const { data: demos, count: totalDemos } = await supabase
        .from('demos')
        .select('id, name, status, health_score, category', { count: 'exact' })
        .eq('status', 'active');

      const unhealthyDemos = demos?.filter((d: any) => d.health_score < 50) || [];
      const criticalDemos = demos?.filter((d: any) => d.health_score < 25) || [];

      if (criticalDemos.length > 0) {
        await createEscalationAlert(supabase, 'demo_critical', 'critical', {
          critical_demos: criticalDemos.map((d: any) => ({ id: d.id, name: d.name, score: d.health_score })),
        });
      }

      const categoryBreakdown = demos?.reduce((acc: any, d: any) => {
        acc[d.category] = (acc[d.category] || 0) + 1;
        return acc;
      }, {}) || {};

      await logMonitorEvent(supabase, 'demo_health_check', {
        total_demos: totalDemos || 0,
        unhealthy_count: unhealthyDemos.length,
        critical_count: criticalDemos.length,
      });

      return new Response(JSON.stringify({
        success: true,
        data: {
          total_active_demos: totalDemos || 0,
          healthy_demos: (totalDemos || 0) - unhealthyDemos.length,
          unhealthy_demos: unhealthyDemos.length,
          critical_demos: criticalDemos.length,
          category_breakdown: categoryBreakdown,
          avg_health_score: demos?.length ? 
            (demos.reduce((sum: number, d: any) => sum + (d.health_score || 0), 0) / demos.length).toFixed(1) : 0,
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /fraud-sla - Fraud and SLA automatic alerts
    // ========================================
    if (path === '/fraud-sla' && req.method === 'GET') {
      // Check fraud detection alerts
      const { data: fraudAlerts, count: fraudCount } = await supabase
        .from('ai_fraud_detection')
        .select('*', { count: 'exact' })
        .eq('is_resolved', false)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Check high-risk users
      const { data: highRiskUsers } = await supabase
        .from('risk_scores')
        .select('user_id, current_score, risk_level')
        .gt('current_score', THRESHOLDS.FRAUD_SCORE_CRITICAL);

      // Check SLA breaches in tasks
      const { data: slaBreaches, count: slaCount } = await supabase
        .from('promise_logs')
        .select('*', { count: 'exact' })
        .eq('status', 'breached')
        .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Check commission fraud
      const { data: commissionFraud } = await supabase
        .from('commission_fraud_detection')
        .select('*')
        .eq('status', 'flagged')
        .limit(10);

      // Alert for critical fraud
      if (highRiskUsers && highRiskUsers.length > 0) {
        await createEscalationAlert(supabase, 'fraud_high_risk_users', 'critical', {
          count: highRiskUsers.length,
          users: highRiskUsers.map((u: any) => ({ score: u.current_score, level: u.risk_level })),
        }, ESCALATION_TARGETS.fraud);
      }

      // Alert for SLA breaches
      if ((slaCount || 0) > 5) {
        await createEscalationAlert(supabase, 'sla_breach_spike', 'warning', {
          breach_count: slaCount,
        });
      }

      await logMonitorEvent(supabase, 'fraud_sla_check', {
        fraud_alerts: fraudCount || 0,
        high_risk_users: highRiskUsers?.length || 0,
        sla_breaches: slaCount || 0,
        commission_fraud: commissionFraud?.length || 0,
      });

      return new Response(JSON.stringify({
        success: true,
        data: {
          fraud: {
            active_alerts: fraudCount || 0,
            high_risk_users: highRiskUsers?.length || 0,
            commission_fraud_flags: commissionFraud?.length || 0,
          },
          sla: {
            breaches_24h: slaCount || 0,
            recent_breaches: slaBreaches?.slice(0, 5).map((b: any) => ({
              task_id: b.task_id,
              developer_id: b.developer_id?.substring(0, 8) + '***',
              breach_reason: b.breach_reason,
            })) || [],
          },
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /logs - Masked log monitoring
    // ========================================
    if (path === '/logs' && req.method === 'GET') {
      const hours = parseInt(url.searchParams.get('hours') || '24');
      const limit = parseInt(url.searchParams.get('limit') || '100');
      const module = url.searchParams.get('module');

      let query = supabase
        .from('audit_logs')
        .select('*')
        .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (module) {
        query = query.eq('module', module);
      }

      const { data: logs, count } = await query;

      // Mask user IDs in logs
      const maskedLogs = logs?.map((log: any) => ({
        id: log.id,
        timestamp: log.timestamp,
        module: log.module,
        action: log.action,
        role: log.role,
        user_masked: log.user_id ? `USR-${log.user_id.substring(0, 4)}***` : 'SYSTEM',
        meta: log.meta_json,
      })) || [];

      return new Response(JSON.stringify({
        success: true,
        data: {
          logs: maskedLogs,
          total_in_period: count || maskedLogs.length,
          period_hours: hours,
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /api-health - API health checks
    // ========================================
    if (path === '/api-health' && req.method === 'GET') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      
      const apis = [
        'api-auth', 'api-wallet', 'api-chat', 'api-leads', 'api-demos',
        'api-tasks', 'api-health', 'api-users', 'api-backup', 'api-fraud',
      ];

      const results = await Promise.all(
        apis.map(async (api) => {
          const result = await measureEndpoint(`${supabaseUrl}/functions/v1/${api}`);
          return { 
            name: api, 
            ...result,
            healthy: result.status === 'operational',
          };
        })
      );

      const healthyCount = results.filter(r => r.healthy).length;
      const unhealthyApis = results.filter(r => !r.healthy);

      if (unhealthyApis.length > 2) {
        await createEscalationAlert(supabase, 'api_health_critical', 'critical', {
          unhealthy_apis: unhealthyApis.map(a => a.name),
        });
      }

      return new Response(JSON.stringify({
        success: true,
        data: {
          total_apis: apis.length,
          healthy: healthyCount,
          unhealthy: unhealthyApis.length,
          health_percent: ((healthyCount / apis.length) * 100).toFixed(1),
          apis: results.map(r => ({
            name: r.name,
            status: r.status,
            latency_ms: Math.round(r.responseTime),
          })),
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /backup-status - Backup schedule verification
    // ========================================
    if (path === '/backup-status' && req.method === 'GET') {
      // Check last backup from audit logs
      const { data: lastBackup } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('module', 'backup')
        .eq('action', 'backup_completed')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      const lastBackupTime = lastBackup?.timestamp ? new Date(lastBackup.timestamp) : null;
      const hoursSinceBackup = lastBackupTime ? 
        (Date.now() - lastBackupTime.getTime()) / (1000 * 60 * 60) : null;

      // Alert if no backup in 24 hours
      if (!hoursSinceBackup || hoursSinceBackup > 24) {
        await createEscalationAlert(supabase, 'backup_overdue', 'warning', {
          hours_since_backup: hoursSinceBackup?.toFixed(1) || 'never',
        });
      }

      return new Response(JSON.stringify({
        success: true,
        data: {
          last_backup: lastBackupTime?.toISOString() || 'never',
          hours_since_backup: hoursSinceBackup?.toFixed(1) || null,
          status: !hoursSinceBackup ? 'unknown' :
                  hoursSinceBackup > 24 ? 'overdue' :
                  hoursSinceBackup > 12 ? 'warning' : 'healthy',
          backup_schedule: 'daily',
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /errors - Error reporting and crash logs
    // ========================================
    if (path === '/errors' && req.method === 'GET') {
      const hours = parseInt(url.searchParams.get('hours') || '24');

      // Get error logs from audit
      const { data: errors, count: errorCount } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .ilike('action', '%error%')
        .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false })
        .limit(50);

      // Group errors by module
      const errorsByModule = errors?.reduce((acc: any, e: any) => {
        acc[e.module] = (acc[e.module] || 0) + 1;
        return acc;
      }, {}) || {};

      // Alert on error spike
      if ((errorCount || 0) > 100) {
        await createEscalationAlert(supabase, 'error_spike', 'warning', {
          error_count: errorCount,
          period_hours: hours,
        });
      }

      return new Response(JSON.stringify({
        success: true,
        data: {
          total_errors: errorCount || 0,
          period_hours: hours,
          errors_by_module: errorsByModule,
          recent_errors: errors?.slice(0, 10).map((e: any) => ({
            timestamp: e.timestamp,
            module: e.module,
            action: e.action,
          })) || [],
          checked_at: new Date().toISOString(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // GET /full-report - Complete monitoring report
    // ========================================
    if (path === '/full-report' && req.method === 'GET') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';

      // Parallel fetch all monitoring data
      const [
        uptimeResult,
        wsResult,
        { count: errorCount },
        { count: pendingTx },
        { count: activeDemos },
        { count: fraudAlerts },
        { count: slaBreaches },
      ] = await Promise.all([
        measureEndpoint(`${supabaseUrl}/rest/v1/`),
        measureEndpoint(`${supabaseUrl}/realtime/v1/`),
        supabase.from('audit_logs').select('*', { count: 'exact', head: true }).ilike('action', '%error%').gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('payout_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('demos').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('ai_fraud_detection').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
        supabase.from('promise_logs').select('*', { count: 'exact', head: true }).eq('status', 'breached'),
      ]);

      const overallHealth = 
        uptimeResult.status === 'outage' || wsResult.status === 'outage' ? 'critical' :
        uptimeResult.status === 'degraded' || wsResult.status === 'degraded' ? 'degraded' :
        (errorCount || 0) > 50 || (fraudAlerts || 0) > 10 ? 'warning' : 'healthy';

      await logMonitorEvent(supabase, 'full_report_generated', {
        overall_health: overallHealth,
        api_status: uptimeResult.status,
        ws_status: wsResult.status,
      });

      return new Response(JSON.stringify({
        success: true,
        data: {
          overall_health: overallHealth,
          summary: {
            api_status: uptimeResult.status,
            api_latency_ms: Math.round(uptimeResult.responseTime),
            websocket_status: wsResult.status,
            websocket_latency_ms: Math.round(wsResult.responseTime),
            errors_24h: errorCount || 0,
            pending_transactions: pendingTx || 0,
            active_demos: activeDemos || 0,
            fraud_alerts: fraudAlerts || 0,
            sla_breaches: slaBreaches || 0,
          },
          generated_at: new Date().toISOString(),
          generated_by: getMonitorMaskedId(),
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ========================================
    // POST /trigger-check - Manual monitoring trigger
    // ========================================
    if (path === '/trigger-check' && req.method === 'POST') {
      const { checkType } = await req.json();

      await logMonitorEvent(supabase, 'manual_check_triggered', { checkType });

      return new Response(JSON.stringify({
        success: true,
        message: `Manual ${checkType || 'full'} check triggered`,
        timestamp: new Date().toISOString(),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Not found',
    }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[MONITOR API] Error:', errorMessage);
    
    // Log critical errors
    await logMonitorEvent(supabase, 'monitor_error', {
      error: errorMessage,
      path,
    });

    return new Response(JSON.stringify({
      success: false,
      error: 'Monitoring error',
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
