/**
 * Zero-Trust Security Hook
 * 
 * Implements continuous verification for every action.
 * "Never trust, always verify" - even for authenticated users.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cryptoEngine } from '@/lib/crypto/CryptoEngine';
import { toast } from 'sonner';

interface ZeroTrustState {
  isVerified: boolean;
  riskScore: number;
  lastVerification: number;
  deviceFingerprint: string | null;
  sessionToken: string | null;
  anomaliesDetected: string[];
  requiredFactors: string[];
}

interface VerificationResult {
  allowed: boolean;
  riskScore: number;
  denialReason: string | null;
  requiredFactors: string[];
}

const VERIFICATION_INTERVAL = 5 * 60 * 1000; // Re-verify every 5 minutes
const HIGH_RISK_THRESHOLD = 0.5;
const CRITICAL_RISK_THRESHOLD = 0.8;

export function useZeroTrust() {
  const { user } = useAuth();
  const [state, setState] = useState<ZeroTrustState>({
    isVerified: false,
    riskScore: 0,
    lastVerification: 0,
    deviceFingerprint: null,
    sessionToken: null,
    anomaliesDetected: [],
    requiredFactors: []
  });

  // Initialize device fingerprint on mount
  useEffect(() => {
    const initFingerprint = async () => {
      const fingerprint = await cryptoEngine.generateDeviceFingerprint();
      setState(prev => ({ ...prev, deviceFingerprint: fingerprint }));
    };
    initFingerprint();
  }, []);

  // Periodic re-verification
  useEffect(() => {
    if (!user?.id || !state.deviceFingerprint) return;

    const interval = setInterval(async () => {
      if (Date.now() - state.lastVerification > VERIFICATION_INTERVAL) {
        await verifySession();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user?.id, state.deviceFingerprint, state.lastVerification]);

  /**
   * Get current IP address (client-side estimation)
   */
  const getIpAddress = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }, []);

  /**
   * Verify current session
   */
  const verifySession = useCallback(async (): Promise<boolean> => {
    if (!user?.id || !state.deviceFingerprint) return false;

    try {
      const ipAddress = await getIpAddress();
      
      const { data, error } = await supabase.rpc('zero_trust_verify', {
        p_user_id: user.id,
        p_action: 'session_check',
        p_device_fingerprint: state.deviceFingerprint,
        p_ip_address: ipAddress,
        p_geolocation: null
      });

      if (error) throw error;

      const rawResult = data?.[0];
      const result: VerificationResult = {
        allowed: rawResult?.allowed ?? false,
        riskScore: rawResult?.risk_score ?? 0,
        denialReason: rawResult?.denial_reason ?? null,
        requiredFactors: rawResult?.required_factors ?? []
      };
      
      setState(prev => ({
        ...prev,
        isVerified: result.allowed,
        riskScore: result.riskScore,
        lastVerification: Date.now(),
        requiredFactors: result.requiredFactors,
        anomaliesDetected: result.riskScore > 0 ? ['elevated_risk'] : []
      }));

      if (result.riskScore >= CRITICAL_RISK_THRESHOLD) {
        toast.error('Security Alert', {
          description: 'Unusual activity detected. Please verify your identity.'
        });
      }

      return result?.allowed ?? false;
    } catch (error) {
      console.error('Session verification failed:', error);
      return false;
    }
  }, [user?.id, state.deviceFingerprint, getIpAddress]);

  /**
   * Verify before performing a sensitive action
   */
  const verifyAction = useCallback(async (
    action: string,
    metadata?: Record<string, unknown>
  ): Promise<VerificationResult> => {
    if (!user?.id || !state.deviceFingerprint) {
      return {
        allowed: false,
        riskScore: 1,
        denialReason: 'Not authenticated',
        requiredFactors: ['authentication']
      };
    }

    try {
      const ipAddress = await getIpAddress();
      
      // Log action attempt to audit chain
      await supabase.rpc('add_to_audit_chain', {
        p_user_id: user.id,
        p_action_type: 'action_attempt',
        p_module: 'zero_trust',
        p_data: {
          action,
          device: state.deviceFingerprint,
          ip: ipAddress,
          ...metadata
        }
      });

      const { data, error } = await supabase.rpc('zero_trust_verify', {
        p_user_id: user.id,
        p_action: action,
        p_device_fingerprint: state.deviceFingerprint,
        p_ip_address: ipAddress,
        p_geolocation: null
      });

      if (error) throw error;

      const result = data?.[0];
      
      const verification: VerificationResult = {
        allowed: result?.allowed ?? false,
        riskScore: result?.risk_score ?? 0,
        denialReason: result?.denial_reason ?? null,
        requiredFactors: result?.required_factors ?? []
      };

      // Update state
      setState(prev => ({
        ...prev,
        riskScore: verification.riskScore,
        lastVerification: Date.now(),
        requiredFactors: verification.requiredFactors
      }));

      // Handle high-risk scenarios
      if (verification.riskScore >= HIGH_RISK_THRESHOLD) {
        if (verification.requiredFactors.includes('mfa_required')) {
          toast.warning('Additional Verification Required', {
            description: 'Please complete MFA to proceed with this action.'
          });
        }
      }

      if (!verification.allowed) {
        toast.error('Action Blocked', {
          description: verification.denialReason || 'Security policy prevented this action.'
        });
      }

      return verification;
    } catch (error) {
      console.error('Action verification failed:', error);
      return {
        allowed: false,
        riskScore: 1,
        denialReason: 'Verification system error',
        requiredFactors: []
      };
    }
  }, [user?.id, state.deviceFingerprint, getIpAddress]);

  /**
   * Issue a security token for sensitive operations
   */
  const issueSecurityToken = useCallback(async (
    tokenType: 'session' | 'action' | 'mfa',
    validityMinutes: number = 30
  ): Promise<string | null> => {
    if (!user?.id || !state.deviceFingerprint) return null;

    try {
      const { data, error } = await supabase.rpc('issue_security_token', {
        p_user_id: user.id,
        p_token_type: tokenType,
        p_device_fingerprint: state.deviceFingerprint,
        p_validity_minutes: validityMinutes,
        p_max_usage: tokenType === 'action' ? 1 : 100
      });

      if (error) throw error;

      const tokenHash = data?.[0]?.token_hash;
      if (tokenHash) {
        setState(prev => ({ ...prev, sessionToken: tokenHash }));
      }

      return tokenHash;
    } catch (error) {
      console.error('Failed to issue security token:', error);
      return null;
    }
  }, [user?.id, state.deviceFingerprint]);

  /**
   * Create a threat alert
   */
  const createThreatAlert = useCallback(async (
    threatLevel: 'critical' | 'high' | 'medium' | 'low',
    alertType: string,
    title: string,
    description: string,
    autoMitigate: boolean = false
  ): Promise<void> => {
    if (!user?.id) return;

    try {
      const ipAddress = await getIpAddress();
      
      await supabase.rpc('create_threat_alert', {
        p_threat_level: threatLevel,
        p_alert_type: alertType,
        p_title: title,
        p_description: description,
        p_affected_user_id: user.id,
        p_source_ip: ipAddress,
        p_device_fingerprint: state.deviceFingerprint,
        p_auto_mitigate: autoMitigate
      });

      if (autoMitigate) {
        toast.error('Security Action Taken', {
          description: 'Automatic security measures have been applied.'
        });
      }
    } catch (error) {
      console.error('Failed to create threat alert:', error);
    }
  }, [user?.id, state.deviceFingerprint, getIpAddress]);

  /**
   * Get risk level classification
   */
  const riskLevel = useMemo(() => {
    if (state.riskScore >= CRITICAL_RISK_THRESHOLD) return 'critical';
    if (state.riskScore >= HIGH_RISK_THRESHOLD) return 'high';
    if (state.riskScore > 0.2) return 'medium';
    return 'low';
  }, [state.riskScore]);

  /**
   * Check if action requires additional verification
   */
  const requiresAdditionalVerification = useCallback((action: string): boolean => {
    const sensitiveActions = [
      'withdrawal', 'role_change', 'system_config', 'data_export',
      'user_delete', 'wallet_modify', 'permission_grant'
    ];
    return sensitiveActions.includes(action) || state.riskScore >= HIGH_RISK_THRESHOLD;
  }, [state.riskScore]);

  return {
    // State
    isVerified: state.isVerified,
    riskScore: state.riskScore,
    riskLevel,
    deviceFingerprint: state.deviceFingerprint,
    sessionToken: state.sessionToken,
    anomaliesDetected: state.anomaliesDetected,
    requiredFactors: state.requiredFactors,
    lastVerification: state.lastVerification,
    
    // Actions
    verifySession,
    verifyAction,
    issueSecurityToken,
    createThreatAlert,
    requiresAdditionalVerification
  };
}

export default useZeroTrust;
