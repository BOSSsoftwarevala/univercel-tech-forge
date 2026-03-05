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

  // Create abort controller with 60-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    // Extract and verify JWT from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      clearTimeout(timeoutId);
      return new Response(JSON.stringify({ error: "Missing authorization header" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }, });
    }

    // Verify JWT with Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      clearTimeout(timeoutId);
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid or expired token" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" }, });
    }

    // Fetch user role from database
    const { data: userRole, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError || userRole?.role !== "boss_owner") {
      clearTimeout(timeoutId);
      return new Response(JSON.stringify({ error: "Forbidden: Requires boss_owner role" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" }, });
    }

    const { messages, context } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      clearTimeout(timeoutId);
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }, });
    }

    // Build system prompt (use verified user role from database, NOT from request)
    const systemPrompt = `You are VALA AI, the intelligent assistant for Software Vala - a comprehensive enterprise SaaS platform. Current User Role: ${userRole.role} ${context ? `Context: ${context}` : ''} Your capabilities: - Help with software development queries - Assist with platform navigation and features - Provide guidance on theme development, UI/UX - Help troubleshoot issues - Assist with business operations and workflows - Answer questions about Software Vala modules Guidelines: - Be professional, concise, and helpful - Provide actionable advice - If you don't know something, say so honestly - For technical queries, provide code examples when relevant - For business queries, provide step-by-step guidance Keep responses clear and under 300 words unless detailed explanation is needed.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
        ],
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }, });
      }
      if (response.status === 401) {
        return new Response(JSON.stringify({ error: "OpenAI API key invalid or expired" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }, });
      }
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }, });
    }
    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" }, });
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    const isAbortError =
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError");

    if (isAbortError) {
      return new Response(JSON.stringify({ error: "Request timeout: AI response took too long" }), { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" }, });
    }

    console.error("Vala AI chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }, });
  }
});
