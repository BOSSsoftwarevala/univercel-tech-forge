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
    const masterPassword = Deno.env.get("MASTER_ADMIN_PASSWORD");
    const superAdminPassword = Deno.env.get("SUPER_ADMIN_PASSWORD");

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

    // Allow first-time bootstrap if no master exists yet
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: existingMasterCheck } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "master")
      .maybeSingle();

    // If master exists and caller is not master, deny access
    if (existingMasterCheck && (!roleData || roleData.role !== "master")) {
      console.log("Unauthorized bootstrap attempt by user:", user.id);
      return new Response(
        JSON.stringify({ error: "Only Master Admin can perform this action" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!masterPassword || !superAdminPassword) {
      return new Response(
        JSON.stringify({ error: "Admin passwords not configured in secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Array<{ email: string; action?: string; role?: string; error?: string }> = [];

    // Bootstrap Master Admin
    const masterEmail = "hellosoftwarevala@gmail.com";
    const { data: existingMaster } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .eq("role", "master")
      .maybeSingle();

    if (!existingMaster) {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = authUsers?.users?.find(u => u.email === masterEmail);

      let masterUserId: string | undefined;

      if (existingUser) {
        masterUserId = existingUser.id;
        await supabaseAdmin.auth.admin.updateUserById(masterUserId, {
          password: masterPassword
        });
        results.push({ email: masterEmail, action: "password_updated", role: "master" });
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: masterEmail,
          password: masterPassword,
          email_confirm: true,
          user_metadata: { full_name: "Master Admin", role: "master" }
        });

        if (createError) {
          results.push({ email: masterEmail, error: createError.message });
        } else if (newUser?.user) {
          masterUserId = newUser.user.id;
          results.push({ email: masterEmail, action: "created", role: "master" });
        }
      }

      if (masterUserId) {
        const { data: existingRole } = await supabaseAdmin
          .from("user_roles")
          .select("id")
          .eq("user_id", masterUserId)
          .maybeSingle();

        if (existingRole) {
          await supabaseAdmin
            .from("user_roles")
            .update({ role: "master", approval_status: "approved", approved_at: new Date().toISOString() })
            .eq("user_id", masterUserId);
        } else {
          await supabaseAdmin
            .from("user_roles")
            .insert({ 
              user_id: masterUserId, 
              role: "master", 
              approval_status: "approved",
              approved_at: new Date().toISOString()
            });
        }
      }
    } else {
      results.push({ email: masterEmail, action: "already_exists", role: "master" });
    }

    // Bootstrap Super Admin
    const superAdminEmail = "superadmin@softwarevala.com";
    const { data: existingSuperAdmin } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "super_admin")
      .maybeSingle();

    if (!existingSuperAdmin) {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = authUsers?.users?.find(u => u.email === superAdminEmail);

      let superAdminUserId: string | undefined;

      if (existingUser) {
        superAdminUserId = existingUser.id;
        await supabaseAdmin.auth.admin.updateUserById(superAdminUserId, {
          password: superAdminPassword
        });
        results.push({ email: superAdminEmail, action: "password_updated", role: "super_admin" });
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: superAdminEmail,
          password: superAdminPassword,
          email_confirm: true,
          user_metadata: { full_name: "Super Admin", role: "super_admin" }
        });

        if (createError) {
          results.push({ email: superAdminEmail, error: createError.message });
        } else if (newUser?.user) {
          superAdminUserId = newUser.user.id;
          results.push({ email: superAdminEmail, action: "created", role: "super_admin" });
        }
      }

      if (superAdminUserId) {
        const { data: existingRole } = await supabaseAdmin
          .from("user_roles")
          .select("id")
          .eq("user_id", superAdminUserId)
          .maybeSingle();

        if (existingRole) {
          await supabaseAdmin
            .from("user_roles")
            .update({ role: "super_admin", approval_status: "approved", approved_at: new Date().toISOString() })
            .eq("user_id", superAdminUserId);
        } else {
          await supabaseAdmin
            .from("user_roles")
            .insert({ 
              user_id: superAdminUserId, 
              role: "super_admin", 
              approval_status: "approved",
              approved_at: new Date().toISOString()
            });
        }
      }
    } else {
      results.push({ email: superAdminEmail, action: "already_exists", role: "super_admin" });
    }

    // Log to audit trail
    await supabaseAdmin.from("audit_logs").insert({
      user_id: user.id,
      action: "bootstrap_admins_function_executed",
      module: "security",
      role: "master",
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
