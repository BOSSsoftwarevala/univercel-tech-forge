import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HRAIData {
  message?: string;
  [key: string]: any;
}

export const useHRAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callHRAI = async (
    type: string, 
    data: HRAIData
  ): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-hr-assistant', {
        body: { type, data }
      });

      if (error) {
        console.error('HR AI error:', error);
        toast.error('Failed to get AI response');
        return null;
      }

      return result.result;
    } catch (err) {
      console.error('HR AI exception:', err);
      toast.error('AI service temporarily unavailable');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const chat = async (message: string) => {
    return callHRAI('hr_chat', { message });
  };

  const screenResume = async (data: {
    position: string;
    requiredSkills?: string[];
    experienceRequired?: string;
    resumeSummary: string;
    candidateExperience: string;
  }) => {
    return callHRAI('screen_resume', data);
  };

  const generateJobDescription = async (data: {
    position: string;
    department: string;
    level?: string;
    skills?: string[];
    requirements?: string;
  }) => {
    return callHRAI('generate_jd', data);
  };

  const createOnboardingPlan = async (data: {
    name: string;
    position: string;
    department: string;
    startDate: string;
    manager?: string;
    notes?: string;
  }) => {
    return callHRAI('onboarding_plan', data);
  };

  const generateInterviewQuestions = async (data: {
    position: string;
    level?: string;
    skills?: string[];
    department: string;
    round?: string;
  }) => {
    return callHRAI('interview_questions', data);
  };

  const recommendTraining = async (data: {
    name: string;
    role: string;
    currentSkills?: string[];
    targetRole?: string;
    performanceAreas?: string;
    availableTime?: string;
  }) => {
    return callHRAI('training_recommend', data);
  };

  const draftPolicy = async (data: {
    policyType: string;
    audience?: string;
    keyPoints?: string;
    jurisdiction?: string;
  }) => {
    return callHRAI('policy_draft', data);
  };

  const analyzeEmployeeFeedback = async (data: {
    source?: string;
    department?: string;
    feedbackSummary: string;
    period?: string;
  }) => {
    return callHRAI('employee_feedback', data);
  };

  const analyzeExitInterview = async (data: {
    role: string;
    department: string;
    tenure: string;
    reason: string;
    feedbackSummary: string;
    destination?: string;
  }) => {
    return callHRAI('exit_analysis', data);
  };

  const createWorkforcePlan = async (data: {
    currentHeadcount: number;
    departments?: Record<string, number>;
    growthPlans?: string;
    budget?: string;
    timeline?: string;
  }) => {
    return callHRAI('workforce_plan', data);
  };

  return {
    isLoading,
    chat,
    screenResume,
    generateJobDescription,
    createOnboardingPlan,
    generateInterviewQuestions,
    recommendTraining,
    draftPolicy,
    analyzeEmployeeFeedback,
    analyzeExitInterview,
    createWorkforcePlan
  };
};
