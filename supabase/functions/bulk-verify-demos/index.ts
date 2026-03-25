import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationResult {
  demoId: string;
  url: string;
  status: 'active' | 'broken' | 'pending';
  httpStatus?: number;
  responseTime?: number;
  error?: string;
}

async function verifyUrl(url: string): Promise<{ reachable: boolean; httpStatus?: number; responseTime?: number; error?: string }> {
  const startTime = Date.now();
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });
    
    const responseTime = Date.now() - startTime;
    const httpStatus = response.status;
    const reachable = response.ok || response.status === 302 || response.status === 301;
    
    return { reachable, httpStatus, responseTime };
  } catch (error: unknown) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { reachable: false, responseTime, error: errorMessage };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, demoIds, batchSize = 10, skipVerified = true } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get demos to verify
    let query = supabase
      .from('demos')
      .select('id, url, title, status, verification_status, last_verified_at');

    if (demoIds && demoIds.length > 0) {
      query = query.in('id', demoIds);
    } else if (skipVerified) {
      // Only get unverified or stale demos (not verified in last 24 hours)
      query = query.or('verification_status.eq.unverified,verification_status.eq.broken,last_verified_at.lt.' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    }

    query = query.limit(batchSize);

    const { data: demos, error: fetchError } = await query;

    if (fetchError) {
      throw new Error('Failed to fetch demos: ' + fetchError.message);
    }

    if (!demos || demos.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No demos to verify',
          results: [],
          stats: { total: 0, active: 0, broken: 0, pending: 0 }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting verification for ${demos.length} demos`);

    const results: VerificationResult[] = [];
    const stats = { total: demos.length, active: 0, broken: 0, pending: 0 };

    // Process demos in parallel batches
    const batchPromises = demos.map(async (demo) => {
      const verification = await verifyUrl(demo.url);
      
      const newStatus = verification.reachable ? 'active' : 'inactive';
      const verificationStatus = verification.reachable ? 'verified' : 'broken';
      
      // Update demo status
      const { error: updateError } = await supabase
        .from('demos')
        .update({
          status: newStatus,
          verification_status: verificationStatus,
          last_verified_at: new Date().toISOString(),
          http_status: verification.httpStatus,
          response_time_ms: verification.responseTime,
        })
        .eq('id', demo.id);

      if (updateError) {
        console.error(`Failed to update demo ${demo.id}:`, updateError);
      }

      // Log the verification
      await supabase
        .from('demo_validation_logs')
        .insert({
          demo_id: demo.id,
          demo_url: demo.url,
          validation_type: 'reachability_check',
          status: verification.reachable ? 'passed' : 'failed',
          http_status: verification.httpStatus,
          response_time_ms: verification.responseTime,
          error_message: verification.error,
        });

      const result: VerificationResult = {
        demoId: demo.id,
        url: demo.url,
        status: verification.reachable ? 'active' : 'broken',
        httpStatus: verification.httpStatus,
        responseTime: verification.responseTime,
        error: verification.error,
      };

      if (verification.reachable) {
        stats.active++;
      } else {
        stats.broken++;
      }

      return result;
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    console.log(`Verification complete: ${stats.active} active, ${stats.broken} broken`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Verified ${demos.length} demos`,
        results,
        stats
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Bulk verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});