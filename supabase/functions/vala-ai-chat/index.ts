import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** ElevenLabs API character limit per request (free tier: 1000, paid: 5000) */
const ELEVENLABS_CHAR_LIMIT = 1000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userRole, context, voiceEnabled, mode, textToSynthesize } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    // ── Voice synthesis mode ───────────────────────────────────────────────
    // When mode === 'voice', synthesize textToSynthesize via ElevenLabs (server-side only).
    // Falls back to text-only response if ElevenLabs is unavailable.
    if (mode === "voice") {
      if (!voiceEnabled || userRole !== "boss_owner") {
        return new Response(JSON.stringify({ error: "Voice synthesis requires boss_owner and voice enabled" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!ELEVENLABS_API_KEY || !textToSynthesize) {
        // Graceful fallback: return empty audio signal so client stays text-only
        return new Response(JSON.stringify({ fallback: true, reason: "ElevenLabs unavailable — text-only mode" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      try {
        const voiceId = Deno.env.get("ELEVENLABS_VOICE_ID") ?? "EXAVITQu4vr4xnSDxMaL";
        const elevenResp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: "POST",
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: textToSynthesize.slice(0, ELEVENLABS_CHAR_LIMIT),
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        });

        if (!elevenResp.ok) {
          // ElevenLabs failed — fall back to text silently
          return new Response(JSON.stringify({ fallback: true, reason: "ElevenLabs synthesis failed — text-only mode" }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Return audio stream (mp3) directly to client
        return new Response(elevenResp.body, {
          headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
        });
      } catch (_voiceErr) {
        // Failsafe: any error in voice path → silent text-only fallback
        return new Response(JSON.stringify({ fallback: true, reason: "Voice synthesis error — text-only mode" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── Chat / command mode (default) ─────────────────────────────────────
    if (!LOVABLE_API_KEY) {
      // Failsafe: AI service not configured → safe halt
      return new Response(JSON.stringify({ error: "AI service not configured — safe halt" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build system prompt based on user role and context
    const systemPrompt = `You are VALA AI, the intelligent assistant for Software Vala - a comprehensive enterprise SaaS platform.

Current User Role: ${userRole || 'user'}
${context ? `Context: ${context}` : ''}

Your capabilities:
- Help with software development queries
- Assist with platform navigation and features
- Provide guidance on theme development, UI/UX
- Help troubleshoot issues
- Assist with business operations and workflows
- Answer questions about Software Vala modules

Guidelines:
- Be professional, concise, and helpful
- Provide actionable advice
- If you don't know something, say so honestly
- For technical queries, provide code examples when relevant
- For business queries, provide step-by-step guidance

Keep responses clear and under 300 words unless detailed explanation is needed.`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Vala AI chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
