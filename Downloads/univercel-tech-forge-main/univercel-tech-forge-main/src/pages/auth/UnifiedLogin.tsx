/**
 * UNIFIED LOGIN PAGE
 * ==================
 * • Email + Password login
 * • Clean enterprise UI
 * • Role auto-detection (NO manual select)
 * • Positive-only error messages
 * • Rate limiting & security
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Shield, 
  Loader2, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMA
// ============================================
const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ============================================
// ERROR MESSAGE MAPPING (POSITIVE ONLY)
// ============================================
const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Credentials not matched. Please try again.',
  'Email not confirmed': 'Please verify your email before logging in.',
  'Too many requests': 'Too many attempts. Please wait a moment.',
  'User not found': 'Account not found. Please check your email.',
  'Invalid email or password': 'Credentials not matched. Please try again.',
  'Account suspended': 'Account temporarily restricted. Contact support.',
  'Login not authorized': 'Access pending approval. Contact support.',
  default: 'Something went wrong. Please try again.',
};

const getPositiveError = (message: string): string => {
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
const UnifiedLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const lockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const { signIn, user, loading: authLoading, generateDeviceFingerprint } = useAuth();

  // ============================================
  // REDIRECT IF ALREADY LOGGED IN
  // ============================================
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // ============================================
  // RATE LIMITING: Lock after 5 failed attempts
  // ============================================
  useEffect(() => {
    if (failedAttempts >= 5 && !isLocked) {
      setIsLocked(true);
      setLockTimer(60); // 60 second lockout
      
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
      // Generate device fingerprint
      const fingerprint = generateDeviceFingerprint();
      
      // Attempt sign in
      const { error: signInError } = await signIn(email, password, fingerprint);

      if (signInError) {
        setFailedAttempts((prev) => prev + 1);
        setError(getPositiveError(signInError.message));
        setIsLoading(false);
        return;
      }

      // Success - Dashboard will handle role routing
      setFailedAttempts(0);
      navigate('/dashboard', { replace: true });
      
    } catch (err: any) {
      setFailedAttempts((prev) => prev + 1);
      setError(getPositiveError(err?.message || 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Secure Login</span>
          </motion.div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-xl backdrop-blur-sm"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-background"
                  required
                  disabled={isLoading || isLocked}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/auth/forgot-password')}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background"
                  required
                  minLength={6}
                  disabled={isLoading || isLocked}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                  className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
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
                className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-sm text-orange-600"
              >
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Too many attempts. Please wait {lockTimer}s</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full h-12 text-base font-medium"
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
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/auth/register')}
              className="text-sm font-medium text-primary hover:underline"
            >
              Create Account
            </button>
          </div>
        </motion.div>

        {/* Security Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-primary" />
            <span>Secure</span>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UnifiedLogin;
