/**
 * VALA CONTINUOUS BUILDER - Edge Function
 * Generates software specs for each queued build using Lovable AI
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PIPELINE_STEPS = [
  'selecting_category',
  'generating_ui',
  'generating_backend',
  'creating_database',
  'generating_api',
  'debugging',
  'auto_fixing',
  'building',
  'deploying_demo',
  'generating_domain',
  'creating_repo',
  'publishing_marketplace',
  'completed'
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { buildId } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the build record
    const { data: build, error: fetchError } = await supabase
      .from('vala_auto_builds')
      .select('*')
      .eq('id', buildId)
      .single();

    if (fetchError || !build) {
      return new Response(
        JSON.stringify({ error: "Build not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as building
    await supabase.from('vala_auto_builds').update({
      status: 'building',
      started_at: new Date().toISOString(),
      current_step: 'selecting_category',
      build_progress: 5,
    }).eq('id', buildId);

    // Generate software specs using Lovable AI
    const prompt = `You are VALA AI Software Factory. Generate a complete software specification for:

Category: ${build.category}
Software Name: ${build.software_name}
Logo Concept: ${build.logo_description}

Generate a JSON response with:
1. tagline - One-line product tagline (max 10 words)
2. description - 2-3 sentence product description
3. features - Array of 6 key features (short strings)
4. tech_stack - Object with: frontend, backend, database, hosting
5. screens - Array of 5 main screen names
6. api_endpoints - Number of API endpoints
7. db_tables - Number of database tables
8. estimated_price - Price in USD (between 499-9999)
9. demo_subdomain - Suggested subdomain (lowercase, no spaces, use hyphens)
10. color_primary - Primary brand color hex code
11. color_secondary - Secondary brand color hex code`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        tools: [{
          type: "function",
          function: {
            name: "generate_software_spec",
            description: "Generate complete software specification",
            parameters: {
              type: "object",
              properties: {
                tagline: { type: "string" },
                description: { type: "string" },
                features: { type: "array", items: { type: "string" } },
                tech_stack: {
                  type: "object",
                  properties: {
                    frontend: { type: "string" },
                    backend: { type: "string" },
                    database: { type: "string" },
                    hosting: { type: "string" }
                  },
                  required: ["frontend", "backend", "database", "hosting"]
                },
                screens: { type: "array", items: { type: "string" } },
                api_endpoints: { type: "number" },
                db_tables: { type: "number" },
                estimated_price: { type: "number" },
                demo_subdomain: { type: "string" },
                color_primary: { type: "string" },
                color_secondary: { type: "string" }
              },
              required: ["tagline", "description", "features", "tech_stack", "screens", "api_endpoints", "db_tables", "estimated_price", "demo_subdomain", "color_primary", "color_secondary"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_software_spec" } }
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        await supabase.from('vala_auto_builds').update({
          status: 'error', error_message: 'Rate limit exceeded. Retrying later.',
          current_step: 'error'
        }).eq('id', buildId);
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (status === 402) {
        await supabase.from('vala_auto_builds').update({
          status: 'error', error_message: 'AI credits exhausted.',
          current_step: 'error'
        }).eq('id', buildId);
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      throw new Error(`AI error: ${status}`);
    }

    const aiData = await aiResponse.json();
    let specs: any = {};

    // Extract from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      specs = typeof toolCall.function.arguments === 'string'
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    }

    // Generate demo domain and repo
    const subdomain = specs.demo_subdomain || build.software_name.toLowerCase().replace(/\s+/g, '-');
    const demoDomain = `${subdomain}.softwarevala.com`;
    const repoUrl = `https://github.com/BOSSsoftwarevala/${subdomain}`;

    // Update build as completed
    await supabase.from('vala_auto_builds').update({
      status: 'completed',
      build_progress: 100,
      current_step: 'completed',
      specs_json: specs,
      demo_domain: demoDomain,
      repository_url: repoUrl,
      completed_at: new Date().toISOString(),
    }).eq('id', buildId);

    return new Response(JSON.stringify({
      success: true,
      buildId,
      software_name: build.software_name,
      demo_domain: demoDomain,
      repository_url: repoUrl,
      specs,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Continuous builder error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
