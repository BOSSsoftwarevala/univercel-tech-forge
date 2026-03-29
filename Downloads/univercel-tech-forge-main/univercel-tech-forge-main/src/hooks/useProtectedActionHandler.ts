import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { callEdgeRoute } from '@/lib/api/edge-client';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export const REDIRECT_AFTER_LOGIN_KEY = 'redirect_after_login';
export const REDIRECT_AFTER_LOGIN_ROLE_KEY = 'redirect_after_login_role';

type ProtectedActionKey = 'joinDeveloper' | 'becomeInfluencer' | 'applyForJob' | 'login' | 'bossPortal';

type ProtectedActionConfig = {
  route: string;
  label: string;
  requiresAuthOnClick?: boolean;
  requiredRoles?: AppRole[];
  upgradeRoute?: string;
  deniedMessage: string;
};

const PROTECTED_ACTIONS: Record<ProtectedActionKey, ProtectedActionConfig> = {
  joinDeveloper: {
    route: '/marketplace/developer/register',
    label: 'Join as Developer',
    deniedMessage: 'Unable to open developer registration.',
  },
  becomeInfluencer: {
    route: '/marketplace/influencer/register',
    label: 'Become Influencer',
    deniedMessage: 'Unable to open influencer registration.',
  },
  applyForJob: {
    route: '/marketplace/jobs/apply',
    label: 'Apply for Job',
    deniedMessage: 'Unable to open the job application flow.',
  },
  login: {
    route: '/login',
    requiresAuthOnClick: true,
    label: 'Login',
    deniedMessage: 'Unable to open the user dashboard.',
  },
  bossPortal: {
    route: '/dashboard/boss',
    requiresAuthOnClick: true,
    label: 'Boss Portal',
    requiredRoles: ['boss_owner', 'master', 'super_admin', 'ceo', 'admin'],
    deniedMessage: 'Boss access is restricted to approved authority roles.',
  },
};

export const setRedirectAfterLogin = (route: string, role?: AppRole | null) => {
  window.localStorage.setItem(REDIRECT_AFTER_LOGIN_KEY, route);

  if (role) {
    window.localStorage.setItem(REDIRECT_AFTER_LOGIN_ROLE_KEY, role);
    return;
  }

  window.localStorage.removeItem(REDIRECT_AFTER_LOGIN_ROLE_KEY);
};

export const getRedirectAfterLogin = () => window.localStorage.getItem(REDIRECT_AFTER_LOGIN_KEY);

export const getRedirectRoleAfterLogin = (): AppRole | null => {
  const role = window.localStorage.getItem(REDIRECT_AFTER_LOGIN_ROLE_KEY);
  return (role as AppRole | null) || null;
};

export const clearRedirectAfterLogin = () => {
  window.localStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);
  window.localStorage.removeItem(REDIRECT_AFTER_LOGIN_ROLE_KEY);
};

export const getDefaultDashboardRoute = (role?: AppRole | null) => {
  if (!role) {
    return '/dashboard/user';
  }

  if (role === 'developer') {
    return '/dashboard/developer';
  }

  if (role === 'influencer') {
    return '/dashboard/influencer';
  }

  if (role === 'admin' || role === 'super_admin') {
    return '/dashboard/admin';
  }

  if (['boss_owner', 'master', 'ceo'].includes(role)) {
    return '/dashboard/boss';
  }

  return '/dashboard/user';
};

const resolveRoleForAction = (
  requiredRoles: AppRole[] | undefined,
  activeRole: AppRole | null,
  approvedRoles: AppRole[],
  userRoles: AppRole[],
) => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return null;
  }

  if (activeRole && requiredRoles.includes(activeRole)) {
    return activeRole;
  }

  return requiredRoles.find((role) => approvedRoles.includes(role))
    || requiredRoles.find((role) => userRoles.includes(role))
    || null;
};

export const useProtectedActionHandler = () => {
  const navigate = useNavigate();
  const { user, userRole, approvedRoles, userRoles, switchRole } = useAuth();

  const handleAction = useCallback(async (actionKey: ProtectedActionKey) => {
    const config = PROTECTED_ACTIONS[actionKey];

    if (!config.requiresAuthOnClick) {
      try {
        await callEdgeRoute('api-notifications', 'create', {
          method: 'POST',
          body: {
            type: 'info',
            message: `User clicked ${config.label}`,
            event_type: 'click_action',
            action_label: config.label,
            action_url: config.route,
          },
        });
      } catch (error) {
        console.error('Failed to create action notification:', error);
      }

      navigate(config.route);
      return;
    }

    if (!user) {
      if (actionKey === 'login') {
        navigate('/login');
        return;
      }

      setRedirectAfterLogin(config.route);
      navigate('/login');
      return;
    }

    if (actionKey === 'login') {
      navigate(getDefaultDashboardRoute(userRole));
      return;
    }

    const resolvedRole = resolveRoleForAction(config.requiredRoles, userRole, approvedRoles, userRoles);
    if (config.requiredRoles && !resolvedRole) {
      toast.error(config.deniedMessage);
      if (config.upgradeRoute) {
        navigate(config.upgradeRoute);
      }
      return;
    }

    if (resolvedRole && userRole !== resolvedRole) {
      const switched = await switchRole(resolvedRole);
      if (!switched) {
        toast.error(config.deniedMessage);
        if (config.upgradeRoute) {
          navigate(config.upgradeRoute);
        }
        return;
      }
    }

    try {
      await callEdgeRoute('api-notifications', 'create', {
        method: 'POST',
        body: {
          type: 'info',
          message: `User clicked ${config.label}`,
          event_type: 'click_action',
          action_label: config.label,
          action_url: config.route,
        },
      });
    } catch (error) {
      console.error('Failed to create action notification:', error);
    }

    navigate(config.route);
  }, [approvedRoles, navigate, switchRole, user, userRole, userRoles]);

  return {
    handleAction,
  };
};