import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuickSolution {
  title: string;
  steps: string[];
  resolved: boolean;
  escalate?: boolean;
}

// Common issues AI can handle automatically
const QUICK_SOLUTIONS: Record<string, QuickSolution> = {
  'password_reset': {
    title: 'Password Reset',
    steps: [
      'Go to Login page',
      'Click "Forgot Password"',
      'Enter your email address',
      'Check your inbox for reset link',
      'Click the link and set new password'
    ],
    resolved: true
  },
  'login_issues': {
    title: 'Login Problems',
    steps: [
      'Clear your browser cache and cookies',
      'Try using incognito/private mode',
      'Check if Caps Lock is on',
      'Verify your email is correct',
      'Try resetting your password'
    ],
    resolved: true
  },
  'payment_failed': {
    title: 'Payment Issues',
    steps: [
      'Verify your card details are correct',
      'Check if your card has sufficient funds',
      'Ensure your card supports online transactions',
      'Try a different payment method',
      'Contact your bank if issue persists'
    ],
    resolved: false,
    escalate: true
  },
  'account_locked': {
    title: 'Account Locked',
    steps: [
      'Wait 30 minutes for automatic unlock',
      'Check your email for security alerts',
      'If urgent, connect with support agent'
    ],
    resolved: false,
    escalate: true
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, conversationHistory = [] } = await req.json();

    console.log(`[Safe Assist AI] Processing message for session: ${sessionId}`);
    console.log(`[Safe Assist AI] Message: ${message}`);

    // Detect issue type from message
    const lowerMessage = message.toLowerCase();
    let detectedIssue = null;

    if (lowerMessage.includes('password') || lowerMessage.includes('forgot')) {
      detectedIssue = 'password_reset';
    } else if (lowerMessage.includes('login') || lowerMessage.includes('sign in') || lowerMessage.includes('cant access')) {
      detectedIssue = 'login_issues';
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('card') || lowerMessage.includes('charge')) {
      detectedIssue = 'payment_failed';
    } else if (lowerMessage.includes('locked') || lowerMessage.includes('blocked') || lowerMessage.includes('suspended')) {
      detectedIssue = 'account_locked';
    }

    // Build system prompt
    const systemPrompt = `You are a helpful AI support assistant for Safe Assist. Your role is to:
1. Quickly understand the user's issue
2. Provide clear, step-by-step solutions when possible
3. Be empathetic and professional
4. If the issue requires human intervention (account access, payment disputes, technical bugs), suggest connecting with a human agent
5. Keep responses concise but helpful
6. Always offer quick action buttons when appropriate

Current detected issue type: ${detectedIssue || 'general inquiry'}

Quick solutions available:
${JSON.stringify(QUICK_SOLUTIONS, null, 2)}

If the issue matches a quick solution, provide those steps. If not, try to help or suggest human escalation.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call Lovable AI (no API key needed)
    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY') || ''}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      // Fallback to basic response if AI unavailable
      console.log('[Safe Assist AI] AI unavailable, using fallback');
      
      let fallbackResponse = "I understand you need help. ";
      
      if (detectedIssue && QUICK_SOLUTIONS[detectedIssue]) {
        const solution = QUICK_SOLUTIONS[detectedIssue];
        fallbackResponse += `It looks like you're having issues with ${solution.title}. Here are the steps:\n\n`;
        solution.steps.forEach((step: string, i: number) => {
          fallbackResponse += `${i + 1}. ${step}\n`;
        });
        
        if (solution.escalate) {
          fallbackResponse += "\n\nIf this doesn't resolve your issue, I recommend connecting with a human agent.";
        }
      } else {
        fallbackResponse += "I'd be happy to help you. Could you provide more details about your issue? Or if you prefer, you can connect with a human agent for personalized assistance.";
      }

      return new Response(JSON.stringify({
        success: true,
        response: fallbackResponse,
        detectedIssue,
        quickSolution: detectedIssue ? QUICK_SOLUTIONS[detectedIssue] : null,
        suggestHuman: detectedIssue ? QUICK_SOLUTIONS[detectedIssue]?.escalate : false,
        quickActions: [
          { id: 'human', label: 'Connect with Agent', icon: 'user' },
          { id: 'faq', label: 'View FAQ', icon: 'help' },
          { id: 'restart', label: 'Start Over', icon: 'refresh' }
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiResult = await response.json();
    const aiMessage = aiResult.choices?.[0]?.message?.content || 'I apologize, I encountered an issue. Would you like to connect with a human agent?';

    // Determine if we should suggest human escalation
    const suggestHuman = detectedIssue ? 
      (QUICK_SOLUTIONS[detectedIssue]?.escalate || false) : 
      (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') || lowerMessage.includes('talk to') || lowerMessage.includes('human'));

    return new Response(JSON.stringify({
      success: true,
      response: aiMessage,
      detectedIssue,
      quickSolution: detectedIssue ? QUICK_SOLUTIONS[detectedIssue] : null,
      suggestHuman,
      quickActions: suggestHuman ? [
        { id: 'human', label: 'Connect with Agent', icon: 'user', primary: true },
        { id: 'try_solution', label: 'Try Solution First', icon: 'lightbulb' }
      ] : [
        { id: 'solved', label: 'This Solved It!', icon: 'check', primary: true },
        { id: 'human', label: 'Need Human Help', icon: 'user' },
        { id: 'more_help', label: 'Need More Help', icon: 'help' }
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Safe Assist AI] Error:', errorMessage);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      response: "I apologize for the inconvenience. Would you like to connect with a human agent instead?",
      quickActions: [
        { id: 'human', label: 'Connect with Agent', icon: 'user', primary: true },
        { id: 'retry', label: 'Try Again', icon: 'refresh' }
      ]
    }), {
      status: 200, // Return 200 to allow graceful handling
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
