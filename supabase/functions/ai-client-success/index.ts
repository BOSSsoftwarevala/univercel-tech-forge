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
      case "client_chat":
        systemPrompt = `You are an AI Client Success Assistant. Help managers with:
- Client relationship strategies
- Retention and growth tactics
- Communication best practices
- Issue resolution approaches
- Account health optimization
Be professional, empathetic, and provide actionable insights.`;
        userPrompt = data.message;
        break;

      case "kyc_analyze":
        systemPrompt = `You are a KYC (Know Your Customer) Analysis Expert. Analyze client documents and profiles for:
- Identity verification completeness
- Risk assessment indicators
- Compliance status evaluation
- Missing documentation identification
- Fraud risk signals
Provide structured analysis with clear recommendations.`;
        userPrompt = `Analyze this KYC submission:
Client: ${data.clientName || 'Unknown'}
Document Type: ${data.documentType || 'Various'}
Submission Details: ${data.details || 'Standard submission'}
Current Status: ${data.status || 'Pending review'}

Provide KYC analysis, risk assessment, and recommended actions.`;
        break;

      case "kyc_verify":
        systemPrompt = `You are a KYC Verification Specialist. Evaluate document authenticity and compliance:
- Document validity checks
- Cross-reference verification points
- Regulatory compliance status
- Approval/rejection recommendations
- Required follow-up actions
Be thorough and compliance-focused.`;
        userPrompt = `Verify this KYC document:
Document Type: ${data.documentType}
Client: ${data.clientName}
Document Details: ${data.documentDetails || 'Standard document'}
Previous Verification Status: ${data.previousStatus || 'First submission'}

Provide verification results and compliance status.`;
        break;

      case "auto_interview":
        systemPrompt = `You are an AI Interview Conductor for Client Success. Generate intelligent interview questions and analyze responses for:
- Client satisfaction assessment
- Pain point identification
- Feature feedback gathering
- Relationship health evaluation
- Upsell/expansion opportunities
Be conversational, professional, and insight-focused.`;
        userPrompt = `Generate interview questions for:
Client: ${data.clientName || 'Client'}
Account Type: ${data.accountType || 'Standard'}
Relationship Duration: ${data.duration || 'Unknown'}
Interview Purpose: ${data.purpose || 'General satisfaction check'}
Previous Feedback: ${data.previousFeedback || 'None recorded'}

Generate 5-7 targeted interview questions and explain what insights each question aims to uncover.`;
        break;

      case "interview_analyze":
        systemPrompt = `You are an Interview Response Analyst. Analyze client interview responses to extract:
- Sentiment and satisfaction levels
- Key pain points and concerns
- Expansion opportunities
- Churn risk indicators
- Actionable recommendations
Provide structured insights with priority levels.`;
        userPrompt = `Analyze these interview responses:
Client: ${data.clientName}
Interview Type: ${data.interviewType || 'Satisfaction review'}
Responses: ${data.responses || 'No responses yet'}

Provide comprehensive analysis with actionable recommendations.`;
        break;

      case "health_score":
        systemPrompt = `You are a Client Health Score Analyst. Calculate and explain client health scores based on:
- Engagement metrics
- Support ticket history
- Feature adoption rates
- Payment patterns
- Communication frequency
Provide numerical scores and improvement recommendations.`;
        userPrompt = `Calculate health score for:
Client: ${data.clientName}
Engagement: ${data.engagement || 'Moderate'}
Support Tickets: ${data.supportTickets || 'Low'}
Feature Adoption: ${data.featureAdoption || 'Average'}
Payment History: ${data.paymentHistory || 'On-time'}
Communication: ${data.communication || 'Regular'}

Provide health score (0-100), breakdown by category, and improvement recommendations.`;
        break;

      case "churn_predict":
        systemPrompt = `You are a Churn Prediction Specialist. Analyze client signals to predict churn probability:
- Behavioral pattern changes
- Engagement decline indicators
- Support escalation patterns
- Feature usage changes
- Communication sentiment shifts
Provide risk percentage and prevention strategies.`;
        userPrompt = `Predict churn risk for:
Client: ${data.clientName}
Recent Behavior: ${data.behavior || 'Normal'}
Engagement Trend: ${data.engagementTrend || 'Stable'}
Recent Issues: ${data.recentIssues || 'None'}
Contract End: ${data.contractEnd || 'Not specified'}

Provide churn probability percentage, risk factors, and prevention strategy.`;
        break;

      case "upsell_identify":
        systemPrompt = `You are an Upsell Opportunity Analyst. Identify expansion opportunities based on:
- Current product usage
- Growth indicators
- Feature adoption patterns
- Business needs signals
- Budget availability indicators
Provide specific product recommendations with approach strategies.`;
        userPrompt = `Identify upsell opportunities for:
Client: ${data.clientName}
Current Plan: ${data.currentPlan || 'Standard'}
Usage Patterns: ${data.usagePatterns || 'Normal'}
Team Size: ${data.teamSize || 'Small'}
Business Type: ${data.businessType || 'General'}

Recommend upsell opportunities with approach timing and strategy.`;
        break;

      case "response_craft":
        systemPrompt = `You are a Client Communication Expert. Craft professional, empathetic responses for:
- Complaint handling
- Feature requests
- Billing inquiries
- Support escalations
- General inquiries
Be warm, solution-oriented, and brand-appropriate.`;
        userPrompt = `Craft a response to:
Client Message: ${data.clientMessage}
Situation Context: ${data.context || 'General inquiry'}
Tone Required: ${data.tone || 'Professional and empathetic'}
Urgency Level: ${data.urgency || 'Normal'}

Generate an appropriate response that addresses concerns and maintains relationship.`;
        break;

      case "success_plan":
        systemPrompt = `You are a Success Planning Expert. Create comprehensive client success plans including:
- Onboarding milestones
- Adoption checkpoints
- Health monitoring schedule
- Engagement activities
- Renewal preparation timeline
Provide actionable, timeline-based plans.`;
        userPrompt = `Create success plan for:
Client: ${data.clientName}
Account Size: ${data.accountSize || 'Standard'}
Onboarding Status: ${data.onboardingStatus || 'Not started'}
Goals: ${data.goals || 'Standard adoption'}
Timeline: ${data.timeline || '90 days'}

Create a detailed success plan with milestones and activities.`;
        break;

      case "sentiment_deep":
        systemPrompt = `You are a Deep Sentiment Analysis Expert. Analyze client communications for:
- Emotional undertones
- Satisfaction indicators
- Frustration signals
- Loyalty markers
- Advocacy potential
Provide detailed sentiment breakdown with actionable insights.`;
        userPrompt = `Perform deep sentiment analysis on:
Client: ${data.clientName}
Recent Communications: ${data.communications || 'None provided'}
Interaction History: ${data.history || 'Limited'}
Current Status: ${data.status || 'Active'}

Provide sentiment score, emotional analysis, and relationship recommendations.`;
        break;

      case "escalation_guide":
        systemPrompt = `You are an Escalation Management Expert. Provide guidance on:
- Escalation appropriateness
- Resolution strategies
- Stakeholder communication
- Timeline management
- Recovery approaches
Be decisive, practical, and relationship-focused.`;
        userPrompt = `Guide escalation handling for:
Issue: ${data.issue || 'General escalation'}
Client: ${data.clientName}
Severity: ${data.severity || 'Medium'}
Current Status: ${data.status || 'Open'}
Previous Actions: ${data.previousActions || 'None'}

Provide escalation strategy, resolution steps, and communication templates.`;
        break;

      case "renewal_strategy":
        systemPrompt = `You are a Renewal Strategy Expert. Develop renewal approaches including:
- Timing optimization
- Value reinforcement tactics
- Objection handling
- Expansion opportunities
- Risk mitigation
Provide comprehensive renewal playbooks.`;
        userPrompt = `Create renewal strategy for:
Client: ${data.clientName}
Renewal Date: ${data.renewalDate || 'Upcoming'}
Current Health: ${data.healthScore || 'Good'}
Risk Factors: ${data.riskFactors || 'None identified'}
Expansion Potential: ${data.expansionPotential || 'Moderate'}

Develop a complete renewal strategy with timeline and talking points.`;
        break;

      default:
        systemPrompt = "You are an AI Client Success Assistant. Provide helpful, professional guidance for client success management.";
        userPrompt = data.message || "How can I improve client relationships?";
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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const result = aiData.choices?.[0]?.message?.content || "Unable to generate response";

    return new Response(
      JSON.stringify({ result, type, timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI Client Success error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
