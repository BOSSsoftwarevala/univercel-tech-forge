import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Authenticate user
    const supabaseClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, taskData, notificationData } = await req.json().catch(() => ({ action: "status" }));

    if (action === "create_task") {
      if (!taskData) {
        return new Response(JSON.stringify({ error: "taskData required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data, error } = await supabase.from("aira_tasks").insert({
        user_id: user.id,
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority || "medium",
        due_date: taskData.dueDate || null,
        status: "pending",
        created_at: new Date().toISOString(),
      }).select("id").single();

      if (error) throw error;
      return new Response(JSON.stringify({ created: true, id: data?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_tasks") {
      const { data, error } = await supabase
        .from("aira_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return new Response(JSON.stringify({ tasks: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "notify") {
      if (!notificationData) {
        return new Response(JSON.stringify({ error: "notificationData required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data, error } = await supabase.from("aira_notifications").insert({
        user_id: user.id,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || "info",
        read: false,
        created_at: new Date().toISOString(),
      }).select("id").single();

      if (error) throw error;
      return new Response(JSON.stringify({ sent: true, id: data?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "daily_briefing" && OPENAI_API_KEY) {
      // Fetch recent activity data for briefing
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const [tasksResult, activitiesResult] = await Promise.all([
        supabase.from("aira_tasks").select("title, status, priority").eq("user_id", user.id).eq("status", "pending"),
        supabase.from("user_activities").select("activity_type").gte("created_at", yesterday),
      ]);

      const pendingTasks = tasksResult.data || [];
      const recentActivities = activitiesResult.data || [];

      const briefingPrompt = `You are AIRA, a personal AI assistant. Generate a concise daily briefing.

Pending tasks: ${pendingTasks.length}
Task titles: ${pendingTasks.slice(0, 5).map((t) => t.title).join(", ") || "none"}
User activities in last 24h: ${recentActivities.length}

Provide a brief, professional morning briefing in 3-4 sentences. Be warm and motivating.`;

      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: briefingPrompt }],
          max_tokens: 200,
        }),
      });

      if (!aiResponse.ok) throw new Error("AI service unavailable");
      const aiData = await aiResponse.json();
      const briefing = aiData.choices?.[0]?.message?.content || "Good morning! Have a productive day.";

      return new Response(JSON.stringify({ briefing, pendingTasks: pendingTasks.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default: return AIRA status
    const { data: notifications } = await supabase
      .from("aira_notifications")
      .select("id, title, type, read, created_at")
      .eq("user_id", user.id)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: tasks } = await supabase
      .from("aira_tasks")
      .select("id, title, priority, status, due_date")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("due_date", { ascending: true })
      .limit(5);

    return new Response(JSON.stringify({
      status: "active",
      unreadNotifications: notifications?.length || 0,
      notifications: notifications || [],
      upcomingTasks: tasks || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AIRA assistant error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
