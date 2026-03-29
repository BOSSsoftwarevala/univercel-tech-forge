import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PerformanceData {
  name?: string;
  role?: string;
  score?: number;
  metrics?: Record<string, number>;
  message?: string;
  [key: string]: any;
}

export const usePerformanceAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callPerformanceAI = async (
    type: string, 
    data: PerformanceData
  ): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-performance-coach', {
        body: { type, data }
      });

      if (error) {
        console.error('Performance AI error:', error);
        toast.error('Failed to get AI response');
        return null;
      }

      return result.result;
    } catch (err) {
      console.error('Performance AI exception:', err);
      toast.error('AI service temporarily unavailable');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const chat = async (message: string) => {
    return callPerformanceAI('performance_chat', { message });
  };

  const analyzeIndividual = async (data: {
    name: string;
    role: string;
    score: number;
    metrics: Record<string, number>;
    recentActivity?: string;
  }) => {
    return callPerformanceAI('analyze_individual', data);
  };

  const analyzeTeam = async (data: {
    teamSize: number;
    avgScore: number;
    members: Array<{ name: string; role: string; score: number }>;
    trends?: string;
  }) => {
    return callPerformanceAI('analyze_team', data);
  };

  const generateGoals = async (data: {
    name: string;
    role: string;
    metrics: Record<string, number>;
    focusAreas?: string;
  }) => {
    return callPerformanceAI('generate_goals', data);
  };

  const createCoachingPlan = async (data: {
    name: string;
    role: string;
    issues: string;
    score: number;
    goal?: string;
  }) => {
    return callPerformanceAI('coaching_plan', data);
  };

  const predictRisk = async (data: {
    name: string;
    role: string;
    scoreTrend: string;
    flags?: string[];
    attendance?: string;
    recentChanges?: string;
  }) => {
    return callPerformanceAI('predict_risk', data);
  };

  const recommendIncentive = async (data: {
    name: string;
    role: string;
    achievement: string;
    score: number;
    pastRewards?: string;
  }) => {
    return callPerformanceAI('incentive_recommend', data);
  };

  const compareBenchmark = async (data: {
    role: string;
    metrics: Record<string, number>;
    industry?: string;
    region?: string;
  }) => {
    return callPerformanceAI('compare_benchmark', data);
  };

  const generateWeeklyReport = async (data: {
    teamData: Array<{ name: string; role: string; score: number }>;
    period?: string;
    prevScore?: number;
  }) => {
    return callPerformanceAI('weekly_report', data);
  };

  return {
    isLoading,
    chat,
    analyzeIndividual,
    analyzeTeam,
    generateGoals,
    createCoachingPlan,
    predictRisk,
    recommendIncentive,
    compareBenchmark,
    generateWeeklyReport
  };
};
