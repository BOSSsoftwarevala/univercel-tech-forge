import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// All permanent user credentials
const PERMANENT_USERS = [
  // GRADE 0 — OWNERSHIP (Boss Owner - merged master/super_admin)
  { email: "manojcopy264@gmail.com", password: "X9@Q!7K#A2W$R6M^ZpF8x5LHN", role: "boss_owner" },
  
  // GRADE 1 — PLATFORM CONTROL
  { email: "admin@gmail.com", password: "N8$W@A6QZ!x5F9#R2K^M7p", role: "admin" },
  { email: "servermanager@gmail.com", password: "@6KZ2M9#A!p7W$QxR8^F5", role: "server_manager" },
  
  // GRADE 2 — BUSINESS MANAGEMENT
  { email: "franchisemanager@gmail.com", password: "R!9#A5$Zx7M2^K8FQ@W6p", role: "franchise_manager" },
  { email: "salesmanager@gmail.com", password: "$7FZ9!R2@Q^8A#W6KxM5p", role: "sales_support" },
  { email: "resellermanager@gmail.com", password: "8Z#@A6Q!W5M9^F2xR7$Kp", role: "reseller_manager" },
  { email: "apimanager@gmail.com", password: "Q@9F6$Z#W2A7^M5x8R!Kp", role: "api_ai_manager" },
  { email: "influencermanager@gmail.com", password: "Z6!@R8A5#Q7^xK$2W9MpF", role: "influencer_manager" },
  { email: "seomanager@gmail.com", password: "@Q6#9Z$A!R7M5^W2Kx8pF", role: "seo_manager" },
  { email: "marketingmanager@gmail.com", password: "5Q#@!9ZxW7R^A6K$2M8pF", role: "marketing_manager" },
  { email: "leadmanager@gmail.com", password: "Z!9@Q#A6^7W2R5M$Kx8pF", role: "lead_manager" },
  { email: "promanager@gmail.com", password: "@Z6#9Q!A5W7^2R$KxM8pF", role: "pro_manager" },
  { email: "legalmanager@gmail.com", password: "9Z@!6Q#A7W5^2R$KxM8pF", role: "legal_manager" },
  { email: "taskmanager@gmail.com", password: "Z@Q!9#6A7W5^2R$KxM8pF", role: "task_manager" },
  { email: "hrmanager@gmail.com", password: "@Z9!Q#A6W7^5R2$KxM8pF", role: "hr_manager" },
  { email: "developermanager@gmail.com", password: "ZQ@!9#A6W7^5R2$KxM8pF", role: "developer_manager" },
  
  // GRADE 3 — PARTNERS
  { email: "franchise@gmail.com", password: "R7!M$Q9#A6^ZK2W5x8Fp", role: "franchise" },
  { email: "developer@gmail.com", password: "D8#Z!A5^W2M$KQ9x7RFp", role: "developer" },
  { email: "reseller@gmail.com", password: "S9@Q#A6^7W2R5M$Kx8pF", role: "reseller" },
  { email: "influencer@gmail.com", password: "I6!@R8A5#Q7^xK$2W9Mp", role: "influencer" },
  
  // GRADE 4 — USERS & SYSTEM
  { email: "primeuser@gmail.com", password: "P@9F6$Z#W2A7^M5x8R!K", role: "prime_user" },
  { email: "user@gmail.com", password: "U7!M$Q9#A6^ZK2W5x8Fp", role: "user" },
  { email: "safeassist@gmail.com", password: "S6!@R8A5#Q7^xK$2W9Mp", role: "safe_assist" },
  { email: "assistmanager@gmail.com", password: "A9@Q#A6^7W2R5M$Kx8p", role: "assist_manager" },
  { email: "promisetracker@gmail.com", password: "T8#Z!A5^W2M$KQ9x7RFp", role: "promise_tracker" },
  { email: "promisemanagement@gmail.com", password: "M6!@R8A5#Q7^xK$2W9Mp", role: "promise_management" },
  { email: "demomanager@gmail.com", password: "DM9@Q#A6^7W2R5M$Kx8p", role: "demo_manager" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify caller is master admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Verify caller
    const userClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });
    
    const { data: { user: caller } } = await userClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if caller is master
    const { data: callerRole } = await userClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .single();

    if (callerRole?.role !== "master") {
      return new Response(JSON.stringify({ error: "Only Master Admin can execute this" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client for user management
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const results: any[] = [];
    const permanentEmails = PERMANENT_USERS.map(u => u.email.toLowerCase());

    // Step 1: Get all existing users
    const { data: existingAuthUsers } = await adminClient.auth.admin.listUsers();
    const existingEmails = existingAuthUsers?.users?.map(u => u.email?.toLowerCase()) || [];

    // Step 2: Create or update each permanent user
    for (const user of PERMANENT_USERS) {
      try {
        const emailLower = user.email.toLowerCase();
        const existingUser = existingAuthUsers?.users?.find(u => u.email?.toLowerCase() === emailLower);

        if (existingUser) {
          // Update existing user password
          const { error: updateError } = await adminClient.auth.admin.updateUserById(
            existingUser.id,
            { password: user.password, email_confirm: true }
          );

          if (updateError) {
            results.push({ email: user.email, status: "update_failed", error: updateError.message });
            continue;
          }

          // Ensure role is correct
          await adminClient.from("user_roles").upsert({
            user_id: existingUser.id,
            role: user.role,
            approval_status: "approved",
            approved_at: new Date().toISOString(),
          }, { onConflict: "user_id" });

          results.push({ email: user.email, role: user.role, status: "updated" });
        } else {
          // Create new user
          const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
          });

          if (createError) {
            results.push({ email: user.email, status: "create_failed", error: createError.message });
            continue;
          }

          // Assign role
          await adminClient.from("user_roles").insert({
            user_id: newUser.user.id,
            role: user.role,
            approval_status: "approved",
            approved_at: new Date().toISOString(),
          });

          results.push({ email: user.email, role: user.role, status: "created" });
        }
      } catch (err) {
        results.push({ email: user.email, status: "error", error: String(err) });
      }
    }

    // Step 3: Identify users to remove (not in permanent list)
    const usersToRemove = existingAuthUsers?.users?.filter(
      u => u.email && !permanentEmails.includes(u.email.toLowerCase())
    ) || [];

    // Step 4: Remove non-permanent users
    let removedCount = 0;
    for (const userToRemove of usersToRemove) {
      try {
        // Delete from user_roles first
        await adminClient.from("user_roles").delete().eq("user_id", userToRemove.id);
        
        // Delete auth user
        await adminClient.auth.admin.deleteUser(userToRemove.id);
        removedCount++;
      } catch (err) {
        console.error(`Failed to remove user ${userToRemove.email}:`, err);
      }
    }

    // Log the operation
    await adminClient.from("audit_logs").insert({
      user_id: caller.id,
      action: "bootstrap_all_users_clean_sweep",
      module: "security",
      role: "master",
      meta_json: {
        permanent_users: results.length,
        removed_users: removedCount,
        timestamp: new Date().toISOString(),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Clean sweep completed",
        permanent_users: results,
        removed_count: removedCount,
        total_active: PERMANENT_USERS.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
