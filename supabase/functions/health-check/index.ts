import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthCheckResult {
  id: string;
  url: string;
  status: "healthy" | "unhealthy" | "error";
  http_status: number | null;
  response_time_ms: number | null;
  error?: string;
}

async function checkUrl(id: string, url: string): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "SoftwareVala-HealthCheck/1.0",
      },
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    return {
      id,
      url,
      status: response.ok ? "healthy" : "unhealthy",
      http_status: response.status,
      response_time_ms: responseTime,
    };
  } catch (error: unknown) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      id,
      url,
      status: "error",
      http_status: null,
      response_time_ms: responseTime,
      error: errorMessage,
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { demo_ids, batch_size = 50 } = await req.json();

    let query = supabase.from("demos").select("id, url, title");
    
    if (demo_ids && demo_ids.length > 0) {
      query = query.in("id", demo_ids);
    } else {
      query = query.eq("status", "active").limit(batch_size);
    }

    const { data: demos, error: fetchError } = await query;

    if (fetchError) {
      throw fetchError;
    }

    if (!demos || demos.length === 0) {
      return new Response(
        JSON.stringify({ message: "No demos to check", results: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check all URLs in parallel (batch)
    const healthChecks = demos.map((demo) => checkUrl(demo.id, demo.url));
    const results = await Promise.all(healthChecks);

    // Update demos in database
    const updates = results.map(async (result) => {
      const healthScore = result.status === "healthy" ? 100 : 
                          result.status === "unhealthy" ? 50 : 0;
      
      const verificationStatus = result.status === "healthy" ? "verified" :
                                  result.status === "unhealthy" ? "failed" : "error";

      return supabase
        .from("demos")
        .update({
          http_status: result.http_status,
          response_time_ms: result.response_time_ms,
          health_score: healthScore,
          verification_status: verificationStatus,
          last_health_check: new Date().toISOString(),
          last_verified_at: result.status === "healthy" ? new Date().toISOString() : null,
        })
        .eq("id", result.id);
    });

    await Promise.all(updates);

    const summary = {
      total: results.length,
      healthy: results.filter((r) => r.status === "healthy").length,
      unhealthy: results.filter((r) => r.status === "unhealthy").length,
      error: results.filter((r) => r.status === "error").length,
    };

    return new Response(
      JSON.stringify({ 
        message: "Health check completed",
        summary,
        results 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Health check error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
