import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, taskContext } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      throw new Error("OPENAI_API_KEY is not configured");
    }

    console.log("AI Task Assistant - Processing request with", messages.length, "messages");
    if (taskContext) {
      console.log("Task context:", taskContext.title);
    }

    let systemPrompt = `You are an AI Task Assistant, an expert in project management, task coordination, and workflow optimization. You help Task Managers by:

1. **Smart Assignment**: Analyze developer skills, workload, and availability to recommend optimal task assignments
2. **Time Estimation**: Provide accurate time estimates based on task complexity, historical data, and developer expertise
3. **Risk Analysis**: Identify potential blockers, dependencies, and risks that could delay delivery
4. **Subtask Breakdown**: Convert high-level requirements into actionable, measurable subtasks
5. **Priority Optimization**: Suggest task prioritization based on business impact and deadlines
6. **Workflow Insights**: Provide recommendations to improve team efficiency and reduce bottlenecks

Key Guidelines:
- Always provide actionable, specific recommendations
- Consider team capacity and ongoing work when making suggestions
- Use data-driven insights when available
- Be concise and direct in your responses
- Format output clearly with sections when appropriate

Format your responses with clear headers when providing structured information:
- **Recommendation**: Your main suggestion
- **Reasoning**: Why this is the best approach
- **Action Items**: Specific steps to take
- **Considerations**: Things to keep in mind`;

    if (taskContext) {
      systemPrompt += `

Current Task Context:
- Title: ${taskContext.title}
- Description: ${taskContext.description || 'Not provided'}
- Priority: ${taskContext.priority}
- Status: ${taskContext.status}
- Estimated Hours: ${taskContext.estimatedHours || 'Not set'}
- Assigned To: ${taskContext.assignedTo || 'Unassigned'}

Use this context to provide relevant, task-specific recommendations.`;
    }

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI Task Assistant - Streaming response back to client");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Task Assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
