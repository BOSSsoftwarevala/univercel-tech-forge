import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CodePilotResponse {
  success: boolean;
  result: string;
  action: string;
  timestamp: string;
}

export const useCodePilotAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callCodePilot = async (
    action: string,
    data: Record<string, any>
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke<CodePilotResponse>(
        'codepilot-ai',
        { body: { action, data } }
      );

      if (fnError) {
        console.error('CodePilot error:', fnError);
        setError(fnError.message);
        toast.error('CodePilot AI temporarily unavailable');
        return null;
      }

      if (!result?.success) {
        setError(result?.result || 'Unknown error');
        return null;
      }

      return result.result;
    } catch (err) {
      console.error('CodePilot exception:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to connect to CodePilot');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate production-ready code
  const generateCode = async (prompt: string, options?: {
    language?: string;
    codeType?: string;
  }) => {
    return callCodePilot('generate_code', { prompt, ...options });
  };

  // Auto-fix issues reported by users or system
  const fixIssue = async (issue: string, options?: {
    codeContext?: string;
    userReport?: string;
  }) => {
    return callCodePilot('fix_issue', { issue, ...options });
  };

  // Review code for quality and security
  const reviewCode = async (code: string, language?: string) => {
    return callCodePilot('review_code', { code, language });
  };

  // Optimize code for performance
  const optimizeCode = async (code: string, options?: {
    language?: string;
    optimizeFor?: string;
  }) => {
    return callCodePilot('optimize_code', { code, ...options });
  };

  // Generate comprehensive tests
  const generateTests = async (code: string, options?: {
    language?: string;
    testFramework?: string;
    coverage?: string;
  }) => {
    return callCodePilot('generate_tests', { code, ...options });
  };

  // DevOps task automation
  const devOpsTask = async (prompt: string, options?: {
    platform?: string;
    environment?: string;
  }) => {
    return callCodePilot('devops_task', { prompt, ...options });
  };

  // General chat assistance
  const chat = async (message: string) => {
    return callCodePilot('chat', { message });
  };

  return {
    isLoading,
    error,
    generateCode,
    fixIssue,
    reviewCode,
    optimizeCode,
    generateTests,
    devOpsTask,
    chat
  };
};
