/**
 * VALA AI OpenAI - Edge Function
 * Uses Lovable AI Gateway with OpenAI GPT-5 for real-time AI generation
 * Streaming responses via SSE
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are VALA AI, the world's most advanced enterprise-grade AI product builder. You generate production-ready full-stack software applications from natural language prompts.

CRITICAL RULES:
- You are a SOFTWARE BUILDER, not a chatbot. Every response must produce REAL, DEPLOYABLE code.
- Generate complete, working components — not pseudocode or placeholders.
- Use React + TypeScript + Tailwind CSS + Supabase stack.
- Every screen must have proper state management, error handling, and loading states.
- Database schemas must include proper types, constraints, indexes, and RLS policies.
- API endpoints must include validation, error handling, and proper HTTP status codes.

For every build prompt, structure your response as:

## 📋 Requirement Analysis
Concise summary of what the user wants to build.

## 🏗️ Architecture Plan

### Screens Generated
| # | Screen | Description | Components |
|---|--------|-------------|------------|
List each screen with its key components.

### API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
List REST endpoints.

### Database Tables
\`\`\`sql
-- Provide complete CREATE TABLE statements with constraints
\`\`\`

### User Flows
Numbered step-by-step flows.

## 🔧 Implementation
Provide COMPLETE, WORKING React components with TypeScript types, hooks, and Supabase integration.

## 📊 Build Summary
- Total Screens: X
- Total APIs: X  
- Total DB Tables: X
- Total Flows: X
- Estimated Build Time: X minutes

## ✅ Next Steps
Actionable deployment steps.

Be extremely detailed and production-ready. No shortcuts. No placeholders. Real code only.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Try Lovable AI Gateway first, fallback to OpenAI direct
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
    const model = useGateway ? "openai/gpt-5" : "gpt-4o";

    console.log(`VALA AI Builder: Using ${useGateway ? 'Lovable Gateway (GPT-5)' : 'OpenAI Direct (GPT-4o)'}`);

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
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);

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

      return new Response(
        JSON.stringify({ error: `AI processing failed: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("VALA AI error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
