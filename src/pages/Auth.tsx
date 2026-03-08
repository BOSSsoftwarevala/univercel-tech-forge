import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { useAnimationContext } from '@/contexts/AnimationContext';
import LoginMascot from '@/components/auth/LoginMascot';

type AppRole = Database['public']['Enums']['app_role'];

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const roleOptions: { value: AppRole; label: string; description: string; icon: string }[] = [
  { value: 'user' as AppRole, label: 'User', description: 'Browse demos and purchase products', icon: '👤' },
  { value: 'prime', label: 'Prime User', description: 'Premium client with priority access', icon: '⭐' },
  { value: 'developer', label: 'Developer', description: 'Join as a developer to work on tasks', icon: '💻' },
  { value: 'franchise', label: 'Franchise', description: 'Become a franchise partner', icon: '🏢' },
  { value: 'reseller', label: 'Reseller', description: 'Start reselling our products', icon: '🤝' },
  { value: 'influencer', label: 'Influencer', description: 'Promote and earn commissions', icon: '📢' },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('user' as AppRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { showWelcome, showWelcomeBack } = useAnimationContext();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    if (!isLogin && !fullName.trim()) newErrors.name = 'Full name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          showWelcomeBack(email.split('@')[0], 'default', 'SV-' + Math.random().toString(36).substring(2, 6).toUpperCase());
          setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
        }
      } else {
        const { error } = await signUp(email, password, selectedRole, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please login instead.');
          } else {
            toast.error(error.message);
          }
        } else {
          showWelcome(fullName || email.split('@')[0], selectedRole);
          setTimeout(() => navigate('/dashboard', { replace: true }), 4000);
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, hsl(180, 25%, 92%) 0%, hsl(200, 30%, 95%) 50%, hsl(180, 20%, 90%) 100%)'
    }}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(200, 40%, 88%) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(180, 30%, 88%) 0%, transparent 50%)'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Auth Card */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-black/5 border border-white/60">
          {/* Mascot */}
          <LoginMascot isPasswordFocused={isPasswordFocused} emailLength={email.length} />

          {/* Toggle */}
          <div className="flex rounded-lg p-1 mb-6" style={{ background: 'hsl(200, 30%, 95%)' }}>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
                isLogin
                  ? 'text-white shadow-md'
                  : 'hover:text-foreground'
              }`}
              style={isLogin ? { background: 'hsl(195, 60%, 55%)' } : { color: 'hsl(200, 20%, 50%)' }}
            >
              Log in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
                !isLogin
                  ? 'text-white shadow-md'
                  : 'hover:text-foreground'
              }`}
              style={!isLogin ? { background: 'hsl(195, 60%, 55%)' } : { color: 'hsl(200, 20%, 50%)' }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold" style={{ color: 'hsl(200, 50%, 35%)' }}>
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(200, 30%, 65%)' }} />
                      <Input
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="pl-10 h-12 rounded-lg border-2 bg-white/70 focus:ring-0 transition-colors"
                        style={{ borderColor: 'hsl(200, 40%, 85%)', outline: 'none' }}
                        onFocus={(e) => { e.target.style.borderColor = 'hsl(195, 60%, 55%)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'hsl(200, 40%, 85%)'; }}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold" style={{ color: 'hsl(200, 50%, 35%)' }}>Select Your Role</Label>
                    <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
                      {roleOptions.map((role) => (
                        <motion.button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left"
                          style={{
                            borderColor: selectedRole === role.value ? 'hsl(195, 60%, 55%)' : 'hsl(200, 30%, 90%)',
                            background: selectedRole === role.value ? 'hsl(195, 60%, 96%)' : 'white',
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-xl">{role.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm" style={{ color: 'hsl(200, 40%, 25%)' }}>{role.label}</p>
                            <p className="text-xs" style={{ color: 'hsl(200, 15%, 55%)' }}>{role.description}</p>
                          </div>
                          {selectedRole === role.value && (
                            <CheckCircle2 className="w-5 h-5" style={{ color: 'hsl(195, 60%, 50%)' }} />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold" style={{ color: 'hsl(200, 50%, 35%)' }}>
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(200, 30%, 65%)' }} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="pl-10 h-12 rounded-lg border-2 bg-white/70 focus:ring-0 transition-colors"
                  style={{ borderColor: 'hsl(200, 40%, 85%)' }}
                  onFocus={(e) => { setIsPasswordFocused(false); e.target.style.borderColor = 'hsl(195, 60%, 55%)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'hsl(200, 40%, 85%)'; }}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold" style={{ color: 'hsl(200, 50%, 35%)' }}>
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(200, 30%, 65%)' }} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 rounded-lg border-2 bg-white/70 focus:ring-0 transition-colors"
                  style={{ borderColor: 'hsl(200, 40%, 85%)' }}
                  onFocus={(e) => { setIsPasswordFocused(true); e.target.style.borderColor = 'hsl(195, 60%, 55%)'; }}
                  onBlur={(e) => { setIsPasswordFocused(false); e.target.style.borderColor = 'hsl(200, 40%, 85%)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'hsl(200, 30%, 65%)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-base border-0"
              style={{ 
                background: 'linear-gradient(135deg, hsl(195, 60%, 55%) 0%, hsl(195, 55%, 48%) 100%)',
              }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLogin ? 'Log in' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {isLogin && (
            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-sm hover:underline" style={{ color: 'hsl(195, 60%, 45%)' }}>
                Forgot your password?
              </Link>
            </div>
          )}

          <p className="text-center text-sm mt-4" style={{ color: 'hsl(200, 15%, 55%)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold hover:underline"
              style={{ color: 'hsl(195, 60%, 45%)' }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <div className="text-center mt-4">
            <Link to="/" className="text-sm inline-flex items-center gap-1 hover:underline" style={{ color: 'hsl(200, 15%, 55%)' }}>
              <ArrowLeft className="w-3 h-3" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Branding */}
        <p className="text-center text-xs mt-6" style={{ color: 'hsl(200, 15%, 60%)' }}>
          Powered by <span className="font-semibold">SOFTWARE VALA</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
