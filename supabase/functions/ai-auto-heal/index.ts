import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { action, data } = await req.json();

    switch (action) {
      // =========================================================================
      // AUTO-DETECTION & CORRECTION
      // =========================================================================
      case 'detect_failures': {
        const failures = await detectSystemFailures(supabase);
        const corrections = await autoCorrectFailures(supabase, failures);
        return jsonResponse({ failures, corrections });
      }

      case 'restart_module': {
        const result = await restartFailedModule(supabase, data.module);
        return jsonResponse({ success: true, result });
      }

      case 'reassign_stuck_tasks': {
        const reassigned = await reassignStuckTasks(supabase);
        return jsonResponse({ reassigned });
      }

      case 'auto_balance_load': {
        const balanceResult = await autoBalanceLoad(supabase);
        return jsonResponse(balanceResult);
      }

      // =========================================================================
      // PREDICTIVE PERFORMANCE OPTIMIZATION
      // =========================================================================
      case 'analyze_patterns': {
        const patterns = await analyzeUsagePatterns(supabase);
        return jsonResponse({ patterns });
      }

      case 'predict_scaling': {
        const prediction = await predictScalingNeeds(supabase, data);
        return jsonResponse({ prediction });
      }

      case 'forecast_wallet_volume': {
        const forecast = await forecastWalletVolume(supabase);
        return jsonResponse({ forecast });
      }

      // =========================================================================
      // SELF-HEALING WORKFLOWS
      // =========================================================================
      case 'heal_system': {
        const healingResult = await runSelfHealing(supabase);
        return jsonResponse(healingResult);
      }

      case 'retry_failed_payouts': {
        const retried = await retryFailedPayouts(supabase);
        return jsonResponse({ retried });
      }

      case 'restore_logs': {
        const restored = await restoreCorruptedLogs(supabase);
        return jsonResponse({ restored });
      }

      case 'reroute_demos': {
        const rerouted = await rerouteDemosUnderDowntime(supabase);
        return jsonResponse({ rerouted });
      }

      // =========================================================================
      // AI-ASSISTED SECURITY
      // =========================================================================
      case 'detect_suspicious': {
        const suspicious = await detectSuspiciousBehavior(supabase);
        return jsonResponse({ suspicious });
      }

      case 'auto_block': {
        const blocked = await autoBlockThreat(supabase, data);
        return jsonResponse({ blocked });
      }

      case 'detect_fraud': {
        const fraud = await detectFraudPatterns(supabase);
        return jsonResponse({ fraud });
      }

      case 'escalate_to_boss': {
        const escalated = await escalateToBoss(supabase, data);
        return jsonResponse({ escalated });
      }

      // =========================================================================
      // AI-GUIDED DEVELOPER ROUTING
      // =========================================================================
      case 'auto_assign_task': {
        const assignment = await autoAssignTask(supabase, data.taskId);
        return jsonResponse({ assignment });
      }

      case 'estimate_time': {
        const estimate = await estimateTaskTime(supabase, data.taskId);
        return jsonResponse({ estimate });
      }

      case 'prioritize_sla': {
        const prioritized = await prioritizeBySLA(supabase);
        return jsonResponse({ prioritized });
      }

      // =========================================================================
      // AUTO-MONITORING
      // =========================================================================
      case 'health_check': {
        const health = await runHealthCheck(supabase);
        return jsonResponse({ health });
      }

      case 'get_metrics': {
        const metrics = await getSystemMetrics(supabase);
        return jsonResponse({ metrics });
      }

      // =========================================================================
      // OPTIMIZATION
      // =========================================================================
      case 'optimize': {
        const optimizations = await runOptimizations(supabase);
        return jsonResponse({ optimizations });
      }

      default:
        return jsonResponse({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    const error = err as Error;
    console.error('AI Auto-Heal Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ============================================================================
// AUTO-DETECTION & CORRECTION
// ============================================================================

async function detectSystemFailures(supabase: any) {
  const failures: any[] = [];

  // Check for stuck tasks (no update in 4+ hours)
  const { data: stuckTasks } = await supabase
    .from('developer_tasks')
    .select('id, title, status, updated_at')
    .eq('status', 'in_progress')
    .lt('updated_at', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString());

  if (stuckTasks?.length) {
    failures.push({ type: 'stuck_tasks', count: stuckTasks.length, items: stuckTasks });
  }

  // Check for failed wallet transactions
  const { data: failedTx } = await supabase
    .from('wallet_transactions')
    .select('id, status, created_at')
    .eq('status', 'failed')
    .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (failedTx?.length) {
    failures.push({ type: 'failed_transactions', count: failedTx.length, items: failedTx });
  }

  // Check for unacknowledged buzzer alerts (stale > 30 min)
  const { data: staleAlerts } = await supabase
    .from('buzzer_queue')
    .select('id, trigger_type, created_at')
    .eq('status', 'pending')
    .lt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString());

  if (staleAlerts?.length) {
    failures.push({ type: 'stale_alerts', count: staleAlerts.length, items: staleAlerts });
  }

  // Check for inactive demos
  const { data: inactiveDemos } = await supabase
    .from('demos')
    .select('id, name, status')
    .eq('status', 'active')
    .eq('is_live', false);

  if (inactiveDemos?.length) {
    failures.push({ type: 'inactive_demos', count: inactiveDemos.length, items: inactiveDemos });
  }

  return failures;
}

async function autoCorrectFailures(supabase: any, failures: any[]) {
  const corrections: any[] = [];

  for (const failure of failures) {
    switch (failure.type) {
      case 'stuck_tasks':
        // Auto-escalate stuck tasks
        for (const task of failure.items.slice(0, 5)) {
          await supabase
            .from('buzzer_queue')
            .insert({
              trigger_type: 'task_stuck_auto',
              role_target: 'task_manager',
              task_id: task.id,
              priority: 'high',
              status: 'pending',
            });
          corrections.push({ type: 'escalated_task', taskId: task.id });
        }
        break;

      case 'failed_transactions':
        // Mark for retry
        for (const tx of failure.items.slice(0, 10)) {
          await supabase
            .from('wallet_transactions')
            .update({ status: 'pending_retry', retry_count: 1 })
            .eq('id', tx.id);
          corrections.push({ type: 'retry_scheduled', txId: tx.id });
        }
        break;

      case 'stale_alerts':
        // Auto-escalate to next level
        for (const alert of failure.items.slice(0, 10)) {
          await supabase
            .from('buzzer_queue')
            .update({ 
              escalation_level: 2, 
              priority: 'critical',
              status: 'escalated'
            })
            .eq('id', alert.id);
          corrections.push({ type: 'alert_escalated', alertId: alert.id });
        }
        break;
    }
  }

  // Log corrections to audit
  if (corrections.length) {
    await supabase.from('audit_logs').insert({
      user_id: null,
      module: 'ai_auto_heal',
      action: 'auto_correction',
      meta_json: { corrections, timestamp: new Date().toISOString() },
    });
  }

  return corrections;
}

async function restartFailedModule(supabase: any, module: string) {
  // Log the restart attempt
  await supabase.from('audit_logs').insert({
    user_id: null,
    module: 'ai_auto_heal',
    action: 'module_restart',
    meta_json: { module, timestamp: new Date().toISOString() },
  });

  // Reset module-specific states
  switch (module) {
    case 'chat':
      await supabase
        .from('chat_user_status')
        .update({ is_online: false, last_seen: new Date().toISOString() })
        .gt('last_seen', new Date(Date.now() - 60 * 60 * 1000).toISOString());
      break;
    case 'buzzer':
      await supabase
        .from('buzzer_queue')
        .update({ status: 'reset' })
        .eq('status', 'processing');
      break;
  }

  return { module, restarted: true };
}

async function reassignStuckTasks(supabase: any) {
  const { data: stuckTasks } = await supabase
    .from('developer_tasks')
    .select('id, developer_id, tech_stack, priority')
    .eq('status', 'in_progress')
    .lt('updated_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString())
    .limit(10);

  const reassigned = [];

  for (const task of stuckTasks || []) {
    // Find available developer with matching skills
    const { data: developers } = await supabase
      .from('developers')
      .select('id, skills, current_workload')
      .neq('id', task.developer_id)
      .eq('is_available', true)
      .lt('current_workload', 3)
      .limit(5);

    if (developers?.length) {
      // Pick developer with lowest workload
      const newDev = developers.sort((a: any, b: any) => a.current_workload - b.current_workload)[0];
      
      await supabase
        .from('developer_tasks')
        .update({ 
          developer_id: newDev.id, 
          status: 'reassigned',
          reassign_reason: 'auto_heal_stuck'
        })
        .eq('id', task.id);

      reassigned.push({ taskId: task.id, newDeveloperId: newDev.id });
    }
  }

  return reassigned;
}

async function autoBalanceLoad(supabase: any) {
  // Get current load metrics
  const { data: loadData } = await supabase
    .from('system_metrics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const actions: any[] = [];

  // Simulate load balancing decisions
  if (loadData?.chat_connections > 500) {
    actions.push({ action: 'scale_chat', reason: 'high_connections', current: loadData.chat_connections });
  }

  if (loadData?.api_latency > 500) {
    actions.push({ action: 'optimize_api', reason: 'high_latency', current: loadData.api_latency });
  }

  if (loadData?.buzzer_queue_size > 100) {
    actions.push({ action: 'prioritize_buzzer', reason: 'queue_backlog', current: loadData.buzzer_queue_size });
  }

  return { currentLoad: loadData, actions };
}

// ============================================================================
// PREDICTIVE PERFORMANCE
// ============================================================================

async function analyzeUsagePatterns(supabase: any) {
  // Get last 7 days of activity
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('module, action, timestamp')
    .gt('timestamp', sevenDaysAgo);

  // Analyze patterns
  const patterns: any = {
    peakHours: [],
    busyModules: {},
    trendsUp: [],
    trendsDown: [],
  };

  if (auditLogs) {
    // Count by hour
    const hourCounts: Record<number, number> = {};
    const moduleCounts: Record<string, number> = {};

    for (const log of auditLogs) {
      const hour = new Date(log.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      moduleCounts[log.module] = (moduleCounts[log.module] || 0) + 1;
    }

    // Find peak hours
    const sortedHours = Object.entries(hourCounts).sort(([, a], [, b]) => b - a);
    patterns.peakHours = sortedHours.slice(0, 3).map(([h]) => parseInt(h));
    patterns.busyModules = moduleCounts;
  }

  return patterns;
}

async function predictScalingNeeds(supabase: any, data: any) {
  const patterns = await analyzeUsagePatterns(supabase);
  const currentHour = new Date().getHours();

  const predictions = {
    needsScaling: patterns.peakHours.includes(currentHour),
    recommendedActions: [] as string[],
    confidence: 0.75,
  };

  if (predictions.needsScaling) {
    predictions.recommendedActions.push('pre_warm_connections');
    predictions.recommendedActions.push('increase_worker_pool');
  }

  return predictions;
}

async function forecastWalletVolume(supabase: any) {
  const { data: recentTx } = await supabase
    .from('wallet_transactions')
    .select('amount, created_at')
    .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const totalVolume = recentTx?.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0) || 0;
  const avgVolume = recentTx?.length ? totalVolume / recentTx.length : 0;

  return {
    last24hVolume: totalVolume,
    transactionCount: recentTx?.length || 0,
    averageAmount: avgVolume,
    projectedNext24h: totalVolume * 1.1, // 10% growth estimate
  };
}

// ============================================================================
// SELF-HEALING WORKFLOWS
// ============================================================================

async function runSelfHealing(supabase: any) {
  const healingActions: any[] = [];

  // 1. Retry failed transactions
  const retriedPayouts = await retryFailedPayouts(supabase);
  healingActions.push({ action: 'retry_payouts', result: retriedPayouts });

  // 2. Reassign stuck tasks
  const reassigned = await reassignStuckTasks(supabase);
  healingActions.push({ action: 'reassign_tasks', result: reassigned });

  // 3. Escalate stale alerts
  await supabase
    .from('buzzer_queue')
    .update({ escalation_level: 2, status: 'escalated' })
    .eq('status', 'pending')
    .lt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

  healingActions.push({ action: 'escalate_alerts', result: 'completed' });

  // 4. Clean up orphaned sessions
  await supabase
    .from('chat_user_status')
    .update({ is_online: false })
    .lt('last_seen', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString());

  healingActions.push({ action: 'cleanup_sessions', result: 'completed' });

  // Log healing run
  await supabase.from('audit_logs').insert({
    user_id: null,
    module: 'ai_auto_heal',
    action: 'self_healing_run',
    meta_json: { actions: healingActions, timestamp: new Date().toISOString() },
  });

  return { success: true, actions: healingActions };
}

async function retryFailedPayouts(supabase: any) {
  const { data: failedPayouts } = await supabase
    .from('payout_requests')
    .select('id, user_id, amount, status')
    .eq('status', 'failed')
    .lt('retry_count', 3)
    .limit(20);

  const retried = [];

  for (const payout of failedPayouts || []) {
    await supabase
      .from('payout_requests')
      .update({ 
        status: 'pending_retry', 
        retry_count: (payout.retry_count || 0) + 1,
        last_retry_at: new Date().toISOString()
      })
      .eq('id', payout.id);

    retried.push({ payoutId: payout.id, amount: payout.amount });
  }

  return retried;
}

async function restoreCorruptedLogs(supabase: any) {
  // Check for gaps in audit logs
  const { data: recentLogs } = await supabase
    .from('audit_logs')
    .select('id, timestamp')
    .order('timestamp', { ascending: false })
    .limit(100);

  // Log restoration attempt
  await supabase.from('audit_logs').insert({
    user_id: null,
    module: 'ai_auto_heal',
    action: 'log_integrity_check',
    meta_json: { checked: recentLogs?.length || 0, timestamp: new Date().toISOString() },
  });

  return { checked: recentLogs?.length || 0, issues: 0 };
}

async function rerouteDemosUnderDowntime(supabase: any) {
  // Find demos with downtime
  const { data: downtimeDemos } = await supabase
    .from('demos')
    .select('id, name, library_id, status')
    .eq('status', 'maintenance');

  const rerouted = [];

  for (const demo of downtimeDemos || []) {
    // Find backup demo in same library
    const { data: backupDemo } = await supabase
      .from('demos')
      .select('id, name')
      .eq('library_id', demo.library_id)
      .eq('status', 'active')
      .neq('id', demo.id)
      .limit(1)
      .single();

    if (backupDemo) {
      // Create redirect record
      await supabase.from('demo_redirects').insert({
        from_demo_id: demo.id,
        to_demo_id: backupDemo.id,
        reason: 'auto_reroute_downtime',
        active: true,
      });

      rerouted.push({ from: demo.id, to: backupDemo.id });
    }
  }

  return rerouted;
}

// ============================================================================
// AI-ASSISTED SECURITY
// ============================================================================

async function detectSuspiciousBehavior(supabase: any) {
  const suspicious: any[] = [];

  // Check for multiple failed logins
  const { data: failedLogins } = await supabase
    .from('audit_logs')
    .select('user_id, meta_json')
    .eq('action', 'login_failed')
    .gt('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString());

  // Group by user
  const loginAttempts: Record<string, number> = {};
  for (const log of failedLogins || []) {
    const key = log.user_id || log.meta_json?.ip;
    loginAttempts[key] = (loginAttempts[key] || 0) + 1;
  }

  // Flag users with 5+ failed attempts
  for (const [key, count] of Object.entries(loginAttempts)) {
    if (count >= 5) {
      suspicious.push({ type: 'brute_force_attempt', identifier: key, attempts: count });
    }
  }

  // Check for unusual IP changes
  const { data: ipChanges } = await supabase
    .from('audit_logs')
    .select('user_id, meta_json')
    .eq('action', 'ip_change')
    .gt('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const ipChangesByUser: Record<string, number> = {};
  for (const log of ipChanges || []) {
    if (log.user_id) {
      ipChangesByUser[log.user_id] = (ipChangesByUser[log.user_id] || 0) + 1;
    }
  }

  for (const [userId, count] of Object.entries(ipChangesByUser)) {
    if (count >= 3) {
      suspicious.push({ type: 'multiple_ip_changes', userId, changes: count });
    }
  }

  return suspicious;
}

async function autoBlockThreat(supabase: any, data: any) {
  const { ip, deviceId, userId, reason } = data;

  // Add to blacklist
  await supabase.from('access_lists').insert({
    list_type: 'blacklist',
    entry_type: ip ? 'ip' : (deviceId ? 'device' : 'user'),
    entry_value: ip || deviceId || userId,
    reason: reason || 'auto_blocked_suspicious_activity',
    is_active: true,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24hr temp block
  });

  // Log the action
  await supabase.from('audit_logs').insert({
    user_id: null,
    module: 'ai_security',
    action: 'auto_block',
    meta_json: { ip, deviceId, userId, reason, timestamp: new Date().toISOString() },
  });

  return { blocked: true, entry: ip || deviceId || userId };
}

async function detectFraudPatterns(supabase: any) {
  const fraudPatterns: any[] = [];

  // Check for unusually high commission claims
  const { data: highCommissions } = await supabase
    .from('commission_claims')
    .select('user_id, amount, created_at')
    .gt('amount', 10000) // Threshold
    .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (highCommissions?.length) {
    fraudPatterns.push({ 
      type: 'high_commission_claims', 
      count: highCommissions.length,
      flagged: highCommissions.map((c: any) => c.user_id)
    });
  }

  // Check for rapid-fire transactions
  const { data: rapidTx } = await supabase
    .from('wallet_transactions')
    .select('user_id, created_at')
    .gt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

  const txByUser: Record<string, number> = {};
  for (const tx of rapidTx || []) {
    txByUser[tx.user_id] = (txByUser[tx.user_id] || 0) + 1;
  }

  for (const [userId, count] of Object.entries(txByUser)) {
    if (count >= 20) { // More than 20 tx/hour
      fraudPatterns.push({ type: 'rapid_transactions', userId, count });
    }
  }

  return fraudPatterns;
}

async function escalateToBoss(supabase: any, data: any) {
  const { reason, severity, details } = data;

  // Create high-priority buzzer alert for super_admin
  await supabase.from('buzzer_queue').insert({
    trigger_type: 'boss_escalation',
    role_target: 'super_admin',
    priority: 'critical',
    status: 'pending',
    region: 'global',
  });

  // Create dedicated alert
  await supabase.from('risk_alerts').insert({
    alert_type: 'boss_escalation',
    severity: severity || 'critical',
    title: reason || 'System Escalation',
    description: JSON.stringify(details),
    status: 'active',
    is_acknowledged: false,
  });

  // Log
  await supabase.from('audit_logs').insert({
    user_id: null,
    module: 'ai_security',
    action: 'escalate_to_boss',
    meta_json: { reason, severity, details, timestamp: new Date().toISOString() },
  });

  return { escalated: true, severity };
}

// ============================================================================
// AI-GUIDED DEVELOPER ROUTING
// ============================================================================

async function autoAssignTask(supabase: any, taskId: string) {
  // Get task details
  const { data: task } = await supabase
    .from('developer_tasks')
    .select('id, title, tech_stack, priority, complexity')
    .eq('id', taskId)
    .single();

  if (!task) return { error: 'Task not found' };

  // Get available developers with matching skills
  const { data: developers } = await supabase
    .from('developers')
    .select(`
      id, 
      skills, 
      current_workload,
      dev_performance (final_score)
    `)
    .eq('is_available', true)
    .lt('current_workload', 5);

  if (!developers?.length) return { error: 'No available developers' };

  // Score developers based on skill match and performance
  const scoredDevs = developers.map((dev: any) => {
    const devSkills = Array.isArray(dev.skills) ? dev.skills : [];
    const taskTech = task.tech_stack || [];
    
    // Calculate skill match
    const skillMatch = taskTech.filter((t: string) => 
      devSkills.some((s: string) => s.toLowerCase().includes(t.toLowerCase()))
    ).length / Math.max(taskTech.length, 1);

    // Get performance score
    const perfScore = dev.dev_performance?.[0]?.final_score || 50;

    // Calculate workload factor (lower workload = higher score)
    const workloadFactor = 1 - (dev.current_workload / 5);

    // Combined score
    const totalScore = (skillMatch * 40) + (perfScore * 0.4) + (workloadFactor * 20);

    return { ...dev, score: totalScore, skillMatch };
  });

  // Sort by score and pick best
  const bestDev = scoredDevs.sort((a: any, b: any) => b.score - a.score)[0];

  // Assign task
  await supabase
    .from('developer_tasks')
    .update({ 
      developer_id: bestDev.id, 
      status: 'assigned',
      assigned_by: 'ai_auto_assign'
    })
    .eq('id', taskId);

  return { 
    taskId, 
    assignedTo: bestDev.id, 
    score: bestDev.score,
    skillMatch: bestDev.skillMatch
  };
}

async function estimateTaskTime(supabase: any, taskId: string) {
  const { data: task } = await supabase
    .from('developer_tasks')
    .select('id, title, complexity, tech_stack')
    .eq('id', taskId)
    .single();

  if (!task) return { error: 'Task not found' };

  // Get historical data for similar tasks
  const { data: similarTasks } = await supabase
    .from('developer_tasks')
    .select('complexity, actual_hours')
    .eq('status', 'completed')
    .not('actual_hours', 'is', null)
    .limit(50);

  // Calculate average by complexity
  const avgByComplexity: Record<string, { total: number; count: number }> = {};
  for (const t of similarTasks || []) {
    if (!avgByComplexity[t.complexity]) {
      avgByComplexity[t.complexity] = { total: 0, count: 0 };
    }
    avgByComplexity[t.complexity].total += t.actual_hours;
    avgByComplexity[t.complexity].count++;
  }

  // Get estimate for this task's complexity
  const complexityKey = task.complexity || 'medium';
  const complexityData = avgByComplexity[complexityKey];
  const defaultHours: Record<string, number> = { low: 4, medium: 8, high: 16 };
  const estimatedHours = complexityData 
    ? complexityData.total / complexityData.count 
    : defaultHours[complexityKey] || 8;

  return {
    taskId,
    complexity: task.complexity,
    estimatedHours: Math.round(estimatedHours * 10) / 10,
    confidence: complexityData?.count > 5 ? 'high' : 'medium',
  };
}

async function prioritizeBySLA(supabase: any) {
  // Get pending tasks with SLA deadlines
  const { data: tasks } = await supabase
    .from('developer_tasks')
    .select('id, title, sla_deadline, priority, status')
    .in('status', ['pending', 'assigned'])
    .not('sla_deadline', 'is', null)
    .order('sla_deadline', { ascending: true })
    .limit(20);

  const prioritized = [];

  for (const task of tasks || []) {
    const deadline = new Date(task.sla_deadline);
    const hoursUntil = (deadline.getTime() - Date.now()) / (1000 * 60 * 60);

    let newPriority = task.priority;
    if (hoursUntil < 2) {
      newPriority = 'critical';
    } else if (hoursUntil < 8) {
      newPriority = 'high';
    } else if (hoursUntil < 24) {
      newPriority = 'medium';
    }

    if (newPriority !== task.priority) {
      await supabase
        .from('developer_tasks')
        .update({ priority: newPriority })
        .eq('id', task.id);

      prioritized.push({ taskId: task.id, oldPriority: task.priority, newPriority });
    }
  }

  return prioritized;
}

// ============================================================================
// AUTO-MONITORING
// ============================================================================

async function runHealthCheck(supabase: any) {
  const health: any = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    components: {},
  };

  // Chat health
  const { count: activeChats } = await supabase
    .from('chat_user_status')
    .select('*', { count: 'exact', head: true })
    .eq('is_online', true);

  health.components.chat = { status: 'ok', activeUsers: activeChats };

  // Buzzer health
  const { count: pendingBuzzers } = await supabase
    .from('buzzer_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  health.components.buzzer = { 
    status: pendingBuzzers > 50 ? 'degraded' : 'ok', 
    pending: pendingBuzzers 
  };

  // Demo health
  const { count: activeDemos } = await supabase
    .from('demos')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  health.components.demos = { status: 'ok', active: activeDemos };

  // Wallet health
  const { count: pendingTx } = await supabase
    .from('wallet_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  health.components.wallet = { 
    status: pendingTx > 100 ? 'degraded' : 'ok', 
    pending: pendingTx 
  };

  // Set overall status
  const degradedComponents = Object.values(health.components).filter((c: any) => c.status === 'degraded');
  if (degradedComponents.length > 2) {
    health.status = 'critical';
  } else if (degradedComponents.length > 0) {
    health.status = 'degraded';
  }

  return health;
}

async function getSystemMetrics(supabase: any) {
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Get various counts
  const [
    { count: chatMessages },
    { count: apiCalls },
    { count: buzzerAlerts },
    { count: walletTx },
  ] = await Promise.all([
    supabase.from('chat_messages').select('*', { count: 'exact', head: true }).gt('timestamp', hourAgo.toISOString()),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }).gt('timestamp', hourAgo.toISOString()),
    supabase.from('buzzer_queue').select('*', { count: 'exact', head: true }).gt('created_at', hourAgo.toISOString()),
    supabase.from('wallet_transactions').select('*', { count: 'exact', head: true }).gt('created_at', hourAgo.toISOString()),
  ]);

  return {
    period: 'last_hour',
    metrics: {
      chatMessages: chatMessages || 0,
      apiCalls: apiCalls || 0,
      buzzerAlerts: buzzerAlerts || 0,
      walletTransactions: walletTx || 0,
    },
    timestamp: now.toISOString(),
  };
}

// ============================================================================
// OPTIMIZATION
// ============================================================================

async function runOptimizations(supabase: any) {
  const optimizations: any[] = [];

  // 1. Clean up old audit logs (keep 90 days)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const { count: archivedLogs } = await supabase
    .from('audit_logs')
    .delete()
    .lt('timestamp', ninetyDaysAgo);

  optimizations.push({ action: 'archive_old_logs', removed: archivedLogs || 0 });

  // 2. Clean up expired sessions
  await supabase
    .from('chat_user_status')
    .update({ is_online: false })
    .lt('last_seen', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  optimizations.push({ action: 'cleanup_sessions', completed: true });

  // 3. Clean up expired access list entries
  await supabase
    .from('access_lists')
    .update({ is_active: false })
    .lt('expires_at', new Date().toISOString());

  optimizations.push({ action: 'cleanup_access_lists', completed: true });

  // 4. Vacuum completed buzzer alerts
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await supabase
    .from('buzzer_queue')
    .delete()
    .in('status', ['completed', 'cancelled'])
    .lt('created_at', thirtyDaysAgo);

  optimizations.push({ action: 'cleanup_buzzer_queue', completed: true });

  return optimizations;
}
