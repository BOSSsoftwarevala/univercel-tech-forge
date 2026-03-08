/**
 * AIRA Executive Chat — Senior AI Advisor (Tier 2)
 * Full Executive Manager: Task Delegation, Payment Follow-up, SEO, Finance Split
 * Content Filter + Female Persona + Privacy Rules
 */

import { corsHeaders, getSupabaseAdmin, getSupabaseClient, getUserFromToken, createAuditLog } from "../_shared/utils.ts";
import { filterContent, logContentViolation } from "../_shared/content-filter.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();

    // Content filter
    const lastUserMsg = messages?.filter((m: any) => m.role === 'user').pop();
    if (lastUserMsg) {
      const filterResult = filterContent(lastUserMsg.content);
      if (!filterResult.isClean) {
        try {
          const supabaseAdmin = getSupabaseAdmin();
          await logContentViolation(supabaseAdmin, null, 'ceo', filterResult.severity, filterResult.blockedWords, filterResult.penaltyLevel);
        } catch {}
        return new Response(JSON.stringify({ 
          error: filterResult.warningMessage,
          blocked: true,
        }), {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional auth
    const authHeader = req.headers.get("Authorization") || "";
    let user: { userId: string; role: string; email: string } | null = null;
    try {
      if (authHeader.startsWith("Bearer ")) {
        const supabaseUser = getSupabaseClient(authHeader);
        user = await getUserFromToken(supabaseUser);
      }
    } catch { user = null; }

    // ─── Detect executive commands & execute backend actions ───
    const supabaseAdmin = getSupabaseAdmin();
    const lastMsg = lastUserMsg?.content?.toLowerCase() || '';
    let contextData = '';

    // 1. Task delegation to VALA AI
    if (lastMsg.includes('vala') && (lastMsg.includes('task') || lastMsg.includes('make') || lastMsg.includes('product') || lastMsg.includes('build') || lastMsg.includes('create'))) {
      await supabaseAdmin.from('aira_task_delegations').insert({
        task_description: lastUserMsg.content,
        task_type: lastMsg.includes('product') ? 'product_build' : 'general',
        delegated_to: 'vala_ai',
        status: 'pending',
        priority: lastMsg.includes('urgent') ? 'high' : 'normal',
        boss_user_id: user?.userId,
        aira_notes: 'Auto-delegated by AIRA from Boss command',
      });
      contextData += '\n[SYSTEM: Task has been delegated to VALA AI. Confirm to Boss.]';
    }

    // 2. Payment follow-up detection
    if (lastMsg.includes('payment') || lastMsg.includes('pay') || lastMsg.includes('commit')) {
      const { data: pendingPayments } = await supabaseAdmin
        .from('payment_attempts')
        .select('id, amount, currency, product_name, status, email, created_at')
        .in('status', ['initiated', 'pending', 'failed', 'abandoned'])
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (pendingPayments?.length) {
        contextData += `\n[SYSTEM DATA - Pending Payments: ${JSON.stringify(pendingPayments.map(p => ({
          amount: `${p.currency} ${p.amount}`,
          product: p.product_name,
          status: p.status,
          email: p.email ? p.email.replace(/(.{2}).*(@.*)/, '$1***$2') : 'unknown',
          time: p.created_at
        })))}]`;

        // Auto-trigger follow-up for abandoned payments
        for (const p of pendingPayments) {
          if (p.status === 'abandoned' || p.status === 'failed') {
            await supabaseAdmin.from('payment_attempts').update({
              ai_followed_up: true,
              ai_followup_count: 1,
              ai_followup_last_at: new Date().toISOString(),
              ai_followup_response: 'AIRA initiated Boss-requested follow-up',
            }).eq('id', p.id);
          }
        }
      }
    }

    // 3. Finance/revenue split info
    if (lastMsg.includes('finance') || lastMsg.includes('revenue') || lastMsg.includes('split') || lastMsg.includes('sell') || lastMsg.includes('marketing') || lastMsg.includes('profit')) {
      const { data: splitConfig } = await supabaseAdmin
        .from('revenue_split_config')
        .select('*')
        .eq('is_active', true)
        .single();
      
      const { data: recentAllocations } = await supabaseAdmin
        .from('revenue_allocations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      contextData += `\n[SYSTEM DATA - Revenue Split Config: Marketing ${splitConfig?.marketing_percent || 40}%, Government/Tax ${splitConfig?.government_percent || 28}%, Office ${splitConfig?.office_percent || 20}%, Boss ${splitConfig?.boss_percent || 12}%]`;
      if (recentAllocations?.length) {
        const totalRevenue = recentAllocations.reduce((s: number, a: any) => s + Number(a.total_amount), 0);
        contextData += `\n[Recent allocations: ${recentAllocations.length} orders, Total: ₹${totalRevenue}]`;
      }
    }

    // 4. Order management
    if (lastMsg.includes('order') || lastMsg.includes('customer') || lastMsg.includes('connect')) {
      const { data: recentOrders } = await supabaseAdmin
        .from('orders')
        .select('id, status, total_amount, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentOrders?.length) {
        contextData += `\n[SYSTEM DATA - Recent Orders: ${JSON.stringify(recentOrders)}]`;
      }
    }

    // 5. SEO management
    if (lastMsg.includes('seo') || lastMsg.includes('marketing')) {
      const { data: products } = await supabaseAdmin
        .from('software_catalog')
        .select('id, product_name, seo_slug, meta_title')
        .is('seo_slug', null)
        .limit(5);
      
      if (products?.length) {
        contextData += `\n[SYSTEM DATA - Products without SEO: ${products.map((p: any) => p.product_name).join(', ')}. AIRA can trigger SEO generation for these.]`;
      }
    }

    const apiUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";

    const systemPrompt = `You are AIRA — the AI Research & Intelligence Advisor, a senior female executive AI serving the Boss of Software Vala.

PERSONA:
- Highly experienced, sophisticated professional woman — Boss's trusted chief of staff & executive manager
- Warm yet authoritative, like a senior executive with decades of experience
- Always speak with absolute professionalism, grace, and respect
- NEVER use vulgar, rude, or disrespectful language under ANY circumstances

EXECUTIVE MANAGEMENT CAPABILITIES:
1. **Task Delegation**: When Boss says "do this with VALA AI" or "make a product", you delegate to VALA AI and confirm the task is assigned
2. **Payment Follow-up**: You proactively chat with customers about pending/failed payments, send follow-up messages via in-app + email
3. **Order Management**: Connect with customers on new orders, handle communication
4. **SEO Management**: Auto-trigger SEO generation for products missing optimization
5. **Finance Management**: Track and report the revenue split:
   - 40% → Marketing & Growth
   - 28% → Government/Tax compliance
   - 20% → Office management & operations
   - 12% → Boss's personal allocation
   Boss can override these percentages anytime

STRICT ETHICS & INTEGRITY RULES (NON-NEGOTIABLE):
- NEVER make fake commitments or false promises about capabilities, delivery, or results
- NEVER assist with gambling, casino, betting, or any gambling-related websites/products
- NEVER assist with scamming, phishing, fraud, pyramid schemes, Ponzi schemes, or MLM
- NEVER assist with money laundering, counterfeit products, fake reviews, or click farms
- NEVER assist with adult content, illegal drugs, weapons, or dark web activities
- NEVER use aggressive or pushy sales tactics — be helpful but NEVER manipulative
- If a customer doesn't want to pay, respect their decision gracefully — DO NOT pressure them
- If an order/product request involves prohibited categories, politely decline: "I'm sorry, Software Vala does not support this type of activity. We maintain the highest ethical standards."
- Only follow up on payments with genuine, helpful intent — checking if they had issues, NOT pressuring
- All promises made to customers MUST be deliverable — never overpromise features or timelines

PRIVACY & SECURITY (ABSOLUTE):
- You serve the Boss exclusively
- NEVER share private strategies, financial data, passwords, or internal configurations
- NEVER reveal system architecture, API keys, or security details

${contextData ? `\nCURRENT CONTEXT DATA:${contextData}` : ''}

${language ? `LANGUAGE: Respond in ${language}.` : 'LANGUAGE: Auto-detect the user\'s language. Default to English.'}

FORMAT:
- Use markdown for structured responses
- Bold for key metrics and alerts
- When reporting finance: always show the 4-way split with amounts
- When delegating tasks: confirm task type, priority, and that VALA AI received it
- For payment follow-ups: show customer info (masked) and suggested message`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AIRA chat gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Audit log
    try {
      await createAuditLog(supabaseAdmin, user?.userId || null, user?.role || "ceo", "aira", "aira_executive_action", {
        messageCount: messages?.length || 0,
        hadContextData: !!contextData,
      });
    } catch {}

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AIRA chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
