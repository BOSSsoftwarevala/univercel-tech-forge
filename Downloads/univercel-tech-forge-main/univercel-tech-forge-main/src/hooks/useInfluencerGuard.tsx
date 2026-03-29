import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// BLOCKED ROUTES - Influencer CANNOT access these
const BLOCKED_ROUTES = [
  '/admin',
  '/super-admin',
  '/master-admin',
  '/finance',
  '/demo-manager',
  '/server-manager',
  '/security-command',
  '/api-manager',
  '/marketing-manager',
  '/seo-manager',
  '/legal-manager',
  '/continent-super-admin',
  '/area-manager',
  '/bootstrap-admins',
  '/master-control',
];

// Status flow: pending → approved → active → suspended
export type InfluencerStatus = 'pending' | 'approved' | 'active' | 'suspended';

export interface InfluencerAccountData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  masked_email: string | null;
  status: InfluencerStatus;
  kyc_status: 'pending' | 'submitted' | 'verified' | 'rejected' | null;
  commission_tier: string | null;
  cpc_rate: number | null;
  cpl_rate: number | null;
  cpa_rate: number | null;
  fraud_score: number | null;
  is_suspended: boolean;
  suspension_reason: string | null;
  total_clicks: number;
  total_conversions: number;
  total_earned: number;
  created_at: string;
}

export interface InfluencerWalletData {
  id: string;
  influencer_id: string;
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
  total_penalties: number;
}

interface UseInfluencerGuardReturn {
  account: InfluencerAccountData | null;
  wallet: InfluencerWalletData | null;
  loading: boolean;
  canEarn: boolean;
  canPromote: boolean;
  canWithdraw: boolean;
  statusMessage: string;
  refreshAccount: () => Promise<void>;
  checkRouteAccess: (path: string) => boolean;
}

export const useInfluencerGuard = (): UseInfluencerGuardReturn => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [account, setAccount] = useState<InfluencerAccountData | null>(null);
  const [wallet, setWallet] = useState<InfluencerWalletData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if a route is blocked for influencers
  const checkRouteAccess = useCallback((path: string): boolean => {
    if (userRole !== 'influencer') return true;
    
    const isBlocked = BLOCKED_ROUTES.some(blocked => 
      path.toLowerCase().startsWith(blocked.toLowerCase())
    );
    
    if (isBlocked) {
      // Log unauthorized access attempt
      if (user?.id) {
        supabase.from('audit_logs').insert({
          user_id: user.id,
          role: 'influencer',
          module: 'security',
          action: 'blocked_route_attempt',
          meta_json: {
            attempted_path: path,
            timestamp: new Date().toISOString(),
            blocked: true
          }
        }).then(() => {});
      }
      return false;
    }
    return true;
  }, [userRole, user?.id]);

  // Redirect if on blocked route
  useEffect(() => {
    if (userRole === 'influencer' && !loading) {
      if (!checkRouteAccess(location.pathname)) {
        toast.error('Access Denied', {
          description: 'You do not have permission to access this area.'
        });
        navigate('/influencer', { replace: true });
      }
    }
  }, [location.pathname, userRole, loading, checkRouteAccess, navigate]);

  // Fetch influencer account and wallet data
  const fetchAccountData = useCallback(async () => {
    if (!user?.id || userRole !== 'influencer') {
      setLoading(false);
      return;
    }

    try {
      // Fetch account
      const { data: accountData, error: accountError } = await supabase
        .from('influencer_accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (accountError) throw accountError;

      if (accountData) {
        setAccount({
          id: accountData.id,
          user_id: accountData.user_id,
          full_name: accountData.full_name,
          email: accountData.email,
          masked_email: accountData.masked_email,
          status: (accountData.status || 'pending') as InfluencerStatus,
          kyc_status: (accountData.kyc_status as 'pending' | 'submitted' | 'verified' | 'rejected' | null) || null,
          commission_tier: accountData.commission_tier,
          cpc_rate: accountData.cpc_rate,
          cpl_rate: accountData.cpl_rate,
          cpa_rate: accountData.cpa_rate,
          fraud_score: accountData.fraud_score,
          is_suspended: accountData.is_suspended || false,
          suspension_reason: accountData.suspension_reason,
          total_clicks: accountData.total_clicks || 0,
          total_conversions: accountData.total_conversions || 0,
          total_earned: Number(accountData.total_earned) || 0,
          created_at: accountData.created_at,
        });

        // Fetch wallet
        const { data: walletData } = await supabase
          .from('influencer_wallet')
          .select('*')
          .eq('influencer_id', user.id)
          .maybeSingle();

        if (walletData) {
          setWallet({
            id: walletData.id,
            influencer_id: walletData.influencer_id,
            available_balance: Number(walletData.available_balance) || 0,
            pending_balance: Number(walletData.pending_balance) || 0,
            total_earned: Number(walletData.total_earned) || 0,
            total_withdrawn: Number(walletData.total_withdrawn) || 0,
            total_penalties: Number(walletData.total_penalties) || 0,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch influencer data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, userRole]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  // Derived permissions based on status
  const canEarn = account?.status === 'active' || account?.status === 'approved';
  const canPromote = account?.status === 'active' && !account?.is_suspended;
  const canWithdraw = 
    account?.status === 'active' && 
    !account?.is_suspended && 
    account?.kyc_status === 'verified' &&
    (wallet?.available_balance || 0) >= 1000; // Min payout ₹1000

  // Status message for UI
  const getStatusMessage = (): string => {
    if (!account) return 'Account not found';
    
    if (account.is_suspended) {
      return `Account suspended: ${account.suspension_reason || 'Contact support'}`;
    }
    
    switch (account.status) {
      case 'pending':
        return 'Your account is pending approval. You cannot earn commissions yet.';
      case 'approved':
        return 'Account approved! Complete your profile to start earning.';
      case 'active':
        if (account.kyc_status !== 'verified') {
          return 'Complete KYC verification to enable withdrawals.';
        }
        return 'Account active. You can promote and earn!';
      case 'suspended':
        return `Account suspended: ${account.suspension_reason || 'Contact support'}`;
      default:
        return 'Unknown status';
    }
  };

  return {
    account,
    wallet,
    loading,
    canEarn,
    canPromote,
    canWithdraw,
    statusMessage: getStatusMessage(),
    refreshAccount: fetchAccountData,
    checkRouteAccess,
  };
};

export default useInfluencerGuard;
