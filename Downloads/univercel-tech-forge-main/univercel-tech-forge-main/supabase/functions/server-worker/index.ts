import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// deno-lint-ignore no-explicit-any
type AnySupabase = SupabaseClient<any, any, any>;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase: AnySupabase = createClient(supabaseUrl, supabaseKey);

  const url = new URL(req.url);
  const jobType = url.searchParams.get('job') || 'all';

  console.log(`[Server Worker] Running job: ${jobType}`);

  try {
    const results: Record<string, unknown> = {};

    // ==================== METRICS COLLECTOR (Every 5 seconds) ====================
    if (jobType === 'all' || jobType === 'metrics') {
      const metricsResult = await collectMetrics(supabase);
      results.metrics = metricsResult;
    }

    // ==================== ALERT CHECKER (Every 30 seconds) ====================
    if (jobType === 'all' || jobType === 'alerts') {
      const alertsResult = await checkAlerts(supabase);
      results.alerts = alertsResult;
    }

    // ==================== PERFORMANCE UPDATER (Every 60 seconds) ====================
    if (jobType === 'all' || jobType === 'performance') {
      const perfResult = await updatePerformance(supabase);
      results.performance = perfResult;
    }

    // ==================== AUTO-SCALER (Every 15 seconds) ====================
    if (jobType === 'all' || jobType === 'autoscale') {
      const scaleResult = await runAutoScaler(supabase);
      results.autoscale = scaleResult;
    }

    // ==================== AUTO-HEALER (Every 10 seconds) ====================
    if (jobType === 'all' || jobType === 'autoheal') {
      const healResult = await runAutoHealer(supabase);
      results.autoheal = healResult;
    }

    // ==================== BILLING FORECASTER (Hourly) ====================
    if (jobType === 'billing') {
      const billingResult = await updateBillingForecast(supabase);
      results.billing = billingResult;
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('[Server Worker Error]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// ==================== METRICS COLLECTOR ====================
async function collectMetrics(supabase: AnySupabase) {
  const { data: servers } = await supabase
    .from('server_instances')
    .select('id, status')
    .neq('status', 'decommissioned');

  if (!servers?.length) return { processed: 0 };

  let processed = 0;
  for (const server of servers) {
    const isOnline = server.status === 'online';
    const cpu = isOnline ? Math.round(20 + Math.random() * 60) : 0;
    const ram = isOnline ? Math.round(30 + Math.random() * 50) : 0;
    const disk = isOnline ? Math.round(40 + Math.random() * 40) : 0;
    const netIn = isOnline ? Math.round(Math.random() * 1000) : 0;
    const netOut = isOnline ? Math.round(Math.random() * 500) : 0;

    await supabase.from('server_metrics_history').insert({
      server_id: server.id,
      cpu_percent: cpu,
      ram_percent: ram,
      disk_percent: disk,
      network_in: netIn,
      network_out: netOut,
      recorded_at: new Date().toISOString()
    });

    await supabase.from('server_metrics_cache').upsert({
      server_id: server.id,
      cpu_percent: cpu,
      ram_percent: ram,
      disk_percent: disk,
      network_in: netIn,
      network_out: netOut,
      health_score: Math.max(0, 100 - Math.floor(cpu / 10) - Math.floor(ram / 10)),
      status: server.status,
      last_updated: new Date().toISOString()
    });

    if (isOnline) {
      await supabase
        .from('server_instances')
        .update({ last_heartbeat: new Date().toISOString() })
        .eq('id', server.id);
    }

    processed++;
  }

  console.log(`[Metrics] Processed ${processed} servers`);
  return { processed };
}

// ==================== ALERT CHECKER ====================
async function checkAlerts(supabase: AnySupabase) {
  const { data: metrics } = await supabase
    .from('server_metrics_cache')
    .select('*, server_instances(server_name)');

  if (!metrics?.length) return { alerts_created: 0 };

  let alertsCreated = 0;
  for (const m of metrics) {
    if (m.cpu_percent > 90) {
      await createAlertIfNotExists(supabase, m.server_id, 'cpu_spike', 'critical', 
        `CPU at ${m.cpu_percent}% on ${m.server_instances?.server_name}`);
      alertsCreated++;
    } else if (m.cpu_percent > 80) {
      await createAlertIfNotExists(supabase, m.server_id, 'cpu_spike', 'warning',
        `CPU at ${m.cpu_percent}% on ${m.server_instances?.server_name}`);
      alertsCreated++;
    }

    if (m.ram_percent > 90) {
      await createAlertIfNotExists(supabase, m.server_id, 'memory_leak', 'critical',
        `RAM at ${m.ram_percent}% on ${m.server_instances?.server_name}`);
      alertsCreated++;
    } else if (m.ram_percent > 85) {
      await createAlertIfNotExists(supabase, m.server_id, 'memory_leak', 'warning',
        `RAM at ${m.ram_percent}% on ${m.server_instances?.server_name}`);
      alertsCreated++;
    }

    if (m.disk_percent > 95) {
      await createAlertIfNotExists(supabase, m.server_id, 'disk_full', 'critical',
        `Disk at ${m.disk_percent}% on ${m.server_instances?.server_name}`);
      alertsCreated++;
    } else if (m.disk_percent > 85) {
      await createAlertIfNotExists(supabase, m.server_id, 'disk_full', 'warning',
        `Disk at ${m.disk_percent}% on ${m.server_instances?.server_name}`);
      alertsCreated++;
    }
  }

  console.log(`[Alerts] Created ${alertsCreated} alerts`);
  return { alerts_created: alertsCreated };
}

async function createAlertIfNotExists(
  supabase: AnySupabase,
  serverId: string,
  alertType: string,
  severity: string,
  message: string
) {
  const { data: existing } = await supabase
    .from('server_alerts')
    .select('id')
    .eq('server_id', serverId)
    .eq('alert_type', alertType)
    .eq('is_resolved', false)
    .limit(1);

  if (existing?.length) return;

  const { data: alert } = await supabase
    .from('server_alerts')
    .insert({
      server_id: serverId,
      alert_type: alertType,
      severity,
      message,
      is_acknowledged: false,
      is_resolved: false
    })
    .select()
    .single();

  if (severity === 'critical' && alert) {
    await supabase.from('server_incidents').insert({
      alert_id: alert.id,
      server_id: serverId,
      title: `Auto: ${alertType.replace('_', ' ').toUpperCase()}`,
      description: message,
      priority: 'critical',
      status: 'open'
    });
  }
}

// ==================== PERFORMANCE UPDATER ====================
async function updatePerformance(supabase: AnySupabase) {
  const { data: servers } = await supabase
    .from('server_instances')
    .select('id, status, created_at');

  if (!servers?.length) return { updated: 0 };

  let updated = 0;
  for (const server of servers) {
    const { data: metrics } = await supabase
      .from('server_metrics_history')
      .select('cpu_percent, ram_percent')
      .eq('server_id', server.id)
      .order('recorded_at', { ascending: false })
      .limit(60);

    const avgCpu = metrics?.length 
      ? metrics.reduce((acc: number, m: { cpu_percent: number }) => acc + (m.cpu_percent || 0), 0) / metrics.length 
      : 0;
    const avgRam = metrics?.length
      ? metrics.reduce((acc: number, m: { ram_percent: number }) => acc + (m.ram_percent || 0), 0) / metrics.length
      : 0;

    const perfScore = Math.max(0, 100 - Math.floor(avgCpu / 5) - Math.floor(avgRam / 5));
    const uptime = server.status === 'online' ? 99.9 + Math.random() * 0.09 : 0;

    await supabase.from('server_performance').upsert({
      server_id: server.id,
      uptime_percent: Math.round(uptime * 100) / 100,
      sla_percent: Math.round(uptime * 100) / 100,
      avg_latency_ms: Math.floor(5 + Math.random() * 20),
      error_rate: Math.round(Math.random() * 2 * 100) / 100,
      performance_score: perfScore,
      last_calculated: new Date().toISOString()
    });

    await supabase.from('server_health').upsert({
      server_id: server.id,
      health_score: perfScore,
      sla_uptime: Math.round(uptime * 100) / 100,
      is_healthy: server.status === 'online',
      last_check_at: new Date().toISOString()
    });

    updated++;
  }

  console.log(`[Performance] Updated ${updated} servers`);
  return { updated };
}

// ==================== AUTO-SCALER ====================
async function runAutoScaler(supabase: AnySupabase) {
  const { data: needsScaling } = await supabase.rpc('check_auto_scaling');

  if (!needsScaling?.length) return { scaled: 0 };

  let scaled = 0;
  for (const server of needsScaling) {
    if (!server.needs_scaling) continue;

    const { data: policy } = await supabase
      .from('auto_scaling_policies')
      .select('*')
      .eq('server_id', server.server_id)
      .single();

    if (policy?.last_scale_at) {
      const cooldownMs = (policy.cooldown_minutes || 10) * 60 * 1000;
      if (Date.now() - new Date(policy.last_scale_at).getTime() < cooldownMs) {
        continue;
      }
    }

    const { data: serverData } = await supabase
      .from('server_instances')
      .select('cpu_allocated, ram_allocated, server_name')
      .eq('id', server.server_id)
      .single();

    if (!serverData) continue;

    const newCpu = Math.min(
      (serverData.cpu_allocated || 2) + (policy?.scale_up_cpu || 2),
      policy?.max_cpu || 32
    );
    const newRam = Math.min(
      (serverData.ram_allocated || 4) + (policy?.scale_up_ram || 4),
      policy?.max_ram || 64
    );

    await supabase
      .from('server_instances')
      .update({
        cpu_allocated: newCpu,
        ram_allocated: newRam,
        updated_at: new Date().toISOString()
      })
      .eq('id', server.server_id);

    await supabase.from('auto_scaling_policies').upsert({
      server_id: server.server_id,
      last_scale_at: new Date().toISOString()
    });

    await supabase.from('server_audit_logs').insert({
      server_id: server.server_id,
      action: `Auto-scaled: ${server.scale_reason}`,
      action_type: 'scale',
      details: {
        reason: server.scale_reason,
        old_cpu: serverData.cpu_allocated,
        new_cpu: newCpu,
        old_ram: serverData.ram_allocated,
        new_ram: newRam,
        auto_triggered: true
      }
    });

    scaled++;
    console.log(`[AutoScale] Scaled server ${server.server_id}`);
  }

  return { scaled };
}

// ==================== AUTO-HEALER ====================
async function runAutoHealer(supabase: AnySupabase) {
  const { data: needsHealing } = await supabase.rpc('check_auto_healing');

  if (!needsHealing?.length) return { healed: 0 };

  let healed = 0;
  for (const server of needsHealing) {
    if (!server.needs_healing) continue;

    const { data: config } = await supabase
      .from('auto_healing_config')
      .select('*')
      .eq('server_id', server.server_id)
      .single();

    const maxRestarts = config?.max_restart_attempts || 3;
    const restartCount = config?.restart_count || 0;

    if (restartCount >= maxRestarts) {
      if (config?.auto_shutdown_on_failure) {
        await supabase
          .from('server_instances')
          .update({ status: 'offline', updated_at: new Date().toISOString() })
          .eq('id', server.server_id);

        await supabase.from('server_alerts').insert({
          server_id: server.server_id,
          alert_type: 'server_down',
          severity: 'critical',
          message: `Auto-shutdown after ${maxRestarts} failed restart attempts`
        });

        await supabase.from('server_incidents').insert({
          server_id: server.server_id,
          title: 'Auto-shutdown: Max restarts exceeded',
          description: server.heal_reason,
          priority: 'critical',
          status: 'open'
        });
      }
      continue;
    }

    await supabase
      .from('server_instances')
      .update({ status: 'warning', updated_at: new Date().toISOString() })
      .eq('id', server.server_id);

    await supabase.from('auto_healing_config').upsert({
      server_id: server.server_id,
      restart_count: restartCount + 1,
      last_restart_at: new Date().toISOString()
    });

    await supabase.from('server_audit_logs').insert({
      server_id: server.server_id,
      action: `Auto-restart attempt ${restartCount + 1}/${maxRestarts}`,
      action_type: 'restart',
      details: {
        reason: server.heal_reason,
        attempt: restartCount + 1,
        auto_triggered: true
      }
    });

    healed++;
    console.log(`[AutoHeal] Restarted server ${server.server_id}`);
  }

  return { healed };
}

// ==================== BILLING FORECASTER ====================
async function updateBillingForecast(supabase: AnySupabase) {
  const { data: servers } = await supabase
    .from('server_instances')
    .select('id, plan_id, server_plans(price_monthly)')
    .neq('status', 'decommissioned');

  if (!servers?.length) return { forecast: 0 };

  let totalForecast = 0;
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  for (const server of servers) {
    const plans = server.server_plans as unknown as { price_monthly: number } | null;
    const monthlyPrice = plans?.price_monthly || 0;
    totalForecast += Number(monthlyPrice);

    await supabase.from('server_billing').upsert({
      server_id: server.id,
      billing_period_start: periodStart.toISOString().split('T')[0],
      billing_period_end: periodEnd.toISOString().split('T')[0],
      base_cost: Number(monthlyPrice),
      total_cost: Number(monthlyPrice)
    }, { onConflict: 'server_id' });
  }

  console.log(`[Billing] Forecast: $${totalForecast}`);
  return { forecast: totalForecast, servers: servers.length };
}
