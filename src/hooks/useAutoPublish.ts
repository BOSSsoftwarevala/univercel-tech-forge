/**
 * Auto-Publish Hook
 * Triggers the auto-publish-product pipeline after VALA AI generates a product
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AutoPublishInput {
  productName: string;
  description: string;
  category: string;
  type: string;
  price: number;
  features: string[];
  techStack: string[];
  githubRepoUrl?: string;
  buildOutput?: string;
}

export interface AutoPublishResult {
  success: boolean;
  productId?: string;
  demoDomain?: string;
  listingStatus?: string;
  imageUrl?: string;
  deployStatus?: string;
  steps?: { step: string; status: string; detail?: string }[];
  message?: string;
  error?: string;
}

export function useAutoPublish() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastResult, setLastResult] = useState<AutoPublishResult | null>(null);

  const publish = useCallback(async (input: AutoPublishInput): Promise<AutoPublishResult> => {
    setIsPublishing(true);
    setLastResult(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase.functions.invoke('auto-publish-product', {
        body: { ...input, userId: user.id },
      });

      if (error) throw error;

      const result = data as AutoPublishResult;
      setLastResult(result);

      if (result.success) {
        toast.success(`"${input.productName}" submitted for review`, {
          description: `Demo domain: ${result.demoDomain}`,
          duration: 5000,
        });
      } else {
        toast.error('Publishing failed', { description: result.error });
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Publishing failed';
      const result: AutoPublishResult = { success: false, error: errorMsg };
      setLastResult(result);
      toast.error('Auto-publish failed', { description: errorMsg });
      return result;
    } finally {
      setIsPublishing(false);
    }
  }, []);

  return { publish, isPublishing, lastResult };
}
