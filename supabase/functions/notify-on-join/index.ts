import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      });
    }

    const {
      user_id,
      user_name,
      user_email,
      panel_name,
      role,
      company,
    } = await req.json();

    if (!user_id || !user_name || !panel_name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    // Get all boss/owner users
    const { data: bosses, error: bossError } = await supabase
      .from("users")
      .select("id")
      .in("role", ["boss_owner", "super_admin"]);

    if (bossError) throw bossError;

    // Create notification for each boss
    const notifications = bosses!.map((boss) => ({
      recipient_id: boss.id,
      recipient_role: "boss_owner",
      notification_type: "panel_join",
      title: `New Member: ${panel_name}`,
      message: `${user_name} (${user_email}) joined ${panel_name} as ${role}${company ? ` from ${company}` : ""}.`,
      action_id: user_id,
      action_user_id: user_id,
      action_user_name: user_name,
      is_read: false,
      metadata: {
        panel_name,
        role,
        company,
        user_email,
        user_id,
      },
    }));

    const { error: insertError } = await supabase
      .from("notifications")
      .insert(notifications);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Join notification sent to ${bosses!.length} boss(es)`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
