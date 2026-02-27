import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, serverId, serverData, submissionId } = await req.json();

    switch (action) {
      case 'pre_check_submission': {
        // AI pre-check for server submission before admin review
        const result = await preCheckSubmission(serverData);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'analyze_health': {
        // AI health analysis for approved server
        const result = await analyzeServerHealth(supabase, serverId);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'security_scan': {
        // AI security scan
        const result = await performSecurityScan(supabase, serverId);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'generate_suggestions': {
        // AI-powered optimization suggestions
        const result = await generateSuggestions(supabase, serverId);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'threat_detection': {
        // Real-time threat detection
        const result = await detectThreats(supabase, serverId);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'compliance_check': {
        // Compliance verification
        const result = await checkCompliance(supabase, serverId);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'full_analysis': {
        // Complete AI analysis
        const result = await performFullAnalysis(supabase, serverId);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('AI Server Analyzer error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function preCheckSubmission(serverData: any) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    // Return basic validation without AI
    return {
      approved: true,
      riskLevel: 'low',
      warnings: [],
      recommendations: ['Enable AI analysis for enhanced security checks']
    };
  }

  const prompt = `Analyze this server submission request for potential risks, spam, or malicious intent:

Server Details:
- Name: ${serverData.server_name}
- Type: ${serverData.server_type}
- IP Address: ${serverData.ip_address || 'Not provided'}
- Hostname: ${serverData.hostname || 'Not provided'}
- Provider: ${serverData.provider || 'Not specified'}
- Region: ${serverData.region || 'Not specified'}
- Purpose: ${serverData.purpose || 'Not specified'}
- Expected Usage: ${serverData.expected_usage || 'Not specified'}

Evaluate for:
1. Spam/scam indicators
2. Malicious intent patterns
3. Compliance risks
4. Security concerns
5. Legitimacy of purpose

Provide your analysis in JSON format with:
- approved: boolean (true if safe to proceed to admin review)
- riskLevel: "low" | "medium" | "high" | "critical"
- riskScore: number (0-100)
- warnings: string[] (any concerns found)
- recommendations: string[] (suggestions for the admin reviewer)
- flags: string[] (specific red flags if any)`;

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
          { role: 'system', content: 'You are a security analyst AI that evaluates server submissions for potential risks. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      approved: true,
      riskLevel: 'low',
      riskScore: 20,
      warnings: [],
      recommendations: ['Standard review recommended'],
      flags: []
    };
  } catch (error) {
    console.error('AI pre-check error:', error);
    return {
      approved: true,
      riskLevel: 'unknown',
      riskScore: 50,
      warnings: ['AI analysis unavailable - manual review required'],
      recommendations: ['Perform thorough manual verification'],
      flags: []
    };
  }
}

async function analyzeServerHealth(supabase: any, serverId: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  // Get server data
  const { data: server } = await supabase
    .from('server_instances')
    .select('*')
    .eq('id', serverId)
    .single();

  if (!server) {
    return { error: 'Server not found' };
  }

  // Get recent metrics
  const { data: metrics } = await supabase
    .from('server_metrics_history')
    .select('*')
    .eq('server_id', serverId)
    .order('recorded_at', { ascending: false })
    .limit(24);

  const analysisPrompt = `Analyze the health of this server:

Server: ${server.name} (${server.server_type})
Status: ${server.status}
Region: ${server.region}
CPU: ${server.cpu_usage}%
Memory: ${server.memory_usage}%
Disk: ${server.disk_usage}%
Uptime: ${server.uptime_percentage}%

Recent Metrics Trend:
${JSON.stringify(metrics?.slice(0, 5) || [], null, 2)}

Provide health analysis in JSON format:
- healthScore: number (0-100)
- status: "healthy" | "warning" | "critical"
- issues: string[] (current problems)
- predictions: string[] (potential future issues)
- recommendations: string[] (optimization suggestions)
- resourceOptimization: { cpu: string, memory: string, disk: string }`;

  if (!OPENAI_API_KEY) {
    // Calculate basic health score without AI
    const healthScore = Math.round(
      (100 - server.cpu_usage) * 0.3 +
      (100 - server.memory_usage) * 0.3 +
      (100 - server.disk_usage) * 0.2 +
      server.uptime_percentage * 0.2
    );

    const result = {
      healthScore,
      status: healthScore > 70 ? 'healthy' : healthScore > 40 ? 'warning' : 'critical',
      issues: [],
      predictions: [],
      recommendations: ['Enable AI for detailed analysis'],
      resourceOptimization: { cpu: 'N/A', memory: 'N/A', disk: 'N/A' }
    };

    // Store analysis
    await storeAnalysis(supabase, serverId, 'health', result);
    return result;
  }

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
          { role: 'system', content: 'You are an expert DevOps AI that analyzes server health. Respond only with valid JSON.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      healthScore: 75,
      status: 'healthy',
      issues: [],
      predictions: [],
      recommendations: [],
      resourceOptimization: {}
    };

    // Store analysis and update server
    await storeAnalysis(supabase, serverId, 'health', result);
    await supabase
      .from('server_instances')
      .update({
        ai_health_score: result.healthScore,
        last_ai_analysis: new Date().toISOString(),
        ai_suggestions: result.recommendations
      })
      .eq('id', serverId);

    return result;
  } catch (error) {
    console.error('Health analysis error:', error);
    return { error: 'Analysis failed' };
  }
}

async function performSecurityScan(supabase: any, serverId: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const { data: server } = await supabase
    .from('server_instances')
    .select('*')
    .eq('id', serverId)
    .single();

  if (!server) {
    return { error: 'Server not found' };
  }

  const securityPrompt = `Perform a security assessment for this server:

Server: ${server.name}
Type: ${server.server_type}
IP: ${server.ip_address || 'Unknown'}
Protection Level: ${server.protection_level}
Last Scan: ${server.last_ai_analysis || 'Never'}

Analyze potential security vulnerabilities and provide in JSON format:
- riskScore: number (0-100, higher is riskier)
- vulnerabilities: [{ name: string, severity: "low"|"medium"|"high"|"critical", description: string }]
- exposedPorts: string[]
- securityRecommendations: string[]
- complianceIssues: string[]
- immediateActions: string[]`;

  if (!OPENAI_API_KEY) {
    const result = {
      riskScore: 30,
      vulnerabilities: [],
      exposedPorts: [],
      securityRecommendations: ['Enable AI for comprehensive security scanning'],
      complianceIssues: [],
      immediateActions: []
    };
    await storeAnalysis(supabase, serverId, 'security', result);
    return result;
  }

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
          { role: 'system', content: 'You are a cybersecurity AI expert. Analyze server security and respond with valid JSON only.' },
          { role: 'user', content: securityPrompt }
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      riskScore: 30,
      vulnerabilities: [],
      exposedPorts: [],
      securityRecommendations: [],
      complianceIssues: [],
      immediateActions: []
    };

    await storeAnalysis(supabase, serverId, 'security', result);
    await supabase
      .from('server_instances')
      .update({ ai_risk_score: result.riskScore })
      .eq('id', serverId);

    return result;
  } catch (error) {
    console.error('Security scan error:', error);
    return { error: 'Security scan failed' };
  }
}

async function generateSuggestions(supabase: any, serverId: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const { data: server } = await supabase
    .from('server_instances')
    .select('*')
    .eq('id', serverId)
    .single();

  const { data: recentAnalysis } = await supabase
    .from('server_ai_analysis')
    .select('*')
    .eq('server_id', serverId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!OPENAI_API_KEY) {
    return {
      suggestions: [
        { category: 'performance', priority: 'medium', suggestion: 'Monitor resource usage trends' },
        { category: 'security', priority: 'high', suggestion: 'Enable automated backups' },
        { category: 'cost', priority: 'low', suggestion: 'Review server sizing requirements' }
      ]
    };
  }

  const prompt = `Based on server data and recent analysis, provide optimization suggestions:

Server: ${JSON.stringify(server, null, 2)}
Recent Analysis: ${JSON.stringify(recentAnalysis, null, 2)}

Provide suggestions in JSON format:
- suggestions: [{ category: string, priority: "low"|"medium"|"high", suggestion: string, estimatedImpact: string }]
- costOptimizations: string[]
- performanceImprovements: string[]
- securityEnhancements: string[]`;

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
          { role: 'system', content: 'You are a server optimization AI. Provide actionable suggestions in valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { suggestions: [] };
  } catch (error) {
    console.error('Suggestions generation error:', error);
    return { error: 'Failed to generate suggestions' };
  }
}

async function detectThreats(supabase: any, serverId: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const { data: server } = await supabase
    .from('server_instances')
    .select('*')
    .eq('id', serverId)
    .single();

  const { data: recentEvents } = await supabase
    .from('server_protection_events')
    .select('*')
    .eq('server_id', serverId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (!OPENAI_API_KEY) {
    return {
      threatsDetected: false,
      threats: [],
      riskLevel: 'low',
      recommendedActions: ['Enable AI for real-time threat detection']
    };
  }

  const prompt = `Analyze for potential threats based on server data and recent events:

Server: ${JSON.stringify(server, null, 2)}
Recent Events: ${JSON.stringify(recentEvents, null, 2)}

Detect threats and respond in JSON:
- threatsDetected: boolean
- threats: [{ type: string, severity: string, description: string, source: string }]
- riskLevel: "low"|"medium"|"high"|"critical"
- recommendedActions: string[]
- autoRemediationAvailable: boolean`;

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
          { role: 'system', content: 'You are a threat detection AI. Analyze for security threats and respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      threatsDetected: false,
      threats: [],
      riskLevel: 'low',
      recommendedActions: []
    };

    // Log threats if detected
    if (result.threatsDetected && result.threats?.length > 0) {
      for (const threat of result.threats) {
        await supabase.from('server_protection_events').insert({
          server_id: serverId,
          event_type: 'threat_detected',
          severity: threat.severity,
          description: threat.description,
          source_ip: threat.source || null,
          metadata: { threat_type: threat.type, ai_detected: true }
        });
      }

      await supabase
        .from('server_instances')
        .update({ threat_alerts: result.threats })
        .eq('id', serverId);
    }

    return result;
  } catch (error) {
    console.error('Threat detection error:', error);
    return { error: 'Threat detection failed' };
  }
}

async function checkCompliance(supabase: any, serverId: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const { data: server } = await supabase
    .from('server_instances')
    .select('*')
    .eq('id', serverId)
    .single();

  if (!OPENAI_API_KEY) {
    return {
      compliant: true,
      status: 'review_required',
      checks: [],
      recommendations: ['Enable AI for automated compliance checking']
    };
  }

  const prompt = `Check server compliance status:

Server: ${JSON.stringify(server, null, 2)}

Verify compliance and respond in JSON:
- compliant: boolean
- status: "compliant"|"non_compliant"|"review_required"
- checks: [{ standard: string, status: "pass"|"fail"|"warning", details: string }]
- violations: string[]
- recommendations: string[]`;

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
          { role: 'system', content: 'You are a compliance audit AI. Check server compliance and respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      compliant: true,
      status: 'review_required',
      checks: [],
      recommendations: []
    };

    await storeAnalysis(supabase, serverId, 'compliance', result);
    await supabase
      .from('server_instances')
      .update({ compliance_status: result.status })
      .eq('id', serverId);

    return result;
  } catch (error) {
    console.error('Compliance check error:', error);
    return { error: 'Compliance check failed' };
  }
}

async function performFullAnalysis(supabase: any, serverId: string) {
  const [health, security, threats, compliance] = await Promise.all([
    analyzeServerHealth(supabase, serverId),
    performSecurityScan(supabase, serverId),
    detectThreats(supabase, serverId),
    checkCompliance(supabase, serverId)
  ]);

  const suggestions = await generateSuggestions(supabase, serverId);

  return {
    health,
    security,
    threats,
    compliance,
    suggestions,
    analyzedAt: new Date().toISOString()
  };
}

async function storeAnalysis(supabase: any, serverId: string, type: string, result: any) {
  await supabase.from('server_ai_analysis').insert({
    server_id: serverId,
    analysis_type: type,
    analysis_result: result,
    health_score: result.healthScore || null,
    risk_score: result.riskScore || null,
    suggestions: result.recommendations || result.suggestions || [],
    threats_detected: result.threats || [],
    recommendations: result.recommendations || []
  });
}
