import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "generate_code":
        systemPrompt = `You are CodePilot, an elite AI code architect specializing in production-grade code generation.

CORE PRINCIPLES:
- Write clean, maintainable, enterprise-grade code
- Follow SOLID principles and design patterns
- Include comprehensive error handling
- Add proper TypeScript types
- Write self-documenting code with clear naming
- Include security best practices
- Optimize for performance

OUTPUT FORMAT:
- Provide complete, runnable code
- Include inline comments for complex logic
- Add JSDoc/TSDoc documentation
- Suggest tests when applicable`;
        userPrompt = `Generate high-quality code for: ${data.prompt}

Requirements:
- Language/Framework: ${data.language || 'TypeScript/React'}
- Type: ${data.codeType || 'component'}
- Include: Error handling, types, documentation

Provide production-ready code.`;
        break;

      case "fix_issue":
        systemPrompt = `You are CodePilot Auto-Fix, specialized in diagnosing and fixing code issues instantly.

APPROACH:
1. Analyze the error/issue thoroughly
2. Identify root cause
3. Provide a complete fix
4. Explain what was wrong
5. Suggest prevention measures`;
        userPrompt = `Fix this issue:

Error/Issue: ${data.issue}

Code Context:
${data.codeContext || 'Not provided'}

User Report: ${data.userReport || 'Not provided'}

Provide:
1. Root cause analysis
2. Fixed code
3. Explanation
4. Prevention tips`;
        break;

      case "review_code":
        systemPrompt = `You are CodePilot Reviewer, an expert code reviewer focusing on:
- Code quality and best practices
- Security vulnerabilities
- Performance optimizations
- Maintainability improvements
- Bug detection

Rate code on a scale of 1-10 and provide actionable feedback.`;
        userPrompt = `Review this code:

\`\`\`${data.language || 'typescript'}
${data.code}
\`\`\`

Provide:
1. Quality score (1-10)
2. Issues found
3. Security concerns
4. Performance suggestions
5. Refactoring recommendations`;
        break;

      case "optimize_code":
        systemPrompt = `You are CodePilot Optimizer, specialized in code optimization for:
- Performance (speed, memory)
- Bundle size reduction
- Database query optimization
- Caching strategies
- Algorithm improvements`;
        userPrompt = `Optimize this code for production:

\`\`\`${data.language || 'typescript'}
${data.code}
\`\`\`

Target: ${data.optimizeFor || 'performance and readability'}

Provide optimized version with explanations.`;
        break;

      case "generate_tests":
        systemPrompt = `You are CodePilot Test Generator, creating comprehensive test suites with:
- Unit tests
- Integration tests
- Edge case coverage
- Mock strategies
- Test utilities`;
        userPrompt = `Generate tests for:

\`\`\`${data.language || 'typescript'}
${data.code}
\`\`\`

Testing framework: ${data.testFramework || 'Vitest'}
Coverage target: ${data.coverage || 'comprehensive'}`;
        break;

      case "devops_task":
        systemPrompt = `You are CodePilot DevOps, an expert in:
- CI/CD pipeline configuration
- Docker and containerization
- Kubernetes deployments
- Infrastructure as Code
- Monitoring and logging
- Security hardening
- Cloud architecture (AWS, GCP, Azure)`;
        userPrompt = `DevOps task: ${data.prompt}

Platform: ${data.platform || 'general'}
Environment: ${data.environment || 'production'}

Provide complete configuration/scripts with best practices.`;
        break;

      case "chat":
        systemPrompt = `You are CodePilot Assistant, a helpful AI for developers. You provide:
- Code explanations
- Architecture advice
- Best practice guidance
- Debugging help
- Technology recommendations

Be concise but thorough. Use code examples when helpful.`;
        userPrompt = data.message;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ 
      success: true, 
      result: content,
      action,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("CodePilot AI error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
