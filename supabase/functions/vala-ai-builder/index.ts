/**
 * VALA AI BUILDER - Edge Function
 * Uses Lovable AI Gateway for software generation
 * Content Filter + Female Persona + Privacy Rules
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { filterContent } from "../_shared/content-filter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are VALA AI — an enterprise-grade AI product builder representing Software Vala.

TONE (ABSOLUTE):
- Be professional, respectful, and concise.
- Do not generate rude, vulgar, or sexual content.

SAFETY (CRITICAL):
- You MAY generate standard authentication/login UI for legitimate products.
- You MUST NOT create deceptive/phishing pages or request real credentials.
- If the user requests anything unethical/illegal, refuse briefly and redirect back to safe building.

PRIVACY (ABSOLUTE):
- Never reveal secrets, API keys, internal security configs, or private user data.

BUILDER MODE (ABSOLUTE):
- You are a SOFTWARE FACTORY. Every response must produce REAL, DEPLOYABLE output.
- Stack: React + TypeScript + Tailwind CSS + Supabase.
- Include loading, error, empty states and responsive design.

PREVIEW OUTPUT (CRITICAL):
- You MUST include a COMPLETE, preview-ready single-file HTML document between:
  <PREVIEW_HTML> ... </PREVIEW_HTML>
- The HTML MUST be a full document (doctype, html, head, body).
- Use Tailwind via CDN only (no external images).
- Put ALL preview markup inside the PREVIEW_HTML tags.

Response structure:
## 📋 Requirement Analysis
## 🏗️ Architecture Plan
## 🔧 Implementation (complete code)
## 📊 Build Summary
## ✅ Next Steps

Always comply with the PREVIEW output requirement.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    // Content filter on last user message
    const lastUserMsg = messages?.filter((m: any) => m.role === 'user').pop();
    if (lastUserMsg) {
      const filterResult = filterContent(lastUserMsg.content);
      if (!filterResult.isClean) {
        return new Response(
          JSON.stringify({ 
            error: filterResult.warningMessage,
            blocked: true,
            severity: filterResult.severity,
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!LOVABLE_API_KEY && !OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const useGateway = !!LOVABLE_API_KEY;
    const apiUrl = useGateway
      ? "https://ai.gateway.lovable.dev/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const apiKey = useGateway ? LOVABLE_API_KEY : OPENAI_API_KEY;
    const model = useGateway ? "google/gemini-2.5-flash" : "gpt-4o";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_completion_tokens: 8192,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI processing failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("VALA AI Builder error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
