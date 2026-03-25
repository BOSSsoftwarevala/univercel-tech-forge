import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Email templates
const templates = {
  // Password Reset Email
  passwordReset: (data: { name: string; resetLink: string }) => ({
    subject: "Reset Your Password - Software Vala",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #22d3ee; margin: 0;">🔐 Password Reset</h1>
        </div>
        <div style="background: rgba(30, 41, 59, 0.8); padding: 30px; border-radius: 8px; border: 1px solid rgba(34, 211, 238, 0.2);">
          <p style="margin: 0 0 20px;">Hello ${data.name},</p>
          <p style="margin: 0 0 20px;">You requested to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #22d3ee 0%, #6366f1 100%); color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
          <p>© 2024 Software Vala. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Email Verification
  verification: (data: { name: string; verifyLink: string }) => ({
    subject: "Verify Your Email - Software Vala",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #10b981; margin: 0;">✅ Verify Your Email</h1>
        </div>
        <div style="background: rgba(30, 41, 59, 0.8); padding: 30px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
          <p style="margin: 0 0 20px;">Welcome ${data.name}!</p>
          <p style="margin: 0 0 20px;">Please verify your email address to complete your registration:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verifyLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #22d3ee 100%); color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
          <p>© 2024 Software Vala. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Lead Assignment Email
  leadAssignment: (data: { assigneeName: string; leadName: string; leadDetails: string; priority: string }) => ({
    subject: `🎯 New Lead Assigned: ${data.leadName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #f59e0b; margin: 0;">🎯 New Lead Assignment</h1>
        </div>
        <div style="background: rgba(30, 41, 59, 0.8); padding: 30px; border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.2);">
          <p style="margin: 0 0 20px;">Hello ${data.assigneeName},</p>
          <p style="margin: 0 0 20px;">A new lead has been assigned to you:</p>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong style="color: #22d3ee;">Lead:</strong> ${data.leadName}</p>
            <p style="margin: 5px 0;"><strong style="color: #22d3ee;">Priority:</strong> <span style="color: ${data.priority === 'high' ? '#ef4444' : data.priority === 'medium' ? '#f59e0b' : '#10b981'};">${data.priority.toUpperCase()}</span></p>
            <p style="margin: 5px 0;"><strong style="color: #22d3ee;">Details:</strong> ${data.leadDetails}</p>
          </div>
          <p style="color: #94a3b8;">Please follow up within 24 hours.</p>
        </div>
      </div>
    `,
  }),

  // Buzzer Alert Email
  buzzerAlert: (data: { alertType: string; message: string; priority: string; timestamp: string }) => ({
    subject: `🚨 URGENT: ${data.alertType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%); color: #fecaca; border-radius: 12px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #f87171; margin: 0;">🚨 BUZZER ALERT</h1>
        </div>
        <div style="background: rgba(127, 29, 29, 0.5); padding: 30px; border-radius: 8px; border: 2px solid #ef4444;">
          <p style="font-size: 18px; font-weight: bold; color: #fca5a5; margin: 0 0 10px;">${data.alertType}</p>
          <p style="margin: 0 0 20px;">${data.message}</p>
          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <span style="background: #ef4444; padding: 5px 12px; border-radius: 4px; font-size: 12px;">Priority: ${data.priority}</span>
            <span style="background: rgba(0,0,0,0.3); padding: 5px 12px; border-radius: 4px; font-size: 12px;">Time: ${data.timestamp}</span>
          </div>
          <p style="margin-top: 20px; color: #fca5a5; font-weight: bold;">⚡ Immediate action required!</p>
        </div>
      </div>
    `,
  }),

  // System Health Notification
  systemHealth: (data: { status: string; issues: string[]; metrics: Record<string, string> }) => ({
    subject: `📊 System Health: ${data.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: ${data.status === 'healthy' ? '#10b981' : data.status === 'warning' ? '#f59e0b' : '#ef4444'}; margin: 0;">📊 System Health Report</h1>
        </div>
        <div style="background: rgba(30, 41, 59, 0.8); padding: 30px; border-radius: 8px;">
          <div style="display: inline-block; padding: 8px 20px; border-radius: 20px; background: ${data.status === 'healthy' ? '#10b981' : data.status === 'warning' ? '#f59e0b' : '#ef4444'}; color: #0f172a; font-weight: bold; margin-bottom: 20px;">
            Status: ${data.status.toUpperCase()}
          </div>
          ${data.issues.length > 0 ? `
            <div style="margin: 20px 0;">
              <p style="color: #f87171; font-weight: bold;">⚠️ Issues Detected:</p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                ${data.issues.map(issue => `<li style="margin: 5px 0;">${issue}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          <div style="margin-top: 20px;">
            <p style="color: #22d3ee; font-weight: bold;">📈 Metrics:</p>
            <div style="background: rgba(15, 23, 42, 0.6); padding: 15px; border-radius: 8px; margin-top: 10px;">
              ${Object.entries(data.metrics).map(([key, value]) => `
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">
                  <span style="color: #94a3b8;">${key}:</span>
                  <span style="color: #e2e8f0; font-weight: bold;">${value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `,
  }),

  // Generic Notification
  notification: (data: { title: string; message: string; actionUrl?: string; actionText?: string }) => ({
    subject: data.title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #22d3ee; margin: 0;">${data.title}</h1>
        </div>
        <div style="background: rgba(30, 41, 59, 0.8); padding: 30px; border-radius: 8px; border: 1px solid rgba(34, 211, 238, 0.2);">
          <p style="margin: 0 0 20px; line-height: 1.6;">${data.message}</p>
          ${data.actionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.actionUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #22d3ee 0%, #6366f1 100%); color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold;">${data.actionText || 'Take Action'}</a>
            </div>
          ` : ''}
        </div>
        <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
          <p>© 2024 Software Vala. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
};

interface EmailRequest {
  type: 'password_reset' | 'verification' | 'lead_assignment' | 'buzzer_alert' | 'system_health' | 'notification';
  to: string | string[];
  data: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: EmailRequest = await req.json();
    const { type, to, data } = body;

    console.log(`Processing ${type} email to:`, to);

    let emailContent: { subject: string; html: string };

    // Generate email content based on type
    switch (type) {
      case 'password_reset':
        emailContent = templates.passwordReset(data as any);
        break;
      case 'verification':
        emailContent = templates.verification(data as any);
        break;
      case 'lead_assignment':
        emailContent = templates.leadAssignment(data as any);
        break;
      case 'buzzer_alert':
        emailContent = templates.buzzerAlert(data as any);
        break;
      case 'system_health':
        emailContent = templates.systemHealth(data as any);
        break;
      case 'notification':
        emailContent = templates.notification(data as any);
        break;
      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Software Vala <notifications@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log the email in database (optional - table may not exist)
    try {
      await supabase.from('email_logs').insert({
        email_type: type,
        recipient: Array.isArray(to) ? to.join(', ') : to,
        subject: emailContent.subject,
        status: 'sent',
        metadata: { resend_response: emailResponse },
      });
    } catch (logError) {
      console.log('Email log insert skipped:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        data: emailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
