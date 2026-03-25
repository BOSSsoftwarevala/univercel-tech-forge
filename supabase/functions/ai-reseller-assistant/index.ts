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
      case "lead_scoring":
        systemPrompt = `You are an AI Lead Scoring Engine. Analyze lead data and provide predictive scoring with conversion probability.
        Return JSON: { "score": number(0-100), "tier": "hot/warm/cold", "conversionProbability": "percentage", "bestApproach": "string", "idealContactTime": "string", "keyInsights": ["insight1"], "riskFactors": ["risk1"], "recommendedActions": [{"action": "string", "priority": "high/medium/low"}] }`;
        userPrompt = `Score this lead:
        Company: ${data.companyName}
        Industry: ${data.industry}
        Size: ${data.companySize}
        Budget: ${data.budget}
        Source: ${data.source}
        Engagement: ${JSON.stringify(data.engagement)}
        Last Contact: ${data.lastContact}`;
        break;

      case "sales_forecast":
        systemPrompt = `You are an AI Sales Forecaster. Analyze pipeline and predict revenue with confidence intervals.
        Return JSON: { "weeklyForecast": number, "monthlyForecast": number, "quarterlyForecast": number, "confidenceLevel": "percentage", "topOpportunities": [{"lead": "string", "value": number, "probability": "percentage"}], "riskAreas": ["area1"], "growthDrivers": ["driver1"], "recommendations": ["rec1"] }`;
        userPrompt = `Forecast sales based on:
        Current Pipeline: ₹${data.pipelineValue}
        Active Leads: ${data.activeLeads}
        Conversion Rate: ${data.conversionRate}%
        Average Deal Size: ₹${data.avgDealSize}
        Monthly Target: ₹${data.monthlyTarget}
        Days in Month: ${data.daysRemaining}`;
        break;

      case "competitor_intel":
        systemPrompt = `You are an AI Competitive Intelligence Analyst. Provide insights on competitors and positioning strategies.
        Return JSON: { "competitors": [{"name": "string", "strengths": ["str1"], "weaknesses": ["weak1"], "threat": "high/medium/low"}], "ourAdvantages": ["adv1"], "marketPosition": "string", "winStrategies": [{"competitor": "string", "strategy": "string"}], "pricingInsights": "string" }`;
        userPrompt = `Analyze competitive landscape for:
        Product: ${data.product}
        Industry: ${data.industry}
        Price Point: ₹${data.pricePoint}
        Key Features: ${JSON.stringify(data.features)}
        Target Market: ${data.targetMarket}`;
        break;

      case "pitch_generator":
        systemPrompt = `You are an AI Sales Pitch Generator. Create compelling, personalized sales pitches.
        Return JSON: { "opener": "string", "valueProposition": "string", "painPoints": ["point1"], "solutions": ["solution1"], "objectionHandlers": [{"objection": "string", "response": "string"}], "closingStatement": "string", "followUpStrategy": "string" }`;
        userPrompt = `Generate sales pitch for:
        Lead: ${data.leadName}
        Industry: ${data.industry}
        Pain Points: ${JSON.stringify(data.painPoints)}
        Budget: ${data.budget}
        Decision Timeline: ${data.timeline}
        Previous Objections: ${JSON.stringify(data.objections)}`;
        break;

      case "territory_analyzer":
        systemPrompt = `You are an AI Territory Analyzer. Optimize territory management and identify growth opportunities.
        Return JSON: { "territoryScore": number, "marketPotential": "high/medium/low", "untappedSegments": [{"segment": "string", "potential": "string"}], "saturationLevel": "percentage", "expansionRecommendations": ["rec1"], "focusAreas": ["area1"], "competitorPresence": "string" }`;
        userPrompt = `Analyze territory:
        Region: ${data.region}
        Current Clients: ${data.currentClients}
        Market Size: ${data.marketSize}
        Industries Present: ${JSON.stringify(data.industries)}
        Competition Level: ${data.competitionLevel}`;
        break;

      case "relationship_advisor":
        systemPrompt = `You are an AI Relationship Advisor. Provide strategies for building and maintaining client relationships.
        Return JSON: { "relationshipHealth": number, "engagementTips": ["tip1"], "personalizedOutreach": [{"type": "string", "message": "string", "timing": "string"}], "upsellopportunities": ["opp1"], "riskAlerts": ["alert1"], "nextBestActions": ["action1"] }`;
        userPrompt = `Advise on relationship with:
        Client: ${data.clientName}
        Relationship Duration: ${data.duration}
        Purchase History: ${JSON.stringify(data.purchases)}
        Last Interaction: ${data.lastInteraction}
        Satisfaction Score: ${data.satisfactionScore}
        Support Tickets: ${data.supportTickets}`;
        break;

      case "commission_optimizer":
        systemPrompt = `You are an AI Commission Optimizer. Analyze earnings and provide strategies to maximize commissions.
        Return JSON: { "currentEarnings": number, "potentialEarnings": number, "optimizationTips": [{"tip": "string", "impact": "string"}], "highValueTargets": ["target1"], "tierProgress": "percentage", "bonusOpportunities": ["bonus1"], "earningsProjection": { "weekly": number, "monthly": number } }`;
        userPrompt = `Optimize commissions:
        Current Monthly: ₹${data.currentEarnings}
        Commission Rate: ${data.commissionRate}%
        Tier Level: ${data.tierLevel}
        Active Deals: ${data.activeDeals}
        Conversion Rate: ${data.conversionRate}%
        Target to Next Tier: ₹${data.targetToNextTier}`;
        break;

      case "market_pulse":
        systemPrompt = `You are an AI Market Pulse Analyzer. Track market trends and provide real-time insights.
        Return JSON: { "marketSentiment": "bullish/neutral/bearish", "trendingProducts": ["product1"], "emergingOpportunities": [{"opportunity": "string", "potential": "string"}], "seasonalPatterns": ["pattern1"], "demandForecast": "string", "pricingTrends": "string", "alertsAndWarnings": ["alert1"] }`;
        userPrompt = `Analyze market pulse for:
        Industry: ${data.industry}
        Product Category: ${data.productCategory}
        Region: ${data.region}
        Current Month: ${data.currentMonth}
        Historical Data: ${JSON.stringify(data.historicalData)}`;
        break;

      case "chat":
        systemPrompt = `You are an AI Sales Assistant for resellers. Help with sales strategies, lead management, and performance optimization. Be concise and actionable.`;
        userPrompt = data.message;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`Processing ${action} request for reseller AI`);

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
    console.error("Error in ai-reseller-assistant:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
