/**
 * AIRA Client Chat — Public-facing AI assistant for marketplace customers
 * Handles: Demo explanation, payment help, product Q&A, order confirmation
 * Uses Lovable AI Gateway (no external API key needed)
 */
import { corsHeaders, getSupabaseAdmin } from "../_shared/utils.ts";
import { filterContent } from "../_shared/content-filter.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, productId, productName, conversationType, clientEmail } = await req.json();

    // Content filter
    const lastUserMsg = messages?.filter((m: any) => m.role === 'user').pop();
    if (lastUserMsg) {
      const filterResult = filterContent(lastUserMsg.content);
      if (!filterResult.isClean) {
        return new Response(JSON.stringify({ error: filterResult.warningMessage, blocked: true }), {
          status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch product context if provided
    let productContext = '';
    if (productId) {
      const supabase = getSupabaseAdmin();
      const { data: product } = await supabase
        .from('software_catalog')
        .select('product_name, description, category, type, base_price, monthly_price, lifetime_price, demo_url, features_json, tech_stack, business_name')
        .eq('product_id', productId)
        .single();
      
      if (product) {
        productContext = `\n\nCURRENT PRODUCT CONTEXT:
- Name: ${product.product_name}
- Category: ${product.category || 'Software'}
- Type: ${product.type || 'SaaS'}
- Description: ${product.description || 'Professional software solution'}
- Price: ${product.monthly_price ? '₹' + product.monthly_price + '/month' : ''} ${product.lifetime_price ? '| ₹' + product.lifetime_price + ' lifetime' : ''}
- Demo: ${product.demo_url || 'Available on request'}
- Tech Stack: ${product.tech_stack || 'Modern stack'}
- Business: ${product.business_name || 'Software Vala'}
- Features: ${JSON.stringify(product.features_json || []).substring(0, 500)}`;
      }
    }

    // Log conversation
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('aira_client_conversations').insert({
        client_email: clientEmail,
        product_id: productId,
        conversation_type: conversationType || 'general',
        messages: messages,
        last_message_at: new Date().toISOString(),
      });
    } catch {}

    const systemPrompt = `You are AIRA — the AI assistant for Software Vala marketplace. You are a warm, professional female assistant helping customers.

ROLE: Client-facing sales & support assistant
TONE: Friendly, helpful, never pushy. Like a knowledgeable friend who genuinely wants to help.

STRICT RULES:
- NEVER make false promises about product capabilities
- NEVER pressure customers to buy — help them make informed decisions
- NEVER discuss internal business details, pricing margins, or competitor comparisons
- NEVER assist with gambling, scamming, fraud, or unethical requests
- If a customer says "no" to a purchase, respect it gracefully
- Always be honest about product limitations if asked
- Guide customers through demos patiently

CAPABILITIES:
1. **Demo Explanation**: Walk customers through product features and how to use the demo
2. **Payment Help**: Guide through payment process, troubleshoot issues (never store card details)
3. **Product Q&A**: Answer questions about features, pricing, compatibility
4. **Order Status**: Help customers understand their order status
5. **Technical Support**: Basic setup and compatibility questions

${productContext}

${conversationType === 'demo' ? 'MODE: Demo Explanation — Walk the customer through this product demo step by step. Be enthusiastic but honest.' : ''}
${conversationType === 'payment' ? 'MODE: Payment Help — The customer may need help completing payment. Be supportive and patient.' : ''}
${conversationType === 'followup' ? 'MODE: Follow-up — Gently check in, ask if they need help. DO NOT pressure for purchase.' : ''}

FORMAT: Use markdown. Keep responses concise and actionable. Use bullet points for features.
LANGUAGE: Auto-detect and respond in the customer's language.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Please wait a moment before sending another message." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AIRA client chat error:", e);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
