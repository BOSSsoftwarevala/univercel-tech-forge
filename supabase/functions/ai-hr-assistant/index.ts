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
    const { type, data } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "hr_chat":
        systemPrompt = `You are an AI HR Assistant for a business management system. You help HR Managers with:
- Recruitment and hiring strategies
- Employee onboarding and offboarding
- Training and development planning
- Performance management guidance
- Policy and compliance questions
- Employee relations and conflict resolution
- Compensation and benefits inquiries
- Workforce planning and analytics

Be professional, compliant with labor laws, and provide specific actionable advice. Always consider employee privacy and confidentiality.`;
        userPrompt = data.message;
        break;

      case "screen_resume":
        systemPrompt = `You are an AI Resume Screening Specialist. Analyze resumes and provide:
1. Match Score (0-100)
2. Key Qualifications Met
3. Missing Requirements
4. Experience Relevance
5. Skills Assessment
6. Red Flags (if any)
7. Interview Recommendation (Yes/No/Maybe)
8. Suggested Interview Questions (3-5)

Be objective and focus on job-relevant criteria.`;
        userPrompt = `Screen this resume for the position:
Position: ${data.position}
Required Skills: ${JSON.stringify(data.requiredSkills || [])}
Experience Required: ${data.experienceRequired || 'Not specified'}
Resume Summary: ${data.resumeSummary}
Candidate Experience: ${data.candidateExperience}`;
        break;

      case "generate_jd":
        systemPrompt = `You are an AI Job Description Writer. Create professional, inclusive job descriptions.
Include:
1. Job Title
2. About the Company (placeholder)
3. Role Overview
4. Key Responsibilities (5-8 bullet points)
5. Required Qualifications
6. Preferred Qualifications
7. Benefits & Perks (placeholder)
8. Application Instructions

Use inclusive language and avoid biased terms.`;
        userPrompt = `Generate job description for:
Position: ${data.position}
Department: ${data.department}
Level: ${data.level || 'Mid-level'}
Key Skills: ${JSON.stringify(data.skills || [])}
Special Requirements: ${data.requirements || 'None'}`;
        break;

      case "onboarding_plan":
        systemPrompt = `You are an AI Onboarding Specialist. Create comprehensive onboarding plans.
Include:
1. Pre-boarding Checklist (before Day 1)
2. Day 1 Schedule
3. Week 1 Goals
4. 30-Day Milestones
5. 60-Day Milestones
6. 90-Day Review Goals
7. Key People to Meet
8. Training Assignments
9. Success Metrics

Customize based on role and department.`;
        userPrompt = `Create onboarding plan for:
Name: ${data.name}
Position: ${data.position}
Department: ${data.department}
Start Date: ${data.startDate}
Manager: ${data.manager || 'TBD'}
Special Notes: ${data.notes || 'None'}`;
        break;

      case "interview_questions":
        systemPrompt = `You are an AI Interview Preparation Specialist. Generate role-specific interview questions.
Provide:
1. Technical Questions (5-7)
2. Behavioral Questions (5-7)
3. Situational Questions (3-5)
4. Culture Fit Questions (3-4)
5. Role-Specific Scenarios
6. Questions Candidate Might Ask
7. Evaluation Criteria for Each Question

Include expected answer guidelines.`;
        userPrompt = `Generate interview questions for:
Position: ${data.position}
Level: ${data.level || 'Mid-level'}
Key Skills: ${JSON.stringify(data.skills || [])}
Department: ${data.department}
Interview Round: ${data.round || 'First Round'}`;
        break;

      case "training_recommend":
        systemPrompt = `You are an AI Training & Development Advisor. Recommend personalized training programs.
Provide:
1. Skill Gap Analysis
2. Recommended Courses/Programs (5-7)
3. Priority Order
4. Estimated Time Investment
5. Expected Outcomes
6. Career Path Alignment
7. Certification Opportunities
8. Timeline Suggestion`;
        userPrompt = `Recommend training for:
Employee: ${data.name}
Role: ${data.role}
Current Skills: ${JSON.stringify(data.currentSkills || [])}
Target Role: ${data.targetRole || 'Current role improvement'}
Performance Areas: ${data.performanceAreas || 'General development'}
Available Time: ${data.availableTime || 'Flexible'}`;
        break;

      case "policy_draft":
        systemPrompt = `You are an AI HR Policy Writer. Draft professional HR policies.
Include:
1. Policy Title
2. Purpose
3. Scope
4. Definitions
5. Policy Statement
6. Procedures
7. Responsibilities
8. Compliance & Enforcement
9. Related Policies
10. Revision History (placeholder)

Ensure compliance with general labor law principles.`;
        userPrompt = `Draft policy for:
Policy Type: ${data.policyType}
Target Audience: ${data.audience || 'All Employees'}
Key Points: ${data.keyPoints || 'Standard policy'}
Jurisdiction: ${data.jurisdiction || 'General'}`;
        break;

      case "employee_feedback":
        systemPrompt = `You are an AI Employee Feedback Analyzer. Analyze feedback patterns and sentiment.
Provide:
1. Overall Sentiment Score (1-10)
2. Key Themes Identified
3. Positive Highlights
4. Areas of Concern
5. Actionable Recommendations (5-7)
6. Priority Issues
7. Trend Analysis
8. Comparison to Industry Standards`;
        userPrompt = `Analyze employee feedback:
Feedback Source: ${data.source || 'Survey'}
Department: ${data.department || 'All'}
Feedback Summary: ${data.feedbackSummary}
Time Period: ${data.period || 'Last Quarter'}`;
        break;

      case "exit_analysis":
        systemPrompt = `You are an AI Exit Interview Analyst. Analyze exit interview data for insights.
Provide:
1. Departure Reason Category
2. Retention Risk Indicators
3. Management Feedback
4. Culture Insights
5. Process Improvement Suggestions
6. Compensation Insights
7. Growth Opportunity Feedback
8. Recommendations to Reduce Future Turnover`;
        userPrompt = `Analyze exit interview:
Employee Role: ${data.role}
Department: ${data.department}
Tenure: ${data.tenure}
Exit Reason (Primary): ${data.reason}
Feedback Summary: ${data.feedbackSummary}
Destination: ${data.destination || 'Unknown'}`;
        break;

      case "workforce_plan":
        systemPrompt = `You are an AI Workforce Planning Strategist. Create workforce planning recommendations.
Provide:
1. Current State Analysis
2. Future Headcount Projections
3. Skill Gap Forecast
4. Hiring Priorities (Next 6-12 months)
5. Budget Considerations
6. Risk Assessment
7. Succession Planning Needs
8. Strategic Recommendations`;
        userPrompt = `Create workforce plan:
Current Headcount: ${data.currentHeadcount}
Department Breakdown: ${JSON.stringify(data.departments || {})}
Growth Plans: ${data.growthPlans || 'Moderate growth'}
Budget Constraints: ${data.budget || 'Standard'}
Timeline: ${data.timeline || '12 months'}`;
        break;

      default:
        systemPrompt = `You are an AI HR Assistant. Help with human resources questions and tasks professionally.`;
        userPrompt = data.message || JSON.stringify(data);
    }

    console.log(`Processing HR AI request: ${type}`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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

    console.log(`Successfully processed HR AI request: ${type}`);

    return new Response(JSON.stringify({ 
      result,
      type,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-hr-assistant:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
