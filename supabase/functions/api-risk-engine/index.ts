import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Risk level thresholds
const RISK_THRESHOLDS = {
  NORMAL: 20,
  CAUTION: 40,
  WATCH: 60,
  HIGH: 80,
  CRITICAL: 100,
};

// Weighted factors for risk calculation
const RISK_WEIGHTS = {
  login: 0.15,
  device: 0.20,
  transaction: 0.25,
  behavior: 0.15,
  commission: 0.15,
  lead: 0.10,
};

// Escalation actions
const ESCALATION_ACTIONS = {
  1: { action: 'warn', description: 'Motivational reminder sent' },
  2: { action: 'restrict', description: 'Wallet suspended, commission payout blocked' },
  3: { action: 'freeze', description: 'Login blocked, re-verification required' },
  4: { action: 'terminate', description: 'Permanent ban, data archived' },
};

interface RiskAnalysisRequest {
  path: string;
  user_id?: string;
  event_type?: string;
  event_category?: string;
  event_data?: Record<string, unknown>;
  ip_address?: string;
  device_fingerprint?: string;
  geo_location?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: RiskAnalysisRequest = await req.json();
    const { path } = body;

    // Route handling
    switch (path) {
      case '/calculate-score':
        return await calculateRiskScore(supabase, body);
      
      case '/record-event':
        return await recordRiskEvent(supabase, body);
      
      case '/analyze-behavior':
        return await analyzeBehavior(supabase, body);
      
      case '/analyze-transaction':
        return await analyzeTransaction(supabase, body);
      
      case '/escalate':
        return await handleEscalation(supabase, body);
      
      case '/get-score':
        return await getRiskScore(supabase, body);
      
      case '/get-reputation':
        return await getReputation(supabase, body);
      
      case '/update-reputation':
        return await updateReputation(supabase, body);
      
      case '/watchlist':
        return await manageWatchlist(supabase, body);
      
      case '/alerts':
        return await getAlerts(supabase, body);
      
      case '/command-center':
        return await getCommandCenterData(supabase, body);
      
      case '/ai-analyze':
        return await aiRiskAnalysis(supabase, body);
      
      // BUG FIX: Add duplicate lead detection endpoint
      case '/check-duplicate-lead':
        return await checkDuplicateLead(supabase, body);
      
      // BUG FIX: Add fake click detection endpoint  
      case '/check-fake-clicks':
        return await checkFakeClicks(supabase, body);
      
      // BUG FIX: Add wallet abuse detection endpoint
      case '/check-wallet-abuse':
        return await checkWalletAbuse(supabase, body);
      
      // BUG FIX: Add code theft detection endpoint
      case '/check-code-theft':
        return await checkCodeTheft(supabase, body);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown endpoint' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Risk Engine Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'We encountered an issue processing your request. Our team has been notified.',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Calculate comprehensive risk score
async function calculateRiskScore(supabase: any, body: any) {
  const { user_id, scores, factors } = body;

  if (!user_id) {
    return new Response(
      JSON.stringify({ success: false, message: 'User ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get current score for audit trail
  const { data: currentScore } = await supabase
    .from('risk_scores')
    .select('current_score')
    .eq('user_id', user_id)
    .single();

  const previousScore = currentScore?.current_score || 0;

  // Update risk score using the database function
  const { data: updatedScore, error } = await supabase.rpc('update_risk_score', {
    p_user_id: user_id,
    p_login_score: scores?.login,
    p_device_score: scores?.device,
    p_transaction_score: scores?.transaction,
    p_behavior_score: scores?.behavior,
    p_commission_score: scores?.commission,
    p_lead_score: scores?.lead,
    p_factors: factors ? JSON.stringify(factors) : null,
  });

  if (error) {
    console.error('Risk score update error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to update risk score' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Log audit trail
  await supabase.rpc('log_risk_audit', {
    p_user_id: user_id,
    p_action: 'score_update',
    p_score_before: previousScore,
    p_score_after: updatedScore?.current_score || 0,
    p_trigger_type: 'calculation',
    p_reasoning: { scores, factors },
    p_calculation: { weights: RISK_WEIGHTS },
  });

  // Check if escalation is needed
  const newScore = updatedScore?.current_score || 0;
  let escalationNeeded = false;
  let escalationLevel = 0;

  if (newScore > RISK_THRESHOLDS.HIGH) {
    escalationLevel = 4;
    escalationNeeded = true;
  } else if (newScore > RISK_THRESHOLDS.WATCH) {
    escalationLevel = 3;
    escalationNeeded = true;
  } else if (newScore > RISK_THRESHOLDS.CAUTION) {
    escalationLevel = 2;
    escalationNeeded = true;
  } else if (newScore > RISK_THRESHOLDS.NORMAL) {
    escalationLevel = 1;
    escalationNeeded = true;
  }

  // Trigger auto-escalation if needed
  if (escalationNeeded && newScore > previousScore) {
    await triggerAutoEscalation(supabase, user_id, newScore, escalationLevel);
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Risk score calculated successfully',
      data: {
        ...updatedScore,
        previous_score: previousScore,
        escalation_triggered: escalationNeeded,
        escalation_level: escalationLevel,
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Record a risk event
async function recordRiskEvent(supabase: any, body: any) {
  const { user_id, event_type, event_category, severity, metadata, ip_address, device_fingerprint, geo_location } = body;

  if (!user_id || !event_type || !event_category) {
    return new Response(
      JSON.stringify({ success: false, message: 'Missing required fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Calculate risk contribution based on severity
  const severityMap: Record<string, number> = {
    low: 5,
    medium: 15,
    high: 30,
    critical: 50,
  };
  const riskContribution = severityMap[severity || 'low'] || 5;

  const { data: event, error } = await supabase
    .from('risk_events')
    .insert({
      user_id,
      event_type,
      event_category,
      severity: severity || 'low',
      risk_contribution: riskContribution,
      metadata: metadata || {},
      ip_address,
      device_fingerprint,
      geo_location,
    })
    .select()
    .single();

  if (error) {
    console.error('Risk event insert error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to record event' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Update the relevant score component
  const scoreField = `${event_category}_score`;
  const { data: currentScoreData } = await supabase
    .from('risk_scores')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (currentScoreData) {
    const currentCategoryScore = currentScoreData[`${event_category === 'login' ? 'login_pattern' : event_category}_score`] || 0;
    const newCategoryScore = Math.min(100, currentCategoryScore + riskContribution);

    // Update the specific category score
    const updateField = event_category === 'login' ? 'login_pattern_score' : `${event_category}_score`;
    await supabase
      .from('risk_scores')
      .update({ [updateField]: newCategoryScore, updated_at: new Date().toISOString() })
      .eq('user_id', user_id);
  }

  // Create alert if severity is high or critical
  if (severity === 'high' || severity === 'critical') {
    await createRiskAlert(supabase, user_id, event);
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Risk event recorded',
      data: event
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Analyze behavior patterns
async function analyzeBehavior(supabase: any, body: any) {
  const { user_id, pattern_type, current_data } = body;

  if (!user_id || !pattern_type || !current_data) {
    return new Response(
      JSON.stringify({ success: false, message: 'Missing required fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get or create behavior pattern baseline
  const { data: existingPattern } = await supabase
    .from('behavior_patterns')
    .select('*')
    .eq('user_id', user_id)
    .eq('pattern_type', pattern_type)
    .single();

  let deviationScore = 0;
  let isAnomalous = false;

  if (existingPattern && existingPattern.samples_count > 5) {
    // Calculate deviation from baseline
    deviationScore = calculateDeviation(existingPattern.baseline_data, current_data);
    isAnomalous = deviationScore > 50; // 50% deviation threshold
  }

  // Upsert the pattern
  const { data: pattern, error } = await supabase
    .from('behavior_patterns')
    .upsert({
      user_id,
      pattern_type,
      current_data,
      deviation_score: deviationScore,
      samples_count: (existingPattern?.samples_count || 0) + 1,
      last_sample_at: new Date().toISOString(),
      is_anomalous: isAnomalous,
      anomaly_detected_at: isAnomalous ? new Date().toISOString() : null,
      baseline_data: existingPattern?.baseline_data || current_data,
    }, {
      onConflict: 'user_id,pattern_type',
    })
    .select()
    .single();

  if (isAnomalous) {
    // Record anomaly as risk event
    await recordRiskEvent(supabase, {
      user_id,
      event_type: 'behavior_anomaly',
      event_category: 'behavior',
      severity: deviationScore > 80 ? 'critical' : 'high',
      metadata: { pattern_type, deviation_score: deviationScore, current_data },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: isAnomalous ? 'Anomaly detected in behavior pattern' : 'Behavior pattern updated',
      data: {
        is_anomalous: isAnomalous,
        deviation_score: deviationScore,
        pattern,
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Analyze transaction for risk
async function analyzeTransaction(supabase: any, body: any) {
  const { user_id, transaction_type, amount, metadata } = body;

  if (!user_id || !transaction_type || amount === undefined) {
    return new Response(
      JSON.stringify({ success: false, message: 'Missing required fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let riskFactors: string[] = [];
  let riskScore = 0;

  // Get user's transaction history
  const { data: recentTransactions } = await supabase
    .from('transaction_monitoring')
    .select('*')
    .eq('user_id', user_id)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });

  // Check for unusual amount
  const avgAmount = recentTransactions?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) / (recentTransactions?.length || 1);
  if (amount > avgAmount * 3) {
    riskFactors.push('unusual_amount');
    riskScore += 25;
  }

  // Check for rapid transactions
  if (recentTransactions && recentTransactions.length > 10) {
    riskFactors.push('rapid_transactions');
    riskScore += 20;
  }

  // Check for withdrawal pattern
  if (transaction_type === 'withdrawal') {
    const withdrawals = recentTransactions?.filter((t: any) => t.transaction_type === 'withdrawal') || [];
    if (withdrawals.length > 3) {
      riskFactors.push('multiple_withdrawals');
      riskScore += 15;
    }
  }

  // Check reputation
  const { data: reputation } = await supabase
    .from('reputation_scores')
    .select('trust_index')
    .eq('entity_id', user_id)
    .single();

  if (reputation && reputation.trust_index < 50) {
    riskFactors.push('low_trust_index');
    riskScore += 20;
  }

  const riskLevel = riskScore <= 20 ? 'normal' : riskScore <= 40 ? 'caution' : riskScore <= 60 ? 'watch' : riskScore <= 80 ? 'high' : 'critical';
  const approved = riskScore < 60;

  // Record transaction monitoring
  await supabase.from('transaction_monitoring').insert({
    user_id,
    transaction_type,
    amount,
    risk_score: riskScore,
    risk_factors: riskFactors,
    status: approved ? 'approved' : 'flagged',
  });

  if (!approved) {
    await recordRiskEvent(supabase, {
      user_id,
      event_type: 'high_risk_transaction',
      event_category: 'transaction',
      severity: riskLevel === 'critical' ? 'critical' : 'high',
      metadata: { transaction_type, amount, risk_factors: riskFactors },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: approved ? 'Transaction approved' : 'Transaction requires review',
      data: {
        approved,
        risk_score: riskScore,
        risk_level: riskLevel,
        risk_factors: riskFactors,
        requires_verification: riskScore >= 60,
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Handle escalation
async function handleEscalation(supabase: any, body: any) {
  const { user_id, level, trigger_reason, auto_triggered = true, triggered_by } = body;

  if (!user_id || !level || !trigger_reason) {
    return new Response(
      JSON.stringify({ success: false, message: 'Missing required fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const escalationAction = ESCALATION_ACTIONS[level as keyof typeof ESCALATION_ACTIONS];
  if (!escalationAction) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid escalation level' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get current risk score
  const { data: riskScore } = await supabase
    .from('risk_scores')
    .select('current_score')
    .eq('user_id', user_id)
    .single();

  // Create escalation record
  const { data: escalation, error } = await supabase
    .from('risk_escalations')
    .insert({
      user_id,
      escalation_level: level,
      trigger_reason,
      risk_score_at_time: riskScore?.current_score || 0,
      action_taken: escalationAction.action,
      action_details: { description: escalationAction.description },
      auto_triggered,
      triggered_by,
    })
    .select()
    .single();

  if (error) {
    console.error('Escalation error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to create escalation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Apply escalation action
  await applyEscalationAction(supabase, user_id, level, escalationAction);

  // Update risk score escalation level
  await supabase
    .from('risk_scores')
    .update({ escalation_level: level, auto_action_taken: escalationAction.action })
    .eq('user_id', user_id);

  // Create alert
  await supabase.from('risk_alerts').insert({
    user_id,
    alert_type: 'escalation',
    severity: level >= 3 ? 'critical' : level >= 2 ? 'danger' : 'warning',
    title: `Escalation Level ${level} Triggered`,
    description: trigger_reason,
    risk_score: riskScore?.current_score,
    recommended_action: escalationAction.description,
    auto_action_available: true,
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: `Escalation level ${level} applied successfully`,
      data: {
        escalation,
        action_taken: escalationAction,
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Get user risk score
async function getRiskScore(supabase: any, body: any) {
  const { user_id } = body;

  if (!user_id) {
    return new Response(
      JSON.stringify({ success: false, message: 'User ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: score, error } = await supabase
    .from('risk_scores')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to fetch risk score' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: score || {
        user_id,
        current_score: 0,
        risk_level: 'normal',
        message: 'No risk data available yet',
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Get reputation score
async function getReputation(supabase: any, body: any) {
  const { entity_type, entity_id } = body;

  if (!entity_type || !entity_id) {
    return new Response(
      JSON.stringify({ success: false, message: 'Entity type and ID are required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: reputation, error } = await supabase
    .from('reputation_scores')
    .select('*')
    .eq('entity_type', entity_type)
    .eq('entity_id', entity_id)
    .single();

  return new Response(
    JSON.stringify({
      success: true,
      data: reputation || {
        entity_type,
        entity_id,
        star_rating: 5.0,
        trust_index: 100,
        message: 'Default reputation (new entity)',
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Update reputation score
async function updateReputation(supabase: any, body: any) {
  const { entity_type, entity_id, updates } = body;

  if (!entity_type || !entity_id || !updates) {
    return new Response(
      JSON.stringify({ success: false, message: 'Missing required fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: reputation, error } = await supabase
    .from('reputation_scores')
    .upsert({
      entity_type,
      entity_id,
      ...updates,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'entity_type,entity_id',
    })
    .select()
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to update reputation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Reputation updated successfully',
      data: reputation,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Manage watchlist
async function manageWatchlist(supabase: any, body: any) {
  const { action, user_id, watchlist_type, reason, added_by, expires_at } = body;

  if (action === 'add') {
    const { data, error } = await supabase
      .from('risk_watchlist')
      .insert({
        user_id,
        watchlist_type,
        reason,
        added_by,
        expires_at,
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({ success: !error, data, message: error ? 'Failed to add to watchlist' : 'Added to watchlist' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (action === 'remove') {
    const { error } = await supabase
      .from('risk_watchlist')
      .update({ current_status: 'removed' })
      .eq('user_id', user_id)
      .eq('current_status', 'active');

    return new Response(
      JSON.stringify({ success: !error, message: error ? 'Failed to remove from watchlist' : 'Removed from watchlist' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (action === 'list') {
    const { data, error } = await supabase
      .from('risk_watchlist')
      .select('*')
      .eq('current_status', 'active')
      .order('created_at', { ascending: false });

    return new Response(
      JSON.stringify({ success: !error, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: false, message: 'Invalid action' }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Get alerts
async function getAlerts(supabase: any, body: any) {
  const { status, severity, limit = 50 } = body;

  let query = supabase
    .from('risk_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status === 'active') {
    query = query.eq('is_active', true);
  }
  if (severity) {
    query = query.eq('severity', severity);
  }

  const { data, error } = await query;

  return new Response(
    JSON.stringify({ success: !error, data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Get Command Center data
async function getCommandCenterData(supabase: any, body: any) {
  // Get high risk users
  const { data: highRiskUsers } = await supabase
    .from('risk_scores')
    .select('*')
    .gte('current_score', 60)
    .order('current_score', { ascending: false })
    .limit(20);

  // Get recent alerts
  const { data: recentAlerts } = await supabase
    .from('risk_alerts')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20);

  // Get risk distribution
  const { data: riskDistribution } = await supabase
    .from('risk_scores')
    .select('risk_level');

  const distribution = {
    normal: 0,
    caution: 0,
    watch: 0,
    high: 0,
    critical: 0,
  };

  riskDistribution?.forEach((r: any) => {
    if (r.risk_level && distribution.hasOwnProperty(r.risk_level)) {
      distribution[r.risk_level as keyof typeof distribution]++;
    }
  });

  // Get recent escalations
  const { data: recentEscalations } = await supabase
    .from('risk_escalations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // Get watchlist count
  const { count: watchlistCount } = await supabase
    .from('risk_watchlist')
    .select('*', { count: 'exact', head: true })
    .eq('current_status', 'active');

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        high_risk_users: highRiskUsers || [],
        recent_alerts: recentAlerts || [],
        risk_distribution: distribution,
        recent_escalations: recentEscalations || [],
        watchlist_count: watchlistCount || 0,
        summary: {
          total_high_risk: highRiskUsers?.length || 0,
          active_alerts: recentAlerts?.length || 0,
          pending_escalations: recentEscalations?.filter((e: any) => !e.reversed).length || 0,
        }
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// AI-powered risk analysis
async function aiRiskAnalysis(supabase: any, body: any) {
  const { user_id, analysis_type, data } = body;

  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    // Fallback to rule-based analysis
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          analysis: 'Rule-based analysis',
          risk_indicators: [],
          recommendation: 'Continue monitoring',
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const prompt = `Analyze the following user activity data for potential fraud or risk indicators:

Analysis Type: ${analysis_type}
User Data: ${JSON.stringify(data, null, 2)}

Provide a structured analysis with:
1. Risk indicators found (list each with severity: low, medium, high, critical)
2. Overall risk assessment (score 0-100)
3. Recommended actions
4. Confidence level of analysis

Return as JSON.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a fraud detection AI specialist. Analyze user data for risk indicators and provide structured assessments. Always respond with valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('AI analysis failed');
    }

    const aiResult = await response.json();
    const analysisText = aiResult.choices?.[0]?.message?.content || '';

    // Try to parse JSON from response
    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: analysisText };
    } catch {
      analysis = { raw: analysisText };
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          analysis,
          ai_powered: true,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI analysis error:', error);
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          analysis: 'AI analysis unavailable, using rule-based fallback',
          ai_powered: false,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Helper functions
function calculateDeviation(baseline: any, current: any): number {
  if (!baseline || !current) return 0;
  
  let totalDeviation = 0;
  let count = 0;

  for (const key of Object.keys(baseline)) {
    if (typeof baseline[key] === 'number' && typeof current[key] === 'number') {
      const baselineVal = baseline[key];
      const currentVal = current[key];
      if (baselineVal !== 0) {
        totalDeviation += Math.abs((currentVal - baselineVal) / baselineVal) * 100;
        count++;
      }
    }
  }

  return count > 0 ? totalDeviation / count : 0;
}

async function triggerAutoEscalation(supabase: any, user_id: string, score: number, level: number) {
  const escalationAction = ESCALATION_ACTIONS[level as keyof typeof ESCALATION_ACTIONS];
  
  // Generate masked ID for audit logging (never store raw user_id in logs shown to users)
  const maskedUserId = `USR-${user_id.slice(0, 4).toUpperCase()}***`;
  
  await supabase.from('risk_escalations').insert({
    user_id,
    escalation_level: level,
    trigger_reason: `Automatic escalation due to risk score: ${score}`,
    risk_score_at_time: score,
    action_taken: escalationAction.action,
    action_details: { description: escalationAction.description, masked_id: maskedUserId },
    auto_triggered: true,
  });

  await applyEscalationAction(supabase, user_id, level, escalationAction);
  
  // BUG FIX: ALWAYS notify super_admin on ANY escalation (not just level 3+)
  // Create buzzer alert for super_admin on every escalation
  await supabase.from('buzzer_queue').insert({
    trigger_type: 'escalation_alert',
    priority: level >= 3 ? 'urgent' : level >= 2 ? 'high' : 'normal',
    role_target: 'super_admin',
    status: 'pending',
    auto_escalate_after: 300,
    region: null,
  });
  
  // Also notify incident role for level 2+ escalations
  if (level >= 2) {
    await supabase.from('buzzer_queue').insert({
      trigger_type: 'escalation_alert',
      priority: level >= 3 ? 'urgent' : 'high',
      role_target: 'incident',
      status: 'pending',
      auto_escalate_after: 180,
      region: null,
    });
  }
  
  // Log to audit trail with masked ID
  await supabase.from('audit_logs').insert({
    user_id,
    action: 'auto_escalation_triggered',
    module: 'risk_engine',
    meta_json: {
      escalation_level: level,
      risk_score: score,
      masked_user_id: maskedUserId,
      super_admin_notified: true,
      incident_notified: level >= 2,
    },
  });
}

async function applyEscalationAction(supabase: any, user_id: string, level: number, action: any) {
  switch (level) {
    case 1:
      // Just log warning, no action
      break;
    case 2:
      // Suspend wallet transactions
      await supabase
        .from('reputation_scores')
        .update({ wallet_privilege_level: 'restricted' })
        .eq('entity_id', user_id);
      break;
    case 3:
      // Create account suspension
      await supabase.from('account_suspensions').insert({
        user_id,
        suspension_type: 'risk_freeze',
        reason: 'High risk score triggered automatic freeze',
        masked_reason: 'Account requires verification',
        auto_triggered: true,
      });
      break;
    case 4:
      // Permanent ban
      await supabase.from('account_suspensions').insert({
        user_id,
        suspension_type: 'permanent_ban',
        reason: 'Critical risk level - permanent termination',
        masked_reason: 'Account has been terminated',
        auto_triggered: true,
      });
      break;
  }
}

async function createRiskAlert(supabase: any, user_id: string, event: any) {
  await supabase.from('risk_alerts').insert({
    user_id,
    alert_type: event.event_type,
    severity: event.severity === 'critical' ? 'critical' : 'danger',
    title: `${event.event_category.charAt(0).toUpperCase() + event.event_category.slice(1)} Risk Detected`,
    description: event.description || `A ${event.severity} risk event was detected`,
    indicators: [event.event_type],
    recommended_action: 'Review user activity and consider escalation',
    auto_action_available: true,
  });
}

// BUG FIX: Duplicate Lead Detection
async function checkDuplicateLead(supabase: any, body: any) {
  const { email, phone, ip_address, device_fingerprint, source_id } = body;

  if (!email && !phone) {
    return new Response(
      JSON.stringify({ success: false, message: 'Email or phone required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const duplicateChecks = [];
  let isDuplicate = false;
  let duplicateType = '';
  let matchedLeadId = null;

  // Check for duplicate email
  if (email) {
    const { data: emailMatch } = await supabase
      .from('leads')
      .select('id, email, created_at')
      .eq('email', email.toLowerCase().trim())
      .limit(1);
    
    if (emailMatch && emailMatch.length > 0) {
      isDuplicate = true;
      duplicateType = 'email';
      matchedLeadId = emailMatch[0].id;
      duplicateChecks.push({ type: 'email', match: true });
    }
  }

  // Check for duplicate phone
  if (phone && !isDuplicate) {
    const normalizedPhone = phone.replace(/[^0-9]/g, '');
    const { data: phoneMatch } = await supabase
      .from('leads')
      .select('id, phone, created_at')
      .ilike('phone', `%${normalizedPhone.slice(-10)}%`)
      .limit(1);
    
    if (phoneMatch && phoneMatch.length > 0) {
      isDuplicate = true;
      duplicateType = 'phone';
      matchedLeadId = phoneMatch[0].id;
      duplicateChecks.push({ type: 'phone', match: true });
    }
  }

  // Check for same IP submitting multiple leads within 24 hours
  if (ip_address) {
    const { data: ipLeads } = await supabase
      .from('leads')
      .select('id, created_at')
      .eq('ip_address', ip_address)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    if (ipLeads && ipLeads.length >= 3) {
      duplicateChecks.push({ type: 'ip_abuse', match: true, count: ipLeads.length });
      
      // Create fraud alert for IP abuse
      await supabase.from('risk_alerts').insert({
        alert_type: 'duplicate_lead_ip',
        severity: 'warning',
        title: 'Multiple leads from same IP',
        description: `${ipLeads.length} leads submitted from IP ${ip_address} in 24h`,
        indicators: ['ip_abuse', 'duplicate_submission'],
        auto_action_available: true,
      });
    }
  }

  // Check device fingerprint for repeat submissions
  if (device_fingerprint) {
    const { data: deviceLeads } = await supabase
      .from('leads')
      .select('id, created_at')
      .eq('device_fingerprint', device_fingerprint)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    if (deviceLeads && deviceLeads.length >= 5) {
      duplicateChecks.push({ type: 'device_abuse', match: true, count: deviceLeads.length });
    }
  }

  // Log the duplicate check
  await supabase.from('audit_logs').insert({
    action: 'duplicate_lead_check',
    module: 'fraud_detection',
    meta_json: {
      is_duplicate: isDuplicate,
      duplicate_type: duplicateType,
      matched_lead_id: matchedLeadId,
      checks_performed: duplicateChecks,
    },
  });

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        is_duplicate: isDuplicate,
        duplicate_type: duplicateType,
        matched_lead_id: matchedLeadId,
        checks: duplicateChecks,
        recommendation: isDuplicate ? 'reject' : 'allow',
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// BUG FIX: Fake Click Detection
async function checkFakeClicks(supabase: any, body: any) {
  const { user_id, tracking_code, period_hours = 24 } = body;

  const periodStart = new Date(Date.now() - period_hours * 60 * 60 * 1000).toISOString();
  
  // Get click data
  const { data: clicks } = await supabase
    .from('demo_clicks')
    .select('*')
    .gte('clicked_at', periodStart)
    .order('clicked_at', { ascending: false });

  let fraudScore = 0;
  const fraudIndicators: string[] = [];

  if (clicks && clicks.length > 0) {
    // Check for rapid clicks from same IP
    const ipCounts: Record<string, number> = {};
    clicks.forEach((c: any) => {
      if (c.ip_address) {
        ipCounts[c.ip_address] = (ipCounts[c.ip_address] || 0) + 1;
      }
    });
    
    const suspiciousIPs = Object.entries(ipCounts).filter(([_, count]) => count > 20);
    if (suspiciousIPs.length > 0) {
      fraudScore += 30;
      fraudIndicators.push('rapid_clicks_same_ip');
    }

    // Check for bot-like patterns (clicks in exact intervals)
    const intervals: number[] = [];
    for (let i = 1; i < Math.min(clicks.length, 50); i++) {
      const diff = new Date(clicks[i-1].clicked_at).getTime() - new Date(clicks[i].clicked_at).getTime();
      intervals.push(diff);
    }
    
    // If most intervals are within 100ms of each other, likely bot
    if (intervals.length > 5) {
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
      if (variance < 1000) { // Very low variance = bot pattern
        fraudScore += 40;
        fraudIndicators.push('bot_like_pattern');
      }
    }

    // Check for VPN/proxy usage
    const vpnClicks = clicks.filter((c: any) => c.is_vpn || c.is_proxy);
    if (vpnClicks.length > clicks.length * 0.5) {
      fraudScore += 20;
      fraudIndicators.push('high_vpn_usage');
    }

    // Check for zero session duration
    const zeroSessionClicks = clicks.filter((c: any) => !c.session_duration || c.session_duration < 2);
    if (zeroSessionClicks.length > clicks.length * 0.8) {
      fraudScore += 25;
      fraudIndicators.push('no_engagement');
    }
  }

  const riskLevel = fraudScore <= 20 ? 'low' : fraudScore <= 40 ? 'medium' : fraudScore <= 60 ? 'high' : 'critical';

  // Create alert if high fraud score
  if (fraudScore > 50) {
    await supabase.from('risk_alerts').insert({
      user_id,
      alert_type: 'fake_clicks',
      severity: riskLevel === 'critical' ? 'critical' : 'danger',
      title: 'Fake Click Activity Detected',
      description: `Fraud score: ${fraudScore}. Indicators: ${fraudIndicators.join(', ')}`,
      indicators: fraudIndicators,
      auto_action_available: true,
    });
    
    // Notify super_admin
    await supabase.from('buzzer_queue').insert({
      trigger_type: 'fake_click_alert',
      priority: riskLevel === 'critical' ? 'urgent' : 'high',
      role_target: 'super_admin',
      status: 'pending',
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        fraud_score: fraudScore,
        risk_level: riskLevel,
        indicators: fraudIndicators,
        total_clicks_analyzed: clicks?.length || 0,
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// BUG FIX: Wallet Abuse Detection
async function checkWalletAbuse(supabase: any, body: any) {
  const { user_id, period_hours = 24 } = body;

  if (!user_id) {
    return new Response(
      JSON.stringify({ success: false, message: 'User ID required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const periodStart = new Date(Date.now() - period_hours * 60 * 60 * 1000).toISOString();
  
  let abuseScore = 0;
  const abuseIndicators: string[] = [];

  // Check for rapid withdrawals
  const { data: withdrawals } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user_id)
    .eq('transaction_type', 'debit')
    .gte('created_at', periodStart);

  if (withdrawals && withdrawals.length > 5) {
    abuseScore += 25;
    abuseIndicators.push('rapid_withdrawals');
  }

  // Check for credit manipulation (add then immediately withdraw)
  const { data: allTxns } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user_id)
    .gte('created_at', periodStart)
    .order('created_at', { ascending: true });

  if (allTxns && allTxns.length > 2) {
    for (let i = 1; i < allTxns.length; i++) {
      const prev = allTxns[i - 1];
      const curr = allTxns[i];
      const timeDiff = new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime();
      
      // Credit immediately followed by debit within 5 minutes
      if (prev.transaction_type === 'credit' && curr.transaction_type === 'debit' && timeDiff < 5 * 60 * 1000) {
        abuseScore += 30;
        abuseIndicators.push('credit_withdraw_pattern');
        break;
      }
    }
  }

  // Check for system credit exploitation
  const { data: systemCredits } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user_id)
    .eq('transaction_type', 'credit')
    .eq('source', 'system')
    .gte('created_at', periodStart);

  if (systemCredits && systemCredits.length > 3) {
    abuseScore += 35;
    abuseIndicators.push('system_credit_exploitation');
  }

  const riskLevel = abuseScore <= 20 ? 'low' : abuseScore <= 40 ? 'medium' : abuseScore <= 60 ? 'high' : 'critical';

  // Create alert and freeze wallet if critical
  if (abuseScore > 50) {
    await supabase.from('risk_alerts').insert({
      user_id,
      alert_type: 'wallet_abuse',
      severity: riskLevel === 'critical' ? 'critical' : 'danger',
      title: 'Wallet Abuse Detected',
      description: `Abuse score: ${abuseScore}. Indicators: ${abuseIndicators.join(', ')}`,
      indicators: abuseIndicators,
      auto_action_available: true,
    });
    
    // Notify finance and super_admin
    await supabase.from('buzzer_queue').insert([
      { trigger_type: 'wallet_abuse', priority: 'urgent', role_target: 'finance', status: 'pending' },
      { trigger_type: 'wallet_abuse', priority: 'urgent', role_target: 'super_admin', status: 'pending' },
    ]);
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        abuse_score: abuseScore,
        risk_level: riskLevel,
        indicators: abuseIndicators,
        recommendation: abuseScore > 50 ? 'freeze_wallet' : 'monitor',
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// BUG FIX: Code Theft Detection
async function checkCodeTheft(supabase: any, body: any) {
  const { developer_id, period_hours = 24 } = body;

  if (!developer_id) {
    return new Response(
      JSON.stringify({ success: false, message: 'Developer ID required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const periodStart = new Date(Date.now() - period_hours * 60 * 60 * 1000).toISOString();
  
  let theftScore = 0;
  const theftIndicators: string[] = [];

  // Check code access logs for suspicious activity
  const { data: accessLogs } = await supabase
    .from('code_access_logs')
    .select('*')
    .eq('developer_id', developer_id)
    .gte('created_at', periodStart);

  if (accessLogs && accessLogs.length > 0) {
    // Check for copy attempts
    const copyAttempts = accessLogs.filter((l: any) => l.copy_attempt);
    if (copyAttempts.length > 0) {
      theftScore += 40;
      theftIndicators.push('copy_attempts');
    }

    // Check for export attempts
    const exportAttempts = accessLogs.filter((l: any) => l.export_attempt);
    if (exportAttempts.length > 0) {
      theftScore += 50;
      theftIndicators.push('export_attempts');
    }

    // Check for access outside working hours
    const outsideHours = accessLogs.filter((l: any) => l.is_outside_hours);
    if (outsideHours.length > accessLogs.length * 0.3) {
      theftScore += 25;
      theftIndicators.push('outside_hours_access');
    }

    // Check for suspicious patterns
    const suspicious = accessLogs.filter((l: any) => l.is_suspicious);
    if (suspicious.length > 0) {
      theftScore += 30;
      theftIndicators.push('suspicious_patterns');
    }
  }

  const riskLevel = theftScore <= 20 ? 'low' : theftScore <= 50 ? 'medium' : theftScore <= 80 ? 'high' : 'critical';

  // Immediate escalation for code theft
  if (theftScore > 50) {
    await supabase.from('risk_alerts').insert({
      user_id: developer_id,
      alert_type: 'code_theft',
      severity: 'critical',
      title: 'Code Theft Attempt Detected',
      description: `Theft score: ${theftScore}. Indicators: ${theftIndicators.join(', ')}`,
      indicators: theftIndicators,
      auto_action_available: true,
    });
    
    // Immediately notify super_admin and incident team
    await supabase.from('buzzer_queue').insert([
      { trigger_type: 'code_theft_alert', priority: 'urgent', role_target: 'super_admin', status: 'pending' },
      { trigger_type: 'code_theft_alert', priority: 'urgent', role_target: 'incident', status: 'pending' },
    ]);
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        theft_score: theftScore,
        risk_level: riskLevel,
        indicators: theftIndicators,
        recommendation: theftScore > 50 ? 'suspend_access' : 'monitor',
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}