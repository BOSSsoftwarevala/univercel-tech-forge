import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, productName, category, type, description, features, price } = await req.json();

    if (!productName) {
      return new Response(JSON.stringify({ error: 'productName is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate SEO slug
    const baseSlug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Generate SEO metadata using AI
    const aiPrompt = `Generate SEO metadata for a software product. Return ONLY valid JSON, no markdown.

Product: ${productName}
Category: ${category || 'Software'}
Type: ${type || 'SaaS'}
Description: ${description || ''}
Features: ${(features || []).join(', ')}
Price: ${price ? '₹' + price : 'Contact for pricing'}

Generate this JSON structure:
{
  "meta_title": "max 60 chars, include product name and category keyword",
  "meta_description": "max 160 chars, compelling description with call to action",
  "seo_keywords": ["array of 8-12 relevant search keywords"],
  "marketing_hashtags": ["array of 5-8 hashtags with # prefix"],
  "feature_tags": ["array of 3-5 short feature tags"],
  "short_description": "one sentence product summary, max 100 chars",
  "og_description": "optimized for social sharing, max 200 chars"
}`;

    const aiResponse = await fetch("https://feqdqyadkijpohyllfdq.supabase.co/functions/v1/ai-gateway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are an SEO expert. Return ONLY valid JSON, no markdown fences." },
          { role: "user", content: aiPrompt },
        ],
        max_tokens: 1000,
      }),
    });

    let seoData: any = {};

    if (aiResponse.ok) {
      const aiResult = await aiResponse.json();
      const content = aiResult?.choices?.[0]?.message?.content || '';
      // Parse JSON from response (strip markdown fences if present)
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      try {
        seoData = JSON.parse(jsonStr);
      } catch {
        console.error('Failed to parse AI SEO response:', content);
      }
    }

    // Fallback if AI fails
    const metaTitle = seoData.meta_title || `${productName} | SaaS Vala Marketplace`;
    const metaDescription = seoData.meta_description || 
      `${productName} - ${category || 'Software'} solution. Try live demo and buy instantly on SaaS Vala.`;
    const keywords = seoData.seo_keywords || [
      productName.toLowerCase(),
      (category || 'software').toLowerCase(),
      'saas marketplace',
      'buy software online',
    ];
    const hashtags = seoData.marketing_hashtags || [
      `#${productName.replace(/\s+/g, '')}`,
      '#SaaSVala',
      '#SoftwareSolutions',
      `#${(category || 'Software').replace(/\s+/g, '')}`,
    ];
    const featureTags = seoData.feature_tags || [];
    const shortDesc = seoData.short_description || description?.substring(0, 100) || '';

    // Update product in database if productId provided
    if (productId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase
        .from('software_catalog')
        .update({
          seo_slug: baseSlug,
          meta_title: metaTitle,
          meta_description: metaDescription,
          seo_keywords: keywords,
          marketing_hashtags: hashtags,
          feature_tags: featureTags,
          short_description: shortDesc,
          og_image_url: null, // Will use product_thumbnail_url as fallback
        })
        .eq('id', productId);
    }

    return new Response(JSON.stringify({
      success: true,
      seo: {
        slug: baseSlug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        seo_keywords: keywords,
        marketing_hashtags: hashtags,
        feature_tags: featureTags,
        short_description: shortDesc,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
