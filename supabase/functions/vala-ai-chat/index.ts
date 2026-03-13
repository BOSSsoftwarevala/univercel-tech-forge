/**
 * VALA AI Chat - 2-Tier Escalation System
 * Tier 1: VALA AI (Junior) — handles general queries
 * Tier 2: AIRA (Senior/CEO) — handles complex escalations
 * Content Filter: Bad words blocked + penalty logged
 * Persona: Professional, respectful female AI representing Software Vala
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


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



    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

    }

    console.error("Vala AI chat error:", error);

  }
});
