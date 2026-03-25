import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Feature {
  name: string;
  description: string;
  complexity: 'low' | 'medium' | 'high';
  estimatedHours: number;
  priority: 'core' | 'optional';
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  integrations: string[];
}

export interface Phase {
  name: string;
  duration: string;
  tasks: string[];
}

export interface Timeline {
  totalDays: number;
  phases: Phase[];
}

export interface EstimatedCost {
  development: number;
  infrastructure: number;
  maintenance: number;
  total: number;
  currency: string;
}

export interface Risk {
  risk: string;
  mitigation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RequirementAnalysis {
  projectName: string;
  category: string;
  summary: string;
  features: Feature[];
  techStack: TechStack;
  timeline: Timeline;
  estimatedCost: EstimatedCost;
  risks: Risk[];
  confidence: number;
}

export function useAutoDevEngine() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RequirementAnalysis | null>(null);

  const parseRequirement = async (requirement: string, projectType?: string): Promise<RequirementAnalysis | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('auto-dev-engine', {
        body: { action: 'parse_requirement', requirement, projectType }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze requirement');
      }

      setAnalysis(data.data);
      toast.success('Requirement analyzed successfully!');
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze requirement';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clarifyRequirement = async (requirement: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('auto-dev-engine', {
        body: { action: 'clarify_requirement', requirement }
      });

      if (fnError) throw new Error(fnError.message);
      if (!data.success) throw new Error(data.error);

      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clarify requirement';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    isLoading,
    error,
    analysis,
    parseRequirement,
    clarifyRequirement,
    reset
  };
}
