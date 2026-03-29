import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RnDData {
  message?: string;
  context?: string;
  title?: string;
  description?: string;
  category?: string;
  author?: string;
  trend?: string;
  industry?: string;
  status?: string;
  project?: string;
  goal?: string;
  techStack?: string;
  timeline?: string;
  initiative?: string;
  currentState?: string;
  proposedChanges?: string;
  focusArea?: string;
  competitors?: string;
  strengths?: string;
  projectType?: string;
  requirements?: string;
  scale?: string;
  teamExpertise?: string;
  topic?: string;
  sources?: string;
  timePeriod?: string;
  problemSpace?: string;
  constraints?: string;
  targetUsers?: string;
  innovationLevel?: string;
  technologyArea?: string;
  keyFeatures?: string;
  targetMarket?: string;
  risks?: string;
  stage?: string;
  teamSize?: string;
  projects?: string;
  budget?: string;
  priorities?: string;
  opportunity?: string;
  strategicFit?: string;
  resources?: string;
  domain?: string;
  timeHorizon?: string;
  focusAreas?: string;
  hypothesis?: string;
  variables?: string;
  successCriteria?: string;
}

export const useRnDAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callRnDAI = async (type: string, data: RnDData): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-rnd-assistant', {
        body: { type, data }
      });

      if (error) {
        console.error('R&D AI error:', error);
        toast.error('Failed to get AI response');
        return null;
      }

      if (result?.error) {
        toast.error(result.error);
        return null;
      }

      return result?.result || null;
    } catch (error) {
      console.error('R&D AI error:', error);
      toast.error('An error occurred while processing your request');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Chat with AI
  const chat = (message: string, context?: string) => 
    callRnDAI('chat', { message, context });

  // Evaluate an R&D idea
  const evaluateIdea = (title: string, description: string, category: string, author?: string) =>
    callRnDAI('idea_evaluation', { title, description, category, author });

  // Analyze a trend
  const analyzeTrend = (trend: string, industry?: string, status?: string) =>
    callRnDAI('trend_analysis', { trend, industry, status });

  // Create prototype plan
  const createPrototypePlan = (project: string, goal: string, techStack?: string, timeline?: string) =>
    callRnDAI('prototype_plan', { project, goal, techStack, timeline });

  // Assess impact
  const assessImpact = (initiative: string, currentState: string, proposedChanges: string) =>
    callRnDAI('impact_assessment', { initiative, currentState, proposedChanges });

  // Analyze competitors
  const analyzeCompetitors = (focusArea: string, competitors?: string, strengths?: string) =>
    callRnDAI('competitor_analysis', { focusArea, competitors, strengths });

  // Recommend tech stack
  const recommendTechStack = (projectType: string, requirements: string, scale?: string, teamExpertise?: string) =>
    callRnDAI('tech_stack_recommendation', { projectType, requirements, scale, teamExpertise });

  // Synthesize research
  const synthesizeResearch = (topic: string, sources?: string, timePeriod?: string) =>
    callRnDAI('research_synthesis', { topic, sources, timePeriod });

  // Innovation brainstorm
  const brainstormInnovation = (problemSpace: string, constraints?: string, targetUsers?: string, innovationLevel?: string) =>
    callRnDAI('innovation_brainstorm', { problemSpace, constraints, targetUsers, innovationLevel });

  // Analyze patent landscape
  const analyzePatentLandscape = (technologyArea: string, keyFeatures?: string, targetMarket?: string) =>
    callRnDAI('patent_landscape', { technologyArea, keyFeatures, targetMarket });

  // Risk mitigation strategy
  const developRiskMitigation = (project: string, risks?: string, stage?: string) =>
    callRnDAI('risk_mitigation', { project, risks, stage });

  // Optimize resources
  const optimizeResources = (teamSize?: string, projects?: string, budget?: string, priorities?: string) =>
    callRnDAI('resource_optimization', { teamSize, projects, budget, priorities });

  // Auto-generate proposal
  const autoGenerateProposal = (opportunity: string, strategicFit?: string, resources?: string) =>
    callRnDAI('auto_proposal', { opportunity, strategicFit, resources });

  // Create technology radar
  const createTechnologyRadar = (domain?: string, timeHorizon?: string, focusAreas?: string) =>
    callRnDAI('technology_radar', { domain, timeHorizon, focusAreas });

  // Design experiment
  const designExperiment = (hypothesis: string, variables?: string, successCriteria?: string) =>
    callRnDAI('experiment_design', { hypothesis, variables, successCriteria });

  return {
    isLoading,
    chat,
    evaluateIdea,
    analyzeTrend,
    createPrototypePlan,
    assessImpact,
    analyzeCompetitors,
    recommendTechStack,
    synthesizeResearch,
    brainstormInnovation,
    analyzePatentLandscape,
    developRiskMitigation,
    optimizeResources,
    autoGenerateProposal,
    createTechnologyRadar,
    designExperiment
  };
};
