/**
 * PUBLIC ACTION LOGGER HOOK
 * Logs all public-facing actions to audit_logs for Boss Panel visibility
 * 
 * Usage:
 *   const { logAction } = usePublicActionLogger();
 *   logAction('buy_now_click', { demo_id: '123', price: '$249' });
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ActionModule = 
  | 'public_site'
  | 'public_career'
  | 'public_demo'
  | 'public_checkout'
  | 'public_auth';

interface LogActionOptions {
  action: string;
  module?: ActionModule;
  metadata?: Record<string, unknown>;
}

const getSessionId = (): string => {
  let sessionId = localStorage.getItem('demo_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('demo_session_id', sessionId);
  }
  return sessionId;
};

export function usePublicActionLogger() {
  /**
   * Log a public action - fires immediately, no debounce
   * Boss Panel will see this action within 3 seconds
   */
  const logAction = useCallback(async (
    action: string,
    metadata?: Record<string, unknown>,
    module: ActionModule = 'public_site'
  ): Promise<boolean> => {
    try {
      const sessionId = getSessionId();
      
      const { error } = await supabase.from('audit_logs').insert({
        action,
        module,
        meta_json: {
          session_id: sessionId,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ...metadata,
        },
      });

      if (error) {
        console.error('[PUBLIC_AUDIT] Failed:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[PUBLIC_AUDIT] Exception:', err);
      return false;
    }
  }, []);

  /**
   * Pre-built action loggers for common actions
   */
  const logBuyNowClick = useCallback((demoId: string, demoName: string, price?: string) => 
    logAction('buy_now_click', { demo_id: demoId, demo_name: demoName, price }), [logAction]);

  const logLiveDemoClick = useCallback((demoId: string, demoName: string) => 
    logAction('live_demo_click', { demo_id: demoId, demo_name: demoName }), [logAction]);

  const logAddToCartClick = useCallback((demoId: string, demoName: string) => 
    logAction('add_to_cart_click', { demo_id: demoId, demo_name: demoName }), [logAction]);

  const logLoginClick = useCallback(() => 
    logAction('login_button_click', {}, 'public_auth'), [logAction]);

  const logApplyJobClick = useCallback((jobType?: string) => 
    logAction('apply_job_click', { job_type: jobType }, 'public_career'), [logAction]);

  const logApplyFranchiseClick = useCallback(() => 
    logAction('apply_franchise_click', {}, 'public_career'), [logAction]);

  const logApplyResellerClick = useCallback(() => 
    logAction('apply_reseller_click', {}, 'public_career'), [logAction]);

  const logBecomeInfluencerClick = useCallback(() => 
    logAction('become_influencer_click', {}, 'public_career'), [logAction]);

  const logJoinDeveloperClick = useCallback(() => 
    logAction('join_developer_click', {}, 'public_career'), [logAction]);

  const logBossPortalClick = useCallback(() => 
    logAction('boss_portal_click', {}, 'public_auth'), [logAction]);

  return {
    logAction,
    logBuyNowClick,
    logLiveDemoClick,
    logAddToCartClick,
    logLoginClick,
    logApplyJobClick,
    logApplyFranchiseClick,
    logApplyResellerClick,
    logBecomeInfluencerClick,
    logJoinDeveloperClick,
    logBossPortalClick,
  };
}

export default usePublicActionLogger;
