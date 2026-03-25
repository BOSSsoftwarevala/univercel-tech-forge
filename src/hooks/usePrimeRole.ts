/**
 * Prime User Role Hook - Premium Experience without Power
 * 
 * Features:
 * - Route blocking for admin/finance paths
 * - Wallet view-only access
 * - Priority demos and extended duration
 * - Priority support SLA visibility
 * - Safe Assist consent control (can't start, only receive)
 * - VIP badge and tier information
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Forbidden routes for Prime User - ZERO admin access
const FORBIDDEN_ROUTES = [
  '/admin',
  '/super-admin',
  '/master',
  '/master-admin',
  '/finance',
  '/promise-management', // Can view but not manage
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
  '/safe-assist', // Admin routes
  '/assist-manager',
];

// Allowed routes for Prime User
const ALLOWED_ROUTES = [
  '/',
  '/auth',
  '/demos',
  '/products',
  '/demo',
  '/checkout',
  '/prime',
  '/prime-user',
  '/user-dashboard',
  '/pricing',
  '/sectors',
  '/demo-directory',
  '/settings',
  '/change-password',
  '/logout',
  '/promise-tracker', // View-only promises
];

interface PrimeProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  masked_email: string | null;
  tier: 'silver' | 'gold' | 'platinum' | 'enterprise';
  priority_level: number;
  dedicated_support: boolean;
  sla_hours: number;
  max_concurrent_tasks: number;
  is_active: boolean;
  created_at: string;
  upgraded_at: string | null;
  expires_at: string | null;
}

interface PrimeDemo {
  id: string;
  title: string;
  url: string;
  category: string;
  is_priority: boolean;
  extended_duration_minutes: number;
  is_early_access: boolean;
}

interface PrimeSLA {
  id: string;
  promise_type: string;
  status: string;
  sla_hours: number;
  deadline: string;
  display_status: string;
  created_at: string;
}

interface WalletTransaction {
  id: string;
  transaction_type: 'credit' | 'debit' | 'refund' | 'bonus' | 'cashback';
  amount: number;
  balance_after: number;
  description: string | null;
  created_at: string;
}

// Tier benefits configuration
const TIER_BENEFITS = {
  silver: {
    priority_level: 1,
    sla_hours: 24,
    demo_duration: 30, // minutes
    early_access: false,
    dedicated_support: false,
  },
  gold: {
    priority_level: 2,
    sla_hours: 12,
    demo_duration: 60,
    early_access: true,
    dedicated_support: true,
  },
  platinum: {
    priority_level: 3,
    sla_hours: 4,
    demo_duration: 120,
    early_access: true,
    dedicated_support: true,
  },
  enterprise: {
    priority_level: 4,
    sla_hours: 1,
    demo_duration: 999, // unlimited
    early_access: true,
    dedicated_support: true,
  },
};

export function usePrimeRole() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [blockedAttempts, setBlockedAttempts] = useState(0);
  const isPrime = (userRole as string) === 'prime';

  // Route blocking effect
  useEffect(() => {
    if (!isPrime || !user) return;

    const currentPath = location.pathname;
    const isBlocked = FORBIDDEN_ROUTES.some(route => 
      currentPath.startsWith(route)
    );

    if (isBlocked) {
      setBlockedAttempts(prev => prev + 1);
      
      // Log the blocked attempt
      supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'BLOCKED_ROUTE_ACCESS',
        module: 'prime_security',
        role: 'prime',
        meta_json: { route: currentPath },
      }).then(() => {
        toast.error('Access denied. Redirecting to your dashboard.');
        navigate('/prime', { replace: true });
      });
    }
  }, [location.pathname, isPrime, user, navigate]);

  // Check if route is allowed
  const isRouteAllowed = useCallback((path: string): boolean => {
    if (!isPrime) return true;
    
    const isBlocked = FORBIDDEN_ROUTES.some(route => 
      path.startsWith(route)
    );
    
    return !isBlocked;
  }, [isPrime]);

  return {
    isPrime,
    blockedAttempts,
    isRouteAllowed,
    forbiddenRoutes: FORBIDDEN_ROUTES,
    allowedRoutes: ALLOWED_ROUTES,
    tierBenefits: TIER_BENEFITS,
  };
}

// Hook for Prime Profile with tier info
export function usePrimeProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['prime-profile', user?.id],
    queryFn: async (): Promise<PrimeProfile | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('prime_user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      // Map to our interface with defaults
      return {
        id: data.id,
        user_id: data.user_id,
        email: data.email || '',
        full_name: data.full_name,
        masked_email: data.masked_email,
        tier: (data as any).tier || 'silver',
        priority_level: (data as any).priority_level || 1,
        dedicated_support: (data as any).dedicated_support || false,
        sla_hours: (data as any).sla_hours || 24,
        max_concurrent_tasks: (data as any).max_concurrent_tasks || 5,
        is_active: (data as any).is_active ?? true,
        created_at: data.created_at,
        upgraded_at: (data as any).upgraded_at,
        expires_at: (data as any).expires_at,
      };
    },
    enabled: !!user?.id,
  });
}

// Hook for Prime Demos - Priority first, extended duration
export function usePrimeDemos() {
  const { user } = useAuth();
  const { data: profile } = usePrimeProfile();

  return useQuery({
    queryKey: ['prime-demos', user?.id, profile?.tier],
    queryFn: async (): Promise<PrimeDemo[]> => {
      if (!user?.id) return [];

      // Get demos with priority sorting
      const { data, error } = await supabase
        .from('demos')
        .select('id, title, url, category, status')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add prime-specific fields
      const tier = profile?.tier || 'silver';
      const benefits = TIER_BENEFITS[tier];

      return (data || []).map((demo, index) => ({
        id: demo.id,
        title: demo.title || 'Untitled Demo',
        url: demo.url || '',
        category: demo.category || 'general',
        is_priority: index < 10, // Top 10 are priority for Prime
        extended_duration_minutes: benefits.demo_duration,
        is_early_access: benefits.early_access && index < 5,
      }));
    },
    enabled: !!user?.id,
  });
}

// Hook for Prime SLA Promises - READ ONLY
export function usePrimeSLAPromises() {
  const { user } = useAuth();
  const { data: profile } = usePrimeProfile();

  return useQuery({
    queryKey: ['prime-sla-promises', user?.id],
    queryFn: async (): Promise<PrimeSLA[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('promise_logs')
        .select('id, promise_type, status, deadline, created_at')
        .or(`linked_to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const slaHours = profile?.sla_hours || 24;

      return (data || []).map(p => ({
        id: p.id,
        promise_type: p.promise_type,
        status: p.status,
        sla_hours: slaHours,
        deadline: p.deadline || '',
        display_status: p.status === 'promised' ? 'Active' 
          : p.status === 'completed' ? 'Fulfilled'
          : p.status === 'breached' ? 'Overdue'
          : 'Pending',
        created_at: p.created_at,
      }));
    },
    enabled: !!user?.id,
  });
}

// Hook for Prime Wallet - VIEW ONLY (no withdraw, no edit)
export function usePrimeWallet() {
  const { user } = useAuth();

  const balanceQuery = useQuery({
    queryKey: ['prime-wallet-balance', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user?.id) return 0;

      const { data, error } = await supabase
        .from('prime_user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data) return 0;

      // Get balance from user_wallet_transactions if exists
      const { data: txData } = await supabase
        .from('user_wallet_transactions')
        .select('balance_after')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return txData?.balance_after || 0;
    },
    enabled: !!user?.id,
  });

  const transactionsQuery = useQuery({
    queryKey: ['prime-wallet-transactions', user?.id],
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
    // No withdraw or edit functions - VIEW ONLY
  };
}

// Hook for Prime Support Tickets with Priority
export function usePrimeSupportTickets() {
  const { user } = useAuth();
  const { data: profile } = usePrimeProfile();
  const queryClient = useQueryClient();

  const ticketsQuery = useQuery({
    queryKey: ['prime-support-tickets', user?.id],
    queryFn: async () => {
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

  // Create priority ticket (auto-elevated for Prime)
  const createPriorityTicket = useMutation({
    mutationFn: async (ticket: { 
      subject: string; 
      description: string; 
      category?: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      // Prime users automatically get high priority
      const { data, error } = await supabase
        .from('user_support_tickets')
        .insert({
          user_id: user.id,
          subject: `[PRIME] ${ticket.subject}`,
          description: ticket.description,
          category: ticket.category || 'general',
          priority: 'high', // Always high for Prime
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prime-support-tickets'] });
      toast.success('Priority support ticket created!');
    },
    onError: (error) => {
      toast.error(`Failed to create ticket: ${error.message}`);
    },
  });

  return {
    tickets: ticketsQuery.data ?? [],
    ticketsLoading: ticketsQuery.isLoading,
    createPriorityTicket,
    slaHours: profile?.sla_hours || 24,
  };
}

// Hook for Safe Assist - Prime can't start, only receive and consent
export function usePrimeSafeAssist() {
  const { user } = useAuth();
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pendingConsent, setPendingConsent] = useState(false);

  // Check for active or pending sessions
  useEffect(() => {
    if (!user?.id) return;

    const checkSession = async () => {
      const { data } = await supabase
        .from('safe_assist_sessions')
        .select('id, status, user_consent_given')
        .eq('user_id', user.id)
        .in('status', ['active', 'pending'])
        .maybeSingle();

      if (data) {
        setSessionId(data.id);
        if (data.status === 'pending' && !data.user_consent_given) {
          setPendingConsent(true);
          setHasActiveSession(false);
        } else if (data.status === 'active') {
          setHasActiveSession(true);
          setPendingConsent(false);
        }
      } else {
        setHasActiveSession(false);
        setPendingConsent(false);
        setSessionId(null);
      }
    };

    checkSession();

    // Real-time subscription
    const channel = supabase
      .channel('prime-safe-assist')
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

  // Give consent to pending session
  const giveConsent = useCallback(async () => {
    if (!sessionId) return false;

    const { error } = await supabase
      .from('safe_assist_sessions')
      .update({
        user_consent_given: true,
        status: 'active',
      })
      .eq('id', sessionId);

    if (error) {
      toast.error('Failed to give consent');
      return false;
    }

    toast.success('Safe Assist session started');
    setPendingConsent(false);
    setHasActiveSession(true);
    return true;
  }, [sessionId]);

  // Decline consent
  const declineConsent = useCallback(async () => {
    if (!sessionId) return;

    const { error } = await supabase
      .from('safe_assist_sessions')
      .update({
        status: 'cancelled',
        end_reason: 'user_declined',
        ended_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (error) {
      toast.error('Failed to decline');
    } else {
      toast.info('Safe Assist request declined');
      setPendingConsent(false);
      setSessionId(null);
    }
  }, [sessionId]);

  // End active session (always available to user)
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
    pendingConsent,
    sessionId,
    giveConsent,
    declineConsent,
    endSession,
    // Note: No createSession function - Prime cannot start assist
  };
}

// Main combined hook for Prime Dashboard
export function usePrimeDashboardData() {
  const profile = usePrimeProfile();
  const demos = usePrimeDemos();
  const slaPromises = usePrimeSLAPromises();
  const wallet = usePrimeWallet();
  const tickets = usePrimeSupportTickets();
  const safeAssist = usePrimeSafeAssist();
  const security = usePrimeRole();

  return {
    profile: profile.data,
    profileLoading: profile.isLoading,
    tier: profile.data?.tier || 'silver',
    tierBenefits: TIER_BENEFITS[profile.data?.tier || 'silver'],
    isPrimeActive: profile.data?.is_active ?? false,
    demos: demos.data ?? [],
    demosLoading: demos.isLoading,
    priorityDemos: (demos.data ?? []).filter(d => d.is_priority),
    earlyAccessDemos: (demos.data ?? []).filter(d => d.is_early_access),
    slaPromises: slaPromises.data ?? [],
    slaPromisesLoading: slaPromises.isLoading,
    walletBalance: wallet.balance,
    walletTransactions: wallet.transactions,
    walletLoading: wallet.balanceLoading || wallet.transactionsLoading,
    tickets: tickets.tickets,
    ticketsLoading: tickets.ticketsLoading,
    createPriorityTicket: tickets.createPriorityTicket,
    slaHours: tickets.slaHours,
    safeAssist,
    security,
  };
}

// Badge component helper
export function getPrimeBadgeInfo(tier: string) {
  const badges = {
    silver: { color: 'bg-gray-400', text: 'SILVER', icon: '🥈' },
    gold: { color: 'bg-amber-500', text: 'GOLD', icon: '🥇' },
    platinum: { color: 'bg-slate-300', text: 'PLATINUM', icon: '💎' },
    enterprise: { color: 'bg-purple-500', text: 'ENTERPRISE', icon: '👑' },
  };
  return badges[tier as keyof typeof badges] || badges.silver;
}
