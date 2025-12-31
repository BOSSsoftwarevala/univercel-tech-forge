import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type FranchiseStatus = 'pending' | 'active' | 'suspended';

export interface FranchiseAccountData {
  id: string;
  user_id: string;
  franchise_code: string;
  business_name: string;
  owner_name: string;
  masked_email: string;
  status: FranchiseStatus;
  kyc_status: string;
  commission_rate: number;
  country: string;
  state: string;
  city: string;
  exclusive_rights: boolean;
  created_at: string;
}

export interface FranchiseTerritoryData {
  id: string;
  franchise_id: string;
  territory_name: string;
  territory_code: string;
  territory_type: string;
  is_exclusive: boolean;
  is_active: boolean;
}

export interface FranchiseWalletData {
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
}

// Routes blocked for franchise role
const BLOCKED_ROUTES = [
  '/admin',
  '/finance',
  '/pricing',
  '/master',
  '/super-admin',
  '/developer',
  '/sales',
  '/support',
  '/area-manager'
];

// Routes accessible by franchise
const ALLOWED_ROUTES = [
  '/franchise',
  '/franchise/dashboard',
  '/franchise/profile',
  '/franchise/wallet',
  '/franchise/lead-board',
  '/franchise/demo-request',
  '/franchise/demo-library',
  '/franchise/sales-center',
  '/franchise/performance',
  '/franchise/support-ticket',
  '/franchise/internal-chat',
  '/franchise/training-center',
  '/franchise/territory',
  '/franchise/partners',
  '/auth'
];

export function useFranchiseGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole, loading: authLoading } = useAuth();
  
  const [franchiseAccount, setFranchiseAccount] = useState<FranchiseAccountData | null>(null);
  const [territories, setTerritories] = useState<FranchiseTerritoryData[]>([]);
  const [wallet, setWallet] = useState<FranchiseWalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Route protection
  useEffect(() => {
    if (authLoading) return;

    const currentPath = location.pathname;
    
    // Check if trying to access blocked route
    const isBlocked = BLOCKED_ROUTES.some(route => currentPath.startsWith(route));
    
    if (isBlocked && userRole === 'franchise') {
      toast.error('Access Denied', {
        description: 'You do not have permission to access this area.'
      });
      navigate('/franchise/dashboard', { replace: true });
      return;
    }

    // Log blocked route attempt
    if (isBlocked && user?.id) {
      supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'blocked_route_attempt',
        module: 'franchise_guard',
        role: 'franchise',
        meta_json: { attempted_route: currentPath }
      }).then(() => {});
    }
  }, [location.pathname, userRole, authLoading, user, navigate]);

  // Fetch franchise account data
  useEffect(() => {
    const fetchFranchiseData = async () => {
      if (!user?.id || userRole !== 'franchise') {
        setLoading(false);
        return;
      }

      try {
        // Fetch franchise account
        const { data: accountData, error: accountError } = await supabase
          .from('franchise_accounts')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (accountError) throw accountError;
        
        if (accountData) {
          setFranchiseAccount({
            id: accountData.id,
            user_id: accountData.user_id,
            franchise_code: accountData.franchise_code,
            business_name: accountData.business_name || 'My Business',
            owner_name: accountData.owner_name || 'Owner',
            masked_email: accountData.masked_email || '***@***.com',
            status: (accountData.status as FranchiseStatus) || 'pending',
            kyc_status: accountData.kyc_status || 'pending',
            commission_rate: accountData.commission_rate || 10,
            country: accountData.country || 'India',
            state: accountData.state || '',
            city: accountData.city || '',
            exclusive_rights: accountData.exclusive_rights || false,
            created_at: accountData.created_at
          });

          // Fetch territories
          const { data: territoryData } = await supabase
            .from('franchise_territories')
            .select('*')
            .eq('franchise_id', accountData.id);

          if (territoryData) {
            setTerritories(territoryData.map(t => ({
              id: t.id,
              franchise_id: t.franchise_id,
              territory_name: t.territory_name,
              territory_code: t.territory_code || '',
              territory_type: t.territory_type || 'standard',
              is_exclusive: t.is_exclusive || false,
              is_active: t.is_active || true
            })));
          }

          // Fetch wallet data from ledger
          const { data: ledgerData } = await supabase
            .from('franchise_wallet_ledger')
            .select('amount, transaction_type, category')
            .eq('franchise_id', accountData.id);

          if (ledgerData) {
            const credits = ledgerData
              .filter(l => l.transaction_type === 'credit')
              .reduce((sum, l) => sum + Number(l.amount || 0), 0);
            const debits = ledgerData
              .filter(l => l.transaction_type === 'debit')
              .reduce((sum, l) => sum + Number(l.amount || 0), 0);

            // Fetch pending commissions
            const { data: pendingCommissions } = await supabase
              .from('franchise_commissions')
              .select('commission_amount, status')
              .eq('franchise_id', accountData.id)
              .eq('status', 'pending');

            const pendingAmount = (pendingCommissions || [])
              .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);

            setWallet({
              available_balance: credits - debits,
              pending_balance: pendingAmount,
              total_earned: credits,
              total_withdrawn: debits
            });
          }
        }
      } catch (err: any) {
        console.error('Error fetching franchise data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchiseData();
  }, [user?.id, userRole]);

  // Check if franchise can perform actions
  const canSubmitLeads = franchiseAccount?.status === 'active';
  const canAssignPartners = franchiseAccount?.status === 'active';
  const canRequestWithdrawal = franchiseAccount?.status === 'active' && 
    franchiseAccount?.kyc_status === 'verified' &&
    (wallet?.available_balance || 0) >= 1000;
  const canViewDemos = franchiseAccount?.status !== 'suspended';

  // Get primary territory
  const primaryTerritory = territories.find(t => t.is_exclusive) || territories[0] || null;

  return {
    franchiseAccount,
    territories,
    primaryTerritory,
    wallet,
    loading: loading || authLoading,
    error,
    status: franchiseAccount?.status || 'pending',
    isActive: franchiseAccount?.status === 'active',
    isPending: franchiseAccount?.status === 'pending',
    isSuspended: franchiseAccount?.status === 'suspended',
    isKYCVerified: franchiseAccount?.kyc_status === 'verified',
    canSubmitLeads,
    canAssignPartners,
    canRequestWithdrawal,
    canViewDemos,
    blockedRoutes: BLOCKED_ROUTES,
    allowedRoutes: ALLOWED_ROUTES
  };
}
