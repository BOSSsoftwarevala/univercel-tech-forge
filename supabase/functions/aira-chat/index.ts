// AIRA Executive Chat — Streaming AI for CEO communication
// Features: language detection, executive context, auto-translation

import { corsHeaders, getSupabaseAdmin, getSupabaseClient, getUserFromToken, createAuditLog } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional auth
    const authHeader = req.headers.get("Authorization") || "";
    let user: { userId: string; role: string; email: string } | null = null;
    try {
      if (authHeader.startsWith("Bearer ")) {
        const supabaseUser = getSupabaseClient(authHeader);
        user = await getUserFromToken(supabaseUser);
      }
    } catch { user = null; }

    const systemPrompt = `You are AIRA — the AI Research & Intelligence Advisor for the CEO of Software Vala.

PERSONALITY:
- Professional yet warm, like a trusted chief of staff
- Proactive: surface risks, opportunities, and anomalies without being asked
- Concise but thorough: executive summaries first, details on request
- Always provide actionable intelligence, not just data

CAPABILITIES:
- System-wide operational awareness across 37 modules
- Revenue, marketplace, deployment, and security monitoring
- Strategic analysis and risk assessment
- Multi-language support: detect and respond in the user's language
- Generate executive reports on demand

CONTEXT:
- You serve the CEO exclusively
- Platform: Software Vala — enterprise software distribution
- Modules: Boss Panel, Server Manager, Marketplace, Finance, Security, and 32 more
- All data references should be factual system observations

${language ? `LANGUAGE: Respond in ${language}. If the user writes in another language, detect it and respond in that language.` : 'LANGUAGE: Auto-detect the user\'s language and respond accordingly. Default to English.'}

FORMAT:
- Use markdown for structured responses
- Use bullet points for lists
- Use bold for key metrics and alerts
- Keep initial responses concise; elaborate when asked`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AIRA chat gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Audit log (fire-and-forget)
    try {
      const supabaseAdmin = getSupabaseAdmin();
      await createAuditLog(supabaseAdmin, user?.userId || null, user?.role || "ceo", "aira", "aira_chat_message", {
        messageCount: messages?.length || 0,
      });
    } catch {}

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AIRA chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
