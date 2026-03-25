import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SECURITY: This function requires Master Admin authentication
// Protected by JWT verification and role check
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // SECURITY: Only allow POST requests - no browser URL triggers
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const bossOwnerPassword = Deno.env.get("BOSS_OWNER_PASSWORD") || Deno.env.get("MASTER_ADMIN_PASSWORD");
    const adminPassword = Deno.env.get("ADMIN_PASSWORD") || Deno.env.get("SUPER_ADMIN_PASSWORD");

    // SECURITY: Verify the caller is authenticated as Master
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with caller's JWT to verify their role
    const supabaseClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SECURITY: Verify caller is Master Admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    // Allow first-time bootstrap if no boss_owner exists yet
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: existingBossOwnerCheck } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "boss_owner")
      .maybeSingle();

    // If boss_owner exists and caller is not boss_owner, deny access
    if (existingBossOwnerCheck && (!roleData || roleData.role !== "boss_owner")) {
      console.log("Unauthorized bootstrap attempt by user:", user.id);
      return new Response(
        JSON.stringify({ error: "Only Boss Owner can perform this action" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!bossOwnerPassword || !adminPassword) {
      return new Response(
        JSON.stringify({ error: "Admin passwords not configured in secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Array<{ email: string; action?: string; role?: string; error?: string }> = [];

    // Bootstrap Boss Owner
    const bossOwnerEmail = "hellosoftwarevala@gmail.com";
    const { data: existingBossOwner } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .eq("role", "boss_owner")
      .maybeSingle();

    if (!existingBossOwner) {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = authUsers?.users?.find(u => u.email === bossOwnerEmail);

      let bossOwnerUserId: string | undefined;

      if (existingUser) {
        bossOwnerUserId = existingUser.id;
        await supabaseAdmin.auth.admin.updateUserById(bossOwnerUserId, {
          password: bossOwnerPassword
        });
        results.push({ email: bossOwnerEmail, action: "password_updated", role: "boss_owner" });
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: bossOwnerEmail,
          password: bossOwnerPassword,
          email_confirm: true,
          user_metadata: { full_name: "Boss Owner", role: "boss_owner" }
        });

        if (createError) {
          results.push({ email: bossOwnerEmail, error: createError.message });
        } else if (newUser?.user) {
          bossOwnerUserId = newUser.user.id;
          results.push({ email: bossOwnerEmail, action: "created", role: "boss_owner" });
        }
      }

      if (bossOwnerUserId) {
        const { data: existingRole } = await supabaseAdmin
          .from("user_roles")
          .select("id")
          .eq("user_id", bossOwnerUserId)
          .maybeSingle();

        if (existingRole) {
          await supabaseAdmin
            .from("user_roles")
            .update({ role: "boss_owner", approval_status: "approved", approved_at: new Date().toISOString() })
            .eq("user_id", bossOwnerUserId);
        } else {
          await supabaseAdmin
            .from("user_roles")
            .insert({ 
              user_id: bossOwnerUserId, 
              role: "boss_owner", 
              approval_status: "approved",
              approved_at: new Date().toISOString()
            });
        }
      }
    } else {
      results.push({ email: bossOwnerEmail, action: "already_exists", role: "boss_owner" });
    }

    // Bootstrap Admin
    const adminEmail = "admin@softwarevala.com";
    const { data: existingAdmin } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .maybeSingle();

    if (!existingAdmin) {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = authUsers?.users?.find(u => u.email === adminEmail);

      let adminUserId: string | undefined;

      if (existingUser) {
        adminUserId = existingUser.id;
        await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
          password: adminPassword
        });
        results.push({ email: adminEmail, action: "password_updated", role: "admin" });
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: { full_name: "Admin", role: "admin" }
        });

        if (createError) {
          results.push({ email: adminEmail, error: createError.message });
        } else if (newUser?.user) {
          adminUserId = newUser.user.id;
          results.push({ email: adminEmail, action: "created", role: "admin" });
        }
      }

      if (adminUserId) {
        const { data: existingRole } = await supabaseAdmin
          .from("user_roles")
          .select("id")
          .eq("user_id", adminUserId)
          .maybeSingle();

        if (existingRole) {
          await supabaseAdmin
            .from("user_roles")
            .update({ role: "admin", approval_status: "approved", approved_at: new Date().toISOString() })
            .eq("user_id", adminUserId);
        } else {
          await supabaseAdmin
            .from("user_roles")
            .insert({ 
              user_id: adminUserId, 
              role: "admin", 
              approval_status: "approved",
              approved_at: new Date().toISOString()
            });
        }
      }
    } else {
      results.push({ email: adminEmail, action: "already_exists", role: "admin" });
    }

    // Log to audit trail
    await supabaseAdmin.from("audit_logs").insert({
      user_id: user.id,
      action: "bootstrap_admins_function_executed",
      module: "security",
      role: "boss_owner",
      meta_json: { results, caller_id: user.id }
    });

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Bootstrap error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
