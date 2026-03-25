import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ClientData {
  clientName?: string;
  message?: string;
  documentType?: string;
  details?: string;
  status?: string;
  documentDetails?: string;
  previousStatus?: string;
  accountType?: string;
  duration?: string;
  purpose?: string;
  previousFeedback?: string;
  interviewType?: string;
  responses?: string;
  engagement?: string;
  supportTickets?: string;
  featureAdoption?: string;
  paymentHistory?: string;
  communication?: string;
  behavior?: string;
  engagementTrend?: string;
  recentIssues?: string;
  contractEnd?: string;
  currentPlan?: string;
  usagePatterns?: string;
  teamSize?: string;
  businessType?: string;
  clientMessage?: string;
  context?: string;
  tone?: string;
  urgency?: string;
  accountSize?: string;
  onboardingStatus?: string;
  goals?: string;
  timeline?: string;
  communications?: string;
  history?: string;
  issue?: string;
  severity?: string;
  previousActions?: string;
  renewalDate?: string;
  healthScore?: string;
  riskFactors?: string;
  expansionPotential?: string;
}

export const useClientSuccessAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callClientSuccessAI = async (
    type: string,
    data: ClientData
  ): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('ai-client-success', {
        body: { type, data }
      });

      if (error) {
        console.error('Client Success AI error:', error);
        toast.error('Failed to get AI response');
        return null;
      }

      return responseData.result;
    } catch (err) {
      console.error('Client Success AI exception:', err);
      toast.error('AI service temporarily unavailable');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const chat = async (message: string) => {
    return callClientSuccessAI('client_chat', { message });
  };

  const analyzeKYC = async (clientName: string, documentType: string, details: string, status: string) => {
    return callClientSuccessAI('kyc_analyze', { clientName, documentType, details, status });
  };

  const verifyKYC = async (documentType: string, clientName: string, documentDetails: string, previousStatus?: string) => {
    return callClientSuccessAI('kyc_verify', { documentType, clientName, documentDetails, previousStatus });
  };

  const generateInterviewQuestions = async (
    clientName: string,
    accountType?: string,
    duration?: string,
    purpose?: string,
    previousFeedback?: string
  ) => {
    return callClientSuccessAI('auto_interview', { 
      clientName, accountType, duration, purpose, previousFeedback 
    });
  };

  const analyzeInterviewResponses = async (
    clientName: string,
    interviewType: string,
    responses: string
  ) => {
    return callClientSuccessAI('interview_analyze', { clientName, interviewType, responses });
  };

  const calculateHealthScore = async (
    clientName: string,
    engagement?: string,
    supportTickets?: string,
    featureAdoption?: string,
    paymentHistory?: string,
    communication?: string
  ) => {
    return callClientSuccessAI('health_score', {
      clientName, engagement, supportTickets, featureAdoption, paymentHistory, communication
    });
  };

  const predictChurn = async (
    clientName: string,
    behavior?: string,
    engagementTrend?: string,
    recentIssues?: string,
    contractEnd?: string
  ) => {
    return callClientSuccessAI('churn_predict', {
      clientName, behavior, engagementTrend, recentIssues, contractEnd
    });
  };

  const identifyUpsell = async (
    clientName: string,
    currentPlan?: string,
    usagePatterns?: string,
    teamSize?: string,
    businessType?: string
  ) => {
    return callClientSuccessAI('upsell_identify', {
      clientName, currentPlan, usagePatterns, teamSize, businessType
    });
  };

  const craftResponse = async (
    clientMessage: string,
    context?: string,
    tone?: string,
    urgency?: string
  ) => {
    return callClientSuccessAI('response_craft', { clientMessage, context, tone, urgency });
  };

  const createSuccessPlan = async (
    clientName: string,
    accountSize?: string,
    onboardingStatus?: string,
    goals?: string,
    timeline?: string
  ) => {
    return callClientSuccessAI('success_plan', {
      clientName, accountSize, onboardingStatus, goals, timeline
    });
  };

  const deepSentimentAnalysis = async (
    clientName: string,
    communications?: string,
    history?: string,
    status?: string
  ) => {
    return callClientSuccessAI('sentiment_deep', { clientName, communications, history, status });
  };

  const getEscalationGuide = async (
    issue: string,
    clientName: string,
    severity?: string,
    status?: string,
    previousActions?: string
  ) => {
    return callClientSuccessAI('escalation_guide', {
      issue, clientName, severity, status, previousActions
    });
  };

  const createRenewalStrategy = async (
    clientName: string,
    renewalDate?: string,
    healthScore?: string,
    riskFactors?: string,
    expansionPotential?: string
  ) => {
    return callClientSuccessAI('renewal_strategy', {
      clientName, renewalDate, healthScore, riskFactors, expansionPotential
    });
  };

  return {
    isLoading,
    chat,
    analyzeKYC,
    verifyKYC,
    generateInterviewQuestions,
    analyzeInterviewResponses,
    calculateHealthScore,
    predictChurn,
    identifyUpsell,
    craftResponse,
    createSuccessPlan,
    deepSentimentAnalysis,
    getEscalationGuide,
    createRenewalStrategy
  };
};
