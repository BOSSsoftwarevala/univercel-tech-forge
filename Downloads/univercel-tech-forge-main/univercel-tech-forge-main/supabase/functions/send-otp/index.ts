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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, email, otpType, actionDescription, actionData } = await req.json();

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limiting
    const { data: settings } = await supabase
      .from('user_2fa_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (settings?.otp_rate_limit_until && new Date(settings.otp_rate_limit_until) > new Date()) {
      return new Response(
        JSON.stringify({ error: 'Too many OTP requests. Please wait before trying again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate OTP
    const { data: otpCode, error: otpError } = await supabase.rpc('generate_otp', {
      p_user_id: userId,
      p_otp_type: otpType,
      p_action_description: actionDescription,
      p_action_data: actionData || {}
    });

    if (otpError) {
      console.error('OTP generation error:', otpError);
      throw otpError;
    }

    // Send email with OTP
    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SOFTWARE VALA <security@softwarevala.com>',
          to: [email],
          subject: `🔐 Your Verification Code: ${otpCode}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0a; color: #ffffff; padding: 20px; }
                .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid #333; }
                .logo { text-align: center; margin-bottom: 30px; }
                .otp-box { background: #0f0f23; border: 2px solid #00ff88; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
                .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #00ff88; font-family: monospace; }
                .action-info { background: #1a1a3e; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #00ff88; }
                .warning { color: #ff6b6b; font-size: 12px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">
                  <h1 style="color: #00ff88; margin: 0;">🛡️ SOFTWARE VALA</h1>
                  <p style="color: #888; margin: 5px 0;">Security Verification</p>
                </div>
                
                <p>Hello,</p>
                <p>You've requested to perform a secure action. Use the code below to verify your identity:</p>
                
                <div class="otp-box">
                  <div class="otp-code">${otpCode}</div>
                  <p style="color: #888; margin-top: 15px; font-size: 14px;">Valid for 5 minutes</p>
                </div>
                
                <div class="action-info">
                  <strong>Action Type:</strong> ${otpType}<br/>
                  <strong>Description:</strong> ${actionDescription || 'Security verification'}
                </div>
                
                <div class="warning">
                  ⚠️ Never share this code with anyone. SOFTWARE VALA will never ask for your OTP via phone or chat.
                </div>
                
                <div class="footer">
                  <p>If you didn't request this code, please ignore this email and secure your account.</p>
                  <p>© ${new Date().getFullYear()} SOFTWARE VALA. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `
        })
      });

      if (!emailResponse.ok) {
        const emailError = await emailResponse.text();
        console.error('Email send error:', emailError);
        // Don't throw - OTP is still generated, user can still see it in logs for testing
      }
    } else {
      console.log('RESEND_API_KEY not configured. OTP generated:', otpCode);
    }

    // Log the OTP send event
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: 'otp_sent',
      module: 'security',
      meta_json: {
        otp_type: otpType,
        action_description: actionDescription,
        email_sent: !!resendApiKey
      }
    });

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Send OTP error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
