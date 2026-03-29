import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, context } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "performance_chat":
        systemPrompt = `You are an AI Performance Coach for a business management system. You help Performance Managers with:
- Analyzing team and individual performance metrics
- Providing actionable improvement suggestions
- Identifying trends and patterns
- Setting and tracking KPI goals
- Coaching strategies for underperformers
- Recognition strategies for top performers
- Team dynamics and collaboration optimization

Be data-driven, supportive, and provide specific actionable advice.`;
        userPrompt = data.message;
        break;

      case "analyze_individual":
        systemPrompt = `You are an AI Performance Analyst. Analyze individual performance data and provide:
1. Performance Summary (strengths and weaknesses)
2. Trend Analysis (improving/declining areas)
3. Specific Improvement Actions (3-5 items)
4. Recognition Opportunities
5. Training Recommendations
6. Projected Performance (next 30 days)

Be specific and actionable.`;
        userPrompt = `Analyze this individual's performance:
Name: ${data.name}
Role: ${data.role}
Current Score: ${data.score}/100
Metrics: ${JSON.stringify(data.metrics)}
Recent Activity: ${data.recentActivity || 'N/A'}`;
        break;

      case "analyze_team":
        systemPrompt = `You are an AI Team Performance Strategist. Analyze team performance and provide:
1. Team Health Score and Assessment
2. Top Performers to Recognize
3. At-Risk Team Members
4. Team Dynamics Issues
5. Collaboration Opportunities
6. Strategic Recommendations
7. Predicted Team Performance Trend

Format with clear sections and bullet points.`;
        userPrompt = `Analyze this team's performance:
Team Size: ${data.teamSize}
Average Score: ${data.avgScore}
Members: ${JSON.stringify(data.members)}
Recent Trends: ${data.trends || 'N/A'}`;
        break;

      case "generate_goals":
        systemPrompt = `You are an AI Goal Setting Specialist. Create SMART goals based on current performance.
For each goal provide:
1. Goal Title
2. Description
3. Target Metric
4. Timeline
5. Success Criteria
6. Action Steps

Create 5 goals: 2 stretch goals, 2 improvement goals, 1 maintenance goal.`;
        userPrompt = `Generate performance goals for:
Name: ${data.name}
Role: ${data.role}
Current Metrics: ${JSON.stringify(data.metrics)}
Focus Areas: ${data.focusAreas || 'General improvement'}`;
        break;

      case "coaching_plan":
        systemPrompt = `You are an AI Performance Coach. Create a personalized coaching plan.
Include:
1. 30-Day Action Plan
2. Weekly Milestones
3. Skill Development Focus
4. Mentorship Recommendations
5. Resource Suggestions
6. Check-in Schedule
7. Success Metrics`;
        userPrompt = `Create coaching plan for:
Name: ${data.name}
Role: ${data.role}
Performance Issues: ${data.issues}
Current Score: ${data.score}
Goal: ${data.goal || 'Improve to 85+'}`;
        break;

      case "predict_risk":
        systemPrompt = `You are an AI Risk Predictor for employee performance. Analyze data and predict:
1. Risk Level (Critical/High/Medium/Low)
2. Probability of Performance Drop (%)
3. Key Risk Factors
4. Early Warning Signs
5. Preventive Actions
6. Intervention Timeline
7. Success Probability if Intervened`;
        userPrompt = `Predict performance risk for:
Name: ${data.name}
Role: ${data.role}
Score Trend: ${data.scoreTrend}
Recent Flags: ${JSON.stringify(data.flags || [])}
Attendance: ${data.attendance || 'Normal'}
Recent Changes: ${data.recentChanges || 'None'}`;
        break;

      case "incentive_recommend":
        systemPrompt = `You are an AI Incentive Strategist. Recommend incentives and recognition.
Provide:
1. Recommended Incentive Type
2. Amount/Value Suggestion
3. Justification
4. Timing Recommendation
5. Public vs Private Recognition
6. Long-term Impact Prediction
7. Alternative Options`;
        userPrompt = `Recommend incentive for:
Name: ${data.name}
Role: ${data.role}
Achievement: ${data.achievement}
Current Score: ${data.score}
Past Rewards: ${data.pastRewards || 'None recently'}`;
        break;

      case "compare_benchmark":
        systemPrompt = `You are an AI Benchmarking Analyst. Compare performance against benchmarks.
Provide:
1. Benchmark Comparison Summary
2. Above/Below Industry Standard
3. Competitive Position
4. Gap Analysis
5. Improvement Priority Order
6. Best Practices to Adopt
7. Realistic Target Setting`;
        userPrompt = `Benchmark comparison for:
Role: ${data.role}
Current Metrics: ${JSON.stringify(data.metrics)}
Industry: ${data.industry || 'Technology'}
Region: ${data.region || 'Global'}`;
        break;

      case "weekly_report":
        systemPrompt = `You are an AI Report Generator. Create a comprehensive weekly performance report.
Include:
1. Executive Summary
2. Key Highlights
3. Areas of Concern
4. Top Performers
5. Improvement Trends
6. Action Items for Next Week
7. Strategic Recommendations

Format professionally with clear sections.`;
        userPrompt = `Generate weekly report:
Team Data: ${JSON.stringify(data.teamData)}
Period: ${data.period || 'This Week'}
Previous Week Score: ${data.prevScore || 'N/A'}`;
        break;

      default:
        systemPrompt = `You are an AI Performance Management Assistant. Help with performance tracking, analysis, and improvement strategies.`;
        userPrompt = data.message || JSON.stringify(data);
    }

    console.log(`Processing ${type} request`);

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
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const responseData = await response.json();
    const result = responseData.choices?.[0]?.message?.content || "Unable to generate response";

    console.log(`Successfully processed ${type}`);

    return new Response(JSON.stringify({ 
      result,
      type,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-performance-coach:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
