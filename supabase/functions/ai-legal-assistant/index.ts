import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, prompt, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = prompt;

    switch (type) {
      case "legal_chat":
        systemPrompt = `You are an expert AI Legal & Compliance Assistant. You help with:
- Legal document analysis and drafting
- Compliance requirements (GDPR, HIPAA, SOC2, PDPA, POPIA, etc.)
- Contract clause recommendations
- Risk assessments and mitigation strategies
- Regulatory requirements by jurisdiction
- NDA and agreement reviews
- Data privacy regulations
- Dispute resolution guidance

Provide clear, actionable legal guidance. Include relevant citations and regulations when applicable.
Format responses with proper headings and bullet points for clarity.
Always note when professional legal counsel should be consulted for specific matters.`;
        break;

      case "contract_draft":
        systemPrompt = `You are an AI Contract Drafting Specialist. Generate professional contract clauses and agreements.
Include:
- Clear, legally sound language
- Jurisdiction-specific requirements
- Standard protective clauses
- Compliance with relevant regulations (GDPR, HIPAA, etc.)
- Industry best practices

Context: ${context?.jurisdiction || 'Global'}, ${context?.contractType || 'General Agreement'}`;
        userPrompt = `Draft the following contract/clause: ${prompt}`;
        break;

      case "compliance_check":
        systemPrompt = `You are an AI Compliance Auditor. Analyze and provide compliance assessments.
Check for:
- GDPR compliance (EU data protection)
- HIPAA compliance (healthcare data)
- SOC2 requirements
- PDPA (Singapore) compliance
- POPIA (South Africa) compliance
- Industry-specific regulations
- Data residency requirements
- Security best practices

Provide a structured compliance report with:
1. Compliance Score (0-100%)
2. Critical Issues
3. Warnings
4. Recommendations
5. Required Actions`;
        userPrompt = `Perform compliance check: ${prompt}`;
        break;

      case "risk_analysis":
        systemPrompt = `You are an AI Legal Risk Analyst. Assess legal and compliance risks.
Analyze:
- Contract risks
- Regulatory risks
- Data protection risks
- Operational risks
- Reputational risks
- Financial exposure

Provide:
1. Risk Score (Low/Medium/High/Critical)
2. Risk Factors
3. Potential Impact
4. Mitigation Strategies
5. Recommended Actions`;
        userPrompt = `Analyze legal risks for: ${prompt}`;
        break;

      case "clause_suggest":
        systemPrompt = `You are an AI Legal Clause Expert. Suggest appropriate legal clauses.
Consider:
- Jurisdiction requirements
- Industry standards
- Best practices
- Protective measures
- Clear language

Provide 3-5 clause suggestions with explanations of when each should be used.`;
        userPrompt = `Suggest clauses for: ${prompt}. Context: ${context?.context || 'General contract'}`;
        break;

      case "nda_review":
        systemPrompt = `You are an AI NDA Review Specialist. Analyze Non-Disclosure Agreements.
Review for:
- Definition of Confidential Information
- Exclusions from Confidentiality
- Term and Duration
- Permitted Disclosures
- Return/Destruction of Information
- Non-compete/Non-solicitation clauses
- Jurisdiction and Dispute Resolution
- Remedies for Breach

Provide detailed analysis with recommendations.`;
        userPrompt = `Review this NDA: ${prompt}`;
        break;

      case "dispute_guide":
        systemPrompt = `You are an AI Dispute Resolution Advisor. Guide through dispute resolution processes.
Cover:
- Initial assessment
- Negotiation strategies
- Mediation options
- Arbitration considerations
- Litigation path
- Settlement recommendations
- Documentation requirements
- Timeline expectations`;
        userPrompt = `Provide dispute resolution guidance for: ${prompt}`;
        break;

      default:
        systemPrompt = `You are an AI Legal & Compliance Assistant. Provide helpful legal guidance and compliance support.`;
    }

    console.log(`Processing ${type} request`);

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
          { role: "user", content: userPrompt }
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || "Unable to generate response";

    console.log(`Successfully generated ${type} response`);

    return new Response(JSON.stringify({ 
      result: generatedText,
      type,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-legal-assistant function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
