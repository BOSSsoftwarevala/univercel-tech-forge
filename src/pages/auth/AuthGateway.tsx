import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Crown, Building2, Store, Code2, Zap, Star, Shield, User,
  Eye, EyeOff, Fingerprint, Monitor, Lock, ArrowRight, Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_CONFIG, AppRole } from '@/types/roles';
import { toast } from 'sonner';

// Public roles that can self-register (Grade 3 Partners + Grade 4 Users)
const publicRoles: AppRole[] = ['developer', 'franchise', 'reseller', 'influencer', 'prime', 'client'];

const roleIcons: Record<string, any> = {
  super_admin: Crown,
  admin: Shield,
  developer: Code2,
  franchise: Building2,
  reseller: Store,
  influencer: Zap,
  prime: Star,
  user: User,
};

const AuthGateway = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'client' as AppRole,
    agreeTerms: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!formData.agreeTerms) {
      toast.error('Please agree to terms and conditions');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signUp(formData.email, formData.password, formData.role, formData.fullName);
      if (error) throw error;
      toast.success('Account created! Please check your email.');
      setMode('login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-graphite via-sapphire to-graphite-dark relative overflow-hidden">
        {/* Grid Lines */}
        <div className="absolute inset-0 grid-lines opacity-20" />
        
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, hsl(var(--primary) / 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary via-neon-teal to-primary/50 flex items-center justify-center mb-8 shadow-2xl"
          >
            <span className="text-5xl font-bold text-primary-foreground">SV</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-mono font-bold neon-text mb-4"
          >
            Software Vala
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-muted-foreground mb-8 max-w-md"
          >
            Enterprise SaaS Ecosystem with 21 Roles, Unlimited Possibilities
          </motion.p>
          
          {/* Feature Badges */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-3 justify-center max-w-md"
          >
            {['Fixed Price', 'No Advance', 'Lifetime Updates', 'Masked Identity'].map((badge, i) => (
              <Badge key={badge} variant="secondary" className="px-4 py-2 text-sm">
                {badge}
              </Badge>
            ))}
          </motion.div>
          
          {/* Security Indicators */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex items-center gap-6 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm">IP Bound</span>
            </div>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              <span className="text-sm">Device Lock</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span className="text-sm">Session Protected</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="glass-panel">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-mono">
                {mode === 'login' ? 'Welcome Back' : 'Join Software Vala'}
              </CardTitle>
              <CardDescription>
                {mode === 'login' 
                  ? 'Sign in to access your dashboard' 
                  : 'Create your account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'register')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        className="bg-secondary/50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => updateForm('password', e.target.value)}
                          className="bg-secondary/50 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full gap-2" disabled={loading}>
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => updateForm('fullName', e.target.value)}
                        className="bg-secondary/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="regEmail">Email</Label>
                      <Input
                        id="regEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        className="bg-secondary/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">I want to join as</Label>
                      <Select value={formData.role} onValueChange={(v) => updateForm('role', v)}>
                        <SelectTrigger className="bg-secondary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {publicRoles.map((role) => {
                            const config = ROLE_CONFIG[role];
                            const Icon = roleIcons[role] || User;
                            return (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                                  <span>{config.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="regPassword">Password</Label>
                      <Input
                        id="regPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => updateForm('password', e.target.value)}
                        className="bg-secondary/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => updateForm('confirmPassword', e.target.value)}
                        className="bg-secondary/50"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => updateForm('agreeTerms', checked)}
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms & Conditions
                        </Link>
                      </label>
                    </div>

                    <Button type="submit" className="w-full gap-2" disabled={loading}>
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Role Selection Preview */}
              {mode === 'register' && formData.role && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: ROLE_CONFIG[formData.role].color + '30' }}
                    >
                      {(() => {
                        const Icon = roleIcons[formData.role] || User;
                        return <Icon className="w-5 h-5" style={{ color: ROLE_CONFIG[formData.role].color }} />;
                      })()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{ROLE_CONFIG[formData.role].label}</p>
                      <p className="text-xs text-muted-foreground capitalize">{ROLE_CONFIG[formData.role].tier} Tier</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Bottom Links */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">← Back to Homepage</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthGateway;
