import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  reachable: boolean;
  httpStatus?: number;
  responseTime?: number;
  error?: string;
  statusText?: string;
}

async function checkUrlHealth(url: string): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Validate URL format
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { reachable: false, error: 'Invalid protocol. Only HTTP/HTTPS supported.' };
    }

    // Use HEAD request first (faster), fallback to GET if needed
    let response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'SoftwareVala-HealthCheck/1.0 (Demo Monitoring)',
        'Accept': '*/*',
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    // Some servers don't support HEAD, try GET
    if (response.status === 405) {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'SoftwareVala-HealthCheck/1.0 (Demo Monitoring)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(15000),
      });
    }

    const responseTime = Date.now() - startTime;
    const httpStatus = response.status;
    const statusText = response.statusText;
    
    // Consider 2xx, 3xx as reachable
    const reachable = httpStatus >= 200 && httpStatus < 400;

    console.log(`Health check for ${url}: ${httpStatus} ${statusText} (${responseTime}ms)`);

    return { 
      reachable, 
      httpStatus, 
      responseTime, 
      statusText,
      error: reachable ? undefined : `HTTP ${httpStatus}: ${statusText}`
    };
  } catch (error: unknown) {
    const responseTime = Date.now() - startTime;
    let errorMessage = 'Unknown error';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        errorMessage = 'Request timed out after 15 seconds';
      } else if (error.message.includes('DNS')) {
        errorMessage = 'DNS resolution failed';
      } else if (error.message.includes('connect')) {
        errorMessage = 'Connection refused or unreachable';
      } else {
        errorMessage = error.message;
      }
    }

    console.error(`Health check failed for ${url}:`, errorMessage);
    return { reachable: false, responseTime, error: errorMessage };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { demoId, url, createAlert = true } = await req.json();

    if (!demoId || !url) {
      return new Response(
        JSON.stringify({ success: false, error: 'demoId and url are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting health check for demo ${demoId}: ${url}`);

    const healthResult = await checkUrlHealth(url);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update demo health status
    const newStatus = healthResult.reachable ? 'active' : 'down';
    const { error: updateError } = await supabase
      .from('demos')
      .update({
        status: newStatus,
        verification_status: healthResult.reachable ? 'verified' : 'broken',
        last_verified_at: new Date().toISOString(),
        http_status: healthResult.httpStatus,
        response_time_ms: healthResult.responseTime,
      })
      .eq('id', demoId);

    if (updateError) {
      console.error('Failed to update demo:', updateError);
    }

    // Log to demo_health table
    await supabase
      .from('demo_health')
      .insert({
        demo_id: demoId,
        status: healthResult.reachable ? 'active' : 'down',
        response_time: healthResult.responseTime,
        error_message: healthResult.error,
      });

    // Create alert if demo is down and alerts are enabled
    if (!healthResult.reachable && createAlert) {
      const { data: existingAlert } = await supabase
        .from('demo_alerts')
        .select('id')
        .eq('demo_id', demoId)
        .eq('alert_type', 'health_check_failed')
        .eq('is_active', true)
        .single();

      if (!existingAlert) {
        await supabase
          .from('demo_alerts')
          .insert({
            demo_id: demoId,
            alert_type: 'health_check_failed',
            message: `Demo is unreachable: ${healthResult.error || 'Unknown error'}`,
            is_active: true,
            requires_action: true,
          });
        console.log(`Created alert for demo ${demoId}`);
      }
    }

    // Resolve alerts if demo is back up
    if (healthResult.reachable) {
      await supabase
        .from('demo_alerts')
        .update({ 
          is_active: false,
          action_taken: 'Auto-resolved: Demo is now reachable'
        })
        .eq('demo_id', demoId)
        .eq('alert_type', 'health_check_failed')
        .eq('is_active', true);
    }

    return new Response(
      JSON.stringify({
        success: true,
        demoId,
        url,
        reachable: healthResult.reachable,
        httpStatus: healthResult.httpStatus,
        responseTime: healthResult.responseTime,
        statusText: healthResult.statusText,
        error: healthResult.error,
        status: newStatus,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
