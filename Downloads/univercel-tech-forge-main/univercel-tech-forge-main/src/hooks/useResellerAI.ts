import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useResellerAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (action: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const { data: response, error: fnError } = await supabase.functions.invoke('ai-reseller-assistant', {
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

  const scoreLead = (data: any) => callAI('lead_scoring', data);
  const forecastSales = (data: any) => callAI('sales_forecast', data);
  const analyzeCompetitors = (data: any) => callAI('competitor_intel', data);
  const generatePitch = (data: any) => callAI('pitch_generator', data);
  const analyzeTerritory = (data: any) => callAI('territory_analyzer', data);
  const adviseRelationship = (data: any) => callAI('relationship_advisor', data);
  const optimizeCommission = (data: any) => callAI('commission_optimizer', data);
  const getMarketPulse = (data: any) => callAI('market_pulse', data);
  const chat = (message: string) => callAI('chat', { message });

  return {
    loading,
    error,
    scoreLead,
    forecastSales,
    analyzeCompetitors,
    generatePitch,
    analyzeTerritory,
    adviseRelationship,
    optimizeCommission,
    getMarketPulse,
    chat
  };
};
