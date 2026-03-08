import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SEORequest {
  type: "meta_tags" | "social_post" | "reels_script" | "auto_reply" | "content_plan" | "keyword_discover" | "seo_audit" | "competitor_gap";
  data: Record<string, any>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { type, data }: SEORequest = await req.json();
    console.log(`Processing SEO automation: ${type}`, data);

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "meta_tags":
        systemPrompt = `You are an expert SEO specialist. Generate optimized meta tags for websites.
Always return a valid JSON object with these fields:
- title: SEO-optimized title (max 60 chars)
- description: Compelling meta description (max 160 chars)
- ogTitle: Open Graph title
- ogDescription: Open Graph description
- keywords: Array of 5-10 relevant keywords
- schema: JSON-LD structured data as a string`;
        userPrompt = `Generate SEO meta tags for:
Page URL: ${data.url || "homepage"}
Business: ${data.business || "Software company"}
Target Keywords: ${data.keywords || "software, technology"}
Target Region: ${data.region || "Global"}
Page Type: ${data.pageType || "landing page"}`;
        break;

      case "social_post":
        systemPrompt = `You are a social media expert specializing in viral content.
Generate engaging social media posts optimized for each platform.
Return a valid JSON object with:
- instagram: Object with caption (max 2200 chars), hashtags array (30 max)
- facebook: Object with post text, callToAction
- linkedin: Object with professional post text
- twitter: Object with tweet (max 280 chars)
- youtube: Object with title, description, tags array`;
        userPrompt = `Create social media posts for:
Topic: ${data.topic || "Product launch"}
Brand: ${data.brand || "Software Vala"}
Tone: ${data.tone || "Professional yet engaging"}
Target Audience: ${data.audience || "Business owners"}
Include CTA: ${data.cta || "Book a demo"}
Region: ${data.region || "Global"}`;
        break;

      case "reels_script":
        systemPrompt = `You are a viral video content creator specializing in short-form video scripts.
Create engaging Reels/Shorts scripts that capture attention in the first 3 seconds.
Return a valid JSON object with:
- hook: Attention-grabbing opening (first 3 seconds)
- script: Full script with timestamps
- scenes: Array of scene descriptions
- duration: Estimated duration in seconds
- music: Suggested background music style
- captions: Text overlays array
- hashtags: Relevant hashtags array
- thumbnail: Suggested thumbnail text`;
        userPrompt = `Create a viral Reel script for:
Topic: ${data.topic || "Business tips"}
Style: ${data.style || "Educational with humor"}
Duration: ${data.duration || "30 seconds"}
Brand: ${data.brand || "Software Vala"}
Goal: ${data.goal || "Drive engagement and followers"}
Platform: ${data.platform || "Instagram Reels"}`;
        break;

      case "auto_reply":
        systemPrompt = `You are a helpful social media community manager.
Generate friendly, professional auto-replies for social media comments.
Be helpful, include relevant CTAs when appropriate, use appropriate emojis.
Return a valid JSON object with:
- reply: The reply text
- sentiment: Detected sentiment of original comment
- suggestedAction: What action to take (reply, escalate, ignore)
- tone: Tone of the reply`;
        userPrompt = `Generate a reply for:
Platform: ${data.platform || "Instagram"}
Comment: "${data.comment}"
Brand: ${data.brand || "Software Vala"}
Context: ${data.context || "Tech company selling software"}`;
        break;

      case "content_plan":
        systemPrompt = `You are a content strategist specializing in SEO-driven content marketing.
Create a comprehensive content calendar and strategy.
Return a valid JSON object with:
- weeklyPlan: Array of 7 days with posts for each platform
- contentPillars: Array of main content themes
- postingSchedule: Optimal posting times for each platform
- campaigns: Array of campaign ideas
- keywordFocus: Keywords to target this week`;
        userPrompt = `Create a content plan for:
Business: ${data.business || "Software company"}
Goals: ${data.goals || "Increase brand awareness"}
Platforms: ${data.platforms?.join(", ") || "Instagram, LinkedIn, Facebook"}
Industry: ${data.industry || "Technology"}
Region: ${data.region || "Global"}
Duration: ${data.duration || "1 week"}`;
        break;

      case "keyword_discover":
        systemPrompt = `You are an expert SEO keyword researcher. Discover high-value keyword opportunities.
Return a valid JSON object with:
- keywords: Array of objects with { keyword, searchVolume, difficulty, cpc, intent, opportunity }
- clusters: Array of keyword groups with theme names
- longTail: Array of long-tail keyword variations
- questions: Array of "People Also Ask" style questions`;
        userPrompt = `Discover keyword opportunities for:
Domain: ${data.domain || "softwarewala.net"}
Industry: ${data.industry || "Software & Technology"}
Current Keywords: ${data.currentKeywords || "software development, CRM, cloud hosting"}
Target Region: ${data.region || "Global"}
Competitors: ${data.competitors || "N/A"}`;
        break;

      case "seo_audit":
        systemPrompt = `You are a technical SEO auditor. Analyze and provide SEO audit recommendations.
Return a valid JSON object with:
- score: Overall SEO score (0-100)
- issues: Array of { type, severity, description, recommendation, affectedPages }
- recommendations: Array of prioritized action items
- technicalHealth: Object with { pageSpeed, mobileFriendly, security, indexability }
- contentQuality: Object with metrics`;
        userPrompt = `Perform SEO audit analysis for:
Domain: ${data.domain || "softwarewala.net"}
Total Pages: ${data.totalPages || 1847}
Current Issues: ${JSON.stringify(data.currentIssues || [])}
Focus Areas: ${data.focusAreas || "technical, on-page, content"}`;
        break;

      case "competitor_gap":
        systemPrompt = `You are a competitive SEO analyst. Identify keyword and content gaps vs competitors.
Return a valid JSON object with:
- keywordGaps: Array of { keyword, yourPosition, competitorPosition, volume, difficulty, opportunity }
- contentGaps: Array of content topics competitors cover that you don't
- backlinkOpportunities: Array of high-DA domains linking to competitors
- strategicRecommendations: Array of prioritized actions`;
        userPrompt = `Analyze competitive gaps for:
Your Domain: ${data.domain || "softwarewala.net"}
Competitors: ${data.competitors?.join(", ") || "competitor-a.com, competitor-b.io"}
Industry: ${data.industry || "Software & Technology"}
Your Keywords: ${data.yourKeywords || "648 tracked keywords"}`;
        break;

      default:
        throw new Error(`Unknown automation type: ${type}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    let result;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      result = JSON.parse(jsonStr);
    } catch {
      result = { rawContent: content };
    }

    console.log(`SEO automation completed: ${type}`);

    return new Response(JSON.stringify({ 
      success: true, 
      type,
      result 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("SEO automation error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
