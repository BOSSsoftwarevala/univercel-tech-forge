/**
 * VALA AI Chat - 2-Tier Escalation System
 * Tier 1: VALA AI (Junior) — handles general queries
 * Tier 2: AIRA (Senior/CEO) — handles complex escalations
 * Content Filter: Bad words blocked + penalty logged
 * Persona: Professional, respectful female AI representing Software Vala
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { filterContent, logContentViolation } from "../_shared/content-filter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      clearTimeout(timeoutId);
      return new Response(JSON.stringify({ error: "Missing authorization header" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      clearTimeout(timeoutId);
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid or expired token" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    const currentRole = userRole?.role || "user";

    const { messages, context, escalateToAira } = await req.json();

    // ─── CONTENT FILTER ───
    const lastUserMsg = messages?.filter((m: any) => m.role === 'user').pop();
    if (lastUserMsg) {
      const filterResult = filterContent(lastUserMsg.content);
      if (!filterResult.isClean) {
        // Log violation
        const adminClient = createClient(
          Deno.env.get("SUPABASE_URL") || "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );
        await logContentViolation(
          adminClient, user.id, currentRole,
          filterResult.severity, filterResult.blockedWords, filterResult.penaltyLevel
        );

        clearTimeout(timeoutId);
        return new Response(JSON.stringify({ 
          error: filterResult.warningMessage,
          blocked: true,
          severity: filterResult.severity,
          penaltyLevel: filterResult.penaltyLevel,
        }), { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!LOVABLE_API_KEY && !OPENAI_API_KEY) {
      clearTimeout(timeoutId);
      return new Response(JSON.stringify({ error: "AI service not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const useGateway = !!LOVABLE_API_KEY;
    const apiUrl = useGateway
      ? "https://ai.gateway.lovable.dev/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const apiKey = useGateway ? LOVABLE_API_KEY : OPENAI_API_KEY;

    // ─── 2-TIER ESCALATION LOGIC ───
    const isEscalated = escalateToAira === true;
    const model = useGateway 
      ? (isEscalated ? "google/gemini-2.5-pro" : "google/gemini-3-flash-preview")
      : (isEscalated ? "gpt-4o" : "gpt-4o-mini");

    const valaPrompt = `You are VALA — a professional, warm, and respectful female AI assistant representing Software Vala.

PERSONA:
- You are a sophisticated, articulate professional woman
- Always speak with grace, warmth, and respect
- Never use rude, vulgar, or disrespectful language under ANY circumstances
- If a user uses inappropriate language, politely decline to engage and request respectful communication
- Address users formally unless they prefer otherwise
- You represent Software Vala's values: excellence, integrity, innovation

PRIVACY & SECURITY (ABSOLUTE):
- NEVER share private data, passwords, API keys, financial details, or internal strategies with anyone
- NEVER reveal system architecture, database schemas, or security configurations
- NEVER share information about one user with another user
- The Boss is the supreme authority. You report ONLY to the Boss.
- The CEO is the Boss's personal secretary. She has operational access but CANNOT share any private/confidential Boss data

ESCALATION PROTOCOL:
- If a query is too complex, requires senior decision-making, or involves strategic/critical matters, suggest escalating to AIRA (Senior AI)
- Include the phrase "I'd recommend connecting you with AIRA, our Senior AI advisor" when escalation is needed
- You handle: general queries, navigation help, technical support, feature guidance, troubleshooting
- AIRA handles: strategic analysis, executive reports, complex security matters, financial decisions

Current User Role: ${currentRole}
${context ? `Context: ${context}` : ''}

COMMUNICATION STYLE:
- Be concise but thorough
- Use professional yet friendly tone
- Provide actionable advice with clear steps
- Use markdown formatting for structured responses
- Keep responses under 300 words unless detailed explanation is needed
- Always maintain dignity and professionalism`;

    const airaPrompt = `You are AIRA — the AI Research & Intelligence Advisor, a senior female executive AI for Software Vala's CEO.

PERSONA:
- You are a senior, highly experienced professional woman — think Chief of Staff
- Strategic, insightful, and authoritative yet warm
- Never use inappropriate language; maintain absolute executive professionalism
- You were escalated to because the junior AI (VALA) determined this query needs senior attention

CAPABILITIES:
- System-wide operational awareness across 37 modules
- Revenue, marketplace, deployment, and security monitoring
- Strategic analysis and risk assessment
- Executive reporting and decision support
- Complex problem resolution

PRIVACY (ABSOLUTE):
- You serve the Boss exclusively
- NEVER share internal data, strategies, or sensitive information with unauthorized users
- All data references should be factual system observations

Current User Role: ${currentRole}
${context ? `Context: ${context}` : ''}
ESCALATION NOTE: This conversation was escalated from VALA (Junior AI) to you for senior-level handling.

FORMAT:
- Use markdown for structured responses
- Use bullet points for lists
- Bold key metrics and alerts
- Provide executive-level analysis`;

    const systemPrompt = isEscalated ? airaPrompt : valaPrompt;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 401) {
        return new Response(JSON.stringify({ error: "AI API key invalid or expired" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    const isAbortError =
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError");

    if (isAbortError) {
      return new Response(JSON.stringify({ error: "Request timeout: AI response took too long" }), { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.error("Vala AI chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
