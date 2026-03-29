/**
 * User Role Hook - Security & Data for standard User role
 * 
 * Features:
 * - Route blocking for admin paths
 * - Wallet view-only access
 * - Support ticket management
 * - Promise visibility (status only)
 * - Safe Assist consent control
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Forbidden routes for User role - will be blocked
const FORBIDDEN_ROUTES = [
  '/admin',
  '/super-admin',
  '/master',
  '/master-admin',
  '/finance',
  '/promise-management',
  '/developer',
  '/franchise',
  '/reseller',
  '/influencer',
  '/security-command',
  '/server-manager',
  '/api-manager',
  '/marketing-manager',
  '/seo-manager',
  '/legal-manager',
  '/country-head',
  '/continent-super-admin',
  '/safe-assist', // Safe assist admin routes
  '/assist-manager',
];

// Allowed routes for User role
const ALLOWED_ROUTES = [
  '/',
  '/auth',
  '/demos',
  '/products',
  '/demo',
  '/checkout',
  '/user-dashboard',
  '/pricing',
  '/sectors',
  '/demo-directory',
  '/settings',
  '/change-password',
  '/logout',
  '/promise-tracker', // View-only promises
];

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  wallet_balance: number;
  total_purchases: number;
  total_spent: number;
  is_verified: boolean;
  referral_code: string | null;
  last_active_at: string | null;
  created_at: string;
}

interface UserPurchase {
  id: string;
  demo_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  access_granted_at: string | null;
  created_at: string;
  demo?: {
    title: string;
    url: string;
    category: string;
  };
}

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface WalletTransaction {
  id: string;
  transaction_type: 'credit' | 'debit' | 'refund' | 'bonus' | 'cashback';
  amount: number;
  balance_after: number;
  description: string | null;
  created_at: string;
}

interface PromiseStatus {
  id: string;
  promise_type: string;
  status: string;
  display_status: string;
  created_at: string;
  deadline: string | null;
}

export function useUserRole() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [blockedAttempts, setBlockedAttempts] = useState(0);
  const isUser = (userRole as string) === 'user';

  // Route blocking effect
  useEffect(() => {
    if (!isUser || !user) return;

    const currentPath = location.pathname;
    const isBlocked = FORBIDDEN_ROUTES.some(route => 
      currentPath.startsWith(route)
    );

    if (isBlocked) {
      setBlockedAttempts(prev => prev + 1);
      
      // Log the blocked attempt
      supabase.rpc('validate_user_route_access', {
        p_user_id: user.id,
        p_route: currentPath
      }).then(() => {
        toast.error('Access denied. Redirecting to your dashboard.');
        navigate('/user-dashboard', { replace: true });
      });
    }
  }, [location.pathname, isUser, user, navigate]);

  // Check if route is allowed
  const isRouteAllowed = useCallback((path: string): boolean => {
    if (!isUser) return true;
    
    const isBlocked = FORBIDDEN_ROUTES.some(route => 
      path.startsWith(route)
    );
    
    return !isBlocked;
  }, [isUser]);

  return {
    isUser,
    blockedAttempts,
    isRouteAllowed,
    forbiddenRoutes: FORBIDDEN_ROUTES,
    allowedRoutes: ALLOWED_ROUTES,
  };
}

// Hook for User Profile
export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

// Hook for User Purchases
export function useUserPurchases() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-purchases', user?.id],
    queryFn: async (): Promise<UserPurchase[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          *,
          demo:demos(title, url, category)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

// Hook for User Support Tickets
export function useUserSupportTickets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const ticketsQuery = useQuery({
    queryKey: ['user-support-tickets', user?.id],
    queryFn: async (): Promise<SupportTicket[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const createTicket = useMutation({
    mutationFn: async (ticket: { 
      subject: string; 
      description: string; 
      category?: string;
      priority?: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_support_tickets')
        .insert({
          user_id: user.id,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category || 'general',
          priority: ticket.priority || 'normal',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-support-tickets'] });
      toast.success('Support ticket created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create ticket: ${error.message}`);
    },
  });

  return {
    ...ticketsQuery,
    createTicket,
  };
}

// Hook for Wallet - VIEW ONLY
export function useUserWallet() {
  const { user } = useAuth();

  const balanceQuery = useQuery({
    queryKey: ['user-wallet-balance', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user?.id) return 0;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('wallet_balance')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.wallet_balance || 0;
    },
    enabled: !!user?.id,
  });

  const transactionsQuery = useQuery({
    queryKey: ['user-wallet-transactions', user?.id],
    queryFn: async (): Promise<WalletTransaction[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []).map(t => ({
        ...t,
        transaction_type: t.transaction_type as WalletTransaction['transaction_type'],
      }));
    },
    enabled: !!user?.id,
  });

  return {
    balance: balanceQuery.data ?? 0,
    balanceLoading: balanceQuery.isLoading,
    transactions: transactionsQuery.data ?? [],
    transactionsLoading: transactionsQuery.isLoading,
  };
}

// Hook for Promise Visibility - VIEW ONLY
export function useUserPromises() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-promises', user?.id],
    queryFn: async (): Promise<PromiseStatus[]> => {
      if (!user?.id) return [];

      // Users can only see promises related to their purchases
      const { data, error } = await supabase
        .from('promise_logs')
        .select('id, promise_type, status, created_at, deadline')
        .or(`linked_to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      return (data || []).map(p => ({
        ...p,
        display_status: p.status === 'promised' ? 'Active' 
          : p.status === 'completed' ? 'Fulfilled'
          : p.status === 'breached' ? 'Overdue'
          : 'Pending'
      }));
    },
    enabled: !!user?.id,
  });
}

// Hook for Safe Assist Consent Control
export function useSafeAssistConsent() {
  const { user } = useAuth();
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Check for active sessions
  useEffect(() => {
    if (!user?.id) return;

    const checkSession = async () => {
      const { data } = await supabase
        .from('safe_assist_sessions')
        .select('id, status')
        .eq('user_id', user.id)
        .in('status', ['active', 'pending'])
        .maybeSingle();

      if (data) {
        setHasActiveSession(true);
        setSessionId(data.id);
      } else {
        setHasActiveSession(false);
        setSessionId(null);
      }
    };

    checkSession();

    // Subscribe to changes
    const channel = supabase
      .channel('user-safe-assist')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'safe_assist_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => checkSession()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // End session (user always has this control)
  const endSession = useCallback(async () => {
    if (!sessionId) return;

    const { error } = await supabase
      .from('safe_assist_sessions')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString(),
        end_reason: 'user_terminated',
      })
      .eq('id', sessionId);

    if (error) {
      toast.error('Failed to end session');
    } else {
      toast.success('Safe Assist session ended');
      setHasActiveSession(false);
      setSessionId(null);
    }
  }, [sessionId]);

  return {
    hasActiveSession,
    sessionId,
    endSession,
  };
}

// Main combined hook for User Dashboard
export function useUserDashboardData() {
  const profile = useUserProfile();
  const purchases = useUserPurchases();
  const tickets = useUserSupportTickets();
  const wallet = useUserWallet();
  const promises = useUserPromises();
  const safeAssist = useSafeAssistConsent();
  const security = useUserRole();

  return {
    profile: profile.data,
    profileLoading: profile.isLoading,
    purchases: purchases.data ?? [],
    purchasesLoading: purchases.isLoading,
    tickets: tickets.data ?? [],
    ticketsLoading: tickets.isLoading,
    createTicket: tickets.createTicket,
    walletBalance: wallet.balance,
    walletTransactions: wallet.transactions,
    walletLoading: wallet.balanceLoading || wallet.transactionsLoading,
    promises: promises.data ?? [],
    promisesLoading: promises.isLoading,
    safeAssist,
    security,
  };
}
