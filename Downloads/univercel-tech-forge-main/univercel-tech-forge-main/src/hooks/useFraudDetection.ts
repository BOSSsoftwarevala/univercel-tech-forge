import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DeviceInfo {
  fingerprint: string;
  browser: string;
  os: string;
  screenResolution: string;
  timezone: string;
  language: string;
}

interface FraudCheckResult {
  allowed: boolean;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  requires_2fa: boolean;
  action: 'allow' | 'review' | 'block';
  risk_factors?: string[];
}

// Simple device fingerprinting
function generateDeviceFingerprint(): DeviceInfo {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
  
  const fingerprint = btoa([
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    renderer,
    navigator.hardwareConcurrency || 0,
    navigator.platform,
  ].join('|')).slice(0, 32);

  return {
    fingerprint,
    browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
             navigator.userAgent.includes('Firefox') ? 'Firefox' :
             navigator.userAgent.includes('Safari') ? 'Safari' : 'Other',
    os: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
}

export function useFraudDetection() {
  const { user } = useAuth();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionInfo, setSuspensionInfo] = useState<any>(null);

  useEffect(() => {
    setDeviceInfo(generateDeviceFingerprint());
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const checkSuspension = async () => {
      const { data } = await supabase
        .from('account_suspensions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .or('expires_at.is.null,expires_at.gt.now()')
        .single();

      if (data) {
        setIsSuspended(true);
        setSuspensionInfo({
          reason: data.masked_reason,
          canAppeal: !data.appeal_submitted,
        });
      }
    };

    checkSuspension();
  }, [user]);

  const checkLoginRisk = useCallback(async (): Promise<FraudCheckResult | null> => {
    if (!deviceInfo) return null;

    try {
      const response = await supabase.functions.invoke('api-fraud', {
        body: {
          path: '/check-login',
          ip_address: await getIPAddress(),
          device_fingerprint: deviceInfo.fingerprint,
          device_info: deviceInfo,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Login risk check failed:', error);
      return { allowed: true, risk_score: 0, risk_level: 'low', requires_2fa: false, action: 'allow' };
    }
  }, [deviceInfo]);

  const checkTransactionRisk = useCallback(async (
    amount: number,
    transactionType: string,
    walletId?: string
  ): Promise<FraudCheckResult | null> => {
    try {
      const response = await supabase.functions.invoke('api-fraud', {
        body: {
          path: '/check-transaction',
          amount,
          transaction_type: transactionType,
          wallet_id: walletId,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Transaction risk check failed:', error);
      return { allowed: true, risk_score: 0, risk_level: 'low', requires_2fa: false, action: 'allow' };
    }
  }, []);

  const trackBehavior = useCallback(async (
    eventType: string,
    pageUrl: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await supabase.from('behavior_analytics').insert({
        user_id: user.id,
        event_type: eventType,
        page_url: pageUrl,
        mouse_velocity: metadata?.mouseVelocity,
        time_on_page: metadata?.timeOnPage,
        click_coordinates: metadata?.clicks,
      });
    } catch (error) {
      console.error('Behavior tracking failed:', error);
    }
  }, [user]);

  const submitAppeal = useCallback(async (appealText: string) => {
    if (!user || !suspensionInfo) return false;

    try {
      const { error } = await supabase
        .from('account_suspensions')
        .update({
          appeal_submitted: true,
          appeal_text: appealText,
          appeal_submitted_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!error) {
        setSuspensionInfo((prev: any) => ({ ...prev, canAppeal: false }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Appeal submission failed:', error);
      return false;
    }
  }, [user, suspensionInfo]);

  return {
    deviceInfo,
    isSuspended,
    suspensionInfo,
    checkLoginRisk,
    checkTransactionRisk,
    trackBehavior,
    submitAppeal,
  };
}

// Helper to get IP address
async function getIPAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}
