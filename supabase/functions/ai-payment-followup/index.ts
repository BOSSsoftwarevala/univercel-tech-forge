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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get abandoned/failed payments that haven't been followed up
    const { data: abandonedPayments, error: fetchError } = await supabase
      .from('payment_attempts')
      .select('*')
      .in('status', ['initiated', 'pending', 'failed', 'abandoned'])
      .eq('ai_followed_up', false)
      .lt('ai_followup_count', 3)
      .order('created_at', { ascending: true })
      .limit(10);

    if (fetchError) {
      console.error('Error fetching payments:', fetchError);
      throw fetchError;
    }

    const followups = [];

    for (const payment of abandonedPayments || []) {
      // Check if payment is old enough for follow-up (at least 30 minutes)
      const createdAt = new Date(payment.created_at);
      const now = new Date();
      const minutesElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60);

      if (minutesElapsed < 30) continue;

      // Generate AI follow-up message
      let aiMessage = '';
      
      if (lovableApiKey) {
        try {
          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${lovableApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'system',
                  content: `You are a helpful payment support assistant for SoftwareVala. 
                  A user started a payment but didn't complete it. Generate a friendly, helpful follow-up message.
                  Ask if they faced any issues and offer assistance. Be concise and professional.
                  Include that they can reply to explain their issue and we'll help resolve it.`
                },
                {
                  role: 'user',
                  content: `Payment details:
                  - Amount: ${payment.currency} ${payment.amount}
                  - Product: ${payment.product_name || 'Software purchase'}
                  - Status: ${payment.status}
                  - Failure reason: ${payment.failure_reason || 'Not completed'}
                  - Time since started: ${Math.round(minutesElapsed)} minutes ago`
                }
              ],
            }),
          });

          if (response.ok) {
            const data = await response.json();
            aiMessage = data.choices?.[0]?.message?.content || '';
          }
        } catch (aiError) {
          console.error('AI generation error:', aiError);
        }
      }

      // Fallback message if AI fails
      if (!aiMessage) {
        aiMessage = `Hi! We noticed you started a payment of ${payment.currency} ${payment.amount} for ${payment.product_name || 'your purchase'} but it wasn't completed. 
        
Did you face any issues? We're here to help! Common solutions:
- Try a different payment method
- Check your card/bank details
- Contact your bank for authorization

Reply with your issue and we'll assist you immediately. Your payment is secure and protected.`;
      }

      // Update the payment record
      await supabase
        .from('payment_attempts')
        .update({
          ai_followed_up: true,
          ai_followup_count: (payment.ai_followup_count || 0) + 1,
          ai_followup_last_at: new Date().toISOString(),
          ai_followup_response: aiMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      // Log the follow-up action
      await supabase.from('audit_logs').insert({
        user_id: payment.user_id,
        action: 'ai_payment_followup',
        module: 'payments',
        meta_json: {
          payment_id: payment.id,
          amount: payment.amount,
          status: payment.status,
          followup_count: (payment.ai_followup_count || 0) + 1
        }
      });

      followups.push({
        payment_id: payment.id,
        email: payment.email,
        message: aiMessage
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        followups_sent: followups.length,
        details: followups
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
