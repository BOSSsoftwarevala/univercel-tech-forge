/**
 * Hook to generate SEO metadata for a product via AI
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GenerateSEOInput {
  productId?: string;
  productName: string;
  category?: string;
  type?: string;
  description?: string;
  features?: string[];
  price?: number;
}

interface SEOResult {
  slug: string;
  meta_title: string;
  meta_description: string;
  seo_keywords: string[];
  marketing_hashtags: string[];
  feature_tags: string[];
  short_description: string;
}

export function useProductSEO() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSEO = useCallback(async (input: GenerateSEOInput): Promise<SEOResult | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-product-seo', {
        body: input,
      });

      if (error) throw error;
      return data?.seo || null;
    } catch (err) {
      console.error('SEO generation failed:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateSEO, isGenerating };
}
