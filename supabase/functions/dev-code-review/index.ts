import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, code, language, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "review":
        systemPrompt = `You are Vala AI Code Quality Manager. Review code strictly for:
1. Security vulnerabilities (SQL injection, XSS, hardcoded secrets)
2. Performance issues (memory leaks, unnecessary re-renders, N+1 queries)
3. Code quality (naming, structure, DRY violations, complexity)
4. Best practices (error handling, typing, accessibility)

Return JSON with this structure:
{
  "score": 0-100,
  "grade": "A/B/C/D/F",
  "issues": [{"severity": "critical/warning/info", "line": "approx", "message": "description", "fix": "suggestion"}],
  "summary": "brief overall assessment"
}`;
        userPrompt = `Review this ${language || 'code'}:\n\n${code}`;
        break;

      case "test_generate":
        systemPrompt = `You are a test generation AI. Generate comprehensive unit tests for the given code using Vitest/Jest. Include edge cases, error cases, and happy paths. Return only the test code.`;
        userPrompt = `Generate tests for:\n\n${code}`;
        break;

      case "security_scan":
        systemPrompt = `You are a security scanner AI. Analyze code for OWASP Top 10 vulnerabilities, insecure patterns, hardcoded credentials, and data exposure risks. Return JSON:
{
  "risk_level": "low/medium/high/critical",
  "vulnerabilities": [{"type": "string", "severity": "string", "description": "string", "recommendation": "string"}],
  "passed_checks": ["list of passed security checks"]
}`;
        userPrompt = `Security scan this ${language || 'code'}:\n\n${code}`;
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit hit. Try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Code review error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response";

    return new Response(JSON.stringify({ success: true, result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("dev-code-review error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
