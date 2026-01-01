/**
 * Easy Auth - Simple login for users, resellers, influencers
 * No KYC required at login - collected later when needed
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EasyAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<'user' | 'reseller' | 'influencer'>('user');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Simple login - no extra checks
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        toast({
          title: "Welcome back! 🎉",
          description: "Login successful. Redirecting...",
        });

        navigate('/dashboard');
      } else {
        // Simple signup - no KYC required
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: name,
              account_type: accountType,
              kyc_completed: false, // KYC will be asked later
              onboarding_step: 'registered'
            }
          }
        });

        if (error) throw error;

        // Log the registration
        await supabase.from('audit_logs').insert({
          action: 'easy_signup',
          module: 'auth',
          meta_json: { 
            account_type: accountType,
            email: email.substring(0, 3) + '***'
          }
        });

        toast({
          title: "Account Created! 🚀",
          description: "Welcome aboard! You can complete your profile later.",
        });

        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Quick & Easy</span>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? 'Welcome Back!' : 'Get Started Free'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? 'Login with your email - no verification needed'
              : 'Create account in seconds - no KYC required now'}
          </p>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-xl"
        >
          {/* Account Type Selection (Signup only) */}
          {!isLogin && (
            <Tabs value={accountType} onValueChange={(v) => setAccountType(v as any)} className="mb-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="user" className="text-xs">
                  <User className="w-3 h-3 mr-1" /> User
                </TabsTrigger>
                <TabsTrigger value="reseller" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" /> Reseller
                </TabsTrigger>
                <TabsTrigger value="influencer" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" /> Influencer
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Name (Signup only) */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-neon-purple hover:opacity-90"
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⏳
                </motion.span>
              ) : (
                <>
                  {isLogin ? 'Login' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign up free"
                : "Already have an account? Login"}
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                No KYC needed now
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                Instant access
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="w-4 h-4 text-neon-purple" />
                Free to start
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4 text-neon-teal" />
                Complete profile later
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
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

export default EasyAuth;
