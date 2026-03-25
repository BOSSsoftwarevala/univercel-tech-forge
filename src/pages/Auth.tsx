import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { 
  Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, ArrowLeft,
  Fingerprint, Shield, Smartphone, TrendingUp, Globe, Rocket, 
  DollarSign, Users, Award, Zap, Building2, Megaphone
} from 'lucide-react';
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

const leftCards = [
  {
    icon: Building2,
    title: 'Own a Franchise',
    desc: 'Launch your territory. Full support, proven model, zero guesswork.',
    gradient: 'from-teal-500 to-cyan-400',
    delay: 0.1,
  },
  {
    icon: Megaphone,
    title: 'Become an Influencer',
    desc: 'Monetize your audience. Earn per referral with transparent tracking.',
    gradient: 'from-violet-500 to-purple-400',
    delay: 0.2,
  },
  {
    icon: TrendingUp,
    title: 'Reseller Program',
    desc: 'White-label our products. Set your margins, keep 100% profits.',
    gradient: 'from-amber-500 to-orange-400',
    delay: 0.3,
  },
];

const rightCards = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'Bank-grade encryption, 2FA, biometric auth & real-time monitoring.',
    gradient: 'from-emerald-500 to-green-400',
    delay: 0.15,
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: '190+ countries supported. Multi-currency, multi-language ready.',
    gradient: 'from-blue-500 to-indigo-400',
    delay: 0.25,
  },
  {
    icon: Rocket,
    title: 'AI-Powered Growth',
    desc: 'Smart lead scoring, auto-assignment & predictive analytics built-in.',
    gradient: 'from-rose-500 to-pink-400',
    delay: 0.35,
  },
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
    if (user) navigate('/dashboard');
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
          toast.error(error.message.includes('Invalid login credentials') ? 'Invalid email or password' : error.message);
        } else {
          showWelcomeBack(email.split('@')[0], 'default', 'SV-' + Math.random().toString(36).substring(2, 6).toUpperCase());
          setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
        }
      } else {
        const { error } = await signUp(email, password, selectedRole, fullName);
        if (error) {
          toast.error(error.message.includes('already registered') ? 'This email is already registered.' : error.message);
        } else {
          showWelcome(fullName || email.split('@')[0], selectedRole);
          setTimeout(() => navigate('/dashboard', { replace: true }), 4000);
        }
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = () => {
    toast.info('Biometric authentication requires the mobile app. Download from your app store.');
  };

  const handle2FA = () => {
    toast.info('Two-factor authentication can be enabled after login from Security Settings.');
  };

  const SideCard = ({ card, index }: { card: typeof leftCards[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: index < 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: card.delay }}
      className="group relative overflow-hidden rounded-xl p-4 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.8)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
          <card.icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: 'hsl(210, 40%, 20%)' }}>
            {card.title}
          </h3>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'hsl(210, 15%, 50%)' }}>
            {card.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsl(180, 25%, 92%) 0%, hsl(200, 30%, 95%) 50%, hsl(180, 20%, 90%) 100%)'
    }}>
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, hsl(195, 60%, 70%), transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, hsl(260, 50%, 75%), transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, hsl(180, 40%, 70%), transparent)' }} />
      </div>

      {/* Three Column Layout */}
      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_420px_1fr] gap-6 items-center">
        
        {/* Left Side - Opportunity Cards */}
        <div className="hidden lg:flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-2"
          >
            <h2 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 25%)' }}>
              Grow With Us
            </h2>
            <p className="text-xs" style={{ color: 'hsl(210, 15%, 50%)' }}>
              Multiple ways to build your business
            </p>
          </motion.div>
          {leftCards.map((card, i) => (
            <SideCard key={card.title} card={card} index={-1} />
          ))}
          
          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-2 mt-2"
          >
            {[
              { val: '12K+', label: 'Partners' },
              { val: '190+', label: 'Countries' },
              { val: '₹2Cr+', label: 'Paid Out' },
            ].map(s => (
              <div key={s.label} className="text-center rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <p className="font-bold text-base" style={{ color: 'hsl(195, 60%, 45%)' }}>{s.val}</p>
                <p className="text-[10px] font-medium" style={{ color: 'hsl(210, 15%, 50%)' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Center - Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-sm p-7 rounded-2xl shadow-xl shadow-black/5 border border-white/60">
            <LoginMascot isPasswordFocused={isPasswordFocused} emailLength={email.length} />

            {/* Toggle */}
            <div className="flex rounded-lg p-1 mb-5" style={{ background: 'hsl(200, 30%, 95%)' }}>
              {['Log in', 'Sign Up'].map((label, idx) => {
                const active = idx === 0 ? isLogin : !isLogin;
                return (
                  <button
                    key={label}
                    onClick={() => setIsLogin(idx === 0)}
                    className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${active ? 'text-white shadow-md' : ''}`}
                    style={active ? { background: 'hsl(195, 60%, 55%)' } : { color: 'hsl(200, 20%, 50%)' }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm font-semibold" style={{ color: 'hsl(200, 50%, 35%)' }}>Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(200, 30%, 65%)' }} />
                        <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name"
                          className="pl-10 h-11 rounded-lg border-2 bg-white/70 focus:ring-0 transition-colors"
                          style={{ borderColor: 'hsl(200, 40%, 85%)' }}
                          onFocus={(e) => e.target.style.borderColor = 'hsl(195, 60%, 55%)'}
                          onBlur={(e) => e.target.style.borderColor = 'hsl(200, 40%, 85%)'}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold" style={{ color: 'hsl(200, 50%, 35%)' }}>Select Your Role</Label>
                      <div className="grid gap-1.5 max-h-44 overflow-y-auto pr-1">
                        {roleOptions.map((role) => (
                          <motion.button key={role.value} type="button" onClick={() => setSelectedRole(role.value)}
                            className="flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all text-left"
                            style={{
                              borderColor: selectedRole === role.value ? 'hsl(195, 60%, 55%)' : 'hsl(200, 30%, 90%)',
                              background: selectedRole === role.value ? 'hsl(195, 60%, 96%)' : 'white',
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-lg">{role.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm" style={{ color: 'hsl(200, 40%, 25%)' }}>{role.label}</p>
                              <p className="text-[11px] truncate" style={{ color: 'hsl(200, 15%, 55%)' }}>{role.description}</p>
                            </div>
                            {selectedRole === role.value && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'hsl(195, 60%, 50%)' }} />}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold" style={{ color: 'hsl(200, 50%, 35%)' }}>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(200, 30%, 65%)' }} />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com"
                    className="pl-10 h-11 rounded-lg border-2 bg-white/70 focus:ring-0 transition-colors"
                    style={{ borderColor: 'hsl(200, 40%, 85%)' }}
                    onFocus={(e) => { setIsPasswordFocused(false); e.target.style.borderColor = 'hsl(195, 60%, 55%)'; }}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(200, 40%, 85%)'}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold" style={{ color: 'hsl(200, 50%, 35%)' }}>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(200, 30%, 65%)' }} />
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="pl-10 pr-10 h-11 rounded-lg border-2 bg-white/70 focus:ring-0 transition-colors"
                    style={{ borderColor: 'hsl(200, 40%, 85%)' }}
                    onFocus={(e) => { setIsPasswordFocused(true); e.target.style.borderColor = 'hsl(195, 60%, 55%)'; }}
                    onBlur={(e) => { setIsPasswordFocused(false); e.target.style.borderColor = 'hsl(200, 40%, 85%)'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'hsl(200, 30%, 65%)' }}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" disabled={loading}
                className="w-full h-11 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-sm border-0"
                style={{ background: 'linear-gradient(135deg, hsl(195, 60%, 55%) 0%, hsl(195, 55%, 48%) 100%)' }}>
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

            {/* 2FA & Biometric Section */}
            {isLogin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <div className="relative flex items-center my-3">
                  <div className="flex-1 h-px" style={{ background: 'hsl(200, 20%, 88%)' }} />
                  <span className="px-3 text-[11px] font-medium" style={{ color: 'hsl(200, 15%, 55%)' }}>or continue with</span>
                  <div className="flex-1 h-px" style={{ background: 'hsl(200, 20%, 88%)' }} />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleBiometricAuth}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ 
                      borderColor: 'hsl(200, 40%, 85%)', 
                      background: 'hsl(200, 40%, 97%)',
                    }}
                  >
                    <Fingerprint className="w-4 h-4" style={{ color: 'hsl(195, 60%, 45%)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'hsl(200, 40%, 30%)' }}>Biometric</span>
                  </button>
                  <button
                    onClick={handle2FA}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ 
                      borderColor: 'hsl(200, 40%, 85%)', 
                      background: 'hsl(200, 40%, 97%)',
                    }}
                  >
                    <Smartphone className="w-4 h-4" style={{ color: 'hsl(260, 50%, 55%)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'hsl(200, 40%, 30%)' }}>2FA Code</span>
                  </button>
                </div>
              </motion.div>
            )}

            {isLogin && (
              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-xs hover:underline" style={{ color: 'hsl(195, 60%, 45%)' }}>
                  Forgot your password?
                </Link>
              </div>
            )}

            <p className="text-center text-xs mt-3" style={{ color: 'hsl(200, 15%, 55%)' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="font-semibold hover:underline" style={{ color: 'hsl(195, 60%, 45%)' }}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>

            <div className="text-center mt-3">
              <Link to="/" className="text-xs inline-flex items-center gap-1 hover:underline" style={{ color: 'hsl(200, 15%, 55%)' }}>
                <ArrowLeft className="w-3 h-3" /> Back to Home
              </Link>
            </div>
          </div>

          <p className="text-center text-[10px] mt-4" style={{ color: 'hsl(200, 15%, 60%)' }}>
            Powered by <span className="font-semibold">SOFTWARE VALA</span> · Protected by 256-bit encryption
          </p>
        </motion.div>

        {/* Right Side - Feature Cards */}
        <div className="hidden lg:flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-2"
          >
            <h2 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 25%)' }}>
              Why Software Vala?
            </h2>
            <p className="text-xs" style={{ color: 'hsl(210, 15%, 50%)' }}>
              Built for scale, designed for trust
            </p>
          </motion.div>
          {rightCards.map((card, i) => (
            <SideCard key={card.title} card={card} index={1} />
          ))}

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 mt-2 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)' }}
          >
            <Shield className="w-8 h-8 shrink-0" style={{ color: 'hsl(195, 60%, 50%)' }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: 'hsl(210, 40%, 20%)' }}>
                SOC 2 Compliant · GDPR Ready
              </p>
              <p className="text-[10px]" style={{ color: 'hsl(210, 15%, 50%)' }}>
                Your data is encrypted, audited & never shared with third parties
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
