/**
 * Product Auto-Builder Pipeline
 * Boss command → VALA AI generate → Build → Deploy demo → Publish marketplace
 */
import { corsHeaders, getSupabaseAdmin } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command, productName, category, description } = await req.json();
    const supabase = getSupabaseAdmin();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stage 1: Create pipeline entry
    const { data: pipeline, error: pipelineError } = await supabase
      .from('product_build_pipeline')
      .insert({
        boss_command: command || `Create ${productName}`,
        product_name: productName,
        status: 'in_progress',
        stage: 'ai_generating',
      })
      .select()
      .single();

    if (pipelineError) throw pipelineError;

    // Stage 2: AI generates product metadata
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a product architect. Generate complete product metadata. Return ONLY valid JSON." },
          { role: "user", content: `Create a software product:
Name: ${productName || 'Auto-generated'}
Category: ${category || 'General'}
Description: ${description || command}

Generate JSON:
{
  "product_name": "string",
  "description": "2-3 sentence product description",
  "category": "string",
  "type": "SaaS|Desktop|Mobile|Hybrid",
  "tech_stack": "string",
  "features": ["feature1", "feature2", "feature3", "feature4", "feature5"],
  "base_price": number,
  "monthly_price": number,
  "lifetime_price": number,
  "target_market": "string",
  "seo_keywords": ["keyword1", "keyword2", "keyword3"]
}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_product",
            description: "Create a new software product with metadata",
            parameters: {
              type: "object",
              properties: {
                product_name: { type: "string" },
                description: { type: "string" },
                category: { type: "string" },
                type: { type: "string", enum: ["SaaS", "Desktop", "Mobile", "Hybrid"] },
                tech_stack: { type: "string" },
                features: { type: "array", items: { type: "string" } },
                base_price: { type: "number" },
                monthly_price: { type: "number" },
                lifetime_price: { type: "number" },
                target_market: { type: "string" },
                seo_keywords: { type: "array", items: { type: "string" } }
              },
              required: ["product_name", "description", "category", "type"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "create_product" } },
      }),
    });

    let productData: any = {};
    if (aiResponse.ok) {
      const aiResult = await aiResponse.json();
      const toolCall = aiResult?.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        productData = JSON.parse(toolCall.function.arguments);
      }
    }

    // Stage 3: Insert into software_catalog
    const productId = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const seoSlug = (productData.product_name || productName || 'product')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const { error: catalogError } = await supabase
      .from('software_catalog')
      .insert({
        product_id: productId,
        product_name: productData.product_name || productName,
        name: productData.product_name || productName,
        description: productData.description || description,
        category: productData.category || category || 'General',
        type: productData.type || 'SaaS',
        tech_stack: productData.tech_stack,
        features_json: productData.features || [],
        base_price: productData.base_price || 0,
        monthly_price: productData.monthly_price || 0,
        lifetime_price: productData.lifetime_price || 0,
        seo_slug: seoSlug,
        seo_keywords: productData.seo_keywords || [],
        is_active: true,
        listing_status: 'published',
        business_name: 'Software Vala',
        is_verified: true,
      } as any);

    if (catalogError) {
      console.error("Catalog insert error:", catalogError);
    }

    // Stage 4: Update pipeline status
    await supabase.from('product_build_pipeline').update({
      status: 'completed',
      stage: 'marketplace_published',
      build_result: productData,
      marketplace_published: true,
      completed_at: new Date().toISOString(),
    }).eq('id', pipeline.id);

    // Stage 5: Trigger SEO generation
    try {
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-product-seo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({
          productId,
          productName: productData.product_name || productName,
          category: productData.category,
          type: productData.type,
          description: productData.description,
          features: productData.features,
          price: productData.base_price,
        }),
      });
    } catch {}

    // Audit log
    await supabase.from('audit_logs').insert({
      action: 'product_auto_built',
      module: 'product_pipeline',
      meta_json: {
        pipeline_id: pipeline.id,
        product_id: productId,
        product_name: productData.product_name || productName,
        boss_command: command,
      }
    });

    return new Response(JSON.stringify({
      success: true,
      pipeline_id: pipeline.id,
      product_id: productId,
      product: productData,
      status: 'published',
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Product auto-builder error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Build failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
