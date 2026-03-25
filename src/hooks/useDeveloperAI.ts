import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PortfolioData {
  skills: string[];
  experience: string;
  projectCount: number;
  technologies: string[];
  rating: number;
  specialization: string;
}

interface SkillAssessmentData {
  taskHistory: any[];
  qualityScore: number;
  onTimeRate: number;
  technologies: string[];
  bugRate: number;
}

interface TaskOptimizerData {
  taskTitle: string;
  taskDescription: string;
  complexity: string;
  technologies: string[];
  deadline: string;
  pastTasks: any[];
}

interface EarningsForecastData {
  currentEarnings: number;
  completionRate: number;
  avgTaskValue: number;
  activeHours: number;
  skillLevel: string;
}

interface ProductivityCoachData {
  workHours: number;
  peakTime: string;
  distractions: string[];
  productivityScore: number;
  goal: string;
}

export const useDeveloperAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (action: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const { data: response, error: fnError } = await supabase.functions.invoke('ai-developer-assistant', {
        body: { action, data }
      });

      if (fnError) throw fnError;
      if (!response?.success) throw new Error(response?.error || 'AI request failed');

      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI service error';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buildPortfolio = (data: PortfolioData) => callAI('portfolio_builder', data);
  const assessSkills = (data: SkillAssessmentData) => callAI('skill_assessment', data);
  const optimizeTask = (data: TaskOptimizerData) => callAI('task_optimizer', data);
  const forecastEarnings = (data: EarningsForecastData) => callAI('earnings_forecast', data);
  const getProductivityTips = (data: ProductivityCoachData) => callAI('productivity_coach', data);
  const chat = (message: string) => callAI('chat', { message });
  const prepareInterview = (data: any) => callAI('interview_prep', data);
  const smartSchedule = (data: any) => callAI('smart_scheduler', data);
  const prepareCodeReview = (data: any) => callAI('code_review_prep', data);

  return {
    loading,
    error,
    buildPortfolio,
    assessSkills,
    optimizeTask,
    forecastEarnings,
    getProductivityTips,
    chat,
    prepareInterview,
    smartSchedule,
    prepareCodeReview
  };
};
