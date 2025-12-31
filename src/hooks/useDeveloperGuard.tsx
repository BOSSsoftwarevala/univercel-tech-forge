import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Blocked routes for developers - ZERO POWER principle
const BLOCKED_ROUTES = [
  '/admin',
  '/super-admin',
  '/master-admin',
  '/finance',
  '/wallet',
  '/pricing',
  '/demo-control',
  '/user-management',
  '/settings/admin',
  '/settings/system',
];

export type DeveloperStatus = 'pending' | 'active' | 'suspended' | 'verified';

export interface DeveloperProfile {
  id: string;
  user_id: string;
  developer_id: string;
  full_name_masked: string;
  status: DeveloperStatus;
  expertise_level: string;
  primary_skills: string[];
  performance_score: number;
  sla_compliance_rate: number;
  total_tasks_completed: number;
  total_tasks_assigned: number;
  current_active_tasks: number;
  created_at: string;
}

export interface DeveloperTask {
  id: string;
  task_id: string;
  title: string;
  description: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'accepted' | 'in_progress' | 'blocked' | 'completed' | 'review';
  deadline: string;
  sla_hours: number;
  sla_remaining_minutes: number | null;
  sla_breached: boolean;
  promise_id: string | null;
  created_at: string;
  updated_at: string;
  category: string | null;
  tech_stack: string[];
}

export function useDeveloperGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<string | null>(null);

  useEffect(() => {
    const checkDeveloperAccess = async () => {
      try {
        // Check if current route is blocked
        const currentPath = location.pathname.toLowerCase();
        const isBlockedRoute = BLOCKED_ROUTES.some(route => 
          currentPath.startsWith(route.toLowerCase())
        );

        if (isBlockedRoute) {
          setIsBlocked(true);
          setBlockReason('Access denied. Developers cannot access this area.');
          
          // Log security violation
          await supabase.from('audit_logs').insert({
            action: 'BLOCKED_ROUTE_ACCESS_ATTEMPT',
            module: 'developer_security',
            meta_json: {
              attempted_route: currentPath,
              blocked_at: new Date().toISOString(),
            }
          });

          toast.error('Access Denied', {
            description: 'You do not have permission to access this area.'
          });

          // Redirect to developer dashboard
          navigate('/developer/secure-dashboard', { replace: true });
          return;
        }

        // Check user authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth', { replace: true });
          return;
        }

        // Check if user has developer role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role, approval_status')
          .eq('user_id', user.id)
          .eq('role', 'developer')
          .single();

        if (!roleData || roleData.approval_status !== 'approved') {
          toast.error('Developer access not approved');
          navigate('/auth', { replace: true });
          return;
        }

        // Fetch developer profile from registrations
        const { data: regData } = await supabase
          .from('developer_registrations')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (regData) {
          // Generate masked developer ID
          const devId = `DEV***${user.id.slice(-4).toUpperCase()}`;
          
          setDeveloperProfile({
            id: regData.id,
            user_id: user.id,
            developer_id: devId,
            full_name_masked: regData.full_name ? `${regData.full_name.charAt(0)}***${regData.full_name.slice(-2)}` : devId,
            status: regData.status === 'verified' ? 'active' : regData.status as DeveloperStatus,
            expertise_level: regData.expertise_level || 'junior',
            primary_skills: regData.primary_skills || [],
            performance_score: 85, // Default mock score
            sla_compliance_rate: 92, // Default mock rate
            total_tasks_completed: 0,
            total_tasks_assigned: 0,
            current_active_tasks: 0,
            created_at: regData.created_at,
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Developer guard error:', error);
        setIsLoading(false);
      }
    };

    checkDeveloperAccess();
  }, [location.pathname, navigate]);

  // Log all developer actions
  const logAction = async (action: string, details: Record<string, any> = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action,
        module: 'developer',
        role: 'developer',
        meta_json: {
          ...details,
          timestamp: new Date().toISOString(),
          developer_id: developerProfile?.developer_id,
        }
      });
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  };

  return {
    isLoading,
    developerProfile,
    isBlocked,
    blockReason,
    logAction,
    BLOCKED_ROUTES,
  };
}

// Hook for checking if developer can perform specific actions
export function useDeveloperPermissions() {
  const canAcceptTask = true;
  const canUpdateStatus = true;
  const canAddNotes = true;
  const canUploadFiles = true;
  
  // NOT ALLOWED actions
  const canReassignTask = false;
  const canChangeDeadline = false;
  const canDeleteTask = false;
  const canAccessAdmin = false;
  const canAccessFinance = false;
  const canAccessWallet = false;
  const canInitiateSafeAssist = false;
  const canAssistUsers = false;
  const canAccessPricing = false;
  const canAccessDemoControl = false;

  return {
    // Allowed
    canAcceptTask,
    canUpdateStatus,
    canAddNotes,
    canUploadFiles,
    // Not Allowed
    canReassignTask,
    canChangeDeadline,
    canDeleteTask,
    canAccessAdmin,
    canAccessFinance,
    canAccessWallet,
    canInitiateSafeAssist,
    canAssistUsers,
    canAccessPricing,
    canAccessDemoControl,
  };
}
