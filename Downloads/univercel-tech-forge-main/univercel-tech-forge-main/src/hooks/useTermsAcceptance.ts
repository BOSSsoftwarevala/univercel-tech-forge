/**
 * Hook to check and manage terms acceptance for roles
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTermsAcceptance = (role: string | null) => {
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAcceptance = async () => {
      if (!role) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setHasAccepted(false);
          setIsLoading(false);
          return;
        }

        // Check audit_logs for terms acceptance
        const { data, error } = await supabase
          .from('audit_logs')
          .select('id')
          .eq('user_id', user.id)
          .eq('action', 'terms_accepted')
          .eq('module', 'security')
          .limit(1);

        if (error) {
          console.error('Error checking terms acceptance:', error);
          setHasAccepted(false);
        } else {
          setHasAccepted(data && data.length > 0);
        }
      } catch (error) {
        console.error('Error in useTermsAcceptance:', error);
        setHasAccepted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAcceptance();
  }, [role]);

  const refreshAcceptance = async () => {
    setIsLoading(true);
    if (!role) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('audit_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('action', 'terms_accepted')
        .eq('module', 'security')
        .limit(1);

      setHasAccepted(data && data.length > 0);
    } finally {
      setIsLoading(false);
    }
  };

  return { hasAccepted, isLoading, refreshAcceptance };
};
