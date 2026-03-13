/**
 * AIRA Revenue Split — Auto-allocates revenue on each completed order
 * 40% Marketing | 28% Government/Tax | 20% Office | 12% Boss (configurable)
 */
import { corsHeaders, getSupabaseAdmin } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, totalAmount, configOverride } = await req.json();
    const supabase = getSupabaseAdmin();

    // Get active split config or use override
    let splitConfig = configOverride;
    if (!splitConfig) {
      const { data } = await supabase
        .from('revenue_split_config')
        .select('*')
        .eq('is_active', true)
        .single();
      splitConfig = data;
    }

    const marketing = splitConfig?.marketing_percent || 40;
    const government = splitConfig?.government_percent || 28;
    const office = splitConfig?.office_percent || 20;
    const boss = splitConfig?.boss_percent || 12;

    const amount = Number(totalAmount);
    const allocation = {
      order_id: orderId || `manual-${Date.now()}`,
      total_amount: amount,
      marketing_amount: Math.round(amount * marketing) / 100,
      government_amount: Math.round(amount * government) / 100,
      office_amount: Math.round(amount * office) / 100,
      boss_amount: Math.round(amount * boss) / 100,
      split_config_id: splitConfig?.id,
      status: 'allocated',
    };

    const { data, error } = await supabase
      .from('revenue_allocations')
      .insert(allocation)
      .select()
      .single();

    if (error) throw error;

    // Audit log
    await supabase.from('audit_logs').insert({
      action: 'revenue_auto_split',
      module: 'finance',
      meta_json: {
        order_id: orderId,
        total: amount,
        split: { marketing: allocation.marketing_amount, government: allocation.government_amount, office: allocation.office_amount, boss: allocation.boss_amount }
      }
    });

    return new Response(JSON.stringify({ success: true, allocation: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Revenue split error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
