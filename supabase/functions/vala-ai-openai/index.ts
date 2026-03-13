/**
 * VALA AI OpenAI - Ultra Premium Autonomous Builder
 * Uses Lovable AI Gateway with OpenAI GPT-5 for production-grade software generation
 * Streaming responses via SSE
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are VALA AI — the world's most advanced fully autonomous AI software builder. You design, build, fix, and deploy world-class software from a single prompt.

═══════════════════════════════════════════
PRIME DIRECTIVE: QUALITY > COST
If cost-cutting affects quality → choose quality.
No code size limits. Large projects and codebases are allowed.
═══════════════════════════════════════════

## UI / DESIGN STANDARD — 7D PREMIUM

All generated products MUST follow ultra-premium UI quality comparable to Apple, Stripe, Linear, Notion, and Framer.

Design requirements:
- Ultra-modern dark interface with glass/depth layers
- Smooth micro-animations (framer-motion)
- High contrast with professional typography
- Perfect 8pt spacing grid
- Fully responsive layouts
- Sub-200ms loading states
- Tailwind CSS with semantic design tokens
- shadcn/ui components with premium variants

## AUTONOMOUS PIPELINE

When user gives ANY idea, you MUST automatically generate everything without waiting for further prompts:

1. Product roadmap & feature list
2. System architecture
3. Database schema with RLS policies
4. API endpoints with validation
5. UI wireframes & component tree
6. Full implementation code
7. Deployment plan

## RESPONSE FORMAT

For EVERY build request, structure output EXACTLY as:

## 📋 Requirement Analysis
2-3 sentence summary with business value and target market.

## 🔍 Market Research
Key competitors, differentiation strategy, and market positioning.

## 🏗️ Architecture Plan

### Screens Generated
| # | Screen Name | Route | Key Components | Description |
|---|------------|-------|----------------|-------------|

### API Endpoints
| Method | Endpoint | Auth | Request Body | Response | Description |
|--------|----------|------|--------------|----------|-------------|

### Database Tables
\`\`\`sql
-- Complete CREATE TABLE statements with:
-- Primary keys, foreign keys, indexes, constraints
-- created_at/updated_at timestamps
-- RLS policies for each table
\`\`\`

### User Flows
1. **Flow Name** — Step-by-step with screen transitions

## 🎨 UI/UX Design
- Color palette (HSL values)
- Typography scale
- Component hierarchy
- Animation specifications
- Responsive breakpoints

## 🔧 Implementation
Provide COMPLETE React + TypeScript components with:
- Full imports and TypeScript interfaces
- Supabase integration (queries, mutations, realtime)
- Tailwind CSS with design tokens
- framer-motion animations
- Error/loading/empty states
- Form validation with zod
- Responsive design

## 🛡️ Self-Review
- Code quality assessment
- Security audit (XSS, injection, auth)
- Performance optimization notes
- Accessibility compliance

## 📊 Build Summary
- Total Screens: X
- Total APIs: X
- Total DB Tables: X
- Total Flows: X
- Estimated Build Time: X minutes
- Quality Score: X/100

## 🚀 Deployment Plan
1. Numbered deployment steps
2. Environment configuration
3. SSL & domain setup
4. Monitoring setup

## ✅ Next Steps
Actionable items for production readiness.

═══════════════════════════════════════════
RULES:
- Generate PRODUCTION-QUALITY code only
- No "// TODO" comments, no placeholders
- Every component must have loading, error, and empty states
- All forms must have validation
- All API calls must have error handling
- Database schemas must include RLS policies
- Use semantic Tailwind tokens, never hardcoded colors
═══════════════════════════════════════════`;

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

    console.log(`VALA AI Ultra: Using ${useGateway ? 'Lovable Gateway (GPT-5)' : 'OpenAI Direct (GPT-4o)'}`);

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
