import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  let password = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

function generateUsername(clientName: string): string {
  return clientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12) + '_' + Math.random().toString(36).slice(2, 6);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    
    const allowedRoles = ["master", "boss_owner", "product_demo_manager"];
    const hasAccess = roles?.some(r => allowedRoles.includes(r.role));
    if (!hasAccess) {
      return new Response(JSON.stringify({ error: "Insufficient permissions" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    // ===== ACTION: DEPLOY =====
    if (action === "deploy") {
      const { 
        clientName, 
        clientEmail, 
        clientPhone,
        subdomain, 
        githubRepoUrl, 
        sourceCode,
        productId,
        notes 
      } = body;

      if (!clientName || !clientEmail || !subdomain) {
        return new Response(JSON.stringify({ error: "Client name, email, and subdomain are required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check subdomain availability
      const { data: existing } = await supabase
        .from("client_deployments")
        .select("id")
        .eq("subdomain", subdomain)
        .single();

      if (existing) {
        return new Response(JSON.stringify({ error: "Subdomain already taken" }), {
          status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Generate credentials
      const username = generateUsername(clientName);
      const password = generatePassword(14);
      const passwordHash = await hashPassword(password);

      // Create deployment record
      const { data: deployment, error: deployError } = await supabase
        .from("client_deployments")
        .insert({
          product_id: productId || null,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone || null,
          subdomain: subdomain,
          deploy_url: `https://${subdomain}.softwarewala.net`,
          github_repo_url: githubRepoUrl || null,
          source_code_hash: sourceCode ? await hashPassword(sourceCode.slice(0, 100)) : null,
          client_username: username,
          client_password_hash: passwordHash,
          client_password_plain: password, // Will be cleared after notification
          status: "pending",
          deploy_started_at: new Date().toISOString(),
          deployed_by: user.id,
          notes: notes || null,
        })
        .select()
        .single();

      if (deployError) {
        console.error("Deploy insert error:", deployError);
        return new Response(JSON.stringify({ error: "Failed to create deployment record" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Log to activity
      await supabase.from("activity_log").insert({
        action_type: "client_deploy_initiated",
        user_id: user.id,
        entity_type: "client_deployment",
        entity_id: deployment.id,
        metadata: {
          client_name: clientName,
          subdomain: subdomain,
          has_source_code: !!sourceCode,
          has_github_repo: !!githubRepoUrl,
        },
        severity_level: "medium",
      });

      // VPS Deploy simulation (actual SSH deploy needs VPS credentials)
      const VPS_HOST = Deno.env.get("VPS_HOST");
      const VPS_USER = Deno.env.get("VPS_USER");
      
      let deployStatus = "pending";
      let deployMessage = "";

      if (VPS_HOST && VPS_USER) {
        // Real VPS deployment would happen here via SSH
        // For now, mark as ready for manual deploy
        deployStatus = "ready";
        deployMessage = `Deployment record created. VPS configured at ${VPS_HOST}. Run deploy script manually or wait for auto-deploy.`;
        
        await supabase
          .from("client_deployments")
          .update({ status: "ready" })
          .eq("id", deployment.id);
      } else {
        deployStatus = "pending";
        deployMessage = "Deployment record created. VPS credentials not configured — add VPS_HOST, VPS_USER, VPS_SSH_KEY secrets to enable auto-deploy.";
      }

      return new Response(JSON.stringify({
        success: true,
        deployment: {
          id: deployment.id,
          subdomain: subdomain,
          url: `https://${subdomain}.softwarewala.net`,
          credentials: {
            username: username,
            password: password,
          },
          status: deployStatus,
          message: deployMessage,
        },
      }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ===== ACTION: LIST =====
    if (action === "list") {
      const { data: deployments, error } = await supabase
        .from("client_deployments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch deployments" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mask passwords in response
      const masked = deployments?.map(d => ({
        ...d,
        client_password_hash: undefined,
        client_password_plain: d.client_password_plain ? "••••••••" : null,
      }));

      return new Response(JSON.stringify({ deployments: masked }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ===== ACTION: GET CREDENTIALS =====
    if (action === "get_credentials") {
      const { deploymentId } = body;
      
      const { data: deployment } = await supabase
        .from("client_deployments")
        .select("client_username, client_password_plain, deploy_url, client_name, client_email")
        .eq("id", deploymentId)
        .single();

      if (!deployment) {
        return new Response(JSON.stringify({ error: "Deployment not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Log credential access
      await supabase.from("audit_logs").insert({
        action: "credentials_accessed",
        module: "client_deployments",
        user_id: user.id,
        role: roles?.[0]?.role || "master",
        meta_json: { deployment_id: deploymentId },
      });

      return new Response(JSON.stringify({ credentials: deployment }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Deploy error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
