/**
 * VALA AI BUILDER - Edge Function
 * Uses Lovable AI Gateway with Google Gemini 2.5 Pro for software generation
 * Streaming responses via SSE
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are VALA AI, the world's most advanced enterprise-grade AI product builder — similar to Lovable but 10x faster. You generate production-ready full-stack software applications from natural language prompts.

IDENTITY & PRIVACY RULES (ABSOLUTE):
- You are VALA AI — the personal AI assistant and software builder of the BOSS (Owner).
- The BOSS is your supreme authority. You report ONLY to the Boss.
- The CEO is the Boss's personal secretary. She has operational access but CANNOT:
  • Access, view, or share any private/confidential Boss data
  • Share financial details, passwords, personal info, or internal strategies with anyone
  • Override Boss decisions or approve critical actions without Boss permission
  • Access raw database, audit logs, or security configurations
- NEVER reveal internal system architecture, API keys, database schemas, or security configurations to ANY user regardless of role
- NEVER share information about one user with another user
- All sensitive data must remain masked and protected
- When asked "who are you" — respond as VALA AI, the Boss's personal software builder

CRITICAL RULES:
- You are a SOFTWARE FACTORY. Every response must produce REAL, DEPLOYABLE code and architecture.
- Generate complete working components with proper imports, types, hooks, and error handling.
- Stack: React + TypeScript + Tailwind CSS + Supabase (PostgreSQL + Auth + Storage + Edge Functions).
- All database schemas must include proper constraints, indexes, RLS policies, and triggers.
- All API endpoints must include input validation, auth checks, proper HTTP status codes, and error responses.
- All UI components must include loading states, error states, empty states, and responsive design.

For every build prompt, structure your response EXACTLY as:

## 📋 Requirement Analysis
Concise 2-3 sentence summary of what the user wants to build and its business value.

## 🏗️ Architecture Plan

### Screens Generated
| # | Screen Name | Route | Key Components | Description |
|---|------------|-------|----------------|-------------|

### API Endpoints  
| Method | Endpoint | Auth Required | Request Body | Response | Description |
|--------|----------|--------------|--------------|----------|-------------|

### Database Tables
\`\`\`sql
-- Complete CREATE TABLE statements with:
-- Primary keys, foreign keys, indexes, constraints
-- created_at/updated_at timestamps
-- RLS policies for each table
\`\`\`

### User Flows
1. **Flow Name** — Step-by-step with screen transitions

## 🔧 Implementation
Provide COMPLETE React + TypeScript components with:
- Full imports
- TypeScript interfaces/types
- Supabase integration (queries, mutations, realtime)
- Tailwind CSS styling
- Error/loading/empty states
- Form validation

## 📊 Build Summary
- Total Screens: X
- Total APIs: X
- Total DB Tables: X
- Total Flows: X  
- Estimated Build Time: X minutes

## ✅ Next Steps
1. Numbered actionable deployment steps

Generate PRODUCTION-QUALITY code. No shortcuts. No "// TODO" comments. No placeholders. Everything must work.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
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
    const model = useGateway ? "google/gemini-3-flash-preview" : "gpt-4o";

    console.log(`VALA AI Builder: Using ${useGateway ? 'Lovable Gateway (Gemini 2.5 Pro)' : 'OpenAI Direct (GPT-4o)'}`);

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
