import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, Crown, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const MasterAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, user, userRole } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as master/super_admin
  useEffect(() => {
    if (user && (userRole === 'master' || userRole === 'super_admin')) {
      navigate('/super-admin');
    }
  }, [user, userRole, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error('Access Denied');
        // Log failed attempt
        await supabase.from('audit_logs').insert({
          user_id: null,
          role: null,
          module: 'security',
          action: 'master_auth_failed_attempt',
          meta_json: { email, ip: 'client' }
        });
      } else {
        // Check if user is master or super_admin
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();
        
        if (roleData?.role === 'master' || roleData?.role === 'super_admin') {
          toast.success('Welcome, Master Admin');
          navigate('/super-admin', { replace: true });
        } else {
          // Not authorized - sign out and show error
          await supabase.auth.signOut();
          toast.error('Access Denied - Unauthorized');
          // Log unauthorized attempt
          await supabase.from('audit_logs').insert({
            user_id: null,
            role: roleData?.role as any,
            module: 'security',
            action: 'master_auth_unauthorized_role',
            meta_json: { email, attempted_role: roleData?.role }
          });
        }
      }
    } catch (err) {
      toast.error('Access Denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Dark Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm"
      >
        {/* Master Logo */}
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex flex-col items-center gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-2xl shadow-amber-500/20">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-mono font-bold text-lg text-white/90 tracking-tight">
                RESTRICTED ACCESS
              </h1>
              <p className="text-xs text-white/40 font-mono">Master Control Only</p>
            </div>
          </motion.div>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider">
                Identifier
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@system.local"
                  className="pl-10 bg-zinc-950 border-zinc-800 focus:border-amber-500/50 text-white placeholder:text-zinc-600"
                  autoComplete="off"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-wider">
                Access Key
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-10 pr-10 bg-zinc-950 border-zinc-800 focus:border-amber-500/50 text-white placeholder:text-zinc-600"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-semibold py-5 mt-6 border-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Access System
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-600 text-center font-mono">
              All access attempts are logged and monitored
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MasterAuth;
