import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LegalAIContext {
  jurisdiction?: string;
  contractType?: string;
  context?: string;
}

export const useLegalAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callLegalAI = async (
    type: string, 
    prompt: string, 
    context?: LegalAIContext
  ): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-legal-assistant', {
        body: { type, prompt, context }
      });

      if (error) {
        console.error('Legal AI error:', error);
        toast.error('Failed to get AI response');
        return null;
      }

      return data.result;
    } catch (err) {
      console.error('Legal AI exception:', err);
      toast.error('AI service temporarily unavailable');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const legalChat = async (message: string) => {
    return callLegalAI('legal_chat', message);
  };

  const draftContract = async (
    description: string, 
    jurisdiction: string = 'Global',
    contractType: string = 'General Agreement'
  ) => {
    return callLegalAI('contract_draft', description, { jurisdiction, contractType });
  };

  const checkCompliance = async (description: string) => {
    return callLegalAI('compliance_check', description);
  };

  const analyzeRisk = async (description: string) => {
    return callLegalAI('risk_analysis', description);
  };

  const suggestClauses = async (description: string, context?: string) => {
    return callLegalAI('clause_suggest', description, { context });
  };

  const reviewNDA = async (ndaContent: string) => {
    return callLegalAI('nda_review', ndaContent);
  };

  const disputeGuide = async (disputeDescription: string) => {
    return callLegalAI('dispute_guide', disputeDescription);
  };

  return {
    isLoading,
    legalChat,
    draftContract,
    checkCompliance,
    analyzeRisk,
    suggestClauses,
    reviewNDA,
    disputeGuide
  };
};
