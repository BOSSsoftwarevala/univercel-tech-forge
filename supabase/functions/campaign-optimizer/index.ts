import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CampaignOptimizeRequest {
  type: 'ad_copy' | 'budget_suggestion' | 'conversion_prediction';
  campaign?: {
    name: string;
    budget: number;
    spent: number;
    leads: number;
    ctr: number;
    region: string;
    channel: string;
  };
  product?: string;
  targetAudience?: string;
  tone?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, campaign, product, targetAudience, tone } = await req.json() as CampaignOptimizeRequest;
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'ad_copy':
        systemPrompt = `You are an expert marketing copywriter specializing in digital advertising. Generate compelling, conversion-focused ad copy that captures attention and drives action. Be concise, persuasive, and create urgency. Respond with a JSON object containing: headline (max 60 chars), description (max 150 chars), callToAction (max 30 chars), and variations (array of 2 alternative headlines).`;
        userPrompt = `Create ad copy for: ${product || 'Software product'}
Target audience: ${targetAudience || 'Business professionals'}
Tone: ${tone || 'Professional yet engaging'}
Channel: ${campaign?.channel || 'Social media'}`;
        break;

      case 'budget_suggestion':
        systemPrompt = `You are a marketing budget optimization expert with deep knowledge of digital advertising ROI. Analyze campaign performance data and provide specific, actionable budget recommendations. Respond with a JSON object containing: recommendedBudget (number), change (percentage as string like "+20%"), reasoning (brief explanation), expectedLeads (number), expectedROI (percentage), and riskLevel (low/medium/high).`;
        userPrompt = `Analyze this campaign and suggest optimal budget:
Campaign: ${campaign?.name || 'Unknown'}
Current Budget: ₹${campaign?.budget || 0}
Spent: ₹${campaign?.spent || 0}
Leads Generated: ${campaign?.leads || 0}
CTR: ${campaign?.ctr || 0}%
Region: ${campaign?.region || 'Unknown'}
Channel: ${campaign?.channel || 'Unknown'}`;
        break;

      case 'conversion_prediction':
        systemPrompt = `You are a data scientist specializing in marketing analytics and conversion prediction. Analyze campaign metrics to predict conversion rates and identify optimization opportunities. Respond with a JSON object containing: predictedConversionRate (percentage string), confidence (high/medium/low), predictedLeads (number for next 7 days), optimizationTips (array of 3 brief tips), and riskFactors (array of 2 potential risks).`;
        userPrompt = `Predict conversion performance for this campaign:
Campaign: ${campaign?.name || 'Unknown'}
Budget: ₹${campaign?.budget || 0}
Current Leads: ${campaign?.leads || 0}
CTR: ${campaign?.ctr || 0}%
Budget Utilized: ${campaign?.budget ? ((campaign.spent || 0) / campaign.budget * 100).toFixed(1) : 0}%
Region: ${campaign?.region || 'Unknown'}
Channel: ${campaign?.channel || 'Unknown'}`;
        break;

      default:
        throw new Error('Invalid optimization type');
    }

    console.log(`Processing ${type} request for campaign: ${campaign?.name || 'N/A'}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log(`Successfully generated ${type} response`);

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      parsedContent = { raw: content };
    }

    return new Response(JSON.stringify({ 
      type,
      result: parsedContent,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in campaign-optimizer function:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
