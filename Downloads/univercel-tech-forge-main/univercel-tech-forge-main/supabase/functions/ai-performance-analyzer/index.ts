import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { performanceData, type } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    console.log(`Processing AI performance analysis for type: ${type}`);

    const systemPrompt = `You are an AI Performance Analyst for a business management system. Your role is to:
1. Analyze performance metrics for developers, resellers, franchises, and support agents
2. Provide actionable suggestions for improvement
3. Recommend bonus/penalty adjustments based on performance
4. Identify trends and patterns in performance data
5. Generate insightful summaries for management

Guidelines:
- Be data-driven and objective
- Provide specific, actionable recommendations
- Consider both quantitative metrics and qualitative factors
- Flag any concerning trends immediately
- Celebrate high performers while being constructive with underperformers
- Keep responses concise but comprehensive`;

    const userPrompt = type === 'recalculate' 
      ? `Analyze the following performance data and provide updated scores, suggestions, and bonus/penalty recommendations:

${JSON.stringify(performanceData, null, 2)}

Provide a JSON response with:
1. Updated scores with justification
2. Specific improvement suggestions for each person
3. Bonus/penalty recommendations
4. Overall team insights`
      : `Generate AI insights for the following performance data:

${JSON.stringify(performanceData, null, 2)}

Provide brief but actionable insights.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    console.log("AI analysis completed successfully");

    return new Response(JSON.stringify({ 
      analysis: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-performance-analyzer:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
