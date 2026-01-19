import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Reseller status flow: Pending → Active → Suspended
export type ResellerStatus = 'pending' | 'active' | 'suspended';

export interface ResellerAccountData {
  id: string;
  user_id: string;
  reseller_code: string;
  status: ResellerStatus;
  kyc_verified: boolean;
  commission_tier: string;
  total_leads: number;
  converted_leads: number;
  total_earnings: number;
  masked_email: string;
}

export interface ResellerWalletData {
  id: string;
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
  min_payout: number;
}

// Blocked routes for reseller role - SECURITY CRITICAL
const BLOCKED_ROUTES = [
  '/admin',
  '/super-admin',
  '/finance',
  '/pricing',
  '/master-control',
  '/demo-manager',
  '/api-manager',
  '/security-command',
  '/vala-control'
];

export const useResellerGuard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [resellerAccount, setResellerAccount] = useState<ResellerAccountData | null>(null);
  const [wallet, setWallet] = useState<ResellerWalletData | null>(null);

  // Check if current route is blocked
  const isBlockedRoute = useCallback((path: string) => {
    return BLOCKED_ROUTES.some(blocked => path.startsWith(blocked));
  }, []);

  // Log security event
  const logSecurityEvent = useCallback(async (action: string, details: Record<string, any>) => {
    if (!user) return;
    
    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action,
        module: 'reseller_security',
        role: 'reseller',
        meta_json: {
          ...details,
          timestamp: new Date().toISOString(),
          path: location.pathname
        }
      });
    } catch (error) {
      console.error('Failed to log security event');
    }
  }, [user, location.pathname]);

  // Fetch reseller account data
  const fetchResellerData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch reseller account - use maybeSingle for robustness
      const { data: accountData, error: accountError } = await supabase
        .from('reseller_accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (accountError) throw accountError;

      if (accountData) {
        const account: ResellerAccountData = {
          id: accountData.id,
          user_id: accountData.user_id,
          reseller_code: accountData.reseller_code || `RS-${accountData.id.slice(0, 6).toUpperCase()}`,
          status: (accountData.status as ResellerStatus) || 'pending',
          kyc_verified: accountData.kyc_status === 'verified',
          commission_tier: `${accountData.commission_rate || 20}%`,
          total_leads: 0, // Will be calculated separately
          converted_leads: 0,
          total_earnings: 0,
          masked_email: accountData.masked_email || '***@***.com'
        };
        setResellerAccount(account);

        // Fetch wallet data - use maybeSingle for robustness
        const { data: walletData } = await supabase
          .from('reseller_wallet')
          .select('*')
          .eq('reseller_id', accountData.id)
          .maybeSingle();

        if (walletData) {
          setWallet({
            id: walletData.id,
            available_balance: walletData.available_balance || 0,
            pending_balance: walletData.pending_balance || 0,
            total_earned: walletData.total_earned || 0,
            total_withdrawn: walletData.total_withdrawn || 0,
            min_payout: 1000 // Minimum payout amount
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch reseller data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Route protection effect
  useEffect(() => {
    if (isBlockedRoute(location.pathname)) {
      logSecurityEvent('BLOCKED_ROUTE_ACCESS_ATTEMPT', {
        attempted_path: location.pathname,
        severity: 'high'
      });
      toast.error('Access denied: This area is restricted');
      navigate('/reseller/dashboard');
    }
  }, [location.pathname, isBlockedRoute, logSecurityEvent, navigate]);

  // Fetch data on mount
  useEffect(() => {
    fetchResellerData();
  }, [fetchResellerData]);

  // Permission checks based on status
  const canSubmitLeads = resellerAccount?.status === 'active';
  const canWithdraw = resellerAccount?.status === 'active' && 
                      resellerAccount?.kyc_verified && 
                      (wallet?.available_balance || 0) >= (wallet?.min_payout || 1000);
  const isBlocked = resellerAccount?.status === 'suspended';
  const isPending = resellerAccount?.status === 'pending';

  return {
    loading,
    resellerAccount,
    wallet,
    canSubmitLeads,
    canWithdraw,
    isBlocked,
    isPending,
    refetch: fetchResellerData,
    logSecurityEvent
  };
};
