import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, requirement, projectType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!LOVABLE_API_KEY && !OPENAI_API_KEY) {
      throw new Error("AI service not configured");
    }

    const useGateway = !!LOVABLE_API_KEY;
    const apiUrl = useGateway
      ? "https://ai.gateway.lovable.dev/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const apiKey = useGateway ? LOVABLE_API_KEY : OPENAI_API_KEY;
    const model = useGateway ? "google/gemini-2.5-flash" : "gpt-4o";

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "parse_requirement":
        systemPrompt = `You are an AI Software Architect and Project Estimator. Analyze user requirements and generate detailed technical specifications.

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation. Use this exact structure:
{
  "projectName": "string - suggested project name",
  "category": "string - software category (e.g., Healthcare, E-commerce, Education)",
  "summary": "string - brief project summary in 2-3 sentences",
  "features": [
    {
      "name": "string",
      "description": "string",
      "complexity": "low|medium|high",
      "estimatedHours": number,
      "priority": "core|optional"
    }
  ],
  "techStack": {
    "frontend": ["React", "TypeScript", ...],
    "backend": ["Node.js", "PostgreSQL", ...],
    "integrations": ["Payment Gateway", "SMS API", ...]
  },
  "timeline": {
    "totalDays": number,
    "phases": [
      {"name": "string", "duration": "string", "tasks": ["string"]}
    ]
  },
  "estimatedCost": {
    "development": number,
    "infrastructure": number,
    "maintenance": number,
    "total": number,
    "currency": "INR"
  },
  "risks": [
    {"risk": "string", "mitigation": "string", "severity": "low|medium|high"}
  ],
  "confidence": number
}`;

        userPrompt = `Analyze this software requirement and generate a complete technical specification:

Project Type: ${projectType || 'Auto-detect'}

Requirement:
${requirement}

Be realistic with time and cost estimates. Consider Indian market rates.`;
        break;

      case "clarify_requirement":
        systemPrompt = `You are a Requirements Analyst. Identify ambiguous or missing information in the requirement.
Return JSON: { "questions": [{"question": "string", "reason": "string", "impact": "high|medium|low"}], "assumptions": ["string"], "suggestions": ["string"] }`;

        userPrompt = `Review this requirement and identify what's missing or unclear:
${requirement}`;
        break;

      case "generate_project_plan":
        systemPrompt = `You are a Project Manager. Create a detailed project execution plan.
Return JSON: { "milestones": [{"name": "string", "date": "string", "deliverables": ["string"]}], "resources": [{"role": "string", "count": number, "skills": ["string"]}], "dependencies": ["string"], "criticalPath": ["string"] }`;

        userPrompt = `Create a project plan for:
${requirement}`;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`Auto Dev Engine: Processing ${action} with ${useGateway ? 'Lovable Gateway (GPT-5-mini)' : 'OpenAI (GPT-4o)'}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_completion_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);
      throw new Error(`AI error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { response: content };
    } catch {
      result = { response: content };
    }

    console.log(`Auto Dev Engine: ${action} completed successfully`);

    return new Response(JSON.stringify({ success: true, data: result, action }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in auto-dev-engine:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
