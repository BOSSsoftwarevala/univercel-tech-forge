import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This is a one-time bootstrap function - no auth required
// It's protected by being a one-time operation (won't recreate existing admins)
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Allow GET for easy browser trigger
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const masterPassword = Deno.env.get("MASTER_ADMIN_PASSWORD");
    const superAdminPassword = Deno.env.get("SUPER_ADMIN_PASSWORD");

    if (!masterPassword || !superAdminPassword) {
      return new Response(
        JSON.stringify({ error: "Admin passwords not configured in secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const results: any[] = [];

    // Bootstrap Master Admin
    const masterEmail = "hellosoftwarevala@gmail.com";
    const { data: existingMaster } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .eq("role", "master")
      .maybeSingle();

    if (!existingMaster) {
      // Check if user exists in auth
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = authUsers?.users?.find(u => u.email === masterEmail);

      let masterUserId: string;

      if (existingUser) {
        masterUserId = existingUser.id;
        // Update password
        await supabaseAdmin.auth.admin.updateUserById(masterUserId, {
          password: masterPassword
        });
        results.push({ email: masterEmail, action: "password_updated", role: "master" });
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: masterEmail,
          password: masterPassword,
          email_confirm: true,
          user_metadata: { full_name: "Master Admin", role: "master" }
        });

        if (createError) {
          results.push({ email: masterEmail, error: createError.message });
        } else {
          masterUserId = newUser.user.id;
          results.push({ email: masterEmail, action: "created", role: "master" });
        }
      }

      // Ensure role entry exists
      if (masterUserId!) {
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

      let superAdminUserId: string;

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
        } else {
          superAdminUserId = newUser.user.id;
          results.push({ email: superAdminEmail, action: "created", role: "super_admin" });
        }
      }

      if (superAdminUserId!) {
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
