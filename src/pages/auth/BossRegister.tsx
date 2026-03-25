import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { 
  Mail, Lock, ArrowRight, Eye, EyeOff, Shield, User, Phone,
  Crown, CheckCircle2, Fingerprint, KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters');
const phoneSchema = z.string().min(10, 'Phone must be at least 10 digits');

// Secret access code for Boss registration (in production, this should be more secure)
const BOSS_ACCESS_CODE = 'BOSS2024SECURE';

const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  const canvasData = canvas.toDataURL();
  
  return btoa([
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasData.slice(0, 50)
  ].join('|')).slice(0, 32);
};

const BossRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accessCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'access' | 'register' | 'success'>('access');
  const [deviceFingerprint, setDeviceFingerprint] = useState('');
  
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setDeviceFingerprint(generateDeviceFingerprint());
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/super-admin-system/role-switch?role=boss_owner');
    }
  }, [user, navigate]);

  const validateAccessCode = () => {
    if (formData.accessCode !== BOSS_ACCESS_CODE) {
      toast.error('Invalid Access Code');
      return false;
    }
    return true;
  };

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAccessCode()) {
      setStep('register');
      toast.success('Access Granted - Proceed with Registration');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const nameResult = nameSchema.safeParse(formData.name);
    if (!nameResult.success) {
      newErrors.name = nameResult.error.errors[0].message;
    }

    const emailResult = emailSchema.safeParse(formData.email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const phoneResult = phoneSchema.safeParse(formData.phone);
    if (!phoneResult.success) {
      newErrors.phone = phoneResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(formData.password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Log registration attempt
      await supabase.from('audit_logs').insert({
        user_id: null,
        role: 'boss_owner',
        module: 'boss_registration',
        action: 'boss_register_attempt',
        meta_json: { 
          email: formData.email,
          name: formData.name,
          device_fingerprint: deviceFingerprint,
          timestamp: new Date().toISOString()
        }
      });

      // Sign up the user with correct parameters: email, password, role, fullName
      const { error: signUpError } = await signUp(
        formData.email, 
        formData.password,
        'boss_owner' as any,
        formData.name
      );
      
      if (signUpError) {
        toast.error(signUpError.message || 'Registration failed');
        await supabase.from('audit_logs').insert({
          user_id: null,
          role: 'boss_owner',
          module: 'boss_registration',
          action: 'boss_register_failed',
          meta_json: { email: formData.email, error: signUpError.message }
        });
        setLoading(false);
        return;
      }

      // Get the newly created user
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        // Assign boss_owner role
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userData.user.id,
            role: 'boss_owner' as any,
            approval_status: 'approved'
          }, { onConflict: 'user_id' });

        if (roleError) {
          console.error('Role assignment error:', roleError);
        }

        // Create profile with correct schema
        await supabase.from('profiles').upsert({
          user_id: userData.user.id,
          full_name: formData.name,
          phone: formData.phone,
          email: formData.email
        }, { onConflict: 'user_id' });

        // Log successful registration
        await supabase.from('audit_logs').insert({
          user_id: userData.user.id,
          role: 'boss_owner',
          module: 'boss_registration',
          action: 'boss_register_success',
          meta_json: { 
            email: formData.email,
            name: formData.name,
            device_fingerprint: deviceFingerprint
          }
        });
      }

      setStep('success');
      toast.success('Boss Account Created Successfully!');
      
      // Redirect after success
      setTimeout(() => {
        navigate('/super-admin-system/role-switch?role=boss_owner');
      }, 2000);
      
    } catch (err) {
      toast.error('Registration Failed - Please try again');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950/30 via-zinc-950 to-orange-950/20 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-zinc-900/80 border-amber-500/30 backdrop-blur-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mb-4"
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Boss / Owner Registration
            </h1>
            <p className="text-zinc-400 text-sm mt-2">
              {step === 'access' ? 'Enter Access Code to Continue' : 
               step === 'register' ? 'Create Your Boss Account' : 
               'Registration Complete'}
            </p>
          </div>

          {/* Access Code Step */}
          {step === 'access' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleAccessSubmit}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label className="text-amber-400 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  Access Code
                </Label>
                <Input
                  type="password"
                  value={formData.accessCode}
                  onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                  placeholder="Enter secret access code"
                  className="bg-zinc-800/50 border-amber-500/30 text-white placeholder:text-zinc-500"
                />
                <p className="text-xs text-zinc-500">
                  Contact Super Admin for access code
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                Verify Access
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/boss-fortress')}
                  className="text-amber-400 text-sm hover:underline"
                >
                  Already have an account? Login
                </button>
              </div>
            </motion.form>
          )}

          {/* Registration Step */}
          {step === 'register' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-amber-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-zinc-800/50 border-amber-500/30 text-white placeholder:text-zinc-500"
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-amber-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="bg-zinc-800/50 border-amber-500/30 text-white placeholder:text-zinc-500"
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-amber-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91-XXXXXXXXXX"
                  className="bg-zinc-800/50 border-amber-500/30 text-white placeholder:text-zinc-500"
                />
                {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-amber-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="bg-zinc-800/50 border-amber-500/30 text-white placeholder:text-zinc-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="text-amber-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    className="bg-zinc-800/50 border-amber-500/30 text-white placeholder:text-zinc-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
              </div>

              {/* Device Info */}
              <div className="bg-zinc-800/30 rounded-lg p-3 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-400 text-xs mb-2">
                  <Fingerprint className="w-4 h-4" />
                  Device Fingerprint
                </div>
                <p className="text-zinc-500 text-xs font-mono truncate">{deviceFingerprint}</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Boss Account
                    <Crown className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.form>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
              <p className="text-zinc-400 text-sm">
                Redirecting to Boss Dashboard...
              </p>
            </motion.div>
          )}
        </Card>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-zinc-500 text-xs flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" />
            256-bit SSL Encrypted • Device Verified • Audit Logged
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BossRegister;
