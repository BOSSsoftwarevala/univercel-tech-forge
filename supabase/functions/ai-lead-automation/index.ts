import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, lead_id, data } = await req.json();

    if (action === 'score') {
      // AI lead scoring
      const { data: lead } = await supabase.from('leads').select('*').eq('id', lead_id).single();
      if (!lead) throw new Error('Lead not found');

      const prompt = `Analyze this lead and provide a score 0-100 and conversion probability 0-100:
Name: ${lead.name}, Company: ${lead.company || 'N/A'}, Source: ${lead.source}, 
Priority: ${lead.priority || 'N/A'}, Industry: ${lead.industry || 'N/A'},
Budget: ${lead.budget_range || 'N/A'}, Requirements: ${lead.requirements || 'N/A'}
Respond in JSON: {"ai_score": number, "conversion_probability": number, "reasoning": string}`;

      const aiResponse = await fetch('https://lovable.dev/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const aiResult = await aiResponse.json();
      const content = aiResult.choices?.[0]?.message?.content || '{}';
      
      let parsed;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
      } catch { parsed = { ai_score: 50, conversion_probability: 30, reasoning: 'Could not parse AI response' }; }

      await supabase.from('leads').update({
        ai_score: parsed.ai_score || 50,
        conversion_probability: parsed.conversion_probability || 30,
        updated_at: new Date().toISOString(),
      }).eq('id', lead_id);

      return new Response(JSON.stringify({ success: true, ...parsed }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'qualify') {
      // Bulk qualification
      const { data: leads } = await supabase.from('leads').select('*').eq('status', 'new').limit(20);
      
      const prompt = `Analyze these ${leads?.length || 0} leads and classify each as hot/warm/cold priority.
Leads: ${JSON.stringify(leads?.map(l => ({ id: l.id, name: l.name, source: l.source, company: l.company })))}
Respond in JSON array: [{"id": string, "priority": "hot"|"warm"|"cold", "ai_score": number}]`;

      const aiResponse = await fetch('https://lovable.dev/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const aiResult = await aiResponse.json();
      const content = aiResult.choices?.[0]?.message?.content || '[]';
      
      let parsed;
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : '[]');
      } catch { parsed = []; }

      for (const item of parsed) {
        if (item.id) {
          await supabase.from('leads').update({
            priority: item.priority,
            ai_score: item.ai_score,
            updated_at: new Date().toISOString(),
          }).eq('id', item.id);
        }
      }

      return new Response(JSON.stringify({ success: true, qualified: parsed.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'suggest_followup') {
      const { data: leads } = await supabase.from('leads').select('*').in('status', ['contacted', 'follow_up', 'qualified']).limit(10);

      const prompt = `For these leads that need follow-up, suggest the best next action and optimal timing.
Leads: ${JSON.stringify(leads?.map(l => ({ id: l.id, name: l.name, status: l.status, last_contact_at: l.last_contact_at, priority: l.priority })))}
Respond in JSON array: [{"id": string, "suggested_action": string, "best_time": string, "confidence": number}]`;

      const aiResponse = await fetch('https://lovable.dev/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const aiResult = await aiResponse.json();
      const content = aiResult.choices?.[0]?.message?.content || '[]';
      
      let parsed;
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : '[]');
      } catch { parsed = []; }

      return new Response(JSON.stringify({ success: true, suggestions: parsed }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
