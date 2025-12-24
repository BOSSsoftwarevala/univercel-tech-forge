// Security utilities for the SaaS system
import { supabase } from '@/integrations/supabase/client';

// Rate limiting store (in-memory for client-side)
const loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Brute-force protection
export function checkBruteForce(identifier: string): { allowed: boolean; remainingAttempts: number; lockoutUntil?: Date } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);
  
  if (!record) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }
  
  // Check if lockout period has passed
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    const lockoutEnd = record.lastAttempt + LOCKOUT_DURATION;
    if (now < lockoutEnd) {
      return { 
        allowed: false, 
        remainingAttempts: 0, 
        lockoutUntil: new Date(lockoutEnd) 
      };
    }
    // Reset after lockout
    loginAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }
  
  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - record.count };
}

export function recordLoginAttempt(identifier: string, success: boolean): void {
  if (success) {
    loginAttempts.delete(identifier);
    return;
  }
  
  const record = loginAttempts.get(identifier);
  if (record) {
    record.count++;
    record.lastAttempt = Date.now();
  } else {
    loginAttempts.set(identifier, { count: 1, lastAttempt: Date.now() });
  }
}

// Session security
export function getSessionExpiry(): number {
  // 4 hours for regular users, 24 hours for admins
  return 4 * 60 * 60 * 1000;
}

export function isSessionExpired(sessionStart: Date): boolean {
  return Date.now() - sessionStart.getTime() > getSessionExpiry();
}

// Device fingerprinting
export function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    (navigator as any).deviceMemory || 'unknown',
  ];
  
  // Simple hash
  const str = components.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Copy/Screenshot protection (basic)
export function enableCopyProtection(): void {
  document.addEventListener('copy', (e) => {
    const selection = document.getSelection()?.toString() || '';
    // Allow copying of small selections (likely intended)
    if (selection.length > 100) {
      e.preventDefault();
      console.warn('Copy attempt blocked');
      logSecurityEvent('copy_attempt', { length: selection.length });
    }
  });
  
  document.addEventListener('contextmenu', (e) => {
    // Allow in dev mode
    if (import.meta.env.DEV) return;
    
    const target = e.target as HTMLElement;
    if (!target.closest('input, textarea, [contenteditable]')) {
      e.preventDefault();
    }
  });
}

// Keyboard shortcut blocking (dev tools, print screen)
export function blockDevTools(): void {
  if (import.meta.env.DEV) return;
  
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
    }
    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
    }
    // Print Screen
    if (e.key === 'PrintScreen') {
      logSecurityEvent('screenshot_attempt', {});
    }
  });
}

// Log security events
export async function logSecurityEvent(
  eventType: string, 
  details: Record<string, any>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Log to audit_logs table
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      module: 'security',
      action: eventType,
      meta_json: {
        ...details,
        device_fingerprint: generateDeviceFingerprint(),
      }
    });
  } catch (err) {
    console.error('Failed to log security event:', err);
  }
}

// URL access protection - check if user can access route
export function canAccessRoute(
  pathname: string, 
  userRole: string | null, 
  isApproved: boolean
): boolean {
  // Public routes
  const publicRoutes = ['/auth', '/login', '/register', '/demos/public', '/pending-approval'];
  if (publicRoutes.some(r => pathname.startsWith(r))) {
    return true;
  }
  
  // No role = no access to protected routes
  if (!userRole) return false;
  
  // Master has full access
  if (userRole === 'master') return true;
  
  // Super admin has most access
  if (userRole === 'super_admin' && isApproved) {
    // Cannot access master-only routes
    return !pathname.startsWith('/master-admin');
  }
  
  // Other roles need approval
  if (!isApproved) return false;
  
  // Role-specific route checking
  const roleRouteMap: Record<string, string[]> = {
    demo_manager: ['/demo-manager', '/demos', '/api'],
    developer: ['/developer', '/tasks'],
    franchise: ['/franchise', '/leads', '/resellers'],
    reseller: ['/reseller', '/leads', '/demos'],
    client: ['/demos/public'],
    // Add more role-route mappings
  };
  
  const allowedRoutes = roleRouteMap[userRole] || [];
  return allowedRoutes.some(r => pathname.startsWith(r));
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters required');
  
  if (password.length >= 12) score++;
  
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');
  
  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');
  
  return { score, feedback };
}

// Permission matrix
export const PERMISSION_MATRIX: Record<string, Record<string, boolean>> = {
  master: {
    view_all: true,
    edit_all: true,
    delete_all: true,
    force_logout: true,
    approve_users: true,
    view_master_logs: true,
    manage_roles: true,
  },
  super_admin: {
    view_all: true,
    edit_all: true,
    delete_all: true,
    force_logout: false,
    approve_users: true,
    view_master_logs: false,
    manage_roles: true,
  },
  demo_manager: {
    view_demos: true,
    edit_demos: true,
    delete_demos: true,
    view_demo_logs: true,
    manage_demo_alerts: true,
    force_logout: false,
    approve_users: false,
  },
  developer: {
    view_tasks: true,
    edit_own_tasks: true,
    view_timer: true,
    view_wallet: true,
    force_logout: false,
    approve_users: false,
  },
  franchise: {
    view_leads: true,
    manage_resellers: true,
    view_reports: true,
    force_logout: false,
    approve_users: false,
  },
  reseller: {
    view_leads: true,
    manage_clients: true,
    view_reports: true,
    force_logout: false,
    approve_users: false,
  },
  prime: {
    view_demos: true,
    access_dedicated_support: true,
    priority_access: true,
    force_logout: false,
  },
  influencer: {
    view_campaigns: true,
    access_links: true,
    view_earnings: true,
    force_logout: false,
  },
  client: {
    view_demos: true,
    copy_demos: false,
    delete_demos: false,
    force_logout: false,
  },
  client_success: {
    view_clients: true,
    manage_cases: true,
    view_feedback: true,
    force_logout: false,
  },
  finance_manager: {
    view_wallets: true,
    manage_transactions: true,
    view_reports: true,
    force_logout: false,
  },
  ai_manager: {
    view_ai_usage: true,
    manage_ai_limits: true,
    view_ai_logs: true,
    force_logout: false,
  },
};

export function hasPermission(role: string | null, permission: string): boolean {
  if (!role) return false;
  return PERMISSION_MATRIX[role]?.[permission] ?? false;
}
