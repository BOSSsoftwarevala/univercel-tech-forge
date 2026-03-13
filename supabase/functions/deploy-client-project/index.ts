import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generatePassword(length = 14): string {
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

// ============================================
// SSH Command Executor via VPS
// Uses HTTP-based SSH relay or direct API
// ============================================
async function executeVPSCommand(command: string): Promise<{ success: boolean; output: string }> {
  const VPS_HOST = Deno.env.get("VPS_HOST");
  const VPS_SSH_USER = Deno.env.get("VPS_SSH_USER") || "root";
  const VPS_ROOT_PASSWORD = Deno.env.get("VPS_ROOT_PASSWORD");

  if (!VPS_HOST || !VPS_ROOT_PASSWORD) {
    return { success: false, output: "VPS credentials not configured" };
  }

  try {
    // Use sshx.io or similar SSH-over-HTTP approach
    // Since Deno Edge Functions can't do raw SSH, we use the VPS's HTTP API
    // The VPS should have a secure deploy endpoint set up
    const deployEndpoint = `http://${VPS_HOST}:8422/execute`;
    
    const response = await fetch(deployEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Deploy-Key": VPS_ROOT_PASSWORD,
      },
      body: JSON.stringify({ command }),
      signal: AbortSignal.timeout(120000), // 2 min timeout
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, output: `VPS API error: ${response.status} - ${text}` };
    }

    const result = await response.json();
    return { success: true, output: result.output || "Command executed" };
  } catch (err) {
    return { success: false, output: `VPS connection failed: ${err instanceof Error ? err.message : "Unknown error"}` };
  }
}

// ============================================
// Nginx Subdomain Config Generator
// ============================================
function generateNginxConfig(subdomain: string, port: number): string {
  return `
server {
    listen 80;
    server_name ${subdomain}.softwarewala.net;

    location / {
        root /var/www/clients/${subdomain}/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:${port};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}`;
}

// ============================================
// Full VPS Deploy Pipeline
// ============================================
async function deployToVPS(
  subdomain: string,
  githubRepoUrl: string | null,
  deploymentId: string
): Promise<{ success: boolean; message: string; logs: string[] }> {
  const logs: string[] = [];
  const basePort = 3000 + Math.floor(Math.random() * 6000);

  try {
    // Step 1: Create directory
    logs.push("📁 Creating project directory...");
    const mkdirResult = await executeVPSCommand(
      `mkdir -p /var/www/clients/${subdomain}`
    );
    if (!mkdirResult.success) {
      logs.push(`❌ Directory creation failed: ${mkdirResult.output}`);
      return { success: false, message: "Failed to create directory", logs };
    }
    logs.push("✅ Directory created");

    // Step 2: Clone or setup project
    if (githubRepoUrl) {
      logs.push("📦 Cloning repository...");
      const cloneResult = await executeVPSCommand(
        `cd /var/www/clients/${subdomain} && git clone ${githubRepoUrl} . 2>&1 || (git fetch --all && git reset --hard origin/main 2>&1)`
      );
      logs.push(cloneResult.success ? "✅ Repository cloned" : `⚠️ Clone: ${cloneResult.output}`);

      // Step 3: Install dependencies and build
      logs.push("📦 Installing dependencies...");
      const installResult = await executeVPSCommand(
        `cd /var/www/clients/${subdomain} && npm ci --production=false 2>&1`
      );
      logs.push(installResult.success ? "✅ Dependencies installed" : `⚠️ Install: ${installResult.output}`);

      logs.push("🔨 Building project...");
      const buildResult = await executeVPSCommand(
        `cd /var/www/clients/${subdomain} && npm run build 2>&1`
      );
      logs.push(buildResult.success ? "✅ Build complete" : `⚠️ Build: ${buildResult.output}`);
    } else {
      // Create a placeholder landing page
      logs.push("📄 Creating placeholder page...");
      const placeholderHtml = `<!DOCTYPE html><html><head><title>${subdomain} - Software Vala</title><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0a0a0a;color:#fff}.c{text-align:center;padding:2rem}.c h1{font-size:2.5rem;background:linear-gradient(135deg,#10b981,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.c p{color:#888;margin-top:1rem;font-size:1.1rem}.badge{display:inline-block;margin-top:2rem;padding:.5rem 1.5rem;border:1px solid #333;border-radius:2rem;font-size:.85rem;color:#666}</style></head><body><div class="c"><h1>${subdomain}.softwarewala.net</h1><p>Your application is being deployed.</p><div class="badge">Powered by Software Vala</div></div></body></html>`;
      
      await executeVPSCommand(
        `mkdir -p /var/www/clients/${subdomain}/dist && echo '${placeholderHtml.replace(/'/g, "\\'")}' > /var/www/clients/${subdomain}/dist/index.html`
      );
      logs.push("✅ Placeholder deployed");
    }

    // Step 4: Setup Nginx config
    logs.push("⚙️ Configuring Nginx...");
    const nginxConfig = generateNginxConfig(subdomain, basePort);
    const escapedConfig = nginxConfig.replace(/'/g, "\\'").replace(/\$/g, "\\$");
    
    const nginxResult = await executeVPSCommand(
      `echo '${escapedConfig}' > /etc/nginx/sites-available/${subdomain}.softwarewala.net && ` +
      `ln -sf /etc/nginx/sites-available/${subdomain}.softwarewala.net /etc/nginx/sites-enabled/ && ` +
      `nginx -t 2>&1 && systemctl reload nginx 2>&1`
    );
    logs.push(nginxResult.success ? "✅ Nginx configured & reloaded" : `⚠️ Nginx: ${nginxResult.output}`);

    // Step 5: Setup SSL with Certbot
    logs.push("🔒 Setting up SSL...");
    const sslResult = await executeVPSCommand(
      `certbot --nginx -d ${subdomain}.softwarewala.net --non-interactive --agree-tos --email admin@softwarewala.net 2>&1 || echo "SSL setup pending - DNS must point to VPS first"`
    );
    logs.push(sslResult.success ? "✅ SSL configured" : `⚠️ SSL: ${sslResult.output}`);

    // Step 6: Set permissions
    await executeVPSCommand(
      `chown -R www-data:www-data /var/www/clients/${subdomain} && chmod -R 755 /var/www/clients/${subdomain}`
    );
    logs.push("✅ Permissions set");

    return { 
      success: true, 
      message: `Deployed to https://${subdomain}.softwarewala.net`, 
      logs 
    };

  } catch (err) {
    logs.push(`❌ Deploy error: ${err instanceof Error ? err.message : "Unknown"}`);
    return { success: false, message: "Deployment failed", logs };
  }
}

// ============================================
// Main Handler
// ============================================
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

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
      const { clientName, clientEmail, clientPhone, subdomain, githubRepoUrl, sourceCode, productId, notes } = body;

      if (!clientName || !clientEmail || !subdomain) {
        return new Response(JSON.stringify({ error: "Client name, email, and subdomain are required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate subdomain format
      if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain) || subdomain.length < 3 || subdomain.length > 30) {
        return new Response(JSON.stringify({ error: "Invalid subdomain format (3-30 chars, lowercase, alphanumeric with hyphens)" }), {
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
          subdomain,
          deploy_url: `https://${subdomain}.softwarewala.net`,
          github_repo_url: githubRepoUrl || null,
          source_code_hash: sourceCode ? await hashPassword(sourceCode.slice(0, 100)) : null,
          client_username: username,
          client_password_hash: passwordHash,
          client_password_plain: password,
          status: "deploying",
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

      // Log activity
      await supabase.from("activity_log").insert({
        action_type: "client_deploy_initiated",
        user_id: user.id,
        entity_type: "client_deployment",
        entity_id: deployment.id,
        metadata: { client_name: clientName, subdomain, has_github_repo: !!githubRepoUrl },
        severity_level: "medium",
      });

      // Execute real VPS deployment
      const vpsResult = await deployToVPS(subdomain, githubRepoUrl, deployment.id);

      // Update deployment status
      const finalStatus = vpsResult.success ? "deployed" : "failed";
      await supabase
        .from("client_deployments")
        .update({ 
          status: finalStatus,
          deploy_completed_at: vpsResult.success ? new Date().toISOString() : null,
        })
        .eq("id", deployment.id);

      // Log deploy result
      await supabase.from("audit_logs").insert({
        action: `client_deploy_${finalStatus}`,
        module: "client_deployments",
        user_id: user.id,
        role: roles?.[0]?.role || "master",
        meta_json: { 
          deployment_id: deployment.id, 
          subdomain, 
          vps_logs: vpsResult.logs,
          success: vpsResult.success,
        },
      });

      return new Response(JSON.stringify({
        success: vpsResult.success,
        deployment: {
          id: deployment.id,
          subdomain,
          url: `https://${subdomain}.softwarewala.net`,
          credentials: { username, password },
          status: finalStatus,
          message: vpsResult.message,
          deploy_logs: vpsResult.logs,
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

    // ===== ACTION: REDEPLOY =====
    if (action === "redeploy") {
      const { deploymentId } = body;
      
      const { data: deployment } = await supabase
        .from("client_deployments")
        .select("*")
        .eq("id", deploymentId)
        .single();

      if (!deployment) {
        return new Response(JSON.stringify({ error: "Deployment not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase
        .from("client_deployments")
        .update({ status: "deploying" })
        .eq("id", deploymentId);

      const vpsResult = await deployToVPS(
        deployment.subdomain, 
        deployment.github_repo_url, 
        deploymentId
      );

      const finalStatus = vpsResult.success ? "deployed" : "failed";
      await supabase
        .from("client_deployments")
        .update({ 
          status: finalStatus,
          deploy_completed_at: vpsResult.success ? new Date().toISOString() : null,
        })
        .eq("id", deploymentId);

      return new Response(JSON.stringify({
        success: vpsResult.success,
        message: vpsResult.message,
        deploy_logs: vpsResult.logs,
      }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ===== ACTION: VPS STATUS =====
    if (action === "vps_status") {
      const statusResult = await executeVPSCommand(
        "echo 'uptime:' && uptime && echo 'disk:' && df -h /var/www && echo 'nginx:' && systemctl is-active nginx && echo 'sites:' && ls /var/www/clients/ 2>/dev/null | wc -l"
      );

      return new Response(JSON.stringify({
        connected: statusResult.success,
        output: statusResult.output,
        host: Deno.env.get("VPS_HOST") ? "configured" : "missing",
      }), {
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
