/**
 * ROLE-BASED LOGIN PAGE
 * ======================
 * • Email + Password login
 * • Role Selector (visible before login)
 * • Direct dashboard routing based on selected role
 * • High Alert Mode for Boss/Owner
 * • Silent notifications to Boss for other role logins
 * • Enterprise dark navy theme
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Shield, 
  Loader2, AlertCircle, CheckCircle2, Zap,
  Crown, User, Globe, Server, Bot, Package, Users,
  Briefcase, HeadphonesIcon, Store, UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import {
  clearRedirectAfterLogin,
  getDefaultDashboardRoute,
  getRedirectAfterLogin,
  getRedirectRoleAfterLogin,
} from '@/hooks/useProtectedActionHandler';

type AppRole = Database['public']['Enums']['app_role'];

// ============================================
// THEME COLORS (Dark Navy - Locked)
// ============================================
const THEME = {
  bg: '#0a1628',
  bgGradient: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)',
  cardBg: 'rgba(13, 27, 42, 0.95)',
  border: '#1e3a5f',
  accent: '#2563eb',
  accentGlow: 'rgba(37, 99, 235, 0.3)',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
};

// ============================================
// ROLE OPTIONS (All Enterprise Roles)
// ============================================
interface RoleOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  tier: 'authority' | 'management' | 'partner' | 'staff';
}

const ROLE_OPTIONS: RoleOption[] = [
  // Authority Tier
  { value: 'boss_owner', label: 'Boss / Owner', icon: <Crown className="w-4 h-4" />, tier: 'authority' },
  { value: 'ceo', label: 'CEO', icon: <Briefcase className="w-4 h-4" />, tier: 'authority' },
  
  // Management Tier
  { value: 'country_head', label: 'Country Head', icon: <Globe className="w-4 h-4" />, tier: 'management' },
  { value: 'server_manager', label: 'Server Manager', icon: <Server className="w-4 h-4" />, tier: 'management' },
  { value: 'ai_manager', label: 'Vala AI', icon: <Bot className="w-4 h-4" />, tier: 'management' },
  { value: 'product_demo_manager', label: 'Product Manager', icon: <Package className="w-4 h-4" />, tier: 'management' },
  { value: 'lead_manager', label: 'Sales Manager', icon: <Users className="w-4 h-4" />, tier: 'management' },
  { value: 'support', label: 'Support', icon: <HeadphonesIcon className="w-4 h-4" />, tier: 'management' },
  
  // Partner Tier
  { value: 'franchise', label: 'Franchise', icon: <Store className="w-4 h-4" />, tier: 'partner' },
  { value: 'reseller', label: 'Reseller', icon: <Users className="w-4 h-4" />, tier: 'partner' },
  
  // Staff Tier
  { value: 'developer', label: 'Staff / Employee', icon: <UserCircle className="w-4 h-4" />, tier: 'staff' },
];

// ============================================
// ROLE → DASHBOARD ROUTING
// ============================================
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  boss_owner: '/super-admin-system/role-switch?role=boss_owner',
  master: '/super-admin-system/role-switch?role=boss_owner',
  super_admin: '/super-admin-system/role-switch?role=boss_owner',
  ceo: '/super-admin-system/role-switch?role=ceo',
  country_head: '/super-admin-system/role-switch?role=country_head',
  area_manager: '/super-admin-system/role-switch?role=country_head',
  server_manager: '/super-admin-system/role-switch?role=server_manager',
  ai_manager: '/super-admin-system/role-switch?role=ai_manager',
  product_demo_manager: '/super-admin-system/role-switch?role=product_demo_manager',
  lead_manager: '/super-admin-system/role-switch?role=lead_manager',
  marketing_manager: '/super-admin-system/role-switch?role=marketing_manager',
  support: '/super-admin-system/role-switch?role=support',
  franchise: '/franchise',
  reseller: '/reseller',
  developer: '/developer',
  influencer: '/influencer',
  prime: '/prime',
};

// ============================================
// VALIDATION SCHEMA
// ============================================
const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ============================================
// ERROR MESSAGE MAPPING
// ============================================
const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Invalid credentials. Please try again.',
  'Email not confirmed': 'Please verify your email first.',
  'Too many requests': 'Too many attempts. Please wait.',
  'User not found': 'Account not found.',
  default: 'Something went wrong. Please try again.',
};

const getErrorMessage = (message: string): string => {
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return ERROR_MESSAGES.default;
};

// ============================================
// MAIN COMPONENT
// ============================================
const RoleBasedLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const lockIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasHandledRedirectRef = useRef(false);

  const navigate = useNavigate();
  const { signIn, user, loading: authLoading, generateDeviceFingerprint, switchRole, userRole } = useAuth();

  // ============================================
  // REDIRECT IF ALREADY LOGGED IN
  // ============================================
  useEffect(() => {
    if (authLoading || !user || hasHandledRedirectRef.current) {
      return;
    }

    hasHandledRedirectRef.current = true;

    const applyRedirect = async () => {
      const redirectPath = getRedirectAfterLogin();
      const redirectRole = getRedirectRoleAfterLogin();
      const preferredRole = (selectedRole || redirectRole) as AppRole | null;

      if (preferredRole) {
        const switched = await switchRole(preferredRole);
        if (!switched && redirectPath) {
          toast.error('Requested panel is not available for this account.');
        }
      }

      const targetRoute = redirectPath || getDefaultDashboardRoute(preferredRole || userRole);
      clearRedirectAfterLogin();
      navigate(targetRoute, { replace: true });
    };

    void applyRedirect();
  }, [authLoading, navigate, selectedRole, switchRole, user, userRole]);

  // ============================================
  // RATE LIMITING: Lock after 5 failed attempts
  // ============================================
  useEffect(() => {
    if (failedAttempts >= 5 && !isLocked) {
      setIsLocked(true);
      setLockTimer(60);
      
      lockIntervalRef.current = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            if (lockIntervalRef.current) {
              clearInterval(lockIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (lockIntervalRef.current) {
        clearInterval(lockIntervalRef.current);
      }
    };
  }, [failedAttempts, isLocked]);

  // ============================================
  // HIGH ALERT MODE FOR BOSS/OWNER
  // ============================================
  const triggerHighAlertMode = async () => {
    // Show high authority notification
    toast.success('🔒 High Authority Login Detected', {
      description: 'Full system access enabled. Emergency controls active.',
      duration: 5000,
    });

    // Log high-authority login to audit
    try {
      await supabase.from('audit_logs').insert({
        action: 'HIGH_AUTHORITY_LOGIN',
        module: 'auth',
        user_id: user?.id,
        meta_json: {
          role: 'boss_owner',
          timestamp: new Date().toISOString(),
          device: navigator.userAgent,
        },
      });
    } catch (err) {
      // Silent fail for audit
    }
  };

  // ============================================
  // SILENT NOTIFICATION TO BOSS
  // ============================================
  const notifyBossOfLogin = async (role: string) => {
    try {
      await supabase.from('audit_logs').insert({
        action: 'ROLE_LOGIN_NOTIFICATION',
        module: 'auth',
        user_id: user?.id,
        meta_json: {
          role: role,
          message: `${role.replace(/_/g, ' ')} logged in — Live Access`,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      // Silent fail
    }
  };

  // ============================================
  // LOGIN HANDLER
  // ============================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Please wait ${lockTimer} seconds before trying again.`);
      return;
    }

    setError('');
    setIsLoading(true);

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const fingerprint = generateDeviceFingerprint();
      const { error: signInError } = await signIn(email, password, fingerprint);

      if (signInError) {
        setFailedAttempts((prev) => prev + 1);
        setError(getErrorMessage(signInError.message));
        setIsLoading(false);
        return;
      }

      // Success - keep single-login flow and optionally apply a preferred panel role.
      setFailedAttempts(0);

      if (selectedRole) {
        await switchRole(selectedRole as AppRole);

        const isBossRole = ['boss_owner', 'master', 'super_admin'].includes(selectedRole);
        if (isBossRole) {
          await triggerHighAlertMode();
        } else {
          await notifyBossOfLogin(selectedRole);
        }
      }
      
    } catch (err: any) {
      setFailedAttempts((prev) => prev + 1);
      setError(getErrorMessage(err?.message || 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (authLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: THEME.bgGradient }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: THEME.accent }} />
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: THEME.bgGradient }}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: THEME.accentGlow }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(34, 197, 94, 0.1)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${THEME.accent} 0%, #22c55e 100%)`,
                  boxShadow: `0 0 20px ${THEME.accentGlow}`
                }}
              >
                <Zap className="w-7 h-7" style={{ color: '#fff' }} />
              </div>
            </div>
            <div>
              <h1 className="font-mono font-bold text-2xl tracking-tight" style={{ color: THEME.text }}>
                SOFTWARE <span style={{ color: THEME.accent }}>VALA</span>
              </h1>
            </div>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 shadow-2xl"
          style={{ 
            background: THEME.cardBg, 
            border: `1px solid ${THEME.border}`,
            backdropFilter: 'blur(12px)'
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
              style={{ background: `${THEME.accent}20`, border: `1px solid ${THEME.accent}40` }}
            >
              <Shield className="w-4 h-4" style={{ color: THEME.accent }} />
              <span className="text-sm font-medium" style={{ color: THEME.accent }}>Secure Login</span>
            </div>
            <h2 className="text-xl font-semibold" style={{ color: THEME.text }}>
              Welcome Back
            </h2>
            <p className="text-sm mt-1" style={{ color: THEME.textMuted }}>
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Optional landing preference */}
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: THEME.text }}>
                Preferred Panel <span style={{ color: THEME.textMuted }}>(optional)</span>
              </Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger 
                  className="h-12 border"
                  style={{ 
                    background: THEME.bg, 
                    borderColor: selectedRole ? THEME.accent : THEME.border,
                    color: THEME.text
                  }}
                >
                  <SelectValue placeholder="Use my last active panel" />
                </SelectTrigger>
                <SelectContent 
                  className="max-h-80"
                  style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}
                >
                  {/* Authority Tier */}
                  <div className="px-2 py-1.5 text-xs font-semibold" style={{ color: THEME.warning }}>
                    Authority
                  </div>
                  {ROLE_OPTIONS.filter(r => r.tier === 'authority').map((role) => (
                    <SelectItem 
                      key={role.value} 
                      value={role.value}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: THEME.accent }}>{role.icon}</span>
                        <span style={{ color: THEME.text }}>{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}

                  {/* Management Tier */}
                  <div className="px-2 py-1.5 text-xs font-semibold mt-2" style={{ color: THEME.textMuted }}>
                    Management
                  </div>
                  {ROLE_OPTIONS.filter(r => r.tier === 'management').map((role) => (
                    <SelectItem 
                      key={role.value} 
                      value={role.value}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: THEME.accent }}>{role.icon}</span>
                        <span style={{ color: THEME.text }}>{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}

                  {/* Partner Tier */}
                  <div className="px-2 py-1.5 text-xs font-semibold mt-2" style={{ color: THEME.textMuted }}>
                    Partners
                  </div>
                  {ROLE_OPTIONS.filter(r => r.tier === 'partner').map((role) => (
                    <SelectItem 
                      key={role.value} 
                      value={role.value}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: THEME.accent }}>{role.icon}</span>
                        <span style={{ color: THEME.text }}>{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}

                  {/* Staff Tier */}
                  <div className="px-2 py-1.5 text-xs font-semibold mt-2" style={{ color: THEME.textMuted }}>
                    Staff
                  </div>
                  {ROLE_OPTIONS.filter(r => r.tier === 'staff').map((role) => (
                    <SelectItem 
                      key={role.value} 
                      value={role.value}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: THEME.accent }}>{role.icon}</span>
                        <span style={{ color: THEME.text }}>{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: THEME.text }}>Email</Label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: THEME.textMuted }} 
                />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  style={{ 
                    background: THEME.bg, 
                    borderColor: THEME.border,
                    color: THEME.text
                  }}
                  required
                  disabled={isLoading || isLocked}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium" style={{ color: THEME.text }}>Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs hover:underline"
                  style={{ color: THEME.accent }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: THEME.textMuted }} 
                />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  style={{ 
                    background: THEME.bg, 
                    borderColor: THEME.border,
                    color: THEME.text
                  }}
                  required
                  minLength={6}
                  disabled={isLoading || isLocked}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: THEME.textMuted }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg text-sm"
                  style={{ 
                    background: `${THEME.danger}15`, 
                    border: `1px solid ${THEME.danger}30`,
                    color: THEME.danger
                  }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lock Warning */}
            {isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-3 rounded-lg text-sm"
                style={{ 
                  background: `${THEME.warning}15`, 
                  border: `1px solid ${THEME.warning}30`,
                  color: THEME.warning
                }}
              >
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Too many attempts. Please wait {lockTimer}s</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full h-12 text-base font-semibold border-0"
              style={{ 
                background: `linear-gradient(135deg, ${THEME.accent} 0%, #1d4ed8 100%)`,
                color: '#fff',
                opacity: (isLoading || isLocked) ? 0.6 : 1
              }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: `1px solid ${THEME.border}` }} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2" style={{ background: THEME.cardBg, color: THEME.textMuted }}>Or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-sm" style={{ color: THEME.textMuted }}>Don't have an account? </span>
            <Link
              to="/auth"
              className="text-sm font-medium hover:underline"
              style={{ color: THEME.accent }}
            >
              Create Account
            </Link>
          </div>
        </motion.div>

        {/* Security Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-4 text-xs"
          style={{ color: THEME.textMuted }}
        >
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" style={{ color: THEME.success }} />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" style={{ color: THEME.accent }} />
            <span>Secure</span>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm transition-colors hover:underline"
            style={{ color: THEME.textMuted }}
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleBasedLogin;
