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
    const { action, data } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "portfolio_builder":
        systemPrompt = `You are an AI Portfolio Builder for developers. Create compelling portfolio content that showcases skills and achievements.
        Return JSON: { "headline": "string", "summary": "string", "keySkills": ["skill1", "skill2"], "achievements": [{"title": "string", "description": "string", "impact": "string"}], "projectShowcase": [{"name": "string", "description": "string", "technologies": ["tech1"], "metrics": "string"}] }`;
        userPrompt = `Build a professional developer portfolio based on:
        Skills: ${JSON.stringify(data.skills)}
        Experience: ${data.experience}
        Completed Projects: ${data.projectCount}
        Technologies: ${JSON.stringify(data.technologies)}
        Rating: ${data.rating}/5
        Specialization: ${data.specialization}`;
        break;

      case "skill_assessment":
        systemPrompt = `You are an AI Skill Assessor. Analyze developer performance and provide growth recommendations.
        Return JSON: { "currentLevel": "string", "strengths": ["strength1"], "improvements": ["area1"], "recommendedLearning": [{"topic": "string", "priority": "high/medium/low", "reason": "string"}], "careerPath": "string", "estimatedGrowth": "string" }`;
        userPrompt = `Assess developer skills:
        Task History: ${JSON.stringify(data.taskHistory)}
        Code Quality Score: ${data.qualityScore}
        On-Time Rate: ${data.onTimeRate}%
        Technologies Used: ${JSON.stringify(data.technologies)}
        Bug Rate: ${data.bugRate}%`;
        break;

      case "task_optimizer":
        systemPrompt = `You are an AI Task Optimizer. Analyze tasks and provide optimization strategies for faster completion.
        Return JSON: { "estimatedTime": "string", "optimizations": [{"step": "string", "timeSaved": "string", "technique": "string"}], "parallelTasks": ["task1"], "riskFactors": ["risk1"], "successProbability": "number" }`;
        userPrompt = `Optimize task execution:
        Task: ${data.taskTitle}
        Description: ${data.taskDescription}
        Complexity: ${data.complexity}
        Technologies: ${JSON.stringify(data.technologies)}
        Deadline: ${data.deadline}
        Similar Past Tasks: ${JSON.stringify(data.pastTasks)}`;
        break;

      case "code_review_prep":
        systemPrompt = `You are an AI Code Review Preparation Assistant. Help developers prepare for code submission.
        Return JSON: { "checklist": [{"item": "string", "category": "string", "priority": "high/medium/low"}], "commonIssues": ["issue1"], "bestPractices": ["practice1"], "documentationTips": ["tip1"], "testingRecommendations": ["recommendation1"] }`;
        userPrompt = `Prepare code review for:
        Technology: ${data.technology}
        Task Type: ${data.taskType}
        Complexity: ${data.complexity}
        Code Length: ${data.codeLength} lines`;
        break;

      case "earnings_forecast":
        systemPrompt = `You are an AI Earnings Forecaster for developers. Analyze patterns and predict future earnings.
        Return JSON: { "weeklyForecast": "number", "monthlyForecast": "number", "growthTrend": "string", "recommendations": [{"action": "string", "impact": "string"}], "peakHours": ["hour1"], "optimalTaskTypes": ["type1"] }`;
        userPrompt = `Forecast earnings based on:
        Current Monthly: ₹${data.currentEarnings}
        Task Completion Rate: ${data.completionRate}%
        Average Task Value: ₹${data.avgTaskValue}
        Active Hours/Day: ${data.activeHours}
        Skill Level: ${data.skillLevel}`;
        break;

      case "productivity_coach":
        systemPrompt = `You are an AI Productivity Coach. Provide personalized tips to boost developer productivity.
        Return JSON: { "dailyTips": ["tip1"], "focusStrategies": [{"name": "string", "description": "string", "duration": "string"}], "breakSchedule": [{"time": "string", "activity": "string"}], "energyOptimization": "string", "weeklyGoals": ["goal1"] }`;
        userPrompt = `Coach for productivity:
        Average Work Hours: ${data.workHours}
        Peak Performance Time: ${data.peakTime}
        Common Distractions: ${JSON.stringify(data.distractions)}
        Current Productivity Score: ${data.productivityScore}%
        Goal: ${data.goal}`;
        break;

      case "interview_prep":
        systemPrompt = `You are an AI Interview Preparation Coach for technical interviews. Help developers prepare.
        Return JSON: { "technicalQuestions": [{"question": "string", "difficulty": "string", "hint": "string"}], "behavioralQuestions": ["question1"], "codeChallengeTips": ["tip1"], "systemDesignTopics": ["topic1"], "confidenceBooster": "string" }`;
        userPrompt = `Prepare for interview:
        Role: ${data.role}
        Technologies: ${JSON.stringify(data.technologies)}
        Experience Level: ${data.experienceLevel}
        Company Type: ${data.companyType}`;
        break;

      case "smart_scheduler":
        systemPrompt = `You are an AI Smart Scheduler. Optimize task scheduling for maximum efficiency.
        Return JSON: { "schedule": [{"time": "string", "task": "string", "duration": "string", "priority": "high/medium/low"}], "breakTimes": ["time1"], "highFocusBlocks": [{"start": "string", "end": "string", "task": "string"}], "bufferTime": "string", "dailySummary": "string" }`;
        userPrompt = `Create optimal schedule:
        Tasks: ${JSON.stringify(data.tasks)}
        Available Hours: ${data.availableHours}
        Preferences: ${JSON.stringify(data.preferences)}
        Deadlines: ${JSON.stringify(data.deadlines)}`;
        break;

      case "chat":
        systemPrompt = `You are an AI Developer Assistant. Help developers with coding questions, career advice, and productivity tips. Be concise and actionable.`;
        userPrompt = data.message;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`Processing ${action} request`);

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
        temperature: 0.7,
        max_tokens: 2000,
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
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
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

    console.log(`${action} completed successfully`);

    return new Response(JSON.stringify({ success: true, data: result, action }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-developer-assistant:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
